import asyncio
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_full_end_to_end_phase1_flow(client: AsyncClient):
    """
    End-to-end verification test matching PRD Step 20:
    Dashboard -> Add Website -> Create Project -> Open Project -> Start Audit ->
    Create Scan -> Display Scan Status -> Lifecycle Stage Progression -> Return to Project.
    """
    # 1. Health check & dashboard data availability
    health_res = await client.get("/api/v1/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "healthy"

    # 2. Add Website / Create Project
    project_payload = {
        "name": "Acme SaaS Platform",
        "domain": "https://acme-saas.com/",
        "description": "B2B SaaS product landing and documentation",
        "settings": {
            "crawl_depth": 3,
            "user_agent": "DMOS-Bot/1.0",
        },
    }
    create_proj_res = await client.post("/api/v1/projects", json=project_payload)
    assert create_proj_res.status_code == 201
    project = create_proj_res.json()
    project_id = project["id"]
    assert project["name"] == "Acme SaaS Platform"
    assert project["domain"] == "acme-saas.com"

    # 3. Open Project details
    get_proj_res = await client.get(f"/api/v1/projects/{project_id}")
    assert get_proj_res.status_code == 200
    assert get_proj_res.json()["id"] == project_id
    assert get_proj_res.json()["total_scans"] == 0

    # 4. Start Audit / Create Scan
    scan_payload = {
        "scan_type": "full_audit",
        "target_url": "https://acme-saas.com",
    }
    create_scan_res = await client.post(
        f"/api/v1/projects/{project_id}/scans",
        json=scan_payload,
    )
    assert create_scan_res.status_code == 201
    scan = create_scan_res.json()
    scan_id = scan["id"]
    assert scan["project_id"] == project_id
    assert scan["status"] in ["queued", "initializing", "crawling", "analyzing", "completed"]
    assert scan["progress"] >= 0

    # 5. Display Scan Status & Query Active Cockpit
    get_scan_res = await client.get(f"/api/v1/scans/{scan_id}")
    assert get_scan_res.status_code == 200
    scan_details = get_scan_res.json()
    assert scan_details["id"] == scan_id
    assert len(scan_details["logs"]) >= 1

    # 6. Verify scan appears in project scan history
    proj_scans_res = await client.get(f"/api/v1/projects/{project_id}/scans")
    assert proj_scans_res.status_code == 200
    proj_scans = proj_scans_res.json()
    assert proj_scans["total"] == 1
    assert proj_scans["scans"][0]["id"] == scan_id

    # 7. Cancel in-flight scan or wait for lifecycle completion
    cancel_res = await client.post(f"/api/v1/scans/{scan_id}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] in ["cancelled", "completed"]

    # 8. Return to Project & verify updated scan history
    proj_after_res = await client.get(f"/api/v1/projects/{project_id}")
    assert proj_after_res.status_code == 200
    assert proj_after_res.json()["total_scans"] == 1
    assert proj_after_res.json()["latest_scan"] is not None

    # 9. Clean up / Delete Project
    del_res = await client.delete(f"/api/v1/projects/{project_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 10. Verify project and its scans are removed
    get_deleted = await client.get(f"/api/v1/projects/{project_id}")
    assert get_deleted.status_code == 404
