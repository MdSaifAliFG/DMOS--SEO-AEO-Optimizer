"""Phase 1 acceptance tests: JWT boundary, spoof rejection, cross-user isolation."""
import time

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import create_access_token
from app.models.user import User


async def _make_user(db_session: AsyncSession, uid: str, email: str) -> User:
    user = User(id=uid, email=email, full_name=email.split("@")[0], is_active=True)
    db_session.add(user)
    await db_session.commit()
    return user


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_anonymous_create_project_returns_401(client: AsyncClient):
    res = await client.post("/api/v1/projects", json={"name": "Anon", "domain": "anon.io"})
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_invalid_jwt_returns_401(client: AsyncClient):
    res = await client.post(
        "/api/v1/projects",
        json={"name": "Bad", "domain": "bad.io"},
        headers=_auth("garbage.token.here"),
    )
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_expired_jwt_returns_401(client: AsyncClient, db_session: AsyncSession):
    await _make_user(db_session, "u_exp", "expired@test.local")
    token = create_access_token("u_exp", expires_minutes=-1)
    res = await client.post(
        "/api/v1/projects",
        json={"name": "Old", "domain": "old.io"},
        headers=_auth(token),
    )
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_valid_jwt_returns_201(client: AsyncClient, db_session: AsyncSession):
    await _make_user(db_session, "u_ok", "ok@test.local")
    token = create_access_token("u_ok")
    res = await client.post(
        "/api/v1/projects",
        json={"name": "Good", "domain": "good.io"},
        headers=_auth(token),
    )
    assert res.status_code == 201


@pytest.mark.asyncio
async def test_cross_user_project_isolation(client: AsyncClient, db_session: AsyncSession):
    await _make_user(db_session, "u_a", "a@test.local")
    await _make_user(db_session, "u_b", "b@test.local")
    token_a = create_access_token("u_a")
    token_b = create_access_token("u_b")

    created = await client.post(
        "/api/v1/projects",
        json={"name": "A Project", "domain": "a-proj.io"},
        headers=_auth(token_a),
    )
    assert created.status_code == 201
    project_id = created.json()["id"]

    # B cannot read A's project
    got = await client.get(f"/api/v1/projects/{project_id}", headers=_auth(token_b))
    assert got.status_code in (403, 404)

    # B cannot delete A's project
    deleted = await client.delete(f"/api/v1/projects/{project_id}", headers=_auth(token_b))
    assert deleted.status_code in (403, 404)

    # A still owns it
    own = await client.get(f"/api/v1/projects/{project_id}", headers=_auth(token_a))
    assert own.status_code == 200


@pytest.mark.asyncio
async def test_spoof_headers_do_not_authenticate(client: AsyncClient, db_session: AsyncSession):
    await _make_user(db_session, "u_victim", "victim@test.local")
    # X-User-Email alone must not authenticate
    res = await client.post(
        "/api/v1/projects",
        json={"name": "Spoof", "domain": "spoof.io"},
        headers={"X-User-Email": "victim@test.local"},
    )
    assert res.status_code == 401
    # X-User-Id alone must not authenticate
    res = await client.post(
        "/api/v1/projects",
        json={"name": "Spoof", "domain": "spoof.io"},
        headers={"X-User-Id": "u_victim"},
    )
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_raw_user_id_as_bearer_does_not_authenticate(client: AsyncClient, db_session: AsyncSession):
    await _make_user(db_session, "u_raw", "raw@test.local")
    res = await client.post(
        "/api/v1/projects",
        json={"name": "Raw", "domain": "raw.io"},
        headers=_auth("u_raw"),
    )
    assert res.status_code == 401
    res = await client.post(
        "/api/v1/projects",
        json={"name": "Raw", "domain": "raw.io"},
        headers=_auth("raw@test.local"),
    )
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_no_latest_user_fallback(client: AsyncClient, db_session: AsyncSession):
    # A user exists, but anonymous request must still 401 (no fallback).
    await _make_user(db_session, "u_any", "any@test.local")
    res = await client.post("/api/v1/projects", json={"name": "Nope", "domain": "nope.io"})
    assert res.status_code == 401
    assert int(time.time()) > 0  # keeps time import used across dialects
