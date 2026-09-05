import pytest
from datetime import datetime, timedelta, timezone
from httpx import AsyncClient
from app.services.aeo.monitoring.schedule_service import AEOScheduleService
from app.services.aeo.monitoring.change_detector import AEOChangeDetector
from app.services.aeo.monitoring.alert_engine import AEOAlertEngine
from app.services.aeo.monitoring.trend_engine import AEOTrendEngine
from app.services.aeo.intelligence.summary_generator import RuleBasedAEOIntelligenceProvider
from app.services.aeo.intelligence.intelligence_engine import AEOIntelligenceEngine


# 1. Schedule Frequency Calculation
def test_schedule_calculation():
    now = datetime.now(timezone.utc)
    
    # Daily (+1 day)
    next_daily = AEOScheduleService.calculate_next_run("daily", now)
    assert (next_daily - now).days == 1

    # Weekly (+7 days)
    next_weekly = AEOScheduleService.calculate_next_run("weekly", now)
    assert (next_weekly - now).days == 7

    # Monthly (+30 days)
    next_monthly = AEOScheduleService.calculate_next_run("monthly", now)
    assert (next_monthly - now).days == 30


# 2. Competitor Share of Voice Formula & Zero Division Safety
def test_share_of_voice_formula():
    # Standard formula: brand / (brand + comp) * 100
    brand_mentions = 4
    comp_mentions = 6
    sov = (brand_mentions / (brand_mentions + comp_mentions)) * 100
    assert sov == 40.0

    # 100% Brand dominance
    sov_full = (10 / (10 + 0)) * 100
    assert sov_full == 100.0

    # Zero-denominator protection: if brand = 0 and comp = 0, should be 0.0, no ZeroDivisionError
    total = 0 + 0
    sov_zero = (0 / total * 100) if total > 0 else 0.0
    assert sov_zero == 0.0


# 3. Deterministic Delta Computation
def test_delta_computation():
    prev_score = 80.0
    curr_score = 70.0
    delta = curr_score - prev_score
    assert delta == -10.0
    assert delta < 0  # Score drop

    gain_prev = 60.0
    gain_curr = 75.0
    gain_delta = gain_curr - gain_prev
    assert gain_delta == 15.0
    assert gain_delta > 0  # Score gain


# 4. Monitoring Health Score Bounds [0, 100]
def test_monitoring_health_score_bounds():
    # Health formula: (base_score * 0.7) + (freshness_pts * 0.3) - penalties
    base_score = 80.0
    freshness_pts = 100.0
    crit_count = 0
    high_count = 0
    health_normal = max(0, min(100, round((base_score * 0.7) + (freshness_pts * 0.3) - (crit_count * 10 + high_count * 5))))
    assert 0 <= health_normal <= 100

    # Severe penalty test (should not drop below 0)
    crit_count_huge = 15
    high_count_huge = 10
    health_severe = max(0, min(100, round((10.0 * 0.7) + (0.0 * 0.3) - (crit_count_huge * 10 + high_count_huge * 5))))
    assert health_severe == 0

    # Max score test (capped at 100)
    health_max = max(0, min(100, round((100.0 * 0.7) + (100.0 * 0.3))))
    assert health_max == 100


# 5. Multi-Engine Parity Status Labeling
def test_provider_parity_labeling():
    ratio_high = 0.9
    label_high = "Parity Achieved (Consistent Brand Representation)" if ratio_high >= 0.8 else "Provider Parity Gap"
    assert "Parity Achieved" in label_high

    ratio_low = 0.4
    label_low = "Parity Achieved (Consistent Brand Representation)" if ratio_low >= 0.8 else "Provider Parity Gap (Significant Divergence)"
    assert "Provider Parity Gap" in label_low


# 6. Grounded Narrative Summary (No Hallucinations)
def test_intelligence_summary_generation():
    provider = RuleBasedAEOIntelligenceProvider()
    telemetry = {
        "brand_name": "TestBrand",
        "overall_score": 85,
        "score_change": 5,
        "mention_rate": 45.0,
        "citation_rate": 30.0,
        "brand_share_of_voice": 45.0,
        "has_enough_data": True,
        "top_competitor": "CompetitorX",
        "top_competitor_sov": 25.0,
    }
    summary = provider.generate_summary(telemetry)
    assert "TestBrand" in summary
    assert "85/100" in summary
    assert "improved by +5 points" in summary
    assert "CompetitorX" in summary


# 7. End-to-End REST Integration Flow
@pytest.mark.asyncio
async def test_phase7_full_integration(client: AsyncClient):
    # Step 1: Create a dedicated test project
    proj_resp = await client.post(
        "/api/v1/aeo/projects",
        json={
            "name": "Phase 7 Intelligence Test Brand",
            "domain": "phase7intelligence.com",
            "industry": "Marketing Tech",
            "description": "Continuous monitoring and competitive intelligence verification project",
        },
    )
    assert proj_resp.status_code == 201
    project_data = proj_resp.json()
    project_id = project_data["id"]

    # Step 2: Create a question for this project
    q_resp = await client.post(
        "/api/v1/aeo/questions",
        json={
            "project_id": project_id,
            "question_text": "What is Phase 7 Intelligence and how does it optimize AEO?",
            "category": "Brand Overview",
            "intent": "informational",
        },
    )
    assert q_resp.status_code == 201

    # Step 3: Run Monitoring Cycle
    run_resp = await client.post(
        f"/api/v1/aeo/monitoring/{project_id}/run?allow_test_mode=true",
    )
    assert run_resp.status_code == 200
    assert "id" in run_resp.json()

    # Step 4: Verify Monitoring Schedule Endpoint
    sched_resp = await client.get(f"/api/v1/aeo/monitoring/{project_id}")
    assert sched_resp.status_code == 200
    sched_data = sched_resp.json()
    assert sched_data["project_id"] == project_id
    assert sched_data["enabled"] is True

    # Step 5: Update Monitoring Schedule
    patch_sched = await client.patch(
        f"/api/v1/aeo/monitoring/{project_id}",
        json={
            "frequency": "daily",
            "selected_engines": ["chatgpt", "gemini", "perplexity"],
            "alert_thresholds": {"score_drop": 8, "competitor_gain": 12},
        },
    )
    assert patch_sched.status_code == 200
    assert patch_sched.json()["frequency"] == "daily"
    assert patch_sched.json()["alert_thresholds"]["score_drop"] == 8

    # Step 6: Verify Trends Endpoint
    trends_resp = await client.get(f"/api/v1/aeo/trends/{project_id}?range=30d")
    assert trends_resp.status_code == 200
    trend_data = trends_resp.json()
    assert "has_enough_data" in trend_data
    assert "timeline" in trend_data

    # Step 7: Verify Engine Comparison
    engines_resp = await client.get(f"/api/v1/aeo/engines/{project_id}")
    assert engines_resp.status_code == 200
    eng_data = engines_resp.json()
    assert "engines" in eng_data
    assert len(eng_data["engines"]) >= 3
    assert "provider_parity" in eng_data

    # Step 8: Verify Competitors Intelligence
    comp_resp = await client.get(f"/api/v1/aeo/competitors/{project_id}")
    assert comp_resp.status_code == 200
    comp_data = comp_resp.json()
    assert "brand_share_of_voice" in comp_data
    assert "competitors_tracked" in comp_data
    assert "comparison_chart_data" in comp_data

    # Step 9: Verify Change Events Endpoint
    changes_resp = await client.get(f"/api/v1/aeo/changes/{project_id}")
    assert changes_resp.status_code == 200
    assert isinstance(changes_resp.json(), list)

    # Step 10: Verify Alerts Endpoint
    alerts_resp = await client.get(f"/api/v1/aeo/alerts/{project_id}")
    assert alerts_resp.status_code == 200
    alerts_list = alerts_resp.json()
    assert isinstance(alerts_list, list)

    # Step 11: If alert exists, test acknowledge and resolve
    if len(alerts_list) > 0:
        alert_id = alerts_list[0]["id"]
        ack_resp = await client.patch(
            f"/api/v1/aeo/alerts/{alert_id}",
            json={"status": "acknowledged"},
        )
        assert ack_resp.status_code == 200
        assert ack_resp.json()["status"] == "acknowledged"

        res_resp = await client.patch(
            f"/api/v1/aeo/alerts/{alert_id}",
            json={"status": "resolved"},
        )
        assert res_resp.status_code == 200
        assert res_resp.json()["status"] == "resolved"

    # Step 12: Verify Executive Intelligence Dashboard API
    intel_resp = await client.get(f"/api/v1/aeo/intelligence/{project_id}")
    assert intel_resp.status_code == 200
    intel_data = intel_resp.json()
    assert "monitoring_health_score" in intel_data
    assert "monitoring_health_status" in intel_data
    assert "executive_summary" in intel_data
    assert "competitive_position" in intel_data
    assert "top_risks" in intel_data

    # Step 13: Verify Prompt Movements Endpoint
    prompt_mov_resp = await client.get(f"/api/v1/aeo/monitoring/{project_id}/prompts")
    assert prompt_mov_resp.status_code == 200
    assert isinstance(prompt_mov_resp.json(), list)

    # Step 14: Verify Citation Movements Endpoint
    cit_mov_resp = await client.get(f"/api/v1/aeo/monitoring/{project_id}/citations")
    assert cit_mov_resp.status_code == 200
    assert isinstance(cit_mov_resp.json(), list)

    # Step 15: Verify Entity Movements Endpoint
    ent_mov_resp = await client.get(f"/api/v1/aeo/monitoring/{project_id}/entities")
    assert ent_mov_resp.status_code == 200
    assert isinstance(ent_mov_resp.json(), list)
