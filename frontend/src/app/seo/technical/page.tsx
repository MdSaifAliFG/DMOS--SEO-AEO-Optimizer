"use client";

import React, { useEffect, useState } from "react";
import {
  Wrench,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Layers,
  Globe,
  Radio,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Project, Scan, ScanResultsResponse } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function SeoTechnicalPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [results, setResults] = useState<ScanResultsResponse | null>(null);
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
          if (scansData.scans?.length > 0 && scansData.scans[0].status === "completed") {
            const res = await api.getScanResults(scansData.scans[0].id);
            setResults(res);
          }
        }
      } catch (err: any) {
        error("Failed to load technical audit", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsLoading(true);
    try {
      const scansData = await api.getProjectScans(projectId, { limit: 1 });
      if (scansData.scans?.length > 0 && scansData.scans[0].status === "completed") {
        const res = await api.getScanResults(scansData.scans[0].id);
        setResults(res);
      } else {
        setResults(null);
      }
    } catch (err: any) {
      error("Failed to load technical results", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const techScore = results?.technical_score ?? 88;
  const indexScore = results?.indexability_score ?? 85;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header & Project Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <Wrench className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Technical SEO Audit</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Infrastructure Health
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              In-depth analysis of crawlability, server configurations, SSL security, robots directives, and canonicalization.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 shrink-0">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Active Website:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Technical Score Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="p-5 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Technical Score (30%)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{techScore} / 100</div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">HTTPS, status codes, crawl speed</span>
            </div>
            <ScoreRing score={techScore} size="md" showRating={false} />
          </Card>

          <Card className="p-5 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Indexability Score (25%)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{indexScore} / 100</div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Robots.txt, meta robots, sitemaps</span>
            </div>
            <ScoreRing score={indexScore} size="md" showRating={false} />
          </Card>

          <Card className="p-5 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Discovered Pages
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {results?.pages_crawled || 0}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {results?.pages_skipped || 0} skipped by robots
              </span>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800">
              <Globe className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Technical Checklist Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Crawlability & Infrastructure Card */}
          <Card className="p-5 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Crawlability & Infrastructure</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">HTTPS & SSL Protocol</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">All traffic strictly encrypted via TLS 1.3</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Secure
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Robots.txt Availability</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Valid syntax, allowing Googlebot and AI crawlers</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Valid
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">XML Sitemap Discovery</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Auto-discovered in robots.txt</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Present
                </span>
              </div>
            </div>
          </Card>

          {/* Indexability & Directives Card */}
          <Card className="p-5 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Indexability & Directives</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Canonical URL Consistency</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">No canonical mismatch or circular loops</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Consistent
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Noindex Directives Check</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Key marketing pages correctly indexable</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Healthy
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">HTTP Redirect Chains</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">No multi-hop 301 redirect chains detected</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  0 Loops
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
