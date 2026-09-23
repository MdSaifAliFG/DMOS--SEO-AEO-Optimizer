# SEO Sensing — Security & Quality Fix Report

> **Project:** SEO Sensing (DMOS Optimizer)  
> **Status:** ✅ Complete  
> **Scope:** SEO Sensing Application Logic Only  
> **Test Results:** 98 passed / 0 failed (100% backend pass rate); Next.js 15.5 production build successful (87/87 static routes compiled)

---

## 1. Executive Summary

A comprehensive security, concurrency, and reliability overhaul of the SEO Sensing application was conducted to remediate critical defects affecting data integrity, scan stability, crawler SSRF risks, and frontend API resilience:

1. **Credit Double-Spend Elimination (P0-01):** Replaced non-atomic read-then-modify credit deductions and reservations with atomic database-level SQL updates using strict condition gates (`CreditWallet.available_credits >= amount`). Validated with multi-threaded concurrent async tests confirming zero overspend.
2. **Scan Performance & Scalability (P1-01, P1-02):** Throttled high-frequency per-page database writes from the crawler (committing progress only upon $\ge 5\%$ progress increments or $\ge 2.0$s elapsed time), and implemented a FIFO bounded sliding window (500 log entries) for scan logs, eliminating severe SQLite WAL lock contention and runaway JSON memory consumption.
3. **Scan Lifecycle Guarantees (P1-03, P1-04):** Introduced `ScanStatus.TIMED_OUT`, wrapped scan execution in a bounded timeout wrapper (`SCAN_TIMEOUT_SECONDS = 600`), and eliminated swallowed exceptions to ensure every scan deterministically reaches a terminal status (`COMPLETED`, `FAILED`, `CANCELLED`, or `TIMED_OUT`).
4. **Credit Reconciliation Correctness (P1-05):** Corrected the credit reconciliation invariant to account for active reservations (`total_wallet_credits = available_credits + reserved_credits == ledger_sum`), resolving false drift warnings on healthy in-flight scans while maintaining exact detection of real balance discrepancies.
5. **Crawler SSRF Hardening & DoS Prevention:** Replaced uninspected `follow_redirects=True` with a loop that inspects and DNS-resolves every redirect target against private, loopback, and cloud metadata (`169.254.169.254`) ranges. Implemented streaming chunked response processing capping downloaded body size at 10MB to prevent memory exhaustion.
6. **API Contract & Frontend Error Handling Alignment:** Reconciled billing schemas between backend and frontend (`cancel_subscription`, `change_plan`, `usage_summary`), preserved granular HTTP status codes (401, 403, 404, 409, 422, 429, 500, 503), and introduced network error and timeout differentiation (`isNetworkError`, `isTimeout`).

---

## 2. Remediated Issues — Deep Dive

### P0-01: Race Condition in Credit Deductions & Reservations

- **Affected Files:**
  - `backend/app/services/credit_service.py`
  - `backend/app/tests/test_credit_concurrency.py`
- **Root Cause:**
  `reserve_credits` and `deduct_atomic` followed an application-level read-then-modify pattern:
  ```python
  # Vulnerable pattern:
  wallet = await get_or_create_wallet(...)
  if wallet.available_credits < amount: return False
  wallet.available_credits -= amount
  await db.commit()
  ```
  When two concurrent asynchronous operations executed simultaneously against a wallet with 100 credits, both read `available_credits = 100`, both passed the guard condition, and both committed deductions of 80 credits, driving the available balance into a negative deficit of -60 credits (double-spend).
- **Remediation Implemented:**
  Replaced the read-modify-write pattern with atomic SQL `update()` queries executed directly at the database engine level with conditional evaluation:
  ```python
  stmt = (
      update(CreditWallet)
      .where(
          and_(
              CreditWallet.id == wallet.id,
              CreditWallet.available_credits >= amount,
          )
      )
      .values(
          available_credits=CreditWallet.available_credits - amount,
          used_credits=CreditWallet.used_credits + amount,
      )
  )
  res = await db.execute(stmt)
  if res.rowcount == 0:
      return False, None
  ```
- **Verification:**
  Created `test_concurrent_deductions_prevent_overspend` and `test_concurrent_reservations_prevent_overspend` simulating concurrent tasks competing for credits. Tested and verified that exactly 1 request succeeds, subsequent requests are cleanly rejected with `INSUFFICIENT_CREDITS`, and wallet balance remains strictly non-negative.

---

### P1-01 & P1-02: Excessive DB Operations and Unbounded Scan Logs

- **Affected Files:**
  - `backend/app/services/scan_runner.py`
  - `backend/app/tests/test_scan_lifecycle.py`
- **Root Cause:**
  During website crawling, every crawled page triggered an immediate re-fetch (`SELECT * FROM scans WHERE id = ...`) and write (`session.commit()`). For a crawl of 50–500 pages, this executed hundreds of redundant round-trips and saturated the SQLite WAL lock. Concurrently, `scan.logs` appended a new JSON log record for every page and asset without truncation, causing multi-megabyte JSON payloads to be serialized and sent to polling clients.
- **Remediation Implemented:**
  1. **Throttled Progress Commits:** Added state trackers (`_last_reported_pct`, `_last_progress_commit_time`) that commit progress to the database only when progress advances by $\ge 5\%$ or elapsed time exceeds 2.0 seconds, plus guaranteed commits at crawl completion and stage transitions.
  2. **Bounded Log Retention:** Implemented `ScanRunner.bound_logs(raw_logs, max_logs=500)` enforcing a FIFO sliding window. It preserves the first 50 bootstrap logs (target URL, config), injects a retention notice (`"Log retention limit reached; intermediate logs trimmed"`), and retains the 449 most recent operational logs.
- **Verification:**
  Tested `test_bounded_scan_logs_truncation` generating 650 log entries; confirmed output was capped at exactly 500 entries with bootstrap logs, retention notice, and recent entries preserved.

---

### P1-03 & P1-04: Scan Timeout, Zombie Crawls & Swallowed Exceptions

- **Affected Files:**
  - `backend/app/models/scan.py`
  - `backend/app/services/scan_service.py`
  - `backend/app/services/scan_runner.py`
  - `backend/app/core/config.py`
  - `backend/app/tests/test_scan_lifecycle.py`
- **Root Cause:**
  Scans lacked an overarching execution timeout. If a remote website performed HTTP tarpitting or hung socket connections, the scan runner remained in `IN_PROGRESS` indefinitely (zombie scan). Furthermore, bare `except Exception: pass` blocks in crawler callbacks swallowed unexpected runtime errors, leaving the scan record stranded in `IN_PROGRESS` forever without user feedback or credit cleanup.
- **Remediation Implemented:**
  1. Added `TIMED_OUT = "timed_out"` to `ScanStatus` enum and updated `ScanService.cancel_scan` to recognize `TIMED_OUT` as a terminal state.
  2. Configured `SCAN_TIMEOUT_SECONDS: int = 600` (10 minutes) in application settings.
  3. Wrapped scan execution in `asyncio.wait_for(cls._execute_lifecycle(scan_id), timeout=...)`. If timeout expires, the scan automatically updates to `TIMED_OUT` with `completed_at`, an informative error message, and a terminal error log.
  4. Wrapped `_execute_lifecycle` in an overarching error trap that captures any uncaught exception, logs the full stack trace, transitions the scan to `FAILED`, and records `error_message`.
- **Verification:**
  Unit tests `test_scan_timeout_handling` and `test_scan_failure_exception_capture` passed, confirming immediate transitions to `TIMED_OUT` and `FAILED` with diagnostics persisted.

---

### P1-05: Credit Reconciliation Invariant Flaw

- **Affected Files:**
  - `backend/app/services/credit_service.py`
  - `backend/app/tests/test_credit_concurrency.py`
- **Root Cause:**
  `CreditReconciliationService.reconcile_wallet` compared `wallet.available_credits` directly against `ledger_sum`. Because `reserve_credits` moves credits from `available_credits` to `reserved_credits` during in-flight operations (and only posts ledger entries upon `commit_credits`), any healthy workspace running an active scan showed a false credit balance drift and triggered alerting.
- **Remediation Implemented:**
  Adjusted the accounting invariant:
  $$\text{total\_wallet\_credits} = \text{wallet.available\_credits} + \text{wallet.reserved\_credits}$$
  $$\text{difference} = \text{total\_wallet\_credits} - \text{ledger\_sum}$$
- **Verification:**
  Tested `test_reconciliation_accounting_invariant_no_false_drift`. Verified zero false drift during in-flight reservations and confirmed that unauthorized balance alterations (without ledger transactions) are accurately flagged as drift.

---

### P1-Crawler: SSRF Redirect Inspection & Response Streaming Limits

- **Affected Files:**
  - `backend/app/services/crawler/http_client.py`
  - `backend/app/services/crawler/crawler.py`
  - `backend/app/tests/test_crawler_security.py`
- **Root Cause:**
  The HTTP crawler client used `follow_redirects=True` inside `httpx.AsyncClient`. While initial URLs were validated, a malicious target could return a 302 redirect pointing to `http://169.254.169.254/latest/meta-data/` or internal IPs (`http://127.0.0.1:8000`), completely bypassing SSRF controls. In addition, `await response.aread()` loaded entire responses into memory at once, exposing the server to memory exhaustion if a scanned URL served a multi-gigabyte payload (decompression bomb / stream).
- **Remediation Implemented:**
  1. Disabled automatic redirects (`follow_redirects=False`) and implemented an explicit redirect loop (up to 5 redirects).
  2. Each redirect `Location` header is parsed and validated using `validate_url(redirect_url, check_dns=True)`. Redirects to private IPv4/IPv6 blocks, loopback, or metadata services are rejected immediately with `SSRFBlockedError`.
  3. Replaced `response.aread()` with streaming `client.stream("GET", ...)`, accumulating chunks up to `max_response_size = 10 * 1024 * 1024` (10MB). If exceeded, stream is aborted and payload is truncated safely.
- **Verification:**
  Tested redirect validation and payload truncation via `test_crawler_security.py` (5 tests passing).

---

### P1-API & Frontend: Contract Alignment & Network Error Resilience

- **Affected Files:**
  - `backend/app/schemas/billing.py`
  - `backend/app/api/v1/endpoints/billing.py`
  - `frontend/src/lib/types.ts`
  - `frontend/src/lib/api-client.ts`
- **Root Cause:**
  1. `get_usage_summary` backend endpoint ignored the `days` query parameter requested by frontend billing analytics.
  2. `cancel_subscription` payload schema expected no body, whereas frontend submitted `{ feedback?: string }`.
  3. `change_plan` expected `plan_code`, whereas frontend submitted `new_plan_tier`.
  4. Frontend `apiClient.request()` caught network disconnects and timeouts and normalized them to generic strings without preserving HTTP status codes (e.g. 401, 403, 429) or distinguishing network outages from timeouts.
- **Remediation Implemented:**
  1. Added `CancelSubscriptionRequest` and `ChangePlanRequest` schemas supporting both `plan_code` and `new_plan_tier`.
  2. Supported `days: Optional[int] = Query(...)` in `get_usage_summary` to filter `created_at >= now - timedelta(days=days)`.
  3. Enhanced `ApiError` interface with `isNetworkError?: boolean; isTimeout?: boolean;`.
  4. Preserved exact HTTP status codes from backend responses, tagged `status: 0` for client network disconnects, and `status: 408` for request abort timeouts.
- **Verification:**
  Executed `npm run type-check` (passed) and `npm run build` (Next.js production build succeeded with 87 static routes compiled).

---

## 3. Test Suite Verification Summary

### Backend Unit & Regression Tests (Pytest)
```
platform win32 -- Python 3.14.7, pytest-9.1.1, pluggy-1.6.0
collected 98 items

app\tests\test_aeo.py .                                                  [  1%]
app\tests\test_auth_forgot_password.py .                                 [  2%]
app\tests\test_auth_security.py ....                                     [  6%]
app\tests\test_billing.py ........                                       [ 14%]
app\tests\test_crawler.py ....                                           [ 18%]
app\tests\test_crawler_security.py .....                                 [ 23%]
app\tests\test_credit_concurrency.py ......                              [ 29%]
app\tests\test_e2e_flow.py .                                             [ 30%]
app\tests\test_health.py ..                                              [ 32%]
app\tests\test_integrations.py ....                                      [ 36%]
app\tests\test_phase2_e2e.py .                                           [ 37%]
app\tests\test_phase3_seo.py .......                                     [ 44%]
app\tests\test_phase4_e2e_recheck.py .                                   [ 45%]
app\tests\test_phase4_recommendations.py ....                            [ 50%]
app\tests\test_phase5_aeo.py .........                                   [ 59%]
app\tests\test_phase6_aeo_optimization.py .....                          [ 64%]
app\tests\test_phase7_aeo_intelligence.py .......                        [ 71%]
app\tests\test_phase8_geo.py ...........                                 [ 82%]
app\tests\test_projects.py ....                                          [ 86%]
app\tests\test_scan_lifecycle.py ...                                     [ 89%]
app\tests\test_scans.py ..                                               [ 91%]
app\tests\test_seo_rules.py ....                                         [ 95%]
app\tests\test_settings.py ....                                          [100%]

================= 98 passed, 4 warnings in 102.56s (0:01:42) ==================
```

### Frontend Build Verification (Next.js)
```
   ▲ Next.js 15.5.24
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 14.5s
   Checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (87/87)
   Finalizing page optimization ...
   Collecting build traces ...
```

---

## 4. Quality & Compliance Checklist

- [x] **No Code Pushed:** Verified no `git push` executed. All changes remain staged/modified locally on the branch.
- [x] **Out-of-Scope Boundary Preserved:** Authentication, session generation, and payment provider core logic were not refactored.
- [x] **Out-of-Scope Security Notes Created:** Documented 5 critical/high/medium security findings in `OUT_OF_SCOPE_SECURITY_NOTES.md`.
- [x] **Dead Code & Imports Cleaned:** Cleaned unused imports and debug logs from modified files.
- [x] **PII & Logging Hygiene:** Ensured no passwords, bearer tokens, or user PII are logged in modified modules.
