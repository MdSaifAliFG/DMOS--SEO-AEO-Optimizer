from __future__ import annotations
from typing import Any, Dict, List, Optional


class GEOConsistencyEngine:
    """Verifies brand entity consistency across web pages, schemas, and brand profiles."""

    def evaluate_consistency(
        self,
        brand_profile: Dict[str, Any],
        website_pages: List[Dict[str, Any]],
        schemas: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Returns consistency evaluation, score (0-100), and detected inconsistency issues.
        """
        issues: List[Dict[str, Any]] = []
        checks_passed = 0
        total_checks = 6

        brand_name = (brand_profile.get("brand_name") or "").strip()
        industry = (brand_profile.get("industry") or "").strip()
        products = brand_profile.get("products", [])

        # 1. Check Homepage Brand Presence
        homepage = next((p for p in website_pages if p.get("url", "").rstrip("/").count("/") <= 3), None)
        if not homepage and website_pages:
            homepage = website_pages[0]

        if homepage:
            h_text = (homepage.get("title", "") + " " + homepage.get("h1", "") + " " + homepage.get("content", "")).lower()
            if brand_name.lower() in h_text:
                checks_passed += 1
            else:
                issues.append({
                    "issue_code": "GEO037",
                    "category": "Consistency",
                    "title": "Brand Name Inconsistent on Homepage",
                    "description": f"The canonical brand name '{brand_name}' does not appear prominently in the homepage title or H1.",
                    "severity": "high",
                    "affected_urls": [homepage.get("url", "/")],
                    "evidence": {"brand": brand_name, "homepage_title": homepage.get("title")},
                })
        else:
            issues.append({
                "issue_code": "GEO033",
                "category": "Technical",
                "title": "Important Homepage Inaccessible",
                "description": "The crawler could not verify homepage content for entity extraction.",
                "severity": "high",
                "affected_urls": ["/"],
                "evidence": {},
            })

        # 2. Check Organization Schema
        org_schema = next((s for s in (schemas or []) if s.get("@type") in ("Organization", "Corporation", "LocalBusiness")), None)
        if org_schema:
            checks_passed += 1
            # Check schema name matches brand name
            schema_name = (org_schema.get("name") or "").strip()
            if schema_name and schema_name.lower() != brand_name.lower():
                issues.append({
                    "issue_code": "GEO013",
                    "category": "Consistency",
                    "title": "Organization Schema Entity Inconsistency",
                    "description": f"Organization schema specifies '{schema_name}' which does not match canonical brand name '{brand_name}'.",
                    "severity": "critical",
                    "affected_urls": [homepage.get("url", "/") if homepage else "/"],
                    "evidence": {"schema_name": schema_name, "canonical_name": brand_name},
                })

            # Check sameAs links in schema
            same_as = org_schema.get("sameAs", [])
            if same_as and len(same_as) > 0:
                checks_passed += 1
            else:
                issues.append({
                    "issue_code": "GEO016",
                    "category": "Consistency",
                    "title": "Missing sameAs Authority Links in Schema",
                    "description": "Organization schema lacks 'sameAs' links pointing to verified social profiles, Wikipedia, or Crunchbase.",
                    "severity": "medium",
                    "affected_urls": [homepage.get("url", "/") if homepage else "/"],
                    "evidence": {},
                })
        else:
            issues.append({
                "issue_code": "GEO014",
                "category": "Consistency",
                "title": "Missing Organization Schema",
                "description": "No Organization or LocalBusiness structured data was detected to anchor the brand entity.",
                "severity": "high",
                "affected_urls": [homepage.get("url", "/") if homepage else "/"],
                "evidence": {},
            })

        # 3. Check Product Consistency
        if products and website_pages:
            all_content = " ".join((p.get("content") or "") for p in website_pages).lower()
            missing_products = [p for p in products if p.lower() not in all_content]
            if not missing_products:
                checks_passed += 1
            else:
                issues.append({
                    "issue_code": "GEO038",
                    "category": "Consistency",
                    "title": "Product Fact Inconsistency",
                    "description": f"Canonical products {missing_products[:2]} are missing or not clearly defined on crawled pages.",
                    "severity": "medium",
                    "affected_urls": [p.get("url", "/") for p in website_pages[:2]],
                    "evidence": {"missing_products": missing_products},
                })
        else:
            checks_passed += 1

        # 4. Check About / Contact Page
        about_page = next((p for p in website_pages if any(term in p.get("url", "").lower() for term in ["about", "company", "contact"])), None)
        if about_page:
            checks_passed += 1
        else:
            issues.append({
                "issue_code": "GEO025",
                "category": "Authority",
                "title": "Missing or Unlinked About Page",
                "description": "No dedicated About Us or Company overview page was identified to establish entity trust.",
                "severity": "medium",
                "affected_urls": [],
                "evidence": {},
            })

        # 5. Check Pricing Presence
        pricing_page = next((p for p in website_pages if "pricing" in p.get("url", "").lower() or "price" in p.get("title", "").lower()), None)
        if pricing_page or brand_profile.get("pricing_model"):
            checks_passed += 1
        else:
            issues.append({
                "issue_code": "GEO010",
                "category": "Commercial",
                "title": "Missing Pricing Information",
                "description": "Generative search buyers frequently query pricing, but no pricing page or model is published.",
                "severity": "medium",
                "affected_urls": [],
                "evidence": {},
            })

        consistency_score = int((checks_passed / max(1, total_checks)) * 100)
        status = "consistent"
        if consistency_score < 40:
            status = "inconsistent"
        elif consistency_score < 75:
            status = "partially_consistent"

        return {
            "consistency_score": consistency_score,
            "consistency_status": status,
            "checks_passed": checks_passed,
            "total_checks": total_checks,
            "issues": issues,
        }
