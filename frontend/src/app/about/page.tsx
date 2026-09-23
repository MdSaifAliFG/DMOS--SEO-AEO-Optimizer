import React from "react";
import Link from "next/link";
import {
  Building,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Globe,
  Sparkles,
  Bot,
  TrendingUp,
  Cpu,
  Mail,
  HelpCircle,
  Award,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, OrganizationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "About Us | Zobay & Zobay Rank",
  description:
    "Learn about Zobay and our flagship search intelligence platform, Zobay Rank. Mission, technical principles, and contact information.",
  path: "/about",
  keywords: [
    "About Zobay",
    "Zobay Rank Company",
    "Zobay Search Intelligence",
    "Zobay Rank Mission",
  ],
});

const PRINCIPLES = [
  {
    title: "Truth in Measurement",
    desc: "We prioritize raw, verifiable telemetry over synthetic vanity metrics. When our crawler identifies a 404 or redirect anomaly, we provide exact DOM locators and response headers.",
    icon: ShieldCheck,
  },
  {
    title: "Unified Search Architecture",
    desc: "We believe optimizing for Google without optimizing for ChatGPT and Perplexity leaves companies half-blind. We unite crawler health, citation tracking, and LLM entity consistency.",
    icon: Cpu,
  },
  {
    title: "Machine-First Design",
    desc: "From strict schema.org DefinedTerm validation to machine-readable llms.txt specifications, our tools are built for the automated AI ingestion pipelines shaping the web.",
    icon: Sparkles,
  },
];

const FAQS = [
  {
    question: "What is the relationship between Zobay and Zobay Rank?",
    answer:
      "Zobay is the parent technology entity and creator of Zobay Rank (https://rank.zobay.in/), our dedicated platform for SEO, Answer Engine Optimization, and Generative Engine Optimization.",
  },
  {
    question: "Where can I contact the Zobay team for inquiries?",
    answer:
      "You can contact our support and enterprise solutions team directly via email at support@zobay.in or by submitting an inquiry through our dedicated contact page.",
  },
  {
    question: "Who uses Zobay's search intelligence software?",
    answer:
      "Zobay Rank is utilized by SaaS software vendors, digital marketing agencies, high-volume e-commerce stores, and enterprise content teams requiring precise visibility analytics.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
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
              <span>Company &amp; Mission Overview</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">Zobay</span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We design and operate intelligent software infrastructure that helps modern businesses understand, measure, and scale organic discovery in the age of AI.
            </p>

            {/* Direct Answer Entity Block */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>ORGANIZATION OVERVIEW</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay</strong> is an independent software company dedicated to building transparent, high-precision search intelligence tools. Our flagship application, <strong>Zobay Rank</strong>, provides an integrated suite for technical website health, conversational AI citations, and generative recommendation scoring.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">Zobay</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Parent Organization</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">Zobay Rank</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Flagship Platform</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">Enterprise</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Infrastructure</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">support@zobay.in</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Direct Assistance</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Our Core Philosophy)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Operating Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Our Foundational Principles
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We believe that software should bring absolute clarity to complex problems. Here are the core pillars behind how Zobay builds products.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRINCIPLES.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-blue-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified Standard</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Our Flagship Solution)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Flagship Innovation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Introducing Zobay Rank
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Designed and built from the ground up to solve the real challenge facing modern digital brands: simultaneous discovery across spiders, answer engines, and LLMs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Deterministic Crawling</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Real-time BFS traversal tests status codes, broken links, canonical pointers, and DOM latency with zero guessing.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Live Model Extraction</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Direct API interrogation of ChatGPT, Perplexity, and Gemini to extract citation URLs and detect competitor advantages.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">8-Factor GEO Model</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Comprehensive entity governance measuring brand recommendation strength, parity, and knowledge base presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE SECTION (Support & Governance)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-center">
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                Customer Support &amp; Collaboration
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Direct Engineering Support
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We work directly with founders, engineering leads, and search consultants to ensure their crawler deployments and prompt monitors run smoothly.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Official Inquiries</span>
                <a
                  href="mailto:support@zobay.in"
                  className="text-2xl font-black text-blue-600 hover:text-blue-800 transition-colors"
                >
                  support@zobay.in
                </a>
              </div>
              <p className="text-xs text-slate-500">
                We respond to technical inquiries, enterprise crawler configurations, and platform questions within 24 business hours.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all inline-flex items-center gap-1.5"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK FAQ SECTION (Organization FAQs)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Company Inquiries</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Direct answers to common questions about Zobay and our search intelligence operations.
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
              Learn More About Zobay Rank
            </h2>
            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              Explore the detailed technical architecture of our flagship search and AI intelligence platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/about-zobay-rank"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Read Zobay Rank Overview</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-semibold text-sm transition-all text-center cursor-pointer"
              >
                Explore Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
