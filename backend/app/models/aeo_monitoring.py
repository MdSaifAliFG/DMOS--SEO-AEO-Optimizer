from __future__ import annotations
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class MonitoringFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class AeoChangeEventSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class AeoChangeEventType(str, Enum):
    SCORE_DROP = "SCORE_DROP"
    SCORE_INCREASE = "SCORE_INCREASE"
    MENTION_LOST = "MENTION_LOST"
    MENTION_GAINED = "MENTION_GAINED"
    CITATION_LOST = "CITATION_LOST"
    CITATION_GAINED = "CITATION_GAINED"
    COMPETITOR_GAIN = "COMPETITOR_GAIN"
    COMPETITOR_LOSS = "COMPETITOR_LOSS"
    PROMPT_COVERAGE_DROP = "PROMPT_COVERAGE_DROP"
    PROMPT_COVERAGE_GAIN = "PROMPT_COVERAGE_GAIN"
    ENTITY_CHANGE = "ENTITY_CHANGE"
    PROVIDER_CHANGE = "PROVIDER_CHANGE"


class AeoAlertSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class AeoAlertStatus(str, Enum):
    NEW = "new"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


class AeoMonitoringSchedule(Base, TimestampMixin):
    """Configuration and execution schedule for automated continuous AEO monitoring."""
    __tablename__ = "aeo_monitoring_schedules"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("aeo_projects.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    frequency: Mapped[str] = mapped_column(
        String(50),
        default=MonitoringFrequency.WEEKLY.value,
        nullable=False,
    )
    enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    selected_engines: Mapped[List[str]] = mapped_column(
        JSON,
        default=lambda: ["chatgpt", "gemini", "perplexity"],
        nullable=False,
    )
    alert_thresholds: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "score_drop": 5,
            "critical_score_drop": 10,
            "mention_drop": 10,
            "citation_drop": 10,
            "competitor_growth": 10,
        },
        nullable=False,
    )
    last_run_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    next_run_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    last_status: Mapped[Optional[str]] = mapped_column(
        String(50),
        default=None,
        nullable=True,
    )
    last_error: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )


class AeoEngineSnapshot(Base, TimestampMixin):
    """Historical snapshot of a specific AI answer engine's performance for a project."""
    __tablename__ = "aeo_engine_snapshots"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("aeo_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("aeo_analyses.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    score: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    mention_rate: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    citation_rate: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    coverage_rate: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    average_position: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    questions_tested: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    questions_mentioned: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    citations_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )


class AeoCompetitorSnapshot(Base, TimestampMixin):
    """Historical snapshot of competitor visibility and AI Answer Share of Voice."""
    __tablename__ = "aeo_competitor_snapshots"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("aeo_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("aeo_analyses.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    competitor: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    provider: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    mention_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    citation_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    share_of_voice: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    average_position: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )


class AeoPromptSnapshot(Base, TimestampMixin):
    """Snapshot of a single tracked prompt's visibility status at a specific analysis point."""
    __tablename__ = "aeo_prompt_snapshots"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("aeo_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("aeo_questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("aeo_analyses.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    mentioned: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    position: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    citation_found: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    visibility_score: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )


class AeoChangeEvent(Base, TimestampMixin):
    """Intelligence event recording significant visibility deltas between analyses."""
    __tablename__ = "aeo_change_events"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("aeo_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("aeo_analyses.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    event_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    severity: Mapped[str] = mapped_column(
        String(50),
        default=AeoChangeEventSeverity.INFO.value,
        nullable=False,
        index=True,
    )
    provider: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    previous_value: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    current_value: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    delta: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    percentage_delta: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    related_prompt_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        nullable=True,
    )
    related_competitor: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    related_recommendation_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        nullable=True,
    )
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )


class AeoAlert(Base, TimestampMixin):
    """High-priority monitoring alert requiring user attention."""
    __tablename__ = "aeo_alerts"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("aeo_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    change_event_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("aeo_change_events.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    severity: Mapped[str] = mapped_column(
        String(50),
        default=AeoAlertSeverity.MEDIUM.value,
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=AeoAlertStatus.NEW.value,
        nullable=False,
        index=True,
    )
    provider: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
