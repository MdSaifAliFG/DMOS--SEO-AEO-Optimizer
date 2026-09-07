"use client";

import React, { useEffect, useState } from "react";
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Award,
  ExternalLink,
  X,
  Quote,
  Clock,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoAnswer } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoAnswersPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [answers, setAnswers] = useState<GeoAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [providerFilter, setProviderFilter] = useState("all");
  const [selectedAnswer, setSelectedAnswer] = useState<GeoAnswer | null>(null);

  const { error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchAnswers(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchAnswers = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getGeoAnswers(projectId, {
        provider: providerFilter !== "all" ? providerFilter : undefined,
      });
      setAnswers(res.answers || []);
    } catch (err) {
      error("Failed to load answers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchAnswers(selectedProjectId);
    }
  }, [selectedProjectId, providerFilter]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <Cpu className="w-3.5 h-3.5" />
              Generative Engine Answers
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Answer Explorer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect responses, sentiment, citations, and recommendation rankings across providers.
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
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none"
            >
              <option value="all">All Providers</option>
              <option value="OpenAI">OpenAI</option>
              <option value="Perplexity">Perplexity</option>
              <option value="Gemini">Gemini</option>
              <option value="Claude">Claude</option>
            </select>
          </div>
        </div>

        {/* Answers List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : answers.length === 0 ? (
          <EmptyState
            icon={<Cpu className="w-12 h-12 text-amber-500" />}
            title="No AI Answers Collected"
            description="Run GEO analysis from the dashboard to collect real-time responses from connected providers."
          />
        ) : (
          <div className="space-y-3">
            {answers.map((ans) => (
              <Card
                key={ans.id}
                onClick={() => setSelectedAnswer(ans)}
                className="p-4 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all cursor-pointer rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ans.provider}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {ans.model || "Default Model"}
                    </span>
                    {ans.latency_ms && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {ans.latency_ms}ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {ans.answer_text}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {ans.brand_mentioned ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mentioned
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No Mention</span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 block">
                      {ans.recommendation_strength}
                    </span>
                  </div>

                  <div className="text-right pl-3 border-l border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {ans.citation_count} Citations
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {ans.own_domain_citations} Own Domain
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: Full Answer Detail */}
        {selectedAnswer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60">
                    {selectedAnswer.provider}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedAnswer.model}</span>
                </div>
                <button
                  onClick={() => setSelectedAnswer(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
                  Mention Type: <strong className="text-slate-900 dark:text-white">{selectedAnswer.brand_mention_type}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
                  Recommendation: <strong className="text-slate-900 dark:text-white">{selectedAnswer.recommendation_strength}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
                  Sentiment: <strong className="text-slate-900 dark:text-white capitalize">{selectedAnswer.sentiment}</strong>
                </span>
              </div>

              {/* Answer Text */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Generated Response</h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedAnswer.answer_text}
                </div>
              </div>

              {/* Competitors mentioned */}
              {selectedAnswer.competitor_mentions && selectedAnswer.competitor_mentions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Competitor Mentions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnswer.competitor_mentions.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                      >
                        {c.name} {c.recommended ? "★ (Recommended)" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations */}
              {selectedAnswer.raw_citations && selectedAnswer.raw_citations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Citations</h4>
                  <div className="space-y-1.5">
                    {selectedAnswer.raw_citations.map((c, idx) => (
                      <a
                        key={idx}
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <span className="truncate max-w-sm">{c.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
