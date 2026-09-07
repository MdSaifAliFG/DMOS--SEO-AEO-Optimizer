from __future__ import annotations
import re
from typing import Any, Dict, List, Optional


class GEORecommendationEngine:
    """Classifies AI recommendation strength and recommendation order for a brand."""

    def evaluate_recommendation(
        self,
        answer_text: str,
        brand_name: str,
        brand_mentioned: bool,
        brand_position: Optional[int] = None,
        competitors: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        if not brand_mentioned or not answer_text or not brand_name:
            return {
                "recommended": False,
                "recommendation_strength": "Not Recommended",
                "recommendation_position": None,
                "confidence": 1.0,
                "evidence": "Brand was not mentioned in the AI response.",
            }

        text_lower = answer_text.lower()
        brand_lower = brand_name.strip().lower()

        # Context around the brand mention
        pos = brand_position or text_lower.find(brand_lower)
        start = max(0, pos - 120)
        end = min(len(answer_text), pos + len(brand_lower) + 120)
        snippet = text_lower[start:end]

        strong_patterns = [
            r"strongly recommend",
            r"#1\s*(choice|option|tool|platform)",
            r"top recommendation",
            r"best overall",
            r"premier (solution|platform|tool)",
            r"standout (solution|choice)",
            r"highly recommended",
        ]

        moderate_patterns = [
            r"is an? (excellent|great|solid|top|reliable) (choice|option|solution)",
            r"consider (using|choosing)?",
            r"recommended for",
            r"a leading (tool|platform|provider)",
            r"worth exploring",
            r"good fit for",
        ]

        weak_patterns = [
            r"other (options|tools|players) include",
            r"also worth noting",
            r"alternatively",
            r"may also be considered",
            r"niche player",
        ]

        negative_patterns = [
            r"not recommended",
            r"drawbacks include",
            r"less capable",
            r"weaker alternative",
            r"falls short",
        ]

        # Check negative first
        for pat in negative_patterns:
            if re.search(pat, snippet):
                return {
                    "recommended": False,
                    "recommendation_strength": "Not Recommended",
                    "recommendation_position": None,
                    "confidence": 0.9,
                    "evidence": f"Negative recommendation signal detected: '{pat}'",
                }

        # Check Strong Recommendation
        for pat in strong_patterns:
            if re.search(pat, snippet):
                rank = self._calculate_recommendation_rank(answer_text, brand_name, competitors)
                return {
                    "recommended": True,
                    "recommendation_strength": "Strong Recommendation",
                    "recommendation_position": rank,
                    "confidence": 0.95,
                    "evidence": f"Strong recommendation pattern: '{pat}'",
                }

        # Check Recommendation
        for pat in moderate_patterns:
            if re.search(pat, snippet):
                rank = self._calculate_recommendation_rank(answer_text, brand_name, competitors)
                return {
                    "recommended": True,
                    "recommendation_strength": "Recommendation",
                    "recommendation_position": rank,
                    "confidence": 0.90,
                    "evidence": f"Direct recommendation signal: '{pat}'",
                }

        # Check Weak Mention
        for pat in weak_patterns:
            if re.search(pat, snippet):
                return {
                    "recommended": False,
                    "recommendation_strength": "Weak Mention",
                    "recommendation_position": None,
                    "confidence": 0.85,
                    "evidence": "Brand appears as a secondary or weak mention.",
                }

        # If brand is in a numbered/bulleted list at position #1 or #2
        lines = [line.strip() for line in answer_text.split("\n") if line.strip()]
        for idx, line in enumerate(lines[:5]):
            if brand_lower in line.lower() and re.match(r"^(\d+[\.\)]|\*|-)\s+", line):
                return {
                    "recommended": True,
                    "recommendation_strength": "Recommendation",
                    "recommendation_position": idx + 1,
                    "confidence": 0.85,
                    "evidence": f"Brand listed in prominent recommendation position #{idx + 1}.",
                }

        return {
            "recommended": False,
            "recommendation_strength": "Neutral Mention",
            "recommendation_position": None,
            "confidence": 0.80,
            "evidence": "Brand is mentioned neutrally without explicit endorsement.",
        }

    def _calculate_recommendation_rank(
        self,
        text: str,
        brand: str,
        competitors: Optional[List[str]] = None,
    ) -> int:
        text_lower = text.lower()
        entities = [brand] + (competitors or [])
        found_positions = []
        for e in entities:
            pos = text_lower.find(e.lower())
            if pos != -1:
                found_positions.append((pos, e))

        found_positions.sort(key=lambda x: x[0])
        for rank, (pos, name) in enumerate(found_positions, start=1):
            if name.lower() == brand.lower():
                return rank
        return 1
