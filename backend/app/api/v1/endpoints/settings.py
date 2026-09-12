from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.system_settings import (
    WorkspaceSettingsUpdate,
    NotificationSettingsUpdate,
    CrawlerSettingsUpdate,
    SystemSettingsResponse,
    SystemHealthDiagnosticsResponse,
)
from app.services.system_settings_service import SystemSettingsService

router = APIRouter(prefix="/settings", tags=["System Settings"])


@router.get(
    "",
    response_model=SystemSettingsResponse,
    summary="Get global platform settings",
)
async def get_system_settings(
    db: AsyncSession = Depends(get_db),
) -> SystemSettingsResponse:
    """Retrieve global workspace identity, notification preferences, and default crawler limits."""
    return await SystemSettingsService.get_or_create_settings(db)


@router.patch(
    "/workspace",
    response_model=SystemSettingsResponse,
    summary="Update workspace profile and regional preferences",
)
async def update_workspace_profile(
    data: WorkspaceSettingsUpdate,
    db: AsyncSession = Depends(get_db),
) -> SystemSettingsResponse:
    """Update enterprise workspace name, owner contact email, timezone, and language."""
    return await SystemSettingsService.update_workspace_settings(db, data)


@router.patch(
    "/notifications",
    response_model=SystemSettingsResponse,
    summary="Update alert triggers and notification preferences",
)
async def update_notifications(
    data: NotificationSettingsUpdate,
    db: AsyncSession = Depends(get_db),
) -> SystemSettingsResponse:
    """Configure email notification triggers across SEO, AEO, and GEO optimization pillars."""
    return await SystemSettingsService.update_notification_settings(db, data)


@router.patch(
    "/crawler",
    response_model=SystemSettingsResponse,
    summary="Update default technical crawler limits and policies",
)
async def update_crawler_policy(
    data: CrawlerSettingsUpdate,
    db: AsyncSession = Depends(get_db),
) -> SystemSettingsResponse:
    """Update global BFS crawler depth, rate-limiting delays, and worker concurrency thresholds."""
    return await SystemSettingsService.update_crawler_settings(db, data)


@router.get(
    "/health-diagnostics",
    response_model=SystemHealthDiagnosticsResponse,
    summary="Get real-time platform runtime health diagnostics",
)
async def get_health_diagnostics(
    db: AsyncSession = Depends(get_db),
) -> SystemHealthDiagnosticsResponse:
    """Retrieve live database roundtrip latency, multi-pillar engine states, and SMTP relay health."""
    return await SystemSettingsService.get_health_diagnostics(db)
