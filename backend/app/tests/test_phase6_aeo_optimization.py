import pytest
from httpx import AsyncClient
from app.services.aeo.ai.rule_based_aeo_provider import RuleBasedAEOAIProvider
from app.services.aeo.optimization.citation_gap_analyzer import CitationGapAnalyzer
from app.services.aeo.optimization.competitor_gap_analyzer import CompetitorGapAnalyzer
from app.services.aeo.optimization.content_gap_analyzer import ContentGapAnalyzer
from app.services.aeo.optimization.entity_gap_analyzer import EntityGapAnalyzer
from app.services.aeo.optimization.gap_analyzer import AEOGapAnalysisEngine
from app.services.aeo.optimization.impact_calculator import AEOImpactCalculator
from app.services.aeo.optimization.priority_calculator import AEOPriorityCalculator
from app.services.aeo.optimization.prompt_gap_analyzer import PromptGapAnalyzer
from app.services.aeo.optimization.recommendation_catalog import AEO_RECOMMENDATION_CATALOG
from app.services.aeo.optimization.recommendation_engine import AEORecommendationEngine


# 1 & 2. Priority Calculation & Boundaries
def test_priority_calculation():
    # Critical test
    score, level = AEOPriorityCalculator.calculate_priority(
        severity="critical",
        affected_prompt_count=10,
        competitor_gap_score=80.0,
        citation_gap_score=60.0,
        visibility_impact=10,
    )
    assert score >= 90
    assert level == "critical"

    # Low test
    score_low, level_low = AEOPriorityCalculator.calculate_priority(
        severity="low",
        affected_prompt_count=0,
        competitor_gap_score=0.0,
        citation_gap_score=0.0,
        visibility_impact=2,
    )
    assert score_low <= 39
    assert level_low == "low"

    # Bounded between 0 and 100
    score_huge, _ = AEOPriorityCalculator.calculate_priority(
        severity="critical",
        affected_prompt_count=1000,
        competitor_gap_score=500.0,
        citation_gap_score=500.0,
        visibility_impact=100,
    )
    assert score_huge == 100


# 3 & 4. Impact Calculation & Ceiling <= 100
def test_impact_calculation_and_bounds():
    impact, potential = AEOImpactCalculator.calculate_potential(current_score=85, estimated_impact=20)
    assert impact == 20
    assert potential == 100  # Capped at 100, not 105

    gain, batch_pot = AEOImpactCalculator.calculate_batch_potential(
        current_score=60,
        impacts=[10, 8, 8, 5, 5],
    )
    assert gain > 0
    assert batch_pot <= 100
    assert batch_pot >= 60


# 5. Recommendation Catalog Test
def test_recommendation_catalog_completeness():
    assert len(AEO_RECOMMENDATION_CATALOG) >= 15
    categories = set(r["category"] for r in AEO_RECOMMENDATION_CATALOG)
    assert len(categories) >= 10
    for r in AEO_RECOMMENDATION_CATALOG:
        assert "code" in r
        assert "title" in r
        assert "why_it_matters" in r
        assert "how_to_fix" in r
        assert "implementation_steps" in r


# 6. Rule-Based AI Content & Answer Optimizer Test
@pytest.mark.asyncio
async def test_rule_based_optimizer():
    provider = RuleBasedAEOAIProvider()

    # Content optimization
    res_content = await provider.optimize_content(
        target_question="What is the best SEO tool for agencies?",
        existing_content="SeoSensing is an automated platform providing search engine optimization tools for marketing teams.",
        target_keyword="AEO software",
        brand_name="SeoSensing",
        product_service="AEO platform",
    )
    assert res_content["content_quality_score"] > 0
    assert "direct_answer_suggestion" in res_content
    assert len(res_content["recommended_headings"]) >= 3

    # Direct answer evaluation (9 dimensions)
    res_answer = await provider.optimize_direct_answer(
        target_question="How much does SeoSensing cost?",
        existing_content="SeoSensing is a software platform with pricing starting at $49/month with enterprise security and SOC 2 compliance for marketing teams.",
        brand_name="SeoSensing",
    )
    assert res_answer["total_criteria_count"] == 9
    assert res_answer["passed_criteria_count"] >= 3
    assert "checklist" in res_answer
    assert len(res_answer["checklist"]) == 9


# 7 - 24. End-to-End REST API & Integration Tests
@pytest.mark.asyncio
async def test_phase6_aeo_action_center_api_flow(client: AsyncClient):
    # 1. Create a project
    proj_resp = await client.post(
        "/api/v1/aeo/projects",
        json={
            "name": "Acme AI Analytics",
            "domain": "acmeanalytics.io",
            "industry": "Analytics",
            "competitors": [{"name": "CompAlpha", "domain": "compalpha.com"}],
        },
    )
    assert proj_resp.status_code == 201
    project_id = proj_resp.json()["id"]

    # 2. Add sample questions
    q1_resp = await client.post(
        "/api/v1/aeo/questions",
        json={
            "project_id": project_id,
            "question_text": "What is Acme AI Analytics and how does it compare to CompAlpha?",
            "category": "Competitor Analysis",
            "intent": "comparison",
        },
    )
    assert q1_resp.status_code == 201

    q2_resp = await client.post(
        "/api/v1/aeo/questions",
        json={
            "project_id": project_id,
            "question_text": "How much does Acme AI Analytics cost per month?",
            "category": "Pricing",
            "intent": "commercial",
        },
    )
    assert q2_resp.status_code == 201

    # 3. Trigger analysis (test mode)
    an_resp = await client.post(
        f"/api/v1/aeo/projects/{project_id}/analyze",
        json={"allow_test_mode": True},
    )
    assert an_resp.status_code in [200, 202]

    # 4. Generate actions
    gen_resp = await client.post(
        "/api/v1/aeo/actions/generate",
        json={"project_id": project_id},
    )
    assert gen_resp.status_code == 200
    actions = gen_resp.json()["recommendations"]
    assert len(actions) > 0

    first_action = actions[0]
    action_id = first_action["id"]

    # 5. Get actions list with filters
    list_resp = await client.get(
        "/api/v1/aeo/actions",
        params={"project_id": project_id, "status": "open"},
    )
    assert list_resp.status_code == 200
    assert list_resp.json()["total"] >= 1

    # 6. Get action details
    detail_resp = await client.get(f"/api/v1/aeo/actions/{action_id}")
    assert detail_resp.status_code == 200
    assert detail_resp.json()["id"] == action_id
    assert "implementation_steps" in detail_resp.json()

    # 7. Update action status & notes
    patch_resp = await client.patch(
        f"/api/v1/aeo/actions/{action_id}",
        json={"status": "in_progress", "notes": "Implementation scheduled for sprint 12."},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "in_progress"
    assert patch_resp.json()["notes"] == "Implementation scheduled for sprint 12."

    # 8. Verify action endpoint
    verify_resp = await client.post(f"/api/v1/aeo/actions/{action_id}/verify")
    assert verify_resp.status_code == 200
    assert "verification_status" in verify_resp.json()

    # 9. Bulk update actions
    bulk_resp = await client.post(
        "/api/v1/aeo/actions/bulk",
        json={"action_ids": [action_id], "status": "fixed"},
    )
    assert bulk_resp.status_code == 200
    assert bulk_resp.json()["updated_count"] == 1

    # 10. Action Center Summary
    summary_resp = await client.get(f"/api/v1/aeo/actions/summary/{project_id}")
    assert summary_resp.status_code == 200
    sum_data = summary_resp.json()
    assert sum_data["total_actions"] >= 1
    assert "potential_score" in sum_data
    assert "category_breakdown" in sum_data

    # 11. Gaps Endpoints
    content_gap_resp = await client.post(
        "/api/v1/aeo/gaps/content",
        json={"project_id": project_id},
    )
    assert content_gap_resp.status_code == 200
    assert "gaps" in content_gap_resp.json()

    prompt_gap_resp = await client.post(
        "/api/v1/aeo/gaps/prompts",
        json={"project_id": project_id},
    )
    assert prompt_gap_resp.status_code == 200
    assert "opportunities" in prompt_gap_resp.json()

    citation_gap_resp = await client.post(
        "/api/v1/aeo/gaps/citations",
        json={"project_id": project_id},
    )
    assert citation_gap_resp.status_code == 200
    assert "opportunities" in citation_gap_resp.json()

    entity_gap_resp = await client.post(
        "/api/v1/aeo/gaps/entities",
        json={"project_id": project_id},
    )
    assert entity_gap_resp.status_code == 200
    assert "gaps" in entity_gap_resp.json()

    # 12. Optimization History
    hist_resp = await client.get(f"/api/v1/aeo/optimization-history/{project_id}")
    assert hist_resp.status_code == 200
    assert "comparisons" in hist_resp.json()

    # 13. Interactive Optimizers via API
    opt_content_resp = await client.post(
        "/api/v1/aeo/optimize/content",
        json={
            "target_question": "What is Acme AI Analytics?",
            "existing_content": "Acme AI Analytics is an enterprise AI answer optimization suite.",
            "brand_name": "Acme",
        },
    )
    assert opt_content_resp.status_code == 200
    assert "direct_answer_suggestion" in opt_content_resp.json()

    opt_ans_resp = await client.post(
        "/api/v1/aeo/optimize/answer",
        json={
            "target_question": "What is Acme AI Analytics?",
            "existing_content": "Acme is a tool designed for developers costing $99/mo.",
            "brand_name": "Acme",
        },
    )
    assert opt_ans_resp.status_code == 200
    assert "readiness_score" in opt_ans_resp.json()

    # 14. Export Actions CSV
    csv_resp = await client.get(f"/api/v1/aeo/actions/{project_id}/export-csv")
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    assert "Code,Recommendation" in csv_resp.text
