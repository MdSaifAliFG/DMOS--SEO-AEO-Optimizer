from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.project import Project
from app.models.scan import Scan, ScanStatus
from app.models.seo_issue import SeoIssue
from app.models.seo_page import SeoPage
from app.models.seo_recommendation import (
    RecommendationEffort,
    RecommendationPriority,
    RecommendationStatus,
    SeoRecommendation,
)
from app.schemas.recommendation import (
    CategoryProgress,
    SeoOptimizationSummaryResponse,
    SeoRecommendationResponse,
    VerifyFixResponse,
)
from app.services.crawler.http_client import AsyncCrawlerHttpClient
from app.services.crawler.page_parser import HTMLPageParser
from app.services.seo.recommendations.impact_calculator import ImpactCalculator
from app.services.seo.recommendations.priority_calculator import PriorityCalculator
from app.services.seo.recommendations.recommendation_rules import get_rule_for_issue_code

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """Core engine generating, prioritizing, tracking, and verifying SEO recommendations."""

    @staticmethod
    async def generate_recommendations_for_scan(
        db: AsyncSession,
        scan_id: str,
        project_id: str,
    ) -> List[SeoRecommendation]:
        """Consumes actual audit issues to create prioritized actionable recommendations."""
        # 1. Check if recommendations already exist
        existing_res = await db.execute(
            select(SeoRecommendation).where(SeoRecommendation.scan_id == scan_id)
        )
        existing = existing_res.scalars().all()
        if existing:
            return existing

        # 2. Fetch all issues for this scan
        issues_res = await db.execute(
            select(SeoIssue)
            .where(SeoIssue.scan_id == scan_id)
            .options(selectinload(SeoIssue.page))
            .order_by(SeoIssue.created_at)
        )
        issues = issues_res.scalars().all()
        if not issues:
            return []

        # 3. Group issues by issue_code
        grouped_issues: Dict[str, List[SeoIssue]] = {}
        for iss in issues:
            grouped_issues.setdefault(iss.issue_code, []).append(iss)

        recommendations_to_add: List[SeoRecommendation] = []

        for issue_code, issue_list in grouped_issues.items():
            primary_issue = issue_list[0]
            rule = get_rule_for_issue_code(issue_code)

            # Collect affected URLs
            affected_urls = []
            for item in issue_list:
                if item.page and item.page.url:
                    affected_urls.append(item.page.url)
                elif item.details and isinstance(item.details, dict) and "url" in item.details:
                    affected_urls.append(item.details["url"])

            # Deduplicate URLs while preserving order
            unique_urls = list(dict.fromkeys(affected_urls))
            affected_count = max(len(unique_urls), len(issue_list))

            severity = primary_issue.severity
            category = rule.get("category", primary_issue.category)

            # Calculate deterministic impact & priority
            base_impact = rule.get("base_impact", 1.0)
            estimated_impact = ImpactCalculator.calculate_issue_impact(
                severity=severity,
                base_impact=base_impact,
                affected_pages_count=affected_count,
            )

            priority_score, priority_tier = PriorityCalculator.calculate_priority(
                severity=severity,
                affected_pages_count=affected_count,
                category=category,
                estimated_impact=estimated_impact,
                issue_code=issue_code,
            )

            sample_url = unique_urls[0] if unique_urls else "https://example.com"
            current_state = rule.get("current_state_template", "").format(
                current_value=primary_issue.details.get("value", "Not Found") if primary_issue.details else "Not Found",
                canonical_url=sample_url,
            )
            recommended_state = rule.get("recommended_state_template", "").format(
                canonical_url=sample_url,
            )

            rec = SeoRecommendation(
                project_id=project_id,
                scan_id=scan_id,
                issue_id=primary_issue.id,
                page_id=primary_issue.page_id,
                issue_code=issue_code,
                title=rule.get("title", primary_issue.title),
                description=rule.get("description", primary_issue.description),
                why_it_matters=rule.get("why_it_matters", "Resolving this issue improves search engine crawl and user experience."),
                how_to_fix=rule.get("how_to_fix", primary_issue.recommendation),
                category=category,
                priority=priority_tier,
                priority_score=priority_score,
                estimated_impact=estimated_impact,
                effort=rule.get("effort", RecommendationEffort.MEDIUM.value),
                status=RecommendationStatus.OPEN.value,
                affected_pages_count=affected_count,
                affected_urls=unique_urls[:50],
                current_state=current_state,
                recommended_state=recommended_state,
                verification_status="unverified",
                verification_details={},
            )
            recommendations_to_add.append(rec)

        db.add_all(recommendations_to_add)
        await db.commit()

        # Re-fetch with clean order by priority_score descending
        res = await db.execute(
            select(SeoRecommendation)
            .where(SeoRecommendation.scan_id == scan_id)
            .order_by(desc(SeoRecommendation.priority_score))
        )
        return res.scalars().all()

    @staticmethod
    async def get_actions(
        db: AsyncSession,
        project_id: Optional[str] = None,
        scan_id: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Tuple[List[SeoRecommendationResponse], int]:
        # If project_id is provided but no scan_id, resolve latest completed scan
        target_scan_id = scan_id
        if project_id and not target_scan_id:
            scan_res = await db.execute(
                select(Scan)
                .where(Scan.project_id == project_id, Scan.status == ScanStatus.COMPLETED.value)
                .order_by(desc(Scan.created_at))
                .limit(1)
            )
            latest_scan = scan_res.scalar_one_or_none()
            if latest_scan:
                target_scan_id = latest_scan.id
                await RecommendationEngine.generate_recommendations_for_scan(
                    db, scan_id=target_scan_id, project_id=project_id
                )

        query = select(SeoRecommendation).order_by(desc(SeoRecommendation.priority_score))
        count_query = select(func.count(SeoRecommendation.id))

        if project_id:
            query = query.where(SeoRecommendation.project_id == project_id)
            count_query = count_query.where(SeoRecommendation.project_id == project_id)

        if target_scan_id:
            query = query.where(SeoRecommendation.scan_id == target_scan_id)
            count_query = count_query.where(SeoRecommendation.scan_id == target_scan_id)

        if status and status != "all":
            query = query.where(SeoRecommendation.status == status.lower())
            count_query = count_query.where(SeoRecommendation.status == status.lower())

        if priority and priority != "all":
            query = query.where(SeoRecommendation.priority == priority.lower())
            count_query = count_query.where(SeoRecommendation.priority == priority.lower())

        if category and category != "all":
            query = query.where(SeoRecommendation.category == category.lower())
            count_query = count_query.where(SeoRecommendation.category == category.lower())

        if search and search.strip():
            s_term = f"%{search.strip().lower()}%"
            query = query.where(
                func.lower(SeoRecommendation.title).like(s_term)
                | func.lower(SeoRecommendation.description).like(s_term)
                | func.lower(SeoRecommendation.issue_code).like(s_term)
            )
            count_query = count_query.where(
                func.lower(SeoRecommendation.title).like(s_term)
                | func.lower(SeoRecommendation.description).like(s_term)
                | func.lower(SeoRecommendation.issue_code).like(s_term)
            )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        recommendations = res.scalars().all()

        return [SeoRecommendationResponse.model_validate(r) for r in recommendations], total

    @staticmethod
    async def get_action_by_id(
        db: AsyncSession,
        action_id: str,
    ) -> Optional[SeoRecommendationResponse]:
        res = await db.execute(
            select(SeoRecommendation).where(SeoRecommendation.id == action_id)
        )
        rec = res.scalar_one_or_none()
        return SeoRecommendationResponse.model_validate(rec) if rec else None

    @staticmethod
    async def update_action_status(
        db: AsyncSession,
        action_id: str,
        status: Optional[Any] = None,
        notes: Optional[str] = None,
    ) -> Optional[SeoRecommendationResponse]:
        res = await db.execute(
            select(SeoRecommendation).where(SeoRecommendation.id == action_id)
        )
        rec = res.scalar_one_or_none()
        if not rec:
            return None

        if status:
            status_val = status.value if hasattr(status, "value") else str(status).lower()
            rec.status = status_val
            if rec.status == RecommendationStatus.FIXED.value:
                rec.resolved_at = datetime.now(timezone.utc)
            elif rec.status == RecommendationStatus.OPEN.value:
                rec.resolved_at = None

        if notes is not None:
            rec.notes = notes

        await db.commit()
        await db.refresh(rec)
        return SeoRecommendationResponse.model_validate(rec)

    @staticmethod
    async def bulk_update_status(
        db: AsyncSession,
        action_ids: List[str],
        status: Any,
        notes: Optional[str] = None,
    ) -> int:
        status_val = status.value if hasattr(status, "value") else str(status).lower()
        res = await db.execute(
            select(SeoRecommendation).where(SeoRecommendation.id.in_(action_ids))
        )
        recs = res.scalars().all()
        updated_count = 0
        now = datetime.now(timezone.utc)

        for r in recs:
            r.status = status_val
            if r.status == RecommendationStatus.FIXED.value:
                r.resolved_at = now
            elif r.status == RecommendationStatus.OPEN.value:
                r.resolved_at = None
            if notes is not None:
                r.notes = notes
            updated_count += 1

        await db.commit()
        return updated_count

    @staticmethod
    async def verify_recommendation(
        db: AsyncSession,
        action_id: str,
    ) -> VerifyFixResponse:
        """
        Re-verifies an optimization recommendation by safely fetching the affected URL
        and checking if the original issue is resolved.
        """
        res = await db.execute(
            select(SeoRecommendation)
            .where(SeoRecommendation.id == action_id)
            .options(selectinload(SeoRecommendation.project))
        )
        rec = res.scalar_one_or_none()
        if not rec:
            return VerifyFixResponse(
                recommendation_id=action_id,
                status="failed",
                message="Recommendation not found",
                is_fixed=False,
            )

        if not rec.affected_urls:
            rec.status = RecommendationStatus.FIXED.value
            rec.verification_status = "verified"
            rec.resolved_at = datetime.now(timezone.utc)
            await db.commit()
            return VerifyFixResponse(
                recommendation_id=action_id,
                status="verified",
                message="Verification passed. No remaining affected URLs.",
                is_fixed=True,
            )

        target_url = rec.affected_urls[0]
        issue_code = rec.issue_code

        # Domain boundary check
        if rec.project and rec.project.domain:
            from app.services.crawler.url_normalizer import is_internal_url
            if not is_internal_url(target_url, rec.project.domain):
                return VerifyFixResponse(
                    recommendation_id=action_id,
                    status="failed",
                    message=f"Verification rejected: Target URL '{target_url}' does not belong to project domain '{rec.project.domain}'.",
                    is_fixed=False,
                )

        http_client = AsyncCrawlerHttpClient(timeout=10)
        fetch_res = await http_client.fetch(target_url)

        is_fixed = False
        reason = ""

        if not fetch_res.is_success and fetch_res.status_code == 0:
            is_fixed = False
            reason = f"Verification failed: Could not fetch URL ({fetch_res.error or 'Connection error'})"
        elif issue_code in ["http_error_4xx", "http_error_5xx"]:
            is_fixed = (200 <= fetch_res.status_code < 400)
            reason = f"HTTP status code is {fetch_res.status_code}" if is_fixed else f"Server still returns HTTP {fetch_res.status_code}"
        else:
            parser = HTMLPageParser()
            base_dom = urlparse(target_url).netloc
            parsed_data = parser.parse(html=fetch_res.text, url=target_url, base_domain=base_dom)

            if issue_code == "missing_canonical":
                is_fixed = bool(parsed_data.canonical_url)
                reason = f"Canonical tag found: {parsed_data.canonical_url}" if is_fixed else "Canonical tag is still missing"
            elif issue_code == "missing_title":
                is_fixed = bool(parsed_data.title and len(parsed_data.title.strip()) > 5)
                reason = f"Title tag found: '{parsed_data.title}'" if is_fixed else "Title tag is still missing"
            elif issue_code == "missing_meta_description":
                is_fixed = bool(parsed_data.meta_description and len(parsed_data.meta_description.strip()) > 10)
                reason = f"Meta description found ({len(parsed_data.meta_description or '')} chars)" if is_fixed else "Meta description is still missing"
            elif issue_code == "missing_h1":
                is_fixed = bool(parsed_data.h1_count == 1)
                reason = "Single H1 tag found" if is_fixed else f"H1 count is {parsed_data.h1_count}"
            elif issue_code == "missing_image_alt":
                images_without_alt = [img for img in (parsed_data.images or []) if not img.get("alt")]
                is_fixed = len(images_without_alt) == 0
                reason = "All images have alt text" if is_fixed else f"{len(images_without_alt)} images still missing alt text"
            elif issue_code == "thin_content":
                word_count = parsed_data.word_count
                is_fixed = word_count >= 200
                reason = f"Word count is {word_count} words" if is_fixed else f"Word count is {word_count} words (thin content < 200)"
            else:
                is_fixed = (fetch_res.status_code == 200)
                reason = f"Target URL verified with HTTP {fetch_res.status_code}"

        if is_fixed:
            rec.status = RecommendationStatus.FIXED.value
            rec.verification_status = "verified"
            rec.resolved_at = datetime.now(timezone.utc)
            rec.verification_details = {"verified_at": datetime.now(timezone.utc).isoformat(), "reason": reason}
            await db.commit()
            return VerifyFixResponse(
                recommendation_id=action_id,
                status="verified",
                message=f"Verification successful: {reason}",
                is_fixed=True,
                details=rec.verification_details,
            )
        else:
            rec.verification_status = "failed"
            rec.verification_details = {"failed_at": datetime.now(timezone.utc).isoformat(), "reason": reason}
            await db.commit()
            return VerifyFixResponse(
                recommendation_id=action_id,
                status="not_fixed",
                message=f"Verification failed: {reason}",
                is_fixed=False,
                details=rec.verification_details,
            )

    @staticmethod
    async def get_project_summary(
        db: AsyncSession,
        project_id: str,
    ) -> SeoOptimizationSummaryResponse:
        """Calculates project-level Action Center summary KPIs, potential score, and category progress."""
        # Find latest completed scan
        scan_res = await db.execute(
            select(Scan)
            .where(Scan.project_id == project_id, Scan.status == ScanStatus.COMPLETED.value)
            .order_by(desc(Scan.created_at))
            .limit(1)
        )
        latest_scan = scan_res.scalar_one_or_none()
        current_score = latest_scan.overall_score if latest_scan else 70

        if latest_scan:
            await RecommendationEngine.generate_recommendations_for_scan(
                db, scan_id=latest_scan.id, project_id=project_id
            )

        # Query all recommendations for project (or latest scan)
        recs_query = select(SeoRecommendation).where(SeoRecommendation.project_id == project_id)
        if latest_scan:
            recs_query = recs_query.where(SeoRecommendation.scan_id == latest_scan.id)
        recs_query = recs_query.order_by(desc(SeoRecommendation.priority_score))

        recs_res = await db.execute(recs_query)
        recs = recs_res.scalars().all()

        total_actions = len(recs)
        critical_actions = sum(1 for r in recs if r.priority == RecommendationPriority.CRITICAL.value)
        high_priority_actions = sum(1 for r in recs if r.priority == RecommendationPriority.HIGH.value)
        medium_priority_actions = sum(1 for r in recs if r.priority == RecommendationPriority.MEDIUM.value)
        low_priority_actions = sum(1 for r in recs if r.priority == RecommendationPriority.LOW.value)

        in_progress_actions = sum(1 for r in recs if r.status == RecommendationStatus.IN_PROGRESS.value)
        fixed_actions = sum(1 for r in recs if r.status == RecommendationStatus.FIXED.value)
        ignored_actions = sum(1 for r in recs if r.status == RecommendationStatus.IGNORED.value)

        # Recoverable impact from open/in_progress actions
        open_impacts = [r.estimated_impact for r in recs if r.status in [RecommendationStatus.OPEN.value, RecommendationStatus.IN_PROGRESS.value]]
        curr_s, pot_s, est_impact = ImpactCalculator.calculate_potential_score(current_score, open_impacts)

        # Progress calculation
        effective_total = total_actions - ignored_actions
        optimization_progress = int(round((fixed_actions / effective_total) * 100)) if effective_total > 0 else (100 if total_actions > 0 else 0)

        # Category Progress Breakdown
        categories = ["technical", "metadata", "content", "links"]
        cat_breakdown: List[CategoryProgress] = []
        for cat in categories:
            cat_recs = [r for r in recs if r.category == cat]
            c_tot = len(cat_recs)
            c_fix = sum(1 for r in cat_recs if r.status == RecommendationStatus.FIXED.value)
            c_prog = int(round((c_fix / c_tot) * 100)) if c_tot > 0 else 100
            cat_breakdown.append(
                CategoryProgress(
                    category=cat.capitalize(),
                    total_actions=c_tot,
                    fixed_actions=c_fix,
                    progress_percentage=c_prog,
                )
            )

        top_opportunities = [SeoRecommendationResponse.model_validate(r) for r in recs[:5]]

        return SeoOptimizationSummaryResponse(
            project_id=project_id,
            scan_id=latest_scan.id if latest_scan else None,
            total_actions=total_actions,
            critical_actions=critical_actions,
            high_priority_actions=high_priority_actions,
            medium_priority_actions=medium_priority_actions,
            low_priority_actions=low_priority_actions,
            in_progress_actions=in_progress_actions,
            fixed_actions=fixed_actions,
            ignored_actions=ignored_actions,
            estimated_seo_impact=est_impact,
            current_seo_score=curr_s,
            potential_seo_score=pot_s,
            optimization_progress=optimization_progress,
            category_breakdown=cat_breakdown,
            top_opportunities=top_opportunities,
        )
