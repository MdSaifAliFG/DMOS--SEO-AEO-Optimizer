import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Brain,
  Quote,
  Target,
  FileCheck,
  Boxes,
  Layers,
  BarChart3,
  Bot,
  Zap,
  Globe,
  Compass,
  Cpu,
  Activity,
  Check,
  Award,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, SoftwareApplicationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "GEO Optimization for AI Search | Zobay Rank",
  description:
    "Improve generative search visibility, brand recommendations, citations and entity understanding with Zobay Rank GEO optimization.",
  path: "/geo-optimization",
  keywords: [
    "GEO Optimization",
    "Generative Engine Optimization",
    "Generative Search Visibility",
    "AI Recommendations",
    "Entity Consistency",
    "Citation Readiness",
    "Commercial Discovery",
    "8-Factor GEO Score",
  ],
});

const faqs = [
  {
    question: "What is Generative Engine Optimization (GEO)?",
    answer:
      "GEO (Generative Engine Optimization) is the discipline of optimizing brand authority, entity representation, content extractability, and citation readiness so that generative AI search engines actively recommend your products during commercial decision-making.",
  },
  {
    question: "What is Zobay Rank's 8-Factor GEO Score?",
    answer:
      "Our proprietary 8-factor GEO diagnostic measures: 1) AI Visibility Score, 2) Recommendation Strength, 3) Citation Authority, 4) Entity Understanding, 5) Content Extractability, 6) Technical AI Accessibility, 7) Cross-Engine Parity, and 8) Commercial Discovery.",
  },
  {
    question: "How does GEO differ from traditional SEO?",
    answer:
      "While SEO optimizes for 10 blue links on traditional search engine result pages (SERPs), GEO optimizes for multi-turn generative synthesis where the AI directly names, compares, and recommends specific solutions to conversational queries.",
  },
  {
    question: "How can businesses improve their citation readiness for AI models?",
    answer:
      "By publishing structured, verified claims, providing clear question-answer formatting, securing third-party co-citations in authoritative publications, maintaining consistent entity data, and permitting AI search crawlers in robots.txt.",
  },
];

export default function GeoOptimizationPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "GEO Optimization", url: "/geo-optimization" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-20">
        {/* ========================================================
            SECTION 1: HERO (Dark #050B18)
        ======================================================== */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Amber / Warm Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Generative Engine Optimization (GEO)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              GEO Optimization for <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">
                Generative AI Search
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Improve generative search visibility, brand recommendations, citations, and entity understanding with Zobay Rank's deterministic 8-factor GEO optimization framework.
            </p>

            {/* Direct Answer Box for LLM Extractability */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-amber-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-amber-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>DIRECT ANSWER: WHAT IS GENERATIVE ENGINE OPTIMIZATION (GEO)?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Generative Engine Optimization (GEO)</strong> is the process of structuring, validating, and establishing authoritative digital presence so that generative search experiences (such as Perplexity, ChatGPT Search, Google Gemini, and Claude) understand your brand entities, cite your publications, and confidently recommend your business when prospective buyers evaluate options.
              </p>
            </div>

            {/* Live Model Tracking Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-amber-400">8 Factors</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Diagnostic Framework</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-orange-400">4 Engines</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Cross-Engine Parity</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-yellow-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Verified Grounding</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">Zero</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Fabricated Claims</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore GEO Optimization</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors text-center"
              >
                View GEO Plan Tiers
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (8-Factor GEO Framework)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Proprietary Scoring Standard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                The 8-Factor GEO Diagnostic Framework
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Deterministic scoring criteria evaluating your brand's authority, recommendation readiness, and entity integrity in generative models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Factor 1 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    01
                  </div>
                  <h3 className="text-base font-bold text-slate-900">AI Visibility Score</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Frequency and prominence of brand mentions across conversational and transactional multi-turn prompts.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>Mention Frequency</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              {/* Factor 2 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    02
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Recommendation Strength</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Whether the AI highlights your product as a top recommendation, secondary alternative, or omits it entirely.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>Top Choice Rank</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              {/* Factor 3 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    03
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Citation Authority</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Weight and trust distribution of third-party domains citing your brand in AI model source cards.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>Source Card Weight</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              {/* Factor 4 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    04
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Entity Understanding</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Consistency of company name, product offerings, executive names, and pricing across public knowledge bases.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>Knowledge Graph Node</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              {/* Factor 5 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    05
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Content Extractability</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Presence of structured definitions, bulleted summaries, schema markup, and bite-sized factual answers.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>Structured Summaries</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              {/* Factor 6 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    06
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Technical AI Accessibility</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unblocked crawler access in robots.txt for AI agents (`GPTBot`, `PerplexityBot`) and fast server response times.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>Robots.txt &amp; llms.txt</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              {/* Factor 7 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    07
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Cross-Engine Parity</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluation of parity across ChatGPT, Perplexity, Claude, and Google Gemini to prevent blind spots in specific models.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>4-Engine Alignment</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              {/* Factor 8 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform">
                    08
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Commercial Discovery</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Presence when prospective customers enter comparison prompts like "Best [industry] software for [use case]".
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                  <span>Buyer Intent Capture</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Cross-Engine Parity)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-semibold">
                <Compass className="w-4 h-4" />
                <span>Cross-Engine Parity Benchmark</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Cross-Engine Parity Across All 4 Major AI Platforms
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Ensure consistent recommendation strength and eliminate coverage blind spots across ChatGPT, Perplexity, Google Gemini, and Claude.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ChatGPT */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">ChatGPT</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">98% Parity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluates OpenAI GPT-4o search browsing mode, live citation pill frequencies, and structured product recommendation positions.
                </p>
                <div className="text-[11px] text-amber-400 font-mono pt-2">Primary Index: Bing + Live Fetch</div>
              </div>

              {/* Perplexity */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Perplexity</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">95% Parity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Audits Sonar citation footnotes, domain frequency distributions, and entity consistency across multi-source answer summaries.
                </p>
                <div className="text-[11px] text-amber-400 font-mono pt-2">Primary Index: Multi-Index RAG</div>
              </div>

              {/* Google Gemini */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Google Gemini</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">94% Parity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Inspects AI Overviews inclusion, Google Knowledge Graph entity bindings, and interactive carousel link placements.
                </p>
                <div className="text-[11px] text-amber-400 font-mono pt-2">Primary Index: Google Search Graph</div>
              </div>

              {/* Claude */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Claude</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">92% Parity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluates Anthropic Sonnet's analytical extraction, neutral attribution style, and high-accuracy technical specification parsing.
                </p>
                <div className="text-[11px] text-amber-400 font-mono pt-2">Primary Index: Retrieval Grounding</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Deterministic Action Plans)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Actionable Remediation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Deterministic GEO Action Plans
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Every identified gap translates into prioritized developer, content, and schema action items with concrete examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Priority 1 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">Priority 1</span>
                  <span className="text-xs text-slate-400 font-mono">Entity Layer</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Schema &amp; Entity Alignment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Inject missing Organization, WebSite, and DefinedTerm JSON-LD schemas to solidify entity identification across global knowledge repositories.
                </p>
                <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-mono">
                  Target: Knowledge Graph Reconciliation
                </div>
              </div>

              {/* Priority 2 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">Priority 2</span>
                  <span className="text-xs text-slate-400 font-mono">Content Layer</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bite-Sized Extractable Answers</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Structure key comparison pages with clear Q&amp;A blocks and definition summaries that LLMs can extract verbatim without hallucination.
                </p>
                <div className="p-3 rounded-xl bg-orange-50 text-orange-800 text-xs font-mono">
                  Target: 40–60 Word Direct Answers
                </div>
              </div>

              {/* Priority 3 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">Priority 3</span>
                  <span className="text-xs text-slate-400 font-mono">Crawl Layer</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Crawl Accessibility Directives</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ensure robots.txt permits search bots (GPTBot, PerplexityBot) and provide llms.txt to accelerate knowledge graph indexing.
                </p>
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-mono">
                  Target: Unrestricted AI Crawler Ingestion
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK SECTION (GEO FAQ)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-semibold">
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions About GEO
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Clear answers regarding generative search visibility, brand recommendations, and citations.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-amber-500/40 transition-colors"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                    <span className="text-amber-400 font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
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
            SECTION 6: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 text-white relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Optimize Your Brand for Generative Discovery
            </h2>
            <p className="text-sm sm:text-lg text-amber-100 max-w-2xl mx-auto leading-relaxed">
              Evaluate your 8-factor GEO score, benchmark against competitors, and earn recommendations in modern AI search.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore GEO Optimization</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-black/30 hover:bg-black/40 border border-white/20 text-white font-semibold text-sm transition-colors text-center"
              >
                View GEO Plan Tiers
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
