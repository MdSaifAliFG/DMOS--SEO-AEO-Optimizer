from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AIAnalysisStatus:
    SUCCESS = "success"
    AI_ANALYSIS_FAILED = "AI_ANALYSIS_FAILED"
    AI_ANALYSIS_UNAVAILABLE = "AI_ANALYSIS_UNAVAILABLE"
    AI_ANALYSIS_INVALID = "AI_ANALYSIS_INVALID"
    AI_ANALYSIS_RETRY_REQUIRED = "AI_ANALYSIS_RETRY_REQUIRED"
    NOT_CONFIGURED = "NOT_CONFIGURED"


class AIProviderStatusResponse(BaseModel):
    provider: str = "gemini"
    model: str = "gemini-1.5-flash"
    status: str = "CONNECTED"  # CONNECTED | NOT_CONFIGURED | ERROR
    is_available: bool = True
    last_checked_at: Optional[str] = None
    error_message: Optional[str] = None


# --- SEO Schemas ---

class SEORuleObservation(BaseModel):
    area: str
    observation: str
    impact: str = "medium"  # high, medium, low
    recommendation: str


class SEOContentSemanticAnalysis(BaseModel):
    search_intent: str = Field(description="Detected primary search intent (informational, commercial, transactional, navigational)")
    intent_match: str = Field(description="Match strength: strong, moderate, weak")
    content_relevance: float = Field(ge=0.0, le=1.0, description="Semantic relevance to target topic/keyword from 0.0 to 1.0")
    content_completeness: float = Field(ge=0.0, le=1.0, description="Completeness of substantive coverage from 0.0 to 1.0")
    content_clarity: float = Field(ge=0.0, le=1.0, description="Readability, clarity and structure from 0.0 to 1.0")
    topic_coverage: float = Field(ge=0.0, le=1.0, description="Depth of topical concepts and entities covered from 0.0 to 1.0")
    content_gaps: List[str] = Field(default_factory=list, description="Missing subtopics, buyer questions, or depth gaps")
    issues: List[str] = Field(default_factory=list, description="Semantic clarity or intent mismatches")
    recommendations: List[SEORuleObservation] = Field(default_factory=list, description="Actionable semantic improvement recommendations")
    confidence: float = Field(default=0.85, ge=0.0, le=1.0, description="Model self-assessed confidence")


class SEOMetadataSuggestions(BaseModel):
    title_suggestions: List[Dict[str, Any]] = Field(default_factory=list)
    description_suggestions: List[Dict[str, Any]] = Field(default_factory=list)
    content_brief: Optional[str] = None
    heading_suggestions: List[str] = Field(default_factory=list)
    faq_suggestions: List[Dict[str, str]] = Field(default_factory=list)
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)


# --- AEO Schemas ---

class AEOAnswerSemanticAnalysis(BaseModel):
    brand_mentioned: bool = False
    brand_position: Optional[int] = None
    brand_recommended: bool = False
    recommendation_strength: str = Field(default="none", description="none, weak, moderate, strong")
    brand_sentiment: str = Field(default="neutral", description="positive, neutral, negative")
    competitors_mentioned: List[str] = Field(default_factory=list)
    citation_present: bool = False
    official_domain_cited: bool = False
    answer_relevance: float = Field(default=0.0, ge=0.0, le=1.0)
    answer_completeness: float = Field(default=0.0, ge=0.0, le=1.0)
    entity_clarity: float = Field(default=0.0, ge=0.0, le=1.0)
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    verification_status: str = Field(default="UNVERIFIED", description="VERIFIED, UNVERIFIED, NEEDS_REVIEW")


class AEODirectAnswerEvaluation(BaseModel):
    addresses_intent: bool = True
    is_clear: bool = True
    is_concise: bool = True
    early_answer: bool = True
    evidence_provided: bool = False
    avoided_fluff: bool = True
    actionable_info: bool = True
    key_entities: List[str] = Field(default_factory=list)
    evaluation_summary: str = ""
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)


# --- GEO Schemas ---

class GEOAnswerSemanticAnalysis(BaseModel):
    brand_mentioned: bool = False
    brand_position: Optional[int] = None
    brand_recommended: bool = False
    recommendation_strength: str = Field(
        default="NOT_MENTIONED",
        description="NOT_MENTIONED, MENTIONED, DESCRIBED, CONSIDERED, RECOMMENDED, STRONGLY_RECOMMENDED",
    )
    positioning_sentiment: str = Field(default="neutral", description="positive, neutral, negative")
    competitors: List[Dict[str, Any]] = Field(default_factory=list)
    official_domain_cited: bool = False
    domain_citations: List[str] = Field(default_factory=list)
    generative_visibility_gaps: List[str] = Field(default_factory=list)
    content_extractability: float = Field(default=0.5, ge=0.0, le=1.0)
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    verification_status: str = Field(default="UNVERIFIED", description="VERIFIED, UNVERIFIED, NEEDS_REVIEW")


# --- Citations and Entities Schemas ---

class CitationContextAnalysis(BaseModel):
    citation_url: str
    is_relevant: bool = True
    supports_claim: bool = True
    is_official_domain: bool = False
    is_competitor_domain: bool = False
    source_authority: str = Field(default="medium", description="high, medium, low")
    context_summary: str = ""
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)


class EntitySemanticItem(BaseModel):
    name: str
    entity_type: str = "concept"  # organization, product, software, person, technology, category, industry, concept
    context: str = ""
    relationship: str = "mentioned"
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)


class EntitySemanticExtraction(BaseModel):
    entities: List[EntitySemanticItem] = Field(default_factory=list)
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
