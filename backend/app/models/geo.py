from __future__ import annotations
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class GeoProjectStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class GeoAnalysisStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    PARTIAL = "partial"
    FAILED = "failed"


class GeoCitationType(str, Enum):
    OWN_DOMAIN = "own_domain"
    COMPETITOR = "competitor"
    NEWS = "news"
    REVIEW = "review"
    DOCUMENTATION = "documentation"
    INDUSTRY_PUBLICATION = "industry_publication"
    DIRECTORY = "directory"
    SOCIAL = "social"
    THIRD_PARTY = "third_party"
    OTHER = "other"


class GeoEntityStatus(str, Enum):
    CONSISTENT = "consistent"
    PARTIALLY_CONSISTENT = "partially_consistent"
    INCONSISTENT = "inconsistent"
    MISSING = "missing"


class GeoRecommendationStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    IGNORED = "ignored"


class GeoVerificationStatus(str, Enum):
    UNVERIFIED = "unverified"
    PENDING = "pending"
    VERIFIED = "verified"
    FAILED = "failed"
    PARTIAL = "partial"


class GeoProject(Base, TimestampMixin):
    """GEO Project Model for Generative Engine Optimization."""
    __tablename__ = "geo_projects"

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
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    industry: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    sub_industry: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    target_audience: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    target_locations: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    target_languages: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    products: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    services: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    primary_topics: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    competitors: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    social_profiles: Mapped[Dict[str, str]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    logo_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=GeoProjectStatus.ACTIVE.value,
        nullable=False,
    )

    # Deterministic GEO Scores (0–100)
    geo_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    visibility_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    mention_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    recommendation_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    entity_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    citation_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    content_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    authority_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    technical_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    consistency_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    score_label: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    confidence: Mapped[Optional[str]] = mapped_column(String(50), default="Awaiting Analysis", nullable=True)
    data_coverage: Mapped[Optional[int]] = mapped_column(Integer, default=0, nullable=True)

    last_analyzed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    settings: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    # Relationships
    brand_profile: Mapped[Optional["GeoBrandProfile"]] = relationship(
        "GeoBrandProfile",
        back_populates="project",
        uselist=False,
        cascade="all, delete-orphan",
    )
    questions: Mapped[List["GeoQuestion"]] = relationship(
        "GeoQuestion",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoQuestion.created_at)",
    )
    answers: Mapped[List["GeoAnswer"]] = relationship(
        "GeoAnswer",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoAnswer.created_at)",
    )
    citations: Mapped[List["GeoCitation"]] = relationship(
        "GeoCitation",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoCitation.created_at)",
    )
    entities: Mapped[List["GeoEntity"]] = relationship(
        "GeoEntity",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoEntity.created_at)",
    )
    issues: Mapped[List["GeoIssue"]] = relationship(
        "GeoIssue",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoIssue.priority_score)",
    )
    recommendations: Mapped[List["GeoRecommendation"]] = relationship(
        "GeoRecommendation",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoRecommendation.priority_score)",
    )
    visibility_snapshots: Mapped[List["GeoVisibilitySnapshot"]] = relationship(
        "GeoVisibilitySnapshot",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoVisibilitySnapshot.created_at)",
    )
    change_events: Mapped[List["GeoChangeEvent"]] = relationship(
        "GeoChangeEvent",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoChangeEvent.detected_at)",
    )
    monitoring_schedule: Mapped[Optional["GeoMonitoringSchedule"]] = relationship(
        "GeoMonitoringSchedule",
        back_populates="project",
        uselist=False,
        cascade="all, delete-orphan",
    )
    alerts: Mapped[List["GeoAlert"]] = relationship(
        "GeoAlert",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoAlert.detected_at)",
    )
    analyses: Mapped[List["GeoAnalysis"]] = relationship(
        "GeoAnalysis",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoAnalysis.created_at)",
    )
    optimization_history: Mapped[List["GeoOptimizationHistory"]] = relationship(
        "GeoOptimizationHistory",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="desc(GeoOptimizationHistory.timestamp)",
    )


class GeoBrandProfile(Base, TimestampMixin):
    """Canonical GEO Brand Profile / Knowledge Base."""
    __tablename__ = "geo_brand_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    legal_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    aliases: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    short_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    long_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    products: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    services: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    use_cases: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    target_users: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    locations: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    pricing_model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    key_features: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    differentiators: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    competitors: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    social_links: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict, nullable=False)
    official_urls: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    support_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    documentation_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    contact_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="brand_profile")


class GeoQuestion(Base, TimestampMixin):
    """Deterministic GEO Discovery Questions (18 Categories)."""
    __tablename__ = "geo_questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    question: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    intent: Mapped[str] = mapped_column(String(50), default="informational", nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="high", nullable=False)
    search_type: Mapped[str] = mapped_column(String(50), default="generative_discovery", nullable=False)
    target_entity: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    target_product: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    target_service: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Aggregated metrics for quick display
    brand_mentioned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    recommended: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    best_position: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="questions")
    answers: Mapped[List["GeoAnswer"]] = relationship(
        "GeoAnswer",
        back_populates="question",
        cascade="all, delete-orphan",
    )


class GeoAnswer(Base, TimestampMixin):
    """Generative Engine Answer Record."""
    __tablename__ = "geo_answers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    question_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_questions.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    answer_text: Mapped[str] = mapped_column(Text, nullable=False)
    latency_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    token_usage: Mapped[Dict[str, int]] = mapped_column(JSON, default=dict, nullable=False)
    request_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Analysis results
    brand_mentioned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    brand_mention_type: Mapped[str] = mapped_column(String(50), default="no_mention", nullable=False)
    brand_position: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    recommendation_position: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    recommended: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    recommendation_strength: Mapped[str] = mapped_column(String(50), default="Not Recommended", nullable=False)
    sentiment: Mapped[str] = mapped_column(String(50), default="neutral", nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)

    competitor_mentions: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    competitor_positions: Mapped[Dict[str, int]] = mapped_column(JSON, default=dict, nullable=False)

    citation_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    own_domain_citations: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    competitor_citations: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    third_party_citations: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    raw_citations: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="answers")
    question: Mapped["GeoQuestion"] = relationship("GeoQuestion", back_populates="answers")
    citations: Mapped[List["GeoCitation"]] = relationship(
        "GeoCitation",
        back_populates="answer",
        cascade="all, delete-orphan",
    )


class GeoCitation(Base, TimestampMixin):
    """Citation Source and Influence Model."""
    __tablename__ = "geo_citations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    answer_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("geo_answers.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    url: Mapped[str] = mapped_column(Text, nullable=False)
    domain: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    source_type: Mapped[str] = mapped_column(String(50), default=GeoCitationType.THIRD_PARTY.value, nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    brand_related: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    competitor_related: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    authority_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    authority_status: Mapped[str] = mapped_column(String(50), default="NOT_AVAILABLE", nullable=False)
    citation_position: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="citations")
    answer: Mapped[Optional["GeoAnswer"]] = relationship("GeoAnswer", back_populates="citations")


class GeoEntity(Base, TimestampMixin):
    """Entity Catalog and Knowledge Graph Model."""
    __tablename__ = "geo_entities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    aliases: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    parent_entity: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    related_entities: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    related_topics: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    products: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    services: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    competitors: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    source: Mapped[str] = mapped_column(String(100), default="brand_profile", nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    consistency_status: Mapped[str] = mapped_column(String(50), default=GeoEntityStatus.CONSISTENT.value, nullable=False)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="entities")


class GeoIssue(Base, TimestampMixin):
    """Deterministic GEO Issue (Rules GEO001-GEO040+)."""
    __tablename__ = "geo_issues"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    issue_code: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="medium", nullable=False)
    priority_score: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    affected_urls: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    affected_questions: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    evidence: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="open", nullable=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="issues")


class GeoRecommendation(Base, TimestampMixin):
    """GEO Action Center Recommendation Item."""
    __tablename__ = "geo_recommendations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    recommendation_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    priority_score: Mapped[int] = mapped_column(Integer, default=70, nullable=False)
    priority_level: Mapped[str] = mapped_column(String(20), default="high", nullable=False)
    why_it_matters: Mapped[str] = mapped_column(Text, nullable=False)
    how_to_fix: Mapped[str] = mapped_column(Text, nullable=False)
    implementation_steps: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    affected_prompt_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    affected_answer_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    affected_urls: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    estimated_impact: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    potential_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    verification_status: Mapped[str] = mapped_column(
        String(50),
        default=GeoVerificationStatus.UNVERIFIED.value,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=GeoRecommendationStatus.OPEN.value,
        nullable=False,
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="recommendations")


class GeoVisibilitySnapshot(Base, TimestampMixin):
    """Historical Visibility and Score Snapshot."""
    __tablename__ = "geo_visibility_snapshots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    question_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    mention_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    recommendation_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    citation_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    average_position: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    share_of_voice: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    geo_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="visibility_snapshots")


class GeoChangeEvent(Base, TimestampMixin):
    """GEO Change Detection Event."""
    __tablename__ = "geo_change_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="medium", nullable=False)
    before_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    after_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    delta: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="change_events")


class GeoMonitoringSchedule(Base, TimestampMixin):
    """GEO Monitoring and Schedule Configuration."""
    __tablename__ = "geo_monitoring_schedules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )
    frequency: Mapped[str] = mapped_column(String(20), default="weekly", nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    providers: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    question_limit: Mapped[int] = mapped_column(Integer, default=20, nullable=False)
    last_run: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_run: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="monitoring_schedule")


class GeoAlert(Base, TimestampMixin):
    """GEO System Alert (Drops, Surges, Inconsistencies)."""
    __tablename__ = "geo_alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="medium", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="new", nullable=False)
    provider: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="alerts")


class GeoAnalysis(Base, TimestampMixin):
    """Background Analysis Job Tracker."""
    __tablename__ = "geo_analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(String(50), default=GeoAnalysisStatus.QUEUED.value, nullable=False)
    progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    current_step: Mapped[str] = mapped_column(String(255), default="Initializing GEO analysis...", nullable=False)
    providers: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    results_summary: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="analyses")


class GeoOptimizationHistory(Base, TimestampMixin):
    """Action Verification and History Tracking."""
    __tablename__ = "geo_optimization_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("geo_projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    recommendation_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    action: Mapped[str] = mapped_column(String(255), nullable=False)
    before_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    after_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    before_metric: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    after_metric: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    delta: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    project: Mapped["GeoProject"] = relationship("GeoProject", back_populates="optimization_history")
