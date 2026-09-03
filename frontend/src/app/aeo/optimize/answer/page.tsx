"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { AeoDirectAnswerOptimizationResult } from "@/lib/types";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  FileCheck,
} from "lucide-react";

function AeoDirectAnswerOptimizerContent() {
  const searchParams = useSearchParams();
  const initialQuestion = searchParams?.get("question") || "What is the pricing model for DMOS?";

  const [targetQuestion, setTargetQuestion] = useState<string>(initialQuestion);
  const [existingContent, setExistingContent] = useState<string>(
    "DMOS is an all-in-one SEO & AEO platform with pricing starting at $49/month for small businesses and $199/month for agencies with enterprise SOC 2 compliance."
  );
  const [brandName, setBrandName] = useState<string>("DMOS");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AeoDirectAnswerOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetQuestion.trim() || !existingContent.trim()) {
      setError("Target prompt and answer content are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.optimizeAeoDirectAnswer({
        target_question: targetQuestion,
        existing_content: existingContent,
        brand_name: brandName || undefined,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to evaluate direct answer readiness");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuestion) {
      setTargetQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-b border-purple-900/40 text-white pt-8 pb-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
            <FileCheck className="w-4 h-4" />
            Answer Readiness
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Direct Answer 9-Dimension Evaluator
          </h1>
          <p className="text-purple-200/80 text-sm sm:text-base mt-1 max-w-2xl">
            Audit your answer passages against the 9 key dimensions that AI answer engines evaluate when choosing snippets to cite.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              Answer Input
            </h2>

            <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Target Question / Prompt <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetQuestion}
                  onChange={(e) => setTargetQuestion(e.target.value)}
                  placeholder="e.g. How does DMOS optimize for ChatGPT?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Candidate Answer Passage / Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  value={existingContent}
                  onChange={(e) => setExistingContent(e.target.value)}
                  placeholder="Paste your 1-3 paragraph answer draft here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. DMOS"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-900/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Evaluating Dimensions..." : "Evaluate 9-Dimension Readiness"}
              </button>
            </form>
          </div>

          {/* Results Checklist Column */}
          <div className="lg:col-span-7 space-y-6">
            {!result ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400 h-full flex flex-col items-center justify-center">
                <FileCheck className="w-12 h-12 mb-3 text-purple-300" />
                <h3 className="text-base font-bold text-slate-700">Readiness Diagnostic Workspace</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Click Evaluate to analyze your answer draft across the 9 dimensions required for AI citation.
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-xs text-slate-700">
                {/* Readiness Score Card */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      Answer Readiness Score
                    </span>
                    <div className="text-3xl font-black text-purple-950 mt-0.5">
                      {result.readiness_score}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-500 block">Criteria Passed</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">
                      {result.passed_criteria_count} of {result.total_criteria_count} Dimensions
                    </span>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        result.passed_criteria_count >= 7
                          ? "bg-emerald-100 text-emerald-800"
                          : result.passed_criteria_count >= 4
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {result.readiness_label}
                    </span>
                  </div>
                </div>

                {/* 9 Dimensions Checklist */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    9-Dimension Diagnostic Checklist
                  </h3>
                  <div className="space-y-2.5">
                    {result.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                          item.status === "pass"
                            ? "bg-emerald-50/40 border-emerald-200/80"
                            : "bg-amber-50/40 border-amber-200/80"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.status === "pass" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 text-xs">{item.dimension}</span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                item.status === "pass"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.status === "pass" ? "Passed" : "Needs Work"}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1 leading-snug">
                            {item.guidance}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Step Action */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      Recommended Next Step
                    </span>
                    <p className="text-xs font-semibold text-purple-950 mt-0.5">
                      {result.recommended_next_action}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEvaluate()}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-bold transition shrink-0"
                  >
                    Re-evaluate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AeoDirectAnswerOptimizerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading evaluator...</p>
          </div>
        </div>
      }
    >
      <AeoDirectAnswerOptimizerContent />
    </Suspense>
  );
}
