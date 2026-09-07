from __future__ import annotations
from typing import Any, Dict, List, Optional


GEO_RULES_CATALOG: Dict[str, Dict[str, Any]] = {
    "GEO001": {
        "title": "Brand Not Mentioned in Relevant AI Answers",
        "category": "AI Visibility",
        "severity": "critical",
        "base_priority": 95,
        "description": "Generative search engines omitted the brand when answering relevant category discovery queries.",
        "why_it_matters": "When AI engines don't mention your brand for category queries, prospective buyers never discover you during generative research.",
        "how_to_fix": "Publish comprehensive category definitional guides and optimize for entity prominence across authoritative external sources.",
    },
    "GEO002": {
        "title": "Brand Rarely Recommended by AI Models",
        "category": "Recommendations",
        "severity": "high",
        "base_priority": 88,
        "description": "The brand is mentioned neutrally or as a secondary option, but not endorsed as a top solution.",
        "why_it_matters": "AI searchers heavily bias purchasing towards items labeled as '#1 choice' or 'strongly recommended'.",
        "how_to_fix": "Emphasize clear differentiators, published awards, benchmark studies, and customer satisfaction metrics on key landing pages.",
    },
    "GEO003": {
        "title": "Competitors Dominate Category Queries",
        "category": "Competitors",
        "severity": "high",
        "base_priority": 85,
        "description": "Competitors capture over 60% share of voice in top AI search discovery queries.",
        "why_it_matters": "High competitor share of voice pushes your brand out of the buyer's generative consideration set.",
        "how_to_fix": "Target queries where competitors are listed by publishing side-by-side comparison pages and migration guides.",
    },
    "GEO004": {
        "title": "Low Own-Domain Citation Rate",
        "category": "Citations",
        "severity": "high",
        "base_priority": 82,
        "description": "AI models cite third-party sources or competitor sites rather than your official website.",
        "why_it_matters": "Own-domain citations drive qualified direct referral traffic from generative search answer widgets.",
        "how_to_fix": "Structure key landing pages with direct, concise factual definitions and question-and-answer headings.",
    },
    "GEO005": {
        "title": "Important Product Page Not Cited",
        "category": "Citations",
        "severity": "medium",
        "base_priority": 70,
        "description": "Core product pages are never returned as sources in generative answer references.",
        "why_it_matters": "Product pages that aren't cited miss out on deep-funnel purchase intent traffic.",
        "how_to_fix": "Add Product schema markup and clear feature-to-benefit bullet points on product pages.",
    },
    "GEO006": {
        "title": "Missing Product Definition",
        "category": "Content",
        "severity": "high",
        "base_priority": 80,
        "description": "Product pages lack a direct, single-sentence definition explaining what the product does.",
        "why_it_matters": "LLMs prioritize direct semantic definitions when generating answers to 'What is X?' questions.",
        "how_to_fix": "Include a concise 40-word definition sentence in the first paragraph of each product page.",
    },
    "GEO007": {
        "title": "Missing Service Definition",
        "category": "Content",
        "severity": "medium",
        "base_priority": 65,
        "description": "Service offerings are described with vague marketing jargon instead of concrete deliverables.",
        "why_it_matters": "Generative engines struggle to extract specific capabilities from abstract promotional copy.",
        "how_to_fix": "Structure service pages with clear 'What We Deliver', 'Who It Is For', and 'Process' sections.",
    },
    "GEO008": {
        "title": "Missing Comparison Content",
        "category": "Content",
        "severity": "high",
        "base_priority": 84,
        "description": "No comparison content or comparison tables exist to inform 'X vs Y' generative queries.",
        "why_it_matters": "Comparison queries represent peak buyer consideration; without comparison pages, competitors control the narrative.",
        "how_to_fix": "Build transparent head-to-head comparison pages highlighting your strengths and honest feature matrices.",
    },
    "GEO009": {
        "title": "Missing Alternatives Content",
        "category": "Content",
        "severity": "medium",
        "base_priority": 75,
        "description": "Lack of 'Alternatives to [Competitor]' content prevents appearing when users seek replacements.",
        "why_it_matters": "Switching buyers frequently ask AI 'What are alternatives to [Competitor]?'",
        "how_to_fix": "Create comprehensive alternatives guides detailing why modern teams switch to your platform.",
    },
    "GEO010": {
        "title": "Missing Pricing Information",
        "category": "Commercial",
        "severity": "high",
        "base_priority": 80,
        "description": "Pricing is hidden or completely missing, prompting AI to state 'Pricing is unavailable or contact sales only'.",
        "why_it_matters": "AI systems frequently rank transparently priced solutions higher for buyer-intent questions.",
        "how_to_fix": "Publish pricing tiers, starting costs, or clear pricing model explanations on a dedicated /pricing page.",
    },
    "GEO011": {
        "title": "Missing Use-Case Information",
        "category": "Commercial",
        "severity": "medium",
        "base_priority": 68,
        "description": "Key industry use cases and practical workflows are not documented on separate landing pages.",
        "why_it_matters": "Generative search queries are inherently problem- and use-case-driven.",
        "how_to_fix": "Create dedicated use-case pages demonstrating step-by-step solutions for specific target verticals.",
    },
    "GEO012": {
        "title": "Weak Entity Definition",
        "category": "Entity",
        "severity": "high",
        "base_priority": 78,
        "description": "Knowledge graphs lack a crisp semantic anchor connecting the brand to its specific category.",
        "why_it_matters": "Ambiguous brand identity leads AI models to confuse your offerings with unrelated companies.",
        "how_to_fix": "Standardize your one-line entity description across homepage metadata, schemas, and public profiles.",
    },
    "GEO013": {
        "title": "Entity Inconsistency",
        "category": "Consistency",
        "severity": "critical",
        "base_priority": 90,
        "description": "Inconsistent brand naming, corporate category, or legal entity across website and schemas.",
        "why_it_matters": "Contradictory entity data lowers LLM confidence in presenting the brand as an authoritative option.",
        "how_to_fix": "Align Organization schema, homepage metadata, and brand profile to identical naming and categories.",
    },
    "GEO014": {
        "title": "Missing Organization Schema",
        "category": "Consistency",
        "severity": "high",
        "base_priority": 82,
        "description": "The site does not include JSON-LD Organization or Corporation structured data.",
        "why_it_matters": "Organization schema is the primary machine-readable entity declaration for generative search engines.",
        "how_to_fix": "Add complete JSON-LD Organization schema on the homepage with name, url, logo, and sameAs links.",
    },
    "GEO015": {
        "title": "Incomplete Organization Schema",
        "category": "Consistency",
        "severity": "medium",
        "base_priority": 65,
        "description": "Organization schema exists but omits critical fields like sameAs, description, logo, or contactPoint.",
        "why_it_matters": "Incomplete schema provides insufficient relational signals for generative knowledge mapping.",
        "how_to_fix": "Enrich Organization schema with sameAs links, official social profiles, and contact details.",
    },
    "GEO016": {
        "title": "Missing sameAs Links in Schema",
        "category": "Consistency",
        "severity": "medium",
        "base_priority": 64,
        "description": "Schema lacks sameAs links referencing external authoritative knowledge graphs (Wikidata, Crunchbase, LinkedIn).",
        "why_it_matters": "sameAs attributes disambiguate your brand from similarly named entities in AI training sets.",
        "how_to_fix": "Add sameAs array pointing to Wikidata, LinkedIn, Crunchbase, and GitHub profiles.",
    },
    "GEO017": {
        "title": "Weak Brand Description",
        "category": "Entity",
        "severity": "medium",
        "base_priority": 60,
        "description": "Brand meta description is generic and does not summarize unique technological advantages.",
        "why_it_matters": "Meta descriptions are frequently quoted verbatim in AI search answer previews.",
        "how_to_fix": "Rewrite meta descriptions with clear entity labels and explicit value propositions.",
    },
    "GEO018": {
        "title": "Unclear Industry Classification",
        "category": "Entity",
        "severity": "medium",
        "base_priority": 58,
        "description": "Content uses conflicting terms to describe its primary industry or vertical.",
        "why_it_matters": "Prevents AI models from grouping your brand into the proper competitive index.",
        "how_to_fix": "Standardize your industry categorization across all main navigational footers and headers.",
    },
    "GEO019": {
        "title": "Unclear Target Audience",
        "category": "Entity",
        "severity": "medium",
        "base_priority": 55,
        "description": "Pages do not explicitly declare whether the tool is built for SMBs, developers, or enterprise teams.",
        "why_it_matters": "AI prompts like 'best tool for small teams' will skip your product without audience declarations.",
        "how_to_fix": "Add explicit 'Designed For [Target Audience]' badges or subheadings on product pages.",
    },
    "GEO020": {
        "title": "Poor Answer Extractability",
        "category": "Content",
        "severity": "high",
        "base_priority": 85,
        "description": "Text is unstructured or buried in heavy scripting without semantic HTML elements.",
        "why_it_matters": "Generative crawlers struggle to extract coherent answers from heavily obfuscated or dynamic text.",
        "how_to_fix": "Ensure core definitions and answers are rendered in clean server-side semantic HTML paragraphs.",
    },
    "GEO021": {
        "title": "Long Unstructured Content",
        "category": "Content",
        "severity": "medium",
        "base_priority": 62,
        "description": "Dense walls of text without bullet points, tables, or descriptive sub-headings.",
        "why_it_matters": "Unformatted paragraphs receive lower information density scores during LLM content parsing.",
        "how_to_fix": "Break text into 3-4 sentence paragraphs and convert feature lists into structured bullet points.",
    },
    "GEO022": {
        "title": "Missing Direct Answers",
        "category": "Content",
        "severity": "high",
        "base_priority": 86,
        "description": "Pages fail to provide immediate, definitive answers at the beginning of informational sections.",
        "why_it_matters": "Direct answers are directly extracted into AI overview cards and synthesized answers.",
        "how_to_fix": "Place concise 40-60 word direct answer summaries directly beneath question headings.",
    },
    "GEO023": {
        "title": "Missing Question-Based Headings",
        "category": "Content",
        "severity": "medium",
        "base_priority": 60,
        "description": "Headings use clever metaphors rather than the exact questions asked by searchers.",
        "why_it_matters": "Question headings act as semantic retrieval anchors for AI search engines.",
        "how_to_fix": "Rephrase H2 and H3 tags to match natural user queries (e.g., 'How Does [Product] Work?').",
    },
    "GEO024": {
        "title": "Missing Authoritative Sources",
        "category": "Authority",
        "severity": "medium",
        "base_priority": 58,
        "description": "Content makes statistical or industry claims without linking to authoritative citations.",
        "why_it_matters": "Claims without citations reduce content trustworthiness in retrieval-augmented generation.",
        "how_to_fix": "Cite reputable primary research, academic papers, or industry benchmark studies.",
    },
    "GEO025": {
        "title": "Weak External Authority Signals",
        "category": "Authority",
        "severity": "medium",
        "base_priority": 62,
        "description": "Limited presence on recognized industry directory portals, review sites, or Wikipedia.",
        "why_it_matters": "AI models verify brand legitimacy by checking multi-source consensus across the web.",
        "how_to_fix": "Build out verified company profiles on G2, Capterra, Crunchbase, and GitHub.",
    },
    "GEO026": {
        "title": "Missing Documentation",
        "category": "Authority",
        "severity": "low",
        "base_priority": 45,
        "description": "No publicly accessible user documentation, knowledge base, or developer guides.",
        "why_it_matters": "Technical documentation is one of the highest-weight citation sources for generative AI answers.",
        "how_to_fix": "Publish public documentation or troubleshooting guides with indexable URL structures.",
    },
    "GEO027": {
        "title": "Missing Case Studies",
        "category": "Authority",
        "severity": "medium",
        "base_priority": 66,
        "description": "Lack of empirical customer case studies with measurable ROI and quantifiable outcomes.",
        "why_it_matters": "AI engines cite empirical numbers and customer testimonials when answering 'Does X really work?'",
        "how_to_fix": "Publish detailed customer stories highlighting specific metrics, time savings, and results.",
    },
    "GEO028": {
        "title": "Missing Original Research",
        "category": "Authority",
        "severity": "low",
        "base_priority": 48,
        "description": "The brand has not published proprietary benchmarks, surveys, or state-of-the-industry reports.",
        "why_it_matters": "Original research generates organic third-party citations that train future AI model checkpoints.",
        "how_to_fix": "Conduct an annual customer or industry survey and publish key data findings as a free whitepaper.",
    },
    "GEO029": {
        "title": "AI Crawler Restriction in robots.txt",
        "category": "Technical",
        "severity": "critical",
        "base_priority": 98,
        "description": "robots.txt explicitly blocks major AI search crawlers (e.g. OAI-SearchBot or PerplexityBot).",
        "why_it_matters": "Blocked crawlers cannot access your website content for real-time generative search answering.",
        "how_to_fix": "Update robots.txt to permit OAI-SearchBot and PerplexityBot while keeping training bots restricted if desired.",
    },
    "GEO030": {
        "title": "Missing Sitemap in robots.txt",
        "category": "Technical",
        "severity": "medium",
        "base_priority": 50,
        "description": "robots.txt does not declare the location of the XML sitemap.",
        "why_it_matters": "AI discovery bots use sitemap directives to discover newly updated commercial pages.",
        "how_to_fix": "Add a 'Sitemap: https://yourdomain.com/sitemap.xml' directive to robots.txt.",
    },
    "GEO031": {
        "title": "Canonical Inconsistency",
        "category": "Technical",
        "severity": "high",
        "base_priority": 75,
        "description": "Canonical tags conflict with page URLs or point to outdated redirects.",
        "why_it_matters": "Conflicting canonical signals confuse generative crawlers and dilute page authority.",
        "how_to_fix": "Ensure canonical link tags match the exact requested HTTPS URL on all published pages.",
    },
    "GEO032": {
        "title": "Robots Header Restriction",
        "category": "Technical",
        "severity": "critical",
        "base_priority": 92,
        "description": "Pages serve 'noindex' or 'noarchive' in X-Robots-Tag HTTP headers or meta tags.",
        "why_it_matters": "Pages marked 'noindex' are omitted from retrieval caches used by generative engines.",
        "how_to_fix": "Remove accidental 'noindex' directives from public commercial and product landing pages.",
    },
    "GEO033": {
        "title": "Important Pages Inaccessible",
        "category": "Technical",
        "severity": "high",
        "base_priority": 85,
        "description": "Key commercial or product pages return HTTP errors (4xx or 5xx status codes).",
        "why_it_matters": "Broken URLs completely block AI engines from reading and citing product capabilities.",
        "how_to_fix": "Audit and resolve 404/500 errors and ensure 301 redirects route to valid live pages.",
    },
    "GEO034": {
        "title": "Competitor Content Gap",
        "category": "Competitors",
        "severity": "high",
        "base_priority": 80,
        "description": "Competitors cover major industry topics and sub-queries that are absent from your website.",
        "why_it_matters": "AI models defer to the most comprehensive domain when answering broad industry inquiries.",
        "how_to_fix": "Expand topic clusters to match competitor coverage on key workflow solutions.",
    },
    "GEO035": {
        "title": "Competitor Citation Gap",
        "category": "Competitors",
        "severity": "high",
        "base_priority": 82,
        "description": "Competitors have substantially higher citation rates in third-party reviews and industry media.",
        "why_it_matters": "External citations directly dictate which tools AI models recommend in comparison answers.",
        "how_to_fix": "Engage in digital PR and secure placements on authoritative software review hubs.",
    },
    "GEO036": {
        "title": "Competitor Recommendation Gap",
        "category": "Competitors",
        "severity": "high",
        "base_priority": 86,
        "description": "Competitors are consistently ranked as the primary recommendation while your brand is listed as secondary.",
        "why_it_matters": "Primary recommendations capture the majority of clicks and buyer conversions.",
        "how_to_fix": "Feature third-party validation, customer ratings, and explicit category leadership claims on landing pages.",
    },
    "GEO037": {
        "title": "Brand Fact Inconsistency",
        "category": "Consistency",
        "severity": "high",
        "base_priority": 78,
        "description": "Contradictory statements regarding brand founding, headquarters, or primary capabilities across pages.",
        "why_it_matters": "Hallucinations and hesitation occur in AI answers when source data contains conflicting facts.",
        "how_to_fix": "Audit all pages to align core company facts, statistics, and dates with your canonical brand profile.",
    },
    "GEO038": {
        "title": "Product Fact Inconsistency",
        "category": "Consistency",
        "severity": "medium",
        "base_priority": 72,
        "description": "Product feature names, specifications, or tier entitlements vary between marketing copy and docs.",
        "why_it_matters": "Generative models produce confusing or outdated product answers when names disagree.",
        "how_to_fix": "Establish a single source of truth for product feature taxonomy across website and documentation.",
    },
    "GEO039": {
        "title": "Service Fact Inconsistency",
        "category": "Consistency",
        "severity": "medium",
        "base_priority": 68,
        "description": "Discrepancies found in service deliverables or support tiers across different landing pages.",
        "why_it_matters": "Confusing service claims cause AI answer engines to report conflicting service availability.",
        "how_to_fix": "Standardize service packages and SLAs in a centralized service directory.",
    },
    "GEO040": {
        "title": "Outdated Content Signals",
        "category": "Freshness",
        "severity": "medium",
        "base_priority": 60,
        "description": "Copyright notices, copyright dates, or article timestamps are more than 18 months old.",
        "why_it_matters": "Generative search engines prioritize fresh, recently maintained sources for active market queries.",
        "how_to_fix": "Refresh publication dates, update annual statistics to 2025, and keep copyright headers current.",
    },
    "GEO041": {
        "title": "Missing FAQ Structured Data",
        "category": "Content",
        "severity": "low",
        "base_priority": 52,
        "description": "FAQ sections exist on pages but lack FAQPage JSON-LD schema markup.",
        "why_it_matters": "FAQPage schema allows AI extractors to instantly ingest question-and-answer pairs.",
        "how_to_fix": "Wrap frequently asked questions in schema.org/FAQPage structured data.",
    },
    "GEO042": {
        "title": "AI Engine Parity Imbalance",
        "category": "AI Visibility",
        "severity": "medium",
        "base_priority": 70,
        "description": "Strong visibility in one engine (e.g. Perplexity) but zero visibility in others (e.g. OpenAI or Gemini).",
        "why_it_matters": "Reliance on a single AI engine leaves brand discovery vulnerable to algorithmic shifts.",
        "how_to_fix": "Diversify content formats between real-time indexable web pages and long-term authoritative reference content.",
    },
}


class GEOIssueEngine:
    """Evaluates rule catalog against analysis metrics and produces prioritized GEO issues."""

    def evaluate_all_rules(
        self,
        geo_score: Optional[int],
        mention_rate: float,
        recommendation_rate: float,
        own_citation_rate: float,
        share_of_voice: float,
        competitor_results: List[Dict[str, Any]],
        crawler_data: Dict[str, Any],
        consistency_data: Dict[str, Any],
        content_data: Dict[str, Any],
        authority_data: Dict[str, Any],
        affected_questions: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        issues: List[Dict[str, Any]] = []

        # 1. AI Visibility & Recommendation Rules
        if mention_rate < 30.0:
            issues.append(self._create_issue("GEO001", affected_questions=affected_questions[:3] if affected_questions else []))
        if recommendation_rate < 20.0:
            issues.append(self._create_issue("GEO002", affected_questions=affected_questions[:2] if affected_questions else []))

        # 2. Competitor Rules
        highest_comp_sov = max([c.get("share_of_voice", 0) for c in competitor_results], default=0)
        if highest_comp_sov > 50.0 and share_of_voice < highest_comp_sov:
            issues.append(self._create_issue("GEO003", evidence={"highest_competitor_sov": highest_comp_sov, "brand_sov": share_of_voice}))
            issues.append(self._create_issue("GEO036"))

        # 3. Citation Rules
        if own_citation_rate < 25.0:
            issues.append(self._create_issue("GEO004", evidence={"own_citation_rate": own_citation_rate}))

        # 4. Integrate issues from sub-engines
        for sub_issue in consistency_data.get("issues", []):
            code = sub_issue.get("issue_code")
            if code in GEO_RULES_CATALOG:
                issues.append(self._create_issue(code, affected_urls=sub_issue.get("affected_urls"), evidence=sub_issue.get("evidence")))

        for sub_issue in content_data.get("issues", []):
            code = sub_issue.get("issue_code")
            if code in GEO_RULES_CATALOG:
                issues.append(self._create_issue(code, affected_urls=sub_issue.get("affected_urls"), evidence=sub_issue.get("evidence")))

        for sub_issue in crawler_data.get("issues", []):
            code = sub_issue.get("issue_code")
            if code in GEO_RULES_CATALOG:
                issues.append(self._create_issue(code, affected_urls=sub_issue.get("affected_urls"), evidence=sub_issue.get("evidence")))

        for sub_issue in authority_data.get("issues", []):
            code = sub_issue.get("issue_code")
            if code in GEO_RULES_CATALOG:
                issues.append(self._create_issue(code, affected_urls=sub_issue.get("affected_urls"), evidence=sub_issue.get("evidence")))

        # Deduplicate issues by issue_code
        seen_codes = set()
        deduped: List[Dict[str, Any]] = []
        for iss in issues:
            c = iss["issue_code"]
            if c not in seen_codes:
                seen_codes.add(c)
                deduped.append(iss)

        # Sort by priority score descending
        deduped.sort(key=lambda x: x["priority_score"], reverse=True)
        return deduped

    def _create_issue(
        self,
        code: str,
        affected_urls: Optional[List[str]] = None,
        affected_questions: Optional[List[str]] = None,
        evidence: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        rule = GEO_RULES_CATALOG.get(code, {
            "title": f"GEO Rule {code}",
            "category": "AI Visibility",
            "severity": "medium",
            "base_priority": 50,
            "description": "Generative engine visibility recommendation.",
        })

        return {
            "issue_code": code,
            "category": rule["category"],
            "title": rule["title"],
            "description": rule["description"],
            "severity": rule["severity"],
            "priority_score": rule["base_priority"],
            "affected_urls": affected_urls or [],
            "affected_questions": affected_questions or [],
            "evidence": evidence or {},
            "status": "open",
        }
