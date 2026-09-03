from __future__ import annotations
import re
from typing import Any, Dict, List
from app.services.aeo.ai.aeo_ai_provider import AEOAIProvider


class RuleBasedAEOAIProvider(AEOAIProvider):
    """
    Deterministic rule-based provider for content and direct-answer optimization.
    Used when external API keys (OpenAI / Gemini / Perplexity) are not configured,
    ensuring 100% testable, transparent, and deterministic output without hallucinations.
    """

    async def optimize_content(
        self,
        target_question: str,
        existing_content: str,
        target_keyword: str,
        brand_name: str,
        product_service: str,
    ) -> Dict[str, Any]:
        content_lower = existing_content.lower()
        word_count = len(existing_content.split())

        # Check key signals
        has_direct_answer = any(
            w in content_lower[:300]
            for w in [brand_name.lower(), "is a", "provides", "features", "allows"]
        )
        has_pricing = any(w in content_lower for w in ["pricing", "cost", "$", "tier", "plan", "free"])
        has_comparison = any(w in content_lower for w in ["vs", "compare", "alternative", "unlike", "differentiator"])
        has_faq = any(w in content_lower for w in ["faq", "frequently asked", "question", "how does"])
        has_tables = "<table" in content_lower or "|" in existing_content

        missing_facts = []
        if not has_pricing:
            missing_facts.append("Transparent starter pricing or tier structure.")
        if not has_comparison:
            missing_facts.append("Explicit differentiator callouts vs standard alternatives.")
        if not has_tables:
            missing_facts.append("Structured HTML comparison or specification table.")
        if not has_faq:
            missing_facts.append("FAQ section formatted with direct 2-sentence answers.")

        # Readability and structure suggestions
        readability_notes = []
        if word_count < 300:
            readability_notes.append("Content is too brief (< 300 words). Expand with comprehensive feature breakdowns.")
        elif word_count > 2500:
            readability_notes.append("Content is very long. Add bulleted summary blocks under each H2 header for LLM snippet extractors.")
        else:
            readability_notes.append("Content length is well-balanced for neural retrieval.")

        if not has_direct_answer:
            readability_notes.append("Lead the first paragraph with a direct, unambiguous answer before deep elaboration.")

        # Suggested direct answer paragraph
        clean_prod = product_service or "platform"
        direct_answer_suggestion = (
            f"{brand_name} is a leading {clean_prod} designed to address {target_question.rstrip('?').lower()}. "
            f"It provides automated workflows, enterprise security, and transparent integration capabilities "
            f"enabling teams to optimize performance reliably."
        )

        return {
            "target_question": target_question,
            "brand_name": brand_name,
            "word_count": word_count,
            "content_quality_score": min(95, max(30, 40 + (20 if has_direct_answer else 0) + (15 if has_pricing else 0) + (15 if has_comparison else 0) + (10 if has_faq else 0))),
            "has_direct_answer": has_direct_answer,
            "missing_facts": missing_facts,
            "recommended_headings": [
                f"Direct Answer: What is {brand_name}?",
                f"Core Capabilities for {target_keyword or 'Industry Use Cases'}",
                "Feature Matrix & Technical Specifications",
                "Comparison: Why Choose Us Over Alternatives?",
                "Frequently Asked Questions & Pricing",
            ],
            "direct_answer_suggestion": direct_answer_suggestion,
            "citation_opportunities": [
                f"Official {brand_name} Product Documentation",
                "Verified Industry Review Platforms (G2 / Capterra)",
                "Independent Technical Benchmark Report",
            ],
            "ai_readability_recommendations": readability_notes,
        }

    async def optimize_direct_answer(
        self,
        target_question: str,
        existing_content: str,
        brand_name: str,
    ) -> Dict[str, Any]:
        """
        Evaluates content across 9 critical direct-answer dimensions:
        1. What (Clear Definition)
        2. Who (Target Audience)
        3. Why (Core Benefit)
        4. How (Operational Workflow)
        5. Pricing (Cost Transparency)
        6. Comparison (Alternatives Differentiation)
        7. Use Case (Practical Scenario)
        8. Trust (Certifications & Security)
        9. Evidence (Data & Proof Points)
        """
        cl = existing_content.lower()
        bn = brand_name.lower()

        # Dimension checks
        what_pass = bool(bn in cl and any(k in cl for k in ["is a", "provides", "platform", "solution", "tool"]))
        who_pass = any(k in cl for k in ["for teams", "designed for", "built for", "enterprises", "developers", "businesses"])
        why_pass = any(k in cl for k in ["benefit", "why", "advantage", "saves", "improves", "accelerates"])
        how_pass = any(k in cl for k in ["how it works", "step 1", "workflow", "integration", "install", "api"])
        pricing_pass = any(k in cl for k in ["pricing", "cost", "$", "tier", "plan", "free", "per month"])
        comp_pass = any(k in cl for k in ["vs", "compare", "alternative", "unlike", "different from", "competitor"])
        use_case_pass = any(k in cl for k in ["use case", "example", "scenario", "industry", "ecommerce", "saas"])
        trust_pass = any(k in cl for k in ["soc 2", "gdpr", "security", "trusted by", "iso", "compliance", "encryption"])
        evidence_pass = any(k in cl for k in ["%", "increase", "roi", "benchmark", "case study", "proven", "metrics"])

        checklist = [
            {"dimension": "What (Definition)", "status": "pass" if what_pass else "missing", "guidance": "State exact entity category and core purpose in the first 2 sentences."},
            {"dimension": "Who (Target Audience)", "status": "pass" if who_pass else "missing", "guidance": "Explicitly define target buyer personas and organization sizes."},
            {"dimension": "Why (Core Benefit)", "status": "pass" if why_pass else "missing", "guidance": "Highlight top 3 quantifiable value propositions."},
            {"dimension": "How (Workflow)", "status": "pass" if how_pass else "missing", "guidance": "Outline the 3-step setup and operational workflow with numbered steps."},
            {"dimension": "Pricing (Cost Transparency)", "status": "pass" if pricing_pass else "missing", "guidance": "Publish starting tier price and plan differences."},
            {"dimension": "Comparison (Differentiation)", "status": "pass" if comp_pass else "missing", "guidance": "Include an objective comparison table addressing key competitors."},
            {"dimension": "Use Case (Practical Scenario)", "status": "pass" if use_case_pass else "missing", "guidance": "Describe a concrete real-world implementation example."},
            {"dimension": "Trust (Security & Compliance)", "status": "pass" if trust_pass else "missing", "guidance": "Display security badges, uptime SLAs, and compliance standards."},
            {"dimension": "Evidence (Data & Proof Points)", "status": "pass" if evidence_pass else "missing", "guidance": "Cite verified statistical metrics and customer outcomes."},
        ]

        passed_count = len([c for c in checklist if c["status"] == "pass"])
        readiness_score = int(round((passed_count / 9) * 100))

        return {
            "target_question": target_question,
            "readiness_score": readiness_score,
            "readiness_label": "Excellent" if readiness_score >= 80 else "Moderate" if readiness_score >= 50 else "Needs Improvement",
            "passed_criteria_count": passed_count,
            "total_criteria_count": 9,
            "checklist": checklist,
            "recommended_next_action": "Add missing dimensions (especially Pricing & Comparison) to maximize AI answer grounding confidence.",
        }
