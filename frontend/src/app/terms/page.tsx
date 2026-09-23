import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Scale,
  Server,
  Zap,
  HelpCircle,
  Cpu,
  Layers,
  Globe,
} from "lucide-react";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = createPageMetadata({
  title: "Terms & Conditions — Zobay Rank",
  description:
    "Review the terms, conditions, licensing, and acceptable use policies governing the Zobay Rank AI Search and technical optimization platform.",
  path: "/terms",
  keywords: [
    "Zobay Rank Terms",
    "Terms and Conditions",
    "Acceptable Use Policy",
    "SEO Crawler Terms",
    "AEO Software License",
  ],
});

const TERMS_SECTIONS = [
  {
    title: "1. Platform License & Service Scope",
    desc: "Zobay Rank grants you a non-exclusive, revocable, non-transferable subscription license to access our technical SEO crawler, AEO citation engine, and GEO optimization models according to your purchased plan.",
    icon: FileText,
  },
  {
    title: "2. Authorized Crawl Targets",
    desc: "You may only initiate automated crawls on web domains that you own, operate, or have lawful authorization to audit. You must respect target server robots.txt directives and configured rate-limiting intervals.",
    icon: Globe,
  },
  {
    title: "3. Acceptable Use Safeguards",
    desc: "You shall not attempt to bypass crawler SSRF security guards, flood queues, reverse-engineer proprietary algorithms, or use the service to execute denial-of-service traffic on third-party servers.",
    icon: ShieldCheck,
  },
  {
    title: "4. Account & Token Protection",
    desc: "You are solely responsible for maintaining the confidentiality of your workspace login credentials, API secrets, and webhook tokens. Any activity occurring under your account is your responsibility.",
    icon: Server,
  },
];

const FAQS = [
  {
    question: "Can I audit client websites using Zobay Rank?",
    answer:
      "Yes. Agencies, consultants, and marketing teams may audit client web assets provided they have obtained appropriate authorization or client consent to conduct standard non-disruptive website crawls and search visibility queries.",
  },
  {
    question: "What happens if a target website blocks the crawler?",
    answer:
      "If a target domain returns 403 Forbidden, 429 Too Many Requests, or blocks our User-Agent (`ZobayRankBot/1.0`), the audit will conclude with an explicit diagnostic warning explaining the network blockage.",
  },
  {
    question: "How do credit roll-overs work on monthly plans?",
    answer:
      "On active paid monthly plans, up to 50% of your unused monthly credit allotment automatically rolls over to the subsequent billing month. Rolled-over credits expire if the subscription is canceled.",
  },
  {
    question: "What governing law applies to Zobay Rank agreements?",
    answer:
      "These terms and conditions are governed by and construed in accordance with applicable laws governing digital cloud software operations, with primary dispute resolution handled via binding arbitration.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Terms & Conditions", url: "/terms" },
        ]}
      />
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
              <Scale className="w-4 h-4 text-blue-400" />
              <span>Platform Licensing &amp; Terms of Service</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Terms &amp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">Conditions</span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Effective Date: January 1, 2026 • Last Updated: September 23, 2026. Review the legal provisions, usage agreements, and operational policies governing Zobay Rank.
            </p>

            {/* Direct Answer Summary Block */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>EXECUTIVE TERMS SUMMARY</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                By creating a Zobay Rank account or initiating an automated website audit, you agree to adhere to these terms. Users must only crawl authorized domains, observe target robots.txt guidelines, and respect service rate limits. In return, Zobay Rank guarantees deterministic diagnostics, transparent billing, and strict data confidentiality.
              </p>
            </div>

            {/* Terms Highlights Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">SaaS License</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Non-Exclusive</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">SSRF Guarded</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Safe Crawling</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">50% Rollover</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Credit Protection</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">99.9%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Uptime Target</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (License & Acceptable Use)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Operational Framework</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Core Service Provisions &amp; Licensing
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Clear rules ensuring fair software utilization, network safety, and operational reliability for all subscribers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TERMS_SECTIONS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Binding Policy</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Technical Standards & Compliance)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Server className="w-4 h-4" />
                <span>Technical Specifications</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Crawler Architecture &amp; IP Protection
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                How our automated bots operate safely and preserve intellectual property rights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">Crawler Identification</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our crawler identifies itself via the standard User-Agent header <code className="text-blue-300">ZobayRankBot/1.0</code>, allowing webmasters to configure robots.txt rules or allow-lists easily.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Client Asset Ownership</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  You retain complete intellectual property ownership over all crawled content, reports, brand keywords, and exportable CSV/JSON audit deliverables generated by your account.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Platform Rights</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Zobay retains all rights, title, and interest in the Zobay Rank software engine, proprietary scoring algorithms, user interface designs, and underlying cloud infrastructure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE SECTION (Billing & Subscriptions)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Commercial Terms</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Subscriptions, Credits &amp; Cancellation
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Transparent billing terms with zero hidden fees or automated lock-ins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Subscription Cycle &amp; Self-Serve Cancellation</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Subscriptions automatically renew on a monthly or annual cadence from your initial enrollment date. You may cancel your subscription at any time with a single click in your workspace billing settings. Upon cancellation, your workspace retains active access through the end of the prepaid period.
                </p>
              </div>

              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span>Credits Consumption &amp; Rollovers</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Website audits and AI prompt queries consume credits based on page depth and model complexity. On active paid subscriptions, up to 50% of your unused monthly credit allotment automatically rolls over to the subsequent billing month. One-time top-up credit packs never expire.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK FAQ SECTION (Terms Questions)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Terms of Service FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Frequently Asked Terms Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Direct answers to common questions regarding client auditing, crawler compliance, and billing.
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
              Ready to Expand Your Search Visibility?
            </h2>
            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              Create your account to start auditing technical crawlability and tracking AI model recommendations.
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
