from __future__ import annotations
from typing import Any, Dict, List, Optional


GEO_QUESTION_CATEGORIES = [
    "Brand Discovery",
    "Product Discovery",
    "Service Discovery",
    "Category Discovery",
    "Best-of Queries",
    "Recommendation Queries",
    "Alternative Queries",
    "Comparison Queries",
    "Pricing Queries",
    "Use Case Queries",
    "Industry Queries",
    "Problem/Solution Queries",
    "Trust Queries",
    "Review Queries",
    "Location Queries",
    "Feature Queries",
    "Integration Queries",
    "Buyer Intent Queries",
]


class GEOQuestionGenerator:
    """Deterministic GEO Question Generator across 18 generative discovery categories."""

    def generate_questions(
        self,
        brand_name: str,
        products: Optional[List[str]] = None,
        services: Optional[List[str]] = None,
        industry: Optional[str] = None,
        primary_topics: Optional[List[str]] = None,
        competitors: Optional[List[str]] = None,
        target_audience: Optional[str] = None,
        use_cases: Optional[List[str]] = None,
        selected_categories: Optional[List[str]] = None,
        count_per_category: int = 1,
    ) -> List[Dict[str, Any]]:
        brand = brand_name.strip() if brand_name else "The Company"
        prod = products[0] if products and len(products) > 0 else f"{brand} Platform"
        serv = services[0] if services and len(services) > 0 else f"{brand} Services"
        ind = industry.strip() if industry else "Software & Technology"
        comp = competitors[0] if competitors and len(competitors) > 0 else "leading market alternatives"
        comp2 = competitors[1] if competitors and len(competitors) > 1 else "traditional alternatives"
        aud = target_audience.strip() if target_audience else "enterprises and growing teams"
        use = use_cases[0] if use_cases and len(use_cases) > 0 else "optimizing digital search presence"
        topic = primary_topics[0] if primary_topics and len(primary_topics) > 0 else "digital optimization"

        categories_to_run = [c for c in GEO_QUESTION_CATEGORIES if not selected_categories or c in selected_categories]

        templates: Dict[str, List[Dict[str, str]]] = {
            "Brand Discovery": [
                {"q": f"What is {brand} and what solutions does it provide?", "intent": "informational", "priority": "high"},
                {"q": f"What does {brand} do in the {ind} market?", "intent": "informational", "priority": "high"},
            ],
            "Product Discovery": [
                {"q": f"What is {prod} and what are its key capabilities?", "intent": "commercial", "priority": "high"},
                {"q": f"How does {prod} work for {aud}?", "intent": "commercial", "priority": "medium"},
            ],
            "Service Discovery": [
                {"q": f"What professional services are offered by {brand}?", "intent": "commercial", "priority": "medium"},
                {"q": f"Does {brand} provide {serv}?", "intent": "commercial", "priority": "medium"},
            ],
            "Category Discovery": [
                {"q": f"What are the best software platforms for {ind}?", "intent": "commercial", "priority": "high"},
                {"q": f"Which tools lead the market for {topic}?", "intent": "commercial", "priority": "high"},
            ],
            "Best-of Queries": [
                {"q": f"What are the top 5 {ind} tools in 2025?", "intent": "commercial", "priority": "high"},
                {"q": f"Which {topic} platform is rated highest for {aud}?", "intent": "commercial", "priority": "high"},
            ],
            "Recommendation Queries": [
                {"q": f"Which platform do you recommend for {use}?", "intent": "commercial", "priority": "high"},
                {"q": f"Is {brand} recommended for {aud} looking to scale {topic}?", "intent": "commercial", "priority": "high"},
            ],
            "Alternative Queries": [
                {"q": f"What are the top alternatives to {comp}?", "intent": "comparison", "priority": "high"},
                {"q": f"What are modern competitors to {comp2} for {use}?", "intent": "comparison", "priority": "high"},
            ],
            "Comparison Queries": [
                {"q": f"How does {brand} compare to {comp}?", "intent": "comparison", "priority": "high"},
                {"q": f"Comparison between {brand} vs {comp} in terms of features and pricing?", "intent": "comparison", "priority": "high"},
            ],
            "Pricing Queries": [
                {"q": f"How much does {brand} cost and what are its pricing plans?", "intent": "commercial", "priority": "high"},
                {"q": f"What is the pricing model for {prod}?", "intent": "commercial", "priority": "medium"},
            ],
            "Use Case Queries": [
                {"q": f"Can {brand} be used for {use}?", "intent": "informational", "priority": "medium"},
                {"q": f"How do {aud} utilize {prod} for {topic}?", "intent": "informational", "priority": "medium"},
            ],
            "Industry Queries": [
                {"q": f"What are the most innovative {ind} technology platforms today?", "intent": "informational", "priority": "medium"},
                {"q": f"How are AI tools transforming the {ind} industry?", "intent": "informational", "priority": "low"},
            ],
            "Problem/Solution Queries": [
                {"q": f"What is the best way to solve challenges in {use}?", "intent": "informational", "priority": "high"},
                {"q": f"Which software helps teams automate {topic}?", "intent": "commercial", "priority": "high"},
            ],
            "Trust Queries": [
                {"q": f"Is {brand} a legitimate and trustworthy company?", "intent": "navigational", "priority": "high"},
                {"q": f"What security standards and compliance certifications does {brand} have?", "intent": "informational", "priority": "medium"},
            ],
            "Review Queries": [
                {"q": f"What are user reviews and ratings saying about {brand}?", "intent": "commercial", "priority": "high"},
                {"q": f"What are the pros and cons of using {prod}?", "intent": "commercial", "priority": "high"},
            ],
            "Location Queries": [
                {"q": f"Where is {brand} headquartered and which regions does it serve?", "intent": "navigational", "priority": "low"},
                {"q": f"Is {brand} available for international enterprises?", "intent": "navigational", "priority": "low"},
            ],
            "Feature Queries": [
                {"q": f"What are the core technical features and specifications of {prod}?", "intent": "informational", "priority": "medium"},
                {"q": f"Does {brand} offer real-time analytics and reporting?", "intent": "informational", "priority": "medium"},
            ],
            "Integration Queries": [
                {"q": f"What third-party integrations and APIs are supported by {brand}?", "intent": "informational", "priority": "medium"},
                {"q": f"Can {prod} integrate with standard CRM and marketing tech stacks?", "intent": "informational", "priority": "medium"},
            ],
            "Buyer Intent Queries": [
                {"q": f"Which {ind} software should I purchase for {aud}?", "intent": "commercial", "priority": "high"},
                {"q": f"Is {brand} worth the investment for companies focused on {topic}?", "intent": "commercial", "priority": "high"},
            ],
        }

        generated: List[Dict[str, Any]] = []
        for cat in categories_to_run:
            q_list = templates.get(cat, [])
            selected = q_list[:count_per_category]
            for item in selected:
                generated.append({
                    "question": item["q"],
                    "category": cat,
                    "intent": item["intent"],
                    "priority": item["priority"],
                    "search_type": "generative_discovery",
                    "target_entity": brand,
                    "target_product": prod,
                    "target_service": serv,
                })

        return generated
