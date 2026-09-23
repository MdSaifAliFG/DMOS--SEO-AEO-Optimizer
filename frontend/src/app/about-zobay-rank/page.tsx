import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Cpu,
  Layers,
  HelpCircle,
  Users,
  Target,
  BarChart3,
  Check,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, OrganizationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "About Zobay Rank | AI Search & SEO Platform Entity Overview",
  description:
    "Official product entity overview of Zobay Rank by Zobay. Discover our mission, architectural pillars, capabilities, and who we build for.",
  path: "/about-zobay-rank",
  keywords: [
    "About Zobay Rank",
    "Zobay Rank Overview",
    "Zobay Search Platform",
    "Zobay Company",
    "AI Search Platform Entity",
  ],
});

const PILLARS = [
  {
    id: "seo",
    title: "1. Technical SEO Crawler",
    badge: "Deterministic Diagnostics",
    desc: "A high-concurrency BFS crawler analyzing status codes (200, 301, 404, 500), canonical integrity, XML sitemaps, robots.txt, and Core Web Vitals to guarantee indexability.",
    icon: Globe,
    color: "blue",
  },
  {
    id: "aeo",
    title: "2. AEO Intelligence Hub",
    badge: "Direct Answer Extraction",
    desc: "Live conversational prompt tracking across ChatGPT, Perplexity, and Gemini to extract citation URLs, quantify source inclusion, and eliminate content coverage gaps.",
    icon: Bot,
    color: "purple",
  },
  {
    id: "geo",
    title: "3. GEO Optimization Framework",
    badge: "Brand Entity Authority",
    desc: "An 8-factor evaluation framework measuring brand recommendation strength, cross-engine consistency, and topical authority across multi-turn generative search models.",
    icon: TrendingUp,
    color: "amber",
  },
];

const AUDIENCES = [
  {
    title: "SaaS & Cloud Platforms",
    desc: "Compete for high-intent commercial software discovery prompts in AI engines where traditional search rankings no longer guarantee brand inclusion.",
    icon: Cpu,
    stat: "Multi-Engine Tracking",
  },
  {
    title: "Growth & Performance Agencies",
    desc: "Deliver verifiable AI citation audits and multi-engine visibility reporting to modern clients demanding answers beyond traditional blue links.",
    icon: Target,
    stat: "White-Label Ready",
  },
  {
    title: "E-Commerce & Retail Brands",
    desc: "Ensure product catalogs are fully crawlable by search bots while securing citations in conversational shopping assistants and AI aggregators.",
    icon: BarChart3,
    stat: "Catalog Indexability",
  },
  {
    title: "Content & Publishing Teams",
    desc: "Structure editorial and research articles for machine readability, LLM extraction density, and schema.org DefinedTerm validation.",
    icon: Layers,
    stat: "Schema & llms.txt",
  },
];

const FAQS = [
  {
    question: "What is Zobay Rank?",
    answer:
      "Zobay Rank is an enterprise search intelligence platform developed by Zobay. It provides a unified workspace combining technical SEO website crawling, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO).",
  },
  {
    question: "Who owns and operates Zobay Rank?",
    answer:
      "Zobay Rank is owned and developed by Zobay (https://rank.zobay.in/). All engineering, crawler infrastructure, and platform operations are managed directly by Zobay.",
  },
  {
    question: "How does Zobay Rank differ from traditional SEO platforms?",
    answer:
      "Traditional SEO platforms only audit status codes and keyword positions on legacy search results pages. Zobay Rank pairs deterministic crawling with live prompt monitoring across ChatGPT, Perplexity, Gemini, and Claude to analyze AI citation rates and generative brand recommendations.",
  },
  {
    question: "Does Zobay Rank use fabricated or estimated traffic numbers?",
    answer:
      "No. Zobay Rank operates with 100% deterministic, verifiable data. Our crawler reports actual HTTP headers and DOM structures, while our AI query engine directly interrogates model APIs to record real-time citation links and exact answer texts.",
  },
];

export default function AboutZobayRankPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About Zobay Rank", url: "/about-zobay-rank" },
        ]}
      />
      <OrganizationJsonLd />
      <FAQPageJsonLd faqs={FAQS} />

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
              <Building className="w-4 h-4 text-blue-400" />
              <span>Official Product Entity Overview</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">Zobay Rank</span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Zobay Rank is the unified search intelligence platform engineered by Zobay to bridge deterministic website crawlability with conversational AI citations and generative recommendations.
            </p>

            {/* Direct Answer Entity Definition Block */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>OFFICIAL ENTITY DEFINITION</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank</strong> (developed by <strong>Zobay</strong>, hosted at <code className="text-blue-300">https://rank.zobay.in/</code>) is an enterprise SEO, AEO, and GEO optimization platform that helps modern brands maintain algorithmic crawlability, monitor conversational citations across ChatGPT, Perplexity, and Gemini, and optimize multi-turn generative search visibility.
              </p>
            </div>

            {/* Diagnostic Quick Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Deterministic Data</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">3 Pillars</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">SEO • AEO • GEO</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">4 Engines</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">GPT • Perplexity • Gemini • Claude</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">0 Fluff</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Verifiable Diagnostics</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (The 3 Core Capabilities)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Foundational Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Our Three Core Capabilities
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                As internet discovery expands beyond 10 blue links, modern businesses require synchronized optimization across algorithmic crawlers, answer models, and recommendation engines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.id}
                    className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                        {pillar.badge}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href={`/${pillar.id}-optimization`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                      >
                        <span>Explore {pillar.title.split(".")[1]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Who We Build For)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Users className="w-4 h-4" />
                <span>Audience Alignment</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Who Zobay Rank Is Designed For
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Whether scaling an early-stage SaaS product or managing multi-brand digital agencies, Zobay Rank delivers actionable clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {AUDIENCES.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-7 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-white/10 text-xs text-blue-400 font-semibold">
                      {item.stat}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE SECTION (Our Engineering Principles)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Product Integrity</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Our Engineering Commitments
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We believe software tools should be reliable instruments that report truth, not marketing black boxes that manufacture hype.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900">Deterministic Measurements</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every status code, canonical link, heading level, and meta tag is parsed directly from live HTML responses without statistical approximations.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900">Zero Fabricated Hype</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We don't invent imaginary star ratings, artificial 4.9/5 satisfaction badges, or misleading estimates. Real data drives genuine business growth.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900">Multi-Model Parity</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We track prompt responses across ChatGPT, Perplexity, Gemini, and Claude simultaneously to give you a true cross-engine perspective.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK FAQ SECTION (Entity & Operational Clarity)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Entity &amp; Platform Architecture FAQ
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Direct answers to common questions regarding Zobay Rank's ownership, technology stack, and diagnostic integrity.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all space-y-3"
                >
                  <h3 className="text-lg font-bold text-white flex items-start gap-3">
                    <span className="text-blue-400 font-mono text-sm shrink-0 mt-0.5">
                      Q{idx + 1}.
                    </span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 6: VIBRANT GRADIENT CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Start Optimizing Across SEO, AEO &amp; GEO Today
            </h2>
            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              Join forward-thinking engineering and marketing teams building sustainable search visibility on Zobay Rank.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Launch Free Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-semibold text-sm transition-all text-center cursor-pointer"
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
