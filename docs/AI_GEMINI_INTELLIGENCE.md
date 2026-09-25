# Zobay Rank — Centralized Google Gemini Intelligence Layer

## 1. Overview & Architectural Principle

Zobay Rank integrates Google Gemini as a centralized semantic intelligence and reasoning layer across SEO, AEO, and GEO workflows.

**Core Operating Principle:**
```
Deterministic HTML / Crawl Facts
               +
  Gemini Semantic Reasoning
               +
    Ground-Truth Validation
               +
   Deterministic Scoring Engine
               =
       Zobay Rank Result
```

> **CRITICAL RULE**: Google Gemini provides semantic interpretation, content gap discovery, answer understanding, and recommendation rationale. Gemini **never** calculates or overrides final numerical scores (SEO scores, AEO scores, and GEO scores remain 100% deterministic).

---

## 2. Environment Configuration

The integration is configured in `backend/.env` using server-side environment variables:

```bash
# Central AI Intelligence Layer (Google Gemini)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

Additional runtime tuning parameters configured in `app/core/config.py`:
- `GEMINI_TIMEOUT_SECONDS=30` (Non-blocking HTTP timeout per request)
- `GEMINI_MAX_RETRIES=2` (Automatic exponential backoff on HTTP 429/500/503)
- `AI_CACHE_ENABLED=True` (Deterministic SHA-256 caching for identical content)
- `AI_RATE_LIMIT_PER_MINUTE=60`

### Security Guarantees:
- `GEMINI_API_KEY` is loaded strictly server-side and is **never** sent to the client browser or exposed via public API endpoints.
- Secret sanitization strips keys before logging to prevent accidental credential leakage in log aggregation systems.

---

## 3. Central AI Provider Architecture

The centralized AI module is organized inside `backend/app/services/ai/`:

```
backend/app/services/ai/
├── __init__.py                # Package exports
├── base_provider.py           # BaseAIProvider abstract interface
├── gemini_provider.py         # Production-grade GeminiProvider implementation
├── intelligence_service.py    # AIIntelligenceService coordinator (credits, caching, fallback)
├── schemas.py                 # Pydantic v2 structured output models
├── prompts.py                 # Centralized prompt templates with injection defenses
├── validators.py              # AIGroundTruthValidator (reconciles LLM output with ground truth)
└── cache.py                   # AICacheService (SHA-256 fingerprinting)
```

### Prompt Injection & Safety Guardrails
All external page content, crawl snippets, and AI-generated answers are encapsulated inside `<UNTRUSTED_EXTERNAL_DATA>` tags with explicit directives:
- User prompts or instructions within external content are treated strictly as inert data to analyze.
- Gemini is forbidden from fabricating client testimonials, statistics, awards, or fake citations.

---

## 4. Multi-Pillar Integration

### SEO Semantic Analysis & Optimization
- **Semantic Intent**: Analyzes search intent (informational, commercial, transactional, navigational) and intent match strength.
- **Content Gaps**: Identifies missing subtopics, questions, and depth deficiencies.
- **Optimization Suggestions**: Generates high-performing, click-worthy titles and meta descriptions adhering to optimal character constraints (Titles: 45–60 chars, Descriptions: 120–160 chars).
- **Graceful Fallback**: If Gemini is unconfigured or unavailable, `SEOAIProviderFactory` automatically routes to `RuleBasedSEOAIProvider`.

### AEO Answer Intelligence
- **Brand Mentions & Positioning**: Evaluates whether target brands are mentioned, their ordinal ranking in lists, and contextual positioning.
- **Ground-Truth Validation**: If Gemini claims a brand was mentioned but deterministic string analysis finds no occurrence in the answer text, `AIGroundTruthValidator` flags the observation as `UNVERIFIED` and marks `brand_mentioned = False`.
- **Direct Answer Quality**: Evaluates whether an answer delivers early core conclusions, avoids unnecessary fluff, and contains clear entity references.
- **Deterministic Scoring**: Authoritative visibility metrics are calculated by `VisibilityScorerEngine`.

### GEO Generative Search Intelligence
- **Recommendation Strength**: Classifies brand status across standard levels:
  `NOT_MENTIONED`, `MENTIONED`, `DESCRIBED`, `CONSIDERED`, `RECOMMENDED`, `STRONGLY_RECOMMENDED`.
- **Competitor Relationships**: Evaluates alternatives and category leaders referenced in generative search answers.
- **Deterministic Scoring**: Authoritative GEO scores are calculated by `GEOScoringEngine`.

---

## 5. Credit Accounting & Billing Integration

All AI operations connect to `CreditWalletService`:
1. **Pre-flight Estimation**: Checks available wallet balance.
2. **Atomic Reservation**: Calls `CreditWalletService.reserve_credits()`.
3. **Execution**: Queries Gemini or retrieves cached result.
4. **Commit / Release**:
   - On success: `CreditWalletService.commit_credits()` permanently logs ledger usage.
   - On provider failure or empty response: `CreditWalletService.release_credits()` restores credits immediately without double-charging retries.

---

## 6. Real-Time Admin Provider Diagnostics

Real-time health status can be queried at:
`GET /api/v1/settings/ai-provider-status`

Example Response:
```json
{
  "provider": "gemini",
  "model": "gemini-1.5-flash",
  "status": "CONNECTED",
  "is_available": true,
  "last_checked_at": "2026-09-25T10:45:00Z",
  "error_message": null
}
```

---

## 7. Local Testing & Verification

Run the dedicated Gemini intelligence test suite:
```bash
# From backend directory
..\.venv\Scripts\python.exe -m pytest app/tests/test_gemini_intelligence.py -v
```

Run the entire backend test suite:
```bash
..\.venv\Scripts\python.exe -m pytest app/tests
```

Run frontend verification checks:
```bash
# From frontend directory
npm run type-check
npm run seo:check
npm run aeo:check
npm run geo:check
```
