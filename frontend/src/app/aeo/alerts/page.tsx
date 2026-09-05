"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  RefreshCw,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoAlert, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoAlertsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [alerts, setAlerts] = useState<AeoAlert[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "new" | "acknowledged" | "resolved">("new");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

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

  const loadAlerts = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoAlerts(projId, {
        status: activeTab,
        severity: selectedSeverity,
        limit: 100,
      });
      setAlerts(data || []);
    } catch (err: any) {
      error("Failed to load alerts", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadAlerts(selectedProjectId);
    }
  }, [selectedProjectId, activeTab, selectedSeverity]);

  const handleUpdateStatus = async (alertId: string, newStatus: "new" | "acknowledged" | "resolved") => {
    setActionInProgressId(alertId);
    try {
      await api.updateAeoAlert(alertId, newStatus);
      success(`Alert marked as ${newStatus}`);
      await loadAlerts(selectedProjectId);
    } catch (err: any) {
      error("Failed to update alert status", err.message);
    } finally {
      setActionInProgressId(null);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Critical
          </span>
        );
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> High
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Low
          </span>
        );
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
                <Bell className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                AEO Alert Center
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Threat & Anomaly Detection
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Track visibility drops, competitor incursions, and answer volatility with threshold-based triggers.
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
              onClick={() => loadAlerts(selectedProjectId)}
              disabled={isLoading || !selectedProjectId}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl px-3.5 py-1.5 shadow transition disabled:opacity-50 flex items-center gap-1.5 border-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Tab Controls & Severity Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["new", "acknowledged", "resolved", "all"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-purple-400 focus:outline-none font-semibold cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Alert List */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Scanning Alert Records...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Bell className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to configure automated threshold alerts and brand volatility triggers.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : alerts.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Alerts Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              There are no {activeTab === "all" ? "" : activeTab} alerts matching your filter criteria. Your brand visibility metrics are within expected thresholds.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-purple-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                        {alert.type}
                      </span>
                      {alert.provider && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                          {alert.provider}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 pt-1">{alert.title}</h3>
                    <p className="text-sm text-slate-600">{alert.description}</p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
                      <span>Status: <strong className="text-slate-800 capitalize font-bold">{alert.status}</strong></span>
                      {alert.acknowledged_at && (
                        <span>Ack: {new Date(alert.acknowledged_at).toLocaleDateString()}</span>
                      )}
                      {alert.resolved_at && (
                        <span>Resolved: {new Date(alert.resolved_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 self-start md:min-w-[140px]">
                    {alert.status === "new" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(alert.id, "acknowledged")}
                          disabled={actionInProgressId === alert.id}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1 rounded-xl"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(alert.id, "resolved")}
                          disabled={actionInProgressId === alert.id}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 rounded-xl"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolve
                        </Button>
                      </>
                    )}

                    {alert.status === "acknowledged" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(alert.id, "resolved")}
                          disabled={actionInProgressId === alert.id}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 rounded-xl"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateStatus(alert.id, "new")}
                          disabled={actionInProgressId === alert.id}
                          className="w-full border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 rounded-xl"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Re-open
                        </Button>
                      </>
                    )}

                    {alert.status === "resolved" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateStatus(alert.id, "new")}
                        disabled={actionInProgressId === alert.id}
                        className="w-full border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 rounded-xl"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Re-open
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
