"use client";

import React from "react";
import { SEOSeverity } from "@/lib/types";

interface IssueSummaryCardsProps {
  severityCounts: Record<SEOSeverity, number>;
  selectedSeverity?: string | null;
  onSelectSeverity: (severity: string | null) => void;
  totalIssues: number;
}

export function IssueSummaryCards({
  severityCounts,
  selectedSeverity,
  onSelectSeverity,
  totalIssues,
}: IssueSummaryCardsProps) {
  const items: Array<{
    key: string | null;
    label: string;
    count: number;
    color: string;
    activeBorder: string;
  }> = [
    {
      key: null,
      label: "All Issues",
      count: totalIssues,
      color: "text-zinc-200 bg-zinc-900 border-zinc-800",
      activeBorder: "ring-2 ring-zinc-400 bg-zinc-800",
    },
    {
      key: "critical",
      label: "Critical",
      count: severityCounts.critical || 0,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      activeBorder: "ring-2 ring-rose-500 bg-rose-500/20",
    },
    {
      key: "high",
      label: "High",
      count: severityCounts.high || 0,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      activeBorder: "ring-2 ring-orange-500 bg-orange-500/20",
    },
    {
      key: "medium",
      label: "Medium",
      count: severityCounts.medium || 0,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      activeBorder: "ring-2 ring-amber-500 bg-amber-500/20",
    },
    {
      key: "low",
      label: "Low",
      count: severityCounts.low || 0,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      activeBorder: "ring-2 ring-blue-500 bg-blue-500/20",
    },
    {
      key: "info",
      label: "Info",
      count: severityCounts.info || 0,
      color: "text-zinc-400 bg-zinc-800/40 border-zinc-700/50",
      activeBorder: "ring-2 ring-zinc-500 bg-zinc-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => {
        const isSelected = selectedSeverity === item.key;
        return (
          <button
            key={item.label}
            onClick={() => onSelectSeverity(isSelected ? null : item.key)}
            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] ${
              item.color
            } ${isSelected ? item.activeBorder : "opacity-90 hover:opacity-100"}`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              {item.label}
            </span>
            <span className="text-2xl font-bold font-mono mt-1">
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
