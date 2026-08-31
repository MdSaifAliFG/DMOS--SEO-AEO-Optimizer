"use client";

import React from "react";
import { SEOIssue } from "@/lib/types";

interface IssueDetailModalProps {
  issue: SEOIssue | null;
  onClose: () => void;
}

export function IssueDetailModal({ issue, onClose }: IssueDetailModalProps) {
  if (!issue) return null;

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase border ${getSeverityBadge(issue.severity)}`}>
                {issue.severity}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-300 uppercase border border-zinc-700">
                {issue.category}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Code: {issue.issue_code}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {issue.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Affected URL */}
          {issue.page_url && (
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Affected Webpage URL
              </div>
              <div className="font-mono text-xs text-emerald-400 break-all select-all">
                {issue.page_url}
              </div>
            </div>
          )}

          {/* Description / Why it matters */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Why This Matters
            </h4>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-sm text-zinc-200 leading-relaxed">
              {issue.description}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommended Fix
            </h4>
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-sm text-emerald-200/90 leading-relaxed">
              {issue.recommendation}
            </div>
          </div>

          {/* Raw Diagnostic Details */}
          {issue.details && Object.keys(issue.details).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Diagnostic Details
              </h4>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto select-all">
                {JSON.stringify(issue.details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
