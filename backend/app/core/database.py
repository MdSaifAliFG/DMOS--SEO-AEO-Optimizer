import logging
import os
import tempfile
from typing import AsyncGenerator
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

logger = logging.getLogger("seosensing.database")


# Normalize database URL for async drivers and ensure storage availability
def resolve_and_ensure_db_url(raw_url: str) -> str:
    """Normalize database URL for async drivers and ensure storage availability."""
    url = raw_url
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    elif url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)
    elif url.startswith("sqlite:///") and not url.startswith("sqlite+aiosqlite:///"):
        url = url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

    # SQLite directory verification & fallback for containerized environments
    if "sqlite" in url:
        prefix = "sqlite+aiosqlite:///"
        if url.startswith(prefix):
            path_part = url[len(prefix):]
            if path_part not in (":memory:", "") and "?mode=memory" not in path_part:
                query_str = ""
                if "?" in path_part:
                    path_part, query_str = path_part.split("?", 1)
                    query_str = f"?{query_str}"

                abs_path = os.path.abspath(path_part)
                target_dir = os.path.dirname(abs_path)

                can_write = False
                try:
                    os.makedirs(target_dir, exist_ok=True)
                    test_file = os.path.join(target_dir, f".write_test_{os.getpid()}")
                    with open(test_file, "w") as f:
                        f.write("ok")
                    if os.path.exists(test_file):
                        os.remove(test_file)
                    can_write = True
                except Exception as exc:
                    logger.warning(
                        "SQLite directory '%s' is not writable: %s. Using temp fallback.",
                        target_dir,
                        exc,
                    )
                    can_write = False

                if can_write:
                    clean_path = abs_path.replace("\\", "/")
                    return f"{prefix}{clean_path}{query_str}"
                else:
                    fallback_dir = tempfile.gettempdir()
                    fallback_db = os.path.join(
                        fallback_dir, os.path.basename(abs_path) or "seosensing.db"
                    )
                    logger.warning(
                        "Falling back to writable SQLite location at: %s", fallback_db
                    )
                    clean_fallback = fallback_db.replace("\\", "/")
                    return f"{prefix}{clean_fallback}{query_str}"

    return url


database_url = resolve_and_ensure_db_url(settings.DATABASE_URL)

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
            ("aeo_recommendations", "recommendation_code", "VARCHAR(50)"),
            ("aeo_recommendations", "priority_score", "INTEGER DEFAULT 70"),
            ("aeo_recommendations", "priority_level", "VARCHAR(50) DEFAULT 'medium'"),
            ("aeo_recommendations", "severity", "VARCHAR(50) DEFAULT 'medium'"),
            ("aeo_recommendations", "why_it_matters", "TEXT"),
            ("aeo_recommendations", "how_to_fix", "TEXT"),
            ("aeo_recommendations", "estimated_impact", "INTEGER DEFAULT 5"),
            ("aeo_recommendations", "current_score", "INTEGER"),
            ("aeo_recommendations", "potential_score", "INTEGER"),
            ("aeo_recommendations", "affected_prompt_count", "INTEGER DEFAULT 0"),
            ("aeo_recommendations", "affected_answer_count", "INTEGER DEFAULT 0"),
            ("aeo_recommendations", "affected_urls", "JSON DEFAULT '[]'"),
            ("aeo_recommendations", "implementation_steps", "JSON DEFAULT '[]'"),
            ("aeo_recommendations", "verification_status", "VARCHAR(50) DEFAULT 'unverified'"),
            ("aeo_recommendations", "notes", "TEXT"),
            ("aeo_recommendations", "resolved_at", "DATETIME"),
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
