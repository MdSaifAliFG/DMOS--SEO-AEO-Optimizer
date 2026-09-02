from typing import Tuple
from app.models.seo_recommendation import RecommendationPriority


class PriorityCalculator:
    """
    Deterministic priority calculation for SEO recommendations.
    
    Formula:
      priority_score = severity_weight + affected_page_weight + category_impact_weight + impact_weight
      
    Priority mapping:
      90–100 = Critical
      70–89  = High
      40–69  = Medium
      0–39   = Low
    """

    SEVERITY_WEIGHTS = {
        "critical": 45.0,
        "high": 35.0,
        "medium": 25.0,
        "low": 5.0,
        "info": 2.0,
    }

    @classmethod
    def calculate_priority(
        cls,
        severity: str,
        affected_pages_count: int,
        category: str,
        estimated_impact: float,
        issue_code: str = "",
    ) -> Tuple[float, str]:
        sev_key = severity.lower()
        severity_weight = cls.SEVERITY_WEIGHTS.get(sev_key, 25.0)

        # Affected pages weight (0 to 25 pts)
        page_weight = min(25.0, max(2.5, affected_pages_count * 2.5))

        # Category impact weight (0 to 20 pts)
        cat_lower = category.lower()
        is_indexability = (
            cat_lower == "indexability"
            or "noindex" in issue_code
            or "canonical" in issue_code
            or "robots" in issue_code
        )
        is_technical = (
            cat_lower == "technical"
            or "4xx" in issue_code
            or "5xx" in issue_code
            or "ttfb" in issue_code
        )

        category_weight = 20.0 if (is_indexability or is_technical) else (10.0 if cat_lower in ["metadata", "links", "content"] else 5.0)

        # Impact weight (0 to 10 pts)
        impact_weight = min(10.0, max(0.0, estimated_impact * 2.0))

        # Total score normalized to 0-100
        raw_score = severity_weight + page_weight + category_weight + impact_weight
        normalized_score = min(100.0, max(0.0, round(raw_score, 1)))

        # Priority tier assignment
        if normalized_score >= 90.0:
            priority_tier = RecommendationPriority.CRITICAL.value
        elif normalized_score >= 70.0:
            priority_tier = RecommendationPriority.HIGH.value
        elif normalized_score >= 40.0:
            priority_tier = RecommendationPriority.MEDIUM.value
        else:
            priority_tier = RecommendationPriority.LOW.value

        return normalized_score, priority_tier
