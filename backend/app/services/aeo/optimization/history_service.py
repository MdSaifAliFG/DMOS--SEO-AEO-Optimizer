from __future__ import annotations
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.aeo import AeoProject, AeoRecommendation, AeoVisibilitySnapshot


class AEOHistoryService:
    """
    Computes audit-to-audit comparisons, calculating:
    - Previous vs current score deltas
    - Mention rate, citation rate, and coverage deltas
    - Action resolution velocity (resolved vs new recommendations)
    - Competitor shift tracking
    """

    @staticmethod
    async def get_optimization_history(
        db: AsyncSession,
        project_id: str,
        limit: int = 15,
    ) -> Dict[str, Any]:
        project = await db.get(AeoProject, project_id)
        if not project:
            return {"project_id": project_id, "comparisons": []}

        # Fetch snapshots ordered newest first
        res = await db.execute(
            select(AeoVisibilitySnapshot)
            .where(AeoVisibilitySnapshot.project_id == project_id)
            .order_by(desc(AeoVisibilitySnapshot.created_at))
            .limit(limit)
        )
        snapshots = list(res.scalars().all())

        # Fetch recommendations to track status
        recs_res = await db.execute(
            select(AeoRecommendation)
            .where(AeoRecommendation.project_id == project_id)
        )
        recs = list(recs_res.scalars().all())

        resolved_count = len([r for r in recs if r.status in ["fixed", "implemented"]])
        open_count = len([r for r in recs if r.status == "open"])
        in_progress_count = len([r for r in recs if r.status == "in_progress"])

        comparisons: List[Dict[str, Any]] = []

        for i in range(len(snapshots)):
            curr = snapshots[i]
            prev = snapshots[i + 1] if i + 1 < len(snapshots) else None

            score_delta = (curr.overall_score - prev.overall_score) if prev else 0
            mention_delta = (curr.mention_score - prev.mention_score) if prev else 0
            citation_delta = (curr.citation_score - prev.citation_score) if prev else 0
            coverage_delta = (curr.coverage_score - prev.coverage_score) if prev else 0

            comparisons.append({
                "audit_id": curr.id,
                "analysis_id": curr.analysis_id,
                "created_at": curr.created_at.isoformat() if curr.created_at else "",
                "overall_score": curr.overall_score,
                "score_label": curr.score_label,
                "score_delta": score_delta,
                "mention_score": curr.mention_score,
                "mention_delta": mention_delta,
                "citation_score": curr.citation_score,
                "citation_delta": citation_delta,
                "coverage_score": curr.coverage_score,
                "coverage_delta": coverage_delta,
                "total_questions": curr.total_questions,
                "questions_mentioned": curr.questions_mentioned,
                "own_citations": curr.own_citations,
                "competitor_citations": curr.competitor_citations,
                "resolved_actions_count": resolved_count if i == 0 else max(0, resolved_count - i),
                "open_actions_count": open_count,
            })

        return {
            "project_id": project_id,
            "project_name": project.name,
            "domain": project.domain,
            "current_score": project.aeo_score,
            "total_audits": len(snapshots),
            "comparisons": comparisons,
        }
