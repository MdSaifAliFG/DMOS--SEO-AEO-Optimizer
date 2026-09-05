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


# --- Recommendations & Actions ---
class AeoRecommendationResponse(BaseModel):
    id: str
    project_id: str
    recommendation_code: Optional[str] = None
    title: str
    category: str
    priority: str
    priority_level: Optional[str] = "medium"
    priority_score: int = 70
    severity: str = "medium"
    opportunity_score: int = 70
    reason: str
    why_it_matters: Optional[str] = None
    current_state: str
    recommended_action: str
    how_to_fix: Optional[str] = None
    expected_impact: str
    estimated_impact: int = 5
    current_score: Optional[int] = None
    potential_score: Optional[int] = None
    affected_prompt_count: int = 0
    affected_answer_count: int = 0
    affected_urls: List[str] = Field(default_factory=list)
    implementation_steps: List[str] = Field(default_factory=list)
    verification_status: str = "unverified"
    status: str = "open"
    notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoRecommendationListResponse(BaseModel):
    recommendations: List[AeoRecommendationResponse]
    total: int


class AeoActionUpdateRequest(BaseModel):
    status: Optional[str] = Field(None, description="open, in_progress, fixed, ignored")
    notes: Optional[str] = None


class AeoActionBulkUpdateRequest(BaseModel):
    action_ids: List[str] = Field(..., min_length=1)
    status: str = Field(..., description="open, in_progress, fixed, ignored")


class AeoActionGenerateRequest(BaseModel):
    project_id: str
    analysis_id: Optional[str] = None


class AeoActionSummaryResponse(BaseModel):
    project_id: str
    project_name: Optional[str] = None
    domain: Optional[str] = None
    total_actions: int = 0
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    low_count: int = 0
    open_count: int = 0
    in_progress_count: int = 0
    fixed_count: int = 0
    ignored_count: int = 0
    current_score: int = 0
    estimated_impact: int = 0
    potential_score: int = 0
    category_breakdown: Dict[str, Any] = Field(default_factory=dict)


# --- Gap & Optimizer Requests ---
class AeoProjectGapRequest(BaseModel):
    project_id: str


class AeoContentOptimizeRequest(BaseModel):
    target_question: str = Field(..., min_length=3)
    existing_content: str = Field(..., min_length=10)
    target_keyword: Optional[str] = ""
    brand_name: Optional[str] = ""
    product_service: Optional[str] = ""


class AeoDirectAnswerOptimizeRequest(BaseModel):
    target_question: str = Field(..., min_length=3)
    existing_content: str = Field(..., min_length=10)
    brand_name: Optional[str] = ""


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
    total_opportunities: int = 0
    critical_opportunities: int = 0
    high_opportunities: int = 0
    open_opportunities: int = 0
    in_progress_opportunities: int = 0
    fixed_opportunities: int = 0
    estimated_potential_gain: int = 0
    potential_score: int = 0
    top_opportunities: List[Dict[str, Any]] = Field(default_factory=list)
    completion_rate: int = 0


# --- Phase 7 AEO Monitoring & Intelligence Schemas ---

class AeoMonitoringScheduleResponse(BaseModel):
    id: str
    project_id: str
    frequency: str
    enabled: bool
    selected_engines: List[str] = Field(default_factory=list)
    alert_thresholds: Dict[str, Any] = Field(default_factory=dict)
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    last_status: Optional[str] = None
    last_error: Optional[str] = None


class AeoMonitoringScheduleUpdateRequest(BaseModel):
    frequency: Optional[str] = None
    enabled: Optional[bool] = None
    selected_engines: Optional[List[str]] = None
    alert_thresholds: Optional[Dict[str, Any]] = None


class AeoTrendPoint(BaseModel):
    id: str
    date: str
    timestamp: str
    overall_score: int
    mention_score: int
    citation_score: int
    position_score: int
    coverage_score: int
    mention_rate: float
    citation_rate: float
    average_position: Optional[float] = None
    total_questions: int
    questions_mentioned: int


class AeoTrendResponse(BaseModel):
    project_id: str
    time_range: str
    has_enough_data: bool
    message: str
    points_count: int
    score_change: int
    trend_direction: str
    first_score: Optional[int] = None
    current_score: Optional[int] = None
    timeline: List[AeoTrendPoint] = Field(default_factory=list)


class AeoEngineComparisonItem(BaseModel):
    provider: str
    display_name: str
    is_configured: bool
    has_data: bool
    score: Optional[int] = None
    mention_rate: Optional[float] = None
    citation_rate: Optional[float] = None
    coverage_rate: Optional[float] = None
    average_position: Optional[float] = None
    questions_tested: Optional[int] = None
    questions_mentioned: Optional[int] = None
    citations_count: Optional[int] = None
    status_label: str


class AeoEngineComparisonResponse(BaseModel):
    project_id: str
    has_data: bool
    provider_parity: str
    parity_ratio: float = 0.0
    engines: List[AeoEngineComparisonItem] = Field(default_factory=list)


class AeoCompetitorItem(BaseModel):
    name: str
    mention_count: int = 0
    citation_count: int = 0
    share_of_voice: float = 0.0
    average_position: Optional[float] = None
    trend: str = "stable"
    delta: float = 0.0


class AeoCompetitorComparisonChartItem(BaseModel):
    name: str
    is_brand: bool
    share_of_voice: float = 0.0
    mentions: int = 0
    citations: int = 0


class AeoCompetitorIntelligenceResponse(BaseModel):
    project_id: str
    has_data: bool
    brand_name: str
    brand_share_of_voice: float = 0.0
    total_market_mentions: int = 0
    competitors_count: int = 0
    highest_share_of_voice: Optional[str] = None
    biggest_gainer: Optional[Dict[str, Any]] = None
    biggest_loser: Optional[Dict[str, Any]] = None
    competitors_tracked: List[AeoCompetitorItem] = Field(default_factory=list)
    comparison_chart_data: List[AeoCompetitorComparisonChartItem] = Field(default_factory=list)


class AeoChangeEventResponse(BaseModel):
    id: str
    project_id: str
    analysis_id: Optional[str] = None
    event_type: str
    severity: str
    provider: Optional[str] = None
    description: str
    previous_value: Optional[str] = None
    current_value: Optional[str] = None
    delta: Optional[float] = None
    percentage_delta: Optional[float] = None
    related_prompt_id: Optional[str] = None
    related_competitor: Optional[str] = None
    created_at: datetime


class AeoAlertResponse(BaseModel):
    id: str
    project_id: str
    change_event_id: Optional[str] = None
    type: str
    severity: str
    title: str
    description: str
    status: str
    provider: Optional[str] = None
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None


class AeoAlertUpdateInput(BaseModel):
    status: str = Field(..., pattern="^(acknowledged|resolved|new)$")


class AeoExecutiveIntelligenceResponse(BaseModel):
    project_id: str
    brand_name: str
    domain: str
    aeo_score: Optional[int] = None
    monitoring_health_score: int
    monitoring_health_status: str
    data_freshness: str
    last_analyzed_at: Optional[str] = None
    executive_summary: str
    top_risks: List[Dict[str, Any]] = Field(default_factory=list)
    top_opportunities: List[Dict[str, Any]] = Field(default_factory=list)
    recent_changes: List[Dict[str, Any]] = Field(default_factory=list)
    competitive_position: Dict[str, Any] = Field(default_factory=dict)


class AeoPromptMovementItem(BaseModel):
    question_id: str
    prompt: str
    category: str
    intent: str
    provider: str
    previous_status: str
    current_status: str
    movement: str
    position: Optional[int] = None
    citation_found: bool = False
    visibility_score: int = 0


class AeoCitationMovementItem(BaseModel):
    domain: str
    citation_type: str
    count: int
    engines: List[str] = Field(default_factory=list)
    sample_urls: List[str] = Field(default_factory=list)
    trend: str = "steady"


class AeoEntityMovementItem(BaseModel):
    id: str
    name: str
    entity_type: str
    confidence_score: float
    frequency: int
    associated_concepts: List[str] = Field(default_factory=list)
    trend: str = "moderate"

