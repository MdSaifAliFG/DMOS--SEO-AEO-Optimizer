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
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoProject, AeoQuestion, AeoEntity, AeoCitation } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
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
  const [activeTab, setActiveTab] = useState<"questions" | "entities" | "citations">("questions");
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState("General");
  const [newQuestionIntent, setNewQuestionIntent] = useState("informational");

  const { success, error } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const proj = await api.getAeoProject(projectId);
      setProject(proj);

      const [qData, eData, cData] = await Promise.all([
        api.getAeoQuestions({ project_id: projectId }),
        api.getAeoEntities({ project_id: projectId }),
        api.getAeoCitations({ project_id: projectId }),
      ]);
      setQuestions(qData.questions || []);
      setEntities(eData.entities || []);
      setCitations(cData.citations || []);
    } catch (err: any) {
      error("Failed to load AEO project details", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText) return;

    try {
      await api.createAeoQuestion({
        project_id: projectId,
        question_text: newQuestionText,
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

  if (isLoading && !project) {
    return (
      <DashboardShell>
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
          <p className="mt-3 text-xs">Loading AEO project...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800">AEO Project Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">The requested project ID does not exist.</p>
          <Link href="/aeo/projects">
            <Button size="sm" variant="aeo">Back to AEO Projects</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/aeo/projects" className="hover:text-purple-600 font-medium">
            AEO Projects
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate">{project.name}</span>
        </div>

        {/* Project Header Card */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>{project.domain}</span>
              <span>•</span>
              <span>Created {formatDate(project.created_at)}</span>
              <span>•</span>
              <span>{questions.length} Tracked Prompts</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="aeo"
              onClick={() => setIsAddQuestionOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              + Track New Question
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="AEO Score"
            value={`${project.aeo_score ?? 80} / 100`}
            subValue="Answer Visibility"
            rightVisual={<ScoreRing score={project.aeo_score ?? 80} size="sm" showRating={false} />}
          />

          <MetricCard
            title="Tracked Prompts"
            value={questions.length}
            subValue="Key buyer queries"
            icon={<HelpCircle className="w-5 h-5 text-blue-600" />}
            variant="blue"
          />

          <MetricCard
            title="Recognized Entities"
            value={entities.length}
            subValue="Knowledge graph nodes"
            icon={<Boxes className="w-5 h-5 text-purple-600" />}
            variant="purple"
          />

          <MetricCard
            title="Extracted Citations"
            value={citations.length}
            subValue="Source references"
            icon={<Quote className="w-5 h-5 text-emerald-600" />}
            variant="emerald"
          />
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab("questions")}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === "questions"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Tracked Prompts ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab("entities")}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === "entities"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Knowledge Entities ({entities.length})
          </button>
          <button
            onClick={() => setActiveTab("citations")}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === "citations"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Citations ({citations.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "questions" && (
          <Card className="p-0 border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Tracked Question / Prompt</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Intent</th>
                    <th className="py-3 px-4 text-center">Visibility</th>
                    <th className="py-3 px-4 text-center">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <EmptyState
                          icon={<HelpCircle className="w-6 h-6 text-purple-500" />}
                          title="No Questions Tracked Yet"
                          description="Add key search queries and user prompts to track brand visibility across AI engines."
                          actionLabel="+ Track Question"
                          onAction={() => setIsAddQuestionOpen(true)}
                        />
                      </td>
                    </tr>
                  ) : (
                    questions.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-md truncate">
                          {q.question_text}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{q.category}</td>
                        <td className="py-3.5 px-4 font-semibold text-[10px] uppercase text-slate-600">
                          {q.intent}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {q.visibility_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-800">
                          {q.visibility_score}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === "entities" && (
          <Card className="p-0 border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Entity Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Mentions Count</th>
                    <th className="py-3 px-4 text-center">Visibility Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {entities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400">
                        No knowledge entities tracked yet.
                      </td>
                    </tr>
                  ) : (
                    entities.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{e.entity_name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{e.entity_type}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold">{e.mentions_count}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700">{e.visibility_rate}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === "citations" && (
          <Card className="p-0 border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Source URL</th>
                    <th className="py-3 px-4">Engine</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {citations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400">
                        No citations extracted yet.
                      </td>
                    </tr>
                  ) : (
                    citations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{c.domain}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 truncate max-w-sm">{c.source_url}</td>
                        <td className="py-3.5 px-4 font-semibold uppercase text-[10px] text-purple-700">{c.engine}</td>
                        <td className="py-3.5 px-4 text-right font-semibold text-emerald-700 text-[11px]">{c.citation_status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Add Question Modal */}
        {isAddQuestionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-slate-900">Track New User Question</h3>
              <p className="text-xs text-slate-500">
                Register a prompt to evaluate brand synthesis and citations across AI answer models.
              </p>

              <form onSubmit={handleCreateQuestion} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Question / Prompt Text</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. What is the best API for subscription billing and recurring payments?"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Category</label>
                    <input
                      type="text"
                      value={newQuestionCategory}
                      onChange={(e) => setNewQuestionCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Intent</label>
                    <select
                      value={newQuestionIntent}
                      onChange={(e) => setNewQuestionIntent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    >
                      <option value="informational">Informational</option>
                      <option value="commercial">Commercial</option>
                      <option value="transactional">Transactional</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddQuestionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="aeo" size="sm">
                    Add Question
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
