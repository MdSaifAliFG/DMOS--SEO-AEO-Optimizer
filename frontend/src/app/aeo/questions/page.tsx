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
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoQuestion, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function AeoQuestionsPage() {
  const [questions, setQuestions] = useState<AeoQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Add Question Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newIntent, setNewIntent] = useState("informational");

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
        }),
      ]);
      setProjects(projData.projects || []);
      if (!targetProjectId && projData.projects?.length > 0) {
        setTargetProjectId(projData.projects[0].id);
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
  }, [selectedProjectId, searchQuery, intentFilter]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !targetProjectId) return;

    try {
      await api.createAeoQuestion({
        project_id: targetProjectId,
        question_text: newQuestionText,
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

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Tracked AI Prompts & Questions ({total})</h2>
            <p className="text-xs text-slate-500">
              Evaluate brand synthesis, positioning, and direct answers for high-value buyer queries.
            </p>
          </div>

          <Button
            size="sm"
            variant="aeo"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + Track New Prompt
          </Button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search question text or category..."
          filters={[
            {
              id: "intent",
              label: "Intent",
              value: intentFilter,
              onChange: setIntentFilter,
              options: [
                { label: "All Intents", value: "all" },
                { label: "Informational", value: "informational" },
                { label: "Commercial", value: "commercial" },
                { label: "Transactional", value: "transactional" },
              ],
            },
          ]}
          onReset={() => {
            setSearchQuery("");
            setIntentFilter("all");
          }}
        />

        {/* Questions Table */}
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
                  <th className="py-3 px-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading tracked prompts...</p>
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <EmptyState
                        icon={<HelpCircle className="w-6 h-6 text-purple-500" />}
                        title="No Prompts Tracked"
                        description="Add buyer prompts to begin tracking answer synthesis across AI search engines."
                        actionLabel="+ Track New Prompt"
                        onAction={() => setIsAddModalOpen(true)}
                      />
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-md truncate">
                        {q.question_text}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{q.category}</td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                          {q.intent}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {q.visibility_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-800">
                        {q.visibility_score}%
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-emerald-600 font-semibold text-[11px]">
                        +{q.trend_change}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-slate-900">Track New AI Question</h3>
              <p className="text-xs text-slate-500">
                Monitor how ChatGPT, Perplexity, Gemini, and Google AI answer this prompt.
              </p>

              <form onSubmit={handleAddQuestion} className="space-y-4 pt-2">
                {projects.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Select Brand Project</label>
                    <select
                      value={targetProjectId}
                      onChange={(e) => setTargetProjectId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 font-medium"
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
                  <label className="text-xs font-semibold text-slate-700">Question / Prompt Text</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Which CRM offers the best marketing automation for B2B SaaS?"
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
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Intent</label>
                    <select
                      value={newIntent}
                      onChange={(e) => setNewIntent(e.target.value)}
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
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="aeo" size="sm">
                    Track Prompt
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
