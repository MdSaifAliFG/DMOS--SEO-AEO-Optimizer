"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  HelpCircle,
  Quote,
  Eye,
  ArrowRight,
  Plus,
  Cpu,
  Boxes,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  X,
  Play,
  TrendingUp,
  RefreshCw,
  Building2,
  Share2,
  ListTodo,
  Flame,
  Layers,
  Target,
  Network,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { AeoDashboardSummary, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoDashboardPage() {
  const [summary, setSummary] = useState<AeoDashboardSummary | null>(null);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals
  const [isTrackQuestionOpen, setIsTrackQuestionOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Track Question Form
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("Brand Overview");
  const [intent, setIntent] = useState("informational");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Add Project Form
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [newProjectIndustry, setNewProjectIndustry] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  const { success, error } = useToast();

  const fetchDashboardData = async (projId?: string) => {
    setIsLoading(true);
    try {
      const [sumData, projData] = await Promise.all([
        api.getAeoDashboard(projId).catch(() => null),
        api.getAeoProjects({ limit: 50 }).catch(() => ({ projects: [], total: 0 })),
      ]);
      setSummary(sumData);
      const projList = projData.projects || [];
      setProjects(projList);
      if (projList.length > 0 && !projId && !selectedProjectId) {
        setSelectedProjectId(projList[0].id);
      }
    } catch (err) {
      console.error("Failed to load AEO Dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedProjectId || undefined);
  }, [selectedProjectId]);

  const handleRunAnalysis = async () => {
    if (!selectedProjectId) return;
    setIsAnalyzing(true);
    try {
      await api.triggerAeoAnalysis(selectedProjectId, { allow_test_mode: true });
      success("AEO Analysis started. Processing prompt answers across connected engines...");
      setTimeout(() => {
        fetchDashboardData(selectedProjectId);
        setIsAnalyzing(false);
      }, 2500);
    } catch (err: any) {
      error(err.message || "Failed to trigger AEO analysis.");
      setIsAnalyzing(false);
    }
  };

  const handleTrackQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !selectedProjectId) return;

    setIsSubmittingQuestion(true);
    try {
      await api.createAeoQuestion({
        project_id: selectedProjectId,
        question_text: questionText.trim(),
        category,
        intent,
      });
      success("Question added to AEO tracking.");
      setIsTrackQuestionOpen(false);
      setQuestionText("");
      fetchDashboardData(selectedProjectId);
    } catch (err: any) {
      error(err.message || "Failed to add tracked question.");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectDomain.trim()) return;

    setIsSubmittingProject(true);
    try {
      const created = await api.createAeoProject({
        name: newProjectName.trim(),
        domain: newProjectDomain.trim(),
        industry: newProjectIndustry.trim() || undefined,
        description: newProjectDescription.trim() || undefined,
      });
      success(`AEO Project "${created.name}" created successfully!`);
      setIsAddProjectOpen(false);
      setNewProjectName("");
      setNewProjectDomain("");
      setNewProjectIndustry("");
      setNewProjectDescription("");
      setSelectedProjectId(created.id);
    } catch (err: any) {
      error(err.message || "Failed to create AEO project.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const aeoScore = summary?.aeo_score;
  const scoreLabel = summary?.score_label;
  const mentionRate = summary?.answer_visibility_rate ?? 0;
  const questionsCount = summary?.questions_tracked ?? 0;
  const citationsCount = summary?.total_citations ?? 0;
  const engines = summary?.engines || [];
  const recentQuestions = summary?.recent_questions || [];
  const recentCitations = summary?.recent_citations || [];
  const scoreTrend = summary?.score_trend || [];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Bot className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Answer Engine Optimization (AEO)</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Intelligence Engine
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Monitor brand prominence, knowledge entity presence, and direct citation sources across generative AI answer engines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-medium bg-purple-950/80 border border-purple-700/60 rounded-xl px-3 py-2 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}

            {projects.length > 0 && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleRunAnalysis}
                isLoading={isAnalyzing}
                leftIcon={<Play className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-sm"
              >
                Run AEO Analysis
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddProjectOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center border-dashed border-2 border-purple-200 bg-purple-50/30">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No AEO Projects Created Yet</h3>
                <p className="text-xs text-slate-500">
                  Create your first AEO project to start tracking brand prompts, citations, knowledge entities, and generative AI search visibility.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddProjectOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                Create Your First AEO Project
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Top KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* AEO Visibility Score */}
              <Card className="p-5 border-slate-200 bg-white relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AEO Visibility Score</span>
                  <button
                    onClick={() => setIsScoreModalOpen(true)}
                    className="text-slate-400 hover:text-purple-600 transition-colors"
                    title="How is this calculated?"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-purple-950">
                    {aeoScore !== null && aeoScore !== undefined ? `${aeoScore}/100` : "Untested"}
                  </span>
                  {scoreLabel && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {scoreLabel}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-purple-600" />
                  Weighted by mentions, citations, position & coverage
                </p>
              </Card>

              {/* Brand Mention Rate */}
              <MetricCard
                title="Brand Mention Rate"
                value={`${mentionRate}%`}
                subValue={`In ${summary?.recent_questions.length || 0} tracked queries`}
                icon={<Eye className="w-4 h-4 text-indigo-600" />}
              />

              {/* Questions Tracked */}
              <MetricCard
                title="Tracked Prompts"
                value={questionsCount.toString()}
                subValue="Active answer search queries"
                icon={<HelpCircle className="w-4 h-4 text-purple-600" />}
              />

              {/* Total Citations */}
              <MetricCard
                title="Source Citations"
                value={citationsCount.toString()}
                subValue="Links referencing target brand"
                icon={<Quote className="w-4 h-4 text-violet-600" />}
              />
            </div>

            {/* Middle Section: Engine Breakdown + Historical Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Answer Engine Status */}
              <Card className="p-6 border-slate-200 bg-white space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-slate-900">Answer Engines</h3>
                  </div>
                  <Link href="/aeo/answer-engine" className="text-xs text-purple-600 hover:underline font-medium">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {engines.map((eng) => (
                    <div
                      key={eng.engine_id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-800">{eng.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{eng.status_label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-purple-700">
                          {eng.tracked_questions > 0 ? `${eng.visibility_rate}% Vis` : "—"}
                        </span>
                        <p className="text-[10px] text-slate-400">{eng.tracked_questions} queries</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Visibility Progression / Trend */}
              <Card className="p-6 border-slate-200 bg-white space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900">AEO Visibility Progression</h3>
                    <p className="text-xs text-slate-500">Historical score snapshots across analysis executions</p>
                  </div>
                  <Link href="/aeo/visibility" className="text-xs text-purple-600 hover:underline font-medium flex items-center gap-1">
                    Explain Score <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {scoreTrend.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center p-6 space-y-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <p className="text-xs text-slate-600 font-medium">No Historical Comparison Available</p>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      Run your first analysis to record an initial snapshot. Subsequent analyses will plot score change trends.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-40 flex items-end gap-3 pt-6 px-2">
                      {scoreTrend.map((pt, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                          <span className="text-[10px] font-bold text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            {pt.score}
                          </span>
                          <div
                            style={{ height: `${Math.max(pt.score * 1.2, 16)}px` }}
                            className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all hover:brightness-110"
                          />
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[60px]">
                            {pt.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Phase 6 Action Center Highlights */}
            <Card className="p-6 border-slate-200 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-bold text-slate-900">AEO Action Center & Top Opportunities</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      Phase 6
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Prioritized deterministic actions to improve brand mentions, citations, and direct answers.
                  </p>
                </div>
                <Link
                  href="/aeo/actions"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
                >
                  Open Action Center <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Quick Intelligence Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <Link
                  href="/aeo/optimization/content-gaps"
                  className="p-3 rounded-xl bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100 transition flex items-center gap-2.5 group"
                >
                  <Layers className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Content Gaps</span>
                    <span className="text-[10px] text-purple-700">Missing Topics</span>
                  </div>
                </Link>

                <Link
                  href="/aeo/optimization/prompts"
                  className="p-3 rounded-xl bg-indigo-50/50 hover:bg-indigo-100/60 border border-indigo-100 transition flex items-center gap-2.5 group"
                >
                  <Target className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Prompt Gaps</span>
                    <span className="text-[10px] text-indigo-700">Uncovered Queries</span>
                  </div>
                </Link>

                <Link
                  href="/aeo/optimization/citations"
                  className="p-3 rounded-xl bg-violet-50/50 hover:bg-violet-100/60 border border-violet-100 transition flex items-center gap-2.5 group"
                >
                  <Share2 className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Citation Gaps</span>
                    <span className="text-[10px] text-violet-700">Source Domains</span>
                  </div>
                </Link>

                <Link
                  href="/aeo/optimization/entities"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-2.5 group"
                >
                  <Network className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Entity Health</span>
                    <span className="text-[10px] text-slate-600">Knowledge Graph</span>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Bottom Grid: Recent Questions & Citations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tracked Questions */}
              <Card className="p-6 border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-slate-900">Tracked AI Questions ({recentQuestions.length})</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsTrackQuestionOpen(true)}
                      leftIcon={<Plus className="w-3 h-3" />}
                      className="text-xs h-7"
                    >
                      Add Question
                    </Button>
                    <Link href="/aeo/questions" className="text-xs text-purple-600 hover:underline font-medium">
                      All
                    </Link>
                  </div>
                </div>

                {recentQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No tracked questions recorded yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {recentQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors bg-slate-50/40 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">{q.question_text}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 font-medium">{q.category}</span>
                            <span>Intent: {q.intent}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {q.brand_mentioned ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                              Mentioned {q.best_rank_position ? `(#${q.best_rank_position})` : ""}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600">
                              {q.visibility_status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Recent Source Citations */}
              <Card className="p-6 border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-violet-600" />
                    <h3 className="text-sm font-bold text-slate-900">Extracted Citations ({recentCitations.length})</h3>
                  </div>
                  <Link href="/aeo/citations" className="text-xs text-purple-600 hover:underline font-medium">
                    View All
                  </Link>
                </div>

                {recentCitations.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No source citations recorded yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {recentCitations.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <a
                            href={c.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-purple-900 hover:underline truncate block"
                          >
                            {c.domain}
                          </a>
                          <p className="text-[10px] text-slate-500 truncate">{c.source_url}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-purple-100 text-purple-800 uppercase">
                            {c.engine}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </>
        )}

        {/* Modal: Score Explanation */}
        {isScoreModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">AEO Visibility Formula</h3>
                </div>
                <button onClick={() => setIsScoreModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-100 font-mono text-xs text-purple-950 text-center">
                Score = (0.35 × Mention) + (0.25 × Citation) + (0.20 × Position) + (0.20 × Coverage)
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <p>
                  <strong>• Brand Mentions (35%):</strong> Frequency of direct brand appearances across AI generated answers.
                </p>
                <p>
                  <strong>• Source Citations (25%):</strong> Share of authoritative outbound URLs linking back to your domain.
                </p>
                <p>
                  <strong>• List Position (20%):</strong> Average ranking hierarchy when listed in top recommendations.
                </p>
                <p>
                  <strong>• Question Coverage (20%):</strong> Percentage of tracked industry queries answered with sufficient depth.
                </p>
              </div>

              <Button size="sm" variant="primary" onClick={() => setIsScoreModalOpen(false)} className="w-full bg-purple-600 text-white">
                Understood
              </Button>
            </div>
          </div>
        )}

        {/* Modal: Track Question */}
        {isTrackQuestionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Track New AI Search Prompt</h3>
                <button onClick={() => setIsTrackQuestionOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTrackQuestionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Question / Search Prompt</label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="e.g. What are the best tools for SEO in 2026?"
                    rows={3}
                    required
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Brand Overview">Brand Overview</option>
                      <option value="Product Capabilities">Product Capabilities</option>
                      <option value="Competitor Comparison">Competitor Comparison</option>
                      <option value="Pricing & Commercial">Pricing & Commercial</option>
                      <option value="Industry Best Practices">Industry Best Practices</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Intent</label>
                    <select
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="informational">Informational</option>
                      <option value="commercial">Commercial</option>
                      <option value="comparison">Comparison</option>
                      <option value="transactional">Transactional</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsTrackQuestionOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" isLoading={isSubmittingQuestion} className="bg-purple-600 text-white">
                    Start Tracking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New Project */}
        {isAddProjectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Create AEO Project</h3>
                <button onClick={() => setIsAddProjectOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProjectSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Brand Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Acme Cloud"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Target Website Domain</label>
                  <input
                    type="text"
                    value={newProjectDomain}
                    onChange={(e) => setNewProjectDomain(e.target.value)}
                    placeholder="e.g. acmecloud.com"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Industry / Domain</label>
                  <input
                    type="text"
                    value={newProjectIndustry}
                    onChange={(e) => setNewProjectIndustry(e.target.value)}
                    placeholder="e.g. Cloud Security & Infrastructure"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Brief description of primary services..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddProjectOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" isLoading={isSubmittingProject} className="bg-purple-600 text-white">
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
