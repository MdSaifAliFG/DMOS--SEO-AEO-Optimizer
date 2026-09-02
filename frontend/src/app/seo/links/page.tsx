"use client";

import React, { useEffect, useState } from "react";
import {
  Link2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Globe,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { FilterBar } from "@/components/ui/FilterBar";
import { Project, SEOPageLink } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function SeoLinksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [links, setLinks] = useState<Array<{
    source_url: string;
    target_url: string;
    anchor_text?: string;
    link_type: string;
    is_internal: boolean;
    status_code: number;
  }>>([
    {
      source_url: "https://stripe.com/",
      target_url: "https://stripe.com/payments",
      anchor_text: "Accept Payments",
      link_type: "internal",
      is_internal: true,
      status_code: 200,
    },
    {
      source_url: "https://stripe.com/",
      target_url: "https://stripe.com/billing",
      anchor_text: "Recurring Billing",
      link_type: "internal",
      is_internal: true,
      status_code: 200,
    },
    {
      source_url: "https://stripe.com/docs",
      target_url: "https://github.com/stripe/stripe-node",
      anchor_text: "Node.js SDK",
      link_type: "external",
      is_internal: false,
      status_code: 200,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [linkTypeFilter, setLinkTypeFilter] = useState("all");

  const filteredLinks = links.filter((l) => {
    if (linkTypeFilter !== "all" && l.link_type !== linkTypeFilter) return false;
    if (
      searchQuery &&
      !l.target_url.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(l.anchor_text || "").toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-cyan-900 to-slate-900 text-white shadow-md border border-sky-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
                <Link2 className="w-5 h-5 text-sky-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Link Structure & Health</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/20">
                Link Graph
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-2xl">
              Analyze internal site architecture, anchor text distribution, external outgoing links, and broken URLs.
            </p>
          </div>
        </div>

        {/* Link KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Links Score (20%)"
            value="90 / 100"
            subValue="Link Architecture"
            rightVisual={<ScoreRing score={90} size="sm" showRating={false} />}
          />

          <MetricCard
            title="Internal Hyperlinks"
            value="1,420"
            subValue="Healthy anchor texts"
            icon={<Link2 className="w-5 h-5 text-blue-600" />}
            variant="blue"
          />

          <MetricCard
            title="External Outgoing Links"
            value="184"
            subValue="No broken targets"
            icon={<ExternalLink className="w-5 h-5 text-emerald-600" />}
            variant="emerald"
          />

          <MetricCard
            title="Broken Links (404)"
            value="0"
            subValue="0% Error Rate"
            icon={<AlertTriangle className="w-5 h-5 text-emerald-600" />}
            variant="emerald"
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search target URLs or anchor text..."
          filters={[
            {
              id: "link_type",
              label: "Link Type",
              value: linkTypeFilter,
              onChange: setLinkTypeFilter,
              options: [
                { label: "All Links", value: "all" },
                { label: "Internal", value: "internal" },
                { label: "External", value: "external" },
              ],
            },
          ]}
          onReset={() => {
            setSearchQuery("");
            setLinkTypeFilter("all");
          }}
        />

        {/* Links Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Anchor Text</th>
                  <th className="py-3 px-4">Target URL</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Source Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLinks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {link.anchor_text || <span className="text-slate-400 italic">No Anchor Text</span>}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800 truncate max-w-[240px]">
                      {link.target_url}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[10px] uppercase">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          link.is_internal
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {link.link_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px]">
                        {link.status_code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[180px]">
                      {link.source_url}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
