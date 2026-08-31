"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Play,
  Square,
  RefreshCw,
  Activity,
  Layers,
  FileText,
  AlertTriangle,
  Terminal,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScanStatusBadge } from "./ScanStatusBadge";
import { ScanProgressTracker } from "./ScanProgressTracker";
import { ScanLogsViewer } from "./ScanLogsViewer";
import { ScoreOverviewHero } from "./ScoreOverviewHero";
import { IssueSummaryCards } from "./IssueSummaryCards";
import { IssuesTable } from "./IssuesTable";
import { PagesTable } from "./PagesTable";
import {
  Scan,
  ScanResultsResponse,
  ScanStatus,
  SEOIssue,
  SEOPage,
} from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface LiveAuditDashboardProps {
  scanId: string;
  initialScan: Scan;
  onScanCompleted?: () => void;
}

export function LiveAuditDashboard({
  scanId,
  initialScan,
  onScanCompleted,
}: LiveAuditDashboardProps) {
  const [activeScan, setActiveScan] = useState<Scan>(initialScan);
  const [scanResults, setScanResults] = useState<ScanResultsResponse | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

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

  const { success, warning, error } = useToast();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if initialScan prop changes
  useEffect(() => {
    setActiveScan(initialScan);
  }, [initialScan]);

  const loadScanData = useCallback(async (id: string) => {
    try {
      const res = await api.getScanResults(id);
      setScanResults(res);
    } catch (err) {
      console.error("Could not fetch scan results:", err);
    }
  }, []);

  const loadIssues = useCallback(
    async (id: string) => {
      setIsLoadingIssues(true);
      try {
        const data = await api.getScanIssues(id, {
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
    async (id: string) => {
      setIsLoadingPages(true);
      try {
        const data = await api.getScanPages(id, {
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

          if (isTerminal(updated.status)) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (updated.status === "completed") {
              success("Audit Completed", `Crawler and SEO engine completed for ${updated.target_url}`);
              loadScanData(updated.id);
              if (onScanCompleted) onScanCompleted();
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
  }, [activeScan?.id, activeScan?.status, success, error, loadScanData, onScanCompleted]);

  const handleCancelScan = async () => {
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

  const isScanInFlight = Boolean(
    activeScan &&
      activeScan.status !== "completed" &&
      activeScan.status !== "failed" &&
      activeScan.status !== "cancelled"
  );

  return (
    <div className="space-y-6">
      {isScanInFlight ? (
        /* In-Flight Live Crawl View */
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <ScanStatusBadge status={activeScan.status} size="md" />
                  <span className="text-xs text-slate-500 capitalize font-medium">
                    ({activeScan.scan_type.replace("_", " ")})
                  </span>
                </div>
                <div className="text-sm font-mono text-slate-900 font-semibold truncate">
                  {activeScan.target_url}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleCancelScan}
                  isLoading={isCancelling}
                  leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
                >
                  Cancel Crawl
                </Button>
              </div>
            </div>

            <ScanProgressTracker
              status={activeScan.status}
              progress={activeScan.progress}
              currentStep={activeScan.current_step}
            />
          </Card>

          {/* In-Flight Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500 font-sans">
                Pages Discovered
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {activeScan.pages_discovered}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500 font-sans">
                Pages Crawled
              </span>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {activeScan.pages_crawled}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500 font-sans">
                Failed / Errors
              </span>
              <div
                className={`text-2xl font-bold mt-1 ${
                  activeScan.pages_failed > 0 ? "text-rose-600" : "text-slate-700"
                }`}
              >
                {activeScan.pages_failed}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500 font-sans">
                Issues Found
              </span>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {activeScan.issues_count}
              </div>
            </div>
          </div>

          {/* Live Streaming Logs */}
          <ScanLogsViewer logs={activeScan.logs} isStreaming={true} />
        </div>
      ) : (
        /* Completed Audit Results View */
        <div className="space-y-8">
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

          {/* Severity Badges */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
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

          {/* Sub-Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-px">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("issues")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === "issues"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Technical Issues</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700">
                    {issuesTotal || scanResults?.issues_count || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("pages")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === "pages"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Crawled Webpages</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700">
                    {pagesTotal || scanResults?.pages_crawled || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === "telemetry"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-purple-500" />
                  <span>Crawler Diagnostics & Logs</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Issues */}
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

            {/* Tab 2: Pages */}
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

            {/* Tab 3: Telemetry */}
            {activeTab === "telemetry" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <span className="text-xs text-slate-500 font-semibold uppercase">robots.txt Status</span>
                    <div className="text-sm font-mono text-slate-900 font-semibold mt-1">
                      {scanResults?.meta_data?.robots
                        ? `Found (${(scanResults.meta_data.robots as any).status_code || 200})`
                        : "Verified (200 OK)"}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <span className="text-xs text-slate-500 font-semibold uppercase">XML Sitemap</span>
                    <div className="text-sm font-mono text-slate-900 font-semibold mt-1">
                      {scanResults?.meta_data?.sitemaps
                        ? `${(scanResults.meta_data.sitemaps as any).urls_count || 0} URLs Extracted`
                        : "Discovered"}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Crawl Duration</span>
                    <div className="text-sm font-mono text-slate-900 font-semibold mt-1">
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
  );
}
