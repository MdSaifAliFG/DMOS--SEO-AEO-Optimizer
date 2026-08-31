from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_headings(page: SeoPage) -> List[SeoIssue]:
    """Evaluates H1 heading structure."""
    issues: List[SeoIssue] = []

    if page.h1_count == 0:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="missing_h1",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.MEDIUM.value,
                title="Missing H1 Heading",
                description="The page does not contain any <h1> heading element.",
                recommendation="Include a single, clear <h1> tag representing the primary topic of the page.",
                details={"url": page.url},
            )
        )
    elif page.h1_count > 1:
        h1_texts = page.headings.get("h1", []) if page.headings else []
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="multiple_h1",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.LOW.value,
                title="Multiple H1 Headings Detected",
                description=f"The page has {page.h1_count} <h1> headings. Best practices generally recommend a single top-level heading.",
                recommendation="Consider consolidating into a single main <h1> heading and using <h2>/<h3> for subsections.",
                details={"url": page.url, "h1_count": page.h1_count, "h1_headings": h1_texts},
            )
        )

    return issues
