from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_mixed_content(page: SeoPage) -> List[SeoIssue]:
    """Evaluates mixed content (HTTP assets loaded on HTTPS page)."""
    issues: List[SeoIssue] = []

    # Check images or other assets
    insecure_assets = []
    if page.url.startswith("https://") or page.final_url.startswith("https://"):
        for img in page.images:
            if img.src.startswith("http://"):
                insecure_assets.append(img.src)

    if insecure_assets:
        count = len(insecure_assets)
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="mixed_content",
                category=IssueCategory.TECHNICAL.value,
                severity=IssueSeverity.HIGH.value,
                title=f"Mixed Content Detected ({count} Insecure Asset{'s' if count > 1 else ''})",
                description="This HTTPS webpage requests plaintext HTTP images or scripts, triggering browser security warnings.",
                recommendation="Update all internal asset references to use relative protocol ('//') or explicit 'https://'.",
                details={"url": page.url, "insecure_assets": insecure_assets[:5]},
            )
        )

    return issues
