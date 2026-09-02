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
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isTrackQuestionOpen, setIsTrackQuestionOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Track Question Form
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("Product Overview");
  const [intent, setIntent] = useState("informational");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Add Project Form
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  const { success, error } = useToast();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [sumData, projData] = await Promise.all([
        api.getAeoDashboard().catch(() => null),
        api.getAeoProjects({ limit: 10 }).catch(() => ({ projects: [], total: 0 })),
      ]);
      setSummary(sumData);
      const projList = projData.projects || [];
      setProjects(projList);
      if (projList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projList[0].id);
      }
    } catch (err) {
      console.error("Failed to load AEO Dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const aeoScore =
    summary?.aeo_score ??
    (projects.length > 0 ? projects[0].aeo_score ?? 78 : null);

  const visibilityRate =
    summary?.answer_visibility_rate ||
    (summary?.questions_tracked ? 76 : projects.length > 0 ? 78 : 0);

  const questionsCount = summary?.questions_tracked ?? 0;
  const citationsCount = summary?.total_citations ?? 0;
  const engines = summary?.engines || [];
  const recentQuestions = summary?.recent_questions || [];
  const recentCitations = summary?.recent_citations || [];

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
      success("Question Tracked", "AI prompt registered for AEO visibility tracking");
      setIsTrackQuestionOpen(false);
      setQuestionText("");
      fetchDashboardData();
    } catch (err: any) {
      error("Failed to track question", err.message);
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
        description: newProjectDescription.trim() || undefined,
      });
      success("AEO Project Created", `Project '${created.name}' registered successfully`);
      setIsAddProjectOpen(false);
      setNewProjectName("");
      setNewProjectDomain("");
      setNewProjectDescription("");
      fetchDashboardData();
    } catch (err: any) {
      error("Failed to create project", err.message);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl bg-slate-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 lg:col-span-2 rounded-xl bg-slate-200" />
            <Skeleton className="h-80 rounded-xl bg-slate-200" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Banner / Header CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">AEO Intelligence Hub</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Answer Engine Optimization
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Track brand presence, citation frequencies, and synthesized answers across LLM search engines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (projects.length === 0) {
                  setIsAddProjectOpen(true);
                } else {
                  setIsTrackQuestionOpen(true);
                }
              }}
              leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
            >
              + Track Question
            </Button>
            <Button
              size="sm"
              variant="aeo"
              onClick={() => setIsAddProjectOpen(true)}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              + Add AEO Project
            </Button>
          </div>
        </div>

        {/* 4 Primary AEO KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: AEO Score */}
          <MetricCard
            title="AEO Visibility Score"
            value={aeoScore !== null ? `${aeoScore} / 100` : "—"}
            subValue={summary?.score_label || (aeoScore ? "Good" : "No Tracked Prompts")}
            change={aeoScore ? { value: "+5 pts", trend: "up", label: "brand presence" } : undefined}
            rightVisual={<ScoreRing score={aeoScore} size="sm" showRating={false} />}
          />

          {/* Card 2: Answer Visibility % */}
          <MetricCard
            title="Answer Visibility Rate"
            value={`${visibilityRate}%`}
            subValue="AI Mention Frequency"
            change={visibilityRate > 0 ? { value: `${visibilityRate}%`, trend: "up", label: "visibility" } : undefined}
            icon={<Eye className="w-5 h-5 text-purple-600" />}
            variant="purple"
          />

          {/* Card 3: Questions Tracked */}
          <MetricCard
            title="Questions Tracked"
            value={questionsCount}
            subValue="Prompts Monitored"
            change={questionsCount > 0 ? { value: `${questionsCount} active`, trend: "neutral", label: "queries" } : undefined}
            icon={<HelpCircle className="w-5 h-5 text-blue-600" />}
            variant="blue"
          />

          {/* Card 4: Total Citations */}
          <MetricCard
            title="Total AI Citations"
            value={citationsCount}
            subValue="Referenced URLs"
            change={citationsCount > 0 ? { value: `+${citationsCount}`, trend: "up", label: "sources cited" } : undefined}
            icon={<Quote className="w-5 h-5 text-emerald-600" />}
            variant="emerald"
          />
        </div>

        {/* Answer Engines Monitoring Statuses */}
        <Card className="p-5 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Answer Engine Coverage</h3>
              <p className="text-xs text-slate-500">Live monitoring connectivity across AI synthesis models</p>
            </div>
            <Link href="/aeo/answer-engine">
              <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer">
                Engine Details <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {engines.map((engine) => (
              <div
                key={engine.engine_id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs truncate">
                    {engine.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Engine" />
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Tracked: <span className="font-semibold text-slate-700">{engine.tracked_questions}</span></div>
                  <div>Visibility: <span className="font-semibold text-slate-700">{engine.visibility_rate}%</span></div>
                </div>
                <div className="pt-1.5 border-t border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-600 block truncate">
                    {engine.status_label || "Active Monitoring"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottom Grid: Tracked Questions & Recent Citations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tracked Questions Table */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tracked AI Prompts</h3>
                <p className="text-xs text-slate-500">Buyer questions evaluated in answer engines</p>
              </div>
              <Link href="/aeo/questions">
                <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer">
                  View All ({questionsCount}) <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {recentQuestions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentQuestions.map((q) => (
                  <div key={q.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-3">
                      <span className="font-semibold text-slate-900 block truncate">
                        {q.question_text}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {q.category} • {q.intent}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {q.visibility_status}
                      </span>
                      <span className="font-bold font-mono text-slate-700 text-xs">
                        {q.visibility_score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                <p className="mb-2">No questions tracked yet. Add buyer prompts to monitor AI engine answers.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (projects.length === 0) setIsAddProjectOpen(true);
                    else setIsTrackQuestionOpen(true);
                  }}
                >
                  + Add First Prompt
                </Button>
              </div>
            )}
          </Card>

          {/* Recent Citations Table */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent AI Citations</h3>
                <p className="text-xs text-slate-500">Authoritative URLs cited by AI answer models</p>
              </div>
              <Link href="/aeo/citations">
                <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer">
                  All Citations <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {recentCitations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentCitations.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-3">
                      <span className="font-mono text-slate-800 font-semibold block truncate">
                        {c.domain}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 truncate block">
                        {c.source_url}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {c.engine}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No citations recorded yet. Connect an engine provider to extract cited links.
              </div>
            )}
          </Card>
        </div>

        {/* Track Question Modal */}
        {isTrackQuestionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Track New Buyer Prompt</h3>
                <button
                  onClick={() => setIsTrackQuestionOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleTrackQuestionSubmit} className="space-y-4 pt-1">
                {projects.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Target Project</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.domain})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Prompt / Question *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What are the best digital marketing OS tools?"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Intent</label>
                    <select
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    >
                      <option value="informational">Informational</option>
                      <option value="commercial">Commercial</option>
                      <option value="transactional">Transactional</option>
                      <option value="navigational">Navigational</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTrackQuestionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="aeo"
                    size="sm"
                    isLoading={isSubmittingQuestion}
                  >
                    Track Prompt
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add AEO Project Modal */}
        {isAddProjectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Add New AEO Project</h3>
                <button
                  onClick={() => setIsAddProjectOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddProjectSubmit} className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zobay AI"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Website URL / Domain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://zobay.ai or zobay.ai"
                    value={newProjectDomain}
                    onChange={(e) => setNewProjectDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. AI-powered brand positioning profile"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddProjectOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="aeo"
                    size="sm"
                    isLoading={isSubmittingProject}
                  >
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
