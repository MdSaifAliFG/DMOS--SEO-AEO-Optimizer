from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.services.ai.base_provider import BaseAIProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.schemas import (
    AIAnalysisStatus,
    AIProviderStatusResponse,
    SEOContentSemanticAnalysis,
    SEOMetadataSuggestions,
    AEOAnswerSemanticAnalysis,
    AEODirectAnswerEvaluation,
    GEOAnswerSemanticAnalysis,
    CitationContextAnalysis,
    EntitySemanticExtraction,
)
from app.services.ai.validators import AIGroundTruthValidator
from app.services.ai.cache import AICacheService
from app.services.credit_service import CreditWalletService

logger = logging.getLogger("zobayrank.ai.intelligence")


class AIIntelligenceService:
    """
    Centralized Intelligence Coordinator for Zobay Rank.
    Connects SEO, AEO, and GEO workflows with Gemini reasoning, ground-truth validation,
    SHA-256 caching, and credit accounting.
    """

    _provider_instance: Optional[BaseAIProvider] = None

    @classmethod
    def get_provider(cls) -> BaseAIProvider:
        """Returns the configured AI Provider singleton (defaults to GeminiProvider)."""
        if cls._provider_instance is None:
            provider_type = (settings.AI_PROVIDER or "gemini").lower()
            if provider_type == "gemini":
                cls._provider_instance = GeminiProvider(
                    api_key=settings.GEMINI_API_KEY,
                    model_name=settings.GEMINI_MODEL,
                    timeout_seconds=settings.GEMINI_TIMEOUT_SECONDS,
                    max_retries=settings.GEMINI_MAX_RETRIES,
                )
            else:
                # Default to GeminiProvider
                cls._provider_instance = GeminiProvider()
        return cls._provider_instance

    @classmethod
    def get_provider_status(cls) -> AIProviderStatusResponse:
        """Generates real-time provider diagnostics for admin settings without leaking API keys."""
        provider = cls.get_provider()
        is_conf = provider.is_configured()

        status_str = "CONNECTED" if is_conf else "NOT_CONFIGURED"
        return AIProviderStatusResponse(
            provider=provider.provider_name,
            model=provider.model_name,
            status=status_str,
            is_available=is_conf,
            last_checked_at=datetime.now(timezone.utc).isoformat(),
            error_message=None if is_conf else "GEMINI_API_KEY is not configured in backend environment.",
        )

    # --- SEO Intelligence Operations ---

    @classmethod
    async def analyze_seo_page_content(
        cls,
        page_url: str,
        page_title: str,
        headings: Dict[str, List[str]],
        body_text_sample: str,
        project_id: str,
        target_keyword: Optional[str] = None,
        db: Optional[AsyncSession] = None,
        workspace_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Optional[SEOContentSemanticAnalysis]:
        """
        Executes semantic search-intent, completeness, and topic coverage analysis.
        Uses SHA-256 caching and credit accounting.
        """
        provider = cls.get_provider()
        if not provider.is_configured():
            logger.info("[AIIntelligenceService] Gemini not configured, skipping semantic content analysis.")
            return None

        # 1. Check Cache
        cache_key = AICacheService.compute_cache_key(
            project_id=project_id,
            content=f"{page_url}:{page_title}:{body_text_sample[:1000]}",
            analysis_type="seo_content_semantic",
            model_name=provider.model_name,
        )
        cached_data = AICacheService.get(cache_key)
        if cached_data:
            try:
                return SEOContentSemanticAnalysis.model_validate(cached_data)
            except Exception:
                pass

        # 2. Credit Reservation
        reservation = None
        cost = getattr(settings, "CREDIT_COST_AI_OPTIMIZATION", 2)
        if db and workspace_id:
            reservation = await CreditWalletService.reserve_credits(
                db=db,
                workspace_id=workspace_id,
                estimated_credits=cost,
                operation="seo_semantic_analysis",
                module="SEO",
                provider=provider.provider_name,
                provider_model=provider.model_name,
                user_id=user_id,
            )
            if not reservation.get("success"):
                logger.warning(f"[AIIntelligenceService] Insufficient credits for workspace {workspace_id}")
                return None

        # 3. Execution
        try:
            result = await provider.analyze_seo_content(
                page_url=page_url,
                page_title=page_title,
                headings=headings,
                body_text_sample=body_text_sample,
                target_keyword=target_keyword,
            )

            if result:
                # Cache successful result
                AICacheService.set(cache_key, result.model_dump())
                if db and reservation:
                    await CreditWalletService.commit_credits(db, reservation, actual_credits=cost)
                return result
            else:
                if db and reservation:
                    await CreditWalletService.release_credits(db, reservation, reason="ai_returned_empty")
                return None

        except Exception as e:
            logger.error(f"[AIIntelligenceService] SEO semantic analysis failed: {e}")
            if db and reservation:
                await CreditWalletService.release_credits(db, reservation, reason=str(e))
            return None

    # --- AEO Intelligence Operations ---

    @classmethod
    async def analyze_and_validate_aeo_answer(
        cls,
        question: str,
        answer_text: str,
        brand_name: str,
        domain: str,
        competitors: Optional[List[str]] = None,
        aliases: Optional[List[str]] = None,
    ) -> Optional[AEOAnswerSemanticAnalysis]:
        """
        Extracts semantic brand recommendation and positioning from AEO answer.
        Applies ground-truth cross-validation to reconcile LLM findings with answer text.
        """
        provider = cls.get_provider()
        if not provider.is_configured():
            return None

        raw_analysis = await provider.evaluate_aeo_answer(
            question=question,
            answer_text=answer_text,
            brand_name=brand_name,
            domain=domain,
            competitors=competitors,
        )

        if not raw_analysis:
            return None

        # Cross-validate against literal text
        validated = AIGroundTruthValidator.validate_aeo_analysis(
            analysis=raw_analysis,
            answer_text=answer_text,
            brand_name=brand_name,
            domain=domain,
            known_aliases=aliases,
        )
        return validated

    @classmethod
    async def evaluate_aeo_direct_answer(
        cls,
        question: str,
        answer_text: str,
    ) -> Optional[AEODirectAnswerEvaluation]:
        """Evaluates direct-answer quality and conciseness."""
        provider = cls.get_provider()
        if not provider.is_configured():
            return None
        return await provider.evaluate_direct_answer(question=question, answer_text=answer_text)

    # --- GEO Intelligence Operations ---

    @classmethod
    async def analyze_and_validate_geo_answer(
        cls,
        question: str,
        answer_text: str,
        brand_name: str,
        domain: str,
        competitors: Optional[List[str]] = None,
        aliases: Optional[List[str]] = None,
    ) -> Optional[GEOAnswerSemanticAnalysis]:
        """
        Classifies GEO recommendation strength (NOT_MENTIONED to STRONGLY_RECOMMENDED)
        and evaluates competitor relationships. Validated against ground truth.
        """
        provider = cls.get_provider()
        if not provider.is_configured():
            return None

        raw_analysis = await provider.evaluate_geo_answer(
            question=question,
            answer_text=answer_text,
            brand_name=brand_name,
            domain=domain,
            competitors=competitors,
        )

        if not raw_analysis:
            return None

        validated = AIGroundTruthValidator.validate_geo_analysis(
            analysis=raw_analysis,
            answer_text=answer_text,
            brand_name=brand_name,
            domain=domain,
            known_aliases=aliases,
        )
        return validated
