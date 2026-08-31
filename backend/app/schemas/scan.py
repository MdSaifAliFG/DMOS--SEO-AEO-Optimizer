from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.scan import ScanStatus, ScanType


class ScanLogEntry(BaseModel):
    timestamp: str
    level: str = "INFO"  # INFO, SUCCESS, WARNING, ERROR
    step: str
    message: str


class ScanCreate(BaseModel):
    scan_type: ScanType = Field(
        default=ScanType.FULL_AUDIT,
        description="Audit scan type: full_audit, technical_seo, or quick_scan"
    )
    target_url: Optional[str] = Field(
        None,
        max_length=1024,
        description="Optional custom start URL. Defaults to https://{project.domain}"
    )


class ScanResponse(BaseModel):
    id: str
    project_id: str
    target_url: str
    scan_type: str
    status: ScanStatus
    progress: int = Field(ge=0, le=100)
    current_step: str
    logs: List[Dict[str, Any]] = Field(default_factory=list)
    meta_data: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    pages_discovered: int = 0
    pages_crawled: int = 0
    pages_failed: int = 0
    pages_skipped: int = 0
    issues_count: int = 0
    overall_score: Optional[int] = None
    technical_score: Optional[int] = None
    indexability_score: Optional[int] = None
    metadata_score: Optional[int] = None
    links_score: Optional[int] = None
    score_breakdown: Dict[str, Any] = Field(default_factory=dict)
    crawl_duration: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ScanListResponse(BaseModel):
    scans: List[ScanResponse]
    total: int


class ScanCancelResponse(BaseModel):
    id: str
    status: ScanStatus
    message: str = "Scan cancellation requested"
