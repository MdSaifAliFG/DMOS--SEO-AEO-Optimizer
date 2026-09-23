import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Globe,
  Bot,
  TrendingUp,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Zap,
  Cpu,
  Search,
  Share2,
  BarChart3,
  Target,
  Compass,
  Building,
  ShoppingCart,
  Briefcase,
  Rocket,
  Check,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, SoftwareApplicationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "AI Search Optimization Platform | Zobay Rank",
  description:
    "Optimize your brand for AI-powered search with unified SEO, AEO and GEO analysis from Zobay Rank.",
  path: "/ai-search-optimization",
  keywords: [
    "AI Search Optimization Platform",
    "AI Search Visibility",
    "Unified SEO AEO GEO",
    "Generative Search Optimization",
    "Answer Engine Marketing",
    "AI Crawler Optimization",
  ],
});

const faqs = [
  {
    question: "What is AI Search Optimization?",
    answer:
      "AI Search Optimization is the holistic strategy of optimizing a brand's technical infrastructure, content extractability, and entity authority so it succeeds across both traditional algorithmic search engines (Google, Bing) and AI generative answer models (ChatGPT, Perplexity, Gemini).",
  },
  {
    question: "How do SEO, AEO, and GEO work together in Zobay Rank?",
    answer:
      "SEO provides the crawlable, fast HTML substrate that search bots index; AEO structures your content to be cited in direct conversational AI answers; and GEO establishes your brand authority and entity consistency so AI systems recommend your product during multi-turn buyer research.",
  },
  {
    question: "Can I optimize for AI search without traditional SEO?",
    answer:
      "No. Leading AI answer engines ground their responses in live web crawling or search indices. If your website has broken status codes, missing tags, or blocks crawlers, AI models cannot access or cite your content.",
  },
  {
    question: "How does Zobay Rank measure overall AI search visibility?",
    answer:
      "Zobay Rank combines technical website health scores with prompt mention frequency, source citation rates, entity graph completeness, and cross-engine parity into a unified intelligence dashboard.",
  },
  {
    question: "Which AI search engines does Zobay Rank monitor?",
    answer:
      "Zobay Rank tracks brand citations and recommendation sentiment across OpenAI ChatGPT, Perplexity AI, Google Gemini, and Anthropic Claude Search.",
  },
];

const ENGINES = [
  {
    id: "seo",
    title: "1. Traditional SEO",
    tagline: "Technical Substrate & Crawler Indexing",
    badge: "Layer 01: Data Foundation",
    color: "blue",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
    bgColor: "bg-blue-50/50",
    badgeBg: "bg-blue-100 text-blue-800",
    iconBg: "bg-blue-600 text-white",
    description:
      "The baseline data layer. If search bots or AI retrieval agents cannot crawl and render your HTML quickly, your content remains invisible to all downstream answer engines.",
    points: [
      "High-speed BFS crawler auditing status codes (200, 301, 404, 500)",
      "Strict meta robots directives and XML sitemap synchronization",
      "Canonical URL enforcement and duplicate parameter stripping",
      "Heading hierarchy (single H1, structured H2/H3) and Core Web Vitals",
    ],
    metric: "Health Score (0–100)",
    href: "/seo-optimization",
    cta: "Explore SEO Engine",
  },
  {
    id: "aeo",
    title: "2. Answer Engine Optimization",
    tagline: "Conversational Citations & Extraction",
    badge: "Layer 02: Retrieval & Source Citations",
    color: "purple",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
    bgColor: "bg-purple-50/50",
    badgeBg: "bg-purple-100 text-purple-800",
    iconBg: "bg-purple-600 text-white",
    description:
      "Direct answerability. When conversational users ask high-intent questions, AEO structures your content into bite-sized factual nuggets that LLMs cite as sources.",
    points: [
      "Live tracking across ChatGPT-4o, Perplexity Sonar, and Gemini",
      "Source URL footnote and top-card citation extraction",
      "Structured Q&A formatting with Schema.org JSON-LD integration",
      "Competitive citation gap analysis to claim missing source slots",
    ],
    metric: "Citation Share (%)",
    href: "/aeo-optimization",
    cta: "Explore AEO Intelligence",
  },
  {
    id: "geo",
    title: "3. Generative Engine Optimization",
    tagline: "Entity Authority & Recommendations",
    badge: "Layer 03: Decision & Recommendation",
    color: "amber",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
    bgColor: "bg-amber-50/50",
    badgeBg: "bg-amber-100 text-amber-800",
    iconBg: "bg-amber-600 text-white",
    description:
      "Commercial recommendation readiness. Influences whether multi-turn generative models highlight your brand as the #1 recommended solution or omit it entirely.",
    points: [
      "Deterministic 8-factor GEO scoring framework",
      "Cross-engine parity tracking (ChatGPT, Perplexity, Gemini, Claude)",
      "Entity knowledge graph consistency and attribute validation",
      "Commercial discovery optimization for multi-turn buyer queries",
    ],
    metric: "8-Factor GEO Score",
    href: "/geo-optimization",
    cta: "Explore GEO Engine",
  },
];

const AI_PLATFORMS = [
  {
    name: "OpenAI ChatGPT Search",
    type: "Conversational Synthesis",
    icon: Bot,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    focus: "Direct answers, cited link cards, and multi-turn purchase advice.",
    tracking: "Monitors brand inclusion and positive sentiment in buyer prompts.",
  },
  {
    name: "Perplexity AI",
    type: "Real-Time RAG Search",
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    focus: "Instant research citations, structured summaries, and top source pills.",
    tracking: "Extracts ranked source domains and detects citation omissions.",
  },
  {
    name: "Google Gemini & AI Overviews",
    type: "Multimodal AI Search",
    icon: Cpu,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    focus: "Prominent AI snapshot cards positioned above traditional SERP blue links.",
    tracking: "Tracks SERP displacement and featured entity carousel visibility.",
  },
  {
    name: "Anthropic Claude Search",
    type: "In-Depth Synthesis",
    icon: Compass,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    focus: "Technical comparisons, vendor feature tables, and authoritative reviews.",
    tracking: "Evaluates entity clarity and enterprise capability attribution.",
  },
];

const USE_CASES = [
  {
    title: "For SaaS & Tech Platforms",
    subtitle: "Protect Software Category Leadership",
    icon: Layers,
    href: "/use-cases/saas",
    badge: "Software & Cloud",
    description:
      "When enterprise buyers ask 'Best CRM for Startups' or 'Top Analytics Tools', ensure your product is prominently recommended with accurate pricing and feature specs.",
  },
  {
    title: "For E-Commerce & Retail",
    subtitle: "Win AI Product Recommendations",
    icon: ShoppingCart,
    href: "/use-cases/ecommerce",
    badge: "Direct-to-Consumer",
    description:
      "Structure product schemas, stock status, reviews, and competitive pricing so conversational shopping assistants cite your product pages directly.",
  },
  {
    title: "For Digital Marketing Agencies",
    subtitle: "Deliver Unified Search Client Reports",
    icon: Briefcase,
    href: "/use-cases/agencies",
    badge: "Client Growth",
    description:
      "Provide multi-engine visibility audits, citation share benchmarks, and step-by-step developer remediation tasks that demonstrate clear client ROI.",
  },
  {
    title: "For High-Growth Startups",
    subtitle: "Outrank Incumbents in Generative Search",
    icon: Rocket,
    href: "/use-cases/startups",
    badge: "Rapid Scale",
    description:
      "Disrupt established legacy competitors by establishing clear entity recognition, fast technical crawling, and authoritative source coverage from day one.",
  },
];

export default function AiSearchOptimizationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      {/* Schemas */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Solutions", url: "/ai-search-optimization" },
          { name: "AI Search Optimization", url: "/ai-search-optimization" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      {/* Global Sticky Navbar */}
      <LandingNavbar />

      <main className="flex-1 flex flex-col pt-20">
        {/* ========================================================================= */}
        {/* SECTION 1 [DARK]: Master Hero Section with Dot Matrix Overlay & Ambient Lights */}
        {/* ========================================================================= */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Colorful Radial Flares */}
          <div className="absolute -top-20 left-1/4 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Dot Matrix Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 sm:space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Unified Search &amp; AI Intelligence Architecture</span>
            </div>

            {/* Bold H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black text-white tracking-tight leading-[1.1] font-sans max-w-4xl mx-auto">
              AI Search Optimization{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed font-normal">
              Capture search market share across both traditional Google SERPs and emerging conversational AI models with unified SEO, AEO, and GEO optimization.
            </p>

            {/* Direct Answer Glass Card for Answer Engines */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 shadow-xl shadow-black/40 text-left space-y-2 mt-4 text-xs sm:text-sm">
              <div className="font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Direct Answer: What is AI Search Optimization?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>AI Search Optimization</strong> is a three-layer visibility framework that aligns technical website crawlability (<span className="text-blue-300 font-semibold">SEO</span>), conversational answer citations (<span className="text-purple-300 font-semibold">AEO</span>), and generative model recommendations (<span className="text-amber-300 font-semibold">GEO</span>) into a single operating system to maximize organic traffic and brand authority across algorithmic and generative search engines.
              </p>
            </div>

            {/* Dual Pill CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Free AI Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/seo-vs-aeo-vs-geo"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm transition-all text-center cursor-pointer"
              >
                Compare SEO vs AEO vs GEO
              </Link>
            </div>

            {/* Bottom Capability Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">SSRF-Protected Crawler</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-300 font-medium">Multi-Engine AI Parity</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <Target className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300 font-medium">Citation Gap Analysis</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-medium">8-Factor GEO Scoring</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 [WHITE/LIGHT]: How the Three Engines Work Together (Path to Success Style) */}
        {/* ========================================================================= */}
        <section
          id="how-it-works"
          className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Architectural Breakdown
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                How the Three Engines Work Together
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Modern search is no longer just ten blue links. It is a multi-tier funnel spanning technical crawlability, source citations, and generative brand recommendations.
              </p>
            </div>

            {/* 3 Elevated Pillar Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {ENGINES.map((eng) => (
                <div
                  key={eng.id}
                  className={`p-6 sm:p-8 rounded-3xl bg-white border ${eng.borderColor} shadow-xl shadow-slate-200/50 flex flex-col justify-between transition-all hover:-translate-y-1 duration-200`}
                >
                  <div className="space-y-5">
                    {/* Top Row: Badge & Icon */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${eng.badgeBg}`}>
                        {eng.badge}
                      </span>
                      <div className={`w-10 h-10 rounded-xl ${eng.iconBg} flex items-center justify-center shadow-md`}>
                        {eng.id === "seo" && <Globe className="w-5 h-5" />}
                        {eng.id === "aeo" && <Bot className="w-5 h-5" />}
                        {eng.id === "geo" && <TrendingUp className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {eng.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                        {eng.tagline}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {eng.description}
                    </p>

                    {/* Feature Checkpoints */}
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Core Responsibilities:
                      </span>
                      {eng.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Metric</span>
                      <span className="text-xs font-bold text-slate-900">{eng.metric}</span>
                    </div>
                    <Link
                      href={eng.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <span>{eng.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Seamless Flow Banner */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    The Complete Search Funnel
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Crawlability (SEO) → Extraction (AEO) → Recommendation (GEO)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Zobay Rank connects these three layers so you don't leak traffic or brand equity as search patterns evolve.
                  </p>
                </div>
                <Link
                  href="/seo-vs-aeo-vs-geo"
                  className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors whitespace-nowrap shadow-lg shrink-0 cursor-pointer"
                >
                  View Comparison Matrix →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 [DARK]: The AI Search Engines We Track (WhatElse / Bento Style) */}
        {/* ========================================================================= */}
        <section
          id="engines-tracked"
          className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white relative overflow-hidden border-b border-white/10"
        >
          {/* Radial Ambient Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block">
                Multi-Engine Coverage
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Continuous Monitoring Across <br />
                Every Major AI Engine
              </h2>
              <p className="text-xs sm:text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Different AI engines use distinct retrieval systems, citation heuristics, and recommendation weights. Zobay Rank provides a unified cross-engine parity matrix to pinpoint where you lead and where competitors are chosen instead.
              </p>
            </div>

            {/* 4 Engine Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {AI_PLATFORMS.map((platform, idx) => {
                const IconComponent = platform.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border ${platform.border} flex flex-col justify-between space-y-6 hover:border-white/40 transition-all hover:-translate-y-1 duration-200`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${platform.bg} ${platform.color} border ${platform.border}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                          0{idx + 1}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                        <span className={`text-xs font-semibold ${platform.color} block mt-0.5`}>
                          {platform.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {platform.focus}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Zobay Rank Radar:</span>
                      <p className="text-xs text-slate-300 font-medium">{platform.tracking}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fact Check Callout */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p>
                  <strong className="text-white">Deterministic &amp; Real Telemetry:</strong> All AI prompt tracking queries are run in clean, un-personalized sessions to ensure objective citation metrics.
                </p>
              </div>
              <Link href="/pricing" className="text-blue-400 hover:underline font-semibold whitespace-nowrap">
                See Tracking Plans →
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 [WHITE/LIGHT]: Vertical Use Cases (SaaS, E-Com, Agencies, Startups) */}
        {/* ========================================================================= */}
        <section
          id="use-cases"
          className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                Industry Strategies
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Tailored AI Search Strategies by Vertical
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Discover how organizations use Zobay Rank to protect their existing search traffic while dominating generative recommendations.
              </p>
            </div>

            {/* 4 Interactive Vertical Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {USE_CASES.map((uc, i) => {
                const Icon = uc.icon;
                return (
                  <div
                    key={i}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/50 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-5 transition-all hover:-translate-y-1 duration-200"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {uc.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{uc.title}</h3>
                        <p className="text-xs font-semibold text-blue-600 mt-0.5">{uc.subtitle}</p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {uc.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href={uc.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <span>View {uc.badge} Strategy Playbook</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 [DARK]: Comprehensive Q&A (FAQ Accordion Style) */}
        {/* ========================================================================= */}
        <section
          id="faq"
          className="py-20 sm:py-24 2xl:py-32 bg-slate-950 text-slate-100 border-b border-slate-900 relative"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                Direct Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Frequently Asked Questions About AI Search
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Actionable answers on adapting your brand's search strategy for LLMs and generative engines.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      Q{idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/faq"
                className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1.5"
              >
                <span>Browse all 14 Platform &amp; Search FAQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6 [VIBRANT GRADIENT]: Final High-Conversion Strip (FinalCTA Style) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Win Across Search &amp; AI?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Scan your domain crawlability, track conversational brand citations, and unlock 8-factor generative search recommendations today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-950 font-bold text-sm tracking-wide shadow-2xl hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Start Free AI Audit →</span>
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/30 hover:bg-black/40 border border-white/30 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                <span>View All Plans &amp; Tiers</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Comprehensive Footer */}
      <LandingFooter />
    </div>
  );
}
