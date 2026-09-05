from __future__ import annotations
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.aeo import AeoProject
from app.models.aeo_monitoring import (
    AeoAlert,
    AeoAlertSeverity,
    AeoAlertStatus,
    AeoChangeEvent,
    AeoChangeEventType,
    AeoMonitoringSchedule,
)

logger = logging.getLogger(__name__)

# Configurable Default Thresholds
DEFAULT_ALERT_THRESHOLDS = {
    "score_drop": 5,
    "critical_score_drop": 10,
    "mention_drop": 10.0,
    "citation_drop": 10.0,
    "competitor_growth": 10.0,
}


class AEOAlertEngine:
    """
    Deterministic Alert Engine for AEO monitoring.
    Evaluates detected AeoChangeEvents against configurable thresholds
    to generate actionable AeoAlert records with lifecycle management.
    """

    @classmethod
    async def process_change_events(
        cls,
        db: AsyncSession,
        project: AeoProject,
        change_events: List[AeoChangeEvent],
        schedule: Optional[AeoMonitoringSchedule] = None,
    ) -> List[AeoAlert]:
        """
        Translates significant change events into high-priority alerts based on project thresholds.
        """
        thresholds = dict(DEFAULT_ALERT_THRESHOLDS)
        if schedule and schedule.alert_thresholds:
            thresholds.update(schedule.alert_thresholds)

        alerts_to_create: List[AeoAlert] = []

        for event in change_events:
            # 1. Critical Prompt Visibility Loss
            if event.event_type == AeoChangeEventType.MENTION_LOST.value and event.severity == "critical":
                alerts_to_create.append(
                    AeoAlert(
                        project_id=project.id,
                        change_event_id=event.id,
                        type="PROMPT_VISIBILITY_LOST",
                        severity=AeoAlertSeverity.CRITICAL.value,
                        title="Critical: Brand Lost Visibility on Prompt",
                        description=event.description,
                        provider=event.provider,
                        status=AeoAlertStatus.NEW.value,
                    )
                )

            # 2. Severe Score Drop
            elif event.event_type == AeoChangeEventType.SCORE_DROP.value:
                crit_threshold = thresholds.get("critical_score_drop", 10)
                high_threshold = thresholds.get("score_drop", 5)
                drop_abs = abs(event.delta) if event.delta is not None else 0

                if drop_abs >= crit_threshold:
                    alerts_to_create.append(
                        AeoAlert(
                            project_id=project.id,
                            change_event_id=event.id,
                            type="AEO_SCORE_CRITICAL_DROP",
                            severity=AeoAlertSeverity.CRITICAL.value,
                            title=f"Critical Score Drop: -{int(drop_abs)} Points",
                            description=event.description,
                            provider=event.provider,
                            status=AeoAlertStatus.NEW.value,
                        )
                    )
                elif drop_abs >= high_threshold:
                    alerts_to_create.append(
                        AeoAlert(
                            project_id=project.id,
                            change_event_id=event.id,
                            type="AEO_SCORE_DECLINE",
                            severity=AeoAlertSeverity.HIGH.value,
                            title=f"Score Decline: -{int(drop_abs)} Points",
                            description=event.description,
                            provider=event.provider,
                            status=AeoAlertStatus.NEW.value,
                        )
                    )

            # 3. Competitor Share of Voice Surge
            elif event.event_type == AeoChangeEventType.COMPETITOR_GAIN.value and event.delta:
                comp_threshold = thresholds.get("competitor_growth", 10.0)
                if event.delta >= comp_threshold:
                    alerts_to_create.append(
                        AeoAlert(
                            project_id=project.id,
                            change_event_id=event.id,
                            type="COMPETITOR_SOV_SURGE",
                            severity=AeoAlertSeverity.HIGH.value,
                            title=f"Competitor Surge: {event.related_competitor} +{event.delta}% SoV",
                            description=event.description,
                            provider=event.provider,
                            status=AeoAlertStatus.NEW.value,
                        )
                    )

            # 4. Citation Loss
            elif event.event_type == AeoChangeEventType.CITATION_LOST.value and event.severity in ("high", "critical"):
                alerts_to_create.append(
                    AeoAlert(
                        project_id=project.id,
                        change_event_id=event.id,
                        type="CITATION_DISAPPEARED",
                        severity=AeoAlertSeverity.HIGH.value,
                        title="AI Citation Disappeared",
                        description=event.description,
                        provider=event.provider,
                        status=AeoAlertStatus.NEW.value,
                    )
                )

        # Persist alerts
        for alert in alerts_to_create:
            db.add(alert)

        return alerts_to_create

    @classmethod
    async def acknowledge_alert(
        cls,
        db: AsyncSession,
        alert_id: str,
    ) -> Optional[AeoAlert]:
        """Marks an alert as acknowledged without removing it from history."""
        alert = await db.get(AeoAlert, alert_id)
        if not alert:
            return None
        alert.status = AeoAlertStatus.ACKNOWLEDGED.value
        alert.acknowledged_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(alert)
        return alert

    @classmethod
    async def resolve_alert(
        cls,
        db: AsyncSession,
        alert_id: str,
    ) -> Optional[AeoAlert]:
        """Marks an alert as resolved with timestamp."""
        alert = await db.get(AeoAlert, alert_id)
        if not alert:
            return None
        alert.status = AeoAlertStatus.RESOLVED.value
        alert.resolved_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(alert)
        return alert

    @classmethod
    async def get_alerts_for_project(
        cls,
        db: AsyncSession,
        project_id: str,
        status: Optional[str] = None,
        severity: Optional[str] = None,
        limit: int = 50,
    ) -> List[AeoAlert]:
        query = select(AeoAlert).where(AeoAlert.project_id == project_id)
        if status and status != "all":
            query = query.where(AeoAlert.status == status)
        if severity and severity != "all":
            query = query.where(AeoAlert.severity == severity)
        query = query.order_by(desc(AeoAlert.created_at)).limit(limit)

        res = await db.execute(query)
        return list(res.scalars().all())
