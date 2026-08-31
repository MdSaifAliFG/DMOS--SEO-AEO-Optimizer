"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Project, SEOPage } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function SeoContentPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { error } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projData = await api.getProjects({ limit: 50 });
        setProjects(projData.projects || []);

        if (projData.projects?.length > 0) {
          const firstProjId = projData.projects[0].id;
          setSelectedProjectId(firstProjId);

          const scansData = await api.getProjectScans(firstProjId, { limit: 1 });
          if (scansData.scans?.length > 0) {
            const pagesData = await api.getScanPages(scansData.scans[0].id, { page_size: 50 });
            setPages(pagesData.pages || []);
          }
        }
      } catch (err: any) {
        error("Failed to load content audit", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = pages.length;
  const missingTitles = pages.filter((p) => !p.title || p.title.trim().length === 0).length;
  const missingDescriptions = pages.filter((p) => !p.meta_description || p.meta_description.trim().length === 0).length;
  const missingH1 = pages.filter((p) => p.h1_count === 0).length;
  const duplicateH1 = pages.filter((p) => p.h1_count > 1).length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Content & Metadata Optimization</h2>
            <p className="text-xs text-slate-500">
              Audit on-page title tags, meta descriptions, heading hierarchies, and word count distributions.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Active Website:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Metadata Score (25%)"
            value="85 / 100"
            subValue="On-Page Tags"
            rightVisual={<ScoreRing score={85} size="sm" showRating={false} />}
          />

          <MetricCard
            title="Missing Title Tags"
            value={missingTitles}
            subValue="0% of crawled pages"
            change={missingTitles > 0 ? { value: `${missingTitles} missing`, trend: "down" } : undefined}
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            variant="blue"
          />

          <MetricCard
            title="Missing Descriptions"
            value={missingDescriptions}
            subValue="Snippet optimization"
            change={missingDescriptions > 0 ? { value: `${missingDescriptions} missing`, trend: "down" } : undefined}
            icon={<BookOpen className="w-5 h-5 text-amber-600" />}
            variant="amber"
          />

          <MetricCard
            title="Heading Anomalies (H1)"
            value={missingH1 + duplicateH1}
            subValue={`${missingH1} missing, ${duplicateH1} multiple`}
            icon={<Layers className="w-5 h-5 text-purple-600" />}
            variant="purple"
          />
        </div>

        {/* Content Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              On-Page Content Checklist
            </h3>
            <span className="text-xs text-slate-500 font-mono">{totalPages} Pages Analyzed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Page URL</th>
                  <th className="py-3 px-4">Title Tag</th>
                  <th className="py-3 px-4 text-center">Title Length</th>
                  <th className="py-3 px-4 text-center">H1 Count</th>
                  <th className="py-3 px-4 text-center">Word Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      No crawled pages available. Run an audit in SEO Projects.
                    </td>
                  </tr>
                ) : (
                  pages.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800 truncate max-w-[200px]">
                        {p.url}
                      </td>

                      <td className="py-3 px-4 max-w-sm truncate text-slate-900 font-medium">
                        {p.title || <span className="text-rose-600 italic">Missing Title</span>}
                      </td>

                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            (p.title?.length || 0) >= 30 && (p.title?.length || 0) <= 60
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {p.title?.length || 0} chars
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] ${
                            p.h1_count === 1
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {p.h1_count}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                        {p.word_count.toLocaleString()}
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
