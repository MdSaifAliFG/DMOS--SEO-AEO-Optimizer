from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Dict


class AEOAIProvider(ABC):
    """
    Abstract Base Class for AEO Content and Direct Answer Optimizers.
    Allows seamlessly connecting external LLMs (OpenAI, Gemini, Perplexity)
    or falling back honestly to deterministic rule-based generators.
    """

    @abstractmethod
    async def optimize_content(
        self,
        target_question: str,
        existing_content: str,
        target_keyword: str,
        brand_name: str,
        product_service: str,
    ) -> Dict[str, Any]:
        """Analyze existing content and generate structured content optimization guidance."""
        pass

    @abstractmethod
    async def optimize_direct_answer(
        self,
        target_question: str,
        existing_content: str,
        brand_name: str,
    ) -> Dict[str, Any]:
        """Evaluate content against the 9 core direct-answer criteria."""
        pass
