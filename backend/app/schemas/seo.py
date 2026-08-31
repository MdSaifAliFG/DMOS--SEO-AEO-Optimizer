from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.seo_issue import IssueCategory, IssueSeverity, IssueStatus


class SeoPageImageResponse(BaseModel):
    id: str
    src: str
    alt: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    is_internal: bool

    model_config = ConfigDict(from_attributes=True)


class SeoPageLinkResponse(BaseModel):
    id: str
    target_url: str
    anchor_text: Optional[str] = None
    link_type: str
    status_code: Optional[int] = None
    is_internal: bool
    is_follow: bool

    model_config = ConfigDict(from_attributes=True)


class SeoPageResponse(BaseModel):
    id: str
    scan_id: str
    url: str
    final_url: str
    status_code: int
    content_type: str
    title: Optional[str] = None
    meta_description: Optional[str] = None
    canonical_url: Optional[str] = None
    language: Optional[str] = None
    h1_count: int
    h2_count: int
    h3_count: int
    word_count: int
    response_time: float
    content_length: int
    is_indexable: bool
    is_internal: bool
    crawl_depth: int
    render_method: str
    issues_count: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SeoIssueResponse(BaseModel):
    id: str
    scan_id: str
    page_id: Optional[str] = None
    page_url: Optional[str] = None
    issue_code: str
    category: str
    severity: str
    title: str
    description: str
    recommendation: str
    details: Dict[str, Any] = Field(default_factory=dict)
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SeoPageDetailResponse(SeoPageResponse):
    robots_directive: Optional[str] = None
    x_robots_tag: Optional[str] = None
    headings: Dict[str, List[str]] = Field(default_factory=dict)
    redirect_chain: List[Dict[str, Any]] = Field(default_factory=list)
    open_graph: Dict[str, Any] = Field(default_factory=dict)
    twitter_card: Dict[str, Any] = Field(default_factory=dict)
    structured_data: List[Dict[str, Any]] = Field(default_factory=list)
    images: List[SeoPageImageResponse] = Field(default_factory=list)
    links: List[SeoPageLinkResponse] = Field(default_factory=list)
    issues: List[SeoIssueResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class SeoPageListResponse(BaseModel):
    pages: List[SeoPageResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class SeoIssueListResponse(BaseModel):
    issues: List[SeoIssueResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    severity_counts: Dict[str, int] = Field(default_factory=dict)


class ScanResultsResponse(BaseModel):
    scan_id: str
    project_id: str
    target_url: str
    status: str
    overall_score: Optional[int] = None
    score_label: Optional[str] = None
    technical_score: Optional[int] = None
    indexability_score: Optional[int] = None
    metadata_score: Optional[int] = None
    links_score: Optional[int] = None
    score_breakdown: Dict[str, Any] = Field(default_factory=dict)
    pages_discovered: int = 0
    pages_crawled: int = 0
    pages_failed: int = 0
    pages_skipped: int = 0
    issues_count: int = 0
    severity_counts: Dict[str, int] = Field(default_factory=dict)
    crawl_duration: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    meta_data: Dict[str, Any] = Field(default_factory=dict)
