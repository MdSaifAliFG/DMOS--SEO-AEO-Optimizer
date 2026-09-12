from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict


class WorkspaceSettingsUpdate(BaseModel):
    """Payload to update workspace name, timezone, and language preferences."""
    workspace_name: Optional[str] = Field(None, description="Workspace display name")
    owner_email: Optional[str] = Field(None, description="Administrative contact email")
    timezone: Optional[str] = Field(None, description="Default audit timezone")
    default_language: Optional[str] = Field(None, description="Default language locale")


class NotificationSettingsUpdate(BaseModel):
    """Payload to update multi-pillar alert triggers and notification preferences."""
    notify_seo_complete: Optional[bool] = Field(None, description="Notify on SEO audit completion")
    notify_aeo_shift: Optional[bool] = Field(None, description="Notify on AEO answer engine visibility drops")
    notify_geo_alert: Optional[bool] = Field(None, description="Notify on GEO crawler blocking or rule failures")
    notify_weekly_digest: Optional[bool] = Field(None, description="Send weekly executive Monday morning brief")
    alert_emails: Optional[List[str]] = Field(None, description="List of alert recipient emails")


class CrawlerSettingsUpdate(BaseModel):
    """Payload to update global default crawler policy limits."""
    max_crawl_pages: Optional[int] = Field(None, ge=5, le=2000)
    crawl_delay_ms: Optional[int] = Field(None, ge=50, le=2000)
    concurrent_workers: Optional[int] = Field(None, ge=1, le=10)
    respect_robots: Optional[bool] = None
    follow_external: Optional[bool] = None
    include_subdomains: Optional[bool] = None
    critical_threshold: Optional[int] = Field(None, ge=0, le=50)
    score_alert_threshold: Optional[int] = Field(None, ge=10, le=100)


class SystemSettingsResponse(BaseModel):
    """Full system settings payload."""
    id: str
    workspace_name: str
    owner_email: str
    timezone: str
    default_language: str
    notification_preferences: Dict[str, Any]
    default_crawler_policy: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PillarHealthStatus(BaseModel):
    """Health indicator for an individual platform pillar."""
    name: str
    status: str = "Online"
    is_healthy: bool = True
    active_rules_or_features: str
    latency_ms: Optional[int] = None
    details: Optional[Dict[str, Any]] = None


class SystemHealthDiagnosticsResponse(BaseModel):
    """Comprehensive real-time runtime diagnostics across all 3 optimization pillars."""
    database_status: str = "Connected"
    database_latency_ms: int = 12
    seo_engine: PillarHealthStatus
    aeo_engine: PillarHealthStatus
    geo_engine: PillarHealthStatus
    smtp_relay: Dict[str, Any]
    total_projects: int = 0
    total_scans_completed: int = 0
    server_time: datetime
    uptime_status: str = "99.99% Operational"
