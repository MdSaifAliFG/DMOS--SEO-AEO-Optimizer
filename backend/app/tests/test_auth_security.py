import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.password_reset import PasswordReset
from app.models.user import User


@pytest.mark.asyncio
async def test_auth_security_full_lifecycle(client: AsyncClient, db_session: AsyncSession):
    # 1. Sign up a new user (8-16 chars)
    signup_res = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "security_test@example.com",
            "full_name": "Security User",
            "password": "InitPass123!",
        },
    )
    assert signup_res.status_code == 201
    assert signup_res.json()["success"] is True

    # Verify user in database has PBKDF2 hashed password and not plaintext
    user_res = await db_session.execute(
        select(User).where(User.email == "security_test@example.com")
    )
    user = user_res.scalars().first()
    assert user is not None
    assert user.hashed_password.startswith("pbkdf2_sha256$")
    assert "InitPass123!" not in user.hashed_password

    # 2. Login with correct password succeeds
    login_success = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "security_test@example.com",
            "password": "InitPass123!",
        },
    )
    assert login_success.status_code == 200
    assert login_success.json()["success"] is True

    # 3. Login with wrong/arbitrary password fails
    login_fail_1 = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "security_test@example.com",
            "password": "WrongPass999!",
        },
    )
    assert login_fail_1.status_code == 400
    assert "4 attempts remaining" in login_fail_1.json()["detail"]

    # 4. Consecutive failed attempts leading to 15-minute account lockout
    for i in range(2, 5):
        fail_res = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "security_test@example.com",
                "password": f"WrongPass_{i}!",
            },
        )
        assert fail_res.status_code == 400

    # 5th failed attempt should lock account
    lockout_res = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "security_test@example.com",
            "password": "WrongPass_5!",
        },
    )
    assert lockout_res.status_code == 400
    assert "locked for 15 minutes" in lockout_res.json()["detail"]

    # Subsequent attempt (even with correct password) is blocked due to lockout
    blocked_res = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "security_test@example.com",
            "password": "InitPass123!",
        },
    )
    assert blocked_res.status_code == 400
    assert "temporarily locked" in blocked_res.json()["detail"]


@pytest.mark.asyncio
async def test_password_reset_and_old_password_invalidation(
    client: AsyncClient, db_session: AsyncSession
):
    # 1. Sign up user
    await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "reset_test@example.com",
            "full_name": "Reset User",
            "password": "OldPassword123!",
        },
    )

    # 2. Request forgot password OTP
    forgot_res = await client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "reset_test@example.com"},
    )
    assert forgot_res.status_code == 200

    # Retrieve OTP code
    result = await db_session.execute(
        select(PasswordReset).where(PasswordReset.email == "reset_test@example.com")
    )
    reset_entry = result.scalars().first()
    assert reset_entry is not None
    code = reset_entry.code

    # 3. Perform Password Reset with new password (8-16 chars)
    reset_res = await client.post(
        "/api/v1/auth/reset-password",
        json={
            "email": "reset_test@example.com",
            "code": code,
            "new_password": "NewSecretPass4!",
        },
    )
    assert reset_res.status_code == 200

    # 4. Old password MUST fail
    old_login = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "reset_test@example.com",
            "password": "OldPassword123!",
        },
    )
    assert old_login.status_code == 400

    # 5. Arbitrary/fake password MUST fail
    fake_login = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "reset_test@example.com",
            "password": "AnyRandomPass1!",
        },
    )
    assert fake_login.status_code == 400

    # 6. Only the NEW password MUST succeed
    new_login = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "reset_test@example.com",
            "password": "NewSecretPass4!",
        },
    )
    assert new_login.status_code == 200
    assert new_login.json()["success"] is True


@pytest.mark.asyncio
async def test_password_length_and_complexity_rules(client: AsyncClient):
    # 1. Less than 8 characters should fail
    short_res = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "short_pwd@example.com",
            "password": "Pass1!",
        },
    )
    assert short_res.status_code in [400, 422]

    # 2. More than 16 characters should fail
    long_res = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "long_pwd@example.com",
            "password": "ThisPasswordIsWayTooLong123!",
        },
    )
    assert long_res.status_code in [400, 422]

    # 3. Missing uppercase should fail
    no_upper_res = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "noupper@example.com",
            "password": "password123!",
        },
    )
    assert no_upper_res.status_code in [400, 422]

    # 4. Missing special character should fail
    no_symbol_res = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "nosymbol@example.com",
            "password": "Password1234",
        },
    )
    assert no_symbol_res.status_code in [400, 422]

    # 5. Valid 8-16 char password with complexity succeeds
    valid_res = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "valid_pwd@example.com",
            "password": "ValidPass123!",
        },
    )
    assert valid_res.status_code == 201


@pytest.mark.asyncio
async def test_otp_code_5_attempts_lockout(client: AsyncClient, db_session: AsyncSession):
    # 1. Request forgot password code
    await client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "otp_lockout@example.com"},
    )

    # 2. Submit 4 wrong verification codes
    for i in range(1, 5):
        bad_code_res = await client.post(
            "/api/v1/auth/verify-code",
            json={"email": "otp_lockout@example.com", "code": f"00000{i}"},
        )
        assert bad_code_res.status_code == 400
        assert f"{5 - i} attempt" in bad_code_res.json()["detail"]

    # 3. 5th wrong code triggers 15-minute verification lockout
    fifth_bad_res = await client.post(
        "/api/v1/auth/verify-code",
        json={"email": "otp_lockout@example.com", "code": "999999"},
    )
    assert fifth_bad_res.status_code == 400
    assert "locked for 15 minutes" in fifth_bad_res.json()["detail"]
