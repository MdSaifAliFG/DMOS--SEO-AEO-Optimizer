from __future__ import annotations
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.geo import GeoProject
from app.services.geo.accessibility_engine import GEOAccessibilityEngine
from app.services.geo.authority_engine import GEOAuthorityEngine
from app.services.geo.citation_extractor import GEOCitationExtractor
from app.services.geo.competitor_detector import GEOCompetitorDetector
from app.services.geo.consistency_engine import GEOConsistencyEngine
from app.services.geo.content_extractability_engine import GEOContentExtractabilityEngine
from app.services.geo.entity_extractor import GEOEntityExtractor
from app.services.geo.issue_engine import GEO_RULES_CATALOG, GEOIssueEngine
from app.services.geo.mention_detector import GEOMentionDetector
from app.services.geo.priority_calculator import GEOImpactCalculator, GEOPriorityCalculator
from app.services.geo.provider_interface import (
    GEOProviderRegistry,
    GEOProviderStatus,
    MockTestGEOProvider,
)
from app.services.geo.question_generator import GEO_QUESTION_CATEGORIES, GEOQuestionGenerator
from app.services.geo.recommendation_engine import GEORecommendationEngine
from app.services.geo.scoring_engine import GEOScoringEngine


@pytest.mark.asyncio
async def test_geo_project_crud(client: AsyncClient):
    """Test GEO Project creation, retrieval, update, and deletion."""
    # 1. Create
    payload = {
        "name": "SeoSensing GEO Project",
        "domain": "seosensing.com",
        "brand_name": "SeoSensing",
        "brand_aliases": ["SeoSensing AI", "SensingSEO"],
        "industry": "Marketing Technology",
        "target_audience": "Enterprise Marketing Teams",
        "products": ["GEO Sensing Platform", "AEO Analyzer"],
        "services": ["Generative Visibility Audits"],
        "competitors": [{"name": "Semrush", "domain": "semrush.com"}, {"name": "Ahrefs", "domain": "ahrefs.com"}],
    }
    res = await client.post("/api/v1/geo/projects", json=payload)
    assert res.status_code == 201, res.text
    data = res.json()
    project_id = data["id"]
    assert data["name"] == "SeoSensing GEO Project"
    assert data["domain"] == "seosensing.com"
    assert data["brand_name"] == "SeoSensing"

    # 2. List
    list_res = await client.get("/api/v1/geo/projects")
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # 3. Get single
    get_res = await client.get(f"/api/v1/geo/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == project_id

    # 4. Update
    patch_res = await client.patch(f"/api/v1/geo/projects/{project_id}", json={"description": "Updated description"})
    assert patch_res.status_code == 200
    assert patch_res.json()["description"] == "Updated description"

    # 5. Brand profile
    bp_res = await client.get(f"/api/v1/geo/projects/{project_id}/brand-profile")
    assert bp_res.status_code == 200
    assert bp_res.json()["brand_name"] == "SeoSensing"

    # 6. Delete
    del_res = await client.delete(f"/api/v1/geo/projects/{project_id}")
    assert del_res.status_code == 204


def test_geo_question_generator_18_categories():

    """Verify deterministic generation across all 18 specified categories."""
    gen = GEOQuestionGenerator()
    assert len(GEO_QUESTION_CATEGORIES) == 18

    questions = gen.generate_questions(
        brand_name="SeoSensing",
        products=["GEO Optimizer"],
        services=["Search Intelligence"],
        industry="MarTech",
        primary_topics=["Generative Optimization"],
        competitors=["CompetitorX", "CompetitorY"],
        target_audience="Enterprises",
        count_per_category=1,
    )

    generated_categories = {q["category"] for q in questions}
    for cat in GEO_QUESTION_CATEGORIES:
        assert cat in generated_categories, f"Missing category: {cat}"

    # Verify deterministic output
    questions_repeat = gen.generate_questions(
        brand_name="SeoSensing",
        products=["GEO Optimizer"],
        services=["Search Intelligence"],
        industry="MarTech",
        primary_topics=["Generative Optimization"],
        competitors=["CompetitorX", "CompetitorY"],
        target_audience="Enterprises",
        count_per_category=1,
    )
    assert questions == questions_repeat


def test_mention_detector():
    """Verify exact, alias, product, service, and no-mention classification."""
    detector = GEOMentionDetector()

    # Exact brand
    text1 = "In our benchmark, SeoSensing achieved the highest extractability score."
    res1 = detector.detect_mentions(text1, brand_name="SeoSensing")
    assert res1["mentioned"] is True
    assert res1["mention_type"] == "exact_brand"
    assert res1["sentiment"] == "positive"

    # Alias mention
    text2 = "Many marketing teams rely on SensingSEO for generative search insights."
    res2 = detector.detect_mentions(text2, brand_name="SeoSensing", aliases=["SensingSEO"])
    assert res2["mentioned"] is True
    assert res2["mention_type"] == "alias_mention"

    # Product mention
    text3 = "When deploying GEO Optimizer, users noticed rapid visibility improvements."
    res3 = detector.detect_mentions(text3, brand_name="SeoSensing", products=["GEO Optimizer"])
    assert res3["mentioned"] is True
    assert res3["mention_type"] == "product_mention"

    # No mention
    text4 = "Other traditional platforms dominate standard keywords."
    res4 = detector.detect_mentions(text4, brand_name="SeoSensing")
    assert res4["mentioned"] is False
    assert res4["mention_type"] == "no_mention"


def test_recommendation_engine():
    """Verify recommendation strength tiers."""
    engine = GEORecommendationEngine()

    # Strong recommendation
    text_strong = "For enterprise marketing intelligence, we strongly recommend SeoSensing as the #1 choice."
    res_s = engine.evaluate_recommendation(text_strong, brand_name="SeoSensing", brand_mentioned=True)
    assert res_s["recommended"] is True
    assert res_s["recommendation_strength"] == "Strong Recommendation"

    # Moderate recommendation
    text_rec = "SeoSensing is an excellent choice for teams needing deterministic search analysis."
    res_m = engine.evaluate_recommendation(text_rec, brand_name="SeoSensing", brand_mentioned=True)
    assert res_m["recommended"] is True
    assert res_m["recommendation_strength"] == "Recommendation"

    # Neutral mention
    text_neu = "SeoSensing is a martech software provider located in North America."
    res_n = engine.evaluate_recommendation(text_neu, brand_name="SeoSensing", brand_mentioned=True)
    assert res_n["recommended"] is False
    assert res_n["recommendation_strength"] == "Neutral Mention"

    # Negative / Not recommended
    text_neg = "SeoSensing has drawbacks including limited manual exports and is not recommended."
    res_neg = engine.evaluate_recommendation(text_neg, brand_name="SeoSensing", brand_mentioned=True)
    assert res_neg["recommended"] is False
    assert res_neg["recommendation_strength"] == "Not Recommended"


def test_competitor_detector_and_sov():
    """Verify competitor detection, mention rate, and share of voice calculations."""
    detector = GEOCompetitorDetector()
    answer_text = "Leading tools include CompetitorA and CompetitorB, while SeoSensing provides superior AI readiness."

    competitors = [{"name": "CompetitorA"}, {"name": "CompetitorB"}, {"name": "CompetitorC"}]
    detected = detector.detect_in_answer(answer_text, competitors)
    detected_names = [d["name"] for d in detected]
    assert "CompetitorA" in detected_names
    assert "CompetitorB" in detected_names
    assert "CompetitorC" not in detected_names

    agg = detector.aggregate_competitive_metrics(
        total_answers=1,
        brand_name="SeoSensing",
        brand_answers=[{"brand_mentioned": True, "recommended": True, "competitor_mentions": detected}],
        competitors=competitors,
    )
    assert agg["brand_mention_rate"] == 100.0
    assert agg["brand_share_of_voice"] == 33.3  # 1 out of 3 total market mentions


def test_citation_extractor_no_fake_authority():
    """Verify source classification and absence of fabricated authority scores."""
    extractor = GEOCitationExtractor()
    raw_citations = [
        {"url": "https://seosensing.com/features", "title": "Features"},
        {"url": "https://competitor.com/pricing", "title": "Competitor Pricing"},
        {"url": "https://techcrunch.com/2025/ai-search-tools", "title": "TechCrunch Review"},
        {"url": "https://g2.com/products/seosensing/reviews", "title": "G2 Reviews"},
        {"url": "https://randomblog.xyz/post-1", "title": "Blog"},
    ]

    cits = extractor.extract_from_text_and_raw(
        answer_text="Learn more at https://reddit.com/r/marketing.",
        raw_citations=raw_citations,
        own_domain="seosensing.com",
        competitors=[{"domain": "competitor.com"}],
    )

    types = {c["domain"]: c["source_type"] for c in cits}
    assert types["seosensing.com"] == "own_domain"
    assert types["competitor.com"] == "competitor"
    assert types["techcrunch.com"] == "news"
    assert types["g2.com"] == "review"
    assert types["reddit.com"] == "social"
    assert types["randomblog.xyz"] == "third_party"

    # Confirm authority score is NOT fabricated
    for c in cits:
        assert c["authority_score"] is None
        assert c["authority_status"] == "NOT_AVAILABLE"


def test_scoring_engine_determinism_and_boundaries():
    """Verify deterministic 8-factor score calculation and boundary levels."""
    scorer = GEOScoringEngine()

    # Exact same inputs yield exact same output
    res1 = scorer.calculate_geo_score(
        visibility_score=80,
        recommendation_score=70,
        citation_score=60,
        entity_score=90,
        content_score=85,
        technical_score=95,
        authority_score=75,
        consistency_score=80,
        has_answers=True,
    )
    res2 = scorer.calculate_geo_score(
        visibility_score=80,
        recommendation_score=70,
        citation_score=60,
        entity_score=90,
        content_score=85,
        technical_score=95,
        authority_score=75,
        consistency_score=80,
        has_answers=True,
    )
    assert res1 == res2
    assert res1["geo_score"] == 78
    assert res1["score_label"] == "Good"
    assert res1["confidence"] == "HIGH"
    assert res1["data_coverage"] == 100

    # Boundary testing
    assert scorer.get_score_label(100) == "Excellent"
    assert scorer.get_score_label(90) == "Excellent"
    assert scorer.get_score_label(89) == "Good"
    assert scorer.get_score_label(75) == "Good"
    assert scorer.get_score_label(74) == "Needs Improvement"
    assert scorer.get_score_label(50) == "Needs Improvement"
    assert scorer.get_score_label(49) == "Poor"
    assert scorer.get_score_label(25) == "Poor"
    assert scorer.get_score_label(24) == "Critical"
    assert scorer.get_score_label(0) == "Critical"


def test_geo_rules_catalog_at_least_40():
    """Verify at least 40 deterministic rules exist in catalog."""
    assert len(GEO_RULES_CATALOG) >= 40
    for i in range(1, 41):
        code = f"GEO{i:03d}"
        assert code in GEO_RULES_CATALOG, f"Missing rule code {code}"


@pytest.mark.asyncio
async def test_ssrf_safety_in_accessibility_engine():
    """Verify that private IP and loopback targets are safely blocked."""
    engine = GEOAccessibilityEngine()

    # Private IP
    res_private = await engine.inspect_domain_accessibility("192.168.1.1")
    assert res_private["accessible"] is False
    assert "Security restriction" in res_private["error"]

    # Localhost
    res_local = await engine.inspect_domain_accessibility("127.0.0.1")
    assert res_local["accessible"] is False
    assert "Security restriction" in res_local["error"]


@pytest.mark.asyncio
async def test_provider_status_no_fake_data():
    """Verify that unconfigured providers report structured status without returning fake data."""
    registry = GEOProviderRegistry()
    openai = registry.get_provider("openai")
    assert openai is not None

    # When no key is set or fake key set
    res = await openai.generate_answer("Who are the top search tools?")
    # Either not configured or error, never returns fake answer
    assert res["status"] in ("NOT_CONFIGURED", "ERROR")
    if res["status"] == "NOT_CONFIGURED":
        assert res["answer_text"] == ""
        assert "not configured" in res["error"].lower()


@pytest.mark.asyncio
async def test_unified_search_intelligence():
    """Verify 40% SEO + 30% AEO + 30% GEO calculation."""
    res = GEOScoringEngine.calculate_unified_search_intelligence(
        seo_score=86,
        aeo_score=74,
        geo_score=68,
    )
    assert res["has_sufficient_data"] is True
    # (86*0.4) + (74*0.3) + (68*0.3) = 34.4 + 22.2 + 20.4 = 77
    assert res["unified_score"] == 77
    assert res["score_label"] == "Good"
