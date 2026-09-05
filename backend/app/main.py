from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import init_db
from app.core.redis import close_redis_pool, get_redis_pool

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("seosensing")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown routines."""
    logger.info("Initializing SeoSensing SEO & AEO Backend...")
    # Initialize DB tables
    await init_db()
    logger.info("Database schema initialized successfully.")

    # Initialize Redis if enabled
    if settings.REDIS_ENABLED:
        await get_redis_pool()

    yield

    # Shutdown
    logger.info("Shutting down SeoSensing Backend...")
    await close_redis_pool()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SeoSensing SEO & AEO Optimization Platform - Core Architecture & Scan Lifecycle Engine",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Configure CORS - Allow all origins for seamless Vercel / Cloud cross-origin connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


# Root landing
@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "phase": 1,
        "docs": f"{settings.API_V1_STR}/docs",
    }


# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)
