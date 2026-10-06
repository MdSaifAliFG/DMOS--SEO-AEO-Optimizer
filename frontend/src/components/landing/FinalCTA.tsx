"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const FinalCTA: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-20 sm:py-28 2xl:py-36 bg-[#030712] overflow-hidden">
      {/* Dynamic Ambient Background Backlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Floating High-Contrast Glassmorphic Card Container */}
        <div className="relative rounded-3xl overflow-hidden border border-blue-500/30 bg-gradient-to-b from-[#0e172e] via-[#091024] to-[#050a18] p-8 sm:p-14 lg:p-16 text-center shadow-[0_20px_70px_rgba(29,99,255,0.25)] ring-1 ring-white/10">
          
          {/* Top Edge Highlight Shine */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />

          {/* Internal Radial Glow Spotlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle Geometric Dot Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-400/30 px-4 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Get Started Today</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Your website deserves more than{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                guesswork.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Analyze. Understand. Optimize. Join marketing teams and growth leaders elevating their visibility across traditional search and AI answer engines.
            </p>

            {/* Call-to-Action Action Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={isAuthenticated ? "/overview" : "/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_10px_30px_rgba(37,99,235,0.45)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/overview"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl font-semibold text-sm sm:text-base text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Zobay Rank</span>
              </Link>
            </div>

            {/* Feature Highlights Bar */}
            <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Instant deterministic crawl</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Unified SEO + AEO + GEO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
