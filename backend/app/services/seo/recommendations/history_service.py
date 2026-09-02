from datetime import datetime, timezone
import logging
from typing import List, Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.optimization_history import OptimizationHistory
from app.models.scan import Scan, ScanStatus
from app.models.seo_issue import SeoIssue
from app.models.seo_page import SeoPage
from app.schemas.recommendation import OptimizationHistoryResponse

logger = logging.getLogger(__name__)


class OptimizationHistoryService:
    """Calculates and manages audit-to-audit comparisons."""

    @staticmethod
    async def record_audit_comparison(
        db: AsyncSession,
        project_id: str,
        current_scan_id: str,
    ) -> Optional[OptimizationHistory]:
        """Calculates score changes and issue diffs between consecutive completed scans."""
        curr_res = await db.execute(
            select(Scan)
            .where(Scan.id == current_scan_id)
            .options(selectinload(Scan.issues), selectinload(Scan.pages))
        )
        curr_scan = curr_res.scalar_one_or_none()
        if not curr_scan or curr_scan.overall_score is None:
            return None

        # Find previous completed scan
        prev_res = await db.execute(
            select(Scan)
            .where(
                Scan.project_id == project_id,
                Scan.status == ScanStatus.COMPLETED.value,
                Scan.id != current_scan_id,
                Scan.created_at <= curr_scan.created_at,
            )
            .order_by(desc(Scan.created_at), desc(Scan.id))
            .options(selectinload(Scan.issues), selectinload(Scan.pages))
            .limit(1)
        )
        prev_scan = prev_res.scalar_one_or_none()

        curr_score = curr_scan.overall_score or 0
        prev_score = prev_scan.overall_score if prev_scan else None
        score_change = (curr_score - prev_score) if prev_score is not None else 0

        # Query issues directly to avoid session caching issues
        curr_issues_res = await db.execute(select(SeoIssue).where(SeoIssue.scan_id == current_scan_id))
        curr_issues = curr_issues_res.scalars().all()
        curr_issues_codes = {(i.issue_code, i.title) for i in curr_issues}

        prev_issues = []
        if prev_scan:
            prev_issues_res = await db.execute(select(SeoIssue).where(SeoIssue.scan_id == prev_scan.id))
            prev_issues = prev_issues_res.scalars().all()
        prev_issues_codes = {(i.issue_code, i.title) for i in prev_issues}

        issues_before = len(prev_issues)
        issues_after = len(curr_issues)

        # Diff issues
        resolved_set = prev_issues_codes - curr_issues_codes
        new_set = curr_issues_codes - prev_issues_codes
        remaining_set = curr_issues_codes & prev_issues_codes

        issues_resolved = len(resolved_set)
        new_issues = len(new_set)
        remaining_issues = len(remaining_set)

        # Page comparisons
        pages_improved = 0
        pages_declined = 0
        if prev_scan:
            curr_pages_res = await db.execute(select(SeoPage).where(SeoPage.scan_id == current_scan_id))
            curr_pages = curr_pages_res.scalars().all()
            prev_pages_res = await db.execute(select(SeoPage).where(SeoPage.scan_id == prev_scan.id))
            prev_pages = prev_pages_res.scalars().all()

            prev_pages_map = {p.url: p for p in prev_pages}
            for cp in curr_pages:
                if cp.url in prev_pages_map:
                    pp = prev_pages_map[cp.url]
                    if (cp.overall_score or 0) > (pp.overall_score or 0):
                        pages_improved += 1
                    elif (cp.overall_score or 0) < (pp.overall_score or 0):
                        pages_declined += 1

        # Category score deltas
        cat_changes = {}
        if prev_scan:
            for cat in ["technical", "indexability", "metadata", "links"]:
                curr_c_score = getattr(curr_scan, f"{cat}_score", None)
                prev_c_score = getattr(prev_scan, f"{cat}_score", None)
                if curr_c_score is not None and prev_c_score is not None:
                    cat_changes[cat] = curr_c_score - prev_c_score

        history = OptimizationHistory(
            project_id=project_id,
            scan_id=current_scan_id,
            previous_scan_id=prev_scan.id if prev_scan else None,
            previous_score=prev_score,
            current_score=curr_score,
            score_change=score_change,
            issues_before=issues_before,
            issues_after=issues_after,
            issues_resolved=issues_resolved,
            new_issues=new_issues,
            remaining_issues=remaining_issues,
            pages_improved=pages_improved,
            pages_declined=pages_declined,
            category_score_changes=cat_changes,
            details={
                "resolved_issue_titles": [t for _, t in resolved_set][:10],
                "new_issue_titles": [t for _, t in new_set][:10],
            },
        )
        db.add(history)
        await db.commit()
        await db.refresh(history)
        return history

    @staticmethod
    async def get_project_history(
        db: AsyncSession,
        project_id: str,
        limit: int = 20,
    ) -> List[OptimizationHistoryResponse]:
        query = (
            select(OptimizationHistory)
            .where(OptimizationHistory.project_id == project_id)
            .order_by(desc(OptimizationHistory.created_at))
            .limit(limit)
        )
        res = await db.execute(query)
        rows = res.scalars().all()
        return [OptimizationHistoryResponse.model_validate(r) for r in rows]
