from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.services.crawler.robots import RobotsResult


def evaluate_robots_result(scan_id: str, robots: RobotsResult) -> List[SeoIssue]:
    """Evaluates website-level robots.txt configuration."""
    issues: List[SeoIssue] = []

    if not robots.exists:
        issues.append(
            SeoIssue(
                scan_id=scan_id,
                page_id=None,
                issue_code="missing_robots_txt",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.LOW.value,
                title="Missing robots.txt File",
                description="The website does not serve a robots.txt file (returned 404/error).",
                recommendation="Create a /robots.txt file to guide search engine crawlers and specify XML sitemap locations.",
                details={"status_code": robots.status_code, "url": robots.url},
            )
        )
    elif robots.disallow_all:
        issues.append(
            SeoIssue(
                scan_id=scan_id,
                page_id=None,
                issue_code="robots_disallow_all",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.HIGH.value,
                title="robots.txt Blocks All Crawling ('Disallow: /')",
                description="The robots.txt file contains a global 'Disallow: /' rule that blocks search engines from crawling the entire site.",
                recommendation="If this is a live production website, update robots.txt to permit search engine bot access.",
                details={"url": robots.url},
            )
        )

    return issues
