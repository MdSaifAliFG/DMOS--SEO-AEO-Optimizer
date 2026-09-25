import asyncio
import json
import logging
import re
import time
from typing import Any, Dict, List, Optional, Type, TypeVar
import httpx
from pydantic import BaseModel, ValidationError

from app.core.config import settings
from app.services.ai.base_provider import BaseAIProvider
from app.services.ai.schemas import (
    AIAnalysisStatus,
    SEOContentSemanticAnalysis,
    SEOMetadataSuggestions,
    AEOAnswerSemanticAnalysis,
    AEODirectAnswerEvaluation,
    GEOAnswerSemanticAnalysis,
    CitationContextAnalysis,
    EntitySemanticExtraction,
)
from app.services.ai.prompts import (
    SEO_CONTENT_ANALYSIS_SYSTEM,
    SEO_CONTENT_ANALYSIS_PROMPT,
    SEO_METADATA_OPTIMIZATION_SYSTEM,
    SEO_METADATA_OPTIMIZATION_PROMPT,
    AEO_ANSWER_ANALYSIS_SYSTEM,
    AEO_ANSWER_ANALYSIS_PROMPT,
    AEO_DIRECT_ANSWER_EVALUATION_SYSTEM,
    AEO_DIRECT_ANSWER_EVALUATION_PROMPT,
    GEO_ANSWER_ANALYSIS_SYSTEM,
    GEO_ANSWER_ANALYSIS_PROMPT,
    CITATION_ANALYSIS_PROMPT,
    ENTITY_EXTRACTION_PROMPT,
)

logger = logging.getLogger("zobayrank.ai.gemini")

T = TypeVar("T", bound=BaseModel)


class GeminiProvider(BaseAIProvider):
    """
    Production-grade Google Gemini AI Provider.
    Implements structured JSON generation, automatic retries with exponential backoff,
    schema validation, sanitized logging, and non-crashing graceful fallbacks.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        timeout_seconds: Optional[int] = None,
        max_retries: Optional[int] = None,
    ):
        self._api_key = (api_key if api_key is not None else settings.GEMINI_API_KEY).strip()
        self._model_name = (model_name or settings.GEMINI_MODEL or "gemini-1.5-flash").strip()
        self._timeout = timeout_seconds or settings.GEMINI_TIMEOUT_SECONDS or 30
        self._max_retries = max_retries or settings.GEMINI_MAX_RETRIES or 2
        self.last_latency_ms: int = 0
        self.last_token_usage: Dict[str, Any] = {}
        self.error_count: int = 0
        self.last_successful_request_at: Optional[str] = None

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return self._model_name

    def is_configured(self) -> bool:
        """Checks if API key is present and meets minimum length criteria."""
        return bool(self._api_key and len(self._api_key) >= 10)

    @staticmethod
    def _sanitize_log_message(msg: str, secret: str) -> str:
        """Strips secret API key from log lines to prevent accidental credential leakage."""
        if secret and len(secret) > 4:
            return msg.replace(secret, "[REDACTED_API_KEY]")
        return msg

    @staticmethod
    def _extract_json_block(raw_text: str) -> str:
        """
        Robustly extracts JSON from raw LLM output, peeling away markdown code fences,
        leading explanatory text, or trailing notes.
        """
        text = raw_text.strip()

        # Check for ```json ... ``` or ``` ... ```
        fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
        if fence_match:
            text = fence_match.group(1).strip()

        # If still contains leading/trailing text outside brackets
        first_bracket = text.find("{")
        last_bracket = text.rfind("}")
        if first_bracket != -1 and last_bracket != -1 and last_bracket > first_bracket:
            text = text[first_bracket : last_bracket + 1]

        return text

    async def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        schema_class: Type[T],
        temperature: float = 0.2,
    ) -> Optional[T]:
        """
        Sends structured request to Google Generative Language REST API.
        Attempts response validation against schema_class.
        Retries on transient HTTP 429, 500, and 503 errors.
        """
        if not self.is_configured():
            logger.warning("[GeminiProvider] Gemini API key not configured on backend. Returning None.")
            return None

        endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{self._model_name}:generateContent"
            f"?key={self._api_key}"
        )

        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}],
                }
            ],
            "systemInstruction": {
                "parts": [{"text": system_instruction}],
            },
            "generationConfig": {
                "temperature": temperature,
                "responseMimeType": "application/json",
            },
        }

        attempt = 0
        backoff = 1.0

        while attempt <= self._max_retries:
            attempt += 1
            t0 = time.perf_counter()
            try:
                async with httpx.AsyncClient(timeout=float(self._timeout)) as client:
                    response = await client.post(endpoint, json=payload)
                    latency = int((time.perf_counter() - t0) * 1000)
                    self.last_latency_ms = latency

                    # Check for rate-limiting or server errors eligible for retry
                    if response.status_code in (429, 500, 503):
                        logger.warning(
                            f"[GeminiProvider] HTTP {response.status_code} received on attempt {attempt}/{self._max_retries + 1}. Retrying in {backoff}s..."
                        )
                        if attempt <= self._max_retries:
                            await asyncio.sleep(backoff)
                            backoff *= 2.0
                            continue
                        else:
                            self.error_count += 1
                            logger.error(f"[GeminiProvider] Exhausted retries with HTTP status {response.status_code}.")
                            return None

                    if response.status_code != 200:
                        self.error_count += 1
                        sanitized_err = self._sanitize_log_message(response.text[:300], self._api_key)
                        logger.error(
                            f"[GeminiProvider] Request failed with HTTP {response.status_code}: {sanitized_err}"
                        )
                        return None

                    data = response.json()
                    candidates = data.get("candidates", [])
                    if not candidates:
                        self.error_count += 1
                        logger.warning("[GeminiProvider] Empty candidates returned from Gemini API.")
                        return None

                    content_obj = candidates[0].get("content", {})
                    parts = content_obj.get("parts", [])
                    raw_text = "".join(p.get("text", "") for p in parts).strip()
                    if not raw_text:
                        self.error_count += 1
                        logger.warning("[GeminiProvider] Empty text parts returned from Gemini API.")
                        return None

                    self.last_token_usage = data.get("usageMetadata", {})
                    from datetime import datetime, timezone
                    self.last_successful_request_at = datetime.now(timezone.utc).isoformat()

                    # Extract JSON and validate against schema
                    cleaned_json = self._extract_json_block(raw_text)
                    parsed_dict = json.loads(cleaned_json)
                    validated_obj = schema_class.model_validate(parsed_dict)
                    return validated_obj

            except json.JSONDecodeError as jde:
                self.error_count += 1
                logger.warning(f"[GeminiProvider] JSON decoding failed on LLM response: {jde}")
                return None
            except ValidationError as ve:
                self.error_count += 1
                logger.warning(f"[GeminiProvider] Pydantic schema validation failed: {ve}")
                return None
            except httpx.TimeoutException:
                logger.warning(
                    f"[GeminiProvider] Timeout ({self._timeout}s) on attempt {attempt}/{self._max_retries + 1}"
                )
                if attempt <= self._max_retries:
                    await asyncio.sleep(backoff)
                    backoff *= 1.5
                    continue
                self.error_count += 1
                return None
            except Exception as e:
                self.error_count += 1
                sanitized_msg = self._sanitize_log_message(str(e), self._api_key)
                logger.error(f"[GeminiProvider] Unexpected error during AI query: {sanitized_msg}")
                return None

        return None

    # --- SEO Implementations ---

    async def analyze_seo_content(
        self,
        page_url: str,
        page_title: str,
        headings: Dict[str, List[str]],
        body_text_sample: str,
        target_keyword: Optional[str] = None,
    ) -> Optional[SEOContentSemanticAnalysis]:
        h1s = ", ".join(headings.get("h1", [])) or "None"
        h2s = ", ".join(headings.get("h2", [])[:5]) or "None"
        headings_summary = f"H1: {h1s}\nH2 (Top 5): {h2s}"

        # Limit sample to 4000 characters to keep execution fast and prevent context bloat
        truncated_body = (body_text_sample or "")[:4000]

        prompt = SEO_CONTENT_ANALYSIS_PROMPT.format(
            page_url=page_url,
            page_title=page_title or "(Untitled)",
            target_keyword=target_keyword or "General Product / Service",
            headings_summary=headings_summary,
            body_text_sample=truncated_body,
        )

        return await self.generate_structured(
            prompt=prompt,
            system_instruction=SEO_CONTENT_ANALYSIS_SYSTEM,
            schema_class=SEOContentSemanticAnalysis,
            temperature=0.2,
        )

    async def optimize_seo_metadata(
        self,
        current_title: Optional[str],
        current_description: Optional[str],
        page_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> Optional[SEOMetadataSuggestions]:
        prompt = SEO_METADATA_OPTIMIZATION_PROMPT.format(
            page_url=page_url,
            current_title=current_title or "(None)",
            current_description=current_description or "(None)",
            target_keyword=target_keyword or "Industry Solutions",
            brand_name=brand_name or "Zobay Rank",
            snippet=(snippet or "")[:1500],
        )

        return await self.generate_structured(
            prompt=prompt,
            system_instruction=SEO_METADATA_OPTIMIZATION_SYSTEM,
            schema_class=SEOMetadataSuggestions,
            temperature=0.3,
        )

    # --- AEO Implementations ---

    async def evaluate_aeo_answer(
        self,
        question: str,
        answer_text: str,
        brand_name: str,
        domain: str,
        competitors: Optional[List[str]] = None,
    ) -> Optional[AEOAnswerSemanticAnalysis]:
        comp_str = ", ".join(competitors) if competitors else "None specified"
        prompt = AEO_ANSWER_ANALYSIS_PROMPT.format(
            brand_name=brand_name,
            domain=domain,
            question=question,
            competitors=comp_str,
            answer_text=(answer_text or "")[:4000],
        )

        return await self.generate_structured(
            prompt=prompt,
            system_instruction=AEO_ANSWER_ANALYSIS_SYSTEM,
            schema_class=AEOAnswerSemanticAnalysis,
            temperature=0.1,
        )

    async def evaluate_direct_answer(
        self,
        question: str,
        answer_text: str,
    ) -> Optional[AEODirectAnswerEvaluation]:
        prompt = AEO_DIRECT_ANSWER_EVALUATION_PROMPT.format(
            question=question,
            answer_text=(answer_text or "")[:3000],
        )

        return await self.generate_structured(
            prompt=prompt,
            system_instruction=AEO_DIRECT_ANSWER_EVALUATION_SYSTEM,
            schema_class=AEODirectAnswerEvaluation,
            temperature=0.1,
        )

    # --- GEO Implementations ---

    async def evaluate_geo_answer(
        self,
        question: str,
        answer_text: str,
        brand_name: str,
        domain: str,
        competitors: Optional[List[str]] = None,
    ) -> Optional[GEOAnswerSemanticAnalysis]:
        comp_str = ", ".join(competitors) if competitors else "None specified"
        prompt = GEO_ANSWER_ANALYSIS_PROMPT.format(
            brand_name=brand_name,
            domain=domain,
            question=question,
            competitors=comp_str,
            answer_text=(answer_text or "")[:4000],
        )

        return await self.generate_structured(
            prompt=prompt,
            system_instruction=GEO_ANSWER_ANALYSIS_SYSTEM,
            schema_class=GEOAnswerSemanticAnalysis,
            temperature=0.1,
        )

    # --- Entities and Citations ---

    async def extract_semantic_entities(
        self,
        text: str,
        brand_name: str,
        domain: str,
        industry: Optional[str] = None,
    ) -> Optional[EntitySemanticExtraction]:
        prompt = ENTITY_EXTRACTION_PROMPT.format(
            brand_name=brand_name,
            domain=domain,
            industry=industry or "Technology",
            text=(text or "")[:3500],
        )

        return await self.generate_structured(
            prompt=prompt,
            system_instruction=f"You are a specialized knowledge graph and entity relationship extractor for {brand_name}.",
            schema_class=EntitySemanticExtraction,
            temperature=0.1,
        )

    async def analyze_citation_context(
        self,
        citation_url: str,
        answer_text: str,
        brand_name: str,
        domain: str,
    ) -> Optional[CitationContextAnalysis]:
        prompt = CITATION_ANALYSIS_PROMPT.format(
            citation_url=citation_url,
            brand_name=brand_name,
            domain=domain,
            answer_text=(answer_text or "")[:2500],
        )

        return await self.generate_structured(
            prompt=prompt,
            system_instruction="You evaluate citation credibility and contextual relevance.",
            schema_class=CitationContextAnalysis,
            temperature=0.1,
        )
