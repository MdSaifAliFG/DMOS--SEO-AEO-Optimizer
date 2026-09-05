"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  BarChart3,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Target,
  Shield,
  HelpCircle,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoCompetitorIntelligenceResponse, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoCompetitorsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [data, setData] = useState<AeoCompetitorIntelligenceResponse | null>(null);
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

  const loadCompetitors = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const res = await api.getAeoCompetitorIntelligence(projId);
      setData(res);
    } catch (err: any) {
      error("Failed to load competitor intelligence", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadCompetitors(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRefresh = async () => {
    if (!selectedProjectId) return;
    setIsRefreshing(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Competitor analysis triggered", "Re-evaluating AI share of voice...");
      setTimeout(() => {
        loadCompetitors(selectedProjectId);
        setIsRefreshing(false);
      }, 2500);
    } catch (err: any) {
      error("Refresh failed", err.message);
      setIsRefreshing(false);
    }
  };

  const getTrendBadge = (trend: "gaining" | "losing" | "stable", delta: number) => {
    if (trend === "gaining") {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-bold">
          <TrendingUp className="w-3 h-3" />
          {delta > 0 ? `+${delta.toFixed(1)}%` : "Gaining"}
        </span>
      );
    }
    if (trend === "losing") {
      return (
        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-xs font-bold">
          <TrendingDown className="w-3 h-3" />
          {delta < 0 ? `${delta.toFixed(1)}%` : "Losing"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-xs font-semibold">
        <Minus className="w-3 h-3" />
        Stable
      </span>
    );
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Users className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Competitor AI Share of Voice
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Share of Voice Tracking
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Analyze brand mention dominance against top market competitors across generative engine answers.
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
              <span>{isRefreshing ? "Auditing..." : "Refresh Intelligence"}</span>
            </Button>
          </div>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Computing AI Share of Voice...</p>
            <p className="text-xs text-slate-500 mt-1">Cross-referencing brand vs competitor mentions in answers</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to benchmark brand share of voice and track competitor movements in AI responses.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : !data || !data.has_data ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Competitor Data Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No competitor mentions have been detected yet. Run an analysis across targeted search questions to uncover which competitors AI engines are recommending.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                onClick={handleRefresh}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
              >
                Run Analysis Now
              </Button>
              <Link href="/aeo/questions">
                <Button variant="secondary" className="border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl">
                  Manage Questions
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200/80 rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Brand Share of Voice</span>
                <p className="text-2xl sm:text-3xl font-black text-purple-950 mt-1">
                  {data.brand_share_of_voice.toFixed(1)}%
                </p>
                <div className="w-full bg-purple-200/60 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, data.brand_share_of_voice))}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Market Mentions</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {data.total_market_mentions}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">Brand & competitors</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Top Competitor</span>
                <p className="text-lg font-bold text-slate-900 mt-2 truncate">
                  {data.highest_share_of_voice || "None detected"}
                </p>
                <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Highest SoV</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Biggest Gainer</span>
                <p className="text-lg font-bold text-emerald-700 mt-2 truncate">
                  {data.biggest_gainer?.name || "--"}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  {data.biggest_gainer ? `${data.biggest_gainer.delta} gain` : "No movement"}
                </span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Biggest Loser</span>
                <p className="text-lg font-bold text-rose-700 mt-2 truncate">
                  {data.biggest_loser?.name || "--"}
                </p>
                <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                  {data.biggest_loser ? `${data.biggest_loser.delta} loss` : "No movement"}
                </span>
              </div>
            </div>

            {/* Share of Voice Distribution Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Share of Voice Distribution</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comparative distribution of direct AI answer mentions across all queries
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  Tracked Entities: <strong className="text-slate-900">{data.comparison_chart_data.length}</strong>
                </span>
              </div>

              {/* Progress Distribution Bar */}
              <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200 p-1 gap-1">
                {data.comparison_chart_data.map((item, idx) => {
                  const colors = [
                    "bg-purple-600",
                    "bg-blue-600",
                    "bg-emerald-600",
                    "bg-amber-500",
                    "bg-rose-500",
                    "bg-indigo-600",
                    "bg-teal-600",
                  ];
                  const barColor = item.is_brand ? "bg-purple-700" : colors[(idx + 1) % colors.length];
                  return (
                    <div
                      key={item.name}
                      style={{ width: `${Math.max(2, item.share_of_voice)}%` }}
                      className={`${barColor} h-full transition-all relative group rounded-md flex items-center justify-center`}
                      title={`${item.name}: ${item.share_of_voice.toFixed(1)}%`}
                    >
                      {item.share_of_voice >= 8 && (
                        <span className="text-[10px] font-bold text-white truncate px-1">
                          {item.name} ({item.share_of_voice.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
                {data.comparison_chart_data.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        item.is_brand ? "bg-purple-700 ring-2 ring-purple-300" : "bg-slate-400"
                      }`}
                    />
                    <span className={item.is_brand ? "font-bold text-slate-900" : "text-slate-600"}>
                      {item.name} {item.is_brand && "(Your Brand)"}
                    </span>
                    <span className="text-slate-400 font-mono">({item.share_of_voice.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Competitor Rankings & Trajectory</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed breakdown of competitor mention frequency and citation backing
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Entity</th>
                      <th className="py-3 px-4 font-bold">Mentions</th>
                      <th className="py-3 px-4 font-bold">Citations</th>
                      <th className="py-3 px-4 font-bold">Share of Voice</th>
                      <th className="py-3 px-4 font-bold">Avg Position</th>
                      <th className="py-3 px-4 font-bold">Movement Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {/* Brand Row First */}
                    <tr className="bg-purple-50/50 font-medium">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-700" />
                          <span className="font-bold text-purple-950">{data.brand_name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            Your Brand
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {data.comparison_chart_data.find((c) => c.is_brand)?.mentions || 0}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-purple-800">
                        {data.comparison_chart_data.find((c) => c.is_brand)?.citations || 0}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900">
                          {data.brand_share_of_voice.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">--</td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-purple-700">Primary Baseline</span>
                      </td>
                    </tr>

                    {/* Competitor Rows */}
                    {data.competitors_tracked.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No competitor entities extracted from answers yet.
                        </td>
                      </tr>
                    ) : (
                      data.competitors_tracked.map((comp) => (
                        <tr key={comp.name} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {comp.name}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{comp.mention_count}</td>
                          <td className="py-3.5 px-4 text-slate-500">{comp.citation_count}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {comp.share_of_voice.toFixed(1)}%
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {comp.average_position ? `#${comp.average_position.toFixed(1)}` : "N/A"}
                          </td>
                          <td className="py-3.5 px-4">
                            {getTrendBadge(comp.trend, comp.delta)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
