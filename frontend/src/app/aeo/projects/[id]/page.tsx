"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Sparkles,
  Globe,
  HelpCircle,
  Quote,
  Boxes,
  Plus,
  ArrowLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Play,
  TrendingUp,
  Bot,
  Cpu,
  X,
  ExternalLink,
  ListTodo,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoProject, AeoQuestion, AeoEntity, AeoCitation, AeoVisibilityData, AeoRecommendation } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<AeoProject | null>(null);
  const [questions, setQuestions] = useState<AeoQuestion[]>([]);
  const [entities, setEntities] = useState<AeoEntity[]>([]);
  const [citations, setCitations] = useState<AeoCitation[]>([]);
  const [recommendations, setRecommendations] = useState<AeoRecommendation[]>([]);
  const [visibility, setVisibility] = useState<AeoVisibilityData | null>(null);
  const [activeTab, setActiveTab] = useState<"questions" | "entities" | "citations" | "optimization">("optimization");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState("Brand Overview");
  const [newQuestionIntent, setNewQuestionIntent] = useState("informational");

  const { success, error } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const proj = await api.getAeoProject(projectId);
      setProject(proj);

      const [qData, eData, cData, rData, vData] = await Promise.all([
        api.getAeoQuestions({ project_id: projectId }),
        api.getAeoEntities({ project_id: projectId }),
        api.getAeoCitations({ project_id: projectId }),
        api.getAeoActions({ project_id: projectId }).catch(() => ({ recommendations: [], total: 0 })),
        api.getAeoVisibility(projectId).catch(() => null),
      ]);
      setQuestions(qData.questions || []);
      setEntities(eData.entities || []);
      setCitations(cData.citations || []);
      setRecommendations(rData.recommendations || []);
      setVisibility(vData);
    } catch (err: any) {
      error("Failed to load AEO project details", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await api.triggerAeoAnalysis(projectId, { allow_test_mode: true });
      success("AEO Analysis Started", "Querying answer engines and updating visibility...");
      setTimeout(() => {
        loadData();
        setIsAnalyzing(false);
      }, 3000);
    } catch (err: any) {
      error("Failed to trigger analysis", err.message);
      setIsAnalyzing(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    try {
      await api.createAeoQuestion({
        project_id: projectId,
        question_text: newQuestionText.trim(),
        category: newQuestionCategory,
        intent: newQuestionIntent,
      });
      success("Question Added", "New prompt registered for AEO monitoring");
      setIsAddQuestionOpen(false);
      setNewQuestionText("");
      loadData();
    } catch (err: any) {
      error("Failed to add question", err.message);
    }
  };

  const handleGeneratePrompts = async () => {
    try {
      const gen = await api.generateAeoQuestions({ project_id: projectId, max_questions: 6 });
      success("Prompts Generated", `Added ${gen.questions.length} high-intent search prompts.`);
      loadData();
    } catch (err: any) {
      error("Failed to generate prompts", err.message);
    }
  };

  if (isLoading && !project) {
    return (
      <DashboardShell>
        <div className="py-24 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
          <p className="mt-3 text-xs">Loading AEO project workspace...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="py-16 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">Project Not Found</p>
          <Link href="/aeo/projects">
            <Button size="sm" variant="outline">Back to AEO Projects</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/aeo/projects" className="hover:text-purple-600 transition-colors">
            AEO Projects
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">{project.name}</span>
        </div>

        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/30">
                <Bot className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{project.name}</h1>
                <div className="flex items-center gap-2 text-xs text-purple-200">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{project.domain}</span>
                  {project.industry && <span>• {project.industry}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGeneratePrompts}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            >
              Generate Prompts
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleRunAnalysis}
              isLoading={isAnalyzing}
              leftIcon={<Play className="w-3.5 h-3.5" />}
              className="bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-xs text-xs"
            >
              Run Analysis
            </Button>
          </div>
        </div>

        {/* Score & Pillar Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AEO Visibility</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-purple-950">
                {project.aeo_score !== null && project.aeo_score !== undefined ? `${project.aeo_score}/100` : "Untested"}
              </span>
              {project.score_label && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  {project.score_label}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Overall composite score</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mentions (35%)</span>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-800">
                {project.mention_score !== null && project.mention_score !== undefined ? `${project.mention_score}%` : "—"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Direct brand mention rate</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Citations (25%)</span>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-800">
                {project.citation_score !== null && project.citation_score !== undefined ? `${project.citation_score}%` : "—"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Own domain citation share</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coverage (20%)</span>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-800">
                {project.coverage_score !== null && project.coverage_score !== undefined ? `${project.coverage_score}%` : "—"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Tracked prompts coverage</p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("optimization")}
                className={`text-xs font-bold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === "optimization"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                Optimization Actions ({recommendations.length})
              </button>
              <button
                onClick={() => setActiveTab("questions")}
                className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                  activeTab === "questions"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Tracked Prompts ({questions.length})
              </button>
              <button
                onClick={() => setActiveTab("entities")}
                className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                  activeTab === "entities"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Knowledge Entities ({entities.length})
              </button>
              <button
                onClick={() => setActiveTab("citations")}
                className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                  activeTab === "citations"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Extracted Citations ({citations.length})
              </button>
            </div>

            {activeTab === "questions" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddQuestionOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-8"
              >
                Add Question
              </Button>
            )}
          </div>

          {/* TAB 0: Optimization Actions */}
          {activeTab === "optimization" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">AEO Optimization Actions</h4>
                  <p className="text-xs text-slate-500">Prioritized tasks to boost AI answer visibility and citations</p>
                </div>
                <Link
                  href="/aeo/actions"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Full Action Center <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recommendations.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-xs text-slate-500">No optimization recommendations recorded yet.</p>
                  <Button size="sm" variant="outline" onClick={handleRunAnalysis} leftIcon={<Play className="w-3 h-3" />}>
                    Run Analysis to Discover Actions
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-purple-50/20 px-2 rounded-xl transition">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              rec.priority === "critical"
                                ? "bg-rose-100 text-rose-800"
                                : rec.priority === "high"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {rec.priority}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">{rec.title}</span>
                          <span className="text-[10px] text-slate-400">• {rec.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{rec.reason}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-bold text-purple-700">+{rec.estimated_impact || rec.opportunity_score} pts</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${
                            rec.status === "fixed" || rec.status === "implemented"
                              ? "bg-emerald-100 text-emerald-800"
                              : rec.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: Questions */}
          {activeTab === "questions" && (
            <div className="space-y-3">
              {questions.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs text-slate-500">No prompts tracked yet for this project.</p>
                  <Button size="sm" variant="outline" onClick={handleGeneratePrompts} leftIcon={<Sparkles className="w-3 h-3" />}>
                    Auto-Generate Questions
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {questions.map((q) => (
                    <div key={q.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{q.question_text}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium">{q.category}</span>
                          <span>Intent: {q.intent}</span>
                          {q.last_checked_at && <span>• Checked {formatTimeAgo(q.last_checked_at)}</span>}
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
            </div>
          )}

          {/* TAB 2: Entities */}
          {activeTab === "entities" && (
            <div className="space-y-3">
              {entities.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">Run an AEO analysis to extract knowledge graph entities.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {entities.map((e) => (
                    <div key={e.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{e.entity_name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          {e.entity_type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Mentions: {e.mentions_count}</span>
                        <span className="text-purple-700 font-bold">{e.visibility_rate}% Vis</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Citations */}
          {activeTab === "citations" && (
            <div className="space-y-3">
              {citations.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No citations extracted yet. Run an AEO analysis.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {citations.map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between gap-4">
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
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-50 text-purple-800 uppercase">
                        {c.engine}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Modal: Add Question */}
        {isAddQuestionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Add Search Prompt</h3>
                <button onClick={() => setIsAddQuestionOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Question / Prompt</label>
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="e.g. Best CRM for real estate agents..."
                    rows={3}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Category</label>
                    <select
                      value={newQuestionCategory}
                      onChange={(e) => setNewQuestionCategory(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200"
                    >
                      <option value="Brand Overview">Brand Overview</option>
                      <option value="Product Capabilities">Product Capabilities</option>
                      <option value="Competitor Comparison">Competitor Comparison</option>
                      <option value="Pricing & Commercial">Pricing & Commercial</option>
                      <option value="Industry Best Practices">Industry Best Practices</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Intent</label>
                    <select
                      value={newQuestionIntent}
                      onChange={(e) => setNewQuestionIntent(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200"
                    >
                      <option value="informational">Informational</option>
                      <option value="commercial">Commercial</option>
                      <option value="comparison">Comparison</option>
                      <option value="transactional">Transactional</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddQuestionOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" className="bg-purple-600 text-white">
                    Add Prompt
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
