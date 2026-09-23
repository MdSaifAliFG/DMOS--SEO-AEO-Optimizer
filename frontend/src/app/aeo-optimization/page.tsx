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
  Cpu,
  Layers,
  Check,
  Network,
  Activity,
  Compass,
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
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#7c3aed] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "AEO Optimization", url: "/aeo-optimization" },
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
          {/* Ambient Purple / Fuchsia Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>AI Answer Engine Intelligence &amp; Visibility</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Answer Engine Optimization &amp; <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300">
                AI Citation Intelligence
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Measure, monitor, and maximize how your brand appears across conversational AI answers on ChatGPT, Perplexity, Gemini, and Claude with automated citation audits.
            </p>

            {/* Direct Answer Box for LLM Extractability */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-purple-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-purple-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>DIRECT ANSWER: WHAT IS ANSWER ENGINE OPTIMIZATION (AEO)?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Answer Engine Optimization (AEO)</strong> is the systematic practice of structuring, refining, and citing digital content to maximize the likelihood that artificial intelligence models (such as ChatGPT, Perplexity, and Gemini) extract, cite, and recommend your business in direct conversational answers.
              </p>
            </div>

            {/* Live Model Tracking Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-purple-400">ChatGPT</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Search &amp; 4o Grounding</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">Perplexity</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Sonar Engine Citations</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-fuchsia-400">Gemini</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">AI Overviews Grounding</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-violet-400">Claude</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Sonnet Synthesis</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Analyze AI Visibility</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Core AEO Modules)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs sm:text-sm font-semibold">
                <Target className="w-4 h-4 text-purple-600" />
                <span>Conversational Dominance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Essential AEO Analysis Modules
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Actionable telemetry to transform conversational AI searches into predictable brand traffic, verifiable citations, and organic customer referrals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-purple-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Buyer Prompt Tracking</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Monitor high-intent commercial, comparison, and informational queries submitted by prospective customers across ChatGPT, Perplexity, Gemini, and Claude in real time.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-purple-600 font-semibold">
                  <span>Intent Clustering</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Quote className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Citation Extraction</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Extract the exact source URLs cited by AI answer models, track your domain citation rate, and identify authoritative third-party publications referencing your industry.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Footnote &amp; Link Mapping</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-fuchsia-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Knowledge Entities</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Audit brand, product, and leadership entities recognized by answer engines. Validate entity attributes and topical associations across global knowledge bases.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-fuchsia-600 font-semibold">
                  <span>Wikidata &amp; Schema Alignment</span>
                  <CheckCircle2 className="w-4 h-4 text-fuchsia-500" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-violet-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Answer Visibility Analytics</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Track how often your brand is mentioned, sentiment orientation, whether your product is recommended as a top option, and how visibility shifts across model releases.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-violet-600 font-semibold">
                  <span>Sentiment &amp; Recommendation Share</span>
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                </div>
              </div>

              {/* Card 5 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-pink-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Content &amp; Citation Gaps</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Discover high-value queries where competitors earn citations while your brand is omitted. Receive concrete editorial guidance to bridge the content gap.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-pink-600 font-semibold">
                  <span>Gap Remediation Steps</span>
                  <CheckCircle2 className="w-4 h-4 text-pink-500" />
                </div>
              </div>

              {/* Card 6 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-purple-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Competitor AI Benchmarks</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Benchmark your AI presence side-by-side against direct competitors across leading engines to protect and expand organic answer market share.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-purple-600 font-semibold">
                  <span>Competitive Intelligence</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Answer Engine Coverage Radar)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs sm:text-sm font-semibold">
                <Compass className="w-4 h-4" />
                <span>Multi-Platform Radar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Answer Engine Tracking Coverage
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Real-time query execution, live synthesis analysis, and citation verification across the world's leading generative AI platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ChatGPT Search */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                  01
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">ChatGPT Search</h3>
                  <span className="text-xs text-purple-400 font-mono">OpenAI GPT-4o</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluates web search grounding, interactive citation pill placement, and direct conversational brand recommendations.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">Citations: Interactive Pills</div>
              </div>

              {/* Perplexity AI */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-400/50 transition-all space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                  02
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">Perplexity AI</h3>
                  <span className="text-xs text-indigo-400 font-mono">Sonar Search Engine</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Traces numerical citation footnotes, multi-source knowledge synthesis, and structured domain inclusion in Perplexity Pages.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">Citations: Footnote Links</div>
              </div>

              {/* Google Gemini */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-fuchsia-400/50 transition-all space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center font-bold">
                  03
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">Google Gemini</h3>
                  <span className="text-xs text-fuchsia-400 font-mono">AI Overviews Grounding</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tracks inclusion in Google AI Overviews, entity verification in the Google Knowledge Graph, and prominent carousel source cards.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">Citations: Sourced Carousels</div>
              </div>

              {/* Claude Search */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-violet-400/50 transition-all space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold">
                  04
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">Claude Search</h3>
                  <span className="text-xs text-violet-400 font-mono">Anthropic Sonnet</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Measures deep technical and analytical synthesis, prompt context extraction, and high-integrity brand attribution.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">Citations: Neutral Reference Text</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Citation Playbook)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <Network className="w-4 h-4 text-purple-600" />
                <span>Citation Blueprint</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                The 3-Tier Blueprint to Win AI Citations
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Architectural rules that make your content effortless for large language models to parse, extract, and cite as verified ground truth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-purple-600/30">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900">Factual Density &amp; Definition Boxes</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  LLMs prioritize self-contained 40–60 word declarative answer blocks placed directly beneath `H2` question headers. Avoid marketing filler and state verifiable facts first.
                </p>
                <div className="p-3 rounded-xl bg-purple-50 text-purple-800 text-xs font-mono">
                  Schema: FAQPageJsonLd + DefinedTerm
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-purple-600/30">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900">Entity Disambiguation &amp; Linking</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Anchor your organization and products with machine-readable `sameAs` entity links pointing to recognized authoritative nodes like Wikidata, Crunchbase, and GitHub.
                </p>
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-mono">
                  Schema: OrganizationJsonLd sameAs
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-purple-600/30">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900">Co-Citation &amp; Unbiased Verification</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Earn contextual mentions in third-party industry roundups, benchmark repositories, and review directories where answer engine web retrieval crawlers gather comparative data.
                </p>
                <div className="p-3 rounded-xl bg-fuchsia-50 text-fuchsia-800 text-xs font-mono">
                  Strategy: Neutral Third-Party Grounding
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK SECTION (AEO FAQ)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs sm:text-sm font-semibold">
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions About AEO
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Everything you need to know about answer engine citations, entities, and prompt tracking.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-purple-500/40 transition-colors"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                    <span className="text-purple-400 font-mono text-xs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
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
        <section className="py-20 sm:py-24 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Start Tracking Your Brand Across AI Answers
            </h2>
            <p className="text-sm sm:text-lg text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Monitor customer prompts, verify source citations, and capture organic market share in AI search.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Analyze AI Visibility</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-purple-700/60 hover:bg-purple-700 border border-white/20 text-white font-semibold text-sm transition-colors text-center"
              >
                View AEO Tracking Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
