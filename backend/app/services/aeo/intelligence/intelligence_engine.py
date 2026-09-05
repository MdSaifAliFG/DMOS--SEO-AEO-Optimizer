from __future__ import annotations
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.aeo import (
    AeoAnalysis,
    AeoCitation,
    AeoEntity,
    AeoProject,
    AeoQuestion,
    AeoRecommendation,
    AeoVisibilitySnapshot,
)
from app.models.aeo_monitoring import (
    AeoAlert,
    AeoChangeEvent,
    AeoCompetitorSnapshot,
    AeoEngineSnapshot,
    AeoPromptSnapshot,
)
from app.services.aeo.intelligence.summary_generator import RuleBasedAEOIntelligenceProvider
from app.services.aeo.provider_interface import AEOProviderRegistry

logger = logging.getLogger(__name__)


class AEOIntelligenceEngine:
    """
    Core Analytics and Intelligence Aggregator for Phase 7.
    Produces deterministic competitor analytics, AI answer share of voice,
    engine comparisons, prompt movements, and executive health assessments.
    """

    @classmethod
    async def get_competitor_intelligence(
        cls,
        db: AsyncSession,
        project_id: str,
    ) -> Dict[str, Any]:
        """
        Calculates competitor share of voice, biggest gainer/loser,
        and comparison chart metrics using real stored snapshots.
        """
        project = await db.get(AeoProject, project_id)
        if not project:
            raise ValueError(f"Project {project_id} not found")

        # Get latest analysis ID
        latest_analysis_res = await db.execute(
            select(AeoAnalysis)
            .where(AeoAnalysis.project_id == project_id, AeoAnalysis.status == "completed")
            .order_by(desc(AeoAnalysis.created_at))
            .limit(1)
        )
        latest_analysis = latest_analysis_res.scalar_one_or_none()

        if not latest_analysis:
            return {
                "project_id": project_id,
                "has_data": False,
                "brand_name": project.name,
                "brand_share_of_voice": 0.0,
                "competitors_tracked": [],
                "highest_share_of_voice": None,
                "biggest_gainer": None,
                "biggest_loser": None,
                "comparison_chart_data": [],
            }

        # Query latest competitor snapshots
        comp_snaps_res = await db.execute(
            select(AeoCompetitorSnapshot).where(
                AeoCompetitorSnapshot.analysis_id == latest_analysis.id
            )
        )
        comp_snaps = list(comp_snaps_res.scalars().all())

        # Previous analysis for trend calculation
        prev_analysis_res = await db.execute(
            select(AeoAnalysis)
            .where(
                AeoAnalysis.project_id == project_id,
                AeoAnalysis.id != latest_analysis.id,
                AeoAnalysis.status == "completed",
            )
            .order_by(desc(AeoAnalysis.created_at))
            .limit(1)
        )
        prev_analysis = prev_analysis_res.scalar_one_or_none()
        prev_snaps_map: Dict[str, float] = {}
        if prev_analysis:
            prev_snaps_res = await db.execute(
                select(AeoCompetitorSnapshot).where(
                    AeoCompetitorSnapshot.analysis_id == prev_analysis.id
                )
            )
            for ps in prev_snaps_res.scalars().all():
                prev_snaps_map[ps.competitor] = ps.share_of_voice

        # Calculate Brand Share of Voice
        brand_mentions = latest_analysis.mentions_found_count or 0
        total_comp_mentions = sum(c.mention_count for c in comp_snaps)
        total_market = brand_mentions + total_comp_mentions
        brand_sov = round((brand_mentions / total_market * 100), 1) if total_market > 0 else 0.0

        competitors_tracked = []
        biggest_gainer = None
        biggest_loser = None
        max_gain = -999.0
        max_loss = 999.0

        for cs in comp_snaps:
            prev_sov = prev_snaps_map.get(cs.competitor, cs.share_of_voice)
            sov_delta = round(cs.share_of_voice - prev_sov, 1)

            trend = "stable"
            if sov_delta > 0.5:
                trend = "gaining"
                if sov_delta > max_gain:
                    max_gain = sov_delta
                    biggest_gainer = {"name": cs.competitor, "delta": f"+{sov_delta}%"}
            elif sov_delta < -0.5:
                trend = "losing"
                if sov_delta < max_loss:
                    max_loss = sov_delta
                    biggest_loser = {"name": cs.competitor, "delta": f"{sov_delta}%"}

            competitors_tracked.append({
                "name": cs.competitor,
                "mention_count": cs.mention_count,
                "citation_count": cs.citation_count,
                "share_of_voice": cs.share_of_voice,
                "average_position": cs.average_position,
                "trend": trend,
                "delta": sov_delta,
            })

        # Sort by share of voice descending
        competitors_tracked.sort(key=lambda x: x["share_of_voice"], reverse=True)
        highest_sov = competitors_tracked[0]["name"] if competitors_tracked else None

        # Build comparison chart data
        comparison_chart_data = [
            {
                "name": project.name + " (You)",
                "is_brand": True,
                "share_of_voice": brand_sov,
                "mentions": brand_mentions,
                "citations": latest_analysis.citations_found_count or 0,
            }
        ]
        for c in competitors_tracked[:4]:
            comparison_chart_data.append({
                "name": c["name"],
                "is_brand": False,
                "share_of_voice": c["share_of_voice"],
                "mentions": c["mention_count"],
                "citations": c["citation_count"],
            })

        return {
            "project_id": project_id,
            "has_data": True,
            "brand_name": project.name,
            "brand_share_of_voice": brand_sov,
            "total_market_mentions": total_market,
            "competitors_count": len(competitors_tracked),
            "highest_share_of_voice": highest_sov,
            "biggest_gainer": biggest_gainer,
            "biggest_loser": biggest_loser,
            "competitors_tracked": competitors_tracked,
            "comparison_chart_data": comparison_chart_data,
        }

    @classmethod
    async def get_engine_comparison(
        cls,
        db: AsyncSession,
        project_id: str,
    ) -> Dict[str, Any]:
        """
        Compares AI answer engines side-by-side using real snapshots.
        Highlights provider parity and marks unconfigured providers transparently.
        """
        project = await db.get(AeoProject, project_id)
        if not project:
            raise ValueError(f"Project {project_id} not found")

        # Get latest completed analysis
        latest_analysis_res = await db.execute(
            select(AeoAnalysis)
            .where(AeoAnalysis.project_id == project_id, AeoAnalysis.status == "completed")
            .order_by(desc(AeoAnalysis.created_at))
            .limit(1)
        )
        latest_analysis = latest_analysis_res.scalar_one_or_none()

        engines_to_evaluate = ["chatgpt", "gemini", "perplexity", "mock"]
        provider_display_names = {
            "chatgpt": "ChatGPT / OpenAI",
            "openai": "ChatGPT / OpenAI",
            "gemini": "Google Gemini",
            "perplexity": "Perplexity AI",
            "mock": "Mock Provider (Test Mode)",
        }

        configured_status = {}
        for eng in engines_to_evaluate:
            configured_status[eng] = AEOProviderRegistry.is_configured(eng)

        if not latest_analysis:
            engine_rows = []
            for eng in ["chatgpt", "gemini", "perplexity"]:
                engine_rows.append({
                    "provider": eng,
                    "display_name": provider_display_names.get(eng, eng.capitalize()),
                    "is_configured": configured_status.get(eng, False),
                    "has_data": False,
                    "score": None,
                    "mention_rate": None,
                    "citation_rate": None,
                    "coverage_rate": None,
                    "average_position": None,
                    "status_label": "Configured" if configured_status.get(eng) else "Provider Not Configured",
                })
            return {
                "project_id": project_id,
                "has_data": False,
                "provider_parity": "0/0 engines",
                "engines": engine_rows,
            }

        # Query engine snapshots for latest analysis
        snaps_res = await db.execute(
            select(AeoEngineSnapshot).where(AeoEngineSnapshot.analysis_id == latest_analysis.id)
        )
        snaps = {s.provider.lower(): s for s in snaps_res.scalars().all()}

        engine_rows = []
        mentioned_engines = 0
        tested_engines = 0

        # We present ChatGPT, Gemini, Perplexity (and Mock if present)
        target_keys = ["chatgpt", "gemini", "perplexity"]
        if "mock" in snaps:
            target_keys.append("mock")

        for eng in target_keys:
            snap = snaps.get(eng)
            is_conf = configured_status.get(eng, False)

            if snap:
                tested_engines += 1
                if snap.questions_mentioned > 0:
                    mentioned_engines += 1

                engine_rows.append({
                    "provider": eng,
                    "display_name": provider_display_names.get(eng, eng.capitalize()),
                    "is_configured": True,
                    "has_data": True,
                    "score": snap.score,
                    "mention_rate": snap.mention_rate,
                    "citation_rate": snap.citation_rate,
                    "coverage_rate": snap.coverage_rate,
                    "average_position": snap.average_position,
                    "questions_tested": snap.questions_tested,
                    "questions_mentioned": snap.questions_mentioned,
                    "citations_count": snap.citations_count,
                    "status_label": "Active",
                })
            else:
                engine_rows.append({
                    "provider": eng,
                    "display_name": provider_display_names.get(eng, eng.capitalize()),
                    "is_configured": is_conf,
                    "has_data": False,
                    "score": None,
                    "mention_rate": None,
                    "citation_rate": None,
                    "coverage_rate": None,
                    "average_position": None,
                    "status_label": "No Recent Data" if is_conf else "Provider Not Configured",
                })

        parity_str = f"{mentioned_engines}/{tested_engines} engines" if tested_engines > 0 else "0/0 engines"

        return {
            "project_id": project_id,
            "has_data": True,
            "provider_parity": parity_str,
            "parity_ratio": round((mentioned_engines / max(1, tested_engines) * 100), 1) if tested_engines > 0 else 0.0,
            "engines": engine_rows,
        }

    @classmethod
    async def get_executive_intelligence(
        cls,
        db: AsyncSession,
        project_id: str,
    ) -> Dict[str, Any]:
        """
        Produces high-level executive dashboard intelligence:
        - AEO Monitoring Health (distinct from AEO Visibility Score)
        - What Changed (Top 5 events)
        - Competitive Position Summary
        - Top Risks (Active Alerts)
        - Top Opportunities (Recommendations)
        - Narrative Executive Summary
        """
        project = await db.get(AeoProject, project_id)
        if not project:
            raise ValueError(f"Project {project_id} not found")

        # 1. Data Freshness
        now = datetime.now(timezone.utc)
        freshness_label = "No Data"
        freshness_score = 0
        if project.last_analyzed_at:
            days_ago = (now - project.last_analyzed_at).total_seconds() / 86400
            if days_ago <= 7:
                freshness_label = "Fresh"
                freshness_score = 100
            elif days_ago <= 30:
                freshness_label = "Recent"
                freshness_score = 80
            else:
                freshness_label = "Stale"
                freshness_score = 50

        # 2. Active Alerts & Risk Penalty
        alerts_res = await db.execute(
            select(AeoAlert)
            .where(AeoAlert.project_id == project_id, AeoAlert.status == "new")
            .order_by(desc(AeoAlert.created_at))
        )
        active_alerts = list(alerts_res.scalars().all())
        crit_count = sum(1 for a in active_alerts if a.severity == "critical")
        high_count = sum(1 for a in active_alerts if a.severity == "high")
        alert_penalty = (crit_count * 10) + (high_count * 5)

        # 3. Compute AEO Intelligence Health (0-100)
        # Base: AEO Score (or 50 if untested)
        base_score = project.aeo_score if project.aeo_score is not None else 0
        health_num = int((base_score * 0.7) + (freshness_score * 0.3) - alert_penalty)
        health_num = max(0, min(100, health_num))

        health_status = "Healthy"
        if health_num < 45 or crit_count > 0:
            health_status = "Critical Risk"
        elif health_num < 70 or high_count > 0:
            health_status = "Attention Needed"

        # 4. Top 5 Recent Changes
        changes_res = await db.execute(
            select(AeoChangeEvent)
            .where(AeoChangeEvent.project_id == project_id)
            .order_by(desc(AeoChangeEvent.created_at))
            .limit(5)
        )
        recent_changes = [
            {
                "id": c.id,
                "event_type": c.event_type,
                "severity": c.severity,
                "description": c.description,
                "previous_value": c.previous_value,
                "current_value": c.current_value,
                "delta": c.delta,
                "provider": c.provider,
                "created_at": c.created_at.isoformat(),
            }
            for c in changes_res.scalars().all()
        ]

        # 5. Top Opportunities (Phase 6 Recommendations)
        recs_res = await db.execute(
            select(AeoRecommendation)
            .where(AeoRecommendation.project_id == project_id, AeoRecommendation.status == "open")
            .order_by(desc(AeoRecommendation.priority_score))
            .limit(4)
        )
        top_recs = [
            {
                "id": r.id,
                "title": r.title,
                "category": r.category,
                "priority": r.priority,
                "estimated_impact": r.estimated_impact,
                "why_it_matters": r.why_it_matters or r.reason,
            }
            for r in recs_res.scalars().all()
        ]

        # 6. Competitor Quick Metrics
        comp_intel = await cls.get_competitor_intelligence(db, project_id)

        # 7. Executive Narrative Summary
        provider = RuleBasedAEOIntelligenceProvider()
        t_questions = len(project.questions or []) or 1
        t_mentions = sum(1 for q in (project.questions or []) if q.brand_mentioned)
        mention_rate = round((t_mentions / t_questions * 100), 1)

        t_citations = len(project.citations or [])
        own_citations = sum(1 for c in (project.citations or []) if c.citation_type == "own_domain")
        citation_rate = round((own_citations / max(1, t_citations) * 100), 1)

        telemetry = {
            "brand_name": project.name,
            "overall_score": project.aeo_score,
            "mention_rate": mention_rate,
            "citation_rate": citation_rate,
            "brand_share_of_voice": comp_intel.get("brand_share_of_voice", 0.0),
            "top_competitor": comp_intel.get("highest_share_of_voice"),
            "has_enough_data": project.last_analyzed_at is not None,
        }
        executive_summary = provider.generate_summary(telemetry)

        return {
            "project_id": project_id,
            "brand_name": project.name,
            "domain": project.domain,
            "aeo_score": project.aeo_score,
            "monitoring_health_score": health_num,
            "monitoring_health_status": health_status,
            "data_freshness": freshness_label,
            "last_analyzed_at": project.last_analyzed_at.isoformat() if project.last_analyzed_at else None,
            "executive_summary": executive_summary,
            "top_risks": [
                {
                    "id": a.id,
                    "title": a.title,
                    "severity": a.severity,
                    "description": a.description,
                    "created_at": a.created_at.isoformat(),
                }
                for a in active_alerts[:4]
            ],
            "top_opportunities": top_recs,
            "recent_changes": recent_changes,
            "competitive_position": {
                "brand_share_of_voice": comp_intel.get("brand_share_of_voice", 0.0),
                "highest_competitor": comp_intel.get("highest_share_of_voice"),
                "competitors_tracked": comp_intel.get("competitors_count", 0),
            },
        }

    @classmethod
    async def get_prompt_movements(
        cls,
        db: AsyncSession,
        project_id: str,
        movement_filter: Optional[str] = None,  # gained, lost, unchanged
    ) -> List[Dict[str, Any]]:
        """
        Extracts movement comparison between the latest two analysis runs per prompt.
        """
        # Fetch 2 most recent analyses
        analyses_res = await db.execute(
            select(AeoAnalysis)
            .where(AeoAnalysis.project_id == project_id, AeoAnalysis.status == "completed")
            .order_by(desc(AeoAnalysis.created_at))
            .limit(2)
        )
        analyses = list(analyses_res.scalars().all())
        if not analyses:
            return []

        curr_analysis = analyses[0]
        prev_analysis = analyses[1] if len(analyses) > 1 else None

        # Fetch questions
        q_res = await db.execute(select(AeoQuestion).where(AeoQuestion.project_id == project_id))
        questions = {q.id: q for q in q_res.scalars().all()}

        # Snapshots
        curr_snaps_res = await db.execute(
            select(AeoPromptSnapshot).where(AeoPromptSnapshot.analysis_id == curr_analysis.id)
        )
        curr_snaps = {(s.question_id, s.provider): s for s in curr_snaps_res.scalars().all()}

        prev_snaps = {}
        if prev_analysis:
            prev_snaps_res = await db.execute(
                select(AeoPromptSnapshot).where(AeoPromptSnapshot.analysis_id == prev_analysis.id)
            )
            prev_snaps = {(s.question_id, s.provider): s for s in prev_snaps_res.scalars().all()}

        movements = []
        for key, curr_s in curr_snaps.items():
            q_id, provider = key
            q = questions.get(q_id)
            if not q:
                continue

            prev_s = prev_snaps.get(key)
            prev_status = "Mentioned" if (prev_s and prev_s.mentioned) else ("Not Mentioned" if prev_s else "New")
            curr_status = "Mentioned" if curr_s.mentioned else "Not Mentioned"

            # Determine movement
            if prev_s:
                if not prev_s.mentioned and curr_s.mentioned:
                    mov = "gained"
                elif prev_s.mentioned and not curr_s.mentioned:
                    mov = "lost"
                else:
                    mov = "unchanged"
            else:
                mov = "gained" if curr_s.mentioned else "unchanged"

            if movement_filter and movement_filter != "all" and mov != movement_filter:
                continue

            movements.append({
                "question_id": q_id,
                "prompt": q.question_text,
                "category": q.category,
                "intent": q.intent,
                "provider": provider,
                "previous_status": prev_status,
                "current_status": curr_status,
                "movement": mov,
                "position": curr_s.position,
                "citation_found": curr_s.citation_found,
                "visibility_score": curr_s.visibility_score,
            })

        return movements

    @classmethod
    async def get_citation_movements(
        cls,
        db: AsyncSession,
        project_id: str,
    ) -> List[Dict[str, Any]]:
        """Tracks domain citations distribution and source growth."""
        cits_res = await db.execute(
            select(AeoCitation).where(AeoCitation.project_id == project_id)
        )
        cits = list(cits_res.scalars().all())

        domain_counts: Dict[str, Dict[str, Any]] = {}
        for c in cits:
            dom = c.domain or "unknown"
            if dom not in domain_counts:
                domain_counts[dom] = {
                    "domain": dom,
                    "citation_type": c.citation_type,
                    "count": 0,
                    "engines": set(),
                    "urls": [],
                }
            domain_counts[dom]["count"] += 1
            if c.engine:
                domain_counts[dom]["engines"].add(c.engine)
            if c.source_url and len(domain_counts[dom]["urls"]) < 3:
                domain_counts[dom]["urls"].append(c.source_url)

        results = []
        for dom, data in domain_counts.items():
            results.append({
                "domain": dom,
                "citation_type": data["citation_type"],
                "count": data["count"],
                "engines": list(data["engines"]),
                "sample_urls": data["urls"],
                "trend": "growing" if data["count"] >= 3 else "steady",
            })

        results.sort(key=lambda x: x["count"], reverse=True)
        return results

    @classmethod
    async def get_entity_movements(
        cls,
        db: AsyncSession,
        project_id: str,
    ) -> List[Dict[str, Any]]:
        """Tracks knowledge graph entities frequency and visibility."""
        entities_res = await db.execute(
            select(AeoEntity).where(AeoEntity.project_id == project_id)
        )
        entities = list(entities_res.scalars().all())

        results = []
        for e in entities:
            results.append({
                "id": e.id,
                "name": e.name,
                "entity_type": e.entity_type,
                "confidence_score": e.confidence_score,
                "frequency": e.frequency,
                "associated_concepts": e.associated_concepts or [],
                "trend": "strong" if e.frequency >= 3 else "moderate",
            })

        results.sort(key=lambda x: x["frequency"], reverse=True)
        return results
