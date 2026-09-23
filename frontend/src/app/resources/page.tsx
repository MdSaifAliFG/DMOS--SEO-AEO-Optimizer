import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Globe,
  Bot,
  TrendingUp,
  Sparkles,
  FileCode,
  Quote,
  Target,
  ArrowRight,
  HelpCircle,
  FileText,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  Search,
  CheckCircle2,
  Clock,
  Compass,
  Check,
  ExternalLink,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO, AEO & GEO Resources & Knowledge Hub | Zobay Rank",
  description:
    "Explore authoritative educational resources, technical guides, glossary definitions, and research reports across SEO, Answer Engine Optimization, and GEO.",
  path: "/resources",
  keywords: [
    "SEO Resources",
    "AEO Knowledge Hub",
    "GEO Guides",
    "AI Search Best Practices",
    "Technical SEO Tutorials",
    "llms.txt specification",
  ],
});

const PILLARS = [
  {
    id: "seo",
    title: "Technical SEO Engine",
    subtitle: "Crawlability, Status Codes & Indexability",
    badge: "Foundation Pillar",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    iconBg: "bg-blue-600 text-white",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
    description:
      "Deterministic technical crawling mechanics to ensure your web pages pass all algorithmic quality checks, status codes, and indexability rules.",
    links: [
      { title: "Technical SEO Audit Fundamentals", href: "/seo-optimization" },
      { title: "Canonical URL Rules & Redirect Best Practices", href: "/glossary/technical-seo" },
      { title: "XML Sitemap & Robots.txt Verification", href: "/seo-optimization" },
      { title: "Status Code 200, 301, 404, 500 Troubleshooting", href: "/seo-optimization" },
    ],
    metric: "0–100 Health Score",
    href: "/seo-optimization",
    cta: "Explore SEO Hub",
  },
  {
    id: "aeo",
    title: "AEO Intelligence Hub",
    subtitle: "Answer Extraction & Citation Attributions",
    badge: "Extraction Pillar",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    iconBg: "bg-purple-600 text-white",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
    description:
      "Methodologies to earn direct brand citations, source card inclusion, and footnote references in ChatGPT, Perplexity, and Gemini synthesized answers.",
    links: [
      { title: "What is Answer Engine Optimization?", href: "/glossary/aeo" },
      { title: "Extracting Source Citations in AI Models", href: "/glossary/citation" },
      { title: "Bridging Content & Citation Gaps", href: "/aeo-optimization" },
      { title: "Prompt Tracking Across ChatGPT & Perplexity", href: "/aeo-optimization" },
    ],
    metric: "Citation Share %",
    href: "/aeo-optimization",
    cta: "Explore AEO Hub",
  },
  {
    id: "geo",
    title: "GEO Optimization Engine",
    subtitle: "Entity Authority & Recommendation Readiness",
    badge: "Decision Pillar",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    iconBg: "bg-amber-600 text-white",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
    description:
      "Strategic framework to ensure generative models recognize your brand entity, validate product attributes, and recommend your business to prospective buyers.",
    links: [
      { title: "What is Generative Engine Optimization?", href: "/glossary/geo" },
      { title: "The 8-Factor GEO Scoring Framework", href: "/geo-optimization" },
      { title: "Entity Consistency Across Knowledge Bases", href: "/glossary/entity-seo" },
      { title: "Cross-Engine Parity Matrix Analysis", href: "/geo-optimization" },
    ],
    metric: "8-Factor GEO Score",
    href: "/geo-optimization",
    cta: "Explore GEO Hub",
  },
];

const FEATURED_RESEARCH = [
  {
    title: "Understanding the 8-Factor GEO Score Model",
    category: "Technical Paper",
    readTime: "6 min read",
    date: "September 2026",
    href: "/blog/understanding-8-factor-geo-score",
    icon: TrendingUp,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    summary:
      "An in-depth breakdown of how Zobay Rank calculates the 8-factor GEO score to measure brand recommendation readiness across generative models.",
  },
  {
    title: "How AI Answer Engines Choose Sources",
    category: "Research Report",
    readTime: "8 min read",
    date: "September 2026",
    href: "/blog/how-ai-answer-engines-choose-sources",
    icon: Bot,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    summary:
      "An analysis of RAG chunking algorithms, citation footnote logic, and how ChatGPT and Perplexity select which websites to cite.",
  },
  {
    title: "Technical SEO Checklist for AI Crawlers",
    category: "Implementation Manual",
    readTime: "7 min read",
    date: "September 2026",
    href: "/blog/technical-seo-checklist-for-ai-crawlers",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    summary:
      "Everything your engineering team needs to configure: robots.txt directives, SSRF defense, crawl budgets, and server latency optimization.",
  },
  {
    title: "Tactical Optimization Guides & Blueprints",
    category: "Technical Blueprints",
    readTime: "10 min read",
    date: "Live Playbooks",
    href: "/guides",
    isExternal: false,
    icon: Compass,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    summary:
      "Comprehensive implementation roadmaps covering crawl diagnostics, ChatGPT/Perplexity citation earning, and the 8-factor GEO diagnostic scoring system.",
  },
];

const GLOSSARY_TERMS = [
  { term: "SEO (Search Engine Optimization)", slug: "seo", category: "Core Foundation" },
  { term: "AEO (Answer Engine Optimization)", slug: "aeo", category: "AI Extraction" },
  { term: "GEO (Generative Engine Optimization)", slug: "geo", category: "AI Recommendation" },
  { term: "AI Search", slug: "ai-search", category: "Search Architecture" },
  { term: "Technical SEO", slug: "technical-seo", category: "Infrastructure" },
  { term: "Entity SEO", slug: "entity-seo", category: "Knowledge Graph" },
  { term: "AI Citation", slug: "citation", category: "Source Attribution" },
  { term: "AI Visibility Score", slug: "ai-visibility", category: "Analytics & Metrics" },
];

const RESOURCE_FAQS = [
  {
    question: "Where should I start if our team is completely new to AEO & GEO?",
    answer:
      "Start with our SEO vs AEO vs GEO comparison guide. It explains how your existing technical SEO foundation feeds directly into AI citation extraction (AEO) and multi-turn buyer recommendations (GEO).",
  },
  {
    question: "Are these guides based on theoretical claims or live telemetry?",
    answer:
      "All Zobay Rank guides, benchmarks, and research papers are grounded in deterministic crawl data, un-personalized session tracking across major LLMs, and real-world citation gap analysis.",
  },
  {
    question: "Can developers access machine-readable documentation for AI crawlers?",
    answer:
      "Yes. Zobay Rank maintains an official /llms.txt specification and /llms-full.txt knowledge document accessible to any AI web crawler or developer agent.",
  },
  {
    question: "How frequently are these guides and glossary definitions updated?",
    answer:
      "Our research team updates benchmarks and glossary terms continuously as OpenAI, Perplexity, Google, and Anthropic roll out new model architectures and search features.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      {/* Schemas */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Resources", url: "/resources" },
        ]}
      />

      {/* Global Sticky Navbar */}
      <LandingNavbar />

      <main className="flex-1 flex flex-col pt-20">
        {/* ========================================================================= */}
        {/* SECTION 1 [DARK]: Master Hero Section with Dot Matrix & Glowing Accents */}
        {/* ========================================================================= */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Glowing Lighting */}
          <div className="absolute -top-20 left-1/3 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />

          {/* Dot Matrix Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 sm:space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Knowledge Hub &amp; Educational Library</span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black text-white tracking-tight leading-[1.1] font-sans max-w-4xl mx-auto">
              SEO, AEO &amp; GEO{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Resources
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed font-normal">
              In-depth research, architectural blueprints, technical checklists, and definitive reference guides engineered by the Zobay Rank team.
            </p>

            {/* Interactive Pillar Quick Nav Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
              <a
                href="#three-pillars"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Core Pillars
              </a>
              <a
                href="#featured-research"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-purple-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Research Papers
              </a>
              <a
                href="#glossary-preview"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Search &amp; AI Glossary
              </a>
              <a
                href="#faq"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Knowledge FAQ
              </a>
              <Link
                href="/guides"
                className="px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/40 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Optimization Guides</span>
              </Link>
            </div>

            {/* Key Resource Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">3 Core Pillars</span>
                  <span className="text-[11px] text-slate-400">SEO, AEO &amp; GEO Guides</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">8 Glossary Terms</span>
                  <span className="text-[11px] text-slate-400">With Schema.org Markup</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">6 Industry Playbooks</span>
                  <span className="text-[11px] text-slate-400">SaaS, E-Com, Agencies</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Implementation</span>
                  <span className="text-[11px] text-slate-400">Step-by-Step Blueprints</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 [WHITE/LIGHT]: The Three Foundational Pillars Hub (PathToSuccess Style) */}
        {/* ========================================================================= */}
        <section
          id="three-pillars"
          className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Core Knowledge Hubs
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                The Three Pillars of Search Optimization
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Explore in-depth architectural guides tailored to each layer of modern visibility: technical web crawling, conversational answer extraction, and generative model recommendations.
              </p>
            </div>

            {/* 3 Pillar Elevated Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.id}
                  className={`p-6 sm:p-8 rounded-3xl bg-white border ${pillar.borderColor} shadow-xl shadow-slate-200/50 flex flex-col justify-between transition-all hover:-translate-y-1 duration-200`}
                >
                  <div className="space-y-5">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pillar.badgeColor}`}>
                        {pillar.badge}
                      </span>
                      <div className={`w-10 h-10 rounded-xl ${pillar.iconBg} flex items-center justify-center shadow-md`}>
                        {pillar.id === "seo" && <Globe className="w-5 h-5" />}
                        {pillar.id === "aeo" && <Bot className="w-5 h-5" />}
                        {pillar.id === "geo" && <TrendingUp className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Resource Link List */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Included Reference Guides:
                      </span>
                      {pillar.links.map((link, lIdx) => (
                        <Link
                          key={lIdx}
                          href={link.href}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors group block truncate"
                        >
                          <span className="text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
                          <span className="truncate">{link.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Benchmark</span>
                      <span className="text-xs font-bold text-slate-900">{pillar.metric}</span>
                    </div>
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <span>{pillar.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Cross-Link Banner */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Comprehensive Comparison Matrix
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Understand the Exact Differences: SEO vs AEO vs GEO
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                  Review our 5-dimension objective matrix detailing target mediums, metrics, content formats, and failure modes.
                </p>
              </div>
              <Link
                href="/seo-vs-aeo-vs-geo"
                className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors whitespace-nowrap shadow-lg shrink-0 cursor-pointer"
              >
                Read Comparison Guide →
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 [DARK]: Featured Research & Technical Papers (WhatElse Bento Style) */}
        {/* ========================================================================= */}
        <section
          id="featured-research"
          className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white relative overflow-hidden border-b border-white/10"
        >
          {/* Radial Glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block">
                Original Research &amp; Blueprints
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Engineering Blueprints for the AI Era
              </h2>
              <p className="text-xs sm:text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Peer-reviewed research and practical execution manuals created by our search intelligence engineers to help brands navigate algorithmic transitions.
              </p>
            </div>

            {/* 4 Bento Research Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURED_RESEARCH.map((paper, idx) => {
                const IconComponent = paper.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-white/30 flex flex-col justify-between space-y-6 transition-all hover:-translate-y-1 duration-200"
                  >
                    <div className="space-y-4">
                      {/* Meta header */}
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${paper.bg} ${paper.color} border ${paper.border}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{paper.readTime}</span>
                          <span>•</span>
                          <span>{paper.category}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {paper.title}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400 block mt-1">
                          Published: {paper.date}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {paper.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      {paper.isExternal ? (
                        <a
                          href={paper.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>Open Specification Document</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={paper.href}
                          className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>Read Complete Paper</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 [WHITE/LIGHT]: Search & AI Glossary Directory */}
        {/* ========================================================================= */}
        <section
          id="glossary-preview"
          className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Official Terminology
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Search &amp; AI Intelligence Glossary
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Each term is structured with simple explanations, technical mechanics, real-world examples, and Schema.org DefinedTerm JSON-LD markup.
              </p>
            </div>

            {/* Glossary Terms Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {GLOSSARY_TERMS.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/glossary/${item.slug}`}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 shadow-md shadow-slate-200/30 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200 group cursor-pointer"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.term}
                    </h3>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                    <span>View Definition</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/glossary"
                className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Full Glossary Index</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 [DARK]: Knowledge FAQ Accordion */}
        {/* ========================================================================= */}
        <section
          id="faq"
          className="py-20 sm:py-24 2xl:py-32 bg-slate-950 text-slate-100 border-b border-slate-900 relative"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                Resource Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Answers to common questions regarding our methodology, data provenance, and research releases.
              </p>
            </div>

            <div className="space-y-4">
              {RESOURCE_FAQS.map((faq, idx) => (
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
                <span>Browse all 14 Platform &amp; Methodology FAQs</span>
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
              Put Our Research into Action
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Don't just read about AI search optimization. Audit your website's crawlability, extract AI source citations, and track your 8-factor GEO score today.
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
