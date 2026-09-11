from __future__ import annotations
from typing import Any, Dict


class GEOPriorityCalculator:
    """Calculates deterministic priority score (0-100) and priority level for GEO issues & recommendations."""

    SEVERITY_WEIGHTS = {
        "critical": 40,
        "high": 30,
        "medium": 20,
        "low": 10,
        "info": 5,
    }

    def calculate_priority(
        self,
        severity: str,
        affected_question_count: int = 0,
        affected_url_count: int = 0,
        visibility_loss: float = 0.0,
        competitor_gap: float = 0.0,
        business_value: str = "high",  # "high", "medium", "low"
        implementation_difficulty: str = "medium",  # "easy", "medium", "hard"
    ) -> Dict[str, Any]:
        # 1. Base Severity (10-40)
        sev_score = self.SEVERITY_WEIGHTS.get(severity.lower(), 20)

        # 2. Scope of Impact (0-20)
        scope_score = min(20, (affected_question_count * 2) + (affected_url_count * 2))

        # 3. Competitive / Visibility Gap (0-20)
        gap = max(0.0, competitor_gap) + max(0.0, visibility_loss)
        gap_score = min(20, int(gap * 0.4))

        # 4. Business Value (0-15)
        bv_map = {"high": 15, "medium": 10, "low": 5}
        bv_score = bv_map.get(business_value.lower(), 10)

        # 5. Ease of Implementation (0-10): Easier fixes get slightly higher priority bonus (quick wins)
        diff_map = {"easy": 10, "medium": 6, "hard": 2}
        diff_score = diff_map.get(implementation_difficulty.lower(), 6)

        total_score = min(100, max(0, sev_score + scope_score + gap_score + bv_score + diff_score))
        if severity.lower() == "critical" and total_score < 80:
            total_score = max(total_score, 85)
        elif severity.lower() == "high" and total_score < 65:
            total_score = max(total_score, 70)

        if total_score >= 80:
            level = "critical"
        elif total_score >= 60:
            level = "high"
        elif total_score >= 35:
            level = "medium"
        else:
            level = "low"

        return {
            "priority_score": total_score,
            "priority_level": level,
            "breakdown": {
                "severity_contribution": sev_score,
                "scope_contribution": scope_score,
                "gap_contribution": gap_score,
                "business_value_contribution": bv_score,
                "ease_contribution": diff_score,
            },
        }


class GEOImpactCalculator:
    """Calculates estimated impact, potential score gain, and visibility uplift (clearly labeled ESTIMATED)."""

    def calculate_estimated_impact(
        self,
        current_geo_score: int,
        category: str,
        priority_level: str,
        affected_queries_count: int = 1,
    ) -> Dict[str, Any]:
        """
        Estimates potential point improvement if recommendation is implemented.
        """
        # Base impact by category & priority
        base_gains = {
            "critical": 8,
            "high": 5,
            "medium": 3,
            "low": 1,
        }
        category_multipliers = {
            "AI Visibility": 1.4,
            "Recommendations": 1.3,
            "Citations": 1.2,
            "Entity": 1.2,
            "Technical": 1.1,
            "Content": 1.1,
            "Commercial": 1.0,
            "Consistency": 0.8,
            "Authority": 0.9,
            "Competitors": 1.2,
            "Freshness": 0.7,
        }

        base = base_gains.get(priority_level.lower(), 3)
        mult = category_multipliers.get(category, 1.0)

        est_gain = int(round(base * mult))
        est_gain = max(1, min(15, est_gain))

        potential_score = min(100, current_geo_score + est_gain)
        expected_visibility_gain = round(est_gain * 1.2, 1)

        return {
            "estimated_impact": est_gain,
            "potential_score": potential_score,
            "expected_visibility_gain": expected_visibility_gain,
            "disclaimer": "ESTIMATED: Calculations reflect modeled projection based on algorithm weighting. Actual generative search engine indexation may vary.",
        }
