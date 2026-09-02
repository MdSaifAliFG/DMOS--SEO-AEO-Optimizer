import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.project import Project
from app.models.scan import Scan, ScanStatus
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage
from app.services.seo.recommendations.impact_calculator import ImpactCalculator
from app.services.seo.recommendations.priority_calculator import PriorityCalculator


def test_priority_calculator_deterministic():
    """Verify priority score formula produces deterministic bounded scores and correct tiers."""
    # Critical issue with many affected pages and indexability impact
    score_crit, tier_crit = PriorityCalculator.calculate_priority(
        severity="critical",
        affected_pages_count=15,
        category="indexability",
        estimated_impact=5.0,
        issue_code="noindex_directive",
    )
    assert 90.0 <= score_crit <= 100.0
    assert tier_crit == "critical"

    # High severity metadata issue
    score_high, tier_high = PriorityCalculator.calculate_priority(
        severity="high",
        affected_pages_count=8,
        category="metadata",
        estimated_impact=3.0,
        issue_code="missing_meta_description",
    )
    assert 70.0 <= score_high < 90.0
    assert tier_high == "high"

    # Medium severity content issue
    score_med, tier_med = PriorityCalculator.calculate_priority(
        severity="medium",
        affected_pages_count=3,
        category="content",
        estimated_impact=1.2,
        issue_code="missing_image_alt",
    )
    assert 40.0 <= score_med < 70.0
    assert tier_med == "medium"

    # Low severity cosmetic issue
    score_low, tier_low = PriorityCalculator.calculate_priority(
        severity="low",
        affected_pages_count=1,
        category="metadata",
        estimated_impact=0.4,
        issue_code="title_too_long",
    )
    assert score_low < 40.0
    assert tier_low == "low"


def test_impact_calculator_bounds_and_cap():
    """Verify SEO impact recoverable points calculation and <= 100 ceiling."""
    impact_crit = ImpactCalculator.calculate_issue_impact("critical", 4.5, 10)
    assert 3.0 <= impact_crit <= 8.0

    impact_low = ImpactCalculator.calculate_issue_impact("low", 0.8, 1)
    assert 0.1 <= impact_low <= 0.5

    # Test potential score ceiling
    curr, pot, recoverable = ImpactCalculator.calculate_potential_score(
        current_score=85,
        recommendation_impacts=[5.0, 4.0, 3.5, 6.0],  # Total = 18.5
    )
    assert curr == 85
    assert pot == 100  # Capped at 100 (85 + 15 max possible)
    assert recoverable == 15.0


@pytest.mark.asyncio
async def test_action_center_e2e_flow(client: AsyncClient, db_session: AsyncSession):
    """Test full Phase 4 lifecycle: issue generation -> recommendations -> status update -> bulk -> verify -> summary."""
    # 1. Create a project
    proj_res = await client.post(
        "/api/v1/projects",
        json={"name": "Optimization Action Center Target", "domain": "action-center.test"},
    )
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Seed a completed scan with pages and issues
    scan = Scan(
        project_id=project_id,
        target_url="https://action-center.test",
        status=ScanStatus.COMPLETED.value,
        progress=100,
        overall_score=72,
        technical_score=68,
        indexability_score=70,
        metadata_score=65,
        links_score=80,
    )
    db_session.add(scan)
    await db_session.commit()
    await db_session.refresh(scan)

    page1 = SeoPage(
        scan_id=scan.id,
        url="https://action-center.test/",
        final_url="https://action-center.test/",
        title="",
        meta_description="",
        word_count=450,
        status_code=200,
    )
    page2 = SeoPage(
        scan_id=scan.id,
        url="https://action-center.test/services",
        final_url="https://action-center.test/services",
        title="Services",
        meta_description="",
        word_count=120,
        status_code=200,
    )
    db_session.add_all([page1, page2])
    await db_session.commit()
    await db_session.refresh(page1)
    await db_session.refresh(page2)

    # Add issues
    issue1 = SeoIssue(
        scan_id=scan.id,
        page_id=page1.id,
        issue_code="missing_canonical",
        category=IssueCategory.TECHNICAL.value,
        severity=IssueSeverity.CRITICAL.value,
        title="Missing Canonical Tag",
        description="Page lacks a canonical tag.",
        recommendation="Add self-referential canonical tag.",
    )
    issue2 = SeoIssue(
        scan_id=scan.id,
        page_id=page1.id,
        issue_code="missing_meta_description",
        category=IssueCategory.METADATA.value,
        severity=IssueSeverity.HIGH.value,
        title="Missing Meta Description",
        description="Meta description tag is missing.",
        recommendation="Add unique 120-160 char meta description.",
    )
    issue3 = SeoIssue(
        scan_id=scan.id,
        page_id=page2.id,
        issue_code="missing_meta_description",
        category=IssueCategory.METADATA.value,
        severity=IssueSeverity.HIGH.value,
        title="Missing Meta Description",
        description="Meta description tag is missing.",
        recommendation="Add unique 120-160 char meta description.",
    )
    issue4 = SeoIssue(
        scan_id=scan.id,
        page_id=page2.id,
        issue_code="thin_content",
        category=IssueCategory.TECHNICAL.value,
        severity=IssueSeverity.HIGH.value,
        title="Thin Content",
        description="Page has fewer than 200 words.",
        recommendation="Expand content substance.",
    )
    db_session.add_all([issue1, issue2, issue3, issue4])
    await db_session.commit()

    # 3. Generate recommendations via API
    gen_res = await client.post(
        f"/api/v1/seo/actions/generate?scan_id={scan.id}&project_id={project_id}"
    )
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert gen_data["total"] >= 3  # missing_canonical, missing_meta_description (grouped across 2 pages), thin_content

    # 4. List actions with filters
    actions_res = await client.get(f"/api/v1/seo/actions?project_id={project_id}")
    assert actions_res.status_code == 200
    actions_data = actions_res.json()
    assert actions_data["total"] >= 3
    first_action = actions_data["recommendations"][0]
    action_id = first_action["id"]
    assert first_action["status"] == "open"
    assert first_action["priority_score"] > 0
    assert first_action["estimated_impact"] > 0

    # Verify grouping of missing_meta_description across 2 pages
    meta_desc_actions = [a for a in actions_data["recommendations"] if a["issue_code"] == "missing_meta_description"]
    assert len(meta_desc_actions) == 1
    assert meta_desc_actions[0]["affected_pages_count"] == 2

    # 5. Get single action detail
    detail_res = await client.get(f"/api/v1/seo/actions/{action_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == action_id
    assert len(detail_res.json()["why_it_matters"]) > 10

    # 6. Update action status to in_progress
    patch_res = await client.patch(
        f"/api/v1/seo/actions/{action_id}",
        json={"status": "in_progress", "notes": "Work assigned to marketing team"},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "in_progress"
    assert patch_res.json()["notes"] == "Work assigned to marketing team"

    # 7. Bulk update status
    all_action_ids = [a["id"] for a in actions_data["recommendations"]]
    bulk_res = await client.post(
        "/api/v1/seo/actions/bulk",
        json={"action_ids": all_action_ids[:2], "status": "fixed", "notes": "Bulk fix applied"},
    )
    assert bulk_res.status_code == 200
    assert bulk_res.json()["updated_count"] == 2

    # 8. Check optimization summary KPIs
    summary_res = await client.get(f"/api/v1/seo/actions/summary/{project_id}")
    assert summary_res.status_code == 200
    sum_data = summary_res.json()
    assert sum_data["total_actions"] >= 3
    assert sum_data["fixed_actions"] >= 2
    assert sum_data["current_seo_score"] == 72
    assert sum_data["potential_seo_score"] >= 72
    assert sum_data["optimization_progress"] > 0
    assert len(sum_data["category_breakdown"]) >= 4

    # 9. Verify fix endpoint
    verify_res = await client.post(f"/api/v1/seo/actions/{action_id}/verify")
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert "status" in v_data
    assert "is_fixed" in v_data


@pytest.mark.asyncio
async def test_seo_optimizers_endpoints(client: AsyncClient):
    """Test Metadata, Content, and Internal Linking optimizer endpoints."""
    # 1. Title Optimizer
    title_res = await client.post(
        "/api/v1/seo/optimize/title",
        json={
            "current_title": "Home",
            "target_url": "https://example.com/products/marketing-os",
            "target_keyword": "Digital Marketing OS",
            "brand_name": "DMOS",
        },
    )
    assert title_res.status_code == 200
    t_data = title_res.json()
    assert len(t_data["suggestions"]) == 3
    for s in t_data["suggestions"]:
        assert 10 <= s["character_count"] <= 70
        assert s["brand_presence"] is True

    # 2. Meta Description Optimizer
    desc_res = await client.post(
        "/api/v1/seo/optimize/description",
        json={
            "current_description": "We sell software.",
            "target_url": "https://example.com/products/marketing-os",
            "target_keyword": "Digital Marketing OS",
            "brand_name": "DMOS",
        },
    )
    assert desc_res.status_code == 200
    d_data = desc_res.json()
    assert len(d_data["suggestions"]) == 3
    for d in d_data["suggestions"]:
        assert 50 <= d["character_count"] <= 180
        assert d["cta_presence"] is True

    # 3. Content Optimizer
    content_res = await client.post(
        "/api/v1/seo/optimize/content",
        json={"project_id": "test-proj", "target_url": "https://example.com/landing"},
    )
    assert content_res.status_code == 200
    c_data = content_res.json()
    assert "word_count_status" in c_data
    assert "heading_structure" in c_data

    # 4. Internal Links Optimizer
    links_res = await client.post(
        "/api/v1/seo/optimize/internal-links",
        json={"project_id": "test-proj"},
    )
    assert links_res.status_code == 200
    l_data = links_res.json()
    assert "total_opportunities" in l_data
