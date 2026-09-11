"use client";

import React, { useEffect, useState } from "react";
import {
  Link2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe,
  Layers,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Project, SEOLinkItem } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function SeoLinksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [links, setLinks] = useState<SEOLinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Link KPIs
  const [summary, setSummary] = useState({
    total: 0,
    internal_count: 0,
    external_count: 0,
    broken_count: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [linkTypeFilter, setLinkTypeFilter] = useState("all");

  const { error } = useToast();

  const fetchLinksForProject = async (projectId: string, filterType?: string, search?: string) => {
    setIsLoading(true);
    try {
      const res = await api.getSeoLinks({
        project_id: projectId,
        link_type: filterType !== "all" ? filterType : undefined,
        search: search || undefined,
        limit: 100,
      });

      setLinks(res.links || []);
      setSummary({
        total: res.total || 0,
        internal_count: res.internal_count || 0,
        external_count: res.external_count || 0,
        broken_count: res.broken_count || 0,
      });
    } catch (err: any) {
      error("Failed to load links", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projData = await api.getProjects({ limit: 50 });
        setProjects(projData.projects || []);
        if (projData.projects?.length > 0) {
          const firstId = projData.projects[0].id;
          setSelectedProjectId(firstId);
          await fetchLinksForProject(firstId, linkTypeFilter, searchQuery);
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        error("Failed to load projects", err.message);
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId);
    await fetchLinksForProject(projectId, linkTypeFilter, searchQuery);
  };

  const handleFilterChange = (type: string) => {
    setLinkTypeFilter(type);
    if (selectedProjectId) {
      fetchLinksForProject(selectedProjectId, type, searchQuery);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (selectedProjectId) {
      fetchLinksForProject(selectedProjectId, linkTypeFilter, query);
    }
  };

  // Compute live link health score
  const totalCount = summary.total;
  const brokenRate = totalCount > 0 ? (summary.broken_count / totalCount) * 100 : 0;
  const linkHealthScore = Math.max(0, Math.min(100, Math.round(100 - brokenRate * 2.5)));

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <Link2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Link Structure & Health ({summary.total.toLocaleString()})
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Live Crawl Graph
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Analyze internal site architecture, anchor text distribution, external outgoing links, and broken HTTP status codes.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 shrink-0">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Website:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Link KPIs */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            title="Link Health Score"
            value={`${linkHealthScore} / 100`}
            subValue={brokenRate === 0 ? "Flawless link structure" : `${brokenRate.toFixed(1)}% broken links`}
            rightVisual={<ScoreRing score={linkHealthScore} size="sm" showRating={false} />}
          />

          <MetricCard
            title="Internal Hyperlinks"
            value={summary.internal_count.toLocaleString()}
            subValue="Internal crawl architecture"
            icon={<Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            variant="blue"
          />

          <MetricCard
            title="External Outgoing Links"
            value={summary.external_count.toLocaleString()}
            subValue="Outbound references"
            icon={<ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            variant="purple"
          />

          <MetricCard
            title="Broken Links (4xx/5xx)"
            value={summary.broken_count.toString()}
            subValue={summary.broken_count === 0 ? "0% Error Rate" : "Requires fixing"}
            icon={
              summary.broken_count === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )
            }
            variant={summary.broken_count === 0 ? "emerald" : "amber"}
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search target URLs or anchor text..."
          filters={[
            {
              id: "link_type",
              label: "Link Type",
              value: linkTypeFilter,
              onChange: handleFilterChange,
              options: [
                { label: "All Links", value: "all" },
                { label: "Internal", value: "internal" },
                { label: "External", value: "external" },
              ],
            },
          ]}
          onReset={() => {
            setSearchQuery("");
            setLinkTypeFilter("all");
            if (selectedProjectId) {
              fetchLinksForProject(selectedProjectId, "all", "");
            }
          }}
        />

        {/* Links Table */}
        <Card className="p-0 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              Loading real crawled links...
            </div>
          ) : links.length === 0 ? (
            <EmptyState
              icon={Link2}
              title="No Links Found"
              description="No crawled links match the current query for this project."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Anchor Text</th>
                    <th className="py-3 px-4">Target URL</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Source Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {link.anchor_text || <span className="text-slate-400 dark:text-slate-500 italic">No Anchor Text</span>}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800 dark:text-slate-300 truncate max-w-[260px]">
                        <a
                          href={link.target_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-blue-600 flex items-center gap-1"
                        >
                          <span className="truncate">{link.target_url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[10px] uppercase">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            link.is_internal
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          }`}
                        >
                          {link.link_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] border ${
                            (link.status_code || 200) < 400
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          {link.status_code || 200}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        <span title={link.source_url}>{link.source_url}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
