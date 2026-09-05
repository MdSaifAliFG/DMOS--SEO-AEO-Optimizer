"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  BarChart3,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
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

  // Load History for Project
  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadHistory() {
      try {
        setLoading(true);
        const res = await api.getOptimizationHistory(selectedProjectId, 20);
        setHistory(res.comparisons || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [selectedProjectId]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <History className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">SEO Optimization History</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Audit Timeline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Track SEO score improvements, resolved issues, and health progression across consecutive website audits.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:shrink-0">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white text-slate-900">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              href="/seo/actions"
              className="px-3.5 py-2 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Actions
            </Link>
          </div>
        </div>

        {/* Comparisons Timeline */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-sky-600" />
            Loading optimization history...
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Comparison History Yet</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Run at least two consecutive SEO audits on this project to compare score improvements, resolved issues, and page health deltas.
            </p>
            <Link
              href="/seo/dashboard"
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold rounded-xl transition shadow-xs"
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
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs hover:border-slate-300 transition"
                >
                  {/* Comparison Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
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
                        <div className="text-xs text-slate-500">Score Evolution</div>
                        <div className="text-sm font-bold text-slate-700">
                          {item.previous_score !== null ? `${item.previous_score} pts` : "Initial"} →{" "}
                          <span className="text-slate-900">{item.current_score} pts</span>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border",
                          isPositive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        )}
                      >
                        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {isPositive ? `+${item.score_change}` : item.score_change} pts
                      </div>
                    </div>
                  </div>

                  {/* KPI Metrics Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Issues Resolved
                      </div>
                      <div className="text-xl font-bold text-slate-900 mt-1">{item.issues_resolved}</div>
                      <div className="text-[10px] text-slate-500">Fixed since last scan</div>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" /> New Issues
                      </div>
                      <div className="text-xl font-bold text-slate-900 mt-1">{item.new_issues}</div>
                      <div className="text-[10px] text-slate-500">Newly detected</div>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-amber-700 font-semibold">Remaining Issues</div>
                      <div className="text-xl font-bold text-slate-900 mt-1">{item.remaining_issues}</div>
                      <div className="text-[10px] text-slate-500">Still requiring fixes</div>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-sky-700 font-semibold">Pages Improved</div>
                      <div className="text-xl font-bold text-slate-900 mt-1">{item.pages_improved}</div>
                      <div className="text-[10px] text-slate-500">Higher page score</div>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-700 font-semibold">Pages Declined</div>
                      <div className="text-xl font-bold text-slate-900 mt-1">{item.pages_declined}</div>
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
                            "px-2 py-0.5 rounded-md font-mono font-medium border",
                            delta > 0 && "bg-emerald-50 text-emerald-700 border-emerald-200",
                            delta < 0 && "bg-rose-50 text-rose-700 border-rose-200",
                            delta === 0 && "bg-slate-100 text-slate-600 border-slate-200"
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
    </DashboardShell>
  );
}
