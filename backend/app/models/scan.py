from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any, Dict, List, Optional
from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.seo_page import SeoPage
    from app.models.seo_issue import SeoIssue


class ScanStatus(str, Enum):
    QUEUED = "queued"
    INITIALIZING = "initializing"
    CRAWLING = "crawling"
    ANALYZING = "analyzing"
    SCORING = "scoring"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ScanType(str, Enum):
    FULL_AUDIT = "full_audit"
    TECHNICAL_SEO = "technical_seo"
    QUICK_SCAN = "quick_scan"


class Scan(Base, TimestampMixin):
    """Scan / Audit execution model."""
    __tablename__ = "scans"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    target_url: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
    )
    scan_type: Mapped[str] = mapped_column(
        String(50),
        default=ScanType.FULL_AUDIT.value,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=ScanStatus.QUEUED.value,
        index=True,
        nullable=False,
    )
    progress: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    current_step: Mapped[str] = mapped_column(
        String(255),
        default="Scan initialized and queued in orchestration pipeline",
        nullable=False,
    )
    logs: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    meta_data: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Phase 2 Crawler & Audit Stats
    pages_discovered: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    pages_crawled: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    pages_failed: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    pages_skipped: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    issues_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # Phase 2 Scores
    overall_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    technical_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    indexability_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    metadata_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    links_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    score_breakdown: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    crawl_duration: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )

    # Timestamps
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    project: Mapped["Project"] = relationship(
        "Project",
        back_populates="scans",
        lazy="joined",
    )
    pages: Mapped[List["SeoPage"]] = relationship(
        "SeoPage",
        back_populates="scan",
        cascade="all, delete-orphan",
        order_by="SeoPage.created_at",
        lazy="selectin",
    )
    issues: Mapped[List["SeoIssue"]] = relationship(
        "SeoIssue",
        back_populates="scan",
        cascade="all, delete-orphan",
        order_by="SeoIssue.created_at",
        lazy="selectin",
    )
