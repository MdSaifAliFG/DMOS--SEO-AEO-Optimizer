from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.aeo import AeoEngine, AeoIntent


class AeoProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    settings: Dict[str, Any] = Field(default_factory=dict)


class AeoProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    domain: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None


class AeoProjectResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    name: str
    domain: str
    description: Optional[str] = None
    is_active: bool
    aeo_score: Optional[int] = None
    questions_count: int = 0
    citations_count: int = 0
    settings: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoProjectListResponse(BaseModel):
    projects: List[AeoProjectResponse]
    total: int


class AeoQuestionCreate(BaseModel):
    project_id: str
    question_text: str = Field(..., min_length=5, max_length=1024)
    category: str = Field("General", max_length=100)
    intent: AeoIntent = Field(default=AeoIntent.INFORMATIONAL)


class AeoQuestionResponse(BaseModel):
    id: str
    project_id: str
    question_text: str
    category: str
    intent: str
    is_tracked: bool
    visibility_status: str
    visibility_score: int
    trend_change: int
    last_checked_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoQuestionListResponse(BaseModel):
    questions: List[AeoQuestionResponse]
    total: int


class AeoCitationCreate(BaseModel):
    project_id: str
    question_id: Optional[str] = None
    engine: str = Field("chatgpt", max_length=50)
    source_url: str = Field(..., min_length=5, max_length=1024)
    domain: Optional[str] = Field(None, max_length=255)
    citation_status: str = Field("cited", max_length=50)
    citation_text: Optional[str] = None


class AeoCitationResponse(BaseModel):
    id: str
    project_id: str
    question_id: Optional[str] = None
    engine: str
    source_url: str
    domain: str
    citation_status: str
    citation_text: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoCitationListResponse(BaseModel):
    citations: List[AeoCitationResponse]
    total: int


class AeoEntityCreate(BaseModel):
    project_id: str
    entity_name: str = Field(..., min_length=1, max_length=255)
    entity_type: str = Field("Brand", max_length=100)


class AeoEntityResponse(BaseModel):
    id: str
    project_id: str
    entity_name: str
    entity_type: str
    mentions_count: int
    visibility_rate: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AeoEntityListResponse(BaseModel):
    entities: List[AeoEntityResponse]
    total: int


class AeoEngineStatus(BaseModel):
    engine_id: str
    name: str
    is_connected: bool
    tracked_questions: int = 0
    visibility_rate: int = 0
    citations_count: int = 0
    status_label: str = "Integration Not Connected"


class AeoScoreTrendPoint(BaseModel):
    date: str
    score: int


class AeoDashboardSummaryResponse(BaseModel):
    aeo_score: Optional[int] = None
    score_label: Optional[str] = None
    answer_visibility_rate: int = 0
    questions_tracked: int = 0
    total_citations: int = 0
    total_projects: int = 0
    score_trend: List[AeoScoreTrendPoint] = Field(default_factory=list)
    engines: List[AeoEngineStatus] = Field(default_factory=list)
    recent_questions: List[AeoQuestionResponse] = Field(default_factory=list)
    recent_citations: List[AeoCitationResponse] = Field(default_factory=list)
