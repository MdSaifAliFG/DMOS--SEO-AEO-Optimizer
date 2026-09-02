from __future__ import annotations
import re
from typing import Any, Dict, List, Optional, Set
from urllib.parse import urlparse
from app.models.aeo import AeoCitationType


class CitationExtractorEngine:
    """
    Deterministic Citation Extraction & Domain Classification Engine for Answer Engines.
    """

    NEWS_DOMAINS = {
        "techcrunch.com", "forbes.com", "bloomberg.com", "reuters.com", "wsj.com",
        "nytimes.com", "theverge.com", "wired.com", "venturebeat.com", "bbc.com",
        "cnn.com", "businessinsider.com", "mashable.com", "zdnet.com", "cnet.com",
    }

    REVIEW_DOMAINS = {
        "g2.com", "capterra.com", "trustpilot.com", "reddit.com", "quora.com",
        "producthunt.com", "softwareadvice.com", "getapp.com", "trustradius.com",
    }

    DOCS_KEYWORDS = {"docs.", "developer.", "api.", "documentation", "github.com", "gitlab.com"}

    @classmethod
    def extract_citations(
        cls,
        answer_text: str,
        target_domain: str,
        raw_citations: Optional[List[str]] = None,
        competitor_domains: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Extracts all referenced URLs from the answer text and provider metadata,
        deduplicating and classifying each citation.
        """
        urls: Set[str] = set()

        if raw_citations:
            for u in raw_citations:
                if isinstance(u, str) and u.startswith("http"):
                    urls.add(u.strip())

        # Extract markdown links [text](http...)
        md_links = re.findall(r"\[.*?\]\((https?://[^\s\)]+)\)", answer_text)
        for link in md_links:
            urls.add(link.strip())

        # Extract plain URLs
        plain_links = re.findall(r"(https?://[^\s\(\)\[\]\"'<>]+)", answer_text)
        for link in plain_links:
            # Clean trailing punctuation
            clean_link = re.sub(r"[\.,;:!?]+$", "", link.strip())
            if clean_link:
                urls.add(clean_link)

        clean_target = cls._get_root_domain(target_domain)
        comp_domains = [cls._get_root_domain(cd) for cd in (competitor_domains or []) if cd]

        citations: List[Dict[str, Any]] = []

        for url in urls:
            parsed = urlparse(url)
            netloc = parsed.netloc.lower()
            if not netloc:
                continue

            root_dom = cls._get_root_domain(netloc)
            citation_type = cls._classify_domain(root_dom, netloc, url, clean_target, comp_domains)

            citations.append({
                "source_url": url,
                "domain": root_dom,
                "citation_type": citation_type.value,
                "citation_status": "cited",
            })

        return citations

    @classmethod
    def _get_root_domain(cls, dom: str) -> str:
        d = dom.lower().replace("https://", "").replace("http://", "").split("/")[0].split(":")[0]
        if d.startswith("www."):
            d = d[4:]
        return d

    @classmethod
    def _classify_domain(
        cls,
        root_domain: str,
        netloc: str,
        url: str,
        target_domain: str,
        competitor_domains: List[str],
    ) -> AeoCitationType:
        if root_domain == target_domain or netloc.endswith("." + target_domain):
            return AeoCitationType.OWN_DOMAIN

        for cd in competitor_domains:
            if root_domain == cd or netloc.endswith("." + cd):
                return AeoCitationType.COMPETITOR

        if root_domain in cls.NEWS_DOMAINS:
            return AeoCitationType.NEWS

        if root_domain in cls.REVIEW_DOMAINS:
            return AeoCitationType.REVIEW

        if any(k in netloc or k in url.lower() for k in cls.DOCS_KEYWORDS):
            return AeoCitationType.DOCUMENTATION

        if netloc.endswith(".gov") or netloc.endswith(".edu"):
            return AeoCitationType.GOVERNMENT

        return AeoCitationType.THIRD_PARTY

    @classmethod
    def compute_citation_stats(
        cls,
        citations: List[Dict[str, Any]],
        target_domain: str,
    ) -> Dict[str, Any]:
        """
        Aggregates citation counts and calculates share of citations.
        """
        total = len(citations)
        if total == 0:
            return {
                "total_citations": 0,
                "own_citations": 0,
                "competitor_citations": 0,
                "third_party_citations": 0,
                "citation_rate": 0,
                "unique_domains": 0,
            }

        clean_target = cls._get_root_domain(target_domain)
        own_count = 0
        comp_count = 0
        third_party_count = 0
        domains: Set[str] = set()

        for c in citations:
            dom = c.get("domain", "")
            domains.add(dom)
            ctype = c.get("citation_type")
            if ctype == AeoCitationType.OWN_DOMAIN.value or dom == clean_target:
                own_count += 1
            elif ctype == AeoCitationType.COMPETITOR.value:
                comp_count += 1
            else:
                third_party_count += 1

        citation_rate = int(round((own_count / max(total, 1)) * 100))

        return {
            "total_citations": total,
            "own_citations": own_count,
            "competitor_citations": comp_count,
            "third_party_citations": third_party_count,
            "citation_rate": min(citation_rate, 100),
            "unique_domains": len(domains),
        }
