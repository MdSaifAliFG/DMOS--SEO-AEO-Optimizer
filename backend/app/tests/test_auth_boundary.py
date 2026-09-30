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


@pytest.mark.asyncio
async def test_anonymous_mutations_rejected_across_modules(client: AsyncClient):
    payload = {"name": "Anon", "domain": "anon-mut.io"}
    assert (await client.post("/api/v1/aeo/projects", json=payload)).status_code == 401
    assert (await client.post("/api/v1/geo/projects", json=payload)).status_code == 401
    assert (await client.post("/api/v1/billing/checkout", json={})).status_code in (401, 422)
    assert (await client.post("/api/v1/billing/cancel")).status_code == 401
    assert (await client.get("/api/v1/billing/summary")).status_code == 401
    assert (await client.patch("/api/v1/settings/workspace", json={"workspace_name": "X"})).status_code == 401
    assert (await client.post("/api/v1/aeo/questions", json={})).status_code in (401, 422)
    assert (await client.post("/api/v1/geo/questions/generate", json={})).status_code in (401, 422)
    assert (await client.post("/api/v1/projects", json=payload)).status_code == 401
    assert (await client.post("/api/v1/seo/actions/generate?scan_id=x&project_id=y")).status_code == 401
    assert (await client.post("/api/v1/integrations/openai/connect", json={})).status_code == 401
    assert (await client.post("/api/v1/scans/some-id/cancel")).status_code == 401


@pytest.mark.asyncio
async def test_cross_user_aeo_geo_project_isolation(client: AsyncClient, db_session: AsyncSession):
    await _make_user(db_session, "u_a2", "a2@test.local")
    await _make_user(db_session, "u_b2", "b2@test.local")
    await _make_user(db_session, "u_a3", "a3@test.local")
    await _make_user(db_session, "u_b3", "b3@test.local")
    ha, hb = _auth(create_access_token("u_a2")), _auth(create_access_token("u_b2"))
    hg_a, hg_b = _auth(create_access_token("u_a3")), _auth(create_access_token("u_b3"))

    created = await client.post(
        "/api/v1/aeo/projects",
        json={"name": "A AEO", "domain": "a-aeo.io"},
        headers=ha,
    )
    assert created.status_code == 201
    aeo_id = created.json()["id"]

    # B cannot update or delete A's AEO project
    assert (await client.patch(f"/api/v1/aeo/projects/{aeo_id}", json={"description": "hijack"}, headers=hb)).status_code == 404
    assert (await client.delete(f"/api/v1/aeo/projects/{aeo_id}", headers=hb)).status_code == 404

    gcreated = await client.post(
        "/api/v1/geo/projects",
        json={"name": "A GEO", "domain": "a-geo.io", "brand_name": "ABrand"},
        headers=hg_a,
    )
    assert gcreated.status_code == 201
    geo_id = gcreated.json()["id"]
    assert (await client.delete(f"/api/v1/geo/projects/{geo_id}", headers=hg_b)).status_code == 404
    # Owner can still delete
    assert (await client.delete(f"/api/v1/geo/projects/{geo_id}", headers=hg_a)).status_code == 204
