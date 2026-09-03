from __future__ import annotations
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.aeo import (
    AeoCitation,
    AeoEntity,
    AeoProject,
    AeoQuestion,
    AeoRecommendation,
)
from app.services.aeo.optimization.gap_analyzer import AEOGapAnalysisEngine
from app.services.aeo.optimization.impact_calculator import AEOImpactCalculator
from app.services.aeo.optimization.priority_calculator import AEOPriorityCalculator
from app.services.aeo.optimization.recommendation_catalog import AEO_RECOMMENDATION_CATALOG
from app.services.aeo.visibility_scorer import AeoScoreBreakdown


class AEORecommendationEngine:
    """
    High-Fidelity AEO Optimization & Recommendation Generation Engine.
    Converts real gap analysis signals into prioritized, explainable optimization tasks.
    Enforces deterministic scoring, recoverable impact calculation, and deduplication.
    """

    @classmethod
    def generate_recommendations(
        cls,
        score_breakdown: AeoScoreBreakdown,
        project: Optional[AeoProject] = None,
        questions: Optional[List[AeoQuestion]] = None,
        citations: Optional[List[AeoCitation]] = None,
        entities: Optional[List[AeoEntity]] = None,
        # Legacy parameter support
        brand_name: Optional[str] = None,
        domain: Optional[str] = None,
        unmentioned_questions: Optional[List[str]] = None,
        competitor_stats: Optional[List[Dict[str, Any]]] = None,
        total_citations: int = 0,
        own_citations: int = 0,
        **kwargs: Any,
    ) -> List[Dict[str, Any]]:
        # Handle fallback if project not passed
        if project is None:
            b_name = brand_name or "Brand"
            d_name = domain or "example.com"
            project = AeoProject(
                name=b_name,
                brand_name=b_name,
                domain=d_name,
                industry="General",
                competitors=competitor_stats or [],
            )

        if questions is None:
            questions = []
            for uq in (unmentioned_questions or []):
                q = AeoQuestion(
                    project_id=project.id or "dummy",
                    question_text=uq,
                    brand_mentioned=False,
                    category="General",
                    intent="informational",
                )
                questions.append(q)

        if citations is None:
            citations = []
            for _ in range(own_citations):
                citations.append(AeoCitation(
                    project_id=project.id or "dummy",
                    domain=project.domain,
                    source_url=f"https://{project.domain}",
                    citation_type="own_domain",
                ))
            for i in range(max(0, total_citations - own_citations)):
                citations.append(AeoCitation(
                    project_id=project.id or "dummy",
                    domain=f"thirdparty{i}.com",
                    source_url=f"https://thirdparty{i}.com",
                    citation_type="third_party",
                ))

        if entities is None:
            entities = []

        brand_name = project.brand_name or project.name
        domain = project.domain
        current_score = score_breakdown.overall_score

        # Run multi-dimensional gap analysis
        gap_results = AEOGapAnalysisEngine.run_full_gap_analysis(
            project=project,
            questions=questions,
            citations=citations,
            entities=entities,
        )

        prompt_gaps = gap_results["prompt_gaps"]
        citation_gaps = gap_results["citation_gaps"]
        entity_gaps = gap_results["entity_gaps"]
        competitor_gaps = gap_results["competitor_gaps"]
        content_gaps = gap_results["content_gaps"]

        recommendations: List[Dict[str, Any]] = []

        # Map Catalog Rules by Code
        catalog_map = {r["code"]: r for r in AEO_RECOMMENDATION_CATALOG}

        # 1. Prompt Coverage Gaps
        if prompt_gaps["uncovered_prompts_count"] > 0:
            rule = catalog_map.get("AEO-PROMPT-001")
            if rule:
                uncovered_prompts = [o["prompt"] for o in prompt_gaps["opportunities"][:3]]
                uncovered_preview = ", ".join(f"'{p}'" for p in uncovered_prompts)

                p_score, p_level = AEOPriorityCalculator.calculate_priority(
                    severity=rule["severity"],
                    affected_prompt_count=prompt_gaps["uncovered_prompts_count"],
                    visibility_impact=rule["default_impact"],
                )
                imp, pot = AEOImpactCalculator.calculate_potential(current_score, rule["default_impact"])

                recommendations.append({
                    "recommendation_code": rule["code"],
                    "title": rule["title"],
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "priority": p_level,
                    "priority_level": p_level,
                    "priority_score": p_score,
                    "opportunity_score": p_score,
                    "reason": f"{prompt_gaps['uncovered_prompts_count']} tracked buyer queries currently do not mention {brand_name}.",
                    "why_it_matters": rule["why_it_matters"],
                    "current_state": f"Missing from answers for: {uncovered_preview}.",
                    "recommended_action": rule["how_to_fix"],
                    "how_to_fix": rule["how_to_fix"],
                    "expected_impact": f"+{imp} points estimated recoverable visibility score across answer engines.",
                    "estimated_impact": imp,
                    "current_score": current_score,
                    "potential_score": pot,
                    "affected_prompt_count": prompt_gaps["uncovered_prompts_count"],
                    "affected_answer_count": prompt_gaps["uncovered_prompts_count"] * 3,
                    "affected_urls": [f"https://{domain}/solutions", f"https://{domain}/faq"],
                    "implementation_steps": rule["implementation_steps"],
                    "status": "open",
                })

        # 2. Citation Opportunity Gaps
        if citation_gaps["own_citation_share"] < 40 or len(citation_gaps["opportunities"]) > 0:
            rule = catalog_map.get("AEO-CITE-001")
            if rule:
                top_comp_sources = [d["domain"] for d in citation_gaps["top_cited_domains"] if not d["is_own"]][:3]
                sources_str = ", ".join(top_comp_sources) if top_comp_sources else "external documentation sites"

                p_score, p_level = AEOPriorityCalculator.calculate_priority(
                    severity=rule["severity"],
                    affected_prompt_count=len(citation_gaps["opportunities"]),
                    citation_gap_score=100 - citation_gaps["own_citation_share"],
                    visibility_impact=rule["default_impact"],
                )
                imp, pot = AEOImpactCalculator.calculate_potential(current_score, rule["default_impact"])

                recommendations.append({
                    "recommendation_code": rule["code"],
                    "title": rule["title"],
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "priority": p_level,
                    "priority_level": p_level,
                    "priority_score": p_score,
                    "opportunity_score": p_score,
                    "reason": f"Only {citation_gaps['own_citations_count']} of {citation_gaps['total_citations']} citations point back to {domain}.",
                    "why_it_matters": rule["why_it_matters"],
                    "current_state": f"{domain} holds a {citation_gaps['own_citation_share']}% citation share while AI engines frequently cite {sources_str}.",
                    "recommended_action": rule["how_to_fix"],
                    "how_to_fix": rule["how_to_fix"],
                    "expected_impact": f"+{imp} points increase in referral authority and model grounding confidence.",
                    "estimated_impact": imp,
                    "current_score": current_score,
                    "potential_score": pot,
                    "affected_prompt_count": len(citation_gaps["opportunities"]),
                    "affected_answer_count": len(citation_gaps["opportunities"]) * 2,
                    "affected_urls": [f"https://{domain}/docs", f"https://{domain}/resources"],
                    "implementation_steps": rule["implementation_steps"],
                    "status": "open",
                })

        # 3. Competitor Defense & Comparison Gaps
        if competitor_gaps["total_competitor_gaps_count"] > 0:
            rule = catalog_map.get("AEO-COMP-001")
            if rule:
                top_comps = [c["name"] for c in competitor_gaps["competitors"][:2]]
                comps_str = ", ".join(top_comps) if top_comps else "competing vendors"

                p_score, p_level = AEOPriorityCalculator.calculate_priority(
                    severity=rule["severity"],
                    affected_prompt_count=competitor_gaps["total_competitor_gaps_count"],
                    competitor_gap_score=competitor_gaps["competitors"][0]["mention_rate"] if competitor_gaps["competitors"] else 50,
                    visibility_impact=rule["default_impact"],
                )
                imp, pot = AEOImpactCalculator.calculate_potential(current_score, rule["default_impact"])

                recommendations.append({
                    "recommendation_code": rule["code"],
                    "title": f"Publish Objective Competitor Comparison Against {comps_str}",
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "priority": p_level,
                    "priority_level": p_level,
                    "priority_score": p_score,
                    "opportunity_score": p_score,
                    "reason": f"Competitors ({comps_str}) appear in {competitor_gaps['total_competitor_gaps_count']} search prompts where {brand_name} is absent.",
                    "why_it_matters": rule["why_it_matters"],
                    "current_state": f"Competitors capture higher AI answer prominence on industry alternatives and comparison queries.",
                    "recommended_action": rule["how_to_fix"],
                    "how_to_fix": rule["how_to_fix"],
                    "expected_impact": f"+{imp} points estimated gain on commercial buyer comparison prompts.",
                    "estimated_impact": imp,
                    "current_score": current_score,
                    "potential_score": pot,
                    "affected_prompt_count": competitor_gaps["total_competitor_gaps_count"],
                    "affected_answer_count": competitor_gaps["total_competitor_gaps_count"] * 3,
                    "affected_urls": [f"https://{domain}/vs"],
                    "implementation_steps": rule["implementation_steps"],
                    "status": "open",
                })

        # 4. Entity Knowledge & Schema Gaps
        if entity_gaps["brand_entities_count"] == 0 or entity_gaps["weak_entities_count"] > 0:
            rule = catalog_map.get("AEO-ENTITY-001")
            if rule:
                p_score, p_level = AEOPriorityCalculator.calculate_priority(
                    severity=rule["severity"],
                    affected_prompt_count=entity_gaps["weak_entities_count"],
                    visibility_impact=rule["default_impact"],
                )
                imp, pot = AEOImpactCalculator.calculate_potential(current_score, rule["default_impact"])

                recommendations.append({
                    "recommendation_code": rule["code"],
                    "title": rule["title"],
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "priority": p_level,
                    "priority_level": p_level,
                    "priority_score": p_score,
                    "opportunity_score": p_score,
                    "reason": f"{entity_gaps['weak_entities_count']} detected entities have weak relationship links in AI knowledge graphs.",
                    "why_it_matters": rule["why_it_matters"],
                    "current_state": f"Entity relationships lack explicit Product schema and sameAs ontology connections.",
                    "recommended_action": rule["how_to_fix"],
                    "how_to_fix": rule["how_to_fix"],
                    "expected_impact": f"+{imp} points improvement in entity clarity and semantic retrieval accuracy.",
                    "estimated_impact": imp,
                    "current_score": current_score,
                    "potential_score": pot,
                    "affected_prompt_count": entity_gaps["weak_entities_count"],
                    "affected_answer_count": entity_gaps["weak_entities_count"] * 2,
                    "affected_urls": [f"https://{domain}/about", f"https://{domain}/products"],
                    "implementation_steps": rule["implementation_steps"],
                    "status": "open",
                })

        # 5. Pricing Transparency
        has_pricing_q = any("pricing" in q.question_text.lower() or "cost" in q.question_text.lower() for q in questions)
        pricing_uncovered = any(
            ("pricing" in q.question_text.lower() or "cost" in q.question_text.lower()) and not q.brand_mentioned
            for q in questions
        )
        if pricing_uncovered or not has_pricing_q:
            rule = catalog_map.get("AEO-PRICE-001")
            if rule:
                p_score, p_level = AEOPriorityCalculator.calculate_priority(
                    severity=rule["severity"],
                    affected_prompt_count=2,
                    visibility_impact=rule["default_impact"],
                )
                imp, pot = AEOImpactCalculator.calculate_potential(current_score, rule["default_impact"])

                recommendations.append({
                    "recommendation_code": rule["code"],
                    "title": rule["title"],
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "priority": p_level,
                    "priority_level": p_level,
                    "priority_score": p_score,
                    "opportunity_score": p_score,
                    "reason": "AI answer models frequently fail to answer pricing queries when plans are not publicly structured.",
                    "why_it_matters": rule["why_it_matters"],
                    "current_state": "Pricing parameters are not parsed as structured Offer specifications by answer engines.",
                    "recommended_action": rule["how_to_fix"],
                    "how_to_fix": rule["how_to_fix"],
                    "expected_impact": f"+{imp} points gain in pricing prompt visibility.",
                    "estimated_impact": imp,
                    "current_score": current_score,
                    "potential_score": pot,
                    "affected_prompt_count": 2,
                    "affected_answer_count": 6,
                    "affected_urls": [f"https://{domain}/pricing"],
                    "implementation_steps": rule["implementation_steps"],
                    "status": "open",
                })

        # 6. FAQ & Direct Answer Formatting
        rule_faq = catalog_map.get("AEO-FAQ-001")
        if rule_faq and score_breakdown.coverage_score < 80:
            p_score, p_level = AEOPriorityCalculator.calculate_priority(
                severity=rule_faq["severity"],
                affected_prompt_count=len(prompt_gaps["opportunities"][:4]),
                visibility_impact=rule_faq["default_impact"],
            )
            imp, pot = AEOImpactCalculator.calculate_potential(current_score, rule_faq["default_impact"])

            recommendations.append({
                "recommendation_code": rule_faq["code"],
                "title": rule_faq["title"],
                "category": rule_faq["category"],
                "severity": rule_faq["severity"],
                "priority": p_level,
                "priority_level": p_level,
                "priority_score": p_score,
                "opportunity_score": p_score,
                "reason": "Top recurring industry prompts lack direct FAQ schema grounding on primary solution pages.",
                "why_it_matters": rule_faq["why_it_matters"],
                "current_state": "Conversational questions are not marked up with valid JSON-LD FAQPage schemas.",
                "recommended_action": rule_faq["how_to_fix"],
                "how_to_fix": rule_faq["how_to_fix"],
                "expected_impact": f"+{imp} points increase in direct conversational snippet extraction.",
                "estimated_impact": imp,
                "current_score": current_score,
                "potential_score": pot,
                "affected_prompt_count": min(6, len(prompt_gaps["opportunities"])),
                "affected_answer_count": min(18, len(prompt_gaps["opportunities"]) * 3),
                "affected_urls": [f"https://{domain}/features", f"https://{domain}/faq"],
                "implementation_steps": rule_faq["implementation_steps"],
                "status": "open",
            })

        # Sort recommendations by priority score descending
        return sorted(recommendations, key=lambda x: x["priority_score"], reverse=True)

    @classmethod
    async def sync_recommendations_to_db(
        cls,
        db: AsyncSession,
        project_id: str,
        generated_recs: List[Dict[str, Any]],
    ) -> List[AeoRecommendation]:
        """
        Deduplicates recommendations against existing database records.
        - If existing recommendation with same code exists and is unresolved (open/in_progress), updates its metrics.
        - If recommendation is new, inserts it.
        - Does NOT overwrite manually modified notes or status of fixed/ignored items.
        """
        existing_res = await db.execute(
            select(AeoRecommendation).where(AeoRecommendation.project_id == project_id)
        )
        existing_recs = list(existing_res.scalars().all())
        existing_map = {r.recommendation_code or r.title: r for r in existing_recs}

        synced: List[AeoRecommendation] = []

        for g in generated_recs:
            code = g.get("recommendation_code") or g.get("title")
            existing = existing_map.get(code)

            if existing:
                # Update metrics if unresolved
                if existing.status in ["open", "in_progress"]:
                    existing.priority_score = g.get("priority_score", existing.priority_score)
                    existing.priority_level = g.get("priority_level", existing.priority_level)
                    existing.priority = g.get("priority", existing.priority)
                    existing.opportunity_score = g.get("opportunity_score", existing.opportunity_score)
                    existing.estimated_impact = g.get("estimated_impact", existing.estimated_impact)
                    existing.current_score = g.get("current_score", existing.current_score)
                    existing.potential_score = g.get("potential_score", existing.potential_score)
                    existing.affected_prompt_count = g.get("affected_prompt_count", existing.affected_prompt_count)
                    existing.affected_answer_count = g.get("affected_answer_count", existing.affected_answer_count)
                    existing.affected_urls = g.get("affected_urls", existing.affected_urls)
                    existing.current_state = g.get("current_state", existing.current_state)
                synced.append(existing)
            else:
                new_rec = AeoRecommendation(
                    project_id=project_id,
                    recommendation_code=g.get("recommendation_code"),
                    title=g["title"],
                    category=g.get("category", "Content Opportunity"),
                    severity=g.get("severity", "medium"),
                    priority=g.get("priority", "medium"),
                    priority_score=g.get("priority_score", 70),
                    priority_level=g.get("priority_level", "medium"),
                    opportunity_score=g.get("opportunity_score", 70),
                    reason=g.get("reason", ""),
                    why_it_matters=g.get("why_it_matters"),
                    current_state=g.get("current_state", ""),
                    recommended_action=g.get("recommended_action", ""),
                    how_to_fix=g.get("how_to_fix"),
                    expected_impact=g.get("expected_impact", ""),
                    estimated_impact=g.get("estimated_impact", 5),
                    current_score=g.get("current_score"),
                    potential_score=g.get("potential_score"),
                    affected_prompt_count=g.get("affected_prompt_count", 0),
                    affected_answer_count=g.get("affected_answer_count", 0),
                    affected_urls=g.get("affected_urls", []),
                    implementation_steps=g.get("implementation_steps", []),
                    status=g.get("status", "open"),
                )
                db.add(new_rec)
                synced.append(new_rec)

        await db.commit()
        for r in synced:
            await db.refresh(r)

        return synced
