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
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800">SEO Project Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">The requested project ID does not exist.</p>
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
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/seo/projects" className="hover:text-blue-600 font-medium">
            SEO Projects
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate">{project.name}</span>
        </div>

        {/* Project Header Card */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>https://{cleanDomain(project.domain)}</span>
              <span>•</span>
              <span>Created {formatDate(project.created_at)}</span>
              <span>•</span>
              <span>{project.total_scans} Audits Run</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsStartAuditOpen(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Run Website Audit
            </Button>
          </div>
        </div>

        {/* Live Audit Execution Dashboard (if a scan is active or loaded) */}
        {activeScan && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {isScanRunning ? "Live Crawler Execution" : "Audit Results Summary"}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
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
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Audit History ({scansHistory.length})
          </button>
        </div>

        {/* Audit History Tab */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Crawled Pages</th>
                  <th className="py-3 px-4 text-center">Issues</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {scansHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No previous audits found. Run your first audit above.
                    </td>
                  </tr>
                ) : (
                  scansHistory.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {formatDate(scan.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            scan.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : scan.status === "failed"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {scan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold font-mono text-slate-800">
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
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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
