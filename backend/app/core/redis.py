import logging
from typing import Optional
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger(__name__)

redis_client: Optional[aioredis.Redis] = None


async def get_redis_pool() -> Optional[aioredis.Redis]:
    """Get or create the async Redis connection pool."""
    global redis_client
    if not settings.REDIS_ENABLED:
        return None

    if redis_client is None:
        try:
            redis_client = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
            )
            await redis_client.ping()
            logger.info("Connected to Redis at %s", settings.REDIS_URL)
        except Exception as e:
            logger.warning("Could not connect to Redis: %s. Continuing with in-memory background worker.", e)
            redis_client = None
    return redis_client


async def close_redis_pool() -> None:
    """Close the async Redis connection pool."""
    global redis_client
    if redis_client is not None:
        try:
            await redis_client.aclose()
            logger.info("Closed Redis connection pool.")
        except Exception as e:
            logger.warning("Error closing Redis pool: %s", e)
        finally:
            redis_client = None
