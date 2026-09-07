"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scale,
  FileText,
  Boxes,
  Quote,
  DollarSign,
  Copy,
  CheckCircle2,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GeoProject, GeoOptimizeResult } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoComparisonOptimizationPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [competitorName, setCompetitorName] = useState("");
  const [category, setCategory] = useState("Enterprise Software");
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
          if (projs[0].competitors && projs[0].competitors.length > 0) {
            setCompetitorName(projs[0].competitors[0].name);
          } else {
            setCompetitorName("Industry Benchmark Competitor");
          }
        }
      } catch (err) {
        error("Failed to load projects.");
      }
    };
    loadProjects();
  }, []);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !competitorName.trim()) {
      error("Project and competitor name are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.optimizeGeoComparison({
        project_id: selectedProjectId,
        competitor_name: competitorName,
        category,
      });
      setResult(res);
      success("Comparison matrix blueprint generated!");
    } catch (err) {
      error("Failed to build comparison matrix.");
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40 shadow-xs"
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
                <Scale className="w-5 h-5 text-amber-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">GEO Comparison &amp; Alternative Matrix Studio</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/20">
                Head-to-Head Positioning
              </span>
            </div>
            <p className="text-xs text-amber-200/80 max-w-2xl">
              Generative engines rely on neutral comparison matrices to recommend alternatives. Create fair, structured trade-off tables that AI models extract.
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

        {/* Matrix Form and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <form onSubmit={handleOptimize} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Competitor Name
                </label>
                <input
                  type="text"
                  value={competitorName}
                  onChange={(e) => setCompetitorName(e.target.value)}
                  placeholder="e.g. CompetitorBrand"
                  required
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Segment
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. B2B Enterprise Marketing Analytics"
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
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
                    Synthesizing Matrix Blueprint...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Build Comparison Matrix
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-5 border-slate-200 dark:border-slate-800">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <Scale className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-1" />
                <p className="text-xs">
                  Enter a competitor name to generate an unbiased comparison table and alternative recommendation guide optimized for AI search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {result.title}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Impact: {result.expected_impact}
                  </span>
                </div>

                {result.direct_answer && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      AI Trade-Off Summary
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {result.direct_answer}
                    </p>
                  </div>
                )}

                {result.recommended_structure?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Recommended Comparison Dimensions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {result.recommended_structure.map((dim, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                          {dim}
                        </div>
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
