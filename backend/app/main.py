import sys
import asyncio
from contextlib import asynccontextmanager
import logging

if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    except Exception:
        pass

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from app.api.v1.router import api_router
from app.core.config import require_deployment_secrets, settings
from app.core.database import init_db
from app.core.redis import close_redis_pool, get_redis_pool

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("zobayrank")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown routines."""
    logger.info("Initializing Zobay Rank SEO, AEO & GEO Backend...")
    require_deployment_secrets()
    # Initialize DB tables
    await init_db()
    logger.info("Database schema initialized successfully.")

    # Initialize Redis if enabled
    if settings.REDIS_ENABLED:
        await get_redis_pool()

    yield

    # Shutdown
    logger.info("Shutting down Zobay Rank Backend...")
    await close_redis_pool()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Zobay Rank SEO, AEO & GEO Optimization Platform - Core Architecture & Scan Lifecycle Engine",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Configure CORS from settings allowlist — never wildcard for authenticated APIs.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server exception: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected internal server error occurred",
            "detail": str(exc) if settings.DEBUG else "Internal Server Error",
        },
    )


# Root landing - supports both GET and HEAD for Render/cloud load balancer probes
@app.api_route("/", methods=["GET", "HEAD"], tags=["Root"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "phase": 1,
        "docs": f"{settings.API_V1_STR}/docs",
    }


# Health check endpoint for Docker container healthcheck & Render
@app.api_route("/health", methods=["GET", "HEAD"], tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "service": "seosensing-api",
        "version": settings.VERSION,
    }


# Convenience redirects for root-level documentation paths
@app.get("/docs", include_in_schema=False)
async def redirect_docs():
    return RedirectResponse(url=f"{settings.API_V1_STR}/docs")


@app.get("/openapi.json", include_in_schema=False)
async def redirect_openapi():
    return RedirectResponse(url=f"{settings.API_V1_STR}/openapi.json")


# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)
