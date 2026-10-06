import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy import desc, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.scan import Scan, ScanStatus
from app.models.project import Project
from app.models.aeo import AeoAnalysis, AeoProject
from app.models.aeo_monitoring import AeoAlert
from app.models.geo import GeoAlert, GeoAnalysis, GeoProject
from app.models.notification import UserNotification, UserNotificationState
from app.services.ai.intelligence_service import AIIntelligenceService
from app.services.notification_broadcaster import NotificationBroadcaster

logger = logging.getLogger("zobayrank.notifications")

router = APIRouter(prefix="/notifications", tags=["Real-time Notifications & Alerts"])


def _to_utc_dt(dt: Optional[datetime]) -> datetime:
    """Normalize any datetime to a timezone-aware UTC datetime."""
    if not dt:
        return datetime.now(timezone.utc)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _relative_time_str(dt: Optional[datetime]) -> str:
    """Format datetime into human-friendly relative time string."""
    if not dt:
        return "Recently"
    utc_dt = _to_utc_dt(dt)
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


@router.get("/feed", summary="Get real-time notification feed across SEO, AEO, GEO, and System")
async def get_notification_feed(
    project_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """
    Returns authentic notifications dynamically derived from live database events
    strictly scoped to the authenticated user's projects.
    Excludes any dismissed/deleted notifications and respects read status.
    Deduplicates scans so identical repetitive notifications never show.
    """
    # 0. Load user's dismissed and read notification states
    states_res = await db.execute(
        select(UserNotificationState).where(UserNotificationState.user_id == current_user.id)
    )
    user_states = states_res.scalars().all()
    dismissed_ids = {s.notification_id for s in user_states if s.dismissed}
    read_ids = {s.notification_id for s in user_states if s.read}

    # Check for global clear-all cutoff
    all_cleared_state = next((s for s in user_states if s.notification_id == "__ALL__" and s.dismissed), None)
    cleared_cutoff_ms = 0
    if all_cleared_state and all_cleared_state.updated_at:
        cleared_cutoff_ms = int(_to_utc_dt(all_cleared_state.updated_at).timestamp() * 1000)

    notifications: List[Dict[str, Any]] = []

    active_project_id = project_id if isinstance(project_id, str) and project_id.strip() else None

    user_proj_subq = select(Project.id).where(Project.user_id == current_user.id)
    user_aeo_subq = select(AeoProject.id).where(AeoProject.user_id == current_user.id)
    user_geo_subq = select(GeoProject.id).where(GeoProject.user_id == current_user.id)

    # 1. Primary: Fetch custom / dispatched user notifications from database
    user_notifs_query = (
        select(UserNotification)
        .where(UserNotification.user_id == current_user.id, UserNotification.dismissed.is_(False))
        .order_by(desc(UserNotification.created_at))
        .limit(40)
    )
    user_notifs_res = await db.execute(user_notifs_query)
    for un in user_notifs_res.scalars().all():
        un_created_dt = _to_utc_dt(un.created_at)
        created_at_ms = int(un_created_dt.timestamp() * 1000)
        if un.id in dismissed_ids or created_at_ms <= cleared_cutoff_ms:
            continue
        notifications.append({
            "id": un.id,
            "title": un.title,
            "message": un.message,
            "timestamp": _relative_time_str(un_created_dt),
            "createdAt": created_at_ms,
            "type": un.type,
            "severity": un.severity,
            "read": un.id in read_ids or un.read,
            "link": un.link,
            "linkText": un.link_text,
        })

    # 2. Fetch real SEO Scans for current user (deduplicated by project and target URL)
    scan_query = select(Scan).where(Scan.project_id.in_(user_proj_subq)).order_by(desc(Scan.created_at)).limit(25)
    if active_project_id:
        scan_query = scan_query.where(Scan.project_id == active_project_id)
    scan_res = await db.execute(scan_query)
    scans = scan_res.scalars().all()

    seen_scan_targets = set()
    for s in scans:
        completed_dt = _to_utc_dt(s.completed_at or s.created_at)
        created_at_ms = int(completed_dt.timestamp() * 1000)

        if created_at_ms <= cleared_cutoff_ms:
            continue

        target_key = f"{s.project_id}:{s.target_url}"
        if target_key in seen_scan_targets:
            # Deduplicate: only show the latest scan per target to avoid repetitive identical notifications
            continue
        seen_scan_targets.add(target_key)

        if s.status == ScanStatus.COMPLETED.value:
            notif_id = f"seo_scan_{s.id}"
            if notif_id in dismissed_ids:
                continue
            issue_count = s.issues_count or 0
            health_score = s.overall_score or 0
            notifications.append({
                "id": notif_id,
                "title": "SEO Technical Audit Completed",
                "message": f"Crawled {s.pages_crawled} pages on {s.target_url}. Discovered {issue_count} technical issues (Health Score: {health_score}/100).",
                "timestamp": _relative_time_str(completed_dt),
                "createdAt": created_at_ms,
                "type": "seo",
                "severity": "warning" if (issue_count > 0 or health_score < 70) else "success",
                "read": notif_id in read_ids,
                "link": f"/seo/scans?scanId={s.id}",
                "linkText": "View Audit Report",
            })
        elif s.status == ScanStatus.FAILED.value:
            notif_id = f"seo_scan_fail_{s.id}"
            if notif_id in dismissed_ids:
                continue
            notifications.append({
                "id": notif_id,
                "title": "SEO Crawl Incomplete",
                "message": f"Crawl for {s.target_url} encountered an error: {s.error_message or 'Connection timeout'}.",
                "timestamp": _relative_time_str(completed_dt),
                "createdAt": created_at_ms,
                "type": "seo",
                "severity": "error",
                "read": notif_id in read_ids,
                "link": "/seo/scans",
                "linkText": "Inspect Error",
            })
        elif s.status == ScanStatus.RUNNING.value:
            notif_id = f"seo_scan_run_{s.id}"
            if notif_id in dismissed_ids:
                continue
            notifications.append({
                "id": notif_id,
                "title": "SEO Crawl in Progress",
                "message": f"Currently crawling {s.target_url} ({s.pages_crawled} pages analyzed so far).",
                "timestamp": _relative_time_str(completed_dt),
                "createdAt": created_at_ms,
                "type": "seo",
                "severity": "info",
                "read": notif_id in read_ids,
                "link": "/seo/scans",
                "linkText": "Live Crawl Progress",
            })

    # 3. Fetch real AEO Alerts for current user
    aeo_alert_query = select(AeoAlert).where(AeoAlert.project_id.in_(user_aeo_subq)).order_by(desc(AeoAlert.created_at)).limit(20)
    if active_project_id:
        aeo_alert_query = aeo_alert_query.where(AeoAlert.project_id == active_project_id)
    aeo_alert_res = await db.execute(aeo_alert_query)
    aeo_alerts = aeo_alert_res.scalars().all()

    for a in aeo_alerts:
        notif_id = f"aeo_alert_{a.id}"
        alert_dt = _to_utc_dt(a.created_at)
        created_at_ms = int(alert_dt.timestamp() * 1000)
        if notif_id in dismissed_ids or created_at_ms <= cleared_cutoff_ms:
            continue
        is_read = notif_id in read_ids or a.status in ("acknowledged", "resolved")
        notifications.append({
            "id": notif_id,
            "title": a.title or "AEO Engine Update",
            "message": a.description or "Change detected across tracked AI Answer Engines.",
            "timestamp": _relative_time_str(alert_dt),
            "createdAt": created_at_ms,
            "type": "aeo",
            "severity": a.severity if a.severity in ("info", "success", "warning", "error") else "info",
            "read": is_read,
            "link": "/aeo/monitoring",
            "linkText": "View AEO Radar",
        })

    # 4. Fetch real AEO Analyses for current user (latest per project)
    aeo_ana_query = select(AeoAnalysis).where(AeoAnalysis.project_id.in_(user_aeo_subq)).order_by(desc(AeoAnalysis.created_at)).limit(15)
    if active_project_id:
        aeo_ana_query = aeo_ana_query.where(AeoAnalysis.project_id == active_project_id)
    aeo_ana_res = await db.execute(aeo_ana_query)
    aeo_analyses = aeo_ana_res.scalars().all()

    seen_aeo_projects = set()
    for ana in aeo_analyses:
        if ana.status == "completed":
            if ana.project_id in seen_aeo_projects:
                continue
            seen_aeo_projects.add(ana.project_id)

            notif_id = f"aeo_ana_{ana.id}"
            completed_dt = _to_utc_dt(ana.completed_at or ana.created_at)
            created_at_ms = int(completed_dt.timestamp() * 1000)
            if notif_id in dismissed_ids or created_at_ms <= cleared_cutoff_ms:
                continue
            notifications.append({
                "id": notif_id,
                "title": "AEO Visibility Analysis Completed",
                "message": f"Analyzed {ana.questions_analyzed_count} buyer questions across {len(ana.engines_analyzed or [])} answer engines. {ana.mentions_found_count} brand mentions and {ana.citations_found_count} citations recorded.",
                "timestamp": _relative_time_str(completed_dt),
                "createdAt": created_at_ms,
                "type": "aeo",
                "severity": "success",
                "read": notif_id in read_ids,
                "link": "/aeo/visibility",
                "linkText": "View Visibility Scores",
            })

    # 5. Fetch real GEO Alerts for current user
    geo_alert_query = select(GeoAlert).where(GeoAlert.project_id.in_(user_geo_subq)).order_by(desc(GeoAlert.detected_at)).limit(20)
    if active_project_id:
        geo_alert_query = geo_alert_query.where(GeoAlert.project_id == active_project_id)
    geo_alert_res = await db.execute(geo_alert_query)
    geo_alerts = geo_alert_res.scalars().all()

    for ga in geo_alerts:
        notif_id = f"geo_alert_{ga.id}"
        geo_dt = _to_utc_dt(ga.detected_at)
        created_at_ms = int(geo_dt.timestamp() * 1000)
        if notif_id in dismissed_ids or created_at_ms <= cleared_cutoff_ms:
            continue
        is_read = notif_id in read_ids or ga.status in ("acknowledged", "resolved")
        notifications.append({
            "id": notif_id,
            "title": ga.title or "GEO Search Alert",
            "message": ga.description or "Change detected across Generative Engine Optimization monitors.",
            "timestamp": _relative_time_str(geo_dt),
            "createdAt": created_at_ms,
            "type": "aeo",
            "severity": ga.severity if ga.severity in ("info", "success", "warning", "error") else "warning",
            "read": is_read,
            "link": "/geo/alerts",
            "linkText": "Inspect GEO Alert",
        })

    # Sort descending by createdAt first
    notifications.sort(key=lambda n: n["createdAt"], reverse=True)

    # Strictly deduplicate by id to ensure unique keys across all sources
    deduped_notifications: List[Dict[str, Any]] = []
    seen_ids = set()
    for notif in notifications:
        nid = notif.get("id")
        if nid and nid not in seen_ids:
            seen_ids.add(nid)
            deduped_notifications.append(notif)

    return deduped_notifications[:limit]


@router.get("/stream", summary="Real-time Server-Sent Events (SSE) notification stream")
async def stream_notifications(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    """
    Establishes a persistent Server-Sent Events (SSE) stream for real-time notification delivery.
    Automatically dispatches notifications as soon as scans complete, alerts trigger, or events occur.
    """
    queue = await NotificationBroadcaster.subscribe(current_user.id)

    async def event_generator():
        try:
            # Yield initial connection confirmation
            init_data = json.dumps({
                "status": "connected",
                "user_id": current_user.id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
            yield f"event: connected\ndata: {init_data}\n\n"

            while True:
                # Check if client disconnected
                if await request.is_disconnected():
                    break

                try:
                    # Wait up to 15 seconds for a real event; otherwise send keep-alive ping
                    message = await asyncio.wait_for(queue.get(), timeout=15.0)
                    event_type = message.get("event", "notification")
                    payload = json.dumps(message.get("data", {}))
                    yield f"event: {event_type}\ndata: {payload}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive ping to prevent proxy/browser timeout
                    ping_payload = json.dumps({"timestamp": datetime.now(timezone.utc).isoformat()})
                    yield f"event: ping\ndata: {ping_payload}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            await NotificationBroadcaster.unsubscribe(current_user.id, queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        },
    )


@router.post("/read-all", summary="Mark all notifications as read for current user")
async def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    feed = await get_notification_feed(limit=100, current_user=current_user, db=db)
    unread_ids = [n["id"] for n in feed if not n.get("read", False)]

    for notif_id in unread_ids:
        state_id = f"{current_user.id}:{notif_id}"
        res = await db.execute(select(UserNotificationState).where(UserNotificationState.id == state_id))
        state = res.scalar_one_or_none()
        if state:
            state.read = True
            state.updated_at = datetime.now(timezone.utc)
        else:
            db.add(UserNotificationState(
                id=state_id,
                user_id=current_user.id,
                notification_id=notif_id,
                read=True,
                dismissed=False,
            ))

    await db.execute(
        update(UserNotification)
        .where(UserNotification.user_id == current_user.id)
        .values(read=True)
    )

    await db.commit()

    await NotificationBroadcaster.broadcast_to_user(
        current_user.id,
        "notification_read_all",
        {"count": len(unread_ids)},
    )

    return {"success": True, "marked_read_count": len(unread_ids)}


@router.post("/{notification_id}/read", summary="Mark a single notification as read")
async def mark_notification_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    state_id = f"{current_user.id}:{notification_id}"
    res = await db.execute(select(UserNotificationState).where(UserNotificationState.id == state_id))
    state = res.scalar_one_or_none()

    if state:
        state.read = True
        state.updated_at = datetime.now(timezone.utc)
    else:
        state = UserNotificationState(
            id=state_id,
            user_id=current_user.id,
            notification_id=notification_id,
            read=True,
            dismissed=False,
        )
        db.add(state)

    await db.execute(
        update(UserNotification)
        .where(UserNotification.id == notification_id, UserNotification.user_id == current_user.id)
        .values(read=True)
    )

    await db.commit()

    await NotificationBroadcaster.broadcast_to_user(
        current_user.id,
        "notification_read",
        {"id": notification_id},
    )

    return {"success": True, "id": notification_id, "read": True}


@router.delete("/clear-all", summary="Clear and dismiss all notifications permanently")
async def clear_all_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    # 1. Record global clear-all cutoff for this user
    all_state_id = f"{current_user.id}:__ALL__"
    all_res = await db.execute(select(UserNotificationState).where(UserNotificationState.id == all_state_id))
    all_state = all_res.scalar_one_or_none()
    if all_state:
        all_state.dismissed = True
        all_state.updated_at = now
    else:
        db.add(UserNotificationState(
            id=all_state_id,
            user_id=current_user.id,
            notification_id="__ALL__",
            read=True,
            dismissed=True,
            created_at=now,
            updated_at=now,
        ))

    # 2. Dismiss all custom user_notifications
    await db.execute(
        update(UserNotification)
        .where(UserNotification.user_id == current_user.id)
        .values(dismissed=True)
    )

    await db.commit()

    # 3. Broadcast cleared event via SSE
    await NotificationBroadcaster.broadcast_to_user(
        current_user.id,
        "notification_cleared",
        {"timestamp": now.isoformat()},
    )

    return {"success": True, "cleared_all": True}


@router.delete("/{notification_id}", summary="Delete / dismiss a single notification permanently")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    state_id = f"{current_user.id}:{notification_id}"
    res = await db.execute(select(UserNotificationState).where(UserNotificationState.id == state_id))
    state = res.scalar_one_or_none()

    if state:
        state.dismissed = True
        state.updated_at = datetime.now(timezone.utc)
    else:
        state = UserNotificationState(
            id=state_id,
            user_id=current_user.id,
            notification_id=notification_id,
            read=True,
            dismissed=True,
        )
        db.add(state)

    await db.execute(
        update(UserNotification)
        .where(UserNotification.id == notification_id, UserNotification.user_id == current_user.id)
        .values(dismissed=True)
    )

    await db.commit()

    await NotificationBroadcaster.broadcast_to_user(
        current_user.id,
        "notification_dismissed",
        {"id": notification_id},
    )

    return {"success": True, "id": notification_id, "dismissed": True}

