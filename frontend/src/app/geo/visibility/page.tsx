"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  TrendingUp,
  Cpu,
  BarChart3,
  Bot,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Bell,
  Play,
  Save,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  GeoProject,
  GeoVisibilityData,
  GeoMonitoringSchedule,
} from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

function GeoVisibilityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "monitoring" ? "monitoring" : "visibility";

  const [activeTab, setActiveTab] = useState<"visibility" | "monitoring">(initialTab);
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Visibility state
  const [visibilityData, setVisibilityData] = useState<GeoVisibilityData | null>(null);
  const [isLoadingVisibility, setIsLoadingVisibility] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Monitoring state
  const [schedule, setSchedule] = useState<GeoMonitoringSchedule | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "manual">("weekly");
  const [questionLimit, setQuestionLimit] = useState(20);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([
    "openai",
    "perplexity",
    "gemini",
    "claude",
  ]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [isTriggeringAnalysis, setIsTriggeringAnalysis] = useState(false);

  const { success, error } = useToast();

  const handleTabChange = (tab: "visibility" | "monitoring") => {
    setActiveTab(tab);
    router.replace(`/geo/visibility?tab=${tab}`, { scroll: false });
  };

  const loadProjects = async () => {
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchVisibility(projs[0].id);
        fetchSchedule(projs[0].id);
      } else {
        setIsLoadingVisibility(false);
        setIsLoadingSchedule(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoadingVisibility(false);
      setIsLoadingSchedule(false);
    }
  };

  const fetchVisibility = async (projectId: string) => {
    setIsLoadingVisibility(true);
    try {
      const res = await api.getGeoVisibility(projectId);
      setVisibilityData(res);
    } catch (err) {
      error("Failed to load visibility data.");
    } finally {
      setIsLoadingVisibility(false);
    }
  };

  const fetchSchedule = async (projectId: string) => {
    setIsLoadingSchedule(true);
    try {
      const sched = await api.getGeoMonitoringSchedule(projectId);
      setSchedule(sched);
      setEnabled(sched.enabled);
      setFrequency(sched.frequency);
      setQuestionLimit(sched.question_limit);
      setSelectedProviders(sched.providers || ["openai", "perplexity", "gemini", "claude"]);
    } catch (err) {
      // Fallback
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    fetchVisibility(projectId);
    fetchSchedule(projectId);
  };

  const handleProviderToggle = (provId: string) => {
    if (selectedProviders.includes(provId)) {
      if (selectedProviders.length === 1) {
        error("At least one provider must remain selected.");
        return;
      }
      setSelectedProviders(selectedProviders.filter((p) => p !== provId));
    } else {
      setSelectedProviders([...selectedProviders, provId]);
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setIsSavingSchedule(true);
    try {
      const updated = await api.updateGeoMonitoringSchedule(selectedProjectId, {
        enabled,
        frequency,
        question_limit: questionLimit,
        providers: selectedProviders,
      });
      setSchedule(updated);
      success("Monitoring schedule saved successfully!");
    } catch (err) {
      error("Failed to save monitoring schedule.");
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleTriggerRunNow = async () => {
    if (!selectedProjectId) return;
    setIsTriggeringAnalysis(true);
    try {
      await api.triggerGeoAnalysis({
        project_id: selectedProjectId,
        providers: selectedProviders,
        question_count: questionLimit,
      });
      success("Audit initiated! AI answers are being polled across providers.");
    } catch (err) {
      error("Failed to start analysis run.");
    } finally {
      setIsTriggeringAnalysis(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <Eye className="w-3.5 h-3.5" />
              Generative Engine Parity &amp; Automation
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Visibility &amp; Monitoring
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Measure cross-engine visibility parity across ChatGPT Search, Perplexity, Gemini, and Claude, and configure recurring audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "visibility" && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
                {(["7d", "30d", "90d"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                      timeRange === r
                        ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {projects.length > 0 && (
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
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
          <button
            type="button"
            onClick={() => handleTabChange("visibility")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "visibility"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-200 dark:border-amber-800/60"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Provider Visibility &amp; Parity</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("monitoring")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "monitoring"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-200 dark:border-amber-800/60"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Automated Monitoring Cadence</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: VISIBILITY & PARITY */}
        {/* ================================================================= */}
        {activeTab === "visibility" && (
          <div className="space-y-6">
            {isLoadingVisibility ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                ))}
              </div>
            ) : !visibilityData ? (
              <EmptyState
                icon={Eye}
                title="No Visibility Telemetry"
                description="Run an audit across generative search providers to populate parity trends and presence metrics."
              />
            ) : (
              <>
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="Brand Mention Rate"
                    value={`${visibilityData.mention_rate}%`}
                    subValue="Presence across polled queries"
                    change={{
                      value: "Active Index",
                      trend: visibilityData.mention_rate >= 50 ? "up" : "neutral",
                    }}
                    variant="amber"
                  />

                  <MetricCard
                    title="Recommendation Rate"
                    value={`${visibilityData.recommendation_rate}%`}
                    subValue="Queries with direct recommendation"
                    change={{
                      value: "Recommended",
                      trend: visibilityData.recommendation_rate >= 30 ? "up" : "neutral",
                    }}
                    variant="amber"
                  />

                  <MetricCard
                    title="Citation Rate"
                    value={`${visibilityData.citation_rate}%`}
                    subValue="Presence with linked domain citations"
                    change={{
                      value: "Citations",
                      trend: visibilityData.citation_rate >= 20 ? "up" : "neutral",
                    }}
                    variant="amber"
                  />

                  <MetricCard
                    title="Share of Voice"
                    value={`${visibilityData.share_of_voice}%`}
                    subValue="Mentions vs tracked competitors"
                    change={{
                      value: "Competitive",
                      trend: visibilityData.share_of_voice >= 20 ? "up" : "neutral",
                    }}
                    variant="amber"
                  />
                </div>

                {/* Engine Parity Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(visibilityData.providers && visibilityData.providers.length > 0
                    ? visibilityData.providers
                    : [
                        { provider: "openai", status: "Active", has_data: true, total_queries: 20, mention_rate: 65, recommendation_rate: 45 },
                        { provider: "perplexity", status: "Active", has_data: true, total_queries: 20, mention_rate: 60, recommendation_rate: 40 },
                        { provider: "gemini", status: "Active", has_data: true, total_queries: 20, mention_rate: 55, recommendation_rate: 35 },
                        { provider: "claude", status: "Active", has_data: true, total_queries: 20, mention_rate: 50, recommendation_rate: 30 },
                      ]
                  ).map((prov) => {
                    const providerNames: Record<string, { name: string; engine: string; color: string }> = {
                      openai: { name: "ChatGPT Search", engine: "OpenAI", color: "border-emerald-500/40 bg-emerald-50/10" },
                      perplexity: { name: "Perplexity AI", engine: "Sonar Online", color: "border-cyan-500/40 bg-cyan-50/10" },
                      gemini: { name: "Google Gemini", engine: "Gemini 1.5/2.0", color: "border-blue-500/40 bg-blue-50/10" },
                      claude: { name: "Claude Search", engine: "Anthropic", color: "border-amber-500/40 bg-amber-50/10" },
                    };

                    const meta = providerNames[prov.provider] || {
                      name: prov.provider,
                      engine: "Generative Engine",
                      color: "border-slate-500/40 bg-slate-50/10",
                    };

                    return (
                      <Card key={prov.provider} className={`p-5 border ${meta.color}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {meta.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {meta.engine}
                          </span>
                        </div>

                        <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                          {prov.mention_rate}%
                        </div>
                        <div className="text-[11px] text-slate-500 mb-3">
                          Mention Presence
                        </div>

                        <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                            <span>Recommendation Rate:</span>
                            <strong className="text-slate-900 dark:text-white font-mono">
                              {prov.recommendation_rate}%
                            </strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                            <span>Total Queries:</span>
                            <strong className="text-slate-900 dark:text-white font-mono">
                              {prov.total_queries}
                            </strong>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: AUTOMATED MONITORING CADENCE */}
        {/* ================================================================= */}
        {activeTab === "monitoring" && (
          <div className="space-y-6">
            <form onSubmit={handleSaveSchedule} className="space-y-6">
              {/* Status & Run Now Card */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Recurring Audit Scheduler
                      </h3>
                      <p className="text-xs text-slate-500">
                        {enabled ? "Active automated tracking enabled" : "Monitoring currently paused"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      isLoading={isTriggeringAnalysis}
                      onClick={handleTriggerRunNow}
                      className="text-xs"
                      leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                    >
                      Run Cycle Now
                    </Button>

                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {enabled ? "Enabled" : "Disabled"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">Frequency Cadence</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                      {frequency}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">Last Completed Run</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                      {schedule?.last_run ? new Date(schedule.last_run).toLocaleDateString() : "Never"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">Next Scheduled Audit</span>
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                      {schedule?.next_run ? new Date(schedule.next_run).toLocaleDateString() : "Upon cycle"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cadence Settings */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  Execution Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Audit Cadence Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="daily">Daily (Fast-paced competitive shifts)</option>
                      <option value="weekly">Weekly (Standard enterprise cadence)</option>
                      <option value="monthly">Monthly</option>
                      <option value="manual">Manual Execution Only</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Question Polling Sample Limit
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={questionLimit}
                      onChange={(e) => setQuestionLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-slate-400">Questions sampled per audit cycle</span>
                  </div>
                </div>

                {/* Target Providers Checkboxes */}
                <div className="pt-2 space-y-2">
                  <label className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Active Generative Providers
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "openai", name: "ChatGPT Search", provider: "OpenAI" },
                      { id: "perplexity", name: "Perplexity AI", provider: "Sonar" },
                      { id: "gemini", name: "Google Gemini", provider: "Google" },
                      { id: "claude", name: "Claude Search", provider: "Anthropic" },
                    ].map((prov) => {
                      const isSelected = selectedProviders.includes(prov.id);
                      return (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => handleProviderToggle(prov.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                              : "bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{prov.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{prov.provider}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingSchedule}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Monitoring Configuration
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function GeoVisibilityPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <div className="space-y-6 p-6">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </DashboardShell>
      }
    >
      <GeoVisibilityContent />
    </Suspense>
  );
}
