"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  X,
  ArrowRight,
  HelpCircle,
  Wrench,
  Layers,
  Filter,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SEOIssue, Project } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function SeoIssuesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedScanId, setSelectedScanId] = useState<string>("");
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [total, setTotal] = useState(0);
  const [severityCounts, setSeverityCounts] = useState<Record<string, number>>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Issue Detail Modal
  const [selectedIssue, setSelectedIssue] = useState<SEOIssue | null>(null);

  const { error } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const projData = await api.getProjects({ limit: 50 });
        setProjects(projData.projects || []);

        if (projData.projects?.length > 0) {
          const firstProjId = projData.projects[0].id;
          setSelectedProjectId(firstProjId);

          const scansData = await api.getProjectScans(firstProjId, { limit: 1 });
          if (scansData.scans?.length > 0) {
            const scanId = scansData.scans[0].id;
            setSelectedScanId(scanId);

            const issuesData = await api.getScanIssues(scanId);
            setIssues(issuesData.issues || []);
            setTotal(issuesData.total || 0);
            if (issuesData.severity_counts) {
              setSeverityCounts(issuesData.severity_counts);
            }
          }
        }
      } catch (err: any) {
        error("Failed to load issues", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsLoading(true);
    try {
      const scansData = await api.getProjectScans(projectId, { limit: 1 });
      if (scansData.scans?.length > 0) {
        const scanId = scansData.scans[0].id;
        setSelectedScanId(scanId);
        const issuesData = await api.getScanIssues(scanId);
        setIssues(issuesData.issues || []);
        setTotal(issuesData.total || 0);
        if (issuesData.severity_counts) {
          setSeverityCounts(issuesData.severity_counts);
        }
      } else {
        setIssues([]);
        setTotal(0);
        setSelectedScanId("");
      }
    } catch (err: any) {
      error("Failed to load project issues", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredIssues = issues.filter((iss) => {
    if (severityFilter !== "all" && iss.severity !== severityFilter) return false;
    if (categoryFilter !== "all" && iss.category !== categoryFilter) return false;
    if (
      searchQuery &&
      !iss.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !iss.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header & Project Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Technical SEO Issues ({total})</h2>
            <p className="text-xs text-slate-500">
              Prioritized list of crawl bottlenecks, broken tags, and on-page optimization opportunities.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Active Website:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Severity Count Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setSeverityFilter(severityFilter === "critical" ? "all" : "critical")}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              severityFilter === "critical"
                ? "bg-rose-50 border-rose-300 ring-2 ring-rose-500"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 uppercase">Critical</span>
              <span className="px-1.5 py-0.2 rounded font-mono text-xs font-bold bg-rose-100 text-rose-800">
                {severityCounts.critical || 0}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Blocks indexing or crawling</span>
          </button>

          <button
            onClick={() => setSeverityFilter(severityFilter === "high" ? "all" : "high")}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              severityFilter === "high"
                ? "bg-amber-50 border-amber-300 ring-2 ring-amber-500"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase">High</span>
              <span className="px-1.5 py-0.2 rounded font-mono text-xs font-bold bg-amber-100 text-amber-800">
                {severityCounts.high || 0}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Major SEO ranking penalty</span>
          </button>

          <button
            onClick={() => setSeverityFilter(severityFilter === "medium" ? "all" : "medium")}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              severityFilter === "medium"
                ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase">Medium</span>
              <span className="px-1.5 py-0.2 rounded font-mono text-xs font-bold bg-blue-100 text-blue-800">
                {severityCounts.medium || 0}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">On-page quality issue</span>
          </button>

          <button
            onClick={() => setSeverityFilter(severityFilter === "low" ? "all" : "low")}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              severityFilter === "low"
                ? "bg-slate-100 border-slate-300 ring-2 ring-slate-500"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">Low / Info</span>
              <span className="px-1.5 py-0.2 rounded font-mono text-xs font-bold bg-slate-200 text-slate-800">
                {(severityCounts.low || 0) + (severityCounts.info || 0)}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Best practice suggestions</span>
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search issue title or description..."
          filters={[
            {
              id: "category",
              label: "Category",
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: [
                { label: "All Categories", value: "all" },
                { label: "Technical", value: "technical" },
                { label: "Indexability", value: "indexability" },
                { label: "Metadata", value: "metadata" },
                { label: "Links", value: "links" },
              ],
            },
          ]}
          onReset={() => {
            setSearchQuery("");
            setSeverityFilter("all");
            setCategoryFilter("all");
          }}
        />

        {/* Issues Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4">Affected Page</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading SEO issues...</p>
                    </td>
                  </tr>
                ) : filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <EmptyState
                        icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                        title="No SEO Issues Detected"
                        description="All crawled pages meet current technical SEO guidelines."
                      />
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((iss) => (
                    <tr
                      key={iss.id}
                      onClick={() => setSelectedIssue(iss)}
                      className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            iss.severity === "critical"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : iss.severity === "high"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : iss.severity === "medium"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {iss.severity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-600 uppercase text-[10px]">
                        {iss.category}
                      </td>

                      <td className="py-3.5 px-4 max-w-md">
                        <span className="font-semibold text-slate-900 block">{iss.title}</span>
                        <span className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                          {iss.description}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                        {iss.page_url || "Site-wide"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          Fix Guide →
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Issue Details Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedIssue.severity === "critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : selectedIssue.severity === "high"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {selectedIssue.severity}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {selectedIssue.category} • Code: {selectedIssue.issue_code}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{selectedIssue.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Why It Matters</span>
                  <p className="leading-relaxed text-slate-800">{selectedIssue.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-700">Recommended Fix</span>
                  <p className="leading-relaxed text-blue-900 font-medium">{selectedIssue.recommendation}</p>
                </div>

                {selectedIssue.page_url && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Affected URL</span>
                    <div className="p-2.5 rounded-lg bg-slate-100 font-mono text-[11px] text-slate-800 break-all">
                      {selectedIssue.page_url}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button size="sm" variant="secondary" onClick={() => setSelectedIssue(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
