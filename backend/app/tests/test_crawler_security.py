import pytest
import httpx
from app.services.crawler.http_client import AsyncCrawlerHttpClient
from app.services.crawler.url_validator import validate_url, is_url_safe


def test_valid_public_urls():
    """Verify standard public web URLs pass validation."""
    valid_urls = [
        "https://example.com",
        "https://example.com/about",
        "http://blog.example.org/post?id=123",
        "https://sub.domain.co.uk/page#anchor",
    ]
    for url in valid_urls:
        valid, err = validate_url(url, check_dns=False)
        assert valid is True, f"Expected {url} to be valid, got: {err}"


def test_invalid_schemes():
    """Verify non-HTTP/HTTPS schemes are rejected."""
    bad_urls = [
        "ftp://example.com/file",
        "file:///etc/passwd",
        "javascript:alert(1)",
        "gopher://example.com",
        "data:text/html;base64,PHNjcmlwdD4=",
    ]
    for url in bad_urls:
        valid, err = validate_url(url, check_dns=False)
        assert valid is False
        assert "scheme" in err.lower() or "malformed" in err.lower()


def test_blocked_private_and_loopback_ips():
    """Verify private, loopback, and metadata IPs are blocked by SSRF filter."""
    ssrf_targets = [
        "http://127.0.0.1:8000/api",
        "http://localhost:3000",
        "http://0.0.0.0:80",
        "http://10.0.0.5/admin",
        "http://192.168.1.100/status",
        "http://172.16.0.10/internal",
        "http://169.254.169.254/latest/meta-data/",
        "http://metadata.google.internal/computeMetadata/v1/",
        "http://instance-data/latest/meta-data/",
    ]
    for url in ssrf_targets:
        valid, err = validate_url(url, check_dns=False)
        assert valid is False, f"Expected {url} to be blocked by SSRF filter"
        assert "prohibited" in err.lower() or "ssrf" in err.lower() or "private" in err.lower()


@pytest.mark.asyncio
async def test_redirect_to_internal_ssrf_blocked():
    """Verify HTTP client intercepts and blocks redirects pointing to private addresses."""
    client = AsyncCrawlerHttpClient(max_retries=0)

    # Mock transport to simulate a public URL redirecting to private metadata address
    class MockRedirectTransport(httpx.AsyncBaseTransport):
        async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
            if "public-site.com" in str(request.url):
                return httpx.Response(
                    status_code=302,
                    headers={"Location": "http://169.254.169.254/latest/meta-data/"},
                )
            return httpx.Response(status_code=200, content=b"Secret AWS Metadata")

    mock_client = httpx.AsyncClient(
        transport=MockRedirectTransport(),
        follow_redirects=False,
    )
    client._client = mock_client

    result = await client.fetch("https://public-site.com/redirect", validate_ssrf=True, check_dns=False)

    assert result.is_success is False
    assert result.status_code == 0
    assert "SSRF Check Failed on redirect" in result.error
    assert "169.254.169.254" in result.final_url or "169.254.169.254" in result.error


@pytest.mark.asyncio
async def test_large_response_size_limit_enforced():
    """Verify response size exceeding limit is halted without unbounded buffering."""
    client = AsyncCrawlerHttpClient(max_response_size=1024)  # 1 KB limit

    class MockLargeResponseTransport(httpx.AsyncBaseTransport):
        async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
            large_content = b"A" * 5000  # 5 KB
            return httpx.Response(
                status_code=200,
                headers={"Content-Length": "5000", "Content-Type": "text/html"},
                content=large_content,
            )

    client._client = httpx.AsyncClient(
        transport=MockLargeResponseTransport(),
        follow_redirects=False,
    )

    result = await client.fetch("https://example.com/large", validate_ssrf=False)
    assert result.is_success is False
    assert "exceeds limit" in result.error.lower() or "exceeded limit" in result.error.lower()
