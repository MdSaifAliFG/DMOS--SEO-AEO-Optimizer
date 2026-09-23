from datetime import datetime, timezone
import logging
from typing import Optional
from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.services.email.email_service import send_contact_inquiry_emails

logger = logging.getLogger("zobayrank.contact")

router = APIRouter(prefix="/contact", tags=["Contact"])


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name of the inquirer")
    email: EmailStr = Field(..., description="Valid contact email address")
    subject: Optional[str] = Field("General Inquiry", max_length=150, description="Inquiry category or topic")
    message: str = Field(..., min_length=10, max_length=4000, description="Detailed message or question")
    company: Optional[str] = Field(None, max_length=120, description="Company or website domain")
    phone: Optional[str] = Field(None, max_length=30, description="Phone number")


class ContactResponse(BaseModel):
    success: bool
    message: str
    timestamp: str


@router.post(
    "",
    response_model=ContactResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit public contact inquiry",
    description="Submits a contact form message from the marketing landing page and queues email delivery.",
)
async def submit_contact_form(
    payload: ContactRequest,
    background_tasks: BackgroundTasks,
) -> ContactResponse:
    """Handles landing page contact submissions, schedules async email dispatch, and returns acknowledgment."""
    name = payload.name.strip()
    email = str(payload.email).strip().lower()
    subject = (payload.subject or "General Inquiry").strip()
    message = payload.message.strip()
    company = payload.company.strip() if payload.company else None
    phone = payload.phone.strip() if payload.phone else None

    logger.info("Received contact inquiry from %s (%s) — Subject: %s", name, email, subject)

    # Queue background email dispatch so the HTTP request completes instantaneously (< 50ms)
    background_tasks.add_task(
        send_contact_inquiry_emails,
        name=name,
        email=email,
        subject=subject,
        message=message,
        company=company,
        phone=phone,
    )

    return ContactResponse(
        success=True,
        message="Thank you! Your message has been received. Our team will review your inquiry and respond within 24 business hours.",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
