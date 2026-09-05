"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Zap,
  Eye,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const SEOAEOSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="services"
      className="py-20 sm:py-28 bg-white border-b border-slate-200 scroll-mt-20 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem]"
    >
      {/* Anchor alias for backwards-compatibility */}
      <div id="engines" className="absolute -top-24 left-0 w-0 h-0" />

      {/* Atmospheric Radial Flare Glows */}
      <div className="absolute top-1/4 left-5 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-5 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Unified Intelligence Platform
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            One platform. Two optimization engines.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Optimize for traditional search algorithms and the rapidly evolving world of AI-synthesized answer models in one integrated workspace.
          </p>
        </div>

        {/* Two Large Side-By-Side Master Engine Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: SEO Optimization */}
          <div className="p-8 sm:p-9 rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-white border border-blue-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            {/* Top Hover Gradient Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-6">
              {/* Header: Icon, Titles & Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0 p-3">
                    <Globe className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      SEO Optimization
                    </h3>
                    <span className="text-xs text-blue-600 font-bold block mt-0.5">
                      Search Engine Discoverability & Health
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200 shadow-sm shrink-0">
                  Traditional SERP
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Deterministic technical audits, automated BFS website crawling, indexability diagnostics, link topology analysis, and on-page HTML tag validation.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/60 text-[11px] font-semibold text-blue-800">
                  <Zap className="w-3 h-3 text-blue-600" />
                  100+ Diagnostic Rules
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/60 text-[11px] font-semibold text-blue-800">
                  <Eye className="w-3 h-3 text-blue-600" />
                  Live SERP Simulator
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/60 text-[11px] font-semibold text-blue-800">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  1-Click HTML Fixes
                </span>
              </div>

              {/* Checklist Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Technical SEO Audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Website Crawling Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Indexability Diagnostics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Title & Meta Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Internal Link Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Prioritized Issue Fixing</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Monospace Path + Action Button */}
            <div className="pt-6 border-t border-blue-100/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-medium">Module: /seo/*</span>
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>Explore SEO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: AEO Optimization */}
          <div className="p-8 sm:p-9 rounded-3xl bg-gradient-to-b from-purple-50/70 via-white to-white border border-purple-200/90 shadow-sm hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            {/* Top Hover Gradient Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-6">
              {/* Header: Icon, Titles & Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform shrink-0 p-3">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      AEO Optimization
                    </h3>
                    <span className="text-xs text-purple-600 font-bold block mt-0.5">
                      Answer Engine Visibility & Citations
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200 shadow-sm shrink-0">
                  AI Answer Engines
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Monitor brand visibility, citation frequency, and synthesized answers across ChatGPT Search, Perplexity AI, Google AI Overviews, Gemini, and Microsoft Copilot.
              </p>

              {/* Metric Highlights Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200/60 text-[11px] font-semibold text-purple-800">
                  <Bot className="w-3 h-3 text-purple-600" />
                  4 Major LLMs Tracked
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200/60 text-[11px] font-semibold text-purple-800">
                  <Layers className="w-3 h-3 text-purple-600" />
                  Knowledge Entity Graph
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200/60 text-[11px] font-semibold text-purple-800">
                  <TrendingUp className="w-3 h-3 text-purple-600" />
                  Competitor Radar
                </span>
              </div>

              {/* Checklist Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>AI Search Visibility Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Answer Engine Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Buyer Prompt Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Knowledge Graph Entities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Source Citation Extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>AEO Intelligence Reports</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Monospace Path + Action Button */}
            <div className="pt-6 border-t border-purple-100/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-medium">Module: /aeo/*</span>
              <Link href={isAuthenticated ? "/aeo/dashboard" : "/login"}>
                <button className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
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
