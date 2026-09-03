"use client";

import React, { useState } from "react";
import { api } from "@/lib/api-client";
import { AeoContentOptimizationResult } from "@/lib/types";
import {
  Sparkles,
  FileText,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export default function AeoContentOptimizerPage() {
  const [targetQuestion, setTargetQuestion] = useState<string>("What is the best SEO and AEO optimization platform for marketing agencies?");
  const [existingContent, setExistingContent] = useState<string>("DMOS is an all-in-one SEO and AEO optimization software designed for marketing teams and agencies. It automates technical audits, tracks citations across ChatGPT and Gemini, and generates actionable content briefs.");
  const [targetKeyword, setTargetKeyword] = useState<string>("AEO optimization platform");
  const [brandName, setBrandName] = useState<string>("DMOS");
  const [productService, setProductService] = useState<string>("Search & Answer Engine Optimizer");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AeoContentOptimizationResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetQuestion.trim() || !existingContent.trim()) {
      setError("Target prompt and existing content are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.optimizeAeoContent({
        target_question: targetQuestion,
        existing_content: existingContent,
        target_keyword: targetKeyword || undefined,
        brand_name: brandName || undefined,
        product_service: productService || undefined,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to optimize content for AI engines");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySuggestion = () => {
    if (!result?.direct_answer_suggestion) return;
    navigator.clipboard.writeText(result.direct_answer_suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-b border-purple-900/40 text-white pt-8 pb-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" />
            AI Content Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            AEO Interactive Content Optimizer
          </h1>
          <p className="text-purple-200/80 text-sm sm:text-base mt-1 max-w-2xl">
            Engineer your webpage copy to be readily understood, summarized, and cited by AI answer engines like ChatGPT, Gemini, Perplexity, and Claude.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Content Parameters
            </h2>

            <form onSubmit={handleOptimize} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Target Question / Buyer Prompt <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetQuestion}
                  onChange={(e) => setTargetQuestion(e.target.value)}
                  placeholder="e.g. How much does DMOS cost and what is included?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Existing Page Content / Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={existingContent}
                  onChange={(e) => setExistingContent(e.target.value)}
                  placeholder="Paste current webpage draft or paragraphs here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Keyword</label>
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="e.g. AEO software"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Category</label>
                  <input
                    type="text"
                    value={productService}
                    onChange={(e) => setProductService(e.target.value)}
                    placeholder="e.g. SEO Tool"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
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
                <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Analyzing for Answer Engines..." : "Optimize Content for AEO"}
              </button>
            </form>
          </div>

          {/* Output Results Column */}
          <div className="lg:col-span-6 space-y-6">
            {!result ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400 h-full flex flex-col items-center justify-center">
                <Sparkles className="w-12 h-12 mb-3 text-purple-300" />
                <h3 className="text-base font-bold text-slate-700">AEO Output Workspace</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Fill in the content parameters and click Optimize Content to receive direct answer suggestions, missing facts, and heading structures.
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-xs text-slate-700">
                {/* Score & Detection Card */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      AEO Quality Score
                    </span>
                    <div className="text-2xl font-black text-purple-950 mt-0.5">
                      {result.content_quality_score}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-500 block">Direct Answer Excerpt</span>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        result.has_direct_answer
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {result.has_direct_answer ? "✓ Detected" : "⚠ Missing Direct Excerpt"}
                    </span>
                  </div>
                </div>

                {/* Direct Answer Suggestion */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                      Optimized Direct Answer Snippet
                    </h4>
                    <button
                      onClick={handleCopySuggestion}
                      className="text-purple-700 hover:text-purple-900 font-bold text-[11px] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? "Copied!" : "Copy Snippet"}
                    </button>
                  </div>
                  <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 text-slate-800 leading-relaxed font-medium">
                    {result.direct_answer_suggestion}
                  </div>
                </div>

                {/* Headings */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    Recommended Heading Hierarchy
                  </h4>
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {result.recommended_headings.map((h, i) => (
                      <div key={i} className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="text-purple-600 font-mono text-[10px]">H{i === 0 ? "1" : "2"}</span>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Facts */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Missing Key Facts for AI Context
                  </h4>
                  <div className="space-y-1.5">
                    {result.missing_facts.map((fact, i) => (
                      <div key={i} className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span className="text-slate-800">{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Readability recommendations */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    AI Crawler Readability Recommendations
                  </h4>
                  <div className="space-y-1.5">
                    {result.ai_readability_recommendations.map((rec, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-slate-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
