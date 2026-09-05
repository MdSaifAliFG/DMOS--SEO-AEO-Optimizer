"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  FolderKanban,
  FileText,
  AlertTriangle,
  ArrowRight,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  X,
  Sparkles,
  ShieldCheck,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api-client";
import { Project, Scan, SeoDashboardSummary, SeoOptimizationSummary } from "@/lib/types";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function SeoDashboardPage() {
  const [summary, setSummary] = useState<SeoDashboardSummary | null>(null);
  const [optSummary, setOptSummary] = useState<SeoOptimizationSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sumData, projData] = await Promise.all([
          api.getSeoDashboard().catch(() => null),
          api.getProjects({ limit: 5 }).catch(() => ({ projects: [], total: 0 })),
        ]);
        if (isMounted) {
          setSummary(sumData);
          setProjects(projData.projects || []);
        }
        if (projData.projects && projData.projects.length > 0) {
          const optRes = await api.getSeoActionsSummary(projData.projects[0].id).catch(() => null);
          if (isMounted) setOptSummary(optRes);
        }
      } catch (err) {
        console.error("Failed to load SEO Dashboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const overallScore = summary?.overall_score ?? (projects.length > 0 && projects[0].latest_scan?.overall_score !== undefined ? projects[0].latest_scan.overall_score : null);
  const totalProjects = summary?.total_projects || projects.length;
  const totalPages = summary?.total_crawled_pages || 0;
  const totalIssues = summary?.total_issues || 0;
  const severityCounts = summary?.severity_counts || { critical: 0, high: 0, medium: 0, low: 0 };
  const recentScans = summary?.recent_scans || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "crawling":
      case "analyzing":
      case "scoring":
      case "initializing":
        return "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getScoreRatingBadge = (score: number | null) => {
    if (score === null) return { label: "No Audits", color: "bg-slate-100 text-slate-600" };
    if (score >= 90) return { label: "Excellent", color: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    if (score >= 75) return { label: "Good", color: "bg-blue-50 text-blue-700 border border-blue-200" };
    if (score >= 50) return { label: "Needs Improvement", color: "bg-amber-50 text-amber-700 border border-amber-200" };
    if (score >= 25) return { label: "Poor", color: "bg-orange-50 text-orange-700 border border-orange-200" };
    return { label: "Critical", color: "bg-rose-50 text-rose-700 border border-rose-200" };
  };

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

  const ratingInfo = getScoreRatingBadge(overallScore);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Banner / Header CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-cyan-900 to-slate-900 text-white shadow-md border border-sky-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
                <Globe className="w-5 h-5 text-sky-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">SEO Optimization & Auditing</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/20">
                Core Engine
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-2xl">
              Deterministic technical crawling, structured data auditing, metadata optimization, and crawl health telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsScoreModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-sky-700/60 bg-sky-950/80 text-xs font-semibold text-sky-100 hover:bg-sky-900 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Score Formula</span>
            </button>

            <Link href="/seo/projects">
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-sky-500 hover:bg-sky-400 text-white border-0 shadow-sm"
              >
                + New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: SEO Score */}
          <MetricCard
            title="SEO Health Score"
            value={overallScore !== null ? `${overallScore} / 100` : "—"}
            subValue={ratingInfo.label}
            change={overallScore ? { value: ratingInfo.label, trend: overallScore >= 75 ? "up" : "down", label: "rating" } : undefined}
            rightVisual={<ScoreRing score={overallScore} size="sm" showRating={false} />}
          />

          {/* Card 2: Total Projects */}
          <MetricCard
            title="Active SEO Projects"
            value={totalProjects}
            subValue="100% Monitored"
            change={totalProjects > 0 ? { value: `${totalProjects} active`, trend: "neutral", label: "domains" } : undefined}
            icon={<FolderKanban className="w-5 h-5 text-blue-600" />}
            variant="blue"
          />

          {/* Card 3: Total Crawled Pages */}
          <MetricCard
            title="Total Crawled Pages"
            value={totalPages.toLocaleString()}
            subValue="HTML Pages Audited"
            change={totalPages > 0 ? { value: `+${totalPages}`, trend: "up", label: "indexed" } : undefined}
            icon={<FileText className="w-5 h-5 text-emerald-600" />}
            variant="emerald"
          />

          {/* Card 4: Total Issues */}
          <MetricCard
            title="Detected SEO Issues"
            value={totalIssues}
            subValue={`${severityCounts.critical || 0} Critical • ${severityCounts.high || 0} High`}
            change={totalIssues > 0 ? { value: `${severityCounts.critical || 0} critical`, trend: "down", label: "urgent fix" } : undefined}
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
            variant="amber"
          />
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: SEO Score Trend */}
          <Card className="lg:col-span-2 p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">SEO Score Trend</h3>
                <p className="text-xs text-slate-500">Historical performance across audit cycles</p>
              </div>
              <Link href="/seo/reports">
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                  View Reports <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {summary?.score_trend && summary.score_trend.length > 0 ? (
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-4 border border-slate-100 rounded-xl bg-slate-50/50">
                {summary.score_trend.map((point, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-bold font-mono text-slate-700">{point.score}</span>
                    <div
                      className="w-full max-w-[36px] bg-blue-600 rounded-t-md transition-all duration-500 hover:bg-blue-700"
                      style={{ height: `${Math.max(15, (point.score / 100) * 160)}px` }}
                    />
                    <span className="text-[10px] text-slate-500 font-medium truncate">{point.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Globe className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">No scan history recorded yet</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5 mb-3">
                  Run your first website audit to plot score progressions and health trends.
                </p>
                <Link href="/seo/projects">
                  <Button size="sm" variant="primary">Launch Audit</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Right 1 Col: Crawl Overview Breakdown */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Crawl Overview</h3>
              <span className="text-xs text-slate-500 font-mono">
                {summary?.crawl_overview?.crawled || totalPages} Pages
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 font-medium">Crawled & Audited</span>
                </div>
                <span className="font-bold font-mono text-slate-900">
                  {summary?.crawl_overview?.crawled || totalPages}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-700 font-medium">Discovered Links</span>
                </div>
                <span className="font-bold font-mono text-slate-900">
                  {summary?.crawl_overview?.discovered || totalPages}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700 font-medium">Skipped (Robots.txt)</span>
                </div>
                <span className="font-bold font-mono text-slate-900">
                  {summary?.crawl_overview?.skipped || 0}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-700 font-medium">Failed / Errors</span>
                </div>
                <span className="font-bold font-mono text-slate-900">
                  {summary?.crawl_overview?.failed || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Phase 4: SEO Optimization Progress & Action Center Widget */}
        {optSummary && optSummary.total_actions > 0 && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-xl text-white space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Phase 4 Optimization
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-emerald-400" />
                    Optimization & Action Progress
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {optSummary.fixed_actions} of {optSummary.total_actions} recommendations completed ({optSummary.optimization_progress}% progress).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl px-3.5 py-2 text-right">
                  <div className="text-[11px] text-purple-300 font-medium flex items-center gap-1 justify-end">
                    <TrendingUp className="w-3.5 h-3.5" /> Recoverable Impact
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    +{optSummary.estimated_seo_impact} pts (Potential: {optSummary.potential_seo_score}/100)
                  </div>
                </div>

                <Link
                  href="/seo/actions"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  View Action Center →
                </Link>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {optSummary.category_breakdown.map((cat) => (
                <div key={cat.category} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{cat.category}</span>
                    <span className="text-emerald-400 font-bold">{cat.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.progress_percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">
                    {cat.fixed_actions} / {cat.total_actions} fixed
                  </div>
                </div>
              ))}
            </div>

            {/* Top 3 High Priority Opportunities */}
            {optSummary.top_opportunities.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Top Prioritized Opportunities</span>
                  <Link href="/seo/actions" className="text-emerald-400 hover:text-emerald-300 text-xs font-medium">
                    View All {optSummary.total_actions} Actions →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {optSummary.top_opportunities.slice(0, 3).map((opp) => (
                    <Link
                      key={opp.id}
                      href="/seo/actions"
                      className="p-3 bg-slate-950/70 hover:bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition block"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          {opp.priority}
                        </span>
                        <span className="text-xs font-bold text-purple-400">+{opp.estimated_impact} pts</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 mt-2 line-clamp-1">{opp.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{opp.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Issues and Recent Scans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Issues Card */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Top Detected Issues</h3>
              <Link href="/seo/issues">
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                  View All Issues <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {summary?.top_issues && summary.top_issues.length > 0 ? (
              <div className="space-y-2.5">
                {summary.top_issues.map((issue, idx) => (
                  <Link
                    key={idx}
                    href="/seo/issues"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between transition-colors block"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          issue.severity === "critical"
                            ? "bg-rose-600"
                            : issue.severity === "high"
                            ? "bg-amber-600"
                            : "bg-blue-600"
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {issue.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2">
                      {issue.affected_pages} {issue.affected_pages === 1 ? "page" : "pages"}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">No Critical SEO Issues</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  All audited pages adhere to baseline technical standards.
                </p>
              </div>
            )}
          </Card>

          {/* Monitored Projects Summary */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Monitored Websites</h3>
              <Link href="/seo/projects">
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                  Manage Projects <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-2.5">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/seo/projects/${p.id}`}
                        className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate block"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {p.domain}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {p.latest_scan?.overall_score !== undefined && p.latest_scan?.overall_score !== null ? (
                        <ScoreRing score={p.latest_scan.overall_score} size="sm" showRating={false} />
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No Scan</span>
                      )}
                      <Link href={`/seo/projects/${p.id}`}>
                        <Button size="sm" variant="secondary">Open</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <FolderKanban className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">No Projects Configured</p>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                  Register your first website domain to begin automated auditing.
                </p>
                <Link href="/seo/projects">
                  <Button size="sm" variant="primary">+ Add Project</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Score Calculation Explanation Modal */}
        {isScoreModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">How is my SEO score calculated?</h3>
                    <p className="text-[11px] text-slate-500">SeoSensing Deterministic Diagnostic Model</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsScoreModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                <p>
                  The overall SEO Health Score (0–100) is a weighted composite of four deterministic technical categories:
                </p>

                <div className="grid grid-cols-2 gap-2.5 font-medium">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-900 font-bold">
                      <span>Technical SEO</span>
                      <span className="text-blue-600 font-mono">30%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">HTTP status, SSL/HTTPS, server response time, mixed content</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-900 font-bold">
                      <span>Indexability</span>
                      <span className="text-blue-600 font-mono">25%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Robots.txt, meta robots, canonical URLs, XML sitemaps</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-900 font-bold">
                      <span>Metadata & Content</span>
                      <span className="text-blue-600 font-mono">25%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Titles, descriptions, H1 tags, thin content, duplicate content</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-900 font-bold">
                      <span>Link Health</span>
                      <span className="text-blue-600 font-mono">20%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Broken links, redirect loops, orphan pages, crawl depth</p>
                  </div>
                </div>

                {/* Score Rating Tiers */}
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">Rating Tiers:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                    <span className="text-emerald-700"><strong>90–100:</strong> Excellent</span>
                    <span className="text-blue-700"><strong>75–89:</strong> Good</span>
                    <span className="text-amber-700"><strong>50–74:</strong> Needs Fixes</span>
                    <span className="text-orange-700"><strong>25–49:</strong> Poor</span>
                    <span className="text-rose-700"><strong>0–24:</strong> Critical</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  Note: This score is a SeoSensing diagnostic health metric designed to prioritize crawlability and technical compliance. It is not an official Google ranking score.
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button size="sm" variant="primary" onClick={() => setIsScoreModalOpen(false)}>
                  Got It
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
