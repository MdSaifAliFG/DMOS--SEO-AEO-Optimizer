import React from "react";
import Link from "next/link";
import { ArrowLeft, Search, Globe, Sparkles, TrendingUp, HelpCircle } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Page Not Found | Zobay Rank",
  description: "The page you are looking for could not be found on Zobay Rank.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <LandingNavbar />

      <main className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
            <span>HTTP Error 404</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              We couldn't find that page
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
              The link you clicked may be broken, out of date, or moved to a new canonical URL. Explore our core search optimization pillars below.
            </p>
          </div>

          {/* Quick navigation cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-left">
            <Link
              href="/seo-optimization"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 mb-2.5 group-hover:scale-110 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                SEO Optimization
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Technical crawler health, metadata &amp; indexability audits.
              </p>
            </Link>

            <Link
              href="/aeo-optimization"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-900 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 mb-2.5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                AEO Optimization
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                ChatGPT, Perplexity &amp; Gemini answer citations tracking.
              </p>
            </Link>

            <Link
              href="/geo-optimization"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-900 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                GEO Optimization
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                8-factor score for generative recommendations &amp; entities.
              </p>
            </Link>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Zobay Rank Home</span>
            </Link>
            <Link
              href="/faq"
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Visit Public FAQ</span>
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
