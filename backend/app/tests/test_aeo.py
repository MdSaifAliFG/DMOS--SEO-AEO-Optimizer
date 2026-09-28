import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_aeo_projects_and_dashboard(client: AsyncClient, auth_headers: dict):
    """Test creating AEO project, listing, adding questions, and checking dashboard summary."""
    # 1. Create AEO Project
    create_res = await client.post(
        "/api/v1/aeo/projects",
        json={
            "name": "Stripe AI Search Visibility",
            "domain": "stripe.com",
            "description": "Monitor Stripe presence across ChatGPT and Perplexity",
        },
        headers=auth_headers,
    )
    assert create_res.status_code == 201
    proj_data = create_res.json()
    project_id = proj_data["id"]
    assert proj_data["domain"] == "stripe.com"
    assert proj_data["name"] == "Stripe AI Search Visibility"

    # 2. Add AEO Question
    q_res = await client.post(
        "/api/v1/aeo/questions",
        json={
            "project_id": project_id,
            "question_text": "What is the best payment gateway API for startups?",
            "category": "Payments",
            "intent": "commercial",
        },
        headers=auth_headers,
    )
    assert q_res.status_code == 201
    q_data = q_res.json()
    assert q_data["question_text"] == "What is the best payment gateway API for startups?"
    assert q_data["project_id"] == project_id

    # 3. Add AEO Entity
    e_res = await client.post(
        "/api/v1/aeo/entities",
        json={
            "project_id": project_id,
            "entity_name": "Stripe Connect",
            "entity_type": "Product",
        },
        headers=auth_headers,
    )
    assert e_res.status_code == 201
    e_data = e_res.json()
    assert e_data["entity_name"] == "Stripe Connect"

    # 4. List Questions
    list_q_res = await client.get(f"/api/v1/aeo/questions?project_id={project_id}")
    assert list_q_res.status_code == 200
    assert list_q_res.json()["total"] >= 1

    # 5. List Entities
    list_e_res = await client.get(f"/api/v1/aeo/entities?project_id={project_id}")
    assert list_e_res.status_code == 200
    assert list_e_res.json()["total"] >= 1

    # 6. Check AEO Dashboard Summary
    dash_res = await client.get("/api/v1/aeo/dashboard")
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_projects"] >= 1
    assert dash_data["questions_tracked"] >= 1
    assert len(dash_data["engines"]) >= 5
    # Verify engines show valid status structure
    for engine in dash_data["engines"]:
        assert "engine_id" in engine
        assert "status_label" in engine
        assert isinstance(engine["is_connected"], bool)
