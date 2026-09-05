from __future__ import annotations
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.aeo import AeoProject, AeoVisibilitySnapshot
from app.models.aeo_monitoring import AeoEngineSnapshot


class AEOTrendEngine:
    """
    Deterministic Historical Trend Calculation Engine.
    Aggregates real AeoVisibilitySnapshot records over specified time ranges
    without fabricating data points or interpolating artificial metrics.
    """

    @classmethod
    async def get_project_trends(
        cls,
        db: AsyncSession,
        project_id: str,
        time_range: str = "30d",
    ) -> Dict[str, Any]:
        """
        Retrieves real historical snapshots filtered by range ('7d', '30d', '90d', 'all')
        and calculates deterministic trend directions and deltas.
        """
        now = datetime.now(timezone.utc)
        since_date: Optional[datetime] = None
        if time_range == "7d":
            since_date = now - timedelta(days=7)
        elif time_range == "30d":
            since_date = now - timedelta(days=30)
        elif time_range == "90d":
            since_date = now - timedelta(days=90)
        # 'all' leaves since_date as None

        query = select(AeoVisibilitySnapshot).where(AeoVisibilitySnapshot.project_id == project_id)
        if since_date:
            query = query.where(AeoVisibilitySnapshot.created_at >= since_date)
        query = query.order_by(AeoVisibilitySnapshot.created_at.asc())

        res = await db.execute(query)
        snapshots = list(res.scalars().all())

        if not snapshots:
            return {
                "project_id": project_id,
                "time_range": time_range,
                "has_enough_data": False,
                "message": "Not enough historical data to generate a trend.",
                "points_count": 0,
                "score_change": 0,
                "trend_direction": "stable",
                "timeline": [],
            }

        timeline: List[Dict[str, Any]] = []
        for snap in snapshots:
            t_questions = max(1, snap.total_questions)
            t_citations = max(1, snap.total_citations)
            mention_rate = round((snap.questions_mentioned / t_questions * 100), 1)
            citation_rate = round((snap.own_citations / t_citations * 100), 1) if snap.total_citations > 0 else 0.0

            timeline.append({
                "id": snap.id,
                "date": snap.created_at.strftime("%Y-%m-%d"),
                "timestamp": snap.created_at.isoformat(),
                "overall_score": snap.overall_score,
                "mention_score": snap.mention_score,
                "citation_score": snap.citation_score,
                "position_score": snap.position_score,
                "coverage_score": snap.coverage_score,
                "mention_rate": mention_rate,
                "citation_rate": citation_rate,
                "average_position": snap.average_position,
                "total_questions": snap.total_questions,
                "questions_mentioned": snap.questions_mentioned,
            })

        first_score = timeline[0]["overall_score"]
        last_score = timeline[-1]["overall_score"]
        score_change = last_score - first_score

        trend_dir = "stable"
        if score_change >= 3:
            trend_dir = "improving"
        elif score_change <= -3:
            trend_dir = "declining"

        has_enough = len(timeline) >= 2

        return {
            "project_id": project_id,
            "time_range": time_range,
            "has_enough_data": has_enough,
            "message": "Trend computed successfully." if has_enough else "Only 1 historical point recorded. Run another analysis to track progression.",
            "points_count": len(timeline),
            "score_change": score_change,
            "trend_direction": trend_dir,
            "first_score": first_score,
            "current_score": last_score,
            "timeline": timeline,
        }
