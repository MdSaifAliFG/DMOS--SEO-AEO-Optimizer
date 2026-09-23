import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_contact_submission_success():
    """Test successful submission of contact inquiry."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "name": "Alex Mercer",
            "email": "alex@mercergrowth.com",
            "subject": "Enterprise AEO Demo Request",
            "message": "We would like to explore automated citation tracking across ChatGPT and Gemini for our brand.",
            "company": "Mercer Growth Labs",
            "phone": "+1 555-0199",
        }
        resp = await client.post("/api/v1/contact", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert "Thank you" in data["message"]
        assert "timestamp" in data


@pytest.mark.asyncio
async def test_contact_submission_validation_error():
    """Test validation errors for invalid email or too short message."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Invalid email
        resp = await client.post(
            "/api/v1/contact",
            json={
                "name": "Alex",
                "email": "not-an-email",
                "message": "Short message here",
            },
        )
        assert resp.status_code == 422

        # Message too short (< 10 chars)
        resp2 = await client.post(
            "/api/v1/contact",
            json={
                "name": "Alex",
                "email": "alex@test.com",
                "message": "Hi",
            },
        )
        assert resp2.status_code == 422
