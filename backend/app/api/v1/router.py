from fastapi import APIRouter
from app.api.v1.endpoints import actions, aeo, health, projects, scans, seo

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(projects.router)
api_router.include_router(scans.router)
api_router.include_router(seo.router)
api_router.include_router(actions.router)
api_router.include_router(aeo.router)
