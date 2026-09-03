from __future__ import annotations
from typing import Any, Dict, List
from app.models.aeo import AeoEntity, AeoProject


class EntityGapAnalyzer:
    """
    Analyzes brand entities, product entities, industry entities, and concept relationships.
    Identifies missing entities, weak relationships, and schema gaps.
    """

    @staticmethod
    def analyze(project: AeoProject, entities: List[AeoEntity]) -> Dict[str, Any]:
        brand_name = (project.brand_name or project.name or "").strip().lower()

        # Categorize detected entities
        brand_entities = [e for e in entities if e.entity_type == "Brand" or brand_name in e.entity_name.lower()]
        product_entities = [e for e in entities if e.entity_type == "Product"]
        service_entities = [e for e in entities if e.entity_type in ["Service", "Feature"]]
        industry_entities = [e for e in entities if e.entity_type in ["Industry", "Category", "Concept"]]

        # Check entity health
        weak_entities = [e for e in entities if (e.visibility_rate or 0) < 50 or (e.mentions_count or 0) <= 1]

        # Determine missing conceptual relationships
        missing_gaps: List[Dict[str, Any]] = []

        if not brand_entities:
            missing_gaps.append({
                "entity": project.name,
                "type": "Brand",
                "gap": "Brand entity not consistently recognized as a primary Organization entity in AI knowledge graphs.",
                "priority": "critical",
                "recommendation": "Deploy complete Organization schema and link social/Wikidata knowledge sources.",
            })

        if not product_entities:
            missing_gaps.append({
                "entity": f"{project.name} Solutions",
                "type": "Product",
                "gap": "Product entities lack structured Product schema and explicit capability definitions.",
                "priority": "high",
                "recommendation": "Add structured Product schema with offers, category, and feature properties on solution pages.",
            })

        for we in weak_entities[:4]:
            missing_gaps.append({
                "entity": we.entity_name,
                "type": we.entity_type,
                "frequency": we.mentions_count,
                "gap": f"Entity '{we.entity_name}' has low mention frequency ({we.mentions_count}) and weak conceptual associations.",
                "priority": "medium",
                "recommendation": f"Interlink related topic concepts with '{we.entity_name}' across technical and marketing copy.",
            })

        return {
            "total_entities_count": len(entities),
            "brand_entities_count": len(brand_entities),
            "product_entities_count": len(product_entities),
            "service_entities_count": len(service_entities),
            "industry_entities_count": len(industry_entities),
            "weak_entities_count": len(weak_entities),
            "entities_list": [
                {
                    "id": e.id,
                    "name": e.entity_name,
                    "type": e.entity_type,
                    "mentions": e.mentions_count,
                    "visibility_rate": e.visibility_rate,
                    "concepts": e.associated_concepts or [],
                }
                for e in sorted(entities, key=lambda x: x.mentions_count or 0, reverse=True)
            ],
            "gaps": missing_gaps,
        }
