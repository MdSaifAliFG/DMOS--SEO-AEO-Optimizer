"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Boxes,
  Quote,
  Scale,
  DollarSign,
  Copy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GeoProject, GeoOptimizeResult } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoContentOptimizationPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [topic, setTopic] = useState("Enterprise AI Search Optimization Platform");
  const [existingContent, setExistingContent] = useState(
    "Our platform provides automated search analytics and crawler auditing for digital marketing teams."
  );
  const [contentType, setContentType] = useState("guide");
  const [result, setResult] = useState<GeoOptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.getGeoProjects();
        const projs = res.projects || [];
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0].id);
        }
      } catch (err) {
        error("Failed to load projects.");
      }
    };
    loadProjects();
  }, []);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      error("Please select a project first.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.optimizeGeoContent({
        project_id: selectedProjectId,
        topic,
        content_type: contentType,
        existing_content: existingContent,
      });
      setResult(res);
      success("GEO content optimization brief generated!");
    } catch (err) {
      error("Failed to run content optimization.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Link
            href="/geo/optimization/content"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            Content Extractability
          </Link>
          <Link
            href="/geo/optimization/entities"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Boxes className="w-3.5 h-3.5" />
            Entity Schema
          </Link>
          <Link
            href="/geo/optimization/citations"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
            Citation Sourcing
          </Link>
          <Link
            href="/geo/optimization/comparisons"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Scale className="w-3.5 h-3.5" />
            Comparison Matrices
          </Link>
          <Link
            href="/geo/optimization/commercial"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Commercial Intent
          </Link>
        </div>

        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 text-white shadow-md border border-amber-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">GEO Content Extractability Studio</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/20">
                Generative Content Engine
              </span>
            </div>
            <p className="text-xs text-amber-200/80 max-w-2xl">
              Optimize webpage paragraphs into clear, fact-dense direct answers that ChatGPT, Perplexity, Gemini, and Claude parse and cite.
            </p>
          </div>

          {projects.length > 0 && (
            <select
              aria-label="Select GEO Project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs rounded-lg border border-amber-700/60 bg-slate-900 text-slate-100 px-3 py-1.5 font-medium shadow-sm self-start sm:self-auto"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand_name || p.name} ({p.domain})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Optimizer Form & Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <form onSubmit={handleOptimize} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Topic or Query Subject
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Best SEO & AEO Software for B2B Agencies"
                  required
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content Format
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="guide">In-Depth Guide / Article</option>
                  <option value="faq">FAQ / Knowledge Base Article</option>
                  <option value="product">Product Feature Page</option>
                  <option value="comparison">Head-to-Head Comparison</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Existing Paragraph or Draft Content
                </label>
                <textarea
                  rows={6}
                  value={existingContent}
                  onChange={(e) => setExistingContent(e.target.value)}
                  placeholder="Paste your existing copy here to analyze extractability and inject direct answers..."
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Analyzing Content Extractability...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Generate GEO Optimization Brief
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Results Display */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-1" />
                <p className="text-xs">
                  Fill in the topic and content draft, then click Generate to receive structured direct answer recommendations, missing facts, and heading blueprints.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {result.tool.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Impact: {result.expected_impact}
                  </span>
                </div>

                {result.direct_answer && (
                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                        AI-Extractable Direct Answer
                      </span>
                      <button
                        onClick={() => handleCopy(result.direct_answer || "")}
                        className="text-xs text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {result.direct_answer}
                    </p>
                  </div>
                )}

                {result.suggested_headings?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Recommended Heading Hierarchy (H2 / H3)
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {result.suggested_headings.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">•</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.missing_facts?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      Identified Fact Gaps
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {result.missing_facts.map((fact, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-rose-500 font-bold">•</span> {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.supporting_evidence?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Recommended Supporting Evidence
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.supporting_evidence.map((ev, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
