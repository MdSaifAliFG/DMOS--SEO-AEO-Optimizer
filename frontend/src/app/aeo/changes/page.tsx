"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GitCommit,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Bot,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoChangeEvent, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoChangesPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [changes, setChanges] = useState<AeoChangeEvent[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
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

  const loadChanges = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoChanges(projId, {
        severity: selectedSeverity,
        event_type: selectedEventType,
        limit: 100,
      });
      setChanges(data || []);
    } catch (err: any) {
      error("Failed to load changes", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadChanges(selectedProjectId);
    }
  }, [selectedProjectId, selectedSeverity, selectedEventType]);

  const handleRefresh = async () => {
    if (!selectedProjectId) return;
    setIsRefreshing(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Monitoring analysis executed", "Auditing changes against previous snapshot...");
      setTimeout(() => {
        loadChanges(selectedProjectId);
        setIsRefreshing(false);
      }, 2500);
    } catch (err: any) {
      error("Refresh failed", err.message);
      setIsRefreshing(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Critical
          </span>
        );
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Low
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            Info
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
                <GitCommit className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                AEO Change Center
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Deterministic Delta Engine
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Audit granular visibility changes, mention losses, citation updates, and competitor rank shifts.
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
              <span>{isRefreshing ? "Checking..." : "Detect Changes"}</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-slate-800">Filter By:</span>
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
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">Event Type:</label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-purple-400 focus:outline-none font-semibold cursor-pointer"
            >
              <option value="all">All Events</option>
              <option value="score_drop">Score Drop</option>
              <option value="score_gain">Score Gain</option>
              <option value="mention_loss">Mention Lost</option>
              <option value="mention_gain">Mention Gained</option>
              <option value="citation_loss">Citation Lost</option>
              <option value="citation_gain">Citation Gained</option>
              <option value="competitor_gain">Competitor Gain</option>
              <option value="parity_gap">Provider Parity Gap</option>
            </select>
          </div>

          <div className="ml-auto text-xs text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{changes.length}</strong> change events
          </div>
        </div>

        {/* Change List */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Loading Change Events...</p>
            <p className="text-xs text-slate-500 mt-1">Retrieving verified snapshot deltas</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <GitCommit className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to start monitoring changes and visibility trajectory across generative AI answers.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : changes.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Changes Recorded</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No change events matching the current filter have been recorded. Changes are detected whenever consecutive monitoring runs or analyses differ in visibility or citations.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={handleRefresh} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow">
                Run Analysis Now
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {changes.map((event) => {
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-purple-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getSeverityBadge(event.severity)}
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                          {event.event_type}
                        </span>
                        {event.provider && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                            {event.provider}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 font-semibold pt-1">
                        {event.description}
                      </p>

                      {(event.previous_value !== null || event.current_value !== null) && (
                        <div className="flex items-center gap-2 text-xs pt-1 text-slate-500 font-medium">
                          <span>Previous: <strong className="text-slate-700">{event.previous_value ?? "None"}</strong></span>
                          <span>&rarr;</span>
                          <span>Current: <strong className="text-purple-950 font-bold">{event.current_value ?? "None"}</strong></span>
                        </div>
                      )}
                    </div>

                    {event.delta !== null && event.delta !== undefined && (
                      <div className="flex items-center self-start sm:self-center">
                        <span
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black border ${
                            event.delta > 0
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : event.delta < 0
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {event.delta > 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : event.delta < 0 ? (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          ) : null}
                          {event.delta > 0 ? `+${event.delta}` : event.delta}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
