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
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, SoftwareApplicationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "AI Search Optimization Platform | Zobay Rank",
  description:
    "Optimize your brand for AI-powered search with SEO, AEO and GEO analysis from Zobay Rank.",
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
];

export default function AiSearchOptimizationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "AI Search Optimization", url: "/ai-search-optimization" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Search &amp; AI Intelligence Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              AI Search Optimization Platform
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Optimize your brand for AI-powered search with unified SEO, AEO and GEO analysis from Zobay Rank.
            </p>

            {/* Direct Answer Block for AEO/GEO Extractability */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-indigo-950/30 border border-indigo-900/60 text-left space-y-2 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Direct Answer: What is AI Search Optimization?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>AI Search Optimization</strong> is a three-layer visibility framework that aligns technical website crawlability (SEO), conversational answer citations (AEO), and generative model recommendations (GEO) to ensure your business captures market share across both traditional SERPs and conversational AI engines.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Free AI Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/seo-vs-aeo-vs-geo"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors text-center"
              >
                Compare SEO vs AEO vs GEO
              </Link>
            </div>
          </div>
        </section>

        {/* Visual Architectural Flow Section (Requested by User) */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How the Three Engines Work Together
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each discipline addresses a distinct layer of discovery in modern digital search.
            </p>
          </div>

          {/* Visual Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1: SEO */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-blue-500/30 text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Foundation</span>
                <h3 className="text-lg font-bold text-white">SEO</h3>
              </div>
              <div className="flex justify-center text-blue-400">
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </div>
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300 font-bold text-xs">
                Search Visibility
              </div>
              <p className="text-xs text-slate-400 leading-relaxed text-left">
                Technical crawling, indexability, metadata, speed, and link architecture form the base data layer for all search engines.
              </p>
            </div>

            {/* Step 2: AEO */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-purple-500/30 text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Extraction</span>
                <h3 className="text-lg font-bold text-white">AEO</h3>
              </div>
              <div className="flex justify-center text-purple-400">
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </div>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 font-bold text-xs">
                Answer Visibility
              </div>
              <p className="text-xs text-slate-400 leading-relaxed text-left">
                Structured Q&amp;A, concise definitions, and authoritative content formatting earn source citations inside AI answers.
              </p>
            </div>

            {/* Step 3: GEO */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-amber-500/30 text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Recommendation</span>
                <h3 className="text-lg font-bold text-white">GEO</h3>
              </div>
              <div className="flex justify-center text-amber-400">
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 font-bold text-xs">
                Generative Search Visibility
              </div>
              <p className="text-xs text-slate-400 leading-relaxed text-left">
                Entity consistency, multi-engine parity, and commercial comparison readiness secure top recommendations in conversational discovery.
              </p>
            </div>
          </div>

          {/* Unified Platform Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-indigo-500/40 text-center space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Combined in One Operating System
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Zobay Rank AI Search Optimization
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Instead of paying for disjointed tools, Zobay Rank provides unified crawling telemetry, prompt tracking, and generative optimization in one dashboard.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions About AI Search
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Insights on adapting your brand's search strategy for LLMs and generative engines.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-b from-indigo-950/20 to-slate-950 border-t border-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Win Across Search &amp; AI?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Test your website crawlability, trace AI citations, and unlock generative search recommendations today.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Start Free AI Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
