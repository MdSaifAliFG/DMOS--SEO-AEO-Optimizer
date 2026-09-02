from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any, Dict, List, Optional
from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.scan import Scan
    from app.models.seo_issue import SeoIssue
    from app.models.seo_page import SeoPage


class RecommendationPriority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RecommendationStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    FIXED = "fixed"
    IGNORED = "ignored"


class RecommendationEffort(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class SeoRecommendation(Base, TimestampMixin):
    """Actionable SEO optimization recommendation generated from audit findings."""
    __tablename__ = "seo_recommendations"

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
    scan_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("scans.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    issue_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("seo_issues.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    page_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("seo_pages.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    issue_code: Mapped[str] = mapped_column(
        String(100),
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
    why_it_matters: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    how_to_fix: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    priority: Mapped[str] = mapped_column(
        String(50),
        default=RecommendationPriority.MEDIUM.value,
        nullable=False,
        index=True,
    )
    priority_score: Mapped[float] = mapped_column(
        Float,
        default=50.0,
        nullable=False,
    )
    estimated_impact: Mapped[float] = mapped_column(
        Float,
        default=1.0,
        nullable=False,
    )
    effort: Mapped[str] = mapped_column(
        String(50),
        default=RecommendationEffort.MEDIUM.value,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecommendationStatus.OPEN.value,
        nullable=False,
        index=True,
    )
    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    affected_pages_count: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )
    affected_urls: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    current_state: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    recommended_state: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Verification
    verification_status: Mapped[str] = mapped_column(
        String(50),
        default="unverified",  # unverified, verified, failed
        nullable=False,
    )
    verification_details: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    project: Mapped["Project"] = relationship(
        "Project",
        lazy="joined",
    )
    scan: Mapped["Scan"] = relationship(
        "Scan",
        lazy="joined",
    )
    issue: Mapped[Optional["SeoIssue"]] = relationship(
        "SeoIssue",
        lazy="joined",
    )
    page: Mapped[Optional["SeoPage"]] = relationship(
        "SeoPage",
        lazy="joined",
    )
