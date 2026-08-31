import posixpath
import re
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse

# Common analytics, tracking, and session query parameters to strip for deduplication
TRACKING_PARAMS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "gclid",
    "fbclid",
    "msclkid",
    "mc_eid",
    "mc_cid",
    "_ga",
    "_gl",
    "yclid",
    "twclid",
    "dclid",
    "ref",
    "ref_src",
}


def normalize_url(url: str, base_url: str | None = None) -> str:
    """
    Normalize a target URL:
    - Resolves relative paths if base_url is provided.
    - Strips fragments (#...).
    - Lowercases scheme and hostname.
    - Removes standard default ports (80 for http, 443 for https).
    - Cleans dot segments in paths (/a/b/../c -> /a/c).
    - Strips marketing/tracking query parameters while preserving content parameters.
    - Sorts query parameters deterministically.
    - Normalizes trailing slashes consistently.
    """
    if not url or not isinstance(url, str):
        return ""

    url = url.strip()

    # If base_url provided and url is relative, resolve it
    if base_url:
        try:
            url = urljoin(base_url, url)
        except Exception:
            return ""

    try:
        parsed = urlparse(url)
    except Exception:
        return ""

    scheme = parsed.scheme.lower()
    if scheme not in ("http", "https"):
        return ""

    netloc = parsed.netloc.lower()

    # Strip default ports
    if scheme == "http" and netloc.endswith(":80"):
        netloc = netloc[:-3]
    elif scheme == "https" and netloc.endswith(":443"):
        netloc = netloc[:-4]

    # Path normalization
    path = parsed.path or "/"
    try:
        # Normalize double slashes and path traversal
        path = re.sub(r"/+", "/", path)
        norm_path = posixpath.normpath(path)
        if path.endswith("/") and not norm_path.endswith("/"):
            norm_path += "/"
        path = norm_path
    except Exception:
        pass

    if not path.startswith("/"):
        path = "/" + path

    # Query normalization
    query = ""
    if parsed.query:
        try:
            pairs = parse_qsl(parsed.query, keep_blank_values=True)
            # Filter tracking parameters
            filtered = [
                (k, v) for k, v in pairs
                if k.lower() not in TRACKING_PARAMS and not k.lower().startswith("utm_")
            ]
            if filtered:
                filtered.sort(key=lambda x: (x[0], x[1]))
                query = urlencode(filtered)
        except Exception:
            query = parsed.query

    # Reconstruct URL without fragment
    normalized = urlunparse((scheme, netloc, path, "", query, ""))
    return normalized


def get_root_domain(hostname: str) -> str:
    """Extract root domain stripping leading www. and lowercase."""
    h = hostname.lower().strip()
    if h.startswith("www."):
        h = h[4:]
    return h


def is_internal_url(target_url: str, project_domain: str) -> bool:
    """
    Check if a target URL belongs to the project domain.
    Accepts exact match or www/non-www variations or subdomains of the project domain.
    """
    if not target_url or not project_domain:
        return False

    try:
        parsed_target = urlparse(target_url)
        target_host = parsed_target.hostname
        if not target_host:
            return False

        target_host = target_host.lower().strip()
        project_root = get_root_domain(project_domain)
        target_root = get_root_domain(target_host)

        # Exact match or both match root domain
        if target_root == project_root:
            return True

        # Check if target is a subdomain (e.g. blog.example.com of example.com)
        if target_host.endswith(f".{project_root}"):
            return True

        return False
    except Exception:
        return False
