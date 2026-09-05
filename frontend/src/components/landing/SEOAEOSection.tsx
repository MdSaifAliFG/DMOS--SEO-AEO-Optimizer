"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  Zap,
  Eye,
  TrendingUp,
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
      <div className="absolute bottom-1/4 -right-20 w-[600px] 2xl:w-[900px] 3xl:w-[1100px] h-[600px] 2xl:h-[900px] 3xl:h-[1100px] bg-purple-600/15 rounded-full blur-[150px] 2xl:blur-[220px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] 2xl:w-[1000px] h-[350px] 2xl:h-[500px] bg-indigo-600/10 rounded-full blur-[140px] 2xl:blur-[200px] pointer-events-none" />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] 2xl:[background-size:36px_36px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1680px] 3xl:max-w-[1920px] 4k:max-w-[2240px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-16 2xl:space-y-24 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto space-y-4 2xl:space-y-6">
          <h2 className="text-3xl sm:text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-white tracking-tight leading-[1.15]">
            One platform.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Two optimization engines.
            </span>
          </h2>

          <p className="text-sm sm:text-base 2xl:text-lg 3xl:text-xl text-slate-300 leading-relaxed max-w-2xl 2xl:max-w-3xl mx-auto font-normal">
            Optimize for traditional search algorithms and the rapidly evolving world of AI-synthesized answer models in one integrated workspace.
          </p>
        </div>

        {/* Two Large Side-By-Side Master Engine Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 2xl:gap-14 3xl:gap-16">
          {/* Card 1: SEO Optimization (White Card) */}
          <div className="p-8 sm:p-9 2xl:p-12 3xl:p-14 rounded-3xl 2xl:rounded-[36px] bg-white text-slate-900 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(29,99,255,0.25)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-8 2xl:space-y-10 relative overflow-hidden group">
            <div className="space-y-6 2xl:space-y-8">
              {/* Header: Icon, Titles & Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 2xl:gap-5">
                  <div className="w-13 h-13 2xl:w-16 2xl:h-16 rounded-2xl 2xl:rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0 p-3 2xl:p-3.5">
                    <Globe className="w-7 h-7 2xl:w-9 2xl:h-9" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl 2xl:text-3xl 3xl:text-4xl font-black text-slate-950 leading-tight">
                      SEO Optimization
                    </h3>
                    <span className="text-xs 2xl:text-sm text-blue-600 font-bold block mt-0.5">
                      Search Engine Discoverability & Health
                    </span>
                  </div>
                </div>

                <span className="px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full text-[10px] 2xl:text-xs font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs shrink-0">
                  Traditional SERP
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed font-normal">
                Deterministic technical audits, automated BFS website crawling, indexability diagnostics, link topology analysis, and on-page HTML tag validation.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-2 2xl:gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] 2xl:text-xs font-bold text-blue-700">
                  <Zap className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-blue-600" />
                  100+ Diagnostic Rules
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] 2xl:text-xs font-bold text-blue-700">
                  <Eye className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-blue-600" />
                  Live SERP Simulator
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] 2xl:text-xs font-bold text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-blue-600" />
                  1-Click HTML Fixes
                </span>
              </div>

              {/* Checklist Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 2xl:gap-5 text-xs 2xl:text-sm 3xl:text-base text-slate-700 font-semibold pt-4 2xl:pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-600 shrink-0" />
                  <span>Technical SEO Audits</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-600 shrink-0" />
                  <span>Website Crawling Engine</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-600 shrink-0" />
                  <span>Indexability Diagnostics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-600 shrink-0" />
                  <span>Title & Meta Optimization</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-600 shrink-0" />
                  <span>Internal Link Health</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-600 shrink-0" />
                  <span>Prioritized Issue Fixing</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Monospace Path + Action Button */}
            <div className="pt-6 2xl:pt-8 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs 2xl:text-sm text-slate-400 font-mono font-semibold">Module: /seo/*</span>
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-6 2xl:px-8 py-2.5 2xl:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs 2xl:text-sm shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore SEO</span>
                  <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: AEO Optimization (White Card) */}
          <div className="p-8 sm:p-9 2xl:p-12 3xl:p-14 rounded-3xl 2xl:rounded-[36px] bg-white text-slate-900 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(168,85,247,0.25)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-8 2xl:space-y-10 relative overflow-hidden group">
            <div className="space-y-6 2xl:space-y-8">
              {/* Header: Icon, Titles & Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 2xl:gap-5">
                  <div className="w-13 h-13 2xl:w-16 2xl:h-16 rounded-2xl 2xl:rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform shrink-0 p-3 2xl:p-3.5">
                    <Bot className="w-7 h-7 2xl:w-9 2xl:h-9" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl 2xl:text-3xl 3xl:text-4xl font-black text-slate-950 leading-tight">
                      AEO Optimization
                    </h3>
                    <span className="text-xs 2xl:text-sm text-purple-600 font-bold block mt-0.5">
                      Answer Engine Visibility & Citations
                    </span>
                  </div>
                </div>

                <span className="px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full text-[10px] 2xl:text-xs font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs shrink-0">
                  AI Answer Engines
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed font-normal">
                Monitor brand visibility, citation frequency, and synthesized answers across ChatGPT Search, Perplexity AI, Google AI Overviews, Gemini, and Microsoft Copilot.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-2 2xl:gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-xl bg-purple-50/80 border border-purple-100 text-[11px] 2xl:text-xs font-bold text-purple-700">
                  <Bot className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-purple-600" />
                  4 Major LLMs Tracked
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-xl bg-purple-50/80 border border-purple-100 text-[11px] 2xl:text-xs font-bold text-purple-700">
                  <Layers className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-purple-600" />
                  Knowledge Entity Graph
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-xl bg-purple-50/80 border border-purple-100 text-[11px] 2xl:text-xs font-bold text-purple-700">
                  <TrendingUp className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-purple-600" />
                  Competitor Radar
                </span>
              </div>

              {/* Checklist Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 2xl:gap-5 text-xs 2xl:text-sm 3xl:text-base text-slate-700 font-semibold pt-4 2xl:pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-purple-600 shrink-0" />
                  <span>AI Search Visibility Tracking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-purple-600 shrink-0" />
                  <span>Answer Engine Monitoring</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-purple-600 shrink-0" />
                  <span>Buyer Prompt Evaluation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-purple-600 shrink-0" />
                  <span>Knowledge Graph Entities</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-purple-600 shrink-0" />
                  <span>Source Citation Extraction</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-purple-600 shrink-0" />
                  <span>AEO Intelligence Reports</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Monospace Path + Action Button */}
            <div className="pt-6 2xl:pt-8 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs 2xl:text-sm text-slate-400 font-mono font-semibold">Module: /aeo/*</span>
              <Link href={isAuthenticated ? "/aeo/dashboard" : "/login"}>
                <button className="px-6 2xl:px-8 py-2.5 2xl:py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs 2xl:text-sm shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore AEO</span>
                  <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
