from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Type, TypeVar
from pydantic import BaseModel
from app.services.ai.schemas import (
    SEOContentSemanticAnalysis,
    SEOMetadataSuggestions,
    AEOAnswerSemanticAnalysis,
    AEODirectAnswerEvaluation,
    GEOAnswerSemanticAnalysis,
    CitationContextAnalysis,
    EntitySemanticExtraction,
)

T = TypeVar("T", bound=BaseModel)


class BaseAIProvider(ABC):
    """
    Abstract interface for centralized AI reasoning and semantic intelligence.
    Ensures that SEO, AEO, and GEO services never couple directly to any specific LLM provider.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Unique provider identifier (e.g. 'gemini', 'openai', 'rule_based')."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Configured model name (e.g. 'gemini-1.5-flash')."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if provider has valid credentials and is ready to execute queries."""
        pass

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        schema_class: Type[T],
        temperature: float = 0.2,
    ) -> Optional[T]:
        """Executes a structured query against the LLM and validates against a Pydantic schema."""
        pass

    @abstractmethod
    async def analyze_seo_content(
        self,
        page_url: str,
        page_title: str,
        headings: Dict[str, List[str]],
        body_text_sample: str,
        target_keyword: Optional[str] = None,
    ) -> Optional[SEOContentSemanticAnalysis]:
        """Performs semantic search-intent, completeness, and topical coverage analysis."""
        pass

    @abstractmethod
    async def optimize_seo_metadata(
        self,
        current_title: Optional[str],
        current_description: Optional[str],
        page_url: str,
        target_keyword: Optional[str] = None,
        brand_name: Optional[str] = None,
        snippet: Optional[str] = None,
    ) -> Optional[SEOMetadataSuggestions]:
        """Generates semantic title, description, and content suggestions."""
        pass

    @abstractmethod
    async def evaluate_aeo_answer(
        self,
        question: str,
        answer_text: str,
        brand_name: str,
        domain: str,
        competitors: Optional[List[str]] = None,
    ) -> Optional[AEOAnswerSemanticAnalysis]:
        """Evaluates brand representation, positioning, and context in an AEO answer."""
        pass

    @abstractmethod
    async def evaluate_direct_answer(
        self,
        question: str,
        answer_text: str,
    ) -> Optional[AEODirectAnswerEvaluation]:
        """Assesses direct-answer quality, conciseness, early answer presence, and actionable info."""
        pass

    @abstractmethod
    async def evaluate_geo_answer(
        self,
        question: str,
        answer_text: str,
        brand_name: str,
        domain: str,
        competitors: Optional[List[str]] = None,
    ) -> Optional[GEOAnswerSemanticAnalysis]:
        """Evaluates generative engine answer for brand recommendation strength and competitor context."""
        pass

    @abstractmethod
    async def extract_semantic_entities(
        self,
        text: str,
        brand_name: str,
        domain: str,
        industry: Optional[str] = None,
    ) -> Optional[EntitySemanticExtraction]:
        """Extracts recognized entities with types and contextual relationships."""
        pass

    @abstractmethod
    async def analyze_citation_context(
        self,
        citation_url: str,
        answer_text: str,
        brand_name: str,
        domain: str,
    ) -> Optional[CitationContextAnalysis]:
        """Analyzes citation credibility, relevance to the query, and claim support."""
        pass


# Conceptual alias for simplicity
AIProvider = BaseAIProvider
