import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Zap,
  HelpCircle,
  CreditCard,
  Layers,
} from "lucide-react";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = createPageMetadata({
  title: "Refund & Cancellation Policy — Zobay Rank",
  description:
    "Learn about our 14-day money-back guarantee, subscription renewals, credit rollovers, and cancellation terms for Zobay Rank.",
  path: "/refund-policy",
  keywords: [
    "Zobay Rank Refund Policy",
    "Money Back Guarantee",
    "Subscription Cancellation",
    "Credit Refund Policy",
    "Billing Terms",
  ],
});

const POLICIES = [
  {
    title: "14-Day Money-Back Guarantee",
    desc: "For new subscribers enrolling in our Monthly or Annual SaaS plans, we provide a 14-calendar-day refund window from your initial transaction date. If our platform does not meet your expectations, request a 100% refund.",
    icon: ShieldCheck,
    badge: "Full Protection",
  },
  {
    title: "Instant Self-Serve Cancellation",
    desc: "You can cancel your subscription at any time directly through your workspace billing settings. No mandatory exit surveys, phone calls, or retention delays required.",
    icon: RefreshCw,
    badge: "1-Click Cancel",
  },
  {
    title: "Pre-Renewal Notifications",
    desc: "For annual plans, automated email notifications are dispatched 14 days before your billing renewal date, ensuring you always have advance notice before any recurring charge.",
    icon: Clock,
    badge: "Zero Surprises",
  },
  {
    title: "Permanent Credit Rollovers",
    desc: "On active paid plans, up to 50% of your unused monthly credit allotment rolls over to the following month. One-time top-up packs never expire as long as your workspace exists.",
    icon: Zap,
    badge: "Credit Safety",
  },
];

const FAQS = [
  {
    question: "How do I request a refund under the 14-day guarantee?",
    answer:
      "Simply send an email to billing@zobay.in or support@zobay.in with your account email and workspace name. Our billing team will verify your initial payment date and process your full refund within 2 to 3 business days.",
  },
  {
    question: "What happens to my account after I cancel my subscription?",
    answer:
      "Your workspace remains fully operational with all features, historical crawl reports, and prompt tracking active until the conclusion of your current billing cycle. Afterward, your account transitions to the Free tier without unexpected charges.",
  },
  {
    question: "Are one-time credit top-up packs refundable?",
    answer:
      "Unused one-time credit packs can be refunded within 14 days of purchase. If credits from the pack have already been consumed in crawl jobs or AI queries, the refund is calculated on a pro-rata basis for remaining unused credits.",
  },
  {
    question: "How long does it take for a refund to reflect on my card or bank account?",
    answer:
      "Once approved by our billing desk, refunds are dispatched immediately through our payment gateway. Depending on your financial institution, funds typically reflect in your account within 3 to 7 business days.",
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Refund Policy", url: "/refund-policy" },
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Transparent Billing &amp; Satisfaction Guarantee</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Refund &amp; Cancellation <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Policy</span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Effective Date: January 1, 2026 • Last Updated: September 23, 2026. Clear, fair terms governing money-back guarantees, plan cancellations, and credit protection.
            </p>

            {/* Direct Answer Summary Block */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-emerald-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-emerald-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>14-DAY SATISFACTION GUARANTEE</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We stand behind the engineering precision of Zobay Rank. If our technical SEO crawler or AEO prompt tracking does not meet your operational requirements within your first 14 days of subscription, you are entitled to a full 100% hassle-free refund. No questions asked.
              </p>
            </div>

            {/* Highlights Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">14 Days</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Money-Back Window</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Full Refund</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">Self-Serve</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">1-Click Cancel</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-amber-400">Never Expire</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Top-Up Credit Packs</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Refund Principles)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Customer Protection</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Our Refund &amp; Cancellation Commitments
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We believe billing should be straightforward, flexible, and fully respectful of your business timeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {POLICIES.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                        {item.badge}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Guaranteed Standard</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Billing Mechanics & Details)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <CreditCard className="w-4 h-4" />
                <span>Billing Mechanics</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Subscription Cycles &amp; Credit Preservation
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                How credits, renewals, and mid-cycle cancellations operate within your workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">Full Grace Period</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When you cancel your subscription before the next invoice date, your workspace remains fully unlocked until the end of your billing cycle. No premature downgrades.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Credit Rollover Protection</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unused credits automatically rollover up to 50% of your tier allotment each month. This ensures slow audit cycles do not waste your purchased capacity.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Zero Hidden Exit Fees</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We never charge cancellation fees, setup penalties, or clawbacks. You control your billing cycle directly from your self-serve profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE SECTION (How to Submit a Request)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-center">
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Direct Billing Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                How to Request a Refund
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                If you qualify under our 14-day policy, submitting a refund is as simple as sending a one-line email to our billing specialists.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Official Billing Contact</span>
                <a
                  href="mailto:billing@zobay.in"
                  className="text-2xl font-black text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  billing@zobay.in
                </a>
              </div>
              <p className="text-xs text-slate-500">
                Please include your workspace email or invoice number. Our billing specialists process refunds within 24 to 48 business hours.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all inline-flex items-center gap-1.5"
                >
                  <span>Open Contact Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK FAQ SECTION (Refund Questions)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Refund &amp; Cancellation FAQ
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Direct answers to common questions regarding refund timelines, credit packs, and subscription changes.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <h3 className="text-lg font-bold text-white flex items-start gap-3">
                    <span className="text-emerald-400 font-mono text-sm shrink-0 mt-0.5">
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
              Risk-Free Search Intelligence with Zobay Rank
            </h2>
            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              Explore our transparent subscription tiers backed by a complete 14-day satisfaction guarantee.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Subscription Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-semibold text-sm transition-all text-center cursor-pointer"
              >
                Launch Free Trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
