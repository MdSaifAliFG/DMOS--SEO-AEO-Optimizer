import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.project import Project
from app.models.scan import Scan, ScanStatus
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage


@pytest.mark.asyncio
async def test_complete_phase4_functional_audit_flow(client: AsyncClient, db_session: AsyncSession):
    """
    Comprehensive functional recheck of the entire Phase 4 workflow:
    Project -> Audit 1 -> Issues -> Recommendations -> Actions Filter -> Status -> Notes -> Bulk ->
    Verify -> Potential Score -> Metadata/Content/Link Optimizers -> Audit 2 -> History Comparison.
    """
    # 1. Create a real SEO Project
    proj_res = await client.post(
        "/api/v1/projects",
        json={"name": "Acme SaaS Platform", "domain": "acme-saas.com"},
    )
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Simulate Audit #1 Completion with real pages & issues
    scan1 = Scan(
        project_id=project_id,
        target_url="https://acme-saas.com",
        status=ScanStatus.COMPLETED.value,
        progress=100,
        overall_score=68,
        technical_score=60,
        indexability_score=65,
        metadata_score=70,
        links_score=75,
        pages_crawled=3,
        issues_count=4,
    )
    db_session.add(scan1)
    await db_session.commit()
    await db_session.refresh(scan1)

    p1 = SeoPage(
        scan_id=scan1.id,
        url="https://acme-saas.com/",
        final_url="https://acme-saas.com/",
        title="Acme SaaS — Home",
        meta_description="",
        word_count=550,
        h1_count=1,
        h2_count=3,
        headings={"h1": ["Acme Cloud Platform"], "h2": ["Features", "Pricing", "Contact"]},
        status_code=200,
    )
    p2 = SeoPage(
        scan_id=scan1.id,
        url="https://acme-saas.com/pricing",
        final_url="https://acme-saas.com/pricing",
        title="",
        meta_description="",
        word_count=140,
        h1_count=0,
        h2_count=1,
        headings={"h1": [], "h2": ["Plans"]},
        status_code=200,
    )
    p3 = SeoPage(
        scan_id=scan1.id,
        url="https://acme-saas.com/blog/getting-started",
        final_url="https://acme-saas.com/blog/getting-started",
        title="Getting Started",
        meta_description="Guide for new users",
        word_count=800,
        h1_count=1,
        h2_count=4,
        headings={"h1": ["Getting Started"], "h2": ["Step 1", "Step 2", "Step 3", "Conclusion"]},
        status_code=200,
    )
    db_session.add_all([p1, p2, p3])
    await db_session.commit()
    await db_session.refresh(p1)
    await db_session.refresh(p2)
    await db_session.refresh(p3)

    # Add issues
    iss1 = SeoIssue(
        scan_id=scan1.id,
        page_id=p1.id,
        issue_code="missing_canonical",
        category=IssueCategory.TECHNICAL.value,
        severity=IssueSeverity.CRITICAL.value,
        title="Missing Canonical Tag",
        description="Canonical tag missing in head.",
        recommendation="Add self-referential canonical tag.",
    )
    iss2 = SeoIssue(
        scan_id=scan1.id,
        page_id=p1.id,
        issue_code="missing_meta_description",
        category=IssueCategory.METADATA.value,
        severity=IssueSeverity.HIGH.value,
        title="Missing Meta Description",
        description="Meta description tag is missing.",
        recommendation="Add unique 120-160 char meta description.",
    )
    iss3 = SeoIssue(
        scan_id=scan1.id,
        page_id=p2.id,
        issue_code="missing_meta_description",
        category=IssueCategory.METADATA.value,
        severity=IssueSeverity.HIGH.value,
        title="Missing Meta Description",
        description="Meta description tag is missing.",
        recommendation="Add unique 120-160 char meta description.",
    )
    iss4 = SeoIssue(
        scan_id=scan1.id,
        page_id=p2.id,
        issue_code="thin_content",
        category=IssueCategory.TECHNICAL.value,
        severity=IssueSeverity.HIGH.value,
        title="Thin Content",
        description="Page has 140 words.",
        recommendation="Expand substantive body text to 500+ words.",
    )
    db_session.add_all([iss1, iss2, iss3, iss4])
    await db_session.commit()

    # 3. Generate Recommendations
    gen_res = await client.post(
        f"/api/v1/seo/actions/generate?scan_id={scan1.id}&project_id={project_id}"
    )
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert gen_data["total"] >= 3

    # Test duplicate generation prevention
    gen_res2 = await client.post(
        f"/api/v1/seo/actions/generate?scan_id={scan1.id}&project_id={project_id}"
    )
    assert gen_res2.status_code == 200
    assert gen_res2.json()["total"] == gen_data["total"]

    # 4. List Actions with Category & Status Filtering
    list_res = await client.get(
        f"/api/v1/seo/actions?project_id={project_id}&status=open&category=metadata"
    )
    assert list_res.status_code == 200
    meta_actions = list_res.json()["recommendations"]
    assert len(meta_actions) >= 1
    assert meta_actions[0]["category"] == "metadata"
    assert meta_actions[0]["affected_pages_count"] == 2  # Grouped across p1 and p2

    first_act_id = meta_actions[0]["id"]

    # 5. Pagination test
    page_res = await client.get(
        f"/api/v1/seo/actions?project_id={project_id}&skip=0&limit=2"
    )
    assert page_res.status_code == 200
    assert len(page_res.json()["recommendations"]) == 2
    assert page_res.json()["total"] >= 3

    # 6. Update Status & Notes
    patch_res = await client.patch(
        f"/api/v1/seo/actions/{first_act_id}",
        json={"status": "in_progress", "notes": "Assigned to marketing copywriter."},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "in_progress"
    assert patch_res.json()["notes"] == "Assigned to marketing copywriter."

    # 7. Test invalid status validation rejection
    invalid_patch = await client.patch(
        f"/api/v1/seo/actions/{first_act_id}",
        json={"status": "unknown_status_123"},
    )
    assert invalid_patch.status_code == 422

    # 8. Test Bulk Actions & Empty Selection Rejection
    all_acts_res = await client.get(f"/api/v1/seo/actions?project_id={project_id}")
    all_ids = [a["id"] for a in all_acts_res.json()["recommendations"]]

    bulk_res = await client.post(
        "/api/v1/seo/actions/bulk",
        json={"action_ids": all_ids[:2], "status": "fixed", "notes": "Fixed in sprint 4"},
    )
    assert bulk_res.status_code == 200
    assert bulk_res.json()["updated_count"] == 2

    # Empty bulk selection rejection
    empty_bulk = await client.post(
        "/api/v1/seo/actions/bulk",
        json={"action_ids": [], "status": "fixed"},
    )
    assert empty_bulk.status_code == 422

    # 9. Verify Optimization Summary KPIs
    sum_res = await client.get(f"/api/v1/seo/actions/summary/{project_id}")
    assert sum_res.status_code == 200
    sum_data = sum_res.json()
    assert sum_data["total_actions"] >= 3
    assert sum_data["fixed_actions"] >= 2
    assert sum_data["current_seo_score"] == 68
    assert sum_data["potential_seo_score"] <= 100
    assert sum_data["optimization_progress"] > 0
    assert len(sum_data["category_breakdown"]) == 4

    # 10. Test Metadata Optimizer
    title_res = await client.post(
        "/api/v1/seo/optimize/title",
        json={
            "current_title": "Acme",
            "target_url": "https://acme-saas.com/pricing",
            "target_keyword": "SaaS Pricing",
            "brand_name": "Acme",
        },
    )
    assert title_res.status_code == 200
    assert len(title_res.json()["suggestions"]) == 3
    assert title_res.json()["provider"] == "rule_based"

    desc_res = await client.post(
        "/api/v1/seo/optimize/description",
        json={
            "current_description": "",
            "target_url": "https://acme-saas.com/pricing",
            "target_keyword": "SaaS Pricing",
            "brand_name": "Acme",
        },
    )
    assert desc_res.status_code == 200
    assert len(desc_res.json()["suggestions"]) == 3

    # 11. Test Content Optimizer
    content_res = await client.post(
        "/api/v1/seo/optimize/content",
        json={"project_id": project_id, "page_id": p2.id},
    )
    assert content_res.status_code == 200
    c_data = content_res.json()
    assert c_data["word_count"] == 140
    assert c_data["word_count_status"] == "thin"
    assert len(c_data["recommendations"]) >= 2

    # 12. Test Internal Linking Optimizer (Detects orphan page p3)
    links_res = await client.post(
        "/api/v1/seo/optimize/internal-links",
        json={"project_id": project_id, "scan_id": scan1.id},
    )
    assert links_res.status_code == 200
    l_data = links_res.json()
    assert "https://acme-saas.com/blog/getting-started" in l_data["orphan_pages"]

    # 13. Simulate Re-Audit #2 and Verify Optimization History Comparison
    scan2 = Scan(
        project_id=project_id,
        target_url="https://acme-saas.com",
        status=ScanStatus.COMPLETED.value,
        progress=100,
        overall_score=84,  # Score improved from 68 to 84 (+16 pts)
        technical_score=80,
        indexability_score=85,
        metadata_score=88,
        links_score=85,
        pages_crawled=3,
        issues_count=1,
    )
    db_session.add(scan2)
    await db_session.commit()
    await db_session.refresh(scan2)

    # In scan2, only 1 issue remains (missing canonical was fixed, meta desc was fixed)
    iss_rem = SeoIssue(
        scan_id=scan2.id,
        page_id=p2.id,
        issue_code="thin_content",
        category=IssueCategory.TECHNICAL.value,
        severity=IssueSeverity.HIGH.value,
        title="Thin Content",
        description="Page has 140 words.",
        recommendation="Expand substantive body text.",
    )
    db_session.add(iss_rem)
    await db_session.commit()

    # Trigger audit comparison
    from app.services.seo.recommendations.history_service import OptimizationHistoryService
    history_record = await OptimizationHistoryService.record_audit_comparison(
        db_session, project_id=project_id, current_scan_id=scan2.id
    )
    assert history_record is not None
    assert history_record.previous_score == 68
    assert history_record.current_score == 84
    assert history_record.score_change == 16
    assert history_record.issues_resolved >= 2

    # Verify history API endpoint
    history_res = await client.get(f"/api/v1/seo/optimization-history/{project_id}")
    assert history_res.status_code == 200
    h_data = history_res.json()
    assert h_data["total"] >= 1
    assert h_data["comparisons"][0]["score_change"] == 16
    assert h_data["comparisons"][0]["issues_resolved"] >= 2
