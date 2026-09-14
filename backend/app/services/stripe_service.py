from __future__ import annotations
import hashlib
import hmac
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, Optional, Tuple
import httpx
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.billing import (
    Plan,
    PlanCode,
    Subscription,
    SubscriptionStatus,
    BillingCustomer,
    CreditWallet,
    CreditPurchase,
    Payment,
    PaymentStatus,
    Invoice,
    BillingWebhookEvent,
    CreditTransactionType,
)
from app.models.base import utc_now
from app.services.credit_service import (
    PlanService,
    CreditWalletService,
    CreditAllocationService,
)
from app.core.config import settings


# One-time Credit Packages (Exact Match to Specification)
ONE_TIME_CREDIT_PACKS: Dict[str, Dict[str, Any]] = {
    "CREDIT_250": {"credits": 250, "price": 2.99, "name": "250 Extra Credits Pack"},
    "CREDIT_500": {"credits": 500, "price": 4.49, "name": "500 Extra Credits Pack"},
    "CREDIT_1000": {"credits": 1000, "price": 7.99, "name": "1,000 Extra Credits Pack"},
    "CREDIT_2500": {"credits": 2500, "price": 17.99, "name": "2,500 Extra Credits Pack"},
    "CREDIT_5000": {"credits": 5000, "price": 29.99, "name": "5,000 Extra Credits Pack"},
}


class StripeService:
    """Production-grade Stripe billing, checkout, customer portal, and webhook orchestrator."""

    @staticmethod
    def is_configured() -> bool:
        """Returns True if real Stripe API keys are configured in environment."""
        return bool(settings.STRIPE_SECRET_KEY and settings.STRIPE_SECRET_KEY.startswith("sk_"))

    @staticmethod
    async def get_or_create_billing_customer(
        db: AsyncSession, workspace_id: str, email: str, user_id: Optional[str] = None
    ) -> BillingCustomer:
        """Finds or registers customer mapping in local database and Stripe."""
        stmt = select(BillingCustomer).where(BillingCustomer.workspace_id == workspace_id)
        res = await db.execute(stmt)
        customer = res.scalar_one_or_none()

        if not customer:
            stripe_cust_id = f"cus_unconfigured_{uuid.uuid4().hex[:10]}"
            if StripeService.is_configured():
                try:
                    async with httpx.AsyncClient(timeout=15.0) as client:
                        response = await client.post(
                            "https://api.stripe.com/v1/customers",
                            headers={"Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}"},
                            data={
                                "email": email,
                                "metadata[workspace_id]": workspace_id,
                                "metadata[user_id]": user_id or "",
                            },
                        )
                        if response.is_success:
                            data = response.json()
                            stripe_cust_id = data.get("id", stripe_cust_id)
                except Exception:
                    pass

            customer = BillingCustomer(
                id=str(uuid.uuid4()),
                workspace_id=workspace_id,
                user_id=user_id,
                provider="stripe",
                provider_customer_id=stripe_cust_id,
                email=email,
                currency="USD",
            )
            db.add(customer)
            await db.commit()
            await db.refresh(customer)

        return customer

    @staticmethod
    async def create_subscription_checkout(
        db: AsyncSession,
        workspace_id: str,
        user_email: str,
        plan_code: str,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Creates hosted Stripe Checkout Session for recurring plan subscription."""
        plan = await PlanService.get_plan_by_code(db, plan_code)
        if not plan:
            raise ValueError(f"Invalid plan code: {plan_code}")

        if plan.code == PlanCode.FREE.value:
            # Free plan does not need Stripe Checkout; activate immediately
            await StripeService.activate_free_plan(db, workspace_id, user_id)
            return {
                "checkout_url": success_url or "/billing/success?plan=FREE",
                "session_id": f"free_sess_{uuid.uuid4().hex[:8]}",
                "mode": "free",
            }

        if not StripeService.is_configured():
            raise ValueError(
                "Payments Not Configured: Stripe API keys are not configured on this server. "
                "Please add STRIPE_SECRET_KEY in .env to activate live payments."
            )

        customer = await StripeService.get_or_create_billing_customer(db, workspace_id, user_email, user_id)
        price_id = plan.stripe_price_id

        if not price_id:
            # Fallback to direct price creation or error
            raise ValueError(f"Stripe Price ID is not configured for plan: {plan.name}")

        frontend_base = "http://localhost:3000"
        s_url = success_url or f"{frontend_base}/billing/success?session_id={{CHECKOUT_SESSION_ID}}&plan={plan.code}"
        c_url = cancel_url or f"{frontend_base}/billing/cancelled"

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://api.stripe.com/v1/checkout/sessions",
                headers={"Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}"},
                data={
                    "customer": customer.provider_customer_id,
                    "mode": "subscription",
                    "line_items[0][price]": price_id,
                    "line_items[0][quantity]": "1",
                    "success_url": s_url,
                    "cancel_url": c_url,
                    "metadata[workspace_id]": workspace_id,
                    "metadata[user_id]": user_id or "",
                    "metadata[plan_code]": plan.code,
                },
            )

            if not resp.is_success:
                err_data = resp.json().get("error", {})
                raise ValueError(err_data.get("message", "Failed to create Stripe Checkout session"))

            sess = resp.json()
            return {
                "checkout_url": sess["url"],
                "session_id": sess["id"],
                "mode": "subscription",
            }

    @staticmethod
    async def create_credit_pack_checkout(
        db: AsyncSession,
        workspace_id: str,
        user_email: str,
        pack_code: str,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Creates hosted Stripe Checkout Session for one-time credit top-up pack."""
        pack = ONE_TIME_CREDIT_PACKS.get(pack_code.upper())
        if not pack:
            raise ValueError(f"Invalid credit pack code: {pack_code}")

        if not StripeService.is_configured():
            raise ValueError(
                "Payments Not Configured: Stripe API keys are not configured on this server. "
                "Please add STRIPE_SECRET_KEY in .env to activate live payments."
            )

        customer = await StripeService.get_or_create_billing_customer(db, workspace_id, user_email, user_id)
        frontend_base = "http://localhost:3000"
        s_url = success_url or f"{frontend_base}/billing/success?session_id={{CHECKOUT_SESSION_ID}}&pack={pack_code}"
        c_url = cancel_url or f"{frontend_base}/billing/cancelled"

        # Lookup configured price ID or line item unit amount in cents
        price_attr = f"STRIPE_{pack_code.upper()}_PRICE_ID"
        price_id = getattr(settings, price_attr, None)

        payload: Dict[str, Any] = {
            "customer": customer.provider_customer_id,
            "mode": "payment",
            "success_url": s_url,
            "cancel_url": c_url,
            "metadata[workspace_id]": workspace_id,
            "metadata[user_id]": user_id or "",
            "metadata[pack_code]": pack_code,
            "metadata[credits_amount]": str(pack["credits"]),
        }

        if price_id:
            payload["line_items[0][price]"] = price_id
            payload["line_items[0][quantity]"] = "1"
        else:
            payload["line_items[0][price_data][currency]"] = "usd"
            payload["line_items[0][price_data][unit_amount]"] = str(int(pack["price"] * 100))
            payload["line_items[0][price_data][product_data][name]"] = pack["name"]
            payload["line_items[0][quantity]"] = "1"

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://api.stripe.com/v1/checkout/sessions",
                headers={"Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}"},
                data=payload,
            )

            if not resp.is_success:
                err_data = resp.json().get("error", {})
                raise ValueError(err_data.get("message", "Failed to create Stripe credit checkout session"))

            sess = resp.json()
            return {
                "checkout_url": sess["url"],
                "session_id": sess["id"],
                "mode": "payment",
            }

    @staticmethod
    async def create_customer_portal(
        db: AsyncSession, workspace_id: str, return_url: Optional[str] = None
    ) -> str:
        """Creates self-service Stripe Customer Portal session."""
        if not StripeService.is_configured():
            raise ValueError("Payments Not Configured: Stripe API keys are not configured.")

        stmt = select(BillingCustomer).where(BillingCustomer.workspace_id == workspace_id)
        res = await db.execute(stmt)
        customer = res.scalar_one_or_none()

        if not customer or customer.provider_customer_id.startswith("cus_unconfigured"):
            raise ValueError("No active Stripe customer found for this workspace.")

        frontend_base = "http://localhost:3000"
        r_url = return_url or f"{frontend_base}/billing"

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                "https://api.stripe.com/v1/billing_portal/sessions",
                headers={"Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}"},
                data={
                    "customer": customer.provider_customer_id,
                    "return_url": r_url,
                },
            )

            if not resp.is_success:
                err_data = resp.json().get("error", {})
                raise ValueError(err_data.get("message", "Failed to create Stripe Customer Portal session"))

            return resp.json()["url"]

    @staticmethod
    async def activate_free_plan(
        db: AsyncSession, workspace_id: str, user_id: Optional[str] = None
    ) -> Subscription:
        """Downgrades or initializes workspace on Free tier."""
        free_plan = await PlanService.get_plan_by_code(db, PlanCode.FREE.value)
        if not free_plan:
            plans = await PlanService.ensure_seed_plans(db)
            free_plan = next(p for p in plans if p.code == PlanCode.FREE.value)

        stmt = select(Subscription).where(Subscription.workspace_id == workspace_id)
        res = await db.execute(stmt)
        sub = res.scalar_one_or_none()

        now = utc_now()
        period_end = now + timedelta(days=30)

        if not sub:
            sub = Subscription(
                id=str(uuid.uuid4()),
                workspace_id=workspace_id,
                user_id=user_id,
                plan_id=free_plan.id,
                provider="internal",
                status=SubscriptionStatus.ACTIVE.value,
                billing_interval="month",
                current_period_start=now,
                current_period_end=period_end,
                cancel_at_period_end=False,
            )
            db.add(sub)
        else:
            sub.plan_id = free_plan.id
            sub.status = SubscriptionStatus.ACTIVE.value
            sub.cancel_at_period_end = False
            sub.current_period_start = now
            sub.current_period_end = period_end

        # Allocate free monthly credits
        await CreditAllocationService.allocate_subscription_period(
            db, workspace_id, free_plan, now, period_end, user_id
        )

        await db.commit()
        await db.refresh(sub)
        return sub

    @staticmethod
    async def handle_stripe_webhook(
        db: AsyncSession, raw_body: bytes, sig_header: Optional[str]
    ) -> Dict[str, Any]:
        """Validates and processes Stripe webhook events idempotently."""
        payload_hash = hashlib.sha256(raw_body).hexdigest()

        # Signature verification if secret is configured
        if settings.STRIPE_WEBHOOK_SECRET and sig_header:
            try:
                # Basic signature verification
                parts = dict(x.split("=") for x in sig_header.split(","))
                timestamp = parts.get("t")
                signature = parts.get("v1")
                if timestamp and signature:
                    signed_payload = f"{timestamp}.".encode("utf-8") + raw_body
                    expected_sig = hmac.new(
                        settings.STRIPE_WEBHOOK_SECRET.encode("utf-8"),
                        signed_payload,
                        hashlib.sha256,
                    ).hexdigest()
                    if not hmac.compare_digest(expected_sig, signature):
                        return {"success": False, "error": "INVALID_SIGNATURE"}
            except Exception as e:
                return {"success": False, "error": f"SIGNATURE_VERIFICATION_FAILED: {str(e)}"}

        try:
            event = json.loads(raw_body.decode("utf-8"))
        except Exception:
            return {"success": False, "error": "INVALID_JSON_PAYLOAD"}

        event_id = event.get("id")
        event_type = event.get("type")

        if not event_id or not event_type:
            return {"success": False, "error": "MISSING_EVENT_METADATA"}

        # Idempotency check
        stmt = select(BillingWebhookEvent).where(BillingWebhookEvent.event_id == event_id)
        res = await db.execute(stmt)
        existing_event = res.scalar_one_or_none()
        if existing_event and existing_event.processed:
            return {"success": True, "status": "ALREADY_PROCESSED"}

        webhook_log = existing_event or BillingWebhookEvent(
            id=str(uuid.uuid4()),
            provider="stripe",
            event_id=event_id,
            event_type=event_type,
            payload_hash=payload_hash,
            processed=False,
        )
        if not existing_event:
            db.add(webhook_log)

        # Process specific events
        data_object = event.get("data", {}).get("object", {})

        if event_type == "checkout.session.completed":
            await StripeService._handle_checkout_completed(db, data_object)
        elif event_type in ("customer.subscription.created", "customer.subscription.updated"):
            await StripeService._handle_subscription_updated(db, data_object)
        elif event_type == "customer.subscription.deleted":
            await StripeService._handle_subscription_deleted(db, data_object)
        elif event_type == "invoice.paid":
            await StripeService._handle_invoice_paid(db, data_object)
        elif event_type == "invoice.payment_failed":
            await StripeService._handle_invoice_payment_failed(db, data_object)
        elif event_type == "payment_intent.succeeded":
            await StripeService._handle_payment_intent_succeeded(db, data_object)
        elif event_type == "payment_intent.payment_failed":
            await StripeService._handle_payment_intent_failed(db, data_object)

        webhook_log.processed = True
        webhook_log.processed_at = utc_now()
        await db.commit()
        return {"success": True, "event_id": event_id, "event_type": event_type}

    @staticmethod
    async def _handle_checkout_completed(db: AsyncSession, session_data: Dict[str, Any]) -> None:
        metadata = session_data.get("metadata", {})
        workspace_id = metadata.get("workspace_id")
        user_id = metadata.get("user_id") or None
        mode = session_data.get("mode")

        if not workspace_id:
            return

        if mode == "payment" and "pack_code" in metadata:
            # One-time credit top-up pack completed
            pack_code = metadata["pack_code"]
            credits_to_add = int(metadata.get("credits_amount", 0))
            amount_paid = float(session_data.get("amount_total", 0)) / 100.0
            payment_id = session_data.get("payment_intent") or session_data.get("id")

            # Record purchase
            purchase = CreditPurchase(
                id=str(uuid.uuid4()),
                workspace_id=workspace_id,
                user_id=user_id,
                credits_amount=credits_to_add,
                price_paid=amount_paid,
                currency=session_data.get("currency", "usd").upper(),
                provider_payment_id=payment_id,
                status=PaymentStatus.SUCCEEDED.value,
                expires_at=utc_now() + timedelta(days=365),
            )
            db.add(purchase)

            # Atomic wallet addition
            await CreditWalletService.add_credits_atomic(
                db=db,
                workspace_id=workspace_id,
                amount=credits_to_add,
                type=CreditTransactionType.PURCHASE.value,
                operation="credit_pack_purchase",
                description=f"Purchased {pack_code} (+{credits_to_add} credits)",
                user_id=user_id,
                metadata={"session_id": session_data.get("id"), "pack_code": pack_code},
                idempotency_key=f"stripe_purchase_{session_data.get('id')}",
            )

        elif mode == "subscription" and "plan_code" in metadata:
            plan_code = metadata["plan_code"]
            plan = await PlanService.get_plan_by_code(db, plan_code)
            if not plan:
                return

            sub_id = session_data.get("subscription")
            cust_id = session_data.get("customer")

            stmt = select(Subscription).where(Subscription.workspace_id == workspace_id)
            res = await db.execute(stmt)
            sub = res.scalar_one_or_none()

            now = utc_now()
            period_end = now + timedelta(days=30)

            if not sub:
                sub = Subscription(
                    id=str(uuid.uuid4()),
                    workspace_id=workspace_id,
                    user_id=user_id,
                    plan_id=plan.id,
                    provider="stripe",
                    provider_customer_id=cust_id,
                    provider_subscription_id=sub_id,
                    status=SubscriptionStatus.ACTIVE.value,
                    billing_interval="month",
                    current_period_start=now,
                    current_period_end=period_end,
                    cancel_at_period_end=False,
                )
                db.add(sub)
            else:
                sub.plan_id = plan.id
                sub.provider_customer_id = cust_id
                sub.provider_subscription_id = sub_id
                sub.status = SubscriptionStatus.ACTIVE.value
                sub.cancel_at_period_end = False
                sub.current_period_start = now
                sub.current_period_end = period_end

            # Allocate plan credits
            await CreditAllocationService.allocate_subscription_period(
                db, workspace_id, plan, now, period_end, user_id
            )
            await db.commit()

    @staticmethod
    async def _handle_subscription_updated(db: AsyncSession, sub_data: Dict[str, Any]) -> None:
        sub_id = sub_data.get("id")
        cust_id = sub_data.get("customer")
        status = sub_data.get("status", "active")
        cancel_at_period_end = bool(sub_data.get("cancel_at_period_end", False))

        stmt = select(Subscription).where(
            or_(
                Subscription.provider_subscription_id == sub_id,
                Subscription.provider_customer_id == cust_id,
            )
        )
        res = await db.execute(stmt)
        sub = res.scalar_one_or_none()

        if sub:
            sub.status = status
            sub.cancel_at_period_end = cancel_at_period_end
            if "current_period_start" in sub_data:
                sub.current_period_start = datetime.fromtimestamp(sub_data["current_period_start"], tz=timezone.utc)
            if "current_period_end" in sub_data:
                sub.current_period_end = datetime.fromtimestamp(sub_data["current_period_end"], tz=timezone.utc)
            if cancel_at_period_end:
                sub.cancelled_at = utc_now()
            await db.commit()

    @staticmethod
    async def _handle_subscription_deleted(db: AsyncSession, sub_data: Dict[str, Any]) -> None:
        sub_id = sub_data.get("id")
        cust_id = sub_data.get("customer")

        stmt = select(Subscription).where(
            or_(
                Subscription.provider_subscription_id == sub_id,
                Subscription.provider_customer_id == cust_id,
            )
        )
        res = await db.execute(stmt)
        sub = res.scalar_one_or_none()

        if sub:
            # Downgrade workspace to Free tier
            await StripeService.activate_free_plan(db, sub.workspace_id, sub.user_id)

    @staticmethod
    async def _handle_invoice_paid(db: AsyncSession, inv_data: Dict[str, Any]) -> None:
        cust_id = inv_data.get("customer")
        sub_id = inv_data.get("subscription")
        inv_id = inv_data.get("id")
        amount_paid = float(inv_data.get("amount_paid", 0)) / 100.0

        stmt = select(Subscription).where(
            or_(
                Subscription.provider_subscription_id == sub_id,
                Subscription.provider_customer_id == cust_id,
            )
        )
        res = await db.execute(stmt)
        sub = res.scalar_one_or_none()

        if sub:
            # Create local invoice record
            inv = Invoice(
                id=str(uuid.uuid4()),
                workspace_id=sub.workspace_id,
                user_id=sub.user_id,
                subscription_id=sub.id,
                provider_invoice_id=inv_id,
                invoice_number=inv_data.get("number") or f"INV-{uuid.uuid4().hex[:8].upper()}",
                amount=amount_paid,
                currency=inv_data.get("currency", "usd").upper(),
                status="paid",
                invoice_url=inv_data.get("hosted_invoice_url"),
                pdf_url=inv_data.get("invoice_pdf"),
                period_start=datetime.fromtimestamp(inv_data.get("period_start", int(utc_now().timestamp())), tz=timezone.utc),
                period_end=datetime.fromtimestamp(inv_data.get("period_end", int((utc_now() + timedelta(days=30)).timestamp())), tz=timezone.utc),
            )
            db.add(inv)

            # Re-allocate recurring monthly credits if renewed
            if sub.plan:
                await CreditAllocationService.allocate_subscription_period(
                    db, sub.workspace_id, sub.plan, inv.period_start, inv.period_end, sub.user_id
                )
            await db.commit()

    @staticmethod
    async def _handle_invoice_payment_failed(db: AsyncSession, inv_data: Dict[str, Any]) -> None:
        sub_id = inv_data.get("subscription")
        cust_id = inv_data.get("customer")

        stmt = select(Subscription).where(
            or_(
                Subscription.provider_subscription_id == sub_id,
                Subscription.provider_customer_id == cust_id,
            )
        )
        res = await db.execute(stmt)
        sub = res.scalar_one_or_none()

        if sub:
            sub.status = SubscriptionStatus.PAST_DUE.value
            await db.commit()

    @staticmethod
    async def _handle_payment_intent_succeeded(db: AsyncSession, pi_data: Dict[str, Any]) -> None:
        pi_id = pi_data.get("id")
        amount = float(pi_data.get("amount", 0)) / 100.0
        metadata = pi_data.get("metadata", {})
        workspace_id = metadata.get("workspace_id") or "global"
        user_id = metadata.get("user_id") or None

        payment = Payment(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            provider="stripe",
            provider_payment_id=pi_id,
            amount=amount,
            currency=pi_data.get("currency", "usd").upper(),
            status=PaymentStatus.SUCCEEDED.value,
            payment_type="one_time",
            description=pi_data.get("description", "Stripe Payment"),
            payment_metadata=metadata,
            paid_at=utc_now(),
        )
        db.add(payment)
        await db.commit()

    @staticmethod
    async def _handle_payment_intent_failed(db: AsyncSession, pi_data: Dict[str, Any]) -> None:
        pi_id = pi_data.get("id")
        amount = float(pi_data.get("amount", 0)) / 100.0
        metadata = pi_data.get("metadata", {})
        workspace_id = metadata.get("workspace_id") or "global"
        user_id = metadata.get("user_id") or None

        payment = Payment(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            provider="stripe",
            provider_payment_id=pi_id,
            amount=amount,
            currency=pi_data.get("currency", "usd").upper(),
            status=PaymentStatus.FAILED.value,
            payment_type="one_time",
            description=pi_data.get("description", "Payment Failed"),
            payment_metadata=metadata,
        )
        db.add(payment)
        await db.commit()
