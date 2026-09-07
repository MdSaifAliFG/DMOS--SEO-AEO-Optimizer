from __future__ import annotations
import re
from typing import Any, Dict, List, Optional


class GEOMentionDetector:
    """Detects brand, alias, product, service, and entity mentions in AI generated answers."""

    def detect_mentions(
        self,
        answer_text: str,
        brand_name: str,
        aliases: Optional[List[str]] = None,
        products: Optional[List[str]] = None,
        services: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        if not answer_text or not brand_name:
            return {
                "mentioned": False,
                "mention_type": "no_mention",
                "positions": [],
                "confidence": 0.0,
                "sentiment": "neutral",
            }

        text_lower = answer_text.lower()
        brand_lower = brand_name.strip().lower()

        # 1. Exact Brand Mention
        brand_regex = r"\b" + re.escape(brand_lower) + r"\b"
        exact_matches = list(re.finditer(brand_regex, text_lower))
        if exact_matches:
            positions = [m.start() for m in exact_matches]
            return {
                "mentioned": True,
                "mention_type": "exact_brand",
                "positions": positions,
                "first_char_position": positions[0],
                "confidence": 1.0,
                "sentiment": self._analyze_sentiment(answer_text, positions[0], brand_lower),
            }

        # 2. Alias Mention
        if aliases:
            for alias in aliases:
                a_clean = alias.strip().lower()
                if not a_clean:
                    continue
                alias_matches = list(re.finditer(r"\b" + re.escape(a_clean) + r"\b", text_lower))
                if alias_matches:
                    positions = [m.start() for m in alias_matches]
                    return {
                        "mentioned": True,
                        "mention_type": "alias_mention",
                        "matched_term": alias,
                        "positions": positions,
                        "first_char_position": positions[0],
                        "confidence": 0.95,
                        "sentiment": self._analyze_sentiment(answer_text, positions[0], a_clean),
                    }

        # 3. Product Mention
        if products:
            for prod in products:
                p_clean = prod.strip().lower()
                if not p_clean:
                    continue
                prod_matches = list(re.finditer(r"\b" + re.escape(p_clean) + r"\b", text_lower))
                if prod_matches:
                    positions = [m.start() for m in prod_matches]
                    return {
                        "mentioned": True,
                        "mention_type": "product_mention",
                        "matched_term": prod,
                        "positions": positions,
                        "first_char_position": positions[0],
                        "confidence": 0.90,
                        "sentiment": self._analyze_sentiment(answer_text, positions[0], p_clean),
                    }

        # 4. Service Mention
        if services:
            for serv in services:
                s_clean = serv.strip().lower()
                if not s_clean:
                    continue
                serv_matches = list(re.finditer(r"\b" + re.escape(s_clean) + r"\b", text_lower))
                if serv_matches:
                    positions = [m.start() for m in serv_matches]
                    return {
                        "mentioned": True,
                        "mention_type": "service_mention",
                        "matched_term": serv,
                        "positions": positions,
                        "first_char_position": positions[0],
                        "confidence": 0.85,
                        "sentiment": self._analyze_sentiment(answer_text, positions[0], s_clean),
                    }

        # 5. Partial Mention (e.g. brand has 2 words and primary keyword is present)
        words = [w for w in brand_lower.split() if len(w) > 3]
        if words:
            for w in words:
                if re.search(r"\b" + re.escape(w) + r"\b", text_lower):
                    idx = text_lower.find(w)
                    return {
                        "mentioned": True,
                        "mention_type": "partial_mention",
                        "matched_term": w,
                        "positions": [idx],
                        "first_char_position": idx,
                        "confidence": 0.65,
                        "sentiment": "neutral",
                    }

        return {
            "mentioned": False,
            "mention_type": "no_mention",
            "positions": [],
            "first_char_position": None,
            "confidence": 1.0,
            "sentiment": "neutral",
        }

    def _analyze_sentiment(self, text: str, pos: int, term: str) -> str:
        # Context window around the mention (-100 to +100 chars)
        start = max(0, pos - 100)
        end = min(len(text), pos + len(term) + 100)
        snippet = text[start:end].lower()

        positive_signals = ["best", "recommended", "leader", "top", "excellent", "superior", "great", "premier", "efficient", "powerful", "highest", "leading", "winner", "outstanding"]
        negative_signals = ["avoid", "drawback", "poor", "inferior", "worst", "expensive", "outdated", "unreliable", "lacks", "limited"]


        pos_count = sum(1 for w in positive_signals if w in snippet)
        neg_count = sum(1 for w in negative_signals if w in snippet)

        if pos_count > neg_count:
            return "positive"
        elif neg_count > pos_count:
            return "negative"
        return "neutral"
