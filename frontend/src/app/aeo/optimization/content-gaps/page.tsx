"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AeoProject, AeoContentGapResponse, AeoContentGapItem, AeoContentBrief } from "@/lib/types";
import {
  Sparkles,
  Layers,
  FileText,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
  X,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Search,
  HelpCircle,
} from "lucide-react";

export default function AeoContentGapsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [gapsData, setGapsData] = useState<AeoContentGapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Brief Modal
  const [activeBriefItem, setActiveBriefItem] = useState<AeoContentGapItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getAeoProjects({ limit: 50 });
        setProjects(data.projects || []);
        if (data.projects?.length > 0) {
          setSelectedProjectId(data.projects[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      }
    }
    loadProjects();
  }, []);

  const fetchGaps = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAeoContentGaps(selectedProjectId);
      setGapsData(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze content gaps");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchGaps();
  }, [fetchGaps]);

  // Filtered list
  const filteredGaps = (gapsData?.gaps || []).filter((g) => {
    if (filterType === "competitor" && !g.competitor_coverage) return false;
    if (filterType === "uncovered" && g.brand_coverage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.topic.toLowerCase().includes(q) ||
        g.prompt.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === "critical") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
          <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Critical
        </span>
      );
    }
    if (p === "high") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          High
        </span>
      );
    }
    if (p === "medium") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        Low
      </span>
    );
  };

  const handleCopyMarkdown = () => {
    if (!activeBriefItem) return;
    const b = activeBriefItem.brief;
    const md = `# Content Brief: ${b.recommended_title}

**Target Prompt:** ${b.target_question}
**Content Type:** ${b.content_type}
**Category:** ${b.target_category}
**Suggested Length:** ${b.suggested_word_count}

## Recommended Headings
${b.recommended_headings.map((h) => `- ${h}`).join("\n")}

## Essential Entities to Mention
${b.essential_entities.map((e) => `- ${e}`).join("\n")}

## Structured FAQ Framework
${b.structured_faqs.map((f) => `### Q: ${f.question}\n*Guideline:* ${f.answer_guideline}`).join("\n\n")}

## Authority Citation Sources
${b.citation_opportunities.map((c) => `- ${c}`).join("\n")}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Link
            href="/aeo/questions"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Tracked Questions &amp; Prompts
          </Link>
          <Link
            href="/aeo/optimization/content-gaps"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            Content Gaps &amp; Opportunities
          </Link>
        </div>

        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Layers className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">AEO Content Gap Analyzer</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Content Intelligence
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Identify high-intent buyer topics where competitors appear in AI engine answers but your brand is currently absent.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-700/60 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-purple-200">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={fetchGaps}
              disabled={loading}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Re-analyze Gaps
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
          <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 block">Total Gaps Found</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
              {gapsData?.total_gaps_count ?? "—"}
            </span>
          </div>
          <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-rose-100 dark:border-rose-900/40 shadow-sm">
            <span className="text-xs uppercase font-bold text-rose-700 dark:text-rose-400 block">Missing Topics</span>
            <span className="text-3xl font-black text-rose-950 dark:text-rose-100 mt-1 block">
              {gapsData?.missing_topics_count ?? "—"}
            </span>
          </div>
          <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-amber-100 dark:border-amber-900/40 shadow-sm">
            <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 block">Competitor Covered</span>
            <span className="text-3xl font-black text-amber-950 dark:text-amber-100 mt-1 block">
              {gapsData?.competitor_covered_gaps_count ?? "—"}
            </span>
          </div>
          <div className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-purple-100 dark:border-purple-900/40 shadow-sm">
            <span className="text-xs uppercase font-bold text-purple-700 dark:text-purple-400 block">High Priority Gaps</span>
            <span className="text-3xl font-black text-purple-950 dark:text-purple-100 mt-1 block">
              {gapsData?.high_priority_gaps_count ?? "—"}
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Gaps" },
              { id: "uncovered", label: "Brand Missing" },
              { id: "competitor", label: "Competitor Dominant" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterType === tab.id
                    ? "bg-purple-900 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gaps and topics..."
              className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl pl-8 pr-3 py-1.5 w-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Content Gap Table */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold">Analyzing target buyer prompts and competitor presence...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : filteredGaps.length === 0 ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No Content Gaps Detected</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Your brand is well-represented across analyzed answer engine prompts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Topic & Target Prompt</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Competitors Mentioned</th>
                    <th className="py-3.5 px-4">Recommended Content</th>
                    <th className="py-3.5 px-4">Impact</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredGaps.map((gap, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(gap.priority)}
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-bold text-slate-900 dark:text-white">{gap.topic}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 italic">
                          &quot;{gap.prompt}&quot;
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                        {gap.category}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {gap.competitors_mentioned.length > 0 ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            {gap.competitors_mentioned.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                          {gap.recommended_content_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-purple-700 dark:text-purple-400">
                        +{gap.estimated_impact} pts
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveBriefItem(gap)}
                          className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Create Brief
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Content Brief Modal */}
      {activeBriefItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-widest block mb-1">
                  AI-Ready Content Brief
                </span>
                <h3 className="text-xl font-black text-white">{activeBriefItem.brief.recommended_title}</h3>
                <p className="text-xs text-purple-200/80 mt-1">
                  Target Question: &quot;{activeBriefItem.brief.target_question}&quot;
                </p>
              </div>
              <button
                onClick={() => setActiveBriefItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* Meta details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Content Type</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">{activeBriefItem.brief.content_type}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Target Category</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">{activeBriefItem.brief.target_category}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Suggested Length</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">{activeBriefItem.brief.suggested_word_count}</span>
                </div>
              </div>

              {/* Headings */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Recommended Heading Outline
                </h4>
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {activeBriefItem.brief.recommended_headings.map((h, i) => (
                    <div key={i} className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="text-purple-600 dark:text-purple-400 font-mono text-[10px]">H{i === 0 ? "1" : "2"}</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Essential Entities */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Essential Knowledge Graph Entities
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeBriefItem.brief.essential_entities.map((e, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 rounded-lg border border-purple-200 dark:border-purple-800/60 font-bold"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Direct Answer FAQ Framework
                </h4>
                <div className="space-y-2">
                  {activeBriefItem.brief.structured_faqs.map((faq, i) => (
                    <div key={i} className="bg-purple-50/50 dark:bg-purple-950/30 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
                      <div className="font-bold text-slate-900 dark:text-white">{faq.question}</div>
                      <div className="text-slate-600 dark:text-slate-300 mt-1 italic">{faq.answer_guideline}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citation opportunities */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Target Citation Sources
                </h4>
                <div className="space-y-1 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {activeBriefItem.brief.citation_opportunities.map((c, i) => (
                    <div key={i} className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Ready to hand off to content creators or AI writer.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied Markdown!" : "Copy as Markdown"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
