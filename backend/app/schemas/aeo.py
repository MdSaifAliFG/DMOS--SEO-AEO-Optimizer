from __future__ import annotations
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.aeo import AeoEngine, AeoIntent


# --- Projects ---
class AeoProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(..., min_length=3, max_length=255)
    brand_name: Optional[str] = Field(None, max_length=255)
    brand_aliases: List[str] = Field(default_factory=list)
    industry: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    target_audience: Optional[str] = Field(None, max_length=255)
    target_language: str = Field("en", max_length=20)
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    description: Optional[str] = Field(None, max_length=1000)
    settings: Dict[str, Any] = Field(default_factory=dict)


class AeoProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    domain: Optional[str] = Field(None, min_length=3, max_length=255)
    brand_name: Optional[str] = Field(None, max_length=255)
    brand_aliases: Optional[List[str]] = None
    industry: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    target_audience: Optional[str] = Field(None, max_length=255)
    target_language: Optional[str] = None
    competitors: Optional[List[Dict[str, Any]]] = None
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None


class AeoProjectResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    name: str
    domain: str
    brand_name: Optional[str] = None
    brand_aliases: List[str] = Field(default_factory=list)
    industry: Optional[str] = None
    country: Optional[str] = None
    target_audience: Optional[str] = None
    target_language: str = "en"
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    description: Optional[str] = None
    is_active: bool = True
    aeo_score: Optional[int] = None
    score_label: Optional[str] = None
    mention_score: Optional[int] = None
    citation_score: Optional[int] = None
    position_score: Optional[int] = None
    coverage_score: Optional[int] = None
    last_analyzed_at: Optional[datetime] = None
    questions_count: int = 0
    citations_count: int = 0
    settings: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoProjectListResponse(BaseModel):
    projects: List[AeoProjectResponse]
    total: int


# --- Questions ---
class AeoQuestionCreate(BaseModel):
    project_id: str
    question_text: str = Field(..., min_length=5, max_length=1024)
    category: str = Field("General", max_length=100)
    intent: AeoIntent = Field(default=AeoIntent.INFORMATIONAL)
    is_tracked: bool = True


class AeoQuestionUpdate(BaseModel):
    question_text: Optional[str] = Field(None, min_length=5, max_length=1024)
    category: Optional[str] = Field(None, max_length=100)
    intent: Optional[AeoIntent] = None
    is_tracked: Optional[bool] = None


class AeoQuestionGenerateRequest(BaseModel):
    project_id: str
    max_questions: int = Field(10, ge=1, le=30)


class AeoQuestionResponse(BaseModel):
    id: str
    project_id: str
    question_text: str
    category: str
    intent: str
    is_tracked: bool
    visibility_status: str
    visibility_score: Optional[int] = None
    brand_mentioned: bool = False
    best_rank_position: Optional[int] = None
    trend_change: int = 0
    last_checked_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoQuestionListResponse(BaseModel):
    questions: List[AeoQuestionResponse]
    total: int


# --- Answers ---
class AeoAnswerResponse(BaseModel):
    id: str
    project_id: str
    question_id: str
    analysis_id: Optional[str] = None
    engine: str
    model: Optional[str] = None
    answer_text: str
    brand_mentioned: bool
    brand_position: Optional[int] = None
    mention_snippets: List[str] = Field(default_factory=list)
    competitor_mentions: List[Dict[str, Any]] = Field(default_factory=list)
    citations_count: int = 0
    latency_ms: Optional[int] = None
    token_usage: Dict[str, Any] = Field(default_factory=dict)
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    question_text: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AeoAnswerListResponse(BaseModel):
    answers: List[AeoAnswerResponse]
    total: int


# --- Citations ---
class AeoCitationCreate(BaseModel):
    project_id: str
    question_id: Optional[str] = None
    engine: str = Field("chatgpt", max_length=50)
    source_url: str = Field(..., min_length=5, max_length=1024)
    domain: Optional[str] = Field(None, max_length=255)
    citation_type: str = Field("third_party", max_length=50)
    citation_status: str = Field("cited", max_length=50)
    citation_text: Optional[str] = None


class AeoCitationResponse(BaseModel):
    id: str
    project_id: str
    question_id: Optional[str] = None
    engine: str
    source_url: str
    domain: str
    citation_type: str = "third_party"
    citation_status: str
    citation_text: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoCitationListResponse(BaseModel):
    citations: List[AeoCitationResponse]
    total: int


# --- Entities ---
class AeoEntityCreate(BaseModel):
    project_id: str
    entity_name: str = Field(..., min_length=1, max_length=255)
    entity_type: str = Field("Brand", max_length=100)
    mentions_count: Optional[int] = 1
    visibility_rate: Optional[int] = 80
    associated_concepts: List[str] = Field(default_factory=list)


class AeoEntityResponse(BaseModel):
    id: str
    project_id: str
    entity_name: str
    entity_type: str
    mentions_count: int
    visibility_rate: int
    associated_concepts: List[str] = Field(default_factory=list)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoEntityListResponse(BaseModel):
    entities: List[AeoEntityResponse]
    total: int


# --- Analyses ---
class AeoAnalysisTriggerRequest(BaseModel):
    engines: Optional[List[str]] = Field(default=None)
    allow_test_mode: bool = False


class AeoAnalysisResponse(BaseModel):
    id: str
    project_id: str
    status: str
    progress: int
    current_step: str
    logs: List[Dict[str, Any]] = Field(default_factory=list)
    engines_analyzed: List[str] = Field(default_factory=list)
    questions_analyzed_count: int = 0
    answers_collected_count: int = 0
    mentions_found_count: int = 0
    citations_found_count: int = 0
    overall_score: Optional[int] = None
    summary_data: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Visibility & Snapshots ---
class AeoVisibilityTrendPoint(BaseModel):
    date: str
    score: int
    mention_score: Optional[int] = None
    citation_score: Optional[int] = None
    coverage_score: Optional[int] = None


class AeoVisibilityResponse(BaseModel):
    project_id: str
    project_name: str
    domain: str
    overall_score: Optional[int] = None
    score_label: str
    mention_score: int = 0
    citation_score: int = 0
    position_score: int = 0
    coverage_score: int = 0
    score_change: int = 0
    last_analyzed_at: Optional[datetime] = None
    trend: List[AeoVisibilityTrendPoint] = Field(default_factory=list)
    snapshots_count: int = 0


# --- Recommendations ---
class AeoRecommendationResponse(BaseModel):
    id: str
    project_id: str
    title: str
    category: str
    priority: str
    opportunity_score: int
    reason: str
    current_state: str
    recommended_action: str
    expected_impact: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoRecommendationListResponse(BaseModel):
    recommendations: List[AeoRecommendationResponse]
    total: int


# --- Dashboard ---
class AeoEngineStatus(BaseModel):
    engine_id: str
    name: str
    is_connected: bool
    tracked_questions: int = 0
    visibility_rate: int = 0
    status_label: str = "Integration Not Connected"


class AeoDashboardSummaryResponse(BaseModel):
    aeo_score: Optional[int] = None
    score_label: Optional[str] = None
    answer_visibility_rate: int = 0
    questions_tracked: int = 0
    total_citations: int = 0
    total_projects: int = 0
    active_project_id: Optional[str] = None
    active_project_name: Optional[str] = None
    score_trend: List[Dict[str, Any]] = Field(default_factory=list)
    engines: List[AeoEngineStatus] = Field(default_factory=list)
    recent_questions: List[AeoQuestionResponse] = Field(default_factory=list)
    recent_citations: List[AeoCitationResponse] = Field(default_factory=list)
