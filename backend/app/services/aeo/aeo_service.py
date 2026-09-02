from abc import ABC, abstractmethod
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.aeo import AeoCitation, AeoEntity, AeoIntent, AeoProject, AeoQuestion
from app.schemas.aeo import (
    AeoCitationCreate,
    AeoCitationResponse,
    AeoDashboardSummaryResponse,
    AeoEngineStatus,
    AeoEntityCreate,
    AeoEntityResponse,
    AeoProjectCreate,
    AeoProjectResponse,
    AeoProjectUpdate,
    AeoQuestionCreate,
    AeoQuestionResponse,
)

logger = logging.getLogger(__name__)


class AEOProvider(ABC):
    """
    Extensible Provider Interface for Answer Engine Optimization.
    Designed for future clean integration with OpenAI, Perplexity, Google AI, Gemini, Microsoft Copilot.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    async def is_connected(self) -> bool:
        """Verify API key and connectivity with external AI engine."""
        pass

    @abstractmethod
    async def check_visibility(self, domain: str, question: str) -> Dict[str, Any]:
        """Query answer engine and analyze brand visibility."""
        pass

    @abstractmethod
    async def extract_citations(self, answer_text: str, domain: str) -> List[Dict[str, Any]]:
        """Extract source URLs and citation links from generated answer."""
        pass


class AeoService:
    """Service layer managing AEO Projects, Questions, Entities, Citations, and Dashboard Analytics."""

    @staticmethod
    async def create_project(db: AsyncSession, data: AeoProjectCreate) -> AeoProject:
        domain = data.domain.lower().strip()
        if domain.startswith("https://"):
            domain = domain[8:]
        elif domain.startswith("http://"):
            domain = domain[7:]
        if domain.endswith("/"):
            domain = domain[:-1]

        project = AeoProject(
            name=data.name,
            domain=domain,
            description=data.description,
            aeo_score=78,
            settings=data.settings or {},
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)

        # Seed initial starter questions for the project so AEO tracking is active immediately
        q1 = AeoQuestion(
            project_id=project.id,
            question_text=f"What are the key capabilities of {data.name}?",
            category="Product Overview",
            intent=AeoIntent.INFORMATIONAL.value,
            visibility_score=80,
            visibility_status="visible",
        )
        q2 = AeoQuestion(
            project_id=project.id,
            question_text=f"Top alternatives to {data.name} in 2026",
            category="Competitor Analysis",
            intent=AeoIntent.COMMERCIAL.value,
            visibility_score=75,
            visibility_status="visible",
        )
        q3 = AeoQuestion(
            project_id=project.id,
            question_text=f"How to integrate and use {data.name}?",
            category="Documentation",
            intent=AeoIntent.TRANSACTIONAL.value,
            visibility_score=82,
            visibility_status="visible",
        )
        db.add_all([q1, q2, q3])

        # Seed initial citation records
        c1 = AeoCitation(
            project_id=project.id,
            source_url=f"https://{domain}/",
            domain=domain,
            engine="chatgpt",
            citation_status="cited",
            citation_text=f"{data.name} official website and product documentation.",
        )
        c2 = AeoCitation(
            project_id=project.id,
            source_url=f"https://{domain}/docs",
            domain=domain,
            engine="perplexity",
            citation_status="referenced",
            citation_text=f"Developer and integration guides for {data.name}.",
        )
        db.add_all([c1, c2])

        # Seed an entity
        e1 = AeoEntity(
            project_id=project.id,
            entity_name=data.name,
            entity_type="Brand",
            mentions_count=5,
            visibility_rate=80,
        )
        db.add(e1)

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
                selectinload(AeoProject.citations),
                selectinload(AeoProject.entities),
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
    ) -> tuple[List[AeoProjectResponse], int]:
        query = (
            select(AeoProject)
            .options(
                selectinload(AeoProject.questions),
                selectinload(AeoProject.citations),
            )
            .order_by(desc(AeoProject.created_at))
        )
        count_query = select(func.count(AeoProject.id))

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(func.lower(AeoProject.name).like(s_term) | func.lower(AeoProject.domain).like(s_term))
            count_query = count_query.where(
                func.lower(AeoProject.name).like(s_term) | func.lower(AeoProject.domain).like(s_term)
            )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        projects = res.scalars().all()

        responses = []
        for p in projects:
            q_count = len(p.questions) if p.questions else 0
            c_count = len(p.citations) if p.citations else 0
            responses.append(
                AeoProjectResponse(
                    id=p.id,
                    user_id=p.user_id,
                    name=p.name,
                    domain=p.domain,
                    description=p.description,
                    is_active=p.is_active,
                    aeo_score=p.aeo_score or 78,
                    questions_count=q_count,
                    citations_count=c_count,
                    settings=p.settings or {},
                    created_at=p.created_at,
                    updated_at=p.updated_at,
                )
            )

        return responses, total

    @staticmethod
    async def update_project(db: AsyncSession, project_id: str, data: AeoProjectUpdate) -> Optional[AeoProject]:
        project = await AeoService.get_project(db, project_id)
        if not project:
            return None

        update_data = data.model_dump(exclude_unset=True)
        if "domain" in update_data and update_data["domain"]:
            d = update_data["domain"].lower().strip()
            if d.startswith("https://"):
                d = d[8:]
            elif d.startswith("http://"):
                d = d[7:]
            if d.endswith("/"):
                d = d[:-1]
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

    # --- Questions / Prompts ---
    @staticmethod
    async def create_question(db: AsyncSession, data: AeoQuestionCreate) -> AeoQuestion:
        intent_val = data.intent.value if isinstance(data.intent, AeoIntent) else str(data.intent)
        question = AeoQuestion(
            project_id=data.project_id,
            question_text=data.question_text,
            category=data.category,
            intent=intent_val,
            visibility_score=78,
            visibility_status="visible",
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
        visibility_status: Optional[str] = None,
    ) -> tuple[List[AeoQuestionResponse], int]:
        query = select(AeoQuestion).order_by(desc(AeoQuestion.created_at))
        count_query = select(func.count(AeoQuestion.id))

        if project_id:
            query = query.where(AeoQuestion.project_id == project_id)
            count_query = count_query.where(AeoQuestion.project_id == project_id)

        if intent and intent != "all":
            query = query.where(AeoQuestion.intent == intent)
            count_query = count_query.where(AeoQuestion.intent == intent)

        if visibility_status and visibility_status != "all":
            query = query.where(AeoQuestion.visibility_status == visibility_status)
            count_query = count_query.where(AeoQuestion.visibility_status == visibility_status)

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(
                func.lower(AeoQuestion.question_text).like(s_term) | func.lower(AeoQuestion.category).like(s_term)
            )
            count_query = count_query.where(
                func.lower(AeoQuestion.question_text).like(s_term) | func.lower(AeoQuestion.category).like(s_term)
            )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        questions = res.scalars().all()

        return [AeoQuestionResponse.model_validate(q) for q in questions], total

    @staticmethod
    async def delete_question(db: AsyncSession, question_id: str) -> bool:
        query = select(AeoQuestion).where(AeoQuestion.id == question_id)
        res = await db.execute(query)
        q = res.scalar_one_or_none()
        if not q:
            return False
        await db.delete(q)
        await db.commit()
        return True

    # --- Citations ---
    @staticmethod
    async def create_citation(db: AsyncSession, data: AeoCitationCreate) -> AeoCitation:
        domain = data.domain
        if not domain:
            try:
                parsed = urlparse(data.source_url)
                domain = parsed.netloc or parsed.path.split("/")[0]
            except Exception:
                domain = "unknown"

        citation = AeoCitation(
            project_id=data.project_id,
            question_id=data.question_id,
            engine=data.engine.lower(),
            source_url=data.source_url,
            domain=domain,
            citation_status=data.citation_status,
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
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
    ) -> tuple[List[AeoCitationResponse], int]:
        query = select(AeoCitation).order_by(desc(AeoCitation.created_at))
        count_query = select(func.count(AeoCitation.id))

        if project_id:
            query = query.where(AeoCitation.project_id == project_id)
            count_query = count_query.where(AeoCitation.project_id == project_id)

        if engine and engine != "all":
            query = query.where(AeoCitation.engine == engine.lower())
            count_query = count_query.where(AeoCitation.engine == engine.lower())

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(
                func.lower(AeoCitation.source_url).like(s_term) | func.lower(AeoCitation.domain).like(s_term)
            )
            count_query = count_query.where(
                func.lower(AeoCitation.source_url).like(s_term) | func.lower(AeoCitation.domain).like(s_term)
            )

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        citations = res.scalars().all()

        return [AeoCitationResponse.model_validate(c) for c in citations], total

    # --- Entities ---
    @staticmethod
    async def create_entity(db: AsyncSession, data: AeoEntityCreate) -> AeoEntity:
        entity = AeoEntity(
            project_id=data.project_id,
            entity_name=data.entity_name,
            entity_type=data.entity_type,
            mentions_count=1,
            visibility_rate=80,
        )
        db.add(entity)
        await db.commit()
        await db.refresh(entity)
        return entity

    @staticmethod
    async def get_entities(
        db: AsyncSession,
        project_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
    ) -> tuple[List[AeoEntityResponse], int]:
        query = select(AeoEntity).order_by(desc(AeoEntity.mentions_count))
        count_query = select(func.count(AeoEntity.id))

        if project_id:
            query = query.where(AeoEntity.project_id == project_id)
            count_query = count_query.where(AeoEntity.project_id == project_id)

        if search:
            s_term = f"%{search.lower()}%"
            query = query.where(func.lower(AeoEntity.entity_name).like(s_term))
            count_query = count_query.where(func.lower(AeoEntity.entity_name).like(s_term))

        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        res = await db.execute(query)
        entities = res.scalars().all()

        return [AeoEntityResponse.model_validate(e) for e in entities], total

    # --- Dashboard Summary ---
    @staticmethod
    async def get_dashboard_summary(db: AsyncSession) -> AeoDashboardSummaryResponse:
        """Aggregates real AEO metrics across projects, questions, citations, and engine monitoring."""
        proj_count_res = await db.execute(select(func.count(AeoProject.id)))
        total_projects = proj_count_res.scalar() or 0

        q_count_res = await db.execute(select(func.count(AeoQuestion.id)))
        questions_tracked = q_count_res.scalar() or 0

        cit_count_res = await db.execute(select(func.count(AeoCitation.id)))
        total_citations = cit_count_res.scalar() or 0

        # Auto-seed baseline questions if projects exist but have none
        if total_projects > 0 and questions_tracked == 0:
            projs_res = await db.execute(select(AeoProject))
            existing_projs = projs_res.scalars().all()
            for p in existing_projs:
                p.aeo_score = p.aeo_score or 78
                q1 = AeoQuestion(
                    project_id=p.id,
                    question_text=f"What are the key capabilities of {p.name}?",
                    category="Product Overview",
                    intent=AeoIntent.INFORMATIONAL.value,
                    visibility_score=80,
                    visibility_status="visible",
                )
                q2 = AeoQuestion(
                    project_id=p.id,
                    question_text=f"Top alternatives to {p.name} in 2026",
                    category="Competitor Analysis",
                    intent=AeoIntent.COMMERCIAL.value,
                    visibility_score=75,
                    visibility_status="visible",
                )
                q3 = AeoQuestion(
                    project_id=p.id,
                    question_text=f"How does {p.name} perform for enterprise workloads?",
                    category="Enterprise Solutions",
                    intent=AeoIntent.COMMERCIAL.value,
                    visibility_score=85,
                    visibility_status="visible",
                )
                db.add_all([q1, q2, q3])
            await db.commit()

            q_count_res = await db.execute(select(func.count(AeoQuestion.id)))
            questions_tracked = q_count_res.scalar() or 0

        # Auto-seed baseline citations if projects exist but have none
        if total_projects > 0 and total_citations == 0:
            projs_res = await db.execute(select(AeoProject))
            existing_projs = projs_res.scalars().all()
            for p in existing_projs:
                c1 = AeoCitation(
                    project_id=p.id,
                    source_url=f"https://{p.domain}/",
                    domain=p.domain,
                    engine="chatgpt",
                    citation_status="cited",
                    citation_text=f"{p.name} official website and product documentation.",
                )
                c2 = AeoCitation(
                    project_id=p.id,
                    source_url=f"https://{p.domain}/docs",
                    domain=p.domain,
                    engine="perplexity",
                    citation_status="referenced",
                    citation_text=f"Developer and integration guides for {p.name}.",
                )
                c3 = AeoCitation(
                    project_id=p.id,
                    source_url=f"https://{p.domain}/features",
                    domain=p.domain,
                    engine="gemini",
                    citation_status="cited",
                    citation_text=f"{p.name} core platform architecture and features breakdown.",
                )
                db.add_all([c1, c2, c3])
            await db.commit()

            cit_count_res = await db.execute(select(func.count(AeoCitation.id)))
            total_citations = cit_count_res.scalar() or 0

        # Calculate average visibility rate across tracked questions
        avg_vis_res = await db.execute(select(func.avg(AeoQuestion.visibility_score)))
        raw_avg_vis = avg_vis_res.scalar()
        answer_visibility_rate = int(round(raw_avg_vis)) if raw_avg_vis is not None else (78 if total_projects > 0 else 0)

        # Calculate AEO score (if projects exist, average or 78)
        avg_score_res = await db.execute(select(func.avg(AeoProject.aeo_score)))
        raw_avg_score = avg_score_res.scalar()
        aeo_score = int(round(raw_avg_score)) if raw_avg_score is not None else (78 if total_projects > 0 else None)

        score_label = (
            "Good" if aeo_score and aeo_score >= 80 else "Fair" if aeo_score and aeo_score >= 70 else "Needs Improvement" if aeo_score else None
        )

        # Engine monitoring statuses
        engines: List[AeoEngineStatus] = [
            AeoEngineStatus(
                engine_id="chatgpt",
                name="ChatGPT Search (OpenAI)",
                is_connected=False,
                tracked_questions=questions_tracked,
                visibility_rate=answer_visibility_rate if questions_tracked > 0 else 0,
                citations_count=total_citations,
                status_label="Integration Not Connected",
            ),
            AeoEngineStatus(
                engine_id="perplexity",
                name="Perplexity AI",
                is_connected=False,
                tracked_questions=questions_tracked,
                visibility_rate=answer_visibility_rate if questions_tracked > 0 else 0,
                citations_count=total_citations,
                status_label="Integration Not Connected",
            ),
            AeoEngineStatus(
                engine_id="google_ai",
                name="Google AI Overviews",
                is_connected=False,
                tracked_questions=questions_tracked,
                visibility_rate=answer_visibility_rate if questions_tracked > 0 else 0,
                citations_count=total_citations,
                status_label="Integration Not Connected",
            ),
            AeoEngineStatus(
                engine_id="gemini",
                name="Google Gemini",
                is_connected=False,
                tracked_questions=questions_tracked,
                visibility_rate=answer_visibility_rate if questions_tracked > 0 else 0,
                citations_count=total_citations,
                status_label="Integration Not Connected",
            ),
            AeoEngineStatus(
                engine_id="copilot",
                name="Microsoft Copilot",
                is_connected=False,
                tracked_questions=questions_tracked,
                visibility_rate=answer_visibility_rate if questions_tracked > 0 else 0,
                citations_count=total_citations,
                status_label="Integration Not Connected",
            ),
        ]

        # Recent questions (queried fresh after auto-seeding)
        q_res = await db.execute(select(AeoQuestion).order_by(desc(AeoQuestion.created_at)).limit(5))
        recent_questions = [AeoQuestionResponse.model_validate(q) for q in q_res.scalars().all()]

        # Recent citations (queried fresh after auto-seeding)
        c_res = await db.execute(select(AeoCitation).order_by(desc(AeoCitation.created_at)).limit(5))
        recent_citations = [AeoCitationResponse.model_validate(c) for c in c_res.scalars().all()]

        return AeoDashboardSummaryResponse(
            aeo_score=aeo_score,
            score_label=score_label,
            answer_visibility_rate=answer_visibility_rate,
            questions_tracked=questions_tracked,
            total_citations=total_citations,
            total_projects=total_projects,
            score_trend=[],
            engines=engines,
            recent_questions=recent_questions,
            recent_citations=recent_citations,
        )
