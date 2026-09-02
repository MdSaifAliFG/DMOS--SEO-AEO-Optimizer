"use client";

import React, { useEffect, useState } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Layers,
  Trash2,
  Eye,
  X,
  Bot,
  Filter,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoQuestion, AeoProject, AeoAnswer } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoQuestionsPage() {
  const [questions, setQuestions] = useState<AeoQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Add Question Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newCategory, setNewCategory] = useState("Brand Overview");
  const [newIntent, setNewIntent] = useState("informational");

  // Generate Prompts Modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);

  // Question Answer Drawer
  const [selectedQuestion, setSelectedQuestion] = useState<AeoQuestion | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<AeoAnswer[]>([]);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  const { success, error } = useToast();

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const [projData, qData] = await Promise.all([
        api.getAeoProjects({ limit: 50 }),
        api.getAeoQuestions({
          project_id: selectedProjectId || undefined,
          search: searchQuery || undefined,
          intent: intentFilter !== "all" ? intentFilter : undefined,
          visibility_status: statusFilter !== "all" ? statusFilter : undefined,
        }),
      ]);
      const projList = projData.projects || [];
      setProjects(projList);
      if (!selectedProjectId && projList.length > 0) {
        setSelectedProjectId(projList[0].id);
      }
      setQuestions(qData.questions || []);
      setTotal(qData.total || 0);
    } catch (err: any) {
      error("Failed to load questions", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedProjectId, searchQuery, intentFilter, statusFilter]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !selectedProjectId) return;

    try {
      await api.createAeoQuestion({
        project_id: selectedProjectId,
        question_text: newQuestionText.trim(),
        category: newCategory,
        intent: newIntent,
      });
      success("Question Added", "Prompt registered for AEO monitoring");
      setIsAddModalOpen(false);
      setNewQuestionText("");
      fetchQuestions();
    } catch (err: any) {
      error("Failed to add question", err.message);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!selectedProjectId) return;
    setIsGenerating(true);
    try {
      const gen = await api.generateAeoQuestions({
        project_id: selectedProjectId,
        max_questions: generateCount,
      });
      success("Prompts Generated", `Added ${gen.questions.length} new high-intent prompt questions.`);
      setIsGenerateModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      error("Failed to generate questions", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Are you sure you want to delete this tracked prompt?")) return;
    try {
      await api.deleteAeoQuestion(qId);
      success("Deleted", "Question removed from tracking");
      fetchQuestions();
    } catch (err: any) {
      error("Failed to delete question", err.message);
    }
  };

  const handleOpenAnswers = async (question: AeoQuestion) => {
    setSelectedQuestion(question);
    setIsLoadingAnswers(true);
    try {
      const data = await api.getAeoAnswers({ question_id: question.id });
      setQuestionAnswers(data.answers || []);
    } catch (err) {
      setQuestionAnswers([]);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Tracked AI Prompts & Questions ({total})</h2>
            </div>
            <p className="text-xs text-slate-500">
              Evaluate brand synthesis, positioning, and direct answers for high-value search prompts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              variant="outline"
              onClick={() => setIsGenerateModalOpen(true)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-purple-600" />}
              className="text-xs h-8"
            >
              Generate Prompts
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-8 shadow-xs"
            >
              Add Question
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search prompt text or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Intents</option>
              <option value="informational">Informational</option>
              <option value="commercial">Commercial</option>
              <option value="comparison">Comparison</option>
              <option value="transactional">Transactional</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="visible">Brand Mentioned</option>
              <option value="not_visible">Not Mentioned</option>
              <option value="untested">Untested</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <Card className="border-slate-200 bg-white overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
              <p className="mt-3 text-xs">Loading tracked questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No tracked prompts found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add custom search prompts or generate high-intent questions for this project.
              </p>
              <Button size="sm" variant="outline" onClick={() => setIsGenerateModalOpen(true)}>
                Generate Questions
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Prompt / Question</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Intent</th>
                    <th className="px-4 py-3 text-center">AI Prominence</th>
                    <th className="px-4 py-3">Last Checked</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-5 py-3.5 max-w-md">
                        <button
                          onClick={() => handleOpenAnswers(q)}
                          className="font-semibold text-slate-800 hover:text-purple-700 text-left line-clamp-2 block"
                        >
                          {q.question_text}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {q.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="capitalize text-slate-600">{q.intent}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {q.brand_mentioned ? (
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                            Mentioned {q.best_rank_position ? `(Rank #${q.best_rank_position})` : ""}
                          </span>
                        ) : q.visibility_status === "not_visible" ? (
                          <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/50">
                            Not Mentioned
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 text-slate-500">
                            Untested
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {q.last_checked_at ? formatTimeAgo(q.last_checked_at) : "Never"}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAnswers(q)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Inspect AI Answers"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Prompt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal: Add Question */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Add Tracked Prompt</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Question / Search Query</label>
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="e.g. How does [Brand] compare to competitors?"
                    rows={3}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
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
                      value={newIntent}
                      onChange={(e) => setNewIntent(e.target.value)}
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
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
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

        {/* Modal: Generate Questions */}
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">Auto-Generate High-Intent Prompts</h3>
                </div>
                <button onClick={() => setIsGenerateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Generates deterministic prompt questions across 8 buyer intent categories tailored to your brand, industry, and competitors.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Number of Questions</label>
                <select
                  value={generateCount}
                  onChange={(e) => setGenerateCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <option value={5}>5 Questions</option>
                  <option value={8}>8 Questions</option>
                  <option value={12}>12 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsGenerateModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleGeneratePrompts}
                  isLoading={isGenerating}
                  className="bg-purple-600 text-white"
                >
                  Generate & Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal / Drawer: Question AI Answers */}
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">AI Search Prompt</span>
                  <h3 className="text-sm font-bold text-slate-900">{selectedQuestion.question_text}</h3>
                </div>
                <button onClick={() => setSelectedQuestion(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingAnswers ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                  <p className="mt-2 text-xs">Loading engine answers...</p>
                </div>
              ) : questionAnswers.length === 0 ? (
                <div className="py-10 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500">No collected AI answers found for this prompt.</p>
                  <p className="text-[11px] text-slate-400">Run an AEO analysis to query active answer engines.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questionAnswers.map((ans) => (
                    <div key={ans.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-purple-100 text-purple-800">
                            {ans.engine}
                          </span>
                          {ans.model && <span className="text-[10px] text-slate-400">{ans.model}</span>}
                        </div>
                        {ans.brand_mentioned ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Mentioned {ans.brand_position ? `(#${ans.brand_position})` : ""}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-500">Not Mentioned</span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                        {ans.answer_text}
                      </p>

                      {ans.mention_snippets && ans.mention_snippets.length > 0 && (
                        <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-900">
                          <strong>Extracted Mention:</strong> {ans.mention_snippets[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Button size="sm" variant="outline" onClick={() => setSelectedQuestion(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
