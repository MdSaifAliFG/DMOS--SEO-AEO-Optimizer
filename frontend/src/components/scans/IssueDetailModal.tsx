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
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border ${getSeverityBadge(issue.severity)}`}>
                {issue.severity}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 uppercase border border-slate-200">
                {issue.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Code: {issue.issue_code}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {issue.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
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
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Affected Webpage URL
              </div>
              <div className="font-mono text-xs text-emerald-700 font-medium break-all select-all">
                {issue.page_url}
              </div>
            </div>
          )}

          {/* Description / Why it matters */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Why This Matters
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
              {issue.description}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommended Fix
            </h4>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-sm text-emerald-800 leading-relaxed font-medium">
              {issue.recommendation}
            </div>
          </div>

          {/* Raw Diagnostic Details */}
          {issue.details && Object.keys(issue.details).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Diagnostic Details
              </h4>
              <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto select-all">
                {JSON.stringify(issue.details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
