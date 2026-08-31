from datetime import datetime
from typing import Generic, Optional, TypeVar
from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard unified API response wrapper."""
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None


class HealthResponse(BaseModel):
    """Health check response schema."""
    status: str = "healthy"
    version: str
    environment: str
    database: str
    redis: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PaginationMeta(BaseModel):
    """Pagination metadata schema."""
    total_count: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool
