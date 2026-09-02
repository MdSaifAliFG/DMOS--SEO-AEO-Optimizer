from typing import AsyncGenerator
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings


# Normalize database URL for async drivers
def get_async_db_url(url: str) -> str:
    # If postgresql:// or postgres:// is passed without driver, use postgresql+psycopg://
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    if url.startswith("sqlite:///") and not url.startswith("sqlite+aiosqlite:///"):
        return url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
    return url


database_url = get_async_db_url(settings.DATABASE_URL)

# SQLite-specific connect args if using SQLite
connect_args = {}
if "sqlite" in database_url:
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    database_url,
    echo=settings.DEBUG,
    future=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base SQLAlchemy declarative class."""
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides an async SQLAlchemy session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables and run lightweight column schema migrations."""
    async with engine.begin() as conn:
        # Import all models to ensure they are registered with Base.metadata
        import app.models  # noqa: F401
        await conn.run_sync(Base.metadata.create_all)

        # Migration helper for SQLite / Postgres to add newly introduced columns to existing tables
        columns_to_ensure = [
            ("aeo_projects", "brand_name", "VARCHAR(255)"),
            ("aeo_projects", "brand_aliases", "JSON DEFAULT '[]'"),
            ("aeo_projects", "industry", "VARCHAR(100)"),
            ("aeo_projects", "country", "VARCHAR(100)"),
            ("aeo_projects", "target_audience", "VARCHAR(255)"),
            ("aeo_projects", "target_language", "VARCHAR(20) DEFAULT 'en'"),
            ("aeo_projects", "competitors", "JSON DEFAULT '[]'"),
            ("aeo_projects", "score_label", "VARCHAR(50)"),
            ("aeo_projects", "mention_score", "INTEGER"),
            ("aeo_projects", "citation_score", "INTEGER"),
            ("aeo_projects", "position_score", "INTEGER"),
            ("aeo_projects", "coverage_score", "INTEGER"),
            ("aeo_projects", "last_analyzed_at", "DATETIME"),
            ("aeo_questions", "brand_mentioned", "BOOLEAN DEFAULT 0"),
            ("aeo_questions", "best_rank_position", "INTEGER"),
            ("aeo_citations", "citation_type", "VARCHAR(50) DEFAULT 'third_party'"),
            ("aeo_entities", "associated_concepts", "JSON DEFAULT '[]'"),
        ]

        for table, col, col_type in columns_to_ensure:
            try:
                await conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}"))
            except Exception:
                # Column already exists or table not ready
                pass

    # Sanitize existing project domains if any stored with protocol prefixes
    async with AsyncSessionLocal() as session:
        try:
            from sqlalchemy import select
            from app.models.project import Project
            from app.services.crawler.url_normalizer import get_root_domain

            res = await session.execute(select(Project))
            projects = res.scalars().all()
            for p in projects:
                if p.domain and ("://" in p.domain or "/" in p.domain or p.domain.startswith("www.")):
                    cleaned = get_root_domain(p.domain)
                    if cleaned and cleaned != p.domain:
                        p.domain = cleaned
            await session.commit()
        except Exception:
            pass
