from __future__ import annotations
import asyncio
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import AsyncSessionLocal
from app.models.aeo import (
    AeoAnalysis,
    AeoAnalysisStatus,
    AeoAnswer,
    AeoCitation,
    AeoEntity,
    AeoProject,
    AeoQuestion,
    AeoRecommendation,
    AeoVisibilitySnapshot,
)
from app.services.aeo.citation_extractor import CitationExtractorEngine
from app.services.aeo.competitor_detector import CompetitorDetectorEngine
from app.services.aeo.entity_extractor import EntityExtractorEngine
from app.services.aeo.mention_detector import MentionDetectorEngine
from app.services.aeo.provider_interface import AEOProviderRegistry
from app.services.aeo.question_generator import QuestionGeneratorEngine
from app.services.aeo.recommendation_engine import AEORecommendationEngine
from app.services.aeo.visibility_scorer import VisibilityScorerEngine

logger = logging.getLogger(__name__)


class AEOAnalysisRunner:
    """
    Asynchronous Execution Runner for AEO Project Analysis.
    Orchestrates provider querying, mention detection, citation extraction,
    visibility scoring, snapshot creation, and recommendation generation.
    """

    @classmethod
    async def run_analysis_lifecycle(
        cls,
        analysis_id: str,
        engines_to_run: Optional[List[str]] = None,
        allow_test_mode: bool = False,
        db: Optional[AsyncSession] = None,
    ) -> None:
        """
        Main async lifecycle entrypoint executed in background task.
        """
        if db is not None:
            await cls._run_with_session(db, analysis_id, engines_to_run, allow_test_mode)
        else:
            async with AsyncSessionLocal() as session:
                await cls._run_with_session(session, analysis_id, engines_to_run, allow_test_mode)

    @classmethod
    async def _run_with_session(
        cls,
        db: AsyncSession,
        analysis_id: str,
        engines_to_run: Optional[List[str]] = None,
        allow_test_mode: bool = False,
    ) -> None:
        analysis = await db.get(AeoAnalysis, analysis_id)
        if not analysis:
            logger.error(f"[AEO Runner] Analysis ID {analysis_id} not found.")
            return

        project_id = analysis.project_id
        project_res = await db.execute(
            select(AeoProject)
            .where(AeoProject.id == project_id)
            .options(
                selectinload(AeoProject.questions),
                selectinload(AeoProject.citations),
                selectinload(AeoProject.entities),
                selectinload(AeoProject.snapshots),
            )
        )
        project = project_res.scalar_one_or_none()
        if not project:
            analysis.status = AeoAnalysisStatus.FAILED.value
            analysis.error_message = f"Project {project_id} does not exist."
            await db.commit()
            return

        # Update status to RUNNING
        analysis.status = AeoAnalysisStatus.RUNNING.value
        analysis.started_at = datetime.now(timezone.utc)
        analysis.progress = 5
        analysis.current_step = "Preparing questions and search prompts"
        cls._add_log(analysis, "INFO", "Initialization", f"Starting AEO Analysis for brand '{project.name}' ({project.domain}).")
        await db.commit()

        try:
            # 1. Ensure questions exist
            questions = project.questions or []
            if not questions:
                cls._add_log(analysis, "INFO", "Question Generation", "No questions tracked yet. Generating starter prompt questions.")
                gen_questions = QuestionGeneratorEngine.generate_questions(
                    brand_name=project.name,
                    domain=project.domain,
                    industry=project.industry,
                    target_audience=project.target_audience,
                    competitors=project.competitors,
                    max_questions=8,
                )
                for gq in gen_questions:
                    q_obj = AeoQuestion(
                        project_id=project.id,
                        question_text=gq["question_text"],
                        category=gq["category"],
                        intent=gq["intent"],
                        is_tracked=True,
                        visibility_score=0,
                    )
                    db.add(q_obj)
                    questions.append(q_obj)
                await db.commit()

            # Filter tracked questions
            active_questions = [q for q in questions if q.is_tracked]
            if not active_questions:
                active_questions = questions

            # 2. Identify target engines to query
            target_engines = engines_to_run or ["chatgpt", "gemini", "perplexity"]
            analysis.engines_analyzed = target_engines
            analysis.questions_analyzed_count = len(active_questions)
            analysis.progress = 15
            analysis.current_step = f"Querying {len(target_engines)} answer engines across {len(active_questions)} prompts"
            cls._add_log(analysis, "INFO", "Engines", f"Target engines selected: {', '.join(target_engines)}")
            await db.commit()

            collected_answers: List[AeoAnswer] = []
            all_raw_citations: List[Dict[str, Any]] = []
            all_competitor_mentions: List[Dict[str, Any]] = []
            detected_positions: List[int] = []
            unmentioned_questions: List[str] = []
            all_answer_texts: List[str] = []

            step_increment = 60.0 / max(len(active_questions) * len(target_engines), 1)
            current_progress = 15.0

            # 3. Query Providers
            for q in active_questions:
                question_brand_mentioned = False
                question_best_pos = None

                for eng_id in target_engines:
                    provider = AEOProviderRegistry.get_provider(eng_id, allow_mock=allow_test_mode)
                    cls._add_log(analysis, "INFO", "Querying Provider", f"Querying {provider.display_name} for '{q.question_text[:50]}...'")

                    resp = await provider.ask_question(
                        question=q.question_text,
                        brand_name=project.name,
                        domain=project.domain,
                        context={"competitors": project.competitors},
                    )

                    # Mention detection
                    mention_res = MentionDetectorEngine.detect_brand_mention(
                        answer_text=resp.answer_text,
                        brand_name=project.name,
                        domain=project.domain,
                        aliases=project.brand_aliases,
                    )

                    if mention_res["mentioned"]:
                        question_brand_mentioned = True
                        if mention_res["position"]:
                            detected_positions.append(mention_res["position"])
                            if question_best_pos is None or mention_res["position"] < question_best_pos:
                                question_best_pos = mention_res["position"]

                    # Competitor detection
                    comp_res = CompetitorDetectorEngine.detect_competitors(
                        answer_text=resp.answer_text,
                        competitors=project.competitors or [],
                    )
                    all_competitor_mentions.extend(comp_res)

                    # Citations extraction
                    extracted_cits = CitationExtractorEngine.extract_citations(
                        answer_text=resp.answer_text,
                        target_domain=project.domain,
                        raw_citations=resp.citations_raw,
                        competitor_domains=[c.get("domain", "") for c in (project.competitors or []) if isinstance(c, dict)],
                    )
                    all_raw_citations.extend(extracted_cits)

                    # Persist Answer Record
                    ans_obj = AeoAnswer(
                        project_id=project.id,
                        question_id=q.id,
                        analysis_id=analysis.id,
                        engine=eng_id,
                        model=resp.model,
                        answer_text=resp.answer_text or "(No answer returned)",
                        brand_mentioned=mention_res["mentioned"],
                        brand_position=mention_res["position"],
                        mention_snippets=mention_res["snippets"],
                        competitor_mentions=comp_res,
                        citations_count=len(extracted_cits),
                        latency_ms=resp.latency_ms,
                        token_usage=resp.token_usage,
                        status=resp.status,
                        error_message=resp.error_message,
                    )
                    db.add(ans_obj)
                    collected_answers.append(ans_obj)
                    if resp.answer_text:
                        all_answer_texts.append(resp.answer_text)

                    current_progress += step_increment
                    analysis.progress = min(int(current_progress), 75)
                    await db.commit()

                # Update question status
                q.brand_mentioned = question_brand_mentioned
                q.best_rank_position = question_best_pos
                q.last_checked_at = datetime.now(timezone.utc)
                if question_brand_mentioned:
                    q.visibility_status = "visible"
                    q.visibility_score = 90 if question_best_pos == 1 else 75
                else:
                    q.visibility_status = "not_visible"
                    q.visibility_score = 20
                    unmentioned_questions.append(q.question_text)

            # 4. Save Extracted Citations
            analysis.progress = 80
            analysis.current_step = "Extracting and classifying citation links"
            cls._add_log(analysis, "INFO", "Citations", f"Extracted {len(all_raw_citations)} total citations.")

            # Clear old citations and replace with fresh findings
            for cit in all_raw_citations:
                cit_obj = AeoCitation(
                    project_id=project.id,
                    engine=cit.get("engine", "chatgpt"),
                    source_url=cit["source_url"],
                    domain=cit["domain"],
                    citation_type=cit["citation_type"],
                    citation_status="cited",
                )
                db.add(cit_obj)

            # 5. Extract Entities & Knowledge Graph
            analysis.progress = 85
            analysis.current_step = "Building entity associations and knowledge graph"
            entities_data = EntityExtractorEngine.extract_entities(
                brand_name=project.name,
                domain=project.domain,
                industry=project.industry,
                answers=all_answer_texts,
            )
            for ent in entities_data:
                existing_ent_res = await db.execute(
                    select(AeoEntity).where(
                        AeoEntity.project_id == project.id,
                        AeoEntity.entity_name == ent["entity_name"],
                    )
                )
                existing_ent = existing_ent_res.scalar_one_or_none()
                if existing_ent:
                    existing_ent.mentions_count += ent["mentions_count"]
                    existing_ent.visibility_rate = ent["visibility_rate"]
                    existing_ent.associated_concepts = ent["associated_concepts"]
                else:
                    ent_obj = AeoEntity(
                        project_id=project.id,
                        entity_name=ent["entity_name"],
                        entity_type=ent["entity_type"],
                        mentions_count=ent["mentions_count"],
                        visibility_rate=ent["visibility_rate"],
                        associated_concepts=ent["associated_concepts"],
                    )
                    db.add(ent_obj)

            # 6. Calculate Visibility Scores
            analysis.progress = 90
            analysis.current_step = "Computing deterministic AEO Visibility Score"
            cit_stats = CitationExtractorEngine.compute_citation_stats(all_raw_citations, project.domain)
            comp_stats = CompetitorDetectorEngine.aggregate_competitor_metrics(
                competitors=project.competitors or [],
                brand_name=project.name,
                total_answers=len(collected_answers),
                brand_mentions=sum(1 for a in collected_answers if a.brand_mentioned),
                all_competitor_mentions=all_competitor_mentions,
            )

            score_breakdown = VisibilityScorerEngine.calculate_visibility_score(
                total_questions=len(active_questions),
                questions_answered=len(active_questions),
                brand_mentions_count=sum(1 for a in collected_answers if a.brand_mentioned),
                total_answers_count=len(collected_answers),
                own_citations_count=cit_stats["own_citations"],
                total_citations_count=cit_stats["total_citations"],
                detected_positions=detected_positions,
            )

            # 7. Create Historical Visibility Snapshot
            snapshot = AeoVisibilitySnapshot(
                project_id=project.id,
                analysis_id=analysis.id,
                overall_score=score_breakdown.overall_score,
                score_label=score_breakdown.score_label,
                mention_score=score_breakdown.mention_score,
                citation_score=score_breakdown.citation_score,
                position_score=score_breakdown.position_score,
                coverage_score=score_breakdown.coverage_score,
                average_position=score_breakdown.average_position,
                total_questions=len(active_questions),
                questions_mentioned=sum(1 for q in active_questions if q.brand_mentioned),
                total_citations=cit_stats["total_citations"],
                own_citations=cit_stats["own_citations"],
                competitor_citations=cit_stats["competitor_citations"],
                engine_scores={
                    eng: score_breakdown.overall_score for eng in target_engines
                },
            )
            db.add(snapshot)

            # 8. Generate & Deduplicate AEO Recommendations
            analysis.progress = 95
            analysis.current_step = "Generating actionable AEO optimization recommendations"
            recs_data = AEORecommendationEngine.generate_recommendations(
                project=project,
                score_breakdown=score_breakdown,
                questions=list(project.questions or []),
                citations=list(project.citations or []),
                entities=list(project.entities or []),
            )
            await AEORecommendationEngine.sync_recommendations_to_db(
                db=db,
                project_id=project.id,
                generated_recs=recs_data,
            )

            # 9. Update Project & Analysis Completed State
            project.aeo_score = score_breakdown.overall_score
            project.score_label = score_breakdown.score_label
            project.mention_score = score_breakdown.mention_score
            project.citation_score = score_breakdown.citation_score
            project.position_score = score_breakdown.position_score
            project.coverage_score = score_breakdown.coverage_score
            project.last_analyzed_at = datetime.now(timezone.utc)

            analysis.status = AeoAnalysisStatus.COMPLETED.value
            analysis.progress = 100
            analysis.current_step = "Analysis completed successfully"
            analysis.overall_score = score_breakdown.overall_score
            analysis.answers_collected_count = len(collected_answers)
            analysis.mentions_found_count = sum(1 for a in collected_answers if a.brand_mentioned)
            analysis.citations_found_count = len(all_raw_citations)
            analysis.completed_at = datetime.now(timezone.utc)
            analysis.summary_data = {
                "overall_score": score_breakdown.overall_score,
                "score_label": score_breakdown.score_label,
                "mention_score": score_breakdown.mention_score,
                "citation_score": score_breakdown.citation_score,
                "position_score": score_breakdown.position_score,
                "coverage_score": score_breakdown.coverage_score,
                "citation_stats": cit_stats,
                "competitor_stats": comp_stats,
            }
            # 10. Phase 7: Continuous Monitoring Post-Processing (Snapshots, Change Detection, Alerts)
            try:
                from app.services.aeo.monitoring.monitoring_engine import AEOMonitoringEngine
                await AEOMonitoringEngine.process_analysis_completion(
                    db=db,
                    project=project,
                    analysis=analysis,
                    answers=collected_answers,
                    citations=all_raw_citations,
                    questions=active_questions,
                    detected_positions=detected_positions,
                )
            except Exception as mon_err:
                logger.warning(f"[AEO Runner] Non-fatal error during monitoring post-processing: {mon_err}")

            cls._add_log(analysis, "SUCCESS", "Completion", f"AEO Analysis completed with Overall Score {score_breakdown.overall_score}/100 ({score_breakdown.score_label}).")
            await db.commit()

        except Exception as exc:
            logger.exception(f"[AEO Runner] Error executing analysis {analysis_id}")
            analysis.status = AeoAnalysisStatus.FAILED.value
            analysis.error_message = str(exc)
            analysis.completed_at = datetime.now(timezone.utc)
            cls._add_log(analysis, "ERROR", "Failure", f"Analysis failed: {str(exc)}")
            await db.commit()

    @classmethod
    def _add_log(cls, analysis: AeoAnalysis, level: str, step: str, message: str) -> None:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "step": step,
            "message": message,
        }
        curr_logs = list(analysis.logs or [])
        curr_logs.append(log_entry)
        analysis.logs = curr_logs
