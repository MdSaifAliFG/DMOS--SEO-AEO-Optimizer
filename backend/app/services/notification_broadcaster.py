import asyncio
import json
import logging
from typing import Any, Dict, Optional, Set

logger = logging.getLogger("zobayrank.notifications.broadcaster")


class NotificationBroadcaster:
    """
    Central in-memory pub-sub event broadcaster for real-time notifications.
    Supports Server-Sent Events (SSE) streaming directly to authenticated user sessions.
    """

    _subscribers: Dict[str, Set[asyncio.Queue]] = {}
    _lock = asyncio.Lock()

    @classmethod
    async def subscribe(cls, user_id: str) -> asyncio.Queue:
        """Subscribe a user's connection to real-time events."""
        queue: asyncio.Queue = asyncio.Queue(maxsize=100)
        async with cls._lock:
            if user_id not in cls._subscribers:
                cls._subscribers[user_id] = set()
            cls._subscribers[user_id].add(queue)
            logger.info("User %s subscribed to notification stream (active: %d)", user_id, len(cls._subscribers[user_id]))
        return queue

    @classmethod
    async def unsubscribe(cls, user_id: str, queue: asyncio.Queue) -> None:
        """Unsubscribe a user's connection upon disconnect."""
        async with cls._lock:
            if user_id in cls._subscribers:
                cls._subscribers[user_id].discard(queue)
                if not cls._subscribers[user_id]:
                    del cls._subscribers[user_id]
                logger.info("User %s disconnected from notification stream", user_id)

    @classmethod
    async def broadcast_to_user(cls, user_id: str, event_type: str, data: Dict[str, Any]) -> int:
        """
        Send an event immediately to all active SSE connections for this user.
        Returns the number of subscribers the event was delivered to.
        """
        message = {
            "event": event_type,
            "data": data,
        }
        sent_count = 0
        async with cls._lock:
            queues = list(cls._subscribers.get(user_id, set()))

        for q in queues:
            try:
                q.put_nowait(message)
                sent_count += 1
            except asyncio.QueueFull:
                logger.warning("Notification queue full for user %s, dropping message", user_id)
            except Exception as e:
                logger.error("Error dispatching notification to user %s: %s", user_id, e)

        return sent_count

    @classmethod
    async def broadcast_to_all(cls, event_type: str, data: Dict[str, Any]) -> int:
        """Send an event to all connected users."""
        message = {
            "event": event_type,
            "data": data,
        }
        sent_count = 0
        async with cls._lock:
            all_queues = [q for q_set in cls._subscribers.values() for q in q_set]

        for q in all_queues:
            try:
                q.put_nowait(message)
                sent_count += 1
            except Exception:
                pass

        return sent_count
