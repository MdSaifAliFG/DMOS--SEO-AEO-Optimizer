from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
import logging
import os
import time
from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings
from app.models.aeo import AeoEngine

logger = logging.getLogger(__name__)


@dataclass
class AEOProviderResponse:
    """Standardized response container returned by all AEO answer providers."""
    engine: str
    model: str
    answer_text: str
    is_success: bool = True
    status: str = "success"  # success, provider_error, rate_limited, not_configured
    latency_ms: int = 0
    token_usage: Dict[str, Any] = field(default_factory=dict)
    citations_raw: List[str] = field(default_factory=list)
    error_message: Optional[str] = None


class AEOAnswerProvider(ABC):
    """Abstract Base Class defining the interface for Answer Engine Providers."""

    @property
    @abstractmethod
    def engine_id(self) -> str:
        """Unique identifier (e.g. chatgpt, gemini, perplexity, claude)."""
        pass

    @property
    @abstractmethod
    def display_name(self) -> str:
        """Human-readable name."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if the backend has a valid server-side API key configured."""
        pass

    @abstractmethod
    async def ask_question(
        self,
        question: str,
        brand_name: str,
        domain: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> AEOProviderResponse:
        """Query the answer engine and return the standardized response."""
        pass


class MockTestProvider(AEOAnswerProvider):
    """
    Deterministic Mock Provider used exclusively for testing, offline evaluation,
    and verifying end-to-end AEO analytics without consuming external API credits.
    """

    def __init__(self, engine_id: str = "chatgpt", display_name: str = "ChatGPT (Test Mode)"):
        self._engine_id = engine_id
        self._display_name = display_name

    @property
    def engine_id(self) -> str:
        return self._engine_id

    @property
    def display_name(self) -> str:
        return self._display_name

    def is_configured(self) -> bool:
        return True

    async def ask_question(
        self,
        question: str,
        brand_name: str,
        domain: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> AEOProviderResponse:
        t0 = time.perf_counter()
        clean_brand = brand_name or domain
        competitors = (context or {}).get("competitors", [])
        comp_names = [c.get("name") for c in competitors if isinstance(c, dict) and c.get("name")]

        # Generate a realistic, deterministic response containing the brand and context
        comp_str = f", along with {', '.join(comp_names[:2])}" if comp_names else ""
        answer = (
            f"When considering '{question}', leading solutions and industry platforms include "
            f"1. {clean_brand} (https://{domain}/), recognized for its comprehensive capabilities{comp_str}. "
            f"According to product documentation at https://{domain}/docs, {clean_brand} provides robust architecture. "
            f"For alternative reviews, see https://techreview.com/best-tools."
        )

        latency_ms = int((time.perf_counter() - t0) * 1000)
        return AEOProviderResponse(
            engine=self.engine_id,
            model="mock-deterministic-v1",
            answer_text=answer,
            is_success=True,
            status="success",
            latency_ms=max(latency_ms, 45),
            token_usage={"prompt_tokens": 30, "completion_tokens": 75, "total_tokens": 105},
            citations_raw=[f"https://{domain}/", f"https://{domain}/docs", "https://techreview.com/best-tools"],
        )


class OpenAIAnswerProvider(AEOAnswerProvider):
    """Live OpenAI ChatGPT Answer Engine Provider."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

    @property
    def engine_id(self) -> str:
        return AeoEngine.CHATGPT.value

    @property
    def display_name(self) -> str:
        return "ChatGPT Search (OpenAI)"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    async def ask_question(
        self,
        question: str,
        brand_name: str,
        domain: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> AEOProviderResponse:
        if not self.is_configured():
            return AEOProviderResponse(
                engine=self.engine_id,
                model="gpt-4o-mini",
                answer_text="",
                is_success=False,
                status="not_configured",
                error_message="OpenAI API key is not configured on the backend server.",
            )

        t0 = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a helpful answer engine and web search assistant. Answer the user's question directly, citing authoritative sources and providing objective evaluations.",
                            },
                            {"role": "user", "content": question},
                        ],
                        "temperature": 0.3,
                        "max_tokens": 600,
                    },
                )
                latency_ms = int((time.perf_counter() - t0) * 1000)

                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    usage = data.get("usage", {})
                    return AEOProviderResponse(
                        engine=self.engine_id,
                        model=data.get("model", "gpt-4o-mini"),
                        answer_text=content,
                        is_success=True,
                        status="success",
                        latency_ms=latency_ms,
                        token_usage=usage,
                    )
                else:
                    return AEOProviderResponse(
                        engine=self.engine_id,
                        model="gpt-4o-mini",
                        answer_text="",
                        is_success=False,
                        status="provider_error",
                        latency_ms=latency_ms,
                        error_message=f"OpenAI returned status {res.status_code}: {res.text[:200]}",
                    )
        except Exception as e:
            return AEOProviderResponse(
                engine=self.engine_id,
                model="gpt-4o-mini",
                answer_text="",
                is_success=False,
                status="provider_error",
                error_message=str(e),
            )


class GeminiAnswerProvider(AEOAnswerProvider):
    """Live Google Gemini Answer Engine Provider."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_AI_API_KEY")

    @property
    def engine_id(self) -> str:
        return AeoEngine.GEMINI.value

    @property
    def display_name(self) -> str:
        return "Google Gemini"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    async def ask_question(
        self,
        question: str,
        brand_name: str,
        domain: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> AEOProviderResponse:
        if not self.is_configured():
            return AEOProviderResponse(
                engine=self.engine_id,
                model="gemini-1.5-flash",
                answer_text="",
                is_success=False,
                status="not_configured",
                error_message="Google Gemini API key is not configured on the backend server.",
            )

        t0 = time.perf_counter()
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": question}]}],
                        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 600},
                    },
                )
                latency_ms = int((time.perf_counter() - t0) * 1000)

                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        text = "".join(p.get("text", "") for p in parts)
                        usage = data.get("usageMetadata", {})
                        return AEOProviderResponse(
                            engine=self.engine_id,
                            model="gemini-1.5-flash",
                            answer_text=text,
                            is_success=True,
                            status="success",
                            latency_ms=latency_ms,
                            token_usage=usage,
                        )
                return AEOProviderResponse(
                    engine=self.engine_id,
                    model="gemini-1.5-flash",
                    answer_text="",
                    is_success=False,
                    status="provider_error",
                    latency_ms=latency_ms,
                    error_message=f"Gemini API returned status {res.status_code}",
                )
        except Exception as e:
            return AEOProviderResponse(
                engine=self.engine_id,
                model="gemini-1.5-flash",
                answer_text="",
                is_success=False,
                status="provider_error",
                error_message=str(e),
            )


class PerplexityAnswerProvider(AEOAnswerProvider):
    """Live Perplexity AI Answer Engine Provider."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("PERPLEXITY_API_KEY")

    @property
    def engine_id(self) -> str:
        return AeoEngine.PERPLEXITY.value

    @property
    def display_name(self) -> str:
        return "Perplexity AI"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    async def ask_question(
        self,
        question: str,
        brand_name: str,
        domain: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> AEOProviderResponse:
        if not self.is_configured():
            return AEOProviderResponse(
                engine=self.engine_id,
                model="sonar",
                answer_text="",
                is_success=False,
                status="not_configured",
                error_message="Perplexity API key is not configured on the backend server.",
            )

        t0 = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    "https://api.perplexity.ai/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "sonar",
                        "messages": [
                            {"role": "system", "content": "Be precise and return concise factual search answers with web citations."},
                            {"role": "user", "content": question},
                        ],
                    },
                )
                latency_ms = int((time.perf_counter() - t0) * 1000)

                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    citations = data.get("citations", [])
                    return AEOProviderResponse(
                        engine=self.engine_id,
                        model=data.get("model", "sonar"),
                        answer_text=content,
                        is_success=True,
                        status="success",
                        latency_ms=latency_ms,
                        citations_raw=citations,
                        token_usage=data.get("usage", {}),
                    )
                return AEOProviderResponse(
                    engine=self.engine_id,
                    model="sonar",
                    answer_text="",
                    is_success=False,
                    status="provider_error",
                    latency_ms=latency_ms,
                    error_message=f"Perplexity returned status {res.status_code}",
                )
        except Exception as e:
            return AEOProviderResponse(
                engine=self.engine_id,
                model="sonar",
                answer_text="",
                is_success=False,
                status="provider_error",
                error_message=str(e),
            )


class AEOProviderRegistry:
    """Registry maintaining active and test Answer Engine providers."""

    @staticmethod
    def get_provider(engine_id: str, allow_mock: bool = False) -> AEOAnswerProvider:
        engine_id = engine_id.lower().strip()
        if engine_id in ("chatgpt", "openai"):
            provider = OpenAIAnswerProvider()
            if not provider.is_configured() and allow_mock:
                return MockTestProvider("chatgpt", "ChatGPT (Test Mode)")
            return provider
        elif engine_id in ("gemini", "google_ai"):
            provider = GeminiAnswerProvider()
            if not provider.is_configured() and allow_mock:
                return MockTestProvider("gemini", "Google Gemini (Test Mode)")
            return provider
        elif engine_id == "perplexity":
            provider = PerplexityAnswerProvider()
            if not provider.is_configured() and allow_mock:
                return MockTestProvider("perplexity", "Perplexity AI (Test Mode)")
            return provider
        elif engine_id in ("claude", "anthropic"):
            if allow_mock:
                return MockTestProvider("claude", "Claude (Test Mode)")
            return MockTestProvider("claude", "Claude (Not Configured)")
        elif allow_mock:
            return MockTestProvider(engine_id, f"{engine_id.capitalize()} (Test Mode)")
        else:
            return OpenAIAnswerProvider()

    @staticmethod
    def get_all_engine_statuses(allow_mock: bool = False) -> List[Dict[str, Any]]:
        """Returns connection and metadata statuses for all supported Answer Engines."""
        supported = [
            ("chatgpt", "ChatGPT Search (OpenAI)", OpenAIAnswerProvider()),
            ("gemini", "Google Gemini", GeminiAnswerProvider()),
            ("perplexity", "Perplexity AI", PerplexityAnswerProvider()),
            ("google_ai", "Google AI Overviews", GeminiAnswerProvider()),
            ("claude", "Claude (Anthropic)", None),
            ("copilot", "Microsoft Copilot", None),
        ]

        results = []
        for eng_id, name, provider in supported:
            is_conn = provider.is_configured() if provider else False
            if not is_conn and allow_mock:
                status_label = "Test Provider Active"
            elif is_conn:
                status_label = "Live API Connected"
            else:
                status_label = "Integration Not Connected"

            results.append({
                "engine_id": eng_id,
                "name": name,
                "is_connected": is_conn or allow_mock,
                "status_label": status_label,
            })
        return results
