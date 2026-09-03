from __future__ import annotations
from typing import Any, Dict, List
from app.models.aeo import AeoProject, AeoQuestion


class ContentGapAnalyzer:
    """
    Analyzes content coverage and provides structured Content Brief generation for:
    - Blog Articles
    - Landing Pages
    - Product / Solution Pages
    - Comparison Pages
    - FAQ / Help Sections
    - Technical Documentation
    - Case Studies
    - Pricing Pages
    - Industry Guides
    """

    CONTENT_TYPE_MAP = {
        "commercial": "Comparison Page",
        "transactional": "Pricing Page",
        "informational": "Industry Guide",
        "navigational": "Documentation",
        "comparison": "Comparison Page",
    }

    @classmethod
    def analyze(
        cls,
        project: AeoProject,
        questions: List[AeoQuestion],
    ) -> Dict[str, Any]:
        brand_name = project.brand_name or project.name
        content_gaps: List[Dict[str, Any]] = []

        uncovered = [q for q in questions if not q.brand_mentioned]
        covered = [q for q in questions if q.brand_mentioned]

        for q in uncovered:
            c_type = cls.CONTENT_TYPE_MAP.get((q.intent or "").lower(), "Blog Article")
            if "pricing" in q.question_text.lower() or "cost" in q.question_text.lower():
                c_type = "Pricing Page"
            elif "vs" in q.question_text.lower() or "alternative" in q.question_text.lower():
                c_type = "Comparison Page"
            elif "how to" in q.question_text.lower() or "guide" in q.question_text.lower():
                c_type = "Industry Guide"
            elif "what is" in q.question_text.lower():
                c_type = "FAQ"

            # Check competitor mentions
            comps = []
            for ans in (q.answers or []):
                for c in (ans.competitor_mentions or []):
                    c_n = c.get("name") if isinstance(c, dict) else c
                    if c_n and c_n not in comps:
                        comps.append(c_n)

            priority = "high" if q.intent in ["commercial", "transactional"] or comps else "medium"
            impact = 8 if priority == "high" else 5

            content_gaps.append({
                "topic": q.category or "Product Capabilities",
                "prompt": q.question_text,
                "category": q.category or "General",
                "intent": q.intent or "informational",
                "competitor_coverage": len(comps) > 0,
                "competitors_mentioned": comps,
                "brand_coverage": False,
                "priority": priority,
                "recommended_content_type": c_type,
                "estimated_impact": impact,
                "brief": cls.generate_content_brief(
                    brand_name=brand_name,
                    domain=project.domain,
                    question=q.question_text,
                    content_type=c_type,
                    category=q.category or "General",
                    competitors=comps,
                ),
            })

        return {
            "total_gaps_count": len(content_gaps),
            "missing_topics_count": len(set(g["topic"] for g in content_gaps)),
            "competitor_covered_gaps_count": len([g for g in content_gaps if g["competitor_coverage"]]),
            "high_priority_gaps_count": len([g for g in content_gaps if g["priority"] == "high"]),
            "gaps": sorted(content_gaps, key=lambda x: (0 if x["priority"] == "high" else 1)),
        }

    @classmethod
    def generate_content_brief(
        cls,
        brand_name: str,
        domain: str,
        question: str,
        content_type: str,
        category: str,
        competitors: List[str],
    ) -> Dict[str, Any]:
        """
        Generates a deterministic, high-value Content Brief to guide content creation.
        """
        comp_str = f" vs {', '.join(competitors[:2])}" if competitors else ""
        recommended_title = f"{question.rstrip('?')} — Complete Guide ({brand_name})"

        headings = [
            f"Overview: What is {category}?",
            f"Key Evaluation Factors & Criteria{comp_str}",
            f"How {brand_name} Solves This Problem Directly",
            "Detailed Feature & Performance Comparison",
            "Frequently Asked Questions & Pricing",
        ]

        entities = [
            brand_name,
            category,
            "Direct Answer Grounding",
            "Semantic Schema Markup",
            "Verified Benchmarks",
        ]
        if competitors:
            entities.extend(competitors[:2])

        faqs = [
            {
                "question": f"How does {brand_name} handle {category.lower()}?",
                "answer_guideline": f"Provide a concise 2-sentence direct answer stating {brand_name}'s architecture and primary value proposition.",
            },
            {
                "question": f"What is the typical pricing and implementation timeline?",
                "answer_guideline": "State transparent starting price tier and average onboarding duration.",
            },
        ]

        return {
            "target_question": question,
            "recommended_title": recommended_title,
            "content_type": content_type,
            "target_category": category,
            "suggested_word_count": "1,200 - 1,800 words",
            "recommended_headings": headings,
            "essential_entities": entities,
            "structured_faqs": faqs,
            "citation_opportunities": [
                f"Official {brand_name} Documentation (https://{domain}/docs)",
                "Industry Benchmark Study",
                "Product Specification Sheet",
            ],
            "internal_link_targets": [
                f"https://{domain}/pricing",
                f"https://{domain}/features",
                f"https://{domain}/about",
            ],
        }
