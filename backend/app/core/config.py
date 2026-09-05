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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
