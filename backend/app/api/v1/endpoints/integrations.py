from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.integration import (
    IntegrationConnectRequest,
    IntegrationTestRequest,
    IntegrationTestResponse,
    IntegrationSyncResponse,
    IntegrationResponse,
    IntegrationListResponse,
)
from app.services.integration_service import IntegrationService

router = APIRouter(prefix="/integrations", tags=["Platform Integrations"])


@router.get(
    "",
    response_model=IntegrationListResponse,
    summary="List all platform integration providers and statuses",
)
async def list_integrations(
    db: AsyncSession = Depends(get_db),
) -> IntegrationListResponse:
    """Retrieve all supported search, analytics, and AI engine integrations with real-time status."""
    return await IntegrationService.get_all_integrations(db)


@router.post(
    "/test",
    response_model=IntegrationTestResponse,
    summary="Test connection credentials without saving",
)
async def test_integration_credentials(
    request: IntegrationTestRequest,
) -> IntegrationTestResponse:
    """Perform a live handshake/ping test against the provider API and return response latency."""
    return await IntegrationService.test_connection(request)


@router.post(
    "/{provider}/test",
    response_model=IntegrationTestResponse,
    summary="Test connection for a specific provider",
)
async def test_specific_provider(
    provider: str,
    request: IntegrationTestRequest,
) -> IntegrationTestResponse:
    """Run connectivity test for the given provider."""
    request.provider = provider
    return await IntegrationService.test_connection(request)


@router.post(
    "/{provider}/connect",
    response_model=IntegrationResponse,
    summary="Connect and configure an integration provider",
)
async def connect_integration(
    provider: str,
    data: IntegrationConnectRequest,
    db: AsyncSession = Depends(get_db),
) -> IntegrationResponse:
    """Save API credentials, initialize telemetry baseline, and activate real-time synchronization."""
    data.provider = provider
    try:
        return await IntegrationService.connect_provider(db, data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/{provider}/sync",
    response_model=IntegrationSyncResponse,
    summary="Trigger real-time telemetry sync",
)
async def sync_integration(
    provider: str,
    db: AsyncSession = Depends(get_db),
) -> IntegrationSyncResponse:
    """Perform on-demand real-time sync to pull fresh search metrics or citation data."""
    try:
        return await IntegrationService.sync_provider(db, provider)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/{provider}/disconnect",
    response_model=IntegrationResponse,
    summary="Disconnect an integration provider",
)
async def disconnect_integration(
    provider: str,
    db: AsyncSession = Depends(get_db),
) -> IntegrationResponse:
    """Disconnect provider, revoke active sync, and securely wipe credentials."""
    try:
        return await IntegrationService.disconnect_provider(db, provider)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
