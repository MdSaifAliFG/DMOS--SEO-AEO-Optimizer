import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Cpu,
  ShieldCheck,
  Bot,
  Globe,
  TrendingUp,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Zobay Rank Blog | Search, AEO & GEO Research",
  description:
    "Authoritative research, guides, and engineering updates on SEO crawling, Answer Engine Optimization, and Generative Engine Optimization.",
  path: "/blog",
  keywords: [
    "Zobay Rank Blog",
    "AEO Research",
    "GEO Optimization Blog",
    "AI Search Articles",
    "Technical SEO Guides",
  ],
});

const ARTICLES = [
  {
    slug: "how-ai-answer-engines-choose-sources",
    title: "How AI Answer Engines Choose Which Websites to Cite as Sources",
    desc: "A technical investigation into RAG retrieval, citation scoring, and how ChatGPT and Perplexity select web sources to cite in real time.",
    category: "AEO Intelligence",
    date: "Sep 15, 2026",
    readTime: "6 min read",
  },
  {
    slug: "technical-seo-checklist-for-ai-crawlers",
    title: "The Technical SEO Checklist for AI Crawlers and LLM Agents",
    desc: "Essential technical checklist to ensure your website is crawlable, fast, and indexable for both traditional bots and modern AI scraper agents.",
    category: "Technical SEO",
    date: "Sep 10, 2026",
    readTime: "7 min read",
  },
  {
    slug: "understanding-8-factor-geo-score",
    title: "Understanding the 8-Factor GEO Score in Generative Search",
    desc: "A deep dive into Zobay Rank's proprietary 8-factor Generative Engine Optimization diagnostic framework and brand recommendation signals.",
    category: "GEO Optimization",
    date: "Sep 05, 2026",
    readTime: "8 min read",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
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
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Research, Engineering &amp; Industry Insights</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Search &amp; AI Intelligence <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Research Blog
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              In-depth research on search algorithms, crawler mechanics, prompt tracking, AI citations, and generative visibility.
            </p>

            {/* Direct Answer Box */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>DIRECT ANSWER: WHAT DOES ZOBAY RANK RESEARCH?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank Research</strong> publishes empirical investigations into website crawlability, large language model citation triggers, knowledge graph entity consistency, and multi-turn recommendation behaviors across ChatGPT, Perplexity, Google Gemini, and Claude.
              </p>
            </div>

            {/* Research Stats Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">3</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Research Disciplines</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Peer-Verified Data</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">Real-Time</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">AI Model Experiments</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">Zero</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Hallucinations</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Featured Articles Grid)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Featured Publications</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Latest Engineering &amp; Research Articles
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Empirical findings, step-by-step methodologies, and architectural blueprints written by our core engineering team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ARTICLES.map((art) => (
                <Link
                  key={art.slug}
                  href={`/blog/${art.slug}`}
                  className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {art.category}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {art.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{art.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Key Research Focus Areas)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Primary Research Vectors</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Our Core Engineering Focus
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                How Zobay Rank researchers dissect modern search algorithms to build transparent, deterministic optimization tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">RAG &amp; Vector Retrieval</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Investigating how AI search engines parse, vectorize, and chunk web documents during multi-turn retrieval-augmented generation.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Crawler Concurrency &amp; Health</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Benchmarking high-throughput BFS crawlers to optimize crawl budgets, eliminate redirect loops, and ensure rapid indexation.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Generative Recommendation Parity</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Quantifying brand sentiment and recommendation variance across ChatGPT, Perplexity, Google Gemini, and Claude.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Editorial Standards)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Editorial Integrity</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Our Research Standards
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Zero sponsored puff pieces, zero fabricated claims. Grounded strictly in empirical data and verifiable test results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Empirical Grounding</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every statistic and claim is backed by real crawl outputs, actual AI response transcripts, and published RFC specifications.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Zero Fabrications</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We never publish fake case studies, synthesized star ratings, or speculative SEO promises. Only reproducible, actionable insights.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Open Methodologies</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We document our prompt configurations, test parameters, and scoring formulas transparently so engineering teams can verify results.
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
              Turn Research into Organic Market Share
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
