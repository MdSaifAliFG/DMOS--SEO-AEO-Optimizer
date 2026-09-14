import pytest
import json
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.billing import PlanCode, SubscriptionStatus, CreditTransactionType
from app.services.credit_service import (
    PlanService,
    CreditWalletService,
    CreditCostService,
    CreditAllocationService,
    CreditReconciliationService,
)
from app.services.entitlement_service import EntitlementService
from app.services.stripe_service import StripeService


@pytest.mark.asyncio
async def test_seed_plans_creation(db_session: AsyncSession):
    """Verify all 6 tiers are seeded with exact specs."""
    plans = await PlanService.get_all_plans(db_session)
    codes = [p.code for p in plans]
    assert "FREE" in codes
    assert "STARTER" in codes
    assert "GROWTH" in codes
    assert "PRO" in codes
    assert "BUSINESS" in codes
    assert "AGENCY" in codes

    growth_plan = await PlanService.get_plan_by_code(db_session, "GROWTH")
    assert growth_plan is not None
    assert growth_plan.price_monthly == 8.99
    assert growth_plan.monthly_credits == 1000
    assert growth_plan.is_popular is True
    assert growth_plan.max_projects == 5


@pytest.mark.asyncio
async def test_wallet_initialization_and_credits(db_session: AsyncSession):
    """Verify new workspace receives 50 free credits and ledger record."""
    ws_id = "ws_test_init_1"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)
    assert wallet.available_credits == 50
    assert wallet.monthly_credits == 50
    assert wallet.used_credits == 0

    reconciliation = await CreditReconciliationService.reconcile_wallet(db_session, ws_id)
    assert reconciliation["is_consistent"] is True
    assert reconciliation["ledger_sum"] == 50


@pytest.mark.asyncio
async def test_atomic_reservation_and_commit(db_session: AsyncSession):
    """Verify credit reservation moves available to reserved, and commit deducts used."""
    ws_id = "ws_test_reserve_commit"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)
    assert wallet.available_credits == 50

    # Reserve 10 credits for SEO crawl
    res = await CreditWalletService.reserve_credits(
        db=db_session,
        workspace_id=ws_id,
        estimated_credits=10,
        operation="website_crawl",
        module="SEO",
    )
    assert res["success"] is True
    assert res["available_credits"] == 40
    assert res["reserved_credits"] == 10

    # Commit 8 credits actual
    tx = await CreditWalletService.commit_credits(db_session, res, actual_credits=8)
    assert tx.amount == -8

    await db_session.refresh(wallet)
    assert wallet.available_credits == 42  # 50 - 8
    assert wallet.reserved_credits == 0
    assert wallet.used_credits == 8

    # Reconcile
    recon = await CreditReconciliationService.reconcile_wallet(db_session, ws_id)
    assert recon["is_consistent"] is True
    assert recon["ledger_sum"] == 42


@pytest.mark.asyncio
async def test_atomic_reservation_and_release(db_session: AsyncSession):
    """Verify reservation release restores available credits on failure."""
    ws_id = "ws_test_release"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)

    res = await CreditWalletService.reserve_credits(
        db=db_session,
        workspace_id=ws_id,
        estimated_credits=15,
        operation="geo_visibility_query",
        module="GEO",
    )
    assert res["success"] is True

    # Simulate provider error and release
    await CreditWalletService.release_credits(db_session, res, reason="Rate limited by upstream AI provider")

    await db_session.refresh(wallet)
    assert wallet.available_credits == 50
    assert wallet.reserved_credits == 0
    assert wallet.used_credits == 0


@pytest.mark.asyncio
async def test_insufficient_credits_blocking(db_session: AsyncSession):
    """Verify overspending is blocked when balance is insufficient."""
    ws_id = "ws_test_insufficient"
    wallet = await CreditWalletService.get_or_create_wallet(db_session, ws_id)

    # Attempt to reserve 100 credits when only 50 exist
    res = await CreditWalletService.reserve_credits(
        db=db_session,
        workspace_id=ws_id,
        estimated_credits=100,
        operation="full_omni_audit",
        module="SYSTEM",
    )
    assert res["success"] is False
    assert res["error"] == "INSUFFICIENT_CREDITS"
    assert wallet.available_credits == 50


@pytest.mark.asyncio
async def test_entitlement_service_limits(db_session: AsyncSession):
    """Verify plan entitlements enforce project limits and feature gates."""
    ws_id = "ws_test_entitlement"
    sub, plan = await EntitlementService.get_active_subscription_and_plan(db_session, ws_id)
    assert plan.code == "FREE"

    # Free plan cannot use API or white-label
    can_api = await EntitlementService.can_use_api(db_session, ws_id)
    assert can_api is False

    can_pdf = await EntitlementService.can_generate_pdf(db_session, ws_id)
    assert can_pdf is False


@pytest.mark.asyncio
async def test_billing_api_endpoints(client: AsyncClient, db_session: AsyncSession):
    """Test public and authenticated billing API routes."""
    # List plans
    r_plans = await client.get("/api/v1/billing/plans")
    assert r_plans.status_code == 200
    plans = r_plans.json()
    assert len(plans) == 6

    # Summary
    r_sum = await client.get("/api/v1/billing/summary")
    assert r_sum.status_code == 200
    summary = r_sum.json()
    assert summary["current_plan"]["code"] == "FREE"
    assert summary["monthly_credits"] == 50

    # Credit packs
    r_packs = await client.get("/api/v1/billing/credit-packs")
    assert r_packs.status_code == 200
    packs = r_packs.json()
    assert "CREDIT_250" in packs
    assert "CREDIT_1000" in packs


@pytest.mark.asyncio
async def test_webhook_idempotency(db_session: AsyncSession):
    """Verify duplicate Stripe webhooks are processed only once."""
    fake_event = {
        "id": "evt_test_idempotent_123",
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_test_123",
                "amount": 899,
                "currency": "usd",
                "metadata": {"workspace_id": "ws_webhook_test"},
            }
        },
    }
    payload_bytes = json.dumps(fake_event).encode("utf-8")

    # First delivery
    res1 = await StripeService.handle_stripe_webhook(db_session, payload_bytes, sig_header=None)
    assert res1["success"] is True

    # Second duplicate delivery
    res2 = await StripeService.handle_stripe_webhook(db_session, payload_bytes, sig_header=None)
    assert res2["success"] is True
    assert res2["status"] == "ALREADY_PROCESSED"
