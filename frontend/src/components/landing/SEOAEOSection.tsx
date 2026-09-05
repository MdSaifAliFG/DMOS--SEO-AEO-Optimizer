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

      {/* Atmospheric Ambient Glow Flares (matching SeoSensing Dark Theme) */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#1D63FF]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
            One platform.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Two optimization engines.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Optimize for traditional search algorithms and the rapidly evolving world of AI-synthesized answer models in one integrated workspace.
          </p>
        </div>

        {/* Two Large Side-By-Side Master Engine Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: SEO Optimization */}
          <div className="p-8 sm:p-9 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-blue-500/25 hover:border-blue-400/80 shadow-2xl shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            {/* Top Hover Gradient Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-6">
              {/* Header: Icon, Titles & Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/35 group-hover:scale-105 transition-transform shrink-0 p-3">
                    <Globe className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      SEO Optimization
                    </h3>
                    <span className="text-xs text-blue-400 font-bold block mt-0.5">
                      Search Engine Discoverability & Health
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm shrink-0">
                  Traditional SERP
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Deterministic technical audits, automated BFS website crawling, indexability diagnostics, link topology analysis, and on-page HTML tag validation.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-[11px] font-semibold text-blue-300">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  100+ Diagnostic Rules
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-[11px] font-semibold text-blue-300">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  Live SERP Simulator
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-[11px] font-semibold text-blue-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  1-Click HTML Fixes
                </span>
              </div>

              {/* Checklist Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 font-medium pt-4 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Technical SEO Audits</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Website Crawling Engine</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Indexability Diagnostics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Title & Meta Optimization</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Internal Link Health</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Prioritized Issue Fixing</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Monospace Path + Action Button */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-medium">Module: /seo/*</span>
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore SEO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: AEO Optimization */}
          <div className="p-8 sm:p-9 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-purple-500/25 hover:border-purple-400/80 shadow-2xl shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            {/* Top Hover Gradient Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-6">
              {/* Header: Icon, Titles & Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/35 group-hover:scale-105 transition-transform shrink-0 p-3">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      AEO Optimization
                    </h3>
                    <span className="text-xs text-purple-400 font-bold block mt-0.5">
                      Answer Engine Visibility & Citations
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shrink-0">
                  AI Answer Engines
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Monitor brand visibility, citation frequency, and synthesized answers across ChatGPT Search, Perplexity AI, Google AI Overviews, Gemini, and Microsoft Copilot.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-[11px] font-semibold text-purple-300">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  4 Major LLMs Tracked
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-[11px] font-semibold text-purple-300">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Knowledge Entity Graph
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-[11px] font-semibold text-purple-300">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  Competitor Radar
                </span>
              </div>

              {/* Checklist Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 font-medium pt-4 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>AI Search Visibility Tracking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Answer Engine Monitoring</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Buyer Prompt Evaluation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Knowledge Graph Entities</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Source Citation Extraction</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>AEO Intelligence Reports</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Monospace Path + Action Button */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-medium">Module: /aeo/*</span>
              <Link href={isAuthenticated ? "/aeo/dashboard" : "/login"}>
                <button className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore AEO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
