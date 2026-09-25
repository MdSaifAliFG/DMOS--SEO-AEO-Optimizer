import re
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from app.services.ai.schemas import (
    AEOAnswerSemanticAnalysis,
    GEOAnswerSemanticAnalysis,
    CitationContextAnalysis,
)


class AIGroundTruthValidator:
    """
    Validates LLM-generated semantic extractions against deterministic ground truth.
    Ensures Gemini hallucinations (such as claimed brand mentions, fabricated citations,
    or phantom competitors) are detected, reconciled, and marked UNVERIFIED.
    """

    @staticmethod
    def normalize_text(text: str) -> str:
        """Lowers case and removes non-alphanumeric noise for robust substring matching."""
        if not text:
            return ""
        return re.sub(r"[^\w\s]", " ", text.lower())

    @classmethod
    def verify_string_presence(cls, query: str, document: str) -> bool:
        """Determines whether query string or reasonable token variations appear in document."""
        if not query or not document:
            return False

        q_norm = cls.normalize_text(query).strip()
        doc_norm = cls.normalize_text(document)

        if not q_norm:
            return False

        # 1. Exact phrase match
        if q_norm in doc_norm:
            return True

        # 2. Token boundary regex match
        tokens = [re.escape(t) for t in q_norm.split() if len(t) > 2]
        if tokens:
            pattern = r"\b" + r"\s+".join(tokens) + r"\b"
            if re.search(pattern, doc_norm):
                return True

        return False

    @classmethod
    def validate_aeo_analysis(
        cls,
        analysis: AEOAnswerSemanticAnalysis,
        answer_text: str,
        brand_name: str,
        domain: str,
        known_aliases: Optional[List[str]] = None,
    ) -> AEOAnswerSemanticAnalysis:
        """
        Cross-validates Gemini's AEO answer analysis against literal text of the answer.
        """
        doc = answer_text or ""
        aliases = [brand_name, domain.replace("www.", "").split(".")[0]]
        if known_aliases:
            aliases.extend(known_aliases)

        # Check if brand is physically present
        brand_found = any(cls.verify_string_presence(alias, doc) for alias in aliases if alias)

        if analysis.brand_mentioned and not brand_found:
            # Inconsistency: Model claims brand was mentioned, but deterministic check disagrees
            analysis.brand_mentioned = False
            analysis.brand_recommended = False
            analysis.recommendation_strength = "none"
            analysis.verification_status = "UNVERIFIED"
            analysis.confidence = min(analysis.confidence, 0.45)
        elif not analysis.brand_mentioned and brand_found:
            # Model missed the mention, but deterministic check found it!
            analysis.brand_mentioned = True
            analysis.verification_status = "VERIFIED"
        else:
            # Consistent
            analysis.verification_status = "VERIFIED" if analysis.confidence >= 0.70 else "NEEDS_REVIEW"

        # Validate competitors: Remove competitors that are completely absent from the answer text
        verified_competitors = []
        for comp in analysis.competitors_mentioned:
            if cls.verify_string_presence(comp, doc):
                verified_competitors.append(comp)
        analysis.competitors_mentioned = verified_competitors

        # Validate official domain citation
        domain_clean = domain.lower().replace("https://", "").replace("http://", "").rstrip("/")
        if analysis.official_domain_cited and (domain_clean not in doc.lower()):
            analysis.official_domain_cited = False

        return analysis

    @classmethod
    def validate_geo_analysis(
        cls,
        analysis: GEOAnswerSemanticAnalysis,
        answer_text: str,
        brand_name: str,
        domain: str,
        known_aliases: Optional[List[str]] = None,
    ) -> GEOAnswerSemanticAnalysis:
        """
        Cross-validates Gemini's GEO answer analysis against literal text of the answer.
        """
        doc = answer_text or ""
        aliases = [brand_name, domain.replace("www.", "").split(".")[0]]
        if known_aliases:
            aliases.extend(known_aliases)

        brand_found = any(cls.verify_string_presence(alias, doc) for alias in aliases if alias)

        if analysis.brand_mentioned and not brand_found:
            analysis.brand_mentioned = False
            analysis.brand_recommended = False
            analysis.recommendation_strength = "NOT_MENTIONED"
            analysis.verification_status = "UNVERIFIED"
            analysis.confidence = min(analysis.confidence, 0.40)
        elif not analysis.brand_mentioned and brand_found:
            analysis.brand_mentioned = True
            if analysis.recommendation_strength == "NOT_MENTIONED":
                analysis.recommendation_strength = "MENTIONED"
            analysis.verification_status = "VERIFIED"
        else:
            analysis.verification_status = "VERIFIED" if analysis.confidence >= 0.70 else "NEEDS_REVIEW"

        # Validate competitors list
        verified_comps = []
        for comp_dict in analysis.competitors:
            comp_name = comp_dict.get("name", "") if isinstance(comp_dict, dict) else str(comp_dict)
            if cls.verify_string_presence(comp_name, doc):
                verified_comps.append(comp_dict)
        analysis.competitors = verified_comps

        # Validate domain citations
        domain_clean = domain.lower().replace("https://", "").replace("http://", "").rstrip("/")
        if analysis.official_domain_cited and (domain_clean not in doc.lower()):
            analysis.official_domain_cited = False

        return analysis

    @classmethod
    def validate_citation(
        cls,
        analysis: CitationContextAnalysis,
        actual_citations: List[str],
        domain: str,
    ) -> CitationContextAnalysis:
        """
        Validates citation against actual verified URLs to prevent fabricated citations.
        """
        # Ensure citation URL exists in verified list
        target_parsed = urlparse(analysis.citation_url)
        target_domain = target_parsed.netloc.lower()

        matched = False
        for actual in actual_citations:
            act_parsed = urlparse(actual)
            if target_domain and target_domain == act_parsed.netloc.lower():
                matched = True
                break

        if not matched and actual_citations:
            analysis.confidence = min(analysis.confidence, 0.50)

        # Re-verify official domain match
        clean_domain = domain.lower().replace("https://", "").replace("http://", "").rstrip("/")
        if clean_domain in target_domain:
            analysis.is_official_domain = True
        else:
            analysis.is_official_domain = False

        return analysis
