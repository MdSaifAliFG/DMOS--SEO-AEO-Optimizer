"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  Clock,
  Sliders,
  Shield,
  Bot,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  RefreshCw,
  Bell,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoMonitoringSchedule, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoMonitoringSettingsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [schedule, setSchedule] = useState<AeoMonitoringSchedule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRunningCycle, setIsRunningCycle] = useState<boolean>(false);

  // Form State
  const [enabled, setEnabled] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<string>("weekly");
  const [selectedEngines, setSelectedEngines] = useState<string[]>(["chatgpt", "gemini", "perplexity"]);
  const [scoreDropThreshold, setScoreDropThreshold] = useState<number>(5);
  const [competitorGainThreshold, setCompetitorGainThreshold] = useState<number>(10);
  const [mentionLossThreshold, setMentionLossThreshold] = useState<number>(15);

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

  const loadSchedule = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoMonitoringSchedule(projId);
      setSchedule(data);
      setEnabled(data.enabled);
      setFrequency(data.frequency);
      setSelectedEngines(data.selected_engines || ["chatgpt", "gemini", "perplexity"]);
      if (data.alert_thresholds) {
        setScoreDropThreshold(data.alert_thresholds.score_drop ?? 5);
        setCompetitorGainThreshold(data.alert_thresholds.competitor_gain ?? 10);
        setMentionLossThreshold(data.alert_thresholds.mention_loss ?? 15);
      }
    } catch (err: any) {
      error("Failed to load monitoring schedule", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadSchedule(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleEngineToggle = (eng: string) => {
    if (selectedEngines.includes(eng)) {
      if (selectedEngines.length === 1) {
        error("At least one engine must be selected");
        return;
      }
      setSelectedEngines(selectedEngines.filter((e) => e !== eng));
    } else {
      setSelectedEngines([...selectedEngines, eng]);
    }
  };

  const handleSave = async () => {
    if (!selectedProjectId) return;
    setIsSaving(true);
    try {
      const updated = await api.updateAeoMonitoringSchedule(selectedProjectId, {
        enabled,
        frequency,
        selected_engines: selectedEngines,
        alert_thresholds: {
          score_drop: Math.min(100, Math.max(1, scoreDropThreshold)),
          competitor_gain: Math.min(100, Math.max(1, competitorGainThreshold)),
          mention_loss: Math.min(100, Math.max(1, mentionLossThreshold)),
        },
      });
      setSchedule(updated);
      success("Settings saved", "AEO monitoring schedule and alert thresholds updated.");
    } catch (err: any) {
      error("Failed to save settings", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunNow = async () => {
    if (!selectedProjectId) return;
    setIsRunningCycle(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Monitoring cycle completed", "Captured new engine, competitor, and prompt snapshots.");
      await loadSchedule(selectedProjectId);
    } catch (err: any) {
      error("Monitoring cycle failed", err.message);
    } finally {
      setIsRunningCycle(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Settings className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Monitoring & Alert Settings
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Continuous Auditing
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Configure automated background auditing schedules, monitored engine targets, and anomaly alert triggers.
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
              onClick={handleRunNow}
              disabled={isRunningCycle || !selectedProjectId}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl px-3.5 py-1.5 shadow transition disabled:opacity-50 flex items-center gap-1.5 border-0"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningCycle ? "animate-spin" : ""}`} />
              <span>{isRunningCycle ? "Running..." : "Run Cycle Now"}</span>
            </Button>
          </div>
        </div>

        {/* Form Body */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Loading Monitoring Preferences...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Settings className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to set up automated recurring monitoring schedules and anomaly detection thresholds.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Status & Frequency Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Automated Monitoring Status
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enable continuous background checks for visibility changes and engine answer shifts
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Schedule Info */}
              {schedule && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Last Monitored Run:</span>
                    <p className="font-bold text-slate-900 mt-1">
                      {schedule.last_run_at ? new Date(schedule.last_run_at).toLocaleString() : "Never run"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Next Scheduled Run:</span>
                    <p className="font-bold text-purple-900 mt-1">
                      {schedule.next_run_at ? new Date(schedule.next_run_at).toLocaleString() : "Calculated upon save"}
                    </p>
                  </div>
                </div>
              )}

              {/* Frequency Selection */}
              <div>
                <label className="text-sm font-bold text-slate-900 block mb-2">
                  Audit Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "daily", label: "Daily", desc: "Every 24 hours" },
                    { id: "weekly", label: "Weekly", desc: "Every 7 days (Recommended)" },
                    { id: "biweekly", label: "Bi-weekly", desc: "Every 14 days" },
                    { id: "monthly", label: "Monthly", desc: "Every 30 days" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrequency(f.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        frequency === f.id
                          ? "bg-purple-50 border-purple-600 text-purple-950 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="font-bold text-sm block">{f.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Monitored Engines Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  Monitored Answer Engines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select which generative AI engines are queried during automated monitoring cycles
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "chatgpt", name: "ChatGPT (OpenAI)", icon: <Bot className="w-4 h-4 text-emerald-600" /> },
                  { id: "gemini", name: "Google Gemini", icon: <Sparkles className="w-4 h-4 text-blue-600" /> },
                  { id: "perplexity", name: "Perplexity AI", icon: <Search className="w-4 h-4 text-purple-600" /> },
                ].map((eng) => {
                  const isChecked = selectedEngines.includes(eng.id);
                  return (
                    <div
                      key={eng.id}
                      onClick={() => handleEngineToggle(eng.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? "bg-purple-50 border-purple-400 text-purple-950 font-bold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {eng.icon}
                        <span className="font-semibold text-sm">{eng.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-400 pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anomaly Alert Thresholds Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-600" />
                  Alert Notification Thresholds
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define sensitivity triggers for firing warnings and critical alerts when anomalies are detected
                </p>
              </div>

              <div className="space-y-6">
                {/* Score Drop */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">
                      Visibility Score Drop Threshold:
                    </span>
                    <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {scoreDropThreshold} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={scoreDropThreshold}
                    onChange={(e) => setScoreDropThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Trigger an alert if the composite AEO Visibility score falls by this amount or more between cycles.
                  </span>
                </div>

                {/* Competitor Gain */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">
                      Competitor Share of Voice Gain Threshold:
                    </span>
                    <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {competitorGainThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={competitorGainThreshold}
                    onChange={(e) => setCompetitorGainThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Trigger an alert if a single competitor increases their share of voice by this percentage.
                  </span>
                </div>

                {/* Mention Loss */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">
                      Brand Mention Loss Threshold:
                    </span>
                    <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {mentionLossThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={mentionLossThreshold}
                    onChange={(e) => setMentionLossThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Trigger an alert if brand mentions decrease by this percentage across all prompts.
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !selectedProjectId}
                className="bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl shadow"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving Settings..." : "Save Preferences"}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
