from __future__ import annotations
from typing import Any, Dict, List
from app.models.aeo import AeoCitation, AeoEntity, AeoProject, AeoQuestion
from app.services.aeo.optimization.citation_gap_analyzer import CitationGapAnalyzer
from app.services.aeo.optimization.competitor_gap_analyzer import CompetitorGapAnalyzer
from app.services.aeo.optimization.content_gap_analyzer import ContentGapAnalyzer
from app.services.aeo.optimization.entity_gap_analyzer import EntityGapAnalyzer
from app.services.aeo.optimization.prompt_gap_analyzer import PromptGapAnalyzer


class AEOGapAnalysisEngine:
    """
    Unified Orchestration Engine for Answer Engine Optimization (AEO) Gap Analysis.
    Combines:
      - Prompt Coverage & Opportunity Analyzer
      - Citation Gap Analyzer
      - Entity Health & Knowledge Graph Analyzer
      - Multi-Competitor Share of Voice Analyzer
      - Content Gap & Brief Analyzer
    """

    @classmethod
    def run_full_gap_analysis(
        cls,
        project: AeoProject,
        questions: List[AeoQuestion],
        citations: List[AeoCitation],
        entities: List[AeoEntity],
    ) -> Dict[str, Any]:
        prompt_gaps = PromptGapAnalyzer.analyze(project, questions)
        citation_gaps = CitationGapAnalyzer.analyze(project, questions, citations)
        entity_gaps = EntityGapAnalyzer.analyze(project, entities)
        competitor_gaps = CompetitorGapAnalyzer.analyze(project, questions)
        content_gaps = ContentGapAnalyzer.analyze(project, questions)

        return {
            "project_id": project.id,
            "domain": project.domain,
            "brand_name": project.brand_name or project.name,
            "prompt_gaps": prompt_gaps,
            "citation_gaps": citation_gaps,
            "entity_gaps": entity_gaps,
            "competitor_gaps": competitor_gaps,
            "content_gaps": content_gaps,
        }
