from __future__ import annotations
from datetime import datetime, timedelta, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.aeo import AeoProject
from app.models.aeo_monitoring import AeoMonitoringSchedule, MonitoringFrequency

logger = logging.getLogger(__name__)


class AEOScheduleService:
    """
    Manages automated monitoring schedules, frequency calculations,
    and threshold validations for continuous AEO tracking.
    """

    @classmethod
    async def get_or_create_schedule(
        cls,
        db: AsyncSession,
        project_id: str,
    ) -> AeoMonitoringSchedule:
        """Retrieves an existing schedule or creates a default weekly schedule."""
        res = await db.execute(
            select(AeoMonitoringSchedule).where(AeoMonitoringSchedule.project_id == project_id)
        )
        schedule = res.scalar_one_or_none()
        if not schedule:
            now = datetime.now(timezone.utc)
            schedule = AeoMonitoringSchedule(
                project_id=project_id,
                frequency=MonitoringFrequency.WEEKLY.value,
                enabled=True,
                selected_engines=["chatgpt", "gemini", "perplexity"],
                alert_thresholds={
                    "score_drop": 5,
                    "critical_score_drop": 10,
                    "mention_drop": 10.0,
                    "citation_drop": 10.0,
                    "competitor_growth": 10.0,
                },
                next_run_at=now + timedelta(days=7),
            )
            db.add(schedule)
            await db.commit()
            await db.refresh(schedule)

        return schedule

    @classmethod
    async def update_schedule(
        cls,
        db: AsyncSession,
        project_id: str,
        frequency: Optional[str] = None,
        enabled: Optional[bool] = None,
        selected_engines: Optional[List[str]] = None,
        alert_thresholds: Optional[Dict[str, Any]] = None,
    ) -> AeoMonitoringSchedule:
        """
        Updates schedule configuration with strict validation on threshold limits (0-100).
        """
        schedule = await cls.get_or_create_schedule(db, project_id)

        if frequency is not None:
            freq = frequency.lower()
            if freq not in [f.value for f in MonitoringFrequency]:
                raise ValueError(f"Invalid frequency '{frequency}'. Must be 'daily', 'weekly', or 'monthly'.")
            schedule.frequency = freq
            # Recalculate next_run_at
            schedule.next_run_at = cls.calculate_next_run(schedule.frequency, schedule.last_run_at)

        if enabled is not None:
            schedule.enabled = enabled

        if selected_engines is not None:
            schedule.selected_engines = selected_engines

        if alert_thresholds is not None:
            # Validate thresholds (0 - 100)
            validated_thresholds = dict(schedule.alert_thresholds or {})
            for k, v in alert_thresholds.items():
                val = float(v)
                if val < 0 or val > 100:
                    raise ValueError(f"Alert threshold '{k}' value {val} must be between 0 and 100.")
                validated_thresholds[k] = val
            schedule.alert_thresholds = validated_thresholds

        schedule.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(schedule)
        return schedule

    @classmethod
    def calculate_next_run(
        cls,
        frequency: str,
        last_run_at: Optional[datetime] = None,
    ) -> datetime:
        """Calculates future execution timestamp based on frequency setting."""
        base = last_run_at or datetime.now(timezone.utc)
        if frequency == MonitoringFrequency.DAILY.value:
            return base + timedelta(days=1)
        elif frequency == MonitoringFrequency.MONTHLY.value:
            return base + timedelta(days=30)
        else:  # weekly default
            return base + timedelta(days=7)
