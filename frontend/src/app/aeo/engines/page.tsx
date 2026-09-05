"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Bot,
  Sparkles,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Search,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoEngineComparisonResponse, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoEngineComparisonPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [engineData, setEngineData] = useState<AeoEngineComparisonResponse | null>(null);
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

  const loadEngineComparison = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoEngineComparison(projId);
      setEngineData(data);
    } catch (err: any) {
      error("Failed to load engine comparison", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadEngineComparison(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRefresh = async () => {
    if (!selectedProjectId) return;
    setIsRefreshing(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Engine analysis refreshed", "Fetching updated multi-engine telemetry...");
      setTimeout(() => {
        loadEngineComparison(selectedProjectId);
        setIsRefreshing(false);
      }, 2500);
    } catch (err: any) {
      error("Refresh failed", err.message);
      setIsRefreshing(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "chatgpt":
      case "openai":
        return <Bot className="w-5 h-5 text-emerald-600" />;
      case "gemini":
      case "google":
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case "perplexity":
        return <Search className="w-5 h-5 text-purple-600" />;
      default:
        return <Brain className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Cpu className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                AI Engine Comparison & Parity
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Multi-Model Parity
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Monitor brand presence, mention parity, and citation rates across ChatGPT, Google Gemini, and Perplexity.
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
              <span>{isRefreshing ? "Analyzing..." : "Sync Engines"}</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Gathering Multi-Engine Intelligence...</p>
            <p className="text-xs text-slate-500 mt-1">Auditing ChatGPT, Gemini, and Perplexity visibility metrics</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Bot className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to start analyzing brand presence and visibility metrics across AI answer engines.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : !engineData || !engineData.has_data ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Bot className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Engine Data Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Multi-engine telemetry has not been collected for this project yet. Run an AEO analysis to discover brand presence across LLM answer engines.
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
            {/* Parity Banner */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-slate-50 border border-purple-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 border border-purple-200 rounded-xl text-purple-800">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">Cross-Engine Parity Status</h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          engineData.provider_parity.includes("Parity Achieved") || engineData.parity_ratio >= 0.8
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {engineData.provider_parity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                      Provider parity measures the consistency of your brand recommendations across different AI platforms. Higher parity ensures users receive consistent answers regardless of which assistant they ask.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-purple-200/60 pt-4 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Parity Ratio</span>
                    <p className="text-2xl font-black text-purple-950">
                      {(engineData.parity_ratio * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, engineData.parity_ratio * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Engine Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {engineData.engines.map((engine) => (
                <div
                  key={engine.provider}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                          {getProviderIcon(engine.provider)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{engine.display_name}</h3>
                          <span className="text-xs text-slate-400 capitalize">{engine.provider}</span>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          !engine.is_configured
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : engine.has_data
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {engine.status_label}
                      </span>
                    </div>

                    {!engine.is_configured ? (
                      <div className="py-8 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
                        <p className="text-sm font-bold text-slate-800">Provider Not Configured</p>
                        <p className="text-xs text-slate-500 mt-1">
                          API credentials are missing for this engine. Add the API key in environment settings to enable live querying.
                        </p>
                      </div>
                    ) : !engine.has_data ? (
                      <div className="py-8 text-center">
                        <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-800">No Answers Generated</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Run an AEO analysis to query {engine.display_name} for brand mentions.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-semibold text-slate-400">Visibility Score</span>
                          <span className="text-3xl font-black text-slate-900">
                            {engine.score !== null && engine.score !== undefined ? engine.score : "--"}
                            <span className="text-xs font-normal text-slate-400"> / 100</span>
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Mention Rate</span>
                            <span className="font-bold text-slate-800">
                              {engine.mention_rate !== null && engine.mention_rate !== undefined
                                ? `${engine.mention_rate.toFixed(1)}%`
                                : "--"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Citation Rate</span>
                            <span className="font-bold text-slate-800">
                              {engine.citation_rate !== null && engine.citation_rate !== undefined
                                ? `${engine.citation_rate.toFixed(1)}%`
                                : "--"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Coverage Rate</span>
                            <span className="font-bold text-slate-800">
                              {engine.coverage_rate !== null && engine.coverage_rate !== undefined
                                ? `${engine.coverage_rate.toFixed(1)}%`
                                : "--"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-500">Average Position</span>
                            <span className="font-bold text-slate-800">
                              {engine.average_position ? `#${engine.average_position.toFixed(1)}` : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Tested: <strong className="text-slate-800">{engine.questions_tested || 0}</strong>
                    </span>
                    <span>
                      Mentioned: <strong className="text-emerald-700">{engine.questions_mentioned || 0}</strong>
                    </span>
                    <span>
                      Citations: <strong className="text-purple-700">{engine.citations_count || 0}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Engine Performance Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side metric breakdown across configured answer engines
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Engine</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Score</th>
                      <th className="py-3 px-4 font-bold">Mention Rate</th>
                      <th className="py-3 px-4 font-bold">Citation Rate</th>
                      <th className="py-3 px-4 font-bold">Coverage</th>
                      <th className="py-3 px-4 font-bold">Avg Position</th>
                      <th className="py-3 px-4 font-bold">Tested / Mentions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {engineData.engines.map((eng) => (
                      <tr key={eng.provider} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {getProviderIcon(eng.provider)}
                            <span className="font-bold text-slate-900">{eng.display_name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              eng.is_configured
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {eng.status_label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {eng.score !== null && eng.score !== undefined ? eng.score : "--"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {eng.mention_rate !== null && eng.mention_rate !== undefined
                            ? `${eng.mention_rate.toFixed(1)}%`
                            : "--"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {eng.citation_rate !== null && eng.citation_rate !== undefined
                            ? `${eng.citation_rate.toFixed(1)}%`
                            : "--"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {eng.coverage_rate !== null && eng.coverage_rate !== undefined
                            ? `${eng.coverage_rate.toFixed(1)}%`
                            : "--"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {eng.average_position ? `#${eng.average_position.toFixed(1)}` : "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {eng.questions_tested || 0} tested /{" "}
                          <span className="text-emerald-700 font-bold">{eng.questions_mentioned || 0} mentions</span>
                        </td>
                      </tr>
                    ))}
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
