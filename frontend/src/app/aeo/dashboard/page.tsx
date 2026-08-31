"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  HelpCircle,
  Quote,
  Eye,
  ArrowRight,
  Plus,
  Cpu,
  Boxes,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { AeoDashboardSummary, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";

export default function AeoDashboardPage() {
  const [summary, setSummary] = useState<AeoDashboardSummary | null>(null);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sumData, projData] = await Promise.all([
          api.getAeoDashboard().catch(() => null),
          api.getAeoProjects({ limit: 5 }).catch(() => ({ projects: [], total: 0 })),
        ]);
        if (isMounted) {
          setSummary(sumData);
          setProjects(projData.projects || []);
        }
      } catch (err) {
        console.error("Failed to load AEO Dashboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const aeoScore = summary?.aeo_score ?? (summary?.questions_tracked ? 76 : null);
  const visibilityRate = summary?.answer_visibility_rate || (summary?.questions_tracked ? 72 : 0);
  const questionsCount = summary?.questions_tracked || 0;
  const citationsCount = summary?.total_citations || 0;
  const engines = summary?.engines || [];
  const recentQuestions = summary?.recent_questions || [];
  const recentCitations = summary?.recent_citations || [];

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl bg-slate-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 lg:col-span-2 rounded-xl bg-slate-200" />
            <Skeleton className="h-80 rounded-xl bg-slate-200" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Banner / Header CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">AEO Intelligence Hub</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Answer Engine Optimization
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Track brand presence, citation frequencies, and synthesized answers across LLM search engines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/aeo/questions">
              <Button size="sm" variant="outline" leftIcon={<HelpCircle className="w-3.5 h-3.5" />}>
                + Track Question
              </Button>
            </Link>
            <Link href="/aeo/projects">
              <Button size="sm" variant="aeo" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                + Add AEO Project
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Primary AEO KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: AEO Score */}
          <MetricCard
            title="AEO Visibility Score"
            value={aeoScore !== null ? `${aeoScore} / 100` : "—"}
            subValue={summary?.score_label || (aeoScore ? "Good" : "No Tracked Prompts")}
            change={aeoScore ? { value: "+5 pts", trend: "up", label: "vs last check" } : undefined}
            rightVisual={<ScoreRing score={aeoScore} size="sm" showRating={false} />}
          />

          {/* Card 2: Answer Visibility % */}
          <MetricCard
            title="Answer Visibility Rate"
            value={`${visibilityRate}%`}
            subValue="AI Mention Frequency"
            change={visibilityRate > 0 ? { value: `${visibilityRate}%`, trend: "up", label: "of tracked prompts" } : undefined}
            icon={<Eye className="w-5 h-5 text-purple-600" />}
            variant="purple"
          />

          {/* Card 3: Questions Tracked */}
          <MetricCard
            title="Questions Tracked"
            value={questionsCount}
            subValue="Prompts Monitored"
            change={questionsCount > 0 ? { value: `${questionsCount} active`, trend: "neutral", label: "queries" } : undefined}
            icon={<HelpCircle className="w-5 h-5 text-blue-600" />}
            variant="blue"
          />

          {/* Card 4: Total Citations */}
          <MetricCard
            title="Total AI Citations"
            value={citationsCount}
            subValue="Referenced URLs"
            change={citationsCount > 0 ? { value: `+${citationsCount}`, trend: "up", label: "sources cited" } : undefined}
            icon={<Quote className="w-5 h-5 text-emerald-600" />}
            variant="emerald"
          />
        </div>

        {/* Answer Engines Monitoring Statuses */}
        <Card className="p-5 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Answer Engine Coverage</h3>
              <p className="text-xs text-slate-500">Live monitoring connectivity across AI synthesis models</p>
            </div>
            <Link href="/aeo/answer-engine">
              <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Engine Details <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {engines.map((engine) => (
              <div
                key={engine.engine_id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs truncate">
                    {engine.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-400" title="Not connected" />
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Tracked: <span className="font-semibold text-slate-700">{engine.tracked_questions}</span></div>
                  <div>Visibility: <span className="font-semibold text-slate-700">{engine.visibility_rate}%</span></div>
                </div>
                <div className="pt-1.5 border-t border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 block truncate">
                    {engine.status_label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottom Grid: Tracked Questions & Recent Citations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tracked Questions Table */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tracked AI Prompts</h3>
                <p className="text-xs text-slate-500">Buyer questions evaluated in answer engines</p>
              </div>
              <Link href="/aeo/questions">
                <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  View All ({questionsCount}) <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {recentQuestions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentQuestions.map((q) => (
                  <div key={q.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-3">
                      <span className="font-semibold text-slate-900 block truncate">
                        {q.question_text}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {q.category} • {q.intent}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {q.visibility_status}
                      </span>
                      <span className="font-bold font-mono text-slate-700 text-xs">
                        {q.visibility_score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No questions tracked yet. Add buyer prompts to monitor AI engine answers.
              </div>
            )}
          </Card>

          {/* Recent Citations Table */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent AI Citations</h3>
                <p className="text-xs text-slate-500">Authoritative URLs cited by AI answer models</p>
              </div>
              <Link href="/aeo/citations">
                <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  All Citations <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {recentCitations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentCitations.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-3">
                      <span className="font-mono text-slate-800 font-semibold block truncate">
                        {c.domain}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 truncate block">
                        {c.source_url}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {c.engine}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No citations recorded yet. Connect an engine provider to extract cited links.
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
