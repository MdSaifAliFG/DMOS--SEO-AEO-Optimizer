from fastapi import APIRouter
from app.core.config import settings as app_settings
from app.api.v1.endpoints import (
    actions,
    aeo,
    auth,
    geo,
    health,
    projects,
    scans,
    seo,
    public_scan,
    integrations,
    settings,
    billing,
    contact,
    notifications,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(projects.router)
api_router.include_router(scans.router)
api_router.include_router(seo.router)
api_router.include_router(actions.router)
api_router.include_router(aeo.router)
api_router.include_router(geo.router)
api_router.include_router(public_scan.router)
api_router.include_router(integrations.router)
api_router.include_router(settings.router)
api_router.include_router(billing.router)
api_router.include_router(contact.router)
api_router.include_router(notifications.router)

# DEV-ONLY bootstrap: never mounted in staging/production.
if app_settings.ENVIRONMENT not in {"staging", "production"}:
    from app.api.v1.endpoints import dev_auth

    api_router.include_router(dev_auth.router)


