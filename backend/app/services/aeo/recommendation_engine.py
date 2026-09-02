from __future__ import annotations
from typing import Any, Dict, List
from app.services.aeo.visibility_scorer import AeoScoreBreakdown


class AEORecommendationEngine:
    """
    Deterministic Recommendation & Opportunity Engine for Answer Engine Optimization.
    Analyzes brand presence gaps, citation deficits, unanswered prompts, and competitor advantages.
    """

    @classmethod
    def generate_recommendations(
        cls,
        score_breakdown: AeoScoreBreakdown,
        brand_name: str,
        domain: str,
        unmentioned_questions: List[str],
        competitor_stats: List[Dict[str, Any]],
        total_citations: int,
        own_citations: int,
    ) -> List[Dict[str, Any]]:
        """
        Produces prioritized, actionable AEO optimization recommendations.
        """
        recommendations: List[Dict[str, Any]] = []

        # 1. Low Brand Mention Rate
        if score_breakdown.mention_score < 70:
            recommendations.append({
                "title": "Enhance Brand Entity Authority in AI Training Sources",
                "category": "Brand Presence",
                "priority": "critical" if score_breakdown.mention_score < 40 else "high",
                "opportunity_score": max(90 - score_breakdown.mention_score, 30),
                "reason": f"{brand_name} is only mentioned in {score_breakdown.mention_score}% of generative AI answers.",
                "current_state": f"Brand mention rate is {score_breakdown.mention_score}% across queried search prompts.",
                "recommended_action": f"Publish authoritative brand overviews, structured schema definitions (Organization/SoftwareApplication), and digital PR profiles defining {brand_name}.",
                "expected_impact": "+15-25% improvement in direct LLM brand attribution.",
                "status": "open",
            })

        # 2. Low Citation Rate
        citation_share = int(round((own_citations / max(total_citations, 1)) * 100)) if total_citations > 0 else 0
        if citation_share < 40 or total_citations < 5:
            recommendations.append({
                "title": "Build Direct AI Source Citations on Technical & Doc Pages",
                "category": "Citation Building",
                "priority": "high",
                "opportunity_score": 85,
                "reason": f"Only {own_citations} of {total_citations} citations link back to {domain}.",
                "current_state": f"{domain} receives a {citation_share}% share of AI answer citations.",
                "recommended_action": "Create comprehensive documentation, direct-answer FAQ sections, and technical guides formatted with clean semantic HTML for AI web scrapers.",
                "expected_impact": "+20-30% increase in direct referral clicks from AI Overviews and Perplexity.",
                "status": "open",
            })

        # 3. Uncovered Questions
        if unmentioned_questions:
            top_uncovered = unmentioned_questions[:3]
            uncovered_preview = ", ".join(f"'{q}'" for q in top_uncovered)
            recommendations.append({
                "title": "Create Content Targeting Unanswered AI Prompts",
                "category": "Question Coverage",
                "priority": "medium",
                "opportunity_score": 75,
                "reason": f"{len(unmentioned_questions)} tracked queries currently do not mention {brand_name}.",
                "current_state": f"Missing from answers for: {uncovered_preview}.",
                "recommended_action": "Publish targeted comparison guides and solution landing pages directly answering these search intents.",
                "expected_impact": "Broadens answer engine coverage across bottom-of-funnel queries.",
                "status": "open",
            })

        # 4. Competitor Outperforming
        for comp in competitor_stats[:2]:
            c_name = comp.get("name", "Competitor")
            c_rate = comp.get("mention_rate", 0)
            if c_rate > score_breakdown.mention_score:
                recommendations.append({
                    "title": f"Create Counter-Positioning & Comparison Against {c_name}",
                    "category": "Competitor Defense",
                    "priority": "high",
                    "opportunity_score": 80,
                    "reason": f"{c_name} appears in {c_rate}% of answers compared to {brand_name}'s {score_breakdown.mention_score}%.",
                    "current_state": f"{c_name} has higher AI answer prominence for industry comparison queries.",
                    "recommended_action": f"Publish an objective '{brand_name} vs {c_name}' feature breakdown highlighting your unique differentiators.",
                    "expected_impact": "Captures comparison query share when users ask AI for alternatives.",
                    "status": "open",
                })

        # 5. Position Optimization
        if score_breakdown.average_position and score_breakdown.average_position > 2.5:
            recommendations.append({
                "title": "Improve Ranking Position in Multi-Tool AI Lists",
                "category": "Ranking Position",
                "priority": "medium",
                "opportunity_score": 65,
                "reason": f"Average ranking position is currently #{score_breakdown.average_position} in list responses.",
                "current_state": f"Listed behind other alternatives with average rank #{score_breakdown.average_position}.",
                "recommended_action": "Increase industry review platform ratings (G2, Capterra, ProductHunt) which AI models heavily weigh for rankings.",
                "expected_impact": "Advances brand to top 2 positions in generative AI roundups.",
                "status": "open",
            })

        return recommendations
