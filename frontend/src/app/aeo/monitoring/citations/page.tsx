"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Link2,
  Globe,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { AeoCitationMovementItem, AeoProject } from "@/lib/types";
import { useToast } from "@/hooks/useToast";

export default function AeoCitationMovementsPage() {
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [citations, setCitations] = useState<AeoCitationMovementItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { success, error } = useToast();

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getAeoProjects({ limit: 50 });
        const list = res.projects || [];
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId(list[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        error("Failed to load projects", err.message);
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const loadCitations = async (projId: string) => {
    if (!projId) return;
    setIsLoading(true);
    try {
      const data = await api.getAeoCitationMovements(projId);
      setCitations(data || []);
    } catch (err: any) {
      error("Failed to load citation movements", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadCitations(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRefresh = async () => {
    if (!selectedProjectId) return;
    setIsRefreshing(true);
    try {
      await api.runAeoMonitoringCycle(selectedProjectId, true);
      success("Citation monitoring executed", "Extracting domain references from model outputs...");
      setTimeout(() => {
        loadCitations(selectedProjectId);
        setIsRefreshing(false);
      }, 2500);
    } catch (err: any) {
      error("Refresh failed", err.message);
      setIsRefreshing(false);
    }
  };

  const filteredCitations = citations.filter((item) => {
    if (typeFilter !== "all" && item.citation_type !== typeFilter) return false;
    if (!searchQuery) return true;
    return item.domain.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const ownCount = citations.filter((c) => c.citation_type === "own").length;
  const competitorCount = citations.filter((c) => c.citation_type === "competitor").length;
  const thirdPartyCount = citations.filter((c) => c.citation_type === "third_party").length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <Link2 className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Citation Movement Tracker
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Authority & Source Tracking
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl">
              Audit domains cited by AI models to substantiate answers and identify authoritative citation gaps.
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
                      {p.brand_name || p.name || p.domain}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || !selectedProjectId}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl px-3.5 py-1.5 shadow transition disabled:opacity-50 flex items-center gap-1.5 border-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Scanning..." : "Re-scan Citations"}</span>
            </Button>
          </div>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <span className="text-xs font-semibold text-slate-500">Total Cited Domains</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{citations.length}</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Own Domain Citations</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">{ownCount}</p>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">Competitor Citations</span>
            <p className="text-2xl sm:text-3xl font-black text-rose-950 mt-1">{competitorCount}</p>
          </div>

          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">Third-Party Citations</span>
            <p className="text-2xl sm:text-3xl font-black text-blue-950 mt-1">{thirdPartyCount}</p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["all", "own", "competitor", "third_party"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  typeFilter === filter
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {filter === "third_party" ? "Third Party" : filter}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cited domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 focus:ring-1 focus:ring-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Citations List */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-slate-800 font-semibold text-sm">Analyzing Citation Trajectories...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Link2 className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No AEO Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Create an AEO project to monitor cited sources and build authority backlinks for answer engines.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/aeo/projects">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create AEO Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : filteredCitations.length === 0 ? (
          <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-12 text-center">
            <Link2 className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Citations Recorded</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No citations have been detected for your questions yet. Ensure your target prompts trigger search grounding in models like Perplexity and ChatGPT Search.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={handleRefresh} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow">
                Run Analysis Now
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCitations.map((item) => (
              <div
                key={item.domain}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <h3 className="font-bold text-slate-900 text-base">{item.domain}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.citation_type === "own"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : item.citation_type === "competitor"
                            ? "bg-rose-50 text-rose-800 border border-rose-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {item.citation_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>
                        Citations: <strong className="text-slate-900 font-bold">{item.count}</strong>
                      </span>
                      <span>
                        Trend:{" "}
                        <strong
                          className={
                            item.trend === "gaining"
                              ? "text-emerald-700 font-bold"
                              : item.trend === "losing"
                              ? "text-rose-700 font-bold"
                              : "text-slate-700"
                          }
                        >
                          {item.trend}
                        </strong>
                      </span>
                    </div>

                    {/* Engines */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <span className="text-[11px] text-slate-400 mr-1">Cited in:</span>
                      {item.engines.map((eng) => (
                        <span
                          key={eng}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 uppercase font-bold"
                        >
                          {eng}
                        </span>
                      ))}
                    </div>

                    {/* Sample URLs */}
                    {item.sample_urls && item.sample_urls.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 mt-3 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Sample Cited URLs
                        </span>
                        {item.sample_urls.slice(0, 2).map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-700 hover:text-purple-900 flex items-center gap-1 truncate font-medium"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{url}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
