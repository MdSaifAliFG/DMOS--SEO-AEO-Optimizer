from typing import List, Optional
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_title(page: SeoPage) -> List[SeoIssue]:
    """Evaluates page-level title tag rules."""
    issues: List[SeoIssue] = []

    if page.title is None:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="missing_title",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.HIGH.value,
                title="Missing Page Title Tag",
                description="The webpage does not contain an HTML <title> tag.",
                recommendation="Add a unique, descriptive <title> tag inside the <head> element of this page.",
                details={"url": page.url},
            )
        )
    elif len(page.title.strip()) == 0:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="empty_title",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.HIGH.value,
                title="Empty Page Title Tag",
                description="The <title> tag exists but contains no text content.",
                recommendation="Provide a concise, descriptive title text summarizing the page topic.",
                details={"url": page.url},
            )
        )
    else:
        title_len = len(page.title.strip())
        if title_len < 25:
            issues.append(
                SeoIssue(
                    scan_id=page.scan_id,
                    page_id=page.id,
                    issue_code="title_too_short",
                    category=IssueCategory.METADATA.value,
                    severity=IssueSeverity.LOW.value,
                    title="Title Tag is Too Short",
                    description=f"The title is only {title_len} characters long, which may not adequately describe the page.",
                    recommendation="Expand the title tag to 30-60 characters incorporating relevant context.",
                    details={"url": page.url, "title": page.title, "length": title_len},
                )
            )
        elif title_len > 65:
            issues.append(
                SeoIssue(
                    scan_id=page.scan_id,
                    page_id=page.id,
                    issue_code="title_too_long",
                    category=IssueCategory.METADATA.value,
                    severity=IssueSeverity.LOW.value,
                    title="Title Tag is Too Long",
                    description=f"The title is {title_len} characters long and may be truncated in search results.",
                    recommendation="Keep title tags under 60-65 characters so they display completely.",
                    details={"url": page.url, "title": page.title, "length": title_len},
                )
            )

    return issues
