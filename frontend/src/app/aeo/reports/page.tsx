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
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function AeoReportsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAeoProjects({ limit: 50 }).then((data) => {
      setProjects(data.projects || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">AEO Intelligence Reports ({projects.length})</h2>
            <p className="text-xs text-slate-500">
              Historical AI answer engine performance reports, citation frequency logs, and shareable summaries.
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Brand Profile</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4 text-center">AEO Score</th>
                  <th className="py-3 px-4 text-center">Tracked Prompts</th>
                  <th className="py-3 px-4 text-center">Citations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading AEO reports...</p>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <EmptyState
                        icon={<FileBarChart className="w-6 h-6 text-purple-500" />}
                        title="No AEO Reports Available"
                        description="Create an AEO project and track prompts to generate AI visibility reports."
                        actionLabel="Go to AEO Projects"
                        onAction={() => (window.location.href = "/aeo/projects")}
                      />
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {proj.name}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {proj.domain}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <ScoreRing score={proj.aeo_score ?? 78} size="sm" showRating={false} />
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold">
                        {proj.questions_count}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-purple-700">
                        {proj.citations_count}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/aeo/projects/${proj.id}`}>
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
