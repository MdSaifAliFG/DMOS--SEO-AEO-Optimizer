from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_images(page: SeoPage) -> List[SeoIssue]:
    """Evaluates image attributes (ALT attribute presence)."""
    issues: List[SeoIssue] = []

    missing_alt_images = []
    for img in page.images:
        # None means the alt attribute was completely omitted
        if img.alt is None:
            missing_alt_images.append(img.src)

    if missing_alt_images:
        count = len(missing_alt_images)
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="missing_image_alt",
                category=IssueCategory.LINKS.value,
                severity=IssueSeverity.LOW.value,
                title=f"{count} Image{'s' if count > 1 else ''} Missing ALT Attribute",
                description=f"Found {count} image element(s) with no alt attribute specified.",
                recommendation="Provide descriptive alt text for meaningful images to improve image search ranking and accessibility (or use alt='' for decorative assets).",
                details={"url": page.url, "missing_count": count, "sample_images": missing_alt_images[:5]},
            )
        )

    return issues
