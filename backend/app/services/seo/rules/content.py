from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_content(page: SeoPage) -> List[SeoIssue]:
    """
    Evaluates page content length and word count for SEO health.
    """
    issues: List[SeoIssue] = []

    # Only evaluate successful HTML pages
    if page.status_code != 200 or not page.content_type.startswith("text/html"):
        return issues

    # Skip evaluation on pages marked noindex
    if not page.is_indexable:
        return issues

    word_count = page.word_count or 0

    if word_count == 0:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="empty_content",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.HIGH.value,
                title="Empty Page Content",
                description="The page contains no detectable readable body text.",
                recommendation="Ensure the page delivers substantive, indexable text content relevant to the user's search intent.",
                details={"url": page.url, "word_count": word_count},
            )
        )
    elif word_count < 100:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="thin_content",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.MEDIUM.value,
                title="Potential Thin Content",
                description=f"The page has a very low word count ({word_count} words), which search engines may classify as low value or thin content.",
                recommendation="Expand the page copy with valuable, comprehensive information (aim for 250+ words where appropriate for the page type).",
                details={"url": page.url, "word_count": word_count},
            )
        )

    return issues
