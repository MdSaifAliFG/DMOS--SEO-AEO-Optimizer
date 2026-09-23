import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Database,
  Eye,
  Bell,
  Globe,
  CheckCircle2,
  Server,
  FileText,
  UserCheck,
  HelpCircle,
  Mail,
  KeyRound,
} from "lucide-react";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy — Zobay Rank",
  description:
    "Read the Zobay Rank Privacy Policy. Learn how we handle audit data, crawl telemetry, and user information with strict security and privacy standards.",
  path: "/privacy-policy",
  keywords: [
    "Zobay Rank Privacy Policy",
    "Data Protection",
    "SEO Audit Security",
    "AI Crawl Data Privacy",
    "GDPR Compliance",
  ],
});

const DATA_TYPES = [
  {
    title: "Account & Profile Credentials",
    desc: "Work email address, salted password hashes (Argon2 / bcrypt), workspace team name, and notification preferences.",
    icon: KeyRound,
    color: "blue",
  },
  {
    title: "Audit & Crawl Targets",
    desc: "Target domain URLs, crawl depth parameters, robots.txt directives, and target answer engine prompt tracking configurations.",
    icon: Database,
    color: "purple",
  },
  {
    title: "Integration Tokens",
    desc: "Encrypted API keys and webhooks provided for Google Search Console, Brevo, Slack, or Discord notification channels.",
    icon: Server,
    color: "amber",
  },
  {
    title: "Security & Telemetry",
    desc: "Timestamped server access logs, client IP addresses for brute-force rate limiting, and diagnostic crawler latency statistics.",
    icon: Globe,
    color: "emerald",
  },
];

const FAQS = [
  {
    question: "Do AI models or LLMs train on my website crawl data or prompts?",
    answer:
      "No. Zobay Rank submits diagnostic queries to ChatGPT, Perplexity, Gemini, and Claude via commercial enterprise API tiers with explicit zero-data-retention and zero-model-training clauses. Your tracked prompts and audit results are never used to train public AI models.",
  },
  {
    question: "Does Zobay Rank sell customer or website audit data to third parties?",
    answer:
      "Never. We do not sell, rent, or monetize your personal information, workspace metadata, or crawl findings under any circumstances.",
  },
  {
    question: "How long is website crawl history retained?",
    answer:
      "Historical crawl snapshots and status code reports are retained for the duration of your active subscription to enable longitudinal trend reporting. You can permanently purge crawl records at any time via your project dashboard.",
  },
  {
    question: "How can I request full deletion of my workspace and personal data?",
    answer:
      "You can submit a complete data erasure request at any time by contacting our data protection desk at privacy@zobay.in or support@zobay.in. We process GDPR and CCPA erasure requests within 7 business days.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" },
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
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Data Governance &amp; Security Standards</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Privacy <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">Policy</span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Effective Date: January 1, 2026 • Last Updated: September 23, 2026. How Zobay Rank protects your crawl telemetry, workspace credentials, and query data.
            </p>

            {/* Direct Answer Summary Block */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>EXECUTIVE PRIVACY COMMITMENT</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank</strong> is committed to stringent privacy governance. We process customer data strictly to execute website crawls, evaluate answer engine citations, and generate generative optimization insights. We never sell customer information, and our AI model integrations operate with strict zero-training guarantees.
              </p>
            </div>

            {/* Guarantees Quick Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">0%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Data Sold or Shared</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">AES-256</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Rest Encryption</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">Zero AI</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Model Training</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-purple-400">GDPR &amp; CCPA</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Full Compliance</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Information We Collect)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Data Categories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                1. Information We Collect &amp; Process
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We only collect data strictly necessary to execute website crawling, verify status codes, and track multi-engine prompt citations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DATA_TYPES.map((dt, idx) => {
                const IconComponent = dt.icon;
                return (
                  <div
                    key={idx}
                    className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{dt.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {dt.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Encrypted &amp; Isolated</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (How We Use Information & Security)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Eye className="w-4 h-4" />
                <span>Authorized Operations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                2. How We Use &amp; Protect Your Telemetry
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                All crawl jobs and AI prompt simulations run in isolated execution sandboxes with multi-layered perimeter safeguards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">SSRF-Protected Crawling</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our crawler strictly forbids traversing internal private IP spaces (RFC 1918), AWS/GCP metadata endpoints, and non-HTTP protocols, safeguarding your network topology.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Encrypted Credential Storage</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Third-party tokens (Search Console, webhooks) are encrypted using AES-256 with KMS rotated keys. Passwords are cryptographic hashes utilizing Argon2/bcrypt algorithms.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Zero Model Training</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our integrations with OpenAI, Anthropic, Google, and Perplexity utilize commercial enterprise endpoints where customer prompts and answers are strictly exempt from model training.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE SECTION (User Rights & GDPR/CCPA)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Global Compliance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                3. Your Rights Under GDPR, CCPA &amp; Global Laws
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                You retain complete sovereign ownership over your account data, audit records, and workspace configurations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Individual Privacy Rights</span>
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li>
                    <strong>Right to Access:</strong> You can download a structured copy of your workspace data, crawls, and prompt histories at any time.
                  </li>
                  <li>
                    <strong>Right to Erasure:</strong> You can request immediate permanent deletion of all account records, audit tables, and project assets.
                  </li>
                  <li>
                    <strong>Right to Rectification:</strong> You can modify or update billing, team, and domain configurations in real time via settings.
                  </li>
                  <li>
                    <strong>Right to Opt-Out:</strong> We do not sell your personal data; no opt-out is necessary because monetization of customer data is prohibited by design.
                  </li>
                </ul>
              </div>

              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>Privacy Inquiries &amp; Data Protection Officer</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  For any questions regarding this Privacy Policy, sub-processors, or to submit a formal GDPR/CCPA request, contact our security and privacy team directly:
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Official Privacy Contact</span>
                  <a
                    href="mailto:privacy@zobay.in"
                    className="text-base font-bold text-blue-600 hover:text-blue-800 transition-colors block"
                  >
                    privacy@zobay.in
                  </a>
                  <span className="text-[11px] text-slate-500">
                    CC: support@zobay.in • Response SLA: Within 48 business hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK FAQ SECTION (Privacy Questions)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Privacy &amp; Security FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Frequently Asked Privacy Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Clear answers regarding data retention, AI model isolation, and audit ownership.
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
              Enterprise-Grade Search Intelligence with Total Privacy
            </h2>
            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              Run deterministic crawls and live model prompt tracking with complete data sovereignty and zero LLM training risk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start Free Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-semibold text-sm transition-all text-center cursor-pointer"
              >
                Contact Privacy Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
