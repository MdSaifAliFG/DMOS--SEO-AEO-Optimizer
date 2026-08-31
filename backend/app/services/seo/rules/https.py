from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_https(page: SeoPage) -> List[SeoIssue]:
    """Evaluates HTTPS security for crawled URLs."""
    issues: List[SeoIssue] = []

    if page.url.startswith("http://"):
        # Check if page redirected to https
        redirected_to_https = page.final_url.startswith("https://")
        if not redirected_to_https:
            issues.append(
                SeoIssue(
                    scan_id=page.scan_id,
                    page_id=page.id,
                    issue_code="insecure_http",
                    category=IssueCategory.TECHNICAL.value,
                    severity=IssueSeverity.HIGH.value,
                    title="Page Served Over Insecure HTTP",
                    description="The webpage is accessible over plaintext HTTP without an automatic redirect to HTTPS.",
                    recommendation="Enforce full-site HTTPS encryption with 301 redirects and HSTS headers.",
                    details={"url": page.url, "final_url": page.final_url},
                )
            )

    return issues
