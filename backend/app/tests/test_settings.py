import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_and_update_workspace_settings(client: AsyncClient, auth_headers: dict):
    """Verify fetching default settings and updating workspace profile."""
    # 1. Fetch initial settings
    get_res = await client.get("/api/v1/settings")
    assert get_res.status_code == 200
    settings_data = get_res.json()
    assert settings_data["id"] == "global"
    assert "workspace_name" in settings_data

    # 2. Update workspace settings (auth required)
    update_payload = {
        "workspace_name": "SeoSensing Global Growth Suite",
        "timezone": "America/New_York (EST)",
        "default_language": "en-US",
    }
    patch_res = await client.patch("/api/v1/settings/workspace", json=update_payload, headers=auth_headers)
    assert patch_res.status_code == 200
    updated_data = patch_res.json()
    assert updated_data["workspace_name"] == "SeoSensing Global Growth Suite"
    assert updated_data["timezone"] == "America/New_York (EST)"


@pytest.mark.asyncio
async def test_update_workspace_settings_requires_auth(client: AsyncClient):
    """Anonymous workspace mutation must 401."""
    patch_res = await client.patch("/api/v1/settings/workspace", json={"workspace_name": "Hijack"})
    assert patch_res.status_code == 401


@pytest.mark.asyncio
async def test_update_notification_preferences(client: AsyncClient, auth_headers: dict):
    """Verify updating multi-pillar notification and digest settings."""
    update_payload = {
        "notify_seo_complete": True,
        "notify_aeo_shift": False,
        "notify_geo_alert": True,
        "notify_weekly_digest": True,
        "alert_emails": ["alerts@enterprise.com", "dm@fortunehestia.in"],
    }
    patch_res = await client.patch("/api/v1/settings/notifications", json=update_payload, headers=auth_headers)
    assert patch_res.status_code == 200
    data = patch_res.json()
    prefs = data["notification_preferences"]
    assert prefs["notify_aeo_shift"] is False
    assert prefs["notify_seo_complete"] is True
    assert "alerts@enterprise.com" in prefs["alert_emails"]


@pytest.mark.asyncio
async def test_update_crawler_policy(client: AsyncClient, auth_headers: dict):
    """Verify updating technical crawler default limits."""
    update_payload = {
        "max_crawl_pages": 250,
        "crawl_delay_ms": 300,
        "concurrent_workers": 6,
        "respect_robots": True,
    }
    patch_res = await client.patch("/api/v1/settings/crawler", json=update_payload, headers=auth_headers)
    assert patch_res.status_code == 200
    data = patch_res.json()
    policy = data["default_crawler_policy"]
    assert policy["max_crawl_pages"] == 250
    assert policy["crawl_delay_ms"] == 300
    assert policy["concurrent_workers"] == 6


@pytest.mark.asyncio
async def test_get_platform_health_diagnostics(client: AsyncClient):
    """Verify real-time health diagnostics across database, SEO, AEO, and GEO."""
    res = await client.get("/api/v1/settings/health-diagnostics")
    assert res.status_code == 200
    data = res.json()
    assert "database_latency_ms" in data
    assert data["database_latency_ms"] >= 0
    assert data["seo_engine"]["status"] == "Online"
    assert data["aeo_engine"]["status"] == "Online"
    assert data["geo_engine"]["status"] == "Online"
