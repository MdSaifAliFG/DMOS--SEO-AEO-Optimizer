from __future__ import annotations
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import select, update, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.billing import (
    Plan,
    PlanCode,
    Subscription,
    SubscriptionStatus,
    CreditWallet,
    CreditTransaction,
    CreditTransactionType,
    UsageEvent,
    UsageModule,
)
from app.models.project import Project
from app.models.base import utc_now
from app.core.config import settings


# Seed Plan Definitions (Exact Match to Specification)
SEED_PLANS: List[Dict[str, Any]] = [
    {
        "code": PlanCode.FREE.value,
        "name": "Free",
        "description": "Essential SEO, AEO, and GEO scanning for individuals.",
        "price_monthly": 0.0,
        "currency": "USD",
        "monthly_credits": 50,
        "max_rollover_credits": 0,
        "max_projects": 1,
        "max_websites": 1,
        "max_team_members": 1,
        "max_ai_queries": 50,
        "monitoring_enabled": False,
        "advanced_monitoring": False,
        "competitor_monitoring": False,
        "pdf_reports": False,
        "api_access": False,
        "white_label": False,
        "priority_processing": False,
        "is_popular": False,
        "is_active": True,
        "features": [
            "50 credits/month",
            "1 Project & 1 Website",
            "SEO basic scan & report",
            "Basic AEO question tracking",
            "Basic GEO analysis",
            "Dashboard access & basic issues",
        ],
    },
    {
        "code": PlanCode.STARTER.value,
        "name": "Starter",
        "description": "Full analysis tools for growing sites and single professionals.",
        "price_monthly": 4.99,
        "currency": "USD",
        "monthly_credits": 500,
        "max_rollover_credits": 250,
        "max_projects": 3,
        "max_websites": 3,
        "max_team_members": 1,
        "max_ai_queries": 500,
        "monitoring_enabled": True,
        "advanced_monitoring": False,
        "competitor_monitoring": True,
        "pdf_reports": False,
        "api_access": False,
        "white_label": False,
        "priority_processing": False,
        "is_popular": False,
        "is_active": True,
        "features": [
            "500 credits/month (up to 250 rollover)",
            "3 Projects & 3 Websites",
            "Full SEO technical audit",
            "Full AEO & GEO visibility tracking",
            "Competitor analysis",
            "CSV export & history",
        ],
    },
    {
        "code": PlanCode.GROWTH.value,
        "name": "Growth",
        "description": "Complete AI search visibility, scheduled audits, and PDF reports.",
        "price_monthly": 8.99,
        "currency": "USD",
        "monthly_credits": 1000,
        "max_rollover_credits": 500,
        "max_projects": 5,
        "max_websites": 5,
        "max_team_members": 3,
        "max_ai_queries": 1500,
        "monitoring_enabled": True,
        "advanced_monitoring": True,
        "competitor_monitoring": True,
        "pdf_reports": True,
        "api_access": False,
        "white_label": False,
        "priority_processing": False,
        "is_popular": True,
        "is_active": True,
        "features": [
            "1,000 credits/month (up to 500 rollover)",
            "5 Projects & 5 Websites • 3 Team members",
            "Scheduled automated monitoring",
            "AI visibility tracking & trends",
            "Citation & Entity analysis",
            "PDF reports & instant alerts",
        ],
    },
    {
        "code": PlanCode.PRO.value,
        "name": "Pro",
        "description": "High-frequency intelligence, priority queues, and advanced competitor matrix.",
        "price_monthly": 14.99,
        "currency": "USD",
        "monthly_credits": 2500,
        "max_rollover_credits": 1250,
        "max_projects": 10,
        "max_websites": 10,
        "max_team_members": 5,
        "max_ai_queries": 4000,
        "monitoring_enabled": True,
        "advanced_monitoring": True,
        "competitor_monitoring": True,
        "pdf_reports": True,
        "api_access": False,
        "white_label": False,
        "priority_processing": True,
        "is_popular": False,
        "is_active": True,
        "features": [
            "2,500 credits/month (up to 1,250 rollover)",
            "10 Projects & 10 Websites • 5 Team members",
            "Advanced competitor intelligence",
            "Content studio optimization",
            "Priority audit processing",
            "Advanced PDF & CSV exports",
        ],
    },
    {
        "code": PlanCode.BUSINESS.value,
        "name": "Business",
        "description": "Multi-site collaboration, white-label reporting, and programmatic API access.",
        "price_monthly": 29.99,
        "currency": "USD",
        "monthly_credits": 6000,
        "max_rollover_credits": 3000,
        "max_projects": 25,
        "max_websites": 25,
        "max_team_members": 10,
        "max_ai_queries": 10000,
        "monitoring_enabled": True,
        "advanced_monitoring": True,
        "competitor_monitoring": True,
        "pdf_reports": True,
        "api_access": True,
        "white_label": True,
        "priority_processing": True,
        "is_popular": False,
        "is_active": True,
        "features": [
            "6,000 credits/month (up to 3,000 rollover)",
            "25 Projects & 25 Websites • 10 Team members",
            "White-label executive reports",
            "Full REST API access",
            "Client-ready audit dashboards",
            "High throughput rate limits",
        ],
    },
    {
        "code": PlanCode.AGENCY.value,
        "name": "Agency",
        "description": "Enterprise agency grade multi-client management and highest capacity limits.",
        "price_monthly": 59.99,
        "currency": "USD",
        "monthly_credits": 15000,
        "max_rollover_credits": 7500,
        "max_projects": 50,
        "max_websites": 50,
        "max_team_members": 25,
        "max_ai_queries": 25000,
        "monitoring_enabled": True,
        "advanced_monitoring": True,
        "competitor_monitoring": True,
        "pdf_reports": True,
        "api_access": True,
        "white_label": True,
        "priority_processing": True,
        "is_popular": False,
        "is_active": True,
        "features": [
            "15,000 credits/month (up to 7,500 rollover)",
            "50 Projects & 50 Websites • 25 Team members",
            "Multi-client workspace isolation",
            "Highest API limits & custom queues",
            "White-label client reporting portals",
            "Dedicated priority support",
        ],
    },
]


class CreditCostService:
    """Centralized credit cost registry with configurable defaults."""

    @staticmethod
    def get_cost(operation: str, **kwargs: Any) -> int:
        op = operation.lower()
        if op in ("seo_quick_scan", "quick_scan"):
            return settings.CREDIT_COST_SEO_QUICK_SCAN
        elif op in ("seo_page_analysis", "page_audit"):
            return settings.CREDIT_COST_SEO_PAGE_ANALYSIS
        elif op in ("seo_full_audit", "website_crawl", "seo_crawl"):
            page_count = kwargs.get("pages", kwargs.get("max_pages", 0))
            base = settings.CREDIT_COST_SEO_FULL_AUDIT_BASE
            extra = (max(0, page_count - 20) // 20) * settings.CREDIT_COST_SEO_AUDIT_PER_20_PAGES
            return base + extra
        elif op in ("aeo_question_analysis", "aeo_question"):
            return settings.CREDIT_COST_AEO_QUESTION
        elif op in ("aeo_ai_query", "aeo_answer_query", "ai_answer_query"):
            models_count = max(1, kwargs.get("models_count", kwargs.get("engines_count", 1)))
            return settings.CREDIT_COST_AEO_AI_QUERY * models_count
        elif op in ("aeo_citation", "aeo_citation_analysis"):
            return settings.CREDIT_COST_AEO_CITATION
        elif op in ("aeo_entity", "aeo_entity_analysis"):
            return settings.CREDIT_COST_AEO_ENTITY
        elif op in ("geo_question", "geo_question_analysis"):
            return settings.CREDIT_COST_GEO_QUESTION
        elif op in ("geo_ai_query", "geo_visibility_query", "geo_visibility"):
            models_count = max(1, kwargs.get("models_count", kwargs.get("engines_count", 1)))
            return settings.CREDIT_COST_GEO_AI_QUERY * models_count
        elif op in ("geo_competitor", "geo_competitor_analysis"):
            models_count = max(1, kwargs.get("models_count", kwargs.get("competitors_count", 1)))
            return settings.CREDIT_COST_GEO_COMPETITOR * models_count
        elif op in ("geo_citation", "geo_citation_analysis"):
            return settings.CREDIT_COST_GEO_CITATION
        elif op in ("geo_entity", "geo_entity_analysis"):
            return settings.CREDIT_COST_GEO_ENTITY
        elif op in ("ai_optimization", "seo_optimization", "aeo_optimization", "geo_optimization"):
            return settings.CREDIT_COST_AI_OPTIMIZATION
        elif op in ("pdf_report", "export_pdf"):
            return settings.CREDIT_COST_PDF_REPORT
        elif op in ("scheduled_monitoring", "monitoring_snapshot"):
            return settings.CREDIT_COST_SCHEDULED_MONITORING
        elif op in ("comprehensive_audit", "full_omni_audit"):
            return settings.CREDIT_COST_COMPREHENSIVE_AUDIT
        return 1


class PlanService:
    """Manages plan initialization and retrieval."""

    _PLANS_SEEDED: bool = False

    @staticmethod
    async def ensure_seed_plans(db: AsyncSession) -> List[Plan]:
        """Seeds plans in the database if not present."""
        if PlanService._PLANS_SEEDED:
            stmt = select(Plan).where(Plan.is_active == True).order_by(Plan.price_monthly.asc())
            res = await db.execute(stmt)
            existing_plans = list(res.scalars().all())
            if existing_plans:
                return existing_plans

        stmt = select(Plan)
        res = await db.execute(stmt)
        existing = {p.code: p for p in res.scalars().all()}

        plans: List[Plan] = []
        for pdata in SEED_PLANS:
            code = pdata["code"]
            if code in existing:
                p = existing[code]
                if code == PlanCode.STARTER.value and settings.STRIPE_STARTER_PRICE_ID:
                    p.stripe_price_id = settings.STRIPE_STARTER_PRICE_ID
                elif code == PlanCode.GROWTH.value and settings.STRIPE_GROWTH_PRICE_ID:
                    p.stripe_price_id = settings.STRIPE_GROWTH_PRICE_ID
                elif code == PlanCode.PRO.value and settings.STRIPE_PRO_PRICE_ID:
                    p.stripe_price_id = settings.STRIPE_PRO_PRICE_ID
                elif code == PlanCode.BUSINESS.value and settings.STRIPE_BUSINESS_PRICE_ID:
                    p.stripe_price_id = settings.STRIPE_BUSINESS_PRICE_ID
                elif code == PlanCode.AGENCY.value and settings.STRIPE_AGENCY_PRICE_ID:
                    p.stripe_price_id = settings.STRIPE_AGENCY_PRICE_ID
                plans.append(p)
            else:
                new_plan = Plan(**pdata)
                if code == PlanCode.STARTER.value and settings.STRIPE_STARTER_PRICE_ID:
                    new_plan.stripe_price_id = settings.STRIPE_STARTER_PRICE_ID
                elif code == PlanCode.GROWTH.value and settings.STRIPE_GROWTH_PRICE_ID:
                    new_plan.stripe_price_id = settings.STRIPE_GROWTH_PRICE_ID
                elif code == PlanCode.PRO.value and settings.STRIPE_PRO_PRICE_ID:
                    new_plan.stripe_price_id = settings.STRIPE_PRO_PRICE_ID
                elif code == PlanCode.BUSINESS.value and settings.STRIPE_BUSINESS_PRICE_ID:
                    new_plan.stripe_price_id = settings.STRIPE_BUSINESS_PRICE_ID
                elif code == PlanCode.AGENCY.value and settings.STRIPE_AGENCY_PRICE_ID:
                    new_plan.stripe_price_id = settings.STRIPE_AGENCY_PRICE_ID
                db.add(new_plan)
                plans.append(new_plan)

        await db.commit()
        PlanService._PLANS_SEEDED = True
        return plans

    @staticmethod
    async def get_all_plans(db: AsyncSession) -> List[Plan]:
        stmt = select(Plan).where(Plan.is_active == True).order_by(Plan.price_monthly.asc())
        res = await db.execute(stmt)
        plans = list(res.scalars().all())
        if not plans:
            plans = await PlanService.ensure_seed_plans(db)
        return plans

    @staticmethod
    async def get_plan_by_code(db: AsyncSession, code: str) -> Optional[Plan]:
        stmt = select(Plan).where(Plan.code == code.upper())
        res = await db.execute(stmt)
        plan = res.scalar_one_or_none()
        if not plan:
            await PlanService.ensure_seed_plans(db)
            stmt = select(Plan).where(Plan.code == code.upper())
            res = await db.execute(stmt)
            plan = res.scalar_one_or_none()
        return plan


class CreditWalletService:
    """Atomic wallet operations, reservations, commits, and ledger recording."""

    @staticmethod
    async def get_or_create_wallet(
        db: AsyncSession, workspace_id: str, user_id: Optional[str] = None
    ) -> CreditWallet:
        """Fetch or initialize credit wallet with default Free plan allocation."""
        if user_id:
            stmt = select(CreditWallet).where(
                or_(CreditWallet.workspace_id == workspace_id, CreditWallet.user_id == user_id)
            )
        else:
            stmt = select(CreditWallet).where(CreditWallet.workspace_id == workspace_id)

        res = await db.execute(stmt)
        wallet = res.scalars().first()

        if not wallet:
            now = utc_now()
            wallet = CreditWallet(
                id=str(uuid.uuid4()),
                workspace_id=workspace_id,
                user_id=user_id,
                available_credits=settings.FREE_PLAN_CREDITS,
                monthly_credits=settings.FREE_PLAN_CREDITS,
                rollover_credits=0,
                purchased_credits=0,
                used_credits=0,
                reserved_credits=0,
                last_allocation_at=now,
                next_allocation_at=now + timedelta(days=30),
            )
            db.add(wallet)

            # Record initial free allocation transaction
            tx = CreditTransaction(
                id=str(uuid.uuid4()),
                workspace_id=workspace_id,
                user_id=user_id,
                type=CreditTransactionType.ALLOCATION.value,
                amount=settings.FREE_PLAN_CREDITS,
                balance_before=0,
                balance_after=settings.FREE_PLAN_CREDITS,
                operation="initial_free_allocation",
                description="Welcome Free Plan allocation (50 credits)",
                transaction_metadata={"plan": "FREE"},
                idempotency_key=f"initial_free_{workspace_id}",
            )
            db.add(tx)
            await db.commit()
            await db.refresh(wallet)

        return wallet

    @staticmethod
    async def check_balance(db: AsyncSession, workspace_id: str, required_credits: int) -> Tuple[bool, int]:
        """Check if workspace has sufficient credits."""
        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id)
        return (wallet.available_credits >= required_credits), wallet.available_credits

    @staticmethod
    async def reserve_credits(
        db: AsyncSession,
        workspace_id: str,
        estimated_credits: int,
        operation: str,
        module: str = "SEO",
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        provider: Optional[str] = None,
        provider_model: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Atomically reserves credits for an in-flight expensive operation."""
        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)

        if wallet.available_credits < estimated_credits:
            return {
                "success": False,
                "error": "INSUFFICIENT_CREDITS",
                "available": wallet.available_credits,
                "required": estimated_credits,
                "reservation_id": None,
            }

        # Atomically shift credits from available to reserved
        wallet.available_credits -= estimated_credits
        wallet.reserved_credits += estimated_credits
        reservation_id = f"res_{uuid.uuid4().hex[:12]}"

        await db.commit()
        await db.refresh(wallet)

        return {
            "success": True,
            "reservation_id": reservation_id,
            "estimated_credits": estimated_credits,
            "available_credits": wallet.available_credits,
            "reserved_credits": wallet.reserved_credits,
            "module": module,
            "operation": operation,
            "workspace_id": workspace_id,
            "user_id": user_id,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "provider": provider,
            "provider_model": provider_model,
            "metadata": metadata or {},
        }

    @staticmethod
    async def commit_credits(
        db: AsyncSession,
        reservation: Dict[str, Any],
        actual_credits: Optional[int] = None,
        status: str = "completed",
    ) -> CreditTransaction:
        """Converts an active reservation into permanent usage."""
        workspace_id = reservation["workspace_id"]
        user_id = reservation.get("user_id")
        estimated = reservation["estimated_credits"]
        actual = estimated if actual_credits is None else actual_credits

        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)

        # Release estimated reservation
        wallet.reserved_credits = max(0, wallet.reserved_credits - estimated)

        # Adjust difference if actual != estimated
        diff = estimated - actual
        if diff > 0:
            # Refund over-reserved credits back to available
            wallet.available_credits += diff
        elif diff < 0:
            # Consume extra credits if available
            extra_needed = abs(diff)
            wallet.available_credits = max(0, wallet.available_credits - extra_needed)

        wallet.used_credits += actual
        balance_after = wallet.available_credits
        balance_before = balance_after + actual

        # Immutable ledger entry
        tx = CreditTransaction(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            type=CreditTransactionType.USAGE.value,
            amount=-actual,
            balance_before=balance_before,
            balance_after=balance_after,
            operation=reservation.get("operation", "operation"),
            resource_type=reservation.get("resource_type"),
            resource_id=reservation.get("resource_id"),
            description=f"{reservation.get('module', 'System')} {reservation.get('operation', 'operation')} (-{actual} credits)",
            transaction_metadata={
                "reservation_id": reservation.get("reservation_id"),
                "provider": reservation.get("provider"),
                "provider_model": reservation.get("provider_model"),
                **(reservation.get("metadata") or {}),
            },
            idempotency_key=f"commit_{reservation.get('reservation_id')}",
        )
        db.add(tx)

        # Usage Event
        usage_event = UsageEvent(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            module=reservation.get("module", UsageModule.SYSTEM.value),
            operation=reservation.get("operation", "operation"),
            resource_type=reservation.get("resource_type"),
            resource_id=reservation.get("resource_id"),
            credits_used=actual,
            provider=reservation.get("provider"),
            provider_model=reservation.get("provider_model"),
            status=status,
            usage_metadata=reservation.get("metadata") or {},
        )
        db.add(usage_event)

        await db.commit()
        await db.refresh(wallet)
        return tx

    @staticmethod
    async def release_credits(
        db: AsyncSession, reservation: Dict[str, Any], reason: str = "failed"
    ) -> None:
        """Releases reserved credits back to available balance on job/provider failure."""
        workspace_id = reservation["workspace_id"]
        user_id = reservation.get("user_id")
        estimated = reservation["estimated_credits"]

        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)
        wallet.reserved_credits = max(0, wallet.reserved_credits - estimated)
        wallet.available_credits += estimated

        # Record failed Usage Event (with 0 credits charged)
        usage_event = UsageEvent(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            module=reservation.get("module", UsageModule.SYSTEM.value),
            operation=reservation.get("operation", "operation"),
            resource_type=reservation.get("resource_type"),
            resource_id=reservation.get("resource_id"),
            credits_used=0,
            provider=reservation.get("provider"),
            provider_model=reservation.get("provider_model"),
            status="failed",
            usage_metadata={"failure_reason": reason, "reservation_id": reservation.get("reservation_id")},
        )
        db.add(usage_event)
        await db.commit()
        await db.refresh(wallet)

    @staticmethod
    async def deduct_atomic(
        db: AsyncSession,
        workspace_id: str,
        amount: int,
        operation: str,
        module: str = "SEO",
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        provider: Optional[str] = None,
        provider_model: Optional[str] = None,
        user_id: Optional[str] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Tuple[bool, Optional[CreditTransaction]]:
        """Direct atomic deduction with ledger recording."""
        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)

        if wallet.available_credits < amount:
            return False, None

        balance_before = wallet.available_credits
        wallet.available_credits -= amount
        wallet.used_credits += amount
        balance_after = wallet.available_credits

        desc = description or f"{module} {operation} (-{amount} credits)"
        tx = CreditTransaction(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            type=CreditTransactionType.USAGE.value,
            amount=-amount,
            balance_before=balance_before,
            balance_after=balance_after,
            operation=operation,
            resource_type=resource_type,
            resource_id=resource_id,
            description=desc,
            transaction_metadata={
                "provider": provider,
                "provider_model": provider_model,
                **(metadata or {}),
            },
            idempotency_key=f"deduct_{uuid.uuid4().hex[:12]}",
        )
        db.add(tx)

        usage = UsageEvent(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            module=module,
            operation=operation,
            resource_type=resource_type,
            resource_id=resource_id,
            credits_used=amount,
            provider=provider,
            provider_model=provider_model,
            status="completed",
            usage_metadata=metadata or {},
        )
        db.add(usage)

        await db.commit()
        await db.refresh(wallet)
        return True, tx

    @staticmethod
    async def add_credits_atomic(
        db: AsyncSession,
        workspace_id: str,
        amount: int,
        type: str = CreditTransactionType.PURCHASE.value,
        operation: str = "credit_purchase",
        description: str = "Credit Pack Purchase",
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        idempotency_key: Optional[str] = None,
    ) -> CreditTransaction:
        """Atomic addition of credits (purchased, bonus, or manual adjustment)."""
        if idempotency_key:
            stmt = select(CreditTransaction).where(CreditTransaction.idempotency_key == idempotency_key)
            res = await db.execute(stmt)
            existing_tx = res.scalar_one_or_none()
            if existing_tx:
                return existing_tx

        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)

        balance_before = wallet.available_credits
        wallet.available_credits += amount
        if type == CreditTransactionType.PURCHASE.value:
            wallet.purchased_credits += amount
        balance_after = wallet.available_credits

        tx = CreditTransaction(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            type=type,
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
            operation=operation,
            description=description,
            transaction_metadata=metadata or {},
            idempotency_key=idempotency_key,
        )
        db.add(tx)
        await db.commit()
        await db.refresh(wallet)
        return tx


class CreditAllocationService:
    """Monthly credit allocation with rollover limits."""

    @staticmethod
    async def allocate_subscription_period(
        db: AsyncSession,
        workspace_id: str,
        plan: Plan,
        period_start: datetime,
        period_end: datetime,
        user_id: Optional[str] = None,
    ) -> bool:
        """Idempotently allocates plan credits for a new billing cycle."""
        idempotency_key = f"alloc_{workspace_id}_{plan.code}_{int(period_start.timestamp())}"

        stmt = select(CreditTransaction).where(CreditTransaction.idempotency_key == idempotency_key)
        res = await db.execute(stmt)
        if res.scalar_one_or_none():
            return False  # Already allocated for this cycle

        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)

        # Calculate rollover from unused monthly credits
        current_available = wallet.available_credits
        eligible_for_rollover = max(0, current_available - wallet.purchased_credits)
        rollover = min(eligible_for_rollover, plan.max_rollover_credits) if plan.code != PlanCode.FREE.value else 0

        # Set new balances
        wallet.monthly_credits = plan.monthly_credits
        wallet.rollover_credits = rollover
        wallet.available_credits = plan.monthly_credits + rollover + wallet.purchased_credits
        wallet.last_allocation_at = period_start
        wallet.next_allocation_at = period_end

        tx = CreditTransaction(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            user_id=user_id,
            type=CreditTransactionType.ALLOCATION.value,
            amount=plan.monthly_credits,
            balance_before=current_available,
            balance_after=wallet.available_credits,
            operation="monthly_plan_allocation",
            description=f"{plan.name} Monthly Plan Allocation (+{plan.monthly_credits} credits, {rollover} rollover)",
            transaction_metadata={
                "plan_code": plan.code,
                "monthly_credits": plan.monthly_credits,
                "rollover_credits": rollover,
                "purchased_credits": wallet.purchased_credits,
                "period_start": period_start.isoformat(),
                "period_end": period_end.isoformat(),
            },
            idempotency_key=idempotency_key,
        )
        db.add(tx)
        await db.commit()
        await db.refresh(wallet)
        return True


class CreditReconciliationService:
    """Validates wallet balances against immutable ledger."""

    @staticmethod
    async def reconcile_wallet(db: AsyncSession, workspace_id: str) -> Dict[str, Any]:
        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id)
        stmt = select(func.sum(CreditTransaction.amount)).where(CreditTransaction.workspace_id == workspace_id)
        res = await db.execute(stmt)
        ledger_sum = res.scalar() or 0

        expected_balance = ledger_sum
        diff = wallet.available_credits - expected_balance

        return {
            "workspace_id": workspace_id,
            "wallet_available": wallet.available_credits,
            "ledger_sum": ledger_sum,
            "is_consistent": (diff == 0),
            "difference": diff,
        }
