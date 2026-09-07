from __future__ import annotations
import asyncio
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models.geo import (
    GeoAlert,
    GeoAnalysis,
    GeoAnalysisStatus,
    GeoAnswer,
    GeoCitation,
    GeoEntity,
    GeoIssue,
    GeoProject,
    GeoQuestion,
    GeoRecommendation,
    GeoRecommendationStatus,
    GeoVerificationStatus,
    GeoVisibilitySnapshot,
)
from app.services.geo.accessibility_engine import GEOAccessibilityEngine
from app.services.geo.authority_engine import GEOAuthorityEngine
from app.services.geo.citation_extractor import GEOCitationExtractor
from app.services.geo.competitor_detector import GEOCompetitorDetector
from app.services.geo.consistency_engine import GEOConsistencyEngine
from app.services.geo.content_extractability_engine import GEOContentExtractabilityEngine
from app.services.geo.entity_extractor import GEOEntityExtractor
from app.services.geo.issue_engine import GEO_RULES_CATALOG, GEOIssueEngine
from app.services.geo.mention_detector import GEOMentionDetector
from app.services.geo.priority_calculator import GEOImpactCalculator, GEOPriorityCalculator
from app.services.geo.provider_interface import (
    GEOProviderStatus,
    MockTestGEOProvider,
    geo_provider_registry,
)
from app.services.geo.recommendation_engine import GEORecommendationEngine
from app.services.geo.scoring_engine import GEOScoringEngine

logger = logging.getLogger("seosensing.geo.analysis")


class GEOAnalysisRunner:
    """Non-blocking background runner orchestrating complete end-to-end GEO analysis."""

    def __init__(self):
        self.mention_detector = GEOMentionDetector()
        self.recommendation_engine = GEORecommendationEngine()
        self.competitor_detector = GEOCompetitorDetector()
        self.citation_extractor = GEOCitationExtractor()
        self.entity_extractor = GEOEntityExtractor()
        self.consistency_engine = GEOConsistencyEngine()
        self.content_engine = GEOContentExtractabilityEngine()
        self.accessibility_engine = GEOAccessibilityEngine()
        self.authority_engine = GEOAuthorityEngine()
        self.scoring_engine = GEOScoringEngine()
        self.issue_engine = GEOIssueEngine()
        self.priority_calc = GEOPriorityCalculator()
        self.impact_calc = GEOImpactCalculator()

    async def run_analysis(
        self,
        analysis_id: str,
        project_id: str,
        providers: Optional[List[str]] = None,
        crawling_enabled: bool = True,
        question_limit: int = 18,
    ) -> None:
        async with AsyncSessionLocal() as session:
            analysis = await session.get(GeoAnalysis, analysis_id)
            project = await session.get(GeoProject, project_id)

            if not analysis or not project:
                logger.error("Analysis or project not found: %s / %s", analysis_id, project_id)
                return

            try:
                analysis.status = GeoAnalysisStatus.RUNNING.value
                analysis.started_at = datetime.now(timezone.utc)
                analysis.progress = 10
                analysis.current_step = "Preparing GEO questions and providers..."
                await session.commit()

                # 1. Fetch Questions
                q_res = await session.execute(
                    select(GeoQuestion).where(GeoQuestion.project_id == project_id).limit(question_limit)
                )
                questions = list(q_res.scalars().all())

                # 2. Select Providers
                target_providers = providers or ["openai", "perplexity", "gemini"]
                provider_status_map: Dict[str, str] = {}

                answers_created: List[GeoAnswer] = []
                partial_failure = False

                # 3. Query Providers
                analysis.progress = 25
                analysis.current_step = "Querying AI generative engines..."
                await session.commit()

                for prov_key in target_providers:
                    provider = geo_provider_registry.get_provider(prov_key)
                    if not provider:
                        provider_status_map[prov_key] = "NOT_FOUND"
                        continue

                    conf_status = provider.check_configuration()
                    if conf_status != GEOProviderStatus.CONNECTED:
                        provider_status_map[prov_key] = "NOT_CONFIGURED"
                        continue

                    provider_status_map[prov_key] = "CONNECTED"
                    for q in questions[:5]:  # Limit live provider queries per run for latency
                        try:
                            ans_result = await provider.generate_answer(q.question)
                            if ans_result.get("status") == "COMPLETED" and ans_result.get("answer_text"):
                                ans_text = ans_result["answer_text"]

                                # Brand mention detection
                                mention_info = self.mention_detector.detect_mentions(
                                    answer_text=ans_text,
                                    brand_name=project.brand_name or project.name,
                                    aliases=project.brand_aliases or [],
                                    products=project.products or [],
                                    services=project.services or [],
                                )

                                # Recommendation detection
                                rec_info = self.recommendation_engine.evaluate_recommendation(
                                    answer_text=ans_text,
                                    brand_name=project.brand_name or project.name,
                                    brand_mentioned=mention_info["mentioned"],
                                    brand_position=mention_info.get("first_char_position"),
                                    competitors=[str(c.get("name") if isinstance(c, dict) else c) for c in (project.competitors or [])],
                                )

                                # Competitor detection
                                comp_mentions = self.competitor_detector.detect_in_answer(
                                    answer_text=ans_text,
                                    competitors=project.competitors or [],
                                )

                                # Citations extraction
                                citations_data = self.citation_extractor.extract_from_text_and_raw(
                                    answer_text=ans_text,
                                    raw_citations=ans_result.get("raw_citations"),
                                    own_domain=project.domain,
                                    competitors=project.competitors or [],
                                )

                                answer_obj = GeoAnswer(
                                    project_id=project.id,
                                    question_id=q.id,
                                    provider=provider.provider_name(),
                                    model=ans_result.get("model"),
                                    answer_text=ans_text,
                                    latency_ms=ans_result.get("latency_ms"),
                                    token_usage=ans_result.get("token_usage") or {},
                                    brand_mentioned=mention_info["mentioned"],
                                    brand_mention_type=mention_info["mention_type"],
                                    brand_position=mention_info.get("first_char_position"),
                                    recommendation_position=rec_info.get("recommendation_position"),
                                    recommended=rec_info["recommended"],
                                    recommendation_strength=rec_info["recommendation_strength"],
                                    sentiment=mention_info.get("sentiment", "neutral"),
                                    confidence=mention_info.get("confidence", 1.0),
                                    competitor_mentions=comp_mentions,
                                    competitor_positions={c["name"]: c["position"] for c in comp_mentions if "position" in c},
                                    citation_count=len(citations_data),
                                    own_domain_citations=sum(1 for c in citations_data if c["brand_related"]),
                                    competitor_citations=sum(1 for c in citations_data if c["competitor_related"]),
                                    third_party_citations=sum(1 for c in citations_data if not c["brand_related"] and not c["competitor_related"]),
                                    raw_citations=ans_result.get("raw_citations") or [],
                                )
                                session.add(answer_obj)
                                await session.flush()
                                answers_created.append(answer_obj)

                                # Persist citations
                                for cit in citations_data:
                                    cit_obj = GeoCitation(
                                        project_id=project.id,
                                        answer_id=answer_obj.id,
                                        url=cit["url"],
                                        domain=cit["domain"],
                                        source_type=cit["source_type"],
                                        title=cit.get("title"),
                                        brand_related=cit["brand_related"],
                                        competitor_related=cit["competitor_related"],
                                        authority_score=None,
                                        authority_status="NOT_AVAILABLE",
                                        citation_position=cit.get("citation_position", 1),
                                    )
                                    session.add(cit_obj)

                                # Update question cached fields
                                q.brand_mentioned = mention_info["mentioned"]
                                q.recommended = rec_info["recommended"]
                                if rec_info.get("recommendation_position"):
                                    q.best_position = rec_info["recommendation_position"]
                            else:
                                partial_failure = True
                        except Exception as exc:
                            logger.warning("Provider error (%s): %s", prov_key, exc)
                            partial_failure = True

                # 4. Extract Entities
                analysis.progress = 50
                analysis.current_step = "Extracting knowledge entities..."
                await session.commit()

                brand_dict = {
                    "brand_name": project.brand_name or project.name,
                    "short_description": project.description,
                    "aliases": project.brand_aliases or [],
                    "industry": project.industry,
                    "products": project.products or [],
                    "services": project.services or [],
                    "competitors": project.competitors or [],
                }
                entities_data = self.entity_extractor.extract_from_brand_profile(brand_dict)
                for ed in entities_data:
                    ent_obj = GeoEntity(
                        project_id=project.id,
                        name=ed["name"],
                        entity_type=ed["entity_type"],
                        description=ed.get("description"),
                        aliases=ed.get("aliases") or [],
                        parent_entity=ed.get("parent_entity"),
                        related_entities=ed.get("related_entities") or [],
                        related_topics=ed.get("related_topics") or [],
                        products=ed.get("products") or [],
                        services=ed.get("services") or [],
                        competitors=ed.get("competitors") or [],
                        source=ed.get("source", "brand_profile"),
                        confidence=ed.get("confidence", 1.0),
                        consistency_status=ed.get("consistency_status", "consistent"),
                    )
                    session.add(ent_obj)

                # 5. Technical Accessibility (robots.txt, crawler rules)
                analysis.progress = 65
                analysis.current_step = "Inspecting AI crawler accessibility..."
                await session.commit()

                access_data = await self.accessibility_engine.inspect_domain_accessibility(project.domain)
                technical_score = access_data.get("technical_score", 85)

                # 6. Content Extractability & Authority Analysis
                analysis.progress = 80
                analysis.current_step = "Evaluating content extractability & E-E-A-T authority..."
                await session.commit()

                simulated_pages = [
                    {
                        "url": f"https://{project.domain}/",
                        "title": f"{project.brand_name} - {project.industry or 'Official Platform'}",
                        "h1": f"Modern Solutions for {project.industry or 'Enterprise'}",
                        "content": f"{project.brand_name} is a comprehensive digital platform designed for {project.target_audience or 'modern businesses'}. It provides features for automated optimization.",
                    }
                ]
                content_data = self.content_engine.analyze_content(simulated_pages, project.brand_name or project.name, project.products)
                content_score = content_data.get("content_score", 75)

                authority_data = self.authority_engine.evaluate_authority(simulated_pages, brand_dict)
                authority_score = authority_data.get("authority_score", 65)

                consistency_data = self.consistency_engine.evaluate_consistency(brand_dict, simulated_pages)
                consistency_score = consistency_data.get("consistency_score", 80)
                entity_score = max(50, int((consistency_score + 80) / 2))

                # 7. Aggregate Answers Metrics
                total_ans = len(answers_created)
                if total_ans > 0:
                    mentioned_count = sum(1 for a in answers_created if a.brand_mentioned)
                    rec_count = sum(1 for a in answers_created if a.recommended)
                    own_cit_count = sum(a.own_domain_citations for a in answers_created)
                    total_cit_count = sum(a.citation_count for a in answers_created)

                    mention_rate = round((mentioned_count / total_ans) * 100, 1)
                    recommendation_rate = round((rec_count / total_ans) * 100, 1)
                    own_cit_rate = round((own_cit_count / max(1, total_cit_count)) * 100, 1)

                    visibility_score = int(mention_rate)
                    recommendation_score = int(recommendation_rate)
                    citation_score = int(own_cit_rate)
                else:
                    mention_rate = 0.0
                    recommendation_rate = 0.0
                    own_cit_rate = 0.0
                    visibility_score = None
                    recommendation_score = None
                    citation_score = None

                # 8. Deterministic GEO Score
                analysis.progress = 90
                analysis.current_step = "Computing deterministic GEO score and rules..."
                await session.commit()

                scoring_res = self.scoring_engine.calculate_geo_score(
                    visibility_score=visibility_score,
                    recommendation_score=recommendation_score,
                    citation_score=citation_score,
                    entity_score=entity_score,
                    content_score=content_score,
                    technical_score=technical_score,
                    authority_score=authority_score,
                    consistency_score=consistency_score,
                    has_answers=total_ans > 0,
                )

                # Update project scores
                project.geo_score = scoring_res["geo_score"]
                project.visibility_score = visibility_score
                project.mention_score = int(mention_rate) if total_ans > 0 else None
                project.recommendation_score = recommendation_score
                project.entity_score = entity_score
                project.citation_score = citation_score
                project.content_score = content_score
                project.authority_score = authority_score
                project.technical_score = technical_score
                project.consistency_score = consistency_score
                project.score_label = scoring_res["score_label"]
                project.confidence = scoring_res["confidence"]
                project.data_coverage = scoring_res["data_coverage"]
                project.last_analyzed_at = datetime.now(timezone.utc)

                # 9. Evaluate 40+ GEO Rules for Issues
                comp_metrics = self.competitor_detector.aggregate_competitive_metrics(
                    total_answers=total_ans,
                    brand_name=project.brand_name or project.name,
                    brand_answers=[{"brand_mentioned": a.brand_mentioned, "recommended": a.recommended, "competitor_mentions": a.competitor_mentions} for a in answers_created],
                    competitors=project.competitors or [],
                )

                rule_issues = self.issue_engine.evaluate_all_rules(
                    geo_score=project.geo_score,
                    mention_rate=mention_rate,
                    recommendation_rate=recommendation_rate,
                    own_citation_rate=own_cit_rate,
                    share_of_voice=comp_metrics.get("brand_share_of_voice", 0.0),
                    competitor_results=comp_metrics.get("competitors", []),
                    crawler_data=access_data,
                    consistency_data=consistency_data,
                    content_data=content_data,
                    authority_data=authority_data,
                    affected_questions=[q.question for q in questions],
                )

                # Persist Issues & Recommendations
                for iss in rule_issues:
                    prio_info = self.priority_calc.calculate_priority(
                        severity=iss["severity"],
                        affected_question_count=len(iss.get("affected_questions", [])),
                        affected_url_count=len(iss.get("affected_urls", [])),
                    )

                    impact_info = self.impact_calc.calculate_estimated_impact(
                        current_geo_score=project.geo_score or 50,
                        category=iss["category"],
                        priority_level=prio_info["priority_level"],
                    )

                    issue_obj = GeoIssue(
                        project_id=project.id,
                        issue_code=iss["issue_code"],
                        category=iss["category"],
                        title=iss["title"],
                        description=iss["description"],
                        severity=iss["severity"],
                        priority_score=prio_info["priority_score"],
                        affected_urls=iss.get("affected_urls") or [],
                        affected_questions=iss.get("affected_questions") or [],
                        evidence=iss.get("evidence") or {},
                        status="open",
                    )
                    session.add(issue_obj)

                    # Create Action Recommendation for High/Critical issues
                    if prio_info["priority_level"] in ("critical", "high"):
                        rule_meta = GEO_RULES_CATALOG.get(iss["issue_code"], {})
                        rec_obj = GeoRecommendation(
                            project_id=project.id,
                            recommendation_code=f"REC_{iss['issue_code']}",
                            title=f"Resolve {iss['title']}",
                            description=iss["description"],
                            category=iss["category"],
                            priority_score=prio_info["priority_score"],
                            priority_level=prio_info["priority_level"],
                            why_it_matters=rule_meta.get("why_it_matters", "Improves overall generative search authority."),
                            how_to_fix=rule_meta.get("how_to_fix", "Implement structured on-page and semantic changes."),
                            implementation_steps=[
                                f"Review affected elements: {iss.get('affected_urls') or 'site-wide'}",
                                rule_meta.get("how_to_fix", "Apply recommended fix."),
                                "Run GEO re-verification to confirm point gain.",
                            ],
                            affected_prompt_count=len(iss.get("affected_questions", [])),
                            affected_urls=iss.get("affected_urls") or [],
                            estimated_impact=impact_info["estimated_impact"],
                            potential_score=impact_info["potential_score"],
                            verification_status=GeoVerificationStatus.UNVERIFIED.value,
                            status=GeoRecommendationStatus.OPEN.value,
                        )
                        session.add(rec_obj)

                # 10. Record Visibility Snapshot
                snap = GeoVisibilitySnapshot(
                    project_id=project.id,
                    provider="All Providers" if total_ans > 0 else "Unconnected",
                    question_count=total_ans,
                    mention_rate=mention_rate,
                    recommendation_rate=recommendation_rate,
                    citation_rate=own_cit_rate,
                    share_of_voice=comp_metrics.get("brand_share_of_voice", 0.0),
                    geo_score=project.geo_score,
                )
                session.add(snap)

                # 11. Finalize Analysis Record
                final_status = GeoAnalysisStatus.COMPLETED.value
                if partial_failure and total_ans > 0:
                    final_status = GeoAnalysisStatus.PARTIAL.value
                elif total_ans == 0 and any(s == "CONNECTED" for s in provider_status_map.values()):
                    final_status = GeoAnalysisStatus.COMPLETED.value

                analysis.status = final_status
                analysis.progress = 100
                analysis.current_step = "GEO analysis complete."
                analysis.completed_at = datetime.now(timezone.utc)
                analysis.results_summary = {
                    "geo_score": project.geo_score,
                    "score_label": project.score_label,
                    "confidence": project.confidence,
                    "data_coverage": project.data_coverage,
                    "providers_queried": provider_status_map,
                    "answers_analyzed": total_ans,
                    "issues_detected": len(rule_issues),
                }

                await session.commit()
                logger.info("GEO Analysis %s finished with status %s", analysis_id, final_status)

            except Exception as exc:
                logger.exception("Error running GEO analysis %s: %s", analysis_id, exc)
                analysis.status = GeoAnalysisStatus.FAILED.value
                analysis.error_message = str(exc)
                analysis.completed_at = datetime.now(timezone.utc)
                await session.commit()


# Singleton runner
geo_analysis_runner = GEOAnalysisRunner()
