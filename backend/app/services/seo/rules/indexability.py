from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_indexability(page: SeoPage) -> List[SeoIssue]:
    """Evaluates indexability directives (noindex, X-Robots-Tag)."""
    issues: List[SeoIssue] = []

    has_noindex_meta = page.robots_directive and "noindex" in page.robots_directive
    has_noindex_header = page.x_robots_tag and "noindex" in page.x_robots_tag

    if has_noindex_meta or has_noindex_header:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="noindex_directive",
                category=IssueCategory.INDEXABILITY.value,
                severity=IssueSeverity.INFO.value,
                title="Page Has 'noindex' Directive",
                description="Search engine crawlers are explicitly instructed not to index this page.",
                recommendation="Confirm that this page is meant to be excluded from search indices (e.g. login, staging, admin, or private user dashboard).",
                details={
                    "url": page.url,
                    "robots_directive": page.robots_directive,
                    "x_robots_tag": page.x_robots_tag,
                },
            )
        )

    return issues
