from __future__ import annotations
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid, utc_now


class PlanCode(str, Enum):
    FREE = "FREE"
    STARTER = "STARTER"
    GROWTH = "GROWTH"
    PRO = "PRO"
    BUSINESS = "BUSINESS"
    AGENCY = "AGENCY"


class SubscriptionStatus(str, Enum):
    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    UNPAID = "unpaid"
    INCOMPLETE = "incomplete"
    INCOMPLETE_EXPIRED = "incomplete_expired"


class CreditTransactionType(str, Enum):
    ALLOCATION = "ALLOCATION"
    USAGE = "USAGE"
    PURCHASE = "PURCHASE"
    BONUS = "BONUS"
    ROLLOVER = "ROLLOVER"
    REFUND = "REFUND"
    EXPIRATION = "EXPIRATION"
    ADJUSTMENT = "ADJUSTMENT"
    REVERSAL = "REVERSAL"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class UsageModule(str, Enum):
    SEO = "SEO"
    AEO = "AEO"
    GEO = "GEO"
    SYSTEM = "SYSTEM"


class Plan(Base, TimestampMixin):
    """Product plan definition and tier entitlements."""
    __tablename__ = "billing_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    code: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price_monthly: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    monthly_credits: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    max_rollover_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_projects: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    max_websites: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    max_team_members: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    max_ai_queries: Mapped[int] = mapped_column(Integer, default=100, nullable=False)

    # Entitlement flags
    monitoring_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    advanced_monitoring: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    competitor_monitoring: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    pdf_reports: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    api_access: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    white_label: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    priority_processing: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    features: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    stripe_product_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    stripe_price_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)


class BillingCustomer(Base, TimestampMixin):
    """Customer mapping to external payment provider (Stripe)."""
    __tablename__ = "billing_customers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    provider: Mapped[str] = mapped_column(String(32), default="stripe", nullable=False)
    provider_customer_id: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)


class Subscription(Base, TimestampMixin):
    """Workspace subscription state and provider binding."""
    __tablename__ = "billing_subscriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    plan_id: Mapped[str] = mapped_column(String(36), ForeignKey("billing_plans.id"), nullable=False)
    provider: Mapped[str] = mapped_column(String(32), default="stripe", nullable=False)
    provider_customer_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    provider_subscription_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default=SubscriptionStatus.ACTIVE.value, nullable=False)
    billing_interval: Mapped[str] = mapped_column(String(16), default="month", nullable=False)
    current_period_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    current_period_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    trial_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    trial_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationship
    plan: Mapped["Plan"] = relationship("Plan", lazy="joined")


class CreditWallet(Base, TimestampMixin):
    """Credit wallet for a workspace/user."""
    __tablename__ = "billing_credit_wallets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    available_credits: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    monthly_credits: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    rollover_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    purchased_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    used_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reserved_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_allocation_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_allocation_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class CreditTransaction(Base, TimestampMixin):
    """Immutable transaction ledger for all credit movements."""
    __tablename__ = "billing_credit_transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    balance_before: Mapped[int] = mapped_column(Integer, nullable=False)
    balance_after: Mapped[int] = mapped_column(Integer, nullable=False)
    operation: Mapped[str] = mapped_column(String(64), nullable=False)
    resource_type: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    resource_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    transaction_metadata: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    idempotency_key: Mapped[Optional[str]] = mapped_column(String(128), unique=True, index=True, nullable=True)


class CreditPurchase(Base, TimestampMixin):
    """One-time credit pack purchase record."""
    __tablename__ = "billing_credit_purchases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    credits_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    price_paid: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    provider_payment_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default=PaymentStatus.SUCCEEDED.value, nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class Payment(Base, TimestampMixin):
    """Processed payments record."""
    __tablename__ = "billing_payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    provider: Mapped[str] = mapped_column(String(32), default="stripe", nullable=False)
    provider_payment_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    provider_checkout_session_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default=PaymentStatus.PENDING.value, nullable=False)
    payment_type: Mapped[str] = mapped_column(String(32), default="subscription", nullable=False)  # subscription | credit_pack
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    payment_metadata: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class Invoice(Base, TimestampMixin):
    """Invoices generated from subscriptions and one-time top-ups."""
    __tablename__ = "billing_invoices"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    subscription_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("billing_subscriptions.id"), nullable=True, index=True)
    provider_invoice_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    invoice_number: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="paid", nullable=False)
    invoice_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    pdf_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    period_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    period_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class UsageEvent(Base, TimestampMixin):
    """Detailed per-operation usage logs."""
    __tablename__ = "billing_usage_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    module: Mapped[str] = mapped_column(String(32), nullable=False, index=True)  # SEO | AEO | GEO | SYSTEM
    operation: Mapped[str] = mapped_column(String(64), nullable=False)
    resource_type: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    resource_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    credits_used: Mapped[int] = mapped_column(Integer, nullable=False)
    provider: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)  # openai | gemini | perplexity | claude
    provider_model: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="completed", nullable=False)  # completed | failed | refunded
    usage_metadata: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)


class BillingWebhookEvent(Base, TimestampMixin):
    """Idempotent Stripe webhook receiver log."""
    __tablename__ = "billing_webhook_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    provider: Mapped[str] = mapped_column(String(32), default="stripe", nullable=False)
    event_id: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    event_type: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    payload_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    processed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
