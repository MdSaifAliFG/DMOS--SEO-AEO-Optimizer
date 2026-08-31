from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.services.crawler.sitemap import SitemapResult


def evaluate_sitemap_result(scan_id: str, sitemaps: SitemapResult) -> List[SeoIssue]:
    """Evaluates sitemap availability and syntax."""
    issues: List[SeoIssue] = []

    if not sitemaps.found:
        issues.append(
            SeoIssue(
                scan_id=scan_id,
                page_id=None,
                issue_code="missing_sitemap",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.LOW.value,
                title="Missing XML Sitemap",
                description="No XML sitemaps were discovered at standard locations (/sitemap.xml) or referenced in robots.txt.",
                recommendation="Generate an XML sitemap and submit its location in robots.txt and search engine webmaster tools.",
                details={"checked_locations": sitemaps.sitemap_urls},
            )
        )

    return issues
