from typing import List, Optional


class ImpactCalculator:
    """
    Deterministic SEO Impact Calculation.
    
    Estimates the recoverable SEO points from resolving specific optimization issues.
    Ensures that total estimated improvements across a scan do not exceed the 100-point ceiling.
    """

    SEVERITY_IMPACT_BOUNDS = {
        "critical": (3.0, 8.0),
        "high": (1.5, 4.0),
        "medium": (0.5, 2.0),
        "low": (0.1, 0.5),
        "info": (0.0, 0.2),
    }

    @classmethod
    def calculate_issue_impact(
        cls,
        severity: str,
        base_impact: float,
        affected_pages_count: int,
    ) -> float:
        """Calculates deterministic impact points for an issue group."""
        sev_key = severity.lower()
        min_bound, max_bound = cls.SEVERITY_IMPACT_BOUNDS.get(sev_key, (0.5, 2.0))

        # Scale by affected page count (up to 1.5x for widespread issues)
        scale_factor = 1.0 + min(0.5, max(0.0, (affected_pages_count - 1) * 0.05))
        scaled_impact = base_impact * scale_factor

        bounded_impact = min(max_bound, max(min_bound, scaled_impact))
        return round(bounded_impact, 1)

    @classmethod
    def calculate_potential_score(
        cls,
        current_score: Optional[int],
        recommendation_impacts: List[float],
    ) -> tuple[int, int, float]:
        """
        Calculates (current_score, potential_score, total_recoverable_impact).
        Caps potential score at 100.
        """
        curr = current_score if current_score is not None else 70
        raw_sum = sum(recommendation_impacts)

        # Theoretical maximum recoverable points
        max_possible_gain = max(0, 100 - curr)
        recoverable = min(float(max_possible_gain), round(raw_sum, 1))

        potential = min(100, curr + int(round(recoverable)))
        return curr, potential, round(recoverable, 1)
