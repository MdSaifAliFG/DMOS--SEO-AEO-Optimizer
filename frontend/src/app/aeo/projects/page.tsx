"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Search,
  Globe,
  Trash2,
  HelpCircle,
  Quote,
  Boxes,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoProjectsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New AEO Project Form
  const [projectName, setProjectName] = useState("");
  const [projectDomain, setProjectDomain] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAeoProjects({ search: searchQuery || undefined });
      setProjects(data.projects || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      error("Failed to load AEO projects", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !projectDomain) return;

    setIsSubmitting(true);
    try {
      const created = await api.createAeoProject({
        name: projectName,
        domain: projectDomain,
        description: description || undefined,
      });
      success("AEO Project Created", `Project '${created.name}' registered for AEO monitoring`);
      setIsAddModalOpen(false);
      setProjectName("");
      setProjectDomain("");
      setDescription("");
      fetchProjects();
    } catch (err: any) {
      error("Failed to create AEO project", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete AEO project '${name}'?`)) return;
    try {
      await api.deleteAeoProject(id);
      success("Project Deleted", `AEO Project '${name}' was deleted`);
      fetchProjects();
    } catch (err: any) {
      error("Failed to delete project", err.message);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">AEO Projects ({total})</h2>
            <p className="text-xs text-slate-500">
              Manage AI answer engine visibility profiles, prompt tracking targets, and knowledge entities.
            </p>
          </div>

          <Button
            size="sm"
            variant="aeo"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + Add AEO Project
          </Button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search AEO projects by name or domain..."
          onReset={() => setSearchQuery("")}
        />

        {/* Projects Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Project & Domain</th>
                  <th className="py-3 px-4 text-center">AEO Score</th>
                  <th className="py-3 px-4 text-center">Tracked Questions</th>
                  <th className="py-3 px-4 text-center">Citations</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading AEO projects...</p>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <EmptyState
                        icon={<Sparkles className="w-6 h-6 text-purple-600" />}
                        title="No AEO Projects Registered"
                        description="Create an AEO project to track your brand presence in ChatGPT, Perplexity, Gemini, and Google AI Overviews."
                        actionLabel="+ Add AEO Project"
                        onAction={() => setIsAddModalOpen(true)}
                      />
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/aeo/projects/${proj.id}`}
                          className="font-semibold text-slate-900 hover:text-purple-600 truncate block text-sm"
                        >
                          {proj.name}
                        </Link>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 mt-0.5">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{proj.domain}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <ScoreRing score={proj.aeo_score ?? 78} size="sm" showRating={false} />
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                        {proj.questions_count}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-purple-700">
                        {proj.citations_count}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {formatDate(proj.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/aeo/projects/${proj.id}`}>
                            <Button size="sm" variant="secondary">
                              Manage
                            </Button>
                          </Link>

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-slate-900">Add AEO Optimization Project</h3>
              <p className="text-xs text-slate-500">
                Register a brand domain to track mentions, LLM citations, and prompt visibility.
              </p>

              <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Brand / Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OpenAI Search Presence"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Brand Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. openai.com"
                    value={projectDomain}
                    onChange={(e) => setProjectDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Track Perplexity & ChatGPT search answers"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
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
                    variant="aeo"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Create AEO Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
