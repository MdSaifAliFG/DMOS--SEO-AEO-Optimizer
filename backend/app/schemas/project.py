from datetime import datetime
import re
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


def normalize_domain(v: str) -> str:
    v = v.strip().lower()
    # Strip protocol
    if v.startswith("https://"):
        v = v[8:]
    elif v.startswith("http://"):
        v = v[7:]
    # Strip trailing path/query/fragment
    v = v.split("/")[0].split("?")[0].split("#")[0]
    # Strip port if any
    v = v.split(":")[0]
    return v


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255, description="Project or organization name")
    domain: str = Field(..., min_length=3, max_length=255, description="Root website domain (e.g. example.com)")
    description: Optional[str] = Field(None, max_length=1000, description="Optional project description")
    settings: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Project crawling and audit settings")

    @field_validator("domain")
    @classmethod
    def validate_domain(cls, v: str) -> str:
        clean = normalize_domain(v)
        # Check basic domain structure (at least one dot and valid chars or localhost for testing)
        if clean != "localhost" and not re.match(r"^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", clean):
            raise ValueError("Please provide a valid domain name (e.g., example.com or app.example.com)")
        return clean

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Project name must be at least 2 characters long")
        return v


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    domain: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

    @field_validator("domain")
    @classmethod
    def validate_domain(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        clean = normalize_domain(v)
        if clean != "localhost" and not re.match(r"^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", clean):
            raise ValueError("Please provide a valid domain name (e.g., example.com)")
        return clean


class ProjectSummaryScan(BaseModel):
    id: str
    status: str
    progress: int
    current_step: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectResponse(ProjectBase):
    id: str
    user_id: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    latest_scan: Optional[ProjectSummaryScan] = None
    total_scans: int = 0

    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int
