from typing import Dict, List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_links(
    page: SeoPage,
    crawled_status_map: Dict[str, int],
) -> List[SeoIssue]:
    """Evaluates link health against crawled destination statuses."""
    issues: List[SeoIssue] = []

    broken_links = []
    redirecting_links = []

    for link in page.links:
        if not link.is_internal:
            continue

        target_status = crawled_status_map.get(link.target_url)
        if target_status is not None:
            link.status_code = target_status
            if target_status >= 400:
                broken_links.append({
                    "target_url": link.target_url,
                    "anchor_text": link.anchor_text,
                    "status_code": target_status,
                })
            elif target_status in (301, 302, 303, 307, 308):
                redirecting_links.append({
                    "target_url": link.target_url,
                    "anchor_text": link.anchor_text,
                    "status_code": target_status,
                })

    if broken_links:
        count = len(broken_links)
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="broken_internal_link",
                category=IssueCategory.LINKS.value,
                severity=IssueSeverity.HIGH.value,
                title=f"Page Contains {count} Broken Internal Link{'s' if count > 1 else ''}",
                description=f"This page links to {count} internal destination(s) that return HTTP 4xx or 5xx error status.",
                recommendation="Update or remove broken internal links to prevent wasting crawl budget and degrading user navigation.",
                details={"source_url": page.url, "broken_links": broken_links[:10]},
            )
        )

    if redirecting_links:
        count = len(redirecting_links)
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="internal_link_to_redirect",
                category=IssueCategory.LINKS.value,
                severity=IssueSeverity.LOW.value,
                title=f"Page Links to {count} Redirecting Internal URL{'s' if count > 1 else ''}",
                description=f"This page points to internal URLs that return 3xx redirects.",
                recommendation="Update internal anchor links directly to their final destination URLs to preserve link equity and reduce latency.",
                details={"source_url": page.url, "redirect_links": redirecting_links[:10]},
            )
        )

    return issues
