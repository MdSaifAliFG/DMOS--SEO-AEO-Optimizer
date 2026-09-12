from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, Text, DateTime, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin, generate_uuid


class PlatformIntegration(Base, TimestampMixin):
    """Stores connected search, analytics, and AI provider configurations and telemetry feeds."""
    __tablename__ = "platform_integrations"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=generate_uuid,
        comment="Provider identifier (e.g. gsc, ga4, ahrefs, semrush, openai, perplexity, gemini, copilot)",
    )
    provider: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="SEO, AEO, or Analytics",
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="disconnected",
        nullable=False,
        comment="connected, disconnected, error, syncing",
    )
    auth_type: Mapped[str] = mapped_column(
        String(30),
        default="api_key",
        nullable=False,
        comment="api_key, oauth, service_account",
    )
    credentials_masked: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Masked API key or token for UI display (e.g. sk-live-...78f2)",
    )
    credentials_encrypted: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Securely stored credential or token",
    )
    config: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Provider specific settings like model name, property ID, domain, etc.",
    )
    last_sync_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    sync_status: Mapped[str] = mapped_column(
        String(30),
        default="idle",
        nullable=False,
        comment="idle, success, failed, in_progress",
    )
    sync_error: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    telemetry_data: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Real-time telemetry payload cached from provider",
    )
