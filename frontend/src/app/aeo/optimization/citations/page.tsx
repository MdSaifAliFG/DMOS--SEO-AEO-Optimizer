"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AeoProject, AeoCitationGapResponse, AeoCitationOpportunity } from "@/lib/types";
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Globe,
  Share2,
} from "lucide-react";

export default function AeoCitationOpportunitiesPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [data, setData] = useState<AeoCitationGapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchCitationsGaps = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAeoCitationGaps(selectedProjectId);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze citation gaps");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchCitationsGaps();
  }, [fetchCitationsGaps]);

  const filteredOpportunities = (data?.opportunities || []).filter((op) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        op.prompt.toLowerCase().includes(q) ||
        op.category.toLowerCase().includes(q) ||
        op.competitor_sources.some((s) => s.toLowerCase().includes(q))
      );
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
                <Share2 className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">AEO Citation Opportunities</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Citation Authority
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Track source URLs and authority domains AI engines cite when answering prompts in your industry.
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
              onClick={fetchCitationsGaps}
              disabled={loading}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Re-analyze Citations
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-2">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs uppercase font-bold text-slate-500 block">Total Citations</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {data?.total_citations ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-emerald-700 block">Own Domain Citations</span>
            <span className="text-3xl font-black text-emerald-950 mt-1 block">
              {data?.own_citations_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-rose-700 block">Competitor Citations</span>
            <span className="text-3xl font-black text-rose-950 mt-1 block">
              {data?.competitor_citations_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-blue-700 block">3rd Party Sources</span>
            <span className="text-3xl font-black text-blue-950 mt-1 block">
              {data?.third_party_citations_count ?? "—"}
            </span>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-5 rounded-2xl text-white shadow-md">
            <span className="text-xs uppercase font-bold text-purple-300 block">Own Citation Share</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white">{data?.own_citation_share ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* Top Cited Domains Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            Top Cited Domains Across Answer Engines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(data?.top_cited_domains || []).map((d, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  d.is_own
                    ? "bg-emerald-50/50 border-emerald-200"
                    : d.is_competitor
                    ? "bg-amber-50/50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs truncate" title={d.domain}>
                    {d.domain}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded capitalize ${
                      d.is_own
                        ? "bg-emerald-100 text-emerald-800"
                        : d.is_competitor
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {d.is_own ? "Own Brand" : d.is_competitor ? "Competitor" : "Third Party"}
                  </span>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-lg font-black text-slate-900">{d.count}</span>
                  <span className="text-[10px] text-slate-500 ml-1">citations</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex items-center justify-between">
          <div className="font-bold text-slate-900 text-sm">
            Opportunities with Missing Brand Citation
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts or sources..."
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Analyzing engine citations...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-800">No Citation Gaps Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your domain is properly cited for all evaluated answer queries.
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
                    <th className="py-3.5 px-4">Competitor Sources Cited</th>
                    <th className="py-3.5 px-4">Recommended Citation Strategy</th>
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
                        {op.competitor_sources.length > 0 ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            {op.competitor_sources.map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">3rd Party Only</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {op.recommendation}
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
