import logging
from typing import Any, Dict, List, Set
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from app.services.crawler.http_client import AsyncCrawlerHttpClient
from app.services.crawler.url_normalizer import is_internal_url, normalize_url

logger = logging.getLogger(__name__)


class SitemapResult:
    """Stores the aggregated results of sitemap discovery."""

    def __init__(
        self,
        found: bool,
        sitemap_urls: List[str],
        discovered_urls: List[str],
        details: List[Dict[str, Any]],
    ):
        self.found = found
        self.sitemap_urls = sitemap_urls
        self.discovered_urls = discovered_urls
        self.details = details

    def to_dict(self) -> Dict[str, Any]:
        return {
            "found": self.found,
            "sitemap_urls": self.sitemap_urls,
            "urls_count": len(self.discovered_urls),
            "details": self.details,
        }


class SitemapParser:
    """Discovers and parses standard XML sitemaps and sitemap indexes."""

    @staticmethod
    async def discover_and_parse(
        http_client: AsyncCrawlerHttpClient,
        target_url: str,
        project_domain: str,
        robots_sitemaps: List[str],
        max_sitemaps_to_fetch: int = 10,
        max_urls_to_extract: int = 2000,
    ) -> SitemapResult:
        parsed = urlparse(target_url)
        scheme = parsed.scheme or "https"
        netloc = parsed.netloc

        candidate_sitemaps: List[str] = list(robots_sitemaps)
        standard_locations = [
            f"{scheme}://{netloc}/sitemap.xml",
            f"{scheme}://{netloc}/sitemap_index.xml",
            f"{scheme}://{netloc}/sitemap-index.xml",
        ]
        for loc in standard_locations:
            if loc not in candidate_sitemaps:
                candidate_sitemaps.append(loc)

        processed_sitemaps: Set[str] = set()
        sitemaps_queue: List[str] = list(candidate_sitemaps)
        discovered_urls: Set[str] = set()
        details: List[Dict[str, Any]] = []

        while sitemaps_queue and len(processed_sitemaps) < max_sitemaps_to_fetch:
            sm_url = sitemaps_queue.pop(0)
            if sm_url in processed_sitemaps:
                continue

            processed_sitemaps.add(sm_url)
            res = await http_client.fetch(sm_url)

            if not res.is_success or not res.text:
                details.append({
                    "url": sm_url,
                    "status_code": res.status_code,
                    "success": False,
                    "urls_extracted": 0,
                    "error": res.error or f"HTTP {res.status_code}",
                })
                continue

            # Parse XML
            try:
                soup = BeautifulSoup(res.text, "xml")
            except Exception:
                try:
                    soup = BeautifulSoup(res.text, "html.parser")
                except Exception as exc:
                    details.append({
                        "url": sm_url,
                        "status_code": res.status_code,
                        "success": False,
                        "urls_extracted": 0,
                        "error": f"Failed to parse XML: {str(exc)}",
                    })
                    continue

            # 1. Check if it is a Sitemap Index
            sitemap_tags = soup.find_all("sitemap")
            if sitemap_tags:
                sub_count = 0
                for s_tag in sitemap_tags:
                    loc_tag = s_tag.find("loc")
                    if loc_tag and loc_tag.text:
                        sub_url = loc_tag.text.strip()
                        if sub_url not in processed_sitemaps and sub_url not in sitemaps_queue:
                            sitemaps_queue.append(sub_url)
                            sub_count += 1

                details.append({
                    "url": sm_url,
                    "status_code": res.status_code,
                    "success": True,
                    "is_index": True,
                    "sub_sitemaps_found": sub_count,
                    "urls_extracted": 0,
                })
                continue

            # 2. Extract URLs from urlset
            url_tags = soup.find_all("url")
            extracted_this_sitemap = 0

            for u_tag in url_tags:
                if len(discovered_urls) >= max_urls_to_extract:
                    break
                loc_tag = u_tag.find("loc")
                if loc_tag and loc_tag.text:
                    raw_loc = loc_tag.text.strip()
                    norm_loc = normalize_url(raw_loc)
                    if norm_loc and is_internal_url(norm_loc, project_domain):
                        discovered_urls.add(norm_loc)
                        extracted_this_sitemap += 1

            details.append({
                "url": sm_url,
                "status_code": res.status_code,
                "success": True,
                "is_index": False,
                "urls_extracted": extracted_this_sitemap,
            })

        has_found = any(d.get("success") for d in details)

        return SitemapResult(
            found=has_found,
            sitemap_urls=list(processed_sitemaps),
            discovered_urls=list(discovered_urls),
            details=details,
        )
