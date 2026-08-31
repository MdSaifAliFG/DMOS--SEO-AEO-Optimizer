import asyncio
import logging
import time
from typing import Any, Dict, List, Optional, Tuple
import httpx
from app.core.config import settings
from app.services.crawler.url_validator import validate_url

logger = logging.getLogger(__name__)


class FetchResult:
    """Encapsulates the raw HTTP fetch outcome."""

    def __init__(
        self,
        requested_url: str,
        final_url: str,
        status_code: int,
        content_type: str,
        text: str = "",
        content_bytes: bytes = b"",
        headers: Optional[Dict[str, str]] = None,
        redirect_chain: Optional[List[Dict[str, Any]]] = None,
        response_time: float = 0.0,
        content_length: int = 0,
        error: Optional[str] = None,
    ):
        self.requested_url = requested_url
        self.final_url = final_url
        self.status_code = status_code
        self.content_type = content_type
        self.text = text
        self.content_bytes = content_bytes
        self.headers = headers or {}
        self.redirect_chain = redirect_chain or []
        self.response_time = response_time
        self.content_length = content_length or len(content_bytes)
        self.error = error

    @property
    def is_html(self) -> bool:
        ct = self.content_type.lower()
        return "text/html" in ct or "application/xhtml+xml" in ct

    @property
    def is_success(self) -> bool:
        return 200 <= self.status_code < 400 and self.error is None


class AsyncCrawlerHttpClient:
    """Async HTTP Client for SEO crawling with SSRF protection, size limits, and retries."""

    def __init__(
        self,
        user_agent: Optional[str] = None,
        timeout: Optional[int] = None,
        max_retries: Optional[int] = None,
        max_response_size: Optional[int] = None,
    ):
        self.user_agent = user_agent or settings.CRAWLER_USER_AGENT
        self.timeout = timeout or settings.CRAWL_TIMEOUT
        self.max_retries = max_retries or settings.CRAWL_MAX_RETRIES
        self.max_response_size = max_response_size or settings.CRAWL_MAX_RESPONSE_SIZE
        self._client: Optional[httpx.AsyncClient] = None

    async def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            limits = httpx.Limits(
                max_connections=settings.CRAWL_CONCURRENCY * 2,
                max_keepalive_connections=settings.CRAWL_CONCURRENCY,
            )
            headers = {
                "User-Agent": self.user_agent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate",
            }
            self._client = httpx.AsyncClient(
                headers=headers,
                timeout=httpx.Timeout(self.timeout, connect=10.0),
                limits=limits,
                follow_redirects=True,
                max_redirects=10,
                verify=True,
            )
        return self._client

    async def fetch(
        self,
        url: str,
        validate_ssrf: bool = True,
        check_dns: bool = True,
    ) -> FetchResult:
        """Fetch a single URL safely and return structured FetchResult."""
        if validate_ssrf:
            is_valid, err_msg = validate_url(url, check_dns=check_dns)
            if not is_valid:
                return FetchResult(
                    requested_url=url,
                    final_url=url,
                    status_code=0,
                    content_type="",
                    error=f"SSRF Check Failed: {err_msg}",
                )

        client = await self.get_client()
        start_time = time.perf_counter()
        last_exception: Optional[Exception] = None

        for attempt in range(self.max_retries + 1):
            try:
                # Custom streaming request to enforce max size
                response = await client.get(url)
                elapsed = time.perf_counter() - start_time

                # Track redirect history
                redirect_chain: List[Dict[str, Any]] = []
                for resp in response.history:
                    redirect_chain.append({
                        "status_code": resp.status_code,
                        "url": str(resp.url),
                    })

                content_type = response.headers.get("Content-Type", "")
                content_bytes = response.content

                # Check max response size
                if len(content_bytes) > self.max_response_size:
                    return FetchResult(
                        requested_url=url,
                        final_url=str(response.url),
                        status_code=response.status_code,
                        content_type=content_type,
                        response_time=elapsed,
                        content_length=len(content_bytes),
                        error=f"Response size ({len(content_bytes)} bytes) exceeds limit ({self.max_response_size} bytes)",
                    )

                text = response.text if "text" in content_type or "xml" in content_type else ""

                return FetchResult(
                    requested_url=url,
                    final_url=str(response.url),
                    status_code=response.status_code,
                    content_type=content_type,
                    text=text,
                    content_bytes=content_bytes,
                    headers=dict(response.headers),
                    redirect_chain=redirect_chain,
                    response_time=round(elapsed, 4),
                    content_length=len(content_bytes),
                )

            except (httpx.ConnectTimeout, httpx.ReadTimeout, httpx.ConnectError) as exc:
                last_exception = exc
                if attempt < self.max_retries:
                    await asyncio.sleep(0.5 * (attempt + 1))
                    continue
            except Exception as exc:
                last_exception = exc
                break

        elapsed = time.perf_counter() - start_time
        return FetchResult(
            requested_url=url,
            final_url=url,
            status_code=0,
            content_type="",
            response_time=round(elapsed, 4),
            error=str(last_exception) if last_exception else "Unknown network error",
        )

    async def close(self) -> None:
        if self._client is not None and not self._client.is_closed:
            await self._client.aclose()
            self._client = None
