# Product Requirements Document (PRD)
# Zobay Rank — Unified SEO, AEO & GEO Optimization Platform

**Document Version:** 2.4.0  
**Status:** Approved & Implemented (Production Baseline)  
**Product Name:** Zobay Rank  
**Parent Company:** Zobay  
**Production Canonical Domain:** `https://rank.zobay.in/`  
**API Specification Base:** `https://rank.zobay.in/api/v1`  
**Last Updated:** September 2026  

---

## 1. Executive Summary & Vision

### 1.1 Product Overview
**Zobay Rank** is an enterprise-grade search intelligence and optimization platform engineered to bridge the generational divide between traditional search engines (Google, Bing) and next-generation conversational AI answer engines (OpenAI ChatGPT Search, Perplexity AI, Google Gemini, Anthropic Claude). 

While legacy SEO platforms (Ahrefs, Semrush, Screaming Frog) focus exclusively on keywords, backlinks, and HTML crawlers for SERP blue links, modern buyer discovery increasingly occurs inside AI-generated summaries and synthesized conversational answers. Zobay Rank provides the industry's first **Unified Search Intelligence Engine**, combining:
1. **Search Engine Optimization (SEO):** High-speed deterministic crawler audits, Core Web Vitals, indexability, metadata, and link graph health.
2. **Answer Engine Optimization (AEO):** Prompt tracking, direct answer structuring, LLM citation extraction, entity recognition, and share-of-voice monitoring.
3. **Generative Engine Optimization (GEO):** Proprietary 8-Factor Generative Engine scoring, brand knowledge graph alignment, citation authority, factuality claims verification, and recommendation strength analysis.

### 1.2 Mission Statement
To empower digital brands, SaaS founders, enterprise growth teams, and agencies to capture, dominate, and defend visibility across traditional search crawlers and generative AI answer engines through automated, deterministic, and verifiable intelligence.

### 1.3 Core Value Proposition
- **Triple-Engine Visibility in One Dashboard:** Measure, track, and optimize for Google, Bing, ChatGPT, Perplexity, Gemini, and Claude from a single pane of glass.
- **Unified Search Intelligence Score:** A deterministic formula evaluating holistic search readiness:
  $$\text{Unified Score} = (\text{SEO} \times 0.50) + (\text{AEO} \times 0.25) + (\text{GEO} \times 0.25)$$
- **Zero Synthetic Guesses:** Audits run through high-concurrency deterministic rule engines, live AI answer simulations, and real-time citation parsers without fabricated scores or synthetic estimates.
- **Actionable Optimization Studio:** Automated code snippets, JSON-LD schema generators (FAQPage, DefinedTerm, SoftwareApplication, Organization), content briefs, and instant fix verification.
- **Turnkey Public Lead Generation:** Zero-authentication instant quick scan engine on the marketing site evaluating 260+ checkpoints in under 5 seconds with automatic technology stack detection.

---

## 2. Product Taxonomy: The Three Foundational Pillars

```
                               ┌────────────────────────────────────────────────────────┐
                               │           ZOBAY RANK SEARCH INTELLIGENCE ENGINE        │
                               │  Unified Score = (SEO * 0.50) + (AEO * 0.25) + (GEO * 0.25) │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
             ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
             │                                             │                                             │
             ▼                                             ▼                                             ▼
┌─────────────────────────┐                   ┌─────────────────────────┐                   ┌─────────────────────────┐
│       PILLAR 1:         │                   │       PILLAR 2:         │                   │       PILLAR 3:         │
│ Traditional SEO         │                   │ Answer Engine (AEO)     │                   │ Generative Engine (GEO) │
├─────────────────────────┤                   ├─────────────────────────┤                   ├─────────────────────────┤
│ • Indexability & Status │                   │ • Conversational Queries│                   │ • 8-Factor GEO Model    │
│ • Technical DOM Health  │                   │ • Direct Answer Blocks  │                   │ • Brand Knowledge Graph │
│ • Core Web Vitals       │                   │ • LLM Citation Sources  │                   │ • Entity Disambiguation │
│ • Metadata & OpenGraph  │                   │ • Question Coverage     │                   │ • Recommendation Rank   │
│ • Internal Link Graphs  │                   │ • Share of Voice (SOV)  │                   │ • Citeable Statistics   │
│ • Robots & XML Sitemaps │                   │ • Multi-Engine Prompts  │                   │ • Perspective Balance   │
└─────────────────────────┘                   └─────────────────────────┘                   └─────────────────────────┘
```

### 2.1 Pillar 1: Traditional Search Engine Optimization (SEO)
- **Target Environments:** Google Search, Bing, Yahoo, DuckDuckGo, Baidu, Yandex.
- **Focus:** Web crawler accessibility, indexing status, HTTP status codes, redirection chains, title tag/meta description compliance, Core Web Vitals (CLS, LCP, FID), canonical hygiene, broken internal links, orphan pages, structured data syntax, and render-blocking resources.
- **Output:** 0–100 Technical Health Score with prioritized Critical, High, Medium, Low, and Info issues.

### 2.2 Pillar 2: Answer Engine Optimization (AEO)
- **Target Environments:** Perplexity AI, ChatGPT Search, Bing Copilot, Google AI Overviews.
- **Focus:** Formatting content into direct, syntactically clear answer nuggets that large language models extract when synthesizing conversational answers to user prompts. Focuses on Q&A schema, definition lists (`<dl>`), table structures, bulleted summaries, and primary source citations.
- **Output:** 0–100 AEO Visibility Score composed of Mention Rate (35%), Citation Share (25%), Position Rank (20%), and Question Coverage (20%).

### 2.3 Pillar 3: Generative Engine Optimization (GEO)
- **Target Environments:** OpenAI GPT-4o / Search, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro, DeepSeek, Meta Llama 3.
- **Focus:** Establishing the semantic authority, credibility, brand knowledge graph footprint, and factual integrity required for generative AI engines to spontaneously recommend a brand as a top-tier solution in zero-shot recommendations and commercial comparison queries.
- **Output:** 0–100 GEO Score evaluated across an 8-factor proprietary weighting matrix:
  - Visibility (20%)
  - Recommendation Strength (15%)
  - Citation Health (15%)
  - Entity Clarity (15%)
  - Content Extractability (10%)
  - Technical Accessibility (10%)
  - Citation Authority (10%)
  - Consistency Across Engines (5%)

---

## 3. User Personas & Target Audience

| Persona | Role & Industry | Primary Jobs-to-be-Done | Key Pain Points Solved |
|---|---|---|---|
| **Alex Rivera** | SaaS Founder / Head of Growth | Needs predictable inbound trial signups; must know why competitors are cited in ChatGPT/Perplexity while their product is ignored. | Replaces 4 disjointed tools with unified SEO+AEO tracking; provides instant content briefs for missing prompt queries. |
| **Priya Sharma** | E-commerce Director | Wants product catalog to rank in traditional Google SERPs and appear in AI comparison queries ("best luxury villas Bangalore"). | Solves schema omissions, optimizes product entities, and flags unindexed commercial subpages. |
| **Marcus Vance** | Digital Agency SEO Strategist | Manages 30+ client domains; must deliver modern client-facing audits proving value in the age of AI search. | White-label PDF audit reports, multi-project workspaces, automated recurring monitoring with deviation alerts. |
| **Elena Rostova** | Enterprise Brand & PR Lead | Protects brand entity reputation, executive citations, and accuracy of company facts across generative AI models. | Canonical Brand Profile setup, Wikipedia/Wikidata entity alignment, competitor sentiment and negative citation alerts. |

---

## 4. Platform Capabilities & Detailed Feature Specifications

### 4.1 Public Landing Page & Instant Lead-Gen Scanner
- **Zero-Authentication Instant Scan:** Accessible directly on the homepage (`https://rank.zobay.in/#quick-scan`). Accepts any valid domain or URL.
- **Dual Scan Modes:**
  - `page`: Audits the seed URL in under 3 seconds.
  - `site`: Crawls up to 6 internal links concurrently to deliver site-wide aggregate SEO, AEO, and GEO scores plus the top 15 most common cross-page issues.
- **260+ Deterministic Checkpoints:** Evaluates security headers, Core Web Vitals hints, canonical tags, heading hierarchies, images with missing dimensions, render-blocking scripts, OpenGraph, JSON-LD schemas, LLM crawler permissions, and brand entity signals.
- **Resilient Network Layer:**
  - Automatic SSL fallback: Flags `SEO030B` (Untrusted/Self-Signed Certificate) with diagnostic advice instead of terminating.
  - HTTP fallback: Automatically tries HTTP if HTTPS TLS handshake fails.
  - Fine-grained connection timeouts: Detects unreachable hosts in under 6 seconds.
  - User-Agent Bot Attribution: Uses `compatible; ZobayRankBot/1.0; +https://rank.zobay.in/bot`.
- **Technology Stack Auto-Detection:** Identifies CMS and frameworks (Next.js, Nuxt, WordPress, Shopify, Webflow, React, Vue, Drupal) with confidence scoring.
- **Quick Wins Highlighting:** Extracts the top 3 highest-ROI fixes with business impact explanations.

### 4.2 Workspace & Multi-Project Management
- **Domain Verification & Onboarding:** Validates root domains, subdomains, and protocols; normalizes URLs into canonical formats.
- **Project Configuration:** Custom crawl concurrency, crawl depth (1–10 levels), max pages cap, custom robots.txt override, excluded paths, and sub-industry taxonomy.
- **Active Telemetry & Scan History:** Retains complete historical audit snapshots, score deltas, and issue resolution tracking over time.

### 4.3 High-Performance Asynchronous Crawler Engine
- **Breadth-First Search (BFS) Traversal:** Asynchronous non-blocking queue using `httpx.AsyncClient` with polite domain rate limiting.
- **Enterprise SSRF & Intranet Defense (`url_validator.py`):**
  - Blocks local hostnames (`localhost`, `127.0.0.1`, `::1`, `0.0.0.0`).
  - Blocks Cloud Metadata endpoints (`169.254.169.254`, `metadata.google.internal`).
  - Validates direct IP ranges against Carrier-Grade NAT (CGNAT `100.64.0.0/10`), private RFC-1918 subnets, and loopback devices.
  - Performs live socket DNS pre-resolution to prevent DNS rebinding attacks.
- **Robots.txt & Sitemap Auto-Discovery:** Parses `robots.txt` compliance, extracts XML sitemap entries from `/sitemap.xml` and `robots.txt` `Sitemap:` directives, and crawls discovered indexable URLs.
- **Link Graph Constructor:** Maps all internal and external hyperlinks, detecting anchor text, follow/nofollow attributes, HTTP status codes, and orphan nodes.

### 4.4 Traditional Technical SEO Audit Suite
- **Issue Classification Matrix:**
  - **Categories:** Technical (30%), Indexability (25%), Metadata (25%), Links (20%).
  - **Severities:** Critical (10 pt penalty), High (5 pt penalty), Medium (3 pt penalty), Low (1 pt penalty), Info (0 pt penalty).
- **Core Audits:**
  - Status codes (200, 301, 302, 404, 500) and redirect loops.
  - Title tag length (30–60 chars) and meta description length (70–160 chars).
  - Heading hierarchy (Single H1 enforcement, logical H2/H3 nesting).
  - Canonical URL consistency, self-referencing canonicals, cross-domain canonicals.
  - Image optimization (missing `alt` tags, missing `width`/`height` preventing CLS).
  - Security headers (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`).
  - Cache-Control, Brotli/Gzip compression, DOM node count, and response latency.

### 4.5 Answer Engine Optimization (AEO) Engine
- **Multi-Engine AI Answer Simulation:** Simulates and benchmarks brand answers across OpenAI ChatGPT Search, Perplexity AI (Sonar), Google Gemini (1.5 Pro), and Claude.
- **Automated Question Generation:** Analyzes seed pages and generates high-intent customer prompts categorized by intent (Informational, Commercial, Navigational, Transactional).
- **Citation Extraction & Attribution:** Parses cited sources in AI answers, categorizing links into:
  - `own_domain`: Direct citation of the user's website.
  - `competitor`: Citations referencing direct competitors.
  - `third_party`: Review platforms (G2, Trustpilot, Capterra), Wikipedia, news media, and documentation portals.
- **Entity Extraction & Concept Association:** Maps brand entities, product lines, and co-occurring industry concepts detected in LLM responses.
- **AEO Visibility Scoring:** Quantifies mention frequency, top-3 answer position rank, citation share, and prompt coverage.

### 4.6 Generative Engine Optimization (GEO) Engine & 8-Factor Model
- **Canonical Brand Profile:** Centralized entity source-of-truth storing brand name, legal name, aliases, core differentiators, product catalog, target user profiles, official URLs, and verified social profiles.
- **The 8-Factor Deterministic Algorithm:**
  1. *Visibility (20%):* Frequency of spontaneous brand emergence in multi-prompt search benchmarks.
  2. *Recommendation Strength (15%):* Whether the AI engine ranks the brand as the top solution (Rank 1 vs Rank 2–5 vs unranked) and recommendation sentiment.
  3. *Citation Health (15%):* Ratio of owned domain links vs competitor links cited by the model.
  4. *Entity Clarity (15%):* Validation of Organization JSON-LD, `sameAs` links to Wikipedia/Wikidata, and executive leadership entities.
  5. *Content Extractability (10%):* Percentage of content formatted into direct definitions, structured FAQs, tables, and concise lists.
  6. *Technical Accessibility (10%):* Verification of crawler access in `robots.txt` for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, and `CCBot`, plus `llms.txt` existence.
  7. *Citation Authority (10%):* Presence of citeable numerical claims, original statistics, survey data, and industry benchmarks that AI models quote.
  8. *Consistency Across Engines (5%):* Agreement in brand positioning between OpenAI, Perplexity, Gemini, and Claude.

### 4.7 Continuous Monitoring & Anomaly Alert System
- **Automated Audit Cron Schedules:** Configurable monitoring intervals (Daily, Weekly, Monthly) with automated crawl execution.
- **Change Detection Engine:** Detects drops in SEO scores, unindexed pages, new 404 errors, brand displacement in AI answers, loss of citations to competitors, or negative sentiment shifts.
- **Multi-Channel Alert Dispatch:** Real-time email alerts via Brevo/SMTP and in-app notification center.

### 4.8 Optimization Studio & Action Center
- **Prioritized Action Queue:** Issues sorted dynamically by ROI (`Estimated Impact × Opportunity Score ÷ Effort`).
- **AI Content Studio & Code Generators:**
  - Automated Title & Meta Description rewrite suggestions.
  - JSON-LD Structured Data generator (FAQPage, DefinedTerm, SoftwareApplication, Organization).
  - Direct answer content briefs with recommended headings, target word counts, and missing entities.
  - Internal link optimization recommender identifying orphan pages and high-value internal anchor text opportunities.
- **Fix Verification Engine:** Live re-crawl button verifying whether an issue has been resolved in production before closing the ticket.

### 4.9 Third-Party Integrations Ecosystem
- **Google Search Console (GSC):** Syncs verified clicks, impressions, average CTR, average SERP position, and indexed vs non-indexed coverage.
- **Google Analytics 4 (GA4):** Syncs organic sessions, landing page engagement rates, bounce rates, and conversion events.
- **Ahrefs & Semrush APIs:** Pulls Domain Rating (DR), backlink velocity, referring domains, organic keyword rankings, and SERP feature ownership.
- **AI Providers:** Native direct API integrations with OpenAI, Perplexity, and Google Gemini with bring-your-own-key (BYOK) or managed credit routing.

### 4.10 Dual-Gateway Monetization, Credit Ledger & Usage Billing
- **Dual Payment Processors:**
  - **Razorpay:** Optimized for India and APAC (UPI, Netbanking, Cards in INR & USD).
  - **Stripe:** Optimized for Global / US / EU customers (Credit Cards, Apple Pay, Google Pay).
- **Granular Credit Consumption Engine:**
  - SEO Quick Scan: 1 credit
  - SEO Page Analysis: 2 credits
  - SEO Full Crawl: 10 credits base + 1 credit per 20 pages
  - AEO Question Generation: 2 credits
  - AEO/GEO Multi-Engine AI Query: 3 credits per model
  - Citation / Entity Analysis: 2 credits
  - AI Optimization Fix / Content Brief: 3 credits
  - Executive PDF Report: 2 credits
  - Scheduled Monitoring Snapshot: 2 credits
- **Transparent Wallet Ledger:** Breaks down monthly subscription credits, rollover credits, and purchased on-demand credits with detailed transaction history and downloadable PDF invoices.

### 4.11 Self-Optimized Platform Infrastructure
- **Native `llms.txt` and `llms-full.txt`:** Fully compliant machine-readable knowledge bases hosted at `/llms.txt` and `/llms-full.txt` defining Zobay Rank's entity, features, pricing, and architecture for AI search bots.
- **Strict Canonical & Indexability Architecture:**
  - Production canonical strictly locked to `https://rank.zobay.in/`.
  - All public routes emit structured JSON-LD schemas.
  - All private authenticated app routes (`/dashboard`, `/seo/*`, `/aeo/*`, `/geo/*`, `/billing/*`, `/settings/*`, `/projects/*`) strictly emit `noindex, nofollow` headers and meta tags.

---

## 5. Subscription Plans & Feature Entitlements

| Plan Tier | Monthly Price | Monthly Credits | Max Projects | Max Websites | Team Members | Scheduled Monitoring | PDF Reports | White-Label | API Access |
|---|---|---|---|---|---|---|---|---|---|
| **Free** | $0 / mo | 50 | 1 | 1 | 1 | ❌ | ❌ | ❌ | ❌ |
| **Starter** | $4.99 / mo | 500 (250 rollover) | 3 | 3 | 1 | ✅ Weekly | ❌ | ❌ | ❌ |
| **Growth** | $8.99 / mo | 1,000 (500 rollover) | 5 | 5 | 3 | ✅ Daily | ✅ | ❌ | ❌ |
| **Pro** | $14.99 / mo | 2,500 (1,250 rollover) | 10 | 10 | 5 | ✅ Daily | ✅ | ❌ | ❌ |
| **Business** | $29.99 / mo | 6,000 (3,000 rollover) | 25 | 25 | 10 | ✅ Real-time | ✅ | ✅ | ✅ |
| **Agency** | $59.99 / mo | 15,000 (7,500 rollover) | 50 | 50 | 25 | ✅ Real-time | ✅ | ✅ | ✅ Dedicated |

*Note: On-demand credit top-ups available in packs of 250 ($3), 500 ($5), 1,000 ($9), 2,500 ($20), and 5,000 ($35).*

---

## 6. Mathematical Formulas & Deterministic Scoring Models

### 6.1 Unified Search Intelligence Score
$$\text{Unified Score} = \text{round}\Big( (\text{SEO Score} \times 0.50) + (\text{AEO Score} \times 0.25) + (\text{GEO Score} \times 0.25) \Big)$$

### 6.2 Traditional SEO Scoring Model
$$\text{SEO Score} = 100 - \sum_{\text{categories}} \Big( \text{Category Weight} \times \min(100, \text{Category Deductions}) \Big)$$
- **Category Weights:** Technical ($0.30$), Indexability ($0.25$), Metadata ($0.25$), Links ($0.20$).
- **Deduction Penalty per Issue:**
  $$\text{Penalty} = \text{Base Severity Weight} \times \min\left(3.0, 1.0 + \left( \frac{\text{Affected Pages}}{\text{Total Pages}} \times 2.0 \right)\right)$$
  - Critical Base = $10.0$
  - High Base = $5.0$
  - Medium Base = $3.0$
  - Low Base = $1.0$
  - Info Base = $0.0$

### 6.3 AEO Visibility Scoring Model
$$\text{AEO Score} = \text{round}\Big( (0.35 \times \text{Mention Rate}) + (0.25 \times \text{Citation Share}) + (0.20 \times \text{Position Score}) + (0.20 \times \text{Coverage Rate}) \Big)$$
Where:
- $\text{Mention Rate} = \min\left(100, \frac{\text{Brand Mentions}}{\text{Total Answers}} \times 100\right)$
- $\text{Citation Share} = \min\left(100, \frac{\text{Own Citations}}{\text{Total Citations}} \times 100\right)$
- $\text{Position Score} = \max\left(20.0, 100.0 - (\text{Average Position} - 1.0) \times 20.0\right)$
- $\text{Coverage Rate} = \min\left(100, \frac{\text{Answered Questions}}{\text{Tracked Questions}} \times 100\right)$

### 6.4 GEO 8-Factor Scoring Model
$$\text{GEO Score} = \text{round}\left( \frac{\sum_{i=1}^{8} (S_i \times W_i)}{\sum_{i \in \text{Available}} W_i} \right)$$
- $W_{\text{visibility}} = 0.20$
- $W_{\text{recommendation}} = 0.15$
- $W_{\text{citation}} = 0.15$
- $W_{\text{entity}} = 0.15$
- $W_{\text{content}} = 0.10$
- $W_{\text{technical}} = 0.10$
- $W_{\text{authority}} = 0.10$
- $W_{\text{consistency}} = 0.05$

### 6.5 Rating Tiers
| Score Range | Grade | Label | Description |
|---|---|---|---|
| **90 – 100** | A+ / A | **Excellent** | Optimal health, high citations, recognized authority across all engines. |
| **80 – 89** | B | **Good** | Solid baseline; minor technical gaps or missing long-tail prompt coverage. |
| **70 – 79** | C | **Fair** | Moderate vulnerabilities; entity ambiguity or missed structured data schemas. |
| **50 – 69** | D | **Needs Improvement** | Severe crawling issues, poor citation share, or missing brand entity signals. |
| **0 – 49** | F | **Critical** | Site unindexed, security errors, zero AI visibility, or broken architecture. |

---

## 7. Data Architecture & Database Schemas

The database is built on **PostgreSQL 16** (Neon Serverless PostgreSQL in production, SQLite async in local development) using **SQLAlchemy 2.0 Async ORM** with UUID primary keys and UTC timestamps.

```
┌──────────────┐       1:N       ┌──────────────┐       1:N       ┌──────────────┐
│    users     ├────────────────►│   projects   ├────────────────►│    scans     │
└──────┬───────┘                 └──────┬───────┘                 └──────┬───────┘
       │                                │                                │
       │ 1:1                            │ 1:N                            │ 1:N
       ▼                                ▼                                ▼
┌──────────────┐                 ┌──────────────┐                 ┌──────────────┐
│credit_wallets│                 │ aeo_projects │                 │  seo_pages   │
└──────────────┘                 └──────┬───────┘                 └──────┬───────┘
       │                                │                                │
       │ 1:N                            │ 1:N                            │ 1:N
       ▼                                ▼                                ▼
┌──────────────┐                 ┌──────────────┐                 ┌──────────────┐
│credit_trans. │                 │geo_brand_prof│                 │  seo_issues  │
└──────────────┘                 └──────────────┘                 └──────────────┘
```

### 7.1 Core & Identity Models
- `users`: User identity, hashed passwords (bcrypt), roles (`user`, `admin`), email verification, workspace references.
- `password_resets`: Secure time-limited tokens with expiry timestamps and usage status.
- `platform_integrations`: Encrypted credentials and sync settings for GSC, GA4, Ahrefs, Semrush, OpenAI, Perplexity, and Gemini.
- `system_settings`: Platform-wide configurations, crawler rate limits, maintenance flags, and Brevo SMTP credentials.

### 7.2 Traditional SEO & Crawl Models
- `projects`: Web properties tracked by users with domain name, root URL, settings, and crawl policies.
- `scans`: Audit execution lifecycles with state machine status (`queued`, `initializing`, `crawling`, `analyzing`, `scoring`, `completed`, `failed`, `cancelled`), progress (0–100%), event logs, and final scores.
- `seo_pages`: Crawled page records storing URL, status code, response time, title, meta description, canonical URL, H1–H3 counts, word count, render method, and indexability flags.
- `seo_page_images`: Discovered images, `src`, `alt` attributes, dimensions, and internal/external flags.
- `seo_page_links`: Internal and external hyperlinks, anchor texts, target status codes, and follow/nofollow directives.
- `seo_issues`: Normalized audit issues with code, category, severity, affected page, title, recommendation, and resolution status (`open`, `in_progress`, `fixed`, `ignored`).
- `seo_recommendations`: Prioritized fixes with opportunity scores, estimated impact, effort levels, and verification status.
- `optimization_history`: Audit-over-audit historical snapshots tracking resolved issues, new issues, and score deltas.

### 7.3 Answer Engine Optimization (AEO) Models
- `aeo_projects`: AEO tracking workspace linked to projects and domains.
- `aeo_questions`: Tracked queries and prompts with intent classification and search types.
- `aeo_answers`: Synthesized LLM responses collected from ChatGPT, Perplexity, Gemini, and Claude with mention flags, positions, and sentiment.
- `aeo_citations`: Extracted citations linking queries to source URLs, domains, and citation types (`own_domain`, `competitor`, `third_party`).
- `aeo_entities`: Detected brand and industry entities with mention counts and visibility rates.
- `aeo_visibility_snapshots`: Time-series records tracking historical AEO visibility scores and components.
- `aeo_monitoring_schedules`: Automated cron schedules with frequency, active engines, and notification triggers.
- `aeo_alerts`: Generated anomaly notifications for score drops, competitor displacements, or negative answers.

### 7.4 Generative Engine Optimization (GEO) Models
- `geo_projects`: Primary GEO entity linked to projects.
- `geo_brand_profiles`: Canonical brand profiles storing legal name, aliases, differentiators, product catalog, target users, official URLs, and social links.
- `geo_questions`: Target generative prompts tested across LLMs.
- `geo_answers`: Detailed LLM evaluation responses with brand mention type, recommendation position, recommendation strength, and confidence scores.
- `geo_citations`: Authority domain citations and Wikipedia/Wikidata grounding links.
- `geo_entities`: Recognized entity graph nodes with disambiguation aliases.
- `geo_issues`: Violations of the 8-Factor GEO model with diagnostic explanations and remediation steps.
- `geo_recommendations`: Prioritized generative engine optimization tasks.
- `geo_visibility_snapshots`: Historical 8-factor score snapshots.

### 7.5 Billing & Monetization Models
- `plans`: Tier definitions (`FREE`, `STARTER`, `GROWTH`, `PRO`, `BUSINESS`, `AGENCY`) with pricing, credits, and quotas.
- `subscriptions`: Stripe/Razorpay customer subscription records, billing intervals, renewal dates, and status.
- `billing_customers`: Provider-specific customer IDs (Stripe Customer ID, Razorpay Customer ID).
- `credit_wallets`: User balance ledgers (available credits, monthly allowance, rollover balance, purchased balance, total used).
- `credit_transactions`: Immutable double-entry ledger records for every credit credit, debit, rollover, or refund.
- `payments`: Processed checkout orders, transaction references, amounts, and statuses.
- `invoices`: Generated customer tax invoices with line items and downloadable PDF links.
- `usage_events`: Micro-metered records tracking exact system actions (scan ID, module, credit cost, timestamp).

---

## 8. REST API Architecture & Endpoint Catalog

All API endpoints are versioned under `/api/v1` with JSON request/response formats and JWT Bearer token authentication (except public scan, health, and webhooks).

```
/api/v1/
├── auth/               # User registration, login, JWT refresh, password reset
├── health              # Liveness, DB latency, engine readiness
├── public/scan         # Zero-auth public quick scan & site crawl
├── projects/           # Project CRUD, settings, and domain verification
├── scans/              # Crawl execution lifecycle, real-time logs, cancellation
├── seo/                # Traditional SEO pages, issues, recommendations, history
├── aeo/                # AEO questions, engine simulation, citations, monitoring
├── geo/                # GEO 8-factor scoring, brand profile, entity graph
├── actions/            # Action center, priority queue, fix verification
├── integrations/       # GSC, GA4, Ahrefs, Semrush, OpenAI OAuth/API sync
├── billing/            # Plans, subscriptions, credit wallet, checkout, webhooks
├── settings/           # System configuration, crawler limits, Brevo SMTP
└── contact             # Enterprise contact form and lead capture
```

### 8.1 Key Endpoint Specifications

#### `POST /api/v1/public/scan`
- **Description:** Public landing page scanner. Evaluates 260+ checkpoints.
- **Request Payload:**
  ```json
  {
    "url": "https://example.com",
    "mode": "page"
  }
  ```
- **Response Structure:**
  ```json
  {
    "url": "https://example.com",
    "final_url": "https://example.com/",
    "mode": "page",
    "overall_score": 78,
    "grade": "C",
    "seo": { "score": 82, "label": "Search Engine Optimization", "checks": 33, "issues": 6, "na_count": 0 },
    "aeo": { "score": 74, "label": "Answer Engine Optimization", "checks": 9, "issues": 2, "na_count": 0 },
    "geo": { "score": 76, "label": "Generative Engine Optimization", "checks": 15, "issues": 3, "na_count": 0 },
    "quick_wins": [ ... ],
    "issues": [ ... ],
    "site_report": null,
    "detected_tech": "SaaS (Next.js)",
    "detected_confidence": 92,
    "scan_duration_ms": 1420,
    "checks_run": 57,
    "success": true
  }
  ```

#### `POST /api/v1/projects/{project_id}/scans`
- **Description:** Dispatches an asynchronous full site or technical audit.
- **Request Payload:**
  ```json
  {
    "scan_type": "full_audit",
    "target_url": "https://example.com"
  }
  ```
- **Response:** Scan record with initial status `queued` and execution ID.

#### `GET /api/v1/scans/{scan_id}`
- **Description:** Polls scan execution state, current progress (0–100%), active step, and streaming log entries.

#### `POST /api/v1/scans/{scan_id}/cancel`
- **Description:** Gracefully terminates an active scan lifecycle.

#### `POST /api/v1/geo/projects/{project_id}/analyze`
- **Description:** Triggers an 8-factor GEO benchmark across target generative search models.

#### `POST /api/v1/actions/verify/{recommendation_id}`
- **Description:** Re-fetches the target URL in real-time to verify if an issue fix has been implemented.

#### `POST /api/v1/billing/checkout/session`
- **Description:** Generates a Stripe Checkout Session or Razorpay Order ID for subscription upgrades or credit purchases.

---

## 9. Frontend Architecture & Design System

### 9.1 Technical Stack
- **Framework:** Next.js 15.1 (React 19, App Router architecture).
- **Styling:** Vanilla TailwindCSS 3.4 with custom dark-modern tokens and sleek glassmorphism.
- **State Management:** React Hooks, Context API (`ToastContext`, `AuthContext`), and optimistic mutation updates.
- **Icons & Visuals:** `lucide-react` enterprise iconography with rich color semantics (Emerald = Safe/Passed, Amber = Warning/Moderate, Rose = Critical/Failed, Blue = Informational/Brand).
- **Typography:** `Inter` and `Outfit` modern sans-serif typography via `next/font/google`.

### 9.2 Route Architecture & Access Control
- **Public Marketing & Knowledge Pages:**
  - `/` (Home landing page with interactive hero scanner)
  - `/pricing` (Self-serve tiered pricing with annual discount toggle)
  - `/seo-optimization`, `/aeo-optimization`, `/geo-optimization`, `/ai-search-optimization`
  - `/seo-vs-aeo-vs-geo`, `/compare`, `/compare/zobay-rank-vs-traditional-seo-tools`
  - `/use-cases/saas`, `/use-cases/ecommerce`, `/use-cases/agencies`, `/use-cases/startups`, `/use-cases/marketing-teams`, `/use-cases/enterprise`
  - `/resources`, `/blog`, `/guides`, `/glossary` (8 deep-dive glossary subpages), `/faq`
  - `/about`, `/about-zobay-rank`, `/contact`, `/privacy-policy`, `/terms`, `/refund-policy`
- **Protected App Cockpit (`noindex, nofollow`):**
  - `/dashboard`: Unified Search Intelligence Command Center
  - `/overview`: Cross-pillar score trends and executive metrics
  - `/projects`: Project list and domain setup modal
  - `/projects/[id]/audit`: Live crawl tracker and execution terminal
  - `/seo/*`: Technical issues, crawled pages, link graphs, keywords, recommendations
  - `/aeo/*`: Tracked questions, answer engine simulation, citations, monitoring
  - `/geo/*`: 8-Factor scores, brand profile, competitor recommendations
  - `/billing`: Credit wallet, plan management, transaction usage, invoices
  - `/settings`: Crawler configuration, integration keys, Brevo SMTP settings

---

## 10. Security, Compliance & Production Infrastructure

### 10.1 Security Architecture
- **SSRF Immunity:** Multi-layered IP validation, socket DNS resolution, and strict CIDR blacklisting (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`, `100.64.0.0/10`).
- **Encrypted Secrets:** AES-256 encrypted storage for third-party API keys (OpenAI, Anthropic, GSC tokens).
- **Authentication & Sessions:** Cryptographically secure JWT tokens with expiry timestamps, bcrypt password hashing, and token invalidation on password reset.
- **Rate Limiting & Anti-Abuse:** SlowAPI / Redis-backed rate limiting per IP address on public endpoints.

### 10.2 Deployment & DevOps
- **Backend Runtime:** Python 3.11+ / Uvicorn with async worker processes. Windows Selector loop policy applied for Windows environments; Proactor / uvloop applied for Linux container environments.
- **Frontend Runtime:** Node.js 18+ / Next.js standalone container deployment.
- **Containerization:** Multi-container `docker-compose.yml` defining PostgreSQL 16, Redis 7, Backend, and Frontend.
- **Platform-as-a-Service Compatibility:** Fully configured for Render, Railway, AWS ECS, or Google Cloud Run via `render.yaml` and `Dockerfile`.

---

## 11. Product Roadmap & Strategic Horizons

```
┌─────────────────────────────────┐
│ PHASE 1: Core Foundation        │  ✅ COMPLETED
│ • Monorepo architecture         │  • Fast crawler state machine
│ • PostgreSQL schemas            │  • Public quick scan engine
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ PHASE 2: Tri-Pillar Engine      │  ✅ COMPLETED & LIVE
│ • 8-Factor GEO scoring engine   │  • Multi-engine LLM simulation
│ • AEO citation & entity parser  │  • Stripe & Razorpay billing
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ PHASE 3: Autonomous Remediation │  🔄 SCHEDULED (Q4 2026)
│ • Direct CMS webhooks (WP/Next) │  • Automated Pull Request fixes
│ • One-click JSON-LD injection   │  • Dynamic llms.txt generator
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ PHASE 4: Enterprise RAG Intel   │  🔮 HORIZON (Q1 2027)
│ • Vector database indexing      │  • Brand synthetic shadow testing
│ • Enterprise SSO / SAML         │  • Custom fine-tuned AI crawlers
└─────────────────────────────────┘
```

### 11.1 Key Performance Indicators (KPIs)
1. **Scan Completion Rate:** $>99.2\%$ of initiated crawl lifecycles terminate in `completed` without unhandled errors.
2. **Scan Latency:** Single page public scan latency $<3.5\text{s}$; 100-page full site crawl $<45\text{s}$.
3. **Accuracy & Determinism:** $100\%$ reproducible scores across identical page states.
4. **Lead-to-Signup Conversion:** Public quick scan tool conversion rate $>8.5\%$.
5. **AEO/GEO Citation Lift:** Customer domains achieve $>25\%$ lift in AI answer citations within 60 days of implementing recommendations.

---

## 12. Verification & Quality Assurance Sign-Off

This document accurately reflects the code, architecture, models, scoring algorithms, and user-facing capabilities of the Zobay Rank platform across:
- **Backend Modules:** `app/models/`, `app/services/seo/`, `app/services/aeo/`, `app/services/geo/`, `app/services/crawler/`, `app/services/credit_service.py`, `app/api/v1/`.
- **Frontend Modules:** Next.js 15 App Router (`src/app/`), Component Design System (`src/components/`), Type Definitions (`src/lib/types.ts`), SEO Configuration (`src/lib/seo.config.ts`).
- **Automated Validation:** Passes `npm run type-check`, `npm run seo:check` (53/53 passed), `npm run aeo:check` (27/27 passed), and `npm run geo:check` (7/7 passed).
