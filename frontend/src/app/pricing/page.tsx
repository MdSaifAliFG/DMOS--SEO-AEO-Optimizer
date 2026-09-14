import React from "react";
import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Zap, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Plans & Pricing — SeoSensing",
  description:
    "Explore transparent plans for SEO, AEO, and GEO optimization. Choose from Free, Starter, Growth, Pro, Business, and Agency tiers with credit rollovers.",
};

const CREDIT_PACKS = [
  { credits: 250, price: 2.99, costPerCredit: "$0.012" },
  { credits: 500, price: 4.49, costPerCredit: "$0.009" },
  { credits: 1000, price: 7.99, costPerCredit: "$0.008", popular: true },
  { credits: 2500, price: 17.99, costPerCredit: "$0.007" },
  { credits: 5000, price: 29.99, costPerCredit: "$0.006" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <LandingNavbar />

      <main className="flex-1 pt-24">
        {/* Main Pricing Section */}
        <PricingSection />

        {/* Credit Top-Up Section */}
        <section className="py-16 bg-slate-900/60 border-y border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                One-Time Top-Ups
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                Need Extra Credits for a Big Crawl or Audit?
              </h3>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Credit top-up packs never expire. They are consumed after your monthly subscription credits and rollover balance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className={`p-5 rounded-2xl bg-slate-950 border text-left flex flex-col justify-between relative ${
                    pack.popular
                      ? "border-amber-500/80 shadow-lg shadow-amber-500/10"
                      : "border-slate-800"
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">
                      Best Value
                    </span>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-white text-lg">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{pack.credits.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-slate-400 block">Credits Pack</span>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-2xl font-black text-white font-mono">${pack.price.toFixed(2)}</div>
                      <span className="text-[11px] text-slate-500">{pack.costPerCredit} per credit</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Highlights */}
        <section className="py-16 bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-white text-center mb-8">
              Every SeoSensing Plan Includes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Full SEO Engine
                </div>
                <p className="text-slate-400">
                  Comprehensive crawler, indexability tests, technical diagnostics, keyword analysis, and health score audits.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  AI & AEO Intelligence
                </div>
                <p className="text-slate-400">
                  Prompt tracking across ChatGPT, Gemini, and Perplexity with brand citation metrics and AI visibility indexes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Credit Rollover Protection
                </div>
                <p className="text-slate-400">
                  Paid plans allow unused credits to roll over each month up to 50% of your monthly allotment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <LandingFooter />
    </div>
  );
}
