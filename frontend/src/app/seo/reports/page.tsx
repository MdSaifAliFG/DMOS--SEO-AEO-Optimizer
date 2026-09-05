"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Download,
  ExternalLink,
  Calendar,
  Globe,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  Sparkles,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Project, Scan, SeoOptimizationSummary } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function SeoReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [optSummary, setOptSummary] = useState<SeoOptimizationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projData = await api.getProjects({ limit: 20 });
        setProjects(projData.projects || []);

        if (projData.projects?.length > 0) {
          const firstProjId = projData.projects[0].id;
          const [allScans, optData] = await Promise.all([
            Promise.all(
              projData.projects.slice(0, 10).map((p) => api.getProjectScans(p.id, { limit: 5 }))
            ),
            api.getSeoActionsSummary(firstProjId).catch(() => null),
          ]);

          const combinedScans: Scan[] = [];
          for (const scData of allScans) {
            if (scData.scans) combinedScans.push(...scData.scans);
          }
          setScans(combinedScans);
          setOptSummary(optData);
        }
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (scans.length === 0) return;
    const headers = "Scan ID,Target URL,Date,Overall Score,Technical Score,Indexability Score,Metadata Score,Links Score,Crawled Pages,Issues Count\n";
    const rows = scans
      .map((s) =>
        `"${s.id}","${s.target_url}","${s.created_at}",${s.overall_score ?? ""},${s.technical_score ?? ""},${s.indexability_score ?? ""},${s.metadata_score ?? ""},${s.links_score ?? ""},${s.pages_crawled},${s.issues_count}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `seosensing_reports_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">SEO Audit Reports ({scans.length})</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Audit Archive
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Audit log archive with score breakdowns, technical health diagnostics, and historical records.
            </p>
          </div>

          {scans.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="primary"
                onClick={handleExportCSV}
                leftIcon={<Download className="w-4 h-4" />}
                className="shadow-xs"
              >
                Export All Scans CSV
              </Button>
            </div>
          )}
        </div>

        {/* Phase 4: Executive Optimization Summary */}
        {optSummary && optSummary.total_actions > 0 && (
          <Card className="p-4 sm:p-6 border-slate-200 bg-white shadow-xs rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Executive Optimization Summary</h3>
              </div>
              <Link href="/seo/actions" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                <ListTodo className="w-3.5 h-3.5" /> Open Action Center →
              </Link>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 font-medium">Total Actions</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{optSummary.total_actions}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{optSummary.fixed_actions} resolved ({optSummary.optimization_progress}%)</div>
              </div>

              <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200 shadow-2xs">
                <div className="text-rose-700 font-semibold">Critical / High</div>
                <div className="text-xl font-bold text-rose-700 mt-1">
                  {optSummary.critical_actions + optSummary.high_priority_actions}
                </div>
                <div className="text-[10px] text-rose-600/80 mt-0.5">Immediate ranking impact</div>
              </div>

              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 shadow-2xs">
                <div className="text-blue-700 font-semibold">Recoverable Impact</div>
                <div className="text-xl font-bold text-blue-700 mt-1">+{optSummary.estimated_seo_impact} pts</div>
                <div className="text-[10px] text-blue-600/80 mt-0.5">Potential score: {optSummary.potential_seo_score}/100</div>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                <div className="text-emerald-700 font-semibold">Current Health</div>
                <div className="text-xl font-bold text-emerald-700 mt-1">{optSummary.current_seo_score ?? "—"}/100</div>
                <div className="text-[10px] text-emerald-600/80 mt-0.5">Latest audit score</div>
              </div>
            </div>
          </Card>
        )}

        {/* Reports Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Audit Target & ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-center">Overall Score</th>
                  <th className="py-3 px-4 text-center">Crawled Pages</th>
                  <th className="py-3 px-4 text-center">Issues</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading audit reports...</p>
                    </td>
                  </tr>
                ) : scans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <EmptyState
                        icon={<FileSpreadsheet className="w-6 h-6 text-slate-400" />}
                        title="No SEO Reports Generated"
                        description="Run website audits in SEO Projects to generate downloadable audit reports."
                        actionLabel="Go to Projects"
                        onAction={() => (window.location.href = "/seo/projects")}
                      />
                    </td>
                  </tr>
                ) : (
                  scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block truncate max-w-sm">
                          {scan.target_url}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Scan ID: {scan.id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {formatDate(scan.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {scan.overall_score !== null && scan.overall_score !== undefined ? (
                          <ScoreRing score={scan.overall_score} size="sm" showRating={false} />
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Pending</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold">
                        {scan.pages_crawled}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-amber-700">
                        {scan.issues_count}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/seo/projects/${scan.project_id}?scanId=${scan.id}`}>
                          <Button size="sm" variant="secondary">
                            View Report
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
