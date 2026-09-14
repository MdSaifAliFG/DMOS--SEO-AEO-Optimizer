"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Zap,
  Filter,
  ArrowLeft,
  Calendar,
  Layers,
  Bot,
  Sparkles,
  BarChart3,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import { UsageEvent, UsageSummary } from "@/lib/types";

export default function UsageAnalyticsPage() {
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, summaryData] = await Promise.all([
        api.getUsageEvents({ module: selectedModule, limit: 100 }).catch(() => []),
        api.getUsageSummary(30).catch(() => null),
      ]);
      setEvents(eventsData);
      setSummary(summaryData);
    } catch {
      // Handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedModule]);

  const filteredEvents = events.filter((ev) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ev.operation.toLowerCase().includes(query) ||
      (ev.resource_type && ev.resource_type.toLowerCase().includes(query)) ||
      (ev.provider && ev.provider.toLowerCase().includes(query))
    );
  });

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Back and Subnav Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/billing"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/billing"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Overview & Plans
            </Link>
            <Link
              href="/billing/usage"
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 shadow-2xs"
            >
              Usage Analytics
            </Link>
            <Link
              href="/billing/history"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Credit Ledger
            </Link>
            <Link
              href="/billing/invoices"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Invoices
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Refresh Usage Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total 30-Day Usage
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{summary.total_credits_used.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-slate-500">Credits consumed</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider block flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> SEO Engine
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {summary.seo_credits.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">Page scans & keyword audits</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block flex items-center gap-1">
              <Bot className="w-3 h-3" /> AEO Engine
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {summary.aeo_credits.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">Answer tests & citations</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> GEO Engine
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {summary.geo_credits.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">Generative optimizations</span>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Module Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          {["all", "SEO", "AEO", "GEO", "SYSTEM"].map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedModule === mod
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {mod === "all" ? "All Modules" : mod}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search operations, models..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Usage Events Table */}
      <div className="bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Module</th>
                <th className="px-6 py-3.5">Operation</th>
                <th className="px-6 py-3.5">Provider / Model</th>
                <th className="px-6 py-3.5 text-right">Credits Used</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span>Loading credit consumption log...</span>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No usage events recorded for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr
                    key={ev.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(ev.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          ev.module === "SEO"
                            ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                            : ev.module === "AEO"
                              ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : ev.module === "GEO"
                                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {ev.module}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-900 dark:text-white font-mono text-[11px]">
                      {ev.operation}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">
                      {ev.provider ? `${ev.provider} (${ev.provider_model || "default"})` : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-slate-900 dark:text-white font-mono">
                      -{ev.credits_used}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}
