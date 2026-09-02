"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Bot,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Puzzle,
  ArrowRight,
  Search,
  Copy,
  Clock,
  Zap,
  Quote,
  Layers,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AeoEngineStatus, AeoAnswer, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoAnswerEnginePage() {
  const [engines, setEngines] = useState<AeoEngineStatus[]>([]);
  const [answers, setAnswers] = useState<AeoAnswer[]>([]);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedEngineFilter, setSelectedEngineFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Answer Detail Drawer/Modal
  const [expandedAnswer, setExpandedAnswer] = useState<AeoAnswer | null>(null);

  const { success, error } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashData, projData, ansData] = await Promise.all([
        api.getAeoDashboard(selectedProjectId || undefined).catch(() => null),
        api.getAeoProjects({ limit: 50 }).catch(() => ({ projects: [], total: 0 })),
        api.getAeoAnswers({
          project_id: selectedProjectId || undefined,
          engine: selectedEngineFilter !== "all" ? selectedEngineFilter : undefined,
          limit: 50,
        }).catch(() => ({ answers: [], total: 0 })),
      ]);

      const projList = projData.projects || [];
      setProjects(projList);
      if (!selectedProjectId && projList.length > 0) {
        setSelectedProjectId(projList[0].id);
      }

      if (dashData?.engines) {
        setEngines(dashData.engines);
      }
      setAnswers(ansData.answers || []);
    } catch (err: any) {
      error("Failed to load Answer Engine data", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectId, selectedEngineFilter]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    success("Copied to clipboard!");
  };

  const filteredAnswers = answers.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.answer_text.toLowerCase().includes(q) ||
      (a.question_text && a.question_text.toLowerCase().includes(q)) ||
      a.engine.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Answer Engine Synthesis & Workspace</h2>
            </div>
            <p className="text-xs text-slate-500">
              Inspect generated answer texts, brand prominence snippets, latency, and source citations across LLM search models.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          </div>
        </div>

        {/* Engine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {engines.map((engine) => {
            const isConnected = engine.is_connected;
            return (
              <Card key={engine.engine_id} className="p-5 border-slate-200 bg-white space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <h3 className="text-sm font-bold text-slate-900">{engine.name}</h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      engine: {engine.engine_id}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      isConnected
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {engine.status_label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center font-mono">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Answers</span>
                    <span className="text-xs font-bold text-slate-900">{engine.tracked_questions}</span>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                    <span className="text-[10px] text-purple-700 block uppercase font-sans">Brand Vis</span>
                    <span className="text-xs font-bold text-purple-900">
                      {engine.tracked_questions > 0 ? `${engine.visibility_rate}%` : "—"}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Collected AI Answers Workspace */}
        <Card className="border-slate-200 bg-white space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Collected Answer Responses ({filteredAnswers.length})</h3>
              <p className="text-xs text-slate-500">Live AI search outputs collected during project analysis runs.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-44"
                />
              </div>

              <select
                value={selectedEngineFilter}
                onChange={(e) => setSelectedEngineFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Engines</option>
                <option value="chatgpt">ChatGPT</option>
                <option value="gemini">Gemini</option>
                <option value="perplexity">Perplexity</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
              <p className="mt-3 text-xs">Loading answers...</p>
            </div>
          ) : filteredAnswers.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Bot className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No AI answers collected yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Trigger an AEO analysis from the dashboard or project page to synthesize answers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnswers.map((ans) => (
                <div
                  key={ans.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 bg-slate-50/40 space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {ans.question_text && (
                        <p className="text-xs font-bold text-slate-900">"{ans.question_text}"</p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-purple-100 text-purple-800">
                          {ans.engine}
                        </span>
                        {ans.model && <span>• {ans.model}</span>}
                        {ans.latency_ms && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ans.latency_ms}ms
                          </span>
                        )}
                        <span>• {formatTimeAgo(ans.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ans.brand_mentioned ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Brand Mentioned {ans.brand_position ? `(Rank #${ans.brand_position})` : ""}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-200/80 text-slate-600">
                          Not Mentioned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Answer Preview */}
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100 whitespace-pre-wrap line-clamp-4">
                    {ans.answer_text}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      {ans.citations_count > 0 && (
                        <span className="flex items-center gap-1 font-medium text-purple-700">
                          <Quote className="w-3 h-3" /> {ans.citations_count} citations extracted
                        </span>
                      )}
                      {ans.competitor_mentions && ans.competitor_mentions.length > 0 && (
                        <span>Competitors: {ans.competitor_mentions.map((c) => c.name).join(", ")}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(ans.answer_text)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded flex items-center gap-1 text-[11px]"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      <button
                        onClick={() => setExpandedAnswer(ans)}
                        className="text-xs font-semibold text-purple-600 hover:underline"
                      >
                        View Full Analysis →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal: Expanded Answer Viewer */}
        {expandedAnswer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-purple-100 text-purple-800">
                    {expandedAnswer.engine}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {expandedAnswer.question_text || "Answer Output"}
                  </h3>
                </div>
                <button onClick={() => setExpandedAnswer(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {expandedAnswer.mention_snippets && expandedAnswer.mention_snippets.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 block">
                    Detected Brand Mention ({expandedAnswer.brand_position ? `Rank #${expandedAnswer.brand_position}` : "Identified"})
                  </span>
                  <p>{expandedAnswer.mention_snippets[0]}</p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Full Generated Answer Text</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {expandedAnswer.answer_text}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span>Model: {expandedAnswer.model || "Standard"}</span>
                  {expandedAnswer.latency_ms && <span>Latency: {expandedAnswer.latency_ms}ms</span>}
                </div>
                <Button size="sm" variant="outline" onClick={() => handleCopyText(expandedAnswer.answer_text)} leftIcon={<Copy className="w-3 h-3" />}>
                  Copy Answer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
