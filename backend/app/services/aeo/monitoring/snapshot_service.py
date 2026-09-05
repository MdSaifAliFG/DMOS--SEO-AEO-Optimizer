from __future__ import annotations
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.aeo import (
    AeoAnalysis,
    AeoAnswer,
    AeoCitation,
    AeoCitationType,
    AeoProject,
    AeoQuestion,
)
from app.models.aeo_monitoring import (
    AeoCompetitorSnapshot,
    AeoEngineSnapshot,
    AeoPromptSnapshot,
)

logger = logging.getLogger(__name__)


class AEOSnapshotService:
    """
    Creates and queries point-in-time snapshots for:
    1. AI Engine Performance (ChatGPT, Gemini, Perplexity)
    2. Competitor Presence and AI Answer Share of Voice
    3. Individual Prompt Visibility & Position Status
    """

    @classmethod
    async def create_all_snapshots(
        cls,
        db: AsyncSession,
        project: AeoProject,
        analysis: AeoAnalysis,
        answers: List[AeoAnswer],
        citations: List[AeoCitation],
        questions: List[AeoQuestion],
        detected_positions: Optional[Dict[str, int]] = None,
    ) -> Dict[str, int]:
        """
        Creates engine snapshots, competitor snapshots, and prompt snapshots
        grounded in the analysis's actual collected answers and citations.
        """
        engine_count = await cls.create_engine_snapshots(db, project, analysis, answers, citations, questions)
        competitor_count = await cls.create_competitor_snapshots(db, project, analysis, answers, citations)
        prompt_count = await cls.create_prompt_snapshots(db, project, analysis, answers, citations, questions, detected_positions)

        return {
            "engine_snapshots": engine_count,
            "competitor_snapshots": competitor_count,
            "prompt_snapshots": prompt_count,
        }

    @classmethod
    async def create_engine_snapshots(
        cls,
        db: AsyncSession,
        project: AeoProject,
        analysis: AeoAnalysis,
        answers: List[AeoAnswer],
        citations: List[AeoCitation],
        questions: List[AeoQuestion],
    ) -> int:
        """
        Generates per-engine visibility metrics (mention rate, citation rate, coverage, average position, score).
        """
        total_questions = len(questions) or 1
        answers_by_engine: Dict[str, List[AeoAnswer]] = {}
        for ans in answers:
            eng = (ans.engine or "unknown").lower()
            answers_by_engine.setdefault(eng, []).append(ans)

        created_count = 0
        for eng, eng_answers in answers_by_engine.items():
            questions_tested = len(eng_answers)
            questions_mentioned = sum(1 for a in eng_answers if a.brand_mentioned)
            mention_rate = round((questions_mentioned / questions_tested * 100), 1) if questions_tested > 0 else 0.0
            coverage_rate = round((questions_tested / total_questions * 100), 1)

            # Citations for this engine
            eng_citations = [c for c in citations if (c.engine or "").lower() == eng]
            citations_count = len(eng_citations)
            own_citations = sum(1 for c in eng_citations if c.citation_type == AeoCitationType.OWN_DOMAIN.value)
            citation_rate = round((own_citations / max(1, citations_count) * 100), 1) if citations_count > 0 else 0.0

            # Positions
            positions = [a.rank_position for a in eng_answers if a.brand_mentioned and a.rank_position]
            average_position = round(sum(positions) / len(positions), 1) if positions else None

            # Calculate engine specific score (0-100)
            # 35% mention + 25% citation + 20% position + 20% coverage
            pos_score = 0
            if average_position:
                pos_score = max(0, int(100 - (average_position - 1) * 20))
            engine_score = int(
                (0.35 * mention_rate)
                + (0.25 * citation_rate)
                + (0.20 * pos_score)
                + (0.20 * coverage_rate)
            )
            engine_score = max(0, min(100, engine_score))

            snapshot = AeoEngineSnapshot(
                project_id=project.id,
                analysis_id=analysis.id,
                provider=eng,
                score=engine_score,
                mention_rate=mention_rate,
                citation_rate=citation_rate,
                coverage_rate=coverage_rate,
                average_position=average_position,
                questions_tested=questions_tested,
                questions_mentioned=questions_mentioned,
                citations_count=citations_count,
            )
            db.add(snapshot)
            created_count += 1

        return created_count

    @classmethod
    async def create_competitor_snapshots(
        cls,
        db: AsyncSession,
        project: AeoProject,
        analysis: AeoAnalysis,
        answers: List[AeoAnswer],
        citations: List[AeoCitation],
    ) -> int:
        """
        Calculates competitor mentions, citations, and deterministic AI Answer Share of Voice.
        Formula: competitor_mentions / (brand_mentions + total_competitor_mentions) * 100
        """
        brand_mentions = sum(1 for a in answers if a.brand_mentioned)
        comp_mentions: Dict[str, int] = {}
        comp_citations: Dict[str, int] = {}
        comp_positions: Dict[str, List[int]] = {}

        # Collect configured competitors
        configured_competitors = [
            c["name"] if isinstance(c, dict) else str(c)
            for c in (project.competitors or [])
        ]

        # Scan answers for competitor mentions
        for ans in answers:
            mentioned_list = ans.competitors_mentioned or []
            for comp in mentioned_list:
                comp_name = str(comp).strip()
                if comp_name:
                    comp_mentions[comp_name] = comp_mentions.get(comp_name, 0) + 1

        # Scan citations for competitor sources
        for cit in citations:
            if cit.citation_type == AeoCitationType.COMPETITOR.value:
                domain = cit.domain or "unknown"
                comp_citations[domain] = comp_citations.get(domain, 0) + 1

        # Ensure all configured competitors are represented
        all_competitors = set(configured_competitors) | set(comp_mentions.keys())
        total_market_mentions = brand_mentions + sum(comp_mentions.values())

        created_count = 0
        for comp in all_competitors:
            m_count = comp_mentions.get(comp, 0)
            c_count = comp_citations.get(comp, 0)
            sov = round((m_count / total_market_mentions * 100), 1) if total_market_mentions > 0 else 0.0

            snapshot = AeoCompetitorSnapshot(
                project_id=project.id,
                analysis_id=analysis.id,
                competitor=comp,
                provider=None,  # overall across engines
                mention_count=m_count,
                citation_count=c_count,
                share_of_voice=sov,
                average_position=None,
            )
            db.add(snapshot)
            created_count += 1

        return created_count

    @classmethod
    async def create_prompt_snapshots(
        cls,
        db: AsyncSession,
        project: AeoProject,
        analysis: AeoAnalysis,
        answers: List[AeoAnswer],
        citations: List[AeoCitation],
        questions: List[AeoQuestion],
        detected_positions: Optional[Dict[str, int]] = None,
    ) -> int:
        """
        Creates granular snapshots per question and provider to track movement (status, rank, citation).
        """
        pos_map = detected_positions or {}
        created_count = 0

        # Build mapping of citations by question
        cits_by_question: Dict[str, List[AeoCitation]] = {}
        for c in citations:
            if c.question_id:
                cits_by_question.setdefault(c.question_id, []).append(c)

        for q in questions:
            q_answers = [a for a in answers if a.question_id == q.id]
            for a in q_answers:
                eng = (a.engine or "unknown").lower()
                q_cits = cits_by_question.get(q.id, [])
                has_own_cit = any(
                    c.citation_type == AeoCitationType.OWN_DOMAIN.value and (c.engine or "").lower() == eng
                    for c in q_cits
                )
                position = a.rank_position or pos_map.get(f"{q.id}:{eng}")

                # Score per prompt: 60 pts if mentioned, +20 if citation, +20 for top position
                v_score = 0
                if a.brand_mentioned:
                    v_score += 60
                    if has_own_cit:
                        v_score += 20
                    if position and position <= 3:
                        v_score += 20
                    elif position and position <= 5:
                        v_score += 10

                snapshot = AeoPromptSnapshot(
                    project_id=project.id,
                    question_id=q.id,
                    analysis_id=analysis.id,
                    provider=eng,
                    mentioned=bool(a.brand_mentioned),
                    position=position,
                    citation_found=has_own_cit,
                    visibility_score=v_score,
                )
                db.add(snapshot)
                created_count += 1

        return created_count
