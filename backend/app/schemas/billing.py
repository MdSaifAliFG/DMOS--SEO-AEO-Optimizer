from __future__ import annotations
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class PlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    name: str
    description: Optional[str] = None
    price_monthly: float
    currency: str
    monthly_credits: int
    max_rollover_credits: int
    max_projects: int
    max_websites: int
    max_team_members: int
    max_ai_queries: int
    monitoring_enabled: bool
    advanced_monitoring: bool
    competitor_monitoring: bool
    pdf_reports: bool
    api_access: bool
    white_label: bool
    priority_processing: bool
    is_popular: bool
    is_active: bool
    features: List[str] = []
    stripe_price_id: Optional[str] = None


class SubscriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    workspace_id: str
    plan_id: str
    plan: Optional[PlanResponse] = None
    provider: str
    status: str
    billing_interval: str
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool
    cancelled_at: Optional[datetime] = None


class CurrentSubscriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    workspace_id: str
    subscription: Optional[SubscriptionResponse] = None
    plan: PlanResponse
    wallet: CreditWalletResponse
    is_stripe_configured: bool = False
    is_razorpay_configured: bool = False


class CreditWalletResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    available_credits: int
    monthly_credits: int
    rollover_credits: int
    purchased_credits: int
    used_credits: int
    reserved_credits: int
    last_allocation_at: Optional[datetime] = None
    next_allocation_at: Optional[datetime] = None


class CreditTransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    workspace_id: str
    type: str
    amount: int
    balance_before: int
    balance_after: int
    operation: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    description: str
    created_at: datetime
    transaction_metadata: Dict[str, Any] = {}


class UsageEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    workspace_id: str
    module: str
    operation: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    credits_used: int
    provider: Optional[str] = None
    provider_model: Optional[str] = None
    status: str
    created_at: datetime
    usage_metadata: Dict[str, Any] = {}


class UsageSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_credits_used: int
    seo_credits: int
    aeo_credits: int
    geo_credits: int
    system_credits: int
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None


class InvoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    workspace_id: str
    invoice_number: str
    amount: float
    currency: str
    status: str
    invoice_url: Optional[str] = None
    pdf_url: Optional[str] = None
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    created_at: datetime



class BillingSummaryResponse(BaseModel):
    current_plan: PlanResponse
    subscription_status: str
    price: float
    currency: str
    monthly_credits: int
    available_credits: int
    used_credits: int
    rollover_credits: int
    purchased_credits: int
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    next_billing_date: Optional[datetime] = None
    cancel_at_period_end: bool
    projects_used: int
    projects_limit: int
    websites_used: int
    websites_limit: int
    team_members_used: Optional[int] = None
    team_members_limit: Optional[int] = None


class CheckoutSessionRequest(BaseModel):
    plan_code: str
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class CreditPackCheckoutRequest(BaseModel):
    pack_code: str = Field(..., description="CREDIT_250 | CREDIT_500 | CREDIT_1000 | CREDIT_2500 | CREDIT_5000")
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str
    mode: str = "subscription"


class CustomerPortalResponse(BaseModel):
    portal_url: str


class ChangePlanRequest(BaseModel):
    plan_code: str


class CreditAdjustmentRequest(BaseModel):
    workspace_id: str
    amount: int
    reason: str
    type: str = "ADJUSTMENT"  # ADJUSTMENT | BONUS | REFUND


# ----------------------------------------------------
# RAZORPAY SCHEMAS
# ----------------------------------------------------
class RazorpayOrderRequest(BaseModel):
    plan_code: Optional[str] = None
    pack_credits: Optional[int] = None
    billing_cycle: str = "monthly"


class RazorpayOrderResponse(BaseModel):
    order_id: str
    amount: int
    amount_display: Optional[float] = None
    currency: str
    key_id: str
    plan_code: Optional[str] = None
    plan_name: Optional[str] = None
    pack_credits: Optional[int] = None
    billing_cycle: Optional[str] = "monthly"
    user_email: Optional[str] = None
    name: str = "SEOSensing"
    description: Optional[str] = None
    is_free: bool = False
    message: Optional[str] = None


class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan_code: Optional[str] = None
    pack_credits: Optional[int] = None
    billing_cycle: str = "monthly"


class RazorpayVerifyResponse(BaseModel):
    success: bool
    verified: bool = True
    type: Optional[str] = None
    plan_code: Optional[str] = None
    plan_name: Optional[str] = None
    pack_credits: Optional[int] = None
    message: str
    available_credits: int
    invoice_number: Optional[str] = None


class RazorpayConfigResponse(BaseModel):
    key_id: str
    currency: str
    is_configured: bool
