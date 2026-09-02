import pytest
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage
from app.services.crawler.url_normalizer import normalize_url, is_internal_url
from app.services.crawler.url_validator import validate_url, is_url_safe
from app.services.seo.rules.content import evaluate_page_content
from app.services.seo.rules.social import evaluate_page_social
from app.services.seo.rules.depth import evaluate_page_depth
from app.services.seo.rules.performance import evaluate_page_performance
from app.services.seo.scoring import SeoScoringEngine, get_score_label
from app.schemas.project import normalize_domain, ProjectCreate


def test_url_normalization():
    assert normalize_url("https://example.com/about/") == "https://example.com/about"
    assert normalize_url("http://example.com:80/page") == "http://example.com/page"
    assert normalize_url("https://example.com/path#section") == "https://example.com/path"
    assert is_internal_url("https://example.com/docs", "example.com") is True
    assert is_internal_url("https://facebook.com/share", "example.com") is False


def test_ssrf_validation():
    # Private / loopback blocked
    valid, err = validate_url("http://127.0.0.1:8000", check_dns=False)
    assert valid is False
    assert "prohibited" in err

    valid, err = validate_url("http://localhost/admin", check_dns=False)
    assert valid is False

    valid, err = validate_url("http://169.254.169.254/latest/meta-data/", check_dns=False)
    assert valid is False

    # Valid public domain
    valid, err = validate_url("https://example.com", check_dns=False)
    assert valid is True
    assert is_url_safe("https://example.com", check_dns=False) is True


def test_domain_normalization_and_project_schema():
    assert normalize_domain("https://fortunehestia.com/") == "fortunehestia.com"
    assert normalize_domain("http://app.example.com/dashboard?query=1") == "app.example.com"
    
    p = ProjectCreate(
        name="Test Project",
        domain="https://example.com/",
        settings={"crawl_limit": 50, "respect_robots": True},
    )
    assert p.domain == "example.com"
    assert p.settings["crawl_limit"] == 50


def test_content_and_thin_content_rule():
    # Thin content (< 100 words)
    page = SeoPage(
        scan_id="scan-1",
        url="https://example.com/thin",
        final_url="https://example.com/thin",
        status_code=200,
        content_type="text/html",
        word_count=45,
        is_indexable=True,
    )
    issues = evaluate_page_content(page)
    assert len(issues) == 1
    assert issues[0].issue_code == "thin_content"
    assert issues[0].severity == IssueSeverity.MEDIUM.value

    # Normal content (350 words)
    good_page = SeoPage(
        scan_id="scan-1",
        url="https://example.com/good",
        final_url="https://example.com/good",
        status_code=200,
        content_type="text/html",
        word_count=350,
        is_indexable=True,
    )
    assert len(evaluate_page_content(good_page)) == 0


def test_social_and_depth_rules():
    page = SeoPage(
        scan_id="scan-1",
        url="https://example.com/deep/page",
        final_url="https://example.com/deep/page",
        status_code=200,
        content_type="text/html",
        crawl_depth=5,
        open_graph={},
        twitter_card={},
        is_indexable=True,
    )
    social_issues = evaluate_page_social(page)
    assert len(social_issues) >= 1

    depth_issues = evaluate_page_depth(page, max_recommended_depth=3)
    assert len(depth_issues) == 1
    assert depth_issues[0].issue_code == "deep_crawl_depth"


def test_performance_rule():
    slow_page = SeoPage(
        scan_id="scan-1",
        url="https://example.com/slow",
        final_url="https://example.com/slow",
        status_code=200,
        content_type="text/html",
        response_time=2.45,
    )
    perf_issues = evaluate_page_performance(slow_page)
    assert len(perf_issues) == 1
    assert perf_issues[0].issue_code == "slow_server_response"


def test_scoring_engine():
    # 0 issues -> 100 score Excellent
    clean_scores = SeoScoringEngine.calculate_scores(total_pages=10, issues=[])
    assert clean_scores["overall_score"] == 100
    assert clean_scores["score_label"] == "Excellent"

    # With high severity issue
    sample_issues = [
        SeoIssue(
            scan_id="scan-1",
            issue_code="missing_title",
            category=IssueCategory.METADATA.value,
            severity=IssueSeverity.HIGH.value,
            title="Missing Title",
            description="No title",
            recommendation="Add title",
        )
    ]
    scored = SeoScoringEngine.calculate_scores(total_pages=5, issues=sample_issues)
    assert scored["overall_score"] < 100
    assert scored["metadata_score"] < 100
    assert "formula" in scored["score_breakdown"]
