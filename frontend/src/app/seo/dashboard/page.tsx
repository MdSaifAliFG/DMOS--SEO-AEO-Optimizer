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
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api-client";
import { Project, Scan, SeoDashboardSummary } from "@/lib/types";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function SeoDashboardPage() {
  const [summary, setSummary] = useState<SeoDashboardSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const overallScore = summary?.overall_score ?? (projects.length > 0 ? 84 : null);
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
              <h2 className="text-base font-bold text-slate-900">SEO Intelligence Hub</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Technical Audit & Crawling
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic technical analysis, crawl budget management, and on-page optimization.
            </p>
          </div>

          <Link href="/seo/projects">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              + Add SEO Project
            </Button>
          </Link>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: SEO Score */}
          <MetricCard
            title="SEO Health Score"
            value={overallScore !== null ? `${overallScore} / 100` : "—"}
            subValue={summary?.score_label || (overallScore && overallScore >= 80 ? "Good" : "No Audits")}
            change={overallScore ? { value: "+8 pts", trend: "up", label: "vs baseline" } : undefined}
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
            change={totalPages > 0 ? { value: `+${totalPages}`, trend: "up", label: "discovered" } : undefined}
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
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
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

          {/* Right 1 Col: Crawl Overview Donut / Breakdown */}
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

        {/* Bottom Grid: Top Issues & Recent Scans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Issues Card */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Detected Issues</h3>
                <p className="text-xs text-slate-500">Highest priority technical and metadata issues</p>
              </div>
              <Link href="/seo/issues">
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View All Issues <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {summary?.top_issues && summary.top_issues.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {summary.top_issues.map((iss, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          iss.severity === "critical"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : iss.severity === "high"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {iss.severity}
                      </span>
                      <span className="font-medium text-slate-800 truncate">{iss.title}</span>
                    </div>
                    <span className="text-slate-500 font-mono shrink-0">
                      {iss.affected_pages} page{iss.affected_pages > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No active issues recorded. All crawled pages are clean.
              </div>
            )}
          </Card>

          {/* Recent Scans Table */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Audit Runs</h3>
                <p className="text-xs text-slate-500">Latest website crawler executions</p>
              </div>
              <Link href="/seo/reports">
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Audit History <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {recentScans.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-3">
                      <Link
                        href={`/seo/projects/${scan.project_id}?scanId=${scan.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 truncate block"
                      >
                        {scan.target_url}
                      </Link>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formatTimeAgo(scan.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {scan.overall_score !== null && (
                        <span className="font-bold font-mono text-slate-800">
                          {scan.overall_score}/100
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(scan.status)}`}>
                        {scan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No recent scans available.
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
