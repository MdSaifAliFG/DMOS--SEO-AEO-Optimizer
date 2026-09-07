"use client";

import React, { useEffect, useState } from "react";
import {
  Quote,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Building2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoCitation } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoCitationsPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [citations, setCitations] = useState<GeoCitation[]>([]);
  const [metrics, setMetrics] = useState<{
    ownRate: number;
    compRate: number;
    thirdPartyRate: number;
    diversity: number;
  }>({ ownRate: 0, compRate: 0, thirdPartyRate: 0, diversity: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  const { error } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGeoProjects();
      const projs = res.projects || [];
      setProjects(projs);
      if (projs.length > 0) {
        setSelectedProjectId(projs[0].id);
        fetchCitations(projs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      error("Failed to load projects.");
      setIsLoading(false);
    }
  };

  const fetchCitations = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getGeoCitations(
        projectId,
        typeFilter !== "all" ? typeFilter : undefined
      );
      setCitations(res.citations || []);
      setMetrics({
        ownRate: res.own_citation_rate || 0,
        compRate: res.competitor_citation_rate || 0,
        thirdPartyRate: res.third_party_citation_rate || 0,
        diversity: res.citation_diversity || 0,
      });
    } catch (err) {
      error("Failed to load citations.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchCitations(selectedProjectId);
    }
  }, [selectedProjectId, typeFilter]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
              <Quote className="w-3.5 h-3.5" />
              Source Influence & Citations
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              GEO Citation Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track which domains and sources AI models cite when answering commercial queries.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All Source Types</option>
              <option value="own_domain">Own Domain</option>
              <option value="competitor">Competitor</option>
              <option value="news">News Media</option>
              <option value="review">Review Sites (G2, Capterra)</option>
              <option value="documentation">Documentation</option>
              <option value="third_party">Third Party</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400">Own Domain Citations</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.ownRate}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Target: &gt;30%</p>
          </Card>

          <Card className="p-4 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400">Competitor Citations</span>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              {metrics.compRate}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Share captured by rivals</p>
          </Card>

          <Card className="p-4 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400">Third-Party Citations</span>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              {metrics.thirdPartyRate}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Media & review directories</p>
          </Card>

          <Card className="p-4 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400">Citation Diversity</span>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {metrics.diversity}/100
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Breadth of unique domains</p>
          </Card>
        </div>

        {/* Citations Table */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : citations.length === 0 ? (
          <EmptyState
            icon={<Quote className="w-12 h-12 text-amber-500" />}
            title="No Citations Extracted Yet"
            description="Run GEO analysis to query AI models and extract real-time web citations."
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Source URL</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4 text-center">Relation</th>
                    <th className="py-3 px-4 text-center">Authority Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {citations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 max-w-sm truncate font-medium text-slate-900 dark:text-white">
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 truncate"
                        >
                          <span className="truncate">{c.url}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{c.domain}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {c.source_type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {c.brand_related ? (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            Own Brand
                          </span>
                        ) : c.competitor_related ? (
                          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                            Competitor
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Third Party</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[10px] text-slate-400">
                        {c.authority_score !== null && c.authority_score !== undefined
                          ? `${c.authority_score}/100`
                          : "Not Available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
