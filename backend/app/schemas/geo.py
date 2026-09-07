from __future__ import annotations
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.geo import (
    GeoProjectStatus,
    GeoAnalysisStatus,
    GeoCitationType,
    GeoEntityStatus,
    GeoRecommendationStatus,
    GeoVerificationStatus,
)


# --- GEO Projects ---
class GeoProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(..., min_length=3, max_length=255)
    brand_name: Optional[str] = Field(None, max_length=255)
    brand_aliases: List[str] = Field(default_factory=list)
    description: Optional[str] = Field(None, max_length=2000)
    industry: Optional[str] = Field(None, max_length=100)
    sub_industry: Optional[str] = Field(None, max_length=100)
    target_audience: Optional[str] = Field(None, max_length=255)
    target_locations: List[str] = Field(default_factory=list)
    target_languages: List[str] = Field(default_factory=lambda: ["en"])
    products: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    primary_topics: List[str] = Field(default_factory=list)
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    social_profiles: Dict[str, str] = Field(default_factory=dict)
    logo_url: Optional[str] = Field(None, max_length=500)
    settings: Dict[str, Any] = Field(default_factory=dict)


class GeoProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    domain: Optional[str] = Field(None, min_length=3, max_length=255)
    brand_name: Optional[str] = Field(None, max_length=255)
    brand_aliases: Optional[List[str]] = None
    description: Optional[str] = Field(None, max_length=2000)
    industry: Optional[str] = Field(None, max_length=100)
    sub_industry: Optional[str] = Field(None, max_length=100)
    target_audience: Optional[str] = Field(None, max_length=255)
    target_locations: Optional[List[str]] = None
    target_languages: Optional[List[str]] = None
    products: Optional[List[str]] = None
    services: Optional[List[str]] = None
    primary_topics: Optional[List[str]] = None
    competitors: Optional[List[Dict[str, Any]]] = None
    social_profiles: Optional[Dict[str, str]] = None
    logo_url: Optional[str] = None
    status: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


class GeoProjectResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    name: str
    domain: str
    brand_name: Optional[str] = None
    brand_aliases: List[str] = Field(default_factory=list)
    description: Optional[str] = None
    industry: Optional[str] = None
    sub_industry: Optional[str] = None
    target_audience: Optional[str] = None
    target_locations: List[str] = Field(default_factory=list)
    target_languages: List[str] = Field(default_factory=list)
    products: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    primary_topics: List[str] = Field(default_factory=list)
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    social_profiles: Dict[str, str] = Field(default_factory=dict)
    logo_url: Optional[str] = None
    status: str

    geo_score: Optional[int] = None
    visibility_score: Optional[int] = None
    mention_score: Optional[int] = None
    recommendation_score: Optional[int] = None
    entity_score: Optional[int] = None
    citation_score: Optional[int] = None
    content_score: Optional[int] = None
    authority_score: Optional[int] = None
    technical_score: Optional[int] = None
    consistency_score: Optional[int] = None

    score_label: Optional[str] = None
    confidence: Optional[str] = None
    data_coverage: Optional[int] = 0

    last_analyzed_at: Optional[datetime] = None
    questions_count: int = 0
    answers_count: int = 0
    citations_count: int = 0
    entities_count: int = 0
    issues_count: int = 0
    recommendations_count: int = 0
    settings: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GeoProjectListResponse(BaseModel):
    projects: List[GeoProjectResponse]
    total: int


# --- Brand Profile ---
class GeoBrandProfileCreate(BaseModel):
    brand_name: str = Field(..., min_length=1, max_length=255)
    legal_name: Optional[str] = Field(None, max_length=255)
    aliases: List[str] = Field(default_factory=list)
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    industry: Optional[str] = None
    category: Optional[str] = None
    products: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    use_cases: List[str] = Field(default_factory=list)
    target_users: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    pricing_model: Optional[str] = None
    key_features: List[str] = Field(default_factory=list)
    differentiators: List[str] = Field(default_factory=list)
    competitors: List[str] = Field(default_factory=list)
    social_links: Dict[str, str] = Field(default_factory=dict)
    official_urls: List[str] = Field(default_factory=list)
    support_url: Optional[str] = None
    documentation_url: Optional[str] = None
    contact_url: Optional[str] = None


class GeoBrandProfileUpdate(BaseModel):
    brand_name: Optional[str] = None
    legal_name: Optional[str] = None
    aliases: Optional[List[str]] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    industry: Optional[str] = None
    category: Optional[str] = None
    products: Optional[List[str]] = None
    services: Optional[List[str]] = None
    use_cases: Optional[List[str]] = None
    target_users: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    pricing_model: Optional[str] = None
    key_features: Optional[List[str]] = None
    differentiators: Optional[List[str]] = None
    competitors: Optional[List[str]] = None
    social_links: Optional[Dict[str, str]] = None
    official_urls: Optional[List[str]] = None
    support_url: Optional[str] = None
    documentation_url: Optional[str] = None
    contact_url: Optional[str] = None


class GeoBrandProfileResponse(BaseModel):
    id: str
    project_id: str
    brand_name: str
    legal_name: Optional[str] = None
    aliases: List[str] = Field(default_factory=list)
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    industry: Optional[str] = None
    category: Optional[str] = None
    products: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    use_cases: List[str] = Field(default_factory=list)
    target_users: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    pricing_model: Optional[str] = None
    key_features: List[str] = Field(default_factory=list)
    differentiators: List[str] = Field(default_factory=list)
    competitors: List[str] = Field(default_factory=list)
    social_links: Dict[str, str] = Field(default_factory=dict)
    official_urls: List[str] = Field(default_factory=list)
    support_url: Optional[str] = None
    documentation_url: Optional[str] = None
    contact_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Questions ---
class GeoQuestionCreate(BaseModel):
    project_id: str
    question: str = Field(..., min_length=5)
    category: str
    intent: str = "informational"
    priority: str = "high"
    search_type: str = "generative_discovery"
    target_entity: Optional[str] = None
    target_product: Optional[str] = None
    target_service: Optional[str] = None


class GeoQuestionGenerateRequest(BaseModel):
    project_id: str
    categories: Optional[List[str]] = None
    count_per_category: int = Field(default=2, ge=1, le=10)


class GeoQuestionResponse(BaseModel):
    id: str
    project_id: str
    question: str
    category: str
    intent: str
    priority: str
    search_type: str
    target_entity: Optional[str] = None
    target_product: Optional[str] = None
    target_service: Optional[str] = None
    is_active: bool
    brand_mentioned: bool
    recommended: bool
    best_position: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GeoQuestionListResponse(BaseModel):
    questions: List[GeoQuestionResponse]
    total: int


# --- Answers ---
class GeoAnswerResponse(BaseModel):
    id: str
    project_id: str
    question_id: str
    provider: str
    model: Optional[str] = None
    answer_text: str
    latency_ms: Optional[int] = None
    token_usage: Dict[str, int] = Field(default_factory=dict)
    request_id: Optional[str] = None

    brand_mentioned: bool
    brand_mention_type: str
    brand_position: Optional[int] = None
    recommendation_position: Optional[int] = None
    recommended: bool
    recommendation_strength: str
    sentiment: str
    confidence: float

    competitor_mentions: List[Dict[str, Any]] = Field(default_factory=list)
    competitor_positions: Dict[str, int] = Field(default_factory=dict)

    citation_count: int
    own_domain_citations: int
    competitor_citations: int
    third_party_citations: int
    raw_citations: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GeoAnswerListResponse(BaseModel):
    answers: List[GeoAnswerResponse]
    total: int


# --- Citations ---
class GeoCitationResponse(BaseModel):
    id: str
    project_id: str
    answer_id: Optional[str] = None
    url: str
    domain: str
    source_type: str
    title: Optional[str] = None
    brand_related: bool
    competitor_related: bool
    authority_score: Optional[int] = None
    authority_status: str = "NOT_AVAILABLE"
    citation_position: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GeoCitationListResponse(BaseModel):
    citations: List[GeoCitationResponse]
    total: int
    own_citation_rate: float
    competitor_citation_rate: float
    third_party_citation_rate: float
    citation_diversity: int


# --- Entities ---
class GeoEntityResponse(BaseModel):
    id: str
    project_id: str
    name: str
    entity_type: str
    description: Optional[str] = None
    aliases: List[str] = Field(default_factory=list)
    parent_entity: Optional[str] = None
    related_entities: List[str] = Field(default_factory=list)
    related_topics: List[str] = Field(default_factory=list)
    products: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    competitors: List[str] = Field(default_factory=list)
    source: str
    confidence: float
    consistency_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GeoEntityListResponse(BaseModel):
    entities: List[GeoEntityResponse]
    total: int
    consistency_score: int


# --- Competitors ---
class GeoCompetitorItem(BaseModel):
    name: str
    domain: Optional[str] = None
    mention_rate: float
    recommendation_rate: float
    average_position: Optional[float] = None
    citation_rate: float
    share_of_voice: float
    geo_gap: float
    trend: str = "stable"


class GeoCompetitorResponse(BaseModel):
    project_id: str
    brand_name: str
    brand_share_of_voice: float
    brand_mention_rate: float
    brand_recommendation_rate: float
    competitors: List[GeoCompetitorItem]


# --- Issues ---
class GeoIssueResponse(BaseModel):
    id: str
    project_id: str
    issue_code: str
    category: str
    title: str
    description: str
    severity: str
    priority_score: int
    affected_urls: List[str] = Field(default_factory=list)
    affected_questions: List[str] = Field(default_factory=list)
    evidence: Dict[str, Any] = Field(default_factory=dict)
    status: str
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class GeoIssueListResponse(BaseModel):
    issues: List[GeoIssueResponse]
    total: int


# --- Action Center / Recommendations ---
class GeoRecommendationResponse(BaseModel):
    id: str
    project_id: str
    recommendation_code: str
    title: str
    description: str
    category: str
    priority_score: int
    priority_level: str
    why_it_matters: str
    how_to_fix: str
    implementation_steps: List[str] = Field(default_factory=list)
    affected_prompt_count: int
    affected_answer_count: int
    affected_urls: List[str] = Field(default_factory=list)
    estimated_impact: int
    potential_score: int
    verification_status: str
    status: str
    notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GeoRecommendationListResponse(BaseModel):
    recommendations: List[GeoRecommendationResponse]
    total: int


class GeoRecommendationUpdateRequest(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class GeoRecommendationBulkRequest(BaseModel):
    recommendation_ids: List[str]
    action: str = Field(..., pattern="^(complete|ignore|verify|start)$")


class GeoActionSummaryResponse(BaseModel):
    project_id: str
    total_actions: int
    open_actions: int
    in_progress_actions: int
    completed_actions: int
    verified_actions: int
    ignored_actions: int
    average_priority_score: float
    potential_total_gain: int


# --- Dashboard ---
class GeoDashboardResponse(BaseModel):
    project: GeoProjectResponse
    brand_profile: Optional[GeoBrandProfileResponse] = None
    geo_score: Optional[int] = None
    score_label: Optional[str] = None
    confidence: str
    data_coverage: int

    # 8-Component Breakdown
    visibility_score: Optional[int] = None
    recommendation_score: Optional[int] = None
    citation_score: Optional[int] = None
    entity_score: Optional[int] = None
    content_score: Optional[int] = None
    technical_score: Optional[int] = None
    authority_score: Optional[int] = None
    consistency_score: Optional[int] = None

    # Performance
    mention_rate: float
    recommendation_rate: float
    own_citation_rate: float
    share_of_voice: float

    # Summaries
    provider_breakdown: List[Dict[str, Any]]
    competitor_share_of_voice: List[Dict[str, Any]]
    citation_sources: List[Dict[str, Any]]
    top_issues: List[GeoIssueResponse]
    top_recommendations: List[GeoRecommendationResponse]
    recent_history: List[Dict[str, Any]]


# --- Visibility & History ---
class GeoVisibilityResponse(BaseModel):
    project_id: str
    current_geo_score: Optional[int] = None
    mention_rate: float
    recommendation_rate: float
    citation_rate: float
    share_of_voice: float
    providers: List[Dict[str, Any]]
    trends_7d: Optional[Dict[str, Any]] = None
    trends_30d: Optional[Dict[str, Any]] = None
    trends_90d: Optional[Dict[str, Any]] = None


class GeoHistoryResponse(BaseModel):
    project_id: str
    snapshots: List[Dict[str, Any]]
    change_events: List[Dict[str, Any]]
    optimization_history: List[Dict[str, Any]] = []


# --- Monitoring & Alerts ---
class GeoMonitoringScheduleResponse(BaseModel):
    id: str
    project_id: str
    frequency: str
    enabled: bool
    providers: List[str]
    question_limit: int
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GeoMonitoringScheduleUpdate(BaseModel):
    frequency: Optional[str] = None
    enabled: Optional[bool] = None
    providers: Optional[List[str]] = None
    question_limit: Optional[int] = None


class GeoAlertResponse(BaseModel):
    id: str
    project_id: str
    alert_type: str
    title: str
    description: str
    severity: str
    status: str
    provider: Optional[str] = None
    detected_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# --- Optimization Studios ---
class GeoOptimizeContentRequest(BaseModel):
    project_id: str
    url: Optional[str] = None
    topic: str
    content_type: str = "product_definition"
    existing_content: Optional[str] = None


class GeoOptimizeEntityRequest(BaseModel):
    project_id: str
    entity_name: str
    entity_type: str = "Organization"
    attributes: Dict[str, Any] = Field(default_factory=dict)


class GeoOptimizeAnswerRequest(BaseModel):
    project_id: str
    question: str
    context: Optional[str] = None
    target_word_count: int = Field(default=60, ge=40, le=120)


class GeoOptimizeComparisonRequest(BaseModel):
    project_id: str
    competitor_name: str
    category: Optional[str] = None


class GeoOptimizeCommercialRequest(BaseModel):
    project_id: str
    pricing_page_url: Optional[str] = None
    product_tier: Optional[str] = None


class GeoOptimizeResponse(BaseModel):
    tool: str
    title: str
    direct_answer: Optional[str] = None
    suggested_headings: List[str] = Field(default_factory=list)
    missing_facts: List[str] = Field(default_factory=list)
    recommended_structure: List[str] = Field(default_factory=list)
    supporting_evidence: List[str] = Field(default_factory=list)
    internal_links: List[str] = Field(default_factory=list)
    external_authorities: List[str] = Field(default_factory=list)
    schema_markup: Optional[Dict[str, Any]] = None
    commercial_readiness_score: Optional[int] = None
    expected_impact: str = "Medium"


# --- Reports ---
class GeoReportGenerateRequest(BaseModel):
    project_id: str
    format: str = "json"  # "json", "csv", "markdown"
    include_history: bool = True
    include_competitors: bool = True


class GeoReportResponse(BaseModel):
    project_id: str
    generated_at: datetime
    executive_summary: str
    geo_score: Optional[int] = None
    score_label: Optional[str] = None
    ai_visibility: int
    recommendation_visibility: int
    citation_health: int
    entity_clarity: int
    content_extractability: int
    technical_accessibility: int
    top_strengths: List[str]
    top_weaknesses: List[str]
    top_competitors: List[Dict[str, Any]]
    top_sources: List[Dict[str, Any]]
    top_recommendations: List[Dict[str, Any]]


# --- Analysis Jobs ---
class GeoAnalysisTriggerRequest(BaseModel):
    project_id: str
    providers: Optional[List[str]] = None
    crawling_enabled: bool = True
    question_count: int = Field(default=18, ge=5, le=50)


class GeoAnalysisResponse(BaseModel):
    id: str
    project_id: str
    status: str
    progress: int
    current_step: str
    providers: List[str]
    results_summary: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Unified Search Intelligence ---
class UnifiedSearchIntelligenceResponse(BaseModel):
    project_id: str
    brand_name: str
    domain: str
    seo_score: Optional[int] = None
    aeo_score: Optional[int] = None
    geo_score: Optional[int] = None
    unified_score: Optional[int] = None
    formula: str = "SEO (40%) + AEO (30%) + GEO (30%)"
    has_sufficient_data: bool = False
    executive_brief: str
