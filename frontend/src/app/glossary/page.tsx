import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Globe,
  Bot,
  TrendingUp,
  Layers,
  Compass,
  Cpu,
  Bookmark,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO, AEO & GEO Glossary | Zobay Rank",
  description:
    "Definitive glossary of search engine optimization, answer engine optimization, and generative engine optimization terms.",
  path: "/glossary",
  keywords: [
    "SEO Glossary",
    "AEO Terms",
    "GEO Dictionary",
    "AI Search Definitions",
    "Technical SEO Terms",
  ],
});

const GLOSSARY_INDEX = [
  {
    slug: "seo",
    term: "SEO (Search Engine Optimization)",
    desc: "Optimizing website crawlability, technical health, and content relevance for algorithmic search engines.",
    tag: "Core SEO",
    category: "Technical Crawling",
  },
  {
    slug: "aeo",
    term: "AEO (Answer Engine Optimization)",
    desc: "Structuring content so AI models (ChatGPT, Perplexity) cite and extract your brand in conversational answers.",
    tag: "Answer Engines",
    category: "AI Citations",
  },
  {
    slug: "geo",
    term: "GEO (Generative Engine Optimization)",
    desc: "Optimizing brand entity authority and multi-turn recommendation strength in generative search experiences.",
    tag: "Generative AI",
    category: "Recommendations",
  },
  {
    slug: "ai-search",
    term: "AI Search",
    desc: "Modern search engines powered by LLMs and RAG that synthesize conversational answers in real time.",
    tag: "AI Search",
    category: "Retrieval Systems",
  },
  {
    slug: "technical-seo",
    term: "Technical SEO",
    desc: "Server, status code, canonical, and DOM optimizations that facilitate search engine spider traversal.",
    tag: "Technical",
    category: "Infrastructure",
  },
  {
    slug: "entity-seo",
    term: "Entity SEO",
    desc: "Optimizing content around verified real-world concepts, organizations, and products in knowledge graphs.",
    tag: "Knowledge Graphs",
    category: "Semantics",
  },
  {
    slug: "citation",
    term: "AI Citation",
    desc: "Direct URL and footnote attributions provided by AI models acknowledging original content sources.",
    tag: "Citations",
    category: "Attribution",
  },
  {
    slug: "ai-visibility",
    term: "AI Visibility",
    desc: "Quantitative score measuring brand inclusion frequency, sentiment, and recommendation position in AI models.",
    tag: "Analytics",
    category: "Scoring",
  },
];

export default function GlossaryIndexPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Glossary", url: "/glossary" },
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
              <span>Search &amp; AI Intelligence Terms</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              SEO, AEO &amp; GEO <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Authoritative Glossary
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore concise definitions, simple explanations, technical architecture, and real-world examples for modern search concepts.
            </p>

            {/* Direct Answer Box */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>DIRECT ANSWER: WHAT IS THE ZOBAY RANK GLOSSARY?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank Search &amp; AI Glossary</strong> is a verified, standardized reference defining the concepts governing traditional search crawling, conversational answer engines (ChatGPT, Perplexity), and generative engine optimization (GEO). Every term includes machine-readable schema.org definitions and architectural specifications.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">8</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Core Definitions</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">3 Pillars</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">SEO • AEO • GEO</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">Schema.org</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">DefinedTerm JSON-LD</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Deterministic Data</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Glossary Cards Grid)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span>Standardized Terminology</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Search &amp; AI Intelligence Term Directory
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Click any term to view its formal definition, simple analogy, technical architecture, and verified real-world examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {GLOSSARY_INDEX.map((item) => (
                <Link
                  key={item.slug}
                  href={`/glossary/${item.slug}`}
                  className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {item.tag}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.term}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>Full Definition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Why Standardized Terms Matter)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Compass className="w-4 h-4" />
                <span>Knowledge Graph Foundations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Why Standardized Taxonomy Powers AI Extraction
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Large language models rely on unambiguous entity disambiguation and structured terms to synthesize factual citations without hallucination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">DefinedTerm Schema Markup</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every glossary page emits machine-readable Schema.org DefinedTerm JSON-LD with exact terms, definitions, and parent inDefinedTermSet pointers.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Direct Factual Extractability</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Definitions are intentionally structured into 40–60 word declarative sentences so retrieval-augmented generation (RAG) models quote them verbatim.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Entity Reconciliation</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Connects emerging AI search terminology to recognized semantic web concepts in Wikidata, ensuring consistent representation across model releases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (SEO vs AEO vs GEO Quick Taxonomy)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>The 3 Pillars of Modern Search</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                The Unified Search Taxonomy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The foundational tripartite structure that powers Zobay Rank's optimization engine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link
                href="/glossary/seo"
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-400 transition-all space-y-4 block group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  SEO: Search Engine Optimization
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Focuses on traditional search crawler accessibility, status codes, canonicals, metadata, and link graphs for blue-link SERP rank.
                </p>
                <div className="pt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span>Explore SEO definition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/glossary/aeo"
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-purple-400 transition-all space-y-4 block group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  AEO: Answer Engine Optimization
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Focuses on structuring answers so conversational models (ChatGPT, Perplexity) extract and cite your website as an authoritative source.
                </p>
                <div className="pt-2 text-xs font-bold text-purple-600 flex items-center gap-1">
                  <span>Explore AEO definition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/glossary/geo"
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-amber-400 transition-all space-y-4 block group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shadow-lg shadow-amber-600/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  GEO: Generative Engine Optimization
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Focuses on brand entity authority, recommendation strength, and cross-engine parity across multi-turn generative search models.
                </p>
                <div className="pt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                  <span>Explore GEO definition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Put Search &amp; AI Intelligence into Practice
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Audit your website's technical health and measure real-time citation frequency across AI answer engines today.
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
