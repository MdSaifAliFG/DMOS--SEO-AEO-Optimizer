"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function OverviewPage() {
  return (
    <DashboardShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Hub Banner */}
        <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/25 backdrop-blur-md shadow-xs shadow-blue-500/10 transition-all hover:border-blue-400/40">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-blue-200">
                AI Search &amp; SEO Sensing Operating System
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SEO<span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Sensing</span> Intelligence Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unified control center for technical search engine crawling and AI answer engine visibility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Link href="/seo/projects" className="w-full sm:w-auto">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto">
                Launch New Audit
              </Button>
            </Link>
          </div>
        </div>

        {/* 2 Primary Module Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Module 1: SEO Optimization */}
          <Card className="p-5 sm:p-7 border-slate-200 bg-white shadow-xs rounded-2xl flex flex-col justify-between space-y-6 hover:border-blue-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  Active Engine
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">SEO Optimization</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Deterministic website crawler, robots.txt & XML sitemap analysis, on-page HTML tag inspections, and prioritized technical issues.
                </p>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <span>• Technical Health Scoring</span>
                <span>• BFS Web Crawler</span>
                <span>• Indexability Audits</span>
                <span>• Broken Link Detection</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono truncate">/seo/dashboard</span>
              <Link href="/seo/dashboard" className="shrink-0">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Open SEO Module
                </Button>
              </Link>
            </div>
          </Card>

          {/* Module 2: AEO Optimization */}
          <Card className="p-5 sm:p-7 border-slate-200 bg-white shadow-xs rounded-2xl flex flex-col justify-between space-y-6 hover:border-purple-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                  AI Answer Engine
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">AEO Optimization</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Monitor brand visibility, citation frequency, and buyer prompt positioning across ChatGPT Search, Perplexity AI, Google AI, and Gemini.
                </p>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <span>• AI Visibility Rate %</span>
                <span>• Engine Status (5 Models)</span>
                <span>• Tracked Buyer Prompts</span>
                <span>• Source Citations</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono truncate">/aeo/dashboard</span>
              <Link href="/aeo/dashboard" className="shrink-0">
                <Button variant="aeo" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Open AEO Module
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
