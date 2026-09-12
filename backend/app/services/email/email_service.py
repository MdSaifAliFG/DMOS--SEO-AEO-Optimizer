import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging
import smtplib
import ssl
from typing import Optional
from app.core.config import settings

logger = logging.getLogger("seosensing.email")


def _send_smtp_email_sync(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
) -> bool:
    """Synchronous SMTP email dispatcher using configured Brevo settings with high deliverability headers."""
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASS:
        logger.warning("SMTP configuration is incomplete. Skipping email send.")
        return False

    from email.utils import formatdate, make_msgid

    msg = MIMEMultipart("alternative")
    from_name = settings.SMTP_FROM_NAME or "The Fortune Group"
    from_addr = settings.SMTP_FROM or "dm@fortunehestia.in"
    
    msg["From"] = f"{from_name} <{from_addr}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain=from_addr.split("@")[-1] if "@" in from_addr else "fortunehestia.in")
    msg["Reply-To"] = from_addr
    msg["Auto-Submitted"] = "auto-generated"

    # 1. Plain text version (essential for spam filter trust score)
    if text_content:
        msg.attach(MIMEText(text_content, "plain", "utf-8"))
    else:
        msg.attach(MIMEText("Your verification code is enclosed.", "plain", "utf-8"))

    # 2. HTML version
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        if settings.SMTP_PORT == 465 or str(settings.SMTP_SECURE).lower() == "true":
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT or 465, context=context, timeout=15) as server:
                server.login(settings.SMTP_USER, settings.SMTP_PASS)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT or 587, timeout=15) as server:
                server.ehlo()
                context = ssl.create_default_context()
                server.starttls(context=context)
                server.ehlo()
                server.login(settings.SMTP_USER, settings.SMTP_PASS)
                server.send_message(msg)

        logger.info("Email successfully dispatched via Brevo SMTP to %s (Subject: '%s')", to_email, subject)
        return True
    except Exception as exc:
        logger.exception("Failed to send email via Brevo SMTP (%s:%s): %s", settings.SMTP_HOST, settings.SMTP_PORT, exc)
        return False


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
) -> bool:
    """Asynchronously send an email without blocking the event loop."""
    return await asyncio.to_thread(_send_smtp_email_sync, to_email, subject, html_content, text_content)


def generate_password_reset_email_html(code: str, user_name: Optional[str] = None, expiration_minutes: int = 15) -> str:
    """Generate responsive, high-end HTML email template for password reset."""
    display_name = user_name if user_name else "Valued Member"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030712; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container Box -->
        <table role="presentation" width="100%" max-width="540" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #0f172a; border-radius: 24px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center; background: linear-gradient(180deg, rgba(29, 99, 255, 0.12) 0%, rgba(15, 23, 42, 0) 100%);">
              <div style="display: inline-block; padding: 10px 16px; border-radius: 12px; background: #1e293b; border: 1px solid #334155; margin-bottom: 12px;">
                <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                  SEO<span style="color: #3b82f6;">Sensing</span>
                </span>
              </div>
              <h1 style="margin: 8px 0 0 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                Password Reset Request
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 10px 36px 30px 36px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #94a3b8;">
                Hello <strong style="color: #f1f5f9;">{display_name}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #94a3b8;">
                We received a request to reset the password for your account. Use the 6-digit verification code below to complete the reset:
              </p>

              <!-- Code Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: #030712; border: 2px solid #2563eb; border-radius: 16px; padding: 18px 36px; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3);">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #60a5fa; text-align: center; display: block;">
                        {code}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                ⏱️ This code is valid for <strong style="color: #cbd5e1;">{expiration_minutes} minutes</strong>.
              </p>

              <!-- Security Notice -->
              <div style="margin-top: 28px; padding: 16px; background-color: #1e293b80; border: 1px solid #334155; border-radius: 12px;">
                <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                  🔒 <strong>Security Tip:</strong> If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged and your account is secure.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #030712; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">
                Sent by <strong>{settings.SMTP_FROM_NAME or 'SeoSensing Platform'}</strong>
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; 2026 SeoSensing Platform. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


async def send_password_reset_code(
    to_email: str,
    code: str,
    user_name: Optional[str] = None,
    expiration_minutes: int = 15,
) -> bool:
    """Sends a formatted password reset code email."""
    subject = f"{code} is your SeoSensing verification code"
    text_content = (
        f"Your password reset verification code is: {code}\n"
        f"This code will expire in {expiration_minutes} minutes.\n"
        f"If you did not request this, please ignore this email."
    )
    html_content = generate_password_reset_email_html(
        code=code,
        user_name=user_name,
        expiration_minutes=expiration_minutes,
    )
    return await send_email(
        to_email=to_email,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )
