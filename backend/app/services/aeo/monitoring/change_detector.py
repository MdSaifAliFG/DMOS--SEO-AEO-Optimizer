from __future__ import annotations
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.aeo import (
    AeoAnalysis,
    AeoProject,
    AeoQuestion,
    AeoVisibilitySnapshot,
)
from app.models.aeo_monitoring import (
    AeoChangeEvent,
    AeoChangeEventSeverity,
    AeoChangeEventType,
    AeoCompetitorSnapshot,
    AeoEngineSnapshot,
    AeoPromptSnapshot,
)

logger = logging.getLogger(__name__)


class AEOChangeDetector:
    """
    Deterministic Change Detection Engine.
    Compares the current AEO analysis against the previous historical analysis,
    generating structured AeoChangeEvent records across scores, engines,
    competitors, prompts, and citations.
    """

    @classmethod
    async def detect_changes(
        cls,
        db: AsyncSession,
        project: AeoProject,
        current_analysis: AeoAnalysis,
    ) -> List[AeoChangeEvent]:
        """
        Runs complete change detection pipeline between current and previous analysis.
        """
        # Find previous completed analysis for this project
        prev_res = await db.execute(
            select(AeoAnalysis)
            .where(
                AeoAnalysis.project_id == project.id,
                AeoAnalysis.id != current_analysis.id,
                AeoAnalysis.status == "completed",
            )
            .order_by(desc(AeoAnalysis.created_at))
            .limit(1)
        )
        prev_analysis = prev_res.scalar_one_or_none()
        if not prev_analysis:
            logger.info(f"[AEO Change Detector] No previous analysis found for project {project.id}. Initial run baseline.")
            return []

        detected_events: List[AeoChangeEvent] = []

        # 1. Overall Score Changes
        score_events = cls._detect_score_changes(project.id, current_analysis, prev_analysis)
        detected_events.extend(score_events)

        # 2. Competitor Movements
        comp_events = await cls._detect_competitor_changes(db, project.id, current_analysis.id, prev_analysis.id)
        detected_events.extend(comp_events)

        # 3. Prompt Movements (Status, Position, Citation)
        prompt_events = await cls._detect_prompt_changes(db, project.id, current_analysis.id, prev_analysis.id)
        detected_events.extend(prompt_events)

        # 4. Engine Parity & Citation Changes
        engine_events = await cls._detect_engine_changes(db, project.id, current_analysis.id, prev_analysis.id)
        detected_events.extend(engine_events)

        # Persist all detected events
        for event in detected_events:
            db.add(event)

        return detected_events

    @classmethod
    def _detect_score_changes(
        cls,
        project_id: str,
        curr: AeoAnalysis,
        prev: AeoAnalysis,
    ) -> List[AeoChangeEvent]:
        events: List[AeoChangeEvent] = []
        c_score = curr.overall_score if curr.overall_score is not None else 0
        p_score = prev.overall_score if prev.overall_score is not None else 0
        delta = c_score - p_score

        if delta <= -10:
            events.append(
                AeoChangeEvent(
                    project_id=project_id,
                    analysis_id=curr.id,
                    event_type=AeoChangeEventType.SCORE_DROP.value,
                    severity=AeoChangeEventSeverity.CRITICAL.value,
                    description=f"Overall AEO visibility dropped by {abs(delta)} points (from {p_score} to {c_score}). Immediate optimization needed.",
                    previous_value=str(p_score),
                    current_value=str(c_score),
                    delta=float(delta),
                    percentage_delta=round((delta / max(1, p_score)) * 100, 1),
                )
            )
        elif delta <= -5:
            events.append(
                AeoChangeEvent(
                    project_id=project_id,
                    analysis_id=curr.id,
                    event_type=AeoChangeEventType.SCORE_DROP.value,
                    severity=AeoChangeEventSeverity.HIGH.value,
                    description=f"Overall AEO visibility declined by {abs(delta)} points (from {p_score} to {c_score}).",
                    previous_value=str(p_score),
                    current_value=str(c_score),
                    delta=float(delta),
                    percentage_delta=round((delta / max(1, p_score)) * 100, 1),
                )
            )
        elif delta >= 5:
            events.append(
                AeoChangeEvent(
                    project_id=project_id,
                    analysis_id=curr.id,
                    event_type=AeoChangeEventType.SCORE_INCREASE.value,
                    severity=AeoChangeEventSeverity.INFO.value,
                    description=f"Overall AEO visibility improved by +{delta} points (from {p_score} to {c_score}).",
                    previous_value=str(p_score),
                    current_value=str(c_score),
                    delta=float(delta),
                    percentage_delta=round((delta / max(1, p_score)) * 100, 1),
                )
            )

        # Mention Count Delta
        c_mentions = curr.mentions_found_count or 0
        p_mentions = prev.mentions_found_count or 0
        m_delta = c_mentions - p_mentions
        if m_delta < 0:
            events.append(
                AeoChangeEvent(
                    project_id=project_id,
                    analysis_id=curr.id,
                    event_type=AeoChangeEventType.MENTION_LOST.value,
                    severity=AeoChangeEventSeverity.HIGH.value if abs(m_delta) >= 3 else AeoChangeEventSeverity.MEDIUM.value,
                    description=f"Brand mentions decreased by {abs(m_delta)} (from {p_mentions} to {c_mentions} mentions).",
                    previous_value=str(p_mentions),
                    current_value=str(c_mentions),
                    delta=float(m_delta),
                )
            )
        elif m_delta > 0:
            events.append(
                AeoChangeEvent(
                    project_id=project_id,
                    analysis_id=curr.id,
                    event_type=AeoChangeEventType.MENTION_GAINED.value,
                    severity=AeoChangeEventSeverity.INFO.value,
                    description=f"Brand gained +{m_delta} new AI answer mentions (from {p_mentions} to {c_mentions}).",
                    previous_value=str(p_mentions),
                    current_value=str(c_mentions),
                    delta=float(m_delta),
                )
            )

        return events

    @classmethod
    async def _detect_competitor_changes(
        cls,
        db: AsyncSession,
        project_id: str,
        curr_analysis_id: str,
        prev_analysis_id: str,
    ) -> List[AeoChangeEvent]:
        events: List[AeoChangeEvent] = []

        curr_res = await db.execute(
            select(AeoCompetitorSnapshot).where(
                AeoCompetitorSnapshot.analysis_id == curr_analysis_id
            )
        )
        prev_res = await db.execute(
            select(AeoCompetitorSnapshot).where(
                AeoCompetitorSnapshot.analysis_id == prev_analysis_id
            )
        )
        curr_comps = {c.competitor: c for c in curr_res.scalars().all()}
        prev_comps = {c.competitor: c for c in prev_res.scalars().all()}

        for comp, curr_snap in curr_comps.items():
            prev_snap = prev_comps.get(comp)
            prev_sov = prev_snap.share_of_voice if prev_snap else 0.0
            curr_sov = curr_snap.share_of_voice
            sov_delta = round(curr_sov - prev_sov, 1)

            if sov_delta >= 10.0:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.COMPETITOR_GAIN.value,
                        severity=AeoChangeEventSeverity.HIGH.value,
                        description=f"Competitor '{comp}' gained +{sov_delta}% AI Answer Share of Voice (from {prev_sov}% to {curr_sov}%).",
                        previous_value=f"{prev_sov}%",
                        current_value=f"{curr_sov}%",
                        delta=sov_delta,
                        related_competitor=comp,
                    )
                )
            elif sov_delta >= 5.0:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.COMPETITOR_GAIN.value,
                        severity=AeoChangeEventSeverity.MEDIUM.value,
                        description=f"Competitor '{comp}' increased Share of Voice by +{sov_delta}%.",
                        previous_value=f"{prev_sov}%",
                        current_value=f"{curr_sov}%",
                        delta=sov_delta,
                        related_competitor=comp,
                    )
                )
            elif sov_delta <= -5.0:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.COMPETITOR_LOSS.value,
                        severity=AeoChangeEventSeverity.INFO.value,
                        description=f"Competitor '{comp}' lost {abs(sov_delta)}% Share of Voice.",
                        previous_value=f"{prev_sov}%",
                        current_value=f"{curr_sov}%",
                        delta=sov_delta,
                        related_competitor=comp,
                    )
                )

        return events

    @classmethod
    async def _detect_prompt_changes(
        cls,
        db: AsyncSession,
        project_id: str,
        curr_analysis_id: str,
        prev_analysis_id: str,
    ) -> List[AeoChangeEvent]:
        events: List[AeoChangeEvent] = []

        curr_res = await db.execute(
            select(AeoPromptSnapshot).where(AeoPromptSnapshot.analysis_id == curr_analysis_id)
        )
        prev_res = await db.execute(
            select(AeoPromptSnapshot).where(AeoPromptSnapshot.analysis_id == prev_analysis_id)
        )
        curr_prompts = {(p.question_id, p.provider): p for p in curr_res.scalars().all()}
        prev_prompts = {(p.question_id, p.provider): p for p in prev_res.scalars().all()}

        # Cache question text
        q_ids = list({k[0] for k in curr_prompts.keys()} | {k[0] for k in prev_prompts.keys()})
        q_res = await db.execute(select(AeoQuestion).where(AeoQuestion.id.in_(q_ids)))
        q_texts = {q.id: q.question_text for q in q_res.scalars().all()}

        for key, curr_snap in curr_prompts.items():
            prev_snap = prev_prompts.get(key)
            if not prev_snap:
                continue

            q_id, provider = key
            prompt_name = q_texts.get(q_id, "Tracked Prompt")

            # 1. Mention Lost (CRITICAL)
            if prev_snap.mentioned and not curr_snap.mentioned:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.MENTION_LOST.value,
                        severity=AeoChangeEventSeverity.CRITICAL.value,
                        provider=provider,
                        description=f"Brand lost visibility on high-intent prompt '{prompt_name}' in {provider.capitalize()}.",
                        previous_value="Mentioned",
                        current_value="Not Mentioned",
                        related_prompt_id=q_id,
                    )
                )

            # 2. Mention Gained
            elif not prev_snap.mentioned and curr_snap.mentioned:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.MENTION_GAINED.value,
                        severity=AeoChangeEventSeverity.INFO.value,
                        provider=provider,
                        description=f"Brand gained new mention on prompt '{prompt_name}' in {provider.capitalize()}.",
                        previous_value="Not Mentioned",
                        current_value="Mentioned",
                        related_prompt_id=q_id,
                    )
                )

            # 3. Citation Disappeared
            if prev_snap.citation_found and not curr_snap.citation_found:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.CITATION_LOST.value,
                        severity=AeoChangeEventSeverity.HIGH.value,
                        provider=provider,
                        description=f"Citation disappeared for prompt '{prompt_name}' in {provider.capitalize()}.",
                        previous_value="Citation Active",
                        current_value="No Citation",
                        related_prompt_id=q_id,
                    )
                )
            elif not prev_snap.citation_found and curr_snap.citation_found:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.CITATION_GAINED.value,
                        severity=AeoChangeEventSeverity.INFO.value,
                        provider=provider,
                        description=f"Gained source citation on prompt '{prompt_name}' in {provider.capitalize()}.",
                        previous_value="No Citation",
                        current_value="Citation Active",
                        related_prompt_id=q_id,
                    )
                )

        return events

    @classmethod
    async def _detect_engine_changes(
        cls,
        db: AsyncSession,
        project_id: str,
        curr_analysis_id: str,
        prev_analysis_id: str,
    ) -> List[AeoChangeEvent]:
        events: List[AeoChangeEvent] = []

        curr_res = await db.execute(
            select(AeoEngineSnapshot).where(AeoEngineSnapshot.analysis_id == curr_analysis_id)
        )
        prev_res = await db.execute(
            select(AeoEngineSnapshot).where(AeoEngineSnapshot.analysis_id == prev_analysis_id)
        )
        curr_engines = {e.provider: e for e in curr_res.scalars().all()}
        prev_engines = {e.provider: e for e in prev_res.scalars().all()}

        for provider, curr_snap in curr_engines.items():
            prev_snap = prev_engines.get(provider)
            if not prev_snap:
                continue

            mention_delta = round(curr_snap.mention_rate - prev_snap.mention_rate, 1)
            citation_delta = round(curr_snap.citation_rate - prev_snap.citation_rate, 1)

            if mention_delta <= -10.0:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.PROVIDER_CHANGE.value,
                        severity=AeoChangeEventSeverity.HIGH.value,
                        provider=provider,
                        description=f"Mention rate dropped by {abs(mention_delta)}% in {provider.capitalize()} (from {prev_snap.mention_rate}% to {curr_snap.mention_rate}%).",
                        previous_value=f"{prev_snap.mention_rate}%",
                        current_value=f"{curr_snap.mention_rate}%",
                        delta=mention_delta,
                    )
                )

            if citation_delta <= -10.0:
                events.append(
                    AeoChangeEvent(
                        project_id=project_id,
                        analysis_id=curr_analysis_id,
                        event_type=AeoChangeEventType.CITATION_LOST.value,
                        severity=AeoChangeEventSeverity.HIGH.value,
                        provider=provider,
                        description=f"Citation rate declined by {abs(citation_delta)}% in {provider.capitalize()}.",
                        previous_value=f"{prev_snap.citation_rate}%",
                        current_value=f"{curr_snap.citation_rate}%",
                        delta=citation_delta,
                    )
                )

        return events
