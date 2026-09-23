import asyncio
from datetime import datetime, timezone
import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.project import Project
from app.models.scan import Scan, ScanStatus
from app.services.scan_runner import ScanRunner, get_iso_now


def test_bounded_scan_logs_truncation():
    """P1-02: Verify ScanRunner.bound_logs restricts logs to MAX_LOGS without unbounded JSON growth."""
    raw_logs = [
        {"timestamp": get_iso_now(), "level": "INFO", "step": f"Step {i}", "message": f"Log message number {i}"}
        for i in range(650)
    ]

    bounded = ScanRunner.bound_logs(raw_logs, max_logs=500)
    assert len(bounded) == 500

    # Ensure initial bootstrap logs are kept
    assert bounded[0]["message"] == "Log message number 0"
    assert bounded[49]["message"] == "Log message number 49"

    # Ensure retention marker is present
    marker = bounded[50]
    assert marker["step"] == "Log Retention"
    assert "trimmed" in marker["message"] or "limit reached" in marker["message"]

    # Ensure most recent logs are kept
    assert bounded[-1]["message"] == "Log message number 649"


@pytest.mark.asyncio
async def test_scan_timeout_handling(db_session: AsyncSession, monkeypatch):
    """P1-03: Verify long-running scan transitions to TIMED_OUT status upon exceeding timeout."""
    project = Project(
        name="Test Timeout Project",
        domain="example.com",
    )
    db_session.add(project)
    await db_session.commit()
    await db_session.refresh(project)

    scan = Scan(
        project_id=project.id,
        target_url="https://example.com",
        status=ScanStatus.INITIALIZING.value,
        progress=10,
        current_step="Initializing",
        logs=[],
    )
    db_session.add(scan)
    await db_session.commit()
    await db_session.refresh(scan)

    from app.tests.conftest import TestingSessionLocal
    monkeypatch.setattr("app.services.scan_runner.AsyncSessionLocal", TestingSessionLocal)

    # Mock _execute_lifecycle to hang indefinitely
    async def mock_hanging_lifecycle(scan_id: str):
        await asyncio.sleep(10)

    monkeypatch.setattr(ScanRunner, "_execute_lifecycle", mock_hanging_lifecycle)

    # Run scan lifecycle with 0.1s timeout
    await ScanRunner.run_scan_lifecycle(scan.id, timeout_seconds=0.1)

    # Re-fetch scan from DB
    await db_session.refresh(scan)
    assert scan.status == ScanStatus.TIMED_OUT.value
    assert scan.completed_at is not None
    assert "timeout" in scan.error_message.lower()


@pytest.mark.asyncio
async def test_scan_failure_exception_capture(db_session: AsyncSession, monkeypatch):
    """P1-04: Verify uncaught exceptions in scan runner are captured and scan is marked FAILED."""
    project = Project(
        name="Test Failure Project",
        domain="example.com",
    )
    db_session.add(project)
    await db_session.commit()
    await db_session.refresh(project)

    scan = Scan(
        project_id=project.id,
        target_url="https://example.com",
        status=ScanStatus.QUEUED.value,
        progress=0,
        current_step="Queued",
        logs=[],
    )
    db_session.add(scan)
    await db_session.commit()
    await db_session.refresh(scan)

    from app.tests.conftest import TestingSessionLocal
    monkeypatch.setattr("app.services.scan_runner.AsyncSessionLocal", TestingSessionLocal)

    # Trigger failure during crawl execution
    async def mock_failing_crawler_run(self, session):
        raise RuntimeError("Simulated target server connection failure")

    from app.services.crawler.crawler import WebsiteCrawler
    monkeypatch.setattr(WebsiteCrawler, "run", mock_failing_crawler_run)

    await ScanRunner.run_scan_lifecycle(scan.id, timeout_seconds=10)

    await db_session.refresh(scan)
    assert scan.status == ScanStatus.FAILED.value
    assert scan.completed_at is not None
    assert "simulated target server connection failure" in scan.error_message.lower()
