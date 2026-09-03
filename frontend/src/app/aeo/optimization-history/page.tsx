"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { AeoProject, AeoOptimizationHistoryResponse, AeoOptimizationHistoryComparison } from "@/lib/types";
import {
  Sparkles,
  History,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Layers,
} from "lucide-react";

export default function AeoOptimizationHistoryPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [historyData, setHistoryData] = useState<AeoOptimizationHistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getAeoProjects({ limit: 50 });
        setProjects(res.projects || []);
        if (res.projects?.length > 0) {
          setSelectedProjectId(res.projects[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      }
    }
    loadProjects();
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAeoOptimizationHistory(selectedProjectId, 20);
      setHistoryData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load optimization history");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const renderDeltaPill = (delta: number) => {
    if (delta > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
          <ArrowUpRight className="w-3 h-3" />
          +{delta}
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
          <ArrowDownRight className="w-3 h-3" />
          {delta}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
        <Minus className="w-3 h-3" />
        0
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-b border-purple-900/40 text-white pt-8 pb-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
              <History className="w-4 h-4" />
              Optimization Tracking
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              AEO Optimization History & Audit Deltas
            </h1>
            <p className="text-purple-200/80 text-sm sm:text-base mt-1 max-w-2xl">
              Compare visibility score changes, resolved action counts, and answer engine presence across successive scans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-purple-900/60 border border-purple-700/60 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-900/40 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-6">
        {/* Main List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Audit Timeline for {historyData?.project_name || "Project"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total completed audits analyzed: {historyData?.total_audits ?? 0}
              </p>
            </div>
            {historyData?.current_score !== undefined && (
              <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 text-right">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Current Visibility Score</span>
                <span className="text-xl font-black text-purple-950">{historyData.current_score ?? "—"}/100</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Loading historical comparison scans...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : (historyData?.comparisons || []).length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <History className="w-10 h-10 mx-auto mb-3 text-purple-300" />
              <h4 className="text-sm font-bold text-slate-800">No Historical Comparisons Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Run multiple AEO analyses on this project to view progression and score deltas over time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyData?.comparisons.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-purple-200 bg-slate-50/40 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-sm shrink-0">
                        #{historyData.comparisons.length - idx}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.audit_id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.score_label} • {item.questions_mentioned}/{item.total_questions} Questions Visible
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      {/* Score & Delta */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Score</span>
                        <div className="flex items-center gap-2 justify-end mt-0.5">
                          <span className="text-xl font-black text-slate-900">{item.overall_score}/100</span>
                          {renderDeltaPill(item.score_delta)}
                        </div>
                      </div>

                      {/* Mentions */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Mention Rate</span>
                        <div className="flex items-center gap-1.5 justify-end mt-0.5">
                          <span className="text-sm font-bold text-slate-800">{item.mention_score}%</span>
                          {renderDeltaPill(item.mention_delta)}
                        </div>
                      </div>

                      {/* Citations */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Citation Score</span>
                        <div className="flex items-center gap-1.5 justify-end mt-0.5">
                          <span className="text-sm font-bold text-slate-800">{item.citation_score}%</span>
                          {renderDeltaPill(item.citation_delta)}
                        </div>
                      </div>

                      {/* Actions count */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Resolved Tasks</span>
                        <span className="text-sm font-bold text-emerald-700 mt-0.5 block">
                          {item.resolved_actions_count} fixed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
