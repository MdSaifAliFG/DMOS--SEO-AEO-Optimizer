"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Clock,
  ExternalLink,
  Target,
  Users,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoExecutiveIntelligence, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoExecutiveIntelligencePage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [intelligence, setIntelligence] = useState<AeoExecutiveIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { success, error } = useToast();

  // Load Projects
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
        error("Failed to load AEO projects", err.message);
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Load Executive Intelligence
  const loadIntelligence = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoExecutiveIntelligence(projId);
      setIntelligence(data);
    } catch (err: any) {
      error("Failed to load intelligence", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadIntelligence(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRefresh = async () => {
    if (!selectedProjectId) return;
    setIsRefreshing(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Monitoring analysis triggered", "Updating intelligence metrics...");
      setTimeout(() => {
        loadIntelligence(selectedProjectId);
        setIsRefreshing(false);
      }, 3000);
    } catch (err: any) {
      error("Failed to refresh monitoring", err.message);
      setIsRefreshing(false);
    }
  };

  const getHealthBadge = (status: string) => {
    if (status === "Healthy") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          Healthy
        </span>
      );
    }
    if (status === "Critical Risk") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
          Critical Risk
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
        Attention Needed
      </span>
    );
  };

  const getFreshnessBadge = (freshness: string) => {
    if (freshness === "Fresh") {
      return <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Fresh (&lt;7d)</span>;
    }
    if (freshness === "Recent") {
      return <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">Recent</span>;
    }
    if (freshness === "Stale") {
      return <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">Stale (&gt;30d)</span>;
    }
    return <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">No Data</span>;
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">Executive AEO Intelligence</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Phase 7
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-xl">
              High-level strategic overview of your brand's AI answer health, share of voice, top risks, and recent movements.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-purple-900/60 border border-purple-700/60 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-purple-300" />}
              className="bg-purple-900/40 border-purple-700/60 text-white hover:bg-purple-800 text-xs h-8"
            >
              Update Intelligence
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Synthesizing executive intelligence...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xs">
            <Brain className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-900 dark:text-white">No AEO Projects Found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Create an AEO project to synthesize executive intelligence across generative AI engines.
            </p>
            <div className="mt-5 flex justify-center">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl">
                  Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : !intelligence ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
            <Brain className="w-10 h-10 text-purple-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Intelligence Available</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a project with completed analyses to view intelligence.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Monitoring Health */}
              <Card className="p-5 border-purple-100 dark:border-purple-900/40 bg-white dark:bg-[#0f172a] shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-purple-700 dark:text-purple-400">Monitoring Health</span>
                  {getHealthBadge(intelligence.monitoring_health_status)}
                </div>
                <div className="text-3xl font-black text-purple-950 dark:text-purple-100 mt-1">
                  {intelligence.monitoring_health_score}/100
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Based on score, trends &amp; active risks</p>
              </Card>

              {/* AEO Visibility Score */}
              <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Current AEO Score</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {intelligence.aeo_score !== null && intelligence.aeo_score !== undefined ? `${intelligence.aeo_score}/100` : "Untested"}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Organic AI visibility benchmark</p>
              </Card>

              {/* Share of Voice */}
              <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block">AI Answer Share of Voice</span>
                <div className="text-3xl font-black text-indigo-950 dark:text-indigo-200 mt-1">
                  {intelligence.competitive_position.brand_share_of_voice}%
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">vs {intelligence.competitive_position.competitors_tracked} competitors</p>
              </Card>

              {/* Data Freshness */}
              <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Data Freshness</span>
                  {getFreshnessBadge(intelligence.data_freshness)}
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2 truncate">
                  {intelligence.last_analyzed_at ? new Date(intelligence.last_analyzed_at).toLocaleDateString() : "Never"}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Last analysis execution</p>
              </Card>
            </div>

            {/* Narrative Executive Summary */}
            <Card className="p-6 border-purple-200 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/30 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200">
                  Deterministic Executive Summary
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {intelligence.executive_summary}
              </p>
            </Card>

            {/* Two-Column Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: What Changed? */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">What Changed? (Top Movements)</h3>
                  </div>
                  <Link
                    href="/aeo/changes"
                    className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 inline-flex items-center gap-1"
                  >
                    View All Changes <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {intelligence.recent_changes.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
                    No change events recorded yet. Run multiple analyses to track deltas.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {intelligence.recent_changes.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              c.severity === "critical"
                                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                                : c.severity === "high"
                                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                                : "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300"
                            }`}
                          >
                            {c.severity}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {new Date(c.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">{c.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Right Column: Top Risks & Alerts */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Visibility Risks</h3>
                  </div>
                  <Link
                    href="/aeo/alerts"
                    className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 inline-flex items-center gap-1"
                  >
                    Alert Center <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {intelligence.top_risks.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 dark:text-slate-400 space-y-1">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No Active High-Priority Risks</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">No unresolved critical threshold alerts detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {intelligence.top_risks.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-950 dark:text-rose-200">{r.title}</span>
                          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">{r.severity}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">{r.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Top Opportunities */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <Target className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      Top Recommended Actions
                    </div>
                    <Link href="/aeo/actions" className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:underline">
                      Action Center
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {intelligence.top_opportunities.map((o) => (
                      <div key={o.id} className="p-2.5 rounded-xl bg-purple-50/30 dark:bg-purple-950/30 border border-purple-100/60 dark:border-purple-800/60 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{o.title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{o.category}</div>
                        </div>
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-400 shrink-0">+{o.estimated_impact} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
