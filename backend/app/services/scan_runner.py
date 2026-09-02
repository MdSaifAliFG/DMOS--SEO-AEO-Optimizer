import asyncio
from datetime import datetime, timezone
import logging
import time
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import AsyncSessionLocal
from app.models.scan import Scan, ScanStatus
from app.models.project import Project
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
    queued -> initializing -> crawling -> analyzing -> scoring -> completed (or failed/cancelled).
    """

    @classmethod
    async def run_scan_lifecycle(cls, scan_id: str) -> None:
        logger.info("Starting background scan worker for scan ID: %s", scan_id)

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

            project_domain = scan.project.domain if scan.project else "example.com"
            crawl_settings = scan.project.settings if scan.project else {}
            max_depth = crawl_settings.get("crawl_depth", 5)

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
                curr_res = await session.execute(select(Scan).where(Scan.id == scan_id))
                current = curr_res.scalar_one_or_none()
                if not current or current.status == ScanStatus.CANCELLED.value:
                    logger.info("Scan %s is marked cancelled; aborting execution.", scan_id)
                    return False

                current.status = status.value
                current.progress = progress
                current.current_step = step

                if log_msg:
                    current_logs: List[Dict[str, Any]] = list(current.logs or [])
                    current_logs.append({
                        "timestamp": get_iso_now(),
                        "level": level,
                        "step": step,
                        "message": log_msg,
                    })
                    current.logs = current_logs

                if meta_update:
                    current_meta = dict(current.meta_data or {})
                    current_meta.update(meta_update)
                    current.meta_data = current_meta

                if extra_fields:
                    for k, v in extra_fields.items():
                        setattr(current, k, v)

                if status == ScanStatus.INITIALIZING and not current.started_at:
                    current.started_at = datetime.now(timezone.utc)
                elif status in (ScanStatus.COMPLETED, ScanStatus.FAILED, ScanStatus.CANCELLED):
                    current.completed_at = datetime.now(timezone.utc)

                await session.commit()
                return True

            async def is_cancelled_check() -> bool:
                check_res = await session.execute(select(Scan.status).where(Scan.id == scan_id))
                st = check_res.scalar_one_or_none()
                return st == ScanStatus.CANCELLED.value

            async def log_callback(step: str, message: str, level: str) -> None:
                curr_res = await session.execute(select(Scan).where(Scan.id == scan_id))
                current = curr_res.scalar_one_or_none()
                if current and current.status != ScanStatus.CANCELLED.value:
                    current_logs = list(current.logs or [])
                    current_logs.append({
                        "timestamp": get_iso_now(),
                        "level": level,
                        "step": step,
                        "message": message,
                    })
                    current.logs = current_logs
                    await session.commit()

            async def progress_callback(discovered: int, crawled: int, failed: int, current_url: str) -> None:
                curr_res = await session.execute(select(Scan).where(Scan.id == scan_id))
                current = curr_res.scalar_one_or_none()
                if current and current.status != ScanStatus.CANCELLED.value:
                    current.pages_discovered = discovered
                    current.pages_crawled = crawled
                    current.pages_failed = failed
                    # Calculate progress between 15% and 65% during crawl
                    crawl_progress = min(65, 15 + int((crawled / max(discovered, 1)) * 50))
                    current.progress = crawl_progress
                    current.current_step = f"Crawling ({crawled}/{discovered} pages): {current_url[:60]}"
                    await session.commit()

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

                # Execute SEO rules on crawled pages
                issues = await SeoAnalyzer.analyze_scan(
                    db=session,
                    scan_id=scan_id,
                    project_domain=project_domain,
                    pages=crawl_result.pages,
                    robots_result=crawl_result.robots_result,
                    sitemap_result=crawl_result.sitemap_result,
                )

                if await is_cancelled_check():
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
                    },
                )

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
                except Exception:
                    pass
