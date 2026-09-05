"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AeoProject, AeoRecommendation, AeoActionSummary } from "@/lib/types";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Download,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Ban,
  Layers,
  CheckSquare,
  Square,
  Flame,
  HelpCircle,
} from "lucide-react";

export default function AeoActionsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [summary, setSummary] = useState<AeoActionSummary | null>(null);
  const [actions, setActions] = useState<AeoRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Drawer & Selection
  const [activeAction, setActiveAction] = useState<AeoRecommendation | null>(null);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{ is_resolved: boolean; message: string } | null>(null);
  const [notesInput, setNotesInput] = useState<string>("");
  const [savingNotes, setSavingNotes] = useState<boolean>(false);

  // Load Projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getAeoProjects({ limit: 50 });
        setProjects(data.projects || []);
        if (data.projects?.length > 0) {
          setSelectedProjectId(data.projects[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      }
    }
    loadProjects();
  }, []);

  // Fetch Actions & Summary
  const fetchActionsData = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const [sumData, actionsData] = await Promise.all([
        api.getAeoActionsSummary(selectedProjectId).catch(() => null),
        api.getAeoActions({
          project_id: selectedProjectId,
          status: statusFilter !== "all" ? statusFilter : undefined,
          priority: priorityFilter !== "all" ? priorityFilter : undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          search: searchQuery.trim() || undefined,
          limit: 100,
        }),
      ]);
      setSummary(sumData);
      setActions(actionsData.recommendations || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch optimization actions");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchActionsData();
  }, [fetchActionsData]);

  // Drawer handlers
  const handleOpenDrawer = (action: AeoRecommendation) => {
    setActiveAction(action);
    setNotesInput(action.notes || "");
    setVerificationResult(null);
  };

  const handleCloseDrawer = () => {
    setActiveAction(null);
    setVerificationResult(null);
  };

  // Status Actions
  const handleUpdateStatus = async (actionId: string, newStatus: string) => {
    try {
      const updated = await api.updateAeoAction(actionId, { status: newStatus });
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
      if (activeAction?.id === actionId) {
        setActiveAction(updated);
      }
      // Refresh summary
      if (selectedProjectId) {
        const sum = await api.getAeoActionsSummary(selectedProjectId);
        setSummary(sum);
      }
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeAction) return;
    setSavingNotes(true);
    try {
      const updated = await api.updateAeoAction(activeAction.id, { notes: notesInput });
      setActiveAction(updated);
      setActions((prev) => prev.map((a) => (a.id === activeAction.id ? updated : a)));
    } catch (err: any) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleVerify = async (actionId: string) => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const res = await api.verifyAeoAction(actionId);
      setVerificationResult({ is_resolved: res.is_resolved, message: res.message });
      if (res.action) {
        setActiveAction(res.action);
        setActions((prev) => prev.map((a) => (a.id === actionId ? res.action : a)));
      }
      if (selectedProjectId) {
        const sum = await api.getAeoActionsSummary(selectedProjectId);
        setSummary(sum);
      }
    } catch (err: any) {
      alert("Verification check failed: " + err.message);
    } finally {
      setVerifying(false);
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

  const handleBulkStatusChange = async (newStatus: string) => {
    if (!selectedActionIds.length) return;
    try {
      await api.bulkUpdateAeoActions(selectedActionIds, newStatus);
      setSelectedActionIds([]);
      fetchActionsData();
    } catch (err: any) {
      alert("Bulk update failed: " + err.message);
    }
  };

  // Generate Recommendations
  const handleGenerate = async () => {
    if (!selectedProjectId) return;
    setGenerating(true);
    try {
      await api.generateAeoActions(selectedProjectId);
      await fetchActionsData();
    } catch (err: any) {
      alert("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!selectedProjectId) return;
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/aeo/actions/${selectedProjectId}/export-csv`, "_blank");
  };

  const getPriorityBadge = (priority?: string) => {
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
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
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
    const s = status.toLowerCase();
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3 animate-spin" />
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
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <AlertTriangle className="w-3 h-3 text-purple-600" />
        Open
      </span>
    );
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Banner (Cohesive AEO Identity) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">AEO Optimization & Action Center</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Phase 6 Action Center
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Prioritize deterministic opportunities to improve mentions, citations, entity knowledge, and AI answer prominence.
            </p>
          </div>

          {/* Project Switcher, Generate & Export */}
          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-700/60 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-purple-200">Project:</span>
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

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
              {generating ? "Generating..." : "Generate Actions"}
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium bg-purple-900/60 hover:bg-purple-800/60 text-purple-100 rounded-xl border border-purple-700/60 transition flex items-center gap-1.5 cursor-pointer"
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
            <span className="text-2xl font-black text-rose-950 mt-1 block">{summary?.critical_count ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-700 block">High Priority</span>
            <span className="text-2xl font-black text-amber-950 mt-1 block">{summary?.high_count ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700 block">In Progress</span>
            <span className="text-2xl font-black text-blue-950 mt-1 block">{summary?.in_progress_count ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 block">Fixed</span>
            <span className="text-2xl font-black text-emerald-950 mt-1 block">{summary?.fixed_count ?? "—"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-purple-700 block">Est. Impact</span>
            <span className="text-2xl font-black text-purple-950 mt-1 block">+{summary?.estimated_impact ?? 0} pts</span>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-4 rounded-2xl text-white shadow-md">
            <span className="text-[11px] uppercase tracking-wider font-bold text-purple-300 block">Potential Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">{summary?.potential_score ?? "—"}</span>
              <span className="text-xs text-purple-300">/100</span>
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
                    ? "bg-purple-900 text-white shadow-sm"
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
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Categories</option>
              <option value="Prompt Coverage">Prompt Coverage</option>
              <option value="Citation Opportunities">Citation Opportunities</option>
              <option value="Competitor Gaps">Competitor Gaps</option>
              <option value="Entity Optimization">Entity Optimization</option>
              <option value="Pricing Information">Pricing Information</option>
              <option value="FAQ & Buyer Questions">FAQ & Buyer Questions</option>
              <option value="Brand Visibility">Brand Visibility</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actions..."
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedActionIds.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl mb-4 flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-purple-900">
              {selectedActionIds.length} action(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange("in_progress")}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleBulkStatusChange("fixed")}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
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
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Loading optimization actions...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : actions.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-purple-400" />
              <h3 className="text-base font-bold text-slate-800">No AEO recommendations yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Run an AEO analysis or click Generate Actions to discover deterministic visibility gaps.
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Generate Actions Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <button onClick={handleToggleSelectAll} className="text-slate-400 hover:text-slate-600">
                        {selectedActionIds.length === actions.length && actions.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-purple-700" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Recommendation</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Affected Prompts</th>
                    <th className="py-3 px-4">Estimated Impact</th>
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
                        className={`hover:bg-purple-50/40 transition cursor-pointer ${
                          isSelected ? "bg-purple-50/60" : ""
                        }`}
                        onClick={() => handleOpenDrawer(act)}
                      >
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleToggleSelectOne(act.id)} className="text-slate-400 hover:text-slate-600">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-purple-700" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getPriorityBadge(act.priority_level || act.priority)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 line-clamp-1">{act.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{act.reason}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                          {act.category}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800">
                          {act.affected_prompt_count || 0} prompts
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-purple-700">+{act.estimated_impact} pts</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(act.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenDrawer(act)}
                            className="px-3 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded-lg font-bold text-xs transition inline-flex items-center gap-1"
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
      {activeAction && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200">
            {/* Drawer Header */}
            <div>
              <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityBadge(activeAction.priority_level || activeAction.priority)}
                    <span className="text-[11px] text-purple-300 font-mono font-bold bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                      {activeAction.recommendation_code || "AEO-TASK"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {activeAction.category}</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">{activeAction.title}</h2>
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
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-100/50 p-4 rounded-xl border border-purple-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">Recoverable Potential</span>
                    <div className="text-lg font-black text-purple-950 mt-0.5">
                      +{activeAction.estimated_impact} Visibility Points
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-500 block">Target Score</span>
                    <span className="text-xl font-black text-slate-900">{activeAction.potential_score ?? "—"}/100</span>
                  </div>
                </div>

                {/* Why This Matters */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    Why This Matters
                  </h4>
                  <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed text-xs">
                    {activeAction.why_it_matters || activeAction.reason}
                  </p>
                </div>

                {/* Current Situation */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Current Situation & Evidence
                  </h4>
                  <p className="text-slate-700 bg-amber-50/50 p-3.5 rounded-xl border border-amber-100 leading-relaxed text-xs">
                    {activeAction.current_state}
                  </p>
                </div>

                {/* Recommended Action */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Recommended Action
                  </h4>
                  <p className="text-slate-700 bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 leading-relaxed text-xs font-medium">
                    {activeAction.how_to_fix || activeAction.recommended_action}
                  </p>
                </div>

                {/* Step-by-Step Implementation */}
                {activeAction.implementation_steps && activeAction.implementation_steps.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      Step-by-Step Implementation
                    </h4>
                    <div className="space-y-2">
                      {activeAction.implementation_steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          <span className="font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800 leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-600" />
                    Implementation Notes
                  </h4>
                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Add internal notes or sprint task links here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                    >
                      {savingNotes ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                </div>

                {/* Live Verification Result Banner */}
                {verificationResult && (
                  <div
                    className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      verificationResult.is_resolved
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}
                  >
                    <div className="font-bold mb-0.5">
                      {verificationResult.is_resolved ? "✓ Opportunity Resolved" : "⚠ Still Unresolved"}
                    </div>
                    {verificationResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(activeAction.id, "in_progress")}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeAction.id, "fixed")}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Mark Fixed
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeAction.id, "ignored")}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium transition"
                >
                  Ignore
                </button>
              </div>

              <button
                onClick={() => handleVerify(activeAction.id)}
                disabled={verifying}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <ShieldCheck className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} />
                {verifying ? "Verifying..." : "Live Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
