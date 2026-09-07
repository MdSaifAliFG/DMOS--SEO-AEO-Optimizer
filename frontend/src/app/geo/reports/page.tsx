"use client";

import React, { useEffect, useState } from "react";
import {
  FileBarChart,
  Printer,
  Download,
  Award,
  CheckCircle2,
  AlertTriangle,
  Users,
  Quote,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoReport } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoReportsPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [report, setReport] = useState<GeoReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchReport(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchReport = async (projectId: string) => {
    setIsLoading(true);
    try {
      const rep = await api.getGeoReport(projectId);
      setReport(rep);
    } catch (err) {
      error("Failed to load executive report.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header (hidden in print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <FileBarChart className="w-3.5 h-3.5" />
              Executive Audit &amp; Strategy
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Executive Audit Report
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Board-ready generative engine presence, authority health, and strategic optimization roadmap.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Save PDF
            </Button>

            {projects.length > 0 && (
              <select
                aria-label="Select GEO Project"
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  fetchReport(e.target.value);
                }}
                className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-medium text-slate-900 dark:text-slate-100 shadow-sm"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand_name || p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Report Content */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : !report ? (
          <EmptyState
            icon={FileBarChart}
            title="No Report Available"
            description="Select a project with completed generative analysis to view the executive report."
          />
        ) : (
          <div className="space-y-6 print:space-y-4 print:text-black">
            {/* Executive Summary Card */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-linear-to-br from-amber-500/5 via-transparent to-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                    Official GEO Audit
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Generative Engine Optimization Status Report
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    Generated on {new Date(report.generated_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <Award className="w-8 h-8 text-amber-500" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {report.geo_score !== null ? `${report.geo_score}/100` : "Awaiting Analysis"}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                      {report.score_label || "Baseline"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {report.executive_summary}
              </div>
            </Card>

            {/* Factor Scores Grid */}
            <Card className="p-5 border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Core Pillar Scores
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                {[
                  { label: "AI Visibility", val: report.ai_visibility, weight: "20%" },
                  { label: "Recommendation", val: report.recommendation_visibility, weight: "15%" },
                  { label: "Citation Health", val: report.citation_health, weight: "15%" },
                  { label: "Entity Clarity", val: report.entity_clarity, weight: "15%" },
                  { label: "Extractability", val: report.content_extractability, weight: "10%" },
                  { label: "AI Crawlers", val: report.technical_accessibility, weight: "10%" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-1"
                  >
                    <span className="text-[11px] text-slate-500 block truncate">{f.label}</span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {f.val}/100
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Weight {f.weight}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Strategic Strengths
                </h3>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  {report.top_strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Strategic Vulnerabilities
                </h3>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  {report.top_weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Prioritized Recommendations */}
            {report.top_recommendations?.length > 0 && (
              <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Executive Optimization Action Plan
                </h3>
                <div className="space-y-2">
                  {report.top_recommendations.map((rec: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                          {rec.priority?.toUpperCase()}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {rec.title}
                        </span>
                      </div>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        +{rec.impact} pts (EST.)
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
