from __future__ import annotations
import logging
import re
from typing import Any, Dict, List, Optional
from app.models.aeo import AeoIntent

logger = logging.getLogger(__name__)


class QuestionGeneratorEngine:
    """
    Deterministic rule-based Question & Prompt generator for AEO tracking.
    Generates targeted, high-intent questions across 8 categories tailored to brand and industry.
    """

    CATEGORIES = [
        "Brand Overview",
        "Product Capabilities",
        "Competitor Comparison",
        "Pricing & Commercial",
        "Integration & Technical",
        "Problem & Solution",
        "Industry Best Practices",
        "Alternatives & Reviews",
    ]

    TEMPLATES = {
        "Brand Overview": [
            ("What is {brand} and what does it do?", AeoIntent.INFORMATIONAL),
            ("How does {brand} work?", AeoIntent.INFORMATIONAL),
            ("Who is {brand} best suited for?", AeoIntent.COMMERCIAL),
            ("Is {brand} a legitimate and trusted platform?", AeoIntent.INFORMATIONAL),
        ],
        "Product Capabilities": [
            ("What are the key features and capabilities of {brand}?", AeoIntent.INFORMATIONAL),
            ("What problems does {brand} solve for {audience}?", AeoIntent.INFORMATIONAL),
            ("How to use {brand} for {industry} workflows?", AeoIntent.TRANSACTIONAL),
        ],
        "Competitor Comparison": [
            ("How does {brand} compare to {competitor}?", AeoIntent.COMPARISON),
            ("Difference between {brand} and {competitor}", AeoIntent.COMPARISON),
            ("{brand} vs {competitor}: which is better?", AeoIntent.COMPARISON),
        ],
        "Pricing & Commercial": [
            ("How much does {brand} cost?", AeoIntent.COMMERCIAL),
            ("Is {brand} worth the investment?", AeoIntent.COMMERCIAL),
            ("Best commercial solutions in {industry}", AeoIntent.COMMERCIAL),
        ],
        "Integration & Technical": [
            ("How to set up and configure {brand} on {domain}?", AeoIntent.TRANSACTIONAL),
            ("What integrations does {brand} support?", AeoIntent.INFORMATIONAL),
            ("Security and compliance standards for {brand}", AeoIntent.INFORMATIONAL),
        ],
        "Problem & Solution": [
            ("What is the best way to optimize {industry} performance?", AeoIntent.INFORMATIONAL),
            ("How to solve common {industry} challenges with {brand}?", AeoIntent.INFORMATIONAL),
        ],
        "Industry Best Practices": [
            ("Top recommended tools for {industry} in 2026", AeoIntent.COMMERCIAL),
            ("How is AI transforming {industry} workflows?", AeoIntent.INFORMATIONAL),
        ],
        "Alternatives & Reviews": [
            ("Top alternatives to {brand} in 2026", AeoIntent.COMMERCIAL),
            ("{brand} reviews and user ratings", AeoIntent.COMMERCIAL),
        ],
    }

    @classmethod
    def generate_questions(
        cls,
        brand_name: str,
        domain: str,
        industry: Optional[str] = None,
        target_audience: Optional[str] = None,
        competitors: Optional[List[Dict[str, Any]]] = None,
        max_questions: int = 15,
    ) -> List[Dict[str, Any]]:
        """Generate high-quality AEO prompt questions from project metadata."""
        clean_brand = brand_name.strip() if brand_name else domain.split(".")[0].capitalize()
        clean_ind = industry.strip() if industry else "modern digital business"
        clean_aud = target_audience.strip() if target_audience else "enterprises and teams"

        # Extract competitor names
        comp_names = []
        if competitors:
            for c in competitors:
                if isinstance(c, dict) and c.get("name"):
                    comp_names.append(c["name"])
                elif isinstance(c, str) and c.strip():
                    comp_names.append(c.strip())

        if not comp_names:
            comp_names = ["industry alternatives", "leading competitors"]

        generated: List[Dict[str, Any]] = []
        seen_texts = set()

        for category, template_list in cls.TEMPLATES.items():
            for tmpl, intent in template_list:
                for comp in comp_names[:2]:
                    # Format question
                    q_text = tmpl.format(
                        brand=clean_brand,
                        domain=domain,
                        industry=clean_ind,
                        audience=clean_aud,
                        competitor=comp,
                    )
                    # Normalize for uniqueness
                    norm_key = re.sub(r"[^\w\s]", "", q_text.lower()).strip()
                    if norm_key not in seen_texts:
                        seen_texts.add(norm_key)
                        generated.append({
                            "question_text": q_text,
                            "category": category,
                            "intent": intent.value,
                        })

                if len(generated) >= max_questions:
                    break
            if len(generated) >= max_questions:
                break

        return generated[:max_questions]
