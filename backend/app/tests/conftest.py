import asyncio
from typing import AsyncGenerator
import pytest
try:
    import pytest_asyncio
    async_fixture = pytest_asyncio.fixture
except ImportError:
    async_fixture = pytest.fixture
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
import logging
logging.getLogger("aiosqlite").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
from app.core.database import Base, get_db
from app.main import app

from sqlalchemy.pool import StaticPool

import os
import pathlib

TEST_DB_FILE = pathlib.Path(__file__).parent / "test_dmos.db"
TEST_DB_URL = f"sqlite+aiosqlite:///{TEST_DB_FILE.as_posix()}"

test_engine = create_async_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    future=True,
)

TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


@async_fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@async_fixture(scope="function")
async def auth_headers(db_session: AsyncSession) -> dict:
    """Create a test user and return JWT Authorization headers for it."""
    from app.core.auth import create_access_token
    from app.models.user import User

    user = User(
        id="test_user",
        email="test@test.local",
        full_name="Test",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    return {"Authorization": f"Bearer {create_access_token('test_user')}"}


@async_fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        # Fresh session per request — mirrors production get_db and avoids
        # stale identity-map state leaking between requests in one test.
        async with TestingSessionLocal() as session:
            try:
                yield session
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c

    app.dependency_overrides.clear()
