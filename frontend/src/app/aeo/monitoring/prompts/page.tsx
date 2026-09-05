"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Target,
  FileCheck,
  Bot,
  Sparkles,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoPromptMovementItem, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoPromptMovementsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [movements, setMovements] = useState<AeoPromptMovementItem[]>([]);
  const [movementFilter, setMovementFilter] = useState<string>("all");
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

  const loadMovements = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoPromptMovements(projId, movementFilter);
      setMovements(data || []);
    } catch (err: any) {
      error("Failed to load prompt movements", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadMovements(selectedProjectId);
    }
  }, [selectedProjectId, movementFilter]);

  const handleRefresh = async () => {
    if (!selectedProjectId) return;
    setIsRefreshing(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Prompt analysis triggered", "Calculating prompt-level trajectory...");
      setTimeout(() => {
        loadMovements(selectedProjectId);
        setIsRefreshing(false);
      }, 2500);
    } catch (err: any) {
      error("Refresh failed", err.message);
      setIsRefreshing(false);
    }
  };

  const filteredMovements = movements.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const gainedCount = movements.filter((m) => m.movement === "gained").length;
  const lostCount = movements.filter((m) => m.movement === "lost").length;
  const unchangedCount = movements.filter((m) => m.movement === "unchanged").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <MessageSquare className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Prompt Movement Tracker
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Prompt Trajectory Tracking
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Monitor individual query volatility, tracking where your brand has gained or lost AI answer mentions.
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
              <span>{isRefreshing ? "Auditing..." : "Re-test Prompts"}</span>
            </Button>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <span className="text-xs font-semibold text-slate-500">Total Tracked Prompts</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{movements.length}</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" /> Gained Mentions
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">{gainedCount}</p>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1 uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5" /> Lost Mentions
            </span>
            <p className="text-2xl sm:text-3xl font-black text-rose-950 mt-1">{lostCount}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Minus className="w-3.5 h-3.5" /> Unchanged Mentions
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-700 mt-1">{unchangedCount}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["all", "gained", "lost", "unchanged"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setMovementFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  movementFilter === filter
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
              placeholder="Search prompts or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 focus:ring-1 focus:ring-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Movements Table */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Loading Prompt Trajectories...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to begin analyzing prompt movements and tracking answer visibility shifts.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : filteredMovements.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Prompt Movements Recorded</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Prompt movement tracking requires consecutive analysis snapshots. Track questions and run an AEO analysis to observe trajectory shifts.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={handleRefresh} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow">
                Run Analysis Now
              </Button>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Prompt / Query</th>
                    <th className="py-3 px-4 font-bold">Category / Intent</th>
                    <th className="py-3 px-4 font-bold">Provider</th>
                    <th className="py-3 px-4 font-bold">Movement</th>
                    <th className="py-3 px-4 font-bold">Visibility</th>
                    <th className="py-3 px-4 font-bold">Citation</th>
                    <th className="py-3 px-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMovements.map((item) => (
                    <tr key={item.question_id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 max-w-md">
                        <span className="font-bold text-slate-900 block truncate">{item.prompt}</span>
                        <span className="text-[11px] text-slate-500">
                          Was: {item.previous_status} &rarr; Now: {item.current_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-800 font-semibold">{item.category}</span>
                          <span className="text-[10px] text-slate-500 capitalize">{item.intent}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 uppercase font-bold">
                          {item.provider}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.movement === "gained" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                            <TrendingUp className="w-3 h-3" /> Gained
                          </span>
                        ) : item.movement === "lost" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1 w-fit">
                            <TrendingDown className="w-3 h-3" /> Lost
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 w-fit">
                            <Minus className="w-3 h-3" /> Unchanged
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900">{item.visibility_score}</span>
                        <span className="text-slate-400"> / 100</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.citation_found ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cited
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">Not cited</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link href={`/aeo/optimize/content?question=${encodeURIComponent(item.prompt)}`}>
                          <Button size="sm" variant="secondary" className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 text-xs font-semibold rounded-lg px-2.5 py-1">
                            Optimize
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
