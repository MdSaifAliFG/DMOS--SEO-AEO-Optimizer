"use client";

import React, { useState } from "react";
import { IssueDetailModal } from "./IssueDetailModal";
import { SEOIssue } from "@/lib/types";

interface IssuesTableProps {
  issues: SEOIssue[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  selectedCategory: string | null;
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
  isLoading = false,
}: IssuesTableProps) {
  const [inspectIssue, setInspectIssue] = useState<SEOIssue | null>(null);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
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
    <>
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search issues or URLs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Category:</span>
            <select
              value={selectedCategory || ""}
              onChange={(e) => onCategoryChange(e.target.value ? e.target.value : null)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs font-medium cursor-pointer"
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
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-28">Severity</th>
                <th className="py-3.5 px-4 w-32">Category</th>
                <th className="py-3.5 px-4">Issue Details</th>
                <th className="py-3.5 px-4">Affected URL</th>
                <th className="py-3.5 px-4 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                    <p className="mt-2 text-xs">Loading detected issues...</p>
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="p-3 bg-emerald-50 rounded-full w-10 h-10 mx-auto flex items-center justify-center text-emerald-600 mb-2 border border-emerald-200">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">No issues found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting search filters or check another category.</p>
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => setInspectIssue(issue)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(
                          issue.severity
                        )}`}
                      >
                        {issue.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-800 text-xs">
                      {issue.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-xs">{issue.title}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{issue.description}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 max-w-xs truncate">
                      {issue.page_url ? (
                        <span className="text-emerald-700 font-medium">{issue.page_url}</span>
                      ) : (
                        <span className="italic text-slate-400">Site-wide / Scan Level</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectIssue(issue);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors font-semibold text-[11px] shadow-2xs cursor-pointer"
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
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{Math.min(total, (currentPage - 1) * pageSize + 1)}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(total, currentPage * pageSize)}</span> of{" "}
            <span className="font-bold text-slate-900">{total}</span> issue{total === 1 ? "" : "s"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 shadow-2xs transition-colors font-medium cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 font-mono font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 shadow-2xs transition-colors font-medium cursor-pointer"
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
