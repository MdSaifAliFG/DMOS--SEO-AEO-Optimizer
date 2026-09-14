from __future__ import annotations
from datetime import datetime
from typing import Any, Dict, Optional, Tuple
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.billing import Plan, PlanCode, Subscription, SubscriptionStatus
from app.models.project import Project
from app.models.aeo import AeoProject
from app.models.geo import GeoProject
from app.models.user import User
from app.services.credit_service import PlanService, CreditWalletService
from app.models.base import utc_now


class EntitlementService:
    """Server-side policy and quota enforcement for plans and features."""

    @staticmethod
    async def get_active_subscription_and_plan(
        db: AsyncSession, workspace_id: str, user_id: Optional[str] = None
    ) -> Tuple[Optional[Subscription], Plan]:
        """Fetch active workspace subscription and associated plan, defaulting to Free."""
        if user_id:
            sub_condition = or_(
                Subscription.workspace_id == workspace_id,
                Subscription.user_id == user_id,
            )
        else:
            sub_condition = (Subscription.workspace_id == workspace_id)

        stmt = (
            select(Subscription)
            .options(selectinload(Subscription.plan))
            .where(
                sub_condition,
                Subscription.status.in_([SubscriptionStatus.ACTIVE.value, SubscriptionStatus.TRIALING.value]),
            )
            .order_by(Subscription.created_at.desc())
        )
        res = await db.execute(stmt)
        sub = res.scalars().first()

        if sub and sub.plan:
            return sub, sub.plan

        # Default to Free plan
        free_plan = await PlanService.get_plan_by_code(db, PlanCode.FREE.value)
        return None, free_plan

    @staticmethod
    async def can_create_project(
        db: AsyncSession, workspace_id: str, user_id: Optional[str] = None
    ) -> Tuple[bool, int, int]:
        """Verify if workspace is within max_projects quota."""
        _, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id, user_id)

        # Count total active projects across SEO, AEO, and GEO
        seo_cnt_stmt = select(func.count(Project.id))
        if user_id:
            seo_cnt_stmt = seo_cnt_stmt.where(or_(Project.user_id == user_id, Project.user_id.is_(None)))
        seo_cnt = (await db.execute(seo_cnt_stmt)).scalar() or 0

        aeo_cnt_stmt = select(func.count(AeoProject.id))
        if user_id:
            aeo_cnt_stmt = aeo_cnt_stmt.where(or_(AeoProject.user_id == user_id, AeoProject.user_id.is_(None)))
        aeo_cnt = (await db.execute(aeo_cnt_stmt)).scalar() or 0

        geo_cnt_stmt = select(func.count(GeoProject.id))
        if user_id:
            geo_cnt_stmt = geo_cnt_stmt.where(or_(GeoProject.user_id == user_id, GeoProject.user_id.is_(None)))
        geo_cnt = (await db.execute(geo_cnt_stmt)).scalar() or 0

        total_projects = max(seo_cnt, aeo_cnt, geo_cnt)  # Or aggregate
        allowed = plan.max_projects
        return (total_projects < allowed), total_projects, allowed

    @staticmethod
    async def can_run_monitoring(db: AsyncSession, workspace_id: str) -> bool:
        _, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id)
        return plan.monitoring_enabled

    @staticmethod
    async def can_run_advanced_monitoring(db: AsyncSession, workspace_id: str) -> bool:
        _, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id)
        return plan.advanced_monitoring

    @staticmethod
    async def can_run_competitor_monitoring(db: AsyncSession, workspace_id: str) -> bool:
        _, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id)
        return plan.competitor_monitoring

    @staticmethod
    async def can_generate_pdf(db: AsyncSession, workspace_id: str) -> bool:
        _, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id)
        return plan.pdf_reports

    @staticmethod
    async def can_use_api(db: AsyncSession, workspace_id: str) -> bool:
        _, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id)
        return plan.api_access

    @staticmethod
    async def can_use_white_label(db: AsyncSession, workspace_id: str) -> bool:
        _, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id)
        return plan.white_label

    @staticmethod
    async def get_workspace_billing_summary(
        db: AsyncSession, workspace_id: str, user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generates comprehensive billing and quota summary."""
        sub, plan = await EntitlementService.get_active_subscription_and_plan(db, workspace_id, user_id)
        wallet = await CreditWalletService.get_or_create_wallet(db, workspace_id, user_id)

        # Projects count
        seo_cnt_stmt = select(func.count(Project.id))
        if user_id:
            seo_cnt_stmt = seo_cnt_stmt.where(or_(Project.user_id == user_id, Project.user_id.is_(None)))
        projects_count = (await db.execute(seo_cnt_stmt)).scalar() or 0
        sub_status = sub.status if sub else SubscriptionStatus.ACTIVE.value
        cancel_at_end = sub.cancel_at_period_end if sub else False
        period_start = sub.current_period_start if sub else wallet.last_allocation_at
        period_end = sub.current_period_end if sub else wallet.next_allocation_at

        return {
            "current_plan": plan,
            "subscription_status": sub_status,
            "price": plan.price_monthly,
            "currency": plan.currency,
            "monthly_credits": plan.monthly_credits,
            "available_credits": wallet.available_credits,
            "used_credits": wallet.used_credits,
            "rollover_credits": wallet.rollover_credits,
            "purchased_credits": wallet.purchased_credits,
            "current_period_start": period_start,
            "current_period_end": period_end,
            "next_billing_date": period_end,
            "cancel_at_period_end": cancel_at_end,
            "projects_used": projects_count,
            "projects_limit": plan.max_projects,
            "websites_used": projects_count,
            "websites_limit": plan.max_websites,
        }
