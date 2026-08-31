from enum import Enum
from typing import TYPE_CHECKING, Any, Dict, Optional
from sqlalchemy import ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.scan import Scan
    from app.models.seo_page import SeoPage


class IssueSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class IssueCategory(str, Enum):
    TECHNICAL = "technical"
    INDEXABILITY = "indexability"
    METADATA = "metadata"
    LINKS = "links"


class IssueStatus(str, Enum):
    OPEN = "open"
    RESOLVED = "resolved"
    IGNORED = "ignored"


class SeoIssue(Base, TimestampMixin):
    """Detected technical SEO issue model."""
    __tablename__ = "seo_issues"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    scan_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("scans.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    page_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("seo_pages.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    issue_code: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    category: Mapped[str] = mapped_column(
        String(50),
        default=IssueCategory.TECHNICAL.value,
        nullable=False,
        index=True,
    )
    severity: Mapped[str] = mapped_column(
        String(50),
        default=IssueSeverity.MEDIUM.value,
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
    recommendation: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    details: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=IssueStatus.OPEN.value,
        nullable=False,
    )

    # Relationships
    scan: Mapped["Scan"] = relationship(
        "Scan",
        back_populates="issues",
    )
    page: Mapped[Optional["SeoPage"]] = relationship(
        "SeoPage",
        back_populates="issues",
        lazy="joined",
    )
