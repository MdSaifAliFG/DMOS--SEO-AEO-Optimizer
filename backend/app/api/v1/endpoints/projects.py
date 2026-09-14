from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectListResponse, ProjectResponse, ProjectUpdate
from app.schemas.scan import ScanCreate, ScanListResponse, ScanResponse
from app.services.project_service import ProjectService
from app.services.scan_service import ScanService
from app.services.entitlement_service import EntitlementService
from app.services.credit_service import CreditCostService, CreditWalletService
from app.api.v1.endpoints.billing import get_optional_current_user, resolve_workspace_id

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new website project",
)
async def create_project(
    data: ProjectCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """Register a new website domain for SEO/AEO scanning."""
    workspace_id = await resolve_workspace_id(current_user)
    user_id = current_user.id if current_user else None

    # Check plan entitlement limits
    can_create, current_cnt, limit_cnt = await EntitlementService.can_create_project(
        db, workspace_id, user_id=user_id
    )
    if not can_create:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Plan limit reached: your current plan allows up to {limit_cnt} projects ({current_cnt} active). Please upgrade your plan to add more websites.",
        )

    # Check if domain already exists
    existing = await ProjectService.get_project_by_domain(db, data.domain)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A project for domain '{data.domain}' already exists (ID: {existing.id})",
        )

    project = await ProjectService.create_project(db, data, user_id=user_id)
    return ProjectService.map_to_response(project)



@router.get(
    "",
    response_model=ProjectListResponse,
    summary="List all website projects",
)
async def list_projects(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    search: Optional[str] = Query(None, description="Search term for name or domain"),
    db: AsyncSession = Depends(get_db),
) -> ProjectListResponse:
    """Retrieve all monitored website projects with latest scan summaries."""
    projects, total = await ProjectService.get_projects(
        db, skip=skip, limit=limit, search=search
    )
    return ProjectListResponse(
        projects=[ProjectService.map_to_response(p) for p in projects],
        total=total,
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Get project details by ID",
)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """Fetch project details including domain configuration and latest scan metadata."""
    project = await ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )
    return ProjectService.map_to_response(project)


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Update project details",
)
async def update_project(
    project_id: str,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """Update project name, domain, or settings."""
    project = await ProjectService.update_project(db, project_id, data)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )
    return ProjectService.map_to_response(project)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a project",
)
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a website project and all associated scan history."""
    deleted = await ProjectService.delete_project(db, project_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )
    return {"success": True, "message": f"Project '{project_id}' deleted successfully"}


@router.post(
    "/{project_id}/scans",
    response_model=ScanResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Trigger a new audit scan for a project",
)
async def create_scan_for_project(
    project_id: str,
    data: Optional[ScanCreate] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
) -> ScanResponse:
    """
    Queue and start a new audit lifecycle scan.
    Demonstrates the scan lifecycle (queued -> initializing -> crawling -> analyzing -> completed).
    """
    project = await ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )

    scan_data = data or ScanCreate()
    workspace_id = await resolve_workspace_id(current_user)
    if not current_user and project.user_id:
        workspace_id = str(project.user_id)
    user_id = current_user.id if current_user else project.user_id

    # If project didn't have user_id associated, bind it to active user
    if not project.user_id and user_id:
        project.user_id = user_id
        await db.commit()
        await db.refresh(project)

    # Credit check and deduction
    crawl_limit = (project.settings or {}).get("crawl_limit", 100)
    cost = CreditCostService.get_cost("seo_full_audit", pages=crawl_limit)
    success, _ = await CreditWalletService.deduct_atomic(
        db=db,
        workspace_id=workspace_id,
        amount=cost,
        operation="website_crawl",
        module="SEO",
        resource_type="project",
        resource_id=project_id,
        user_id=user_id,
        description=f"SEO Full Audit for {project.domain} (-{cost} credits)",
    )
    if not success:
        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits: this crawl requires {cost} credits, but your wallet has {wallet.available_credits} available. Please upgrade your plan or top up credits.",
        )

    scan = await ScanService.create_scan(db, project, scan_data)
    return ScanService.map_to_response(scan)


@router.get(
    "/{project_id}/scans",
    response_model=ScanListResponse,
    summary="List all scans for a project",
)
async def list_scans_for_project(
    project_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> ScanListResponse:
    """Retrieve scan execution history for a given project."""
    project = await ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID '{project_id}' not found",
        )

    scans, total = await ScanService.get_scans_by_project(
        db, project_id, skip=skip, limit=limit
    )
    return ScanListResponse(
        scans=[ScanService.map_to_response(s) for s in scans],
        total=total,
    )
