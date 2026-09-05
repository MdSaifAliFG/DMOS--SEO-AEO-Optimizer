from typing import Optional
from urllib.parse import unquote
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.scan import ScanCancelResponse, ScanResponse
from app.schemas.seo import (
    ScanResultsResponse,
    SeoIssueListResponse,
    SeoPageDetailResponse,
    SeoPageListResponse,
)
from app.services.scan_service import ScanService

router = APIRouter(prefix="/scans", tags=["Scans"])


@router.get(
    "/{scan_id}",
    response_model=ScanResponse,
    summary="Get real-time scan lifecycle status and progress",
)
async def get_scan(
    scan_id: str,
    db: AsyncSession = Depends(get_db),
) -> ScanResponse:
    """Retrieve current scan progress, stage status, and event logs."""
    scan = await ScanService.get_scan_by_id(db, scan_id)
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan with ID '{scan_id}' not found",
        )
    return ScanService.map_to_response(scan)


@router.post(
    "/{scan_id}/cancel",
    response_model=ScanCancelResponse,
    summary="Cancel an ongoing crawl/audit scan",
)
async def cancel_scan(
    scan_id: str,
    db: AsyncSession = Depends(get_db),
) -> ScanCancelResponse:
    """Halt an in-flight crawl execution and clean up resources."""
    result = await ScanService.cancel_scan(db, scan_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan with ID '{scan_id}' not found",
        )
    return result


@router.get(
    "/{scan_id}/results",
    response_model=ScanResultsResponse,
    summary="Get completed scan audit results and scores",
)
async def get_scan_results(
    scan_id: str,
    db: AsyncSession = Depends(get_db),
) -> ScanResultsResponse:
    """Retrieve full audit score cards, category scores, severity counts, and score breakdown."""
    results = await ScanService.get_scan_results(db, scan_id)
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan with ID '{scan_id}' not found",
        )
    return results


@router.get(
    "/{scan_id}/pages",
    response_model=SeoPageListResponse,
    summary="List crawled pages for a scan with pagination & filters",
)
async def get_scan_pages(
    scan_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search in URL or page title"),
    status_code: Optional[int] = Query(None, description="Filter by HTTP status code"),
    indexability: Optional[bool] = Query(None, description="Filter by indexable status"),
    db: AsyncSession = Depends(get_db),
) -> SeoPageListResponse:
    """Fetch paginated list of crawled pages with extracted metadata."""
    scan = await ScanService.get_scan_by_id(db, scan_id)
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan with ID '{scan_id}' not found",
        )

    return await ScanService.get_scan_pages(
        db,
        scan_id=scan_id,
        page=page,
        page_size=page_size,
        search=search,
        status_code=status_code,
        indexability=indexability,
    )


@router.get(
    "/{scan_id}/pages/{page_id:path}",
    response_model=SeoPageDetailResponse,
    summary="Get single page audit breakdown (headings, images, links, issues)",
)
async def get_page_detail(
    scan_id: str,
    page_id: str,
    db: AsyncSession = Depends(get_db),
) -> SeoPageDetailResponse:
    """Retrieve detailed metadata, headings, images, links, and detected issues for a single page."""
    decoded_id = unquote(page_id)
    page = await ScanService.get_page_detail(db, scan_id=scan_id, page_id=decoded_id)
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Page with ID or URL '{decoded_id}' not found for scan '{scan_id}'",
        )
    return page


@router.get(
    "/{scan_id}/issues",
    response_model=SeoIssueListResponse,
    summary="List detected SEO issues for a scan with pagination & filters",
)
async def get_scan_issues(
    scan_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    severity: Optional[str] = Query(None, description="Filter by severity (critical, high, medium, low, info)"),
    category: Optional[str] = Query(None, description="Filter by category (technical, indexability, metadata, links)"),
    issue_code: Optional[str] = Query(None, description="Filter by specific issue code"),
    status: Optional[str] = Query(None, description="Filter by issue status"),
    db: AsyncSession = Depends(get_db),
) -> SeoIssueListResponse:
    """Fetch paginated list of technical SEO issues detected by the rule engine."""
    scan = await ScanService.get_scan_by_id(db, scan_id)
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan with ID '{scan_id}' not found",
        )

    return await ScanService.get_scan_issues(
        db,
        scan_id=scan_id,
        page=page,
        page_size=page_size,
        severity=severity,
        category=category,
        issue_code=issue_code,
        status=status,
    )
