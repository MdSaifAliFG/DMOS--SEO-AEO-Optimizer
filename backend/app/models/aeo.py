from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class AeoIntent(str, Enum):
    INFORMATIONAL = "informational"
    COMMERCIAL = "commercial"
    TRANSACTIONAL = "transactional"
    NAVIGATIONAL = "navigational"


class AeoEngine(str, Enum):
    CHATGPT = "chatgpt"
    PERPLEXITY = "perplexity"
    GOOGLE_AI = "google_ai"
    GEMINI = "gemini"
    COPILOT = "copilot"


class AeoProject(Base, TimestampMixin):
    """AEO Project Model (Completely independent from SEO project)."""
    __tablename__ = "aeo_projects"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    domain: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    aeo_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        default=None,
        nullable=True,
    )
    settings: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )

    # Relationships
    questions: Mapped[List["AeoQuestion"]] = relationship(
        "AeoQuestion",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    citations: Mapped[List["AeoCitation"]] = relationship(
        "AeoCitation",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    entities: Mapped[List["AeoEntity"]] = relationship(
        "AeoEntity",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class AeoQuestion(Base, TimestampMixin):
    """Tracked user question / AI prompt model."""
    __tablename__ = "aeo_questions"

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
    question_text: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
        index=True,
    )
    category: Mapped[str] = mapped_column(
        String(100),
        default="General",
        nullable=False,
    )
    intent: Mapped[str] = mapped_column(
        String(50),
        default=AeoIntent.INFORMATIONAL.value,
        nullable=False,
    )
    is_tracked: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    visibility_status: Mapped[str] = mapped_column(
        String(50),
        default="visible",  # visible, partial, not_visible
        nullable=False,
    )
    visibility_score: Mapped[int] = mapped_column(
        Integer,
        default=75,
        nullable=False,
    )
    trend_change: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    last_checked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="questions",
    )
    citations: Mapped[List["AeoCitation"]] = relationship(
        "AeoCitation",
        back_populates="question",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class AeoCitation(Base, TimestampMixin):
    """Extracted Citation Source model from Answer Engines."""
    __tablename__ = "aeo_citations"

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
    question_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("aeo_questions.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    engine: Mapped[str] = mapped_column(
        String(50),
        default=AeoEngine.CHATGPT.value,
        nullable=False,
    )
    source_url: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
    )
    domain: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    citation_status: Mapped[str] = mapped_column(
        String(50),
        default="cited",  # cited, referenced, mentioned
        nullable=False,
    )
    citation_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="citations",
    )
    question: Mapped[Optional["AeoQuestion"]] = relationship(
        "AeoQuestion",
        back_populates="citations",
    )


class AeoEntity(Base, TimestampMixin):
    """Knowledge Graph Entity model for brand, product, and topic analysis."""
    __tablename__ = "aeo_entities"

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
    entity_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    entity_type: Mapped[str] = mapped_column(
        String(100),
        default="Brand",  # Brand, Product, Feature, Organization, Topic
        nullable=False,
    )
    mentions_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    visibility_rate: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="entities",
    )
