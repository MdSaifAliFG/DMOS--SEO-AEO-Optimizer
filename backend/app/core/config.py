import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SeoSensing SEO & AEO Optimization Platform"
    VERSION: str = "0.2.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # CORS configuration
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./dmos_dev.db"
    SYNC_DATABASE_URL: str = "sqlite:///./dmos_dev.db"

    # Redis (Job Queue / Infrastructure Prep)
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_ENABLED: bool = False

    # Crawler Configuration (Phase 2)
    CRAWL_MAX_PAGES: int = 100
    CRAWL_MAX_DEPTH: int = 5
    CRAWL_TIMEOUT: int = 15
    CRAWL_CONCURRENCY: int = 5
    CRAWL_MAX_RETRIES: int = 2
    CRAWL_MAX_RESPONSE_SIZE: int = 10485760  # 10MB
    CRAWLER_USER_AGENT: str = "SeoSensingBot/1.0 (+https://seosensing.io/bot; SEO & AEO Audit Engine)"

    # Security
    SECRET_KEY: str = "dmos-phase-1-super-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # SMTP Email Config (Brevo)
    SMTP_HOST: str = "smtp-relay.brevo.com"
    SMTP_PORT: int = 587
    SMTP_SECURE: bool = False
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    SMTP_FROM: str = "dm@fortunehestia.in"
    SMTP_FROM_NAME: str = "The Fortune Group"

    # Razorpay Payment Gateway Configuration
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""
    RAZORPAY_CURRENCY: str = "USD"

    # Razorpay Subscription Plan IDs (Optional for recurring subscriptions)
    RAZORPAY_STARTER_PLAN_ID: str = ""
    RAZORPAY_GROWTH_PLAN_ID: str = ""
    RAZORPAY_PRO_PLAN_ID: str = ""
    RAZORPAY_BUSINESS_PLAN_ID: str = ""
    RAZORPAY_AGENCY_PLAN_ID: str = ""

    # Stripe Payment Gateway Configuration (Legacy/Secondary)
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    STRIPE_STARTER_PRICE_ID: str = ""
    STRIPE_GROWTH_PRICE_ID: str = ""
    STRIPE_PRO_PRICE_ID: str = ""
    STRIPE_BUSINESS_PRICE_ID: str = ""
    STRIPE_AGENCY_PRICE_ID: str = ""

    STRIPE_CREDIT_250_PRICE_ID: str = ""
    STRIPE_CREDIT_500_PRICE_ID: str = ""
    STRIPE_CREDIT_1000_PRICE_ID: str = ""
    STRIPE_CREDIT_2500_PRICE_ID: str = ""
    STRIPE_CREDIT_5000_PRICE_ID: str = ""

    BILLING_CURRENCY: str = "USD"
    FREE_PLAN_CREDITS: int = 50
    LOW_CREDIT_THRESHOLD_PERCENT: int = 20
    PAYMENT_GRACE_PERIOD_DAYS: int = 7

    # Configurable Credit Costs
    CREDIT_COST_SEO_QUICK_SCAN: int = 1
    CREDIT_COST_SEO_PAGE_ANALYSIS: int = 2
    CREDIT_COST_SEO_FULL_AUDIT_BASE: int = 10
    CREDIT_COST_SEO_AUDIT_PER_20_PAGES: int = 1

    CREDIT_COST_AEO_QUESTION: int = 2
    CREDIT_COST_AEO_AI_QUERY: int = 3
    CREDIT_COST_AEO_CITATION: int = 2
    CREDIT_COST_AEO_ENTITY: int = 2

    CREDIT_COST_GEO_QUESTION: int = 3
    CREDIT_COST_GEO_AI_QUERY: int = 3
    CREDIT_COST_GEO_COMPETITOR: int = 3
    CREDIT_COST_GEO_CITATION: int = 2
    CREDIT_COST_GEO_ENTITY: int = 2

    CREDIT_COST_AI_OPTIMIZATION: int = 3
    CREDIT_COST_PDF_REPORT: int = 2
    CREDIT_COST_SCHEDULED_MONITORING: int = 2
    CREDIT_COST_COMPREHENSIVE_AUDIT: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()

