"""Canonical DEV/POC authentication: signed HS256 JWT (stdlib only).

Flow: receive token -> verify signature -> verify expiry -> extract sub ->
load user from DB -> authorize. Never trusts a raw user id/email.

Later replaceable by the real Fortune IAM adapter behind the same
``get_current_user`` dependency.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
import uuid
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

_AUTH_SCHEME = "Bearer "
_LEGACY_SPOOF_HEADERS = ("X-User-Email", "X-User-Id")


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def _signing_key() -> bytes:
    # ponytail: dev fallback key keeps local tests booting without env;
    # require_deployment_secrets() rejects empty SECRET_KEY in staging/prod.
    return (settings.SECRET_KEY or "dev-only-insecure-fallback-key").encode("utf-8")


def create_access_token(user_id: str, expires_minutes: Optional[int] = None) -> str:
    now = int(time.time())
    exp = now + (expires_minutes if expires_minutes is not None else settings.ACCESS_TOKEN_EXPIRE_MINUTES) * 60
    header = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = _b64url_encode(json.dumps({"sub": user_id, "iat": now, "exp": exp, "jti": uuid.uuid4().hex}).encode())
    sig = _b64url_encode(hmac.new(_signing_key(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
    return f"{header}.{payload}.{sig}"


def decode_access_token(token: str) -> str:
    """Verify signature + expiry, return the ``sub`` user id. Raises 401 otherwise."""
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        header_b64, payload_b64, sig_b64 = token.split(".")
        expected = _b64url_encode(
            hmac.new(_signing_key(), f"{header_b64}.{payload_b64}".encode(), hashlib.sha256).digest()
        )
        if not hmac.compare_digest(expected, sig_b64):
            raise unauthorized
        payload = json.loads(_b64url_decode(payload_b64))
        if not isinstance(payload, dict) or not payload.get("sub"):
            raise unauthorized
        if int(payload.get("exp", 0)) < int(time.time()):
            raise unauthorized
        return str(payload["sub"])
    except HTTPException:
        raise
    except Exception:
        raise unauthorized


def _bearer_token(request: Request) -> Optional[str]:
    auth = request.headers.get("Authorization", "")
    if auth.startswith(_AUTH_SCHEME):
        token = auth[len(_AUTH_SCHEME):].strip()
        return token or None
    return None


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """Canonical auth dependency. Missing/invalid/expired credentials -> 401.

    Legacy ``X-User-*`` headers are deliberately ignored (spoof rejection).
    No fallback user: no credentials -> 401.
    """
    token = _bearer_token(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = decode_access_token(token)
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_optional_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """JWT-only optional identity for public-but-personalized endpoints.

    Returns None when credentials are absent/invalid. Never reads
    ``X-User-*`` and never falls back to another user.
    """
    token = _bearer_token(request)
    if not token:
        return None
    try:
        user_id = decode_access_token(token)
    except HTTPException:
        return None
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if user is None or not user.is_active:
        return None
    return user


async def resolve_workspace_id(user: Optional[User] = None) -> str:
    if user and user.id:
        return str(user.id)
    return "global_workspace"


def enforce_owner(obj: object, user: User, resource: str = "Resource") -> None:
    """Cross-user isolation: an object owned by another user reads as missing (404)."""
    owner_id = getattr(obj, "user_id", None)
    if owner_id and owner_id != user.id and not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} not found",
        )
