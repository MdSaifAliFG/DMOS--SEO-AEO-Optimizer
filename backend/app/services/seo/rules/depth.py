from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_depth(page: SeoPage, max_recommended_depth: int = 3) -> List[SeoIssue]:
    """
    Evaluates click depth from the start URL to find deeply nested pages.
    """
    issues: List[SeoIssue] = []

    if page.status_code == 200 and page.crawl_depth > max_recommended_depth:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="deep_crawl_depth",
                category=IssueCategory.LINKS.value,
                severity=IssueSeverity.LOW.value,
                title="Deeply Nested Webpage",
                description=f"This page requires {page.crawl_depth} clicks from the root homepage to reach (recommended depth: ≤ {max_recommended_depth}).",
                recommendation="Improve site architecture and internal linking by adding direct navigation links, category hub links, or breadcrumbs.",
                details={"url": page.url, "depth": page.crawl_depth, "max_recommended": max_recommended_depth},
            )
        )

    return issues
