import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Brain,
  Quote,
  Eye,
  FileCheck,
  Search,
  ExternalLink,
  Target,
  Zap,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, SoftwareApplicationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "AEO Optimization & AI Answer Visibility | Zobay Rank",
  description:
    "Measure and improve how your brand appears in AI answers with AEO analysis, citations, entities and answer visibility tracking.",
  path: "/aeo-optimization",
  keywords: [
    "AEO Optimization",
    "Answer Engine Optimization",
    "AI Answer Visibility",
    "AI Citations Tracking",
    "Knowledge Graph Entities",
    "Prompt Tracking",
    "ChatGPT Visibility",
    "Perplexity Optimization",
  ],
});

const faqs = [
  {
    question: "What is Answer Engine Optimization (AEO)?",
    answer:
      "AEO (Answer Engine Optimization) is the process of optimizing content so that AI answer models—such as ChatGPT, Perplexity, Google Gemini, and Claude—cite, mention, and recommend your brand when answering conversational buyer queries.",
  },
  {
    question: "How does Zobay Rank track AI answer citations?",
    answer:
      "Zobay Rank submits real industry buyer prompts to leading answer engines, extracts all cited source URLs and linked references from the generated responses, and benchmarks your citation frequency against competitors.",
  },
  {
    question: "What are AI content and citation gaps?",
    answer:
      "A citation gap occurs when AI answer models cite authoritative third-party articles or competitors for target queries, while omitting your domain. Zobay Rank identifies these gaps and provides concrete content formatting steps to earn citations.",
  },
  {
    question: "How do knowledge graph entities influence AEO visibility?",
    answer:
      "AI answer engines rely on recognized entities (brands, products, executives, key terminology) to verify factual authority. Zobay Rank validates that your brand entity attributes are consistent across search graphs and AI training corpora.",
  },
];

export default function AeoOptimizationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "AEO Optimization", url: "/aeo-optimization" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wide">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Answer Engine Intelligence &amp; Visibility</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Answer Engine Optimization
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Measure and improve how your brand appears in AI answers with AEO analysis, citations, entities and answer visibility tracking.
            </p>

            {/* Direct Answer Block for AEO/GEO Extractability */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-purple-950/30 border border-purple-900/60 text-left space-y-2 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Direct Answer: What is Answer Engine Optimization (AEO)?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Answer Engine Optimization (AEO)</strong> is the systematic practice of structuring, refining, and citing digital content to maximize the likelihood that artificial intelligence models (such as ChatGPT, Perplexity, and Gemini) extract, cite, and recommend your business in direct conversational answers.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Analyze AI Visibility</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors text-center"
              >
                View AEO Tracking Plans
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Pillar Grid */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Essential AEO Analysis Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Actionable telemetry to transform conversational AI searches into predictable brand traffic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Buyer Prompt Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor high-intent commercial and informational queries submitted by prospective customers across ChatGPT, Perplexity, Gemini, and Claude.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Quote className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Citation Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extract the exact source URLs cited by AI answer models, track your domain citation rate, and identify authoritative publications referencing your space.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Knowledge Entities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audit brand, product, and leadership entities recognized by answer engines. Validate entity attributes and topical associations across knowledge bases.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Answer Visibility Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track how often your brand is mentioned, sentiment orientation, whether your product is recommended as a top option, and how visibility shifts over time.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Content &amp; Citation Gaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover queries where competitors earn citations while your brand is omitted. Receive concrete editorial guidance to bridge the content gap.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Competitor AI Benchmarks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Benchmark your AI presence side-by-side against direct competitors across leading engines to protect and expand organic answer market share.
              </p>
            </div>
          </div>
        </section>

        {/* Engine Coverage Showcase */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Answer Engine Tracking Coverage
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Real-time query submission and citation verification across leading AI platforms.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-sm font-bold text-white block">ChatGPT Search</span>
                <span className="text-[11px] text-slate-400">OpenAI GPT-4o</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-sm font-bold text-white block">Perplexity AI</span>
                <span className="text-[11px] text-slate-400">Sonar Search Engine</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-sm font-bold text-white block">Google Gemini</span>
                <span className="text-[11px] text-slate-400">AI Overviews Grounding</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-sm font-bold text-white block">Claude Search</span>
                <span className="text-[11px] text-slate-400">Anthropic Sonnet</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions About AEO
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to know about answer engine citations, entities, and prompt tracking.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="text-purple-400 font-mono">Q:</span>
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
        <section className="py-16 bg-gradient-to-b from-purple-950/20 to-slate-950 border-t border-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Start Tracking Your Brand Across AI Answers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Monitor customer prompts, verify source citations, and capture organic market share in AI search.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <span>Analyze AI Visibility</span>
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
