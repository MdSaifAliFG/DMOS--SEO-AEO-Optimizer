from __future__ import annotations
import re
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from app.models.geo import GeoCitationType


class GEOCitationExtractor:
    """Extracts, categorizes, and scores citation sources from generative search responses."""

    # Categorization domains dictionary
    NEWS_DOMAINS = {"reuters.com", "bloomberg.com", "techcrunch.com", "forbes.com", "wsj.com", "nytimes.com", "theverge.com", "venturebeat.com", "wired.com", "bbc.com"}
    REVIEW_DOMAINS = {"g2.com", "capterra.com", "trustpilot.com", "trustradius.com", "softwareadvice.com", "yelp.com", "producthunt.com", "gartner.com"}
    DIRECTORY_DOMAINS = {"crunchbase.com", "linkedin.com", "clutch.co", "zoominfo.com", "pitchbook.com", "yellowpages.com"}
    SOCIAL_DOMAINS = {"reddit.com", "twitter.com", "x.com", "youtube.com", "facebook.com", "medium.com", "substack.com", "github.com"}

    def extract_from_text_and_raw(
        self,
        answer_text: str,
        raw_citations: Optional[List[Dict[str, Any]]],
        own_domain: str,
        competitors: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        extracted: List[Dict[str, Any]] = []
        seen_urls = set()

        clean_own = self._normalize_domain(own_domain)
        comp_domains = set()
        if competitors:
            for c in competitors:
                cd = c.get("domain") if isinstance(c, dict) else None
                if cd:
                    comp_domains.add(self._normalize_domain(cd))

        # 1. Process structured raw citations first
        if raw_citations:
            for idx, item in enumerate(raw_citations, start=1):
                raw_url = item.get("url") or ""
                if not raw_url or raw_url in seen_urls:
                    continue
                seen_urls.add(raw_url)
                domain = self._extract_domain(raw_url)
                source_type = self._classify_source(domain, clean_own, comp_domains, raw_url)
                brand_related = (source_type == GeoCitationType.OWN_DOMAIN.value)
                comp_related = (source_type == GeoCitationType.COMPETITOR.value)

                extracted.append({
                    "url": raw_url,
                    "domain": domain,
                    "source_type": source_type,
                    "title": item.get("title") or domain,
                    "brand_related": brand_related,
                    "competitor_related": comp_related,
                    "authority_score": None,  # No fake scores
                    "authority_status": "NOT_AVAILABLE",
                    "citation_position": idx,
                })

        # 2. Extract markdown links or URLs directly from answer_text
        url_matches = re.findall(r"https?://[^\s\)\"\'>]+", answer_text)
        for raw_url in url_matches:
            # Clean trailing punctuation
            raw_url = raw_url.rstrip(".,;)]}")
            if not raw_url or raw_url in seen_urls:
                continue
            seen_urls.add(raw_url)
            domain = self._extract_domain(raw_url)
            source_type = self._classify_source(domain, clean_own, comp_domains, raw_url)
            brand_related = (source_type == GeoCitationType.OWN_DOMAIN.value)
            comp_related = (source_type == GeoCitationType.COMPETITOR.value)

            extracted.append({
                "url": raw_url,
                "domain": domain,
                "source_type": source_type,
                "title": domain,
                "brand_related": brand_related,
                "competitor_related": comp_related,
                "authority_score": None,
                "authority_status": "NOT_AVAILABLE",
                "citation_position": len(extracted) + 1,
            })

        return extracted

    def calculate_citation_metrics(
        self,
        citations: List[Dict[str, Any]],
        total_answers: int,
    ) -> Dict[str, Any]:
        if not citations:
            return {
                "citation_count": 0,
                "own_citation_count": 0,
                "competitor_citation_count": 0,
                "third_party_citation_count": 0,
                "citation_rate": 0.0,
                "own_citation_rate": 0.0,
                "competitor_citation_rate": 0.0,
                "third_party_citation_rate": 0.0,
                "citation_diversity": 0,
            }

        total_cits = len(citations)
        own_cits = sum(1 for c in citations if c.get("source_type") == GeoCitationType.OWN_DOMAIN.value)
        comp_cits = sum(1 for c in citations if c.get("source_type") == GeoCitationType.COMPETITOR.value)
        third_party_cits = total_cits - own_cits - comp_cits

        unique_domains = len({c.get("domain") for c in citations if c.get("domain")})
        diversity_score = min(100, int((unique_domains / max(1, total_cits)) * 100))

        rate_denom = max(1, total_answers)
        return {
            "citation_count": total_cits,
            "own_citation_count": own_cits,
            "competitor_citation_count": comp_cits,
            "third_party_citation_count": third_party_cits,
            "citation_rate": round((total_cits / rate_denom) * 100, 1),
            "own_citation_rate": round((own_cits / total_cits * 100), 1) if total_cits > 0 else 0.0,
            "competitor_citation_rate": round((comp_cits / total_cits * 100), 1) if total_cits > 0 else 0.0,
            "third_party_citation_rate": round((third_party_cits / total_cits * 100), 1) if total_cits > 0 else 0.0,
            "citation_diversity": diversity_score,
        }

    def _classify_source(
        self,
        domain: str,
        own_domain: str,
        comp_domains: set,
        url: str,
    ) -> str:
        d = domain.lower()
        if own_domain and (d == own_domain or d.endswith("." + own_domain)):
            return GeoCitationType.OWN_DOMAIN.value

        for cd in comp_domains:
            if cd and (d == cd or d.endswith("." + cd)):
                return GeoCitationType.COMPETITOR.value

        if any(d == nd or d.endswith("." + nd) for nd in self.NEWS_DOMAINS):
            return GeoCitationType.NEWS.value

        if any(d == rd or d.endswith("." + rd) for rd in self.REVIEW_DOMAINS):
            return GeoCitationType.REVIEW.value

        if any(d == dd or d.endswith("." + dd) for dd in self.DIRECTORY_DOMAINS):
            return GeoCitationType.DIRECTORY.value

        if any(d == sd or d.endswith("." + sd) for sd in self.SOCIAL_DOMAINS):
            return GeoCitationType.SOCIAL.value

        if "docs." in d or "/docs/" in url.lower() or "/api/" in url.lower() or "/developer/" in url.lower():
            return GeoCitationType.DOCUMENTATION.value

        return GeoCitationType.THIRD_PARTY.value

    def _extract_domain(self, url: str) -> str:
        try:
            parsed = urlparse(url)
            netloc = parsed.netloc or url.split("/")[0]
            return self._normalize_domain(netloc)
        except Exception:
            return url.split("/")[0]

    def _normalize_domain(self, domain: str) -> str:
        d = domain.lower().strip()
        if d.startswith("http://"):
            d = d[7:]
        elif d.startswith("https://"):
            d = d[8:]
        if d.startswith("www."):
            d = d[4:]
        return d.split("/")[0].split(":")[0]
