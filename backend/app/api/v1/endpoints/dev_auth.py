"""DEV-ONLY auth bootstrap. Never mounted in staging/production (see router)."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import create_access_token
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

router = APIRouter(prefix="/dev/auth", tags=["Dev Auth (non-production)"])


class DevTokenRequest(BaseModel):
    email: EmailStr


class DevTokenResponse(BaseModel):
    token: str
    user_id: str
    email: str


@router.post("/token", response_model=DevTokenResponse)
async def mint_dev_token(
    payload: DevTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    # Defense in depth: endpoint must not exist in staging/production.
    assert settings.ENVIRONMENT not in {"staging", "production"}, "dev auth disabled"
    if not settings.DEV_AUTH_SECRET:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    provided = request.headers.get("X-Dev-Auth-Secret", "")
    if provided != settings.DEV_AUTH_SECRET:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    clean_email = payload.email.strip().lower()
    res = await db.execute(select(User).where(User.email == clean_email))
    user = res.scalars().first()
    if user is None:
        user = User(email=clean_email, full_name=clean_email.split("@")[0], is_active=True)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return DevTokenResponse(token=create_access_token(user.id), user_id=user.id, email=user.email)
