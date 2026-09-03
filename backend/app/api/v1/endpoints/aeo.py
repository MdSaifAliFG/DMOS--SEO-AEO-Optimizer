from __future__ import annotations
import csv
from datetime import datetime, timezone
import io
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.aeo import (
    AeoActionBulkUpdateRequest,
    AeoActionGenerateRequest,
    AeoActionSummaryResponse,
    AeoActionUpdateRequest,
    AeoAnalysisResponse,
    AeoAnalysisTriggerRequest,
    AeoAnswerListResponse,
    AeoAnswerResponse,
    AeoCitationCreate,
    AeoCitationListResponse,
    AeoCitationResponse,
    AeoContentOptimizeRequest,
    AeoDashboardSummaryResponse,
    AeoDirectAnswerOptimizeRequest,
    AeoEntityCreate,
    AeoEntityListResponse,
    AeoEntityResponse,
    AeoProjectCreate,
    AeoProjectGapRequest,
    AeoProjectListResponse,
    AeoProjectResponse,
    AeoProjectUpdate,
    AeoQuestionCreate,
    AeoQuestionGenerateRequest,
    AeoQuestionListResponse,
    AeoQuestionResponse,
    AeoQuestionUpdate,
    AeoRecommendationListResponse,
    AeoRecommendationResponse,
    AeoVisibilityResponse,
)
from app.services.aeo.aeo_service import AeoService

router = APIRouter(prefix="/aeo", tags=["AEO Optimization"])


# --- Dashboard ---
@router.get(
    "/dashboard",
    response_model=AeoDashboardSummaryResponse,
    summary="Get AEO dashboard aggregated KPIs and activity",
)
async def get_aeo_dashboard(
    project_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AeoDashboardSummaryResponse:
    data = await AeoService.get_dashboard_summary(db, project_id=project_id)
    return AeoDashboardSummaryResponse(**data)


@router.get(
    "/dashboard/{project_id}",
    response_model=AeoDashboardSummaryResponse,
    summary="Get AEO dashboard summary for a specific project",
)
async def get_aeo_project_dashboard(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoDashboardSummaryResponse:
    data = await AeoService.get_dashboard_summary(db, project_id=project_id)
    return AeoDashboardSummaryResponse(**data)


# --- Projects ---
@router.get(
    "/projects",
    response_model=AeoProjectListResponse,
    summary="List AEO optimization projects",
)
async def list_aeo_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AeoProjectListResponse:
    projects, total = await AeoService.get_projects(
        db, skip=skip, limit=limit, search=search
    )
    responses = []
    for p in projects:
        responses.append(
            AeoProjectResponse(
                id=p.id,
                user_id=p.user_id,
                name=p.name,
                domain=p.domain,
                brand_name=p.brand_name or p.name,
                brand_aliases=p.brand_aliases or [],
                industry=p.industry,
                country=p.country,
                target_audience=p.target_audience,
                target_language=p.target_language or "en",
                competitors=p.competitors or [],
                description=p.description,
                is_active=p.is_active,
                aeo_score=p.aeo_score,
                score_label=p.score_label,
                mention_score=p.mention_score,
                citation_score=p.citation_score,
                position_score=p.position_score,
                coverage_score=p.coverage_score,
                last_analyzed_at=p.last_analyzed_at,
                questions_count=len(p.questions) if p.questions else 0,
                citations_count=len(p.citations) if p.citations else 0,
                settings=p.settings or {},
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
        )
    return AeoProjectListResponse(projects=responses, total=total)


@router.post(
    "/projects",
    response_model=AeoProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new AEO project",
)
async def create_aeo_project(
    data: AeoProjectCreate,
    db: AsyncSession = Depends(get_db),
) -> AeoProjectResponse:
    try:
        project = await AeoService.create_project(db, data)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    return AeoProjectResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        domain=project.domain,
        brand_name=project.brand_name,
        brand_aliases=project.brand_aliases or [],
        industry=project.industry,
        country=project.country,
        target_audience=project.target_audience,
        target_language=project.target_language,
        competitors=project.competitors or [],
        description=project.description,
        is_active=project.is_active,
        aeo_score=project.aeo_score,
        score_label=project.score_label,
        mention_score=project.mention_score,
        citation_score=project.citation_score,
        position_score=project.position_score,
        coverage_score=project.coverage_score,
        last_analyzed_at=project.last_analyzed_at,
        questions_count=len(project.questions) if project.questions else 0,
        citations_count=len(project.citations) if project.citations else 0,
        settings=project.settings or {},
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.get(
    "/projects/{project_id}",
    response_model=AeoProjectResponse,
    summary="Get AEO project details by ID",
)
async def get_aeo_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoProjectResponse:
    project = await AeoService.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AEO Project '{project_id}' not found",
        )
    return AeoProjectResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        domain=project.domain,
        brand_name=project.brand_name,
        brand_aliases=project.brand_aliases or [],
        industry=project.industry,
        country=project.country,
        target_audience=project.target_audience,
        target_language=project.target_language,
        competitors=project.competitors or [],
        description=project.description,
        is_active=project.is_active,
        aeo_score=project.aeo_score,
        score_label=project.score_label,
        mention_score=project.mention_score,
        citation_score=project.citation_score,
        position_score=project.position_score,
        coverage_score=project.coverage_score,
        last_analyzed_at=project.last_analyzed_at,
        questions_count=len(project.questions) if project.questions else 0,
        citations_count=len(project.citations) if project.citations else 0,
        settings=project.settings or {},
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.patch(
    "/projects/{project_id}",
    response_model=AeoProjectResponse,
    summary="Update AEO project metadata and competitor settings",
)
async def update_aeo_project(
    project_id: str,
    data: AeoProjectUpdate,
    db: AsyncSession = Depends(get_db),
) -> AeoProjectResponse:
    try:
        project = await AeoService.update_project(db, project_id, data)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AEO Project '{project_id}' not found",
        )
    return AeoProjectResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        domain=project.domain,
        brand_name=project.brand_name,
        brand_aliases=project.brand_aliases or [],
        industry=project.industry,
        country=project.country,
        target_audience=project.target_audience,
        target_language=project.target_language,
        competitors=project.competitors or [],
        description=project.description,
        is_active=project.is_active,
        aeo_score=project.aeo_score,
        score_label=project.score_label,
        mention_score=project.mention_score,
        citation_score=project.citation_score,
        position_score=project.position_score,
        coverage_score=project.coverage_score,
        last_analyzed_at=project.last_analyzed_at,
        questions_count=len(project.questions) if project.questions else 0,
        citations_count=len(project.citations) if project.citations else 0,
        settings=project.settings or {},
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.delete(
    "/projects/{project_id}",
    summary="Delete AEO project",
)
async def delete_aeo_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    success = await AeoService.delete_project(db, project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AEO Project '{project_id}' not found",
        )
    return {"success": True, "message": "AEO Project deleted successfully"}


# --- Analysis Lifecycle ---
@router.post(
    "/projects/{project_id}/analyze",
    response_model=AeoAnalysisResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger asynchronous AEO synthesis and visibility analysis",
)
async def trigger_aeo_analysis(
    project_id: str,
    data: Optional[AeoAnalysisTriggerRequest] = None,
    db: AsyncSession = Depends(get_db),
) -> AeoAnalysisResponse:
    engines = data.engines if data else None
    allow_test_mode = data.allow_test_mode if data else False
    try:
        analysis = await AeoService.trigger_analysis(
            db, project_id, engines=engines, allow_test_mode=allow_test_mode
        )
        return AeoAnalysisResponse.model_validate(analysis)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )


@router.get(
    "/analysis/{analysis_id}",
    response_model=AeoAnalysisResponse,
    summary="Get status, progress, and logs of an AEO analysis job",
)
async def get_aeo_analysis_status(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoAnalysisResponse:
    analysis = await AeoService.get_analysis(db, analysis_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis job '{analysis_id}' not found",
        )
    return AeoAnalysisResponse.model_validate(analysis)


# --- Questions ---
@router.get(
    "/questions",
    response_model=AeoQuestionListResponse,
    summary="List tracked AI questions / prompts",
)
async def list_aeo_questions(
    project_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    intent: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    visibility_status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AeoQuestionListResponse:
    questions, total = await AeoService.get_questions(
        db,
        project_id=project_id,
        skip=skip,
        limit=limit,
        search=search,
        intent=intent,
        category=category,
        visibility_status=visibility_status,
    )
    return AeoQuestionListResponse(
        questions=[AeoQuestionResponse.model_validate(q) for q in questions],
        total=total,
    )


@router.post(
    "/questions",
    response_model=AeoQuestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new tracked question/prompt",
)
async def create_aeo_question(
    data: AeoQuestionCreate,
    db: AsyncSession = Depends(get_db),
) -> AeoQuestionResponse:
    question = await AeoService.create_question(db, data)
    return AeoQuestionResponse.model_validate(question)


@router.patch(
    "/questions/{question_id}",
    response_model=AeoQuestionResponse,
    summary="Update a tracked question",
)
async def update_aeo_question(
    question_id: str,
    data: AeoQuestionUpdate,
    db: AsyncSession = Depends(get_db),
) -> AeoQuestionResponse:
    q = await AeoService.update_question(db, question_id, data)
    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question '{question_id}' not found",
        )
    return AeoQuestionResponse.model_validate(q)


@router.delete(
    "/questions/{question_id}",
    summary="Delete a tracked question",
)
async def delete_aeo_question(
    question_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    success = await AeoService.delete_question(db, question_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question '{question_id}' not found",
        )
    return {"success": True, "message": "Question deleted successfully"}


@router.post(
    "/questions/generate",
    response_model=AeoQuestionListResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate high-intent prompt questions deterministically for project",
)
async def generate_aeo_questions(
    data: AeoQuestionGenerateRequest,
    db: AsyncSession = Depends(get_db),
) -> AeoQuestionListResponse:
    try:
        created = await AeoService.generate_and_save_questions(
            db, project_id=data.project_id, max_questions=data.max_questions
        )
        return AeoQuestionListResponse(
            questions=[AeoQuestionResponse.model_validate(q) for q in created],
            total=len(created),
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )


# --- Answers ---
@router.get(
    "/answers",
    response_model=AeoAnswerListResponse,
    summary="List collected AI answers across engines",
)
async def list_aeo_answers(
    project_id: Optional[str] = Query(None),
    question_id: Optional[str] = Query(None),
    engine: Optional[str] = Query(None),
    brand_mentioned: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> AeoAnswerListResponse:
    answers, total = await AeoService.get_answers(
        db,
        project_id=project_id,
        question_id=question_id,
        engine=engine,
        brand_mentioned=brand_mentioned,
        skip=skip,
        limit=limit,
    )
    responses = []
    for a in answers:
        q_text = a.question.question_text if a.question else None
        responses.append(
            AeoAnswerResponse(
                id=a.id,
                project_id=a.project_id,
                question_id=a.question_id,
                analysis_id=a.analysis_id,
                engine=a.engine,
                model=a.model,
                answer_text=a.answer_text,
                brand_mentioned=a.brand_mentioned,
                brand_position=a.brand_position,
                mention_snippets=a.mention_snippets or [],
                competitor_mentions=a.competitor_mentions or [],
                citations_count=a.citations_count,
                latency_ms=a.latency_ms,
                token_usage=a.token_usage or {},
                status=a.status,
                error_message=a.error_message,
                created_at=a.created_at,
                question_text=q_text,
            )
        )
    return AeoAnswerListResponse(answers=responses, total=total)


@router.get(
    "/answers/{answer_id}",
    response_model=AeoAnswerResponse,
    summary="Get single AI answer details",
)
async def get_aeo_answer(
    answer_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoAnswerResponse:
    a = await AeoService.get_answer(db, answer_id)
    if not a:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Answer '{answer_id}' not found",
        )
    q_text = a.question.question_text if a.question else None
    return AeoAnswerResponse(
        id=a.id,
        project_id=a.project_id,
        question_id=a.question_id,
        analysis_id=a.analysis_id,
        engine=a.engine,
        model=a.model,
        answer_text=a.answer_text,
        brand_mentioned=a.brand_mentioned,
        brand_position=a.brand_position,
        mention_snippets=a.mention_snippets or [],
        competitor_mentions=a.competitor_mentions or [],
        citations_count=a.citations_count,
        latency_ms=a.latency_ms,
        token_usage=a.token_usage or {},
        status=a.status,
        error_message=a.error_message,
        created_at=a.created_at,
        question_text=q_text,
    )


# --- Citations ---
@router.get(
    "/citations",
    response_model=AeoCitationListResponse,
    summary="List citation sources extracted from AI engines",
)
async def list_aeo_citations(
    project_id: Optional[str] = Query(None),
    engine: Optional[str] = Query(None),
    citation_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AeoCitationListResponse:
    citations, total = await AeoService.get_citations(
        db,
        project_id=project_id,
        engine=engine,
        citation_type=citation_type,
        skip=skip,
        limit=limit,
        search=search,
    )
    return AeoCitationListResponse(
        citations=[AeoCitationResponse.model_validate(c) for c in citations],
        total=total,
    )


@router.post(
    "/citations",
    response_model=AeoCitationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new citation source manually",
)
async def create_aeo_citation(
    data: AeoCitationCreate,
    db: AsyncSession = Depends(get_db),
) -> AeoCitationResponse:
    citation = await AeoService.create_citation(db, data)
    return AeoCitationResponse.model_validate(citation)


# --- Entities ---
@router.get(
    "/entities",
    response_model=AeoEntityListResponse,
    summary="List tracked brand entities & topics",
)
async def list_aeo_entities(
    project_id: Optional[str] = Query(None),
    entity_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AeoEntityListResponse:
    entities, total = await AeoService.get_entities(
        db,
        project_id=project_id,
        entity_type=entity_type,
        skip=skip,
        limit=limit,
        search=search,
    )
    return AeoEntityListResponse(
        entities=[AeoEntityResponse.model_validate(e) for e in entities],
        total=total,
    )


@router.post(
    "/entities",
    response_model=AeoEntityResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new brand entity",
)
async def create_aeo_entity(
    data: AeoEntityCreate,
    db: AsyncSession = Depends(get_db),
) -> AeoEntityResponse:
    entity = await AeoService.create_entity(db, data)
    return AeoEntityResponse.model_validate(entity)


# --- Visibility & Snapshots ---
@router.get(
    "/visibility/{project_id}",
    response_model=AeoVisibilityResponse,
    summary="Get explainable AEO Visibility Score breakdown and trend",
)
async def get_aeo_visibility(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoVisibilityResponse:
    try:
        data = await AeoService.get_visibility_data(db, project_id)
        return AeoVisibilityResponse(**data)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(val_err),
        )


# ==========================================
# PHASE 6: AEO ACTIONS & OPTIMIZATION CENTER
# ==========================================

@router.get(
    "/actions",
    response_model=AeoRecommendationListResponse,
    summary="List filtered and paginated AEO optimization actions",
)
async def list_aeo_actions(
    project_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> AeoRecommendationListResponse:
    recs, total = await AeoService.get_actions(
        db=db,
        project_id=project_id,
        status=status,
        priority=priority,
        category=category,
        search=search,
        skip=skip,
        limit=limit,
    )
    return AeoRecommendationListResponse(
        recommendations=[AeoRecommendationResponse.model_validate(r) for r in recs],
        total=total,
    )


@router.get(
    "/actions/summary/{project_id}",
    response_model=AeoActionSummaryResponse,
    summary="Get AEO Action Center KPI metrics and potential score summary",
)
async def get_aeo_actions_summary(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoActionSummaryResponse:
    data = await AeoService.get_actions_summary(db, project_id)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' not found",
        )
    return AeoActionSummaryResponse(**data)


@router.post(
    "/actions/generate",
    response_model=AeoRecommendationListResponse,
    summary="Generate deterministic, deduplicated AEO recommendations for a project",
)
async def generate_aeo_actions(
    data: AeoActionGenerateRequest,
    db: AsyncSession = Depends(get_db),
) -> AeoRecommendationListResponse:
    recs = await AeoService.generate_actions_for_project(db, data.project_id)
    return AeoRecommendationListResponse(
        recommendations=[AeoRecommendationResponse.model_validate(r) for r in recs],
        total=len(recs),
    )


@router.get(
    "/actions/{action_id}",
    response_model=AeoRecommendationResponse,
    summary="Get full details for an AEO action item",
)
async def get_aeo_action_detail(
    action_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoRecommendationResponse:
    rec = await AeoService.get_action(db, action_id)
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AEO Action '{action_id}' not found",
        )
    return AeoRecommendationResponse.model_validate(rec)


@router.patch(
    "/actions/{action_id}",
    response_model=AeoRecommendationResponse,
    summary="Update status and notes for an AEO action item",
)
async def update_aeo_action(
    action_id: str,
    data: AeoActionUpdateRequest,
    db: AsyncSession = Depends(get_db),
) -> AeoRecommendationResponse:
    rec = await AeoService.update_action(
        db, action_id, status=data.status, notes=data.notes
    )
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AEO Action '{action_id}' not found",
        )
    return AeoRecommendationResponse.model_validate(rec)


@router.post(
    "/actions/{action_id}/verify",
    summary="Verify whether an opportunity is resolved based on latest crawl data",
)
async def verify_aeo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    rec, is_resolved, message = await AeoService.verify_action(db, action_id)
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AEO Action '{action_id}' not found",
        )
    return {
        "action_id": action_id,
        "is_resolved": is_resolved,
        "verification_status": rec.verification_status,
        "status": rec.status,
        "message": message,
        "action": AeoRecommendationResponse.model_validate(rec),
    }


@router.post(
    "/actions/{action_id}/ignore",
    response_model=AeoRecommendationResponse,
    summary="Mark an AEO action as ignored/dismissed",
)
async def ignore_aeo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoRecommendationResponse:
    rec = await AeoService.update_action(db, action_id, status="ignored")
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AEO Action '{action_id}' not found",
        )
    return AeoRecommendationResponse.model_validate(rec)


@router.post(
    "/actions/bulk",
    summary="Bulk update multiple AEO actions",
)
async def bulk_update_aeo_actions(
    data: AeoActionBulkUpdateRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    updated_count = await AeoService.bulk_update_actions(
        db, action_ids=data.action_ids, status=data.status
    )
    return {
        "success": True,
        "updated_count": updated_count,
        "status": data.status,
    }


@router.get(
    "/actions/{project_id}/export-csv",
    summary="Export AEO actions as CSV",
)
async def export_aeo_actions_csv(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> Response:
    project = await AeoService.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' not found",
        )

    recs, _ = await AeoService.get_actions(db, project_id=project_id, limit=500)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Code",
        "Recommendation",
        "Category",
        "Priority Level",
        "Priority Score",
        "Severity",
        "Estimated Impact (+pts)",
        "Potential Score",
        "Status",
        "Affected Prompts",
        "Why It Matters",
        "Recommended Action",
        "Resolved At",
        "Created At",
    ])

    for r in recs:
        writer.writerow([
            r.recommendation_code or "N/A",
            r.title,
            r.category,
            r.priority_level or r.priority,
            r.priority_score,
            r.severity,
            r.estimated_impact,
            r.potential_score or "N/A",
            r.status,
            r.affected_prompt_count,
            r.why_it_matters or "",
            r.recommended_action or "",
            r.resolved_at.isoformat() if r.resolved_at else "Unresolved",
            r.created_at.isoformat() if r.created_at else "",
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=aeo_actions_{project.domain}.csv"},
    )


# --- Gap Analysis Endpoints ---
@router.post(
    "/gaps/content",
    summary="Analyze content gaps and generate structured Content Briefs",
)
async def get_aeo_content_gaps(
    data: AeoProjectGapRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    return await AeoService.get_content_gaps(db, data.project_id)


@router.post(
    "/gaps/prompts",
    summary="Identify high-value unanswered prompt opportunities",
)
async def get_aeo_prompt_gaps(
    data: AeoProjectGapRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    return await AeoService.get_prompt_gaps(db, data.project_id)


@router.post(
    "/gaps/citations",
    summary="Analyze citation gaps and identify top source opportunities",
)
async def get_aeo_citation_gaps(
    data: AeoProjectGapRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    return await AeoService.get_citation_gaps(db, data.project_id)


@router.post(
    "/gaps/entities",
    summary="Analyze entity health, knowledge graph gaps, and weak concepts",
)
async def get_aeo_entity_gaps(
    data: AeoProjectGapRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    return await AeoService.get_entity_gaps(db, data.project_id)


# --- Optimization History ---
@router.get(
    "/optimization-history/{project_id}",
    summary="Get audit-to-audit progression and metric deltas",
)
async def get_aeo_optimization_history(
    project_id: str,
    limit: int = Query(15, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> dict:
    return await AeoService.get_optimization_history(db, project_id, limit=limit)


# --- Interactive Optimizers ---
@router.post(
    "/optimize/content",
    summary="Interactive content optimizer evaluating gaps, headings, and direct answers",
)
async def optimize_aeo_content(
    data: AeoContentOptimizeRequest,
) -> dict:
    return await AeoService.optimize_content(
        target_question=data.target_question,
        existing_content=data.existing_content,
        target_keyword=data.target_keyword or "",
        brand_name=data.brand_name or "",
        product_service=data.product_service or "",
    )


@router.post(
    "/optimize/answer",
    summary="Evaluate content against 9 core direct-answer criteria",
)
async def optimize_aeo_direct_answer(
    data: AeoDirectAnswerOptimizeRequest,
) -> dict:
    return await AeoService.optimize_direct_answer(
        target_question=data.target_question,
        existing_content=data.existing_content,
        brand_name=data.brand_name or "",
    )


# --- Legacy Recommendations & Reports ---
@router.get(
    "/recommendations/{project_id}",
    response_model=AeoRecommendationListResponse,
    summary="Get actionable AEO optimization recommendations",
)
async def get_aeo_recommendations(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> AeoRecommendationListResponse:
    recs = await AeoService.get_recommendations(db, project_id)
    return AeoRecommendationListResponse(
        recommendations=[AeoRecommendationResponse.model_validate(r) for r in recs],
        total=len(recs),
    )


# --- Reports & CSV Export ---
@router.get(
    "/reports/{project_id}",
    summary="Get full compiled AEO audit report",
)
async def get_aeo_report(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    project = await AeoService.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' not found",
        )
    vis_data = await AeoService.get_visibility_data(db, project_id)
    recs = await AeoService.get_recommendations(db, project_id)
    
    # Calculate top citations
    cits = project.citations or []
    domain_counts: dict[str, int] = {}
    for c in cits:
        domain_counts[c.domain] = domain_counts.get(c.domain, 0) + 1
    top_citations = [
        {"domain": domain, "count": count}
        for domain, count in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    ]

    scores = {
        "overall_score": project.aeo_score or (vis_data.get("overall_score") if isinstance(vis_data, dict) else None),
        "score_label": project.score_label or (vis_data.get("score_label") if isinstance(vis_data, dict) else "Untested"),
        "mention_score": project.mention_score or (vis_data.get("mention_score") if isinstance(vis_data, dict) else 0),
        "citation_score": project.citation_score or (vis_data.get("citation_score") if isinstance(vis_data, dict) else 0),
        "position_score": project.position_score or (vis_data.get("position_score") if isinstance(vis_data, dict) else 0),
        "coverage_score": project.coverage_score or (vis_data.get("coverage_score") if isinstance(vis_data, dict) else 0),
    }

    # Summary of action center
    open_recs = [r for r in recs if r.status in ["open", "in_progress"]]
    fixed_recs = [r for r in recs if r.status in ["fixed", "implemented"]]

    return {
        "project": {
            "id": project.id,
            "name": project.name,
            "domain": project.domain,
            "industry": project.industry,
            "aeo_score": project.aeo_score,
            "score_label": project.score_label,
            "last_analyzed_at": project.last_analyzed_at,
        },
        "scores": scores,
        "visibility": vis_data,
        "top_citations": top_citations,
        "competitors": project.competitors or [],
        "questions_count": len(project.questions) if project.questions else 0,
        "citations_count": len(project.citations) if project.citations else 0,
        "entities_count": len(project.entities) if project.entities else 0,
        "recommendations": [AeoRecommendationResponse.model_validate(r) for r in recs],
        "open_actions_count": len(open_recs),
        "fixed_actions_count": len(fixed_recs),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


@router.get(
    "/reports/{project_id}/export-csv",
    summary="Export AEO questions, mentions, and scores as CSV",
)
async def export_aeo_csv(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> Response:
    project = await AeoService.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' not found",
        )

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Question ID",
        "Question Text",
        "Category",
        "Intent",
        "Tracked",
        "Brand Mentioned",
        "Best Rank Position",
        "Visibility Status",
        "Visibility Score",
        "Last Checked At",
    ])

    for q in project.questions or []:
        writer.writerow([
            q.id,
            q.question_text,
            q.category,
            q.intent,
            "Yes" if q.is_tracked else "No",
            "Yes" if q.brand_mentioned else "No",
            q.best_rank_position or "N/A",
            q.visibility_status,
            q.visibility_score or "N/A",
            q.last_checked_at.isoformat() if q.last_checked_at else "Never",
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=aeo_report_{project.domain}.csv"},
    )

