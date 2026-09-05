"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  Play,
  Activity,
  Server,
  Database,
  Radio,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ScanStatusBadge } from "@/components/scans/ScanStatusBadge";
import { Project, HealthResponse } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, healthRes] = await Promise.allSettled([
          api.getProjects({ limit: 5 }),
          api.getHealth(),
        ]);

        if (projRes.status === "fulfilled") {
          setProjects(projRes.value.projects);
          setTotalProjects(projRes.value.total);
        }
        if (healthRes.status === "fulfilled") {
          setHealth(healthRes.value);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalScans = projects.reduce((acc, p) => acc + (p.total_scans || 0), 0);

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-950/80 via-surface-900 to-surface-950 p-6 md:p-8 border border-primary-500/20 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm" dot>
                  SeoSensing Engine v1.0
                </Badge>
                <Badge variant="emerald" size="sm">
                  Phase 1 Operational
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                SEO & AEO Optimization Cockpit
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                Core crawling architecture, database orchestration, and real-time scan lifecycle state engine.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/projects/new">
                <Button
                  variant="primary"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Website
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="secondary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Websites */}
          <Card hoverable className="p-5 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Managed Websites
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-slate-100">
                {totalProjects}
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Active domain targets
            </p>
          </Card>

          {/* Card 2: Total Scans */}
          <Card hoverable className="p-5 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Audit Scans
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-slate-100">
                {totalScans}
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Lifecycle runs executed
            </p>
          </Card>

          {/* Card 3: Backend API Status */}
          <Card hoverable className="p-5 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                FastAPI Gateway
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  health?.status === "healthy"
                    ? "bg-emerald-400"
                    : "bg-amber-400 animate-ping"
                }`}
              />
              <span className="text-base font-bold text-slate-100 capitalize">
                {health?.status || "Connecting"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              REST /api/v1 connected
            </p>
          </Card>

          {/* Card 4: Database Infrastructure */}
          <Card hoverable className="p-5 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Database Engine
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-base font-bold text-slate-100 capitalize">
              {health?.database || "PostgreSQL Ready"}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              SQLAlchemy & Async driver
            </p>
          </Card>
        </div>

        {/* Recent Websites Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-100">
                Recent Projects
              </h2>
              <p className="text-xs text-slate-400">
                Websites registered for crawl orchestration
              </p>
            </div>
            <Link href="/projects">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-slate-800">
              <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-medium">No websites added yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Add your first domain to explore the scan lifecycle.
              </p>
              <Link href="/projects/new">
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add Website
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-primary-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-900 border border-slate-700 flex items-center justify-center text-primary-400 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-bold text-slate-100 hover:text-primary-400 transition-colors truncate block"
                      >
                        {project.name}
                      </Link>
                      <span className="text-xs text-slate-400 block truncate">
                        {project.domain}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="flex flex-col items-start sm:items-end text-xs">
                      {project.latest_scan ? (
                        <div className="flex items-center gap-2">
                          <ScanStatusBadge status={project.latest_scan.status} size="sm" />
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            {formatTimeAgo(project.latest_scan.created_at)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No scans yet</span>
                      )}
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <Button variant="secondary" size="sm">
                        Overview
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
