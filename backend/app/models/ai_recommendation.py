from typing import Any, Dict, Optional
from sqlalchemy import ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class AiRecommendation(Base, TimestampMixin):
    """Stores AI or rule-based generated metadata/content suggestions."""
    __tablename__ = "ai_recommendations"

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
    page_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("seo_pages.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    recommendation_type: Mapped[str] = mapped_column(
        String(50),  # title, description, content, internal_links
        nullable=False,
        index=True,
    )
    input_data: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    output_data: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(
        String(50),
        default="rule_based",
        nullable=False,
    )
    model: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
