from __future__ import annotations
import re
from typing import Any, Dict, List, Optional


class CompetitorDetectorEngine:
    """
    Deterministic Competitor Mention Detection and Share of Voice Calculator.
    """

    @classmethod
    def detect_competitors(
        cls,
        answer_text: str,
        competitors: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Scans answer text for any configured competitor mentions.
        """
        if not answer_text or not competitors:
            return []

        results: List[Dict[str, Any]] = []

        for comp in competitors:
            if not isinstance(comp, dict):
                continue

            name = comp.get("name", "").strip()
            domain = comp.get("domain", "").strip().lower()

            if not name and not domain:
                continue

            terms = []
            if name:
                terms.append(name)
            if domain:
                terms.append(domain)
                root = domain.replace("https://", "").replace("http://", "").split("/")[0].split(".")[0]
                if len(root) > 3 and root.lower() != name.lower():
                    terms.append(root)

            is_mentioned = False
            mention_count = 0

            for term in terms:
                pattern = re.compile(r"\b" + re.escape(term) + r"\b", re.IGNORECASE)
                matches = list(pattern.finditer(answer_text))
                if matches:
                    is_mentioned = True
                    mention_count += len(matches)

            if is_mentioned:
                results.append({
                    "name": name or domain,
                    "domain": domain,
                    "mentioned": True,
                    "mention_count": mention_count,
                })

        return results

    @classmethod
    def aggregate_competitor_metrics(
        cls,
        competitors: List[Dict[str, Any]],
        brand_name: str,
        total_answers: int,
        brand_mentions: int,
        all_competitor_mentions: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Calculates competitor share of voice, mention rates, and rankings across all answers.
        """
        comp_stats: Dict[str, Dict[str, Any]] = {}

        for c in competitors:
            if not isinstance(c, dict):
                continue
            c_name = c.get("name") or c.get("domain") or "Competitor"
            c_domain = c.get("domain", "")
            comp_stats[c_name] = {
                "name": c_name,
                "domain": c_domain,
                "mentions": 0,
                "mention_rate": 0,
                "visibility_score": 0,
            }

        for mention in all_competitor_mentions:
            name = mention.get("name")
            if name in comp_stats:
                comp_stats[name]["mentions"] += 1

        # Calculate percentages
        results = []
        for name, stats in comp_stats.items():
            rate = int(round((stats["mentions"] / max(total_answers, 1)) * 100))
            stats["mention_rate"] = min(rate, 100)
            stats["visibility_score"] = min(rate, 100)
            results.append(stats)

        # Sort descending by mentions
        results.sort(key=lambda x: x["mentions"], reverse=True)
        return results
