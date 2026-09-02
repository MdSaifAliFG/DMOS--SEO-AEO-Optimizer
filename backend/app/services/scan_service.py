import asyncio
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.project import Project
from app.models.scan import Scan, ScanStatus, ScanType
from app.models.seo_issue import IssueSeverity, SeoIssue
from app.models.seo_page import SeoPage
from app.schemas.scan import ScanCancelResponse, ScanCreate, ScanResponse
from app.schemas.seo import (
    ScanResultsResponse,
    SeoIssueListResponse,
    SeoIssueResponse,
    SeoPageDetailResponse,
    SeoPageImageResponse,
    SeoPageLinkResponse,
    SeoPageListResponse,
    SeoPageResponse,
)
from app.services.crawler.url_normalizer import get_root_domain, normalize_url
from app.services.crawler.url_validator import is_url_safe, validate_url
from app.services.scan_runner import ScanRunner, get_iso_now
from app.services.seo.scoring import get_score_label

logger = logging.getLogger(__name__)


class ScanService:
    @staticmethod
    async def create_scan(
        db: AsyncSession,
        project: Project,
        data: ScanCreate,
    ) -> Scan:
        target_url = data.target_url
        clean_domain = get_root_domain(project.domain) if project.domain else "example.com"
        if not target_url:
            target_url = f"https://{clean_domain}"
        elif not target_url.startswith("http://") and not target_url.startswith("https://"):
            target_url = f"https://{target_url}"

        target_url = normalize_url(target_url) or target_url

        # Validate URL and SSRF safety
        is_valid, err = validate_url(target_url, check_dns=False)
        if not is_valid:
            raise ValueError(f"Invalid target URL: {err}")

        initial_log = {
            "timestamp": get_iso_now(),
            "level": "INFO",
            "step": "Scan Created & Queued",
            "message": f"Scan registered for target '{target_url}' (type: {data.scan_type.value}). Background crawler queued.",
        }

        scan = Scan(
            project_id=project.id,
            target_url=target_url,
            scan_type=data.scan_type.value,
            status=ScanStatus.QUEUED.value,
            progress=0,
            current_step="Queued in orchestration pipeline",
            logs=[initial_log],
            meta_data={
                "project_domain": project.domain,
                "project_name": project.name,
                "initiated_at": get_iso_now(),
            },
        )
        db.add(scan)
        await db.commit()
        await db.refresh(scan)

        # Trigger asynchronous background crawler and SEO engine
        asyncio.create_task(ScanRunner.run_scan_lifecycle(scan.id))

        return scan

    @staticmethod
    async def get_scan_by_id(
        db: AsyncSession,
        scan_id: str,
    ) -> Optional[Scan]:
        """Fetch single scan by ID."""
        query = select(Scan).where(Scan.id == scan_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_scans_by_project(
        db: AsyncSession,
        project_id: str,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[Scan], int]:
        """Fetch all scans for a specific project with total count."""
        query = (
            select(Scan)
            .where(Scan.project_id == project_id)
            .order_by(desc(Scan.created_at))
            .offset(skip)
            .limit(limit)
        )
        count_query = (
            select(func.count(Scan.id))
            .where(Scan.project_id == project_id)
        )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        res = await db.execute(query)
        scans = list(res.scalars().all())

        return scans, total

    @staticmethod
    async def cancel_scan(
        db: AsyncSession,
        scan_id: str,
    ) -> Optional[ScanCancelResponse]:
        """Cancel an in-flight scan."""
        scan = await ScanService.get_scan_by_id(db, scan_id)
        if not scan:
            return None

        if scan.status in (ScanStatus.COMPLETED.value, ScanStatus.FAILED.value, ScanStatus.CANCELLED.value):
            return ScanCancelResponse(
                id=scan.id,
                status=ScanStatus(scan.status),
                message=f"Scan is already in terminal state: {scan.status}",
            )

        scan.status = ScanStatus.CANCELLED.value
        scan.current_step = "Scan cancelled by user"
        scan.completed_at = datetime.now(timezone.utc)

        current_logs = list(scan.logs or [])
        current_logs.append({
            "timestamp": get_iso_now(),
            "level": "WARNING",
            "step": "Scan Cancelled",
            "message": "User initiated scan cancellation. Crawler pipeline halted.",
        })
        scan.logs = current_logs

        await db.commit()
        await db.refresh(scan)

        return ScanCancelResponse(
            id=scan.id,
            status=ScanStatus.CANCELLED,
            message="Scan cancelled successfully",
        )

    @staticmethod
    async def get_scan_results(
        db: AsyncSession,
        scan_id: str,
    ) -> Optional[ScanResultsResponse]:
        """Fetch high-level scan score results, categories, and severity breakdown."""
        scan = await ScanService.get_scan_by_id(db, scan_id)
        if not scan:
            return None

        # Severity breakdown counts
        sev_query = (
            select(SeoIssue.severity, func.count(SeoIssue.id))
            .where(SeoIssue.scan_id == scan_id)
            .group_by(SeoIssue.severity)
        )
        sev_res = await db.execute(sev_query)
        severity_counts: Dict[str, int] = {
            IssueSeverity.CRITICAL.value: 0,
            IssueSeverity.HIGH.value: 0,
            IssueSeverity.MEDIUM.value: 0,
            IssueSeverity.LOW.value: 0,
            IssueSeverity.INFO.value: 0,
        }
        for sev, count in sev_res.all():
            severity_counts[sev] = count

        score_label = get_score_label(scan.overall_score) if scan.overall_score is not None else None

        return ScanResultsResponse(
            scan_id=scan.id,
            project_id=scan.project_id,
            target_url=scan.target_url,
            status=scan.status,
            overall_score=scan.overall_score,
            score_label=score_label,
            technical_score=scan.technical_score,
            indexability_score=scan.indexability_score,
            metadata_score=scan.metadata_score,
            links_score=scan.links_score,
            score_breakdown=scan.score_breakdown or {},
            pages_discovered=scan.pages_discovered,
            pages_crawled=scan.pages_crawled,
            pages_failed=scan.pages_failed,
            pages_skipped=scan.pages_skipped,
            issues_count=scan.issues_count,
            severity_counts=severity_counts,
            crawl_duration=scan.crawl_duration,
            started_at=scan.started_at,
            completed_at=scan.completed_at,
            meta_data=scan.meta_data or {},
        )

    @staticmethod
    async def get_scan_pages(
        db: AsyncSession,
        scan_id: str,
        page: int = 1,
        page_size: int = 25,
        search: Optional[str] = None,
        status_code: Optional[int] = None,
        indexability: Optional[bool] = None,
    ) -> SeoPageListResponse:
        """Fetch paginated crawled pages for a scan with search and status filters."""
        query = select(SeoPage).where(SeoPage.scan_id == scan_id).options(selectinload(SeoPage.issues))
        count_query = select(func.count(SeoPage.id)).where(SeoPage.scan_id == scan_id)

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(
                func.lower(SeoPage.url).like(s_term) | func.lower(SeoPage.title).like(s_term)
            )
            count_query = count_query.where(
                func.lower(SeoPage.url).like(s_term) | func.lower(SeoPage.title).like(s_term)
            )

        if status_code is not None:
            query = query.where(SeoPage.status_code == status_code)
            count_query = count_query.where(SeoPage.status_code == status_code)

        if indexability is not None:
            query = query.where(SeoPage.is_indexable == indexability)
            count_query = count_query.where(SeoPage.is_indexable == indexability)

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        offset = (page - 1) * page_size
        query = query.order_by(SeoPage.crawl_depth, SeoPage.created_at).offset(offset).limit(page_size)

        res = await db.execute(query)
        page_records = res.scalars().all()

        page_responses: List[SeoPageResponse] = []
        for p in page_records:
            page_responses.append(
                SeoPageResponse(
                    id=p.id,
                    scan_id=p.scan_id,
                    url=p.url,
                    final_url=p.final_url,
                    status_code=p.status_code,
                    content_type=p.content_type,
                    title=p.title,
                    meta_description=p.meta_description,
                    canonical_url=p.canonical_url,
                    language=p.language,
                    h1_count=p.h1_count,
                    h2_count=p.h2_count,
                    h3_count=p.h3_count,
                    word_count=p.word_count,
                    response_time=p.response_time,
                    content_length=p.content_length,
                    is_indexable=p.is_indexable,
                    is_internal=p.is_internal,
                    crawl_depth=p.crawl_depth,
                    render_method=p.render_method,
                    issues_count=len(p.issues) if p.issues else 0,
                    created_at=p.created_at,
                )
            )

        total_pages = max(1, (total + page_size - 1) // page_size) if total > 0 else 0

        return SeoPageListResponse(
            pages=page_responses,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def get_page_detail(
        db: AsyncSession,
        scan_id: str,
        page_id: str,
    ) -> Optional[SeoPageDetailResponse]:
        """Fetch single page detailed audit including images, links, and issues."""
        query = (
            select(SeoPage)
            .where(SeoPage.id == page_id, SeoPage.scan_id == scan_id)
            .options(
                selectinload(SeoPage.images),
                selectinload(SeoPage.links),
                selectinload(SeoPage.issues),
            )
        )
        res = await db.execute(query)
        page = res.scalar_one_or_none()
        if not page:
            return None

        return SeoPageDetailResponse(
            id=page.id,
            scan_id=page.scan_id,
            url=page.url,
            final_url=page.final_url,
            status_code=page.status_code,
            content_type=page.content_type,
            title=page.title,
            meta_description=page.meta_description,
            canonical_url=page.canonical_url,
            robots_directive=page.robots_directive,
            x_robots_tag=page.x_robots_tag,
            language=page.language,
            h1_count=page.h1_count,
            h2_count=page.h2_count,
            h3_count=page.h3_count,
            headings=page.headings or {},
            word_count=page.word_count,
            response_time=page.response_time,
            content_length=page.content_length,
            is_indexable=page.is_indexable,
            is_internal=page.is_internal,
            crawl_depth=page.crawl_depth,
            render_method=page.render_method,
            redirect_chain=page.redirect_chain or [],
            open_graph=page.open_graph or {},
            twitter_card=page.twitter_card or {},
            structured_data=page.structured_data or [],
            images=[SeoPageImageResponse.model_validate(img) for img in page.images],
            links=[SeoPageLinkResponse.model_validate(lnk) for lnk in page.links],
            issues=[
                SeoIssueResponse(
                    id=iss.id,
                    scan_id=iss.scan_id,
                    page_id=iss.page_id,
                    page_url=page.url,
                    issue_code=iss.issue_code,
                    category=iss.category,
                    severity=iss.severity,
                    title=iss.title,
                    description=iss.description,
                    recommendation=iss.recommendation,
                    details=iss.details or {},
                    status=iss.status,
                    created_at=iss.created_at,
                )
                for iss in page.issues
            ],
            issues_count=len(page.issues),
            created_at=page.created_at,
        )

    @staticmethod
    async def get_scan_issues(
        db: AsyncSession,
        scan_id: str,
        page: int = 1,
        page_size: int = 25,
        severity: Optional[str] = None,
        category: Optional[str] = None,
        issue_code: Optional[str] = None,
        status: Optional[str] = None,
    ) -> SeoIssueListResponse:
        """Fetch paginated SEO issues with severity breakdown counts."""
        query = select(SeoIssue).where(SeoIssue.scan_id == scan_id).options(selectinload(SeoIssue.page))
        count_query = select(func.count(SeoIssue.id)).where(SeoIssue.scan_id == scan_id)

        if severity:
            query = query.where(SeoIssue.severity == severity.lower())
            count_query = count_query.where(SeoIssue.severity == severity.lower())

        if category:
            query = query.where(SeoIssue.category == category.lower())
            count_query = count_query.where(SeoIssue.category == category.lower())

        if issue_code:
            query = query.where(SeoIssue.issue_code == issue_code)
            count_query = count_query.where(SeoIssue.issue_code == issue_code)

        if status:
            query = query.where(SeoIssue.status == status)
            count_query = count_query.where(SeoIssue.status == status)

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        # Severity breakdown total counts across all issues for scan
        sev_query = (
            select(SeoIssue.severity, func.count(SeoIssue.id))
            .where(SeoIssue.scan_id == scan_id)
            .group_by(SeoIssue.severity)
        )
        sev_res = await db.execute(sev_query)
        severity_counts: Dict[str, int] = {
            IssueSeverity.CRITICAL.value: 0,
            IssueSeverity.HIGH.value: 0,
            IssueSeverity.MEDIUM.value: 0,
            IssueSeverity.LOW.value: 0,
            IssueSeverity.INFO.value: 0,
        }
        for s_key, s_cnt in sev_res.all():
            severity_counts[s_key] = s_cnt

        offset = (page - 1) * page_size
        query = query.order_by(
            # Order by severity priority
            desc(SeoIssue.severity == IssueSeverity.CRITICAL.value),
            desc(SeoIssue.severity == IssueSeverity.HIGH.value),
            desc(SeoIssue.severity == IssueSeverity.MEDIUM.value),
            desc(SeoIssue.severity == IssueSeverity.LOW.value),
            SeoIssue.created_at,
        ).offset(offset).limit(page_size)

        res = await db.execute(query)
        issue_records = res.scalars().all()

        issue_responses: List[SeoIssueResponse] = []
        for iss in issue_records:
            issue_responses.append(
                SeoIssueResponse(
                    id=iss.id,
                    scan_id=iss.scan_id,
                    page_id=iss.page_id,
                    page_url=iss.page.url if iss.page else None,
                    issue_code=iss.issue_code,
                    category=iss.category,
                    severity=iss.severity,
                    title=iss.title,
                    description=iss.description,
                    recommendation=iss.recommendation,
                    details=iss.details or {},
                    status=iss.status,
                    created_at=iss.created_at,
                )
            )

        total_pages = max(1, (total + page_size - 1) // page_size) if total > 0 else 0

        return SeoIssueListResponse(
            issues=issue_responses,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            severity_counts=severity_counts,
        )

    @staticmethod
    def map_to_response(scan: Scan) -> ScanResponse:
        """Map Scan ORM to ScanResponse Pydantic schema."""
        return ScanResponse(
            id=scan.id,
            project_id=scan.project_id,
            target_url=scan.target_url,
            scan_type=scan.scan_type,
            status=ScanStatus(scan.status),
            progress=scan.progress,
            current_step=scan.current_step,
            logs=scan.logs or [],
            meta_data=scan.meta_data or {},
            error_message=scan.error_message,
            pages_discovered=scan.pages_discovered,
            pages_crawled=scan.pages_crawled,
            pages_failed=scan.pages_failed,
            pages_skipped=scan.pages_skipped,
            issues_count=scan.issues_count,
            overall_score=scan.overall_score,
            technical_score=scan.technical_score,
            indexability_score=scan.indexability_score,
            metadata_score=scan.metadata_score,
            links_score=scan.links_score,
            score_breakdown=scan.score_breakdown or {},
            crawl_duration=scan.crawl_duration,
            started_at=scan.started_at,
            completed_at=scan.completed_at,
            created_at=scan.created_at,
            updated_at=scan.updated_at,
        )
