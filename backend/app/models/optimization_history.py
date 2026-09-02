from typing import TYPE_CHECKING, Any, Dict, Optional
from sqlalchemy import Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.scan import Scan


class OptimizationHistory(Base, TimestampMixin):
    """Tracks audit-to-audit score improvements and resolved/new issues."""
    __tablename__ = "optimization_history"

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
    previous_scan_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("scans.id", ondelete="SET NULL"),
        nullable=True,
    )

    previous_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    current_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    score_change: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    issues_before: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    issues_after: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    issues_resolved: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    new_issues: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    remaining_issues: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    pages_improved: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    pages_declined: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    category_score_changes: Mapped[Dict[str, int]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    details: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )

    # Relationships
    project: Mapped["Project"] = relationship(
        "Project",
        lazy="joined",
    )
    scan: Mapped["Scan"] = relationship(
        "Scan",
        foreign_keys=[scan_id],
        lazy="joined",
    )
    previous_scan: Mapped[Optional["Scan"]] = relationship(
        "Scan",
        foreign_keys=[previous_scan_id],
        lazy="joined",
    )
