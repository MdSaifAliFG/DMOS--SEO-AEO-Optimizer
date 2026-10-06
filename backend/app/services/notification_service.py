import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import UserNotification, UserNotificationState
from app.services.notification_broadcaster import NotificationBroadcaster

logger = logging.getLogger("zobayrank.notifications.service")


class NotificationService:
    """
    Central service for creating, persisting, and broadcasting real platform notifications.
    Ensures every platform event is recorded in the database and delivered in real-time via SSE.
    """

    @classmethod
    def _to_utc(cls, dt: Optional[datetime]) -> datetime:
        if not dt:
            return datetime.now(timezone.utc)
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)

    @classmethod
    def _relative_time_str(cls, dt: Optional[datetime]) -> str:
        """Format datetime into human-friendly relative time string."""
        if not dt:
            return "Just now"
        utc_dt = cls._to_utc(dt)
        now = datetime.now(timezone.utc)
        diff = now - utc_dt
        total_seconds = int(diff.total_seconds())

        if total_seconds < 60:
            return "Just now"
        elif total_seconds < 3600:
            mins = max(1, total_seconds // 60)
            return f"{mins}m ago"
        elif total_seconds < 86400:
            hrs = max(1, total_seconds // 3600)
            return f"{hrs}h ago"
        else:
            days = max(1, total_seconds // 86400)
            return f"{days}d ago"

    @classmethod
    async def create_notification(
        cls,
        db: AsyncSession,
        user_id: str,
        title: str,
        message: str,
        type: str = "seo",  # "seo", "aeo", "system", "security"
        severity: str = "info",  # "info", "success", "warning", "error"
        link: Optional[str] = None,
        link_text: Optional[str] = None,
        notification_id: Optional[str] = None,
        broadcast: bool = True,
    ) -> UserNotification:
        """
        Create and persist a real platform notification in the database,
        and broadcast it immediately via SSE to connected user sessions.
        """
        if not user_id:
            raise ValueError("user_id is required to create a notification")

        notif_id = notification_id or f"notif_{uuid.uuid4().hex[:16]}"
        now = datetime.now(timezone.utc)

        # Check if notification with this ID already exists for this user (idempotency)
        existing_res = await db.execute(
            select(UserNotification).where(
                UserNotification.id == notif_id,
                UserNotification.user_id == user_id,
            )
        )
        existing = existing_res.scalar_one_or_none()

        if existing:
            existing.title = title
            existing.message = message
            existing.type = type
            existing.severity = severity
            existing.link = link
            existing.link_text = link_text
            existing.dismissed = False
            notif = existing
        else:
            notif = UserNotification(
                id=notif_id,
                user_id=user_id,
                title=title,
                message=message,
                type=type,
                severity=severity,
                read=False,
                dismissed=False,
                link=link,
                link_text=link_text,
                created_at=now,
            )
            db.add(notif)

        await db.commit()
        await db.refresh(notif)

        # Broadcast in real time to active SSE clients
        if broadcast:
            created_at_dt = cls._to_utc(notif.created_at)
            created_at_ms = int(created_at_dt.timestamp() * 1000)
            payload = {
                "id": notif.id,
                "title": notif.title,
                "message": notif.message,
                "timestamp": cls._relative_time_str(notif.created_at),
                "createdAt": created_at_ms,
                "type": notif.type,
                "severity": notif.severity,
                "read": notif.read,
                "link": notif.link,
                "linkText": notif.link_text,
            }
            try:
                await NotificationBroadcaster.broadcast_to_user(
                    user_id=user_id,
                    event_type="notification",
                    data=payload,
                )
                logger.info("Real-time notification broadcast dispatched to user %s (id: %s)", user_id, notif.id)
            except Exception as e:
                logger.warning("Failed to broadcast real-time notification to user %s: %s", user_id, e)

        return notif
