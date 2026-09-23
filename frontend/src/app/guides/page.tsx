import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Globe,
  Bot,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Terminal,
  Layers,
  Compass,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO, AEO & GEO Optimization Guides | Zobay Rank",
  description:
    "Step-by-step technical guides for executing website audits, earning AI answer citations, and optimizing generative search visibility.",
  path: "/guides",
  keywords: [
    "SEO Guides",
    "AEO Optimization Guide",
    "GEO Implementation Guide",
    "Technical SEO Step-by-Step",
  ],
});

const GUIDES = [
  {
    title: "Complete Technical SEO Audit Blueprint",
    desc: "A step-by-step roadmap to crawl depth, canonical auditing, status code resolution, and XML sitemaps.",
    href: "/seo-optimization",
    category: "Technical SEO",
    readTime: "8 min read",
    icon: Globe,
    color: "blue",
  },
  {
    title: "How to Earn Citations in ChatGPT & Perplexity",
    desc: "Editorial and schema formatting strategies to ensure your content is extracted and cited in conversational answers.",
    href: "/aeo-optimization",
    category: "AEO Optimization",
    readTime: "10 min read",
    icon: Bot,
    color: "purple",
  },
  {
    title: "Implementing the 8-Factor GEO Framework",
    desc: "Actionable checklist to audit your brand's recommendation strength, entity understanding, and cross-engine parity.",
    href: "/geo-optimization",
    category: "GEO Optimization",
    readTime: "12 min read",
    icon: TrendingUp,
    color: "amber",
  },
  {
    title: "Bridging Legacy SERP Strategy to Generative Discovery",
    desc: "How to safeguard your traditional search traffic while expanding into AI answer engines and conversational recommendations.",
    href: "/ai-search-optimization",
    category: "AI Search",
    readTime: "9 min read",
    icon: Sparkles,
    color: "cyan",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Guides", url: "/guides" },
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
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Step-by-Step Implementation Guides</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Optimization Guides &amp; <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Actionable Blueprints
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Tactical, actionable documentation to implement technical crawling best practices, earn AI answer citations, and dominate generative search.
            </p>

            {/* Direct Answer Box */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>DIRECT ANSWER: WHAT ARE THE ZOBAY RANK GUIDES?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank Optimization Guides</strong> are developer- and marketing-ready technical blueprints providing exact code examples, robots.txt directives, schema markup templates, and prompt monitoring workflows to bridge legacy search engine optimization with conversational AI discovery.
              </p>
            </div>

            {/* Guide Stats Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">4</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Complete Blueprints</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Actionable Code</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-cyan-400">3 Pillars</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">SEO • AEO • GEO</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">Zero</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Fluff or Hype</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Guides Grid)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Tactical Documentation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Step-by-Step Optimization Guides
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Choose a playbook below to master crawler audits, AI citation earning, or generative recommendation scoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {GUIDES.map((guide, idx) => {
                const IconComponent = guide.icon;
                return (
                  <Link
                    key={idx}
                    href={guide.href}
                    className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {guide.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {guide.readTime}
                        </span>
                      </div>
                      <div className="flex items-start gap-4 pt-1">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {guide.title}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed mt-2">
                            {guide.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span>Read Complete Guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Guided Progression)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Layers className="w-4 h-4" />
                <span>The Implementation Sequence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Recommended 3-Phase Implementation Path
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                To maximize search visibility and citation volume, execute optimizations in this validated architectural order.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  Phase 1
                </div>
                <h3 className="text-xl font-bold text-white">Technical Foundation</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Eliminate 404 dead ends, resolve canonical redirect loops, configure robots.txt crawler access, and ensure TTFB &lt; 500ms.
                </p>
                <div className="text-xs text-blue-400 font-mono pt-2">Guide: Complete Technical SEO</div>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  Phase 2
                </div>
                <h3 className="text-xl font-bold text-white">Entity &amp; Schema Grounding</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Implement JSON-LD structured data (Organization, DefinedTerm, FAQPage) and anchor your brand to recognized knowledge nodes.
                </p>
                <div className="text-xs text-purple-400 font-mono pt-2">Guide: Earning Citations</div>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  Phase 3
                </div>
                <h3 className="text-xl font-bold text-white">Prompt Tracking &amp; Parity</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Monitor high-intent buyer prompts across ChatGPT, Perplexity, Gemini, and Claude to maintain persistent recommendation strength.
                </p>
                <div className="text-xs text-emerald-400 font-mono pt-2">Guide: 8-Factor GEO Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Automated Verification)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Deterministic Verification</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                How to Verify Your Implementation
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Every optimization guide connects directly to Zobay Rank's automated testing suite so you can verify fixes with absolute confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Run BFS Crawler Audit</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Verify status codes, canonical loops, heading hierarchies, and crawl boundaries in real time via our deterministic engine.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">AI Prompt Transcripts</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Review exact prompt execution logs, cited source URLs, and competitor citation gaps across all 4 major answer engines.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-amber-600/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">8-Factor Diagnostic Benchmark</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Track your composite GEO score, measure cross-engine parity, and export white-label executive reports for stakeholders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Start Implementing Your Optimization Plan
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Launch an automated audit and track your presence across AI search in under 60 seconds.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run Free Technical Audit</span>
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
