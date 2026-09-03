from __future__ import annotations
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
    COMPARISON = "comparison"


class AeoEngine(str, Enum):
    CHATGPT = "chatgpt"
    PERPLEXITY = "perplexity"
    GOOGLE_AI = "google_ai"
    GEMINI = "gemini"
    CLAUDE = "claude"
    COPILOT = "copilot"


class AeoCitationType(str, Enum):
    OWN_DOMAIN = "own_domain"
    COMPETITOR = "competitor"
    THIRD_PARTY = "third_party"
    NEWS = "news"
    REVIEW = "review"
    DOCUMENTATION = "documentation"
    GOVERNMENT = "government"
    OTHER = "other"


class AeoAnalysisStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    COMPLETED_WITH_WARNINGS = "completed_with_warnings"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AeoProject(Base, TimestampMixin):
    """AEO Project Model."""
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
    brand_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    brand_aliases: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    industry: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    country: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    target_audience: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    target_language: Mapped[str] = mapped_column(
        String(20),
        default="en",
        nullable=False,
    )
    competitors: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
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
    score_label: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    mention_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    citation_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    position_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    coverage_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    last_analyzed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
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
    answers: Mapped[List["AeoAnswer"]] = relationship(
        "AeoAnswer",
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
    snapshots: Mapped[List["AeoVisibilitySnapshot"]] = relationship(
        "AeoVisibilitySnapshot",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(AeoVisibilitySnapshot.created_at)",
        lazy="selectin",
    )
    recommendations: Mapped[List["AeoRecommendation"]] = relationship(
        "AeoRecommendation",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    analyses: Mapped[List["AeoAnalysis"]] = relationship(
        "AeoAnalysis",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(AeoAnalysis.created_at)",
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
        index=True,
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
        default="untested",  # visible, partial, not_visible, untested
        nullable=False,
    )
    visibility_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    brand_mentioned: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    best_rank_position: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
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
    answers: Mapped[List["AeoAnswer"]] = relationship(
        "AeoAnswer",
        back_populates="question",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    citations: Mapped[List["AeoCitation"]] = relationship(
        "AeoCitation",
        back_populates="question",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class AeoAnswer(Base, TimestampMixin):
    """Raw collected AI answer from an Answer Engine provider."""
    __tablename__ = "aeo_answers"

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
    engine: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    model: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    answer_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    brand_mentioned: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )
    brand_position: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    mention_snippets: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    competitor_mentions: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    citations_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    latency_ms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    token_usage: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="success",  # success, provider_error, rate_limited
        nullable=False,
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="answers",
    )
    question: Mapped["AeoQuestion"] = relationship(
        "AeoQuestion",
        back_populates="answers",
    )
    analysis: Mapped[Optional["AeoAnalysis"]] = relationship(
        "AeoAnalysis",
        back_populates="answers",
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
        index=True,
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
    citation_type: Mapped[str] = mapped_column(
        String(50),
        default=AeoCitationType.THIRD_PARTY.value,
        nullable=False,
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
        index=True,
    )
    entity_type: Mapped[str] = mapped_column(
        String(100),
        default="Brand",  # Brand, Organization, Product, Service, Topic, Person, Location
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
    associated_concepts: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="entities",
    )


class AeoVisibilitySnapshot(Base, TimestampMixin):
    """Historical point-in-time AEO Visibility Snapshot."""
    __tablename__ = "aeo_visibility_snapshots"

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
        nullable=True,
    )
    overall_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    score_label: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    mention_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    citation_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    position_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    coverage_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    average_position: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    total_questions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    questions_mentioned: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    total_citations: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    own_citations: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    competitor_citations: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    engine_scores: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="snapshots",
    )


class AeoRecommendation(Base, TimestampMixin):
    """Actionable AEO optimization opportunities and recommendations."""
    __tablename__ = "aeo_recommendations"

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
    recommendation_code: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    category: Mapped[str] = mapped_column(
        String(100),
        default="Content Opportunity",
        nullable=False,
    )
    priority: Mapped[str] = mapped_column(
        String(50),
        default="medium",  # critical, high, medium, low
        nullable=False,
    )
    priority_score: Mapped[int] = mapped_column(
        Integer,
        default=70,
        nullable=False,
    )
    priority_level: Mapped[str] = mapped_column(
        String(50),
        default="medium",  # critical, high, medium, low
        nullable=False,
    )
    severity: Mapped[str] = mapped_column(
        String(50),
        default="medium",
        nullable=False,
    )
    opportunity_score: Mapped[int] = mapped_column(
        Integer,
        default=70,
        nullable=False,
    )
    reason: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    why_it_matters: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    current_state: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    recommended_action: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    how_to_fix: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    expected_impact: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    estimated_impact: Mapped[int] = mapped_column(
        Integer,
        default=5,
        nullable=False,
    )
    current_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    potential_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    affected_prompt_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    affected_answer_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    affected_urls: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    implementation_steps: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    verification_status: Mapped[str] = mapped_column(
        String(50),
        default="unverified",  # unverified, verified, failed
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="open",  # open, in_progress, fixed, ignored
        nullable=False,
    )
    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="recommendations",
    )


class AeoAnalysis(Base, TimestampMixin):
    """Orchestration model for in-flight and historical AEO analysis execution."""
    __tablename__ = "aeo_analyses"

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
    status: Mapped[str] = mapped_column(
        String(50),
        default=AeoAnalysisStatus.QUEUED.value,
        nullable=False,
        index=True,
    )
    progress: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    current_step: Mapped[str] = mapped_column(
        String(255),
        default="Queued for analysis",
        nullable=False,
    )
    logs: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    engines_analyzed: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    questions_analyzed_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    answers_collected_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    mentions_found_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    citations_found_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    overall_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    summary_data: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    project: Mapped["AeoProject"] = relationship(
        "AeoProject",
        back_populates="analyses",
    )
    answers: Mapped[List["AeoAnswer"]] = relationship(
        "AeoAnswer",
        back_populates="analysis",
        lazy="selectin",
    )
