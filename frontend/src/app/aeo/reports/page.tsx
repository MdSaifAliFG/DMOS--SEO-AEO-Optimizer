"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileBarChart,
  Sparkles,
  Download,
  Calendar,
  ExternalLink,
  ArrowRight,
  Printer,
  Bot,
  Globe,
  Quote,
  Eye,
  CheckCircle2,
  Building2,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoReportsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReportProject, setActiveReportProject] = useState<any | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const { success, error } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAeoProjects({ limit: 50 });
      setProjects(data.projects || []);
    } catch (err: any) {
      error("Failed to load projects", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleExportCsv = (projectId: string, projectName: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const downloadUrl = `${backendUrl}/aeo/reports/${projectId}/export-csv`;
    window.open(downloadUrl, "_blank");
    success("CSV Export Started", `Downloading report for ${projectName}`);
  };

  const handleOpenReportModal = async (project: AeoProject) => {
    setIsLoadingReport(true);
    try {
      const rep = await api.getAeoReport(project.id);
      setActiveReportProject(rep || { project });
    } catch (err: any) {
      error("Failed to load detailed report", err.message);
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">AEO Intelligence Reports ({projects.length})</h2>
            </div>
            <p className="text-xs text-slate-500">
              Generate executive-ready audit reports, brand prominence summaries, and CSV data exports.
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <Card className="border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-5">Brand Name</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4 text-center">AEO Score</th>
                  <th className="py-3 px-4 text-center">Tracked Prompts</th>
                  <th className="py-3 px-4 text-center">Citations</th>
                  <th className="py-3 px-4">Last Analyzed</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading AEO reports...</p>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <FileBarChart className="w-8 h-8 text-purple-400 mx-auto" />
                        <p className="text-sm font-semibold text-slate-800">No AEO Projects Available</p>
                        <p className="text-xs text-slate-400">Create an AEO project to generate comprehensive intelligence reports.</p>
                        <Link href="/aeo/projects">
                          <Button size="sm" variant="primary" className="bg-purple-600 text-white">
                            Go to AEO Projects
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {proj.name}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {proj.domain}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-purple-950 px-2.5 py-1 bg-purple-50 rounded-full border border-purple-200">
                          {proj.aeo_score !== null && proj.aeo_score !== undefined ? `${proj.aeo_score}/100` : "Untested"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {proj.questions_count}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-purple-700">
                        {proj.citations_count}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {proj.last_analyzed_at ? formatTimeAgo(proj.last_analyzed_at) : "Never"}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportCsv(proj.id, proj.name)}
                            leftIcon={<Download className="w-3 h-3" />}
                            className="text-xs h-7"
                          >
                            CSV Export
                          </Button>

                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenReportModal(proj)}
                            leftIcon={<Eye className="w-3 h-3" />}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-7"
                          >
                            View Report
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Comprehensive Report Viewer */}
        {activeReportProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                      AEO Intelligence Audit
                    </span>
                    {activeReportProject.generated_at && (
                      <span className="text-xs text-slate-400">Generated {formatDate(activeReportProject.generated_at)}</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {activeReportProject.project?.name || "Project Report"} ({activeReportProject.project?.domain || ""})
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.print()} leftIcon={<Printer className="w-3.5 h-3.5" />}>
                    Print
                  </Button>
                  <button onClick={() => setActiveReportProject(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Score Breakdown Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-purple-700 block">Overall Score</span>
                  <span className="text-2xl font-black text-purple-950">
                    {activeReportProject.scores?.overall_score ?? activeReportProject.project?.aeo_score ?? "—"}/100
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Mention Rate</span>
                  <span className="text-xl font-bold text-slate-800">
                    {activeReportProject.scores?.mention_score ?? activeReportProject.visibility?.mention_score ?? 0}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Citation Share</span>
                  <span className="text-xl font-bold text-slate-800">
                    {activeReportProject.scores?.citation_score ?? activeReportProject.visibility?.citation_score ?? 0}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Query Coverage</span>
                  <span className="text-xl font-bold text-slate-800">
                    {activeReportProject.scores?.coverage_score ?? activeReportProject.visibility?.coverage_score ?? 0}%
                  </span>
                </div>
              </div>

              {/* Top Citations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Cited Source Domains</h4>
                {activeReportProject.top_citations && activeReportProject.top_citations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeReportProject.top_citations.map((c: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{c.domain}</span>
                        <span className="text-[11px] text-purple-700 font-bold">{c.count} links</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-lg">No citation sources recorded yet.</p>
                )}
              </div>

              {/* Competitor Voice Share */}
              {activeReportProject.competitors && activeReportProject.competitors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Competitor Presence</h4>
                  <div className="space-y-2">
                    {activeReportProject.competitors.map((comp: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{comp.name || comp}</span>
                        <span className="text-slate-500">{comp.mentions || 0} mentions</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => setActiveReportProject(null)}>
                  Close Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
