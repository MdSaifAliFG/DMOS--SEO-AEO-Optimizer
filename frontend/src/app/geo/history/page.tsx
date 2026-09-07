"use client";

import React, { useEffect, useState } from "react";
import {
  History,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoHistoryData } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoHistoryPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [historyData, setHistoryData] = useState<GeoHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "snapshots" | "changes" | "optimizations">("all");

  const { error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchHistory(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchHistory = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getGeoHistory(projectId);
      setHistoryData(res);
    } catch (err) {
      error("Failed to load history data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <History className="w-3.5 h-3.5" />
              Historical Audit Log
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Historical Timeline &amp; Uplifts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete historical record of generative visibility snapshots, crawler modifications, and verified score uplifts.
            </p>
          </div>

          {projects.length > 0 && (
            <select
              aria-label="Select GEO Project"
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                fetchHistory(e.target.value);
              }}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium text-slate-900 dark:text-slate-100 shadow-sm"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand_name || p.name} ({p.domain})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "all", label: "All Events" },
            { id: "optimizations", label: "Verified Uplifts" },
            { id: "snapshots", label: "Score Snapshots" },
            { id: "changes", label: "Change Detection" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === t.id
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        ) : !historyData ? (
          <EmptyState
            icon={History}
            title="No Historical Data Found"
            description="Run generative analyses and verify optimization actions to record historical timelines."
          />
        ) : (
          <div className="space-y-6">
            {/* Optimization Uplifts Timeline */}
            {(activeTab === "all" || activeTab === "optimizations") &&
              historyData.optimization_history?.length > 0 && (
                <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Verified Optimization Uplifts
                  </h2>
                  <div className="space-y-3">
                    {historyData.optimization_history.map((opt) => (
                      <div
                        key={opt.id}
                        className="p-3.5 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {opt.action}
                          </span>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Score uplift: {opt.before_score ?? "N/A"} → {opt.after_score ?? "N/A"}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <ArrowUpRight className="w-3.5 h-3.5" />+{opt.delta} pts (EST.)
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {opt.timestamp ? new Date(opt.timestamp).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Change Events */}
            {(activeTab === "all" || activeTab === "changes") &&
              historyData.change_events?.length > 0 && (
                <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Detected System &amp; Engine Changes
                  </h2>
                  <div className="space-y-3">
                    {historyData.change_events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px] font-mono">
                              {ev.event_type}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {ev.description}
                            </span>
                          </div>
                          {(ev.before_value || ev.after_value) && (
                            <div className="text-[11px] text-slate-400 mt-1">
                              Value: {ev.before_value} → {ev.after_value}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">
                          {ev.detected_at ? new Date(ev.detected_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Visibility Snapshots */}
            {(activeTab === "all" || activeTab === "snapshots") && (
              <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  Score &amp; Provider Snapshots
                </h2>
                {historyData.snapshots?.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No historical snapshots recorded yet. Run a generative analysis to create your first baseline snapshot.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {historyData.snapshots.map((snap) => (
                      <div
                        key={snap.id}
                        className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {snap.provider.toUpperCase()}
                          </span>
                          <span className="text-slate-500">
                            Score: <strong>{snap.geo_score ?? "N/A"}</strong>
                          </span>
                          <span className="text-slate-500">
                            Mention: <strong>{snap.mention_rate}%</strong>
                          </span>
                          <span className="text-slate-500">
                            Rec: <strong>{snap.recommendation_rate}%</strong>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {snap.created_at ? new Date(snap.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
