import asyncio
import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.billing import CreditWallet, CreditTransaction
from app.services.credit_service import (
    CreditWalletService,
    CreditReconciliationService,
)


@pytest.mark.asyncio
async def test_deduct_normal(db_session: AsyncSession):
    """Test standard atomic deduction reduces available balance and logs ledger entry."""
    ws_id = "ws_test_deduct_norm"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)
    assert wallet.available_credits == 50

    success, tx = await CreditWalletService.deduct_atomic(
        db=db_session,
        workspace_id=ws_id,
        amount=20,
        operation="seo_page_analysis",
        module="SEO",
    )
    assert success is True
    assert tx is not None
    assert tx.amount == -20

    await db_session.refresh(wallet)
    assert wallet.available_credits == 30
    assert wallet.used_credits == 20


@pytest.mark.asyncio
async def test_deduct_insufficient(db_session: AsyncSession):
    """Test deduction fails cleanly when requested amount exceeds available balance."""
    ws_id = "ws_test_deduct_insuff"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)
    assert wallet.available_credits == 50

    success, tx = await CreditWalletService.deduct_atomic(
        db=db_session,
        workspace_id=ws_id,
        amount=100,
        operation="comprehensive_audit",
        module="SEO",
    )
    assert success is False
    assert tx is None

    await db_session.refresh(wallet)
    assert wallet.available_credits == 50
    assert wallet.used_credits == 0


from app.tests.conftest import TestingSessionLocal


@pytest.mark.asyncio
async def test_concurrent_deductions_prevent_overspend(db_session: AsyncSession):
    """
    P0-01 Concurrency Regression Test:
    Starting balance = 100.
    Request A attempts to spend 80.
    Request B attempts to spend 80.
    Under atomic operations, exactly one request succeeds and balance cannot go negative.
    """
    ws_id = "ws_test_concurrent_deduct"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)
    # Add credits to make available = 100
    await CreditWalletService.add_credits_atomic(db_session, ws_id, amount=50, idempotency_key="add_concurrent_test")
    await db_session.refresh(wallet)
    assert wallet.available_credits == 100

    async def attempt_deduct(amount: int):
        async with TestingSessionLocal() as session:
            return await CreditWalletService.deduct_atomic(
                db=session,
                workspace_id=ws_id,
                amount=amount,
                operation="heavy_audit_run",
                module="SEO",
            )

    res_a, res_b = await asyncio.gather(attempt_deduct(80), attempt_deduct(80))

    successes = [r[0] for r in (res_a, res_b) if r[0] is True]
    failures = [r[0] for r in (res_a, res_b) if r[0] is False]

    await db_session.refresh(wallet)
    assert wallet.available_credits == 20, f"Expected available credits 20, got {wallet.available_credits}"
    assert wallet.used_credits == 80


@pytest.mark.asyncio
async def test_concurrent_reservations_prevent_overspend(db_session: AsyncSession):
    """
    P0-01 Concurrency Regression Test for Reservations:
    Starting balance = 100.
    Request A reserves 80.
    Request B reserves 80.
    Only one reservation succeeds; available credits remain non-negative.
    """
    ws_id = "ws_test_concurrent_reserve"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)
    await CreditWalletService.add_credits_atomic(db_session, ws_id, amount=50, idempotency_key="add_concurrent_res_test")
    await db_session.refresh(wallet)
    assert wallet.available_credits == 100

    async def attempt_reserve(amount: int):
        async with TestingSessionLocal() as session:
            return await CreditWalletService.reserve_credits(
                db=session,
                workspace_id=ws_id,
                estimated_credits=amount,
                operation="concurrent_crawl",
                module="SEO",
            )

    res_a, res_b = await asyncio.gather(attempt_reserve(80), attempt_reserve(80))

    successes = [r for r in (res_a, res_b) if r["success"] is True]
    failures = [r for r in (res_a, res_b) if r["success"] is False]

    assert len(successes) == 1
    assert len(failures) == 1
    assert failures[0]["error"] == "INSUFFICIENT_CREDITS"

    await db_session.refresh(wallet)
    assert wallet.available_credits == 20
    assert wallet.reserved_credits == 80


@pytest.mark.asyncio
async def test_reservation_commit_and_release_lifecycle(db_session: AsyncSession):
    """Test full lifecycle: reserve -> commit difference -> release."""
    ws_id = "ws_test_lifecycle"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)
    assert wallet.available_credits == 50

    # 1. Reserve 30
    res1 = await CreditWalletService.reserve_credits(
        db=db_session,
        workspace_id=ws_id,
        estimated_credits=30,
        operation="crawl_run_1",
    )
    assert res1["success"] is True
    await db_session.refresh(wallet)
    assert wallet.available_credits == 20
    assert wallet.reserved_credits == 30

    # 2. Commit 25 (refund 5)
    tx = await CreditWalletService.commit_credits(db_session, res1, actual_credits=25)
    assert tx.amount == -25
    await db_session.refresh(wallet)
    assert wallet.available_credits == 25  # 20 + 5 refunded
    assert wallet.reserved_credits == 0
    assert wallet.used_credits == 25

    # 3. Reserve 15 and release on failure
    res2 = await CreditWalletService.reserve_credits(
        db=db_session,
        workspace_id=ws_id,
        estimated_credits=15,
        operation="crawl_run_2",
    )
    assert res2["success"] is True
    await db_session.refresh(wallet)
    assert wallet.available_credits == 10
    assert wallet.reserved_credits == 15

    await CreditWalletService.release_credits(db_session, res2, reason="server_error")
    await db_session.refresh(wallet)
    assert wallet.available_credits == 25
    assert wallet.reserved_credits == 0


@pytest.mark.asyncio
async def test_reconciliation_accounting_invariant_no_false_drift(db_session: AsyncSession):
    """
    P1-05 Credit Reconciliation Test:
    Verifies that active reservations do NOT trigger false drift.
    Verifies that real unrecorded balance modifications ARE flagged as drift.
    """
    ws_id = "ws_test_recon_invariants"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)

    # 1. Initially consistent
    recon1 = await CreditReconciliationService.reconcile_wallet(db_session, ws_id)
    assert recon1["is_consistent"] is True
    assert recon1["difference"] == 0

    # 2. Reserve 30 credits (active in-flight scan)
    res = await CreditWalletService.reserve_credits(
        db=db_session,
        workspace_id=ws_id,
        estimated_credits=30,
        operation="active_scan",
    )
    assert res["success"] is True

    # Under corrected accounting invariant (available + reserved == ledger_sum), NO false drift!
    recon2 = await CreditReconciliationService.reconcile_wallet(db_session, ws_id)
    assert recon2["is_consistent"] is True
    assert recon2["difference"] == 0
    assert recon2["wallet_available"] == 20
    assert recon2["wallet_reserved"] == 30
    assert recon2["total_wallet_credits"] == 50
    assert recon2["ledger_sum"] == 50

    # 3. Commit 20 credits
    await CreditWalletService.commit_credits(db_session, res, actual_credits=20)
    recon3 = await CreditReconciliationService.reconcile_wallet(db_session, ws_id)
    assert recon3["is_consistent"] is True
    assert recon3["difference"] == 0
    assert recon3["wallet_available"] == 30
    assert recon3["wallet_reserved"] == 0

    # 4. Inject artificial real drift (unauthorized balance manipulation without ledger transaction)
    wallet.available_credits += 100
    await db_session.commit()

    recon_drift = await CreditReconciliationService.reconcile_wallet(db_session, ws_id)
    assert recon_drift["is_consistent"] is False
    assert recon_drift["difference"] == 100  # Real drift detected accurately
