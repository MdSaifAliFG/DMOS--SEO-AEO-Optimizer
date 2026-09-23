import React from "react";
import Link from "next/link";
import {
  Building2,
  ShoppingBag,
  Briefcase,
  Rocket,
  Users,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Compass,
  Cpu,
  BarChart3,
  Bot,
  Globe,
  TrendingUp,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Industry Use Cases | Zobay Rank",
  description:
    "Discover how SaaS companies, e-commerce stores, agencies, startups, marketing teams, and enterprises use Zobay Rank for SEO, AEO, and GEO optimization.",
  path: "/use-cases",
  keywords: [
    "Zobay Rank Use Cases",
    "SaaS SEO AEO",
    "E-commerce Search Optimization",
    "Agency SEO Platform",
    "Startup AI Search",
    "Enterprise GEO Governance",
  ],
});

const USE_CASES_LIST = [
  {
    slug: "saas",
    title: "SaaS & Software",
    subtitle: "Protect Software Category Leadership",
    desc: "Win high-intent software recommendation prompts across ChatGPT, Perplexity, and Google AI Overviews with structured feature schemas.",
    icon: <Building2 className="w-6 h-6 text-blue-400" />,
    badge: "Software & Cloud",
    color: "blue",
  },
  {
    slug: "ecommerce",
    title: "E-Commerce & Retail",
    subtitle: "Win AI Product Recommendations",
    desc: "Eliminate faceted crawl waste and ensure conversational shopping assistants cite your product catalog, verified reviews, and stock.",
    icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />,
    badge: "Direct-to-Consumer",
    color: "emerald",
  },
  {
    slug: "agencies",
    title: "Digital Agencies",
    subtitle: "Deliver Unified Search Client Reports",
    desc: "Offer modern AI search audits, citation tracking, and white-label client reporting that demonstrate tangible search ROI.",
    icon: <Briefcase className="w-6 h-6 text-purple-400" />,
    badge: "Client Growth",
    color: "purple",
  },
  {
    slug: "startups",
    title: "High-Growth Startups",
    subtitle: "Outrank Incumbents in Generative Search",
    desc: "Establish early entity authority and outsmart legacy incumbents in conversational search without waiting years for backlinks.",
    icon: <Rocket className="w-6 h-6 text-amber-400" />,
    badge: "Rapid Scale",
    color: "amber",
  },
  {
    slug: "marketing-teams",
    title: "Marketing Teams",
    subtitle: "Data-Driven Search Content Strategy",
    desc: "Align your editorial calendar with real AI buyer prompts and bridge citation gaps where competitors are currently recommended.",
    icon: <Users className="w-6 h-6 text-pink-400" />,
    badge: "Content Intelligence",
    color: "pink",
  },
  {
    slug: "enterprise",
    title: "Enterprise Organizations",
    subtitle: "Global Search & AI Governance",
    desc: "Large-scale crawl diagnostics, multi-domain entity governance, and cross-engine parity monitoring across millions of enterprise URLs.",
    icon: <Building className="w-6 h-6 text-cyan-400" />,
    badge: "Governance & Scale",
    color: "cyan",
  },
];

export default function UseCasesDirectoryPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Use Cases", url: "/use-cases" },
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
              <span>Tailored Solutions by Industry</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Search &amp; AI Intelligence <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Industry Use Cases
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore how forward-thinking growth teams, agencies, and enterprises optimize technical health and capture organic traffic across search engines and conversational AI.
            </p>

            {/* Direct Answer Box */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>DIRECT ANSWER: HOW DOES ZOBAY RANK ADAPT BY INDUSTRY?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank Industry Solutions</strong> configure crawling depth, entity schema validations, and conversational prompt tracking to match the exact search dynamics of your sector—from high-intent B2B SaaS comparison queries to e-commerce catalog crawling and multi-client agency reporting.
              </p>
            </div>

            {/* Live Metrics Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">6</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Industry Playbooks</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Deterministic Audits</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-cyan-400">4</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">AI Engines Monitored</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">0–100</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Health &amp; GEO Scores</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run Free Industry Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors text-center"
              >
                View Plans &amp; Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Industry Playbooks Grid)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Sector Specialization</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Explore Industry Optimization Playbooks
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Select your industry vertical to inspect tailored crawl configurations, buyer prompt patterns, and citation gap strategies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {USE_CASES_LIST.map((item) => (
                <Link
                  key={item.slug}
                  href={`/use-cases/${item.slug}`}
                  className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {item.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">{item.subtitle}</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>View {item.title} Playbook</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Why Industry AI Optimization Matters)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Bot className="w-4 h-4" />
                <span>Search Intent Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                How Conversational AI Shifts Sector Discovery
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Why generic SEO strategies fail when prospective buyers switch from keyword search to conversational AI evaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">Multi-Turn Evaluation</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Buyers no longer type single keywords; they prompt LLMs with exact enterprise constraints: "Which tool integrates with Salesforce and costs under $5k/year?"
                </p>
                <div className="pt-2 text-xs text-blue-400 font-mono">B2B SaaS &amp; Enterprise</div>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Direct Merchant Recommendation</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AI shopping assistants synthesize reviews and prices across multiple domains. Stores with missing Offer and MerchantReturnPolicy schemas are omitted from recommendations.
                </p>
                <div className="pt-2 text-xs text-emerald-400 font-mono">E-Commerce &amp; Retail</div>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Citation-Share Reporting</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Agency clients expect measurable proof that their content is cited in ChatGPT and Perplexity. Zobay Rank provides exportable white-label telemetry for every account.
                </p>
                <div className="pt-2 text-xs text-purple-400 font-mono">Digital Agencies</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Shared Architectural Foundations)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Universal Rigor</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Shared Architectural Foundations
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Regardless of your industry vertical, every Zobay Rank audit builds upon 3 non-negotiable optimization pillars.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Deterministic Crawling</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  High-concurrency BFS inspection of status codes, canonical loops, robots directives, and DOM hierarchies to ensure search bots encounter zero bottlenecks.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Answer Engine Citations</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Live prompt execution and footnote link extraction across ChatGPT, Perplexity, Gemini, and Claude to verify brand citation frequency.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-amber-600/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">8-Factor GEO Scoring</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Proprietary measurement of entity consistency, recommendation strength, citation authority, and cross-engine parity.
                </p>
              </div>
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
              Start Your Free Technical &amp; AI Search Audit
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover where your brand stands in both traditional search and conversational answer engines in under 60 seconds.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run Free Website Audit</span>
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
