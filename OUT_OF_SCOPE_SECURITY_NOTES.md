# Out-of-Scope Security Findings

> **Scope Note:** The following security issues were identified during code and architecture analysis of the `seo-sensing` repository. In accordance with the engineering remediation scope, authentication, session management, billing/payment provider integrations, and password reset flows are owned by separate teams and are scheduled for modular replacement. These issues were NOT modified in this remediation cycle and are documented here for the respective owning teams.

---

### Finding 1: Plaintext Password Reset OTP in Application Logs

- **Module:** Authentication (Password Reset)
- **Severity:** Critical
- **Affected File(s) and Line Number(s):** `backend/app/api/v1/endpoints/auth.py:249`
- **Description:**
  When a user requests a password reset, the generated one-time verification code (OTP) is directly logged to the application logs in cleartext:
  ```python
  logger.info("🔐 [PASSWORD RESET OTP] Target: %s | Verification Code: %s", clean_email, code)
  ```
  Anyone with access to the console output, centralized logging (Datadog, CloudWatch, Papertrail), or server logs on the VPS (`/var/log/...`) can read the verification code and reset the password of any user.
- **Recommended Remediation:**
  Remove the verification code from the log statement immediately. Log only an obfuscated recipient address and an audit event identifier:
  ```python
  logger.info("Password reset OTP dispatched for target: %s", mask_email(clean_email))
  ```
  Ensure that OTP codes are delivered exclusively via secure out-of-band email/SMS channels and that brute-force attempts on the verification endpoint are rate-limited.
- **Risk if Unfixed:**
  Account takeover of any user or administrator account by anyone with read access to application logs.

---

### Finding 2: Unauthenticated Fallback to Most Recent Active User in Billing Endpoints

- **Module:** Billing & Authorization
- **Severity:** High
- **Affected File(s) and Line Number(s):** `backend/app/api/v1/endpoints/billing.py:96-107`
- **Description:**
  The `get_optional_current_user` dependency contains a fallback designed for local development that automatically fetches the most recently created active user if no `Authorization` header or session cookie is present:
  ```python
  stmt = select(User).where(User.is_active == True).order_by(User.created_at.desc()).limit(1)
  res = await db.execute(stmt)
  user = res.scalar_one_or_none()
  ```
  This means unauthenticated callers accessing billing endpoints (`/billing/subscription`, `/billing/subscription/cancel`, `/billing/usage/summary`, etc.) are silently impersonating the latest registered user in the database.
- **Recommended Remediation:**
  Remove the fallback completely. If authentication credentials are missing or invalid, return `None` (for optional auth routes) or raise `HTTPException(status_code=401, detail="Authentication required")`. Never substitute arbitrary database records for unauthenticated requests in production code.
- **Risk if Unfixed:**
  Unauthenticated anonymous actors can view sensitive billing summaries, cancel active subscriptions, or trigger plan modifications belonging to the most recently created user.

---

### Finding 3: Unsigned Pseudo-Session Tokens Without Revocation Mechanism

- **Module:** Session Management & Authentication Architecture
- **Severity:** High
- **Affected File(s) and Line Number(s):** `backend/app/api/v1/endpoints/auth.py:126`, `backend/app/core/security.py:73`
- **Description:**
  Session tokens are generated as simple concatenated strings:
  ```python
  session_token = f"sess_{user.id}_{secrets.token_urlsafe(32)}"
  ```
  These tokens lack cryptographic signatures (unlike JWT or Fernet tokens) and are not tracked in a database session table or Redis cache. Validation only parses the user ID from the string and verifies user existence, without checking whether the session has been revoked, expired, or logged out.
- **Recommended Remediation:**
  Transition to standard cryptographically signed JWTs (HS256/RS256) with standard claims (`exp`, `iat`, `sub`, `jti`) or a stateful session store (Redis) with explicit TTLs and server-side revocation on logout and password reset.
- **Risk if Unfixed:**
  Stolen session tokens cannot be invalidated prior to application restart; leaking a session token allows permanent account access. In addition, internal user UUIDs are directly exposed in headers and client requests.

---

### Finding 4: Maximum Password Length Restrictive Cap

- **Module:** Authentication & Cryptography
- **Severity:** Medium
- **Affected File(s) and Line Number(s):** `backend/app/core/security.py:45-55`
- **Description:**
  Password validation enforces a maximum length of only 16 characters:
  ```python
  if len(password) > 16:
      raise HTTPException(status_code=400, detail="Password too long (max 16 characters)")
  ```
  Restricting passwords to 16 characters directly violates NIST SP 800-63B guidelines (which mandate supporting passwords up to at least 64 characters) and blocks users from using password managers (1Password, Bitwarden) that generate 24–64 character passwords or multi-word passphrases.
- **Recommended Remediation:**
  Increase maximum password length to at least 128 characters. Ensure passwords are properly hashed using bcrypt or Argon2id.
- **Risk if Unfixed:**
  Forces users to choose shorter, lower-entropy passwords, increasing susceptibility to credential guessing and password reuse across services.

---

### Finding 5: Razorpay Sandbox Verification Bypass

- **Module:** Billing & Payment Gateways
- **Severity:** Medium
- **Affected File(s) and Line Number(s):** `backend/app/services/razorpay_service.py:74-88`
- **Description:**
  The Razorpay signature verification routine allows arbitrary test signatures when `RAZORPAY_KEY_SECRET` is unset:
  ```python
  if not secret:
      if signature.startswith("test_sig_") or order_id.startswith("order_test_"):
          return True
  ```
  If environment variables are misconfigured or fail to load on the production host, incoming requests with `test_sig_` will be accepted as valid payments.
- **Recommended Remediation:**
  Refuse all verification attempts if `RAZORPAY_KEY_SECRET` is empty or missing. Sandbox bypass logic should be confined strictly to unit test mocks, never in production runtime services.
- **Risk if Unfixed:**
  If the payment secret fails to populate in production, an attacker could spoof payment success callbacks to gain free credits and subscription access.
