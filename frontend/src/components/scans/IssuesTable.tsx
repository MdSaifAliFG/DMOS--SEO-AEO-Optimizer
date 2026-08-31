"use client";

import React, { useState } from "react";
import { SEOIssue, SEOSeverity } from "@/lib/types";
import { IssueDetailModal } from "./IssueDetailModal";

interface IssuesTableProps {
  issues: SEOIssue[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  selectedSeverity?: string | null;
  selectedCategory?: string | null;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export function IssuesTable({
  issues,
  total,
  currentPage,
  pageSize,
  onPageChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  isLoading,
}: IssuesTableProps) {
  const [inspectIssue, setInspectIssue] = useState<SEOIssue | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
    <>
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search issues or URLs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Category:</span>
            <select
              value={selectedCategory || ""}
              onChange={(e) => onCategoryChange(e.target.value ? e.target.value : null)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">All Categories</option>
              <option value="technical">Technical SEO</option>
              <option value="indexability">Indexability</option>
              <option value="metadata">Metadata & Content</option>
              <option value="links">Link Structure</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-28">Severity</th>
                <th className="py-3.5 px-4 w-32">Category</th>
                <th className="py-3.5 px-4">Issue Details</th>
                <th className="py-3.5 px-4">Affected URL</th>
                <th className="py-3.5 px-4 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                    <p className="mt-2 text-xs">Loading detected issues...</p>
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    <div className="p-3 bg-zinc-900 rounded-full w-10 h-10 mx-auto flex items-center justify-center text-emerald-400 mb-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-white">No issues found</p>
                    <p className="text-xs text-zinc-400 mt-0.5">No issues match the selected filters.</p>
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => setInspectIssue(issue)}
                    className="hover:bg-zinc-900/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadge(
                          issue.severity
                        )}`}
                      >
                        {issue.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400 capitalize">
                      {issue.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{issue.title}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                        {issue.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400 max-w-xs truncate">
                      {issue.page_url ? (
                        <span className="text-emerald-400/90">{issue.page_url}</span>
                      ) : (
                        <span className="italic text-zinc-400">Site-wide / Scan Level</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectIssue(issue);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors font-medium text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400">
          <div>
            Showing <span className="font-semibold text-white">{Math.min(total, (currentPage - 1) * pageSize + 1)}</span> to{" "}
            <span className="font-semibold text-white">{Math.min(total, currentPage * pageSize)}</span> of{" "}
            <span className="font-semibold text-white">{total}</span> issue{total === 1 ? "" : "s"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Modal */}
      <IssueDetailModal
        issue={inspectIssue}
        onClose={() => setInspectIssue(null)}
      />
    </>
  );
}
