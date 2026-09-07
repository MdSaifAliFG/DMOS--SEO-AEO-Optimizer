from __future__ import annotations
import re
from typing import Any, Dict, List, Optional
import httpx
from app.services.crawler.url_validator import validate_url


class GEOAccessibilityEngine:
    """Evaluates website accessibility for search and AI generative engine crawlers with SSRF security."""

    AI_CRAWLERS = {
        "OAI-SearchBot": {"type": "Search Crawler", "operator": "OpenAI Search"},
        "GPTBot": {"type": "Training Crawler", "operator": "OpenAI Model Training"},
        "PerplexityBot": {"type": "Search Crawler", "operator": "Perplexity AI"},
        "Googlebot": {"type": "Search Crawler", "operator": "Google Search"},
        "Google-Extended": {"type": "Training Crawler", "operator": "Google Gemini Training"},
        "ClaudeBot": {"type": "Training Crawler", "operator": "Anthropic"},
        "anthropic-ai": {"type": "Training Crawler", "operator": "Anthropic AI"},
        "Bytespider": {"type": "Crawl & Training", "operator": "ByteDance"},
    }

    async def inspect_domain_accessibility(self, domain: str) -> Dict[str, Any]:
        """
        Inspects robots.txt, HTTP headers, and accessibility for a target domain safely.
        """
        clean_domain = domain.strip().lower()
        if "://" not in clean_domain:
            target_url = f"https://{clean_domain}"
        else:
            target_url = clean_domain

        # SSRF Security check
        is_safe, error_msg = validate_url(target_url, check_dns=True)
        if not is_safe:
            return {
                "accessible": False,
                "technical_score": 0,
                "status_code": 0,
                "error": f"Security restriction: {error_msg}",
                "crawler_access": {},
                "issues": [{
                    "issue_code": "GEO033",
                    "category": "Technical",
                    "title": "Domain Blocked by Security Policy",
                    "description": error_msg,
                    "severity": "critical",
                    "affected_urls": [domain],
                    "evidence": {},
                }],
            }

        crawler_access: Dict[str, Dict[str, Any]] = {}
        issues: List[Dict[str, Any]] = []
        robots_txt_content = ""
        status_code = 200
        has_sitemap = False

        try:
            robots_url = f"{target_url.rstrip('/')}/robots.txt"
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                res = await client.get(robots_url, headers={"User-Agent": "DMOS-GEO-AuditBot/1.0"})
                status_code = res.status_code
                if res.status_code == 200:
                    robots_txt_content = res.text
                    has_sitemap = "sitemap:" in robots_txt_content.lower()
        except Exception as exc:
            robots_txt_content = ""
            status_code = 0

        # Parse robots.txt for AI bots
        parsed_rules = self._parse_robots_txt(robots_txt_content)

        search_blocked = 0
        training_blocked = 0

        for bot_name, meta in self.AI_CRAWLERS.items():
            rule = parsed_rules.get(bot_name.lower()) or parsed_rules.get("*", "allow")
            is_allowed = (rule == "allow")
            crawler_access[bot_name] = {
                "operator": meta["operator"],
                "type": meta["type"],
                "status": "ALLOWED" if is_allowed else "BLOCKED",
                "is_allowed": is_allowed,
            }
            if not is_allowed:
                if meta["type"] == "Search Crawler":
                    search_blocked += 1
                else:
                    training_blocked += 1

        # Evaluate Issues
        if not has_sitemap and status_code == 200:
            issues.append({
                "issue_code": "GEO030",
                "category": "Technical",
                "title": "Missing XML Sitemap Reference in robots.txt",
                "description": "robots.txt does not link to an XML sitemap, slowing generative indexation.",
                "severity": "medium",
                "affected_urls": [f"{target_url}/robots.txt"],
                "evidence": {},
            })

        if search_blocked > 0:
            issues.append({
                "issue_code": "GEO029",
                "category": "Technical",
                "title": "AI Search Crawlers Blocked in robots.txt",
                "description": f"{search_blocked} AI search engine bots (e.g. OAI-SearchBot or PerplexityBot) are disallowed.",
                "severity": "critical",
                "affected_urls": [f"{target_url}/robots.txt"],
                "evidence": {"search_blocked": search_blocked},
            })

        if status_code != 200 and status_code != 0:
            issues.append({
                "issue_code": "GEO032",
                "category": "Technical",
                "title": "robots.txt Inaccessible or Error Status",
                "description": f"HTTP status {status_code} returned when accessing robots.txt.",
                "severity": "high",
                "affected_urls": [f"{target_url}/robots.txt"],
                "evidence": {"status_code": status_code},
            })

        # Score calculation: 100 base, deducted by search blockers
        tech_score = 100
        if search_blocked > 0:
            tech_score -= min(60, search_blocked * 30)
        if training_blocked > 0:
            tech_score -= min(15, training_blocked * 5)
        if not has_sitemap:
            tech_score -= 10
        if status_code != 200:
            tech_score = min(tech_score, 45)

        return {
            "accessible": status_code == 200 or status_code == 0,
            "status_code": status_code,
            "technical_score": max(0, tech_score),
            "has_sitemap": has_sitemap,
            "search_crawlers_allowed": search_blocked == 0,
            "training_crawlers_allowed": training_blocked == 0,
            "crawler_access": crawler_access,
            "issues": issues,
        }

    def _parse_robots_txt(self, content: str) -> Dict[str, str]:
        if not content:
            return {"*": "allow"}

        rules: Dict[str, str] = {}
        current_agents: List[str] = []

        for line in content.split("\n"):
            line = line.strip().split("#")[0].strip()
            if not line:
                continue

            if ":" in line:
                key, val = line.split(":", 1)
                key = key.strip().lower()
                val = val.strip().lower()

                if key == "user-agent":
                    current_agents.append(val)
                elif key == "disallow":
                    for agent in current_agents:
                        if val in ("/", "/*"):
                            rules[agent] = "disallow"
                elif key == "allow":
                    for agent in current_agents:
                        if val in ("/", "/*"):
                            rules[agent] = "allow"

        return rules
