"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Filter,
  Clock,
  ExternalLink,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoAlert } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoAlertsPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [alerts, setAlerts] = useState<GeoAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const { error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchAlerts(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchAlerts = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getGeoAlerts(projectId);
      setAlerts(res || []);
    } catch (err) {
      error("Failed to load GEO alerts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const getSeverityBadge = (s: string) => {
    switch (s.toLowerCase()) {
      case "critical":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50";
      case "high":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Generative Health &amp; Anomaly Signals
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Alert Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live alerts for generative visibility drops, crawler restrictions, and competitor surges.
            </p>
          </div>

          {projects.length > 0 && (
            <select
              aria-label="Select GEO Project"
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                fetchAlerts(e.target.value);
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

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {["all", "new", "acknowledged", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All Systems Normal"
            description="No active GEO alerts detected for this project. Generative visibility signals are healthy."
          />
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="p-4 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(
                        alert.severity
                      )}`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {alert.alert_type}
                    </span>
                    {alert.provider && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                        {alert.provider}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {alert.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {new Date(alert.detected_at).toLocaleDateString()}
                  </span>
                  <Link
                    href="/geo/actions"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-1"
                  >
                    View in Actions <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
