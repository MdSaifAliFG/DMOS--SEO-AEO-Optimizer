import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Globe,
  Bot,
  TrendingUp,
  Sparkles,
  Zap,
  Layers,
  Activity,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Zobay Rank vs. Traditional SEO Tools | Platform Comparison",
  description:
    "An objective comparison between Zobay Rank's unified SEO+AEO+GEO architecture and legacy keyword/crawler-only SEO tools.",
  path: "/compare/zobay-rank-vs-traditional-seo-tools",
  keywords: [
    "Zobay Rank vs Traditional SEO Tools",
    "AEO vs Traditional SEO Tools",
    "Generative Search Tool Comparison",
    "AI Answer Engine Crawler Comparison",
  ],
});

const faqs = [
  {
    question: "Why can't traditional SEO tools measure AI answer visibility?",
    answer:
      "Traditional SEO tools scrape Google and Bing search engine result pages (SERPs) to count blue link positions. They do not simulate conversational buyer prompts across LLMs like ChatGPT, Perplexity, or Gemini, nor do they extract conversational source citations.",
  },
  {
    question: "Does Zobay Rank replace the need for technical website crawling?",
    answer:
      "No. Technical website crawling remains a vital foundation of Zobay Rank. Our built-in crawler audits HTTP codes, title tags, meta descriptions, canonical URLs, and indexability rules alongside AI answer engine telemetry.",
  },
  {
    question: "What is the primary advantage of a unified SEO, AEO, and GEO platform?",
    answer:
      "A unified platform eliminates data silos. You can see how technical crawl issues directly impact whether AI search models can index, cite, and recommend your brand, all from one consolidated dashboard.",
  },
];

export default function ZobayRankVsTraditionalPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Compare", url: "/compare" },
          {
            name: "Zobay Rank vs Traditional SEO Tools",
            url: "/compare/zobay-rank-vs-traditional-seo-tools",
          },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

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
              <span>Verifiable Architecture Comparison</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Zobay Rank vs. <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Traditional SEO Tools
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Evaluating the transition from legacy SERP keyword rank scrapers to modern unified Technical SEO, AI Answer Engine Tracking, and Generative Engine Optimization.
            </p>

            {/* Direct Answer Summary Block */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>EXECUTIVE SUMMARY</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Traditional SEO tools were engineered during the Google blue-link era to monitor keyword positions, backlinks, and desktop page speed. <strong>Zobay Rank</strong> retains full technical SEO crawling capabilities while expanding into <strong>AEO</strong> (live ChatGPT, Perplexity, and Gemini citation tracking) and <strong>GEO</strong> (8-factor generative search recommendation scoring), providing unified visibility across both legacy search and generative AI.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">Full Stack</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">SEO + AEO + GEO</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">4 Engines</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">AI Models Audited</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-cyan-400">Zero Guess</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Deterministic Data</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">1 Hub</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Unified Workspace</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run a Free Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors text-center"
              >
                View Transparent Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Comparison Table)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Feature-by-Feature Matrix</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Capability Comparison Matrix
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Factual breakdown of supported features across legacy keyword rank trackers and Zobay Rank's modern search intelligence architecture.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 bg-white">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-5 w-1/2">Capability</th>
                    <th className="p-5 w-1/4 text-center">Traditional SEO Tools</th>
                    <th className="p-5 w-1/4 text-center text-blue-700 bg-blue-50/60 font-black">Zobay Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">Technical Website Crawling</td>
                    <td className="p-5 text-center text-emerald-600 font-bold">Supported</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported (Built-in BFS)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">Status Code &amp; Canonical Audits</td>
                    <td className="p-5 text-center text-emerald-600 font-bold">Supported</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">Title &amp; Meta Description Validation</td>
                    <td className="p-5 text-center text-emerald-600 font-bold">Supported</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">Live AI Answer Engine Tracking (ChatGPT, Perplexity)</td>
                    <td className="p-5 text-center text-rose-500 font-bold">Not Available</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported (AEO Module)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">AI Source Citation Extraction &amp; Gap Analysis</td>
                    <td className="p-5 text-center text-rose-500 font-bold">Not Available</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">8-Factor GEO Recommendation Score</td>
                    <td className="p-5 text-center text-rose-500 font-bold">Not Available</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported (GEO Module)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">Knowledge Graph Entity Consistency Validation</td>
                    <td className="p-5 text-center text-rose-500 font-bold">Rare / Limited</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-bold text-slate-900">Cross-Engine AI Parity Matrix</td>
                    <td className="p-5 text-center text-rose-500 font-bold">Not Available</td>
                    <td className="p-5 text-center text-emerald-600 font-bold bg-blue-50/30">Supported</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (3-Tier Architectural Advantage)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Layers className="w-4 h-4" />
                <span>The Unified Stack</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Why Legacy Keyword Scrapers Fall Short
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Traditional rank trackers treat search as a static page with 10 links. Here is how modern discovery has permanently changed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">From Blue Links to AI Synthesis</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Searchers no longer click 5 different tabs. AI engines synthesize multi-source answers and cite authoritative brands directly.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Entity Authority Over Raw Links</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Backlink quantity is being replaced by structured entity consensus in knowledge graphs. Zobay Rank validates entity integrity across models.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Cross-Engine Disparities</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A high Google rank does not guarantee recommendations in Perplexity or ChatGPT. Zobay Rank provides multi-engine parity analysis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: DARK SECTION (FAQ)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <span>Comparison FAQs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Comparison Questions Answered
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Detailed answers to how Zobay Rank complements or supersedes legacy SEO tools.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-blue-500/40 transition-colors"
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
          </div>
        </section>

        {/* ========================================================
            SECTION 5: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Upgrade Your Search Stack with Zobay Rank
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Combine technical crawling with live AI answer tracking and generative discovery.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run Free Audit</span>
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
