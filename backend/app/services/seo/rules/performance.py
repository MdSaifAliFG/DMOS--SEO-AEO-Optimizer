from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_performance(page: SeoPage) -> List[SeoIssue]:
    """
    Evaluates server response time for a crawled page.
    """
    issues: List[SeoIssue] = []

    # Only evaluate live pages
    if page.status_code == 200 and page.response_time > 2.0:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="slow_server_response",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.LOW.value,
                title="Slow Server Response Time",
                description=f"The server took {page.response_time:.2f}s to return the HTML document (recommended TTFB: < 1.0s).",
                recommendation="Optimize server-side response times via database indexing, edge caching (CDN), server compression (gzip/brotli), and caching headers.",
                details={"url": page.url, "response_time_seconds": round(page.response_time, 3)},
            )
        )

    return issues
