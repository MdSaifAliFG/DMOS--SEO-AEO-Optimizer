from datetime import datetime, timedelta, timezone
import logging
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    get_password_hash,
    is_account_locked,
    validate_password_security,
    verify_password,
)
from app.models.password_reset import PasswordReset
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    SignUpRequest,
    UserOut,
    VerifyResetCodeRequest,
    VerifyResetCodeResponse,
)
from app.services.email.email_service import send_password_reset_code

logger = logging.getLogger("seosensing.api.auth")
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="User registration",
    description="Registers a new user account with hashed password storage.",
)
async def signup(
    payload: SignUpRequest,
    db: AsyncSession = Depends(get_db),
):
    clean_email = payload.email.strip().lower()
    clean_name = payload.full_name.strip() if payload.full_name else clean_email.split("@")[0].capitalize()

    # Validate password complexity (8-16 chars, uppercase, lowercase, digit, special char)
    is_valid_pwd, pwd_err = validate_password_security(payload.password)
    if not is_valid_pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=pwd_err,
        )

    # Check if user already exists
    user_res = await db.execute(select(User).where(User.email == clean_email))
    user = user_res.scalars().first()

    if user and user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in.",
        )

    password_hash = get_password_hash(payload.password)

    if user:
        # Existing user without password - set password
        user.hashed_password = password_hash
        user.full_name = clean_name
        user.failed_login_attempts = 0
        user.locked_until = None
    else:
        user = User(
            email=clean_email,
            full_name=clean_name,
            hashed_password=password_hash,
            failed_login_attempts=0,
            locked_until=None,
            is_active=True,
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)

    logger.info("New user account registered: %s", clean_email)

    return AuthResponse(
        success=True,
        message="Account created successfully.",
        user=UserOut(
            id=user.id,
            email=user.email,
            name=user.full_name,
            role="admin" if user.is_superuser else "member",
        ),
        token=f"sess_{user.id}_{secrets.token_hex(16)}",
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="User login with brute-force lockout",
    description="Authenticates user credentials. Locks the account for 15 minutes after 5 consecutive failed attempts.",
)
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    clean_email = payload.email.strip().lower()
    clean_password = payload.password

    user_res = await db.execute(select(User).where(User.email == clean_email))
    user = user_res.scalars().first()

    if not user:
        # User not found
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password.",
        )

    # Check if account is currently locked
    is_locked, remaining_minutes = is_account_locked(user.locked_until)
    if is_locked:
        logger.warning("Login attempted on locked account: %s (%d mins remaining)", clean_email, remaining_minutes)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Account is temporarily locked due to 5 consecutive failed attempts. Please try again in {remaining_minutes} minute{'s' if remaining_minutes != 1 else ''}.",
        )

    # If user has no password set yet, set it now
    if not user.hashed_password:
        user.hashed_password = get_password_hash(clean_password)
        user.failed_login_attempts = 0
        user.locked_until = None
        await db.commit()
        await db.refresh(user)
        return AuthResponse(
            success=True,
            message="Authentication successful.",
            user=UserOut(
                id=user.id,
                email=user.email,
                name=user.full_name,
                role="admin" if user.is_superuser else "member",
            ),
            token=f"sess_{user.id}_{secrets.token_hex(16)}",
        )

    # Verify password hash
    is_valid = verify_password(clean_password, user.hashed_password)

    if not is_valid:
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
            await db.commit()
            logger.warning("Account %s locked for 15 minutes after 5 failed attempts.", clean_email)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account has been locked for 15 minutes due to 5 consecutive failed password attempts.",
            )
        else:
            remaining_attempts = 5 - user.failed_login_attempts
            await db.commit()
            logger.warning("Failed login for %s (attempt %d/5)", clean_email, user.failed_login_attempts)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid email or password. {remaining_attempts} attempt{'s' if remaining_attempts != 1 else ''} remaining before a 15-minute account lockout.",
            )

    # Password is correct - reset failed attempts & lockout
    user.failed_login_attempts = 0
    user.locked_until = None
    await db.commit()
    await db.refresh(user)

    logger.info("User logged in successfully: %s", clean_email)

    return AuthResponse(
        success=True,
        message="Authentication successful.",
        user=UserOut(
            id=user.id,
            email=user.email,
            name=user.full_name,
            role="admin" if user.is_superuser else "member",
        ),
        token=f"sess_{user.id}_{secrets.token_hex(16)}",
    )


@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Request password reset code",
    description="Generates a 6-digit verification code and delivers it to the user's email address via Brevo SMTP.",
)
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    clean_email = payload.email.strip().lower()

    # Check if user account is locked
    user_res = await db.execute(select(User).where(User.email == clean_email))
    user = user_res.scalars().first()

    if user:
        is_locked, remaining_minutes = is_account_locked(user.locked_until)
        if is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Account is currently locked. Please wait {remaining_minutes} minute{'s' if remaining_minutes != 1 else ''} before requesting a password reset.",
            )

    # Generate 6-digit cryptographic verification code
    code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    # Invalidate previous unused codes for this email
    await db.execute(
        update(PasswordReset)
        .where(PasswordReset.email == clean_email, PasswordReset.is_used == False)  # noqa: E712
        .values(is_used=True)
    )

    # Create new reset record
    reset_entry = PasswordReset(
        email=clean_email,
        code=code,
        expires_at=expires_at,
        is_used=False,
        failed_attempts=0,
        locked_until=None,
    )
    db.add(reset_entry)

    display_name = user.full_name if user and user.full_name else None
    await db.commit()

    logger.info("🔐 [PASSWORD RESET OTP] Target: %s | Verification Code: %s", clean_email, code)

    # Dispatch email via Brevo SMTP
    email_sent = await send_password_reset_code(
        to_email=clean_email,
        code=code,
        user_name=display_name,
        expiration_minutes=15,
    )

    if not email_sent:
        logger.warning("SMTP email dispatch failed or was unconfigured for %s.", clean_email)

    return ForgotPasswordResponse(
        success=True,
        message=f"A 6-digit verification code has been dispatched to {clean_email}.",
        expires_in_minutes=15,
    )


@router.post(
    "/verify-code",
    response_model=VerifyResetCodeResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify reset code",
    description="Checks if the entered 6-digit verification code is valid and not expired with lockout protection.",
)
async def verify_code(
    payload: VerifyResetCodeRequest,
    db: AsyncSession = Depends(get_db),
):
    clean_email = payload.email.strip().lower()
    clean_code = payload.code.strip()

    # Check for active lockout on any reset record for this email
    lockout_res = await db.execute(
        select(PasswordReset)
        .where(PasswordReset.email == clean_email, PasswordReset.locked_until.is_not(None))
        .order_by(PasswordReset.created_at.desc())
    )
    locked_record = lockout_res.scalars().first()
    if locked_record:
        is_locked, remaining_minutes = is_account_locked(locked_record.locked_until)
        if is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Verification is temporarily locked due to 5 incorrect attempts. Please try again in {remaining_minutes} minute{'s' if remaining_minutes != 1 else ''}.",
            )

    # Search for matching valid unused code
    result = await db.execute(
        select(PasswordReset)
        .where(
            PasswordReset.email == clean_email,
            PasswordReset.code == clean_code,
            PasswordReset.is_used == False,
        )
        .order_by(PasswordReset.created_at.desc())
    )
    record = result.scalars().first()

    if not record or not record.is_valid():
        latest_res = await db.execute(
            select(PasswordReset)
            .where(PasswordReset.email == clean_email)
            .order_by(PasswordReset.created_at.desc())
        )
        latest_record = latest_res.scalars().first()
        if latest_record:
            latest_record.failed_attempts += 1
            if latest_record.failed_attempts >= 5:
                latest_record.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
                await db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Verification locked for 15 minutes due to 5 consecutive incorrect code attempts. Please request a new code later.",
                )
            else:
                remaining_attempts = 5 - latest_record.failed_attempts
                await db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid or expired verification code. {remaining_attempts} attempt{'s' if remaining_attempts != 1 else ''} remaining before lockout.",
                )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active password reset request found. Please request a new verification code.",
        )

    return VerifyResetCodeResponse(
        success=True,
        message="Verification code is valid.",
        valid=True,
    )


@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Reset account password",
    description="Verifies the code and securely updates the user's password.",
)
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    clean_email = payload.email.strip().lower()
    clean_code = payload.code.strip()

    # Validate password complexity (8-16 chars, uppercase, lowercase, digit, special char)
    is_valid_pwd, pwd_err = validate_password_security(payload.new_password)
    if not is_valid_pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=pwd_err,
        )

    # Check for active lockout on any reset record for this email
    lockout_res = await db.execute(
        select(PasswordReset)
        .where(PasswordReset.email == clean_email, PasswordReset.locked_until.is_not(None))
        .order_by(PasswordReset.created_at.desc())
    )
    locked_record = lockout_res.scalars().first()
    if locked_record:
        is_locked, remaining_minutes = is_account_locked(locked_record.locked_until)
        if is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Verification is temporarily locked due to 5 failed attempts. Please try again in {remaining_minutes} minute{'s' if remaining_minutes != 1 else ''}.",
            )

    # Search for matching valid unused code
    result = await db.execute(
        select(PasswordReset)
        .where(
            PasswordReset.email == clean_email,
            PasswordReset.code == clean_code,
            PasswordReset.is_used == False,
        )
        .order_by(PasswordReset.created_at.desc())
    )
    record = result.scalars().first()

    if not record or not record.is_valid():
        latest_res = await db.execute(
            select(PasswordReset)
            .where(PasswordReset.email == clean_email)
            .order_by(PasswordReset.created_at.desc())
        )
        latest_record = latest_res.scalars().first()
        if latest_record:
            latest_record.failed_attempts += 1
            if latest_record.failed_attempts >= 5:
                latest_record.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
                await db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Verification locked for 15 minutes due to 5 consecutive incorrect code attempts.",
                )
            else:
                remaining_attempts = 5 - latest_record.failed_attempts
                await db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid or expired verification code. {remaining_attempts} attempt{'s' if remaining_attempts != 1 else ''} remaining before lockout.",
                )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active password reset request found. Please request a new verification code.",
        )

    # Mark code as used
    record.is_used = True

    # Hash new password
    new_password_hash = get_password_hash(payload.new_password)

    # Check if user exists or create them
    user_res = await db.execute(select(User).where(User.email == clean_email))
    user = user_res.scalars().first()

    if user:
        user.hashed_password = new_password_hash
        user.failed_login_attempts = 0
        user.locked_until = None
    else:
        user = User(
            email=clean_email,
            full_name=clean_email.split("@")[0].capitalize(),
            hashed_password=new_password_hash,
            failed_login_attempts=0,
            locked_until=None,
            is_active=True,
        )
        db.add(user)

    await db.commit()
    logger.info("Password successfully reset with new cryptographic hash for: %s", clean_email)

    return ResetPasswordResponse(
        success=True,
        message="Your password has been successfully reset. You can now log in with your new password.",
    )
