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
    link.setAttribute("download", `dmos_seo_reports_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-cyan-900 to-slate-900 text-white shadow-md border border-sky-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
                <FileSpreadsheet className="w-5 h-5 text-sky-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">SEO Audit Reports ({scans.length})</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/20">
                Audit Archive
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-2xl">
              Audit log archive with score breakdowns, technical health diagnostics, and historical records.
            </p>
          </div>

          {scans.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={handleExportCSV}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="bg-sky-500 hover:bg-sky-400 text-white border-0 shadow-sm"
              >
                Export All Scans CSV
              </Button>
            </div>
          )}
        </div>

        {/* Phase 4: Executive Optimization Summary */}
        {optSummary && optSummary.total_actions > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Executive Optimization Summary</h3>
              </div>
              <Link href="/seo/actions" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                <ListTodo className="w-3.5 h-3.5" /> Open Action Center →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Total Actions</div>
                <div className="text-xl font-bold text-white mt-1">{optSummary.total_actions}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{optSummary.fixed_actions} resolved ({optSummary.optimization_progress}%)</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-rose-500/20">
                <div className="text-rose-400 font-semibold">Critical / High</div>
                <div className="text-xl font-bold text-rose-400 mt-1">
                  {optSummary.critical_actions + optSummary.high_priority_actions}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Immediate ranking impact</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-purple-500/20">
                <div className="text-purple-400 font-semibold">Recoverable Impact</div>
                <div className="text-xl font-bold text-purple-300 mt-1">+{optSummary.estimated_seo_impact} pts</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Potential score: {optSummary.potential_seo_score}/100</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/20">
                <div className="text-emerald-400 font-semibold">Current Health</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{optSummary.current_seo_score ?? "—"}/100</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Latest audit score</div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
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
