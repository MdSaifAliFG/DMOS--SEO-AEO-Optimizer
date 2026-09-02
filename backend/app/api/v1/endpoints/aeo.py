from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.aeo import (
    AeoCitationCreate,
    AeoCitationListResponse,
    AeoCitationResponse,
    AeoDashboardSummaryResponse,
    AeoEntityCreate,
    AeoEntityListResponse,
    AeoEntityResponse,
    AeoProjectCreate,
    AeoProjectListResponse,
    AeoProjectResponse,
    AeoProjectUpdate,
    AeoQuestionCreate,
    AeoQuestionListResponse,
    AeoQuestionResponse,
)
from app.services.aeo.aeo_service import AeoService

router = APIRouter(prefix="/aeo", tags=["AEO Optimization"])


@router.get(
    "/dashboard",
    response_model=AeoDashboardSummaryResponse,
    summary="Get AEO dashboard summary KPIs, engine metrics, and recent activity",
)
async def get_aeo_dashboard(
    db: AsyncSession = Depends(get_db),
) -> AeoDashboardSummaryResponse:
    return await AeoService.get_dashboard_summary(db)


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
    return AeoProjectListResponse(projects=projects, total=total)


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
    project = await AeoService.create_project(db, data)
    return AeoProjectResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        domain=project.domain,
        description=project.description,
        is_active=project.is_active,
        aeo_score=project.aeo_score or 78,
        questions_count=len(project.questions) if project.questions else 3,
        citations_count=len(project.citations) if project.citations else 2,
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
        description=project.description,
        is_active=project.is_active,
        aeo_score=project.aeo_score or 78,
        questions_count=len(project.questions) if project.questions else 0,
        citations_count=len(project.citations) if project.citations else 0,
        settings=project.settings or {},
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.patch(
    "/projects/{project_id}",
    response_model=AeoProjectResponse,
    summary="Update AEO project",
)
async def update_aeo_project(
    project_id: str,
    data: AeoProjectUpdate,
    db: AsyncSession = Depends(get_db),
) -> AeoProjectResponse:
    project = await AeoService.update_project(db, project_id, data)
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
        description=project.description,
        is_active=project.is_active,
        aeo_score=project.aeo_score or 78,
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
        visibility_status=visibility_status,
    )
    return AeoQuestionListResponse(questions=questions, total=total)


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


# --- Entities ---
@router.get(
    "/entities",
    response_model=AeoEntityListResponse,
    summary="List tracked brand entities & topics",
)
async def list_aeo_entities(
    project_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AeoEntityListResponse:
    entities, total = await AeoService.get_entities(
        db, project_id=project_id, skip=skip, limit=limit, search=search
    )
    return AeoEntityListResponse(entities=entities, total=total)


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


# --- Citations ---
@router.get(
    "/citations",
    response_model=AeoCitationListResponse,
    summary="List citation sources extracted from AI engines",
)
async def list_aeo_citations(
    project_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    engine: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> AeoCitationListResponse:
    citations, total = await AeoService.get_citations(
        db, project_id=project_id, skip=skip, limit=limit, engine=engine, search=search
    )
    return AeoCitationListResponse(citations=citations, total=total)


@router.post(
    "/citations",
    response_model=AeoCitationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new citation source",
)
async def create_aeo_citation(
    data: AeoCitationCreate,
    db: AsyncSession = Depends(get_db),
) -> AeoCitationResponse:
    citation = await AeoService.create_citation(db, data)
    return AeoCitationResponse.model_validate(citation)
