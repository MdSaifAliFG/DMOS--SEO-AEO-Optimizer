from __future__ import annotations
from typing import Any, Dict, List
from app.models.aeo import AeoCitation, AeoProject, AeoQuestion


class CitationGapAnalyzer:
    """
    Analyzes citations across tracked questions to identify:
    - Questions with no citations to own domain
    - Competitor citations vs brand citations
    - Highly cited third-party source domains
    - High-priority citation earning opportunities
    """

    @staticmethod
    def analyze(
        project: AeoProject,
        questions: List[AeoQuestion],
        citations: List[AeoCitation],
    ) -> Dict[str, Any]:
        own_domain = (project.domain or "").lower()
        total_citations = len(citations)

        own_citations = [c for c in citations if c.citation_type == "own_domain" or own_domain in c.domain.lower()]
        competitor_citations = [c for c in citations if c.citation_type == "competitor"]
        third_party_citations = [c for c in citations if c.citation_type not in ["own_domain", "competitor"] and own_domain not in c.domain.lower()]

        own_share = round((len(own_citations) / max(1, total_citations)) * 100, 1)

        # Domain frequency aggregation
        domain_counts: Dict[str, Dict[str, Any]] = {}
        for c in citations:
            d = c.domain.lower()
            is_own = bool(c.citation_type == "own_domain" or own_domain in d)
            is_comp = bool(c.citation_type == "competitor")
            if d not in domain_counts:
                domain_counts[d] = {
                    "domain": c.domain,
                    "count": 0,
                    "is_own": is_own,
                    "is_competitor": is_comp,
                    "citation_type": c.citation_type,
                }
            domain_counts[d]["count"] += 1

        top_sources = sorted(domain_counts.values(), key=lambda x: x["count"], reverse=True)[:10]

        # Opportunities where answers have citations but none to own domain
        opportunities: List[Dict[str, Any]] = []
        for q in questions:
            q_cits = q.citations or []
            q_own_cits = [c for c in q_cits if c.citation_type == "own_domain" or own_domain in c.domain.lower()]
            q_comp_cits = [c for c in q_cits if c.citation_type == "competitor"]

            if len(q_cits) > 0 and len(q_own_cits) == 0:
                comp_sources = [c.domain for c in q_comp_cits]
                top_cited_on_q = [c.domain for c in q_cits[:3]]

                priority = "high" if len(q_comp_cits) > 0 else "medium"
                if q.intent in ["commercial", "transactional"] and len(q_comp_cits) > 0:
                    priority = "critical"

                opportunities.append({
                    "question_id": q.id,
                    "prompt": q.question_text,
                    "category": q.category or "General",
                    "intent": q.intent or "informational",
                    "total_citations": len(q_cits),
                    "own_citations_count": 0,
                    "competitor_sources": comp_sources,
                    "cited_domains": top_cited_on_q,
                    "priority": priority,
                    "recommendation": f"Publish canonical documentation or authority guide to secure citations for '{q.question_text}'.",
                })

        return {
            "total_citations": total_citations,
            "own_citations_count": len(own_citations),
            "competitor_citations_count": len(competitor_citations),
            "third_party_citations_count": len(third_party_citations),
            "own_citation_share": own_share,
            "top_cited_domains": top_sources,
            "opportunities": sorted(
                opportunities,
                key=lambda x: (0 if x["priority"] == "critical" else 1 if x["priority"] == "high" else 2)
            ),
        }
