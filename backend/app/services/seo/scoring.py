from collections import defaultdict
import logging
from typing import Any, Dict, List
from app.models.seo_issue import IssueCategory, IssueSeverity, SeoIssue

logger = logging.getLogger(__name__)

SEVERITY_WEIGHTS: Dict[str, float] = {
    IssueSeverity.CRITICAL.value: 10.0,
    IssueSeverity.HIGH.value: 5.0,
    IssueSeverity.MEDIUM.value: 3.0,
    IssueSeverity.LOW.value: 1.0,
    IssueSeverity.INFO.value: 0.0,
}

CATEGORY_WEIGHTS: Dict[str, float] = {
    IssueCategory.TECHNICAL.value: 0.30,
    IssueCategory.INDEXABILITY.value: 0.25,
    IssueCategory.METADATA.value: 0.25,
    IssueCategory.LINKS.value: 0.20,
}


def get_score_label(score: int) -> str:
    """Classifies numerical SEO score into SeoSensing rating tier."""
    if score >= 90:
        return "Excellent"
    if score >= 80:
        return "Good"
    if score >= 70:
        return "Fair"
    if score >= 50:
        return "Needs Improvement"
    return "Poor"


class SeoScoringEngine:
    """
    Deterministic SEO Scoring Engine.
    Computes category scores, weighted overall score, and transparent penalty explanations.
    """

    @classmethod
    def calculate_scores(
        cls,
        total_pages: int,
        issues: List[SeoIssue],
    ) -> Dict[str, Any]:
        """
        Calculates category scores, overall score, and detailed score explanation breakdown.
        """
        effective_pages = max(total_pages, 1)

        # Group issues by category and issue_code
        categorized_issues: Dict[str, Dict[str, List[SeoIssue]]] = {
            IssueCategory.TECHNICAL.value: defaultdict(list),
            IssueCategory.INDEXABILITY.value: defaultdict(list),
            IssueCategory.METADATA.value: defaultdict(list),
            IssueCategory.LINKS.value: defaultdict(list),
        }

        for issue in issues:
            cat = issue.category if issue.category in categorized_issues else IssueCategory.TECHNICAL.value
            categorized_issues[cat][issue.issue_code].append(issue)

        category_scores: Dict[str, int] = {}
        category_deductions: Dict[str, List[Dict[str, Any]]] = {}
        severity_counts: Dict[str, int] = {
            IssueSeverity.CRITICAL.value: 0,
            IssueSeverity.HIGH.value: 0,
            IssueSeverity.MEDIUM.value: 0,
            IssueSeverity.LOW.value: 0,
            IssueSeverity.INFO.value: 0,
        }

        # Calculate score for each category
        for cat_name, code_groups in categorized_issues.items():
            cat_deduction_total = 0.0
            cat_explanation: List[Dict[str, Any]] = []

            for issue_code, issue_list in code_groups.items():
                first_issue = issue_list[0]
                sev = first_issue.severity
                severity_counts[sev] = severity_counts.get(sev, 0) + len(issue_list)

                base_penalty = SEVERITY_WEIGHTS.get(sev, 1.0)
                affected_count = len(issue_list)

                # Proportional penalty formula with cap (max multiplier: 3.0x)
                ratio = min(1.0, affected_count / effective_pages)
                multiplier = min(3.0, 1.0 + (ratio * 2.0))
                penalty = round(base_penalty * multiplier, 1)

                cat_deduction_total += penalty
                cat_explanation.append({
                    "issue_code": issue_code,
                    "title": first_issue.title,
                    "severity": sev,
                    "affected_pages": affected_count,
                    "penalty": penalty,
                })

            raw_cat_score = max(0, min(100, int(round(100.0 - cat_deduction_total))))
            category_scores[cat_name] = raw_cat_score
            category_deductions[cat_name] = cat_explanation

        # Calculate Overall Weighted Score
        technical_score = category_scores.get(IssueCategory.TECHNICAL.value, 100)
        indexability_score = category_scores.get(IssueCategory.INDEXABILITY.value, 100)
        metadata_score = category_scores.get(IssueCategory.METADATA.value, 100)
        links_score = category_scores.get(IssueCategory.LINKS.value, 100)

        weighted_overall = (
            technical_score * CATEGORY_WEIGHTS[IssueCategory.TECHNICAL.value]
            + indexability_score * CATEGORY_WEIGHTS[IssueCategory.INDEXABILITY.value]
            + metadata_score * CATEGORY_WEIGHTS[IssueCategory.METADATA.value]
            + links_score * CATEGORY_WEIGHTS[IssueCategory.LINKS.value]
        )

        overall_score = max(0, min(100, int(round(weighted_overall))))
        score_label = get_score_label(overall_score)

        return {
            "overall_score": overall_score,
            "score_label": score_label,
            "technical_score": technical_score,
            "indexability_score": indexability_score,
            "metadata_score": metadata_score,
            "links_score": links_score,
            "severity_counts": severity_counts,
            "score_breakdown": {
                "formula": "0.30 * Technical + 0.25 * Indexability + 0.25 * Metadata + 0.20 * Links",
                "base_score": 100,
                "category_scores": category_scores,
                "deductions_by_category": category_deductions,
            },
        }
