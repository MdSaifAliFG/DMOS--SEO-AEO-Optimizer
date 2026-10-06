import asyncio
from datetime import datetime, timezone
import logging
import time
from typing import Any, Dict, List, Optional
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.scan import Scan, ScanStatus
from app.models.project import Project
from app.models.seo_page import SeoPage
from app.services.crawler.crawler import WebsiteCrawler
from app.services.seo.analyzer import SeoAnalyzer
from app.services.seo.scoring import SeoScoringEngine

logger = logging.getLogger(__name__)


def get_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class ScanRunner:
    """
    Phase 2 Background Execution Orchestrator.
    Orchestrates the live scan lifecycle:
    queued -> initializing -> crawling -> analyzing -> scoring -> completed (or failed/cancelled/timed_out).
    """

    MAX_LOGS: int = 500  # P1-02: Bounded scan logs retention limit

    @classmethod
    def bound_logs(cls, logs: List[Dict[str, Any]], max_logs: int = MAX_LOGS) -> List[Dict[str, Any]]:
        """Bounds scan log size, preserving early initialization and latest events."""
        if len(logs) <= max_logs:
            return logs
        keep_initial = 50
        keep_recent = max_logs - keep_initial - 1
        truncated_count = len(logs) - keep_initial - keep_recent
        marker = {
            "timestamp": get_iso_now(),
            "level": "INFO",
            "step": "Log Retention",
            "message": f"[Log retention limit reached: trimmed {truncated_count} intermediate logs]",
        }
        return logs[:keep_initial] + [marker] + logs[-keep_recent:]

    @classmethod
    async def run_scan_lifecycle(cls, scan_id: str, timeout_seconds: Optional[int] = None) -> None:
        """Entrypoint for scan lifecycle with execution timeout and terminal state guarantees."""
        timeout = timeout_seconds or getattr(settings, "SCAN_TIMEOUT_SECONDS", 600)
        logger.info("Starting background scan worker for scan ID: %s (timeout: %ds)", scan_id, timeout)

        try:
            await asyncio.wait_for(cls._execute_lifecycle(scan_id), timeout=float(timeout))
        except asyncio.TimeoutError:
            logger.warning("Scan %s timed out after %ds", scan_id, timeout)
            try:
                async with AsyncSessionLocal() as session:
                    res = await session.execute(select(Scan).where(Scan.id == scan_id))
                    current = res.scalar_one_or_none()
                    if current and current.status not in (
                        ScanStatus.COMPLETED.value,
                        ScanStatus.FAILED.value,
                        ScanStatus.CANCELLED.value,
                    ):
                        current.status = ScanStatus.TIMED_OUT.value
                        current.completed_at = datetime.now(timezone.utc)
                        current.current_step = f"Scan timed out after {timeout} seconds"
                        current.error_message = f"Scan exceeded maximum execution timeout limit of {timeout}s."
                        current_logs = list(current.logs or [])
                        current_logs.append({
                            "timestamp": get_iso_now(),
                            "level": "ERROR",
                            "step": "Scan Timeout",
                            "message": f"Scan execution timed out after {timeout} seconds and was halted.",
                        })
                        current.logs = cls.bound_logs(current_logs)
                        await session.commit()
            except Exception as timeout_db_err:
                logger.error("Failed to persist TIMED_OUT status for scan %s: %s", scan_id, timeout_db_err)

    @classmethod
    async def _execute_lifecycle(cls, scan_id: str) -> None:
        async with AsyncSessionLocal() as session:
            # Load scan and associated project
            res = await session.execute(
                select(Scan)
                .where(Scan.id == scan_id)
                .options(selectinload(Scan.project))
            )
            scan: Optional[Scan] = res.scalar_one_or_none()

            if not scan:
                logger.error("Scan %s not found in database", scan_id)
                return

            if scan.status == ScanStatus.CANCELLED.value:
                logger.info("Scan %s was cancelled prior to worker pickup", scan_id)
                return

            from app.services.crawler.url_normalizer import get_root_domain
            project_domain = get_root_domain(scan.project.domain) if scan.project and scan.project.domain else "example.com"
            crawl_settings = scan.project.settings if scan.project else {}
            max_depth = crawl_settings.get("crawl_depth", 5)

            # In-memory throttled progress and log buffers to avoid excessive DB writes (P1-01)
            in_memory_logs: List[Dict[str, Any]] = list(scan.logs or [])
            last_commit_time = time.monotonic()
            last_committed_progress = scan.progress or 0

            # Helper for stage transitions and logging
            async def update_stage(
                status: ScanStatus,
                progress: int,
                step: str,
                log_msg: Optional[str] = None,
                level: str = "INFO",
                meta_update: Optional[Dict[str, Any]] = None,
                extra_fields: Optional[Dict[str, Any]] = None,
            ) -> bool:
                nonlocal last_commit_time, last_committed_progress
                curr_res = await session.execute(select(Scan).where(Scan.id == scan_id))
                current = curr_res.scalar_one_or_none()
                if not current or current.status == ScanStatus.CANCELLED.value:
                    logger.info("Scan %s is marked cancelled; aborting execution.", scan_id)
                    return False

                current.status = status.value
                current.progress = progress
                current.current_step = step

                if log_msg:
                    in_memory_logs.append({
                        "timestamp": get_iso_now(),
                        "level": level,
                        "step": step,
                        "message": log_msg,
                    })

                current.logs = cls.bound_logs(in_memory_logs)

                if meta_update:
                    current_meta = dict(current.meta_data or {})
                    current_meta.update(meta_update)
                    current.meta_data = current_meta

                if extra_fields:
                    for k, v in extra_fields.items():
                        setattr(current, k, v)

                if status == ScanStatus.INITIALIZING and not current.started_at:
                    current.started_at = datetime.now(timezone.utc)
                elif status in (ScanStatus.COMPLETED, ScanStatus.FAILED, ScanStatus.CANCELLED, ScanStatus.TIMED_OUT):
                    current.completed_at = datetime.now(timezone.utc)

                await session.commit()
                last_commit_time = time.monotonic()
                last_committed_progress = progress
                return True

            async def is_cancelled_check() -> bool:
                check_res = await session.execute(select(Scan.status).where(Scan.id == scan_id))
                st = check_res.scalar_one_or_none()
                return st == ScanStatus.CANCELLED.value

            async def log_callback(step: str, message: str, level: str) -> None:
                """Appends to bounded in-memory log buffer without executing DB SELECT/COMMIT every time."""
                in_memory_logs.append({
                    "timestamp": get_iso_now(),
                    "level": level,
                    "step": step,
                    "message": message,
                })

            async def progress_callback(discovered: int, crawled: int, failed: int, current_url: str) -> None:
                """Throttled progress update avoiding repetitive per-page SELECT + COMMIT queries (P1-01)."""
                nonlocal last_commit_time, last_committed_progress
                crawl_progress = min(65, 15 + int((crawled / max(discovered, 1)) * 50))
                now = time.monotonic()

                # Flush to DB if 2+ seconds elapsed, progress advanced by >= 5%, or crawl finished
                is_finished = (crawled + failed >= discovered) and discovered > 0
                time_elapsed = now - last_commit_time
                progress_diff = abs(crawl_progress - last_committed_progress)

                if time_elapsed >= 2.0 or progress_diff >= 5 or is_finished:
                    curr_res = await session.execute(select(Scan).where(Scan.id == scan_id))
                    current = curr_res.scalar_one_or_none()
                    if current and current.status != ScanStatus.CANCELLED.value:
                        current.pages_discovered = discovered
                        current.pages_crawled = crawled
                        current.pages_failed = failed
                        current.progress = crawl_progress
                        current.current_step = f"Crawling ({crawled}/{discovered} pages): {current_url[:60]}"
                        current.logs = cls.bound_logs(in_memory_logs)
                        await session.commit()
                        last_commit_time = now
                        last_committed_progress = crawl_progress

            try:
                # STAGE 1: Initializing
                ok = await update_stage(
                    status=ScanStatus.INITIALIZING,
                    progress=10,
                    step="Initializing Crawler Environment",
                    log_msg=f"Initializing crawler worker for target '{scan.target_url}' (domain: {project_domain}).",
                    level="INFO",
                )
                if not ok:
                    return

                # STAGE 2: Crawling (Real Website Crawler)
                ok = await update_stage(
                    status=ScanStatus.CRAWLING,
                    progress=15,
                    step="Discovering Sitemaps & Internal Links",
                    log_msg="Starting asynchronous crawl and internal link exploration.",
                    level="INFO",
                )
                if not ok:
                    return

                # Real-time crawl started dispatch
                try:
                    from app.models.project import Project
                    from app.services.notification_service import NotificationService

                    proj_uid_res = await session.execute(select(Project.user_id).where(Project.id == scan.project_id))
                    p_user_id = proj_uid_res.scalar_one_or_none()
                    if p_user_id:
                        await NotificationService.create_notification(
                            db=session,
                            user_id=p_user_id,
                            title="SEO Crawl in Progress",
                            message=f"Crawling started on {scan.target_url}. Discovering sitemaps, indexing pages, and checking technical health.",
                            type="seo",
                            severity="info",
                            link=f"/seo/scans?scanId={scan_id}",
                            link_text="Live Crawl Progress",
                            notification_id=f"seo_scan_run_{scan_id}",
                            broadcast=True,
                        )
                except Exception as bcast_start_err:
                    logger.warning("Failed to broadcast scan start notification: %s", bcast_start_err)

                crawl_limit = crawl_settings.get("crawl_limit", 100)
                respect_robots = crawl_settings.get("respect_robots", True)
                follow_external = crawl_settings.get("follow_external_links", False)
                include_subdomains = crawl_settings.get("include_subdomains", False)

                crawler = WebsiteCrawler(
                    scan_id=scan_id,
                    target_url=scan.target_url,
                    project_domain=project_domain,
                    max_pages=crawl_limit,
                    max_depth=max_depth,
                    respect_robots=respect_robots,
                    follow_external_links=follow_external,
                    include_subdomains=include_subdomains,
                    progress_callback=progress_callback,
                    cancellation_check=is_cancelled_check,
                    log_callback=log_callback,
                )

                crawl_result = await crawler.run(session)

                if await is_cancelled_check():
                    await update_stage(
                        status=ScanStatus.CANCELLED,
                        progress=scan.progress or 50,
                        step="Scan Cancelled",
                        log_msg="Crawl execution cancelled by user request.",
                        level="WARNING",
                    )
                    return

                # STAGE 3: Analyzing (SEO Rule Evaluator)
                ok = await update_stage(
                    status=ScanStatus.ANALYZING,
                    progress=70,
                    step="Running Technical SEO Rules & Duplicate Detection",
                    log_msg=f"Evaluating SEO rules across {len(crawl_result.pages)} crawled pages.",
                    level="INFO",
                    extra_fields={
                        "pages_discovered": crawl_result.pages_discovered,
                        "pages_crawled": crawl_result.pages_crawled,
                        "pages_failed": crawl_result.pages_failed,
                        "pages_skipped": crawl_result.pages_skipped,
                        "crawl_duration": crawl_result.crawl_duration,
                    },
                )
                if not ok:
                    return

                # Query freshly committed pages with their images and links preloaded via selectinload
                # to prevent MissingGreenlet / lazy load failures during synchronous rule evaluation.
                pages_res = await session.execute(
                    select(SeoPage)
                    .where(SeoPage.scan_id == scan_id)
                    .options(
                        selectinload(SeoPage.images),
                        selectinload(SeoPage.links),
                    )
                    .order_by(SeoPage.created_at)
                )
                analyzable_pages = list(pages_res.scalars().all())

                # Execute SEO rules on crawled pages
                issues = await SeoAnalyzer.analyze_scan(
                    db=session,
                    scan_id=scan_id,
                    project_domain=project_domain,
                    pages=analyzable_pages if analyzable_pages else crawl_result.pages,
                    robots_result=crawl_result.robots_result,
                    sitemap_result=crawl_result.sitemap_result,
                )

                if await is_cancelled_check():
                    await update_stage(
                        status=ScanStatus.CANCELLED,
                        progress=70,
                        step="Scan Cancelled",
                        log_msg="Scan analysis cancelled by user request.",
                        level="WARNING",
                    )
                    return

                # STAGE 4: Scoring
                ok = await update_stage(
                    status=ScanStatus.SCORING,
                    progress=90,
                    step="Computing Category & Overall SEO Scores",
                    log_msg=f"Found {len(issues)} SEO issues. Calculating weighted category and overall scores.",
                    level="INFO",
                    extra_fields={"issues_count": len(issues)},
                )
                if not ok:
                    return

                scores_data = SeoScoringEngine.calculate_scores(
                    total_pages=len(crawl_result.pages),
                    issues=issues,
                )

                # STAGE 5: Completed
                await update_stage(
                    status=ScanStatus.COMPLETED,
                    progress=100,
                    step="Audit & Crawl Completed Successfully",
                    log_msg=f"Audit finished. Overall SEO Score: {scores_data['overall_score']}/100 ({scores_data['score_label']}). Issues detected: {len(issues)}.",
                    level="SUCCESS",
                    extra_fields={
                        "overall_score": scores_data["overall_score"],
                        "technical_score": scores_data["technical_score"],
                        "indexability_score": scores_data["indexability_score"],
                        "metadata_score": scores_data["metadata_score"],
                        "links_score": scores_data["links_score"],
                        "score_breakdown": scores_data["score_breakdown"],
                        "meta_data": {
                            "score_label": scores_data["score_label"],
                            "severity_counts": scores_data["severity_counts"],
                            "robots": crawl_result.robots_result.to_dict(),
                            "sitemaps": crawl_result.sitemap_result.to_dict(),
                            "duration_seconds": crawl_result.crawl_duration,
                        },
                        "error_message": None,
                    },
                )

                # Trigger Phase 4 Recommendation Generation and Optimization History
                try:
                    from app.services.seo.recommendations.recommendation_engine import RecommendationEngine
                    from app.services.seo.recommendations.history_service import OptimizationHistoryService

                    await RecommendationEngine.generate_recommendations_for_scan(
                        session, scan_id=scan_id, project_id=scan.project_id
                    )
                    await OptimizationHistoryService.record_audit_comparison(
                        session, project_id=scan.project_id, current_scan_id=scan_id
                    )
                except Exception as rec_err:
                    logger.warning("Failed to auto-generate recommendations for scan %s: %s", scan_id, rec_err)

                # Real-time notification dispatch
                try:
                    from app.models.project import Project
                    from app.models.notification import UserNotification
                    from app.services.notification_service import NotificationService

                    # Mark in-progress notification as dismissed
                    await session.execute(
                        update(UserNotification)
                        .where(UserNotification.id == f"seo_scan_run_{scan_id}")
                        .values(dismissed=True)
                    )

                    proj_uid_res = await session.execute(select(Project.user_id).where(Project.id == scan.project_id))
                    p_user_id = proj_uid_res.scalar_one_or_none()
                    if p_user_id:
                        issue_count = len(issues)
                        score = scores_data.get("overall_score", 0)
                        await NotificationService.create_notification(
                            db=session,
                            user_id=p_user_id,
                            title="SEO Technical Audit Completed",
                            message=f"Crawled {len(crawl_result.pages)} pages on {scan.target_url}. Discovered {issue_count} technical issues (Health Score: {score}/100).",
                            type="seo",
                            severity="warning" if (issue_count > 0 or score < 70) else "success",
                            link=f"/seo/scans?scanId={scan_id}",
                            link_text="View Audit Report",
                            notification_id=f"seo_scan_{scan_id}",
                            broadcast=True,
                        )
                except Exception as bcast_err:
                    logger.warning("Failed to broadcast scan completion notification: %s", bcast_err)

            except Exception as e:
                logger.exception("Uncaught exception in scan runner %s: %s", scan_id, e)
                try:
                    await update_stage(
                        status=ScanStatus.FAILED,
                        progress=100,
                        step="Audit Execution Failed",
                        log_msg=f"Crawl and analysis failed: {str(e)}",
                        level="ERROR",
                        extra_fields={"error_message": f"Scan failed during processing: {str(e)}"},
                    )

                    # Real-time failure notification dispatch
                    try:
                        from app.models.project import Project
                        from app.models.notification import UserNotification
                        from app.services.notification_service import NotificationService

                        await session.execute(
                            update(UserNotification)
                            .where(UserNotification.id == f"seo_scan_run_{scan_id}")
                            .values(dismissed=True)
                        )

                        proj_uid_res = await session.execute(select(Project.user_id).where(Project.id == scan.project_id))
                        p_user_id = proj_uid_res.scalar_one_or_none()
                        if p_user_id:
                            await NotificationService.create_notification(
                                db=session,
                                user_id=p_user_id,
                                title="SEO Crawl Incomplete",
                                message=f"Crawl for {scan.target_url} encountered an error: {str(e)}.",
                                type="seo",
                                severity="error",
                                link="/seo/scans",
                                link_text="Inspect Error",
                                notification_id=f"seo_scan_fail_{scan_id}",
                                broadcast=True,
                            )
                    except Exception as bcast_fail_err:
                        logger.warning("Failed to broadcast scan failure notification: %s", bcast_fail_err)
                except Exception as update_err:
                    logger.error("Failed to persist scan failure state for scan %s: %s", scan_id, update_err)
