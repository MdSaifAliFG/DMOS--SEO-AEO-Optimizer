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
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Project, Scan } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function SeoReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projData = await api.getProjects({ limit: 20 });
        setProjects(projData.projects || []);

        if (projData.projects?.length > 0) {
          const allScans: Scan[] = [];
          for (const p of projData.projects.slice(0, 5)) {
            const scData = await api.getProjectScans(p.id, { limit: 5 });
            if (scData.scans) allScans.push(...scData.scans);
          }
          setScans(allScans);
        }
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">SEO Audit Reports ({scans.length})</h2>
            <p className="text-xs text-slate-500">
              Audit log archive with score breakdowns, technical health diagnostics, and historical records.
            </p>
          </div>
        </div>

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
                        {scan.overall_score !== null ? (
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
