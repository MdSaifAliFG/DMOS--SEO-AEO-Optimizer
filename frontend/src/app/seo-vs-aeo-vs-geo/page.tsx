import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
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
];

export default function SeoVsAeoVsGeoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "SEO vs AEO vs GEO", url: "/seo-vs-aeo-vs-geo" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Objective Search Optimization Guide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              SEO vs AEO vs GEO: What's the Difference?
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Understand the distinct roles, metrics, and synergies between Search Engine Optimization, Answer Engine Optimization, and Generative Engine Optimization.
            </p>

            {/* Direct Answer Block for AEO/GEO Extractability */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Executive Summary: How SEO, AEO, and GEO Differ</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>SEO (Search Engine Optimization)</strong> targets traditional SERP blue links by optimizing crawler accessibility, indexability, metadata, and link authority. <strong>AEO (Answer Engine Optimization)</strong> targets conversational AI responses by structuring answers so engines cite your domain as a factual source. <strong>GEO (Generative Engine Optimization)</strong> targets generative discovery by solidifying entity consistency, cross-engine parity, and commercial recommendation strength. They do not replace one another; they build directly on each other.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Side-by-Side Comparison Matrix */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Side-by-Side Comparison Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear breakdown of target surfaces, primary goals, core metrics, and key tactics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 w-1/4">Dimension</th>
                  <th className="p-4 w-1/4 text-blue-400">SEO (Search Engine)</th>
                  <th className="p-4 w-1/4 text-purple-400">AEO (Answer Engine)</th>
                  <th className="p-4 w-1/4 text-amber-400">GEO (Generative Engine)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                <tr>
                  <td className="p-4 font-bold text-white bg-slate-950/40">Target Surface</td>
                  <td className="p-4">Traditional SERP blue links &amp; snippet boxes (Google, Bing).</td>
                  <td className="p-4">Conversational answer syntheses (ChatGPT, Perplexity, Gemini).</td>
                  <td className="p-4">Multi-turn generative dialogs &amp; commercial recommendation engines.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white bg-slate-950/40">Primary Goal</td>
                  <td className="p-4">Organic rankings, crawler indexing, and direct click-through traffic.</td>
                  <td className="p-4">Direct answer inclusion and authoritative source URL citations.</td>
                  <td className="p-4">Top commercial product recommendations and brand entity authority.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white bg-slate-950/40">Key Metrics</td>
                  <td className="p-4">Crawl depth, HTTP codes, organic impressions, CTR, keyword rank.</td>
                  <td className="p-4">Citation frequency, prompt coverage rate, answer sentiment.</td>
                  <td className="p-4">8-factor GEO score, recommendation position, cross-engine parity.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white bg-slate-950/40">Core Optimization</td>
                  <td className="p-4">Speed, canonicals, robots.txt, title tags, heading structure, links.</td>
                  <td className="p-4">Concise Q&amp;A summaries, bite-sized definitions, authoritative data.</td>
                  <td className="p-4">Entity consistency across knowledge graphs, third-party co-citations, llms.txt.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white bg-slate-950/40">Crawler User-Agents</td>
                  <td className="p-4">`Googlebot`, `Bingbot`, `Slurp`.</td>
                  <td className="p-4">`GPTBot`, `PerplexityBot`, `ClaudeBot`.</td>
                  <td className="p-4">`Google-Extended`, `Applebot-Extended`, `CCBot`.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Synergy Explanation */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why the Three Approaches Complement Each Other
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Modern digital search is an interconnected ecosystem. If a website lacks technical crawlability (SEO), AI models cannot index it. If it lacks clear, extractable answers (AEO), AI engines will cite competitors instead. If it lacks entity authority and recommendation readiness (GEO), the AI will not suggest it during purchasing conversations.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/seo-optimization"
                className="px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs hover:bg-blue-500/20 transition-colors"
              >
                Learn About SEO Optimization →
              </Link>
              <Link
                href="/aeo-optimization"
                className="px-5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-xs hover:bg-purple-500/20 transition-colors"
              >
                Learn About AEO Optimization →
              </Link>
              <Link
                href="/geo-optimization"
                className="px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition-colors"
              >
                Learn About GEO Optimization →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400 font-mono">Q:</span>
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
        <section className="py-16 bg-gradient-to-b from-blue-950/20 to-slate-950 border-t border-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Unified SEO, AEO &amp; GEO in One Platform
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Zobay Rank gives your team deterministic crawling, AI prompt tracking, and generative optimization from a single dashboard.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Start Free Trial</span>
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
