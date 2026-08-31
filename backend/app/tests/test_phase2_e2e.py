import asyncio
import pytest
from httpx import AsyncClient
from app.models.seo_page import SeoPage, SeoPageImage, SeoPageLink
from app.models.seo_issue import SeoIssue
from app.services.seo.analyzer import SeoAnalyzer
from app.services.seo.scoring import SeoScoringEngine


@pytest.mark.asyncio
async def test_phase2_scan_results_and_endpoints(client: AsyncClient, db_session):
    """
    Tests Phase 2 API endpoints:
    /api/v1/scans/{id}/results
    /api/v1/scans/{id}/pages
    /api/v1/scans/{id}/pages/{page_id}
    /api/v1/scans/{id}/issues
    """
    # 1. Create a project
    p_res = await client.post("/api/v1/projects", json={"name": "Cloudflare Dev", "domain": "cloudflare.com"})
    assert p_res.status_code == 201
    project_id = p_res.json()["id"]

    # 2. Trigger scan
    s_res = await client.post(f"/api/v1/projects/{project_id}/scans", json={"scan_type": "full_audit"})
    assert s_res.status_code == 201
    scan_id = s_res.json()["id"]

    # 3. Seed test crawled pages into database for this scan
    page1 = SeoPage(
        scan_id=scan_id,
        url="https://cloudflare.com/",
        final_url="https://cloudflare.com/",
        status_code=200,
        content_type="text/html",
        title="Cloudflare — The Web Performance & Security Company",
        meta_description="Cloudflare connects and protects millions of internet properties.",
        canonical_url="https://cloudflare.com/",
        h1_count=1,
        h2_count=3,
        word_count=450,
        response_time=0.35,
        content_length=15420,
        is_indexable=True,
        is_internal=True,
        crawl_depth=0,
        render_method="http",
    )
    page1.images.append(SeoPageImage(src="https://cloudflare.com/logo.svg", alt="Cloudflare Logo"))
    page1.images.append(SeoPageImage(src="https://cloudflare.com/banner.png", alt=None)) # Missing ALT
    page1.links.append(SeoPageLink(target_url="https://cloudflare.com/products", anchor_text="Products", link_type="internal"))

    page2 = SeoPage(
        scan_id=scan_id,
        url="https://cloudflare.com/products",
        final_url="https://cloudflare.com/products",
        status_code=200,
        content_type="text/html",
        title="Cloudflare Products — Edge & Network Services",
        meta_description=None, # Missing description
        canonical_url=None, # Missing canonical
        h1_count=0, # Missing H1
        h2_count=2,
        word_count=320,
        response_time=0.42,
        content_length=12100,
        is_indexable=True,
        is_internal=True,
        crawl_depth=1,
        render_method="http",
    )

    db_session.add(page1)
    db_session.add(page2)
    await db_session.commit()
    await db_session.refresh(page1)
    await db_session.refresh(page2)

    # 4. Run Analyzer and Scoring
    issues = await SeoAnalyzer.analyze_scan(
        db=db_session,
        scan_id=scan_id,
        project_domain="cloudflare.com",
        pages=[page1, page2],
    )
    assert len(issues) >= 3

    scores = SeoScoringEngine.calculate_scores(total_pages=2, issues=issues)

    # Update scan with scores
    from app.models.scan import Scan
    scan_obj = await db_session.get(Scan, scan_id)
    scan_obj.overall_score = scores["overall_score"]
    scan_obj.technical_score = scores["technical_score"]
    scan_obj.indexability_score = scores["indexability_score"]
    scan_obj.metadata_score = scores["metadata_score"]
    scan_obj.links_score = scores["links_score"]
    scan_obj.score_breakdown = scores["score_breakdown"]
    scan_obj.pages_crawled = 2
    scan_obj.pages_discovered = 2
    scan_obj.issues_count = len(issues)
    scan_obj.status = "completed"
    await db_session.commit()

    # 5. Query GET /api/v1/scans/{scan_id}/results
    res_api = await client.get(f"/api/v1/scans/{scan_id}/results")
    assert res_api.status_code == 200
    res_data = res_api.json()
    assert res_data["overall_score"] == scores["overall_score"]
    assert res_data["score_label"] is not None
    assert "technical_score" in res_data
    assert res_data["pages_crawled"] == 2

    # 6. Query GET /api/v1/scans/{scan_id}/pages
    pages_api = await client.get(f"/api/v1/scans/{scan_id}/pages?page=1&page_size=10")
    assert pages_api.status_code == 200
    pages_data = pages_api.json()
    assert pages_data["total"] == 2
    assert len(pages_data["pages"]) == 2

    # 7. Query GET /api/v1/scans/{scan_id}/pages/{page_id}
    p_detail_api = await client.get(f"/api/v1/scans/{scan_id}/pages/{page1.id}")
    assert p_detail_api.status_code == 200
    p_detail = p_detail_api.json()
    assert p_detail["id"] == page1.id
    assert len(p_detail["images"]) == 2
    assert len(p_detail["links"]) == 1

    # 8. Query GET /api/v1/scans/{scan_id}/issues
    issues_api = await client.get(f"/api/v1/scans/{scan_id}/issues?page=1&page_size=10")
    assert issues_api.status_code == 200
    issues_data = issues_api.json()
    assert issues_data["total"] >= 3
    assert "severity_counts" in issues_data
