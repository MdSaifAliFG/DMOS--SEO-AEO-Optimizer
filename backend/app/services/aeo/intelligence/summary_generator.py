from __future__ import annotations
from typing import Any, Dict, List, Optional


class AEOIntelligenceProvider:
    """Abstract interface for generating executive summaries from structured AEO telemetry."""

    def generate_summary(self, telemetry: Dict[str, Any]) -> str:
        raise NotImplementedError


class RuleBasedAEOIntelligenceProvider(AEOIntelligenceProvider):
    """
    Deterministic summary generator grounded strictly in stored database facts.
    Never hallucinates or invents non-existent historical numbers.
    """

    def generate_summary(self, telemetry: Dict[str, Any]) -> str:
        brand_name = telemetry.get("brand_name", "Your brand")
        overall_score = telemetry.get("overall_score")
        score_change = telemetry.get("score_change", 0)
        mention_rate = telemetry.get("mention_rate", 0.0)
        citation_rate = telemetry.get("citation_rate", 0.0)
        sov = telemetry.get("brand_share_of_voice", 0.0)
        has_enough_data = telemetry.get("has_enough_data", False)
        top_competitor = telemetry.get("top_competitor")
        top_competitor_sov = telemetry.get("top_competitor_sov", 0.0)

        if overall_score is None:
            return f"No AEO analysis data is recorded for {brand_name} yet. Run an analysis to establish your AI visibility baseline."

        if not has_enough_data:
            return (
                f"{brand_name} holds an initial AEO Visibility Score of {overall_score}/100 with a {mention_rate}% brand mention rate "
                f"and {citation_rate}% own-domain citation rate across tested answer engines. "
                f"Run periodic monitoring analyses to begin tracking trend deltas and competitor movements."
            )

        # Build deterministic multi-sentence summary
        if score_change > 0:
            trend_part = f"{brand_name}'s AEO visibility improved by +{score_change} points over the monitored period, reaching {overall_score}/100."
        elif score_change < 0:
            trend_part = f"{brand_name}'s AEO visibility declined by {abs(score_change)} points over the monitored period, currently at {overall_score}/100."
        else:
            trend_part = f"{brand_name}'s AEO visibility remained stable at {overall_score}/100."

        metrics_part = f"Brand mentions stand at {mention_rate}%, and own-domain citations are at {citation_rate}%."

        sov_part = f"Your brand captures {sov}% of AI Answer Share of Voice."
        if top_competitor and top_competitor_sov > 0:
            sov_part += f" Competitor '{top_competitor}' holds {top_competitor_sov}% Share of Voice."

        return f"{trend_part} {metrics_part} {sov_part}"
