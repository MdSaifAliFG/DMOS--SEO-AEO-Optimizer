"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Play,
  Trash2,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Clock,
  Sliders,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScanStatusBadge } from "@/components/scans/ScanStatusBadge";
import { StartAuditModal } from "@/components/scans/StartAuditModal";
import { DeleteProjectModal } from "@/components/projects/DeleteProjectModal";
import { Project, Scan } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { error } = useToast();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadData = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const [projData, scansData] = await Promise.all([
          api.getProject(projectId),
          api.getProjectScans(projectId),
        ]);
        setProject(projData);
        setScans(scansData.scans);
        setTotalScans(scansData.total);
      } catch (err: any) {
        error("Project Not Found", err.message || "Failed to load project details");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [projectId, error]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScanCreated = (scanId: string) => {
    router.push(`/projects/${projectId}/audit?scanId=${scanId}`);
  };

  const handleProjectDeleted = () => {
    router.push("/projects");
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="py-12 text-center">
          <h2 className="text-lg font-bold text-slate-100 mb-2">Project Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">
            The requested website project does not exist or has been deleted.
          </p>
          <Link href="/projects">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Projects
            </Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Back navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/projects">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Projects
              </Button>
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <h1 className="text-xl font-bold text-slate-100">{project.name}</h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              isLoading={isRefreshing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAuditModalOpen(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Start Audit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hero Domain Card */}
        <Card className="p-6 md:p-8 relative overflow-hidden border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600/20 to-indigo-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 shrink-0 shadow-lg">
                <Globe className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">{project.name}</h2>
                  <Badge variant="emerald" size="sm">
                    Active Target
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>{project.domain}</span>
                  <a
                    href={`https://${project.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-xs"
                  >
                    <span>Visit website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {project.description && (
                  <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metadata Stats */}
            <div className="flex flex-wrap gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
              <div className="p-3 rounded-xl bg-surface-950/60 border border-slate-800 min-w-28 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Scans
                </span>
                <span className="text-lg font-extrabold text-slate-100">
                  {totalScans}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-950/60 border border-slate-800 min-w-28 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Crawl Depth
                </span>
                <span className="text-lg font-extrabold text-slate-100">
                  {(project.settings?.crawl_depth as number) || 3}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-950/60 border border-slate-800 min-w-28 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Created
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {formatDate(project.created_at).split(",")[0]}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Scan History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Audit Scan History</h3>
              <p className="text-xs text-slate-400">
                Lifecycle executions and crawler orchestration runs
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuditModalOpen(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              New Scan
            </Button>
          </div>

          {scans.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No scan executions yet"
              description="Launch your first audit lifecycle to simulate the crawl pipeline and view live telemetry."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAuditModalOpen(true)}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  Launch First Audit
                </Button>
              }
            />
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-surface-950/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Scan Target</th>
                      <th className="px-5 py-3.5">Type</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Progress</th>
                      <th className="px-5 py-3.5">Current Stage</th>
                      <th className="px-5 py-3.5">Executed At</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {scans.map((scan) => (
                      <tr
                        key={scan.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-4 font-mono font-medium text-slate-200">
                          <div className="truncate max-w-[200px]" title={scan.target_url}>
                            {scan.target_url}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-300 capitalize">
                          {scan.scan_type.replace("_", " ")}
                        </td>
                        <td className="px-5 py-4">
                          <ScanStatusBadge status={scan.status} size="sm" />
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-300">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500 rounded-full"
                                style={{ width: `${scan.progress}%` }}
                              />
                            </div>
                            <span>{scan.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-400 max-w-[180px] truncate">
                          {scan.current_step}
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {formatTimeAgo(scan.created_at)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link href={`/projects/${projectId}/audit?scanId=${scan.id}`}>
                            <Button variant="secondary" size="sm" className="text-xs py-1 px-2.5">
                              Open Cockpit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Phase 2 Feature Previews (Adhering to PRD Rule #1 & #5) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Future Analysis Modules
            </h3>
            <p className="text-xs text-slate-400">
              Clean architectural extension slots for upcoming Phase 2 intelligence engines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="subtle" className="p-5 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <Badge variant="amber" size="sm">Phase 2</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-200">Keyword Tracking</h4>
              <p className="text-xs text-slate-400 mt-1">
                SERP ranking monitor and keyword position distribution.
              </p>
            </Card>

            <Card variant="subtle" className="p-5 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-amber-400" />
                <Badge variant="amber" size="sm">Phase 2</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-200">Competitor Matrix</h4>
              <p className="text-xs text-slate-400 mt-1">
                Domain overlap, competitive gap analysis, and content velocity.
              </p>
            </Card>

            <Card variant="subtle" className="p-5 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <Badge variant="amber" size="sm">Phase 2</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-200">AEO & AI Search</h4>
              <p className="text-xs text-slate-400 mt-1">
                Answer Engine citation tracking and LLM brand visibility index.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Start Audit Modal */}
      <StartAuditModal
        project={project}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onScanCreated={handleScanCreated}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal
        project={project}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleProjectDeleted}
      />
    </DashboardShell>
  );
}
