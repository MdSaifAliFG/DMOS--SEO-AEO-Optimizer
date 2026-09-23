import asyncio
import logging
import time
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin
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
    """
    Async HTTP Client for SEO crawling with SSRF protection, redirect verification,
    streamed size limits, and configurable retries.
    """

    def __init__(
        self,
        user_agent: Optional[str] = None,
        timeout: Optional[int] = None,
        max_retries: Optional[int] = None,
        max_response_size: Optional[int] = None,
        max_redirects: int = 5,
    ):
        self.user_agent = user_agent or settings.CRAWLER_USER_AGENT
        self.timeout = timeout or settings.CRAWL_TIMEOUT
        self.max_retries = max_retries or settings.CRAWL_MAX_RETRIES
        self.max_response_size = max_response_size or settings.CRAWL_MAX_RESPONSE_SIZE
        self.max_redirects = max_redirects
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
            # Note: follow_redirects=False ensures every redirect target is validated against SSRF rules
            self._client = httpx.AsyncClient(
                headers=headers,
                timeout=httpx.Timeout(self.timeout, connect=10.0, read=self.timeout),
                limits=limits,
                follow_redirects=False,
                verify=True,
            )
        return self._client

    async def fetch(
        self,
        url: str,
        validate_ssrf: bool = True,
        check_dns: bool = True,
    ) -> FetchResult:
        """Fetch a single URL safely with per-hop SSRF validation and streaming size limits."""
        start_time = time.perf_counter()
        client = await self.get_client()

        current_url = url
        redirect_chain: List[Dict[str, Any]] = []

        for redirect_hop in range(self.max_redirects + 1):
            # 1. SSRF Validation for the current hop
            if validate_ssrf:
                is_valid, err_msg = validate_url(current_url, check_dns=check_dns)
                if not is_valid:
                    elapsed = time.perf_counter() - start_time
                    hop_msg = f" on redirect hop {redirect_hop}" if redirect_hop > 0 else ""
                    return FetchResult(
                        requested_url=url,
                        final_url=current_url,
                        status_code=0,
                        content_type="",
                        response_time=round(elapsed, 4),
                        error=f"SSRF Check Failed{hop_msg}: {err_msg}",
                    )

            # 2. Fetch with retries
            hop_success = False
            last_exception: Optional[Exception] = None

            for attempt in range(self.max_retries + 1):
                try:
                    # Stream the response to enforce max response size without unbounded RAM usage
                    async with client.stream("GET", current_url) as response:
                        # Handle HTTP Redirects manually to intercept and validate target
                        if response.status_code in (301, 302, 303, 307, 308):
                            location = response.headers.get("Location")
                            if not location:
                                # Malformed redirect with no Location header
                                elapsed = time.perf_counter() - start_time
                                return FetchResult(
                                    requested_url=url,
                                    final_url=current_url,
                                    status_code=response.status_code,
                                    content_type=response.headers.get("Content-Type", ""),
                                    response_time=round(elapsed, 4),
                                    error="Redirect response missing Location header",
                                )

                            next_url = urljoin(current_url, location)
                            redirect_chain.append({
                                "status_code": response.status_code,
                                "url": next_url,
                            })
                            current_url = next_url
                            hop_success = True
                            break  # Proceed to next hop in outer loop

                        # Non-redirect final response: check declared Content-Length
                        content_length_hdr = response.headers.get("Content-Length")
                        if content_length_hdr and content_length_hdr.isdigit():
                            declared_size = int(content_length_hdr)
                            if declared_size > self.max_response_size:
                                elapsed = time.perf_counter() - start_time
                                return FetchResult(
                                    requested_url=url,
                                    final_url=current_url,
                                    status_code=response.status_code,
                                    content_type=response.headers.get("Content-Type", ""),
                                    response_time=round(elapsed, 4),
                                    content_length=declared_size,
                                    error=f"Response size ({declared_size} bytes) exceeds limit ({self.max_response_size} bytes)",
                                )

                        # Stream chunks up to max_response_size
                        chunks: List[bytes] = []
                        total_bytes = 0
                        async for chunk in response.aiter_bytes(chunk_size=16384):
                            total_bytes += len(chunk)
                            if total_bytes > self.max_response_size:
                                elapsed = time.perf_counter() - start_time
                                return FetchResult(
                                    requested_url=url,
                                    final_url=current_url,
                                    status_code=response.status_code,
                                    content_type=response.headers.get("Content-Type", ""),
                                    response_time=round(elapsed, 4),
                                    content_length=total_bytes,
                                    error=f"Response size exceeded limit ({self.max_response_size} bytes)",
                                )
                            chunks.append(chunk)

                        content_bytes = b"".join(chunks)
                        content_type = response.headers.get("Content-Type", "")
                        elapsed = time.perf_counter() - start_time

                        # Decode text only for HTML/XML content
                        text = ""
                        if "text" in content_type.lower() or "xml" in content_type.lower():
                            try:
                                text = content_bytes.decode(response.encoding or "utf-8", errors="replace")
                            except Exception:
                                text = content_bytes.decode("utf-8", errors="replace")

                        return FetchResult(
                            requested_url=url,
                            final_url=current_url,
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

            if not hop_success:
                elapsed = time.perf_counter() - start_time
                return FetchResult(
                    requested_url=url,
                    final_url=current_url,
                    status_code=0,
                    content_type="",
                    response_time=round(elapsed, 4),
                    error=str(last_exception) if last_exception else "Unknown network error",
                )

        # Exceeded maximum redirect hops
        elapsed = time.perf_counter() - start_time
        return FetchResult(
            requested_url=url,
            final_url=current_url,
            status_code=0,
            content_type="",
            response_time=round(elapsed, 4),
            redirect_chain=redirect_chain,
            error=f"Exceeded maximum redirect limit ({self.max_redirects} hops)",
        )

    async def close(self) -> None:
        if self._client is not None and not self._client.is_closed:
            await self._client.aclose()
            self._client = None
