from typing import List, Optional
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_meta(page: SeoPage) -> List[SeoIssue]:
    """Evaluates meta description rules."""
    issues: List[SeoIssue] = []

    if page.meta_description is None or len(page.meta_description.strip()) == 0:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="missing_meta_description",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.MEDIUM.value,
                title="Missing Meta Description",
                description="The page does not specify a meta description tag.",
                recommendation="Add a descriptive meta description (120-160 characters) summarizing the page.",
                details={"url": page.url},
            )
        )
    else:
        desc_len = len(page.meta_description.strip())
        if desc_len < 50:
            issues.append(
                SeoIssue(
                    scan_id=page.scan_id,
                    page_id=page.id,
                    issue_code="meta_description_too_short",
                    category=IssueCategory.METADATA.value,
                    severity=IssueSeverity.LOW.value,
                    title="Meta Description is Too Short",
                    description=f"Meta description is only {desc_len} characters long.",
                    recommendation="Expand the meta description to between 120 and 160 characters.",
                    details={"url": page.url, "meta_description": page.meta_description, "length": desc_len},
                )
            )
        elif desc_len > 165:
            issues.append(
                SeoIssue(
                    scan_id=page.scan_id,
                    page_id=page.id,
                    issue_code="meta_description_too_long",
                    category=IssueCategory.METADATA.value,
                    severity=IssueSeverity.LOW.value,
                    title="Meta Description is Too Long",
                    description=f"Meta description is {desc_len} characters long and may be truncated.",
                    recommendation="Trim meta description to under 160 characters for optimal display in SERPs.",
                    details={"url": page.url, "meta_description": page.meta_description, "length": desc_len},
                )
            )

    return issues
