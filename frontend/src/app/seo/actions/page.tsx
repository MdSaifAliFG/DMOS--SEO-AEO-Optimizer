"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ListTodo,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Search,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  ShieldCheck,
  CheckSquare,
  Square,
  Eye,
  Layers,
  FileText,
  TrendingUp,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { api } from "@/lib/api-client";
import {
  Project,
  Scan,
  SeoOptimizationSummary,
  SeoRecommendation,
  RecommendationPriority,
  RecommendationStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export default function SeoActionsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [scans, setScans] = useState<Scan[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string>("");

  const [actions, setActions] = useState<SeoRecommendation[]>([]);
  const [summary, setSummary] = useState<SeoOptimizationSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Drawer & Selection
  const [selectedAction, setSelectedAction] = useState<SeoRecommendation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<{ message: string; is_fixed: boolean } | null>(null);
  const [actionNotes, setActionNotes] = useState<string>("");
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);

  // Initial Load: Fetch Projects
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const res = await api.getProjects({ limit: 50 });
        setProjects(res.projects);
        if (res.projects.length > 0) {
          setSelectedProjectId(res.projects[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // When Project changes, fetch scans and summary
  useEffect(() => {
    if (!selectedProjectId) return;

    async function loadProjectActions() {
      try {
        setLoading(true);
        setError(null);
        setSelectedActionIds([]);
        setIsDrawerOpen(false);
        setSelectedAction(null);

        // Fetch Scans for selector
        const scansRes = await api.getProjectScans(selectedProjectId, { limit: 10 });
        setScans(scansRes.scans);
        const latestScan = scansRes.scans.find((s: Scan) => s.status === "completed") || scansRes.scans[0];
        const targetScanId = latestScan ? latestScan.id : "";
        setSelectedScanId(targetScanId);

        // Fetch Summary KPIs & Actions
        const [sumRes, actsRes] = await Promise.all([
          api.getSeoActionsSummary(selectedProjectId),
          api.getSeoActions({ project_id: selectedProjectId, scan_id: targetScanId }),
        ]);

        setSummary(sumRes);
        setActions(actsRes.recommendations);
      } catch (err: any) {
        setError(err.message || "Failed to load optimization actions");
      } finally {
        setLoading(false);
      }
    }

    loadProjectActions();
  }, [selectedProjectId]);

  // When Scan changes specifically
  const handleScanChange = async (scanId: string) => {
    setSelectedScanId(scanId);
    try {
      setLoading(true);
      const actsRes = await api.getSeoActions({
        project_id: selectedProjectId,
        scan_id: scanId || undefined,
      });
      setActions(actsRes.recommendations);
    } catch (err: any) {
      setError(err.message || "Failed to load actions for scan");
    } finally {
      setLoading(false);
    }
  };

  // Filtered Actions
  const filteredActions = useMemo(() => {
    return actions.filter((act) => {
      if (statusFilter !== "all" && act.status !== statusFilter) return false;
      if (priorityFilter !== "all" && act.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && act.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(query);
        const matchesCode = act.issue_code.toLowerCase().includes(query);
        const matchesDesc = act.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCode && !matchesDesc) return false;
      }
      return true;
    });
  }, [actions, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  // Handle Action selection for Drawer
  const openActionDrawer = (action: SeoRecommendation) => {
    setSelectedAction(action);
    setActionNotes(action.notes || "");
    setVerifyResult(null);
    setIsDrawerOpen(true);
  };

  // Update Status
  const handleUpdateStatus = async (actionId: string, newStatus: RecommendationStatus) => {
    try {
      const updated = await api.updateSeoAction(actionId, { status: newStatus });
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
      if (selectedAction?.id === actionId) {
        setSelectedAction(updated);
      }
      // Refresh summary
      if (selectedProjectId) {
        api.getSeoActionsSummary(selectedProjectId).then(setSummary).catch(console.error);
      }
    } catch (err: any) {
      alert(`Error updating action: ${err.message}`);
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedAction) return;
    try {
      setIsSavingNotes(true);
      const updated = await api.updateSeoAction(selectedAction.id, { notes: actionNotes });
      setSelectedAction(updated);
      setActions((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch (err: any) {
      alert(`Error saving notes: ${err.message}`);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Live Verify Fix
  const handleVerifyFix = async () => {
    if (!selectedAction) return;
    try {
      setIsVerifying(true);
      setVerifyResult(null);
      const res = await api.verifySeoAction(selectedAction.id);
      setVerifyResult({ message: res.message, is_fixed: res.is_fixed });
      if (res.is_fixed) {
        setActions((prev) =>
          prev.map((a) =>
            a.id === selectedAction.id
              ? { ...a, status: "fixed" as RecommendationStatus, verification_status: "verified" }
              : a
          )
        );
        setSelectedAction((prev) =>
          prev ? { ...prev, status: "fixed" as RecommendationStatus, verification_status: "verified" } : null
        );
        if (selectedProjectId) {
          api.getSeoActionsSummary(selectedProjectId).then(setSummary).catch(console.error);
        }
      }
    } catch (err: any) {
      setVerifyResult({ message: `Verification failed: ${err.message}`, is_fixed: false });
    } finally {
      setIsVerifying(false);
    }
  };

  // Bulk Status Update
  const handleBulkUpdate = async (status: RecommendationStatus) => {
    if (selectedActionIds.length === 0) return;
    try {
      await api.bulkUpdateSeoActions({ action_ids: selectedActionIds, status });
      setActions((prev) =>
        prev.map((a) => (selectedActionIds.includes(a.id) ? { ...a, status } : a))
      );
      setSelectedActionIds([]);
      if (selectedProjectId) {
        api.getSeoActionsSummary(selectedProjectId).then(setSummary).catch(console.error);
      }
    } catch (err: any) {
      alert(`Bulk update error: ${err.message}`);
    }
  };

  // Select All Toggle
  const toggleSelectAll = () => {
    if (selectedActionIds.length === filteredActions.length) {
      setSelectedActionIds([]);
    } else {
      setSelectedActionIds(filteredActions.map((a) => a.id));
    }
  };

  const toggleSelectAction = (id: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredActions.length === 0) return;
    const headers = [
      "Priority",
      "Priority Score",
      "Action Title",
      "Issue Code",
      "Category",
      "Status",
      "SEO Impact (+pts)",
      "Effort",
      "Affected Pages Count",
      "Sample URLs",
      "How to Fix",
    ];

    const rows = filteredActions.map((a) => [
      `"${a.priority.toUpperCase()}"`,
      a.priority_score,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.issue_code}"`,
      `"${a.category}"`,
      `"${a.status}"`,
      `"+${a.estimated_impact}"`,
      `"${a.effort}"`,
      a.affected_pages_count,
      `"${(a.affected_urls || []).slice(0, 3).join("; ")}"`,
      `"${a.how_to_fix.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dmos_seo_actions_${selectedProjectId || "export"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Phase 4 Engine
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <ListTodo className="w-7 h-7 text-emerald-400" />
              SEO Action Center
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Turn SEO audit findings into prioritized, high-impact optimization tasks.
          </p>
        </div>

        {/* Project & Audit Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400 font-medium">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>
          </div>

          {scans.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
              <span className="text-xs text-slate-400 font-medium">Audit:</span>
              <select
                value={selectedScanId}
                onChange={(e) => handleScanChange(e.target.value)}
                className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {new Date(s.created_at).toLocaleDateString()} — Score: {s.overall_score ?? "N/A"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            title="Export actions to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs text-slate-400 font-medium">Total Actions</div>
            <div className="text-2xl font-bold text-white mt-1">{summary.total_actions}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all categories</div>
          </div>

          <div className="bg-slate-900/80 border border-rose-500/20 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Critical
            </div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{summary.critical_actions}</div>
            <div className="text-[11px] text-rose-500/70 mt-0.5">Immediate fix needed</div>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs text-amber-400 font-medium">High Priority</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{summary.high_priority_actions}</div>
            <div className="text-[11px] text-amber-500/70 mt-0.5">High ranking value</div>
          </div>

          <div className="bg-slate-900/80 border border-blue-500/20 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs text-blue-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> In Progress
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{summary.in_progress_actions}</div>
            <div className="text-[11px] text-blue-500/70 mt-0.5">Being optimized</div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fixed
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.fixed_actions}</div>
            <div className="text-[11px] text-emerald-500/70 mt-0.5">{summary.optimization_progress}% completed</div>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Est. SEO Impact
            </div>
            <div className="text-2xl font-bold text-purple-300 mt-1">+{summary.estimated_seo_impact} pts</div>
            <div className="text-[11px] text-purple-400/70 mt-0.5">Recoverable score</div>
          </div>

          <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs text-indigo-400 font-medium">Potential Score</div>
            <div className="text-2xl font-bold text-indigo-300 mt-1">{summary.potential_seo_score}/100</div>
            <div className="text-[11px] text-indigo-400/70 mt-0.5">Current: {summary.current_seo_score}</div>
          </div>
        </div>
      )}

      {/* Filter Toolbar & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {[
              { id: "all", label: "All Actions" },
              { id: "open", label: "Open" },
              { id: "in_progress", label: "In Progress" },
              { id: "fixed", label: "Fixed" },
              { id: "ignored", label: "Ignored" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md font-medium transition",
                  statusFilter === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar & Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search action or issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical (90-100)</option>
              <option value="high">High (70-89)</option>
              <option value="medium">Medium (40-69)</option>
              <option value="low">Low (0-39)</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="indexability">Indexability</option>
              <option value="metadata">Metadata</option>
              <option value="content">Content</option>
              <option value="links">Links</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when items selected) */}
        {selectedActionIds.length > 0 && (
          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-4 py-2.5 animate-fadeIn">
            <div className="text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              {selectedActionIds.length} action{selectedActionIds.length > 1 ? "s" : ""} selected
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkUpdate("in_progress")}
                className="px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleBulkUpdate("fixed")}
                className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition"
              >
                Mark Fixed
              </button>
              <button
                onClick={() => handleBulkUpdate("ignored")}
                className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              >
                Ignore
              </button>
              <button
                onClick={() => setSelectedActionIds([])}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Actions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
            Loading optimization actions...
          </div>
        ) : filteredActions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/40 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-200">No matching SEO actions</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {actions.length === 0
                ? "No audit findings detected yet. Run an SEO audit from the dashboard to generate optimization actions."
                : "No actions match your current status, priority, or search filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-3.5 w-10 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                      {selectedActionIds.length === filteredActions.length && filteredActions.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5 w-28">Priority</th>
                  <th className="p-3.5">Optimization Action</th>
                  <th className="p-3.5 w-28">Category</th>
                  <th className="p-3.5 w-28">Affected Pages</th>
                  <th className="p-3.5 w-24">Impact</th>
                  <th className="p-3.5 w-28">Status</th>
                  <th className="p-3.5 w-28 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredActions.map((act) => {
                  const isSelected = selectedActionIds.includes(act.id);
                  const isCrit = act.priority === "critical";
                  const isHigh = act.priority === "high";
                  const isMed = act.priority === "medium";

                  return (
                    <tr
                      key={act.id}
                      className={cn(
                        "hover:bg-slate-800/40 transition cursor-pointer",
                        isSelected && "bg-emerald-950/20"
                      )}
                      onClick={() => openActionDrawer(act)}
                    >
                      <td
                        className="p-3.5 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectAction(act.id);
                        }}
                      >
                        <button className="text-slate-400 hover:text-white">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Priority Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1",
                            isCrit && "bg-rose-500/15 text-rose-400 border border-rose-500/30",
                            isHigh && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                            isMed && "bg-blue-500/15 text-blue-400 border border-blue-500/30",
                            !isCrit && !isHigh && !isMed && "bg-slate-800 text-slate-400 border border-slate-700"
                          )}
                        >
                          {act.priority} ({Math.round(act.priority_score)})
                        </span>
                      </td>

                      {/* Action Title & Code */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-100 text-sm">{act.title}</div>
                        <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">{act.description}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">Code: {act.issue_code}</div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-medium capitalize">
                          {act.category}
                        </span>
                      </td>

                      {/* Affected Pages */}
                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-300">
                        {act.affected_pages_count} URL{act.affected_pages_count > 1 ? "s" : ""}
                      </td>

                      {/* Estimated Impact */}
                      <td className="p-3.5 whitespace-nowrap font-bold text-purple-400">
                        +{act.estimated_impact} pts
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1",
                            act.status === "open" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                            act.status === "in_progress" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                            act.status === "fixed" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                            act.status === "ignored" && "bg-slate-800 text-slate-500 border border-slate-700"
                          )}
                        >
                          {act.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* View Button */}
                      <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openActionDrawer(act)}
                          className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded border border-slate-700 transition inline-flex items-center gap-1"
                        >
                          Optimize <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Detail Slide-Out Drawer */}
      {isDrawerOpen && selectedAction && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/70">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-bold uppercase",
                      selectedAction.priority === "critical" && "bg-rose-500/15 text-rose-400 border border-rose-500/30",
                      selectedAction.priority === "high" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                      selectedAction.priority === "medium" && "bg-blue-500/15 text-blue-400 border border-blue-500/30",
                      selectedAction.priority === "low" && "bg-slate-800 text-slate-400 border border-slate-700"
                    )}
                  >
                    {selectedAction.priority} Priority ({Math.round(selectedAction.priority_score)}/100)
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 capitalize font-medium">
                    {selectedAction.category}
                  </span>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                    +{selectedAction.estimated_impact} pts SEO Impact
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-2">{selectedAction.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Code: {selectedAction.issue_code}</p>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Verification Banner */}
              {verifyResult && (
                <div
                  className={cn(
                    "p-3.5 rounded-lg border text-xs flex items-start gap-2.5",
                    verifyResult.is_fixed
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-950/40 border-rose-500/30 text-rose-300"
                  )}
                >
                  {verifyResult.is_fixed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{verifyResult.is_fixed ? "Verification Passed" : "Verification Incomplete"}</div>
                    <div className="mt-0.5 text-slate-300">{verifyResult.message}</div>
                  </div>
                </div>
              )}

              {/* Why This Matters */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  Why This Matters
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                  {selectedAction.why_it_matters}
                </p>
              </div>

              {/* How to Fix */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  How to Fix (Step-by-Step)
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-500/20 font-sans">
                  {selectedAction.how_to_fix}
                </div>
              </div>

              {/* Current State vs Recommended State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-rose-500/20">
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Current State</div>
                  <div className="text-xs text-slate-300 font-mono mt-1.5 break-all">
                    {selectedAction.current_state || "Issue detected in HTML payload"}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-500/20">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Recommended State</div>
                  <div className="text-xs text-slate-300 font-mono mt-1.5 break-all">
                    {selectedAction.recommended_state || "Clean standard specification"}
                  </div>
                </div>
              </div>

              {/* Affected URLs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Affected URLs ({selectedAction.affected_pages_count})
                  </h4>
                  {selectedAction.category === "metadata" && (
                    <Link
                      href="/seo/optimize/metadata"
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                    >
                      Open in Metadata Optimizer <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                <div className="bg-slate-950/80 rounded-lg border border-slate-800 divide-y divide-slate-800/50 max-h-48 overflow-y-auto">
                  {(selectedAction.affected_urls || []).map((url, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-900/50">
                      <span className="text-slate-300 font-mono truncate max-w-md">{url}</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-emerald-400 ml-2"
                        title="Open live URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Team Documentation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Optimization Notes & Documentation
                </h4>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add notes about who fixed this, ticket numbers, or deployment dates..."
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 h-20"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                >
                  {isSavingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
              {/* Status Change Toggles */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Set Status:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedAction.id, "open")}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition",
                    selectedAction.status === "open" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  Open
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedAction.id, "in_progress")}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition",
                    selectedAction.status === "in_progress" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedAction.id, "fixed")}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition",
                    selectedAction.status === "fixed" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  Fixed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedAction.id, "ignored")}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition",
                    selectedAction.status === "ignored" ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  Ignore
                </button>
              </div>

              {/* Verify Fix Button */}
              <button
                onClick={handleVerifyFix}
                disabled={isVerifying}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition shadow-md disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Live URL...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Verify Fix on Live Site
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
