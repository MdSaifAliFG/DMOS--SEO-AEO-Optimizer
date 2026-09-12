import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.password_reset import PasswordReset


@pytest.mark.asyncio
async def test_forgot_password_flow(client: AsyncClient, db_session: AsyncSession):
    # 1. Request password reset code
    res = await client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "testuser@example.com"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "verification code" in data["message"].lower()

    # 2. Check that reset record exists in database
    result = await db_session.execute(
        select(PasswordReset).where(PasswordReset.email == "testuser@example.com")
    )
    reset_entry = result.scalars().first()
    assert reset_entry is not None
    code = reset_entry.code
    assert len(code) == 6

    # 3. Verify invalid code
    bad_res = await client.post(
        "/api/v1/auth/verify-code",
        json={"email": "testuser@example.com", "code": "000000"},
    )
    assert bad_res.status_code == 400

    # 4. Verify valid code
    good_res = await client.post(
        "/api/v1/auth/verify-code",
        json={"email": "testuser@example.com", "code": code},
    )
    assert good_res.status_code == 200
    assert good_res.json()["valid"] is True

    # 5. Reset password (8 to 16 chars)
    reset_res = await client.post(
        "/api/v1/auth/reset-password",
        json={
            "email": "testuser@example.com",
            "code": code,
            "new_password": "NewSecPass1!",
        },
    )
    assert reset_res.status_code == 200
    assert reset_res.json()["success"] is True

    # 6. Verify that code is now marked used and cannot be reused
    reuse_res = await client.post(
        "/api/v1/auth/reset-password",
        json={
            "email": "testuser@example.com",
            "code": code,
            "new_password": "AnotherP456!",
        },
    )
    assert reuse_res.status_code == 400
