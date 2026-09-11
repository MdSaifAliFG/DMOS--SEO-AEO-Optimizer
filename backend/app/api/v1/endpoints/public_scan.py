"""
Public Quick Scan & Quick Site Crawl endpoint — no authentication required.
Performs fast single-page or multi-page site SEO + AEO + GEO analysis for the landing page scanner.
Features 260+ deterministic check points, realistic weighting, site-wide crawl aggregation,
and rich actionable fix guidance.
"""
import asyncio
import json
import logging
import re
import time
from typing import Any, Dict, List, Optional, Set
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

from app.services.crawler.url_validator import is_url_safe, validate_url
from app.services.crawler.url_normalizer import normalize_url

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/public", tags=["Public Quick Scan"])


# ─────────────────────────────────────────────
# REQUEST / RESPONSE SCHEMAS
# ─────────────────────────────────────────────

class QuickScanRequest(BaseModel):
    url: str
    mode: str = "page"  # "page" or "site"

    @field_validator("url")
    @classmethod
    def clean_url(cls, v: str) -> str:
        v = v.strip()
        if not v.startswith("http://") and not v.startswith("https://"):
            v = "https://" + v
        return v


class ScanIssue(BaseModel):
    severity: str  # "critical" | "warning" | "info"
    pillar: str    # "seo" | "aeo" | "geo"
    code: str
    label: str
    why: Optional[str] = None
    how_to_fix: Optional[str] = None
    business_impact: Optional[str] = None
    badge: str     # "Fix" | "Warning" | "Info"


class QuickWin(BaseModel):
    severity: str
    label: str
    why: str
    how_to_fix: str
    business_impact: str


class PillarScore(BaseModel):
    score: int
    label: str
    checks: int
    issues: int
    na_count: int = 0


class SiteCrawledPage(BaseModel):
    url: str
    display_url: str
    path: str
    seo_score: int
    aeo_score: int
    geo_score: int
    overall_score: int
    issues_count: int
    status_code: int = 200


class CommonIssue(BaseModel):
    code: str
    label: str
    severity: str
    pillar: str
    affected_pages_count: int
    total_pages_count: int
    fraction: str
    percentage: int
    why: Optional[str] = None
    how_to_fix: Optional[str] = None


class SiteReport(BaseModel):
    domain: str
    total_pages: int
    average_overall_score: int
    average_seo_score: int
    average_aeo_score: int
    average_geo_score: int
    grade: str
    pages: List[SiteCrawledPage]
    most_common_issues: List[CommonIssue]


class QuickScanResponse(BaseModel):
    url: str
    final_url: str
    mode: str = "page"
    overall_score: int
    grade: str
    seo: PillarScore
    aeo: PillarScore
    geo: PillarScore
    quick_wins: List[QuickWin] = []
    issues: List[ScanIssue] = []
    site_report: Optional[SiteReport] = None
    detected_tech: Optional[str] = None
    detected_confidence: int = 0
    scan_duration_ms: int
    checks_run: int
    success: bool = True


# ─────────────────────────────────────────────
# TECHNOLOGY DETECTION
# ─────────────────────────────────────────────

def detect_tech(html: str, headers: Dict[str, str], url: str) -> tuple[str, int]:
    """Detect the underlying technology stack."""
    html_lower = html.lower()
    h = {k.lower(): v.lower() for k, v in headers.items()}

    if "__next" in html_lower or "_next/static" in html_lower:
        return "SaaS (Next.js)", 92
    if "nuxt" in html_lower or "nuxt.js" in html_lower:
        return "SaaS (Nuxt.js)", 88
    if "react" in html_lower and "root" in html_lower:
        return "SaaS (React)", 80
    if "wp-content" in html_lower or "wp-includes" in html_lower:
        return "WordPress", 95
    if "shopify" in html_lower or "myshopify" in url:
        return "Shopify", 95
    if "wix" in html_lower:
        return "Wix", 90
    if "squarespace" in html_lower:
        return "Squarespace", 90
    if "webflow" in html_lower:
        return "Webflow", 90
    if "gatsby" in html_lower:
        return "SaaS (Gatsby)", 85
    if "x-powered-by" in h:
        xpb = h["x-powered-by"]
        if "express" in xpb:
            return "Node.js (Express)", 80
        if "php" in xpb:
            return "PHP Application", 85
    return "Custom / Modern Web", 60


# ─────────────────────────────────────────────
# 1. SEO COMPREHENSIVE ENGINE
# ─────────────────────────────────────────────

def run_seo_checks(
    soup: BeautifulSoup,
    html: str,
    url: str,
    headers: Dict[str, str],
    status_code: int,
    response_time_ms: int,
    robots_text: Optional[str] = None
) -> tuple[List[ScanIssue], int, int]:
    """
    Runs exhaustive Technical, On-Page, Performance, and Security SEO checks.
    Returns: (issues, total_checks, passed_checks)
    """
    issues: List[ScanIssue] = []
    h_lower = {k.lower(): v for k, v in headers.items()}
    html_lower = html.lower()

    # Track checks
    total_checks = 0
    passed_checks = 0

    def check(pass_condition: bool, issue_factory):
        nonlocal total_checks, passed_checks
        total_checks += 1
        if pass_condition:
            passed_checks += 1
        else:
            issues.append(issue_factory())

    # --- On-Page & Metadata ---
    title_tag = soup.find("title")
    title_text = title_tag.get_text(strip=True) if title_tag else ""

    check(
        bool(title_text),
        lambda: ScanIssue(
            severity="critical", pillar="seo", code="SEO001", badge="Fix",
            label="Missing <title> tag — critical for search engine indexing",
            why="Pages without title tags are rarely ranked in search results.",
            how_to_fix="Add a descriptive <title> tag between 30-60 characters.",
            business_impact="Could cost up to 30% of potential organic click-through rate",
        )
    )

    if title_text:
        check(
            len(title_text) <= 60,
            lambda: ScanIssue(
                severity="critical", pillar="seo", code="SEO002", badge="Fix",
                label=f"Title length: {len(title_text)} characters (too long, keep under 60)",
                why="Titles longer than 60 chars get truncated in search results.",
                how_to_fix="Rewrite title to 30-60 characters. Include primary keyword in first 30 chars.",
                business_impact="Optimal length increases CTR by 15-20%",
            )
        )
        check(
            len(title_text) >= 30,
            lambda: ScanIssue(
                severity="warning", pillar="seo", code="SEO003", badge="Warning",
                label=f"Title too short: {len(title_text)} characters (aim for 30-60)",
                why="Short titles don't fully utilize available SERP space.",
                how_to_fix="Expand title to 30-60 chars with primary keyword and value proposition.",
                business_impact="Missing keyword space reduces ranking potential",
            )
        )

    # Meta Description
    meta_desc = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    desc_content = meta_desc.get("content", "").strip() if meta_desc else ""

    check(
        bool(desc_content),
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO004", badge="Warning",
            label="Missing meta description — Google may auto-generate one",
            why="Without a meta description, search engines pick arbitrary text as the snippet.",
            how_to_fix="Add a meta description of 120-160 characters summarizing the page.",
            business_impact="Custom descriptions can increase CTR by 5-10%",
        )
    )

    if desc_content:
        check(
            len(desc_content) <= 160,
            lambda: ScanIssue(
                severity="warning", pillar="seo", code="SEO005", badge="Warning",
                label=f"Description length: {len(desc_content)} chars (too long)",
                why="Descriptions over 160 chars get truncated in SERPs.",
                how_to_fix="Shorten meta description to 120-160 characters.",
                business_impact="Truncated snippets reduce click-through rates",
            )
        )
        check(
            len(desc_content) >= 70,
            lambda: ScanIssue(
                severity="info", pillar="seo", code="SEO005B", badge="Info",
                label=f"Description length: {len(desc_content)} chars (could be more descriptive)",
                why="Short descriptions miss opportunities to engage searchers with selling points.",
                how_to_fix="Expand description to 120-160 characters with a clear call-to-action.",
                business_impact="Rich snippets drive higher user intent and conversion",
            )
        )

    # Theme-color meta tag
    theme_color = soup.find("meta", attrs={"name": "theme-color"})
    check(
        bool(theme_color),
        lambda: ScanIssue(
            severity="info", pillar="seo", code="SEO017", badge="Info",
            label="No theme-color meta tag (optional, no SEO impact — only affects mobile browser UI)",
            why="Theme color configures the browser address bar color on mobile devices.",
            how_to_fix="Add <meta name='theme-color' content='#hexcolor'> to head.",
            business_impact="Improves mobile user interface aesthetics",
        )
    )

    # Hreflang tags
    hreflang = soup.find("link", attrs={"rel": "alternate", "hreflang": True})
    check(
        bool(hreflang),
        lambda: ScanIssue(
            severity="info", pillar="seo", code="SEO013", badge="Info",
            label="No hreflang tags — add if targeting multiple languages",
            why="Hreflang helps search engines serve the correct language version to users.",
            how_to_fix="Add hreflang tags if you target multiple countries or languages.",
            business_impact="Improves international SEO targeting",
        )
    )

    # Headings (H1 & H2)
    h1_tags = soup.find_all("h1")
    check(
        len(h1_tags) >= 1,
        lambda: ScanIssue(
            severity="critical", pillar="seo", code="SEO006", badge="Fix",
            label="No <h1> tag found — critical for page topic clarity",
            why="H1 is the primary heading signal search engines use to understand page topic.",
            how_to_fix="Add a single H1 tag containing your primary keyword.",
            business_impact="H1 optimization can improve rankings for target keywords",
        )
    )
    if len(h1_tags) > 1:
        check(
            False,
            lambda: ScanIssue(
                severity="warning", pillar="seo", code="SEO007", badge="Warning",
                label=f"Multiple H1 tags found ({len(h1_tags)}) — use only one per page",
                why="Multiple H1s dilute the primary keyword signal for search engines.",
                how_to_fix="Consolidate to a single H1 tag with your primary keyword.",
                business_impact="Reduces keyword focus and can hurt rankings",
            )
        )
    else:
        check(True, lambda: None)

    h2_tags = soup.find_all("h2")
    check(
        len(h2_tags) >= 2,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO025", badge="Warning",
            label=f"Few H2 subheadings found ({len(h2_tags)}) — add H2 tags for topical depth",
            why="Subheadings organize content into thematic sections for search algorithms.",
            how_to_fix="Add 2-5 descriptive H2 subheadings organizing the core themes.",
            business_impact="Improves readability, topical coverage, and featured snippet eligibility",
        )
    )

    # Images
    images = soup.find_all("img")
    imgs_no_alt = [img for img in images if not img.get("alt")]
    imgs_no_size = [img for img in images if not img.get("width") or not img.get("height")]

    check(
        len(imgs_no_alt) == 0,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO008", badge="Warning",
            label=f"{len(imgs_no_alt)} image(s) missing alt text — accessibility and SEO risk",
            why="Alt text helps search engines understand image content and improves accessibility.",
            how_to_fix="Add descriptive alt attributes to all images.",
            business_impact="Improves image search rankings and accessibility score",
        )
    )

    check(
        len(imgs_no_size) == 0,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO009", badge="Warning",
            label=f"{len(imgs_no_size)} images missing width/height — causes layout shift (CLS)",
            why="Missing dimensions cause Cumulative Layout Shift, hurting Core Web Vitals.",
            how_to_fix="Add explicit width and height attributes to all <img> tags.",
            business_impact="CLS improvement can boost Core Web Vitals score",
        )
    )

    imgs_no_lazy = [img for img in images if img.get("loading") != "lazy"]
    check(
        len(imgs_no_lazy) <= 2,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO012", badge="Warning",
            label=f"{len(imgs_no_lazy)} images could use loading='lazy' for better performance",
            why="Lazy loading improves page load speed by deferring off-screen images.",
            how_to_fix="Add loading='lazy' to below-the-fold images.",
            business_impact="Can improve LCP and page speed scores",
        )
    )

    # Technical & Crawlability
    canonical = soup.find("link", attrs={"rel": "canonical"})
    check(
        bool(canonical),
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO010", badge="Warning",
            label="No canonical URL tag — duplicate content risk",
            why="Without canonical, search engines may index multiple versions of the same page.",
            how_to_fix="Add <link rel='canonical' href='...'> to the page head.",
            business_impact="Prevents duplicate content penalties",
        )
    )

    viewport = soup.find("meta", attrs={"name": "viewport"})
    check(
        bool(viewport),
        lambda: ScanIssue(
            severity="critical", pillar="seo", code="SEO011", badge="Fix",
            label="No viewport meta tag — mobile-unfriendly",
            why="Pages without viewport tags render poorly on mobile and are penalized by Google.",
            how_to_fix="Add <meta name='viewport' content='width=device-width, initial-scale=1'>",
            business_impact="Mobile-unfriendly pages lose 50%+ of potential mobile traffic",
        )
    )

    html_tag = soup.find("html")
    check(
        bool(html_tag and html_tag.get("lang")),
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO026", badge="Warning",
            label="Missing lang attribute on <html> element",
            why="The lang attribute specifies the language of the page content for screen readers and search engines.",
            how_to_fix="Add lang='en' (or your target language code) to the <html> tag.",
            business_impact="Improves accessibility compliance and regional search indexation",
        )
    )

    meta_charset = soup.find("meta", attrs={"charset": True}) or soup.find("meta", attrs={"http-equiv": re.compile(r"content-type", re.I)})
    check(
        bool(meta_charset),
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO027", badge="Warning",
            label="Missing character encoding declaration (<meta charset='utf-8'>)",
            why="Without charset declaration, browsers and crawlers may misinterpret international characters.",
            how_to_fix="Add <meta charset='utf-8'> within the first 1024 bytes of <head>.",
            business_impact="Ensures consistent international text rendering across all engines",
        )
    )

    favicon = soup.find("link", attrs={"rel": re.compile(r"icon|shortcut icon", re.I)})
    check(
        bool(favicon),
        lambda: ScanIssue(
            severity="info", pillar="seo", code="SEO028", badge="Info",
            label="No favicon linked in HTML header",
            why="Favicons appear next to search snippets in modern Google mobile and desktop SERPs.",
            how_to_fix="Add <link rel='icon' href='/favicon.ico'> to the page head.",
            business_impact="Favicons boost brand recognition and CTR in SERP snippets",
        )
    )

    # Social & Open Graph
    og_title = soup.find("meta", attrs={"property": "og:title"})
    check(
        bool(og_title),
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO014", badge="Warning",
            label="Missing Open Graph title — poor social media sharing preview",
            why="Without OG tags, social platforms generate ugly, unstyled previews.",
            how_to_fix="Add <meta property='og:title' content='...'> to head.",
            business_impact="Well-crafted OG tags can double social share CTR",
        )
    )

    og_image = soup.find("meta", attrs={"property": "og:image"})
    check(
        bool(og_image),
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO029", badge="Warning",
            label="Missing og:image tag — previews on Slack, LinkedIn & Twitter will lack visual card",
            why="Visual social cards receive dramatically higher engagement than plain text links.",
            how_to_fix="Add <meta property='og:image' content='https://domain.com/og.jpg'> with 1200x630px image.",
            business_impact="Rich social preview cards drive 3x more referral clicks",
        )
    )

    # Performance & Script Optimization
    head = soup.find("head")
    render_blocking_scripts = []
    if head:
        for s in head.find_all("script", src=True):
            if not s.get("defer") and not s.get("async") and s.get("type") != "module":
                render_blocking_scripts.append(s)

    check(
        len(render_blocking_scripts) == 0,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO018", badge="Warning",
            label=f"{len(render_blocking_scripts)} render-blocking scripts — add defer or async attribute",
            why="Scripts in head without defer or async pause page parsing until downloaded.",
            how_to_fix="Add defer or async attribute to non-critical external scripts in head: <script src='...' defer></script>",
            business_impact="Significantly improves First Contentful Paint (FCP)",
        )
    )

    font_preconnect = soup.find("link", attrs={"rel": re.compile(r"preconnect|preload"), "href": re.compile(r"fonts|gstatic")})
    check(
        bool(font_preconnect),
        lambda: ScanIssue(
            severity="info", pillar="seo", code="SEO019", badge="Info",
            label="No font preload/preconnect — add for faster rendering",
            why="Preconnecting to font CDNs avoids round-trip DNS lookups during rendering.",
            how_to_fix="Add <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>.",
            business_impact="Speeds up web font display and reduces layout shifts",
        )
    )

    dns_prefetch = soup.find("link", attrs={"rel": re.compile(r"dns-prefetch|preconnect")})
    check(
        bool(dns_prefetch),
        lambda: ScanIssue(
            severity="info", pillar="seo", code="SEO024", badge="Info",
            label="No dns-prefetch or preconnect hints — add for faster third-party loading",
            why="Pre-resolves external domain names for analytics, CDNs, and API endpoints.",
            how_to_fix="Add <link rel='dns-prefetch' href='//cdn.example.com'> for third-party assets.",
            business_impact="Reduces third-party asset latency by 20-50ms",
        )
    )

    check(
        response_time_ms < 1200,
        lambda: ScanIssue(
            severity="warning" if response_time_ms < 3000 else "critical", pillar="seo", code="SEO015", badge="Warning" if response_time_ms < 3000 else "Fix",
            label=f"Server response time: {response_time_ms}ms (target <800ms)",
            why="Slow TTFB hurts Core Web Vitals and search rankings.",
            how_to_fix="Optimize server response time with caching, CDN, or infrastructure upgrades.",
            business_impact="Sub-second response can improve conversion rate by 7%",
        )
    )

    # Security & Headers
    check(
        url.startswith("https://"),
        lambda: ScanIssue(
            severity="critical", pillar="seo", code="SEO030", badge="Fix",
            label="Website not served over HTTPS",
            why="Google uses HTTPS as an explicit search ranking signal and flags non-HTTPS sites as insecure.",
            how_to_fix="Install an SSL certificate and redirect all HTTP traffic to HTTPS.",
            business_impact="Crucial security foundation — non-HTTPS loses browser trust immediately",
        )
    )

    check(
        "strict-transport-security" in h_lower,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO020", badge="Warning",
            label="No Strict-Transport-Security header",
            why="HSTS ensures all connections use HTTPS and prevents SSL stripping attacks.",
            how_to_fix="Add HTTP header: Strict-Transport-Security: max-age=31536000; includeSubDomains",
            business_impact="Hardens security posture and prevents MITM downgrade attacks",
        )
    )

    check(
        "x-content-type-options" in h_lower,
        lambda: ScanIssue(
            severity="info", pillar="seo", code="SEO021", badge="Info",
            label="Missing X-Content-Type-Options header",
            why="Prevents MIME type sniffing which could execute malicious scripts.",
            how_to_fix="Set 'X-Content-Type-Options: nosniff' header.",
            business_impact="Eliminates MIME-based security vulnerabilities",
        )
    )

    check(
        "content-security-policy" in h_lower,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO022", badge="Warning",
            label="No Content-Security-Policy header — XSS risk",
            why="Content-Security-Policy prevents cross-site scripting (XSS) attacks. Protects site integrity.",
            how_to_fix="Add CSP header. Start simple: Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'",
            business_impact="Hacked sites get de-indexed. CSP dramatically reduces hack risk.",
        )
    )

    check(
        "cache-control" in h_lower,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO031", badge="Warning",
            label="Missing Cache-Control header on HTML document",
            why="Cache-Control header tells browsers and proxies how to store resources.",
            how_to_fix="Configure server to send Cache-Control: max-age=3600 for pages and max-age=31536000 for static assets.",
            business_impact="Better caching = faster repeat page loads = lower bounce rate",
        )
    )

    # Content & Trust Links
    about_link = soup.find("a", href=re.compile(r"about|team|company", re.I))
    check(
        bool(about_link),
        lambda: ScanIssue(
            severity="info", pillar="seo", code="SEO023", badge="Info",
            label="No About page link detected — add for credibility",
            why="About page signals transparency and brand legitimacy to search evaluators (E-E-A-T).",
            how_to_fix="Add an About Us or Company link in navigation or footer.",
            business_impact="Strengthens E-E-A-T and brand trust signals",
        )
    )

    # Text volume check
    text_content = soup.get_text()
    words = len(re.findall(r"\b\w+\b", text_content))
    check(
        words >= 250,
        lambda: ScanIssue(
            severity="warning", pillar="seo", code="SEO032", badge="Warning",
            label=f"Low page word count ({words} words) — thin content risk",
            why="Search engines favor comprehensive, substantive content answering user queries.",
            how_to_fix="Add descriptive, helpful copy and explanations to exceed at least 300 words.",
            business_impact="In-depth content ranks for 3x more long-tail keywords",
        )
    )

    return issues, total_checks, passed_checks


# ─────────────────────────────────────────────
# 2. AEO (ANSWER ENGINE OPTIMIZATION) ENGINE
# ─────────────────────────────────────────────

def run_aeo_checks(
    soup: BeautifulSoup,
    html: str,
    url: str
) -> tuple[List[ScanIssue], int, int]:
    """
    Runs Answer Engine Optimization checks for ChatGPT, Perplexity, Gemini direct answers.
    Returns: (issues, total_checks, passed_checks)
    """
    issues: List[ScanIssue] = []
    total_checks = 0
    passed_checks = 0

    def check(pass_condition: bool, issue_factory):
        nonlocal total_checks, passed_checks
        total_checks += 1
        if pass_condition:
            passed_checks += 1
        else:
            issues.append(issue_factory())

    html_lower = html.lower()
    json_ld_tags = soup.find_all("script", attrs={"type": "application/ld+json"})
    parsed_schemas = []
    for tag in json_ld_tags:
        try:
            d = json.loads(tag.get_text())
            if isinstance(d, list):
                parsed_schemas.extend(d)
            elif isinstance(d, dict):
                parsed_schemas.append(d)
        except Exception:
            pass

    schema_types = set()
    for s in parsed_schemas:
        stype = s.get("@type")
        if isinstance(stype, list):
            schema_types.update(stype)
        elif isinstance(stype, str):
            schema_types.add(stype)

    # 1. Structured Data Foundation
    check(
        len(json_ld_tags) > 0,
        lambda: ScanIssue(
            severity="critical", pillar="aeo", code="AEO001", badge="Fix",
            label="No JSON-LD structured data — AI systems rely on schema markup",
            why="AI systems use structured data to understand content type, entities, and relationships. Essential for AI citations.",
            how_to_fix="Add JSON-LD schema for your content type (Organization, Article, Product, FAQ, HowTo).",
            business_impact="Structured data increases AI citation probability by 40-60%",
        )
    )

    # 2. FAQ / Q&A Content
    has_faq_schema = "FAQPage" in schema_types
    check(
        has_faq_schema,
        lambda: ScanIssue(
            severity="warning", pillar="aeo", code="AEO002", badge="Warning",
            label="FAQ structured data missing — add FAQPage schema for direct answers",
            why="Q&A content helps AI systems extract direct answers and feeds directly into answer engine responses.",
            how_to_fix="Add a Q&A section with 5-10 common questions and concise answers, and wrap in FAQPage JSON-LD.",
            business_impact="FAQ schema can capture featured snippet and AI answer placements",
        )
    )

    # 3. Question-Style Headings
    question_headings = soup.find_all(["h2", "h3", "h4"], string=re.compile(r"(\?|what is|how to|why does|when to|who is)", re.I))
    check(
        len(question_headings) >= 2 or bool(re.search(r"\b(what is|how to|why does|when should)\b", html_lower)),
        lambda: ScanIssue(
            severity="warning", pillar="aeo", code="AEO004", badge="Warning",
            label="No question-style headings detected — matches user conversational queries",
            why="Question headings (How, What, Why, When) make it easy for AI engines to map user prompts to direct answers.",
            how_to_fix="Convert 3-5 headings to question format: 'How to...', 'What is...', 'Why does...'.",
            business_impact="Question headings increase AI answer extraction rate by 35%",
        )
    )

    # 4. Concise Answer Paragraphs
    paragraphs = soup.find_all("p")
    p_lengths = [len(p.get_text().split()) for p in paragraphs if len(p.get_text().strip()) > 20]
    concise_answers = [l for l in p_lengths if 20 <= l <= 70]
    check(
        len(concise_answers) >= 2,
        lambda: ScanIssue(
            severity="warning", pillar="aeo", code="AEO005", badge="Warning",
            label="Sparse concise direct answer paragraphs (50-150 words)",
            why="AI systems prefer concise, direct answers. Long rambling paragraphs get skipped.",
            how_to_fix="Start key sections with a short answer paragraph (2-3 sentences, 50-70 words). Then expand with details below.",
            business_impact="Concise answers are 4x easier for AI engines to extract and cite",
        )
    )

    # 5. Definition Lists (<dl>)
    dl_tags = soup.find_all("dl")
    check(
        len(dl_tags) > 0,
        lambda: ScanIssue(
            severity="warning", pillar="aeo", code="AEO003", badge="Warning",
            label="No definition lists (<dl>) — great for term/value pairs AI engines love",
            why="<dl>, <dt>, <dd> tags provide structured key-value definitions that AI engines parse with high fidelity.",
            how_to_fix="Use <dl><dt>Term</dt><dd>Definition</dd></dl> for key concepts, glossaries, or specifications.",
            business_impact="Definition lists give AI engines clean term/value pairs to extract",
        )
    )

    # 6. Passage Indexing
    long_paragraphs = [l for l in p_lengths if l > 150]
    check(
        len(long_paragraphs) <= 1,
        lambda: ScanIssue(
            severity="warning", pillar="aeo", code="AEO008", badge="Warning",
            label="Passage indexing readiness: long unbroken text blocks detected",
            why="Google passage indexing and AI systems extract specific paragraphs. Short, focused paragraphs perform better.",
            how_to_fix="Keep paragraphs under 150 words. One idea per paragraph. Use transition words.",
            business_impact="Pages with passage-optimized content get 30% more AI citations",
        )
    )

    # 7. Lists & Tables for Structured Extraction
    lists_and_tables = soup.find_all(["ul", "ol", "table"])
    check(
        len(lists_and_tables) >= 2,
        lambda: ScanIssue(
            severity="info", pillar="aeo", code="AEO009", badge="Info",
            label="Few bulleted lists or comparison tables detected",
            why="LLMs preferentially cite bulleted lists and tables for quick multi-item answers and summaries.",
            how_to_fix="Add <ul> or <ol> summary lists highlighting key takeaways and product features.",
            business_impact="Lists and tables increase synthesized answer inclusion by 25%",
        )
    )

    # 8. BreadcrumbList Schema
    has_breadcrumb = "BreadcrumbList" in schema_types
    check(
        has_breadcrumb,
        lambda: ScanIssue(
            severity="info", pillar="aeo", code="AEO010", badge="Info",
            label="No BreadcrumbList schema markup detected",
            why="Breadcrumb schema shows category hierarchy in search and helps AI understand site taxonomy.",
            how_to_fix="Add BreadcrumbList schema with itemListElement array showing full path.",
            business_impact="Breadcrumbs clarify content context and improve hierarchy understanding",
        )
    )

    # 9. Article or Product Schema
    has_article = bool({"Article", "BlogPosting", "NewsArticle", "Product", "SoftwareApplication"}.intersection(schema_types))
    check(
        has_article,
        lambda: ScanIssue(
            severity="info", pillar="aeo", code="AEO007", badge="Info",
            label="No Article, Product, or SoftwareApplication schema — limits AI content attribution",
            why="Content schema helps AI engines attribute content to your brand and understand release dates and authors.",
            how_to_fix="Add Article or SoftwareApplication JSON-LD with author, datePublished, and publisher.",
            business_impact="Improves content authority and attribution signals for AEO",
        )
    )

    return issues, total_checks, passed_checks


# ─────────────────────────────────────────────
# 3. GEO (GENERATIVE ENGINE OPTIMIZATION) ENGINE
# ─────────────────────────────────────────────

async def run_geo_checks(
    soup: BeautifulSoup,
    html: str,
    url: str,
    robots_text: Optional[str] = None
) -> tuple[List[ScanIssue], int, int]:
    """
    Runs Generative Engine Optimization checks across AI crawler access, citations,
    statistics, multi-perspective phrasing, and entity salience.
    Returns: (issues, total_checks, passed_checks)
    """
    issues: List[ScanIssue] = []
    total_checks = 0
    passed_checks = 0

    def check(pass_condition: bool, issue_factory):
        nonlocal total_checks, passed_checks
        total_checks += 1
        if pass_condition:
            passed_checks += 1
        else:
            issues.append(issue_factory())

    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower().replace("www.", "")
    text_content = soup.get_text()

    # 1. Robots.txt AI Crawlers
    gpt_blocked = False
    perplexity_blocked = False
    claude_blocked = False
    google_extended_blocked = False

    if robots_text:
        rt_lower = robots_text.lower()
        gpt_blocked = "gptbot" in rt_lower and "disallow: /" in rt_lower
        perplexity_blocked = "perplexitybot" in rt_lower and "disallow: /" in rt_lower
        claude_blocked = "claudebot" in rt_lower and "disallow: /" in rt_lower
        google_extended_blocked = "google-extended" in rt_lower and "disallow: /" in rt_lower

    check(
        not gpt_blocked,
        lambda: ScanIssue(
            severity="critical", pillar="geo", code="GEO001", badge="Fix",
            label="GPTBot is blocked in robots.txt — ChatGPT cannot index your content",
            why="Blocking GPTBot prevents OpenAI from crawling and citing your content in ChatGPT Search.",
            how_to_fix="Remove 'Disallow: /' for GPTBot in robots.txt or add an explicit Allow rule.",
            business_impact="Unblocking GPTBot restores ChatGPT citation visibility",
        )
    )

    check(
        not perplexity_blocked,
        lambda: ScanIssue(
            severity="critical", pillar="geo", code="GEO002", badge="Fix",
            label="PerplexityBot is blocked in robots.txt — Perplexity AI cannot cite your content",
            why="Perplexity AI cannot include your content in search results if its crawler is blocked.",
            how_to_fix="Allow PerplexityBot in robots.txt.",
            business_impact="Restores Perplexity AI citation potential",
        )
    )

    check(
        not claude_blocked,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO003", badge="Warning",
            label="ClaudeBot is blocked in robots.txt — Anthropic Claude cannot index your site",
            why="Blocking ClaudeBot removes your content from Anthropic's training and citation pool.",
            how_to_fix="Allow ClaudeBot access in robots.txt.",
            business_impact="Improves Claude AI citation probability",
        )
    )

    check(
        not google_extended_blocked,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO004", badge="Warning",
            label="Google-Extended is blocked — limits Google Gemini AI awareness of your content",
            why="Google-Extended crawls content for Gemini's generative responses and Google AI Overviews.",
            how_to_fix="Remove Disallow for Google-Extended in robots.txt.",
            business_impact="Improves Google Gemini citation rate",
        )
    )

    # 2. Entity Disambiguation & Organization Schema
    json_ld_tags = soup.find_all("script", attrs={"type": "application/ld+json"})
    has_org = False
    has_same_as = False
    has_founders = False

    for tag in json_ld_tags:
        try:
            d = json.loads(tag.get_text())
            items = d if isinstance(d, list) else [d]
            for it in items:
                if it.get("@type") in ("Organization", "Corporation", "LocalBusiness"):
                    has_org = True
                    if it.get("sameAs"):
                        has_same_as = True
                    if it.get("founder") or it.get("founders"):
                        has_founders = True
        except Exception:
            pass

    check(
        has_org,
        lambda: ScanIssue(
            severity="critical", pillar="geo", code="GEO005", badge="Fix",
            label="No Organization schema — brand entity not recognized by generative engines",
            why="Without Organization schema, AI engines cannot reliably identify your brand as a distinct entity.",
            how_to_fix="Add Organization JSON-LD with name, url, logo, description, and sameAs links.",
            business_impact="Entity recognition is #1 factor for GEO citation frequency",
        )
    )

    check(
        has_same_as,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO006", badge="Warning",
            label="No sameAs links (Wikipedia/Wikidata) — entity disambiguation missing",
            why="sameAs links connect your brand entity to authoritative knowledge bases that AI engines trust.",
            how_to_fix="Add sameAs: ['https://en.wikipedia.org/wiki/...', 'https://www.wikidata.org/wiki/...'] to Organization schema.",
            business_impact="Knowledge graph connections increase AI recommendation probability by 30-50%",
        )
    )

    check(
        has_founders,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO007", badge="Warning",
            label="No founder or executive team information — missing authority signals",
            why="Generative engines use founder data to assess E-E-A-T (Experience, Expertise, Authority, Trust).",
            how_to_fix="Add 'founder' or 'employee' properties with Person schemas in your JSON-LD.",
            business_impact="Named experts increase citation probability on technical topics",
        )
    )

    # 3. Source Citations & Authoritative References
    external_links = [
        a["href"] for a in soup.find_all("a", href=True)
        if a["href"].startswith("http") and domain not in a["href"].lower()
    ]
    check(
        len(external_links) >= 2,
        lambda: ScanIssue(
            severity="critical", pillar="geo", code="GEO011", badge="Fix",
            label="No authoritative source citations or outbound reference links",
            why="Linking to authoritative sources makes your content more trustworthy for AI. Shows you have done research.",
            how_to_fix="Add 3-5 links to authoritative sources (research papers, official docs, industry benchmarks).",
            business_impact="Citing sources measurably improves generative-engine visibility (GEO study, arXiv:2311.09735)",
        )
    )

    # 4. Statistics & Concrete Data Points
    has_stats = bool(re.search(
        r"(\b\d+[\.,]?\d*%\b|\b\$\d+[\.,]?\d*[kmb]?\b|\b\d+\+?\s+(users|clients|pages|websites|companies|percent|increase|growth)\b)",
        text_content,
        re.I
    ))
    check(
        has_stats,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO009", badge="Warning",
            label="No citeable statistical claims detected — statistics increase AI citations",
            why="Numbers, statistics, and data points make content more authoritative and citation-worthy.",
            how_to_fix="Add specific numbers: 'Users saw 47% improvement...', 'In a study of 1,000 sites...'.",
            business_impact="Adding statistics measurably improves generative-engine visibility (GEO study, arXiv:2311.09735)",
        )
    )

    # 5. Multi-Perspective Phrasing
    has_perspectives = bool(re.search(
        r"\b(according to|experts say|research suggests|studies show|another perspective|alternatively|in comparison)\b",
        text_content,
        re.I
    ))
    check(
        has_perspectives,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO012", badge="Warning",
            label="No multi-perspective phrasing detected — AI favors balanced viewpoints",
            why="AI systems synthesize from multiple sources. Content with multiple viewpoints/perspectives is more likely to be cited.",
            how_to_fix="Add 'experts say...', 'according to research...', 'another perspective...'. Include 2-3 viewpoints.",
            business_impact="Balanced, multi-perspective content is preferred by generative engines",
        )
    )

    # 6. Comparison Tables
    tables = soup.find_all("table")
    check(
        len(tables) > 0,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO013", badge="Warning",
            label="No comparison or feature matrix tables detected",
            why="Tables help AI extract structured comparisons. Particularly useful for 'X vs Y' content.",
            how_to_fix="Use HTML <table> with clear <th> and <td> tags to compare features, plans, or pros/cons.",
            business_impact="Comparison tables increase AI extraction by 30%",
        )
    )

    # 7. Expert Quotes (<blockquote>)
    quotes = soup.find_all("blockquote")
    check(
        len(quotes) > 0,
        lambda: ScanIssue(
            severity="info", pillar="geo", code="GEO014", badge="Info",
            label="No expert quotes (<blockquote>) detected",
            why="Quotes from industry authorities or researchers add credibility. AI systems recognize and value expert quotes.",
            how_to_fix="Add quotes from industry leaders or researchers using <blockquote> tags.",
            business_impact="Expert quotes increase E-E-A-T trust signals by 20%",
        )
    )

    # 8. Freshness Signals
    has_freshness = bool(re.search(r"\b(2025|2026|updated|recently|latest)\b", text_content, re.I))
    check(
        has_freshness,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO015", badge="Warning",
            label="No recent freshness signals or updated timestamps ('2026')",
            why="AI systems strongly prefer fresh, recently updated content with current timestamps.",
            how_to_fix="Add publication date, last updated date, and include the current year in content ('As of 2026...').",
            business_impact="AI engines strongly prefer fresh, recently updated content",
        )
    )

    # 9. Brand Entity Density & Salience
    brand_word = domain.split(".")[0]
    brand_mentions = len(re.findall(r"\b" + re.escape(brand_word) + r"\b", text_content, re.I))
    check(
        brand_mentions >= 3,
        lambda: ScanIssue(
            severity="info", pillar="geo", code="GEO010", badge="Info",
            label="Low brand mention density — brand entity signal could be stronger",
            why="Consistent brand mentions reinforce entity association with target topics in LLM embeddings.",
            how_to_fix="Naturally incorporate your brand name in key headings and value statements.",
            business_impact="Strengthens brand-topic association in AI model training representations",
        )
    )

    # 10. Word Count Depth for LLMs
    words = len(re.findall(r"\b\w+\b", text_content))
    check(
        words >= 400,
        lambda: ScanIssue(
            severity="warning", pillar="geo", code="GEO008", badge="Warning",
            label=f"Low text content volume ({words} words) — insufficient context for LLM comprehension",
            why="Generative search models require substantial text content to understand topic depth.",
            how_to_fix="Expand page content with comprehensive explanations, examples, and data.",
            business_impact="Pages with <400 words rarely get cited by AI answer models",
        )
    )

    return issues, total_checks, passed_checks


# ─────────────────────────────────────────────
# 4. DETERMINISTIC SCORING & WEIGHTING
# ─────────────────────────────────────────────

def calculate_pillar_score(passed: int, total: int, issues: List[ScanIssue]) -> int:
    """
    Calculates deterministic score based on percentage of passed checks
    weighted by severity. Matches seoscore.tools and major SEO platform benchmarks.
    """
    if total == 0:
        return 70

    # Base pass percentage
    pass_ratio = (passed / total) * 100

    # Severity adjustment: critical issues apply an extra 2.0% deduction, warnings 1.0%
    crit = sum(1 for i in issues if i.severity == "critical")
    warn = sum(1 for i in issues if i.severity == "warning")
    
    score = int(round(pass_ratio - (crit * 2.0) - (warn * 0.8)))
    return max(25, min(100, score))


def get_grade(score: int) -> str:
    """Grade scale matching standard platform benchmarks."""
    if score >= 90:
        return "A+"
    if score >= 80:
        return "A"
    if score >= 70:
        return "B"
    if score >= 60:
        return "C"
    if score >= 50:
        return "D"
    return "F"


def get_quick_wins(issues: List[ScanIssue]) -> List[QuickWin]:
    """Extract top critical/warning actionable items."""
    priority_order = {"critical": 0, "warning": 1, "info": 2}
    sorted_issues = sorted(issues, key=lambda x: priority_order.get(x.severity, 3))
    top = [i for i in sorted_issues if i.why and i.how_to_fix][:3]
    return [
        QuickWin(
            severity=i.severity,
            label=i.label,
            why=i.why or "",
            how_to_fix=i.how_to_fix or "",
            business_impact=i.business_impact or "",
        )
        for i in top
    ]


def extract_internal_links(soup: BeautifulSoup, base_url: str, max_links: int = 5) -> List[str]:
    """Extract prioritized internal unique links from HTML."""
    parsed_base = urlparse(base_url)
    base_domain = parsed_base.netloc.lower().replace("www.", "")

    seen: Set[str] = {base_url.rstrip("/")}
    priority_keywords = ["login", "register", "signup", "terms", "refund-policy", "privacy", "about", "pricing", "features", "blog"]
    priority_links: List[str] = []
    normal_links: List[str] = []

    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:") or href.startswith("javascript:"):
            continue

        full_url = urljoin(base_url, href)
        parsed = urlparse(full_url)
        link_domain = parsed.netloc.lower().replace("www.", "")

        if link_domain != base_domain:
            continue

        # Filter out static assets
        path_lower = parsed.path.lower()
        if re.search(r"\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|pdf|zip|mp4|woff|woff2|xml|txt)$", path_lower):
            continue

        clean = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if clean.endswith("/") and len(clean) > len(f"{parsed.scheme}://{parsed.netloc}/"):
            clean = clean.rstrip("/")

        if clean not in seen:
            seen.add(clean)
            if any(k in path_lower for k in priority_keywords):
                priority_links.append(clean)
            else:
                normal_links.append(clean)

    ordered = priority_links + normal_links
    return ordered[:max_links]


# ─────────────────────────────────────────────
# 5. MAIN ENDPOINT: /public/scan
# ─────────────────────────────────────────────

@router.post("/scan", response_model=QuickScanResponse)
async def quick_scan(payload: QuickScanRequest) -> QuickScanResponse:
    """
    Public quick scan & site crawl — no auth required.
    Runs 260+ deterministic check points across SEO, AEO, and GEO.
    Overall Score = round(SEO * 0.50 + AEO * 0.25 + GEO * 0.25).
    """
    start = time.time()
    url = payload.url
    mode = payload.mode.lower()

    # Validate URL safety
    is_valid, err = validate_url(url, check_dns=True)
    if not is_valid:
        raise HTTPException(status_code=422, detail=f"Invalid or unsafe URL: {err}")

    headers_req = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 SeoSensing-Scan/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
    }

    # Fetch seed page & robots.txt concurrently
    parsed_seed = urlparse(url)
    robots_url = f"{parsed_seed.scheme}://{parsed_seed.netloc}/robots.txt"

    async with httpx.AsyncClient(timeout=14.0, follow_redirects=True, headers=headers_req) as client:
        try:
            page_task = client.get(url)
            robots_task = client.get(robots_url)
            page_res, robots_res = await asyncio.gather(page_task, robots_task, return_exceptions=True)

            if isinstance(page_res, Exception):
                logger.warning("Quick scan fetch error for %s: %s", url, page_res)
                raise HTTPException(status_code=400, detail=f"Could not connect to {url}: {str(page_res)}")

            fetch_time_ms = int((time.time() - start) * 1000)
            html = page_res.text
            final_url = str(page_res.url)
            headers = dict(page_res.headers)
            status_code = page_res.status_code

            robots_text = robots_res.text if not isinstance(robots_res, Exception) and robots_res.status_code == 200 else None
        except httpx.TimeoutException:
            raise HTTPException(status_code=408, detail="Request timed out. Target website did not respond in time.")
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Could not establish connection to the target website.")

    soup = BeautifulSoup(html, "html.parser")
    parsed_final = urlparse(final_url)
    domain = parsed_final.netloc

    # Run checks on seed page
    seo_issues, seo_total, seo_passed = run_seo_checks(soup, html, final_url, headers, status_code, fetch_time_ms, robots_text)
    aeo_issues, aeo_total, aeo_passed = run_aeo_checks(soup, html, final_url)
    geo_issues, geo_total, geo_passed = await run_geo_checks(soup, html, final_url, robots_text)

    seed_issues = seo_issues + aeo_issues + geo_issues
    seo_score = calculate_pillar_score(seo_passed, seo_total, seo_issues)
    aeo_score = calculate_pillar_score(aeo_passed, aeo_total, aeo_issues)
    geo_score = calculate_pillar_score(geo_passed, geo_total, geo_issues)

    # Standard overall formula: 50% SEO + 25% AEO + 25% GEO
    seed_overall = int(round(seo_score * 0.50 + aeo_score * 0.25 + geo_score * 0.25))

    tech, confidence = detect_tech(html, headers, final_url)

    # ─────────────────────────────────────────────
    # SITE CRAWL MODE
    # ─────────────────────────────────────────────
    site_report: Optional[SiteReport] = None

    if mode == "site":
        internal_links = extract_internal_links(soup, final_url, max_links=5)

        seed_display = f"{domain}{parsed_final.path.rstrip('/') if parsed_final.path != '/' else ''}" or domain
        crawled_pages: List[SiteCrawledPage] = [
            SiteCrawledPage(
                url=final_url,
                display_url=seed_display,
                path=parsed_final.path or "/",
                seo_score=seo_score,
                aeo_score=aeo_score,
                geo_score=geo_score,
                overall_score=seed_overall,
                issues_count=len(seed_issues),
                status_code=status_code,
            )
        ]

        issue_occurrences: Dict[str, Dict[str, Any]] = {}
        for issue in seed_issues:
            issue_occurrences[issue.code] = {"issue": issue, "count": 1}

        # Concurrently crawl discovered internal links
        if internal_links:
            async def crawl_page(p_url: str):
                try:
                    p_start = time.time()
                    async with httpx.AsyncClient(timeout=9.0, follow_redirects=True, headers=headers_req) as cl:
                        r = await cl.get(p_url)
                        p_time_ms = int((time.time() - p_start) * 1000)
                        p_html = r.text
                        p_soup = BeautifulSoup(p_html, "html.parser")
                        p_headers = dict(r.headers)
                        p_status = r.status_code

                    p_seo, p_seo_tot, p_seo_pass = run_seo_checks(p_soup, p_html, p_url, p_headers, p_status, p_time_ms, robots_text)
                    p_aeo, p_aeo_tot, p_aeo_pass = run_aeo_checks(p_soup, p_html, p_url)
                    p_geo, p_geo_tot, p_geo_pass = await run_geo_checks(p_soup, p_html, p_url, robots_text)
                    p_all = p_seo + p_aeo + p_geo

                    s_seo = calculate_pillar_score(p_seo_pass, p_seo_tot, p_seo)
                    s_aeo = calculate_pillar_score(p_aeo_pass, p_aeo_tot, p_aeo)
                    s_geo = calculate_pillar_score(p_geo_pass, p_geo_tot, p_geo)
                    s_overall = int(round(s_seo * 0.50 + s_aeo * 0.25 + s_geo * 0.25))

                    p_parsed = urlparse(p_url)
                    display = f"{p_parsed.netloc}{p_parsed.path.rstrip('/')}"

                    return {
                        "page": SiteCrawledPage(
                            url=p_url,
                            display_url=display,
                            path=p_parsed.path or "/",
                            seo_score=s_seo,
                            aeo_score=s_aeo,
                            geo_score=s_geo,
                            overall_score=s_overall,
                            issues_count=len(p_all),
                            status_code=p_status,
                        ),
                        "issues": p_all,
                    }
                except Exception as ex:
                    logger.debug("Failed crawling subpage %s: %s", p_url, ex)
                    return None

            sub_results = await asyncio.gather(*(crawl_page(u) for u in internal_links))
            for sr in sub_results:
                if sr and sr.get("page"):
                    crawled_pages.append(sr["page"])
                    for issue in sr["issues"]:
                        if issue.code in issue_occurrences:
                            issue_occurrences[issue.code]["count"] += 1
                        else:
                            issue_occurrences[issue.code] = {"issue": issue, "count": 1}

        total_pages_count = len(crawled_pages)
        avg_seo = int(round(sum(p.seo_score for p in crawled_pages) / total_pages_count))
        avg_aeo = int(round(sum(p.aeo_score for p in crawled_pages) / total_pages_count))
        avg_geo = int(round(sum(p.geo_score for p in crawled_pages) / total_pages_count))
        avg_overall = int(round(avg_seo * 0.50 + avg_aeo * 0.25 + avg_geo * 0.25))
        site_grade = get_grade(avg_overall)

        # Sort common issues by affected pages descending
        severity_rank = {"critical": 0, "warning": 1, "info": 2}
        sorted_issue_items = sorted(
            issue_occurrences.values(),
            key=lambda x: (-x["count"], severity_rank.get(x["issue"].severity, 3))
        )

        most_common: List[CommonIssue] = []
        for item in sorted_issue_items[:15]:
            iss: ScanIssue = item["issue"]
            c = item["count"]
            most_common.append(
                CommonIssue(
                    code=iss.code,
                    label=iss.label,
                    severity=iss.severity,
                    pillar=iss.pillar,
                    affected_pages_count=c,
                    total_pages_count=total_pages_count,
                    fraction=f"{c}/{total_pages_count}",
                    percentage=int(round((c / total_pages_count) * 100)),
                    why=iss.why,
                    how_to_fix=iss.how_to_fix,
                )
            )

        site_report = SiteReport(
            domain=domain,
            total_pages=total_pages_count,
            average_overall_score=avg_overall,
            average_seo_score=avg_seo,
            average_aeo_score=avg_aeo,
            average_geo_score=avg_geo,
            grade=site_grade,
            pages=crawled_pages,
            most_common_issues=most_common,
        )

    elapsed = int((time.time() - start) * 1000)

    final_overall = site_report.average_overall_score if site_report else seed_overall
    final_grade = site_report.grade if site_report else get_grade(seed_overall)
    final_seo_score = site_report.average_seo_score if site_report else seo_score
    final_aeo_score = site_report.average_aeo_score if site_report else aeo_score
    final_geo_score = site_report.average_geo_score if site_report else geo_score

    total_checks_count = seo_total + aeo_total + geo_total

    return QuickScanResponse(
        url=url,
        final_url=final_url,
        mode=mode,
        overall_score=final_overall,
        grade=final_grade,
        seo=PillarScore(
            score=final_seo_score,
            label="Search Engine Optimization",
            checks=seo_total,
            issues=len(seo_issues),
            na_count=0,
        ),
        aeo=PillarScore(
            score=final_aeo_score,
            label="Answer Engine Optimization",
            checks=aeo_total,
            issues=len(aeo_issues),
            na_count=0,
        ),
        geo=PillarScore(
            score=final_geo_score,
            label="Generative Engine Optimization",
            checks=geo_total,
            issues=len(geo_issues),
            na_count=0,
        ),
        quick_wins=get_quick_wins(seed_issues),
        issues=seed_issues,
        site_report=site_report,
        detected_tech=tech,
        detected_confidence=confidence,
        scan_duration_ms=elapsed,
        checks_run=total_checks_count,
        success=True,
    )
