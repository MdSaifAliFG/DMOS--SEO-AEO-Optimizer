import pytest
from app.services.crawler.url_validator import validate_url, is_url_safe
from app.services.crawler.url_normalizer import normalize_url, is_internal_url
from app.services.crawler.page_parser import HTMLPageParser


def test_ssrf_protection():
    """Security tests verifying rejection of private, loopback, and metadata IPs."""
    # Forbidden protocols
    assert is_url_safe("file:///etc/passwd", check_dns=False) is False
    assert is_url_safe("javascript:alert(1)", check_dns=False) is False
    assert is_url_safe("data:text/html,test", check_dns=False) is False
    assert is_url_safe("ftp://example.com", check_dns=False) is False

    # Blocked hosts
    assert is_url_safe("http://localhost", check_dns=False) is False
    assert is_url_safe("http://127.0.0.1", check_dns=False) is False
    assert is_url_safe("http://0.0.0.0", check_dns=False) is False
    assert is_url_safe("http://[::1]", check_dns=False) is False

    # Cloud metadata endpoints
    assert is_url_safe("http://169.254.169.254/latest/meta-data/", check_dns=False) is False
    assert is_url_safe("http://metadata.google.internal/computeMetadata/v1/", check_dns=False) is False

    # Private IP ranges
    assert is_url_safe("http://10.0.0.1/admin", check_dns=False) is False
    assert is_url_safe("http://192.168.1.1/", check_dns=False) is False
    assert is_url_safe("http://172.16.0.5/", check_dns=False) is False

    # Valid public URLs
    assert is_url_safe("https://example.com/about", check_dns=False) is True
    assert is_url_safe("http://my-saas-domain.io/pricing", check_dns=False) is True


def test_url_normalization():
    """Tests URL normalization and deduplication behavior."""
    base = "https://example.com"
    # Strips fragments
    assert normalize_url("https://example.com/page#section") == "https://example.com/page"
    # Strips default port
    assert normalize_url("https://example.com:443/page") == "https://example.com/page"
    assert normalize_url("http://example.com:80/page") == "http://example.com/page"
    # Lowercase hostname
    assert normalize_url("HTTPS://EXAMPLE.COM/Page") == "https://example.com/Page"
    # Removes tracking query parameters while keeping functional params
    url_with_utm = "https://example.com/shop?utm_source=google&page=2&utm_medium=cpc&sort=asc"
    normalized = normalize_url(url_with_utm)
    assert "utm_source" not in normalized
    assert "utm_medium" not in normalized
    assert "page=2" in normalized
    assert "sort=asc" in normalized


def test_domain_restriction():
    """Tests domain boundary checking."""
    domain = "example.com"
    assert is_internal_url("https://example.com/about", domain) is True
    assert is_internal_url("https://www.example.com/contact", domain) is True
    assert is_internal_url("https://blog.example.com/post-1", domain) is True
    assert is_internal_url("https://google.com/", domain) is False
    assert is_internal_url("https://notexample.com/", domain) is False


def test_html_page_parser():
    """Tests HTML parsing of metadata, headings, images, and links."""
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title> Acme SaaS — Modern Cloud Analytics </title>
        <meta name="description" content="Acme delivers real-time cloud data pipeline insights.">
        <link rel="canonical" href="https://example.com/home">
        <meta name="robots" content="index, follow">
        <meta property="og:title" content="Acme SaaS Platform">
    </head>
    <body>
        <h1>Main Headline</h1>
        <h2>Subheading 1</h2>
        <p>This is a paragraph with several useful words describing the Acme cloud analytics platform.</p>
        <img src="/assets/logo.png" alt="Acme Logo" width="200" height="50">
        <img src="/assets/decorative.png" alt="">
        <img src="/assets/missing-alt.png">
        <a href="/pricing">Pricing</a>
        <a href="https://external.com/partner" rel="nofollow">Partner</a>
    </body>
    </html>
    """

    data = HTMLPageParser.parse(html, "https://example.com/", "example.com")
    assert data.title == "Acme SaaS — Modern Cloud Analytics"
    assert data.meta_description == "Acme delivers real-time cloud data pipeline insights."
    assert data.canonical_url == "https://example.com/home"
    assert data.language == "en"
    assert data.h1_count == 1
    assert data.h2_count == 1
    assert data.is_indexable is True
    assert data.word_count > 10

    # Image checks
    assert len(data.images) == 3
    assert data.images[0]["alt"] == "Acme Logo"
    assert data.images[1]["alt"] == ""
    assert data.images[2]["alt"] is None  # Missing alt

    # Link checks
    assert len(data.links) == 2
    assert data.links[0]["target_url"] == "https://example.com/pricing"
    assert data.links[0]["link_type"] == "internal"
    assert data.links[1]["target_url"] == "https://external.com/partner"
    assert data.links[1]["link_type"] == "external"
    assert data.links[1]["is_follow"] is False
