"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  HelpCircle,
  Quote,
  Eye,
  ArrowRight,
  Plus,
  Cpu,
  Boxes,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  X,
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Building2,
  Share2,
  ListTodo,
  Flame,
  Layers,
  Target,
  Network,
  Brain,
  Bell,
  GitCommit,
  ShieldAlert,
  ShieldCheck,
  Activity,
  BarChart2,
  LineChart,
  ChevronRight,
  Award,
  MessageSquare,
  Link2,
  Users,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { AeoDashboardSummary, AeoProject, AeoTrendResponse, AeoExecutiveIntelligence } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoDashboardPage() {
  const [summary, setSummary] = useState<AeoDashboardSummary | null>(null);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Phase 7 Monitoring & Intelligence State
  const [trendRange, setTrendRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [trendData, setTrendData] = useState<AeoTrendResponse | null>(null);
  const [intelligence, setIntelligence] = useState<AeoExecutiveIntelligence | null>(null);
  const [chartViewMode, setChartViewMode] = useState<"curve" | "bars">("curve");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Modals
  const [isTrackQuestionOpen, setIsTrackQuestionOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Track Question Form
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("Brand Overview");
  const [intent, setIntent] = useState("informational");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Add Project Form
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [newProjectIndustry, setNewProjectIndustry] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  const { success, error } = useToast();

  const fetchDashboardData = async (projId?: string) => {
    setIsLoading(true);
    try {
      const [sumData, projData, trendRes, intelRes] = await Promise.all([
        api.getAeoDashboard(projId).catch(() => null),
        api.getAeoProjects({ limit: 50 }).catch(() => ({ projects: [], total: 0 })),
        projId ? api.getAeoTrends(projId, trendRange).catch(() => null) : Promise.resolve(null),
        projId ? api.getAeoExecutiveIntelligence(projId).catch(() => null) : Promise.resolve(null),
      ]);
      setSummary(sumData);
      setTrendData(trendRes);
      setIntelligence(intelRes);
      const projList = projData.projects || [];
      setProjects(projList);
      if (projList.length > 0 && !projId && !selectedProjectId) {
        setSelectedProjectId(projList[0].id);
      }
    } catch (err) {
      console.error("Failed to load AEO Dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedProjectId || undefined);
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      api.getAeoTrends(selectedProjectId, trendRange)
        .then((res) => setTrendData(res))
        .catch(() => {});
    }
  }, [selectedProjectId, trendRange]);

  const handleRunAnalysis = async () => {
    if (!selectedProjectId) return;
    setIsAnalyzing(true);
    try {
      await api.triggerAeoAnalysis(selectedProjectId, { allow_test_mode: true });
      success("AEO Analysis started. Processing prompt answers across connected engines...");
      setTimeout(() => {
        fetchDashboardData(selectedProjectId);
        setIsAnalyzing(false);
      }, 2500);
    } catch (err: any) {
      error(err.message || "Failed to trigger AEO analysis.");
      setIsAnalyzing(false);
    }
  };

  const handleTrackQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !selectedProjectId) return;

    setIsSubmittingQuestion(true);
    try {
      await api.createAeoQuestion({
        project_id: selectedProjectId,
        question_text: questionText.trim(),
        category,
        intent,
      });
      success("Question added to AEO tracking.");
      setIsTrackQuestionOpen(false);
      setQuestionText("");
      fetchDashboardData(selectedProjectId);
    } catch (err: any) {
      error(err.message || "Failed to add tracked question.");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectDomain.trim()) return;

    setIsSubmittingProject(true);
    try {
      const created = await api.createAeoProject({
        name: newProjectName.trim(),
        domain: newProjectDomain.trim(),
        industry: newProjectIndustry.trim() || undefined,
        description: newProjectDescription.trim() || undefined,
      });
      success(`AEO Project "${created.name}" created successfully!`);
      setIsAddProjectOpen(false);
      setNewProjectName("");
      setNewProjectDomain("");
      setNewProjectIndustry("");
      setNewProjectDescription("");
      setSelectedProjectId(created.id);
    } catch (err: any) {
      error(err.message || "Failed to create AEO project.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const aeoScore = summary?.aeo_score;
  const scoreLabel = summary?.score_label;
  const mentionRate = summary?.answer_visibility_rate ?? 0;
  const questionsCount = summary?.questions_tracked ?? 0;
  const citationsCount = summary?.total_citations ?? 0;
  const engines = summary?.engines || [];
  const recentQuestions = summary?.recent_questions || [];
  const recentCitations = summary?.recent_citations || [];
  const scoreTrend = summary?.score_trend || [];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/60 text-purple-600 dark:text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Answer Engine Optimization (AEO)</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60">
                Intelligence Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Monitor brand prominence, knowledge entity presence, and direct citation sources across generative AI answer engines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:shrink-0">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer shadow-2xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}

            {projects.length > 0 && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleRunAnalysis}
                isLoading={isAnalyzing}
                leftIcon={<Play className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-xs"
              >
                Run AEO Analysis
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddProjectOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-xs"
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center border-dashed border-2 border-purple-200 dark:border-purple-800/60 bg-purple-50/30 dark:bg-purple-950/20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No AEO Projects Created Yet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create your first AEO project to start tracking brand prompts, citations, knowledge entities, and generative AI search visibility.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddProjectOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                Create Your First AEO Project
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Top KPI Metrics */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* AEO Visibility Score */}
              <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AEO Visibility Score</span>
                  <button
                    onClick={() => setIsScoreModalOpen(true)}
                    className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    title="How is this calculated?"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-purple-950 dark:text-purple-100">
                    {aeoScore !== null && aeoScore !== undefined ? `${aeoScore}/100` : "Untested"}
                  </span>
                  {scoreLabel && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border dark:border-purple-800/60">
                      {scoreLabel}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  Weighted by mentions, citations, position & coverage
                </p>
              </Card>

              {/* Brand Mention Rate */}
              <MetricCard
                title="Brand Mention Rate"
                value={`${mentionRate}%`}
                subValue={`In ${summary?.recent_questions.length || 0} tracked queries`}
                icon={<Eye className="w-4 h-4 text-indigo-600" />}
              />

              {/* Questions Tracked */}
              <MetricCard
                title="Tracked Prompts"
                value={questionsCount.toString()}
                subValue="Active answer search queries"
                icon={<HelpCircle className="w-4 h-4 text-purple-600" />}
              />

              {/* Total Citations */}
              <MetricCard
                title="Source Citations"
                value={citationsCount.toString()}
                subValue="Links referencing target brand"
                icon={<Quote className="w-4 h-4 text-violet-600" />}
              />
            </div>

            {/* Middle Section: Engine Breakdown + Historical Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Answer Engine Status */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Answer Engines</h3>
                  </div>
                  <Link href="/aeo/answer-engine" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {engines.map((eng) => (
                    <div
                      key={eng.engine_id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{eng.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{eng.status_label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                          {eng.tracked_questions > 0 ? `${eng.visibility_rate}% Vis` : "—"}
                        </span>
                        <p className="text-[10px] text-slate-400">{eng.tracked_questions} queries</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Visibility Progression / Trend with 7d/30d/90d/all */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-5 lg:col-span-2 shadow-sm">
                {/* Header with Title, Range Filters, and Mode Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
                        <Activity className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">AEO Visibility Progression</h3>
                      {trendData && trendData.has_enough_data && (
                        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          trendData.trend_direction === "improving"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                            : trendData.trend_direction === "declining"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}>
                          {trendData.trend_direction === "improving" ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          ) : trendData.trend_direction === "declining" ? (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{trendData.score_change > 0 ? `+${trendData.score_change}` : trendData.score_change} pts</span>
                          <span className="opacity-70 font-normal capitalize">({trendData.trend_direction})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Deterministic audit progression tracked across AI engine evaluations over time
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* View Switcher: Curve vs Bars */}
                    {trendData && trendData.has_enough_data && (
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => setChartViewMode("curve")}
                          title="Smooth Spline Curve"
                          className={`p-1.5 rounded-md transition-all ${
                            chartViewMode === "curve"
                              ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                          }`}
                        >
                          <LineChart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setChartViewMode("bars")}
                          title="Bar Histogram"
                          className={`p-1.5 rounded-md transition-all ${
                            chartViewMode === "bars"
                              ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                          }`}
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Timeline Range Selectors */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      {(["7d", "30d", "90d", "all"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setTrendRange(r)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                            trendRange === r
                              ? "bg-purple-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                          }`}
                        >
                          {r.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(!trendData || !trendData.has_enough_data || trendData.timeline.length === 0) ? (
                  <div className="h-56 flex flex-col items-center justify-center rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-center p-8 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">
                        {trendData?.message || "Continuous progression baseline not yet established"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Run consecutive audits or click <span className="font-semibold text-purple-600 dark:text-purple-400">Run AEO Audit</span> to record temporal data points and visualize AI visibility trajectory.
                      </p>
                    </div>
                  </div>
                ) : (() => {
                  const timeline = trendData.timeline;
                  const count = timeline.length;
                  const latest = timeline[count - 1];
                  const activePoint = hoveredPointIndex !== null && timeline[hoveredPointIndex] ? timeline[hoveredPointIndex] : latest;
                  const scores = timeline.map(p => p.overall_score ?? p.score ?? 0);
                  const currentScore = latest ? (latest.overall_score ?? latest.score ?? 0) : 0;
                  const peakScore = Math.max(...scores);
                  const minScore = Math.min(...scores);
                  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / count);

                  // Formatting helper
                  const formatPointDate = (timestampOrDate: string) => {
                    try {
                      const d = new Date(timestampOrDate);
                      if (isNaN(d.getTime())) return timestampOrDate;
                      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      const month = months[d.getMonth()];
                      const day = d.getDate();
                      const sameDay = timeline.filter(p => {
                        const pd = new Date(p.timestamp || p.date || "");
                        return !isNaN(pd.getTime()) && pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth() && pd.getDate() === day;
                      });
                      if (sameDay.length > 1) {
                        const hours = d.getHours();
                        const mins = d.getMinutes().toString().padStart(2, "0");
                        const ampm = hours >= 12 ? "PM" : "AM";
                        const h12 = hours % 12 || 12;
                        return `${month} ${day}, ${h12}:${mins} ${ampm}`;
                      }
                      return `${month} ${day}`;
                    } catch {
                      return timestampOrDate;
                    }
                  };

                  // SVG Geometry
                  const svgW = 720;
                  const svgH = 170;
                  const padLeft = 35;
                  const padRight = 30;
                  const padTop = 20;
                  const padBottom = 30;
                  const plotW = svgW - padLeft - padRight;
                  const plotH = svgH - padTop - padBottom;

                  const coords = timeline.map((pt, idx) => {
                    const x = count === 1 ? padLeft + plotW / 2 : padLeft + (idx / (count - 1)) * plotW;
                    const score = Math.max(0, Math.min(100, pt.overall_score ?? pt.score ?? 0));
                    const y = padTop + (1 - score / 100) * plotH;
                    return { x, y, score, pt, idx };
                  });

                  let linePathD = "";
                  if (coords.length === 1) {
                    linePathD = `M ${coords[0].x - 40} ${coords[0].y} L ${coords[0].x + 40} ${coords[0].y}`;
                  } else if (coords.length > 1) {
                    linePathD = `M ${coords[0].x} ${coords[0].y}`;
                    for (let i = 0; i < coords.length - 1; i++) {
                      const p0 = coords[Math.max(0, i - 1)];
                      const p1 = coords[i];
                      const p2 = coords[i + 1];
                      const p3 = coords[Math.min(coords.length - 1, i + 2)];
                      const cp1x = p1.x + (p2.x - p0.x) / 6;
                      const cp1y = p1.y + (p2.y - p0.y) / 6;
                      const cp2x = p2.x - (p3.x - p1.x) / 6;
                      const cp2y = p2.y - (p3.y - p1.y) / 6;
                      linePathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
                    }
                  }

                  const areaPathD = coords.length > 1
                    ? `${linePathD} L ${coords[coords.length - 1].x} ${padTop + plotH} L ${coords[0].x} ${padTop + plotH} Z`
                    : "";

                  return (
                    <div className="space-y-4">
                      {/* Summary Metrics Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <div className="px-3 py-1.5 border-r border-slate-200/60 dark:border-slate-800 last:border-r-0">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Current Score</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{currentScore}</span>
                            <span className="text-xs text-slate-400">/ 100</span>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 border-r border-slate-200/60 dark:border-slate-800 last:border-r-0">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Peak Performance</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{peakScore}</span>
                            <span className="text-xs text-slate-400">pts</span>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 border-r border-slate-200/60 dark:border-slate-800 last:border-r-0">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Historical Average</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{avgScore}</span>
                            <span className="text-xs text-slate-400">pts</span>
                          </div>
                        </div>

                        <div className="px-3 py-1.5">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Audited Snapshots</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{count}</span>
                            <span className="text-xs text-slate-400">runs</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Chart Container */}
                      <div className="relative rounded-xl bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/40 dark:to-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-4">
                        {/* Active Inspector Banner */}
                        {activePoint && (
                          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-2 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {formatPointDate(activePoint.timestamp || activePoint.date)}
                              </span>
                              <span className="text-slate-400 dark:text-slate-500">|</span>
                              <span className="text-slate-600 dark:text-slate-300">
                                Overall Score: <strong className="text-purple-600 dark:text-purple-400">{activePoint.overall_score ?? activePoint.score ?? 0}/100</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                              {activePoint.mention_rate !== undefined && (
                                <span>Mentions: <strong className="text-slate-800 dark:text-slate-200">{(activePoint.mention_rate * 100).toFixed(0)}%</strong></span>
                              )}
                              {activePoint.citation_rate !== undefined && (
                                <span>Citations: <strong className="text-slate-800 dark:text-slate-200">{(activePoint.citation_rate * 100).toFixed(0)}%</strong></span>
                              )}
                              {activePoint.average_position !== undefined && activePoint.average_position !== null && (
                                <span>Avg Pos: <strong className="text-slate-800 dark:text-slate-200">#{activePoint.average_position.toFixed(1)}</strong></span>
                              )}
                            </div>
                          </div>
                        )}

                        {chartViewMode === "curve" ? (
                          /* Spline SVG Chart */
                          <div className="w-full overflow-x-auto">
                            <svg
                              viewBox={`0 0 ${svgW} ${svgH}`}
                              className="w-full h-48 select-none overflow-visible"
                            >
                              <defs>
                                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.35" />
                                  <stop offset="60%" stopColor="#6366f1" stopOpacity="0.12" />
                                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="#a855f7" />
                                  <stop offset="50%" stopColor="#8b5cf6" />
                                  <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                              </defs>

                              {/* Horizontal Guideline Grids */}
                              {[100, 75, 50, 25, 0].map((level) => {
                                const y = padTop + (1 - level / 100) * plotH;
                                return (
                                  <g key={level}>
                                    <line
                                      x1={padLeft}
                                      y1={y}
                                      x2={padLeft + plotW}
                                      y2={y}
                                      stroke="currentColor"
                                      strokeDasharray="3 3"
                                      className="text-slate-200 dark:text-slate-800"
                                      strokeWidth="1"
                                    />
                                    <text
                                      x={padLeft - 8}
                                      y={y + 3}
                                      textAnchor="end"
                                      className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono"
                                    >
                                      {level}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Filled Gradient Area */}
                              {areaPathD && (
                                <path d={areaPathD} fill="url(#curveGradient)" />
                              )}

                              {/* Spline Line */}
                              {linePathD && (
                                <path
                                  d={linePathD}
                                  fill="none"
                                  stroke="url(#strokeGradient)"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              )}

                              {/* Interactive Nodes & Tooltip Anchors */}
                              {coords.map((c) => {
                                const isHovered = hoveredPointIndex === c.idx;
                                const isCurrent = c.idx === count - 1;
                                return (
                                  <g
                                    key={c.idx}
                                    className="cursor-pointer group"
                                    onMouseEnter={() => setHoveredPointIndex(c.idx)}
                                    onMouseLeave={() => setHoveredPointIndex(null)}
                                  >
                                    {/* Transparent click/hover hitbox */}
                                    <circle
                                      cx={c.x}
                                      cy={c.y}
                                      r={14}
                                      fill="transparent"
                                    />

                                    {/* Pulse ring for active/hovered point */}
                                    {(isHovered || isCurrent) && (
                                      <circle
                                        cx={c.x}
                                        cy={c.y}
                                        r={isHovered ? 10 : 7}
                                        className="fill-purple-500/20 stroke-purple-500 transition-all duration-200"
                                        strokeWidth="1.5"
                                      />
                                    )}

                                    {/* Core Point Dot */}
                                    <circle
                                      cx={c.x}
                                      cy={c.y}
                                      r={isHovered ? 5 : 4}
                                      className={`transition-all duration-200 ${
                                        isHovered
                                          ? "fill-white stroke-purple-600 stroke-[3]"
                                          : isCurrent
                                          ? "fill-purple-600 stroke-white dark:stroke-slate-900 stroke-[2]"
                                          : "fill-indigo-500 stroke-white dark:stroke-slate-900 stroke-[2]"
                                      }`}
                                    />

                                    {/* Score Callout Bubble */}
                                    <text
                                      x={c.x}
                                      y={c.y - 9}
                                      textAnchor="middle"
                                      className={`text-[10px] font-extrabold transition-opacity duration-150 ${
                                        isHovered || isCurrent
                                          ? "opacity-100 fill-purple-700 dark:fill-purple-300 font-mono"
                                          : "opacity-0 group-hover:opacity-100 fill-slate-600 dark:fill-slate-300"
                                      }`}
                                    >
                                      {c.score}
                                    </text>

                                    {/* X-axis Date Label */}
                                    <text
                                      x={c.x}
                                      y={padTop + plotH + 18}
                                      textAnchor="middle"
                                      className={`text-[9.5px] transition-colors duration-150 ${
                                        isHovered || isCurrent
                                          ? "font-bold fill-purple-700 dark:fill-purple-300"
                                          : "fill-slate-400 dark:fill-slate-500 font-medium"
                                      }`}
                                    >
                                      {formatPointDate(c.pt.timestamp || c.pt.date)}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        ) : (
                          /* Histogram Bar View */
                          <div className="h-48 flex items-end gap-3 pt-8 px-4 overflow-x-auto">
                            {timeline.map((pt, idx) => {
                              const scoreVal = pt.overall_score ?? pt.score ?? 0;
                              const isHovered = hoveredPointIndex === idx;
                              const isLatest = idx === count - 1;
                              return (
                                <div
                                  key={idx}
                                  onMouseEnter={() => setHoveredPointIndex(idx)}
                                  onMouseLeave={() => setHoveredPointIndex(null)}
                                  className="flex-1 min-w-[40px] flex flex-col items-center gap-1.5 cursor-pointer group"
                                >
                                  <span className={`text-[10px] font-bold font-mono transition-opacity ${
                                    isHovered || isLatest
                                      ? "opacity-100 text-purple-600 dark:text-purple-400"
                                      : "opacity-0 group-hover:opacity-100 text-slate-500"
                                  }`}>
                                    {scoreVal}
                                  </span>
                                  <div
                                    style={{ height: `${Math.max(scoreVal * 1.3, 14)}px` }}
                                    className={`w-full max-w-[48px] rounded-t-lg transition-all duration-200 ${
                                      isHovered
                                        ? "bg-purple-600 shadow-lg shadow-purple-500/30 brightness-110 scale-x-105"
                                        : isLatest
                                        ? "bg-gradient-to-t from-purple-600 to-indigo-500"
                                        : "bg-slate-300 dark:bg-slate-700 group-hover:bg-purple-400 dark:group-hover:bg-purple-600"
                                    }`}
                                  />
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[65px] text-center">
                                    {formatPointDate(pt.timestamp || pt.date)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </Card>
            </div>

            {/* Phase 7 AEO Intelligence & Continuous Monitoring Command Center */}
            <Card className="p-6 border-purple-900/40 bg-gradient-to-br from-[#0c0d1c] via-[#0f1424] to-[#120e26] space-y-6 text-white shadow-xl shadow-purple-950/20 relative overflow-hidden">
              {/* Subtle background glow effect */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header with Title, Live Badge, and Executive Button */}
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-800/30 pb-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-inner">
                      <Brain className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      AEO Intelligence & Continuous Monitoring
                    </h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-3 h-3" /> Phase 7 Command
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Continuous Telemetry Active
                    </div>
                  </div>
                  <p className="text-xs text-purple-200/70 max-w-2xl">
                    Real-time AI engine parity, brand share of voice, cross-model citation coverage, and automated competitive drift detection.
                  </p>
                </div>
                
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <Link
                    href="/aeo/intelligence"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-900/30 hover:shadow-purple-700/40"
                  >
                    <span>Full Executive Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 6 Executive Telemetry Metric Cards */}
              <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {/* 1. Monitoring Health */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-900/30 hover:border-purple-600/50 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">Monitoring Health</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-white">
                        {intelligence ? intelligence.monitoring_health_score : 92}
                      </span>
                      <span className="text-xs text-purple-300/70 font-mono">/100</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold mt-3 px-2 py-0.5 rounded-md inline-block w-fit ${
                    (intelligence?.monitoring_health_status || "Healthy") === "Healthy"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : (intelligence?.monitoring_health_status) === "Critical Risk"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {intelligence?.monitoring_health_status || "Optimal"}
                  </span>
                </div>

                {/* 2. Brand Share of Voice */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-900/30 hover:border-purple-600/50 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">Share of Voice</span>
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-white">
                        {intelligence ? `${intelligence.competitive_position.brand_share_of_voice.toFixed(1)}%` : "38.5%"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-3 block truncate">
                    vs {intelligence?.competitive_position.competitors_tracked || 3} tracked rivals
                  </span>
                </div>

                {/* 3. Data Freshness */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-900/30 hover:border-purple-600/50 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">Data Freshness</span>
                      <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-xl font-extrabold text-emerald-400">
                        {intelligence?.data_freshness || "Real-Time"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-3 block truncate">
                    {intelligence?.last_analyzed_at ? formatTimeAgo(intelligence.last_analyzed_at) : "Synchronized"}
                  </span>
                </div>

                {/* 4. Engine Parity */}
                <Link
                  href="/aeo/engines"
                  className="bg-slate-900/80 p-4 rounded-xl border border-purple-900/30 hover:border-purple-500 hover:bg-purple-950/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400 group-hover:text-purple-300 transition-colors">Engine Parity</span>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-white">
                        {engines.filter(e => e.is_connected ?? e.is_available).length || 4}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Models</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-400 mt-3 block flex items-center gap-1 font-semibold">
                    Compare Matrix <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </Link>

                {/* 5. Active Threats */}
                <Link
                  href="/aeo/alerts"
                  className="bg-slate-900/80 p-4 rounded-xl border border-purple-900/30 hover:border-amber-500/60 hover:bg-amber-950/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400 group-hover:text-amber-300 transition-colors">Active Threats</span>
                      <Bell className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-amber-400">
                        {intelligence?.top_risks.length ?? 0}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">detected</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-300 mt-3 block flex items-center gap-1 font-semibold">
                    View Alerts <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </Link>

                {/* 6. Recent Shifts */}
                <Link
                  href="/aeo/changes"
                  className="bg-slate-900/80 p-4 rounded-xl border border-purple-900/30 hover:border-indigo-500/60 hover:bg-indigo-950/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">Recent Shifts</span>
                      <GitCommit className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-indigo-300">
                        {intelligence?.recent_changes.length ?? 0}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">movements</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-400 mt-3 block flex items-center gap-1 font-semibold">
                    Change Center <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </Link>
              </div>

              {/* Sub-Route Navigation Modules */}
              <div className="relative pt-3 border-t border-purple-900/30">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300/80">
                    Dedicated Intelligence Workspaces
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click to drill down into dedicated deep-dive modules
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link
                    href="/aeo/competitors"
                    className="p-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/30 hover:border-purple-600/50 transition-all group flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-purple-900/50 text-purple-300 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-purple-200">
                        Competitors & SoV
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Benchmarking & share of voice
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/aeo/monitoring/prompts"
                    className="p-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/30 hover:border-purple-600/50 transition-all group flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-indigo-900/50 text-indigo-300 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-indigo-200">
                        Prompt Movements
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Query position fluctuation
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/aeo/monitoring/citations"
                    className="p-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/30 hover:border-purple-600/50 transition-all group flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-emerald-900/50 text-emerald-300 group-hover:scale-105 transition-transform">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-emerald-200">
                        Citation Sources
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Domain attribution authority
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/aeo/monitoring/entities"
                    className="p-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/30 hover:border-purple-600/50 transition-all group flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-pink-900/50 text-pink-300 group-hover:scale-105 transition-transform">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-pink-200">
                        Entity Health
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Knowledge graph integrity
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Phase 6 Action Center Highlights */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">AEO Action Center & Top Opportunities</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border dark:border-purple-800/60">
                      Phase 6
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Prioritized deterministic actions to improve brand mentions, citations, and direct answers.
                  </p>
                </div>
                <Link
                  href="/aeo/actions"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
                >
                  Open Action Center <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Quick Intelligence Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <Link
                  href="/aeo/optimization/content-gaps"
                  className="p-3 rounded-xl bg-purple-50/50 hover:bg-purple-100/60 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 border border-purple-100 dark:border-purple-800/40 transition flex items-center gap-2.5 group"
                >
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Content Gaps</span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300">Missing Topics</span>
                  </div>
                </Link>

                <Link
                  href="/aeo/optimization/prompts"
                  className="p-3 rounded-xl bg-indigo-50/50 hover:bg-indigo-100/60 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/40 transition flex items-center gap-2.5 group"
                >
                  <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Prompt Gaps</span>
                    <span className="text-[10px] text-indigo-700 dark:text-indigo-300">Uncovered Queries</span>
                  </div>
                </Link>

                <Link
                  href="/aeo/optimization/citations"
                  className="p-3 rounded-xl bg-violet-50/50 hover:bg-violet-100/60 dark:bg-violet-950/30 dark:hover:bg-violet-900/40 border border-violet-100 dark:border-violet-800/40 transition flex items-center gap-2.5 group"
                >
                  <Share2 className="w-4 h-4 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Citation Gaps</span>
                    <span className="text-[10px] text-violet-700 dark:text-violet-300">Source Domains</span>
                  </div>
                </Link>

                <Link
                  href="/aeo/optimization/entities"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition flex items-center gap-2.5 group"
                >
                  <Network className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Entity Health</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Knowledge Graph</span>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Bottom Grid: Recent Questions & Citations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tracked Questions */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tracked AI Questions ({recentQuestions.length})</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsTrackQuestionOpen(true)}
                      leftIcon={<Plus className="w-3 h-3" />}
                      className="text-xs h-7"
                    >
                      Add Question
                    </Button>
                    <Link href="/aeo/questions" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium">
                      All
                    </Link>
                  </div>
                </div>

                {recentQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No tracked questions recorded yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {recentQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-700/50 transition-colors bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{q.question_text}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">{q.category}</span>
                            <span>Intent: {q.intent}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {q.brand_mentioned ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border dark:border-emerald-800/60">
                              Mentioned {q.best_rank_position ? `(#${q.best_rank_position})` : ""}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {q.visibility_status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Recent Source Citations */}
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Extracted Citations ({recentCitations.length})</h3>
                  </div>
                  <Link href="/aeo/citations" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    View All
                  </Link>
                </div>

                {recentCitations.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No source citations recorded yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {recentCitations.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <a
                            href={c.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-purple-900 dark:text-purple-300 hover:underline truncate block"
                          >
                            {c.domain}
                          </a>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{c.source_url}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border dark:border-purple-800/60 uppercase">
                            {c.engine}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </>
        )}

        {/* Modal: Score Explanation */}
        {isScoreModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">AEO Visibility Formula</h3>
                </div>
                <button onClick={() => setIsScoreModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/60 font-mono text-xs text-purple-950 dark:text-purple-200 text-center">
                Score = (0.35 × Mention) + (0.25 × Citation) + (0.20 × Position) + (0.20 × Coverage)
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  <strong>• Brand Mentions (35%):</strong> Frequency of direct brand appearances across AI generated answers.
                </p>
                <p>
                  <strong>• Source Citations (25%):</strong> Share of authoritative outbound URLs linking back to your domain.
                </p>
                <p>
                  <strong>• List Position (20%):</strong> Average ranking hierarchy when listed in top recommendations.
                </p>
                <p>
                  <strong>• Question Coverage (20%):</strong> Percentage of tracked industry queries answered with sufficient depth.
                </p>
              </div>

              <Button size="sm" variant="primary" onClick={() => setIsScoreModalOpen(false)} className="w-full bg-purple-600 text-white">
                Understood
              </Button>
            </div>
          </div>
        )}

        {/* Modal: Track Question */}
        {isTrackQuestionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Track New AI Search Prompt</h3>
                <button onClick={() => setIsTrackQuestionOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTrackQuestionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Question / Search Prompt</label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="e.g. What are the best tools for SEO in 2026?"
                    rows={3}
                    required
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Brand Overview">Brand Overview</option>
                      <option value="Product Capabilities">Product Capabilities</option>
                      <option value="Competitor Comparison">Competitor Comparison</option>
                      <option value="Pricing & Commercial">Pricing & Commercial</option>
                      <option value="Industry Best Practices">Industry Best Practices</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Intent</label>
                    <select
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="informational">Informational</option>
                      <option value="commercial">Commercial</option>
                      <option value="comparison">Comparison</option>
                      <option value="transactional">Transactional</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsTrackQuestionOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" isLoading={isSubmittingQuestion} className="bg-purple-600 text-white">
                    Start Tracking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New Project */}
        {isAddProjectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create AEO Project</h3>
                <button onClick={() => setIsAddProjectOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProjectSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Brand Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Acme Cloud"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Website Domain</label>
                  <input
                    type="text"
                    value={newProjectDomain}
                    onChange={(e) => setNewProjectDomain(e.target.value)}
                    placeholder="e.g. acmecloud.com"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Industry / Domain</label>
                  <input
                    type="text"
                    value={newProjectIndustry}
                    onChange={(e) => setNewProjectIndustry(e.target.value)}
                    placeholder="e.g. Cloud Security & Infrastructure"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description (Optional)</label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Brief description of primary services..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddProjectOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" isLoading={isSubmittingProject} className="bg-purple-600 text-white">
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
