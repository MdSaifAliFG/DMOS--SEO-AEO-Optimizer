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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-cyan-900 to-slate-900 text-white shadow-md border border-sky-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
                <Network className="w-5 h-5 text-sky-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Internal Linking Recommendations</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/20">
                Graph Architecture
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-2xl">
              Discover internal linking opportunities, eliminate orphan pages, and distribute PageRank equity across your site.
            </p>
          </div>

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
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              href="/seo/actions"
              className="px-3 py-1.5 text-xs font-medium bg-sky-900/60 hover:bg-sky-800/60 text-sky-100 rounded-xl border border-sky-700/60 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Actions
            </Link>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-sky-600" />
            Analyzing crawl link graph...
          </div>
        ) : linkData ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Total Link Opportunities</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{linkData.total_opportunities}</div>
                <div className="text-[11px] text-slate-400 mt-1">Suggested internal connections</div>
              </div>

              <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-rose-700 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Orphan Pages Detected
                </div>
                <div className="text-2xl font-bold text-rose-700 mt-1">{linkData.orphan_pages.length}</div>
                <div className="text-[11px] text-rose-600/80 mt-1">Pages with 0 inbound links</div>
              </div>

              <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Low Inbound Pages
                </div>
                <div className="text-2xl font-bold text-amber-700 mt-1">{linkData.low_inbound_pages.length}</div>
                <div className="text-[11px] text-amber-600/80 mt-1">Pages with &lt;= 2 inbound links</div>
              </div>
            </div>

            {/* Orphan Pages Alert (if any) */}
            {linkData.orphan_pages.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Critical: Orphan Pages Require Inbound Links
                </div>
                <p className="text-xs text-slate-700">
                  These pages have zero inbound internal links, making them difficult for search engine crawlers and users to discover:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {linkData.orphan_pages.map((url: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-rose-200 text-xs font-mono text-slate-700 truncate shadow-xs">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linking Opportunities Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-sky-600" />
                Recommended Internal Link Connections
              </h3>

              {linkData.opportunities.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50/60 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  No orphan pages detected. Internal link distribution is balanced.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/50">
                        <th className="p-3 rounded-l-lg">Source Page (Add Link Here)</th>
                        <th className="p-3">Target Page (Destination)</th>
                        <th className="p-3">Recommended Anchor Text</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3 w-24 rounded-r-lg">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {linkData.opportunities.map((opp: InternalLinkOpportunity, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono text-slate-700 truncate max-w-xs">{opp.source_url}</td>
                          <td className="p-3 font-mono text-sky-700 font-semibold truncate max-w-xs">{opp.target_url}</td>
                          <td className="p-3 font-semibold text-slate-900">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                              "{opp.recommended_anchor}"
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 text-[11px] leading-relaxed max-w-md">{opp.reason}</td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                opp.priority === "high" && "bg-rose-50 text-rose-700 border border-rose-200",
                                opp.priority === "medium" && "bg-amber-50 text-amber-700 border border-amber-200",
                                opp.priority === "low" && "bg-slate-100 text-slate-600 border border-slate-200"
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
