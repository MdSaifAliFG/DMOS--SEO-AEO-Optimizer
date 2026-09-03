"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-600" />
          Critical
        </span>
      );
    }
    if (p === "high") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          High
        </span>
      );
    }
    if (p === "medium") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-b border-purple-900/40 text-white pt-8 pb-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Layers className="w-4 h-4" />
              Content Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              AEO Content Gap Analyzer
            </h1>
            <p className="text-purple-200/80 text-sm sm:text-base mt-1 max-w-2xl">
              Identify high-intent buyer topics where competitors appear in AI engine answers but your brand is currently absent.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-purple-900/60 border border-purple-700/60 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>
            <button
              onClick={fetchGaps}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-900/40 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Re-analyze Gaps
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs uppercase font-bold text-slate-500 block">Total Gaps Found</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {gapsData?.total_gaps_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-rose-700 block">Missing Topics</span>
            <span className="text-3xl font-black text-rose-950 mt-1 block">
              {gapsData?.missing_topics_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-amber-700 block">Competitor Covered</span>
            <span className="text-3xl font-black text-amber-950 mt-1 block">
              {gapsData?.competitor_covered_gaps_count ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
            <span className="text-xs uppercase font-bold text-purple-700 block">High Priority Gaps</span>
            <span className="text-3xl font-black text-purple-950 mt-1 block">
              {gapsData?.high_priority_gaps_count ?? "—"}
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 w-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Content Gap Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Analyzing target buyer prompts and competitor presence...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : filteredGaps.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-800">No Content Gaps Detected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your brand is well-represented across analyzed answer engine prompts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-100">
                  {filteredGaps.map((gap, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/30 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(gap.priority)}
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-bold text-slate-900">{gap.topic}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                          &quot;{gap.prompt}&quot;
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                        {gap.category}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {gap.competitors_mentioned.length > 0 ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            {gap.competitors_mentioned.map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          {gap.recommended_content_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-purple-700">
                        +{gap.estimated_impact} pts
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveBriefItem(gap)}
                          className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
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
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
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
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Meta details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Content Type</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{activeBriefItem.brief.content_type}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Category</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{activeBriefItem.brief.target_category}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Suggested Length</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{activeBriefItem.brief.suggested_word_count}</span>
                </div>
              </div>

              {/* Headings */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  Recommended Heading Outline
                </h4>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeBriefItem.brief.recommended_headings.map((h, i) => (
                    <div key={i} className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-purple-600 font-mono text-[10px]">H{i === 0 ? "1" : "2"}</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Essential Entities */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Essential Knowledge Graph Entities
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeBriefItem.brief.essential_entities.map((e, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-purple-50 text-purple-900 rounded-lg border border-purple-200 font-bold"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  Direct Answer FAQ Framework
                </h4>
                <div className="space-y-2">
                  {activeBriefItem.brief.structured_faqs.map((faq, i) => (
                    <div key={i} className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                      <div className="font-bold text-slate-900">{faq.question}</div>
                      <div className="text-slate-600 mt-1 italic">{faq.answer_guideline}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citation opportunities */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                  Target Citation Sources
                </h4>
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeBriefItem.brief.citation_opportunities.map((c, i) => (
                    <div key={i} className="text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Ready to hand off to content creators or AI writer.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied Markdown!" : "Copy as Markdown"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
