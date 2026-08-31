from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_status(page: SeoPage) -> List[SeoIssue]:
    """Evaluates HTTP response status codes and server performance."""
    issues: List[SeoIssue] = []

    if page.status_code >= 500:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="server_error_5xx",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.CRITICAL.value,
                title=f"Internal Server Error (HTTP {page.status_code})",
                description=f"The server encountered an error while serving this URL (HTTP {page.status_code}).",
                recommendation="Investigate backend web server application logs to resolve internal server crash or gateway timeout.",
                details={"url": page.url, "status_code": page.status_code},
            )
        )
    elif page.status_code >= 400:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="client_error_4xx",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.HIGH.value,
                title=f"Client Error / Broken Page (HTTP {page.status_code})",
                description=f"The requested page returned an error status code (HTTP {page.status_code}).",
                recommendation="Ensure the resource exists or setup a clean 301 redirect to a relevant live page.",
                details={"url": page.url, "status_code": page.status_code},
            )
        )

    # Slow response time check
    if page.response_time > 2.5:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="slow_response_time",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.LOW.value,
                title=f"Slow Response Time ({round(page.response_time, 2)}s)",
                description=f"The initial HTML response took {round(page.response_time, 2)} seconds to download.",
                recommendation="Optimize database queries, backend rendering, and enable server-side caching / CDN edge delivery.",
                details={"url": page.url, "response_time": page.response_time},
            )
        )

    return issues
