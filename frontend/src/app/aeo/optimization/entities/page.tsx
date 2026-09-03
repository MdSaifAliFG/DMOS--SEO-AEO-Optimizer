"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { AeoProject, AeoEntityGapResponse, AeoEntityGapItem } from "@/lib/types";
import {
  Sparkles,
  Network,
  AlertTriangle,
  Flame,
  CheckCircle2,
  RefreshCw,
  Search,
  Tag,
  Boxes,
} from "lucide-react";

export default function AeoEntityOptimizationPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [data, setData] = useState<AeoEntityGapResponse | null>(null);
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

  const fetchEntityGaps = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAeoEntityGaps(selectedProjectId);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze entity knowledge graph");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchEntityGaps();
  }, [fetchEntityGaps]);

  const filteredEntities = (data?.entities_list || []).filter((e) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.concepts.some((c) => c.toLowerCase().includes(q))
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-b border-purple-900/40 text-white pt-8 pb-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Network className="w-4 h-4" />
              Entity Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Entity Health & Knowledge Graph
            </h1>
            <p className="text-purple-200/80 text-sm sm:text-base mt-1 max-w-2xl">
              Inspect how AI LLMs associate your brand name, products, and core concepts inside their internal vector knowledge space.
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
              onClick={fetchEntityGaps}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-900/40 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Re-analyze Entities
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-slate-500 block">Total Entities</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {data?.total_entities_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-purple-700 block">Brand Entities</span>
            <span className="text-2xl font-black text-purple-950 mt-1 block">
              {data?.brand_entities_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-blue-700 block">Product Entities</span>
            <span className="text-2xl font-black text-blue-950 mt-1 block">
              {data?.product_entities_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-indigo-700 block">Service Entities</span>
            <span className="text-2xl font-black text-indigo-950 mt-1 block">
              {data?.service_entities_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-slate-600 block">Industry Entities</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {data?.industry_entities_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-rose-700 block">Weak Entities</span>
            <span className="text-2xl font-black text-rose-950 mt-1 block">
              {data?.weak_entities_count ?? "—"}
            </span>
          </div>
        </div>

        {/* Entity Gaps & Action Items */}
        {(data?.gaps || []).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Entity Optimization Action Items
            </h3>
            <div className="space-y-3">
              {data?.gaps.map((gap, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getPriorityBadge(gap.priority)}
                      <span className="font-bold text-slate-900 text-sm">{gap.entity}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold text-[10px]">
                        {gap.type}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium">{gap.gap}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-purple-950 font-medium sm:max-w-md">
                    <span className="font-bold text-purple-700 block text-[10px] uppercase">Strategy</span>
                    {gap.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entity Knowledge Graph Cards */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-600" />
              Tracked Entities & Concept Associations
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entities..."
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 w-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Extracting knowledge graph entities...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No entities found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntities.map((ent, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 hover:border-purple-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{ent.name}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                        {ent.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">{ent.visibility_rate}%</span>
                      <span className="text-[10px] text-slate-500 block">visibility</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Associated Concepts
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ent.concepts.length > 0 ? (
                        ent.concepts.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No associated concepts detected</span>
                      )}
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
