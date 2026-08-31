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
  Quote,
  HelpCircle,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const SEOAEOSection: React.FC = () => {
  return (
    <section id="engines" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Unified Intelligence
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One platform. Two optimization engines.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Optimize for traditional search algorithms and the rapidly evolving world of AI-synthesized answer models in one integrated workspace.
          </p>
        </div>

        {/* Two Large Side-By-Side Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: SEO Optimization */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-200/80 shadow-sm flex flex-col justify-between space-y-8 hover:border-blue-300 transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">SEO Optimization</h3>
                    <span className="text-xs text-blue-600 font-semibold">
                      Search Engine Discoverability & Health
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                  Traditional SERP
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic technical audits, automated BFS website crawling, indexability diagnostics, link topology analysis, and on-page HTML tag validation.
              </p>

              {/* Checklist Features */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-medium pt-2">
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

            <div className="pt-6 border-t border-blue-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Module: /seo/*</span>
              <Link href="/seo/dashboard">
                <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore SEO →
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: AEO Optimization */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-200/80 shadow-sm flex flex-col justify-between space-y-8 hover:border-purple-300 transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/25">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">AEO Optimization</h3>
                    <span className="text-xs text-purple-600 font-semibold">
                      Answer Engine Visibility & Citations
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                  AI Answer Engines
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor brand visibility, citation frequency, and synthesized answers across ChatGPT Search, Perplexity AI, Google AI Overviews, Gemini, and Microsoft Copilot.
              </p>

              {/* Checklist Features */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-medium pt-2">
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

            <div className="pt-6 border-t border-purple-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Module: /aeo/*</span>
              <Link href="/aeo/dashboard">
                <Button size="md" variant="aeo" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore AEO →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
