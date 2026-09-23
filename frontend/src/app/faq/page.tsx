import React from "react";
import Link from "next/link";
import {
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  Bot,
  TrendingUp,
  ShieldCheck,
  Zap,
  CreditCard,
  Mail,
  Layers,
  FileCode,
  Check,
  Clock,
  Compass,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions (FAQ) | Zobay Rank",
  description:
    "Get clear, factual answers to the most common questions regarding Zobay Rank, SEO crawling, AEO prompt tracking, GEO optimization, and credit usage.",
  path: "/faq",
  keywords: [
    "Zobay Rank FAQ",
    "What is Zobay Rank",
    "What is SEO",
    "What is AEO",
    "What is GEO",
    "AI Citations Explained",
    "Zobay Rank Free Plan",
  ],
});

const ALL_FAQS = [
  {
    category: "Platform & Strategy",
    question: "What is Zobay Rank?",
    answer:
      "Zobay Rank is an AI-powered SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform developed by Zobay. It provides automated technical website crawling, live prompt tracking across leading AI models, citation extraction, and prioritized optimization recommendations.",
  },
  {
    category: "Core Foundations",
    question: "What is SEO?",
    answer:
      "SEO (Search Engine Optimization) is the process of improving website technical health, indexability, metadata, and link architecture so algorithmic search engines like Google and Bing can efficiently discover, crawl, and rank your pages.",
  },
  {
    category: "AI Extraction",
    question: "What is AEO?",
    answer:
      "AEO (Answer Engine Optimization) is the practice of optimizing content so artificial intelligence answer engines—including ChatGPT, Perplexity, and Gemini—cite your website as a factual source when generating direct answers to buyer queries.",
  },
  {
    category: "AI Recommendation",
    question: "What is GEO?",
    answer:
      "GEO (Generative Engine Optimization) is the discipline of optimizing brand entity authority, content extractability, and recommendation readiness so generative search models actively recommend your business during commercial research.",
  },
  {
    category: "Platform & Strategy",
    question: "What is AI Search Optimization?",
    answer:
      "AI Search Optimization is a holistic search strategy combining technical crawling (SEO), conversational source citations (AEO), and generative model recommendations (GEO) to capture organic traffic across traditional search and AI assistants.",
  },
  {
    category: "Platform & Strategy",
    question: "How does Zobay Rank work?",
    answer:
      "You enter your website URL. Zobay Rank's high-concurrency BFS crawler audits your site's technical health. Simultaneously, our AEO and GEO engines query leading AI models with industry prompts to track brand citations, entity consistency, and competitor visibility.",
  },
  {
    category: "Technical Crawling",
    question: "What does an SEO audit analyze?",
    answer:
      "A Zobay Rank SEO audit inspects HTTP status codes (200, 301, 404, 500), title tags, meta descriptions, H1–H6 heading hierarchies, canonical URLs, robots.txt directives, XML sitemaps, broken internal links, image alt attributes, and server response times.",
  },
  {
    category: "AI Extraction",
    question: "What does AEO measure?",
    answer:
      "AEO measures prompt visibility (how often your brand appears in AI answers), citation frequency (how often your domain is linked as a footnote source), answer sentiment, and competitor citation gaps.",
  },
  {
    category: "AI Recommendation",
    question: "What does GEO measure?",
    answer:
      "GEO measures your 8-factor score: AI Visibility Score, Recommendation Strength, Citation Authority, Entity Understanding, Content Extractability, Technical AI Accessibility, Cross-Engine Parity, and Commercial Discovery.",
  },
  {
    category: "AI Extraction",
    question: "What are AI citations?",
    answer:
      "AI citations are explicit hyperlinked references or footnote attributions provided by an AI answer model acknowledging the original website used to verify its response.",
  },
  {
    category: "Knowledge Graph",
    question: "What are entities?",
    answer:
      "Entities are verified real-world concepts, organizations, products, and persons represented in search knowledge graphs. Clear entity optimization prevents AI models from confusing your brand with competitors or hallucinating inaccurate data.",
  },
  {
    category: "Benchmarking",
    question: "How does Zobay Rank track competitors?",
    answer:
      "Zobay Rank benchmarks your website side-by-side against competitor domains, identifying which queries competitors win in traditional search and which prompts cite competitor URLs in AI answer engines.",
  },
  {
    category: "Pricing & Billing",
    question: "Does Zobay Rank offer a free plan?",
    answer:
      "Yes. Zobay Rank offers a 100% Free plan providing 50 monthly credits to run initial website audits and test AI prompt tracking without requiring a credit card.",
  },
  {
    category: "Pricing & Billing",
    question: "How are Zobay Rank credits used?",
    answer:
      "Credits are consumed when running website crawls (proportional to pages crawled) or executing live AI answer engine prompt analyses. Monthly subscription credits replenish each billing cycle, and one-time top-up packs never expire.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      {/* Schemas */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "FAQ", url: "/faq" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={ALL_FAQS} />

      {/* Global Sticky Navbar */}
      <LandingNavbar />

      <main className="flex-1 flex flex-col pt-20">
        {/* ========================================================================= */}
        {/* SECTION 1 [DARK]: Master Hero Section with Dot Matrix & Radiant Glows */}
        {/* ========================================================================= */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Colorful Radial Flares */}
          <div className="absolute -top-20 left-1/4 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />

          {/* Dot Matrix Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 sm:space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Knowledge Base &amp; Verified Inquiries</span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black text-white tracking-tight leading-[1.1] font-sans max-w-4xl mx-auto">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed font-normal">
              Find clear, factual answers about Zobay Rank, technical SEO crawling, AI answer engine citations, generative optimization, and subscription credits.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
              <a
                href="#foundational-architecture"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Platform Architecture
              </a>
              <a
                href="#technical-seo-faq"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-purple-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                SEO &amp; Crawling
              </a>
              <a
                href="#aeo-geo-faq"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                AEO &amp; GEO Citations
              </a>
              <a
                href="#plans-billing-faq"
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-400 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Plans &amp; Credits
              </a>
              <a
                href="#contact-support"
                className="px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/40 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Desk</span>
              </a>
            </div>

            {/* Key Trust Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">14 Verified Answers</span>
                  <span className="text-[11px] text-slate-400">Deterministic Knowledge</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Free Plan Available</span>
                  <span className="text-[11px] text-slate-400">No Credit Card Needed</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Enterprise Privacy</span>
                  <span className="text-[11px] text-slate-400">SSRF &amp; Data Isolation</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">24hr Support Desk</span>
                  <span className="text-[11px] text-slate-400">support@zobay.in</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 [WHITE/LIGHT]: Core Foundational Architecture Questions */}
        {/* ========================================================================= */}
        <section
          id="foundational-architecture"
          className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Category 01
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Platform Identity &amp; Foundations
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Essential questions explaining what Zobay Rank is, how our three optimization layers synergize, and why multi-tier search visibility is required in 2026.
              </p>
            </div>

            {/* Elevated Light Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Q1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-500/30 hover:border-blue-500/60 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Platform Overview
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q01</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What is Zobay Rank?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Zobay Rank is an AI-powered SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform developed by Zobay. It provides automated technical website crawling, live prompt tracking across leading AI models, citation extraction, and prioritized optimization recommendations in a single operating system.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link href="/about-zobay-rank" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    <span>Read About Zobay Rank</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q2 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-500/30 hover:border-purple-500/60 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      Three Pillars
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q02</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What is the difference between SEO, AEO, and GEO?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <strong>SEO</strong> optimizes websites for crawler indexing and algorithmic rankings on Google/Bing. <strong>AEO</strong> structures content so conversational AI models (ChatGPT, Perplexity) cite your brand as an authoritative source in answer cards. <strong>GEO</strong> builds entity consistency and authority so generative search engines actively recommend your product during buyer evaluations.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link href="/seo-vs-aeo-vs-geo" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                    <span>View 5-Dimension Comparison Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q3 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-indigo-500/30 hover:border-indigo-500/60 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      Holistic Strategy
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q03</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What is AI Search Optimization?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    AI Search Optimization is the holistic strategy of optimizing a brand's technical infrastructure, content extractability, and entity authority so it succeeds across both traditional algorithmic search engines (Google, Bing) and AI generative answer models (ChatGPT, Perplexity, Gemini).
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link href="/ai-search-optimization" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    <span>Explore Solutions Platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q4 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-500/30 hover:border-amber-500/60 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      Operational Flow
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q04</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">How does Zobay Rank work?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    You enter your website URL. Zobay Rank's high-concurrency BFS crawler audits your site's technical health. Simultaneously, our AEO and GEO engines query leading AI models with industry prompts to track brand citations, entity consistency, and competitor visibility in real-time.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link href="/resources" className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                    <span>Browse Resource Blueprints</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 [DARK]: Technical SEO & Crawler Inquiries (WhatElse Bento Style) */}
        {/* ========================================================================= */}
        <section
          id="technical-seo-faq"
          className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white relative overflow-hidden border-b border-white/10"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block">
                Category 02: Crawler Mechanics
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Technical SEO &amp; Website Auditing
              </h2>
              <p className="text-xs sm:text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Everything you need to know about our high-speed website crawler, status code verifications, canonical redirects, and health score calculations.
              </p>
            </div>

            {/* Bento Q&A Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Q5 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-blue-500/40 space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    Audit Mechanics
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Q05</span>
                </div>
                <h3 className="text-xl font-bold text-white">What does an SEO audit analyze?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A Zobay Rank SEO audit inspects HTTP status codes (200, 301, 404, 500), title tags, meta descriptions, H1–H6 heading hierarchies, canonical URLs, robots.txt directives, XML sitemaps, broken internal links, image alt attributes, and server response times.
                </p>
                <div className="pt-2">
                  <Link href="/seo-optimization" className="text-xs font-bold text-blue-400 hover:underline inline-flex items-center gap-1">
                    <span>Learn About Technical SEO Audits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q6 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-purple-500/40 space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Competitive Intelligence
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Q06</span>
                </div>
                <h3 className="text-xl font-bold text-white">How does Zobay Rank track competitors?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Zobay Rank benchmarks your website side-by-side against competitor domains, identifying which queries competitors win in traditional search and which prompts cite competitor URLs in AI answer engines, pinpointing your exact growth gaps.
                </p>
                <div className="pt-2">
                  <Link href="/compare/zobay-rank-vs-traditional-seo-tools" className="text-xs font-bold text-purple-400 hover:underline inline-flex items-center gap-1">
                    <span>View Competitor Benchmarking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q7 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Scoring Heuristics
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Q07</span>
                </div>
                <h3 className="text-xl font-bold text-white">How is the 0–100 SEO Health Score computed?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  The overall SEO Health Score is a weighted composite of four deterministic technical categories: Technical SEO (30%), Indexability (25%), Metadata &amp; Content (25%), and Link Health (20%). It isolates critical errors like broken canonicals or crawl loops before they harm rankings.
                </p>
              </div>

              {/* Q8 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-amber-500/40 space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Bot Directives
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Q08</span>
                </div>
                <h3 className="text-xl font-bold text-white">Can AI crawlers crawl my site if robots.txt disallows them?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  No. Legitimate AI search crawlers (such as OpenAI's GPTBot, PerplexityBot, and Google-Extended) strictly respect robots.txt directives. If you block them, AI models cannot access or verify your web content and will cite competitor pages instead.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 [WHITE/LIGHT]: AEO Citations & GEO Questions */}
        {/* ========================================================================= */}
        <section
          id="aeo-geo-faq"
          className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                Category 03: Answer &amp; Generative Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                AEO, Citations &amp; Generative Optimization
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Detailed breakdowns on how AI answer models extract sources, why entity optimization matters, and how the 8-factor GEO score is calculated.
              </p>
            </div>

            {/* 4 Elevated White Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Q9 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-purple-500/50 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      Answer Measurement
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q09</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What does AEO measure?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    AEO measures prompt visibility (how often your brand appears in AI answers), citation frequency (how often your domain is linked as a footnote source), answer sentiment, and competitor citation gaps across conversational queries.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Link href="/aeo-optimization" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                    <span>Explore AEO Intelligence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q10 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-amber-500/50 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      Recommendation Models
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q10</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What does GEO measure?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    GEO measures your 8-factor score: AI Visibility Score, Recommendation Strength, Citation Authority, Entity Understanding, Content Extractability, Technical AI Accessibility, Cross-Engine Parity, and Commercial Discovery.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Link href="/geo-optimization" className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                    <span>Explore 8-Factor GEO Framework</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q11 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/50 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      Source Attribution
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q11</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What are AI citations?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    AI citations are explicit hyperlinked references or footnote attributions provided by an AI answer model acknowledging the original website used to verify its response, driving high-intent referral traffic directly to your pages.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Link href="/glossary/citation" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    <span>Read Glossary Definition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q12 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Knowledge Graphs
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Q12</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What are entities?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Entities are verified real-world concepts, organizations, products, and persons represented in search knowledge graphs. Clear entity optimization prevents AI models from confusing your brand with competitors or hallucinating inaccurate data.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Link href="/glossary/entity-seo" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                    <span>Read Entity SEO Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 [DARK]: Subscription Plans, Credits & Enterprise Policies */}
        {/* ========================================================================= */}
        <section
          id="plans-billing-faq"
          className="py-20 sm:py-24 2xl:py-32 bg-slate-950 text-slate-100 border-b border-slate-900 relative"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                Category 04: Billing &amp; Usage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Plans, Credits &amp; Enterprise Governance
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Transparent information regarding plan tiers, monthly rollover credits, and enterprise security standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Q13 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Free Tier
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Q13</span>
                </div>
                <h3 className="text-xl font-bold text-white">Does Zobay Rank offer a free plan?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Yes. Zobay Rank offers a 100% Free plan providing 50 monthly credits to run initial website audits and test AI prompt tracking without requiring a credit card.
                </p>
                <div className="pt-2">
                  <Link href="/pricing" className="text-xs font-bold text-blue-400 hover:underline inline-flex items-center gap-1">
                    <span>View Pricing Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Q14 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Credit Mechanics
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Q14</span>
                </div>
                <h3 className="text-xl font-bold text-white">How are Zobay Rank credits used?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Credits are consumed when running website crawls (proportional to pages crawled) or executing live AI answer engine prompt analyses. Monthly subscription credits replenish each billing cycle, and one-time top-up packs never expire.
                </p>
                <div className="pt-2">
                  <Link href="/pricing" className="text-xs font-bold text-purple-400 hover:underline inline-flex items-center gap-1">
                    <span>Credit Pack Rates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6 [VIBRANT GRADIENT]: Contact Support Desk & Action Strip */}
        {/* ========================================================================= */}
        <section
          id="contact-support"
          className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Have a Specific Question?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Our engineering and search team is here to assist. Contact us directly at{" "}
              <a href="mailto:support@zobay.in" className="text-white underline font-bold">
                support@zobay.in
              </a>{" "}
              or test your domain with our free audit scanner.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-950 font-bold text-sm tracking-wide shadow-2xl hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Contact Support Desk →</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/30 hover:bg-black/40 border border-white/30 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                <span>Start Free AI Audit</span>
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
