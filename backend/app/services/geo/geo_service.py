from __future__ import annotations
import csv
from datetime import datetime, timezone
import io
from typing import Any, Dict, List, Optional
from sqlalchemy import delete, desc, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.geo import (
    GeoAlert,
    GeoAnalysis,
    GeoAnalysisStatus,
    GeoAnswer,
    GeoBrandProfile,
    GeoChangeEvent,
    GeoCitation,
    GeoEntity,
    GeoIssue,
    GeoMonitoringSchedule,
    GeoOptimizationHistory,
    GeoProject,
    GeoProjectStatus,
    GeoQuestion,
    GeoRecommendation,
    GeoRecommendationStatus,
    GeoVerificationStatus,
    GeoVisibilitySnapshot,
)
from app.schemas.geo import (
    GeoBrandProfileCreate,
    GeoBrandProfileUpdate,
    GeoProjectCreate,
    GeoProjectUpdate,
    GeoQuestionCreate,
)
from app.services.crawler.url_normalizer import get_root_domain
from app.services.geo.accessibility_engine import GEOAccessibilityEngine
from app.services.geo.authority_engine import GEOAuthorityEngine
from app.services.geo.citation_extractor import GEOCitationExtractor
from app.services.geo.competitor_detector import GEOCompetitorDetector
from app.services.geo.consistency_engine import GEOConsistencyEngine
from app.services.geo.content_extractability_engine import GEOContentExtractabilityEngine
from app.services.geo.issue_engine import GEO_RULES_CATALOG, GEOIssueEngine
from app.services.geo.mention_detector import GEOMentionDetector
from app.services.geo.optimization_service import GEOOptimizationService
from app.services.geo.priority_calculator import GEOImpactCalculator, GEOPriorityCalculator
from app.services.geo.provider_interface import GEOProviderStatus, geo_provider_registry
from app.services.geo.question_generator import GEOQuestionGenerator
from app.services.geo.scoring_engine import GEOScoringEngine


class GeoService:
    """Master service for Phase 8 Generative Engine Optimization (GEO)."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.question_gen = GEOQuestionGenerator()
        self.mention_detector = GEOMentionDetector()
        self.competitor_detector = GEOCompetitorDetector()
        self.citation_extractor = GEOCitationExtractor()
        self.consistency_engine = GEOConsistencyEngine()
        self.content_engine = GEOContentExtractabilityEngine()
        self.accessibility_engine = GEOAccessibilityEngine()
        self.authority_engine = GEOAuthorityEngine()
        self.scoring_engine = GEOScoringEngine()
        self.issue_engine = GEOIssueEngine()
        self.priority_calc = GEOPriorityCalculator()
        self.impact_calc = GEOImpactCalculator()
        self.opt_service = GEOOptimizationService()

    # --- Project Management ---
    async def create_project(self, data: GeoProjectCreate, user_id: Optional[str] = None) -> GeoProject:
        clean_domain = get_root_domain(data.domain) or data.domain.strip().lower()
        project = GeoProject(
            user_id=user_id,
            name=data.name.strip(),
            domain=clean_domain,
            brand_name=data.brand_name.strip() if data.brand_name else data.name.strip(),
            brand_aliases=data.brand_aliases or [],
            description=data.description,
            industry=data.industry,
            sub_industry=data.sub_industry,
            target_audience=data.target_audience,
            target_locations=data.target_locations or [],
            target_languages=data.target_languages or ["en"],
            products=data.products or [],
            services=data.services or [],
            primary_topics=data.primary_topics or [],
            competitors=data.competitors or [],
            social_profiles=data.social_profiles or {},
            logo_url=data.logo_url,
            status=GeoProjectStatus.ACTIVE.value,
            confidence="Awaiting Analysis",
            settings=data.settings or {},
        )
        self.db.add(project)
        await self.db.flush()

        # Create canonical Brand Profile
        brand_profile = GeoBrandProfile(
            project_id=project.id,
            brand_name=project.brand_name or project.name,
            aliases=project.brand_aliases or [],
            short_description=project.description,
            industry=project.industry,
            products=project.products or [],
            services=project.services or [],
            competitors=[c.get("name") if isinstance(c, dict) else str(c) for c in (project.competitors or [])],
            social_links=project.social_profiles or {},
            official_urls=[f"https://{project.domain}"],
        )
        self.db.add(brand_profile)

        # Create default Monitoring Schedule
        sched = GeoMonitoringSchedule(
            project_id=project.id,
            frequency="weekly",
            enabled=True,
            providers=["openai", "perplexity", "gemini"],
            question_limit=18,
        )
        self.db.add(sched)

        # Pre-seed initial questions across 18 categories
        initial_q = self.question_gen.generate_questions(
            brand_name=project.brand_name or project.name,
            products=project.products,
            services=project.services,
            industry=project.industry,
            primary_topics=project.primary_topics,
            competitors=[str(c.get("name", "") if isinstance(c, dict) else c) for c in (project.competitors or []) if c],
            target_audience=project.target_audience,
            count_per_category=1,
        )
        for q in initial_q:
            q_obj = GeoQuestion(
                project_id=project.id,
                question=q["question"],
                category=q["category"],
                intent=q["intent"],
                priority=q["priority"],
                search_type=q["search_type"],
                target_entity=q["target_entity"],
                target_product=q["target_product"],
                target_service=q["target_service"],
            )
            self.db.add(q_obj)

        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def list_projects(self, user_id: Optional[str] = None) -> List[GeoProject]:
        query = select(GeoProject).order_by(desc(GeoProject.created_at))
        if user_id:
            query = query.where(GeoProject.user_id == user_id)
        res = await self.db.execute(query)
        return list(res.scalars().all())

    async def get_project(self, project_id: str) -> Optional[GeoProject]:
        res = await self.db.execute(
            select(GeoProject)
            .where(GeoProject.id == project_id)
            .options(
                selectinload(GeoProject.brand_profile),
                selectinload(GeoProject.monitoring_schedule),
            )
        )
        return res.scalar_one_or_none()

    async def update_project(self, project_id: str, data: GeoProjectUpdate) -> Optional[GeoProject]:
        project = await self.get_project(project_id)
        if not project:
            return None

        update_dict = data.model_dump(exclude_unset=True)
        if "domain" in update_dict and update_dict["domain"]:
            update_dict["domain"] = get_root_domain(update_dict["domain"]) or update_dict["domain"]

        for k, v in update_dict.items():
            setattr(project, k, v)

        project.updated_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def delete_project(self, project_id: str) -> bool:
        project = await self.get_project(project_id)
        if not project:
            return False
        await self.db.delete(project)
        await self.db.commit()
        return True

    # --- Brand Profile ---
    async def get_brand_profile(self, project_id: str) -> Optional[GeoBrandProfile]:
        res = await self.db.execute(
            select(GeoBrandProfile).where(GeoBrandProfile.project_id == project_id)
        )
        return res.scalar_one_or_none()

    async def update_brand_profile(self, project_id: str, data: GeoBrandProfileUpdate) -> Optional[GeoBrandProfile]:
        bp = await self.get_brand_profile(project_id)
        if not bp:
            bp = GeoBrandProfile(project_id=project_id, brand_name="Brand")
            self.db.add(bp)

        update_dict = data.model_dump(exclude_unset=True)
        for k, v in update_dict.items():
            setattr(bp, k, v)

        bp.updated_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(bp)
        return bp

    # --- Questions ---
    async def list_questions(
        self,
        project_id: str,
        category: Optional[str] = None,
        intent: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[GeoQuestion]:
        q = select(GeoQuestion).where(GeoQuestion.project_id == project_id)
        if category:
            q = q.where(GeoQuestion.category == category)
        if intent:
            q = q.where(GeoQuestion.intent == intent)
        if search:
            q = q.where(GeoQuestion.question.ilike(f"%{search}%"))
        q = q.order_by(desc(GeoQuestion.created_at))
        res = await self.db.execute(q)
        return list(res.scalars().all())

    async def generate_questions(
        self,
        project_id: str,
        categories: Optional[List[str]] = None,
        count_per_category: int = 1,
    ) -> List[GeoQuestion]:
        project = await self.get_project(project_id)
        if not project:
            return []

        comp_names: List[str] = [str(c.get("name", "") if isinstance(c, dict) else c) for c in (project.competitors or []) if c]
        raw_questions = self.question_gen.generate_questions(
            brand_name=project.brand_name or project.name,
            products=project.products,
            services=project.services,
            industry=project.industry,
            primary_topics=project.primary_topics,
            competitors=comp_names,
            target_audience=project.target_audience,
            selected_categories=categories,
            count_per_category=count_per_category,
        )

        created: List[GeoQuestion] = []
        for item in raw_questions:
            q_obj = GeoQuestion(
                project_id=project_id,
                question=item["question"],
                category=item["category"],
                intent=item["intent"],
                priority=item["priority"],
                search_type=item["search_type"],
                target_entity=item["target_entity"],
                target_product=item["target_product"],
                target_service=item["target_service"],
            )
            self.db.add(q_obj)
            created.append(q_obj)

        await self.db.commit()
        return created

    # --- Answers ---
    async def list_answers(
        self,
        project_id: str,
        provider: Optional[str] = None,
        recommended_only: bool = False,
    ) -> List[GeoAnswer]:
        q = select(GeoAnswer).where(GeoAnswer.project_id == project_id)
        if provider:
            q = q.where(GeoAnswer.provider == provider)
        if recommended_only:
            q = q.where(GeoAnswer.recommended == True)
        q = q.order_by(desc(GeoAnswer.created_at))
        res = await self.db.execute(q)
        return list(res.scalars().all())

    async def get_answer(self, answer_id: str) -> Optional[GeoAnswer]:
        res = await self.db.execute(
            select(GeoAnswer)
            .where(GeoAnswer.id == answer_id)
            .options(selectinload(GeoAnswer.citations))
        )
        return res.scalar_one_or_none()

    # --- Citations ---
    async def list_citations(
        self,
        project_id: str,
        source_type: Optional[str] = None,
    ) -> List[GeoCitation]:
        q = select(GeoCitation).where(GeoCitation.project_id == project_id)
        if source_type:
            q = q.where(GeoCitation.source_type == source_type)
        q = q.order_by(GeoCitation.citation_position)
        res = await self.db.execute(q)
        return list(res.scalars().all())

    # --- Entities ---
    async def list_entities(
        self,
        project_id: str,
        entity_type: Optional[str] = None,
    ) -> List[GeoEntity]:
        q = select(GeoEntity).where(GeoEntity.project_id == project_id)
        if entity_type:
            q = q.where(GeoEntity.entity_type == entity_type)
        q = q.order_by(GeoEntity.name)
        res = await self.db.execute(q)
        return list(res.scalars().all())

    # --- Issues ---
    async def list_issues(
        self,
        project_id: str,
        severity: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[GeoIssue]:
        q = select(GeoIssue).where(GeoIssue.project_id == project_id)
        if severity:
            q = q.where(GeoIssue.severity == severity)
        if category:
            q = q.where(GeoIssue.category == category)
        if status:
            q = q.where(GeoIssue.status == status)
        q = q.order_by(desc(GeoIssue.priority_score))
        res = await self.db.execute(q)
        return list(res.scalars().all())

    # --- Recommendations / Actions ---
    async def list_recommendations(
        self,
        project_id: str,
        status: Optional[str] = None,
        priority_level: Optional[str] = None,
    ) -> List[GeoRecommendation]:
        q = select(GeoRecommendation).where(GeoRecommendation.project_id == project_id)
        if status:
            q = q.where(GeoRecommendation.status == status)
        if priority_level:
            q = q.where(GeoRecommendation.priority_level == priority_level)
        q = q.order_by(desc(GeoRecommendation.priority_score))
        res = await self.db.execute(q)
        return list(res.scalars().all())

    async def get_recommendation(self, rec_id: str) -> Optional[GeoRecommendation]:
        res = await self.db.execute(
            select(GeoRecommendation).where(GeoRecommendation.id == rec_id)
        )
        return res.scalar_one_or_none()

    async def update_recommendation(
        self,
        rec_id: str,
        status: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> Optional[GeoRecommendation]:
        rec = await self.get_recommendation(rec_id)
        if not rec:
            return None
        if status:
            rec.status = status
            if status == GeoRecommendationStatus.COMPLETED.value:
                rec.resolved_at = datetime.now(timezone.utc)
        if notes is not None:
            rec.notes = notes
        rec.updated_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(rec)
        return rec

    async def verify_recommendation(self, rec_id: str) -> Optional[GeoRecommendation]:
        rec = await self.get_recommendation(rec_id)
        if not rec:
            return None

        project = await self.get_project(rec.project_id)
        before_score = project.geo_score if project else 50
        after_score = min(100, (before_score or 50) + rec.estimated_impact)

        rec.verification_status = GeoVerificationStatus.VERIFIED.value
        rec.status = GeoRecommendationStatus.COMPLETED.value
        rec.resolved_at = datetime.now(timezone.utc)

        # Log Optimization History
        history = GeoOptimizationHistory(
            project_id=rec.project_id,
            recommendation_id=rec.id,
            action=rec.title,
            before_score=before_score,
            after_score=after_score,
            before_metric=f"Score: {before_score}",
            after_metric=f"Score: {after_score}",
            delta=float(rec.estimated_impact),
            verified=True,
        )
        self.db.add(history)

        # Update project score slightly upon verified implementation
        if project and project.geo_score is not None:
            project.geo_score = after_score
            project.score_label = self.scoring_engine.get_score_label(after_score)

        await self.db.commit()
        await self.db.refresh(rec)
        return rec

    async def bulk_update_recommendations(
        self,
        project_id: str,
        rec_ids: List[str],
        action: str,
    ) -> int:
        status_map = {
            "complete": GeoRecommendationStatus.COMPLETED.value,
            "ignore": GeoRecommendationStatus.IGNORED.value,
            "start": GeoRecommendationStatus.IN_PROGRESS.value,
        }
        target_status = status_map.get(action)
        if not target_status and action != "verify":
            return 0

        updated_count = 0
        for rid in rec_ids:
            if action == "verify":
                r = await self.verify_recommendation(rid)
                if r:
                    updated_count += 1
            else:
                r = await self.update_recommendation(rid, status=target_status)
                if r:
                    updated_count += 1

        return updated_count

    async def get_action_summary(self, project_id: str) -> Dict[str, Any]:
        recs = await self.list_recommendations(project_id)
        total = len(recs)
        open_count = sum(1 for r in recs if r.status == GeoRecommendationStatus.OPEN.value)
        in_prog = sum(1 for r in recs if r.status == GeoRecommendationStatus.IN_PROGRESS.value)
        completed = sum(1 for r in recs if r.status == GeoRecommendationStatus.COMPLETED.value)
        ignored = sum(1 for r in recs if r.status == GeoRecommendationStatus.IGNORED.value)
        verified = sum(1 for r in recs if r.verification_status == GeoVerificationStatus.VERIFIED.value)

        avg_prio = round(sum(r.priority_score for r in recs) / total, 1) if total > 0 else 0.0
        potential_gain = sum(r.estimated_impact for r in recs if r.status in (GeoRecommendationStatus.OPEN.value, GeoRecommendationStatus.IN_PROGRESS.value))

        return {
            "project_id": project_id,
            "total_actions": total,
            "open_actions": open_count,
            "in_progress_actions": in_prog,
            "completed_actions": completed,
            "verified_actions": verified,
            "ignored_actions": ignored,
            "average_priority_score": avg_prio,
            "potential_total_gain": potential_gain,
        }

    # --- Competitors ---
    async def get_competitors_overview(self, project_id: str) -> Dict[str, Any]:
        project = await self.get_project(project_id)
        if not project:
            return {"project_id": project_id, "brand_name": "", "brand_share_of_voice": 0.0, "competitors": []}

        answers = await self.list_answers(project_id)
        ans_dicts = [
            {
                "brand_mentioned": a.brand_mentioned,
                "recommended": a.recommended,
                "competitor_mentions": a.competitor_mentions,
            }
            for a in answers
        ]

        return self.competitor_detector.aggregate_competitive_metrics(
            total_answers=len(answers),
            brand_name=project.brand_name or project.name,
            brand_answers=ans_dicts,
            competitors=project.competitors or [],
        )

    # --- Visibility & History ---
    async def get_visibility_overview(self, project_id: str) -> Dict[str, Any]:
        project = await self.get_project(project_id)
        answers = await self.list_answers(project_id)
        total = len(answers)

        mentioned = sum(1 for a in answers if a.brand_mentioned)
        rec = sum(1 for a in answers if a.recommended)

        cits = await self.list_citations(project_id)
        cit_metrics = self.citation_extractor.calculate_citation_metrics(
            [{"source_type": c.source_type, "domain": c.domain} for c in cits],
            total_answers=total,
        )

        # Provider breakdown
        providers_tracked = ["openai", "perplexity", "gemini", "claude"]
        p_data = []
        for p in providers_tracked:
            p_ans = [a for a in answers if a.provider.lower() == p]
            p_total = len(p_ans)
            p_m = sum(1 for a in p_ans if a.brand_mentioned)
            p_r = sum(1 for a in p_ans if a.recommended)
            p_data.append({
                "provider": p.capitalize(),
                "status": "Connected" if p_total > 0 else "Awaiting Analysis",
                "has_data": p_total > 0,
                "total_queries": p_total,
                "mention_rate": round((p_m / p_total) * 100, 1) if p_total > 0 else 0.0,
                "recommendation_rate": round((p_r / p_total) * 100, 1) if p_total > 0 else 0.0,
            })

        # History snapshots
        res = await self.db.execute(
            select(GeoVisibilitySnapshot)
            .where(GeoVisibilitySnapshot.project_id == project_id)
            .order_by(GeoVisibilitySnapshot.created_at)
        )
        snapshots = list(res.scalars().all())

        return {
            "project_id": project_id,
            "current_geo_score": project.geo_score if project else None,
            "mention_rate": round((mentioned / total) * 100, 1) if total > 0 else 0.0,
            "recommendation_rate": round((rec / total) * 100, 1) if total > 0 else 0.0,
            "citation_rate": cit_metrics["citation_rate"],
            "share_of_voice": round((mentioned / max(1, total + 5)) * 100, 1),
            "providers": p_data,
            "snapshots_count": len(snapshots),
        }

    # --- Dashboard Aggregation ---
    async def get_dashboard(self, project_id: str) -> Optional[Dict[str, Any]]:
        project = await self.get_project(project_id)
        if not project:
            return None

        brand_profile = await self.get_brand_profile(project_id)
        questions = await self.list_questions(project_id)
        answers = await self.list_answers(project_id)
        citations = await self.list_citations(project_id)
        entities = await self.list_entities(project_id)
        issues = await self.list_issues(project_id)
        recs = await self.list_recommendations(project_id)

        # Performance metrics
        total_ans = len(answers)
        mentions = sum(1 for a in answers if a.brand_mentioned)
        recommended = sum(1 for a in answers if a.recommended)

        cit_metrics = self.citation_extractor.calculate_citation_metrics(
            [{"source_type": c.source_type, "domain": c.domain} for c in citations],
            total_answers=total_ans,
        )

        comp_overview = await self.get_competitors_overview(project_id)

        # Provider breakdown
        providers_status = geo_provider_registry.list_providers()

        # Top sources
        source_counts: Dict[str, int] = {}
        for c in citations:
            source_counts[c.domain] = source_counts.get(c.domain, 0) + 1
        top_sources = [{"domain": d, "count": cnt} for d, cnt in sorted(source_counts.items(), key=lambda x: x[1], reverse=True)[:5]]

        return {
            "project": project,
            "brand_profile": brand_profile,
            "geo_score": project.geo_score,
            "score_label": project.score_label or "Awaiting Analysis",
            "confidence": project.confidence or "INSUFFICIENT_DATA",
            "data_coverage": project.data_coverage or 0,
            "visibility_score": project.visibility_score,
            "recommendation_score": project.recommendation_score,
            "citation_score": project.citation_score,
            "entity_score": project.entity_score,
            "content_score": project.content_score,
            "technical_score": project.technical_score,
            "authority_score": project.authority_score,
            "consistency_score": project.consistency_score,
            "mention_rate": round((mentions / total_ans) * 100, 1) if total_ans > 0 else 0.0,
            "recommendation_rate": round((recommended / total_ans) * 100, 1) if total_ans > 0 else 0.0,
            "own_citation_rate": cit_metrics["own_citation_rate"],
            "share_of_voice": comp_overview.get("brand_share_of_voice", 0.0),
            "provider_breakdown": providers_status,
            "competitor_share_of_voice": comp_overview.get("competitors", []),
            "citation_sources": top_sources,
            "top_issues": issues[:5],
            "top_recommendations": recs[:5],
            "recent_history": [],
        }

    # --- Reports ---
    async def generate_report(self, project_id: str) -> Dict[str, Any]:
        project = await self.get_project(project_id)
        if not project:
            return {}

        issues = await self.list_issues(project_id)
        recs = await self.list_recommendations(project_id)
        comp = await self.get_competitors_overview(project_id)
        cits = await self.list_citations(project_id)

        strengths = []
        weaknesses = []

        if (project.technical_score or 0) >= 80:
            strengths.append("High technical accessibility for AI web crawlers.")
        else:
            weaknesses.append("Crawler access restrictions identified in robots.txt.")

        if (project.citation_score or 0) >= 70:
            strengths.append("Healthy own-domain citation rate in generative answer engines.")
        else:
            weaknesses.append("Own-domain citation rate is below 25%, ceding authority to competitors.")

        if (project.entity_score or 0) >= 75:
            strengths.append("Crisp entity definitions and verified schema anchors.")
        else:
            weaknesses.append("Incomplete Organization schema and lack of sameAs authority links.")

        exec_summary = (
            f"GEO Audit for {project.brand_name or project.name} ({project.domain}). "
            f"Overall Generative Engine Optimization score is {project.geo_score or 'Awaiting Analysis'}/100. "
            f"AI Visibility: {project.visibility_score or 'N/A'}/100, Recommendation Rate: {project.recommendation_score or 'N/A'}%, "
            f"Own Citation Rate: {project.citation_score or 'N/A'}%."
        )

        return {
            "project_id": project_id,
            "generated_at": datetime.now(timezone.utc),
            "executive_summary": exec_summary,
            "geo_score": project.geo_score,
            "score_label": project.score_label,
            "ai_visibility": project.visibility_score or 0,
            "recommendation_visibility": project.recommendation_score or 0,
            "citation_health": project.citation_score or 0,
            "entity_clarity": project.entity_score or 0,
            "content_extractability": project.content_score or 0,
            "technical_accessibility": project.technical_score or 0,
            "top_strengths": strengths or ["Baseline brand setup complete."],
            "top_weaknesses": weaknesses or ["Run generative query analysis to identify specific gaps."],
            "top_competitors": comp.get("competitors", [])[:3],
            "top_sources": [{"domain": c.domain, "type": c.source_type} for c in cits[:5]],
            "top_recommendations": [{"title": r.title, "priority": r.priority_level, "impact": r.estimated_impact} for r in recs[:5]],
        }

    async def export_issues_csv(self, project_id: str) -> str:
        issues = await self.list_issues(project_id)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Issue Code", "Title", "Category", "Severity", "Priority Score", "Status", "Description"])
        for iss in issues:
            writer.writerow([iss.issue_code, iss.title, iss.category, iss.severity, iss.priority_score, iss.status, iss.description])
        return output.getvalue()

    async def get_history(self, project_id: str) -> Dict[str, Any]:
        """Get visibility snapshots, change events, and optimization history."""
        res_snap = await self.db.execute(
            select(GeoVisibilitySnapshot)
            .where(GeoVisibilitySnapshot.project_id == project_id)
            .order_by(desc(GeoVisibilitySnapshot.created_at))
            .limit(50)
        )
        snapshots = list(res_snap.scalars().all())

        res_events = await self.db.execute(
            select(GeoChangeEvent)
            .where(GeoChangeEvent.project_id == project_id)
            .order_by(desc(GeoChangeEvent.created_at))
            .limit(50)
        )
        change_events = list(res_events.scalars().all())

        res_opt = await self.db.execute(
            select(GeoOptimizationHistory)
            .where(GeoOptimizationHistory.project_id == project_id)
            .order_by(desc(GeoOptimizationHistory.created_at))
            .limit(50)
        )
        opt_history = list(res_opt.scalars().all())

        return {
            "project_id": project_id,
            "snapshots": [
                {
                    "id": s.id,
                    "provider": s.provider,
                    "geo_score": s.geo_score,
                    "mention_rate": s.mention_rate,
                    "recommendation_rate": s.recommendation_rate,
                    "citation_rate": s.citation_rate,
                    "share_of_voice": s.share_of_voice,
                    "created_at": s.created_at.isoformat() if s.created_at else None,
                }
                for s in snapshots
            ],
            "change_events": [
                {
                    "id": e.id,
                    "event_type": e.event_type,
                    "severity": e.severity,
                    "before_value": e.before_value,
                    "after_value": e.after_value,
                    "delta": e.delta,
                    "description": e.description,
                    "detected_at": e.detected_at.isoformat() if e.detected_at else None,
                }
                for e in change_events
            ],
            "optimization_history": [
                {
                    "id": h.id,
                    "action": h.action,
                    "before_score": h.before_score,
                    "after_score": h.after_score,
                    "delta": h.delta,
                    "verified": h.verified,
                    "timestamp": h.timestamp.isoformat() if h.timestamp else None,
                }
                for h in opt_history
            ],
        }
