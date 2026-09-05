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
  Play,
  X,
  ExternalLink,
  Bot,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
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
  const [analyzingProjectId, setAnalyzingProjectId] = useState<string | null>(null);

  // New AEO Project Form
  const [projectName, setProjectName] = useState("");
  const [projectDomain, setProjectDomain] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [competitor1, setCompetitor1] = useState("");
  const [competitor2, setCompetitor2] = useState("");
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
    if (!projectName.trim() || !projectDomain.trim()) return;

    const competitors = [];
    if (competitor1.trim()) competitors.push({ name: competitor1.trim(), domain: "" });
    if (competitor2.trim()) competitors.push({ name: competitor2.trim(), domain: "" });

    setIsSubmitting(true);
    try {
      const created = await api.createAeoProject({
        name: projectName.trim(),
        domain: projectDomain.trim(),
        industry: industry.trim() || undefined,
        target_audience: targetAudience.trim() || undefined,
        competitors,
        description: description.trim() || undefined,
      });
      success("AEO Project Created", `Project '${created.name}' registered for AEO monitoring`);
      setIsAddModalOpen(false);
      setProjectName("");
      setProjectDomain("");
      setIndustry("");
      setTargetAudience("");
      setCompetitor1("");
      setCompetitor2("");
      setDescription("");
      fetchProjects();
    } catch (err: any) {
      error("Failed to create AEO project", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunAnalysis = async (projectId: string) => {
    setAnalyzingProjectId(projectId);
    try {
      await api.triggerAeoAnalysis(projectId, { allow_test_mode: true });
      success("AEO Analysis Triggered", "Synthesizing answer engines in background...");
      setTimeout(() => {
        fetchProjects();
        setAnalyzingProjectId(null);
      }, 3000);
    } catch (err: any) {
      error("Failed to trigger analysis", err.message);
      setAnalyzingProjectId(null);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">AEO Optimization Projects ({total})</h2>
            </div>
            <p className="text-xs text-slate-500">
              Manage tracked brand websites, monitor answer synthesis scores, and trigger AI search analyses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 sm:w-60"
              />
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 h-56 animate-pulse bg-slate-50 border-slate-200" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-purple-200 bg-purple-50/20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
                <p className="text-xs text-slate-500">
                  {searchQuery ? `No projects match "${searchQuery}"` : "Create your first AEO project to start answer engine tracking."}
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                Create AEO Project
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="p-6 border-slate-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between bg-white relative group"
              >
                <div className="space-y-4">
                  {/* Top Row: Domain & Score Ring */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{project.domain}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 border-2 border-purple-200 text-purple-900 font-bold text-sm">
                        {project.aeo_score !== null && project.aeo_score !== undefined ? project.aeo_score : "—"}
                      </div>
                      <span className="text-[10px] font-semibold text-purple-700 mt-1">
                        {project.score_label || "Untested"}
                      </span>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{project.description}</p>
                  )}

                  {/* Badges / Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Tracked Prompts</span>
                      <span className="text-xs font-bold text-slate-800">{project.questions_count}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Citations</span>
                      <span className="text-xs font-bold text-slate-800">{project.citations_count}</span>
                    </div>
                  </div>

                  {project.last_analyzed_at && (
                    <p className="text-[11px] text-slate-400">
                      Last analyzed: {formatTimeAgo(project.last_analyzed_at)}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleRunAnalysis(project.id)}
                      isLoading={analyzingProjectId === project.id}
                      leftIcon={<Play className="w-3 h-3" />}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-8"
                    >
                      Analyze
                    </Button>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/aeo/projects/${project.id}`}>
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3 h-3" />} className="text-xs h-8">
                      Workspace
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: New Project */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">Create New AEO Project</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Brand Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Acme SaaS"
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Domain / URL</label>
                    <input
                      type="text"
                      value={projectDomain}
                      onChange={(e) => setProjectDomain(e.target.value)}
                      placeholder="e.g. acmesaas.com"
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Industry / Domain</label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Customer Support AI"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Target Audience</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Enterprise Support Leads"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Competitors (Optional)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={competitor1}
                      onChange={(e) => setCompetitor1(e.target.value)}
                      placeholder="Competitor 1 Name"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      value={competitor2}
                      onChange={(e) => setCompetitor2(e.target.value)}
                      placeholder="Competitor 2 Name"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of primary capabilities..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" isLoading={isSubmitting} className="bg-purple-600 text-white">
                    Create Project
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
