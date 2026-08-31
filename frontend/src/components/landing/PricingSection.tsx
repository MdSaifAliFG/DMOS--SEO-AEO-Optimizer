"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Search, Gem, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const PricingSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 bg-white relative overflow-hidden bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Choose a <span className="text-[#1D63FF]">Perfect Plan</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Get SEO results fast with our powerful SEO tool. Scan Your Website for Optimization Opportunities
          </p>
          <div className="pt-2 text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-3">
            <span>We accept payment via</span>
            <span className="font-bold text-slate-700">VISA</span>
            <span className="font-bold text-blue-700">PayPal</span>
            <span className="font-bold text-indigo-700">stripe</span>
          </div>
        </div>

        {/* 2 Overlapping Reference Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Card 1: White Card (SEO scan free) - 5 cols */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-black text-slate-900">SEO scan</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                  free
                </span>
              </div>

              {/* Feature Checklist with > chevrons */}
              <div className="space-y-3.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Get One Free Website Scan</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Free Basic SEO Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Find SEO Challenges</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Get Better Search Results!</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-6 py-2.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all">
                  Start for Free
                </button>
              </Link>
              <span className="text-xs font-bold text-slate-500 font-mono">$0.00/month</span>
            </div>
          </div>

          {/* Card 2: Royal Blue Card (Premium Membership) with Peeking Credit Cards - 7 cols */}
          <div className="lg:col-span-7 relative">
            {/* Peeking Floating Credit Cards (matching Image 4 top right) */}
            <div className="hidden sm:block absolute -top-8 right-6 w-48 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-2xl p-3.5 shadow-2xl transform rotate-[14deg] z-0 border border-slate-700/60">
              <span className="text-[9px] text-slate-400 block font-medium">Current Balance</span>
              <span className="text-sm font-bold font-mono text-white block mt-0.5">$5,750.20</span>
              <div className="mt-2 flex justify-between items-center text-[8px] text-slate-400">
                <span>Card 1289</span>
                <span>09/25</span>
              </div>
            </div>

            {/* Main Blue Card */}
            <div className="bg-[#1D63FF] rounded-3xl p-8 sm:p-9 text-white shadow-2xl shadow-blue-600/40 relative z-10 flex flex-col justify-between space-y-8 overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-blue-200" />
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Premium Membership
                  </h3>
                </div>

                {/* 2-Column Features List with > chevrons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs text-blue-50 font-medium">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>Get Unlimited Scans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>Access All SEO Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>Download Full Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>Scan your Competitors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>Uncover all SEO mistakes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>Discover Keyword Consistency</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-blue-400/40 flex flex-wrap items-center justify-between gap-4">
                <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                  <button className="px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-xs shadow-xl transition-all">
                    Upgrade to Premium
                  </button>
                </Link>
                <span className="text-sm font-bold text-white font-mono">$2.99/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
