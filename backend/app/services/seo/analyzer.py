import logging
from collections import defaultdict
from typing import Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage
from app.services.crawler.robots import RobotsResult
from app.services.crawler.sitemap import SitemapResult
from app.services.seo.rules.canonical import evaluate_page_canonical
from app.services.seo.rules.content import evaluate_page_content
from app.services.seo.rules.depth import evaluate_page_depth
from app.services.seo.rules.headings import evaluate_page_headings
from app.services.seo.rules.https import evaluate_page_https
from app.services.seo.rules.images import evaluate_page_images
from app.services.seo.rules.indexability import evaluate_page_indexability
from app.services.seo.rules.links import evaluate_page_links
from app.services.seo.rules.meta import evaluate_page_meta
from app.services.seo.rules.mixed_content import evaluate_page_mixed_content
from app.services.seo.rules.performance import evaluate_page_performance
from app.services.seo.rules.robots import evaluate_robots_result
from app.services.seo.rules.sitemap import evaluate_sitemap_result
from app.services.seo.rules.social import evaluate_page_social
from app.services.seo.rules.status import evaluate_page_status
from app.services.seo.rules.title import evaluate_page_title

logger = logging.getLogger(__name__)


class SeoAnalyzer:
    """
    Technical SEO Rule Evaluator.
    Runs modular rules against all crawled pages and produces categorized SeoIssue records.
    """

    @classmethod
    async def analyze_scan(
        cls,
        db: AsyncSession,
        scan_id: str,
        project_domain: str,
        pages: List[SeoPage],
        robots_result: Optional[RobotsResult] = None,
        sitemap_result: Optional[SitemapResult] = None,
    ) -> List[SeoIssue]:
        all_issues: List[SeoIssue] = []

        # Map crawled URL -> status code for broken link evaluation
        crawled_status_map: Dict[str, int] = {p.url: p.status_code for p in pages}
        if robots_result:
            crawled_status_map[robots_result.url] = robots_result.status_code

        # 1. Evaluate Scan-Level Rules
        if robots_result:
            all_issues.extend(evaluate_robots_result(scan_id, robots_result))

        if sitemap_result:
            all_issues.extend(evaluate_sitemap_result(scan_id, sitemap_result))

        # Track for cross-page duplicate detection
        title_to_pages: Dict[str, List[SeoPage]] = defaultdict(list)
        desc_to_pages: Dict[str, List[SeoPage]] = defaultdict(list)

        # 2. Evaluate Page-Level Rules
        for page in pages:
            all_issues.extend(evaluate_page_status(page))
            all_issues.extend(evaluate_page_https(page))
            all_issues.extend(evaluate_page_title(page))
            all_issues.extend(evaluate_page_meta(page))
            all_issues.extend(evaluate_page_headings(page))
            all_issues.extend(evaluate_page_canonical(page, project_domain))
            all_issues.extend(evaluate_page_indexability(page))
            all_issues.extend(evaluate_page_images(page))
            all_issues.extend(evaluate_page_links(page, crawled_status_map))
            all_issues.extend(evaluate_page_mixed_content(page))
            all_issues.extend(evaluate_page_content(page))
            all_issues.extend(evaluate_page_social(page))
            all_issues.extend(evaluate_page_depth(page))
            all_issues.extend(evaluate_page_performance(page))

            # Collect for duplicate checks (if title / desc exists and is non-empty)
            if page.title and len(page.title.strip()) > 3:
                norm_title = " ".join(page.title.strip().lower().split())
                title_to_pages[norm_title].append(page)

            if page.meta_description and len(page.meta_description.strip()) > 10:
                norm_desc = " ".join(page.meta_description.strip().lower().split())
                desc_to_pages[norm_desc].append(page)

        # 3. Cross-Page Duplicate Title Detection
        for title_str, dup_pages in title_to_pages.items():
            if len(dup_pages) > 1:
                dup_urls = [p.url for p in dup_pages]
                for p in dup_pages:
                    all_issues.append(
                        SeoIssue(
                            scan_id=scan_id,
                            page_id=p.id,
                            issue_code="duplicate_title",
                            category=IssueCategory.METADATA.value,
                            severity=IssueSeverity.MEDIUM.value,
                            title=f"Duplicate Title Tag ({len(dup_pages)} Pages)",
                            description=f"This title is shared verbatim across {len(dup_pages)} pages: '{p.title}'",
                            recommendation="Create unique, distinct title tags for each indexed page to help search engines differentiate content.",
                            details={"title": p.title, "duplicate_urls": dup_urls[:10], "total_duplicates": len(dup_pages)},
                        )
                    )

        # 4. Cross-Page Duplicate Meta Description Detection
        for desc_str, dup_pages in desc_to_pages.items():
            if len(dup_pages) > 1:
                dup_urls = [p.url for p in dup_pages]
                for p in dup_pages:
                    all_issues.append(
                        SeoIssue(
                            scan_id=scan_id,
                            page_id=p.id,
                            issue_code="duplicate_meta_description",
                            category=IssueCategory.METADATA.value,
                            severity=IssueSeverity.MEDIUM.value,
                            title=f"Duplicate Meta Description ({len(dup_pages)} Pages)",
                            description=f"This meta description is shared across {len(dup_pages)} pages.",
                            recommendation="Write unique meta descriptions that accurately summarize each specific page.",
                            details={"meta_description": p.meta_description, "duplicate_urls": dup_urls[:10], "total_duplicates": len(dup_pages)},
                        )
                    )

        # Persist all issues to database
        for issue in all_issues:
            db.add(issue)

        try:
            await db.commit()
        except Exception as e:
            logger.error("Error saving SEO issues to database: %s", e)
            await db.rollback()

        return all_issues
