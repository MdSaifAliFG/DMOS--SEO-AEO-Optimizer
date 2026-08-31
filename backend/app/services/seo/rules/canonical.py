from typing import List
from urllib.parse import urlparse
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage
from app.services.crawler.url_normalizer import get_root_domain, is_internal_url, normalize_url


def evaluate_page_canonical(page: SeoPage, project_domain: str) -> List[SeoIssue]:
    """Evaluates canonical URL consistency and configuration."""
    issues: List[SeoIssue] = []

    if not page.canonical_url:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="missing_canonical",
                category=IssueCategory.INDEXABILITY.value,
                severity=IssueSeverity.LOW.value,
                title="Missing Canonical Tag",
                description="The page does not specify a rel='canonical' link tag.",
                recommendation="Add a canonical tag pointing to the authoritative version of this URL to prevent duplicate content issues.",
                details={"url": page.url},
            )
        )
    else:
        norm_canonical = normalize_url(page.canonical_url)
        norm_page = normalize_url(page.url)

        # Cross-domain canonical check (Informational)
        if not is_internal_url(page.canonical_url, project_domain):
            issues.append(
                SeoIssue(
                    scan_id=page.scan_id,
                    page_id=page.id,
                    issue_code="cross_domain_canonical",
                    category=IssueCategory.INDEXABILITY.value,
                    severity=IssueSeverity.INFO.value,
                    title="Cross-Domain Canonical Tag",
                    description=f"The canonical URL points to an external domain ({urlparse(page.canonical_url).netloc}).",
                    recommendation="Verify that this cross-domain canonicalization is intentional (e.g. syndication or multi-site content sharing).",
                    details={"url": page.url, "canonical_url": page.canonical_url},
                )
            )

    return issues
