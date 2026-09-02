from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.project import Project
from app.models.scan import Scan, ScanStatus
from app.models.seo_page import SeoPage
from app.schemas.recommendation import (
    ContentOptimizationRequest,
    ContentOptimizationResponse,
    ContentRecommendationItem,
    DescriptionOptimizationRequest,
    DescriptionOptimizationResponse,
    InternalLinkOpportunity,
    InternalLinksOptimizationRequest,
    InternalLinksOptimizationResponse,
    OptimizationHistoryListResponse,
    OptimizationHistoryResponse,
    SeoOptimizationSummaryResponse,
    SeoRecommendationBulkUpdate,
    SeoRecommendationListResponse,
    SeoRecommendationResponse,
    SeoRecommendationUpdate,
    TitleOptimizationRequest,
    TitleOptimizationResponse,
    VerifyFixResponse,
)
from app.services.seo.ai.ai_provider import SEOAIProviderFactory
from app.services.seo.recommendations.history_service import OptimizationHistoryService
from app.services.seo.recommendations.recommendation_engine import RecommendationEngine

router = APIRouter(prefix="/seo", tags=["SEO Optimization & Action Center"])


@router.get(
    "/actions",
    response_model=SeoRecommendationListResponse,
    summary="List prioritized SEO actions and recommendations",
)
async def list_seo_actions(
    project_id: Optional[str] = Query(None),
    scan_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> SeoRecommendationListResponse:
    recs, total = await RecommendationEngine.get_actions(
        db,
        project_id=project_id,
        scan_id=scan_id,
        status=status,
        priority=priority,
        category=category,
        search=search,
        skip=skip,
        limit=limit,
    )
    return SeoRecommendationListResponse(recommendations=recs, total=total)


@router.get(
    "/actions/{action_id}",
    response_model=SeoRecommendationResponse,
    summary="Get single action detail",
)
async def get_seo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
) -> SeoRecommendationResponse:
    rec = await RecommendationEngine.get_action_by_id(db, action_id)
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action recommendation '{action_id}' not found",
        )
    return rec


@router.post(
    "/actions/generate",
    response_model=SeoRecommendationListResponse,
    summary="Generate optimization recommendations from audit data",
)
async def generate_seo_actions(
    scan_id: str = Query(...),
    project_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
) -> SeoRecommendationListResponse:
    recs = await RecommendationEngine.generate_recommendations_for_scan(
        db, scan_id=scan_id, project_id=project_id
    )
    res_list = [SeoRecommendationResponse.model_validate(r) for r in recs]
    return SeoRecommendationListResponse(recommendations=res_list, total=len(res_list))


@router.patch(
    "/actions/{action_id}",
    response_model=SeoRecommendationResponse,
    summary="Update action status or notes",
)
async def update_seo_action(
    action_id: str,
    data: SeoRecommendationUpdate,
    db: AsyncSession = Depends(get_db),
) -> SeoRecommendationResponse:
    updated = await RecommendationEngine.update_action_status(
        db, action_id=action_id, status=data.status, notes=data.notes
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action recommendation '{action_id}' not found",
        )
    return updated


@router.post(
    "/actions/{action_id}/verify",
    response_model=VerifyFixResponse,
    summary="Re-verify if an issue has been resolved on the live URL",
)
async def verify_seo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
) -> VerifyFixResponse:
    return await RecommendationEngine.verify_recommendation(db, action_id)


@router.post(
    "/actions/{action_id}/ignore",
    response_model=SeoRecommendationResponse,
    summary="Mark action as ignored",
)
async def ignore_seo_action(
    action_id: str,
    db: AsyncSession = Depends(get_db),
) -> SeoRecommendationResponse:
    updated = await RecommendationEngine.update_action_status(
        db, action_id=action_id, status="ignored"
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action recommendation '{action_id}' not found",
        )
    return updated


@router.post(
    "/actions/bulk",
    summary="Bulk update statuses for multiple recommendations",
)
async def bulk_update_seo_actions(
    data: SeoRecommendationBulkUpdate,
    db: AsyncSession = Depends(get_db),
) -> dict:
    count = await RecommendationEngine.bulk_update_status(
        db, action_ids=data.action_ids, status=data.status, notes=data.notes
    )
    return {"success": True, "updated_count": count}


@router.get(
    "/actions/summary/{project_id}",
    response_model=SeoOptimizationSummaryResponse,
    summary="Get Action Center summary KPIs, potential score, and progress",
)
async def get_seo_actions_summary(
    project_id: str,
    db: AsyncSession = Depends(get_db),
) -> SeoOptimizationSummaryResponse:
    return await RecommendationEngine.get_project_summary(db, project_id=project_id)


@router.get(
    "/optimization-history/{project_id}",
    response_model=OptimizationHistoryListResponse,
    summary="Get audit-to-audit before/after comparison history",
)
async def get_optimization_history(
    project_id: str,
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> OptimizationHistoryListResponse:
    history = await OptimizationHistoryService.get_project_history(
        db, project_id=project_id, limit=limit
    )
    return OptimizationHistoryListResponse(comparisons=history, total=len(history))


# --- Metadata Optimizer Endpoints ---

@router.post(
    "/optimize/title",
    response_model=TitleOptimizationResponse,
    summary="Generate optimized SEO title suggestions",
)
async def optimize_title(
    data: TitleOptimizationRequest,
) -> TitleOptimizationResponse:
    provider = SEOAIProviderFactory.get_provider()
    suggestions = await provider.generate_titles(
        current_title=data.current_title,
        target_url=data.target_url,
        target_keyword=data.target_keyword,
        brand_name=data.brand_name,
        snippet=data.page_content_snippet,
    )
    return TitleOptimizationResponse(
        current_title=data.current_title,
        suggestions=suggestions,
        provider=provider.provider_name,
    )


@router.post(
    "/optimize/description",
    response_model=DescriptionOptimizationResponse,
    summary="Generate optimized SEO meta description suggestions",
)
async def optimize_description(
    data: DescriptionOptimizationRequest,
) -> DescriptionOptimizationResponse:
    provider = SEOAIProviderFactory.get_provider()
    suggestions = await provider.generate_descriptions(
        current_description=data.current_description,
        target_url=data.target_url,
        target_keyword=data.target_keyword,
        brand_name=data.brand_name,
        snippet=data.page_content_snippet,
    )
    return DescriptionOptimizationResponse(
        current_description=data.current_description,
        suggestions=suggestions,
        provider=provider.provider_name,
    )


# --- Content & Linking Optimizer Endpoints ---

@router.post(
    "/optimize/content",
    response_model=ContentOptimizationResponse,
    summary="Analyze page content health, heading hierarchy, and expansion opportunities",
)
async def optimize_content(
    data: ContentOptimizationRequest,
    db: AsyncSession = Depends(get_db),
) -> ContentOptimizationResponse:
    page_query = select(SeoPage)
    if data.page_id:
        page_query = page_query.where(SeoPage.id == data.page_id)
    elif data.target_url:
        page_query = page_query.where(SeoPage.url == data.target_url)
    else:
        page_query = page_query.limit(1)

    page_res = await db.execute(page_query)
    page = page_res.scalar_one_or_none()

    url = page.url if page else (data.target_url or "https://example.com")
    word_count = page.word_count if page else 150
    headings_dict = page.headings if (page and isinstance(page.headings, dict)) else {}
    h1_list = headings_dict.get("h1", [])
    h2_list = headings_dict.get("h2", [])

    status = "optimal" if word_count >= 600 else "acceptable" if word_count >= 300 else "thin"
    recs = []

    if word_count < 300:
        recs.append(
            ContentRecommendationItem(
                title="Expand Substantive Body Content",
                description=f"Current word count is {word_count} words. Expand with detailed explanations, FAQs, and topical sub-sections to reach 600+ words.",
                category="Content Substance",
                priority="high",
                impact="+2.5 pts",
            )
        )

    if not h1_list:
        recs.append(
            ContentRecommendationItem(
                title="Add Single Primary H1 Heading",
                description="Establish topical hierarchy by adding a clear, keyword-focused H1 heading to the main content.",
                category="Heading Hierarchy",
                priority="high",
                impact="+1.8 pts",
            )
        )

    if len(h2_list) < 2:
        recs.append(
            ContentRecommendationItem(
                title="Structure Sub-topics with H2 Headings",
                description="Break up long paragraphs into organized sub-sections using descriptive H2 subheadings.",
                category="Readability & Scannability",
                priority="medium",
                impact="+1.0 pts",
            )
        )

    return ContentOptimizationResponse(
        url=url,
        word_count=word_count,
        word_count_status=status,
        heading_structure={
            "h1_count": len(h1_list),
            "h1_samples": h1_list[:2],
            "h2_count": len(h2_list),
            "h2_samples": h2_list[:4],
        },
        readability_indicator="Good" if word_count >= 300 else "Needs Expansion",
        duplicate_signals=[],
        recommendations=recs,
    )


@router.post(
    "/optimize/internal-links",
    response_model=InternalLinksOptimizationResponse,
    summary="Discover internal linking opportunities based on crawl architecture",
)
async def optimize_internal_links(
    data: InternalLinksOptimizationRequest,
    db: AsyncSession = Depends(get_db),
) -> InternalLinksOptimizationResponse:
    # Fetch pages for project's latest scan
    scan_id = data.scan_id
    if not scan_id:
        scan_res = await db.execute(
            select(Scan)
            .where(Scan.project_id == data.project_id, Scan.status == ScanStatus.COMPLETED.value)
            .order_by(desc(Scan.created_at))
            .limit(1)
        )
        latest_scan = scan_res.scalar_one_or_none()
        if latest_scan:
            scan_id = latest_scan.id

    if not scan_id:
        return InternalLinksOptimizationResponse()

    pages_res = await db.execute(
        select(SeoPage).where(SeoPage.scan_id == scan_id).limit(50)
    )
    pages = pages_res.scalars().all()
    if not pages:
        return InternalLinksOptimizationResponse()

    # Calculate real inbound internal link counts from link graph
    from app.models.seo_page import SeoPageLink
    inbound_query = (
        select(SeoPageLink.target_url, func.count(SeoPageLink.id).label("cnt"))
        .join(SeoPage, SeoPageLink.page_id == SeoPage.id)
        .where(SeoPage.scan_id == scan_id, SeoPageLink.is_internal == True)
        .group_by(SeoPageLink.target_url)
    )
    inbound_res = await db.execute(inbound_query)
    inbound_map = {row[0]: row[1] for row in inbound_res.all()}

    orphan_pages = [p.url for p in pages if inbound_map.get(p.url, 0) == 0][:10]
    low_inbound = [
        {"url": p.url, "inbound_links": inbound_map[p.url]}
        for p in pages
        if 0 < inbound_map.get(p.url, 0) <= 2
    ][:10]

    opportunities: List[InternalLinkOpportunity] = []
    
    # First, recommend linking to orphan pages from the home / hub page
    hub_page = pages[0]
    for orphan_url in orphan_pages:
        if orphan_url != hub_page.url:
            tgt_page = next((p for p in pages if p.url == orphan_url), None)
            anchor = (tgt_page.title if tgt_page and tgt_page.title else "explore guide").split("|")[0].strip()[:30]
            opportunities.append(
                InternalLinkOpportunity(
                    source_url=hub_page.url,
                    target_url=orphan_url,
                    recommended_anchor=anchor,
                    reason="Orphan page detected. Add an internal link from the main section to establish crawler discoverability and PageRank flow.",
                    priority="high",
                )
            )

    # Next, sibling recommendations
    if len(pages) >= 2:
        for i in range(min(5, len(pages) - 1)):
            src = pages[i]
            tgt = pages[i + 1]
            if src.url != tgt.url and tgt.url not in [o.target_url for o in opportunities]:
                anchor = (tgt.title or "related resource").split("|")[0].strip()[:30]
                opportunities.append(
                    InternalLinkOpportunity(
                        source_url=src.url,
                        target_url=tgt.url,
                        recommended_anchor=anchor,
                        reason="Topically related sibling page within site hierarchy. Linking passes PageRank equity and improves crawler discovery.",
                        priority="medium",
                    )
                )

    return InternalLinksOptimizationResponse(
        total_opportunities=len(opportunities) + len(orphan_pages),
        orphan_pages=orphan_pages,
        low_inbound_pages=low_inbound,
        opportunities=opportunities,
    )
