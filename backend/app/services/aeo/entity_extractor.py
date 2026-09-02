from __future__ import annotations
import re
from typing import Any, Dict, List, Optional, Set


class EntityExtractorEngine:
    """
    Deterministic Knowledge Graph & Entity Extraction Engine for AEO.
    """

    TOPIC_KEYWORDS = [
        "SEO", "AEO", "Answer Engine Optimization", "AI Search", "Digital Marketing",
        "CRM", "Analytics", "Automation", "SaaS", "Enterprise", "Customer Support",
        "Lead Generation", "Machine Learning", "Artificial Intelligence", "Workflows",
        "API", "Cloud Platform", "Database", "Security", "E-Commerce",
    ]

    @classmethod
    def extract_entities(
        cls,
        brand_name: str,
        domain: str,
        industry: Optional[str] = None,
        answers: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Extracts key entities, associated topics, and calculates mention frequency.
        """
        combined_text = " ".join(answers or [])
        entities: List[Dict[str, Any]] = []

        # 1. Primary Brand Entity
        clean_brand = brand_name.strip() if brand_name else domain.split(".")[0].capitalize()
        brand_mentions = len(re.findall(r"\b" + re.escape(clean_brand) + r"\b", combined_text, re.IGNORECASE))
        entities.append({
            "entity_name": clean_brand,
            "entity_type": "Brand",
            "mentions_count": max(brand_mentions, 1),
            "visibility_rate": 90 if brand_mentions > 0 else 50,
            "associated_concepts": [c for c in cls.TOPIC_KEYWORDS if c.lower() in combined_text.lower()][:4] or ["AI Search", "Digital Presence"],
        })

        # 2. Industry / Domain Entity
        if industry and industry.strip():
            ind_name = industry.strip()
            ind_mentions = len(re.findall(r"\b" + re.escape(ind_name) + r"\b", combined_text, re.IGNORECASE))
            entities.append({
                "entity_name": ind_name,
                "entity_type": "Industry",
                "mentions_count": max(ind_mentions, 1),
                "visibility_rate": 75 if ind_mentions > 0 else 40,
                "associated_concepts": ["Best Practices", "Market Landscape"],
            })

        # 3. Extracted Topic Entities from AI Answers
        for kw in cls.TOPIC_KEYWORDS:
            if kw.lower() in combined_text.lower() and kw.lower() != clean_brand.lower():
                count = len(re.findall(r"\b" + re.escape(kw) + r"\b", combined_text, re.IGNORECASE))
                if count > 0:
                    entities.append({
                        "entity_name": kw,
                        "entity_type": "Topic",
                        "mentions_count": count,
                        "visibility_rate": min(count * 15, 95),
                        "associated_concepts": [clean_brand],
                    })

        return entities[:10]
