"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Tag,
  Sparkles,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoEntityMovementItem, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoEntityMovementsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [entities, setEntities] = useState<AeoEntityMovementItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { success, error } = useToast();

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getAeoProjects({ limit: 50 });
        const list = res.projects || [];
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId(list[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        error("Failed to load projects", err.message);
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const loadEntities = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoEntityMovements(projId);
      setEntities(data || []);
    } catch (err: any) {
      error("Failed to load entity movements", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadEntities(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRefresh = async () => {
    if (!selectedProjectId) return;
    setIsRefreshing(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Entity analysis triggered", "Re-extracting knowledge graph entities from AI answers...");
      setTimeout(() => {
        loadEntities(selectedProjectId);
        setIsRefreshing(false);
      }, 2500);
    } catch (err: any) {
      error("Refresh failed", err.message);
      setIsRefreshing(false);
    }
  };

  const filteredEntities = entities.filter((item) => {
    if (typeFilter !== "all" && item.entity_type !== typeFilter) return false;
    if (!searchQuery) return true;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entity_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const brandEntitiesCount = entities.filter((e) => e.entity_type === "brand").length;
  const avgConfidence =
    entities.length > 0
      ? (entities.reduce((acc, curr) => acc + (curr.confidence_score || 0), 0) / entities.length) * 100
      : 0;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Layers className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Entity Movement Tracker
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Knowledge Graph Health
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Audit how AI models associate your brand, products, and industry concepts within their knowledge representations.
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
                      {p.brand_name || p.name || p.domain}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || !selectedProjectId}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl px-3.5 py-1.5 shadow transition disabled:opacity-50 flex items-center gap-1.5 border-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Analyzing..." : "Re-index Entities"}</span>
            </Button>
          </div>
        </div>

        {/* Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <span className="text-xs font-semibold text-slate-500">Tracked Entities</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{entities.length}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Extracted from AI answers</span>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Brand Entities</span>
            <p className="text-2xl sm:text-3xl font-black text-purple-950 mt-1">{brandEntitiesCount}</p>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Core brand associations</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <span className="text-xs font-semibold text-slate-500">Avg Knowledge Confidence</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{avgConfidence.toFixed(0)}%</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Extraction certainty index</span>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["all", "brand", "product", "service", "concept"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  typeFilter === filter
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search entities or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 focus:ring-1 focus:ring-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Entity List */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Inspecting Knowledge Graph Nodes...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Layers className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to monitor knowledge graph entities and brand concept linkages.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : filteredEntities.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Layers className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Entity Movements Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Entity tracking monitors how AI platforms associate your brand with industry concepts. Run an AEO analysis to detect entity nodes.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={handleRefresh} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow">
                Run Analysis Now
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntities.map((item) => (
              <div
                key={item.id || item.name}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                      <span className="text-xs text-purple-600 font-semibold capitalize">{item.entity_type}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        item.trend === "gaining"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : item.trend === "losing"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {item.trend === "gaining" && <TrendingUp className="w-3 h-3" />}
                      {item.trend === "losing" && <TrendingDown className="w-3 h-3" />}
                      {item.trend === "stable" && <Minus className="w-3 h-3" />}
                      {item.trend}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Mention Frequency</span>
                      <span className="font-bold text-slate-800">{item.frequency} times</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Confidence</span>
                      <span className="font-bold text-emerald-700">
                        {(item.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Associated Concepts */}
                  {item.associated_concepts && item.associated_concepts.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                        Associated Concepts
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.associated_concepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] bg-purple-50 text-purple-800 border border-purple-200/80 font-medium flex items-center gap-1"
                          >
                            <Tag className="w-2.5 h-2.5 text-purple-600" />
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
