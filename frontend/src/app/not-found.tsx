import React from "react";
import Link from "next/link";
import {
  Globe,
  Sparkles,
  TrendingUp,
  Home,
  Compass,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { SeoSensingLogo } from "@/components/brand/SeoSensingLogo";

export const metadata = {
  title: "404 - Page Not Found | Zobay Rank",
  description: "The page you requested could not be located on the Zobay Rank platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col justify-between items-center relative overflow-hidden select-none px-4 py-5 sm:py-7">
      {/* Dynamic Ambient Glow Backlights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] bg-[#1D63FF]/15 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:36px_36px] opacity-15 pointer-events-none" />

      {/* Top Header Bar: Clean Minimal Brand Navigation */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-start shrink-0 px-2 sm:px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <SeoSensingLogo size={34} className="group-hover:scale-105 transition-transform" />
          <span className="text-xl font-black tracking-tight text-white font-sans">
            Zob<span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">ay Rank</span>
          </span>
        </Link>
      </header>

      {/* Center Main Stage */}
      <main className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-6 sm:py-8 space-y-6 sm:space-y-8 my-auto">
        {/* Giant Glowing 404 Visual Numerals */}
        <div className="relative inline-flex flex-col items-center justify-center">
          {/* Depth Glow Blur */}
          <span
            aria-hidden="true"
            className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-blue-500/20 blur-2xl select-none absolute"
          >
            404
          </span>

          {/* High-Contrast Metallic Gradient Number */}
          <span className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent select-none relative drop-shadow-[0_15px_40px_rgba(59,130,246,0.3)]">
            404
          </span>

          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 backdrop-blur-md text-blue-400 text-[11px] sm:text-xs font-mono font-bold tracking-wider shadow-lg shadow-blue-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>HTTP_404 // CANONICAL_PATH_NOT_FOUND</span>
          </div>
        </div>

        {/* Descriptive Text Hierarchy */}
        <div className="space-y-2.5 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The link you clicked may be broken, out of date, or moved to a new canonical URL. Explore our core search optimization pillars below or return to the platform.
          </p>
        </div>

        {/* Primary Interactive CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            href="/"
            className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Home className="w-4 h-4 text-blue-200 group-hover:-translate-y-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/overview"
            className="px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Platform Overview</span>
          </Link>

          <Link
            href="/faq"
            className="px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Public FAQ</span>
          </Link>
        </div>

        {/* 3 Pillar Exploration Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full pt-4 text-left">
          {/* SEO Optimization Card */}
          <Link
            href="/seo-optimization"
            className="p-4 sm:p-4.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-200 group relative overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h2 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              SEO Optimization
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal line-clamp-2">
              Deterministic technical crawler, robots.txt, sitemaps &amp; on-page audits.
            </p>
          </Link>

          {/* AEO Optimization Card */}
          <Link
            href="/aeo-optimization"
            className="p-4 sm:p-4.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800/90 hover:border-purple-500/50 transition-all duration-200 group relative overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h2 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
              AEO Optimization
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal line-clamp-2">
              ChatGPT, Perplexity, Gemini citations tracking &amp; answer engine visibility.
            </p>
          </Link>

          {/* GEO Optimization Card */}
          <Link
            href="/geo-optimization"
            className="p-4 sm:p-4.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800/90 hover:border-amber-500/50 transition-all duration-200 group relative overflow-hidden hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h2 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
              GEO Optimization
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal line-clamp-2">
              8-factor score measuring AI recommendation rate &amp; brand entity consistency.
            </p>
          </Link>
        </div>
      </main>

      {/* Bottom Footer Bar: Minimalist Trust Indicators */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 pt-3 border-t border-slate-900/80 shrink-0 px-2 sm:px-4">
        <p className="tracking-wide">
          &copy; 2026 Zobay Rank Platform. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>SSRF Protected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>SEO + AEO + GEO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
