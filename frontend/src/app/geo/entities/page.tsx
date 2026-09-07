"use client";

import React, { useEffect, useState } from "react";
import {
  Boxes,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Building2,
  Cpu,
  Share2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoEntity } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoEntitiesPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [entities, setEntities] = useState<GeoEntity[]>([]);
  const [consistencyScore, setConsistencyScore] = useState(80);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  const { error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchEntities(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchEntities = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getGeoEntities(
        projectId,
        typeFilter !== "all" ? typeFilter : undefined
      );
      setEntities(res.entities || []);
      setConsistencyScore(res.consistency_score || 80);
    } catch (err) {
      error("Failed to load entities.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchEntities(selectedProjectId);
    }
  }, [selectedProjectId, typeFilter]);

  const types = Array.from(new Set(entities.map((e) => e.entity_type)));

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <Boxes className="w-3.5 h-3.5" />
              Entity Understanding & Knowledge Graph
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Entity Catalog
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Structured entities, organizational relationships, and cross-source semantic consistency.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All Entity Types ({types.length})</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Consistency Overview Card */}
        <Card className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Brand Entity Consistency</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Evaluated across Organization JSON-LD schemas, homepage H1, sameAs links, and product pages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {consistencyScore}/100
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
              Consistent
            </span>
          </div>
        </Card>

        {/* Entities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        ) : entities.length === 0 ? (
          <EmptyState
            icon={<Boxes className="w-12 h-12 text-amber-500" />}
            title="No Entities Cataloged"
            description="Run GEO analysis or configure your Brand Profile to populate recognized entities."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entities.map((ent) => (
              <Card
                key={ent.id}
                className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:border-amber-300 dark:hover:border-amber-500/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ent.name}</h3>
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase">
                        {ent.entity_type}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        ent.consistency_status === "consistent"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                      }`}
                    >
                      {ent.consistency_status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ent.description || "Entity registered in canonical knowledge base."}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Source: {ent.source}</span>
                  <span>Confidence: {Math.round(ent.confidence * 100)}%</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
