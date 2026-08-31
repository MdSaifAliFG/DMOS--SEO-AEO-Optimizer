import logging
import re
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser
from app.services.crawler.http_client import AsyncCrawlerHttpClient

logger = logging.getLogger(__name__)


class RobotsResult:
    """Stores the parsed outcome of a website's robots.txt file."""

    def __init__(
        self,
        domain: str,
        url: str,
        exists: bool,
        status_code: int,
        content: str = "",
        sitemaps: Optional[List[str]] = None,
        is_valid: bool = True,
        disallow_all: bool = False,
    ):
        self.domain = domain
        self.url = url
        self.exists = exists
        self.status_code = status_code
        self.content = content
        self.sitemaps = sitemaps or []
        self.is_valid = is_valid
        self.disallow_all = disallow_all
        self._parser: Optional[RobotFileParser] = None

    def set_parser(self, parser: RobotFileParser) -> None:
        self._parser = parser

    def is_allowed(self, url: str, user_agent: str = "DMOSBot") -> bool:
        """Check whether the crawler is permitted to crawl the given URL path."""
        if not self.exists or not self._parser:
            return True
        try:
            return self._parser.can_fetch(user_agent, url) or self._parser.can_fetch("*", url)
        except Exception:
            return True

    def to_dict(self) -> Dict[str, Any]:
        return {
            "url": self.url,
            "exists": self.exists,
            "status_code": self.status_code,
            "sitemaps": self.sitemaps,
            "is_valid": self.is_valid,
            "disallow_all": self.disallow_all,
            "content_snippet": self.content[:500] if self.content else "",
        }


class RobotsParser:
    """Service to fetch and inspect robots.txt files for a target domain."""

    @staticmethod
    async def fetch_and_parse(
        http_client: AsyncCrawlerHttpClient,
        target_url: str,
    ) -> RobotsResult:
        parsed = urlparse(target_url)
        scheme = parsed.scheme or "https"
        netloc = parsed.netloc
        robots_url = f"{scheme}://{netloc}/robots.txt"

        logger.info("Fetching robots.txt from %s", robots_url)
        res = await http_client.fetch(robots_url)

        if not res.is_success or res.status_code != 200:
            return RobotsResult(
                domain=netloc,
                url=robots_url,
                exists=False,
                status_code=res.status_code,
                content=res.text or "",
            )

        content = res.text or ""
        sitemaps: List[str] = []
        disallow_all = False

        # Extract Sitemap lines
        for line in content.splitlines():
            line_clean = line.strip()
            if re.match(r"^sitemap\s*:", line_clean, re.IGNORECASE):
                parts = line_clean.split(":", 1)
                if len(parts) > 1:
                    sm = parts[1].strip()
                    if sm and sm not in sitemaps:
                        sitemaps.append(sm)

        # Standard library RobotFileParser
        parser = RobotFileParser()
        parser.parse(content.splitlines())

        # Check if root is blocked for all
        try:
            disallow_all = not parser.can_fetch("*", f"{scheme}://{netloc}/")
        except Exception:
            disallow_all = False

        result = RobotsResult(
            domain=netloc,
            url=robots_url,
            exists=True,
            status_code=200,
            content=content,
            sitemaps=sitemaps,
            is_valid=True,
            disallow_all=disallow_all,
        )
        result.set_parser(parser)
        return result
