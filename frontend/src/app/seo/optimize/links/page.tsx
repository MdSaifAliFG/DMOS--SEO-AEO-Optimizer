"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Network,
  Link2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import {
  Project,
  InternalLinksOptimizationResponse,
  InternalLinkOpportunity,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export default function InternalLinksOptimizationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [linkData, setLinkData] = useState<InternalLinksOptimizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getProjects({ limit: 50 });
        setProjects(res.projects || []);
        if (res.projects?.length > 0) {
          setSelectedProjectId(res.projects[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProjects();
  }, []);

  // Load Link Recommendations
  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadLinkRecommendations() {
      try {
        setIsLoading(true);
        const res = await api.optimizeInternalLinks({ project_id: selectedProjectId });
        setLinkData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLinkRecommendations();
  }, [selectedProjectId]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <Network className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Internal Linking Recommendations</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Graph Architecture
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Discover internal linking opportunities, eliminate orphan pages, and distribute PageRank equity across your site.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:shrink-0">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              href="/seo/actions"
              className="px-3.5 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Actions
            </Link>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-sky-600 dark:text-sky-400" />
            Analyzing crawl link graph...
          </div>
        ) : linkData ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Link Opportunities</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{linkData.total_opportunities}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Suggested internal connections</div>
              </div>

              <div className="bg-white dark:bg-[#0f172a] border border-rose-200 dark:border-rose-900/60 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Orphan Pages Detected
                </div>
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">{linkData.orphan_pages.length}</div>
                <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">Pages with 0 inbound links</div>
              </div>

              <div className="bg-white dark:bg-[#0f172a] border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Low Inbound Pages
                </div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">{linkData.low_inbound_pages.length}</div>
                <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">Pages with &lt;= 2 inbound links</div>
              </div>
            </div>

            {/* Orphan Pages Alert (if any) */}
            {linkData.orphan_pages.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Critical: Orphan Pages Require Inbound Links
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  These pages have zero inbound internal links, making them difficult for search engine crawlers and users to discover:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {linkData.orphan_pages.map((url: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-mono text-slate-700 dark:text-slate-300 truncate shadow-xs">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linking Opportunities Table */}
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Recommended Internal Link Connections
              </h3>

              {linkData.opportunities.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  No orphan pages detected. Internal link distribution is balanced.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/60">
                        <th className="p-3 rounded-l-lg">Source Page (Add Link Here)</th>
                        <th className="p-3">Target Page (Destination)</th>
                        <th className="p-3">Recommended Anchor Text</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3 w-24 rounded-r-lg">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {linkData.opportunities.map((opp: InternalLinkOpportunity, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                          <td className="p-3 font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">{opp.source_url}</td>
                          <td className="p-3 font-mono text-sky-700 dark:text-sky-400 font-semibold truncate max-w-xs">{opp.target_url}</td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700">
                              "{opp.recommended_anchor}"
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed max-w-md">{opp.reason}</td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                opp.priority === "high" && "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800",
                                opp.priority === "medium" && "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
                                opp.priority === "low" && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                              )}
                            >
                              {opp.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 text-sm">
            Select a project to view internal linking opportunities.
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
