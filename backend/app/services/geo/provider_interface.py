from __future__ import annotations
import os
import time
from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Dict, List, Optional
import httpx


class GEOProviderStatus(str, Enum):
    CONNECTED = "CONNECTED"
    NOT_CONFIGURED = "NOT_CONFIGURED"
    ERROR = "ERROR"
    DISABLED = "DISABLED"


class GEOAnswerProvider(ABC):
    """Abstract base class for GEO Answer Providers."""

    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    def check_configuration(self) -> GEOProviderStatus:
        pass

    @abstractmethod
    def supports_search(self) -> bool:
        pass

    @abstractmethod
    def supports_citations(self) -> bool:
        pass

    @abstractmethod
    async def generate_answer(self, question: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes query against AI engine.
        Returns:
            {
                "provider": str,
                "model": str,
                "answer_text": str,
                "latency_ms": int,
                "token_usage": dict,
                "raw_citations": list,
                "status": str,
                "error": Optional[str]
            }
        """
        pass


class OpenAIGEOProvider(GEOAnswerProvider):
    def provider_name(self) -> str:
        return "OpenAI"

    def check_configuration(self) -> GEOProviderStatus:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key.startswith("sk-test-fake") or api_key == "placeholder":
            return GEOProviderStatus.NOT_CONFIGURED
        return GEOProviderStatus.CONNECTED

    def supports_search(self) -> bool:
        return True

    def supports_citations(self) -> bool:
        return True

    async def generate_answer(self, question: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        status = self.check_configuration()
        if status != GEOProviderStatus.CONNECTED:
            return {
                "provider": self.provider_name(),
                "model": "gpt-4o",
                "answer_text": "",
                "latency_ms": 0,
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.NOT_CONFIGURED.value,
                "error": "OpenAI API key not configured.",
            }

        api_key = os.getenv("OPENAI_API_KEY", "")
        start = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "gpt-4o",
                        "messages": [
                            {"role": "system", "content": system_prompt or "You are a helpful assistant answering search queries."},
                            {"role": "user", "content": question},
                        ],
                        "temperature": 0.3,
                    },
                )
                latency = int((time.perf_counter() - start) * 1000)
                if res.status_code == 200:
                    data = res.json()
                    answer_text = data["choices"][0]["message"]["content"]
                    usage = data.get("usage", {})
                    return {
                        "provider": self.provider_name(),
                        "model": data.get("model", "gpt-4o"),
                        "answer_text": answer_text,
                        "latency_ms": latency,
                        "token_usage": usage,
                        "raw_citations": [],
                        "status": "COMPLETED",
                        "error": None,
                    }
                else:
                    return {
                        "provider": self.provider_name(),
                        "model": "gpt-4o",
                        "answer_text": "",
                        "latency_ms": latency,
                        "token_usage": {},
                        "raw_citations": [],
                        "status": GEOProviderStatus.ERROR.value,
                        "error": f"OpenAI error {res.status_code}: {res.text[:200]}",
                    }
        except Exception as exc:
            return {
                "provider": self.provider_name(),
                "model": "gpt-4o",
                "answer_text": "",
                "latency_ms": int((time.perf_counter() - start) * 1000),
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.ERROR.value,
                "error": str(exc),
            }


class PerplexityGEOProvider(GEOAnswerProvider):
    def provider_name(self) -> str:
        return "Perplexity"

    def check_configuration(self) -> GEOProviderStatus:
        api_key = os.getenv("PERPLEXITY_API_KEY")
        if not api_key:
            return GEOProviderStatus.NOT_CONFIGURED
        return GEOProviderStatus.CONNECTED

    def supports_search(self) -> bool:
        return True

    def supports_citations(self) -> bool:
        return True

    async def generate_answer(self, question: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        status = self.check_configuration()
        if status != GEOProviderStatus.CONNECTED:
            return {
                "provider": self.provider_name(),
                "model": "sonar",
                "answer_text": "",
                "latency_ms": 0,
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.NOT_CONFIGURED.value,
                "error": "Perplexity API key not configured.",
            }

        api_key = os.getenv("PERPLEXITY_API_KEY", "")
        start = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.perplexity.ai/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "sonar",
                        "messages": [
                            {"role": "system", "content": system_prompt or "Be precise and provide factual answers with citations."},
                            {"role": "user", "content": question},
                        ],
                    },
                )
                latency = int((time.perf_counter() - start) * 1000)
                if res.status_code == 200:
                    data = res.json()
                    answer_text = data["choices"][0]["message"]["content"]
                    citations = data.get("citations", [])
                    raw_cits = [{"url": c, "domain": c.split("/")[2] if "://" in c else c} for c in citations if isinstance(c, str)]
                    return {
                        "provider": self.provider_name(),
                        "model": "sonar",
                        "answer_text": answer_text,
                        "latency_ms": latency,
                        "token_usage": data.get("usage", {}),
                        "raw_citations": raw_cits,
                        "status": "COMPLETED",
                        "error": None,
                    }
                else:
                    return {
                        "provider": self.provider_name(),
                        "model": "sonar",
                        "answer_text": "",
                        "latency_ms": latency,
                        "token_usage": {},
                        "raw_citations": [],
                        "status": GEOProviderStatus.ERROR.value,
                        "error": f"Perplexity error {res.status_code}: {res.text[:200]}",
                    }
        except Exception as exc:
            return {
                "provider": self.provider_name(),
                "model": "sonar",
                "answer_text": "",
                "latency_ms": int((time.perf_counter() - start) * 1000),
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.ERROR.value,
                "error": str(exc),
            }


class GeminiGEOProvider(GEOAnswerProvider):
    def provider_name(self) -> str:
        return "Gemini"

    def check_configuration(self) -> GEOProviderStatus:
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return GEOProviderStatus.NOT_CONFIGURED
        return GEOProviderStatus.CONNECTED

    def supports_search(self) -> bool:
        return True

    def supports_citations(self) -> bool:
        return True

    async def generate_answer(self, question: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        status = self.check_configuration()
        if status != GEOProviderStatus.CONNECTED:
            return {
                "provider": self.provider_name(),
                "model": "gemini-1.5-flash",
                "answer_text": "",
                "latency_ms": 0,
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.NOT_CONFIGURED.value,
                "error": "Gemini API key not configured.",
            }

        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
        start = time.perf_counter()
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    url,
                    json={
                        "contents": [{"parts": [{"text": f"{system_prompt or ''}\n\nQuestion: {question}"}]}]
                    },
                )
                latency = int((time.perf_counter() - start) * 1000)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    text = ""
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        text = "".join(p.get("text", "") for p in parts)
                    return {
                        "provider": self.provider_name(),
                        "model": "gemini-1.5-flash",
                        "answer_text": text,
                        "latency_ms": latency,
                        "token_usage": data.get("usageMetadata", {}),
                        "raw_citations": [],
                        "status": "COMPLETED",
                        "error": None,
                    }
                else:
                    return {
                        "provider": self.provider_name(),
                        "model": "gemini-1.5-flash",
                        "answer_text": "",
                        "latency_ms": latency,
                        "token_usage": {},
                        "raw_citations": [],
                        "status": GEOProviderStatus.ERROR.value,
                        "error": f"Gemini error {res.status_code}: {res.text[:200]}",
                    }
        except Exception as exc:
            return {
                "provider": self.provider_name(),
                "model": "gemini-1.5-flash",
                "answer_text": "",
                "latency_ms": int((time.perf_counter() - start) * 1000),
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.ERROR.value,
                "error": str(exc),
            }


class ClaudeGEOProvider(GEOAnswerProvider):
    def provider_name(self) -> str:
        return "Claude"

    def check_configuration(self) -> GEOProviderStatus:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return GEOProviderStatus.NOT_CONFIGURED
        return GEOProviderStatus.CONNECTED

    def supports_search(self) -> bool:
        return False

    def supports_citations(self) -> bool:
        return False

    async def generate_answer(self, question: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        status = self.check_configuration()
        if status != GEOProviderStatus.CONNECTED:
            return {
                "provider": self.provider_name(),
                "model": "claude-3-5-sonnet",
                "answer_text": "",
                "latency_ms": 0,
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.NOT_CONFIGURED.value,
                "error": "Anthropic Claude API key not configured.",
            }

        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        start = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": api_key,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "claude-3-5-sonnet-20241022",
                        "max_tokens": 1024,
                        "system": system_prompt or "Provide concise and factual answers to user questions.",
                        "messages": [{"role": "user", "content": question}],
                    },
                )
                latency = int((time.perf_counter() - start) * 1000)
                if res.status_code == 200:
                    data = res.json()
                    content_blocks = data.get("content", [])
                    text = "".join(b.get("text", "") for b in content_blocks if b.get("type") == "text")
                    return {
                        "provider": self.provider_name(),
                        "model": data.get("model", "claude-3-5-sonnet"),
                        "answer_text": text,
                        "latency_ms": latency,
                        "token_usage": data.get("usage", {}),
                        "raw_citations": [],
                        "status": "COMPLETED",
                        "error": None,
                    }
                else:
                    return {
                        "provider": self.provider_name(),
                        "model": "claude-3-5-sonnet",
                        "answer_text": "",
                        "latency_ms": latency,
                        "token_usage": {},
                        "raw_citations": [],
                        "status": GEOProviderStatus.ERROR.value,
                        "error": f"Claude error {res.status_code}: {res.text[:200]}",
                    }
        except Exception as exc:
            return {
                "provider": self.provider_name(),
                "model": "claude-3-5-sonnet",
                "answer_text": "",
                "latency_ms": int((time.perf_counter() - start) * 1000),
                "token_usage": {},
                "raw_citations": [],
                "status": GEOProviderStatus.ERROR.value,
                "error": str(exc),
            }


class MockTestGEOProvider(GEOAnswerProvider):
    """Deterministic Mock Provider for unit testing and offline verification."""

    def __init__(self, provider_id: str = "MockAI", brand_name: str = "SeoSensing", competitors: Optional[List[str]] = None, domain: Optional[str] = None):
        self._name = provider_id
        self._brand = brand_name or "Brand"
        self._competitors = competitors or ["CompetitorA", "CompetitorB"]
        self._domain = domain or f"{self._brand.lower().replace(' ', '')}.com"

    def provider_name(self) -> str:
        return self._name

    def check_configuration(self) -> GEOProviderStatus:
        return GEOProviderStatus.CONNECTED

    def supports_search(self) -> bool:
        return True

    def supports_citations(self) -> bool:
        return True

    async def generate_answer(self, question: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        comp_a = self._competitors[0] if len(self._competitors) > 0 else "CompetitorA"
        comp_b = self._competitors[1] if len(self._competitors) > 1 else "CompetitorB"
        comp_a_clean = str(comp_a).strip()
        comp_b_clean = str(comp_b).strip()

        answer_text = (
            f"When evaluating options for {question}, **{self._brand}** is a leading solution offering robust capabilities. "
            f"Key industry alternatives in this category include {comp_a_clean} and {comp_b_clean}. "
            f"For modern teams, {self._brand} is strongly recommended due to its comprehensive features, structured knowledge, and high reliability."
        )
        return {
            "provider": self._name,
            "model": f"{self._name.lower()}-engine-v1",
            "answer_text": answer_text,
            "latency_ms": 120,
            "token_usage": {"prompt_tokens": 45, "completion_tokens": 85, "total_tokens": 130},
            "raw_citations": [
                {"url": f"https://{self._domain}/solutions", "domain": self._domain, "title": f"{self._brand} Official Solutions"},
                {"url": f"https://{comp_a_clean.lower().replace(' ', '')}.com/overview", "domain": f"{comp_a_clean.lower().replace(' ', '')}.com", "title": f"{comp_a_clean} Overview"},
                {"url": "https://techreview.io/top-generative-tools", "domain": "techreview.io", "title": "Top Generative & Search Tools 2026"},
            ],
            "status": "COMPLETED",
            "error": None,
        }


class GEOProviderRegistry:
    """Registry managing available GEO answer providers."""

    def __init__(self):
        self._providers: Dict[str, GEOAnswerProvider] = {
            "openai": OpenAIGEOProvider(),
            "perplexity": PerplexityGEOProvider(),
            "gemini": GeminiGEOProvider(),
            "claude": ClaudeGEOProvider(),
        }

    def register_provider(self, key: str, provider: GEOAnswerProvider) -> None:
        self._providers[key.lower()] = provider

    def get_provider(self, name: str) -> Optional[GEOAnswerProvider]:
        return self._providers.get(name.lower())

    def list_providers(self) -> List[Dict[str, Any]]:
        result = []
        for key, provider in self._providers.items():
            status = provider.check_configuration()
            result.append({
                "key": key,
                "name": provider.provider_name(),
                "status": status.value,
                "is_configured": status == GEOProviderStatus.CONNECTED,
                "supports_search": provider.supports_search(),
                "supports_citations": provider.supports_citations(),
            })
        return result

    def is_configured(self, name: str) -> bool:
        p = self.get_provider(name)
        if not p:
            return False
        return p.check_configuration() == GEOProviderStatus.CONNECTED

    def provider_status(self, name: str) -> str:
        p = self.get_provider(name)
        if not p:
            return GEOProviderStatus.DISABLED.value
        return p.check_configuration().value


# Global registry instance
geo_provider_registry = GEOProviderRegistry()
