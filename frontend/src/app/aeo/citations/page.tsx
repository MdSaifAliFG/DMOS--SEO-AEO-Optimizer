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
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoCitation, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function AeoCitationsPage() {
  const [citations, setCitations] = useState<AeoCitation[]>([]);
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [engineFilter, setEngineFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newEngine, setNewEngine] = useState("chatgpt");
  const [newSnippet, setNewSnippet] = useState("");
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
          search: searchQuery || undefined,
        }),
      ]);
      const projs = projData.projects || [];
      setProjects(projs);
      if (projs.length > 0 && !newProject) {
        setNewProject(projs[0].id);
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
  }, [selectedProjectId, engineFilter, searchQuery]);

  const handleAddCitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceUrl.trim() || !newProject) return;

    setIsSubmitting(true);
    try {
      await api.createAeoCitation({
        project_id: newProject,
        source_url: newSourceUrl.trim(),
        engine: newEngine,
        citation_text: newSnippet.trim() || undefined,
      });
      success("Citation Added", "Source URL registered for AEO citations tracking");
      setIsAddOpen(false);
      setNewSourceUrl("");
      setNewSnippet("");
      fetchCitations();
    } catch (err: any) {
      error("Failed to add citation", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">AI Citations & Sources ({total})</h2>
            <p className="text-xs text-slate-500">
              Web links and source citations referenced by generative AI models during answer synthesis.
            </p>
          </div>

          <Button
            size="sm"
            variant="aeo"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddOpen(true)}
          >
            + Add Citation
          </Button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search citation domains or URLs..."
          filters={[
            {
              id: "engine",
              label: "Engine",
              value: engineFilter,
              onChange: setEngineFilter,
              options: [
                { label: "All Engines", value: "all" },
                { label: "ChatGPT", value: "chatgpt" },
                { label: "Perplexity", value: "perplexity" },
                { label: "Google AI", value: "google_ai" },
                { label: "Gemini", value: "gemini" },
                { label: "Copilot", value: "copilot" },
              ],
            },
          ]}
          onReset={() => {
            setSearchQuery("");
            setEngineFilter("all");
          }}
        />

        {/* Citations Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Cited Domain</th>
                  <th className="py-3 px-4">Source URL</th>
                  <th className="py-3 px-4">Answer Engine</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Extracted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading citations...</p>
                    </td>
                  </tr>
                ) : citations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <EmptyState
                        icon={<Quote className="w-6 h-6 text-purple-500" />}
                        title="No Citations Recorded"
                        description="Citations will populate here when AI search engines cite your brand's webpages."
                      />
                    </td>
                  </tr>
                ) : (
                  citations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {c.domain}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 truncate max-w-sm">
                        <div className="flex items-center gap-1">
                          <span className="truncate">{c.source_url}</span>
                          <a
                            href={c.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-purple-600"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                          {c.engine}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        {c.citation_status}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        {formatDate(c.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Citation Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Add AI Citation Source</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCitation} className="space-y-4 pt-1">
                {projects.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Target Project</label>
                    <select
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.domain})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Source URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/blog/best-tools"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Answer Engine</label>
                  <select
                    value={newEngine}
                    onChange={(e) => setNewEngine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  >
                    <option value="chatgpt">ChatGPT (OpenAI)</option>
                    <option value="perplexity">Perplexity AI</option>
                    <option value="google_ai">Google AI Overviews</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="copilot">Microsoft Copilot</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Snippet / Citation Text (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Quoted reference or synthesis context from AI engine..."
                    value={newSnippet}
                    onChange={(e) => setNewSnippet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="aeo"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Add Citation
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
