from __future__ import annotations
from typing import Any, Dict, List

# 30+ Deterministic AEO Recommendation Rules across 15 Strategic Categories
AEO_RECOMMENDATION_CATALOG: List[Dict[str, Any]] = [
    # 1. Brand Visibility
    {
        "code": "AEO-BRAND-001",
        "title": "Establish Direct Brand Entity Association in AI Engines",
        "category": "Brand Visibility",
        "severity": "critical",
        "why_it_matters": "AI answer engines synthesize answers around clear entity definitions. When brand association is ambiguous, models omit the brand in favor of known entities.",
        "how_to_fix": "Add unambiguous Organization schema, maintain a canonical About page, and ensure factual brand definitions match across Wikipedia/Wikidata and major knowledge graphs.",
        "default_impact": 12,
        "implementation_steps": [
            "Implement complete JSON-LD Organization schema on root homepage.",
            "Verify brand name and aliases are consistent across social profiles and Crunchbase.",
            "Publish a dedicated, factual 'About the Company' page with primary entity relationships.",
            "Re-run AEO analysis to verify brand entity extraction.",
        ],
    },
    {
        "code": "AEO-BRAND-002",
        "title": "Resolve Brand Alias & Keyword Disambiguation",
        "category": "Brand Visibility",
        "severity": "high",
        "why_it_matters": "When brand aliases or common names overlap with generic terms, LLMs fail to recognize the product in conversational prompts.",
        "how_to_fix": "Pair brand aliases directly with descriptive industry categories in page titles, header tags, and anchor texts.",
        "default_impact": 8,
        "implementation_steps": [
            "Audit brand mentions across the website to ensure standard naming conventions.",
            "Pair brand aliases with parent category keywords in page metadata.",
            "Add alternateName property into Organization schema markup.",
        ],
    },

    # 2. Prompt Coverage
    {
        "code": "AEO-PROMPT-001",
        "title": "Target Missing High-Intent Buyer Prompts",
        "category": "Prompt Coverage",
        "severity": "critical",
        "why_it_matters": "When AI models receive bottom-of-funnel buyer prompts, brands without direct content coverage are excluded from recommendations.",
        "how_to_fix": "Publish dedicated solution landing pages formatted with direct answers to high-value buyer queries.",
        "default_impact": 10,
        "implementation_steps": [
            "Review the uncovered buyer prompts in the AEO Prompts tab.",
            "Create dedicated landing pages answering each specific search intent.",
            "Structure answers with concise 2-3 sentence overview paragraphs before deep dives.",
            "Submit new URLs for indexing and re-crawl in DMOS.",
        ],
    },
    {
        "code": "AEO-PROMPT-002",
        "title": "Expand Commercial Evaluation Prompt Coverage",
        "category": "Prompt Coverage",
        "severity": "high",
        "why_it_matters": "Commercial evaluation prompts represent high-intent prospects comparing solutions before purchasing.",
        "how_to_fix": "Provide explicit capability checklists and evaluation criteria answering 'best tool for X' queries.",
        "default_impact": 8,
        "implementation_steps": [
            "Identify top 5 industry evaluation criteria asked in AI answer prompts.",
            "Build an interactive feature matrix addressing each criterion objectively.",
            "Include customer proof points and quantitative performance metrics.",
        ],
    },

    # 3. Content Gaps
    {
        "code": "AEO-CONTENT-001",
        "title": "Publish Direct-Answer Problem-Solution Guides",
        "category": "Content Gaps",
        "severity": "high",
        "why_it_matters": "Generative answer engines extract snippets directly from pages that answer technical problems concisely.",
        "how_to_fix": "Structure guides with clear problem definitions, actionable steps, and summary callouts.",
        "default_impact": 7,
        "implementation_steps": [
            "Identify recurring troubleshooting and problem prompts in your industry.",
            "Write step-by-step guides using numbered lists and semantic HTML5 headings.",
            "Include code snippets or visual diagrams where applicable.",
        ],
    },
    {
        "code": "AEO-CONTENT-002",
        "title": "Create Comprehensive Industry Benchmark Report",
        "category": "Content Gaps",
        "severity": "medium",
        "why_it_matters": "AI engines cite primary research and statistical benchmarks as authoritative grounding sources.",
        "how_to_fix": "Publish proprietary data studies, benchmark metrics, and downloadable industry summaries.",
        "default_impact": 9,
        "implementation_steps": [
            "Aggregate internal usage statistics or survey data into an annual industry report.",
            "Highlight key statistical findings in bulleted summary blocks.",
            "Include clear citation and embed guidelines for journalists and researchers.",
        ],
    },

    # 4. Citation Opportunities
    {
        "code": "AEO-CITE-001",
        "title": "Earn Citations on Frequently Quoted Industry Sources",
        "category": "Citation Opportunities",
        "severity": "critical",
        "why_it_matters": "AI engines like Perplexity and SearchGPT rely heavily on third-party documentation and authoritative review sites.",
        "how_to_fix": "Secure coverage on top cited review platforms, industry wikis, and technical documentation hubs.",
        "default_impact": 10,
        "implementation_steps": [
            "Check the Citations Explorer to identify top cited external domains.",
            "Claim and optimize brand profiles on those top-cited platforms.",
            "Contribute authoritative documentation or case studies to industry repositories.",
        ],
    },
    {
        "code": "AEO-CITE-002",
        "title": "Convert Brand Mentions into Direct Domain Citations",
        "category": "Citation Opportunities",
        "severity": "high",
        "why_it_matters": "When AI models cite external news or blog articles that mention your brand without linking your domain, referral traffic is lost.",
        "how_to_fix": "Publish canonical primary sources and technical whitepapers that third parties must link directly.",
        "default_impact": 7,
        "implementation_steps": [
            "Publish canonical documentation URLs for all proprietary frameworks.",
            "Outreach to quoting publications with canonical link references.",
        ],
    },

    # 5. Entity Optimization
    {
        "code": "AEO-ENTITY-001",
        "title": "Strengthen Core Product Entity Relationships",
        "category": "Entity Optimization",
        "severity": "high",
        "why_it_matters": "Knowledge graphs require strong semantic connections between brand entities and specific product capabilities.",
        "how_to_fix": "Use Product schema markup with explicit offers, categories, and knowsAbout/brand links.",
        "default_impact": 8,
        "implementation_steps": [
            "Inject Product schema on all primary offering pages.",
            "Define explicit isRelatedTo and brand properties connecting products to the company.",
            "Align terminology across technical documentation and marketing pages.",
        ],
    },
    {
        "code": "AEO-ENTITY-002",
        "title": "Enhance Topic & Technology Entity Graph Integration",
        "category": "Entity Optimization",
        "severity": "medium",
        "why_it_matters": "Unconnected topic entities make it harder for AI reasoning engines to associate your product with emerging technologies.",
        "how_to_fix": "Connect topic concepts with structured glossary and ontology markup.",
        "default_impact": 6,
        "implementation_steps": [
            "Create a technical glossary defining core domain concepts.",
            "Use DefinedTerm and DefinedTermSet schema on glossary entries.",
            "Interlink product pages with relevant glossary definitions.",
        ],
    },

    # 6. Competitor Gaps
    {
        "code": "AEO-COMP-001",
        "title": "Publish Objective Competitor Comparison Pages",
        "category": "Competitor Gaps",
        "severity": "critical",
        "why_it_matters": "When users ask AI 'Brand A vs Brand B', models favor domains with balanced, detailed comparison data.",
        "how_to_fix": "Build objective, feature-by-feature comparison matrices with transparent pros and cons.",
        "default_impact": 11,
        "implementation_steps": [
            "Identify top competitors appearing in your prompt analyses.",
            "Create dedicated '[YourBrand] vs [Competitor]' comparison landing pages.",
            "Include structured comparison tables with verified feature specifications.",
            "Highlight your unique differentiators and best-fit use cases.",
        ],
    },
    {
        "code": "AEO-COMP-002",
        "title": "Defend Market Share Against Competitor Alternatives Prompts",
        "category": "Competitor Gaps",
        "severity": "high",
        "why_it_matters": "Queries asking for 'alternatives to [Competitor]' are high-intent conversion queries frequently summarized by AI engines.",
        "how_to_fix": "Create comprehensive 'Best Alternatives to [Competitor]' guide with structured criteria.",
        "default_impact": 8,
        "implementation_steps": [
            "Target 'Top Alternatives to [Competitor]' queries for your main rivals.",
            "Provide objective analysis of where your platform excels.",
            "Include migration guides and ROI comparison calculators.",
        ],
    },

    # 7. Product Information
    {
        "code": "AEO-PROD-001",
        "title": "Structure Technical Specifications in Semantic Tables",
        "category": "Product Information",
        "severity": "medium",
        "why_it_matters": "LLMs extract numerical parameters, API limits, and system requirements most reliably from clean HTML table elements.",
        "how_to_fix": "Replace unstructured text specification lists with semantic <table> markup.",
        "default_impact": 6,
        "implementation_steps": [
            "Convert product specification sheets into semantic HTML tables.",
            "Ensure table headers (<th>) have clear descriptive titles.",
            "Include units of measurement (e.g. GB, ms, req/sec) in table cells.",
        ],
    },
    {
        "code": "AEO-PROD-002",
        "title": "Add Comprehensive Feature Availability Matrix",
        "category": "Product Information",
        "severity": "medium",
        "why_it_matters": "AI answer models frequently state 'information unavailable' when feature availability across tiers is ambiguous.",
        "how_to_fix": "Clearly outline which features exist in Free, Pro, and Enterprise tiers.",
        "default_impact": 5,
        "implementation_steps": [
            "Add a complete feature breakdown across subscription plans.",
            "Use clear 'Supported / Not Supported / Add-on' indicators.",
            "Include FAQ section answering plan-specific limitations.",
        ],
    },

    # 8. Pricing Information
    {
        "code": "AEO-PRICE-001",
        "title": "Publish Transparent Pricing & Cost Breakdown",
        "category": "Pricing Information",
        "severity": "critical",
        "why_it_matters": "Over 70% of buyer prompts involve pricing questions. AI models exclude vendors that hide pricing behind contact forms.",
        "how_to_fix": "Publish clear starter pricing, tier breakdowns, and total cost of ownership estimates.",
        "default_impact": 10,
        "implementation_steps": [
            "Add a public pricing page with clear dollar amounts or starting rates.",
            "Include PriceSpecification and Offer schema markup.",
            "Provide transparent answers to billing frequency, setup fees, and discounts.",
        ],
    },
    {
        "code": "AEO-PRICE-002",
        "title": "Provide ROI & Cost Comparison Calculator",
        "category": "Pricing Information",
        "severity": "medium",
        "why_it_matters": "When AI evaluates value for money, structured ROI metrics provide citable proof points.",
        "how_to_fix": "Add an interactive calculator and summary paragraph explaining average payback periods.",
        "default_impact": 6,
        "implementation_steps": [
            "Build an online ROI calculator on the pricing page.",
            "Include typical savings percentages supported by case study data.",
        ],
    },

    # 9. FAQ / Buyer Questions
    {
        "code": "AEO-FAQ-001",
        "title": "Implement FAQPage Schema on Core Landing Pages",
        "category": "FAQ & Buyer Questions",
        "severity": "high",
        "why_it_matters": "FAQ structured data provides direct question-answer pairings that AI crawlers prioritize for quick-answer synthesis.",
        "how_to_fix": "Inject JSON-LD FAQPage markup containing the exact questions asked in AI search.",
        "default_impact": 8,
        "implementation_steps": [
            "Extract unanswered buyer queries from AEO Prompts view.",
            "Add an accordion FAQ block on the relevant product page.",
            "Wrap FAQ questions and answers in valid JSON-LD FAQPage schema.",
        ],
    },
    {
        "code": "AEO-FAQ-002",
        "title": "Write Concise 50-Word Direct Answers for Key FAQs",
        "category": "FAQ & Buyer Questions",
        "severity": "medium",
        "why_it_matters": "AI synthesis models prefer answer blocks that provide complete answers in under 50-60 words before expanding.",
        "how_to_fix": "Front-load FAQ answers with concise, factual sentences before detailed explanations.",
        "default_impact": 6,
        "implementation_steps": [
            "Audit top 10 FAQs to ensure the first sentence directly answers the question.",
            "Avoid marketing jargon in introductory answer sentences.",
        ],
    },

    # 10. Topical Authority
    {
        "code": "AEO-AUTH-001",
        "title": "Build Comprehensive Topic Clusters Around Core Solutions",
        "category": "Topical Authority",
        "severity": "high",
        "why_it_matters": "AI engines assess deep domain expertise by measuring the breadth and depth of interlinked content on a specific topic.",
        "how_to_fix": "Create pillar pages supported by 5-8 sub-topic articles interlinked with contextual anchor text.",
        "default_impact": 9,
        "implementation_steps": [
            "Design a pillar content hub covering your core industry discipline.",
            "Publish supporting articles for each sub-discipline.",
            "Interlink all cluster articles back to the main pillar page.",
        ],
    },
    {
        "code": "AEO-AUTH-002",
        "title": "Publish In-Depth Technical Architecture Documentation",
        "category": "Topical Authority",
        "severity": "medium",
        "why_it_matters": "Technical search queries in AI engines favor comprehensive developer docs and architectural whitepapers.",
        "how_to_fix": "Provide publicly accessible technical docs detailing integrations, API specs, and security standards.",
        "default_impact": 7,
        "implementation_steps": [
            "Ensure API docs and technical guides are indexable (no login required for docs).",
            "Use TechArticle schema on developer guides.",
        ],
    },

    # 11. Trust & Expertise
    {
        "code": "AEO-TRUST-001",
        "title": "Add Verified Author Profiles with Credential Schema",
        "category": "Trust & Expertise",
        "severity": "high",
        "why_it_matters": "AI models evaluate E-E-A-T signals to ensure advice and claims originate from verified human experts.",
        "how_to_fix": "Add detailed author bios with Person schema, LinkedIn links, and credential descriptions.",
        "default_impact": 7,
        "implementation_steps": [
            "Create dedicated author profile pages for all content contributors.",
            "Add Person schema including sameAs, jobTitle, and alumniOf properties.",
            "Include author bio box with headshot and credentials at the bottom of articles.",
        ],
    },
    {
        "code": "AEO-TRUST-002",
        "title": "Display Security Certifications & Compliance Standards",
        "category": "Trust & Expertise",
        "severity": "medium",
        "why_it_matters": "For B2B software, answer engines verify compliance (SOC 2, ISO 27001, GDPR, HIPAA) before recommending solutions.",
        "how_to_fix": "Publish a dedicated Trust & Security portal with downloadable compliance certificates.",
        "default_impact": 6,
        "implementation_steps": [
            "Build a Trust Center page outlining security practices.",
            "List all active compliance certifications and audit dates.",
        ],
    },

    # 12. Content Structure
    {
        "code": "AEO-STRUCT-001",
        "title": "Adopt Inverted Pyramid Content Hierarchy",
        "category": "Content Structure",
        "severity": "medium",
        "why_it_matters": "LLM web extractors prioritize top-of-section answers. Burying the conclusion below fluff results in extraction failure.",
        "how_to_fix": "Lead every section with the core answer or takeaway before providing background context.",
        "default_impact": 6,
        "implementation_steps": [
            "Revise heading intros to immediately state the primary finding or answer.",
            "Use bulleted takeaway summaries under major H2 headers.",
        ],
    },
    {
        "code": "AEO-STRUCT-002",
        "title": "Ensure Proper Heading Hierarchy (H1 -> H2 -> H3)",
        "category": "Content Structure",
        "severity": "low",
        "why_it_matters": "Broken heading order disrupts the document outline parsed by neural search indexers.",
        "how_to_fix": "Enforce single H1 tag per page followed strictly by sequential H2 and H3 subsections.",
        "default_impact": 4,
        "implementation_steps": [
            "Fix skipped heading levels (e.g. H1 directly to H3).",
            "Ensure section titles are question-oriented or descriptive.",
        ],
    },

    # 13. Source Quality
    {
        "code": "AEO-SRC-001",
        "title": "Cite Primary Peer-Reviewed & Academic Sources",
        "category": "Source Quality",
        "severity": "medium",
        "why_it_matters": "AI answer grounding algorithms cross-verify statements against referenced academic and industry sources.",
        "how_to_fix": "Link factual statements to original primary research studies and official documentation.",
        "default_impact": 5,
        "implementation_steps": [
            "Audit claims and statistics to ensure outbound links cite primary sources.",
            "Use Citation schema in article body markup where appropriate.",
        ],
    },
    {
        "code": "AEO-SRC-002",
        "title": "Eliminate Outdated & Broken Source References",
        "category": "Source Quality",
        "severity": "low",
        "why_it_matters": "Broken links signal degraded content freshness to automated LLM evaluators.",
        "how_to_fix": "Audit outgoing links and update stale statistical references to current year data.",
        "default_impact": 4,
        "implementation_steps": [
            "Run crawl check to resolve 404 external links.",
            "Refresh dated statistics to reflect recent survey data.",
        ],
    },

    # 14. Knowledge Consistency
    {
        "code": "AEO-KNOW-001",
        "title": "Align Factual Information Across All Digital Channels",
        "category": "Knowledge Consistency",
        "severity": "high",
        "why_it_matters": "Contradictory facts (e.g. differing founding years, pricing, or locations) reduce AI confidence in presenting the brand.",
        "how_to_fix": "Audit and synchronize core company facts across website, directory listings, and documentation.",
        "default_impact": 8,
        "implementation_steps": [
            "Create a single source of truth document for all company facts.",
            "Verify Wikipedia, LinkedIn, Google Business, and website match 100%.",
        ],
    },
    {
        "code": "AEO-KNOW-002",
        "title": "Maintain Versioned Change Logs for Product Capabilities",
        "category": "Knowledge Consistency",
        "severity": "medium",
        "why_it_matters": "AI models with periodic training cutoffs confuse legacy features with active capabilities without clear changelogs.",
        "how_to_fix": "Publish dated changelog releases highlighting newly added features and deprecated legacy options.",
        "default_impact": 5,
        "implementation_steps": [
            "Maintain a public /changelog page with dated entries.",
            "Mark discontinued features clearly to prevent AI hallucinated recommendations.",
        ],
    },

    # 15. AI Answer Coverage
    {
        "code": "AEO-ANS-001",
        "title": "Optimize for Multi-Engine Answer Synthesis",
        "category": "AI Answer Coverage",
        "severity": "critical",
        "why_it_matters": "Different answer engines (Perplexity vs ChatGPT vs Gemini) utilize varying retrieval mechanisms requiring balanced on-page optimization.",
        "how_to_fix": "Combine schema markup (for search indexers) with clean conversational text (for direct LLM retrieval).",
        "default_impact": 10,
        "implementation_steps": [
            "Test prompt appearances across ChatGPT, Perplexity, and Gemini in AEO Answer Engine view.",
            "Optimize pages where specific engines fail to mention or cite your domain.",
            "Include conversational FAQ answers and semantic HTML data tables on all key landing pages.",
        ],
    },
    {
        "code": "AEO-ANS-002",
        "title": "Increase Share of Voice in High-Intent Question Lists",
        "category": "AI Answer Coverage",
        "severity": "high",
        "why_it_matters": "When models return top-5 tool lists, ranking in position #1 or #2 captures over 60% of user consideration.",
        "how_to_fix": "Strengthen third-party platform sentiment and authority signals to advance ranking position in AI list responses.",
        "default_impact": 9,
        "implementation_steps": [
            "Identify queries where brand appears in position #3 or lower.",
            "Increase review volume on authoritative aggregation sites.",
            "Publish in-depth benchmark comparisons proving category leadership.",
        ],
    },
]
