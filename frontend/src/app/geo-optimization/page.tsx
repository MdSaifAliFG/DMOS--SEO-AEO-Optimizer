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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "GEO Optimization", url: "/geo-optimization" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Generative Engine Optimization (GEO)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              GEO Optimization for AI Search
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Improve generative search visibility, brand recommendations, citations and entity understanding with Zobay Rank GEO optimization.
            </p>

            {/* Direct Answer Block for AEO/GEO Extractability */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-amber-950/30 border border-amber-900/60 text-left space-y-2 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Direct Answer: What is Generative Engine Optimization (GEO)?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Generative Engine Optimization (GEO)</strong> is the process of structuring, validating, and establishing authoritative digital presence so that generative search experiences (such as Perplexity, ChatGPT Search, Gemini, and Claude) understand your brand entities, cite your publications, and confidently recommend your business when prospective buyers evaluate options.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore GEO Optimization</span>
                <ArrowRight className="w-4 h-4" />
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

        {/* 8-Factor GEO Framework Section */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The 8-Factor GEO Diagnostic Framework
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Deterministic scoring criteria evaluating your brand's authority, recommendation readiness, and entity integrity in generative models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Factor 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-white">AI Visibility Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Frequency and prominence of brand mentions across conversational and transactional multi-turn prompts.
              </p>
            </div>

            {/* Factor 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Recommendation Strength</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whether the AI highlights your product as a top recommendation, secondary alternative, or omits it entirely.
              </p>
            </div>

            {/* Factor 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Citation Authority</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Weight and trust distribution of third-party domains citing your brand in AI model source cards.
              </p>
            </div>

            {/* Factor 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <h3 className="text-sm font-bold text-white">Entity Understanding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consistency of company name, product offerings, executive names, and pricing across public knowledge bases.
              </p>
            </div>

            {/* Factor 5 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                05
              </div>
              <h3 className="text-sm font-bold text-white">Content Extractability</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Presence of structured definitions, bulleted summaries, schema markup, and bite-sized factual answers.
              </p>
            </div>

            {/* Factor 6 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                06
              </div>
              <h3 className="text-sm font-bold text-white">Technical AI Accessibility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unblocked crawler access in robots.txt for AI agents (`GPTBot`, `PerplexityBot`) and fast server response times.
              </p>
            </div>

            {/* Factor 7 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                07
              </div>
              <h3 className="text-sm font-bold text-white">Cross-Engine Parity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluation of parity across ChatGPT, Perplexity, Claude, and Gemini to prevent blind spots in specific models.
              </p>
            </div>

            {/* Factor 8 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                08
              </div>
              <h3 className="text-sm font-bold text-white">Commercial Discovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Presence when prospective customers enter comparison prompts like "Best [industry] software for [use case]".
              </p>
            </div>
          </div>
        </section>

        {/* Action Center Preview */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Deterministic GEO Action Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Every identified gap translates into prioritized developer, content, and schema action items with concrete examples.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Priority 1</span>
                <h3 className="text-sm font-bold text-white">Schema &amp; Entity Alignment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Inject missing Organization, WebSite, and DefinedTerm JSON-LD schemas to solidify entity identification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Priority 2</span>
                <h3 className="text-sm font-bold text-white">Bite-Sized Extractable Answers</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Structure key comparison pages with clear Q&amp;A blocks and definition summaries that LLMs can extract verbatim.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Priority 3</span>
                <h3 className="text-sm font-bold text-white">Crawl Accessibility Directives</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ensure robots.txt permits search bots and provide llms.txt to accelerate knowledge graph indexing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions About GEO
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear answers regarding generative search visibility, brand recommendations, and citations.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono">Q:</span>
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
        <section className="py-16 bg-gradient-to-b from-amber-950/20 to-slate-950 border-t border-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Optimize Your Brand for Generative Discovery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Evaluate your 8-factor GEO score, benchmark against competitors, and earn recommendations in modern AI search.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <span>Explore GEO Optimization</span>
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
