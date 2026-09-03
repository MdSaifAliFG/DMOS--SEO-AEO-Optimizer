import asyncio
import pytest
from httpx import AsyncClient

from app.models.aeo import AeoCitationType
from app.services.aeo.citation_extractor import CitationExtractorEngine
from app.services.aeo.competitor_detector import CompetitorDetectorEngine
from app.services.aeo.entity_extractor import EntityExtractorEngine
from app.services.aeo.mention_detector import MentionDetectorEngine
from app.services.aeo.question_generator import QuestionGeneratorEngine
from app.services.aeo.recommendation_engine import AEORecommendationEngine
from app.services.aeo.visibility_scorer import VisibilityScorerEngine


class TestAEOAnalyticsEngines:
    """Test unit behavior of all deterministic AEO engines."""

    def test_visibility_scoring_deterministic_formula(self):
        """Test formula: 0.35 * Mention + 0.25 * Citation + 0.20 * Position + 0.20 * Coverage"""
        breakdown = VisibilityScorerEngine.calculate_visibility_score(
            total_questions=10,
            questions_answered=10,  # Coverage = 100
            brand_mentions_count=8,
            total_answers_count=10,  # Mention = 80
            own_citations_count=6,
            total_citations_count=10,  # Citation = 60
            detected_positions=[2],  # Position 2 -> Pos score = 80
        )
        # Expected: 0.35(80) + 0.25(60) + 0.20(80) + 0.20(100) = 28 + 15 + 16 + 20 = 79
        assert breakdown.mention_score == 80
        assert breakdown.citation_score == 60
        assert breakdown.position_score == 80
        assert breakdown.coverage_score == 100
        assert breakdown.overall_score == 79
        assert breakdown.score_label == "Good"

    def test_visibility_scoring_boundaries(self):
        """Boundary tests for 0 and 100."""
        zero_score = VisibilityScorerEngine.calculate_visibility_score(
            total_questions=10,
            questions_answered=0,
            brand_mentions_count=0,
            total_answers_count=0,
            own_citations_count=0,
            total_citations_count=0,
            detected_positions=[],
        )
        assert zero_score.overall_score == 0
        assert zero_score.score_label == "Critical"

        perfect_score = VisibilityScorerEngine.calculate_visibility_score(
            total_questions=10,
            questions_answered=10,
            brand_mentions_count=10,
            total_answers_count=10,
            own_citations_count=10,
            total_citations_count=10,
            detected_positions=[1],
        )
        assert perfect_score.overall_score == 100
        assert perfect_score.score_label == "Excellent"

    def test_question_generator(self):
        """Test deterministic prompt generation across categories."""
        questions = QuestionGeneratorEngine.generate_questions(
            brand_name="Acrobat CRM",
            domain="acrobatcrm.com",
            industry="Real Estate",
            target_audience="agents",
            competitors=[{"name": "Zillow CRM", "domain": "zillow.com"}],
            max_questions=10,
        )
        assert len(questions) > 0
        categories = {q["category"] for q in questions}
        assert "Brand Overview" in categories or "Product Capabilities" in categories
        assert any("Acrobat CRM" in q["question_text"] for q in questions)

    def test_mention_detector(self):
        """Test brand mention detection and position ranking."""
        answer = "Top real estate CRMs for 2026: \n1. Acrobat CRM - Excellent platform.\n2. Zillow CRM"
        res = MentionDetectorEngine.detect_brand_mention(
            answer_text=answer,
            brand_name="Acrobat CRM",
            domain="acrobatcrm.com",
        )
        assert res["mentioned"] is True
        assert res["position"] == 1
        assert len(res["snippets"]) > 0

    def test_competitor_detector(self):
        """Test competitor detection and share of voice."""
        answer = "Competitors include HubSpot and Salesforce for sales automation."
        competitors = [
            {"name": "HubSpot", "domain": "hubspot.com"},
            {"name": "Pipedrive", "domain": "pipedrive.com"},
        ]
        detected = CompetitorDetectorEngine.detect_competitors(answer, competitors)
        names = [d["name"] for d in detected]
        assert "HubSpot" in names
        assert "Pipedrive" not in names

    def test_citation_extractor_and_classification(self):
        """Test URL extraction and domain classification."""
        answer_text = (
            "Sources: [Official Docs](https://acrobatcrm.com/docs), "
            "https://techcrunch.com/review-2026, https://g2.com/products/acrobat, "
            "and https://competitor.com/overview."
        )
        citations = CitationExtractorEngine.extract_citations(
            answer_text=answer_text,
            target_domain="acrobatcrm.com",
            competitor_domains=["competitor.com"],
        )
        types = {c["domain"]: c["citation_type"] for c in citations}
        assert types["acrobatcrm.com"] == AeoCitationType.OWN_DOMAIN.value
        assert types["competitor.com"] == AeoCitationType.COMPETITOR.value
        assert types["techcrunch.com"] == AeoCitationType.NEWS.value
        assert types["g2.com"] == AeoCitationType.REVIEW.value

    def test_entity_extractor(self):
        """Test entity knowledge associations."""
        entities = EntityExtractorEngine.extract_entities(
            brand_name="Fortune CRM",
            domain="fortunecrm.com",
            industry="Real Estate",
            answers=["Fortune CRM is a leading AI Search and CRM software tool."],
        )
        names = [e["entity_name"] for e in entities]
        assert "Fortune CRM" in names

    def test_recommendation_engine(self):
        """Test recommendation generation on low scores."""
        breakdown = VisibilityScorerEngine.calculate_visibility_score(
            total_questions=10,
            questions_answered=10,
            brand_mentions_count=2,
            total_answers_count=10,
            own_citations_count=1,
            total_citations_count=10,
            detected_positions=[4],
        )
        recs = AEORecommendationEngine.generate_recommendations(
            score_breakdown=breakdown,
            brand_name="TestBrand",
            domain="testbrand.com",
            unmentioned_questions=["Unanswered Q1"],
            competitor_stats=[{"name": "CompA", "mention_rate": 80}],
            total_citations=10,
            own_citations=1,
        )
        assert len(recs) >= 2
        rec_categories = {r["category"] for r in recs}
        assert any(c in rec_categories for c in ["Brand Presence", "Brand Visibility", "Citation Building", "Citation Opportunities", "Prompt Coverage"])


@pytest.mark.asyncio
class TestAEOApiEndpoints:
    """Test FastAPI REST endpoints for AEO Phase 5."""

    async def test_create_and_manage_aeo_project(self, client: AsyncClient, db_session: AsyncSession):
        # 1. SSRF prevention
        ssrf_res = await client.post(
            "/api/v1/aeo/projects",
            json={"name": "SSRF Test", "domain": "http://127.0.0.1:8000"},
        )
        assert ssrf_res.status_code == 400

        # 2. Valid Project Creation
        create_res = await client.post(
            "/api/v1/aeo/projects",
            json={
                "name": "Zobay AI",
                "domain": "zobay.ai",
                "industry": "Artificial Intelligence",
                "target_audience": "Software Developers",
                "competitors": [{"name": "Copilot", "domain": "copilot.microsoft.com"}],
            },
        )
        assert create_res.status_code == 201
        project = create_res.json()
        project_id = project["id"]
        assert project["domain"] == "zobay.ai"
        assert project["questions_count"] > 0

        # 3. Get Project
        get_res = await client.get(f"/api/v1/aeo/projects/{project_id}")
        assert get_res.status_code == 200
        assert get_res.json()["name"] == "Zobay AI"

        # 4. Trigger Analysis Lifecycle (with allow_test_mode=True for offline test)
        analyze_res = await client.post(
            f"/api/v1/aeo/projects/{project_id}/analyze",
            json={"allow_test_mode": True, "engines": ["chatgpt", "gemini"]},
        )
        assert analyze_res.status_code == 202
        analysis = analyze_res.json()
        analysis_id = analysis["id"]
        assert analysis["status"] in ("queued", "running", "completed")

        from app.services.aeo.analysis_runner import AEOAnalysisRunner
        await AEOAnalysisRunner.run_analysis_lifecycle(
            analysis_id=analysis_id,
            engines_to_run=["chatgpt", "gemini"],
            allow_test_mode=True,
            db=db_session,
        )

        final_status = await client.get(f"/api/v1/aeo/analysis/{analysis_id}")
        assert final_status.json()["status"] == "completed"
        assert final_status.json()["overall_score"] is not None

        # 5. Check Visibility Breakdown & History
        vis_res = await client.get(f"/api/v1/aeo/visibility/{project_id}")
        assert vis_res.status_code == 200
        vis_data = vis_res.json()
        assert vis_data["overall_score"] is not None
        assert vis_data["snapshots_count"] >= 1

        # 6. Check Dashboard Summary
        dash_res = await client.get("/api/v1/aeo/dashboard")
        assert dash_res.status_code == 200
        dash_data = dash_res.json()
        assert dash_data["total_projects"] >= 1
        assert len(dash_data["engines"]) > 0

        # 7. Check Recommendations
        recs_res = await client.get(f"/api/v1/aeo/recommendations/{project_id}")
        assert recs_res.status_code == 200
        assert "recommendations" in recs_res.json()

        # 8. Check CSV Export
        csv_res = await client.get(f"/api/v1/aeo/reports/{project_id}/export-csv")
        assert csv_res.status_code == 200
        assert "Question Text" in csv_res.text
