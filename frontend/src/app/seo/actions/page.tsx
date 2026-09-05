"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  Flame,
  HelpCircle,
  Ban,
  Globe,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
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
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Drawer & Selection
  const [selectedAction, setSelectedAction] = useState<SeoRecommendation | null>(null);
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
        setProjects(res.projects || []);
        if (res.projects?.length > 0) {
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

  // Fetch Project Actions & Scans
  const fetchActionsData = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch Scans for selector
      const scansRes = await api.getProjectScans(selectedProjectId, { limit: 10 }).catch(() => ({ scans: [], total: 0 }));
      setScans(scansRes.scans || []);
      const latestScan = scansRes.scans?.find((s: Scan) => s.status === "completed") || scansRes.scans?.[0];
      const targetScanId = selectedScanId || (latestScan ? latestScan.id : "");
      if (!selectedScanId && latestScan) {
        setSelectedScanId(latestScan.id);
      }

      // Fetch Summary KPIs & Actions
      const [sumRes, actsRes] = await Promise.all([
        api.getSeoActionsSummary(selectedProjectId).catch(() => null),
        api.getSeoActions({
          project_id: selectedProjectId,
          scan_id: targetScanId || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          priority: priorityFilter !== "all" ? priorityFilter : undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          search: searchQuery.trim() || undefined,
          limit: 100,
        }),
      ]);

      setSummary(sumRes);
      setActions(actsRes.recommendations || []);
    } catch (err: any) {
      setError(err.message || "Failed to load optimization actions");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, selectedScanId, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchActionsData();
  }, [fetchActionsData]);

  // Drawer handlers
  const handleOpenDrawer = (action: SeoRecommendation) => {
    setSelectedAction(action);
    setActionNotes(action.notes || "");
    setVerifyResult(null);
  };

  const handleCloseDrawer = () => {
    setSelectedAction(null);
    setVerifyResult(null);
  };

  // Status Change
  const handleStatusChange = async (actionId: string, newStatus: RecommendationStatus) => {
    try {
      const updated = await api.updateSeoAction(actionId, { status: newStatus });
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
      if (selectedAction?.id === actionId) {
        setSelectedAction(updated);
      }
      if (selectedProjectId) {
        const sum = await api.getSeoActionsSummary(selectedProjectId);
        setSummary(sum);
      }
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedAction) return;
    setIsSavingNotes(true);
    try {
      const updated = await api.updateSeoAction(selectedAction.id, { notes: actionNotes });
      setSelectedAction(updated);
      setActions((prev) => prev.map((a) => (a.id === selectedAction.id ? updated : a)));
    } catch (err: any) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Live Verify
  const handleVerify = async (actionId: string) => {
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await api.verifySeoAction(actionId);
      setVerifyResult({ message: res.message, is_fixed: res.is_fixed });
      if (res.is_fixed) {
        setActions((prev) =>
          prev.map((a) => (a.id === actionId ? { ...a, status: "fixed", verification_status: "verified" } : a))
        );
        if (selectedAction?.id === actionId) {
          setSelectedAction((prev) => (prev ? { ...prev, status: "fixed", verification_status: "verified" } : null));
        }
      }
      if (selectedProjectId) {
        const sum = await api.getSeoActionsSummary(selectedProjectId);
        setSummary(sum);
      }
    } catch (err: any) {
      alert("Verification failed: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // Bulk Operations
  const handleToggleSelectAll = () => {
    if (selectedActionIds.length === actions.length) {
      setSelectedActionIds([]);
    } else {
      setSelectedActionIds(actions.map((a) => a.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = async (newStatus: RecommendationStatus) => {
    if (!selectedActionIds.length) return;
    try {
      await api.bulkUpdateSeoActions({
        action_ids: selectedActionIds,
        status: newStatus,
      });
      setSelectedActionIds([]);
      fetchActionsData();
    } catch (err: any) {
      alert("Bulk update failed: " + err.message);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (actions.length === 0) return;
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

    const rows = actions.map((a) => [
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
    link.setAttribute("download", `seosensing_actions_${selectedProjectId || "export"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityBadge = (priority: string) => {
    const p = (priority || "medium").toLowerCase();
    if (p === "critical") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-600" />
          Critical
        </span>
      );
    }
    if (p === "high") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          High
        </span>
      );
    }
    if (p === "medium") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        Low
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "open").toLowerCase();
    if (s === "fixed" || s === "implemented") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Fixed
        </span>
      );
    }
    if (s === "in_progress") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <Clock className="w-3 h-3 animate-spin text-sky-600" />
          In Progress
        </span>
      );
    }
    if (s === "ignored" || s === "dismissed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <Ban className="w-3 h-3" />
          Ignored
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        Open
      </span>
    );
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Banner (Cohesive Sky Blue SEO Identity) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-cyan-900 to-slate-900 text-white shadow-md border border-sky-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
                <Sparkles className="w-5 h-5 text-sky-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">SEO Optimization & Action Center</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/20">
                Action Workspace
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-2xl">
              Turn technical audit findings into prioritized, high-impact tasks to recover organic search ranking and crawl health.
            </p>
          </div>

          {/* Project Switcher, Audit Selector & Export */}
          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-sky-950/80 border border-sky-700/60 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-sky-200">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {scans.length > 0 && (
              <div className="flex items-center gap-2 bg-sky-950/80 border border-sky-700/60 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-sky-200">Scan:</span>
                <select
                  value={selectedScanId}
                  onChange={(e) => setSelectedScanId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
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
              className="px-3 py-1.5 text-xs font-medium bg-sky-900/60 hover:bg-sky-800/60 text-sky-100 rounded-xl border border-sky-700/60 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-2">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">Total Actions</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{summary?.total_actions ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-rose-700 block">Critical</span>
            <span className="text-2xl font-black text-rose-950 mt-1 block">{summary?.critical_actions ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-700 block">High Priority</span>
            <span className="text-2xl font-black text-amber-950 mt-1 block">{summary?.high_priority_actions ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-sky-700 block">In Progress</span>
            <span className="text-2xl font-black text-sky-950 mt-1 block">{summary?.in_progress_actions ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 block">Fixed</span>
            <span className="text-2xl font-black text-emerald-950 mt-1 block">{summary?.fixed_actions ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-sky-700 block">Est. SEO Impact</span>
            <span className="text-2xl font-black text-sky-950 mt-1 block">+{summary?.estimated_seo_impact ?? 0} pts</span>
          </div>
          <div className="bg-gradient-to-br from-sky-900 to-indigo-950 p-4 rounded-2xl text-white shadow-md">
            <span className="text-[11px] uppercase tracking-wider font-bold text-sky-300 block">Potential Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">{summary?.potential_seo_score ?? "—"}</span>
              <span className="text-xs text-sky-300">/100</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {["all", "open", "in_progress", "fixed", "ignored"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  statusFilter === st
                    ? "bg-sky-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical SEO</option>
              <option value="indexability">Indexability</option>
              <option value="metadata">Metadata & Tags</option>
              <option value="links">Links & Architecture</option>
              <option value="content">Content Quality</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SEO actions..."
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedActionIds.length > 0 && (
          <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl mb-4 flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-sky-900">
              {selectedActionIds.length} action(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange("in_progress")}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleBulkStatusChange("fixed")}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                Mark Fixed
              </button>
              <button
                onClick={() => handleBulkStatusChange("ignored")}
                className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-xs font-medium transition"
              >
                Ignore
              </button>
            </div>
          </div>
        )}

        {/* Main Action Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-600" />
              <p className="text-sm font-semibold">Loading SEO optimization actions...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : actions.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-800">No SEO actions found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Run a full SEO audit to generate prioritized technical, metadata, and crawlability optimization tasks.
              </p>
              <Link
                href={`/projects/${selectedProjectId}`}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow-md inline-block"
              >
                Go to Project Audit
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <button onClick={handleToggleSelectAll} className="text-slate-400 hover:text-slate-600">
                        {selectedActionIds.length === actions.length && actions.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-sky-700" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Optimization Task</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Affected Pages</th>
                    <th className="py-3 px-4">SEO Impact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {actions.map((act) => {
                    const isSelected = selectedActionIds.includes(act.id);
                    return (
                      <tr
                        key={act.id}
                        className={`hover:bg-sky-50/40 transition cursor-pointer ${
                          isSelected ? "bg-sky-50/60" : ""
                        }`}
                        onClick={() => handleOpenDrawer(act)}
                      >
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleToggleSelectOne(act.id)} className="text-slate-400 hover:text-slate-600">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-sky-700" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getPriorityBadge(act.priority)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 line-clamp-1">{act.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{act.why_it_matters}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 capitalize">
                          {act.category}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800">
                          {act.affected_pages_count || 0} pages
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-sky-700">+{act.estimated_impact} pts</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(act.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenDrawer(act)}
                            className="px-3 py-1 bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-900 rounded-lg font-bold text-xs transition inline-flex items-center gap-1"
                          >
                            View
                            <ChevronRight className="w-3 h-3" />
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
      </div>

      {/* Right-Side Action Detail Drawer */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200">
            {/* Drawer Header */}
            <div>
              <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityBadge(selectedAction.priority)}
                    <span className="text-[11px] text-sky-300 font-mono font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                      {selectedAction.issue_code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium capitalize">• {selectedAction.category}</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">{selectedAction.title}</h2>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 text-sm">
                {/* Score Potential Card */}
                <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-sky-100/50 p-4 rounded-xl border border-sky-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">Recoverable SEO Potential</span>
                    <div className="text-lg font-black text-sky-950 mt-0.5">
                      +{selectedAction.estimated_impact} Score Points
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-500 block">Effort Required</span>
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 inline-block mt-0.5">
                      {selectedAction.effort}
                    </span>
                  </div>
                </div>

                {/* Why This Matters */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    Why This Matters
                  </h4>
                  <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed text-xs">
                    {selectedAction.why_it_matters}
                  </p>
                </div>

                {/* How to Fix */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    How to Fix
                  </h4>
                  <p className="text-slate-700 bg-sky-50/50 p-3.5 rounded-xl border border-sky-100 leading-relaxed text-xs font-medium">
                    {selectedAction.how_to_fix}
                  </p>
                </div>

                {/* Current vs Recommended State */}
                {(selectedAction.current_state || selectedAction.recommended_state) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedAction.current_state && (
                      <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
                        <span className="text-[10px] uppercase font-bold text-rose-700 block mb-1">
                          Current Detected State
                        </span>
                        <p className="text-xs text-slate-800 leading-snug font-mono">
                          {selectedAction.current_state}
                        </p>
                      </div>
                    )}
                    {selectedAction.recommended_state && (
                      <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">
                          Recommended Optimized State
                        </span>
                        <p className="text-xs text-slate-800 leading-snug font-mono">
                          {selectedAction.recommended_state}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Affected URLs Sample */}
                {selectedAction.affected_urls && selectedAction.affected_urls.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-slate-600" />
                      Affected URLs Sample ({selectedAction.affected_pages_count} pages)
                    </h4>
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedAction.affected_urls.slice(0, 5).map((url, idx) => (
                        <div key={idx} className="text-xs text-sky-900 font-mono truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                            {url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-600" />
                    Sprint Notes & Tracking
                  </h4>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Add implementation notes, ticket IDs, or sprint links..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                    >
                      {isSavingNotes ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                </div>

                {/* Live Verification Result Banner */}
                {verifyResult && (
                  <div
                    className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      verifyResult.is_fixed
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}
                  >
                    <div className="font-bold mb-0.5">
                      {verifyResult.is_fixed ? "✓ Issue Resolved" : "⚠ Issue Still Present"}
                    </div>
                    {verifyResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedAction.id, "in_progress")}
                  className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleStatusChange(selectedAction.id, "fixed")}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Mark Fixed
                </button>
                <button
                  onClick={() => handleStatusChange(selectedAction.id, "ignored")}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium transition"
                >
                  Ignore
                </button>
              </div>

              <button
                onClick={() => handleVerify(selectedAction.id)}
                disabled={isVerifying}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <ShieldCheck className={`w-4 h-4 ${isVerifying ? "animate-spin" : ""}`} />
                {isVerifying ? "Verifying..." : "Live Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
