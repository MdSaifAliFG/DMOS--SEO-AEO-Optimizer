from __future__ import annotations
import re
from typing import Any, Dict, List, Optional, Tuple


class MentionDetectorEngine:
    """
    Deterministic Brand Mention Detection and Position Finder in AI Answers.
    Detects exact, alias, and domain matches, extracting relevant context snippets and ranking positions.
    """

    @classmethod
    def detect_brand_mention(
        cls,
        answer_text: str,
        brand_name: str,
        domain: str,
        aliases: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Analyzes AI answer text for brand mentions, aliases, domain mentions, and rank position.
        """
        if not answer_text or not answer_text.strip():
            return {
                "mentioned": False,
                "position": None,
                "snippets": [],
                "match_type": None,
            }

        text = answer_text
        terms_to_search: List[Tuple[str, str]] = []

        if brand_name and brand_name.strip():
            terms_to_search.append((brand_name.strip(), "brand"))

        clean_dom = domain.lower().replace("https://", "").replace("http://", "").split("/")[0]
        if clean_dom:
            terms_to_search.append((clean_dom, "domain"))
            root_name = clean_dom.split(".")[0]
            if len(root_name) > 3 and root_name.lower() != (brand_name or "").lower():
                terms_to_search.append((root_name, "domain_root"))

        if aliases:
            for alias in aliases:
                if alias and alias.strip():
                    terms_to_search.append((alias.strip(), "alias"))

        found_mentions: List[str] = []
        snippets: List[str] = []
        best_match_type = None

        # Detect mentions using regex word boundaries
        for term, match_type in terms_to_search:
            pattern = re.compile(r"\b" + re.escape(term) + r"\b", re.IGNORECASE)
            matches = list(pattern.finditer(text))
            if matches:
                found_mentions.append(term)
                if not best_match_type:
                    best_match_type = match_type

                for m in matches[:3]:
                    start = max(0, m.start() - 60)
                    end = min(len(text), m.end() + 60)
                    snippet = text[start:end].strip()
                    if start > 0:
                        snippet = "..." + snippet
                    if end < len(text):
                        snippet = snippet + "..."
                    if snippet not in snippets:
                        snippets.append(snippet)

        is_mentioned = len(found_mentions) > 0
        detected_position = None

        if is_mentioned:
            detected_position = cls._extract_position(text, brand_name, clean_dom)

        return {
            "mentioned": is_mentioned,
            "position": detected_position,
            "snippets": snippets[:3],
            "match_type": best_match_type,
            "matched_terms": found_mentions,
        }

    @classmethod
    def _extract_position(cls, text: str, brand: str, domain: str) -> Optional[int]:
        """
        Heuristic to detect if the brand is listed in an ordered ranking
        (e.g., '1. Brand', 'Top 5 ... 1. Brand', '#1 Brand').
        """
        lines = text.split("\n")
        targets = [brand.lower()]
        if domain:
            targets.append(domain.lower())
            targets.append(domain.split(".")[0].lower())

        item_rank = 1
        for line in lines:
            line_clean = line.strip()
            # Match numbered lines like '1.', '1)', '1 -', '#1'
            numbered_match = re.match(r"^#?(\d+)[\.\)\:\-]\s*(.*)", line_clean)
            if numbered_match:
                try:
                    explicit_num = int(numbered_match.group(1))
                    rest = numbered_match.group(2).lower()
                    if any(t in rest for t in targets):
                        return explicit_num
                except ValueError:
                    pass

            # Match bullet lists with incremental counter
            bullet_match = re.match(r"^[\*\-\•]\s*(.*)", line_clean)
            if bullet_match:
                bullet_content = bullet_match.group(1).lower()
                if any(t in bullet_content for t in targets):
                    return item_rank
                item_rank += 1

        # Check early occurrences: if mentioned in the first 150 chars
        first_pos = -1
        for t in targets:
            idx = text.lower().find(t)
            if idx != -1 and (first_pos == -1 or idx < first_pos):
                first_pos = idx

        if first_pos != -1 and first_pos < 120:
            return 1
        elif first_pos != -1 and first_pos < 300:
            return 2

        return None
