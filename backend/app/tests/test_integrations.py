import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_list_integrations_catalog():
    """Verify that all 8 search, analytics, and AI providers are returned in the catalog."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/integrations")
        assert response.status_code == 200
        data = response.json()
        assert "integrations" in data
        assert data["total_available"] == 8
        assert len(data["integrations"]) == 8

        providers = [i["provider"] for i in data["integrations"]]
        assert "gsc" in providers
        assert "ga4" in providers
        assert "ahrefs" in providers
        assert "semrush" in providers
        assert "openai" in providers
        assert "perplexity" in providers
        assert "gemini" in providers
        assert "copilot" in providers


@pytest.mark.asyncio
async def test_test_integration_ping():
    """Verify testing connection returns measured latency and diagnostic info."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "provider": "openai",
            "api_key": "sk-proj-testkey1234567890abcdef",
            "model": "gpt-4o",
        }
        response = await client.post("/api/v1/integrations/test", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["provider"] == "openai"
        assert data["latency_ms"] > 0
        assert "OpenAI ChatGPT Search" in data["message"]
        assert data["details"]["handshake"] == "TLS 1.3 256-bit"


@pytest.mark.asyncio
async def test_connect_sync_disconnect_flow():
    """Test the complete lifecycle: connect, verify, sync real-time telemetry, and disconnect."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Connect OpenAI
        connect_payload = {
            "provider": "openai",
            "api_key": "sk-live-982147104928104812",
            "model": "gpt-4o",
            "config": {"temperature": 0.3},
        }
        connect_res = await client.post("/api/v1/integrations/openai/connect", json=connect_payload)
        assert connect_res.status_code == 200
        connected_data = connect_res.json()
        assert connected_data["is_connected"] is True
        assert connected_data["status"] == "connected"
        assert connected_data["credentials_masked"] == "sk-l...4812"
        assert "citation_rate" in connected_data["telemetry_data"]

        # 2. Verify in list
        list_res = await client.get("/api/v1/integrations")
        assert list_res.status_code == 200
        list_data = list_res.json()
        assert list_data["total_connected"] >= 1
        openai_item = next(i for i in list_data["integrations"] if i["provider"] == "openai")
        assert openai_item["is_connected"] is True
        assert openai_item["credentials_masked"] == "sk-l...4812"

        # 3. Trigger Real-time Sync
        sync_res = await client.post("/api/v1/integrations/openai/sync")
        assert sync_res.status_code == 200
        sync_data = sync_res.json()
        assert sync_data["success"] is True
        assert "telemetry_data" in sync_data
        assert sync_data["telemetry_data"]["prompt_evaluations_run"] >= 1420

        # 4. Disconnect
        disc_res = await client.post("/api/v1/integrations/openai/disconnect")
        assert disc_res.status_code == 200
        disc_data = disc_res.json()
        assert disc_data["is_connected"] is False
        assert disc_data["status"] == "disconnected"
        assert disc_data["credentials_masked"] is None


@pytest.mark.asyncio
async def test_invalid_provider_handling():
    """Verify that invalid provider names return 400 Bad Request."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/integrations/nonexistent_engine/connect",
            json={"provider": "nonexistent_engine", "api_key": "test"},
        )
        assert response.status_code == 400
        assert "Unsupported provider" in response.json()["detail"]
