from __future__ import annotations
from typing import Any, Dict, List, Optional


class GEOEntityExtractor:
    """Builds and extracts structured entities for the GEO Knowledge Graph."""

    ENTITY_TYPES = [
        "Brand",
        "Organization",
        "Product",
        "Service",
        "Person",
        "Industry",
        "Technology",
        "Location",
        "Use Case",
        "Topic",
        "Competitor",
    ]

    def extract_from_brand_profile(
        self,
        brand_profile: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        entities: List[Dict[str, Any]] = []

        brand_name = brand_profile.get("brand_name", "")
        if not brand_name:
            return entities

        # 1. Brand Entity
        entities.append({
            "name": brand_name,
            "entity_type": "Brand",
            "description": brand_profile.get("short_description") or f"Core brand entity for {brand_name}",
            "aliases": brand_profile.get("aliases", []),
            "parent_entity": None,
            "related_entities": [p for p in brand_profile.get("products", [])],
            "related_topics": brand_profile.get("primary_topics", []),
            "products": brand_profile.get("products", []),
            "services": brand_profile.get("services", []),
            "competitors": [c.get("name") if isinstance(c, dict) else str(c) for c in brand_profile.get("competitors", [])],
            "source": "brand_profile",
            "confidence": 1.0,
            "consistency_status": "consistent",
        })

        # 2. Organization Entity
        legal = brand_profile.get("legal_name") or brand_name
        entities.append({
            "name": legal,
            "entity_type": "Organization",
            "description": f"Corporate organization entity representing {brand_name}",
            "aliases": brand_profile.get("aliases", []),
            "parent_entity": brand_name,
            "related_entities": [],
            "related_topics": [],
            "products": brand_profile.get("products", []),
            "services": brand_profile.get("services", []),
            "competitors": [],
            "source": "brand_profile",
            "confidence": 1.0,
            "consistency_status": "consistent",
        })

        # 3. Industry Entity
        industry = brand_profile.get("industry")
        if industry:
            entities.append({
                "name": industry,
                "entity_type": "Industry",
                "description": f"Primary market sector for {brand_name}",
                "aliases": [],
                "parent_entity": None,
                "related_entities": [brand_name],
                "related_topics": brand_profile.get("primary_topics", []),
                "products": [],
                "services": [],
                "competitors": [],
                "source": "brand_profile",
                "confidence": 0.95,
                "consistency_status": "consistent",
            })

        # 4. Product Entities
        for prod in brand_profile.get("products", []):
            if prod:
                entities.append({
                    "name": prod,
                    "entity_type": "Product",
                    "description": f"Commercial product offered by {brand_name}",
                    "aliases": [],
                    "parent_entity": brand_name,
                    "related_entities": [brand_name],
                    "related_topics": [],
                    "products": [],
                    "services": [],
                    "competitors": [],
                    "source": "brand_profile",
                    "confidence": 0.90,
                    "consistency_status": "consistent",
                })

        # 5. Service Entities
        for serv in brand_profile.get("services", []):
            if serv:
                entities.append({
                    "name": serv,
                    "entity_type": "Service",
                    "description": f"Service capability provided by {brand_name}",
                    "aliases": [],
                    "parent_entity": brand_name,
                    "related_entities": [brand_name],
                    "related_topics": [],
                    "products": [],
                    "services": [],
                    "competitors": [],
                    "source": "brand_profile",
                    "confidence": 0.90,
                    "consistency_status": "consistent",
                })

        # 6. Use Case Entities
        for uc in brand_profile.get("use_cases", []):
            if uc:
                entities.append({
                    "name": uc,
                    "entity_type": "Use Case",
                    "description": f"Target customer application and workflow for {brand_name}",
                    "aliases": [],
                    "parent_entity": brand_name,
                    "related_entities": [brand_name],
                    "related_topics": [],
                    "products": [],
                    "services": [],
                    "competitors": [],
                    "source": "brand_profile",
                    "confidence": 0.85,
                    "consistency_status": "consistent",
                })

        # 7. Competitor Entities
        for comp in brand_profile.get("competitors", []):
            c_name = comp.get("name") if isinstance(comp, dict) else str(comp)
            if c_name:
                entities.append({
                    "name": c_name,
                    "entity_type": "Competitor",
                    "description": f"Market alternative and competitor in {industry or 'the sector'}",
                    "aliases": comp.get("aliases", []) if isinstance(comp, dict) else [],
                    "parent_entity": None,
                    "related_entities": [brand_name],
                    "related_topics": [],
                    "products": [],
                    "services": [],
                    "competitors": [],
                    "source": "brand_profile",
                    "confidence": 0.90,
                    "consistency_status": "consistent",
                })

        return entities
