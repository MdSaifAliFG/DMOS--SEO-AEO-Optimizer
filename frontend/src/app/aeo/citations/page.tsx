"use client";

import React, { useEffect, useState } from "react";
import {
  Quote,
  Search,
  ExternalLink,
  Bot,
  Filter,
  CheckCircle2,
  Plus,
  X,
  Globe,
  Share2,
  Building2,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoCitation, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoCitationsPage() {
  const [citations, setCitations] = useState<AeoCitation[]>([]);
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [engineFilter, setEngineFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newEngine, setNewEngine] = useState("chatgpt");
  const [newCitationType, setNewCitationType] = useState("own_domain");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  const fetchCitations = async () => {
    setIsLoading(true);
    try {
      const [projData, citData] = await Promise.all([
        api.getAeoProjects({ limit: 50 }),
        api.getAeoCitations({
          project_id: selectedProjectId || undefined,
          engine: engineFilter !== "all" ? engineFilter : undefined,
          citation_type: typeFilter !== "all" ? typeFilter : undefined,
          search: searchQuery || undefined,
        }),
      ]);
      const projs = projData.projects || [];
      setProjects(projs);
      if (projs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projs[0].id);
      }
      setCitations(citData.citations || []);
      setTotal(citData.total || 0);
    } catch (err: any) {
      error("Failed to load citations", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCitations();
  }, [selectedProjectId, engineFilter, typeFilter, searchQuery]);

  const handleAddCitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceUrl.trim() || !selectedProjectId) return;

    setIsSubmitting(true);
    try {
      await api.createAeoCitation({
        project_id: selectedProjectId,
        source_url: newSourceUrl.trim(),
        engine: newEngine,
        citation_type: newCitationType,
      });
      success("Citation Added", "Source URL registered for citation tracking");
      setIsAddOpen(false);
      setNewSourceUrl("");
      fetchCitations();
    } catch (err: any) {
      error("Failed to add citation", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ownCitationsCount = citations.filter((c) => c.citation_type === "own_domain").length;
  const competitorCitationsCount = citations.filter((c) => c.citation_type === "competitor").length;
  const thirdPartyCount = citations.length - ownCitationsCount - competitorCitationsCount;

  const getCitationTypeBadge = (type?: string) => {
    switch (type) {
      case "own_domain":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Own Domain</span>;
      case "competitor":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Competitor</span>;
      case "news":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">News Source</span>;
      case "review":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Review Platform</span>;
      case "documentation":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Docs / Specs</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">Third-Party</span>;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Source Citations & Outbound References ({total})</h2>
            </div>
            <p className="text-xs text-slate-500">
              Audit the specific domain URLs cited by LLM answer engines when responding to industry prompts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-8 shadow-xs"
            >
              Add Citation
            </Button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Citations"
            value={total.toString()}
            subValue="Extracted citation URLs"
            icon={<Quote className="w-4 h-4 text-purple-600" />}
          />
          <MetricCard
            title="Own Brand Citations"
            value={ownCitationsCount.toString()}
            subValue="Direct links to your domain"
            icon={<Globe className="w-4 h-4 text-emerald-600" />}
          />
          <MetricCard
            title="Competitor Citations"
            value={competitorCitationsCount.toString()}
            subValue="Direct competitor references"
            icon={<Building2 className="w-4 h-4 text-rose-600" />}
          />
          <MetricCard
            title="Authority Sources"
            value={thirdPartyCount.toString()}
            subValue="Independent reviews & docs"
            icon={<BookOpen className="w-4 h-4 text-blue-600" />}
          />
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search domain or citation URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={engineFilter}
              onChange={(e) => setEngineFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Engines</option>
              <option value="chatgpt">ChatGPT</option>
              <option value="gemini">Gemini</option>
              <option value="perplexity">Perplexity</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Citation Types</option>
              <option value="own_domain">Own Domain</option>
              <option value="competitor">Competitors</option>
              <option value="third_party">Third Party</option>
              <option value="news">News & Media</option>
              <option value="review">Reviews</option>
              <option value="documentation">Documentation</option>
            </select>
          </div>
        </div>

        {/* Citations Table */}
        <Card className="border-slate-200 bg-white overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
              <p className="mt-3 text-xs">Loading citation sources...</p>
            </div>
          ) : citations.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Quote className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No citations found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Run an AEO analysis to extract real citation links from engine answer responses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Referenced Domain & URL</th>
                    <th className="px-4 py-3">Engine</th>
                    <th className="px-4 py-3">Classification</th>
                    <th className="px-4 py-3">Recorded</th>
                    <th className="px-4 py-3 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {citations.map((c) => (
                    <tr key={c.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-5 py-3.5 max-w-md">
                        <span className="font-bold text-slate-900 block truncate">{c.domain}</span>
                        <span className="text-[11px] text-slate-500 truncate block">{c.source_url}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-purple-100 text-purple-800">
                          {c.engine}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {getCitationTypeBadge(c.citation_type)}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {formatTimeAgo(c.created_at)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <a
                          href={c.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-purple-600 inline-block"
                          title="Open Outbound Citation"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal: Add Citation */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Add Citation Source</h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCitation} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Source URL</label>
                  <input
                    type="url"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://example.com/blog/article"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Answer Engine</label>
                    <select
                      value={newEngine}
                      onChange={(e) => setNewEngine(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200"
                    >
                      <option value="chatgpt">ChatGPT</option>
                      <option value="gemini">Gemini</option>
                      <option value="perplexity">Perplexity</option>
                      <option value="google_ai">Google AI Overviews</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Classification</label>
                    <select
                      value={newCitationType}
                      onChange={(e) => setNewCitationType(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200"
                    >
                      <option value="own_domain">Own Domain</option>
                      <option value="competitor">Competitor</option>
                      <option value="third_party">Third Party</option>
                      <option value="news">News Source</option>
                      <option value="review">Review Platform</option>
                      <option value="documentation">Documentation</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" isLoading={isSubmitting} className="bg-purple-600 text-white">
                    Save Citation
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
