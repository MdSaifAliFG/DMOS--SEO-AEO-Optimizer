"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Eye,
  Layers,
  Award,
  Boxes,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const SEOAEOSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="services"
      className="py-24 sm:py-32 bg-[#030712] text-white border-t border-b border-white/5 scroll-mt-20 relative overflow-hidden"
    >
      {/* Anchor alias for backwards-compatibility */}
      <div id="engines" className="absolute -top-24 left-0 w-0 h-0" />

      {/* Atmospheric Ambient Glow Flares Scaled for 4K */}
      <div className="absolute top-1/4 -left-20 w-[600px] 2xl:w-[900px] 3xl:w-[1100px] h-[600px] 2xl:h-[900px] 3xl:h-[1100px] bg-[#1D63FF]/15 rounded-full blur-[150px] 2xl:blur-[220px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] 2xl:w-[900px] 3xl:w-[1100px] h-[600px] 2xl:h-[900px] 3xl:h-[1100px] bg-amber-500/10 rounded-full blur-[150px] 2xl:blur-[220px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] 2xl:w-[1000px] h-[350px] 2xl:h-[500px] bg-purple-600/10 rounded-full blur-[140px] 2xl:blur-[200px] pointer-events-none" />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] 2xl:[background-size:36px_36px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1680px] 3xl:max-w-[1920px] 4k:max-w-[2240px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-16 2xl:space-y-24 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto space-y-4 2xl:space-y-6">
          <h2 className="text-3xl sm:text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-white tracking-tight leading-[1.15]">
            One platform.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-amber-400 bg-clip-text text-transparent">
              Three optimization pillars.
            </span>
          </h2>

          <p className="text-sm sm:text-base 2xl:text-lg 3xl:text-xl text-slate-300 leading-relaxed max-w-2xl 2xl:max-w-3xl mx-auto font-normal">
            Optimize for traditional search algorithms, AI-synthesized answer models, and generative discovery (GEO) in one integrated workspace.
          </p>
        </div>

        {/* Three Symmetrical Engine Cards: SEO, AEO, and GEO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* Card 1: SEO Optimization */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white text-slate-900 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(29,99,255,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4 sm:space-y-5">
              {/* Header: Icon on Left, Title + Subtitle Beside Icon, Badge on Right */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0 p-2.5">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-[17px] 2xl:text-xl font-black text-slate-950 tracking-tight leading-tight whitespace-nowrap">
                      SEO Optimization
                    </h3>
                    <p className="text-[11px] sm:text-xs font-bold text-blue-600 tracking-wide truncate mt-0.5">
                      Discoverability &amp; Crawl Health
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs shrink-0 mt-0.5">
                  SERP Audit
                </span>
              </div>

              {/* Description with Equal Min-Height */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal min-h-[56px] sm:min-h-[64px]">
                Deterministic technical audits, automated BFS website crawler, indexability diagnostics, link topology analysis, and HTML validation.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] font-bold text-blue-700">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  100+ Rules
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] font-bold text-blue-700">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  SERP Simulator
                </span>
              </div>

              {/* Checklist Features */}
              <div className="space-y-2.5 text-xs text-slate-700 font-semibold pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Technical BFS Crawler</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Indexability &amp; Robots Diagnostics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Title &amp; Meta Optimization</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Internal Link Health</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold">/seo/*</span>
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore SEO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Card 2: AEO Optimization */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white text-slate-900 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(168,85,247,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4 sm:space-y-5">
              {/* Header: Icon on Left, Title + Subtitle Beside Icon, Badge on Right */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform shrink-0 p-2.5">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-[17px] 2xl:text-xl font-black text-slate-950 tracking-tight leading-tight whitespace-nowrap">
                      AEO Optimization
                    </h3>
                    <p className="text-[11px] sm:text-xs font-bold text-purple-600 tracking-wide truncate mt-0.5">
                      Answer Engine Citations &amp; Visibility
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs shrink-0 mt-0.5">
                  AI Answers
                </span>
              </div>

              {/* Description with Equal Min-Height */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal min-h-[56px] sm:min-h-[64px]">
                Monitor brand visibility, citation frequency, and synthesized answers across ChatGPT Search, Perplexity AI, Google Gemini, and Claude.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50/80 border border-purple-100 text-[11px] font-bold text-purple-700">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  4 LLMs Polled
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50/80 border border-purple-100 text-[11px] font-bold text-purple-700">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  Entity Graph
                </span>
              </div>

              {/* Checklist Features */}
              <div className="space-y-2.5 text-xs text-slate-700 font-semibold pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>AI Search Visibility Tracking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Buyer Prompt Synthesis</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Knowledge Graph Entities</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Source Citation Extraction</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold">/aeo/*</span>
              <Link href={isAuthenticated ? "/aeo/dashboard" : "/login"}>
                <button className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore AEO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Card 3: GEO Optimization */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white text-slate-900 border border-amber-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4 sm:space-y-5">
              {/* Header: Icon on Left, Title + Subtitle Beside Icon, Badge on Right */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform shrink-0 p-2.5">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-[17px] 2xl:text-xl font-black text-slate-950 tracking-tight leading-tight whitespace-nowrap">
                      GEO Optimization
                    </h3>
                    <p className="text-[11px] sm:text-xs font-bold text-amber-600 tracking-wide truncate mt-0.5">
                      Generative Parity &amp; Impact
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200 shadow-xs shrink-0 mt-0.5">
                  Generative
                </span>
              </div>

              {/* Description with Equal Min-Height */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal min-h-[56px] sm:min-h-[64px]">
                Optimize brand recommendation frequency, citation influence, entity consistency, and AI crawler accessibility with 42 deterministic rules.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] font-bold text-amber-700">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  8-Factor Score
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] font-bold text-amber-700">
                  <Boxes className="w-3.5 h-3.5 text-amber-600" />
                  42 Rules Engine
                </span>
              </div>

              {/* Checklist Features */}
              <div className="space-y-2.5 text-xs text-slate-700 font-semibold pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cross-Engine Parity Matrix</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>AI Crawler Verification (GPTBot, Claude)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>5 Content Optimization Studios</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Competitor Share of Voice Gap</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold">/geo/*</span>
              <Link href={isAuthenticated ? "/geo/dashboard" : "/login"}>
                <button className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore GEO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
