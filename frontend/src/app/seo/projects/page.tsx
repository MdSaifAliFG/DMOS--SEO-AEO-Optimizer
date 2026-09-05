"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  Search,
  Play,
  Trash2,
  ExternalLink,
  FileText,
  AlertTriangle,
  RotateCcw,
  FolderKanban,
  Settings2,
  Check,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StartAuditModal } from "@/components/scans/StartAuditModal";
import { Project } from "@/lib/types";
import { api } from "@/lib/api-client";
import { cleanDomain, formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function SeoProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProjectForAudit, setSelectedProjectForAudit] = useState<Project | null>(null);

  // New Project Form with Phase 3 configuration
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [crawlLimit, setCrawlLimit] = useState<number>(100);
  const [respectRobots, setRespectRobots] = useState<boolean>(true);
  const [includeSubdomains, setIncludeSubdomains] = useState<boolean>(false);
  const [followExternal, setFollowExternal] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProjects({ search: searchQuery || undefined });
      setProjects(data.projects || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      error("Failed to load projects", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectDomain.trim()) return;

    setIsSubmitting(true);
    try {
      const cleaned = cleanDomain(newProjectDomain.trim());
      const created = await api.createProject({
        name: newProjectName.trim(),
        domain: cleaned,
        settings: {
          crawl_limit: crawlLimit,
          respect_robots: respectRobots,
          include_subdomains: includeSubdomains,
          follow_external_links: followExternal,
        },
      });
      success("SEO Project Created", `Project '${created.name}' registered successfully`);
      setIsAddModalOpen(false);
      setNewProjectName("");
      setNewProjectDomain("");
      setCrawlLimit(100);
      setRespectRobots(true);
      setIncludeSubdomains(false);
      setFollowExternal(false);
      setShowAdvanced(false);
      fetchProjects();
    } catch (err: any) {
      error("Failed to create project", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project '${name}'?`)) return;
    try {
      await api.deleteProject(id);
      success("Project Deleted", `Project '${name}' was removed`);
      fetchProjects();
    } catch (err: any) {
      error("Failed to delete project", err.message);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Globe className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">SEO Projects ({total})</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Crawler Hub
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Manage website crawler domains, automated technical audits, and on-page performance.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-xs shrink-0"
          >
            + Add SEO Project
          </Button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search projects by name or domain..."
          onReset={() => setSearchQuery("")}
        />

        {/* Projects Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Project & Domain</th>
                  <th className="py-3 px-4 text-center">SEO Score</th>
                  <th className="py-3 px-4 text-center">Total Audits</th>
                  <th className="py-3 px-4">Last Audit Run</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading SEO projects...</p>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <EmptyState
                        icon={<FolderKanban className="w-6 h-6 text-slate-400" />}
                        title="No SEO Projects Found"
                        description="Add your first website to start crawling and auditing technical SEO health."
                        actionLabel="+ Add SEO Project"
                        onAction={() => setIsAddModalOpen(true)}
                      />
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr
                      key={proj.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/seo/projects/${proj.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 truncate block text-sm"
                        >
                          {proj.name}
                        </Link>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 mt-0.5">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{proj.domain}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {proj.latest_scan?.overall_score !== undefined && proj.latest_scan?.overall_score !== null ? (
                          <ScoreRing score={proj.latest_scan.overall_score} size="sm" showRating={false} />
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium italic">Pending Scan</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                        {proj.total_scans}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {proj.latest_scan ? formatTimeAgo(proj.latest_scan.created_at) : "Never"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/seo/projects/${proj.id}`}>
                            <Button size="sm" variant="secondary">
                              Open
                            </Button>
                          </Link>

                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setSelectedProjectForAudit(proj)}
                            leftIcon={<Play className="w-3 h-3" />}
                          >
                            Run Audit
                          </Button>

                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.name)}
                            title="Delete Project"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Project Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New SEO Project</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Register a website domain for automated BFS crawling and technical audits.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Company Website"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Website URL / Domain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://example.com or example.com"
                    value={newProjectDomain}
                    onChange={(e) => setNewProjectDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Advanced Crawl Settings Accordion */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>{showAdvanced ? "Hide Crawl Settings" : "Configure Crawl Settings"}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
                      {/* Crawl Limit */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Crawl Page Limit
                        </label>
                        <select
                          value={crawlLimit}
                          onChange={(e) => setCrawlLimit(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        >
                          <option value={10}>10 Pages (Quick Test)</option>
                          <option value={50}>50 Pages</option>
                          <option value={100}>100 Pages (Standard Default)</option>
                          <option value={250}>250 Pages</option>
                          <option value={500}>500 Pages</option>
                          <option value={1000}>1,000 Pages (Enterprise)</option>
                        </select>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-2 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={respectRobots}
                            onChange={(e) => setRespectRobots(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Respect <code>robots.txt</code> crawl directives (Recommended)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={includeSubdomains}
                            onChange={(e) => setIncludeSubdomains(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Include subdomains during URL discovery</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={followExternal}
                            onChange={(e) => setFollowExternal(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Follow external links</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Start Audit Modal */}
        {selectedProjectForAudit && (
          <StartAuditModal
            project={selectedProjectForAudit}
            isOpen={Boolean(selectedProjectForAudit)}
            onClose={() => setSelectedProjectForAudit(null)}
            onScanCreated={(scanId) => {
              setSelectedProjectForAudit(null);
              window.location.href = `/seo/projects/${selectedProjectForAudit.id}?scanId=${scanId}`;
            }}
          />
        )}
      </div>
    </DashboardShell>
  );
}
