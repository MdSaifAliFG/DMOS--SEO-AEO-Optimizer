"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AeoProject, AeoPromptGapResponse, AeoPromptOpportunity } from "@/lib/types";
import {
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  ArrowRight,
  TrendingUp,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function AeoPromptOpportunitiesPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [data, setData] = useState<AeoPromptGapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const fetchPromptGaps = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAeoPromptGaps(selectedProjectId);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze prompt opportunities");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchPromptGaps();
  }, [fetchPromptGaps]);

  const filteredOpportunities = (data?.opportunities || []).filter((op) => {
    if (intentFilter !== "all" && op.intent.toLowerCase() !== intentFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return op.prompt.toLowerCase().includes(q) || op.category.toLowerCase().includes(q);
    }
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === "critical") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-600" />
          Critical
        </span>
      );
    }
    if (p === "high") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          High
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        Medium
      </span>
    );
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Target className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Prompt & Query Opportunities</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Prompt Intelligence
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Understand which conversational queries your brand is absent from, and prioritize prompt positioning in AI answers.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-700/60 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-purple-200">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={fetchPromptGaps}
              disabled={loading}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Re-analyze Prompts
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs uppercase font-bold text-slate-500 block">Total Prompts</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {data?.total_tracked ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-emerald-700 block">Covered Prompts</span>
            <span className="text-3xl font-black text-emerald-950 mt-1 block">
              {data?.covered_prompts_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-rose-700 block">Uncovered Prompts</span>
            <span className="text-3xl font-black text-rose-950 mt-1 block">
              {data?.uncovered_prompts_count ?? "—"}
            </span>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-5 rounded-2xl text-white shadow-md">
            <span className="text-xs uppercase font-bold text-purple-300 block">Coverage Rate</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white">{data?.coverage_rate ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {["all", "informational", "commercial", "transactional", "navigational"].map((intent) => (
              <button
                key={intent}
                onClick={() => setIntentFilter(intent)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  intentFilter === intent
                    ? "bg-purple-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {intent}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts or categories..."
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Loading prompt opportunities...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-800">All Tracked Prompts Covered</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your brand appears in answer engine results for all tracked prompts in this filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Target Prompt</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Intent</th>
                    <th className="py-3.5 px-4">Competitors Mentioned</th>
                    <th className="py-3.5 px-4">Recommended Action</th>
                    <th className="py-3.5 px-4 text-right">Optimize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOpportunities.map((op, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/30 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(op.priority)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-md">
                        {op.prompt}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                        {op.category}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {op.intent}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {op.competitor_mentions.length > 0 ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            {op.competitor_mentions.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px]">
                        {op.recommended_action}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/aeo/optimize/answer?question=${encodeURIComponent(op.prompt)}`}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                        >
                          Optimize
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
