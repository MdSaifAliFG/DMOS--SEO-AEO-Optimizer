"use client";

import React, { useEffect, useState } from "react";
import {
  HelpCircle,
  Search,
  Filter,
  Sparkles,
  Plus,
  Award,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoQuestion } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoQuestionsPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [questions, setQuestions] = useState<GeoQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [intentFilter, setIntentFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { success, error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchQuestions(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getGeoQuestions(projectId, {
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        intent: intentFilter !== "all" ? intentFilter : undefined,
        search: search ? search : undefined,
      });
      setQuestions(res.questions || []);
    } catch (err) {
      error("Failed to fetch questions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchQuestions(selectedProjectId);
    }
  }, [selectedProjectId, categoryFilter, intentFilter]);

  const handleGenerate = async () => {
    if (!selectedProjectId) return;
    setIsGenerating(true);
    try {
      await api.generateGeoQuestions(selectedProjectId, undefined, 1);
      success("Generated questions across all 18 discovery categories.");
      fetchQuestions(selectedProjectId);
    } catch (err) {
      error("Failed to generate questions.");
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = Array.from(new Set(questions.map((q) => q.category)));

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              18 Generative Discovery Categories
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Discovery Queries
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic search prompts evaluated across generative AI search models.
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

            <Button
              size="sm"
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Generate Queries (18 Cats)
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by question text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchQuestions(selectedProjectId)}
              className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">All Intents</option>
            <option value="commercial">Commercial</option>
            <option value="informational">Informational</option>
            <option value="comparison">Comparison</option>
            <option value="navigational">Navigational</option>
          </select>
        </div>

        {/* Questions Table */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : questions.length === 0 ? (
          <EmptyState
            icon={<HelpCircle className="w-12 h-12 text-amber-500" />}
            title="No Questions Generated"
            description="Generate the 18 deterministic discovery questions for this project."
            action={
              <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Generate 18 Questions
              </Button>
            }
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Discovery Question</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Intent</th>
                    <th className="py-3 px-4 text-center">Brand Mentioned</th>
                    <th className="py-3 px-4 text-center">Recommended</th>
                    <th className="py-3 px-4 text-center">Best Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-md">
                        {q.question}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {q.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-mono text-slate-400">
                        {q.intent}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {q.brand_mentioned ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <XCircle className="w-3.5 h-3.5 text-slate-300" /> No
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {q.recommended ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            <Award className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold">
                        {q.best_position ? `#${q.best_position}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
