"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function OverviewPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Hub Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Marketing Operating System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              DMOS Intelligence Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unified control center for technical search engine crawling and AI answer engine visibility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/seo/projects">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch New Audit
              </Button>
            </Link>
          </div>
        </div>

        {/* 2 Primary Module Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 1: SEO Optimization */}
          <Card className="p-7 border-slate-200 bg-white shadow-xs rounded-2xl flex flex-col justify-between space-y-6 hover:border-blue-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  Active Engine
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">SEO Optimization</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Deterministic website crawler, robots.txt & XML sitemap analysis, on-page HTML tag inspections, and prioritized technical issues.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <span>• Technical Health Scoring</span>
                <span>• BFS Web Crawler</span>
                <span>• Indexability Audits</span>
                <span>• Broken Link Detection</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">/seo/dashboard</span>
              <Link href="/seo/dashboard">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Open SEO Module
                </Button>
              </Link>
            </div>
          </Card>

          {/* Module 2: AEO Optimization */}
          <Card className="p-7 border-slate-200 bg-white shadow-xs rounded-2xl flex flex-col justify-between space-y-6 hover:border-purple-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                  AI Answer Engine
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">AEO Optimization</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Monitor brand visibility, citation frequency, and buyer prompt positioning across ChatGPT Search, Perplexity AI, Google AI, and Gemini.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <span>• AI Visibility Rate %</span>
                <span>• Engine Status (5 Models)</span>
                <span>• Tracked Buyer Prompts</span>
                <span>• Source Citations</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">/aeo/dashboard</span>
              <Link href="/aeo/dashboard">
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
