"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Quote,
  Bot,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Button } from "@/components/ui/Button";
import { AeoVisibilityData, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoVisibilityPage() {
  const [visibility, setVisibility] = useState<AeoVisibilityData | null>(null);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const { success, error } = useToast();

  const loadData = async (projId?: string) => {
    setIsLoading(true);
    try {
      const projData = await api.getAeoProjects({ limit: 50 });
      const projList = projData.projects || [];
      setProjects(projList);

      const targetId = projId || (projList.length > 0 ? projList[0].id : "");
      if (targetId) {
        if (!selectedProjectId) setSelectedProjectId(targetId);
        const vData = await api.getAeoVisibility(targetId);
        setVisibility(vData);
      }
    } catch (err: any) {
      console.error("Failed to load visibility analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedProjectId || undefined);
  }, [selectedProjectId]);

  const overallScore = visibility?.overall_score;
  const scoreLabel = visibility?.score_label || "Untested";
  const mentionScore = visibility?.mention_score ?? 0;
  const citationScore = visibility?.citation_score ?? 0;
  const positionScore = visibility?.position_score ?? 0;
  const coverageScore = visibility?.coverage_score ?? 0;
  const scoreChange = visibility?.score_change ?? 0;
  const trend = visibility?.trend || [];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Link
            href="/aeo/visibility"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            Visibility Share &amp; Progression
          </Link>
          <Link
            href="/aeo/intelligence"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Brain className="w-3.5 h-3.5" />
            Executive Intelligence Briefing
          </Link>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Explainable AEO Visibility Analytics</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mathematical synthesis of brand presence, source citations, ranking positions, and query coverage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-medium bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Explainable Formula Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md border border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase">
                Explainable Scoring Formula
              </span>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-purple-100">
              AEO Score = (0.35 × Mention) + (0.25 × Citation) + (0.20 × Position) + (0.20 × Coverage)
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Strict deterministic formula evaluating real responses collected from OpenAI, Gemini, and Perplexity engines.
            </p>
          </div>

          <div className="flex flex-col items-center bg-purple-950/60 p-4 rounded-xl border border-purple-700/50 min-w-[140px]">
            <span className="text-[11px] text-purple-300 font-medium">Overall Composite</span>
            <span className="text-3xl font-black text-white mt-0.5">
              {overallScore !== null && overallScore !== undefined ? `${overallScore}/100` : "—"}
            </span>
            <span className="text-xs font-semibold text-purple-300 mt-1">{scoreLabel}</span>
          </div>
        </div>

        {/* 4 Pillars Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Mentions */}
          <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand Mentions (35%)</span>
              <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{mentionScore}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Weight: 35 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${mentionScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Share of generated responses containing your brand name or aliases.</p>
          </Card>

          {/* Pillar 2: Citations */}
          <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Source Citations (25%)</span>
              <Quote className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{citationScore}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Weight: 25 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${citationScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Proportion of citations linking directly to your target domain.</p>
          </Card>

          {/* Pillar 3: Position */}
          <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rank Hierarchy (20%)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{positionScore}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Weight: 20 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${positionScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Prominence ranking position when cited among lists or comparison tables.</p>
          </Card>

          {/* Pillar 4: Coverage */}
          <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Query Coverage (20%)</span>
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{coverageScore}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Weight: 20 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${coverageScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Percentage of active tracked search prompts answered with high confidence.</p>
          </Card>
        </div>

        {/* Historical Snapshot Progression */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Historical Visibility Progression</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Timeline of point-in-time score snapshots recorded during analysis runs.
              </p>
            </div>

            {scoreChange !== 0 && (
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  scoreChange > 0
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border dark:border-emerald-800/60"
                    : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border dark:border-rose-800/60"
                }`}
              >
                {scoreChange > 0 ? `+${scoreChange} pts` : `${scoreChange} pts`} vs previous
              </span>
            )}
          </div>

          {trend.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-center p-6 space-y-2">
              <Calendar className="w-6 h-6 text-purple-400" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">No Historical Snapshots Available</p>
              <p className="text-[11px] text-slate-400">
                Run an AEO analysis to record your first baseline snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-48 flex items-end gap-4 pt-6 px-4">
                {trend.map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {pt.score}/100
                    </span>
                    <div
                      style={{ height: `${Math.max(pt.score * 1.3, 16)}px` }}
                      className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all group-hover:brightness-110"
                    />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[80px]">
                      {pt.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
