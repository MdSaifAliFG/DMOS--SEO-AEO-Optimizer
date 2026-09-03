from __future__ import annotations
from typing import Literal

PriorityLevel = Literal["critical", "high", "medium", "low"]


class AEOPriorityCalculator:
    """
    Calculates deterministic priority scores and levels for AEO recommendations.
    Uses transparent weights bounded between 0 and 100:
      - 90 - 100: Critical
      - 70 - 89:  High
      - 40 - 69:  Medium
      - 0  - 39:  Low
    """

    SEVERITY_WEIGHTS = {
        "critical": 40,
        "high": 30,
        "medium": 20,
        "low": 10,
    }

    @classmethod
    def calculate_priority(
        cls,
        severity: str = "medium",
        affected_prompt_count: int = 0,
        competitor_gap_score: float = 0.0,
        citation_gap_score: float = 0.0,
        visibility_impact: int = 5,
    ) -> tuple[int, PriorityLevel]:
        """
        Calculate an integer priority score (0-100) and corresponding priority level.
        """
        base_severity = cls.SEVERITY_WEIGHTS.get(severity.lower(), 20)

        # Prompt weight (up to 25 pts)
        prompt_pts = min(25, affected_prompt_count * 5)

        # Competitor gap weight (up to 15 pts)
        comp_pts = min(15, int(competitor_gap_score * 0.15))

        # Citation gap weight (up to 10 pts)
        cit_pts = min(10, int(citation_gap_score * 0.10))

        # Visibility impact weight (up to 10 pts)
        impact_pts = min(10, max(0, visibility_impact))

        raw_score = base_severity + prompt_pts + comp_pts + cit_pts + impact_pts
        score = max(0, min(100, raw_score))

        if score >= 90:
            level: PriorityLevel = "critical"
        elif score >= 70:
            level = "high"
        elif score >= 40:
            level = "medium"
        else:
            level = "low"

        return score, level
