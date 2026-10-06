from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.models.base import Base


class UserNotificationState(Base):
    """
    Tracks read and dismissed/deleted status for any notification (scan, alert, system, or custom)
    scoped strictly to a specific user.
    """
    __tablename__ = "user_notification_states"

    # ID format: f"{user_id}:{notification_id}"
    id = Column(String(150), primary_key=True)
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    notification_id = Column(String(100), nullable=False, index=True)
    read = Column(Boolean, nullable=False, default=False)
    dismissed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class UserNotification(Base):
    """
    Persisted custom or system-dispatched notifications for a specific user.
    """
    __tablename__ = "user_notifications"

    id = Column(String(100), primary_key=True)
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, default="system")  # "seo", "aeo", "system", "security"
    severity = Column(String(20), nullable=False, default="info")  # "info", "success", "warning", "error"
    read = Column(Boolean, nullable=False, default=False)
    dismissed = Column(Boolean, nullable=False, default=False)
    link = Column(String(255), nullable=True)
    link_text = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
