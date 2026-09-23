import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Globe,
  Bot,
  TrendingUp,
  Sparkles,
  Layers,
  Activity,
  Check,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Compare Zobay Rank | Search & AI Optimization Comparisons",
  description:
    "Objective, verifiable comparisons of Zobay Rank against traditional crawler-only SEO platforms and legacy search tools.",
  path: "/compare",
  keywords: [
    "Compare Zobay Rank",
    "Zobay Rank vs Traditional SEO Tools",
    "SEO vs AEO Platform Comparison",
    "Best AI Search Optimization Software",
  ],
});

export default function CompareDirectoryPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Compare", url: "/compare" },
        ]}
      />

      <LandingNavbar />

      <main className="flex-1 pt-20">
        {/* ========================================================
            SECTION 1: HERO (Dark #050B18)
        ======================================================== */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <Scale className="w-4 h-4 text-blue-400" />
              <span>Objective Platform Analysis</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Compare <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Zobay Rank
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore factual, verifiable comparisons between Zobay Rank's unified SEO+AEO+GEO architecture and legacy keyword rank scrapers.
            </p>

            {/* Direct Answer Box */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>EXECUTIVE OVERVIEW: THE NEXT GENERATION OF SEARCH</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                While legacy SEO tools remain constrained to counting Google blue-link ranks, modern buyers discover and compare software directly in conversational AI answer engines. <strong>Zobay Rank</strong> delivers complete deterministic technical SEO crawling while pioneering live AEO citation monitoring and 8-factor GEO recommendation scoring.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Comparison Cards)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Direct Comparisons</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Featured Platform Comparisons
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Objective, feature-by-feature evaluations against traditional alternatives.
              </p>
            </div>

            <div className="space-y-6">
              {/* Card 1 */}
              <Link
                href="/compare/zobay-rank-vs-traditional-seo-tools"
                className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group space-y-6 block"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                      Flagship Platform Comparison
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Zobay Rank vs. Traditional SEO Tools
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Traditional SEO software focuses exclusively on Google SERP keyword tracking and desktop website crawling. Discover how Zobay Rank expands beyond legacy crawlers to include live AI answer prompt tracking, citation gap extraction, and 8-factor generative search optimization.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      Technical BFS Crawling
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                      ChatGPT &amp; Perplexity Citations
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      8-Factor GEO Scoring
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                      Cross-Engine Parity Matrix
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Read Full Technical Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Card 2 */}
              <Link
                href="/seo-vs-aeo-vs-geo"
                className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-purple-400 transition-all flex flex-col justify-between group space-y-6 block"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider">
                      Methodology Comparison
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    SEO vs. AEO vs. GEO: What's the Difference?
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Understand the distinct target surfaces, optimization tactics, and metric benchmarks across traditional Search Engine Optimization, conversational Answer Engine Optimization, and Generative Engine Optimization.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                      SEO: Google Blue Links
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                      AEO: AI Direct Citations
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold">
                      GEO: Recommendation Strength
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                  <span>View 3-Pillar Comparison Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Architectural Pillars)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Layers className="w-4 h-4" />
                <span>The Unified Stack</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                One Platform. Complete Search Intelligence.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Eliminate the expense and data fragmentation of juggling separate crawler and keyword tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Full Technical Crawling</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deterministic BFS crawler verifies HTTP codes, status redirects, robots exclusion rules, and semantic headings across all domestic subpaths.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Live AI Citation Tracking</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Real-time query execution across ChatGPT, Perplexity, Gemini, and Claude to monitor where your brand is cited and reveal competitor gaps.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">8-Factor GEO Scoring</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Benchmark entity consistency, recommendation strength, citation authority, and cross-engine parity to drive generative discovery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Experience Modern Search Intelligence
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Start auditing technical crawlability and tracking AI citations with Zobay Rank today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run a Free Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-semibold text-sm transition-colors text-center"
              >
                View Plans &amp; Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
