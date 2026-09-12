from typing import Optional, Dict, Any
from sqlalchemy import String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class SystemSettings(Base, TimestampMixin):
    """Stores global enterprise workspace configuration, alert thresholds, and crawler policies."""
    __tablename__ = "system_settings"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default="global",
        comment="Settings scope identifier (e.g. global)",
    )
    workspace_name: Mapped[str] = mapped_column(
        String(255),
        default="Enterprise Global Growth",
        nullable=False,
    )
    owner_email: Mapped[str] = mapped_column(
        String(255),
        default="admin@seosensing-enterprise.internal",
        nullable=False,
    )
    timezone: Mapped[str] = mapped_column(
        String(100),
        default="UTC (GMT+00:00)",
        nullable=False,
    )
    default_language: Mapped[str] = mapped_column(
        String(50),
        default="en-US",
        nullable=False,
    )
    notification_preferences: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "notify_seo_complete": True,
            "notify_aeo_shift": True,
            "notify_geo_alert": True,
            "notify_weekly_digest": True,
            "alert_emails": ["dm@fortunehestia.in"],
        },
        nullable=False,
    )
    default_crawler_policy: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "max_crawl_pages": 100,
            "crawl_delay_ms": 250,
            "concurrent_workers": 5,
            "respect_robots": True,
            "follow_external": False,
            "include_subdomains": False,
            "critical_threshold": 5,
            "score_alert_threshold": 70,
        },
        nullable=False,
    )
