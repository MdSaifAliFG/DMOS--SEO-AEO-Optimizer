import asyncio
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_and_query_scan(client: AsyncClient, auth_headers: dict):
    # 1. Create project
    proj_res = await client.post(
        "/api/v1/projects",
        json={"name": "Vercel Web", "domain": "vercel.com"},
        headers=auth_headers,
    )
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Trigger scan
    scan_res = await client.post(
        f"/api/v1/projects/{project_id}/scans",
        json={"scan_type": "full_audit"},
        headers=auth_headers,
    )
    assert scan_res.status_code == 201
    scan_data = scan_res.json()
    scan_id = scan_data["id"]
    assert scan_data["project_id"] == project_id
    assert scan_data["status"] in ["queued", "initializing", "crawling", "analyzing", "scoring", "completed", "failed", "cancelled"]
    assert len(scan_data["logs"]) >= 1

    # 3. Query scan details
    get_res = await client.get(f"/api/v1/scans/{scan_id}")
    assert get_res.status_code == 200
    details = get_res.json()
    assert details["id"] == scan_id
    assert "current_step" in details

    # 4. List scans for project
    list_res = await client.get(f"/api/v1/projects/{project_id}/scans", headers=auth_headers)
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["total"] >= 1
    assert list_data["scans"][0]["id"] == scan_id


@pytest.mark.asyncio
async def test_cancel_scan(client: AsyncClient, auth_headers: dict):
    # 1. Create project
    proj_res = await client.post(
        "/api/v1/projects",
        json={"name": "Cancel Test Corp", "domain": "canceltest.dev"},
        headers=auth_headers,
    )
    project_id = proj_res.json()["id"]

    # 2. Trigger scan
    scan_res = await client.post(
        f"/api/v1/projects/{project_id}/scans",
        json={"scan_type": "full_audit"},
        headers=auth_headers,
    )
    scan_id = scan_res.json()["id"]

    # 3. Cancel scan
    cancel_res = await client.post(f"/api/v1/scans/{scan_id}/cancel", headers=auth_headers)
    assert cancel_res.status_code == 200
    cancel_data = cancel_res.json()
    assert cancel_data["status"] == "cancelled"

    # 4. Fetch scan to verify cancelled state
    get_res = await client.get(f"/api/v1/scans/{scan_id}")
    assert get_res.json()["status"] == "cancelled"
