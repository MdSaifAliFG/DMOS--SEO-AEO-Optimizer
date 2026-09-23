import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Layers,
  HelpCircle,
  ShieldCheck,
  Zap,
  Check,
  AlertTriangle,
  XCircle,
  Target,
  Compass,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, SoftwareApplicationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO vs AEO vs GEO: What's the Difference? | Zobay Rank",
  description:
    "An objective, in-depth comparison of SEO, AEO, and GEO. Learn how search engine, answer engine, and generative engine optimization complement each other.",
  path: "/seo-vs-aeo-vs-geo",
  keywords: [
    "SEO vs AEO vs GEO",
    "Difference between SEO and AEO",
    "What is GEO search",
    "Answer Engine Optimization vs SEO",
    "Generative Engine Optimization comparison",
  ],
});

const faqs = [
  {
    question: "Does GEO or AEO replace traditional SEO?",
    answer:
      "No. Neither AEO nor GEO replaces traditional SEO. Leading AI answer engines ground their models by crawling and indexing live web content. Without clean technical SEO, AI crawlers cannot index your site to cite or recommend it.",
  },
  {
    question: "Which should my business focus on first: SEO, AEO, or GEO?",
    answer:
      "Start with technical SEO to ensure your foundation is indexable and fast. Layer on AEO by structuring key pages into clear Q&A formats that earn AI citations. Scale with GEO to establish entity consistency and commercial recommendation authority.",
  },
  {
    question: "How do the metrics differ between SEO, AEO, and GEO?",
    answer:
      "SEO measures organic traffic, keyword rankings, and impressions on SERPs. AEO measures brand mention rate, prompt coverage, and source citations in AI answers. GEO measures LLM recommendation strength, cross-engine parity, and entity understanding.",
  },
  {
    question: "Can an agency or enterprise optimize for all three in one tool?",
    answer:
      "Yes. Zobay Rank was engineered specifically as a unified operating system that tracks technical website crawl health (SEO), monitors prompt citations across ChatGPT and Perplexity (AEO), and benchmarks your 8-factor score across generative models (GEO).",
  },
];

const MATRIX_ROWS = [
  {
    dimension: "Target Surface",
    seo: "Algorithmic search engine results pages (SERPs) on Google, Bing, DuckDuckGo.",
    aeo: "Direct conversational AI answer cards & syntheses on ChatGPT, Perplexity, Gemini.",
    geo: "Multi-turn generative dialogs, buyer comparisons & AI recommendation engines.",
  },
  {
    dimension: "Primary Goal",
    seo: "Rank in top positions for organic queries to earn direct click-through traffic.",
    aeo: "Be cited as a factual, verified source URL in AI model synthesized responses.",
    geo: "Secure top commercial product recommendation status during conversational research.",
  },
  {
    dimension: "Core Metrics",
    seo: "Crawl depth, HTTP status codes, organic impressions, CTR, keyword rankings.",
    aeo: "Brand mention frequency, prompt coverage rate, citation share %, answer sentiment.",
    geo: "8-factor GEO score, recommendation rank, cross-engine parity, entity clarity.",
  },
  {
    dimension: "Key Tactics",
    seo: "Clean HTML structure, canonicals, robots.txt, fast TTFB, single H1s, internal linking.",
    aeo: "Bite-sized Q&A summaries, extractable definitions, Schema.org JSON-LD data.",
    geo: "Entity consistency across knowledge graphs, third-party co-citations, llms.txt standard.",
  },
  {
    dimension: "Crawler Bots",
    seo: "Googlebot, Bingbot, YandexBot, DuckDuckBot.",
    aeo: "GPTBot, PerplexityBot, ClaudeBot, Google-Extended.",
    geo: "Applebot-Extended, CCBot, Diffbot, multi-engine retrieval agents.",
  },
  {
    dimension: "Failure Mode",
    seo: "Pages are de-indexed or relegated to page 2+ with zero organic search visibility.",
    aeo: "AI models answer user prompts using competitor domains as their authoritative source.",
    geo: "Generative models recommend competitor products while omitting or misrepresenting yours.",
  },
];

const STRATEGIES = [
  {
    title: "SaaS & Cloud Platforms",
    subtitle: "High-Intent Evaluation Prompts",
    badge: "B2B Software",
    description:
      "Buyers ask 'Which CRM integrates best with HubSpot?' Layer technical SEO with AEO comparison tables so LLMs cite your feature matrix directly.",
    focus: "Focus: AEO prompt tracking + GEO recommendation parity.",
  },
  {
    title: "E-Commerce & Retail",
    subtitle: "Direct Product Recommendations",
    badge: "Direct-to-Consumer",
    description:
      "Shoppers use conversational search for specific gifts and apparel. Clean product schemas ensure AI models cite your catalog and verified pricing.",
    focus: "Focus: Technical product crawlability + AEO source cards.",
  },
  {
    title: "Digital Marketing Agencies",
    subtitle: "Unified Client Deliverables",
    badge: "Agency Growth",
    description:
      "Clients demand answers to why organic traffic is shifting toward AI summaries. Deliver multi-engine visibility audits and unified action centers.",
    focus: "Focus: Full SEO + AEO + GEO client benchmarking.",
  },
  {
    title: "High-Growth Startups",
    subtitle: "Rapid Entity Establishment",
    badge: "Market Disruptors",
    description:
      "Displace legacy incumbents by publishing structured data, maintaining clear entity definitions, and capturing citations for emergent industry queries.",
    focus: "Focus: Rapid entity disambiguation + llms.txt standard.",
  },
];

export default function SeoVsAeoVsGeoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      {/* Schemas */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Solutions", url: "/ai-search-optimization" },
          { name: "SEO vs AEO vs GEO", url: "/seo-vs-aeo-vs-geo" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      {/* Global Sticky Navbar */}
      <LandingNavbar />

      <main className="flex-1 flex flex-col pt-20">
        {/* ========================================================================= */}
        {/* SECTION 1 [DARK]: Master Hero with Dot Matrix & Glowing Ambient Accents */}
        {/* ========================================================================= */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Colorful Radial Flares */}
          <div className="absolute -top-20 left-1/4 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Dot Matrix Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 sm:space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Objective Search Optimization Guide</span>
            </div>

            {/* Bold H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black text-white tracking-tight leading-[1.1] font-sans max-w-4xl mx-auto">
              SEO vs AEO vs GEO: <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-amber-400 bg-clip-text text-transparent">
                What's the Difference?
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed font-normal">
              Understand the distinct roles, metrics, and synergies between Search Engine Optimization, Answer Engine Optimization, and Generative Engine Optimization.
            </p>

            {/* Direct Answer Glass Card for Answer Engines */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl shadow-black/40 text-left space-y-2 mt-4 text-xs sm:text-sm">
              <div className="font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Executive Summary: How SEO, AEO, and GEO Differ</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>SEO (Search Engine Optimization)</strong> targets traditional SERP blue links by optimizing crawler accessibility, indexability, metadata, and link authority. <strong>AEO (Answer Engine Optimization)</strong> targets conversational AI responses by structuring answers so engines cite your domain as a factual source. <strong>GEO (Generative Engine Optimization)</strong> targets generative discovery by solidifying entity consistency, cross-engine parity, and commercial recommendation strength. They do not replace one another; they build directly on each other.
              </p>
            </div>

            {/* Dual Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <a
                href="#comparison-matrix"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Jump to Comparison Matrix</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <Link
                href="/ai-search-optimization"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm transition-all text-center cursor-pointer"
              >
                Explore Solutions Platform →
              </Link>
            </div>

            {/* Bottom Surface Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-blue-500/20 flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">SEO Engine</span>
                  <span className="text-[11px] text-slate-400">SERP Blue Links</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-purple-500/20 flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">AEO Engine</span>
                  <span className="text-[11px] text-slate-400">Source Citations</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-amber-500/20 flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">GEO Engine</span>
                  <span className="text-[11px] text-slate-400">LLM Recommendation</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-emerald-500/20 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Unified Platform</span>
                  <span className="text-[11px] text-slate-400">Single Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 [WHITE/LIGHT]: Side-by-Side Comparison Matrix (PathToSuccess Style) */}
        {/* ========================================================================= */}
        <section
          id="comparison-matrix"
          className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Direct Matrix
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Side-by-Side Comparison Matrix
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                An objective breakdown comparing target surfaces, primary goals, core metrics, key tactics, crawlers, and failure modes across all three disciplines.
              </p>
            </div>

            {/* Elevated Light Matrix Table */}
            <div className="overflow-x-auto shadow-2xl rounded-3xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-wider">
                    <th className="p-5 w-1/4 text-slate-700">Dimension</th>
                    <th className="p-5 w-1/4 text-blue-700 bg-blue-50/60 border-l border-r border-blue-100">
                      SEO (Search Engine)
                    </th>
                    <th className="p-5 w-1/4 text-purple-700 bg-purple-50/60 border-r border-purple-100">
                      AEO (Answer Engine)
                    </th>
                    <th className="p-5 w-1/4 text-amber-700 bg-amber-50/60">
                      GEO (Generative Engine)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                  {MATRIX_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-5 font-bold text-slate-900 bg-slate-50/40">
                        {row.dimension}
                      </td>
                      <td className="p-5 leading-relaxed border-l border-r border-slate-100">
                        {row.seo}
                      </td>
                      <td className="p-5 leading-relaxed border-r border-slate-100">
                        {row.aeo}
                      </td>
                      <td className="p-5 leading-relaxed">
                        {row.geo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3 Pillar Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
                  <Globe className="w-5 h-5" />
                  <span>SEO Engine</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focuses on crawlability, status codes (200, 301, 404), canonicals, XML sitemaps, and server response times.
                </p>
                <Link href="/seo-optimization" className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
                  <span>Explore Technical SEO →</span>
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-purple-50/60 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-base">
                  <Bot className="w-5 h-5" />
                  <span>AEO Intelligence</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focuses on earning source citations in direct answers across ChatGPT, Perplexity, and Gemini through structured Q&amp;A.
                </p>
                <Link href="/aeo-optimization" className="text-xs font-bold text-purple-700 hover:underline inline-flex items-center gap-1">
                  <span>Explore AEO Intelligence →</span>
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                  <TrendingUp className="w-5 h-5" />
                  <span>GEO Engine</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focuses on 8-factor score optimization, entity consistency across knowledge graphs, and recommendation authority.
                </p>
                <Link href="/geo-optimization" className="text-xs font-bold text-amber-700 hover:underline inline-flex items-center gap-1">
                  <span>Explore GEO Engine →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 [DARK]: The Three-Tier Funnel Synergy (WhatElse Bento Style) */}
        {/* ========================================================================= */}
        <section
          id="synergy"
          className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white relative overflow-hidden border-b border-white/10"
        >
          {/* Radial Ambient Glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block">
                Interconnected Synergy
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Why None of the Three Can Succeed in Isolation
              </h2>
              <p className="text-xs sm:text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Treating SEO, AEO, or GEO as isolated silos creates critical blind spots. Here is what happens when any single layer is missing:
              </p>
            </div>

            {/* 4 Bento Synergy Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-rose-500/40 space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    Missing SEO Foundation
                  </span>
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white">What Happens Without SEO?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Even the best AI-targeted content will fail if search bots cannot crawl your HTML. If robots.txt blocks crawlers, response times are sluggish, or canonical tags are circular, AI answer engines will be unable to ingest or cite your pages.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-purple-500/40 space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Missing AEO Extraction
                  </span>
                  <AlertTriangle className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">What Happens Without AEO?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  If your website ranks on page 1 of Google but contains dense, un-structured prose without clear Q&amp;A summaries, conversational AI models (ChatGPT, Perplexity) will cite competitor guides instead of your original research.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-amber-500/40 space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Missing GEO Authority
                  </span>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">What Happens Without GEO?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  If AI engines understand what your business does but lack verified entity attributes or third-party co-citations, they will recommend well-established incumbents whenever buyers ask for comparative vendor recommendations.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/40 to-indigo-950/60 border border-blue-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    The Zobay Rank Solution
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Unified Multi-Layer Execution</h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Zobay Rank integrates all three layers: our BFS crawler verifies your technical indexability; our prompt engine tracks citations on ChatGPT and Perplexity; and our 8-factor GEO score optimizes recommendation readiness in one platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 [WHITE/LIGHT]: Prioritization by Business Model */}
        {/* ========================================================================= */}
        <section
          id="prioritization"
          className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                Action Plan
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Where Should Your Team Focus First?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Depending on your business model, different optimization sequences yield the fastest return on organic visibility and customer acquisition.
              </p>
            </div>

            {/* 4 Prioritization Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {STRATEGIES.map((strat, i) => (
                <div
                  key={i}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/50 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {strat.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{strat.title}</h3>
                    <p className="text-xs font-semibold text-blue-600">{strat.subtitle}</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {strat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="text-blue-600">{strat.focus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 [DARK]: Comparison FAQ Accordion */}
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
                Comparison FAQ
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Common questions regarding the intersection of SEO, AEO, and GEO.
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
        {/* SECTION 6 [VIBRANT GRADIENT]: Final High-Conversion Action Strip */}
        {/* ========================================================================= */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Win Across Search &amp; AI?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Audit your website crawlability, trace conversational brand citations, and unlock 8-factor generative search recommendations today.
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
