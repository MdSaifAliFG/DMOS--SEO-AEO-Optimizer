from __future__ import annotations
import re
from typing import Any, Dict, List, Optional


class GEOContentExtractabilityEngine:
    """Evaluates how effectively generative AI models can parse, summarize, and extract facts from site content."""

    def analyze_content(
        self,
        pages: List[Dict[str, Any]],
        brand_name: str,
        products: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        if not pages:
            return {
                "content_score": 0,
                "content_clarity": 0,
                "information_density": 0,
                "semantic_completeness": 0,
                "answer_extractability": 0,
                "fact_completeness": 0,
                "commercial_completeness": 0,
                "issues": [{
                    "issue_code": "GEO020",
                    "category": "Content",
                    "title": "No Web Content Available for Extraction",
                    "description": "Crawler has not ingested pages to evaluate answer extractability.",
                    "severity": "high",
                    "affected_urls": [],
                    "evidence": {},
                }],
            }

        issues: List[Dict[str, Any]] = []

        total_words = 0
        total_q_headings = 0
        total_definitions = 0
        total_lists = 0
        total_tables = 0
        total_numbers = 0
        total_commercial_signals = 0
        total_comparison_signals = 0

        for page in pages:
            text = (page.get("content") or "")
            headings = page.get("headings", [])
            h1 = page.get("h1", "")
            all_headings = [h1] + headings

            words = len(text.split())
            total_words += words

            # Question headings: e.g. "What is...", "How does...", "Why choose..."
            for h in all_headings:
                if re.search(r"^(what|how|why|which|can|is|where|who)\b", h.strip().lower()) or "?" in h:
                    total_q_headings += 1

            # Direct definitions: "X is a...", "X provides...", "X refers to..."
            if re.search(r"\b(is a|is an|refers to|provides|designed to|helps you)\b", text.lower()):
                total_definitions += 1

            # Lists and bulleted structures
            list_count = len(re.findall(r"(?:^|\n)\s*[\*\-•\d+\.]\s+[^\n]+", text))
            total_lists += list_count

            # Tables
            if "<table" in text.lower() or "|---" in text or page.get("has_tables"):
                total_tables += 1

            # Facts and statistics: numbers, percentages, dates
            num_matches = len(re.findall(r"\b\d+(?:\.\d+)?%?|\$\d+", text))
            total_numbers += num_matches

            # Commercial signals: pricing, features, demo, trial, plans
            if re.search(r"\b(pricing|cost|plans|free trial|book a demo|features|buy|subscription)\b", text.lower()):
                total_commercial_signals += 1

            # Comparison signals: vs, alternative to, compared to
            if re.search(r"\b(versus|vs\.?|alternative to|compared with|comparison)\b", text.lower()):
                total_comparison_signals += 1

        avg_words = total_words / len(pages)

        # 1. Answer Extractability: presence of question headings & direct definitions
        q_score = min(100, int((total_q_headings / max(1, len(pages))) * 35))
        def_score = min(100, int((total_definitions / max(1, len(pages))) * 45))
        list_score = min(100, int((total_lists / max(1, len(pages) * 3)) * 20))
        answer_extractability = min(100, q_score + def_score + list_score)

        if answer_extractability < 50:
            issues.append({
                "issue_code": "GEO022",
                "category": "Content",
                "title": "Missing Direct Answers & Definitions",
                "description": "Content lacks explicit direct answer structures or concise definitions AI crawlers can parse.",
                "severity": "high",
                "affected_urls": [p.get("url", "/") for p in pages[:3]],
                "evidence": {"total_definitions": total_definitions, "total_q_headings": total_q_headings},
            })

        if total_q_headings == 0:
            issues.append({
                "issue_code": "GEO023",
                "category": "Content",
                "title": "Missing Question-Based Headings",
                "description": "Headings do not mirror natural conversational prompts (e.g., 'What is...', 'How does...').",
                "severity": "medium",
                "affected_urls": [p.get("url", "/") for p in pages[:2]],
                "evidence": {},
            })

        # 2. Content Clarity: reasonable sentence structures, structured formatting
        content_clarity = 85
        if avg_words < 150:
            content_clarity = 40
            issues.append({
                "issue_code": "GEO021",
                "category": "Content",
                "title": "Thin or Unstructured Content",
                "description": "Average page word count is extremely brief, hindering AI comprehension.",
                "severity": "medium",
                "affected_urls": [p.get("url", "/") for p in pages[:2]],
                "evidence": {"avg_words": int(avg_words)},
            })
        elif avg_words > 2500 and total_lists < 3:
            content_clarity = 55
            issues.append({
                "issue_code": "GEO021",
                "category": "Content",
                "title": "Long Unstructured Content",
                "description": "Lengthy content without structural sub-headings, lists, or tables impairs extractability.",
                "severity": "medium",
                "affected_urls": [p.get("url", "/") for p in pages[:2]],
                "evidence": {"avg_words": int(avg_words)},
            })

        # 3. Information Density: facts, numbers, statistics
        density_val = min(100, int((total_numbers / max(1, total_words / 100)) * 20))
        information_density = max(30, min(100, density_val))

        # 4. Fact Completeness
        fact_completeness = min(100, int(60 + (min(total_numbers, 50) * 0.8)))

        # 5. Commercial Completeness
        commercial_completeness = min(100, int((total_commercial_signals / max(1, len(pages))) * 80) + 20)
        if total_commercial_signals == 0:
            commercial_completeness = 25
            issues.append({
                "issue_code": "GEO011",
                "category": "Commercial",
                "title": "Missing Commercial Use-Case & Buying Information",
                "description": "Generative engines require clear feature tiers, use-cases, and commercial intent signals.",
                "severity": "high",
                "affected_urls": [],
                "evidence": {},
            })

        # 6. Semantic Completeness: comparison and alternative content
        if total_comparison_signals == 0:
            issues.append({
                "issue_code": "GEO008",
                "category": "Content",
                "title": "Missing Comparison & Alternative Content",
                "description": "No comparison pages or competitor alternative guides exist to capture 'X vs Y' generative queries.",
                "severity": "medium",
                "affected_urls": [],
                "evidence": {},
            })
            semantic_completeness = 50
        else:
            semantic_completeness = 85

        # Primary content score: weighted average of components
        content_score = int(
            (answer_extractability * 0.30) +
            (content_clarity * 0.20) +
            (information_density * 0.15) +
            (fact_completeness * 0.15) +
            (commercial_completeness * 0.10) +
            (semantic_completeness * 0.10)
        )

        return {
            "content_score": content_score,
            "content_clarity": content_clarity,
            "information_density": information_density,
            "semantic_completeness": semantic_completeness,
            "answer_extractability": answer_extractability,
            "fact_completeness": fact_completeness,
            "commercial_completeness": commercial_completeness,
            "issues": issues,
        }
