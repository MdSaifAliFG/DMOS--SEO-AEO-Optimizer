"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Plus, Globe, RefreshCw, FolderKanban } from "lucide-react";
import { Project } from "@/lib/types";
import { api } from "@/lib/api-client";
import { ProjectCard } from "./ProjectCard";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/useToast";

export const ProjectList: React.FC = () => {
  const { error } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = useCallback(
    async (query?: string, refresh: boolean = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const data = await api.getProjects({
          search: query || undefined,
          limit: 100,
        });
        setProjects(data.projects);
        setTotal(data.total);
      } catch (err: any) {
        error("Could not load projects", err.message || "Failed to fetch projects");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [error]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProjects(searchTerm);
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchProjects]);

  const handleProjectDeleted = (deletedId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== deletedId));
    setTotal((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-100">
            Managed Projects
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {total} {total === 1 ? "website" : "websites"} currently monitored
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProjects(searchTerm, true)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Link href="/projects/new">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Website
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Filter by project name or domain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-surface-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={searchTerm ? "No matching websites found" : "No websites added yet"}
          description={
            searchTerm
              ? `No projects found matching "${searchTerm}". Try a different domain or name search.`
              : "Get started by registering your first website to run scan lifecycles and audits."
          }
          action={
            <Link href="/projects/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Add Your First Website
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDeleteRequest={(p) => setProjectToDelete(p)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteProjectModal
        project={projectToDelete}
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onDeleted={handleProjectDeleted}
      />
    </div>
  );
};
