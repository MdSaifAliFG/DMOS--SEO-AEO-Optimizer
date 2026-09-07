from __future__ import annotations
from typing import Any, Dict, Optional


class GEOScoringEngine:
    """
    Deterministic scoring engine for Generative Engine Optimization (GEO).

    Primary formula:
      GEO Score = (Visibility * 0.20) + (Recommendation * 0.15) + (Citation * 0.15)
                + (Entity * 0.15) + (Content * 0.10) + (Technical * 0.10)
                + (Authority * 0.10) + (Consistency * 0.05)
    """

    WEIGHTS = {
        "visibility": 0.20,
        "recommendation": 0.15,
        "citation": 0.15,
        "entity": 0.15,
        "content": 0.10,
        "technical": 0.10,
        "authority": 0.10,
        "consistency": 0.05,
    }

    def calculate_geo_score(
        self,
        visibility_score: Optional[int],
        recommendation_score: Optional[int],
        citation_score: Optional[int],
        entity_score: Optional[int],
        content_score: Optional[int],
        technical_score: Optional[int],
        authority_score: Optional[int],
        consistency_score: Optional[int],
        has_answers: bool = False,
    ) -> Dict[str, Any]:
        """
        Computes overall GEO score, coverage, confidence, and score label deterministically.
        """
        components = {
            "visibility": visibility_score,
            "recommendation": recommendation_score,
            "citation": citation_score,
            "entity": entity_score,
            "content": content_score,
            "technical": technical_score,
            "authority": authority_score,
            "consistency": consistency_score,
        }

        # Track available vs missing components
        available_weights = 0.0
        weighted_sum = 0.0
        data_availability: Dict[str, bool] = {}

        for key, val in components.items():
            if val is not None:
                data_availability[key] = True
                w = self.WEIGHTS[key]
                available_weights += w
                weighted_sum += val * w
            else:
                data_availability[key] = False

        coverage = int(round(available_weights * 100))

        if available_weights == 0.0:
            return {
                "geo_score": None,
                "score_label": "Awaiting Analysis",
                "confidence": "INSUFFICIENT_DATA",
                "data_coverage": 0,
                "data_availability": data_availability,
                "components": components,
            }

        # Normalize score over available data weights
        normalized_score = int(round(weighted_sum / available_weights))
        normalized_score = max(0, min(100, normalized_score))

        # Confidence assessment
        if coverage >= 85 and has_answers:
            confidence = "HIGH"
        elif coverage >= 50:
            confidence = "MEDIUM"
        elif coverage >= 25:
            confidence = "LOW"
        else:
            confidence = "INSUFFICIENT_DATA"

        score_label = self.get_score_label(normalized_score)

        return {
            "geo_score": normalized_score,
            "score_label": score_label,
            "confidence": confidence,
            "data_coverage": coverage,
            "data_availability": data_availability,
            "components": components,
        }

    @staticmethod
    def get_score_label(score: int) -> str:
        if score >= 90:
            return "Excellent"
        if score >= 75:
            return "Good"
        if score >= 50:
            return "Needs Improvement"
        if score >= 25:
            return "Poor"
        return "Critical"

    @staticmethod
    def calculate_unified_search_intelligence(
        seo_score: Optional[int],
        aeo_score: Optional[int],
        geo_score: Optional[int],
    ) -> Dict[str, Any]:
        """
        Unified Search Visibility Index = 40% SEO + 30% AEO + 30% GEO.
        """
        weights = {"seo": 0.40, "aeo": 0.30, "geo": 0.30}
        total_w = 0.0
        sum_val = 0.0

        if seo_score is not None:
            sum_val += seo_score * weights["seo"]
            total_w += weights["seo"]
        if aeo_score is not None:
            sum_val += aeo_score * weights["aeo"]
            total_w += weights["aeo"]
        if geo_score is not None:
            sum_val += geo_score * weights["geo"]
            total_w += weights["geo"]

        if total_w < 0.6:  # At least 2 of 3 pillars required
            return {
                "unified_score": None,
                "has_sufficient_data": False,
                "seo_score": seo_score,
                "aeo_score": aeo_score,
                "geo_score": geo_score,
                "executive_brief": "Insufficient data across search pillars to compute unified search score.",
            }

        unified = int(round(sum_val / total_w))
        label = GEOScoringEngine.get_score_label(unified)

        brief = (
            f"Overall search intelligence index is {unified}/100 ({label}). "
            f"Technical SEO ({seo_score or 'N/A'}), AI Answer Visibility ({aeo_score or 'N/A'}), "
            f"and Generative Recommendation Readiness ({geo_score or 'N/A'})."
        )

        return {
            "unified_score": unified,
            "has_sufficient_data": True,
            "seo_score": seo_score,
            "aeo_score": aeo_score,
            "geo_score": geo_score,
            "score_label": label,
            "executive_brief": brief,
        }
