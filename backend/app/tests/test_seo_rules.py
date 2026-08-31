import pytest
from app.models.seo_page import SeoPage, SeoPageImage, SeoPageLink
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.services.seo.rules.title import evaluate_page_title
from app.services.seo.rules.meta import evaluate_page_meta
from app.services.seo.rules.headings import evaluate_page_headings
from app.services.seo.rules.canonical import evaluate_page_canonical
from app.services.seo.rules.images import evaluate_page_images
from app.services.seo.rules.status import evaluate_page_status
from app.services.seo.rules.links import evaluate_page_links
from app.services.seo.rules.mixed_content import evaluate_page_mixed_content
from app.services.seo.scoring import SeoScoringEngine


def test_title_rules():
    # Missing title
    p1 = SeoPage(scan_id="s1", url="https://example.com/p1", final_url="https://example.com/p1", status_code=200, title=None)
    issues1 = evaluate_page_title(p1)
    assert any(i.issue_code == "missing_title" and i.severity == "high" for i in issues1)

    # Empty title
    p2 = SeoPage(scan_id="s1", url="https://example.com/p2", final_url="https://example.com/p2", status_code=200, title="   ")
    issues2 = evaluate_page_title(p2)
    assert any(i.issue_code == "empty_title" for i in issues2)

    # Short title
    p3 = SeoPage(scan_id="s1", url="https://example.com/p3", final_url="https://example.com/p3", status_code=200, title="Home")
    issues3 = evaluate_page_title(p3)
    assert any(i.issue_code == "title_too_short" for i in issues3)


def test_meta_and_headings_rules():
    # Missing meta description
    p = SeoPage(scan_id="s1", url="https://example.com/p", final_url="https://example.com/p", status_code=200, meta_description=None, h1_count=0)
    meta_issues = evaluate_page_meta(p)
    assert any(i.issue_code == "missing_meta_description" for i in meta_issues)

    # Missing H1
    h1_issues = evaluate_page_headings(p)
    assert any(i.issue_code == "missing_h1" for i in h1_issues)


def test_image_and_link_rules():
    # Missing image alt
    p = SeoPage(scan_id="s1", url="https://example.com/p", final_url="https://example.com/p", status_code=200)
    p.images.append(SeoPageImage(src="https://example.com/img.png", alt=None))
    img_issues = evaluate_page_images(p)
    assert any(i.issue_code == "missing_image_alt" for i in img_issues)

    # Broken internal link
    p.links.append(SeoPageLink(target_url="https://example.com/broken-page", is_internal=True))
    status_map = {"https://example.com/broken-page": 404}
    link_issues = evaluate_page_links(p, status_map)
    assert any(i.issue_code == "broken_internal_link" and i.severity == "high" for i in link_issues)


def test_scoring_engine():
    """Tests deterministic category and overall score calculations with proportional penalties."""
    # 0 issues -> 100 score
    clean_scores = SeoScoringEngine.calculate_scores(total_pages=10, issues=[])
    assert clean_scores["overall_score"] == 100
    assert clean_scores["technical_score"] == 100
    assert clean_scores["metadata_score"] == 100
    assert clean_scores["score_label"] == "Excellent"

    # Add a high severity metadata issue and critical technical issue
    issues = [
        SeoIssue(
            scan_id="s1",
            page_id="p1",
            issue_code="missing_title",
            category="metadata",
            severity="high",
            title="Missing Title",
            description="No title",
            recommendation="Add title",
        ),
        SeoIssue(
            scan_id="s1",
            page_id="p2",
            issue_code="server_error_5xx",
            category="technical",
            severity="critical",
            title="500 Server Error",
            description="500 Error",
            recommendation="Fix error",
        ),
    ]

    result = SeoScoringEngine.calculate_scores(total_pages=5, issues=issues)
    assert result["overall_score"] < 100
    assert result["technical_score"] < 100
    assert result["metadata_score"] < 100
    assert "score_breakdown" in result
    assert result["score_label"] in ["Excellent", "Good", "Fair", "Needs Improvement", "Poor"]
