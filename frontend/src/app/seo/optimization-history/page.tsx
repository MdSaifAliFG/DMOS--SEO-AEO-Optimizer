"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Calendar,
  Sparkles,
  BarChart3,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Project, OptimizationHistoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function OptimizationHistoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [history, setHistory] = useState<OptimizationHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load Projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getProjects({ limit: 50 });
        setProjects(res.projects);
        if (res.projects.length > 0) {
          setSelectedProjectId(res.projects[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProjects();
  }, []);

  // Load History for Project
  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadHistory() {
      try {
        setLoading(true);
        const res = await api.getOptimizationHistory(selectedProjectId, 20);
        setHistory(res.comparisons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [selectedProjectId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-sky-300" /> Scan-to-Scan Comparisons
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              SEO Optimization History
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track SEO score improvements, resolved issues, and health progression across consecutive website audits.
          </p>
        </div>

        {/* Project Selector & Actions Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-sky-300 font-medium">Project:</span>
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
            className="px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition shadow-xs"
          >
            Go to Actions Center
          </Link>
        </div>
      </div>

      {/* Comparisons Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          Loading optimization history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No Comparison History Yet</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Run at least two consecutive SEO audits on this project to compare score improvements, resolved issues, and page health deltas.
          </p>
          <Link
            href="/seo/dashboard"
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Start New Audit
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => {
            const isPositive = item.score_change >= 0;
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md hover:border-slate-700 transition"
              >
                {/* Comparison Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-300">
                        Audit Comparison #{history.length - idx}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Recorded on {new Date(item.created_at).toLocaleDateString()} at{" "}
                        {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  {/* Score Delta Badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Score Evolution</div>
                      <div className="text-sm font-bold text-slate-200">
                        {item.previous_score !== null ? `${item.previous_score} pts` : "Initial"} →{" "}
                        <span className="text-white">{item.current_score} pts</span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border",
                        isPositive
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      )}
                    >
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isPositive ? `+${item.score_change}` : item.score_change} pts
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Issues Resolved
                    </div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">{item.issues_resolved}</div>
                    <div className="text-[10px] text-slate-500">Fixed since last scan</div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> New Issues
                    </div>
                    <div className="text-xl font-bold text-rose-400 mt-1">{item.new_issues}</div>
                    <div className="text-[10px] text-slate-500">Newly detected</div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-amber-400 font-semibold">Remaining Issues</div>
                    <div className="text-xl font-bold text-amber-400 mt-1">{item.remaining_issues}</div>
                    <div className="text-[10px] text-slate-500">Still requiring fixes</div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-blue-400 font-semibold">Pages Improved</div>
                    <div className="text-xl font-bold text-blue-400 mt-1">{item.pages_improved}</div>
                    <div className="text-[10px] text-slate-500">Higher page score</div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-purple-400 font-semibold">Pages Declined</div>
                    <div className="text-xl font-bold text-purple-400 mt-1">{item.pages_declined}</div>
                    <div className="text-[10px] text-slate-500">Lower page score</div>
                  </div>
                </div>

                {/* Category Changes Summary */}
                {Object.keys(item.category_score_changes || {}).length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-medium">Category Changes:</span>
                    {Object.entries(item.category_score_changes).map(([cat, delta]) => (
                      <span
                        key={cat}
                        className={cn(
                          "px-2 py-0.5 rounded font-mono font-medium",
                          delta > 0 && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                          delta < 0 && "bg-rose-500/10 text-rose-400 border border-rose-500/20",
                          delta === 0 && "bg-slate-800 text-slate-400"
                        )}
                      >
                        {cat.toUpperCase()}: {delta > 0 ? `+${delta}` : delta}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
