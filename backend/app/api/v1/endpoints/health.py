from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.core.redis import get_redis_pool
from app.schemas.common import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check(db: AsyncSession = Depends(get_db)) -> HealthResponse:
    """Comprehensive health check endpoint verifying Database and Redis availability."""
    db_status = "unknown"
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    redis_status = "disabled"
    if settings.REDIS_ENABLED:
        try:
            r = await get_redis_pool()
            if r and await r.ping():
                redis_status = "connected"
            else:
                redis_status = "unreachable"
        except Exception as e:
            redis_status = f"error: {str(e)}"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database=db_status,
        redis=redis_status,
        timestamp=datetime.now(timezone.utc),
    )
