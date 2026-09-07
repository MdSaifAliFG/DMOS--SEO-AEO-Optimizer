from __future__ import annotations
import re
from typing import Any, Dict, List, Optional


class GEOCompetitorDetector:
    """Detects competitor mentions, calculates competitive metrics and share of voice."""

    def detect_in_answer(
        self,
        answer_text: str,
        competitors: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        if not answer_text or not competitors:
            return []

        text_lower = answer_text.lower()
        detected: List[Dict[str, Any]] = []

        for comp in competitors:
            name = comp.get("name", "") if isinstance(comp, dict) else str(comp)
            if not name.strip():
                continue
            name_lower = name.strip().lower()

            aliases = comp.get("aliases", []) if isinstance(comp, dict) else []
            search_terms = [name_lower] + [str(a).strip().lower() for a in aliases if str(a).strip()]

            found = False
            first_pos = -1
            matched_term = name

            for term in search_terms:
                matches = list(re.finditer(r"\b" + re.escape(term) + r"\b", text_lower))
                if matches:
                    found = True
                    first_pos = matches[0].start()
                    matched_term = term
                    break

            if found:
                # Check recommendation signals
                start = max(0, first_pos - 80)
                end = min(len(answer_text), first_pos + len(matched_term) + 80)
                snippet = text_lower[start:end]

                is_recommended = bool(re.search(r"(recommend|best|top choice|leader|premier|great option)", snippet))
                detected.append({
                    "name": name,
                    "matched_term": matched_term,
                    "position": first_pos,
                    "recommended": is_recommended,
                })

        return detected

    def aggregate_competitive_metrics(
        self,
        total_answers: int,
        brand_name: str,
        brand_answers: List[Dict[str, Any]],
        competitors: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Calculates deterministic Share of Voice, Mention Rates, and Competitive Gap.
        """
        if total_answers == 0:
            return {
                "brand_share_of_voice": 0.0,
                "brand_mention_rate": 0.0,
                "brand_recommendation_rate": 0.0,
                "competitors": [],
            }

        brand_mentions = sum(1 for a in brand_answers if a.get("brand_mentioned"))
        brand_recs = sum(1 for a in brand_answers if a.get("recommended"))

        brand_mention_rate = round((brand_mentions / total_answers) * 100, 1)
        brand_rec_rate = round((brand_recs / total_answers) * 100, 1)

        # Track each competitor
        comp_stats: Dict[str, Dict[str, Any]] = {}
        for c in competitors:
            c_name = c.get("name", "") if isinstance(c, dict) else str(c)
            if c_name:
                comp_stats[c_name] = {
                    "name": c_name,
                    "domain": c.get("domain") if isinstance(c, dict) else None,
                    "mention_count": 0,
                    "rec_count": 0,
                    "positions": [],
                }

        for ans in brand_answers:
            cm_list = ans.get("competitor_mentions", [])
            for cm in cm_list:
                c_name = cm.get("name")
                if c_name in comp_stats:
                    comp_stats[c_name]["mention_count"] += 1
                    if cm.get("recommended"):
                        comp_stats[c_name]["rec_count"] += 1
                    if cm.get("position") is not None:
                        comp_stats[c_name]["positions"].append(cm["position"])

        total_market_mentions = brand_mentions + sum(s["mention_count"] for s in comp_stats.values())
        brand_sov = round((brand_mentions / total_market_mentions * 100), 1) if total_market_mentions > 0 else 0.0

        competitor_results: List[Dict[str, Any]] = []
        for c_name, data in comp_stats.items():
            m_count = data["mention_count"]
            m_rate = round((m_count / total_answers) * 100, 1)
            r_rate = round((data["rec_count"] / total_answers) * 100, 1)
            c_sov = round((m_count / total_market_mentions * 100), 1) if total_market_mentions > 0 else 0.0
            avg_pos = round(sum(data["positions"]) / len(data["positions"]), 1) if data["positions"] else None
            gap = round(m_rate - brand_mention_rate, 1)

            competitor_results.append({
                "name": c_name,
                "domain": data["domain"],
                "mention_rate": m_rate,
                "recommendation_rate": r_rate,
                "average_position": avg_pos,
                "citation_rate": 0.0,
                "share_of_voice": c_sov,
                "geo_gap": gap,
                "trend": "gaining" if gap > 5 else ("losing" if gap < -5 else "stable"),
            })

        return {
            "brand_share_of_voice": brand_sov,
            "brand_mention_rate": brand_mention_rate,
            "brand_recommendation_rate": brand_rec_rate,
            "competitors": competitor_results,
        }
