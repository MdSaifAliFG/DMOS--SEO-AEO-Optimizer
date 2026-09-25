from abc import ABC, abstractmethod
import os
import re
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from app.schemas.recommendation import (
    ContentOptimizationResponse,
    ContentRecommendationItem,
    DescriptionSuggestion,
    InternalLinkOpportunity,
    InternalLinksOptimizationResponse,
    TitleSuggestion,
)


class SEOAIProvider(ABC):
    """Abstract interface for AI and Rule-Based SEO optimization generation."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    async def generate_titles(
        self,
        current_title: Optional[str],
        target_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> List[TitleSuggestion]:
        pass

    @abstractmethod
    async def generate_descriptions(
        self,
        current_description: Optional[str],
        target_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> List[DescriptionSuggestion]:
        pass


class RuleBasedSEOAIProvider(SEOAIProvider):
    """
    Deterministic rule-based generator.
    Guarantees instant, zero-dependency generation without requiring external API keys.
    """

    @property
    def provider_name(self) -> str:
        return "rule_based"

    def _extract_path_keywords(self, target_url: str) -> str:
        try:
            parsed = urlparse(target_url)
            path_parts = [p for p in parsed.path.strip("/").split("/") if p and not p.isdigit()]
            if path_parts:
                last_part = path_parts[-1].replace("-", " ").replace("_", " ")
                return last_part.title()
        except Exception:
            pass
        return "Optimization Platform"

    def _extract_brand(self, target_url: str, brand_name: Optional[str]) -> str:
        if brand_name and brand_name.strip():
            return brand_name.strip()
        try:
            parsed = urlparse(target_url)
            domain = parsed.netloc or parsed.path
            domain_clean = domain.split(":")[0].replace("www.", "")
            name = domain_clean.split(".")[0]
            return name.capitalize() if name else "SeoSensing"
        except Exception:
            return "SeoSensing"

    async def generate_titles(
        self,
        current_title: Optional[str],
        target_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> List[TitleSuggestion]:
        brand = self._extract_brand(target_url, brand_name)
        topic = target_keyword.strip().title() if target_keyword and target_keyword.strip() else self._extract_path_keywords(target_url)

        # Option 1: Commercial / Benefit Focused
        opt1 = f"Best {topic} Solutions & Services | {brand}"
        if len(opt1) > 60:
            opt1 = f"{topic} Platform | {brand}"

        # Option 2: Authority / Platform Focused
        opt2 = f"{topic} Operating System & Tools — {brand}"
        if len(opt2) > 60:
            opt2 = f"{topic} Overview | {brand}"

        # Option 3: Action / Comprehensive Guide
        opt3 = f"Complete {topic} Guide & Software | {brand}"
        if len(opt3) > 60:
            opt3 = f"{topic} Software | {brand}"

        suggestions = []
        for title_text in [opt1, opt2, opt3]:
            c_len = len(title_text)
            status = "optimal" if 45 <= c_len <= 60 else "too_short" if c_len < 45 else "too_long"
            suggestions.append(
                TitleSuggestion(
                    title=title_text,
                    character_count=c_len,
                    length_status=status,
                    keyword_presence=True,
                    brand_presence=True,
                )
            )

        return suggestions

    async def generate_descriptions(
        self,
        current_description: Optional[str],
        target_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> List[DescriptionSuggestion]:
        brand = self._extract_brand(target_url, brand_name)
        topic = target_keyword.strip().lower() if target_keyword and target_keyword.strip() else self._extract_path_keywords(target_url).lower()

        # Option 1: Direct Value & Feature Focus
        desc1 = (
            f"Discover {brand}'s enterprise {topic} platform. "
            f"Automate technical audits, resolve issues, and maximize search visibility today."
        )
        if len(desc1) > 160:
            desc1 = f"Discover {brand}'s {topic} platform. Automate audits and maximize search visibility today."

        # Option 2: Action & CTA Focus
        desc2 = (
            f"Looking for leading {topic} tools? "
            f"Explore {brand} for automated diagnostics, real-time tracking, and verified results. Get started free."
        )
        if len(desc2) > 160:
            desc2 = f"Explore {brand} for automated {topic} diagnostics, tracking, and verified results."

        # Option 3: Comprehensive Overview
        desc3 = (
            f"Optimize your {topic} performance with {brand}. "
            f"Gain actionable recommendations, fix on-page issues, and outrank competitors with ease."
        )
        if len(desc3) > 160:
            desc3 = f"Optimize {topic} performance with {brand}. Gain actionable recommendations and fix issues easily."

        suggestions = []
        for desc_text in [desc1, desc2, desc3]:
            c_len = len(desc_text)
            status = "optimal" if 120 <= c_len <= 160 else "too_short" if c_len < 120 else "too_long"
            suggestions.append(
                DescriptionSuggestion(
                    description=desc_text,
                    character_count=c_len,
                    length_status=status,
                    keyword_presence=True,
                    cta_presence=True,
                    readability_score="Good",
                )
            )

        return suggestions


class GeminiSEOAIProvider(SEOAIProvider):
    """
    Google Gemini SEO Metadata & Content Optimization Provider.
    Enriches title, description, and content suggestions using centralized Gemini intelligence.
    Gracefully falls back to RuleBasedSEOAIProvider if Gemini is unavailable or not configured.
    """

    def __init__(self):
        self._fallback = RuleBasedSEOAIProvider()
        self._last_active_provider = "rule_based"

    @property
    def provider_name(self) -> str:
        return self._last_active_provider

    async def generate_titles(
        self,
        current_title: Optional[str],
        target_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> List[TitleSuggestion]:
        from app.services.ai.intelligence_service import AIIntelligenceService

        provider = AIIntelligenceService.get_provider()
        if not provider.is_configured():
            self._last_active_provider = "rule_based"
            return await self._fallback.generate_titles(
                current_title=current_title,
                target_url=target_url,
                target_keyword=target_keyword,
                brand_name=brand_name,
                snippet=snippet,
            )

        try:
            res = await provider.optimize_seo_metadata(
                current_title=current_title,
                current_description=None,
                page_url=target_url,
                target_keyword=target_keyword,
                brand_name=brand_name,
                snippet=snippet,
            )
            if res and res.title_suggestions:
                suggestions = []
                for item in res.title_suggestions:
                    t_text = item.get("title", "").strip()
                    if not t_text:
                        continue
                    c_len = len(t_text)
                    status = "optimal" if 45 <= c_len <= 60 else "too_short" if c_len < 45 else "too_long"
                    suggestions.append(
                        TitleSuggestion(
                            title=t_text,
                            character_count=c_len,
                            length_status=status,
                            keyword_presence=bool(target_keyword and target_keyword.lower() in t_text.lower()),
                            brand_presence=bool(brand_name and brand_name.lower() in t_text.lower()),
                        )
                    )
                if suggestions:
                    self._last_active_provider = "gemini"
                    return suggestions
        except Exception:
            pass

        self._last_active_provider = "rule_based"
        return await self._fallback.generate_titles(
            current_title=current_title,
            target_url=target_url,
            target_keyword=target_keyword,
            brand_name=brand_name,
            snippet=snippet,
        )

    async def generate_descriptions(
        self,
        current_description: Optional[str],
        target_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> List[DescriptionSuggestion]:
        from app.services.ai.intelligence_service import AIIntelligenceService

        provider = AIIntelligenceService.get_provider()
        if not provider.is_configured():
            self._last_active_provider = "rule_based"
            return await self._fallback.generate_descriptions(
                current_description=current_description,
                target_url=target_url,
                target_keyword=target_keyword,
                brand_name=brand_name,
                snippet=snippet,
            )

        try:
            res = await provider.optimize_seo_metadata(
                current_title=None,
                current_description=current_description,
                page_url=target_url,
                target_keyword=target_keyword,
                brand_name=brand_name,
                snippet=snippet,
            )
            if res and res.description_suggestions:
                suggestions = []
                for item in res.description_suggestions:
                    d_text = item.get("description", "").strip()
                    if not d_text:
                        continue
                    c_len = len(d_text)
                    status = "optimal" if 120 <= c_len <= 160 else "too_short" if c_len < 120 else "too_long"
                    suggestions.append(
                        DescriptionSuggestion(
                            description=d_text,
                            character_count=c_len,
                            length_status=status,
                            keyword_presence=bool(target_keyword and target_keyword.lower() in d_text.lower()),
                            cta_presence=any(
                                kw in d_text.lower()
                                for kw in ["discover", "explore", "learn", "start", "try", "get", "boost"]
                            ),
                            readability_score="Good",
                        )
                    )
                if suggestions:
                    self._last_active_provider = "gemini"
                    return suggestions
        except Exception:
            pass

        self._last_active_provider = "rule_based"
        return await self._fallback.generate_descriptions(
            current_description=current_description,
            target_url=target_url,
            target_keyword=target_keyword,
            brand_name=brand_name,
            snippet=snippet,
        )


class SEOAIProviderFactory:
    """Factory selecting centralized Gemini or Rule-Based provider based on configuration."""

    @classmethod
    def get_provider(cls) -> SEOAIProvider:
        from app.core.config import settings

        ai_provider = (settings.AI_PROVIDER or os.getenv("AI_PROVIDER", "gemini")).lower()
        if ai_provider == "gemini":
            return GeminiSEOAIProvider()

        # Default fallback
        return RuleBasedSEOAIProvider()
