import ipaddress
import logging
import socket
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# Disallowed hostnames and domains
BLOCKED_HOSTS = {
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "metadata.google.internal",
    "instance-data",
    "169.254.169.254",
}

# Carrier-Grade NAT (CGNAT) 100.64.0.0/10
CGNAT_NETWORK = ipaddress.ip_network("100.64.0.0/10")


class URLValidationError(ValueError):
    """Exception raised when a URL fails security or format validation."""
    pass


def validate_url(url: str, check_dns: bool = True) -> tuple[bool, str]:
    """
    Validate a user-submitted or crawled URL against security restrictions and SSRF rules.
    Returns (is_valid, error_message).
    """
    if not url or not isinstance(url, str):
        return False, "URL cannot be empty."

    url = url.strip()

    # 1. Scheme validation
    try:
        parsed = urlparse(url)
    except Exception as e:
        return False, f"Malformed URL: {str(e)}"

    if parsed.scheme.lower() not in ("http", "https"):
        return False, f"Unsupported scheme '{parsed.scheme}'. Only 'http://' and 'https://' are permitted."

    hostname = parsed.hostname
    if not hostname:
        return False, "URL must contain a valid hostname."

    hostname_lower = hostname.lower().strip()

    # 2. Blocked hostnames
    if hostname_lower in BLOCKED_HOSTS or hostname_lower.endswith(".local") or hostname_lower.endswith(".internal"):
        return False, f"Access to host '{hostname}' is prohibited (SSRF security policy)."

    # 3. Direct IP address check
    try:
        ip_obj = ipaddress.ip_address(hostname_lower)
        if (
            ip_obj.is_private
            or ip_obj.is_loopback
            or ip_obj.is_link_local
            or ip_obj.is_multicast
            or ip_obj.is_reserved
            or ip_obj.is_unspecified
            or (ip_obj.version == 4 and ip_obj in CGNAT_NETWORK)
        ):
            return False, f"Access to IP address '{hostname}' is prohibited (private/internal IP)."
    except ValueError:
        # Hostname is not a raw IP string, proceed to DNS check if requested
        pass

    # 4. DNS resolution to prevent DNS rebinding & private intranet access
    if check_dns:
        try:
            addr_info = socket.getaddrinfo(hostname_lower, None)
            if not addr_info:
                return False, f"Could not resolve hostname '{hostname}'."

            for family, socktype, proto, canonname, sockaddr in addr_info:
                ip_str = sockaddr[0]
                try:
                    resolved_ip = ipaddress.ip_address(ip_str)
                    if (
                        resolved_ip.is_private
                        or resolved_ip.is_loopback
                        or resolved_ip.is_link_local
                        or resolved_ip.is_multicast
                        or resolved_ip.is_reserved
                        or resolved_ip.is_unspecified
                        or (resolved_ip.version == 4 and resolved_ip in CGNAT_NETWORK)
                    ):
                        return False, f"Hostname '{hostname}' resolves to private/prohibited IP '{ip_str}'."
                except ValueError:
                    continue
        except socket.gaierror:
            return False, f"Domain name '{hostname}' could not be resolved."
        except Exception as e:
            return False, f"DNS resolution check failed for '{hostname}': {str(e)}"

    return True, ""


def is_url_safe(url: str, check_dns: bool = True) -> bool:
    """Convenience helper returning boolean safety check."""
    valid, _ = validate_url(url, check_dns=check_dns)
    return valid
