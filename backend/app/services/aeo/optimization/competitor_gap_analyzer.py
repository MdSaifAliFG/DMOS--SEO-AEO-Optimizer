from __future__ import annotations
from typing import Any, Dict, List
from app.models.aeo import AeoProject, AeoQuestion


class CompetitorGapAnalyzer:
    """
    Analyzes multi-competitor performance in AI answer engines:
    - Competitor mention frequency & Share of Voice
    - Prompts where competitors appear but brand is absent
    - Competitor rank position comparisons
    - Actionable counter-positioning opportunities
    """

    @staticmethod
    def analyze(
        project: AeoProject,
        questions: List[AeoQuestion],
    ) -> Dict[str, Any]:
        brand_name = project.brand_name or project.name
        total_questions = len(questions)

        # Track competitor occurrences
        comp_data: Dict[str, Dict[str, Any]] = {}
        queries_with_competitor_win: List[Dict[str, Any]] = []

        brand_total_mentions = 0

        for q in questions:
            if q.brand_mentioned:
                brand_total_mentions += 1

            q_competitors = set()
            for ans in (q.answers or []):
                for comp in (ans.competitor_mentions or []):
                    c_name = comp.get("name") if isinstance(comp, dict) else comp
                    if c_name:
                        q_competitors.add(c_name)
                        if c_name not in comp_data:
                            comp_data[c_name] = {
                                "name": c_name,
                                "mentions_count": 0,
                                "questions_appeared": 0,
                                "ranks": [],
                            }
                        comp_data[c_name]["mentions_count"] += 1
                        comp_data[c_name]["questions_appeared"] += 1
                        if isinstance(comp, dict) and comp.get("rank"):
                            comp_data[c_name]["ranks"].append(comp.get("rank"))

            # If competitor appeared on this prompt, but brand was absent
            if q_competitors and not q.brand_mentioned:
                queries_with_competitor_win.append({
                    "question_id": q.id,
                    "prompt": q.question_text,
                    "category": q.category or "General",
                    "intent": q.intent or "informational",
                    "competitors_present": list(q_competitors),
                    "priority": "high" if q.intent in ["commercial", "transactional"] else "medium",
                    "recommendation": f"Publish objective comparison guide directly addressing '{q.question_text}' vs {', '.join(list(q_competitors)[:2])}.",
                })

        # Calculate share of voice
        competitor_summaries: List[Dict[str, Any]] = []
        for c_name, c_info in comp_data.items():
            mention_rate = round((c_info["questions_appeared"] / max(1, total_questions)) * 100, 1)
            avg_rank = (
                round(sum(c_info["ranks"]) / len(c_info["ranks"]), 1)
                if c_info["ranks"]
                else None
            )
            competitor_summaries.append({
                "name": c_name,
                "mentions_count": c_info["mentions_count"],
                "questions_appeared": c_info["questions_appeared"],
                "mention_rate": mention_rate,
                "average_rank": avg_rank,
            })

        brand_mention_rate = round((brand_total_mentions / max(1, total_questions)) * 100, 1)

        return {
            "brand_mention_rate": brand_mention_rate,
            "competitors": sorted(competitor_summaries, key=lambda x: x["mentions_count"], reverse=True),
            "uncontested_competitor_prompts": queries_with_competitor_win,
            "total_competitor_gaps_count": len(queries_with_competitor_win),
        }
