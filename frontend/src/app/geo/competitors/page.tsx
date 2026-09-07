"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoCompetitorResponse } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoCompetitorsPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [competitorData, setCompetitorData] = useState<GeoCompetitorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchCompetitors(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchCompetitors = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getGeoCompetitors(projectId);
      setCompetitorData(res);
    } catch (err) {
      error("Failed to load competitor data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    fetchCompetitors(projectId);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <Users className="w-3.5 h-3.5" />
              Generative Market Share & Gaps
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Competitor Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Benchmark brand share of voice, AI recommendation rates, and identify head-to-head visibility gaps across generative engines.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Project:</span>
              <select
                aria-label="Select GEO Project"
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium text-slate-900 dark:text-slate-100 shadow-sm"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand_name || p.name} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : !competitorData ? (
          <EmptyState
            icon={Users}
            title="No Competitor Intelligence Found"
            description="Select a project or run generative analysis to detect competitor share of voice and recommendations."
          />
        ) : (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Brand Share of Voice
                  </span>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {competitorData.brand_share_of_voice}%
                  </span>
                  <span className="text-xs text-slate-500">of total generative queries</span>
                </div>
              </Card>

              <Card className="p-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Tracked Competitors
                  </span>
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {competitorData.competitors.length}
                  </span>
                  <span className="text-xs text-slate-500">active benchmarks</span>
                </div>
              </Card>

              <Card className="p-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Identified Gaps
                  </span>
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {competitorData.competitors.filter((c) => c.geo_gap > 0).length}
                  </span>
                  <span className="text-xs text-slate-500">competitors outperforming brand</span>
                </div>
              </Card>
            </div>

            {/* Share of Voice Benchmark Grid */}
            <Card className="p-5 border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Head-to-Head Share of Voice Benchmark
              </h2>

              {competitorData.competitors.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No competitors configured for this project yet. Add competitors in Project Settings to start benchmarking.
                </div>
              ) : (
                <div className="space-y-4">
                  {competitorData.competitors.map((comp) => {
                    const mentionRate = comp.mention_rate || 0;
                    const recRate = comp.recommendation_rate || 0;
                    const sov = comp.share_of_voice || 0;

                    return (
                      <div
                        key={comp.name}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                              {comp.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {comp.name}
                              </h3>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {comp.domain || "No domain recorded"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-right">
                              <div className="text-slate-500">Mention Rate</div>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {mentionRate}%
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-slate-500">Recommendation Rate</div>
                              <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {recRate}%
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-slate-500">Share of Voice</div>
                              <div className="font-bold text-amber-600 dark:text-amber-400">
                                {sov}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar comparison */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Share of Voice Progress</span>
                            <span>{sov}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, sov)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Visibility Gaps Table */}
            <Card className="p-5 border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Generative Recommendation Gaps
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Competitors whose recommendation rates exceed your brand in generative search results.
              </p>

              {competitorData.competitors.filter((c) => c.geo_gap > 0).length === 0 ? (
                <div className="p-6 text-center border border-dashed border-emerald-200 dark:border-emerald-900/40 rounded-xl bg-emerald-50/20 dark:bg-emerald-950/10">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    No Recommendation Gaps Detected
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your brand recommendation rate matches or exceeds all tracked competitors.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                        <th className="py-2.5 px-3">Competitor</th>
                        <th className="py-2.5 px-3">Recommendation Rate</th>
                        <th className="py-2.5 px-3">GEO Gap</th>
                        <th className="py-2.5 px-3">Opportunity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {competitorData.competitors
                        .filter((c) => c.geo_gap > 0)
                        .map((gap, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                              {gap.name} {gap.domain ? `(${gap.domain})` : ""}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                              {gap.recommendation_rate}%
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-mono text-[11px]">
                                +{gap.geo_gap}% gap
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                <Zap className="w-3 h-3" />
                                Build Comparison Matrix
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
