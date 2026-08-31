"use client";

import React, { useEffect, useState } from "react";
import {
  Quote,
  Search,
  ExternalLink,
  Bot,
  Filter,
  CheckCircle2,
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

  const { error } = useToast();

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
      setProjects(projData.projects || []);
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
      </div>
    </DashboardShell>
  );
}
