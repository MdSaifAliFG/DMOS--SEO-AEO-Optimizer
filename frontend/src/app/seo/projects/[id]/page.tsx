"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Globe,
  Play,
  FileText,
  AlertTriangle,
  Wrench,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { MetricCard } from "@/components/ui/MetricCard";
import { LiveAuditDashboard } from "@/components/scans/LiveAuditDashboard";
import { StartAuditModal } from "@/components/scans/StartAuditModal";
import { Project, Scan, ScanResultsResponse } from "@/lib/types";
import { api } from "@/lib/api-client";
import { cleanDomain, formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function SeoProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const searchParams = useSearchParams();
  const initialScanId = searchParams.get("scanId");

  const [project, setProject] = useState<Project | null>(null);
  const [activeScan, setActiveScan] = useState<Scan | null>(null);
  const [scanResults, setScanResults] = useState<ScanResultsResponse | null>(null);
  const [scansHistory, setScansHistory] = useState<Scan[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [isStartAuditOpen, setIsStartAuditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { error } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const projData = await api.getProject(projectId);
      setProject(projData);

      const historyData = await api.getProjectScans(projectId, { limit: 20 });
      setScansHistory(historyData.scans || []);

      const targetScanId =
        initialScanId ||
        historyData.scans?.find((s) => s.status === "completed")?.id ||
        historyData.scans?.[0]?.id;
      if (targetScanId) {
        const scanObj = await api.getScan(targetScanId);
        setActiveScan(scanObj);

        if (scanObj.status === "completed") {
          const results = await api.getScanResults(targetScanId);
          setScanResults(results);
        }
      }
    } catch (err: any) {
      error("Failed to load project details", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, initialScanId]);

  if (isLoading && !project) {
    return (
      <DashboardShell>
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          <p className="mt-3 text-xs">Loading project details...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="p-8 text-center bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">SEO Project Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">The requested project ID does not exist.</p>
          <Link href="/seo/projects">
            <Button size="sm" variant="primary">Back to Projects</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const isScanRunning =
    activeScan &&
    ["queued", "initializing", "crawling", "analyzing", "scoring"].includes(activeScan.status);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/seo/projects" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            SEO Projects
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span className="text-slate-800 dark:text-white font-semibold truncate">{project.name}</span>
        </div>

        {/* Project Header Card */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{project.name}</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Active Project
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="text-slate-700 dark:text-slate-300 font-medium">https://{cleanDomain(project.domain)}</span>
              <span>•</span>
              <span>Created {formatDate(project.created_at)}</span>
              <span>•</span>
              <span>{project.total_scans} Audits Run</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsStartAuditOpen(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto"
            >
              Run Website Audit
            </Button>
          </div>
        </div>

        {/* Live Audit Execution Dashboard (if a scan is active or loaded) */}
        {activeScan && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isScanRunning ? "Live Crawler Execution" : "Audit Results Summary"}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Scan ID: {activeScan.id.substring(0, 8)}...
              </span>
            </div>

            <LiveAuditDashboard
              scanId={activeScan.id}
              initialScan={activeScan}
              onScanCompleted={() => loadData()}
            />
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Audit History ({scansHistory.length})
          </button>
        </div>

        {/* Audit History Tab */}
        <Card className="p-0 border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[620px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Crawled Pages</th>
                  <th className="py-3 px-4 text-center">Issues</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {scansHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No previous audits found. Run your first audit above.
                    </td>
                  </tr>
                ) : (
                  scansHistory.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                        {formatDate(scan.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            scan.status === "completed"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : scan.status === "failed"
                              ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                              : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60"
                          }`}
                        >
                          {scan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold font-mono text-slate-800 dark:text-slate-200">
                        {scan.overall_score !== null ? `${scan.overall_score}/100` : "—"}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{scan.pages_crawled}</td>
                      <td className="py-3 px-4 text-center font-mono">{scan.issues_count}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveScan(scan);
                            window.scrollTo({ top: 150, behavior: "smooth" });
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          View Scan
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Start Audit Modal */}
        {isStartAuditOpen && (
          <StartAuditModal
            project={project}
            isOpen={isStartAuditOpen}
            onClose={() => setIsStartAuditOpen(false)}
            onScanCreated={(newScanId) => {
              setIsStartAuditOpen(false);
              window.location.href = `/seo/projects/${project.id}?scanId=${newScanId}`;
            }}
          />
        )}
      </div>
    </DashboardShell>
  );
}
