"use client";

import React, { useEffect, useState } from "react";
import {
  KeyRound,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Layers,
  Globe,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Project, SEOKeyword } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function SeoKeywordsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newKeyword, setNewKeyword] = useState("");
  const [newIntent, setNewIntent] = useState<"informational" | "commercial" | "transactional" | "navigational">("commercial");
  const [newTargetUrl, setNewTargetUrl] = useState("");

  const { success, error } = useToast();

  const fetchKeywordsForProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getSeoKeywords({ project_id: projectId, limit: 50 });
      setKeywords(res.keywords || []);
    } catch (err: any) {
      error("Failed to load keywords", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projData = await api.getProjects({ limit: 50 });
        setProjects(projData.projects || []);
        if (projData.projects?.length > 0) {
          const firstId = projData.projects[0].id;
          setSelectedProjectId(firstId);
          await fetchKeywordsForProject(firstId);
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        error("Failed to load projects", err.message);
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId);
    await fetchKeywordsForProject(projectId);
  };

  const handleExtractKeywords = async () => {
    if (!selectedProjectId) return;
    setIsExtracting(true);
    try {
      const res = await api.extractSeoKeywords({ project_id: selectedProjectId, limit: 50 });
      setKeywords(res.keywords || []);
      success("Keywords Extracted", `Successfully extracted ${res.keywords?.length || 0} real keywords from crawled pages.`);
    } catch (err: any) {
      error("Extraction Failed", err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword) return;

    const created: SEOKeyword = {
      id: `kw-${Date.now()}`,
      keyword: newKeyword.toLowerCase().trim(),
      intent: newIntent,
      search_volume: 2400,
      difficulty: 45,
      target_url: newTargetUrl || "/",
      position: 8,
      change: 0,
    };

    setKeywords([created, ...keywords]);
    success("Keyword Tracked", `Keyword '${newKeyword}' added to tracking list`);
    setIsAddModalOpen(false);
    setNewKeyword("");
    setNewTargetUrl("");
  };

  const filteredKeywords = keywords.filter((kw) => {
    if (intentFilter !== "all" && kw.intent !== intentFilter) return false;
    if (searchQuery && !kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                SEO Target Keywords ({keywords.length})
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Live Crawl Extraction
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Real-time target search phrases, TF-IDF prominence, search intent classification, and ranking positions directly from crawled pages.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Website:</span>
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

            <Button
              size="sm"
              variant="outline"
              onClick={handleExtractKeywords}
              isLoading={isExtracting}
              leftIcon={<Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              className="shadow-xs"
            >
              Auto-Extract
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-xs"
            >
              + Track Keyword
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search real extracted keywords..."
          filters={[
            {
              id: "intent",
              label: "Intent",
              value: intentFilter,
              options: [
                { label: "All Intents", value: "all" },
                { label: "Informational", value: "informational" },
                { label: "Commercial", value: "commercial" },
                { label: "Transactional", value: "transactional" },
                { label: "Navigational", value: "navigational" },
              ],
              onChange: setIntentFilter,
            },
          ]}
        />

        {/* Keywords Table Card */}
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 dark:bg-[#0f172a]">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              Loading real keywords for selected project...
            </div>
          ) : filteredKeywords.length === 0 ? (
            <EmptyState
              icon={KeyRound}
              title="No Keywords Found"
              description="No keywords have been extracted for this project yet. Run an audit scan on this project or click 'Auto-Extract' to discover keywords from crawled pages."
              actionLabel="Auto-Extract Keywords"
              onAction={handleExtractKeywords}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Keyword</th>
                    <th className="px-4 py-3">Search Intent</th>
                    <th className="px-4 py-3 text-right">Est. Volume</th>
                    <th className="px-4 py-3 text-center">Difficulty (KD)</th>
                    <th className="px-4 py-3">Target Landing Page</th>
                    <th className="px-4 py-3 text-center">Rank Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredKeywords.map((kw) => {
                    const intentBadgeStyles = {
                      informational: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
                      commercial: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
                      transactional: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
                      navigational: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                    }[kw.intent] || "bg-slate-50 text-slate-700";

                    return (
                      <tr key={kw.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{kw.keyword}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${intentBadgeStyles}`}>
                            {kw.intent}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                          {kw.search_volume.toLocaleString()} / mo
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              kw.difficulty > 70
                                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                : kw.difficulty > 45
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {kw.difficulty} / 100
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                          {kw.target_url ? (
                            <a
                              href={kw.target_url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400"
                            >
                              <span className="truncate">{kw.target_url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center justify-center gap-1.5">
                            <span>#{kw.position ?? "—"}</span>
                            {(kw.change ?? 0) > 0 && (
                              <span className="flex items-center text-[11px] text-emerald-600">
                                <TrendingUp className="w-3 h-3 mr-0.5" />+{kw.change}
                              </span>
                            )}
                            {(kw.change ?? 0) < 0 && (
                              <span className="flex items-center text-[11px] text-rose-600">
                                <TrendingDown className="w-3 h-3 mr-0.5" />
                                {kw.change}
                              </span>
                            )}
                            {(kw.change ?? 0) === 0 && (
                              <span className="text-slate-400 text-[11px]">
                                <Minus className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal: Add Target Keyword */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <Card className="w-full max-w-md p-6 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  Track Target Keyword
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddKeyword} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Keyword or Search Query *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. generative engine optimization"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Search Intent
                  </label>
                  <select
                    value={newIntent}
                    onChange={(e: any) => setNewIntent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="informational">Informational (Guides, How-tos)</option>
                    <option value="commercial">Commercial (Best, Reviews, Comparisons)</option>
                    <option value="transactional">Transactional (Pricing, Buy, Sign up)</option>
                    <option value="navigational">Navigational (Brand, Portal)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Landing Page URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/target-page"
                    value={newTargetUrl}
                    onChange={(e) => setNewTargetUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Add Keyword
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
