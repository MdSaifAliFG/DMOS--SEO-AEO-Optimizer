from __future__ import annotations
from typing import Any, Dict, List
from app.models.aeo import AeoProject, AeoQuestion


class PromptGapAnalyzer:
    """
    Analyzes prompt coverage and identifies high-value prompt opportunities where:
    - Competitors are mentioned
    - Brand is absent
    - Citations exist to external domains but not own domain
    - Buyer intent is high
    """

    @staticmethod
    def analyze(project: AeoProject, questions: List[AeoQuestion]) -> Dict[str, Any]:
        total_tracked = len(questions)
        if total_tracked == 0:
            return {
                "total_tracked": 0,
                "covered_prompts_count": 0,
                "uncovered_prompts_count": 0,
                "coverage_rate": 0.0,
                "intent_breakdown": {},
                "category_breakdown": {},
                "opportunities": [],
            }

        covered_questions = [q for q in questions if q.brand_mentioned]
        uncovered_questions = [q for q in questions if not q.brand_mentioned]

        coverage_rate = round((len(covered_questions) / total_tracked) * 100, 1)

        # Breakdown by intent
        intent_breakdown: Dict[str, Dict[str, int]] = {}
        for q in questions:
            intent = q.intent or "informational"
            if intent not in intent_breakdown:
                intent_breakdown[intent] = {"total": 0, "covered": 0, "uncovered": 0}
            intent_breakdown[intent]["total"] += 1
            if q.brand_mentioned:
                intent_breakdown[intent]["covered"] += 1
            else:
                intent_breakdown[intent]["uncovered"] += 1

        # Breakdown by category
        category_breakdown: Dict[str, Dict[str, int]] = {}
        for q in questions:
            cat = q.category or "General"
            if cat not in category_breakdown:
                category_breakdown[cat] = {"total": 0, "covered": 0, "uncovered": 0}
            category_breakdown[cat]["total"] += 1
            if q.brand_mentioned:
                category_breakdown[cat]["covered"] += 1
            else:
                category_breakdown[cat]["uncovered"] += 1

        # Generate prompt opportunities
        opportunities: List[Dict[str, Any]] = []
        for q in uncovered_questions:
            # Check if competitors appeared in answers for this question
            comp_mentions = []
            for ans in (q.answers or []):
                for comp in (ans.competitor_mentions or []):
                    c_name = comp.get("name") if isinstance(comp, dict) else comp
                    if c_name and c_name not in comp_mentions:
                        comp_mentions.append(c_name)

            has_citations = bool(q.citations and len(q.citations) > 0)
            
            # Prioritize commercial/transactional/comparison queries
            priority = "medium"
            if q.intent in ["commercial", "transactional", "comparison"] or len(comp_mentions) > 0:
                priority = "high"
            if q.intent in ["commercial", "transactional"] and len(comp_mentions) >= 2:
                priority = "critical"

            opportunities.append({
                "question_id": q.id,
                "prompt": q.question_text,
                "category": q.category or "General",
                "intent": q.intent or "informational",
                "brand_mentioned": False,
                "competitor_mentions": comp_mentions,
                "has_citations": has_citations,
                "priority": priority,
                "recommended_action": f"Publish direct-answer guide targeting '{q.question_text}' with product proof points.",
            })

        return {
            "total_tracked": total_tracked,
            "covered_prompts_count": len(covered_questions),
            "uncovered_prompts_count": len(uncovered_questions),
            "coverage_rate": coverage_rate,
            "intent_breakdown": intent_breakdown,
            "category_breakdown": category_breakdown,
            "opportunities": sorted(
                opportunities,
                key=lambda x: (0 if x["priority"] == "critical" else 1 if x["priority"] == "high" else 2)
            ),
        }
