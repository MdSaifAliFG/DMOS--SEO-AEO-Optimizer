"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertCircle,
  Play,
  RotateCcw,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  AlertTriangle,
  Download,
  Filter,
  XCircle,
  HelpCircle,
  ArrowUpDown,
  Search,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  GeoProject,
  GeoRecommendation,
  GeoActionSummary,
  GeoIssue,
} from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

function GeoActionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "issues" ? "issues" : "actions";

  const [activeTab, setActiveTab] = useState<"actions" | "issues">(initialTab);
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Actions Tab State
  const [actions, setActions] = useState<GeoRecommendation[]>([]);
  const [summary, setSummary] = useState<GeoActionSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingActions, setIsLoadingActions] = useState(true);

  // Issues Tab State
  const [issues, setIssues] = useState<GeoIssue[]>([]);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [issueStatusFilter, setIssueStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIssue, setActiveIssue] = useState<GeoIssue | null>(null);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);

  const { success, error } = useToast();

  const handleTabChange = (tab: "actions" | "issues") => {
    setActiveTab(tab);
    router.replace(`/geo/actions?tab=${tab}`, { scroll: false });
  };

  const loadProjects = async () => {
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchActionsData(projs[0].id);
        fetchIssuesData(projs[0].id);
      } else {
        setIsLoadingActions(false);
        setIsLoadingIssues(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoadingActions(false);
      setIsLoadingIssues(false);
    }
  };

  const fetchActionsData = async (projectId: string) => {
    setIsLoadingActions(true);
    try {
      const [actsRes, sumRes] = await Promise.all([
        api.getGeoActions(projectId, {
          status: statusFilter !== "all" ? statusFilter : undefined,
          priority_level: priorityFilter !== "all" ? priorityFilter : undefined,
        }),
        api.getGeoActionsSummary(projectId),
      ]);
      setActions(actsRes.recommendations || []);
      setSummary(sumRes);
      setSelectedIds([]);
    } catch (err) {
      error("Failed to load GEO actions.");
    } finally {
      setIsLoadingActions(false);
    }
  };

  const fetchIssuesData = async (projectId: string) => {
    setIsLoadingIssues(true);
    try {
      const res = await api.getGeoIssues(projectId, {
        severity: severityFilter !== "all" ? severityFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        status: issueStatusFilter !== "all" ? issueStatusFilter : undefined,
      });
      setIssues(res.issues || []);
    } catch (err) {
      error("Failed to load GEO issues.");
    } finally {
      setIsLoadingIssues(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchActionsData(selectedProjectId);
    }
  }, [selectedProjectId, statusFilter, priorityFilter]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchIssuesData(selectedProjectId);
    }
  }, [selectedProjectId, severityFilter, categoryFilter, issueStatusFilter]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === actions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(actions.map((a) => a.id));
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.updateGeoAction(id, { status: newStatus });
      success(`Action updated to ${newStatus}`);
      fetchActionsData(selectedProjectId);
    } catch (err) {
      error("Failed to update action status.");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await api.verifyGeoAction(id);
      success(`Action verified! Estimated score uplift logged.`);
      fetchActionsData(selectedProjectId);
    } catch (err) {
      error("Failed to verify action.");
    }
  };

  const handleBulkAction = async (actionType: "complete" | "ignore" | "verify" | "start") => {
    if (selectedIds.length === 0 || !selectedProjectId) return;
    setIsProcessing(true);
    try {
      const res = await api.bulkUpdateGeoActions(selectedProjectId, selectedIds, actionType);
      success(`Updated ${res.updated} actions.`);
      fetchActionsData(selectedProjectId);
    } catch (err) {
      error("Failed to perform bulk update.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.issue_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50";
      case "high":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <ListTodo className="w-3.5 h-3.5" />
              Unified Action &amp; Diagnosis Center
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Action Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prescriptive generative optimizations, deterministic rules (GEO001-GEO042), and estimated score impacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "issues" && selectedProjectId && (
              <a
                href={api.getGeoIssuesCsvExportUrl(selectedProjectId)}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </a>
            )}

            {projects.length > 0 && (
              <select
                aria-label="Select GEO Project"
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  fetchActionsData(e.target.value);
                  fetchIssuesData(e.target.value);
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
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
          <button
            type="button"
            onClick={() => handleTabChange("actions")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "actions"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-200 dark:border-amber-800/60"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-amber-500" />
            <span>Recommended Actions</span>
            {actions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {actions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("issues")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "issues"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-200 dark:border-amber-800/60"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Deterministic Rules &amp; Issues</span>
            {issues.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {issues.length}
              </span>
            )}
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: RECOMMENDED ACTIONS */}
        {/* ================================================================= */}
        {activeTab === "actions" && (
          <div className="space-y-6">
            {/* KPI Summary Banner */}
            {summary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 border-slate-200 dark:border-slate-800 bg-linear-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-slate-900">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Open Actions</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                    {summary.open_actions}
                  </div>
                  <div className="text-[11px] text-slate-500">of {summary.total_actions} total tasks</div>
                </Card>

                <Card className="p-4 border-slate-200 dark:border-slate-800 bg-linear-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-slate-900">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Completed</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {summary.completed_actions}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {summary.total_actions > 0
                      ? Math.round((summary.completed_actions / summary.total_actions) * 100)
                      : 0}
                    % resolution rate
                  </div>
                </Card>

                <Card className="p-4 border-slate-200 dark:border-slate-800 bg-linear-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-slate-900">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Verified Fixes</span>
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {summary.verified_actions}
                  </div>
                  <div className="text-[11px] text-slate-500">Confirmed in live AI scans</div>
                </Card>

                <Card className="p-4 border-slate-200 dark:border-slate-800 bg-linear-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/60 dark:border-amber-900/40">
                  <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-1">
                    <span className="text-xs font-medium">Est. Potential Gain</span>
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">
                    +{(summary.potential_total_gain || 0).toFixed(1)} pts
                  </div>
                  <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
                    Projected GEO uplift (EST.)
                  </div>
                </Card>
              </div>
            )}

            {/* Filter Bar & Bulk Actions */}
            <Card className="p-4 border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="ignored">Ignored</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {selectedIds.length} selected
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("complete")}
                      disabled={isProcessing}
                      className="text-xs"
                    >
                      Mark Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("verify")}
                      disabled={isProcessing}
                      className="text-xs"
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("ignore")}
                      disabled={isProcessing}
                      className="text-xs text-rose-600 hover:text-rose-700"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions Table */}
            {isLoadingActions ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : actions.length === 0 ? (
              <EmptyState
                icon={ListTodo}
                title="No Recommendations Pending"
                description="Run an audit or update filters to discover prescriptive generative optimization tasks."
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2 text-xs font-medium text-slate-500">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="p-1 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {selectedIds.length === actions.length && actions.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <span>Select All ({actions.length} tasks)</span>
                </div>

                {actions.map((act) => {
                  const isSelected = selectedIds.includes(act.id);
                  return (
                    <Card
                      key={act.id}
                      className={`p-4 border transition-all ${
                        isSelected
                          ? "border-amber-500/50 bg-amber-50/20 dark:bg-amber-950/10"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(act.id)}
                          className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                                act.priority_level === "critical"
                                  ? "bg-rose-500/10 text-rose-600 border border-rose-200 dark:border-rose-900/50"
                                  : act.priority_level === "high"
                                  ? "bg-orange-500/10 text-orange-600 border border-orange-200 dark:border-orange-900/50"
                                  : act.priority_level === "medium"
                                  ? "bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-900/50"
                                  : "bg-slate-500/10 text-slate-600 border border-slate-200 dark:border-slate-800"
                              }`}
                            >
                              {act.priority_level}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {act.title}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              ({act.recommendation_code})
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {act.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-500">
                            <div>
                              Category: <strong className="capitalize text-slate-700 dark:text-slate-300">{act.category}</strong>
                            </div>
                            <div>
                              Estimated Impact:{" "}
                              <strong className="text-emerald-600 dark:text-emerald-400">
                                +{(act.estimated_impact || 0).toFixed(1)} pts (EST.)
                              </strong>
                            </div>
                            <div>
                              Status:{" "}
                              <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                                {act.status.replace("_", " ")}
                              </span>
                            </div>
                            {act.verification_status && (
                              <div>
                                Verification:{" "}
                                <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">
                                  {act.verification_status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-center">
                          {act.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(act.id, "completed")}
                              className="text-xs"
                            >
                              Complete
                            </Button>
                          )}
                          {act.status === "completed" && act.verification_status !== "verified" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerify(act.id)}
                              className="text-xs text-blue-600 border-blue-200 dark:border-blue-900/50"
                            >
                              Verify
                            </Button>
                          )}
                          {act.status !== "ignored" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusUpdate(act.id, "ignored")}
                              className="text-xs text-slate-400 hover:text-rose-500"
                            >
                              Dismiss
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: DETERMINISTIC RULES & ISSUES */}
        {/* ================================================================= */}
        {activeTab === "issues" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="p-4 border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by code (GEO001-GEO042), title, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Categories</option>
                    <option value="accessibility">Accessibility &amp; Crawlers</option>
                    <option value="extractability">Extractability &amp; Directness</option>
                    <option value="entity_consistency">Entity Consistency</option>
                    <option value="authority">Authority &amp; Sources</option>
                    <option value="competitor_gap">Competitor Gap</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Issues Table */}
            {isLoadingIssues ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredIssues.length === 0 ? (
              <EmptyState
                icon={AlertTriangle}
                title="No Issues Match Criteria"
                description="Zero diagnostic rule violations detected for this filter state."
              />
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue) => (
                  <Card
                    key={issue.id}
                    onClick={() => setActiveIssue(issue)}
                    className="p-4 border border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-amber-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${getSeverityBadge(
                              issue.severity
                            )}`}
                          >
                            {issue.severity}
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                            {issue.issue_code}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {issue.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {issue.description}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <div>
                            Category: <span className="font-semibold text-slate-600 dark:text-slate-300">{issue.category.replace("_", " ")}</span>
                          </div>
                          <div>
                            Status: <span className="capitalize font-semibold text-slate-600 dark:text-slate-300">{issue.status}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 self-center" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Issue Detail Modal */}
            {activeIssue && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <Card className="max-w-xl w-full p-6 space-y-4 border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getSeverityBadge(activeIssue.severity)}`}>
                        {activeIssue.severity.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                        {activeIssue.issue_code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveIssue(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeIssue.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeIssue.description}
                    </p>
                  </div>

                  {activeIssue.evidence && Object.keys(activeIssue.evidence).length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Diagnostic Details:</span>
                      <pre className="text-[10px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
                        {JSON.stringify(activeIssue.evidence, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setActiveIssue(null);
                        handleTabChange("actions");
                      }}
                    >
                      View Linked Recommendations
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function GeoActionsPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <div className="space-y-6 p-6">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </DashboardShell>
      }
    >
      <GeoActionsContent />
    </Suspense>
  );
}
