from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


# --- Action / Recommendation Models ---

class SeoRecommendationResponse(BaseModel):
    id: str
    project_id: str
    scan_id: str
    issue_id: Optional[str] = None
    page_id: Optional[str] = None
    issue_code: str
    title: str
    description: str
    why_it_matters: str
    how_to_fix: str
    category: str
    priority: str
    priority_score: float
    estimated_impact: float
    effort: str
    status: str
    notes: Optional[str] = None
    affected_pages_count: int = 1
    affected_urls: List[str] = Field(default_factory=list)
    current_state: Optional[str] = None
    recommended_state: Optional[str] = None
    verification_status: str = "unverified"
    verification_details: Dict[str, Any] = Field(default_factory=dict)
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SeoRecommendationListResponse(BaseModel):
    recommendations: List[SeoRecommendationResponse]
    total: int


from app.models.seo_recommendation import RecommendationStatus


class SeoRecommendationUpdate(BaseModel):
    status: Optional[RecommendationStatus] = None
    notes: Optional[str] = None


class SeoRecommendationBulkUpdate(BaseModel):
    action_ids: List[str] = Field(..., min_length=1)
    status: RecommendationStatus
    notes: Optional[str] = None


class VerifyFixResponse(BaseModel):
    recommendation_id: str
    status: str  # verified or not_fixed
    message: str
    is_fixed: bool
    details: Dict[str, Any] = Field(default_factory=dict)


# --- Dashboard / Summary KPIs ---

class CategoryProgress(BaseModel):
    category: str
    total_actions: int = 0
    fixed_actions: int = 0
    progress_percentage: int = 0


class SeoOptimizationSummaryResponse(BaseModel):
    project_id: str
    scan_id: Optional[str] = None
    total_actions: int = 0
    critical_actions: int = 0
    high_priority_actions: int = 0
    medium_priority_actions: int = 0
    low_priority_actions: int = 0
    in_progress_actions: int = 0
    fixed_actions: int = 0
    ignored_actions: int = 0
    estimated_seo_impact: float = 0.0
    current_seo_score: Optional[int] = None
    potential_seo_score: Optional[int] = None
    optimization_progress: int = 0  # 0 to 100 percentage
    category_breakdown: List[CategoryProgress] = Field(default_factory=list)
    top_opportunities: List[SeoRecommendationResponse] = Field(default_factory=list)


# --- Optimization History (Before / After Comparison) ---

class OptimizationHistoryResponse(BaseModel):
    id: str
    project_id: str
    scan_id: str
    previous_scan_id: Optional[str] = None
    previous_score: Optional[int] = None
    current_score: int
    score_change: int
    issues_before: int = 0
    issues_after: int = 0
    issues_resolved: int = 0
    new_issues: int = 0
    remaining_issues: int = 0
    pages_improved: int = 0
    pages_declined: int = 0
    category_score_changes: Dict[str, int] = Field(default_factory=dict)
    details: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OptimizationHistoryListResponse(BaseModel):
    comparisons: List[OptimizationHistoryResponse]
    total: int


# --- Metadata Optimizer Schemas ---

class TitleSuggestion(BaseModel):
    title: str
    character_count: int
    length_status: str  # optimal, too_short, too_long
    keyword_presence: bool = True
    brand_presence: bool = True


class TitleOptimizationRequest(BaseModel):
    current_title: Optional[str] = None
    target_url: str
    target_keyword: Optional[str] = None
    brand_name: Optional[str] = None
    page_content_snippet: Optional[str] = None


class TitleOptimizationResponse(BaseModel):
    current_title: Optional[str] = None
    suggestions: List[TitleSuggestion]
    provider: str = "rule_based"


class DescriptionSuggestion(BaseModel):
    description: str
    character_count: int
    length_status: str  # optimal, too_short, too_long
    keyword_presence: bool = True
    cta_presence: bool = True
    readability_score: str = "Good"


class DescriptionOptimizationRequest(BaseModel):
    current_description: Optional[str] = None
    target_url: str
    target_keyword: Optional[str] = None
    brand_name: Optional[str] = None
    page_content_snippet: Optional[str] = None


class DescriptionOptimizationResponse(BaseModel):
    current_description: Optional[str] = None
    suggestions: List[DescriptionSuggestion]
    provider: str = "rule_based"


# --- Content Optimization Schemas ---

class ContentRecommendationItem(BaseModel):
    title: str
    description: str
    category: str
    priority: str
    impact: str


class ContentOptimizationRequest(BaseModel):
    project_id: str
    page_id: Optional[str] = None
    target_url: Optional[str] = None


class ContentOptimizationResponse(BaseModel):
    url: str
    word_count: int = 0
    word_count_status: str = "thin"  # thin, acceptable, optimal
    heading_structure: Dict[str, Any] = Field(default_factory=dict)
    readability_indicator: str = "Good"
    duplicate_signals: List[str] = Field(default_factory=list)
    recommendations: List[ContentRecommendationItem] = Field(default_factory=list)


# --- Internal Linking Optimization Schemas ---

class InternalLinkOpportunity(BaseModel):
    source_url: str
    target_url: str
    recommended_anchor: str
    reason: str
    priority: str = "medium"


class InternalLinksOptimizationRequest(BaseModel):
    project_id: str
    scan_id: Optional[str] = None


class InternalLinksOptimizationResponse(BaseModel):
    total_opportunities: int = 0
    orphan_pages: List[str] = Field(default_factory=list)
    low_inbound_pages: List[Dict[str, Any]] = Field(default_factory=list)
    opportunities: List[InternalLinkOpportunity] = Field(default_factory=list)
