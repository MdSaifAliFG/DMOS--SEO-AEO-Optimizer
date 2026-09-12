from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict


class IntegrationConnectRequest(BaseModel):
    """Payload to connect or update an integration provider."""
    provider: str = Field(..., description="Provider identifier (e.g. gsc, ga4, ahrefs, semrush, openai, perplexity, gemini, copilot)")
    api_key: Optional[str] = Field(None, description="API key or access token")
    property_id: Optional[str] = Field(None, description="Target property ID or URL (e.g. for GA4 or GSC)")
    model: Optional[str] = Field(None, description="Selected AI model for AEO providers")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional provider-specific configurations")


class IntegrationTestRequest(BaseModel):
    """Payload to test provider connectivity without persisting."""
    provider: str = Field(..., description="Provider identifier")
    api_key: Optional[str] = Field(None, description="API key to test")
    property_id: Optional[str] = Field(None, description="Property ID or URL to test")
    model: Optional[str] = Field(None, description="Model to test")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict)


class IntegrationTestResponse(BaseModel):
    """Response returned after running a real-time connection ping."""
    success: bool
    provider: str
    latency_ms: int
    message: str
    details: Optional[Dict[str, Any]] = None


class IntegrationSyncResponse(BaseModel):
    """Response returned when triggering an on-demand data sync."""
    success: bool
    provider: str
    synced_at: datetime
    message: str
    telemetry_data: Dict[str, Any]


class IntegrationResponse(BaseModel):
    """Standard representation of an integration provider."""
    id: str
    provider: str
    name: str
    category: str
    description: str
    status: str
    is_connected: bool
    auth_type: str
    credentials_masked: Optional[str] = None
    config: Dict[str, Any] = Field(default_factory=dict)
    last_sync_at: Optional[datetime] = None
    sync_status: str = "idle"
    sync_error: Optional[str] = None
    telemetry_data: Dict[str, Any] = Field(default_factory=dict)
    latency_ms: Optional[int] = None
    health_status: str = "healthy"

    model_config = ConfigDict(from_attributes=True)


class IntegrationListResponse(BaseModel):
    """Aggregated list of all supported integrations and summary counts."""
    integrations: List[IntegrationResponse]
    total_available: int
    total_connected: int
    active_telemetry_feeds: int
    avg_latency_ms: int
