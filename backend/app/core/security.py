from datetime import datetime, timezone
import hashlib
import hmac
import os
import secrets
from typing import Optional, Tuple


def get_password_hash(password: str) -> str:
    """Generate a secure cryptographic PBKDF2-SHA256 password hash with salt."""
    salt = secrets.token_hex(16)
    iterations = 600000
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    )
    return f"pbkdf2_sha256${iterations}${salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: Optional[str]) -> bool:
    """Verify a plaintext password against the stored PBKDF2 hash using constant-time comparison."""
    if not hashed_password or not plain_password:
        return False

    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False

        iterations = int(parts[1])
        salt = parts[2]
        expected_hex = parts[3]

        derived_key = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            iterations,
        )

        return hmac.compare_digest(derived_key.hex(), expected_hex)
    except Exception:
        return False


def is_account_locked(locked_until: Optional[datetime]) -> Tuple[bool, int]:
    """
    Check if an account or email is currently locked.
    Returns (is_locked, remaining_minutes).
    """
    if not locked_until:
        return False, 0

    now = datetime.now(timezone.utc)
    target = locked_until
    if target.tzinfo is None:
        target = target.replace(tzinfo=timezone.utc)

    if target > now:
        remaining_seconds = int((target - now).total_seconds())
        remaining_minutes = max(1, (remaining_seconds + 59) // 60)
        return True, remaining_minutes

    return False, 0


def validate_password_security(password: Optional[str]) -> Tuple[bool, Optional[str]]:
    """
    Validates that password complies with security standards:
    - Minimum length: 8 characters
    - Maximum length: 16 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 digit
    - At least 1 special character
    """
    if not password:
        return False, "Password is required."

    if len(password) < 8:
        return False, "Password must be at least 8 characters long."

    if len(password) > 16:
        return False, "Password cannot exceed 16 characters."

    import re
    if not re.search(r"[A-Z]", password):
        return False, "Password must include at least one uppercase letter (A-Z)."

    if not re.search(r"[a-z]", password):
        return False, "Password must include at least one lowercase letter (a-z)."

    if not re.search(r"[0-9]", password):
        return False, "Password must include at least one digit (0-9)."

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", password):
        return False, "Password must include at least one special character (e.g. !@#$%^&*)."

    return True, None
