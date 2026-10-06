from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.scan import Scan, ScanStatus
from app.models.seo_issue import IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage, SeoPageLink
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
from app.services.seo.keyword_service import KeywordService
from app.services.seo.scoring import get_score_label

router = APIRouter(prefix="/seo", tags=["SEO Optimization"])


class SeoKeywordItem(BaseModel):
    id: str
    keyword: str
    intent: str
    search_volume: int
    difficulty: int
    target_url: str
    position: int
    change: int
    frequency: Optional[int] = 1


class SeoKeywordListResponse(BaseModel):
    keywords: List[SeoKeywordItem]
    total: int


class KeywordExtractRequest(BaseModel):
    project_id: Optional[str] = None
    scan_id: Optional[str] = None
    limit: Optional[int] = 50


class SeoLinkItem(BaseModel):
    id: str
    source_url: str
    target_url: str
    anchor_text: Optional[str] = None
    link_type: str
    is_internal: bool
    is_follow: bool
    status_code: Optional[int] = 200


class SeoLinkListResponse(BaseModel):
    links: List[SeoLinkItem]
    total: int
    internal_count: int
    external_count: int
    broken_count: int


class TechnicalDiagnosticItem(BaseModel):
    name: str
    status: str  # "pass" | "warn" | "fail"
    badge: str
    details: str
    recommendation: Optional[str] = None


class SeoTechnicalDiagnosticsResponse(BaseModel):
    technical_score: int
    indexability_score: int
    discovered_pages: int
    skipped_pages: int
    infrastructure_checks: List[TechnicalDiagnosticItem]
    indexability_checks: List[TechnicalDiagnosticItem]


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
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SeoDashboardSummaryResponse:
    user_id = current_user.id

    # 1. Fetch user project IDs once (fast indexed lookup)
    proj_res = await db.execute(select(Project.id).where(Project.user_id == user_id))
    user_proj_ids = list(proj_res.scalars().all())
    total_projects = len(user_proj_ids)

    default_severities = {
        IssueSeverity.CRITICAL.value: 0,
        IssueSeverity.HIGH.value: 0,
        IssueSeverity.MEDIUM.value: 0,
        IssueSeverity.LOW.value: 0,
        IssueSeverity.INFO.value: 0,
    }

    if not user_proj_ids:
        return SeoDashboardSummaryResponse(
            overall_score=None,
            score_label=None,
            total_projects=0,
            total_crawled_pages=0,
            total_issues=0,
            severity_counts=default_severities,
            crawl_overview={"crawled": 0, "discovered": 0, "skipped": 0, "failed": 0},
            score_trend=[],
            top_issues=[],
            recent_scans=[],
        )

    # 2. Fetch recent scans for user projects in a single indexed query
    scans_res = await db.execute(
        select(Scan)
        .where(Scan.project_id.in_(user_proj_ids))
        .order_by(desc(Scan.created_at))
        .limit(10)
    )
    all_scans = list(scans_res.scalars().all())
    recent_scans = [ScanService.map_to_response(s) for s in all_scans[:5]]
    completed_scans = [s for s in all_scans if s.status == ScanStatus.COMPLETED.value]

    # 3. Overall Score & Score Trend from completed scans
    avg_score = None
    if completed_scans:
        scores = [s.overall_score for s in completed_scans if s.overall_score is not None]
        if scores:
            avg_score = int(round(sum(scores) / len(scores)))

    score_label = get_score_label(avg_score) if avg_score is not None else None

    score_trend = []
    for s in reversed(completed_scans[:7]):
        if s.completed_at and s.overall_score is not None:
            score_trend.append({
                "date": s.completed_at.strftime("%b %d"),
                "score": s.overall_score,
                "target_url": s.target_url,
            })

    # 4. Crawl Overview aggregated directly from scan stats
    pages_crawled_sum = sum(s.pages_crawled for s in completed_scans)
    pages_discovered_sum = sum(s.pages_discovered for s in completed_scans)
    pages_skipped_sum = sum(s.pages_skipped for s in completed_scans)
    pages_failed_sum = sum(s.pages_failed for s in completed_scans)

    crawl_overview = {
        "crawled": pages_crawled_sum,
        "discovered": max(pages_discovered_sum, pages_crawled_sum),
        "skipped": pages_skipped_sum,
        "failed": pages_failed_sum,
    }
    total_crawled_pages = pages_crawled_sum

    # 5. Issues & Severity counts for latest completed scans (direct FK lookup, no multi-table subquery)
    completed_scan_ids = [s.id for s in completed_scans[:5]]
    severity_counts = dict(default_severities)
    total_issues = 0
    top_issues = []

    if completed_scan_ids:
        sev_res = await db.execute(
            select(SeoIssue.severity, func.count(SeoIssue.id))
            .where(SeoIssue.scan_id.in_(completed_scan_ids))
            .group_by(SeoIssue.severity)
        )
        for sev_name, cnt in sev_res.all():
            if sev_name in severity_counts:
                severity_counts[sev_name] = cnt
            total_issues += cnt

        top_issues_res = await db.execute(
            select(SeoIssue.title, SeoIssue.severity, func.count(SeoIssue.id))
            .where(SeoIssue.scan_id.in_(completed_scan_ids))
            .group_by(SeoIssue.title, SeoIssue.severity)
            .order_by(
                desc(SeoIssue.severity == IssueSeverity.CRITICAL.value),
                desc(SeoIssue.severity == IssueSeverity.HIGH.value),
                desc(func.count(SeoIssue.id)),
            )
            .limit(5)
        )
        for t_title, t_sev, t_cnt in top_issues_res.all():
            top_issues.append({
                "title": t_title,
                "severity": t_sev,
                "affected_pages": t_cnt,
            })

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
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProjectListResponse:
    projects, total = await ProjectService.get_projects(db, skip=skip, limit=limit, search=search, user_id=current_user.id)
    return ProjectListResponse(
        projects=[ProjectService.map_to_response(p) for p in projects],
        total=total,
    )


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_seo_project(
    data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    project = await ProjectService.create_project(db, data, user_id=current_user.id)
    return ProjectService.map_to_response(project)


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_seo_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    project = await ProjectService.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="SEO Project not found")
    if project.user_id and project.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=404, detail="SEO Project not found")
    return ProjectService.map_to_response(project)


# ─────────────────────────────────────────────
# REAL-TIME KEYWORDS ENDPOINTS
# ─────────────────────────────────────────────
@router.get("/keywords", response_model=SeoKeywordListResponse, summary="Get real-time extracted SEO keywords")
async def get_seo_keywords(
    project_id: Optional[str] = Query(None),
    scan_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SeoKeywordListResponse:
    target_scan_id = scan_id
    user_proj_subq = select(Project.id).where(Project.user_id == current_user.id)

    if not target_scan_id and project_id:
        # Find latest completed scan for project (verifying project ownership)
        res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id == project_id,
                Scan.project_id.in_(user_proj_subq),
                Scan.status == ScanStatus.COMPLETED.value
            )
            .order_by(desc(Scan.completed_at))
            .limit(1)
        )
        latest = res.scalar_one_or_none()
        if latest:
            target_scan_id = latest.id

    if not target_scan_id:
        # Fallback to latest completed scan for this user's projects
        res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id.in_(user_proj_subq),
                Scan.status == ScanStatus.COMPLETED.value
            )
            .order_by(desc(Scan.completed_at))
            .limit(1)
        )
        latest = res.scalar_one_or_none()
        if latest:
            target_scan_id = latest.id

    if not target_scan_id:
        return SeoKeywordListResponse(keywords=[], total=0)

    keywords_data = await KeywordService.extract_keywords_from_pages(db, target_scan_id, limit=limit)
    items = [SeoKeywordItem(**k) for k in keywords_data]
    return SeoKeywordListResponse(keywords=items, total=len(items))


@router.post("/keywords/extract", response_model=SeoKeywordListResponse, summary="Extract keywords from crawl")
async def extract_seo_keywords(
    data: KeywordExtractRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SeoKeywordListResponse:
    user_proj_subq = select(Project.id).where(Project.user_id == current_user.id)
    target_scan_id = data.scan_id

    if target_scan_id:
        scan_chk = await db.execute(
            select(Scan).where(Scan.id == target_scan_id, Scan.project_id.in_(user_proj_subq))
        )
        if not scan_chk.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Scan not found or access denied")
    elif data.project_id:
        res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id == data.project_id,
                Scan.project_id.in_(user_proj_subq),
                Scan.status == ScanStatus.COMPLETED.value
            )
            .order_by(desc(Scan.completed_at))
            .limit(1)
        )
        latest = res.scalar_one_or_none()
        if latest:
            target_scan_id = latest.id

    if not target_scan_id:
        raise HTTPException(status_code=404, detail="No completed scan found to extract keywords from")

    limit = data.limit or 50
    keywords_data = await KeywordService.extract_keywords_from_pages(db, target_scan_id, limit=limit)
    items = [SeoKeywordItem(**k) for k in keywords_data]
    return SeoKeywordListResponse(keywords=items, total=len(items))


# ─────────────────────────────────────────────
# REAL-TIME LINKS ENDPOINTS
# ─────────────────────────────────────────────
@router.get("/links", response_model=SeoLinkListResponse, summary="Get real-time crawled page links")
async def get_seo_links(
    project_id: Optional[str] = Query(None),
    scan_id: Optional[str] = Query(None),
    link_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SeoLinkListResponse:
    user_proj_subq = select(Project.id).where(Project.user_id == current_user.id)
    target_scan_id = None

    if scan_id:
        scan_chk = await db.execute(
            select(Scan).where(Scan.id == scan_id, Scan.project_id.in_(user_proj_subq))
        )
        if scan_chk.scalar_one_or_none():
            target_scan_id = scan_id

    if not target_scan_id and project_id:
        res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id == project_id,
                Scan.project_id.in_(user_proj_subq),
                Scan.status == ScanStatus.COMPLETED.value
            )
            .order_by(desc(Scan.completed_at))
            .limit(1)
        )
        latest = res.scalar_one_or_none()
        if latest:
            target_scan_id = latest.id

    if not target_scan_id:
        # Fallback only to latest completed scan for current user
        res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id.in_(user_proj_subq),
                Scan.status == ScanStatus.COMPLETED.value
            )
            .order_by(desc(Scan.completed_at))
            .limit(1)
        )
        latest = res.scalar_one_or_none()
        if latest:
            target_scan_id = latest.id

    if not target_scan_id:
        return SeoLinkListResponse(links=[], total=0, internal_count=0, external_count=0, broken_count=0)

    # Base query: join SeoPageLink with SeoPage to filter by scan_id and get source url
    query = (
        select(SeoPageLink, SeoPage.url.label("source_page_url"))
        .join(SeoPage, SeoPageLink.page_id == SeoPage.id)
        .where(SeoPage.scan_id == target_scan_id)
    )

    if link_type and link_type != "all":
        is_int = (link_type == "internal")
        query = query.where(SeoPageLink.is_internal == is_int)

    if search:
        s_term = f"%{search}%"
        query = query.where(
            (SeoPageLink.target_url.ilike(s_term)) |
            (SeoPageLink.anchor_text.ilike(s_term)) |
            (SeoPage.url.ilike(s_term))
        )

    # Fetch total and items
    total_res = await db.execute(
        select(func.count(SeoPageLink.id))
        .join(SeoPage, SeoPageLink.page_id == SeoPage.id)
        .where(SeoPage.scan_id == target_scan_id)
    )
    total_all = total_res.scalar() or 0

    int_res = await db.execute(
        select(func.count(SeoPageLink.id))
        .join(SeoPage, SeoPageLink.page_id == SeoPage.id)
        .where(SeoPage.scan_id == target_scan_id, SeoPageLink.is_internal == True)
    )
    internal_count = int_res.scalar() or 0

    ext_res = await db.execute(
        select(func.count(SeoPageLink.id))
        .join(SeoPage, SeoPageLink.page_id == SeoPage.id)
        .where(SeoPage.scan_id == target_scan_id, SeoPageLink.is_internal == False)
    )
    external_count = ext_res.scalar() or 0

    broken_res = await db.execute(
        select(func.count(SeoPageLink.id))
        .join(SeoPage, SeoPageLink.page_id == SeoPage.id)
        .where(SeoPage.scan_id == target_scan_id, SeoPageLink.status_code >= 400)
    )
    broken_count = broken_res.scalar() or 0

    query = query.offset(skip).limit(limit)
    rows = (await db.execute(query)).all()

    items = []
    for link, src_url in rows:
        items.append(
            SeoLinkItem(
                id=link.id,
                source_url=src_url,
                target_url=link.target_url,
                anchor_text=link.anchor_text,
                link_type=link.link_type,
                is_internal=link.is_internal,
                is_follow=link.is_follow,
                status_code=link.status_code or 200,
            )
        )

    return SeoLinkListResponse(
        links=items,
        total=total_all,
        internal_count=internal_count,
        external_count=external_count,
        broken_count=broken_count,
    )


# ─────────────────────────────────────────────
# REAL-TIME TECHNICAL DIAGNOSTICS ENDPOINT
# ─────────────────────────────────────────────
@router.get("/technical/diagnostics", response_model=SeoTechnicalDiagnosticsResponse, summary="Get live technical SEO diagnostics")
async def get_seo_technical_diagnostics(
    project_id: Optional[str] = Query(None),
    scan_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SeoTechnicalDiagnosticsResponse:
    user_proj_subq = select(Project.id).where(Project.user_id == current_user.id)
    target_scan_id = None

    if scan_id:
        scan_chk = await db.execute(
            select(Scan).where(Scan.id == scan_id, Scan.project_id.in_(user_proj_subq))
        )
        if scan_chk.scalar_one_or_none():
            target_scan_id = scan_id

    if not target_scan_id and project_id:
        res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id == project_id,
                Scan.project_id.in_(user_proj_subq),
                Scan.status == ScanStatus.COMPLETED.value
            )
            .order_by(desc(Scan.completed_at))
            .limit(1)
        )
        latest = res.scalar_one_or_none()
        if latest:
            target_scan_id = latest.id

    if not target_scan_id:
        # Fallback only to latest completed scan for current user
        res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id.in_(user_proj_subq),
                Scan.status == ScanStatus.COMPLETED.value
            )
            .order_by(desc(Scan.completed_at))
            .limit(1)
        )
        latest = res.scalar_one_or_none()
        if latest:
            target_scan_id = latest.id

    if not target_scan_id:
        return SeoTechnicalDiagnosticsResponse(
            technical_score=0,
            indexability_score=0,
            discovered_pages=0,
            skipped_pages=0,
            infrastructure_checks=[],
            indexability_checks=[],
        )

    scan_res = await db.execute(select(Scan).where(Scan.id == target_scan_id))
    scan = scan_res.scalar_one_or_none()

    # Get issues for this scan
    issues_res = await db.execute(select(SeoIssue).where(SeoIssue.scan_id == target_scan_id))
    issues = issues_res.scalars().all()
    issue_codes = {i.issue_code: i for i in issues}

    # Count pages
    pages_res = await db.execute(select(func.count(SeoPage.id)).where(SeoPage.scan_id == target_scan_id))
    crawled_count = pages_res.scalar() or 0

    noindex_res = await db.execute(
        select(func.count(SeoPage.id)).where(SeoPage.scan_id == target_scan_id, SeoPage.is_indexable == False)
    )
    noindex_count = noindex_res.scalar() or 0

    # Build real checks
    # 1. HTTPS / SSL
    has_ssl_issue = "insecure_http" in issue_codes or "ssl_invalid" in issue_codes
    ssl_check = TechnicalDiagnosticItem(
        name="HTTPS & SSL Protocol",
        status="fail" if has_ssl_issue else "pass",
        badge="Insecure" if has_ssl_issue else "Secure",
        details="Traffic is secured with valid SSL/TLS certificate" if not has_ssl_issue else "Insecure HTTP connections detected",
        recommendation=None if not has_ssl_issue else "Enforce 301 redirect to HTTPS for all routes",
    )

    # 2. Robots.txt
    has_robots_issue = "robots_txt_missing" in issue_codes or "robots_blocking_all" in issue_codes
    robots_check = TechnicalDiagnosticItem(
        name="Robots.txt Availability",
        status="warn" if has_robots_issue else "pass",
        badge="Missing" if has_robots_issue else "Valid",
        details="Valid robots.txt detected, permitting crawler access" if not has_robots_issue else "Robots.txt file missing or blocking crawlers",
        recommendation=None if not has_robots_issue else "Deploy a valid robots.txt file specifying sitemap and allowed crawler agents",
    )

    # 3. XML Sitemap
    has_sitemap_issue = "sitemap_missing" in issue_codes or "sitemap_error" in issue_codes
    sitemap_check = TechnicalDiagnosticItem(
        name="XML Sitemap Discovery",
        status="warn" if has_sitemap_issue else "pass",
        badge="Missing" if has_sitemap_issue else "Present",
        details="XML Sitemap referenced and crawlable" if not has_sitemap_issue else "XML Sitemap not declared in robots.txt or returned 404",
        recommendation=None if not has_sitemap_issue else "Generate and declare sitemap.xml in robots.txt and submit to Google Search Console",
    )

    # 4. Canonical URL Consistency
    has_canonical_issue = "canonical_missing" in issue_codes or "canonical_mismatch" in issue_codes
    canonical_check = TechnicalDiagnosticItem(
        name="Canonical URL Consistency",
        status="warn" if has_canonical_issue else "pass",
        badge="Issues Found" if has_canonical_issue else "Consistent",
        details="Self-referencing canonical tags correctly defined" if not has_canonical_issue else "Missing or conflicting canonical tags found",
        recommendation=None if not has_canonical_issue else "Specify canonical link tags on every indexable page to prevent duplicate content",
    )

    # 5. Noindex Directives
    noindex_check = TechnicalDiagnosticItem(
        name="Noindex Directives Check",
        status="pass" if noindex_count == 0 else "warn",
        badge="All Indexable" if noindex_count == 0 else f"{noindex_count} Noindexed",
        details=f"All {crawled_count} crawled pages are fully indexable" if noindex_count == 0 else f"{noindex_count} pages have noindex directives",
        recommendation=None if noindex_count == 0 else "Verify that important marketing pages do not accidentally have noindex meta tags",
    )

    # 6. HTTP Security Headers
    has_sec_issue = any(c in issue_codes for c in ["no_hsts", "no_csp", "no_x_content_type_options"])
    sec_check = TechnicalDiagnosticItem(
        name="HTTP Security Headers",
        status="warn" if has_sec_issue else "pass",
        badge="Warning" if has_sec_issue else "Protected",
        details="HSTS and Content-Security-Policy headers active" if not has_sec_issue else "Missing recommended security headers (HSTS, CSP, X-Frame-Options)",
        recommendation=None if not has_sec_issue else "Configure Strict-Transport-Security and X-Content-Type-Options in web server",
    )

    tech_score = scan.technical_score if scan and scan.technical_score is not None else 75
    idx_score = scan.indexability_score if scan and scan.indexability_score is not None else 80

    return SeoTechnicalDiagnosticsResponse(
        technical_score=tech_score,
        indexability_score=idx_score,
        discovered_pages=scan.pages_discovered if scan else crawled_count,
        skipped_pages=scan.pages_skipped if scan else 0,
        infrastructure_checks=[ssl_check, robots_check, sitemap_check],
        indexability_checks=[canonical_check, noindex_check, sec_check],
    )

