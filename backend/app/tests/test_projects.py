import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_and_get_project(client: AsyncClient):
    payload = {
        "name": "Stripe Tech Portal",
        "domain": "https://stripe.com/",
        "description": "Payment platform domain",
        "settings": {"crawl_depth": 3},
    }
    response = await client.post("/api/v1/projects", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Stripe Tech Portal"
    assert data["domain"] == "stripe.com"
    project_id = data["id"]

    # Get by ID
    get_res = await client.get(f"/api/v1/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == project_id


@pytest.mark.asyncio
async def test_duplicate_domain_rejected(client: AsyncClient):
    payload = {
        "name": "Shopify Store",
        "domain": "shopify.com",
    }
    res1 = await client.post("/api/v1/projects", json=payload)
    assert res1.status_code == 201

    # Duplicate should return 409
    res2 = await client.post("/api/v1/projects", json=payload)
    assert res2.status_code == 409


from app.models.user import User


@pytest.mark.asyncio
async def test_list_and_search_projects(client: AsyncClient, db_session: AsyncSession):
    # Create two users so each has their own isolated workspace/project allowance
    user1 = User(id="u1_test", email="user_a@test.local", full_name="User A", is_active=True)
    user2 = User(id="u2_test", email="user_b@test.local", full_name="User B", is_active=True)
    db_session.add_all([user1, user2])
    await db_session.commit()

    # Create two projects across test users
    r1 = await client.post("/api/v1/projects", json={"name": "Alpha Corp", "domain": "alpha.io"}, headers={"X-User-Id": "u1_test"})
    assert r1.status_code == 201
    r2 = await client.post("/api/v1/projects", json={"name": "Beta Inc", "domain": "beta.org"}, headers={"X-User-Id": "u2_test"})
    assert r2.status_code == 201

    # List all
    res = await client.get("/api/v1/projects")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 2

    # Search for alpha
    search_res = await client.get("/api/v1/projects?search=alpha")
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert search_data["total"] == 1
    assert search_data["projects"][0]["domain"] == "alpha.io"


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient):
    res = await client.post("/api/v1/projects", json={"name": "To Delete", "domain": "delete-me.net"})
    project_id = res.json()["id"]

    del_res = await client.delete(f"/api/v1/projects/{project_id}")
    assert del_res.status_code == 200

    # Getting deleted project should return 404
    get_res = await client.get(f"/api/v1/projects/{project_id}")
    assert get_res.status_code == 404
