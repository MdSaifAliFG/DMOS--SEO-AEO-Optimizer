"""
Public Quick Scan & Quick Site Crawl endpoint — no authentication required.
Performs fast single-page or multi-page site SEO + AEO + GEO analysis for the landing page scanner.
"""
import asyncio
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
        return "SaaS (Next.js)", 88
    if "nuxt" in html_lower or "nuxt.js" in html_lower:
        return "SaaS (Nuxt.js)", 82
    if "react" in html_lower and "root" in html_lower:
        return "SaaS (React)", 70
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
        return "SaaS (Gatsby)", 80
    if "x-powered-by" in h:
        xpb = h["x-powered-by"]
        if "express" in xpb:
            return "Node.js (Express)", 75
        if "php" in xpb:
            return "PHP Application", 85
    return "Custom / Modern Web", 50


# ─────────────────────────────────────────────
# SEO CHECKS
# ─────────────────────────────────────────────

def run_seo_checks(soup: BeautifulSoup, html: str, url: str, headers: Dict[str, str], status_code: int, response_time_ms: int) -> List[ScanIssue]:
    issues: List[ScanIssue] = []
    h_lower = {k.lower(): v for k, v in headers.items()}

    # Title tag
    title_tag = soup.find("title")
    title_text = title_tag.get_text(strip=True) if title_tag else ""
    if not title_text:
        issues.append(ScanIssue(severity="critical", pillar="seo", code="SEO001", badge="Fix",
            label="Missing <title> tag — critical for search engine indexing",
            why="Pages without title tags are rarely ranked in search results.",
            how_to_fix="Add a descriptive <title> tag between 30-60 characters.",
            business_impact="Could cost up to 30% of potential organic click-through rate"))
    elif len(title_text) > 60:
        issues.append(ScanIssue(severity="critical", pillar="seo", code="SEO002", badge="Fix",
            label=f"Title length: {len(title_text)} characters (too long, keep under 60)",
            why="Titles longer than 60 chars get truncated in search results.",
            how_to_fix="Rewrite title to 30-60 characters. Include primary keyword in first 30 chars.",
            business_impact="Optimal length increases CTR by 15-20%"))
    elif len(title_text) < 30:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO003", badge="Warning",
            label=f"Title too short: {len(title_text)} characters (aim for 30-60)",
            why="Short titles don't fully utilize available SERP space.",
            how_to_fix="Expand title to 30-60 chars with primary keyword.",
            business_impact="Missing keyword space reduces ranking potential"))

    # Meta description
    meta_desc = soup.find("meta", attrs={"name": "description"})
    desc_content = meta_desc.get("content", "").strip() if meta_desc else ""
    if not desc_content:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO004", badge="Warning",
            label="Missing meta description — Google may auto-generate one",
            why="Without a meta description, search engines pick arbitrary text as the snippet.",
            how_to_fix="Add a meta description of 120-160 characters summarizing the page.",
            business_impact="Custom descriptions can increase CTR by 5-10%"))
    elif len(desc_content) > 160:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO005", badge="Warning",
            label=f"Description length: {len(desc_content)} chars (too long)",
            why="Descriptions over 160 chars get truncated in SERPs.",
            how_to_fix="Shorten meta description to 120-160 characters.",
            business_impact="Truncated snippets reduce click-through rates"))

    # H1 tag
    h1_tags = soup.find_all("h1")
    if not h1_tags:
        issues.append(ScanIssue(severity="critical", pillar="seo", code="SEO006", badge="Fix",
            label="No <h1> tag found — critical for page topic clarity",
            why="H1 is the primary heading signal search engines use to understand page topic.",
            how_to_fix="Add a single H1 tag containing your primary keyword.",
            business_impact="H1 optimization can improve rankings for target keywords"))
    elif len(h1_tags) > 1:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO007", badge="Warning",
            label=f"Multiple H1 tags found ({len(h1_tags)}) — use only one per page",
            why="Multiple H1s dilute the primary keyword signal for search engines.",
            how_to_fix="Consolidate to a single H1 tag with your primary keyword.",
            business_impact="Reduces keyword focus and can hurt rankings"))

    # Images without alt & size
    images = soup.find_all("img")
    imgs_no_alt = [img for img in images if not img.get("alt")]
    imgs_no_size = [img for img in images if not img.get("width") or not img.get("height")]
    if imgs_no_alt:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO008", badge="Warning",
            label=f"{len(imgs_no_alt)} image(s) missing alt text — accessibility and SEO risk",
            why="Alt text helps search engines understand image content and improves accessibility.",
            how_to_fix="Add descriptive alt attributes to all images.",
            business_impact="Improves image search rankings and accessibility score"))
    if imgs_no_size:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO009", badge="Warning",
            label=f"{len(imgs_no_size)} images missing width/height — causes layout shift (CLS)",
            why="Missing dimensions cause Cumulative Layout Shift, hurting Core Web Vitals.",
            how_to_fix="Add explicit width and height attributes to all <img> tags.",
            business_impact="CLS improvement can boost Core Web Vitals score"))

    # Canonical
    canonical = soup.find("link", attrs={"rel": "canonical"})
    if not canonical:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO010", badge="Warning",
            label="No canonical URL tag — duplicate content risk",
            why="Without canonical, search engines may index multiple versions of the same page.",
            how_to_fix="Add <link rel='canonical' href='...'> to the page head.",
            business_impact="Prevents duplicate content penalties"))

    # Viewport
    viewport = soup.find("meta", attrs={"name": "viewport"})
    if not viewport:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO011", badge="Warning",
            label="No viewport meta tag — mobile-unfriendly",
            why="Pages without viewport tags render poorly on mobile and are penalized by Google.",
            how_to_fix="Add <meta name='viewport' content='width=device-width, initial-scale=1'>",
            business_impact="Mobile-unfriendly pages lose 50%+ of potential mobile traffic"))

    # Lazy loading
    imgs_no_lazy = [img for img in images if img.get("loading") != "lazy"]
    if len(imgs_no_lazy) > 2:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO012", badge="Warning",
            label=f"{len(imgs_no_lazy)} images could use loading='lazy' for better performance",
            why="Lazy loading improves page load speed by deferring off-screen images.",
            how_to_fix="Add loading='lazy' to below-the-fold images.",
            business_impact="Can improve LCP and page speed scores"))

    # Hreflang
    hreflang = soup.find("link", attrs={"rel": "alternate", "hreflang": True})
    if not hreflang:
        issues.append(ScanIssue(severity="info", pillar="seo", code="SEO013", badge="Info",
            label="No hreflang tags — add if targeting multiple languages",
            why="Hreflang helps search engines serve the correct language version to users.",
            how_to_fix="Add hreflang tags if you target multiple countries or languages.",
            business_impact="Improves international SEO targeting"))

    # Open Graph
    og_title = soup.find("meta", attrs={"property": "og:title"})
    if not og_title:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO014", badge="Warning",
            label="Missing Open Graph title — poor social media sharing preview",
            why="Without OG tags, social platforms generate ugly, unstyled previews.",
            how_to_fix="Add <meta property='og:title'>, og:description, og:image.",
            business_impact="Well-crafted OG tags can double social share CTR"))

    # Response time
    if response_time_ms > 3000:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO015", badge="Warning",
            label=f"Slow server response: {response_time_ms}ms (target <800ms)",
            why="Slow TTFB hurts Core Web Vitals and search rankings.",
            how_to_fix="Optimize server response time with caching, CDN, or infrastructure upgrades.",
            business_impact="Sub-second response can improve conversion rate by 7%"))

    # Inline scripts
    inline_scripts = soup.find_all("script", src=False)
    total_inline_js = sum(len(s.get_text()) for s in inline_scripts if s.get_text().strip())
    if total_inline_js > 10000:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO016", badge="Warning",
            label=f"Inline JS: {total_inline_js // 1000}KB — too much, use external scripts",
            why="Large inline scripts block rendering and increase page size.",
            how_to_fix="Move inline JS to external files and defer non-critical scripts.",
            business_impact="Can improve FCP and overall page performance score"))

    # Theme color meta tag
    theme_color = soup.find("meta", attrs={"name": "theme-color"})
    if not theme_color:
        issues.append(ScanIssue(severity="info", pillar="seo", code="SEO017", badge="Info",
            label="No theme-color meta tag (optional, no SEO impact — only affects mobile browser UI)",
            why="Theme color configures the browser address bar color on mobile devices.",
            how_to_fix="Add <meta name='theme-color' content='#hexcolor'> to head.",
            business_impact="Improves mobile user interface aesthetics"))

    # Render blocking scripts
    head = soup.find("head")
    render_blocking_scripts = []
    if head:
        for s in head.find_all("script", src=True):
            if not s.get("defer") and not s.get("async") and s.get("type") != "module":
                render_blocking_scripts.append(s)
    if render_blocking_scripts:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO018", badge="Warning",
            label=f"{len(render_blocking_scripts)} render-blocking scripts — add defer or async attribute",
            why="Scripts in head without defer or async pause page parsing until downloaded.",
            how_to_fix="Add defer or async attribute to non-critical external scripts in head.",
            business_impact="Significantly improves First Contentful Paint (FCP)"))

    # Font preload / preconnect
    font_preconnect = soup.find("link", attrs={"rel": re.compile(r"preconnect|preload"), "href": re.compile(r"fonts|gstatic")})
    if not font_preconnect:
        issues.append(ScanIssue(severity="info", pillar="seo", code="SEO019", badge="Info",
            label="No font preload/preconnect — add for faster rendering",
            why="Preconnecting to font CDNs avoids round-trip DNS lookups during rendering.",
            how_to_fix="Add <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>.",
            business_impact="Speeds up web font display and reduces layout shifts"))

    # Security headers
    if "strict-transport-security" not in h_lower:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO020", badge="Warning",
            label="No Strict-Transport-Security header",
            why="HSTS ensures all connections use HTTPS and prevents SSL stripping attacks.",
            how_to_fix="Configure Strict-Transport-Security header in server or reverse proxy.",
            business_impact="Hardens security posture and prevents MITM downgrade attacks"))

    if "x-content-type-options" not in h_lower:
        issues.append(ScanIssue(severity="info", pillar="seo", code="SEO021", badge="Info",
            label="Missing X-Content-Type-Options header",
            why="Prevents MIME type sniffing which could execute malicious scripts.",
            how_to_fix="Set 'X-Content-Type-Options: nosniff' header.",
            business_impact="Eliminates MIME-based security vulnerabilities"))

    if "content-security-policy" not in h_lower:
        issues.append(ScanIssue(severity="warning", pillar="seo", code="SEO022", badge="Warning",
            label="No Content-Security-Policy header — XSS risk",
            why="CSP restricts resource origins to prevent cross-site scripting (XSS).",
            how_to_fix="Define a Content-Security-Policy header restricting script and object sources.",
            business_impact="Protects user data and brand reputation against XSS injection"))

    # About page link detection
    about_link = soup.find("a", href=re.compile(r"about|team|company", re.I))
    if not about_link:
        issues.append(ScanIssue(severity="info", pillar="seo", code="SEO023", badge="Info",
            label="No About page link detected — add for credibility",
            why="About page signals transparency and brand legitimacy to search evaluators (E-E-A-T).",
            how_to_fix="Add an About Us or Company link in navigation or footer.",
            business_impact="Strengthens E-E-A-T and brand trust signals"))

    # DNS prefetch
    dns_prefetch = soup.find("link", attrs={"rel": "dns-prefetch"})
    if not dns_prefetch:
        issues.append(ScanIssue(severity="info", pillar="seo", code="SEO024", badge="Info",
            label="No dns-prefetch or preconnect hints — add for faster third-party loading",
            why="Pre-resolves external domain names for analytics, CDNs, and API endpoints.",
            how_to_fix="Add <link rel='dns-prefetch' href='//cdn.example.com'> for third-party assets.",
            business_impact="Reduces third-party asset latency by 20-50ms"))

    return issues


# ─────────────────────────────────────────────
# AEO CHECKS
# ─────────────────────────────────────────────

def run_aeo_checks(soup: BeautifulSoup, html: str, url: str) -> List[ScanIssue]:
    issues: List[ScanIssue] = []

    # Structured data / JSON-LD
    json_ld = soup.find_all("script", attrs={"type": "application/ld+json"})
    if not json_ld:
        issues.append(ScanIssue(severity="critical", pillar="aeo", code="AEO001", badge="Fix",
            label="No JSON-LD structured data — AI engines rely on schema markup",
            why="Answer engines parse structured data to extract factual information about entities.",
            how_to_fix="Add JSON-LD schema: Organization, FAQPage, Article, Product, etc.",
            business_impact="Structured data increases AI citation probability by 40-60%"))
    else:
        # Check for FAQ schema
        import json as json_lib
        has_faq = False
        for tag in json_ld:
            try:
                data = json_lib.loads(tag.get_text())
                if isinstance(data, list):
                    has_faq = any(d.get("@type") == "FAQPage" for d in data)
                elif data.get("@type") == "FAQPage":
                    has_faq = True
            except Exception:
                pass
        if not has_faq:
            issues.append(ScanIssue(severity="warning", pillar="aeo", code="AEO002", badge="Warning",
                label="FAQ structured data missing — add FAQPage schema for direct answers",
                why="FAQPage schema feeds directly into answer engine Q&A responses.",
                how_to_fix="Add FAQPage JSON-LD with question/answer pairs.",
                business_impact="FAQ schema can capture featured snippet and AI answer placements"))

    # Definition lists
    dl_tags = soup.find_all("dl")
    if not dl_tags:
        issues.append(ScanIssue(severity="warning", pillar="aeo", code="AEO003", badge="Warning",
            label="No definition lists (<dl>) — great for term/value pairs AI engines love",
            why="Definition lists provide structured key-value content that AI engines parse well.",
            how_to_fix="Use <dl><dt>Term</dt><dd>Definition</dd></dl> for glossaries, specs, and facts.",
            business_impact="Improves content extractability for AEO"))

    # Question-answer content patterns
    html_lower = html.lower()
    has_qa = (
        bool(re.search(r'\b(what is|how to|why does|when should|where can)\b', html_lower))
        or bool(soup.find_all(["h2", "h3"], string=re.compile(r'\?$')))
    )
    if not has_qa:
        issues.append(ScanIssue(severity="warning", pillar="aeo", code="AEO004", badge="Warning",
            label="No Q&A content patterns detected — add conversational answers",
            why="AI answer engines surface content that directly answers questions.",
            how_to_fix="Add Q&A sections, 'What is X?' headings, and direct paragraph answers.",
            business_impact="Conversational content increases AI citation rate"))

    # Heading hierarchy
    h2_count = len(soup.find_all("h2"))
    if h2_count < 2:
        issues.append(ScanIssue(severity="warning", pillar="aeo", code="AEO005", badge="Warning",
            label="Sparse heading hierarchy — add H2/H3 for better content chunking",
            why="AI engines chunk content by headings to extract topical answers.",
            how_to_fix="Add H2 and H3 subheadings to structure content into clear topics.",
            business_impact="Better chunking improves answer extraction probability"))

    # How-to schema
    has_howto = any("HowTo" in tag.get_text() for tag in json_ld) if json_ld else False
    if not has_howto and "how to" in html_lower:
        issues.append(ScanIssue(severity="info", pillar="aeo", code="AEO006", badge="Info",
            label="How-To content detected but no HowTo schema — missed opportunity",
            why="HowTo schema enables rich results and AI step-by-step answers.",
            how_to_fix="Wrap step-by-step content in HowTo JSON-LD schema.",
            business_impact="Can capture rich results for how-to queries"))

    # Article or BlogPosting schema
    has_article = any("Article" in tag.get_text() or "BlogPosting" in tag.get_text() for tag in json_ld) if json_ld else False
    if not has_article:
        issues.append(ScanIssue(severity="info", pillar="aeo", code="AEO007", badge="Info",
            label="No Article/BlogPosting schema — limits AI content attribution",
            why="Article schema helps AI engines attribute content to your brand correctly.",
            how_to_fix="Add Article JSON-LD with author, datePublished, and publisher.",
            business_impact="Improves content authority signals for AEO"))

    return issues


# ─────────────────────────────────────────────
# GEO CHECKS
# ─────────────────────────────────────────────

async def run_geo_checks(soup: BeautifulSoup, html: str, url: str) -> List[ScanIssue]:
    issues: List[ScanIssue] = []
    parsed_url = urlparse(url)
    domain = parsed_url.netloc

    # Check robots.txt for AI bot access
    robots_url = f"{parsed_url.scheme}://{domain}/robots.txt"
    gpt_blocked = False
    perplexity_blocked = False
    claude_blocked = False
    google_extended_blocked = False
    try:
        async with httpx.AsyncClient(timeout=4.0, follow_redirects=True) as client:
            r = await client.get(robots_url, headers={"User-Agent": "SeoSensing/1.0"})
            if r.status_code == 200:
                robots_text = r.text.lower()
                gpt_blocked = "gptbot" in robots_text and "disallow: /" in robots_text
                perplexity_blocked = "perplexitybot" in robots_text and "disallow: /" in robots_text
                claude_blocked = "claudebot" in robots_text and "disallow: /" in robots_text
                google_extended_blocked = "google-extended" in robots_text and "disallow: /" in robots_text
    except Exception:
        pass

    if gpt_blocked:
        issues.append(ScanIssue(severity="critical", pillar="geo", code="GEO001", badge="Fix",
            label="GPTBot is blocked in robots.txt — ChatGPT cannot index your content",
            why="Blocking GPTBot prevents OpenAI from crawling and citing your content in ChatGPT Search.",
            how_to_fix="Remove 'Disallow: /' for GPTBot in robots.txt or add an explicit Allow rule.",
            business_impact="Unblocking GPTBot can restore ChatGPT citation visibility"))

    if perplexity_blocked:
        issues.append(ScanIssue(severity="critical", pillar="geo", code="GEO002", badge="Fix",
            label="PerplexityBot is blocked in robots.txt — Perplexity AI cannot cite your content",
            why="Perplexity AI can't include your content in search results if its crawler is blocked.",
            how_to_fix="Allow PerplexityBot in robots.txt.",
            business_impact="Restores Perplexity AI citation potential"))

    if claude_blocked:
        issues.append(ScanIssue(severity="warning", pillar="geo", code="GEO003", badge="Warning",
            label="ClaudeBot is blocked in robots.txt — Anthropic Claude cannot index your site",
            why="Blocking ClaudeBot removes your content from Anthropic's training and citation pool.",
            how_to_fix="Allow ClaudeBot access in robots.txt.",
            business_impact="Improves Claude AI citation probability"))

    if google_extended_blocked:
        issues.append(ScanIssue(severity="warning", pillar="geo", code="GEO004", badge="Warning",
            label="Google-Extended is blocked — limits Google Gemini AI awareness of your content",
            why="Google-Extended crawls content for Gemini's generative responses.",
            how_to_fix="Remove Disallow for Google-Extended in robots.txt.",
            business_impact="Improves Google Gemini citation rate"))

    # Entity checks from structured data
    json_ld = soup.find_all("script", attrs={"type": "application/ld+json"})
    has_org = False
    has_founders = False
    has_same_as = False
    import json as json_lib
    for tag in json_ld:
        try:
            data = json_lib.loads(tag.get_text())
            if isinstance(data, dict):
                data_list = [data]
            elif isinstance(data, list):
                data_list = data
            else:
                data_list = []
            for d in data_list:
                if d.get("@type") in ("Organization", "Corporation", "LocalBusiness"):
                    has_org = True
                    if d.get("founder") or d.get("founders"):
                        has_founders = True
                    if d.get("sameAs"):
                        has_same_as = True
        except Exception:
            pass

    if not has_org:
        issues.append(ScanIssue(severity="critical", pillar="geo", code="GEO005", badge="Fix",
            label="No Organization schema — brand entity not recognized by generative engines",
            why="Without Organization schema, AI engines cannot reliably identify your brand as a distinct entity.",
            how_to_fix="Add Organization JSON-LD with name, url, logo, description, sameAs.",
            business_impact="Entity recognition is #1 factor for GEO citation frequency"))

    if not has_same_as:
        issues.append(ScanIssue(severity="warning", pillar="geo", code="GEO006", badge="Warning",
            label="No sameAs links (Wikipedia/Wikidata) — entity disambiguation missing",
            why="sameAs links connect your brand entity to authoritative knowledge bases that AI engines trust.",
            how_to_fix="Add sameAs: ['https://en.wikipedia.org/wiki/...', 'https://www.wikidata.org/wiki/...'] to Organization schema.",
            business_impact="Knowledge graph connections increase AI recommendation probability by 30-50%"))

    if not has_founders:
        issues.append(ScanIssue(severity="warning", pillar="geo", code="GEO007", badge="Warning",
            label="No founder or team information — missing authority signals",
            why="Generative engines use founder data to assess E-E-A-T (Experience, Expertise, Authority, Trust).",
            how_to_fix="Add 'founder' or 'employee' properties with Person schemas in your JSON-LD.",
            business_impact="Named experts increase citation probability on technical topics"))

    # Entity consistency
    text_content = soup.get_text()
    if len(text_content) < 500:
        issues.append(ScanIssue(severity="warning", pillar="geo", code="GEO008", badge="Warning",
            label="Low text content volume — insufficient context for LLM comprehension",
            why="Generative search models require substantial text content to understand topic depth.",
            how_to_fix="Expand page content with comprehensive explanations, examples, and data.",
            business_impact="Pages with <500 words rarely get cited by AI answer models"))

    # Citeable claim detection
    has_stats = bool(re.search(r'\b\d+[\.,]?\d*%\b|\b\$\d+[\.,]?\d*[kmb]?\b|\b\d+\+?\s+(users|clients|pages|websites|companies)\b', text_content, re.I))
    if not has_stats:
        issues.append(ScanIssue(severity="info", pillar="geo", code="GEO009", badge="Info",
            label="No citeable statistical claims detected — statistics increase AI citations",
            why="Generative AI models heavily prefer citing content with concrete numbers, percentages, and metrics.",
            how_to_fix="Add original data points, survey findings, benchmark statistics, or case studies.",
            business_impact="Content with statistics gets cited 3x more frequently in AI overviews"))

    # Brand anchor check
    brand_mentions = len(re.findall(r'\b' + re.escape(domain.split('.')[0]) + r'\b', text_content, re.I))
    if brand_mentions < 3:
        issues.append(ScanIssue(severity="info", pillar="geo", code="GEO010", badge="Info",
            label="Low brand mention density — brand entity signal could be stronger",
            why="Consistent brand mentions reinforce entity association with target topics.",
            how_to_fix="Naturally incorporate your brand name in key headings and value statements.",
            business_impact="Strengthens brand-topic association in AI model training representations"))

    return issues


# ─────────────────────────────────────────────
# SCORING & AGGREGATION HELPERS
# ─────────────────────────────────────────────

SEO_TOTAL_CHECKS = 24
AEO_TOTAL_CHECKS = 7
GEO_TOTAL_CHECKS = 10


def calculate_score(issues: List[ScanIssue], total_checks: int, pillar: str) -> tuple[int, int]:
    pillar_issues = [i for i in issues if i.pillar == pillar]
    critical_count = sum(1 for i in pillar_issues if i.severity == "critical")
    warning_count = sum(1 for i in pillar_issues if i.severity == "warning")
    info_count = sum(1 for i in pillar_issues if i.severity == "info")

    penalty = (critical_count * 15) + (warning_count * 7) + (info_count * 2)
    score = max(20, min(100, 100 - penalty))
    return score, 0


def get_grade(score: int) -> str:
    if score >= 90:
        return "A"
    if score >= 75:
        return "B"
    if score >= 60:
        return "C"
    if score >= 45:
        return "D"
    return "F"


def get_quick_wins(issues: List[ScanIssue]) -> List[QuickWin]:
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
    """Extract internal unique links from HTML."""
    parsed_base = urlparse(base_url)
    base_domain = parsed_base.netloc.lower().replace("www.", "")
    
    seen: Set[str] = {base_url.rstrip("/")}
    discovered: List[str] = []

    priority_keywords = ["login", "register", "signup", "pricing", "terms", "privacy", "refund", "about", "features", "blog"]
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

        # Filter out assets
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
# MAIN ENDPOINT
# ─────────────────────────────────────────────

@router.post("/scan", response_model=QuickScanResponse)
async def quick_scan(payload: QuickScanRequest) -> QuickScanResponse:
    """
    Public quick scan & site crawl — no auth required.
    Fetches the target URL (or discovers site pages) and runs SEO, AEO, and GEO checks.
    """
    start = time.time()
    url = payload.url
    mode = payload.mode.lower()

    # Validate URL safety (SSRF protection)
    is_valid, err = validate_url(url, check_dns=True)
    if not is_valid:
        raise HTTPException(status_code=422, detail=f"Invalid or unsafe URL: {err}")

    # Fetch the seed page
    headers_req = {
        "User-Agent": "SeoSensing-QuickScan/1.0 (+https://seosensing.io/bot)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        async with httpx.AsyncClient(timeout=12.0, follow_redirects=True, headers=headers_req) as client:
            response = await client.get(url)
            fetch_time_ms = int((time.time() - start) * 1000)
            html = response.text
            final_url = str(response.url)
            headers = dict(response.headers)
            status_code = response.status_code
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timed out. The website did not respond in time.")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Could not connect to the website. Please check the URL.")
    except Exception as e:
        logger.warning("Quick scan fetch error for %s: %s", url, e)
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")

    # Parse seed HTML
    soup = BeautifulSoup(html, "html.parser")
    parsed_final = urlparse(final_url)
    domain = parsed_final.netloc

    # Run checks on seed page
    seo_issues = run_seo_checks(soup, html, final_url, headers, status_code, fetch_time_ms)
    aeo_issues = run_aeo_checks(soup, html, final_url)
    geo_issues = await run_geo_checks(soup, html, final_url)

    seed_issues = seo_issues + aeo_issues + geo_issues
    seo_score, seo_na = calculate_score(seed_issues, SEO_TOTAL_CHECKS, "seo")
    aeo_score, aeo_na = calculate_score(seed_issues, AEO_TOTAL_CHECKS, "aeo")
    geo_score, geo_na = calculate_score(seed_issues, GEO_TOTAL_CHECKS, "geo")
    seed_overall = int((seo_score * 0.4) + (aeo_score * 0.3) + (geo_score * 0.3))

    tech, confidence = detect_tech(html, headers, final_url)

    # ─────────────────────────────────────────────
    # SITE CRAWL MODE
    # ─────────────────────────────────────────────
    site_report: Optional[SiteReport] = None

    if mode == "site":
        internal_links = extract_internal_links(soup, final_url, max_links=5)
        
        # Structure for seed page
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

        # Track issues across all pages for "Most Common Issues"
        issue_occurrences: Dict[str, Dict[str, Any]] = {}
        for issue in seed_issues:
            issue_occurrences[issue.code] = {
                "issue": issue,
                "count": 1,
            }

        # Concurrently fetch other internal pages
        if internal_links:
            async def fetch_and_analyze_page(page_url: str):
                try:
                    p_start = time.time()
                    async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, headers=headers_req) as cl:
                        res = await cl.get(page_url)
                        p_time_ms = int((time.time() - p_start) * 1000)
                        p_html = res.text
                        p_soup = BeautifulSoup(p_html, "html.parser")
                        p_headers = dict(res.headers)
                        p_status = res.status_code

                    p_seo = run_seo_checks(p_soup, p_html, page_url, p_headers, p_status, p_time_ms)
                    p_aeo = run_aeo_checks(p_soup, p_html, page_url)
                    p_geo = await run_geo_checks(p_soup, p_html, page_url)
                    p_all = p_seo + p_aeo + p_geo

                    s_seo, _ = calculate_score(p_all, SEO_TOTAL_CHECKS, "seo")
                    s_aeo, _ = calculate_score(p_all, AEO_TOTAL_CHECKS, "aeo")
                    s_geo, _ = calculate_score(p_all, GEO_TOTAL_CHECKS, "geo")
                    s_overall = int((s_seo * 0.4) + (s_aeo * 0.3) + (s_geo * 0.3))

                    p_parsed = urlparse(page_url)
                    display = f"{p_parsed.netloc}{p_parsed.path.rstrip('/')}"

                    return {
                        "page": SiteCrawledPage(
                            url=page_url,
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
                    logger.debug("Failed to crawl sub-page %s: %s", page_url, ex)
                    return None

            sub_results = await asyncio.gather(*(fetch_and_analyze_page(u) for u in internal_links))
            for sr in sub_results:
                if sr and sr.get("page"):
                    crawled_pages.append(sr["page"])
                    for issue in sr["issues"]:
                        if issue.code in issue_occurrences:
                            issue_occurrences[issue.code]["count"] += 1
                        else:
                            issue_occurrences[issue.code] = {
                                "issue": issue,
                                "count": 1,
                            }

        total_pages_count = len(crawled_pages)
        avg_seo = int(sum(p.seo_score for p in crawled_pages) / total_pages_count)
        avg_aeo = int(sum(p.aeo_score for p in crawled_pages) / total_pages_count)
        avg_geo = int(sum(p.geo_score for p in crawled_pages) / total_pages_count)
        avg_overall = int(sum(p.overall_score for p in crawled_pages) / total_pages_count)
        site_grade = get_grade(avg_overall)

        # Build most common issues list sorted by affected count
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
                    percentage=int((c / total_pages_count) * 100),
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

    return QuickScanResponse(
        url=url,
        final_url=final_url,
        mode=mode,
        overall_score=final_overall,
        grade=final_grade,
        seo=PillarScore(
            score=final_seo_score,
            label="Search Engine Optimization",
            checks=SEO_TOTAL_CHECKS,
            issues=len(seo_issues),
            na_count=seo_na,
        ),
        aeo=PillarScore(
            score=final_aeo_score,
            label="Answer Engine Optimization",
            checks=AEO_TOTAL_CHECKS,
            issues=len(aeo_issues),
            na_count=aeo_na,
        ),
        geo=PillarScore(
            score=final_geo_score,
            label="Generative Engine Optimization",
            checks=GEO_TOTAL_CHECKS,
            issues=len(geo_issues),
            na_count=geo_na,
        ),
        quick_wins=get_quick_wins(seed_issues),
        issues=seed_issues,
        site_report=site_report,
        detected_tech=tech,
        detected_confidence=confidence,
        scan_duration_ms=elapsed,
        checks_run=SEO_TOTAL_CHECKS + AEO_TOTAL_CHECKS + GEO_TOTAL_CHECKS,
        success=True,
    )
