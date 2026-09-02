"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Sliders,
  Type,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Project, SEOPage, ContentOptimizationResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ContentOptimizationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const [analysis, setAnalysis] = useState<ContentOptimizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Load Projects
  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        const res = await api.getProjects({ limit: 50 });
        setProjects(res.projects);
        if (res.projects.length > 0) {
          setSelectedProjectId(res.projects[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
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
        const latestScan = scansRes.scans.find((s: any) => s.status === "completed") || scansRes.scans[0];
        if (latestScan) {
          const res = await api.getScanPages(latestScan.id, { page_size: 50 });
          setPages(res.pages);
          if (res.pages.length > 0) {
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

  const runAnalysis = async (pageId: string, pageUrl?: string) => {
    try {
      setIsAnalyzing(true);
      const res = await api.optimizeContent({
        project_id: selectedProjectId,
        page_id: pageId,
        target_url: pageUrl,
      });
      setAnalysis(res);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Content Health & Hierarchy
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Content Optimization
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Analyze substantive text depth, heading hierarchy, and thin content opportunities for crawled pages.
          </p>
        </div>

        {/* Project Selector & Actions Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400 font-medium">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/seo/actions"
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            ← Back to Actions
          </Link>
        </div>
      </div>

      {/* Page Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <label className="text-xs text-slate-400 font-medium shrink-0">Selected Page:</label>
          <select
            value={selectedPageId}
            onChange={(e) => handlePageSelect(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500 w-full max-w-lg cursor-pointer"
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900">
                {p.url.replace(/^https?:\/\/[^/]+/, "") || "/"} — ({p.word_count || 0} words)
              </option>
            ))}
          </select>
        </div>

        {selectedPageId && (
          <button
            onClick={() => handlePageSelect(selectedPageId)}
            disabled={isAnalyzing}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-xs rounded-lg border border-slate-700 transition flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isAnalyzing && "animate-spin")} /> Re-Analyze Page
          </button>
        )}
      </div>

      {/* Analysis Content */}
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          Analyzing page content structure...
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">Body Word Count</div>
              <div className="text-2xl font-bold text-white mt-1">{analysis.word_count} words</div>
              <div
                className={cn(
                  "text-[11px] font-semibold mt-1",
                  analysis.word_count_status === "optimal" && "text-emerald-400",
                  analysis.word_count_status === "acceptable" && "text-blue-400",
                  analysis.word_count_status === "thin" && "text-rose-400"
                )}
              >
                Status: {analysis.word_count_status.toUpperCase()} (Target: 600+ words)
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">H1 Main Headings</div>
              <div className="text-2xl font-bold text-white mt-1">{analysis.heading_structure.h1_count}</div>
              <div
                className={cn(
                  "text-[11px] font-semibold mt-1",
                  analysis.heading_structure.h1_count === 1 ? "text-emerald-400" : "text-amber-400"
                )}
              >
                {analysis.heading_structure.h1_count === 1 ? "Optimal (Single H1)" : "Needs Review"}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">H2 Sub-Headings</div>
              <div className="text-2xl font-bold text-white mt-1">{analysis.heading_structure.h2_count}</div>
              <div className="text-[11px] text-slate-400 mt-1">Structured topical sections</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">Readability Signal</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{analysis.readability_indicator}</div>
              <div className="text-[11px] text-slate-500 mt-1">Based on text structure</div>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Content Optimization Opportunities
            </h3>

            {analysis.recommendations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/50 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                This page meets standard content depth and heading hierarchy requirements.
              </div>
            ) : (
              <div className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          {rec.priority}
                        </span>
                        <span className="text-xs font-bold text-white">{rec.title}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rec.description}</p>
                    </div>

                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded shrink-0">
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
  );
}
