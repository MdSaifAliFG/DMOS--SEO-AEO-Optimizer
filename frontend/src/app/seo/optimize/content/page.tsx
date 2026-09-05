"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import {
  Project,
  SEOPage,
  ContentOptimizationResponse,
  ContentRecommendationItem,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ContentOptimizationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const [analysis, setAnalysis] = useState<ContentOptimizationResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Load Projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getProjects({ limit: 50 });
        setProjects(res.projects || []);
        if (res.projects?.length > 0) {
          setSelectedProjectId(res.projects[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProjects();
  }, []);

  // Load Pages when Project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadPages() {
      try {
        const scansRes = await api.getProjectScans(selectedProjectId, { limit: 5 });
        const latestScan = scansRes.scans?.find((s: any) => s.status === "completed") || scansRes.scans?.[0];
        if (latestScan) {
          const res = await api.getScanPages(latestScan.id, { page_size: 50 });
          setPages(res.pages || []);
          if (res.pages?.length > 0) {
            setSelectedPageId(res.pages[0].id);
            runAnalysis(res.pages[0].id, res.pages[0].url);
          }
        } else {
          setPages([]);
          setAnalysis(null);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPages();
  }, [selectedProjectId]);

  const runAnalysis = async (pageId: string, url: string) => {
    try {
      setIsAnalyzing(true);
      const res = await api.optimizeContent({
        project_id: selectedProjectId,
        page_id: pageId,
        target_url: url,
      });
      setAnalysis(res);
    } catch (err: any) {
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    const p = pages.find((item) => item.id === pageId);
    if (p) {
      runAnalysis(pageId, p.url);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-cyan-900 to-slate-900 text-white shadow-md border border-sky-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
                <Sparkles className="w-5 h-5 text-sky-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Content Optimization</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/20">
                Depth & Hierarchy
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-2xl">
              Analyze substantive text depth, heading hierarchy, and thin content opportunities for crawled pages.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-sky-950/80 border border-sky-700/60 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-sky-200">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              href="/seo/actions"
              className="px-3 py-1.5 text-xs font-medium bg-sky-900/60 hover:bg-sky-800/60 text-sky-100 rounded-xl border border-sky-700/60 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Actions
            </Link>
          </div>
        </div>

        {/* Page Selector Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <label className="text-xs text-slate-600 font-semibold shrink-0">Selected Page:</label>
            <select
              value={selectedPageId}
              onChange={(e) => handlePageSelect(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 w-full max-w-lg cursor-pointer transition"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.url.replace(/^https?:\/\/[^/]+/, "") || "/"} — ({p.word_count || 0} words)
                </option>
              ))}
            </select>
          </div>

          {selectedPageId && (
            <button
              onClick={() => handlePageSelect(selectedPageId)}
              disabled={isAnalyzing}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-sky-700 font-medium text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isAnalyzing && "animate-spin")} /> Re-Analyze Page
            </button>
          )}
        </div>

        {/* Analysis Content */}
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-sky-600" />
            Analyzing page content structure...
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Body Word Count</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{analysis.word_count} words</div>
                <div
                  className={cn(
                    "text-[11px] font-semibold mt-1",
                    analysis.word_count_status === "optimal" && "text-emerald-600",
                    analysis.word_count_status === "acceptable" && "text-sky-600",
                    analysis.word_count_status === "thin" && "text-rose-600"
                  )}
                >
                  Status: {analysis.word_count_status.toUpperCase()} (Target: 600+ words)
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">H1 Main Headings</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{analysis.heading_structure.h1_count}</div>
                <div
                  className={cn(
                    "text-[11px] font-semibold mt-1",
                    analysis.heading_structure.h1_count === 1 ? "text-emerald-600" : "text-amber-600"
                  )}
                >
                  {analysis.heading_structure.h1_count === 1 ? "Optimal (Single H1)" : "Needs Review"}
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">H2 Sub-Headings</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{analysis.heading_structure.h2_count}</div>
                <div className="text-[11px] text-slate-500 mt-1">Structured topical sections</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Readability Signal</div>
                <div className="text-2xl font-bold text-sky-600 mt-1">{analysis.readability_indicator}</div>
                <div className="text-[11px] text-slate-500 mt-1">Based on text structure</div>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Content Optimization Opportunities
              </h3>

              {analysis.recommendations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50/60 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  This page meets standard content depth and heading hierarchy requirements.
                </div>
              ) : (
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: ContentRecommendationItem, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-start justify-between gap-4 hover:border-slate-300 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            {rec.priority}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{rec.description}</p>
                      </div>

                      <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full shrink-0">
                        {rec.impact}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 text-sm">
            Select a project and crawled page to view content optimization recommendations.
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
