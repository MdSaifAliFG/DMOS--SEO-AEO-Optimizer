"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Link2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Layers,
  Network,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Project, InternalLinksOptimizationResponse } from "@/lib/types";
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
        setIsLoading(true);
        const res = await api.getProjects({ limit: 50 });
        setProjects(res.projects);
        if (res.projects.length > 0) {
          setSelectedProjectId(res.projects[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Load Internal Link Recommendations
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" /> Graph-Based Architecture
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Internal Linking Recommendations
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Discover internal linking opportunities, eliminate orphan pages, and distribute PageRank equity across your site.
          </p>
        </div>

        {/* Project Selector & Actions Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400 font-medium">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/seo/actions"
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            ← Back to Actions
          </Link>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          Analyzing crawl link graph...
        </div>
      ) : linkData ? (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">Total Link Opportunities</div>
              <div className="text-2xl font-bold text-white mt-1">{linkData.total_opportunities}</div>
              <div className="text-[11px] text-slate-500 mt-1">Suggested internal connections</div>
            </div>

            <div className="bg-slate-900 border border-rose-500/20 rounded-xl p-4">
              <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Orphan Pages Detected
              </div>
              <div className="text-2xl font-bold text-rose-400 mt-1">{linkData.orphan_pages.length}</div>
              <div className="text-[11px] text-rose-500/70 mt-1">Pages with 0 inbound links</div>
            </div>

            <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-4">
              <div className="text-xs text-amber-400 font-medium">Low Inbound Pages</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{linkData.low_inbound_pages.length}</div>
              <div className="text-[11px] text-amber-500/70 mt-1">Pages with &lt;= 2 inbound links</div>
            </div>
          </div>

          {/* Orphan Pages Alert (if any) */}
          {linkData.orphan_pages.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Critical: Orphan Pages Require Inbound Links
              </div>
              <p className="text-xs text-slate-300">
                These pages have zero inbound internal links, making them difficult for search engine crawlers and users to discover:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {linkData.orphan_pages.map((url, idx) => (
                  <div key={idx} className="p-2 bg-slate-950/80 rounded border border-rose-500/20 text-xs font-mono text-slate-300 truncate">
                    {url}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linking Opportunities Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-400" />
              Recommended Internal Link Connections
            </h3>

            {linkData.opportunities.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/50 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                No orphan pages detected. Internal link distribution is balanced.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="p-3">Source Page (Add Link Here)</th>
                      <th className="p-3">Target Page (Destination)</th>
                      <th className="p-3">Recommended Anchor Text</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3 w-20">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {linkData.opportunities.map((opp, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono text-slate-300 truncate max-w-xs">{opp.source_url}</td>
                        <td className="p-3 font-mono text-emerald-400 truncate max-w-xs">{opp.target_url}</td>
                        <td className="p-3 font-semibold text-slate-100 bg-slate-950/50 rounded">
                          "{opp.recommended_anchor}"
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] leading-relaxed max-w-md">{opp.reason}</td>
                        <td className="p-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              opp.priority === "high" && "bg-rose-500/15 text-rose-400 border border-rose-500/30",
                              opp.priority === "medium" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                              opp.priority === "low" && "bg-slate-800 text-slate-400"
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
  );
}
