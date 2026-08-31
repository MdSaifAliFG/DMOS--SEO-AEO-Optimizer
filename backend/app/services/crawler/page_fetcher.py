import logging
import re
from typing import Optional, Tuple
from app.services.crawler.http_client import AsyncCrawlerHttpClient, FetchResult
from app.services.crawler.page_parser import HTMLPageParser, ParsedPageData

logger = logging.getLogger(__name__)


class PageFetcher:
    """Fetches pages via HTTP client and falls back to browser rendering when needed."""

    @staticmethod
    def is_spa_javascript_only(html: str) -> bool:
        """Heuristic check to detect if HTML is an empty client-side SPA bundle."""
        if not html:
            return False
        # If very small HTML containing typical single mounting points with no content
        clean_html = re.sub(r"\s+", " ", html)
        if len(clean_html) < 2000 and (
            '<div id="root"></div>' in clean_html
            or '<div id="app"></div>' in clean_html
            or '<div id="__next"></div>' in clean_html
        ):
            return True
        return False

    @classmethod
    async def fetch_and_parse(
        cls,
        http_client: AsyncCrawlerHttpClient,
        url: str,
        project_domain: str,
        validate_ssrf: bool = True,
        check_dns: bool = True,
    ) -> Tuple[FetchResult, Optional[ParsedPageData], str]:
        """
        Fetches the URL, parses HTML metadata, and returns (FetchResult, ParsedPageData, render_method).
        """
        fetch_res = await http_client.fetch(
            url,
            validate_ssrf=validate_ssrf,
            check_dns=check_dns,
        )

        render_method = "http"

        if not fetch_res.is_html or not fetch_res.text:
            return fetch_res, None, render_method

        # Parse extracted data
        parsed_data = HTMLPageParser.parse(
            html_content=fetch_res.text,
            current_url=fetch_res.final_url or url,
            project_domain=project_domain,
            headers=fetch_res.headers,
        )

        # Check for SPA JS-only rendering
        if cls.is_spa_javascript_only(fetch_res.text):
            # Record that this page was flagged as JS-heavy
            logger.info("Page %s flagged as client-side JavaScript SPA", url)

        return fetch_res, parsed_data, render_method
