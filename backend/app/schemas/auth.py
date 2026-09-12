from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserOut(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    role: str = "member"


class SignUpRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    full_name: Optional[str] = Field(None, description="User full name")
    password: str = Field(..., min_length=8, max_length=16, description="Account password (8 to 16 chars)")


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=1, description="Account password")


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserOut] = None
    token: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="User account email to send reset code to")


class ForgotPasswordResponse(BaseModel):
    success: bool
    message: str
    expires_in_minutes: int = 15


class VerifyResetCodeRequest(BaseModel):
    email: EmailStr = Field(..., description="User account email")
    code: str = Field(..., min_length=4, max_length=10, description="Verification code sent to email")


class VerifyResetCodeResponse(BaseModel):
    success: bool
    message: str
    valid: bool


class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="User account email")
    code: str = Field(..., min_length=4, max_length=10, description="Verification code")
    new_password: str = Field(..., min_length=8, max_length=16, description="New secure password (8 to 16 chars)")


class ResetPasswordResponse(BaseModel):
    success: bool
    message: str
