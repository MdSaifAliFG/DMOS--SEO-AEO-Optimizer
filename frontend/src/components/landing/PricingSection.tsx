"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface PlanDisplay {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  credits: number;
  rollover: number;
  projects: number;
  websites: number;
  members: number;
  popular?: boolean;
  description: string;
  badge?: string;
  features: string[];
}

const PLANS: PlanDisplay[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    credits: 50,
    rollover: 0,
    projects: 1,
    websites: 1,
    members: 1,
    description: "Essential testing for individual creators and developers",
    features: [
      "50 credits per month",
      "1 tracked project & website",
      "Basic SEO crawler & health score",
      "Manual single-engine AI queries",
      "Standard community support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 4.99,
    annualPrice: 3.99,
    credits: 500,
    rollover: 250,
    projects: 3,
    websites: 3,
    members: 1,
    description: "For founders and early-stage projects gaining momentum",
    features: [
      "500 credits per month",
      "Rollover up to 250 unused credits",
      "3 projects & websites",
      "Full SEO & AEO dashboard access",
      "On-demand answer engine queries",
      "Exportable CSV reports",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 8.99,
    annualPrice: 7.19,
    credits: 1000,
    rollover: 500,
    projects: 5,
    websites: 5,
    members: 3,
    popular: true,
    badge: "Most Popular",
    description: "Complete automated intelligence for growing modern businesses",
    features: [
      "1,000 credits per month",
      "Rollover up to 500 unused credits",
      "5 projects & websites, 3 team seats",
      "Automated scheduled monitoring",
      "AI visibility score & competitor tracking",
      "Executive PDF report generation",
      "Priority query processing",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 14.99,
    annualPrice: 11.99,
    credits: 2500,
    rollover: 1250,
    projects: 10,
    websites: 10,
    members: 5,
    description: "Scale multiple properties with high-frequency AI tracking",
    features: [
      "2,500 credits per month",
      "Rollover up to 1,250 unused credits",
      "10 projects & websites, 5 team seats",
      "High-frequency automated monitoring",
      "Full ChatGPT, Gemini & Perplexity suite",
      "Deep citation authority analytics",
      "Fast-lane analysis queues",
    ],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 29.99,
    annualPrice: 23.99,
    credits: 6000,
    rollover: 3000,
    projects: 25,
    websites: 25,
    members: 10,
    description: "Advanced team capabilities, white-label, and API integrations",
    features: [
      "6,000 credits per month",
      "Rollover up to 3,000 unused credits",
      "25 projects & websites, 10 team seats",
      "Custom branded white-label reports",
      "Direct REST API & webhook access",
      "Dedicated account manager",
      "SLA guarantee & 99.9% uptime",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 59.99,
    annualPrice: 47.99,
    credits: 15000,
    rollover: 7500,
    projects: 50,
    websites: 50,
    members: 25,
    description: "Multi-client orchestration with enterprise-grade capacity",
    features: [
      "15,000 credits per month",
      "Rollover up to 7,500 unused credits",
      "50 client projects & websites",
      "25 client & team collaborator seats",
      "Custom white-label client portals",
      "Unlimited scheduled monitoring cycles",
      "Top-tier priority processing queues",
    ],
  },
];

export const PricingSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 bg-white dark:bg-[#070b14] relative overflow-hidden transition-colors"
    >
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,99,255,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,99,255,0.12),rgba(0,0,0,0))] pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Transparent, Predictable Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
            Plans that Scale with Your <span className="text-[#1D63FF]">Search Authority</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            All plans include full access to SEO crawling, AI Answer Engine Tracking (AEO), and Generative Search Optimization (GEO). Credits replenish monthly.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-3 flex items-center justify-center">
            <div className="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#1D63FF] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan) => {
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-200 ${
                  isPopular
                    ? "bg-white dark:bg-[#0c1424] border-2 border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-600/10 lg:-translate-y-2"
                    : "bg-white dark:bg-[#0b101b] border border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1D63FF] text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md">
                    ★ {plan.badge || "Most Popular"}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Header */}
                  <div className="pt-2 pb-1 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-mono">
                        ${price === 0 ? "0" : price.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        / month
                      </span>
                    </div>
                    {billingCycle === "annual" && price > 0 && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                        Billed annually (${(price * 12).toFixed(2)}/yr)
                      </span>
                    )}
                  </div>

                  {/* Quotas Breakdown */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Credits / Month
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {plan.credits.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Rollover Max
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {plan.rollover > 0 ? `${plan.rollover.toLocaleString()} credits` : "No rollover"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Projects / Sites
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {plan.projects} Projects
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Team Members
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {plan.members} Seat{plan.members > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Included in {plan.name}:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to action */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    href={
                      isAuthenticated
                        ? "/billing"
                        : plan.id === "free"
                          ? "/signup"
                          : `/signup?plan=${plan.id}&cycle=${billingCycle}`
                    }
                    className="block"
                  >
                    <button
                      type="button"
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isPopular
                          ? "bg-[#1D63FF] hover:bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:scale-[1.02]"
                          : plan.id === "free"
                            ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100"
                            : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-xs"
                      }`}
                    >
                      <span>
                        {plan.id === "free"
                          ? "Get Started Free"
                          : `Choose ${plan.name}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Payment Assurance Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Secure 256-bit encrypted checkout via Stripe. Cancel or change plans anytime.</span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <span>Need more one-off credits?</span>
            <Link href={isAuthenticated ? "/billing" : "/login"} className="text-blue-600 dark:text-blue-400 hover:underline">
              View Credit Top-Up Packs →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
