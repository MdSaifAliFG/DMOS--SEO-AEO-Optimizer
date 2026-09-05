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
      color: "text-slate-800 bg-white border-slate-200 shadow-2xs",
      activeBorder: "ring-2 ring-blue-600 bg-blue-50/80 text-blue-800 border-blue-300",
    },
    {
      key: "critical",
      label: "Critical",
      count: severityCounts.critical || 0,
      color: "text-rose-700 bg-rose-50/80 border-rose-200",
      activeBorder: "ring-2 ring-rose-500 bg-rose-100/70 border-rose-300",
    },
    {
      key: "high",
      label: "High",
      count: severityCounts.high || 0,
      color: "text-orange-700 bg-orange-50/80 border-orange-200",
      activeBorder: "ring-2 ring-orange-500 bg-orange-100/70 border-orange-300",
    },
    {
      key: "medium",
      label: "Medium",
      count: severityCounts.medium || 0,
      color: "text-amber-700 bg-amber-50/80 border-amber-200",
      activeBorder: "ring-2 ring-amber-500 bg-amber-100/70 border-amber-300",
    },
    {
      key: "low",
      label: "Low",
      count: severityCounts.low || 0,
      color: "text-blue-700 bg-blue-50/80 border-blue-200",
      activeBorder: "ring-2 ring-blue-500 bg-blue-100/70 border-blue-300",
    },
    {
      key: "info",
      label: "Info",
      count: severityCounts.info || 0,
      color: "text-slate-600 bg-slate-50 border-slate-200",
      activeBorder: "ring-2 ring-slate-500 bg-slate-100 border-slate-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {items.map((item) => {
        const isSelected = selectedSeverity === item.key;
        return (
          <button
            key={item.label}
            onClick={() => onSelectSeverity(isSelected ? null : item.key)}
            className={`p-2.5 sm:p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer min-h-[70px] sm:min-h-[80px] ${
              item.color
            } ${isSelected ? item.activeBorder : "hover:border-slate-300"}`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-80 truncate w-full">
              {item.label}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono mt-1">
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
