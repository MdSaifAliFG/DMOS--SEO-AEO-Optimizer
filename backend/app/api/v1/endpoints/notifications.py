from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.scan import Scan, ScanStatus
from app.models.project import Project
from app.models.aeo import AeoAnalysis, AeoProject
from app.models.aeo_monitoring import AeoAlert
from app.models.geo import GeoAlert, GeoAnalysis, GeoProject
from app.services.ai.intelligence_service import AIIntelligenceService

router = APIRouter(prefix="/notifications", tags=["Real-time Notifications & Alerts"])


def _relative_time_str(dt: Optional[datetime]) -> str:
    """Format datetime into human-friendly relative time string."""
    if not dt:
        return "Recently"
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff = now - dt
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
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """
    Returns authentic real-time notifications dynamically derived from live database events:
    - Real SEO crawl completions, running audits, and technical issue flags
    - Real AEO engine alerts, visibility changes, and citation tracking events
    - Real GEO generative monitoring alerts, rank drops, and competitor surges
    - Real AI Intelligence layer status
    Zero simulated or demo alerts.
    """
    notifications: List[Dict[str, Any]] = []

    # 1. Fetch real SEO Scans
    scan_query = select(Scan).order_by(desc(Scan.created_at)).limit(15)
    if project_id:
        scan_query = scan_query.where(Scan.project_id == project_id)
    scan_res = await db.execute(scan_query)
    scans = scan_res.scalars().all()

    for s in scans:
        if s.status == ScanStatus.COMPLETED.value:
            # Count issues from the loaded relationship; fall back to issues_count aggregate
            critical_count = sum(1 for i in (s.issues or []) if i.severity == "critical")
            issue_count = s.issues_count if s.issues_count else len(s.issues or [])
            health_score = s.overall_score or 0
            notifications.append({
                "id": f"seo_scan_{s.id}",
                "title": "SEO Technical Audit Completed",
                "message": f"Crawled {s.pages_crawled} pages on {s.target_url}. Discovered {issue_count} technical issues (Health Score: {health_score}/100).",
                "timestamp": _relative_time_str(s.completed_at or s.created_at),
                "createdAt": int((s.completed_at or s.created_at).timestamp() * 1000) if (s.completed_at or s.created_at) else int(datetime.now(timezone.utc).timestamp() * 1000),
                "type": "seo",
                "severity": "warning" if (critical_count > 0 or health_score < 70) else "success",
                "read": False,
                "link": f"/seo/scans?scanId={s.id}",
                "linkText": "View Audit Report",
            })
        elif s.status == ScanStatus.FAILED.value:
            notifications.append({
                "id": f"seo_scan_fail_{s.id}",
                "title": "SEO Crawl Incomplete",
                "message": f"Crawl for {s.target_url} encountered an error: {s.error_message or 'Connection timeout'}.",
                "timestamp": _relative_time_str(s.completed_at or s.created_at),
                "createdAt": int((s.completed_at or s.created_at).timestamp() * 1000) if (s.completed_at or s.created_at) else int(datetime.now(timezone.utc).timestamp() * 1000),
                "type": "seo",
                "severity": "error",
                "read": False,
                "link": "/seo/scans",
                "linkText": "Inspect Error",
            })
        elif s.status == ScanStatus.RUNNING.value:
            notifications.append({
                "id": f"seo_scan_run_{s.id}",
                "title": "SEO Crawl in Progress",
                "message": f"Currently crawling {s.target_url} ({s.pages_crawled} pages analyzed so far).",
                "timestamp": _relative_time_str(s.created_at),
                "createdAt": int(s.created_at.timestamp() * 1000) if s.created_at else int(datetime.now(timezone.utc).timestamp() * 1000),
                "type": "seo",
                "severity": "info",
                "read": False,
                "link": "/seo/scans",
                "linkText": "Live Crawl Progress",
            })

    # 2. Fetch real AEO Alerts & Analyses
    aeo_alert_query = select(AeoAlert).order_by(desc(AeoAlert.created_at)).limit(15)
    if project_id:
        aeo_alert_query = aeo_alert_query.where(AeoAlert.project_id == project_id)
    aeo_alert_res = await db.execute(aeo_alert_query)
    aeo_alerts = aeo_alert_res.scalars().all()

    for a in aeo_alerts:
        notifications.append({
            "id": f"aeo_alert_{a.id}",
            "title": a.title or "AEO Engine Update",
            "message": a.description or "Change detected across tracked AI Answer Engines.",
            "timestamp": _relative_time_str(a.created_at),
            "createdAt": int(a.created_at.timestamp() * 1000) if a.created_at else int(datetime.now(timezone.utc).timestamp() * 1000),
            "type": "aeo",
            "severity": a.severity if a.severity in ("info", "success", "warning", "error") else "info",
            "read": a.status == "acknowledged" or a.status == "resolved",
            "link": "/aeo/monitoring",
            "linkText": "View AEO Radar",
        })

    # 3. Fetch real AEO Analyses
    aeo_ana_query = select(AeoAnalysis).order_by(desc(AeoAnalysis.created_at)).limit(10)
    if project_id:
        aeo_ana_query = aeo_ana_query.where(AeoAnalysis.project_id == project_id)
    aeo_ana_res = await db.execute(aeo_ana_query)
    aeo_analyses = aeo_ana_res.scalars().all()

    for ana in aeo_analyses:
        if ana.status == "completed":
            notifications.append({
                "id": f"aeo_ana_{ana.id}",
                "title": "AEO Visibility Analysis Completed",
                "message": f"Analyzed {ana.questions_analyzed_count} buyer questions across {len(ana.engines_analyzed or [])} answer engines. {ana.mentions_found_count} brand mentions and {ana.citations_found_count} citations recorded.",
                "timestamp": _relative_time_str(ana.completed_at or ana.created_at),
                "createdAt": int((ana.completed_at or ana.created_at).timestamp() * 1000) if (ana.completed_at or ana.created_at) else int(datetime.now(timezone.utc).timestamp() * 1000),
                "type": "aeo",
                "severity": "success",
                "read": False,
                "link": "/aeo/visibility",
                "linkText": "View Visibility Scores",
            })

    # 4. Fetch real GEO Alerts & Analyses
    geo_alert_query = select(GeoAlert).order_by(desc(GeoAlert.detected_at)).limit(15)
    if project_id:
        geo_alert_query = geo_alert_query.where(GeoAlert.project_id == project_id)
    geo_alert_res = await db.execute(geo_alert_query)
    geo_alerts = geo_alert_res.scalars().all()

    for ga in geo_alerts:
        notifications.append({
            "id": f"geo_alert_{ga.id}",
            "title": ga.title or "GEO Search Alert",
            "message": ga.description or "Change detected across Generative Engine Optimization monitors.",
            "timestamp": _relative_time_str(ga.detected_at),
            "createdAt": int(ga.detected_at.timestamp() * 1000) if ga.detected_at else int(datetime.now(timezone.utc).timestamp() * 1000),
            "type": "aeo",  # Displayed in AI search / AEO & GEO tabs
            "severity": ga.severity if ga.severity in ("info", "success", "warning", "error") else "warning",
            "read": ga.status == "acknowledged" or ga.status == "resolved",
            "link": "/geo/alerts",
            "linkText": "Inspect GEO Alert",
        })

    # 5. Real System AI & Egress Security State
    ai_status = AIIntelligenceService.get_provider_status()
    notifications.append({
        "id": "sys_ai_intelligence_layer",
        "title": "Zobay Rank AI Intelligence Layer Online",
        "message": f"Centralized {ai_status.provider.upper()} ({ai_status.model}) intelligence engine active with ground-truth validation and deterministic scoring guardrails.",
        "timestamp": "Real-time",
        "createdAt": int(datetime.now(timezone.utc).timestamp() * 1000),
        "type": "system",
        "severity": "success" if ai_status.is_available else "info",
        "read": True,
        "link": "/overview",
        "linkText": "Engine Health",
    })

    # Sort descending by createdAt
    notifications.sort(key=lambda n: n["createdAt"], reverse=True)
    return notifications[:limit]
