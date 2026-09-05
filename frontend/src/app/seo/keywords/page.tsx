"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { SEOKeyword } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function SeoKeywordsPage() {
  const [keywords, setKeywords] = useState<SEOKeyword[]>([
    {
      id: "kw-1",
      keyword: "payment gateway api",
      intent: "commercial",
      search_volume: 18100,
      difficulty: 68,
      target_url: "/docs/api/payments",
      position: 4,
      change: 2,
    },
    {
      id: "kw-2",
      keyword: "best payment processing for saas",
      intent: "commercial",
      search_volume: 4400,
      difficulty: 54,
      target_url: "/solutions/saas",
      position: 2,
      change: 1,
    },
    {
      id: "kw-3",
      keyword: "how to accept international payments online",
      intent: "informational",
      search_volume: 6200,
      difficulty: 42,
      target_url: "/resources/international-payments-guide",
      position: 7,
      change: -1,
    },
    {
      id: "kw-4",
      keyword: "automated billing software",
      intent: "transactional",
      search_volume: 12500,
      difficulty: 72,
      target_url: "/products/billing",
      position: 5,
      change: 0,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newKeyword, setNewKeyword] = useState("");
  const [newIntent, setNewIntent] = useState<"informational" | "commercial" | "transactional" | "navigational">("commercial");
  const [newTargetUrl, setNewTargetUrl] = useState("");

  const { success } = useToast();

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword) return;

    const created: SEOKeyword = {
      id: `kw-${Date.now()}`,
      keyword: newKeyword,
      intent: newIntent,
      search_volume: Math.floor(Math.random() * 8000) + 1200,
      difficulty: Math.floor(Math.random() * 40) + 35,
      target_url: newTargetUrl || "/",
      position: Math.floor(Math.random() * 15) + 3,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">SEO Target Keywords ({keywords.length})</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Intent Tracking
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Track target search phrases, organic intent clustering, and ranking trajectories.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-xs shrink-0"
          >
            + Add Target Keyword
          </Button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search keywords..."
          filters={[
            {
              id: "intent",
              label: "Intent",
              value: intentFilter,
              onChange: setIntentFilter,
              options: [
                { label: "All Intents", value: "all" },
                { label: "Commercial", value: "commercial" },
                { label: "Informational", value: "informational" },
                { label: "Transactional", value: "transactional" },
                { label: "Navigational", value: "navigational" },
              ],
            },
          ]}
          onReset={() => {
            setSearchQuery("");
            setIntentFilter("all");
          }}
        />

        {/* Keywords Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Target Keyword</th>
                  <th className="py-3 px-4">Intent</th>
                  <th className="py-3 px-4 text-center">Monthly Volume</th>
                  <th className="py-3 px-4 text-center">Difficulty (KD)</th>
                  <th className="py-3 px-4">Target URL</th>
                  <th className="py-3 px-4 text-right">SERP Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredKeywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {kw.keyword}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {kw.intent}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                      {kw.search_volume.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {kw.difficulty} / 100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] truncate max-w-[200px]">
                      {kw.target_url}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                        <span>#{kw.position}</span>
                        {kw.change && kw.change > 0 ? (
                          <span className="text-emerald-600 text-[10px] flex items-center">
                            <TrendingUp className="w-3 h-3" />+{kw.change}
                          </span>
                        ) : kw.change && kw.change < 0 ? (
                          <span className="text-rose-600 text-[10px] flex items-center">
                            <TrendingDown className="w-3 h-3" />{kw.change}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Keyword Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Track New Keyword</h3>
              <p className="text-xs text-slate-500">
                Add search queries to track on-page optimization, content relevance, and organic visibility.
              </p>

              <form onSubmit={handleAddKeyword} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Search Keyword</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. enterprise billing api"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Search Intent</label>
                  <select
                    value={newIntent}
                    onChange={(e) => setNewIntent(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="informational">Informational</option>
                    <option value="transactional">Transactional</option>
                    <option value="navigational">Navigational</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Target Page Path</label>
                  <input
                    type="text"
                    placeholder="e.g. /products/billing"
                    value={newTargetUrl}
                    onChange={(e) => setNewTargetUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Add Keyword
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
