import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Zap, ShieldCheck, RefreshCw, CheckCircle2, ArrowRight, Sparkles, Layers, Globe, Bot, TrendingUp } from "lucide-react";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = createPageMetadata({
  title: "Plans & Pricing — Zobay Rank",
  description:
    "Explore transparent plans for SEO, AEO, and GEO optimization. Choose from Free, Starter, Growth, Pro, Business, and Agency tiers with credit rollovers.",
  path: "/pricing",
  keywords: [
    "Zobay Rank pricing",
    "SEO software cost",
    "AEO tracking price",
    "GEO optimization plans",
    "search visibility pricing",
  ],
});

const CREDIT_PACKS = [
  { credits: 250, price: 2.99, costPerCredit: "$0.012" },
  { credits: 500, price: 4.49, costPerCredit: "$0.009" },
  { credits: 1000, price: 7.99, costPerCredit: "$0.008", popular: true },
  { credits: 2500, price: 17.99, costPerCredit: "$0.007" },
  { credits: 5000, price: 29.99, costPerCredit: "$0.006" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://rank.zobay.in/" },
          { name: "Pricing", url: "https://rank.zobay.in/pricing" },
        ]}
      />
      <LandingNavbar />

      <main className="flex-1 pt-20">
        {/* Main Pricing Section (Dark #050B18) */}
        <PricingSection />

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (One-Time Credit Packs)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold tracking-wide">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>One-Time Top-Up Credits</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Need Extra Credits for High-Volume Crawls?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Credit top-up packs never expire. They are consumed after your monthly subscription allowance and rollover balance, giving you complete burst flexibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className={`p-6 sm:p-7 rounded-3xl bg-white border text-left flex flex-col justify-between relative transition-all duration-200 hover:-translate-y-1 ${
                    pack.popular
                      ? "border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20"
                      : "border-slate-200 shadow-lg shadow-slate-200/50 hover:border-slate-300"
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm">
                      Best Value
                    </span>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-mono font-bold text-slate-900 text-xl">
                      <Zap className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
                      <span>{pack.credits.toLocaleString()}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                      Credits Pack
                    </span>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                        ${pack.price.toFixed(2)}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {pack.costPerCredit} per credit
                      </span>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Link
                      href="/billing"
                      className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wide text-center block transition-all ${
                        pack.popular
                          ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      Purchase Pack
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (What Every Plan Includes)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Layers className="w-4 h-4" />
                <span>Standardized Capabilities</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                Every Zobay Rank Plan Includes
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                No artificial feature gates on critical diagnostics. All subscribers receive complete access to core auditing capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Full Technical SEO Engine</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deterministic BFS crawler, status code verification (200, 301, 404, 500), canonical integrity, heading structure inspection, and Core Web Vitals diagnostics.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">AI &amp; AEO Prompt Tracking</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Live buyer prompt monitoring across ChatGPT, Perplexity, and Gemini with brand citation URL extraction and competitor citation gap analysis.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Credit Rollover Protection</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Never lose unused credits. Paid subscriptions automatically roll over up to 50% of your monthly allotment into the subsequent billing cycle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* ========================================================
            SECTION 5: VIBRANT GRADIENT CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Expand Your Search Visibility?
            </h2>
            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              Start with our free plan or upgrade to an operational tier for automated multi-engine prompt monitoring.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-semibold text-sm transition-all text-center cursor-pointer"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
