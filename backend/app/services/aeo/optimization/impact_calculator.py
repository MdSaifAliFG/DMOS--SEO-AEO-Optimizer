from __future__ import annotations
from typing import Optional


class AEOImpactCalculator:
    """
    Calculates deterministic recoverable score potential for AEO recommendations.
    Always bounds potential score at <= 100 and clearly distinguishes estimated potential.
    """

    @staticmethod
    def calculate_potential(
        current_score: Optional[int],
        estimated_impact: int,
    ) -> tuple[int, int]:
        """
        Returns (estimated_impact, potential_score).
        Potential score is strictly bounded to [0, 100].
        """
        curr = max(0, min(100, current_score or 0))
        impact = max(1, min(30, estimated_impact))
        potential = min(100, curr + impact)
        return impact, potential

    @staticmethod
    def calculate_batch_potential(
        current_score: Optional[int],
        impacts: list[int],
    ) -> tuple[int, int]:
        """
        Calculates aggregate recoverable potential from multiple open recommendations with diminishing returns.
        """
        curr = max(0, min(100, current_score or 0))
        if not impacts:
            return 0, curr

        sorted_impacts = sorted(impacts, reverse=True)
        total_gain = 0.0
        decay = 1.0

        for imp in sorted_impacts:
            total_gain += imp * decay
            decay = max(0.15, decay * 0.75)

        bounded_gain = int(round(total_gain))
        potential = min(100, curr + bounded_gain)
        return bounded_gain, potential
