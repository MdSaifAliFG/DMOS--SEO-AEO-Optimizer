from __future__ import annotations
import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.aeo import AeoProject
from app.models.geo import (
    GeoAlert,
    GeoAnalysis,
    GeoAnalysisStatus,
    GeoAnswer,
    GeoBrandProfile,
    GeoCitation,
    GeoEntity,
    GeoIssue,
    GeoMonitoringSchedule,
    GeoProject,
    GeoRecommendation,
    GeoRecommendationStatus,
    GeoVerificationStatus,
)
from app.models.project import Project as SeoProject
from app.schemas.geo import (
    GeoActionSummaryResponse,
    GeoAnalysisResponse,
    GeoAnalysisTriggerRequest,
    GeoAnswerListResponse,
    GeoAnswerResponse,
    GeoBrandProfileCreate,
    GeoBrandProfileResponse,
    GeoBrandProfileUpdate,
    GeoCitationListResponse,
    GeoCitationResponse,
    GeoCompetitorResponse,
    GeoDashboardResponse,
    GeoEntityListResponse,
    GeoEntityResponse,
    GeoHistoryResponse,
    GeoIssueListResponse,
    GeoIssueResponse,
    GeoMonitoringScheduleResponse,
    GeoMonitoringScheduleUpdate,
    GeoOptimizeAnswerRequest,
    GeoOptimizeCommercialRequest,
    GeoOptimizeComparisonRequest,
    GeoOptimizeContentRequest,
    GeoOptimizeEntityRequest,
    GeoOptimizeResponse,
    GeoProjectCreate,
    GeoProjectListResponse,
    GeoProjectResponse,
    GeoProjectUpdate,
    GeoQuestionCreate,
    GeoQuestionGenerateRequest,
    GeoQuestionListResponse,
    GeoQuestionResponse,
    GeoRecommendationBulkRequest,
    GeoRecommendationListResponse,
    GeoRecommendationResponse,
    GeoRecommendationUpdateRequest,
    GeoReportGenerateRequest,
    GeoReportResponse,
    GeoVisibilityResponse,
    UnifiedSearchIntelligenceResponse,
)
from app.services.geo.analysis_runner import geo_analysis_runner
from app.services.geo.geo_service import GeoService
from app.services.geo.scoring_engine import GEOScoringEngine

router = APIRouter(prefix="/geo", tags=["GEO Engine"])


# --- Projects ---
@router.post("/projects", response_model=GeoProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_geo_project(
    data: GeoProjectCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new GEO Project with default brand profile and 18-category questions."""
    svc = GeoService(db)
    project = await svc.create_project(data)
    return project


@router.get("/projects", response_model=GeoProjectListResponse)
async def list_geo_projects(
    db: AsyncSession = Depends(get_db),
):
    """List all accessible GEO Projects."""
    svc = GeoService(db)
    projects = await svc.list_projects()
    return {"projects": projects, "total": len(projects)}


@router.get("/projects/{project_id}", response_model=GeoProjectResponse)
async def get_geo_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve details of a single GEO Project."""
    svc = GeoService(db)
    project = await svc.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="GEO project not found")
    return project


@router.patch("/projects/{project_id}", response_model=GeoProjectResponse)
async def update_geo_project(
    project_id: str,
    data: GeoProjectUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update settings or metadata of a GEO Project."""
    svc = GeoService(db)
    project = await svc.update_project(project_id, data)
    if not project:
        raise HTTPException(status_code=404, detail="GEO project not found")
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_geo_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a GEO Project and all associated records."""
    svc = GeoService(db)
    ok = await svc.delete_project(project_id)
    if not ok:
        raise HTTPException(status_code=404, detail="GEO project not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# --- Brand Profile ---
@router.get("/projects/{project_id}/brand-profile", response_model=GeoBrandProfileResponse)
async def get_geo_brand_profile(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get canonical GEO knowledge profile."""
    svc = GeoService(db)
    bp = await svc.get_brand_profile(project_id)
    if not bp:
        raise HTTPException(status_code=404, detail="Brand profile not found for project")
    return bp


@router.put("/projects/{project_id}/brand-profile", response_model=GeoBrandProfileResponse)
async def update_geo_brand_profile(
    project_id: str,
    data: GeoBrandProfileUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update canonical GEO knowledge profile."""
    svc = GeoService(db)
    bp = await svc.update_brand_profile(project_id, data)
    return bp


# --- Analysis Execution ---
@router.post("/analyze", response_model=GeoAnalysisResponse, status_code=status.HTTP_202_ACCEPTED)
async def trigger_geo_analysis(
    req: GeoAnalysisTriggerRequest,
    db: AsyncSession = Depends(get_db),
):
    """Trigger background end-to-end GEO analysis."""
    svc = GeoService(db)
    project = await svc.get_project(req.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="GEO project not found")

    analysis = GeoAnalysis(
        project_id=req.project_id,
        status=GeoAnalysisStatus.QUEUED.value,
        progress=0,
        current_step="Queued for analysis...",
        providers=req.providers or ["openai", "perplexity", "gemini"],
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)

    # Spawn async background runner
    asyncio.create_task(
        geo_analysis_runner.run_analysis(
            analysis_id=analysis.id,
            project_id=req.project_id,
            providers=req.providers,
            crawling_enabled=req.crawling_enabled,
            question_limit=req.question_count,
        )
    )

    return analysis


@router.get("/analysis/{analysis_id}", response_model=GeoAnalysisResponse)
async def get_geo_analysis_status(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Check progress and status of a GEO background analysis."""
    analysis = await db.get(GeoAnalysis, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis job not found")
    return analysis


# --- Dashboard ---
@router.get("/dashboard/{project_id}", response_model=GeoDashboardResponse)
async def get_geo_dashboard(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get aggregated dashboard metrics for a GEO Project."""
    svc = GeoService(db)
    dash = await svc.get_dashboard(project_id)
    if not dash:
        raise HTTPException(status_code=404, detail="GEO project not found")
    return dash


# --- Questions ---
@router.get("/questions", response_model=GeoQuestionListResponse)
async def list_geo_questions(
    project_id: str = Query(..., description="GEO Project ID"),
    category: Optional[str] = Query(None),
    intent: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List discovery questions generated for a GEO Project."""
    svc = GeoService(db)
    questions = await svc.list_questions(project_id, category, intent, search)
    return {"questions": questions, "total": len(questions)}


@router.post("/questions/generate", response_model=List[GeoQuestionResponse], status_code=status.HTTP_201_CREATED)
async def generate_geo_questions(
    req: GeoQuestionGenerateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate discovery questions across 18 generative categories."""
    svc = GeoService(db)
    generated = await svc.generate_questions(req.project_id, req.categories, req.count_per_category)
    return generated


# --- Answers ---
@router.get("/answers", response_model=GeoAnswerListResponse)
async def list_geo_answers(
    project_id: str = Query(..., description="GEO Project ID"),
    provider: Optional[str] = Query(None),
    recommended_only: bool = Query(False),
    db: AsyncSession = Depends(get_db),
):
    """List AI answers and recommendations."""
    svc = GeoService(db)
    answers = await svc.list_answers(project_id, provider, recommended_only)
    return {"answers": answers, "total": len(answers)}


@router.get("/answers/{answer_id}", response_model=GeoAnswerResponse)
async def get_geo_answer(
    answer_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get detailed analysis of a single AI answer."""
    svc = GeoService(db)
    ans = await svc.get_answer(answer_id)
    if not ans:
        raise HTTPException(status_code=404, detail="Answer not found")
    return ans


# --- Citations ---
@router.get("/citations", response_model=GeoCitationListResponse)
async def list_geo_citations(
    project_id: str = Query(..., description="GEO Project ID"),
    source_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List all extracted citations with source classification."""
    svc = GeoService(db)
    citations = await svc.list_citations(project_id, source_type)
    metrics = svc.citation_extractor.calculate_citation_metrics(
        [{"source_type": c.source_type, "domain": c.domain} for c in citations],
        total_answers=max(1, len(citations)),
    )
    return {
        "citations": citations,
        "total": len(citations),
        "own_citation_rate": metrics["own_citation_rate"],
        "competitor_citation_rate": metrics["competitor_citation_rate"],
        "third_party_citation_rate": metrics["third_party_citation_rate"],
        "citation_diversity": metrics["citation_diversity"],
    }


# --- Entities ---
@router.get("/entities", response_model=GeoEntityListResponse)
async def list_geo_entities(
    project_id: str = Query(..., description="GEO Project ID"),
    entity_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List recognized knowledge graph entities."""
    svc = GeoService(db)
    entities = await svc.list_entities(project_id, entity_type)
    proj = await svc.get_project(project_id)
    consistency_score = proj.consistency_score if proj and proj.consistency_score is not None else 80
    return {
        "entities": entities,
        "total": len(entities),
        "consistency_score": consistency_score,
    }


# --- Competitors ---
@router.get("/competitors/{project_id}", response_model=GeoCompetitorResponse)
async def get_geo_competitors(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get competitor intelligence, share of voice, and competitive gap."""
    svc = GeoService(db)
    return await svc.get_competitors_overview(project_id)


# --- Visibility ---
@router.get("/visibility/{project_id}", response_model=GeoVisibilityResponse)
async def get_geo_visibility(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get visibility overview, provider parity, and history."""
    svc = GeoService(db)
    return await svc.get_visibility_overview(project_id)


@router.get("/history/{project_id}", response_model=GeoHistoryResponse)
async def get_geo_history(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get historical snapshots, change events, and verified uplift history."""
    svc = GeoService(db)
    return await svc.get_history(project_id)


# --- Issues ---
@router.get("/issues", response_model=GeoIssueListResponse)
async def list_geo_issues(
    project_id: str = Query(..., description="GEO Project ID"),
    severity: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List prioritized GEO issues."""
    svc = GeoService(db)
    issues = await svc.list_issues(project_id, severity, category, status)
    return {"issues": issues, "total": len(issues)}


@router.get("/issues/{project_id}/export-csv")
async def export_geo_issues_csv(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Export issues as CSV."""
    svc = GeoService(db)
    csv_content = await svc.export_issues_csv(project_id)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=geo_issues_{project_id}.csv"},
    )


# --- Action Center ---
@router.get("/actions", response_model=GeoRecommendationListResponse)
async def list_geo_actions(
    project_id: str = Query(..., description="GEO Project ID"),
    status: Optional[str] = Query(None),
    priority_level: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List actionable recommendations."""
    svc = GeoService(db)
    recs = await svc.list_recommendations(project_id, status, priority_level)
    return {"recommendations": recs, "total": len(recs)}


@router.get("/actions/{action_id}", response_model=GeoRecommendationResponse)
async def get_geo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get single action recommendation."""
    svc = GeoService(db)
    rec = await svc.get_recommendation(action_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Action not found")
    return rec


@router.patch("/actions/{action_id}", response_model=GeoRecommendationResponse)
async def update_geo_action(
    action_id: str,
    data: GeoRecommendationUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update action status or notes."""
    svc = GeoService(db)
    rec = await svc.update_recommendation(action_id, status=data.status, notes=data.notes)
    if not rec:
        raise HTTPException(status_code=404, detail="Action not found")
    return rec


@router.post("/actions/{action_id}/verify", response_model=GeoRecommendationResponse)
async def verify_geo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Verify implemented action and record metric uplift in history."""
    svc = GeoService(db)
    rec = await svc.verify_recommendation(action_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Action not found")
    return rec


@router.post("/actions/{action_id}/ignore", response_model=GeoRecommendationResponse)
async def ignore_geo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Ignore an action item."""
    svc = GeoService(db)
    rec = await svc.update_recommendation(action_id, status=GeoRecommendationStatus.IGNORED.value)
    if not rec:
        raise HTTPException(status_code=404, detail="Action not found")
    return rec


@router.post("/actions/bulk", response_model=Dict[str, int])
async def bulk_update_geo_actions(
    req: GeoRecommendationBulkRequest,
    project_id: str = Query(..., description="GEO Project ID"),
    db: AsyncSession = Depends(get_db),
):
    """Apply bulk status updates to recommendations."""
    svc = GeoService(db)
    count = await svc.bulk_update_recommendations(project_id, req.recommendation_ids, req.action)
    return {"updated": count}


@router.get("/actions/summary/{project_id}", response_model=GeoActionSummaryResponse)
async def get_geo_actions_summary(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get high-level summary of Action Center status counts."""
    svc = GeoService(db)
    return await svc.get_action_summary(project_id)


# --- Optimization Studios ---
@router.post("/optimize/content", response_model=GeoOptimizeResponse)
async def optimize_geo_content(
    req: GeoOptimizeContentRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate structured headings, direct definitions, and authority links."""
    svc = GeoService(db)
    proj = await svc.get_project(req.project_id)
    brand = (proj.brand_name or proj.name) if proj else "The Brand"
    return svc.opt_service.optimize_content(
        brand_name=brand,
        topic=req.topic,
        content_type=req.content_type,
        existing_content=req.existing_content,
    )


@router.post("/optimize/answer", response_model=GeoOptimizeResponse)
async def optimize_geo_direct_answer(
    req: GeoOptimizeAnswerRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate concise 40-80 word direct answer snippet."""
    svc = GeoService(db)
    proj = await svc.get_project(req.project_id)
    brand = (proj.brand_name or proj.name) if proj else "The Brand"
    return svc.opt_service.optimize_direct_answer(
        brand_name=brand,
        question=req.question,
        context=req.context,
        target_words=req.target_word_count,
    )


@router.post("/optimize/entity", response_model=GeoOptimizeResponse)
async def optimize_geo_entity(
    req: GeoOptimizeEntityRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate JSON-LD schema markup with sameAs and entity relations."""
    svc = GeoService(db)
    proj = await svc.get_project(req.project_id)
    brand = (proj.brand_name or proj.name) if proj else "The Brand"
    domain = proj.domain if proj else "example.com"
    return svc.opt_service.optimize_entity(
        brand_name=brand,
        entity_name=req.entity_name,
        entity_type=req.entity_type,
        domain=domain,
    )


@router.post("/optimize/comparison", response_model=GeoOptimizeResponse)
async def optimize_geo_comparison(
    req: GeoOptimizeComparisonRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate side-by-side comparison structure and alternative analysis."""
    svc = GeoService(db)
    proj = await svc.get_project(req.project_id)
    brand = (proj.brand_name or proj.name) if proj else "The Brand"
    return svc.opt_service.optimize_comparison(
        brand_name=brand,
        competitor_name=req.competitor_name,
        category=req.category,
    )


@router.post("/optimize/commercial", response_model=GeoOptimizeResponse)
async def optimize_geo_commercial(
    req: GeoOptimizeCommercialRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate pricing table architecture and buyer intent structures."""
    svc = GeoService(db)
    proj = await svc.get_project(req.project_id)
    brand = (proj.brand_name or proj.name) if proj else "The Brand"
    return svc.opt_service.optimize_commercial(
        brand_name=brand,
        pricing_url=req.pricing_page_url,
        product_tier=req.product_tier,
    )


# --- Monitoring & Alerts ---
@router.get("/monitoring/{project_id}", response_model=GeoMonitoringScheduleResponse)
async def get_geo_monitoring_schedule(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get monitoring schedule configuration."""
    res = await db.execute(
        select(GeoMonitoringSchedule).where(GeoMonitoringSchedule.project_id == project_id)
    )
    sched = res.scalar_one_or_none()
    if not sched:
        sched = GeoMonitoringSchedule(
            project_id=project_id,
            frequency="weekly",
            enabled=True,
            providers=["openai", "perplexity", "gemini"],
            question_limit=18,
        )
        db.add(sched)
        await db.commit()
        await db.refresh(sched)
    return sched


@router.patch("/monitoring/{project_id}", response_model=GeoMonitoringScheduleResponse)
async def update_geo_monitoring_schedule(
    project_id: str,
    data: GeoMonitoringScheduleUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update monitoring schedule frequency and providers."""
    res = await db.execute(
        select(GeoMonitoringSchedule).where(GeoMonitoringSchedule.project_id == project_id)
    )
    sched = res.scalar_one_or_none()
    if not sched:
        raise HTTPException(status_code=404, detail="Monitoring schedule not found")

    if data.frequency is not None:
        sched.frequency = data.frequency
    if data.enabled is not None:
        sched.enabled = data.enabled
    if data.providers is not None:
        sched.providers = data.providers
    if data.question_limit is not None:
        sched.question_limit = data.question_limit

    sched.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(sched)
    return sched


@router.get("/alerts", response_model=List[Dict[str, Any]])
async def list_geo_alerts(
    project_id: str = Query(..., description="GEO Project ID"),
    db: AsyncSession = Depends(get_db),
):
    """List system alerts for a GEO Project."""
    res = await db.execute(
        select(GeoAlert)
        .where(GeoAlert.project_id == project_id)
        .order_by(desc(GeoAlert.detected_at))
    )
    alerts = list(res.scalars().all())
    return [
        {
            "id": a.id,
            "project_id": a.project_id,
            "alert_type": a.alert_type,
            "title": a.title,
            "description": a.description,
            "severity": a.severity,
            "status": a.status,
            "provider": a.provider,
            "detected_at": a.detected_at,
        }
        for a in alerts
    ]


# --- Reports ---
@router.get("/reports/{project_id}", response_model=GeoReportResponse)
async def get_geo_report(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Generate executive summary GEO report."""
    svc = GeoService(db)
    report = await svc.generate_report(project_id)
    if not report:
        raise HTTPException(status_code=404, detail="Project not found")
    return report


@router.post("/reports", response_model=GeoReportResponse)
async def generate_custom_geo_report(
    req: GeoReportGenerateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate custom executive GEO report."""
    svc = GeoService(db)
    report = await svc.generate_report(req.project_id)
    if not report:
        raise HTTPException(status_code=404, detail="Project not found")
    return report


# --- Unified Search Intelligence (SEO + AEO + GEO) ---
@router.get("/unified-intelligence/{project_id}", response_model=UnifiedSearchIntelligenceResponse)
async def get_unified_search_intelligence(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Computes unified search index across 3 pillars:
    SEO (40%), AEO (30%), GEO (30%).
    """
    svc = GeoService(db)
    geo_proj = await svc.get_project(project_id)
    if not geo_proj:
        raise HTTPException(status_code=404, detail="GEO project not found")

    domain = geo_proj.domain

    # Check for corresponding SEO project by domain
    seo_res = await db.execute(select(SeoProject).where(SeoProject.domain == domain))
    seo_proj = seo_res.scalar_one_or_none()
    seo_score = None
    if seo_proj:
        from app.models.scan import Scan
        scan_res = await db.execute(
            select(Scan)
            .where(Scan.project_id == seo_proj.id)
            .order_by(desc(Scan.created_at))
            .limit(1)
        )
        scan = scan_res.scalar_one_or_none()
        if scan and scan.overall_score is not None:
            seo_score = scan.overall_score

    # Check for corresponding AEO project by domain
    aeo_res = await db.execute(select(AeoProject).where(AeoProject.domain == domain))
    aeo_proj = aeo_res.scalar_one_or_none()
    aeo_score = aeo_proj.aeo_score if aeo_proj else None

    geo_score = geo_proj.geo_score

    unified_calc = GEOScoringEngine.calculate_unified_search_intelligence(
        seo_score=seo_score,
        aeo_score=aeo_score,
        geo_score=geo_score,
    )

    return {
        "project_id": project_id,
        "brand_name": geo_proj.brand_name or geo_proj.name,
        "domain": geo_proj.domain,
        "seo_score": seo_score,
        "aeo_score": aeo_score,
        "geo_score": geo_score,
        "unified_score": unified_calc.get("unified_score"),
        "formula": "SEO (40%) + AEO (30%) + GEO (30%)",
        "has_sufficient_data": unified_calc.get("has_sufficient_data", False),
        "executive_brief": unified_calc.get("executive_brief", ""),
    }
