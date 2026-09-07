from __future__ import annotations
import re
from typing import Any, Dict, List, Optional


class GEOAuthorityEngine:
    """Analyzes first-party on-site trust, authority, and E-E-A-T signals without fabricated backlink metrics."""

    SIGNALS = [
        "about_page",
        "author_bios",
        "organization_info",
        "contact_info",
        "case_studies",
        "testimonials",
        "reviews",
        "documentation",
        "original_research",
        "statistics",
    ]

    def evaluate_authority(
        self,
        pages: List[Dict[str, Any]],
        brand_profile: Dict[str, Any],
    ) -> Dict[str, Any]:
        signal_results: Dict[str, Dict[str, Any]] = {}
        issues: List[Dict[str, Any]] = []

        all_text = " ".join((p.get("content") or "") for p in pages).lower()
        all_urls = [p.get("url", "").lower() for p in pages]

        # 1. About Page
        has_about = any("about" in u or "company" in u for u in all_urls)
        signal_results["about_page"] = {
            "status": "Strong" if has_about and len(brand_profile.get("long_description") or "") > 50 else ("Present" if has_about else "Missing"),
            "details": "Dedicated About/Company page detected." if has_about else "No explicit About page identified.",
        }

        # 2. Author Information
        has_authors = bool(re.search(r"\b(author|written by|reviewed by|byline|contributor)\b", all_text))
        signal_results["author_bios"] = {
            "status": "Present" if has_authors else "Missing",
            "details": "Author bylines/attribution detected on content." if has_authors else "No author attribution found on articles.",
        }

        # 3. Organization Information
        has_org = bool(brand_profile.get("legal_name") or brand_profile.get("social_links"))
        signal_results["organization_info"] = {
            "status": "Strong" if has_org else "Weak",
            "details": "Legal corporate name or social links registered." if has_org else "Sparse organization details.",
        }

        # 4. Contact Information
        has_contact = any("contact" in u or "support" in u for u in all_urls) or bool(brand_profile.get("contact_url") or brand_profile.get("support_url"))
        signal_results["contact_info"] = {
            "status": "Strong" if has_contact else "Missing",
            "details": "Contact and support communication channels verified." if has_contact else "Missing verifiable contact channels.",
        }

        # 5. Case Studies
        has_cases = any("case-stud" in u or "customer" in u for u in all_urls) or "case study" in all_text
        signal_results["case_studies"] = {
            "status": "Present" if has_cases else "Missing",
            "details": "Case studies and customer success stories found." if has_cases else "No case studies identified.",
        }
        if not has_cases:
            issues.append({
                "issue_code": "GEO027",
                "category": "Authority",
                "title": "Missing Case Studies & Customer Evidence",
                "description": "Customer case studies provide high-value empirical evidence cited by generative AI engines.",
                "severity": "medium",
                "affected_urls": [],
                "evidence": {},
            })

        # 6. Testimonials & Reviews
        has_reviews = "testimonial" in all_text or "customer review" in all_text or "rating" in all_text
        signal_results["testimonials"] = {
            "status": "Present" if has_reviews else "Weak",
            "details": "User reviews or client testimonials detected." if has_reviews else "Minimal testimonial evidence found on site.",
        }

        # 7. Documentation
        has_docs = any("docs" in u or "api" in u or "guide" in u for u in all_urls) or bool(brand_profile.get("documentation_url"))
        signal_results["documentation"] = {
            "status": "Strong" if has_docs else "Missing",
            "details": "Technical documentation or API references available." if has_docs else "No public technical documentation linked.",
        }
        if not has_docs:
            issues.append({
                "issue_code": "GEO026",
                "category": "Authority",
                "title": "Missing Public Documentation",
                "description": "Technical documentation is a primary citation source for AI answer engines.",
                "severity": "low",
                "affected_urls": [],
                "evidence": {},
            })

        # 8. Original Research & Statistics
        has_research = bool(re.search(r"\b(survey|benchmark|original research|whitepaper|industry report|our study)\b", all_text))
        signal_results["original_research"] = {
            "status": "Present" if has_research else "Missing",
            "details": "Proprietary research or survey data detected." if has_research else "No original research publications identified.",
        }
        if not has_research:
            issues.append({
                "issue_code": "GEO028",
                "category": "Authority",
                "title": "Missing Original Research & Benchmarks",
                "description": "Original data and benchmarks attract authoritative third-party AI citations.",
                "severity": "low",
                "affected_urls": [],
                "evidence": {},
            })

        # Calculate score based on present/strong signals
        score_map = {"Strong": 10, "Present": 7, "Weak": 3, "Missing": 0}
        total_points = sum(score_map.get(s["status"], 0) for s in signal_results.values())
        max_possible = len(signal_results) * 10
        authority_score = min(100, int((total_points / max(1, max_possible)) * 100))

        return {
            "authority_score": authority_score,
            "external_authority_status": "External authority data not connected.",
            "signals": signal_results,
            "issues": issues,
        }
