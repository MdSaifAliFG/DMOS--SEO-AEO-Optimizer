from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.project import Project
from app.models.scan import Scan, ScanStatus
from app.models.seo_issue import IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage
from app.schemas.project import ProjectCreate, ProjectListResponse, ProjectResponse, ProjectUpdate
from app.schemas.scan import ScanCancelResponse, ScanCreate, ScanListResponse, ScanResponse
from app.schemas.seo import (
    ScanResultsResponse,
    SeoIssueListResponse,
    SeoPageDetailResponse,
    SeoPageListResponse,
)
from app.services.project_service import ProjectService
from app.services.scan_service import ScanService
from app.services.seo.scoring import get_score_label

router = APIRouter(prefix="/seo", tags=["SEO Optimization"])


class SeoDashboardSummaryResponse(BaseModel):
    overall_score: Optional[int] = None
    score_label: Optional[str] = None
    total_projects: int = 0
    total_crawled_pages: int = 0
    total_issues: int = 0
    severity_counts: Dict[str, int] = Field(default_factory=dict)
    crawl_overview: Dict[str, int] = Field(default_factory=dict)
    score_trend: List[Dict[str, Any]] = Field(default_factory=list)
    top_issues: List[Dict[str, Any]] = Field(default_factory=list)
    recent_scans: List[ScanResponse] = Field(default_factory=list)


@router.get(
    "/dashboard",
    response_model=SeoDashboardSummaryResponse,
    summary="Get aggregated SEO dashboard KPIs, score trend, top issues, and crawl breakdown",
)
async def get_seo_dashboard_summary(
    db: AsyncSession = Depends(get_db),
) -> SeoDashboardSummaryResponse:
    # 1. Total projects
    proj_res = await db.execute(select(func.count(Project.id)))
    total_projects = proj_res.scalar() or 0

    # 2. Total crawled pages across all scans
    pages_res = await db.execute(select(func.count(SeoPage.id)))
    total_crawled_pages = pages_res.scalar() or 0

    # 3. Total issues & severity counts
    sev_res = await db.execute(
        select(SeoIssue.severity, func.count(SeoIssue.id)).group_by(SeoIssue.severity)
    )
    severity_counts = {
        IssueSeverity.CRITICAL.value: 0,
        IssueSeverity.HIGH.value: 0,
        IssueSeverity.MEDIUM.value: 0,
        IssueSeverity.LOW.value: 0,
        IssueSeverity.INFO.value: 0,
    }
    total_issues = 0
    for sev_name, cnt in sev_res.all():
        if sev_name in severity_counts:
            severity_counts[sev_name] = cnt
        total_issues += cnt

    # 4. Average or latest scan score
    latest_scan_res = await db.execute(
        select(Scan)
        .where(Scan.status == ScanStatus.COMPLETED.value)
        .order_by(desc(Scan.completed_at))
        .limit(10)
    )
    completed_scans = latest_scan_res.scalars().all()

    avg_score = None
    if completed_scans:
        scores = [s.overall_score for s in completed_scans if s.overall_score is not None]
        if scores:
            avg_score = int(round(sum(scores) / len(scores)))

    score_label = get_score_label(avg_score) if avg_score is not None else None

    # 5. Crawl Overview (Crawled, Discovered, Skipped, Failed)
    pages_crawled_sum = sum(s.pages_crawled for s in completed_scans) if completed_scans else total_crawled_pages
    pages_discovered_sum = sum(s.pages_discovered for s in completed_scans) if completed_scans else total_crawled_pages
    pages_skipped_sum = sum(s.pages_skipped for s in completed_scans) if completed_scans else 0
    pages_failed_sum = sum(s.pages_failed for s in completed_scans) if completed_scans else 0

    crawl_overview = {
        "crawled": pages_crawled_sum,
        "discovered": max(pages_discovered_sum, pages_crawled_sum),
        "skipped": pages_skipped_sum,
        "failed": pages_failed_sum,
    }

    # 6. Score Trend
    score_trend = []
    for s in reversed(completed_scans[:7]):
        if s.completed_at and s.overall_score is not None:
            score_trend.append({
                "date": s.completed_at.strftime("%b %d"),
                "score": s.overall_score,
                "target_url": s.target_url,
            })

    # 7. Top Issues (grouped by title)
    top_issues_res = await db.execute(
        select(SeoIssue.title, SeoIssue.severity, func.count(SeoIssue.id))
        .group_by(SeoIssue.title, SeoIssue.severity)
        .order_by(
            desc(SeoIssue.severity == IssueSeverity.CRITICAL.value),
            desc(SeoIssue.severity == IssueSeverity.HIGH.value),
            desc(func.count(SeoIssue.id)),
        )
        .limit(5)
    )
    top_issues = []
    for t_title, t_sev, t_cnt in top_issues_res.all():
        top_issues.append({
            "title": t_title,
            "severity": t_sev,
            "affected_pages": t_cnt,
        })

    # 8. Recent Scans
    scans_res = await db.execute(
        select(Scan).order_by(desc(Scan.created_at)).limit(5)
    )
    recent_scans = [ScanService.map_to_response(s) for s in scans_res.scalars().all()]

    return SeoDashboardSummaryResponse(
        overall_score=avg_score,
        score_label=score_label,
        total_projects=total_projects,
        total_crawled_pages=total_crawled_pages,
        total_issues=total_issues,
        severity_counts=severity_counts,
        crawl_overview=crawl_overview,
        score_trend=score_trend,
        top_issues=top_issues,
        recent_scans=recent_scans,
    )


# --- SEO Projects & Scans Aliases ---
@router.get("/projects", response_model=ProjectListResponse)
async def list_seo_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> ProjectListResponse:
    projects, total = await ProjectService.get_projects(db, skip=skip, limit=limit, search=search)
    return ProjectListResponse(projects=projects, total=total)


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_seo_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    project = await ProjectService.create_project(db, data)
    return await ProjectService.map_to_response(db, project)


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_seo_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    project = await ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="SEO Project not found")
    return await ProjectService.map_to_response(db, project)
