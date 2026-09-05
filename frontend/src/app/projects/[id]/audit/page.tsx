"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Square,
  RefreshCw,
  Globe,
  Terminal,
  Activity,
  Layers,
  FileText,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ScanStatusBadge } from "@/components/scans/ScanStatusBadge";
import { ScanProgressTracker } from "@/components/scans/ScanProgressTracker";
import { ScanLogsViewer } from "@/components/scans/ScanLogsViewer";
import { StartAuditModal } from "@/components/scans/StartAuditModal";
import { ScoreOverviewHero } from "@/components/scans/ScoreOverviewHero";
import { IssueSummaryCards } from "@/components/scans/IssueSummaryCards";
import { IssuesTable } from "@/components/scans/IssuesTable";
import { PagesTable } from "@/components/scans/PagesTable";
import {
  Project,
  Scan,
  ScanResultsResponse,
  ScanStatus,
  SEOIssue,
  SEOPage,
  SEOSeverity,
} from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function ProjectAuditCockpitPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, warning, error } = useToast();

  const projectId = params.id as string;
  const initialScanId = searchParams.get("scanId");

  const [project, setProject] = useState<Project | null>(null);
  const [activeScan, setActiveScan] = useState<Scan | null>(null);
  const [scanResults, setScanResults] = useState<ScanResultsResponse | null>(null);
  const [scansList, setScansList] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);

  // Active Tab: "issues" | "pages" | "telemetry"
  const [activeTab, setActiveTab] = useState<"issues" | "pages" | "telemetry">("issues");

  // Issues State
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [issuesTotal, setIssuesTotal] = useState(0);
  const [issuesPage, setIssuesPage] = useState(1);
  const [issuesSearch, setIssuesSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);

  // Pages State
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [pagesTotal, setPagesTotal] = useState(0);
  const [pagesPage, setPagesPage] = useState(1);
  const [pagesSearch, setPagesSearch] = useState("");
  const [statusCodeFilter, setStatusCodeFilter] = useState<number | null>(null);
  const [indexabilityFilter, setIndexabilityFilter] = useState<boolean | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load project and scan list
  const initPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projData, scansData] = await Promise.all([
        api.getProject(projectId),
        api.getProjectScans(projectId),
      ]);
      setProject(projData);
      setScansList(scansData.scans);

      if (initialScanId) {
        const found = scansData.scans.find((s) => s.id === initialScanId);
        if (found) {
          setActiveScan(found);
        } else {
          try {
            const single = await api.getScan(initialScanId);
            setActiveScan(single);
          } catch {
            if (scansData.scans.length > 0) setActiveScan(scansData.scans[0]);
          }
        }
      } else if (scansData.scans.length > 0) {
        setActiveScan(scansData.scans[0]);
      }
    } catch (err: any) {
      error("Error loading project", err.message || "Failed to load audit cockpit");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, initialScanId, error]);

  useEffect(() => {
    initPage();
  }, [initPage]);

  // Fetch scan results, issues, and pages whenever activeScan changes or completes
  const loadScanData = useCallback(async (scanId: string) => {
    try {
      const res = await api.getScanResults(scanId);
      setScanResults(res);
    } catch (err) {
      console.error("Could not fetch scan results:", err);
    }
  }, []);

  const loadIssues = useCallback(
    async (scanId: string) => {
      setIsLoadingIssues(true);
      try {
        const data = await api.getScanIssues(scanId, {
          page: issuesPage,
          page_size: 25,
          search: issuesSearch || undefined,
          severity: selectedSeverity || undefined,
          category: selectedCategory || undefined,
        } as any);
        setIssues(data.issues);
        setIssuesTotal(data.total);
      } catch (err) {
        console.error("Failed to load issues:", err);
      } finally {
        setIsLoadingIssues(false);
      }
    },
    [issuesPage, issuesSearch, selectedSeverity, selectedCategory]
  );

  const loadPages = useCallback(
    async (scanId: string) => {
      setIsLoadingPages(true);
      try {
        const data = await api.getScanPages(scanId, {
          page: pagesPage,
          page_size: 25,
          search: pagesSearch || undefined,
          status_code: statusCodeFilter ?? undefined,
          indexability: indexabilityFilter ?? undefined,
        });
        setPages(data.pages);
        setPagesTotal(data.total);
      } catch (err) {
        console.error("Failed to load pages:", err);
      } finally {
        setIsLoadingPages(false);
      }
    },
    [pagesPage, pagesSearch, statusCodeFilter, indexabilityFilter]
  );

  useEffect(() => {
    if (activeScan && activeScan.status === "completed") {
      loadScanData(activeScan.id);
    }
  }, [activeScan?.id, activeScan?.status, loadScanData]);

  useEffect(() => {
    if (activeScan && activeScan.status === "completed" && activeTab === "issues") {
      loadIssues(activeScan.id);
    }
  }, [activeScan?.id, activeScan?.status, activeTab, loadIssues]);

  useEffect(() => {
    if (activeScan && activeScan.status === "completed" && activeTab === "pages") {
      loadPages(activeScan.id);
    }
  }, [activeScan?.id, activeScan?.status, activeTab, loadPages]);

  // Polling loop for in-flight scan
  useEffect(() => {
    const isTerminal = (status?: ScanStatus) =>
      status === "completed" || status === "failed" || status === "cancelled";

    if (activeScan && !isTerminal(activeScan.status)) {
      pollingRef.current = setInterval(async () => {
        try {
          const updated = await api.getScan(activeScan.id);
          setActiveScan(updated);

          setScansList((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );

          if (isTerminal(updated.status)) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (updated.status === "completed") {
              success("Audit Completed", `Crawler and SEO engine completed for ${updated.target_url}`);
              loadScanData(updated.id);
            } else if (updated.status === "failed") {
              error("Scan Failed", updated.error_message || "Audit execution encountered an error");
            }
          }
        } catch {
          // Ignore transient polling errors
        }
      }, 1000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeScan?.id, activeScan?.status, success, error, loadScanData]);

  const handleCancelScan = async () => {
    if (!activeScan) return;
    setIsCancelling(true);
    try {
      const res = await api.cancelScan(activeScan.id);
      warning("Scan Cancellation", res.message);
      const updated = await api.getScan(activeScan.id);
      setActiveScan(updated);
    } catch (err: any) {
      error("Could not cancel scan", err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSelectScan = (scan: Scan) => {
    setActiveScan(scan);
    router.replace(`/projects/${projectId}/audit?scanId=${scan.id}`);
  };

  const handleScanCreated = (newScanId: string) => {
    setIsNewScanModalOpen(false);
    api.getScan(newScanId).then((newScan) => {
      setActiveScan(newScan);
      setScansList((prev) => [newScan, ...prev]);
      router.replace(`/projects/${projectId}/audit?scanId=${newScanId}`);
    });
  };

  const isScanInFlight = Boolean(
    activeScan &&
      activeScan.status !== "completed" &&
      activeScan.status !== "failed" &&
      activeScan.status !== "cancelled"
  );

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="py-12 text-center">
          <h2 className="text-lg font-bold text-slate-100 mb-2">Project Not Found</h2>
          <Link href="/projects">
            <Button variant="primary" size="sm">Back to Projects</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/projects/${projectId}`}>
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Project Overview
              </Button>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <span>Technical SEO & Crawler Cockpit</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Phase 2 Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: <span className="font-mono text-slate-800 font-semibold">{project.domain}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isScanInFlight && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancelScan}
                isLoading={isCancelling}
                leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
              >
                Cancel Crawl
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewScanModalOpen(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              {activeScan ? "Re-run Audit" : "Start New Audit"}
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {!activeScan ? (
          <Card className="p-12 text-center border-dashed border-slate-200 bg-white shadow-xs">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Audits Executed Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Launch the website crawler to inspect internal pages, evaluate technical SEO rules, discover broken links, and generate deterministic category scores.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsNewScanModalOpen(true)}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Launch Website Crawler
            </Button>
          </Card>
        ) : isScanInFlight ? (
          /* Live In-Flight Crawler Cockpit */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-slate-200 bg-white space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <ScanStatusBadge status={activeScan.status} size="md" />
                      <span className="text-xs text-slate-500 capitalize">
                        ({activeScan.scan_type.replace("_", " ")})
                      </span>
                    </div>
                    <div className="text-sm font-mono text-slate-900 truncate" title={activeScan.target_url}>
                      {activeScan.target_url}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Initiated</span>
                      <span>{formatDate(activeScan.created_at)}</span>
                    </div>
                  </div>
                </div>

                <ScanProgressTracker
                  status={activeScan.status}
                  progress={activeScan.progress}
                  currentStep={activeScan.current_step}
                />
              </Card>

              {/* In-Flight Live Crawl Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-slate-500">Pages Discovered</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                    {activeScan.pages_discovered}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-slate-500">Pages Crawled</span>
                  <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">
                    {activeScan.pages_crawled}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-slate-500">Failed / Errors</span>
                  <div className={`text-2xl font-bold font-mono mt-1 ${activeScan.pages_failed > 0 ? "text-rose-600" : "text-slate-700"}`}>
                    {activeScan.pages_failed}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-slate-500">Issues Found</span>
                  <div className="text-2xl font-bold text-amber-600 font-mono mt-1">
                    {activeScan.issues_count}
                  </div>
                </div>
              </div>

              {/* Streaming Logs */}
              <ScanLogsViewer logs={activeScan.logs} isStreaming={true} />
            </div>

            {/* Right Column: Scan History */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Audit History ({scansList.length})
              </h3>
              <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                {scansList.map((s) => {
                  const isSelected = s.id === activeScan.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectScan(s)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-300 ring-1 ring-blue-400 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <ScanStatusBadge status={s.status} size="sm" />
                        <span className="text-[10px] font-mono text-slate-500">{s.progress}%</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 truncate">{s.target_url}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                        <span className="capitalize">{s.scan_type.replace("_", " ")}</span>
                        <span>{formatTimeAgo(s.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Completed Phase 2 Audit Dashboard */
          <div className="space-y-8">
            {/* SEO Score Hero */}
            <ScoreOverviewHero
              overallScore={scanResults?.overall_score ?? activeScan.overall_score ?? null}
              scoreLabel={scanResults?.score_label ?? null}
              technicalScore={scanResults?.technical_score ?? activeScan.technical_score ?? null}
              indexabilityScore={scanResults?.indexability_score ?? activeScan.indexability_score ?? null}
              metadataScore={scanResults?.metadata_score ?? activeScan.metadata_score ?? null}
              linksScore={scanResults?.links_score ?? activeScan.links_score ?? null}
              scoreBreakdown={scanResults?.score_breakdown}
              pagesCrawled={scanResults?.pages_crawled ?? activeScan.pages_crawled ?? 0}
              issuesCount={scanResults?.issues_count ?? activeScan.issues_count ?? 0}
              crawlDuration={scanResults?.crawl_duration ?? activeScan.crawl_duration}
            />

            {/* Severity Pill Filter Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Filter Detected Issues by Severity
              </h3>
              <IssueSummaryCards
                severityCounts={
                  scanResults?.severity_counts || {
                    critical: 0,
                    high: 0,
                    medium: 0,
                    low: 0,
                    info: 0,
                  }
                }
                selectedSeverity={selectedSeverity}
                onSelectSeverity={(sev) => {
                  setSelectedSeverity(sev);
                  setIssuesPage(1);
                }}
                totalIssues={scanResults?.issues_count ?? activeScan.issues_count ?? 0}
              />
            </div>

            {/* Audit Cockpit Tabs */}
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-px">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("issues")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === "issues"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Technical SEO Issues</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-100 text-slate-700">
                      {issuesTotal || scanResults?.issues_count || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("pages")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === "pages"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Crawled Webpages</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-100 text-slate-700">
                      {pagesTotal || scanResults?.pages_crawled || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("telemetry")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === "telemetry"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Terminal className="w-4 h-4 text-purple-500" />
                    <span>Crawler Logs & Diagnostics</span>
                  </button>
                </div>

                <div className="text-xs text-slate-500 hidden sm:block">
                  Crawl Date: <span className="text-slate-800 font-semibold">{formatDate(activeScan.created_at)}</span>
                </div>
              </div>

              {/* Tab 1: Issues View */}
              {activeTab === "issues" && (
                <IssuesTable
                  issues={issues}
                  total={issuesTotal}
                  currentPage={issuesPage}
                  pageSize={25}
                  onPageChange={(p) => setIssuesPage(p)}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(c) => {
                    setSelectedCategory(c);
                    setIssuesPage(1);
                  }}
                  searchQuery={issuesSearch}
                  onSearchChange={(q) => {
                    setIssuesSearch(q);
                    setIssuesPage(1);
                  }}
                  isLoading={isLoadingIssues}
                />
              )}

              {/* Tab 2: Pages View */}
              {activeTab === "pages" && (
                <PagesTable
                  scanId={activeScan.id}
                  pages={pages}
                  total={pagesTotal}
                  currentPage={pagesPage}
                  pageSize={25}
                  onPageChange={(p) => setPagesPage(p)}
                  searchQuery={pagesSearch}
                  onSearchChange={(q) => {
                    setPagesSearch(q);
                    setPagesPage(1);
                  }}
                  statusCodeFilter={statusCodeFilter}
                  onStatusCodeFilterChange={(code) => {
                    setStatusCodeFilter(code);
                    setPagesPage(1);
                  }}
                  indexabilityFilter={indexabilityFilter}
                  onIndexabilityFilterChange={(ind) => {
                    setIndexabilityFilter(ind);
                    setPagesPage(1);
                  }}
                  isLoading={isLoadingPages}
                />
              )}

              {/* Tab 3: Telemetry & Logs View */}
              {activeTab === "telemetry" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <span className="text-xs text-slate-500 font-semibold uppercase">robots.txt Status</span>
                      <div className="text-sm font-mono text-slate-800 mt-2 font-medium">
                        {scanResults?.meta_data?.robots
                          ? `Found (${(scanResults.meta_data.robots as any).status_code || 200})`
                          : "Verified"}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <span className="text-xs text-slate-500 font-semibold uppercase">XML Sitemap</span>
                      <div className="text-sm font-mono text-slate-800 mt-2 font-medium">
                        {scanResults?.meta_data?.sitemaps
                          ? `${(scanResults.meta_data.sitemaps as any).urls_count || 0} URLs Extracted`
                          : "Discovered"}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <span className="text-xs text-slate-500 font-semibold uppercase">Crawl Duration</span>
                      <div className="text-sm font-mono text-slate-800 mt-2 font-medium">
                        {scanResults?.crawl_duration ? `${scanResults.crawl_duration}s` : "Recorded"}
                      </div>
                    </div>
                  </div>

                  <ScanLogsViewer logs={activeScan.logs} isStreaming={false} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Start New Audit Modal */}
      <StartAuditModal
        project={project}
        isOpen={isNewScanModalOpen}
        onClose={() => setIsNewScanModalOpen(false)}
        onScanCreated={handleScanCreated}
      />
    </DashboardShell>
  );
}
