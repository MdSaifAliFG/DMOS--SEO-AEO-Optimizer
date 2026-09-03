from __future__ import annotations
import asyncio
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.aeo import (
    AeoAnalysis,
    AeoAnalysisStatus,
    AeoAnswer,
    AeoCitation,
    AeoEntity,
    AeoIntent,
    AeoProject,
    AeoQuestion,
    AeoRecommendation,
    AeoVisibilitySnapshot,
)
from app.schemas.aeo import (
    AeoCitationCreate,
    AeoEntityCreate,
    AeoProjectCreate,
    AeoProjectUpdate,
    AeoQuestionCreate,
    AeoQuestionUpdate,
)
from app.services.aeo.ai.rule_based_aeo_provider import RuleBasedAEOAIProvider
from app.services.aeo.analysis_runner import AEOAnalysisRunner
from app.services.aeo.citation_extractor import CitationExtractorEngine
from app.services.aeo.competitor_detector import CompetitorDetectorEngine
from app.services.aeo.optimization.citation_gap_analyzer import CitationGapAnalyzer
from app.services.aeo.optimization.competitor_gap_analyzer import CompetitorGapAnalyzer
from app.services.aeo.optimization.content_gap_analyzer import ContentGapAnalyzer
from app.services.aeo.optimization.entity_gap_analyzer import EntityGapAnalyzer
from app.services.aeo.optimization.gap_analyzer import AEOGapAnalysisEngine
from app.services.aeo.optimization.history_service import AEOHistoryService
from app.services.aeo.optimization.impact_calculator import AEOImpactCalculator
from app.services.aeo.optimization.priority_calculator import AEOPriorityCalculator
from app.services.aeo.optimization.prompt_gap_analyzer import PromptGapAnalyzer
from app.services.aeo.optimization.recommendation_engine import AEORecommendationEngine
from app.services.aeo.provider_interface import AEOProviderRegistry
from app.services.aeo.question_generator import QuestionGeneratorEngine
from app.services.aeo.visibility_scorer import VisibilityScorerEngine
from app.services.crawler.url_validator import validate_url

logger = logging.getLogger(__name__)


class AeoService:
    """
    Comprehensive Database-Backed Service Layer for Answer Engine Optimization (AEO).
    Manages Projects, Questions, Answers, Citations, Knowledge Entities,
    Analyses, Visibility Snapshots, and Recommendations.
    """

    # --- Project Management ---
    @staticmethod
    async def create_project(db: AsyncSession, data: AeoProjectCreate) -> AeoProject:
        # Validate domain / URL safety
        clean_url = data.domain if data.domain.startswith("http") else f"https://{data.domain}"
        is_safe, err_msg = validate_url(clean_url, check_dns=False)
        if not is_safe:
            raise ValueError(f"Invalid or restricted domain target: {err_msg}")

        parsed = urlparse(clean_url)
        domain = parsed.netloc.lower() or parsed.path.lower().split("/")[0]
        if domain.startswith("www."):
            domain = domain[4:]

        project = AeoProject(
            name=data.name.strip(),
            domain=domain,
            brand_name=data.brand_name or data.name.strip(),
            brand_aliases=data.brand_aliases or [],
            industry=data.industry,
            country=data.country,
            target_audience=data.target_audience,
            target_language=data.target_language or "en",
            competitors=data.competitors or [],
            description=data.description,
            settings=data.settings or {},
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)

        # Generate initial starter prompt questions for the brand
        starter_questions = QuestionGeneratorEngine.generate_questions(
            brand_name=project.name,
            domain=project.domain,
            industry=project.industry,
            target_audience=project.target_audience,
            competitors=project.competitors,
            max_questions=6,
        )
        for sq in starter_questions:
            q_obj = AeoQuestion(
                project_id=project.id,
                question_text=sq["question_text"],
                category=sq["category"],
                intent=sq["intent"],
                is_tracked=True,
                visibility_score=0,
            )
            db.add(q_obj)

        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def get_project(db: AsyncSession, project_id: str) -> Optional[AeoProject]:
        query = (
            select(AeoProject)
            .where(AeoProject.id == project_id)
            .options(
                selectinload(AeoProject.questions),
                selectinload(AeoProject.answers),
                selectinload(AeoProject.citations),
                selectinload(AeoProject.entities),
                selectinload(AeoProject.snapshots),
                selectinload(AeoProject.recommendations),
                selectinload(AeoProject.analyses),
            )
        )
        res = await db.execute(query)
        return res.scalar_one_or_none()

    @staticmethod
    async def get_projects(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
    ) -> tuple[List[AeoProject], int]:
        query = (
            select(AeoProject)
            .options(
                selectinload(AeoProject.questions),
                selectinload(AeoProject.citations),
                selectinload(AeoProject.snapshots),
            )
            .order_by(desc(AeoProject.created_at))
        )
        count_query = select(func.count(AeoProject.id))

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(
                func.lower(AeoProject.name).like(s_term)
                | func.lower(AeoProject.domain).like(s_term)
                | func.lower(AeoProject.industry).like(s_term)
            )
            count_query = count_query.where(
                func.lower(AeoProject.name).like(s_term)
                | func.lower(AeoProject.domain).like(s_term)
                | func.lower(AeoProject.industry).like(s_term)
            )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        projects = res.scalars().all()
        return list(projects), total

    @staticmethod
    async def update_project(
        db: AsyncSession, project_id: str, data: AeoProjectUpdate
    ) -> Optional[AeoProject]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            return None

        update_data = data.model_dump(exclude_unset=True)
        if "domain" in update_data and update_data["domain"]:
            clean_url = update_data["domain"] if update_data["domain"].startswith("http") else f"https://{update_data['domain']}"
            is_safe, err_msg = validate_url(clean_url, check_dns=False)
            if not is_safe:
                raise ValueError(f"Invalid domain: {err_msg}")
            parsed = urlparse(clean_url)
            d = parsed.netloc.lower() or parsed.path.lower().split("/")[0]
            if d.startswith("www."):
                d = d[4:]
            update_data["domain"] = d

        for field, val in update_data.items():
            setattr(project, field, val)

        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def delete_project(db: AsyncSession, project_id: str) -> bool:
        project = await AeoService.get_project(db, project_id)
        if not project:
            return False
        await db.delete(project)
        await db.commit()
        return True

    # --- Analysis Lifecycle Execution ---
    @staticmethod
    async def trigger_analysis(
        db: AsyncSession,
        project_id: str,
        engines: Optional[List[str]] = None,
        allow_test_mode: bool = False,
    ) -> AeoAnalysis:
        project = await AeoService.get_project(db, project_id)
        if not project:
            raise ValueError(f"Project '{project_id}' not found.")

        target_engines = engines or ["chatgpt", "gemini", "perplexity"]

        analysis = AeoAnalysis(
            project_id=project.id,
            status=AeoAnalysisStatus.QUEUED.value,
            progress=0,
            current_step="Queued for answer engine synthesis",
            engines_analyzed=target_engines,
        )
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)

        # Launch background task
        asyncio.create_task(
            AEOAnalysisRunner.run_analysis_lifecycle(
                analysis_id=analysis.id,
                engines_to_run=target_engines,
                allow_test_mode=allow_test_mode,
            )
        )
        return analysis

    @staticmethod
    async def get_analysis(db: AsyncSession, analysis_id: str) -> Optional[AeoAnalysis]:
        res = await db.execute(
            select(AeoAnalysis)
            .where(AeoAnalysis.id == analysis_id)
            .options(selectinload(AeoAnalysis.answers))
        )
        return res.scalar_one_or_none()

    # --- Questions Management ---
    @staticmethod
    async def create_question(db: AsyncSession, data: AeoQuestionCreate) -> AeoQuestion:
        intent_val = data.intent.value if isinstance(data.intent, AeoIntent) else str(data.intent)
        question = AeoQuestion(
            project_id=data.project_id,
            question_text=data.question_text.strip(),
            category=data.category.strip(),
            intent=intent_val,
            is_tracked=data.is_tracked if data.is_tracked is not None else True,
            visibility_score=0,
        )
        db.add(question)
        await db.commit()
        await db.refresh(question)
        return question

    @staticmethod
    async def get_questions(
        db: AsyncSession,
        project_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
        intent: Optional[str] = None,
        category: Optional[str] = None,
        visibility_status: Optional[str] = None,
    ) -> tuple[List[AeoQuestion], int]:
        query = (
            select(AeoQuestion)
            .options(
                selectinload(AeoQuestion.answers),
                selectinload(AeoQuestion.citations),
            )
            .order_by(desc(AeoQuestion.created_at))
        )
        count_query = select(func.count(AeoQuestion.id))

        if project_id:
            query = query.where(AeoQuestion.project_id == project_id)
            count_query = count_query.where(AeoQuestion.project_id == project_id)

        if intent and intent != "all":
            query = query.where(AeoQuestion.intent == intent)
            count_query = count_query.where(AeoQuestion.intent == intent)

        if category and category != "all":
            query = query.where(AeoQuestion.category == category)
            count_query = count_query.where(AeoQuestion.category == category)

        if visibility_status and visibility_status != "all":
            query = query.where(AeoQuestion.visibility_status == visibility_status)
            count_query = count_query.where(AeoQuestion.visibility_status == visibility_status)

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(
                func.lower(AeoQuestion.question_text).like(s_term)
                | func.lower(AeoQuestion.category).like(s_term)
            )
            count_query = count_query.where(
                func.lower(AeoQuestion.question_text).like(s_term)
                | func.lower(AeoQuestion.category).like(s_term)
            )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        questions = res.scalars().all()
        return list(questions), total

    @staticmethod
    async def update_question(
        db: AsyncSession, question_id: str, data: AeoQuestionUpdate
    ) -> Optional[AeoQuestion]:
        q = await db.get(AeoQuestion, question_id)
        if not q:
            return None
        up_data = data.model_dump(exclude_unset=True)
        if "intent" in up_data and isinstance(up_data["intent"], AeoIntent):
            up_data["intent"] = up_data["intent"].value
        for f, v in up_data.items():
            setattr(q, f, v)
        await db.commit()
        await db.refresh(q)
        return q

    @staticmethod
    async def delete_question(db: AsyncSession, question_id: str) -> bool:
        q = await db.get(AeoQuestion, question_id)
        if not q:
            return False
        await db.delete(q)
        await db.commit()
        return True

    @staticmethod
    async def generate_and_save_questions(
        db: AsyncSession,
        project_id: str,
        max_questions: int = 10,
    ) -> List[AeoQuestion]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            raise ValueError(f"Project '{project_id}' not found.")

        generated = QuestionGeneratorEngine.generate_questions(
            brand_name=project.name,
            domain=project.domain,
            industry=project.industry,
            target_audience=project.target_audience,
            competitors=project.competitors,
            max_questions=max_questions,
        )

        existing_texts = {q.question_text.lower() for q in (project.questions or [])}
        created = []
        for g in generated:
            if g["question_text"].lower() not in existing_texts:
                q_obj = AeoQuestion(
                    project_id=project.id,
                    question_text=g["question_text"],
                    category=g["category"],
                    intent=g["intent"],
                    is_tracked=True,
                    visibility_score=0,
                )
                db.add(q_obj)
                created.append(q_obj)

        if created:
            await db.commit()
            for q in created:
                await db.refresh(q)

        return created

    # --- Answers Management ---
    @staticmethod
    async def get_answers(
        db: AsyncSession,
        project_id: Optional[str] = None,
        question_id: Optional[str] = None,
        engine: Optional[str] = None,
        brand_mentioned: Optional[bool] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[AeoAnswer], int]:
        query = (
            select(AeoAnswer)
            .options(selectinload(AeoAnswer.question))
            .order_by(desc(AeoAnswer.created_at))
        )
        count_query = select(func.count(AeoAnswer.id))

        if project_id:
            query = query.where(AeoAnswer.project_id == project_id)
            count_query = count_query.where(AeoAnswer.project_id == project_id)

        if question_id:
            query = query.where(AeoAnswer.question_id == question_id)
            count_query = count_query.where(AeoAnswer.question_id == question_id)

        if engine and engine != "all":
            query = query.where(AeoAnswer.engine == engine.lower())
            count_query = count_query.where(AeoAnswer.engine == engine.lower())

        if brand_mentioned is not None:
            query = query.where(AeoAnswer.brand_mentioned == brand_mentioned)
            count_query = count_query.where(AeoAnswer.brand_mentioned == brand_mentioned)

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        answers = res.scalars().all()
        return list(answers), total

    @staticmethod
    async def get_answer(db: AsyncSession, answer_id: str) -> Optional[AeoAnswer]:
        res = await db.execute(
            select(AeoAnswer)
            .where(AeoAnswer.id == answer_id)
            .options(
                selectinload(AeoAnswer.question),
                selectinload(AeoAnswer.project),
            )
        )
        return res.scalar_one_or_none()

    # --- Citations Management ---
    @staticmethod
    async def create_citation(db: AsyncSession, data: AeoCitationCreate) -> AeoCitation:
        parsed = urlparse(data.source_url)
        domain = data.domain or parsed.netloc.lower() or "unknown"
        if domain.startswith("www."):
            domain = domain[4:]

        citation = AeoCitation(
            project_id=data.project_id,
            question_id=data.question_id,
            engine=data.engine.lower(),
            source_url=data.source_url,
            domain=domain,
            citation_type=data.citation_type or "third_party",
            citation_status=data.citation_status or "cited",
            citation_text=data.citation_text,
        )
        db.add(citation)
        await db.commit()
        await db.refresh(citation)
        return citation

    @staticmethod
    async def get_citations(
        db: AsyncSession,
        project_id: Optional[str] = None,
        engine: Optional[str] = None,
        citation_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
    ) -> tuple[List[AeoCitation], int]:
        query = select(AeoCitation).order_by(desc(AeoCitation.created_at))
        count_query = select(func.count(AeoCitation.id))

        if project_id:
            query = query.where(AeoCitation.project_id == project_id)
            count_query = count_query.where(AeoCitation.project_id == project_id)

        if engine and engine != "all":
            query = query.where(AeoCitation.engine == engine.lower())
            count_query = count_query.where(AeoCitation.engine == engine.lower())

        if citation_type and citation_type != "all":
            query = query.where(AeoCitation.citation_type == citation_type)
            count_query = count_query.where(AeoCitation.citation_type == citation_type)

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(
                func.lower(AeoCitation.source_url).like(s_term)
                | func.lower(AeoCitation.domain).like(s_term)
            )
            count_query = count_query.where(
                func.lower(AeoCitation.source_url).like(s_term)
                | func.lower(AeoCitation.domain).like(s_term)
            )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        citations = res.scalars().all()
        return list(citations), total

    # --- Entities Management ---
    @staticmethod
    async def create_entity(db: AsyncSession, data: AeoEntityCreate) -> AeoEntity:
        entity = AeoEntity(
            project_id=data.project_id,
            entity_name=data.entity_name.strip(),
            entity_type=data.entity_type.strip(),
            mentions_count=data.mentions_count or 1,
            visibility_rate=data.visibility_rate or 80,
            associated_concepts=data.associated_concepts or [],
        )
        db.add(entity)
        await db.commit()
        await db.refresh(entity)
        return entity

    @staticmethod
    async def get_entities(
        db: AsyncSession,
        project_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
    ) -> tuple[List[AeoEntity], int]:
        query = select(AeoEntity).order_by(desc(AeoEntity.mentions_count))
        count_query = select(func.count(AeoEntity.id))

        if project_id:
            query = query.where(AeoEntity.project_id == project_id)
            count_query = count_query.where(AeoEntity.project_id == project_id)

        if entity_type and entity_type != "all":
            query = query.where(AeoEntity.entity_type == entity_type)
            count_query = count_query.where(AeoEntity.entity_type == entity_type)

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(func.lower(AeoEntity.entity_name).like(s_term))
            count_query = count_query.where(func.lower(AeoEntity.entity_name).like(s_term))

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        entities = res.scalars().all()
        return list(entities), total

    # --- Visibility & Recommendations ---
    @staticmethod
    async def get_visibility_data(db: AsyncSession, project_id: str) -> Dict[str, Any]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            raise ValueError(f"Project '{project_id}' not found.")

        # Load snapshots ordered chronologically
        snapshots_res = await db.execute(
            select(AeoVisibilitySnapshot)
            .where(AeoVisibilitySnapshot.project_id == project_id)
            .order_by(AeoVisibilitySnapshot.created_at.asc())
        )
        snapshots = list(snapshots_res.scalars().all())

        trend_points = [
            {
                "date": s.created_at.strftime("%b %d, %H:%M"),
                "score": s.overall_score,
                "mention_score": s.mention_score,
                "citation_score": s.citation_score,
                "coverage_score": s.coverage_score,
            }
            for s in snapshots
        ]

        latest_snapshot = snapshots[-1] if snapshots else None
        prev_snapshot = snapshots[-2] if len(snapshots) >= 2 else None

        score_change = (
            latest_snapshot.overall_score - prev_snapshot.overall_score
            if latest_snapshot and prev_snapshot
            else 0
        )

        return {
            "project_id": project.id,
            "project_name": project.name,
            "domain": project.domain,
            "overall_score": project.aeo_score,
            "score_label": project.score_label or "Untested",
            "mention_score": project.mention_score or 0,
            "citation_score": project.citation_score or 0,
            "position_score": project.position_score or 0,
            "coverage_score": project.coverage_score or 0,
            "score_change": score_change,
            "last_analyzed_at": project.last_analyzed_at,
            "trend": trend_points,
            "snapshots_count": len(snapshots),
        }

    @staticmethod
    async def get_recommendations(
        db: AsyncSession, project_id: str
    ) -> List[AeoRecommendation]:
        res = await db.execute(
            select(AeoRecommendation)
            .where(AeoRecommendation.project_id == project_id)
            .order_by(desc(AeoRecommendation.opportunity_score))
        )
        return list(res.scalars().all())

    # --- Dashboard Aggregation ---
    @staticmethod
    async def get_dashboard_summary(
        db: AsyncSession, project_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Computes 100% real database metrics for the AEO Dashboard.
        Never returns fabricated numbers or placeholder engine percentages.
        """
        # Projects
        proj_count_res = await db.execute(select(func.count(AeoProject.id)))
        total_projects = proj_count_res.scalar() or 0

        target_project = None
        if project_id:
            target_project = await AeoService.get_project(db, project_id)
        elif total_projects > 0:
            p_res = await db.execute(
                select(AeoProject).order_by(desc(AeoProject.updated_at)).limit(1)
            )
            target_project = p_res.scalar_one_or_none()

        # Questions
        q_filter = select(func.count(AeoQuestion.id))
        if target_project:
            q_filter = q_filter.where(AeoQuestion.project_id == target_project.id)
        q_count_res = await db.execute(q_filter)
        questions_tracked = q_count_res.scalar() or 0

        # Citations
        c_filter = select(func.count(AeoCitation.id))
        if target_project:
            c_filter = c_filter.where(AeoCitation.project_id == target_project.id)
        c_count_res = await db.execute(c_filter)
        total_citations = c_count_res.scalar() or 0

        # Answers
        ans_filter = select(AeoAnswer)
        if target_project:
            ans_filter = ans_filter.where(AeoAnswer.project_id == target_project.id)
        ans_res = await db.execute(ans_filter)
        all_answers = list(ans_res.scalars().all())

        brand_mentions_count = sum(1 for a in all_answers if a.brand_mentioned)
        mention_rate = (
            int(round((brand_mentions_count / len(all_answers)) * 100))
            if all_answers
            else 0
        )

        # Engine Statuses
        engine_statuses = AEOProviderRegistry.get_all_engine_statuses()
        for eng in engine_statuses:
            eng_id = eng["engine_id"]
            eng_ans = [a for a in all_answers if a.engine == eng_id]
            eng["tracked_questions"] = len(eng_ans)
            eng["visibility_rate"] = (
                int(round((sum(1 for a in eng_ans if a.brand_mentioned) / len(eng_ans)) * 100))
                if eng_ans
                else 0
            )

        # Recent Questions
        rq_query = select(AeoQuestion).order_by(desc(AeoQuestion.created_at)).limit(5)
        if target_project:
            rq_query = rq_query.where(AeoQuestion.project_id == target_project.id)
        rq_res = await db.execute(rq_query)
        recent_questions = list(rq_res.scalars().all())

        # Recent Citations
        rc_query = select(AeoCitation).order_by(desc(AeoCitation.created_at)).limit(5)
        if target_project:
            rc_query = rc_query.where(AeoCitation.project_id == target_project.id)
        rc_res = await db.execute(rc_query)
        recent_citations = list(rc_res.scalars().all())

        # Historical Trend
        trend_points = []
        if target_project:
            snap_res = await db.execute(
                select(AeoVisibilitySnapshot)
                .where(AeoVisibilitySnapshot.project_id == target_project.id)
                .order_by(AeoVisibilitySnapshot.created_at.asc())
            )
            for s in snap_res.scalars().all():
                trend_points.append({
                    "date": s.created_at.strftime("%b %d"),
                    "score": s.overall_score,
                })

        # Phase 6 Optimization Opportunities Aggregation
        recs_query = select(AeoRecommendation)
        if target_project:
            recs_query = recs_query.where(AeoRecommendation.project_id == target_project.id)
        recs_res = await db.execute(recs_query)
        all_recs = list(recs_res.scalars().all())

        total_opportunities = len(all_recs)
        critical_opportunities = len([r for r in all_recs if r.priority_level == "critical" or r.severity == "critical"])
        high_opportunities = len([r for r in all_recs if r.priority_level == "high" or r.priority == "high"])
        open_opportunities = len([r for r in all_recs if r.status == "open"])
        in_progress_opportunities = len([r for r in all_recs if r.status == "in_progress"])
        fixed_opportunities = len([r for r in all_recs if r.status in ["fixed", "implemented"]])

        # Calculate estimated potential gain
        open_impacts = [r.estimated_impact for r in all_recs if r.status in ["open", "in_progress"]]
        current_sc = target_project.aeo_score if target_project else 0
        gain, potential_score = AEOImpactCalculator.calculate_batch_potential(current_sc, open_impacts)

        top_opportunities = [
            {
                "id": r.id,
                "title": r.title,
                "category": r.category,
                "priority_level": r.priority_level or r.priority,
                "priority_score": r.priority_score or r.opportunity_score,
                "estimated_impact": r.estimated_impact,
                "reason": r.reason,
                "status": r.status,
            }
            for r in sorted(all_recs, key=lambda x: (x.priority_score or x.opportunity_score or 0), reverse=True)[:5]
        ]

        completion_rate = int(round((fixed_opportunities / max(1, total_opportunities)) * 100)) if total_opportunities > 0 else 0

        return {
            "aeo_score": target_project.aeo_score if target_project else None,
            "score_label": target_project.score_label if target_project else None,
            "answer_visibility_rate": mention_rate,
            "questions_tracked": questions_tracked,
            "total_citations": total_citations,
            "total_projects": total_projects,
            "active_project_id": target_project.id if target_project else None,
            "active_project_name": target_project.name if target_project else None,
            "score_trend": trend_points,
            "engines": engine_statuses,
            "recent_questions": recent_questions,
            "recent_citations": recent_citations,
            # Phase 6 Additions
            "total_opportunities": total_opportunities,
            "critical_opportunities": critical_opportunities,
            "high_opportunities": high_opportunities,
            "open_opportunities": open_opportunities,
            "in_progress_opportunities": in_progress_opportunities,
            "fixed_opportunities": fixed_opportunities,
            "estimated_potential_gain": gain,
            "potential_score": potential_score,
            "top_opportunities": top_opportunities,
            "completion_rate": completion_rate,
        }

    # ==========================================
    # PHASE 6: AEO OPTIMIZATION & ACTION CENTER
    # ==========================================

    @staticmethod
    async def get_action(db: AsyncSession, action_id: str) -> Optional[AeoRecommendation]:
        """Fetch full recommendation details by ID."""
        return await db.get(AeoRecommendation, action_id)

    @staticmethod
    async def get_actions(
        db: AsyncSession,
        project_id: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[AeoRecommendation], int]:
        """Fetch filtered and paginated AEO optimization actions."""
        stmt = select(AeoRecommendation)
        count_stmt = select(func.count(AeoRecommendation.id))

        if project_id:
            stmt = stmt.where(AeoRecommendation.project_id == project_id)
            count_stmt = count_stmt.where(AeoRecommendation.project_id == project_id)

        if status and status != "all":
            stmt = stmt.where(AeoRecommendation.status == status.lower())
            count_stmt = count_stmt.where(AeoRecommendation.status == status.lower())

        if priority and priority != "all":
            stmt = stmt.where(
                (AeoRecommendation.priority_level == priority.lower())
                | (AeoRecommendation.priority == priority.lower())
            )
            count_stmt = count_stmt.where(
                (AeoRecommendation.priority_level == priority.lower())
                | (AeoRecommendation.priority == priority.lower())
            )

        if category and category != "all":
            stmt = stmt.where(AeoRecommendation.category == category)
            count_stmt = count_stmt.where(AeoRecommendation.category == category)

        if search:
            s = f"%{search}%"
            filter_cond = (
                AeoRecommendation.title.ilike(s)
                | AeoRecommendation.reason.ilike(s)
                | AeoRecommendation.category.ilike(s)
                | AeoRecommendation.recommendation_code.ilike(s)
            )
            stmt = stmt.where(filter_cond)
            count_stmt = count_stmt.where(filter_cond)

        total_res = await db.execute(count_stmt)
        total = total_res.scalar() or 0

        stmt = stmt.order_by(desc(AeoRecommendation.priority_score)).offset(skip).limit(limit)
        res = await db.execute(stmt)
        return list(res.scalars().all()), total

    @staticmethod
    async def update_action(
        db: AsyncSession,
        action_id: str,
        status: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> Optional[AeoRecommendation]:
        """Update an action's status and notes."""
        rec = await db.get(AeoRecommendation, action_id)
        if not rec:
            return None

        if status:
            rec.status = status.lower()
            if rec.status in ["fixed", "implemented"]:
                rec.resolved_at = datetime.now(timezone.utc)
            elif rec.status == "open":
                rec.resolved_at = None

        if notes is not None:
            rec.notes = notes

        await db.commit()
        await db.refresh(rec)
        return rec

    @staticmethod
    async def bulk_update_actions(
        db: AsyncSession,
        action_ids: List[str],
        status: str,
    ) -> int:
        """Bulk update action statuses (e.g. mark in_progress, fixed, ignored)."""
        res = await db.execute(
            select(AeoRecommendation).where(AeoRecommendation.id.in_(action_ids))
        )
        recs = list(res.scalars().all())
        now = datetime.now(timezone.utc)

        for r in recs:
            r.status = status.lower()
            if r.status in ["fixed", "implemented"]:
                r.resolved_at = now
            elif r.status == "open":
                r.resolved_at = None

        await db.commit()
        return len(recs)

    @staticmethod
    async def verify_action(db: AsyncSession, action_id: str) -> tuple[Optional[AeoRecommendation], bool, str]:
        """
        Re-checks whether the underlying opportunity has improved based on latest analysis data.
        Returns (action, is_resolved, verification_message).
        """
        rec = await db.get(AeoRecommendation, action_id)
        if not rec:
            return None, False, "Recommendation not found"

        project = await AeoService.get_project(db, rec.project_id)
        if not project:
            return rec, False, "Project not found"

        # Deterministic verification based on real metrics
        code = rec.recommendation_code or ""
        resolved = False
        message = ""

        if "PROMPT" in code or "CONTENT" in code:
            uncovered_cnt = sum(1 for q in (project.questions or []) if not q.brand_mentioned)
            if uncovered_cnt == 0 or (project.coverage_score or 0) >= 80:
                resolved = True
                message = "Verified: Brand coverage across tracked prompts is now 80%+."
            else:
                message = f"Unresolved: {uncovered_cnt} prompts remain uncovered in latest analysis."

        elif "CITE" in code:
            own_cits = sum(1 for c in (project.citations or []) if c.is_own_domain)
            if own_cits > 0 and (project.citation_score or 0) >= 60:
                resolved = True
                message = "Verified: Own domain citations detected with healthy citation score."
            else:
                message = f"Unresolved: Only {own_cits} own-domain citations found in latest crawl."

        elif "COMP" in code:
            brand_rate = project.mention_score or 0
            if brand_rate >= 60:
                resolved = True
                message = "Verified: Brand mention rate now exceeds 60% on comparison queries."
            else:
                message = f"Unresolved: Brand mention rate is currently {brand_rate}%."

        elif "ENTITY" in code:
            brand_ent_cnt = sum(1 for e in (project.entities or []) if e.entity_type == "Brand")
            if brand_ent_cnt > 0:
                resolved = True
                message = "Verified: Brand entity is now established in knowledge graph."
            else:
                message = "Unresolved: Brand entity schema still not detected."

        else:
            if (project.aeo_score or 0) >= (rec.potential_score or 70):
                resolved = True
                message = f"Verified: Overall AEO Score reached {project.aeo_score}."
            else:
                message = f"Unresolved: Current AEO score is {project.aeo_score} (potential target: {rec.potential_score})."

        rec.verification_status = "verified" if resolved else "failed"
        if resolved:
            rec.status = "fixed"
            rec.resolved_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(rec)
        return rec, resolved, message

    @staticmethod
    async def get_actions_summary(db: AsyncSession, project_id: str) -> Dict[str, Any]:
        """Computes comprehensive KPI summary for AEO Action Center."""
        project = await AeoService.get_project(db, project_id)
        if not project:
            return {}

        res = await db.execute(
            select(AeoRecommendation).where(AeoRecommendation.project_id == project_id)
        )
        recs = list(res.scalars().all())

        total = len(recs)
        critical = len([r for r in recs if r.priority_level == "critical" or r.severity == "critical"])
        high = len([r for r in recs if r.priority_level == "high" or r.priority == "high"])
        medium = len([r for r in recs if r.priority_level == "medium" or r.priority == "medium"])
        low = len([r for r in recs if r.priority_level == "low" or r.priority == "low"])

        open_cnt = len([r for r in recs if r.status == "open"])
        in_progress = len([r for r in recs if r.status == "in_progress"])
        fixed = len([r for r in recs if r.status in ["fixed", "implemented"]])
        ignored = len([r for r in recs if r.status in ["ignored", "dismissed"]])

        # Category Progress
        categories = {}
        for r in recs:
            cat = r.category or "General"
            if cat not in categories:
                categories[cat] = {"total": 0, "fixed": 0, "open": 0}
            categories[cat]["total"] += 1
            if r.status in ["fixed", "implemented"]:
                categories[cat]["fixed"] += 1
            else:
                categories[cat]["open"] += 1

        # Potential Score calculation
        open_impacts = [r.estimated_impact for r in recs if r.status in ["open", "in_progress"]]
        curr_sc = project.aeo_score or 0
        gain, potential_sc = AEOImpactCalculator.calculate_batch_potential(curr_sc, open_impacts)

        return {
            "project_id": project_id,
            "project_name": project.name,
            "domain": project.domain,
            "total_actions": total,
            "critical_count": critical,
            "high_count": high,
            "medium_count": medium,
            "low_count": low,
            "open_count": open_cnt,
            "in_progress_count": in_progress,
            "fixed_count": fixed,
            "ignored_count": ignored,
            "current_score": curr_sc,
            "estimated_impact": gain,
            "potential_score": potential_sc,
            "category_breakdown": categories,
        }

    @staticmethod
    async def generate_actions_for_project(
        db: AsyncSession, project_id: str
    ) -> List[AeoRecommendation]:
        """Manually trigger recommendation generation from latest project data."""
        project = await AeoService.get_project(db, project_id)
        if not project:
            return []

        # Build score breakdown from project
        from app.services.aeo.visibility_scorer import AeoScoreBreakdown
        score_breakdown = AeoScoreBreakdown(
            overall_score=project.aeo_score or 50,
            score_label=project.score_label or "Moderate",
            mention_score=project.mention_score or 50,
            citation_score=project.citation_score or 50,
            position_score=project.position_score or 50,
            coverage_score=project.coverage_score or 50,
            average_position=None,
            weights={},
            formula="Weighted",
        )

        recs_data = AEORecommendationEngine.generate_recommendations(
            project=project,
            score_breakdown=score_breakdown,
            questions=list(project.questions or []),
            citations=list(project.citations or []),
            entities=list(project.entities or []),
        )

        return await AEORecommendationEngine.sync_recommendations_to_db(
            db=db,
            project_id=project.id,
            generated_recs=recs_data,
        )

    # --- Gap Analysis Integrations ---
    @staticmethod
    async def get_content_gaps(db: AsyncSession, project_id: str) -> Dict[str, Any]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            return {}
        return ContentGapAnalyzer.analyze(project, list(project.questions or []))

    @staticmethod
    async def get_prompt_gaps(db: AsyncSession, project_id: str) -> Dict[str, Any]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            return {}
        return PromptGapAnalyzer.analyze(project, list(project.questions or []))

    @staticmethod
    async def get_citation_gaps(db: AsyncSession, project_id: str) -> Dict[str, Any]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            return {}
        return CitationGapAnalyzer.analyze(
            project, list(project.questions or []), list(project.citations or [])
        )

    @staticmethod
    async def get_entity_gaps(db: AsyncSession, project_id: str) -> Dict[str, Any]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            return {}
        return EntityGapAnalyzer.analyze(project, list(project.entities or []))

    @staticmethod
    async def get_optimization_history(
        db: AsyncSession, project_id: str, limit: int = 15
    ) -> Dict[str, Any]:
        return await AEOHistoryService.get_optimization_history(db, project_id, limit)

    # --- Interactive Optimizers ---
    @staticmethod
    async def optimize_content(
        target_question: str,
        existing_content: str,
        target_keyword: str = "",
        brand_name: str = "",
        product_service: str = "",
    ) -> Dict[str, Any]:
        provider = RuleBasedAEOAIProvider()
        return await provider.optimize_content(
            target_question=target_question,
            existing_content=existing_content,
            target_keyword=target_keyword,
            brand_name=brand_name or "Brand",
            product_service=product_service,
        )

    @staticmethod
    async def optimize_direct_answer(
        target_question: str,
        existing_content: str,
        brand_name: str = "",
    ) -> Dict[str, Any]:
        provider = RuleBasedAEOAIProvider()
        return await provider.optimize_direct_answer(
            target_question=target_question,
            existing_content=existing_content,
            brand_name=brand_name or "Brand",
        )

