import asyncio
from datetime import datetime, timezone
import logging
import time
from typing import Any, Callable, Coroutine, Dict, List, Optional, Set, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.models.seo_page import SeoPage, SeoPageImage, SeoPageLink
from app.services.crawler.http_client import AsyncCrawlerHttpClient
from app.services.crawler.page_fetcher import PageFetcher
from app.services.crawler.robots import RobotsParser, RobotsResult
from app.services.crawler.sitemap import SitemapParser, SitemapResult
from app.services.crawler.url_normalizer import is_internal_url, normalize_url
from app.services.crawler.url_validator import is_url_safe

logger = logging.getLogger(__name__)


class CrawlItem:
    def __init__(self, url: str, depth: int = 0):
        self.url = url
        self.depth = depth


class CrawlExecutionResult:
    """Aggregated output of a completed crawler run."""

    def __init__(
        self,
        scan_id: str,
        pages: List[SeoPage],
        robots_result: RobotsResult,
        sitemap_result: SitemapResult,
        pages_discovered: int,
        pages_crawled: int,
        pages_failed: int,
        pages_skipped: int,
        crawl_duration: float,
    ):
        self.scan_id = scan_id
        self.pages = pages
        self.robots_result = robots_result
        self.sitemap_result = sitemap_result
        self.pages_discovered = pages_discovered
        self.pages_crawled = pages_crawled
        self.pages_failed = pages_failed
        self.pages_skipped = pages_skipped
        self.crawl_duration = crawl_duration


class WebsiteCrawler:
    """
    Asynchronous Web Crawler Engine for SEO Audits.
    Executes depth-limited, concurrency-controlled crawl adhering to robots.txt and sitemaps.
    """

    def __init__(
        self,
        scan_id: str,
        target_url: str,
        project_domain: str,
        max_pages: Optional[int] = None,
        max_depth: Optional[int] = None,
        concurrency: Optional[int] = None,
        timeout: Optional[int] = None,
        respect_robots: bool = True,
        follow_external_links: bool = False,
        include_subdomains: bool = False,
        progress_callback: Optional[Callable[[int, int, int, str], Coroutine[Any, Any, None]]] = None,
        cancellation_check: Optional[Callable[[], Coroutine[Any, Any, bool]]] = None,
        log_callback: Optional[Callable[[str, str, str], Coroutine[Any, Any, None]]] = None,
    ):
        self.scan_id = scan_id
        self.target_url = normalize_url(target_url) or target_url
        self.project_domain = project_domain
        self.max_pages = max_pages or settings.CRAWL_MAX_PAGES
        self.max_depth = max_depth or settings.CRAWL_MAX_DEPTH
        self.concurrency = concurrency or settings.CRAWL_CONCURRENCY
        self.timeout = timeout or settings.CRAWL_TIMEOUT
        self.respect_robots = respect_robots
        self.follow_external_links = follow_external_links
        self.include_subdomains = include_subdomains
        self.progress_callback = progress_callback
        self.cancellation_check = cancellation_check
        self.log_callback = log_callback

        self.http_client = AsyncCrawlerHttpClient(timeout=self.timeout)
        self.visited_urls: Set[str] = set()
        self.queued_urls: Set[str] = set()
        self.crawled_pages: List[SeoPage] = []
        self.pages_failed = 0
        self.pages_skipped = 0

    async def _emit_log(self, step: str, message: str, level: str = "INFO") -> None:
        if self.log_callback:
            try:
                await self.log_callback(step, message, level)
            except Exception:
                pass

    async def _is_cancelled(self) -> bool:
        if self.cancellation_check:
            try:
                return await self.cancellation_check()
            except Exception:
                return False
        return False

    async def run(self, db: AsyncSession) -> CrawlExecutionResult:
        """Executes the full crawl lifecycle."""
        start_time = time.perf_counter()

        await self._emit_log(
            "Crawl Initialization",
            f"Starting crawler for '{self.target_url}' (domain: {self.project_domain}, max pages: {self.max_pages}, max depth: {self.max_depth}, respect robots: {self.respect_robots})",
            "INFO",
        )

        # 1. Fetch & Parse robots.txt
        await self._emit_log("Robots.txt", f"Checking robots.txt for {self.project_domain}...", "INFO")
        robots_res = await RobotsParser.fetch_and_parse(self.http_client, self.target_url)
        if robots_res.exists:
            await self._emit_log(
                "Robots.txt",
                f"robots.txt found (status {robots_res.status_code}). Disallow all: {robots_res.disallow_all}, sitemaps declared: {len(robots_res.sitemaps)}",
                "INFO",
            )
        else:
            await self._emit_log("Robots.txt", "No robots.txt found (status 404/unavailable); proceeding with unrestricted crawl.", "INFO")

        if await self._is_cancelled():
            await self.http_client.close()
            return CrawlExecutionResult(self.scan_id, [], robots_res, SitemapResult(self.target_url), 0, 0, 0, 0, 0.0)

        # 2. Fetch & Parse Sitemap XML
        await self._emit_log("Sitemap.xml", f"Checking sitemaps for {self.project_domain}...", "INFO")
        sitemap_res = await SitemapParser.fetch_and_parse(
            self.http_client,
            self.target_url,
            declared_sitemaps=robots_res.sitemaps,
        )
        if sitemap_res.exists:
            await self._emit_log(
                "Sitemap.xml",
                f"Sitemap discovered ({len(sitemap_res.discovered_urls)} URLs indexed across {len(sitemap_res.sitemaps_found)} sitemap files).",
                "INFO",
            )
        else:
            await self._emit_log("Sitemap.xml", "No XML sitemap detected at standard locations.", "INFO")

        if await self._is_cancelled():
            await self.http_client.close()
            return CrawlExecutionResult(self.scan_id, [], robots_res, sitemap_res, 0, 0, 0, 0, 0.0)

        # 3. Initialize BFS Queue
        queue: List[CrawlItem] = []

        # Seed start URL
        queue.append(CrawlItem(url=self.target_url, depth=0))
        self.queued_urls.add(self.target_url)

        # Seed sitemap URLs (up to max_pages)
        for sm_url in sitemap_res.discovered_urls:
            if len(queue) >= self.max_pages:
                break
            if sm_url not in self.queued_urls:
                queue.append(CrawlItem(url=sm_url, depth=1))
                self.queued_urls.add(sm_url)

        semaphore = asyncio.Semaphore(self.concurrency)

        # 4. Asynchronous BFS Crawl Loop
        while queue and len(self.visited_urls) < self.max_pages:
            if await self._is_cancelled():
                await self._emit_log("Crawler Halted", "Crawl execution cancelled by user request.", "WARNING")
                break

            # Batch up to concurrency limit
            batch: List[CrawlItem] = []
            while queue and len(batch) < self.concurrency and (len(self.visited_urls) + len(batch)) < self.max_pages:
                item = queue.pop(0)
                if item.url not in self.visited_urls:
                    batch.append(item)

            if not batch:
                break

            async def process_item(item: CrawlItem) -> Optional[SeoPage]:
                async with semaphore:
                    if await self._is_cancelled():
                        return None

                    url = item.url
                    self.visited_urls.add(url)

                    # Check robots.txt permissions if respect_robots is True
                    if self.respect_robots and not robots_res.is_allowed(url):
                        self.pages_skipped += 1
                        await self._emit_log("Robots Disallowed", f"Skipping {url} (blocked by robots.txt rules)", "INFO")
                        return None

                    # Pre-check URL safety
                    if not is_url_safe(url, check_dns=False):
                        self.pages_failed += 1
                        return None

                    try:
                        fetch_res, parsed_data, render_method = await PageFetcher.fetch_and_parse(
                            self.http_client,
                            url,
                            self.project_domain,
                            validate_ssrf=True,
                            check_dns=False,
                        )

                        if not fetch_res.is_success and fetch_res.status_code == 0:
                            self.pages_failed += 1
                            await self._emit_log("Crawl Error", f"Failed to fetch {url}: {fetch_res.error}", "WARNING")
                            return None

                        # Create SeoPage ORM model
                        page = SeoPage(
                            scan_id=self.scan_id,
                            url=url,
                            final_url=fetch_res.final_url or url,
                            status_code=fetch_res.status_code,
                            content_type=fetch_res.content_type,
                            title=parsed_data.title if parsed_data else None,
                            meta_description=parsed_data.meta_description if parsed_data else None,
                            canonical_url=parsed_data.canonical_url if parsed_data else None,
                            robots_directive=parsed_data.robots_directive if parsed_data else None,
                            x_robots_tag=parsed_data.x_robots_tag if parsed_data else None,
                            language=parsed_data.language if parsed_data else None,
                            h1_count=parsed_data.h1_count if parsed_data else 0,
                            h2_count=parsed_data.h2_count if parsed_data else 0,
                            h3_count=parsed_data.h3_count if parsed_data else 0,
                            headings=parsed_data.headings if parsed_data else {},
                            word_count=parsed_data.word_count if parsed_data else 0,
                            response_time=fetch_res.response_time,
                            content_length=fetch_res.content_length,
                            is_indexable=parsed_data.is_indexable if parsed_data else True,
                            is_internal=is_internal_url(url, self.project_domain),
                            crawl_depth=item.depth,
                            render_method=render_method,
                            redirect_chain=fetch_res.redirect_chain,
                            open_graph=parsed_data.open_graph if parsed_data else {},
                            twitter_card=parsed_data.twitter_card if parsed_data else {},
                            structured_data=parsed_data.structured_data if parsed_data else [],
                        )

                        # Attach images
                        if parsed_data and parsed_data.images:
                            for img_d in parsed_data.images:
                                page.images.append(
                                    SeoPageImage(
                                        src=img_d["src"],
                                        alt=img_d["alt"],
                                        width=img_d.get("width"),
                                        height=img_d.get("height"),
                                        is_internal=img_d.get("is_internal", True),
                                    )
                                )

                        # Attach links & discover new internal links
                        if parsed_data and parsed_data.links:
                            for link_d in parsed_data.links:
                                page.links.append(
                                    SeoPageLink(
                                        target_url=link_d["target_url"],
                                        anchor_text=link_d.get("anchor_text"),
                                        link_type=link_d.get("link_type", "internal"),
                                        is_internal=link_d.get("is_internal", True),
                                        is_follow=link_d.get("is_follow", True),
                                    )
                                )

                                # Enqueue internal link if within max depth
                                should_enqueue = (
                                    (link_d["is_internal"] or self.follow_external_links)
                                    and item.depth + 1 <= self.max_depth
                                    and link_d["target_url"] not in self.visited_urls
                                    and link_d["target_url"] not in self.queued_urls
                                    and len(self.queued_urls) < self.max_pages * 3
                                )
                                if should_enqueue:
                                    self.queued_urls.add(link_d["target_url"])
                                    queue.append(CrawlItem(url=link_d["target_url"], depth=item.depth + 1))

                        db.add(page)
                        return page

                    except Exception as e:
                        logger.exception("Error processing URL %s: %s", url, e)
                        self.pages_failed += 1
                        return None

            # Execute batch concurrently
            results = await asyncio.gather(*[process_item(item) for item in batch])
            for p in results:
                if p:
                    self.crawled_pages.append(p)

            # Flush batch to DB
            try:
                await db.commit()
            except Exception as e:
                logger.error("Error committing crawled pages to database: %s", e)
                await db.rollback()

            # Progress update callback
            if self.progress_callback:
                try:
                    await self.progress_callback(
                        len(self.queued_urls),
                        len(self.visited_urls),
                        self.pages_failed,
                        batch[-1].url if batch else "",
                    )
                except Exception:
                    pass

        # Cleanup HTTP client
        await self.http_client.close()

        total_duration = round(time.perf_counter() - start_time, 2)
        await self._emit_log(
            "Crawl Completed",
            f"Finished crawl in {total_duration}s. Crawled {len(self.crawled_pages)} pages, discovered {len(self.queued_urls)} URLs, failed {self.pages_failed}.",
            "SUCCESS",
        )

        return CrawlExecutionResult(
            scan_id=self.scan_id,
            pages=self.crawled_pages,
            robots_result=robots_res,
            sitemap_result=sitemap_res,
            pages_discovered=len(self.queued_urls),
            pages_crawled=len(self.crawled_pages),
            pages_failed=self.pages_failed,
            pages_skipped=self.pages_skipped,
            crawl_duration=total_duration,
        )
