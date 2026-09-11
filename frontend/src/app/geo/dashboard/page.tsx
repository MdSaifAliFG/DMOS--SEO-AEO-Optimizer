"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  HelpCircle,
  Quote,
  Eye,
  ArrowRight,
  Plus,
  Cpu,
  Boxes,
  Users,
  AlertTriangle,
  ListTodo,
  Play,
  RefreshCw,
  Award,
  Globe,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoDashboardData, GeoProject, GeoAnalysisJob } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoDashboardPage() {
  const [data, setData] = useState<GeoDashboardData | null>(null);
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisJob, setAnalysisJob] = useState<GeoAnalysisJob | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New project form
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");

  const { success, error } = useToast();

  const fetchProjectsAndDashboard = async (projId?: string) => {
    setIsLoading(true);
    try {
      const projRes = await api.getGeoProjects();
      const projs = projRes.projects || [];
      setProjects(projs);

      const activeId = projId || (projs.length > 0 ? projs[0].id : "");
      if (activeId) {
        setSelectedProjectId(activeId);
        const dash = await api.getGeoDashboard(activeId);
        setData(dash);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndDashboard();
  }, []);

  const handleProjectChange = async (newId: string) => {
    setSelectedProjectId(newId);
    setIsLoading(true);
    try {
      const dash = await api.getGeoDashboard(newId);
      setData(dash);
    } catch (err) {
      error("Failed to load dashboard for project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedProjectId) return;
    setIsAnalyzing(true);
    try {
      const job = await api.triggerGeoAnalysis({ project_id: selectedProjectId });
      setAnalysisJob(job);
      success("GEO analysis started. Gathering live generative signals across engines...");

      const pollInterval = setInterval(async () => {
        try {
          const status = await api.getGeoAnalysisStatus(job.id);
          setAnalysisJob(status);
          if (
            status.status === "completed" ||
            status.status === "partial" ||
            status.status === "failed"
          ) {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            if (status.status === "failed") {
              error("GEO analysis failed", status.error_message || "Execution error");
            } else {
              success("GEO Analysis Complete", "Generative presence, citations, and scores updated.");
              await handleProjectChange(selectedProjectId);
            }
            setTimeout(() => setAnalysisJob(null), 4000);
          }
        } catch {
          clearInterval(pollInterval);
          setIsAnalyzing(false);
        }
      }, 900);
    } catch (err: any) {
      error("Failed to start analysis.", err.message);
      setIsAnalyzing(false);
      setAnalysisJob(null);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) return;
    try {
      const newProj = await api.createGeoProject({
        name,
        domain,
        brand_name: brandName || name,
        industry,
      });
      success("GEO project created!");
      setIsCreateOpen(false);
      setName("");
      setDomain("");
      setBrandName("");
      setIndustry("");
      fetchProjectsAndDashboard(newProj.id);
    } catch (err) {
      error("Failed to create GEO project.");
    }
  };

  if (isLoading && !data) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 text-white shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Generative Engine Optimization (GEO)
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {data?.project?.brand_name || "Generative Visibility Dashboard"}
            </h1>
            <p className="text-xs text-slate-300">
              Measure and optimize AI recommendations, citations, extractability, and entity presence.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-amber-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Project
            </Button>

            {selectedProjectId && (
              <Button
                size="sm"
                onClick={handleRunAnalysis}
                isLoading={isAnalyzing}
                className="bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                leftIcon={<Play className="w-3.5 h-3.5" />}
              >
                Run GEO Analysis
              </Button>
            )}
          </div>
        </div>

        {/* Live Analysis Progress Card */}
        {analysisJob && (
          <Card className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-slate-900 border-amber-500/30 text-slate-900 dark:text-white shadow-lg animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Live GEO Scan &amp; Generative Intelligence Engine
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                {analysisJob.progress}% — {analysisJob.current_step}
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(5, analysisJob.progress)}%` }}
              ></div>
            </div>
          </Card>
        )}

        {/* Empty state if no projects */}
        {projects.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-12 h-12 text-amber-500" />}
            title="No GEO Project Found"
            description="Create a GEO project to start measuring generative search visibility and AI recommendations."
            action={
              <Button
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create First GEO Project
              </Button>
            }
          />
        ) : (
          <>
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Primary GEO Score */}
              <Card className="p-5 border-amber-200/80 bg-white dark:bg-[#0f172a] dark:border-amber-900/40 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Overall GEO Score
                  </span>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {data?.geo_score !== null && data?.geo_score !== undefined ? data.geo_score : "—"}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60">
                    {data?.score_label || "Awaiting Analysis"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Confidence: {data?.confidence || "Awaiting Analysis"} ({data?.data_coverage || 0}%)
                  </span>
                </div>
              </Card>

              {/* AI Visibility */}
              <Card className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    AI Visibility (Mention Rate)
                  </span>
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {data?.mention_rate ? `${data.mention_rate}%` : "Awaiting Analysis"}
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Percentage of tested discovery queries where brand is mentioned.
                </p>
              </Card>

              {/* Recommendation Rate */}
              <Card className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Recommendation Rate
                  </span>
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {data?.recommendation_rate ? `${data.recommendation_rate}%` : "Awaiting Analysis"}
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Queries resulting in direct endorsement as top solution.
                </p>
              </Card>

              {/* Own Citation Rate */}
              <Card className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Own Citation Rate
                  </span>
                  <Quote className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {data?.own_citation_rate ? `${data.own_citation_rate}%` : "Awaiting Analysis"}
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Proportion of AI citations linking to your official domain.
                </p>
              </Card>
            </div>

            {/* 8 Component Scores Matrix */}
            <Card className="p-5 sm:p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                8-Dimension Deterministic GEO Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { label: "Visibility (20%)", score: data?.visibility_score },
                  { label: "Recommendation (15%)", score: data?.recommendation_score },
                  { label: "Citation (15%)", score: data?.citation_score },
                  { label: "Entity (15%)", score: data?.entity_score },
                  { label: "Content (10%)", score: data?.content_score },
                  { label: "Technical (10%)", score: data?.technical_score },
                  { label: "Authority (10%)", score: data?.authority_score },
                  { label: "Consistency (5%)", score: data?.consistency_score },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] font-medium text-slate-400 block truncate" title={item.label}>
                      {item.label}
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block">
                      {item.score !== null && item.score !== undefined ? `${item.score}` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Two-Column Detail Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Engine Status Breakdown */}
              <Card className="p-5 sm:p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-500" />
                    Generative Engine Parity
                  </h3>
                  <Link href="/geo/answers" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                    View Answers →
                  </Link>
                </div>

                <div className="space-y-3">
                  {data?.provider_breakdown?.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          {p.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Search: {p.supports_search ? "Yes" : "No"} | Citations: {p.supports_citations ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          p.is_configured
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Competitor Share of Voice */}
              <Card className="p-5 sm:p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    Competitive Share of Voice
                  </h3>
                  <Link href="/geo/competitors" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                    Competitor Intel →
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        {data?.project?.brand_name} (Your Brand)
                      </span>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400">Market mentions in generative queries</p>
                    </div>
                    <span className="text-sm font-extrabold text-amber-800 dark:text-amber-300">
                      {data?.share_of_voice || 0}% SOV
                    </span>
                  </div>

                  {data?.competitor_share_of_voice?.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{comp.name}</span>
                        <p className="text-[10px] text-slate-400">Gap: {comp.geo_gap > 0 ? `+${comp.geo_gap}` : comp.geo_gap} pts</p>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {comp.share_of_voice}% SOV
                      </span>
                    </div>
                  ))}

                  {(!data?.competitor_share_of_voice || data.competitor_share_of_voice.length === 0) && (
                    <p className="text-xs text-slate-400 text-center py-4">No competitors detected yet. Add competitors in Settings.</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Top Prioritized Issues & Top Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Issues */}
              <Card className="p-5 sm:p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Top GEO Issues
                  </h3>
                  <Link href="/geo/actions?tab=issues" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                    All Issues →
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {data?.top_issues?.map((iss) => (
                    <div
                      key={iss.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {iss.issue_code}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">{iss.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{iss.description}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                          iss.severity === "critical"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : iss.severity === "high"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        }`}
                      >
                        {iss.severity}
                      </span>
                    </div>
                  ))}

                  {(!data?.top_issues || data.top_issues.length === 0) && (
                    <p className="text-xs text-slate-400 text-center py-4">No critical issues detected. Run analysis to audit.</p>
                  )}
                </div>
              </Card>

              {/* Top Recommendations */}
              <Card className="p-5 sm:p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-emerald-500" />
                    Top Action Opportunities
                  </h3>
                  <Link href="/geo/actions" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                    Action Center →
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {data?.top_recommendations?.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{rec.title}</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{rec.how_to_fix}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 shrink-0">
                        +{rec.estimated_impact} pts
                      </span>
                    </div>
                  ))}

                  {(!data?.top_recommendations || data.top_recommendations.length === 0) && (
                    <p className="text-xs text-slate-400 text-center py-4">No open action items. Run analysis to generate recommendations.</p>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Modal: Create Project */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create GEO Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Brand Global GEO"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Domain</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g., yourcompany.com"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., YourBrand"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., B2B SaaS, E-Commerce"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-3">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
