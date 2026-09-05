from __future__ import annotations
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.aeo import (
    AeoAnalysis,
    AeoAnswer,
    AeoCitation,
    AeoProject,
    AeoQuestion,
)
from app.models.aeo_monitoring import (
    AeoAlert,
    AeoChangeEvent,
    AeoMonitoringSchedule,
)
from app.services.aeo.monitoring.alert_engine import AEOAlertEngine
from app.services.aeo.monitoring.change_detector import AEOChangeDetector
from app.services.aeo.monitoring.schedule_service import AEOScheduleService
from app.services.aeo.monitoring.snapshot_service import AEOSnapshotService

logger = logging.getLogger(__name__)


class AEOMonitoringEngine:
    """
    Central Orchestrator for Phase 7 Continuous AEO Monitoring.
    Unifies snapshot persistence, change detection, alert triggering,
    and schedule state updates following every completed AEO analysis.
    """

    @classmethod
    async def process_analysis_completion(
        cls,
        db: AsyncSession,
        project: AeoProject,
        analysis: AeoAnalysis,
        answers: List[AeoAnswer],
        citations: List[AeoCitation],
        questions: List[AeoQuestion],
        detected_positions: Optional[Dict[str, int]] = None,
    ) -> Dict[str, Any]:
        """
        Executed immediately upon analysis completion.
        1. Generates engine, competitor, and prompt snapshots.
        2. Detects changes between this analysis and the previous completed analysis.
        3. Generates high-priority alerts for threshold violations.
        4. Updates monitoring schedule execution timestamps.
        """
        logger.info(f"[AEOMonitoringEngine] Processing monitoring lifecycle for project {project.id} ({project.name})")

        # Step 1: Snapshots
        snapshot_counts = await AEOSnapshotService.create_all_snapshots(
            db=db,
            project=project,
            analysis=analysis,
            answers=answers,
            citations=citations,
            questions=questions,
            detected_positions=detected_positions,
        )

        # Step 2: Change Detection
        change_events = await AEOChangeDetector.detect_changes(
            db=db,
            project=project,
            current_analysis=analysis,
        )

        # Step 3: Alerts Generation
        schedule_res = await db.execute(
            select(AeoMonitoringSchedule).where(AeoMonitoringSchedule.project_id == project.id)
        )
        schedule = schedule_res.scalar_one_or_none()
        alerts = await AEOAlertEngine.process_change_events(
            db=db,
            project=project,
            change_events=change_events,
            schedule=schedule,
        )

        # Step 4: Update Schedule Status
        if schedule:
            schedule.last_run_at = datetime.now(timezone.utc)
            schedule.next_run_at = AEOScheduleService.calculate_next_run(schedule.frequency, schedule.last_run_at)
            schedule.last_status = "success"
            schedule.last_error = None
        else:
            schedule = await AEOScheduleService.get_or_create_schedule(db, project.id)
            schedule.last_run_at = datetime.now(timezone.utc)
            schedule.last_status = "success"

        await db.commit()

        return {
            "snapshots_created": snapshot_counts,
            "changes_detected": len(change_events),
            "alerts_generated": len(alerts),
            "next_run_at": schedule.next_run_at.isoformat() if schedule.next_run_at else None,
        }
