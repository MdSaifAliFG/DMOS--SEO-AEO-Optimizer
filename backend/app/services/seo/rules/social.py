from typing import List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


def evaluate_page_social(page: SeoPage) -> List[SeoIssue]:
    """
    Evaluates Open Graph and Twitter Card social metadata for a page.
    """
    issues: List[SeoIssue] = []

    # Only check successful indexable HTML pages
    if page.status_code != 200 or not page.content_type.startswith("text/html") or not page.is_indexable:
        return issues

    og = page.open_graph or {}
    tw = page.twitter_card or {}

    # Check Open Graph tags
    missing_og = []
    if not og.get("title"):
        missing_og.append("og:title")
    if not og.get("description"):
        missing_og.append("og:description")
    if not og.get("image"):
        missing_og.append("og:image")

    if len(missing_og) >= 2:
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="missing_open_graph",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.LOW.value,
                title="Missing Open Graph Tags",
                description=f"The page is missing essential Open Graph protocol tags ({', '.join(missing_og)}) used when sharing on social platforms and messaging apps.",
                recommendation="Add standard og:title, og:description, and og:image meta tags to control how URLs appear in social previews.",
                details={"url": page.url, "missing_tags": missing_og},
            )
        )

    # Check Twitter Card
    if not tw.get("card") and not tw.get("title"):
        issues.append(
            SeoIssue(
                scan_id=page.scan_id,
                page_id=page.id,
                issue_code="missing_twitter_card",
                category=IssueCategory.METADATA.value,
                severity=IssueSeverity.LOW.value,
                title="Missing Twitter/X Card Tags",
                description="The page does not specify twitter:card meta tags for rich social snippets on X (Twitter).",
                recommendation="Add <meta name='twitter:card' content='summary_large_image'> to enable rich summary cards.",
                details={"url": page.url},
            )
        )

    return issues
