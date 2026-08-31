"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Globe,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SEOPage, SEOPageDetail, Project, Scan } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function SeoPagesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedScanId, setSelectedScanId] = useState<string>("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [indexabilityFilter, setIndexabilityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Inspection Drawer
  const [selectedPageDetail, setSelectedPageDetail] = useState<SEOPageDetail | null>(null);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  const { error } = useToast();

  useEffect(() => {
    const fetchProjectsAndPages = async () => {
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

            const pagesData = await api.getScanPages(scanId, {
              search: searchQuery || undefined,
              status_code: statusFilter !== "all" ? parseInt(statusFilter) : undefined,
              indexability: indexabilityFilter !== "all" ? indexabilityFilter === "true" : undefined,
            });
            setPages(pagesData.pages || []);
            setTotal(pagesData.total || 0);
          }
        }
      } catch (err: any) {
        error("Failed to load pages", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectsAndPages();
  }, []);

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsLoading(true);
    try {
      const scansData = await api.getProjectScans(projectId, { limit: 1 });
      if (scansData.scans?.length > 0) {
        const scanId = scansData.scans[0].id;
        setSelectedScanId(scanId);
        const pagesData = await api.getScanPages(scanId);
        setPages(pagesData.pages || []);
        setTotal(pagesData.total || 0);
      } else {
        setPages([]);
        setTotal(0);
        setSelectedScanId("");
      }
    } catch (err: any) {
      error("Failed to load project pages", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPageDetail = async (page: SEOPage) => {
    if (!selectedScanId) return;
    setIsDrawerLoading(true);
    try {
      const detail = await api.getScanPageDetail(selectedScanId, page.id);
      setSelectedPageDetail(detail);
    } catch (err: any) {
      error("Failed to load page inspection", err.message);
    } finally {
      setIsDrawerLoading(false);
    }
  };

  const filteredPages = pages.filter((p) => {
    if (searchQuery && !p.url.toLowerCase().includes(searchQuery.toLowerCase()) && !(p.title || "").toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && p.status_code.toString() !== statusFilter) return false;
    if (indexabilityFilter !== "all" && p.is_indexable.toString() !== indexabilityFilter) return false;
    return true;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header & Project Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Crawled Webpages ({total})</h2>
            <p className="text-xs text-slate-500">
              Detailed breakdown of discovered URLs, server response codes, on-page metadata, and indexability flags.
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

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search URLs or page titles..."
          filters={[
            {
              id: "status_code",
              label: "Status Code",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "All Status Codes", value: "all" },
                { label: "200 OK", value: "200" },
                { label: "301 Redirect", value: "301" },
                { label: "404 Not Found", value: "404" },
                { label: "500 Server Error", value: "500" },
              ],
            },
            {
              id: "indexability",
              label: "Indexability",
              value: indexabilityFilter,
              onChange: setIndexabilityFilter,
              options: [
                { label: "All Indexability", value: "all" },
                { label: "Indexable", value: "true" },
                { label: "Non-Indexable", value: "false" },
              ],
            },
          ]}
          onReset={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setIndexabilityFilter("all");
          }}
        />

        {/* Pages Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">URL & Title</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Indexable</th>
                  <th className="py-3 px-4 text-center">H1 Count</th>
                  <th className="py-3 px-4 text-center">Response Time</th>
                  <th className="py-3 px-4 text-center">Issues</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading crawled pages...</p>
                    </td>
                  </tr>
                ) : filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <EmptyState
                        icon={<FileText className="w-6 h-6 text-slate-400" />}
                        title="No Crawled Pages Found"
                        description="Run a website audit to discover internal links and inspect on-page SEO data."
                        actionLabel="Go to Projects"
                        onAction={() => (window.location.href = "/seo/projects")}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
                    <tr
                      key={page.id}
                      onClick={() => handleOpenPageDetail(page)}
                      className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-sm">
                        <span className="font-semibold text-slate-900 block truncate">
                          {page.title || "Untitled Document"}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 truncate block mt-0.5">
                          {page.url}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            page.status_code === 200
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : page.status_code >= 300 && page.status_code < 400
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {page.status_code}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {page.is_indexable ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> No
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            page.h1_count === 1
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {page.h1_count}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                        {page.response_time ? `${page.response_time}ms` : "—"}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono">
                        {page.issues_count > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {page.issues_count}
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold">Clean</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          Audit →
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Page Detail Drawer */}
        {selectedPageDetail && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="w-full max-w-xl bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Page Audit Inspection
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-md mt-0.5">
                    {selectedPageDetail.title || selectedPageDetail.url}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPageDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
                {/* Meta Overview Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-500 break-all">{selectedPageDetail.url}</span>
                    <a
                      href={selectedPageDetail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 font-mono text-[11px]">
                    <div>Status: <span className="font-bold text-slate-900">{selectedPageDetail.status_code}</span></div>
                    <div>Indexable: <span className="font-bold text-slate-900">{selectedPageDetail.is_indexable ? "Yes" : "No"}</span></div>
                    <div>Word Count: <span className="font-bold text-slate-900">{selectedPageDetail.word_count} words</span></div>
                    <div>Response Time: <span className="font-bold text-slate-900">{selectedPageDetail.response_time}ms</span></div>
                  </div>
                </div>

                {/* On-Page SEO Checklist */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                    On-Page Tags & Directives
                  </h4>

                  <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Title Tag ({selectedPageDetail.title?.length || 0} chars)</span>
                    <p className="font-semibold text-slate-900">{selectedPageDetail.title || "Missing Title Tag"}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Meta Description ({selectedPageDetail.meta_description?.length || 0} chars)</span>
                    <p className="text-slate-800">{selectedPageDetail.meta_description || "Missing Meta Description"}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Canonical URL</span>
                    <p className="font-mono text-slate-800">{selectedPageDetail.canonical_url || "Self-referencing / Default"}</p>
                  </div>
                </div>

                {/* Issues on this Page */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                    Detected Issues ({selectedPageDetail.issues?.length || 0})
                  </h4>

                  {selectedPageDetail.issues && selectedPageDetail.issues.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPageDetail.issues.map((iss, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                iss.severity === "critical"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {iss.severity}
                            </span>
                            <span className="font-bold text-slate-900">{iss.title}</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{iss.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No issues detected on this webpage.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
