"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  ExternalLink,
  Sparkles,
  Award,
  Calendar,
  Globe,
  Trash2,
  Edit,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoProjectsPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  const { success, error } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      setProjects(res.projects || []);
    } catch (err) {
      error("Failed to load GEO projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) return;
    try {
      await api.createGeoProject({
        name,
        domain,
        brand_name: brandName || name,
        industry,
        description,
      });
      success("GEO Project created successfully.");
      setIsCreateOpen(false);
      setName("");
      setDomain("");
      setBrandName("");
      setIndustry("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      error("Failed to create GEO project.");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this GEO project?")) return;
    try {
      await api.deleteGeoProject(id);
      success("Project deleted.");
      fetchProjects();
    } catch (err) {
      error("Failed to delete project.");
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand_name && p.brand_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <FolderKanban className="w-3.5 h-3.5" />
              Project Workspaces
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Projects
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage domains, brand profiles, and generative engine visibility projects.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Create Project
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by name, domain, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Project Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="w-12 h-12 text-amber-500" />}
            title="No GEO Projects Found"
            description="Create a project to begin auditing generative engine visibility."
            action={
              <Button
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Create Project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((proj) => (
              <Card
                key={proj.id}
                className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-500/50 transition-all rounded-2xl group shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Globe className="w-3 h-3" />
                        {proj.domain}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60">
                      {proj.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">GEO Score</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {proj.geo_score !== null && proj.geo_score !== undefined ? `${proj.geo_score}/100` : "—"}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">Visibility</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {proj.visibility_score !== null && proj.visibility_score !== undefined ? `${proj.visibility_score}%` : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                  <button
                    onClick={(e) => handleDelete(proj.id, e)}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Link href={`/geo/projects/${proj.id}`}>
                      <Button variant="secondary" size="sm" className="h-7 text-xs">
                        Configure
                      </Button>
                    </Link>
                    <Link href={`/geo/dashboard?project_id=${proj.id}`}>
                      <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white" rightIcon={<ArrowRight className="w-3 h-3" />}>
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: Create Project */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create GEO Project</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Brand Global GEO"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Domain</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g., yourcompany.com"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., YourBrand"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., B2B SaaS, E-Commerce"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of what the company does..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-3">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
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
