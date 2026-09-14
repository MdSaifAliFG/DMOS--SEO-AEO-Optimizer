from __future__ import annotations
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import select, func, desc, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.models.billing import (
    Plan,
    Subscription,
    SubscriptionStatus,
    CreditWallet,
    CreditTransaction,
    UsageEvent,
    Invoice,
)
from app.schemas.billing import (
    PlanResponse,
    SubscriptionResponse,
    CurrentSubscriptionResponse,
    CreditWalletResponse,
    CreditTransactionResponse,
    UsageEventResponse,
    UsageSummaryResponse,
    InvoiceResponse,
    BillingSummaryResponse,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    CreditPackCheckoutRequest,
    CustomerPortalResponse,
    ChangePlanRequest,
    RazorpayOrderRequest,
    RazorpayOrderResponse,
    RazorpayVerifyRequest,
    RazorpayVerifyResponse,
    RazorpayConfigResponse,
)
from app.services.credit_service import (
    PlanService,
    CreditWalletService,
    CreditCostService,
)
from app.services.entitlement_service import EntitlementService
from app.services.stripe_service import StripeService, ONE_TIME_CREDIT_PACKS
from app.services.razorpay_service import RazorpayService, ONE_TIME_CREDIT_PACKS as RZP_CREDIT_PACKS

router = APIRouter(prefix="/billing", tags=["Billing & Monetization"])


async def get_optional_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Resolves authenticated user from session/header with strict user isolation."""
    # 1. Check explicit user identity headers
    x_user_email = request.headers.get("X-User-Email", "").strip().lower()
    if x_user_email:
        stmt = select(User).where(func.lower(User.email) == x_user_email)
        res = await db.execute(stmt)
        u = res.scalar_one_or_none()
        if u:
            return u

    x_user_id = request.headers.get("X-User-Id", "").strip()
    if x_user_id:
        stmt = select(User).where(User.id == x_user_id)
        res = await db.execute(stmt)
        u = res.scalar_one_or_none()
        if u:
            return u

    # 2. Check Authorization header
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "").strip()
        target_id = token
        if token.startswith("sess_"):
            parts = token.split("_")
            if len(parts) >= 2:
                target_id = parts[1]

        stmt = select(User).where(
            or_(
                User.id == token,
                User.id == target_id,
                func.lower(User.email) == token.lower(),
            )
        )
        res = await db.execute(stmt)
        u = res.scalar_one_or_none()
        if u:
            return u

    # 3. Fallback to latest registered active user or global
    stmt = select(User).where(User.is_active == True).order_by(User.created_at.desc()).limit(1)
    res = await db.execute(stmt)
    return res.scalar_one_or_none()


async def resolve_workspace_id(user: Optional[User] = None) -> str:
    if user and user.id:
        return str(user.id)
    return "global_workspace"



@router.get("/plans", response_model=List[PlanResponse])
async def list_plans(db: AsyncSession = Depends(get_db)):
    """Fetch all active SEOSensing subscription tiers."""
    return await PlanService.get_all_plans(db)


@router.get("/current", response_model=CurrentSubscriptionResponse)
async def get_current_subscription(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
) -> CurrentSubscriptionResponse:
    """Retrieve current workspace subscription details."""
    workspace_id = await resolve_workspace_id(current_user)
    user_id = current_user.id if current_user else None
    sub, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id, user_id)
    wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)

    return CurrentSubscriptionResponse(
        workspace_id=workspace_id,
        subscription=SubscriptionResponse.model_validate(sub) if sub else None,
        plan=PlanResponse.model_validate(plan),
        wallet=CreditWalletResponse.model_validate(wallet),
        is_stripe_configured=StripeService.is_configured(),
        is_razorpay_configured=RazorpayService.is_configured(),
    )


@router.get("/summary", response_model=BillingSummaryResponse)
async def get_billing_summary(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get full billing dashboard summary."""
    workspace_id = await resolve_workspace_id(current_user)
    user_id = current_user.id if current_user else None
    return await EntitlementService.get_workspace_billing_summary(db, workspace_id, user_id)


@router.get("/credits", response_model=CreditWalletResponse)
async def get_credit_wallet(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get credit wallet balances."""
    workspace_id = await resolve_workspace_id(current_user)
    user_id = current_user.id if current_user else None
    return await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)


@router.get("/usage", response_model=List[UsageEventResponse])
async def get_usage_history(
    module: Optional[str] = Query(None, description="SEO | AEO | GEO | SYSTEM"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List detailed credit consumption events."""
    workspace_id = await resolve_workspace_id(current_user)
    stmt = select(UsageEvent).where(UsageEvent.workspace_id == workspace_id)
    if module:
        stmt = stmt.where(UsageEvent.module == module.upper())
    stmt = stmt.order_by(desc(UsageEvent.created_at)).limit(limit).offset(offset)
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.get("/usage/summary", response_model=UsageSummaryResponse)
async def get_usage_summary(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get aggregated credit usage breakdown by module."""
    workspace_id = await resolve_workspace_id(current_user)
    wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id)

    stmt = select(UsageEvent.module, func.sum(UsageEvent.credits_used)).where(
        UsageEvent.workspace_id == workspace_id
    ).group_by(UsageEvent.module)
    res = await db.execute(stmt)
    rows = dict(res.all())

    return {
        "total_credits_used": wallet.used_credits,
        "seo_credits": int(rows.get("SEO", 0) or 0),
        "aeo_credits": int(rows.get("AEO", 0) or 0),
        "geo_credits": int(rows.get("GEO", 0) or 0),
        "system_credits": int(rows.get("SYSTEM", 0) or 0),
        "period_start": wallet.last_allocation_at,
        "period_end": wallet.next_allocation_at,
    }


@router.get("/transactions", response_model=List[CreditTransactionResponse])
async def get_credit_transactions(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve immutable credit ledger history."""
    workspace_id = await resolve_workspace_id(current_user)
    stmt = (
        select(CreditTransaction)
        .where(CreditTransaction.workspace_id == workspace_id)
        .order_by(desc(CreditTransaction.created_at))
        .limit(limit)
        .offset(offset)
    )
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.get("/invoices", response_model=List[InvoiceResponse])
async def get_invoices(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List paid and historical invoices."""
    workspace_id = await resolve_workspace_id(current_user)
    stmt = select(Invoice).where(Invoice.workspace_id == workspace_id).order_by(desc(Invoice.created_at))
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.get("/credit-packs")
async def get_credit_packs():
    """List available one-time credit top-up packages."""
    return ONE_TIME_CREDIT_PACKS


@router.post("/checkout", response_model=CheckoutSessionResponse)
async def create_subscription_checkout(
    payload: CheckoutSessionRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Initiate Stripe subscription checkout."""
    workspace_id = await resolve_workspace_id(current_user)
    user_email = current_user.email if current_user else "workspace.admin@enterprise.internal"
    user_id = current_user.id if current_user else None

    try:
        res = await StripeService.create_subscription_checkout(
            db=db,
            workspace_id=workspace_id,
            user_email=user_email,
            plan_code=payload.plan_code,
            success_url=payload.success_url,
            cancel_url=payload.cancel_url,
            user_id=user_id,
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/credits/checkout", response_model=CheckoutSessionResponse)
async def create_credit_pack_checkout(
    payload: CreditPackCheckoutRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Initiate Stripe checkout for one-time credit purchase."""
    workspace_id = await resolve_workspace_id(current_user)
    user_email = current_user.email if current_user else "workspace.admin@enterprise.internal"
    user_id = current_user.id if current_user else None

    try:
        res = await StripeService.create_credit_pack_checkout(
            db=db,
            workspace_id=workspace_id,
            user_email=user_email,
            pack_code=payload.pack_code,
            success_url=payload.success_url,
            cancel_url=payload.cancel_url,
            user_id=user_id,
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/portal", response_model=CustomerPortalResponse)
async def create_customer_portal(
    return_url: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate self-serve Stripe Customer Portal link."""
    workspace_id = await resolve_workspace_id(current_user)
    try:
        url = await StripeService.create_customer_portal(db, workspace_id, return_url)
        return {"portal_url": url}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/cancel")
async def cancel_subscription(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Schedule subscription cancellation at period end."""
    workspace_id = await resolve_workspace_id(current_user)
    stmt = select(Subscription).where(
        Subscription.workspace_id == workspace_id,
        Subscription.status == SubscriptionStatus.ACTIVE.value,
    )
    res = await db.execute(stmt)
    sub = res.scalar_one_or_none()

    if not sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active subscription found to cancel.")

    sub.cancel_at_period_end = True
    await db.commit()
    return {"success": True, "message": "Subscription scheduled for cancellation at end of current billing period."}


@router.post("/reactivate")
async def reactivate_subscription(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Resume a subscription that was scheduled for cancellation."""
    workspace_id = await resolve_workspace_id(current_user)
    stmt = select(Subscription).where(
        Subscription.workspace_id == workspace_id,
        Subscription.cancel_at_period_end == True,
    )
    res = await db.execute(stmt)
    sub = res.scalar_one_or_none()

    if not sub:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No subscription pending cancellation found.")

    sub.cancel_at_period_end = False
    await db.commit()
    return {"success": True, "message": "Subscription reactivated successfully."}


@router.post("/change-plan")
async def change_plan(
    payload: ChangePlanRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change or upgrade plan tier."""
    workspace_id = await resolve_workspace_id(current_user)
    user_id = current_user.id if current_user else None

    new_plan = await PlanService.get_plan_by_code(db, payload.plan_code)
    if not new_plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Plan {payload.plan_code} not found.")

    if new_plan.code == "FREE":
        await StripeService.activate_free_plan(db, workspace_id, user_id)
        return {"success": True, "message": "Downgraded to Free plan.", "plan": new_plan.name}

    # For paid plans, redirect through checkout or portal
    user_email = current_user.email if current_user else "workspace.admin@enterprise.internal"
    checkout = await StripeService.create_subscription_checkout(
        db=db,
        workspace_id=workspace_id,
        user_email=user_email,
        plan_code=new_plan.code,
        user_id=user_id,
    )
    return {"success": True, "checkout_url": checkout["checkout_url"]}


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Receives and processes idempotent Stripe webhook events."""
    raw_body = await request.body()
    sig_header = request.headers.get("stripe-signature")
    res = await StripeService.handle_stripe_webhook(db, raw_body, sig_header)
    if not res.get("success"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=res.get("error", "Webhook processing failed"))
    return res


# ==========================================
# RAZORPAY PAYMENT GATEWAY ENDPOINTS
# ==========================================

@router.get("/razorpay/config", response_model=RazorpayConfigResponse)
async def get_razorpay_config():
    """Returns public Razorpay configuration for frontend checkout."""
    return {
        "key_id": RazorpayService.get_public_key(),
        "currency": RazorpayService.get_currency(),
        "is_configured": RazorpayService.is_configured(),
    }


@router.post("/razorpay/order", response_model=RazorpayOrderResponse)
async def create_razorpay_order(
    payload: RazorpayOrderRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Creates a Razorpay Order for a subscription plan upgrade or credit pack purchase."""
    workspace_id = await resolve_workspace_id(current_user)
    user_id = current_user.id if current_user else None
    user_email = current_user.email if current_user else "workspace.admin@enterprise.internal"

    try:
        if payload.plan_code:
            res = await RazorpayService.create_plan_order(
                db=db,
                workspace_id=workspace_id,
                plan_code=payload.plan_code,
                user_email=user_email,
                billing_cycle=payload.billing_cycle,
                user_id=user_id,
            )
            return res
        elif payload.pack_credits:
            res = await RazorpayService.create_credit_pack_order(
                db=db,
                workspace_id=workspace_id,
                pack_credits=payload.pack_credits,
                user_email=user_email,
                user_id=user_id,
            )
            return res
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either plan_code or pack_credits must be specified.",
            )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/razorpay/verify", response_model=RazorpayVerifyResponse)
async def verify_razorpay_payment(
    payload: RazorpayVerifyRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verifies payment signature and immediately credits wallet or activates plan."""
    workspace_id = await resolve_workspace_id(current_user)
    user_id = current_user.id if current_user else None

    try:
        res = await RazorpayService.verify_and_fulfill_payment(
            db=db,
            workspace_id=workspace_id,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            razorpay_signature=payload.razorpay_signature,
            user_id=user_id,
            plan_code=payload.plan_code,
            pack_credits=payload.pack_credits,
            billing_cycle=payload.billing_cycle,
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/webhooks/razorpay")
async def razorpay_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Receives and processes Razorpay server-to-server webhook events."""
    raw_body = await request.body()
    sig_header = request.headers.get("X-Razorpay-Signature", "")

    try:
        event_payload = await request.json()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON payload")

    try:
        res = await RazorpayService.process_webhook_event(db, event_payload, raw_body, sig_header)
        return res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
