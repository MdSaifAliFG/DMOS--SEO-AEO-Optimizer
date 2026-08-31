"use client";

import React, { useState } from "react";
import { SEOPage } from "@/lib/types";
import { PageDetailDrawer } from "./PageDetailDrawer";

interface PagesTableProps {
  scanId: string;
  pages: SEOPage[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusCodeFilter?: number | null;
  onStatusCodeFilterChange: (code: number | null) => void;
  indexabilityFilter?: boolean | null;
  onIndexabilityFilterChange: (val: boolean | null) => void;
  isLoading?: boolean;
}

export function PagesTable({
  scanId,
  pages,
  total,
  currentPage,
  pageSize,
  onPageChange,
  searchQuery,
  onSearchChange,
  statusCodeFilter,
  onStatusCodeFilterChange,
  indexabilityFilter,
  onIndexabilityFilterChange,
  isLoading,
}: PagesTableProps) {
  const [inspectPageId, setInspectPageId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (code >= 300 && code < 400) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (code >= 400 && code < 500) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <>
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
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
              placeholder="Search crawled URLs or titles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
            {/* Status Code Filter */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Status:</span>
              <select
                value={statusCodeFilter !== null && statusCodeFilter !== undefined ? statusCodeFilter : ""}
                onChange={(e) => onStatusCodeFilterChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="200">200 OK</option>
                <option value="301">301 Redirect</option>
                <option value="302">302 Redirect</option>
                <option value="404">404 Not Found</option>
                <option value="500">500 Server Error</option>
              </select>
            </div>

            {/* Indexability Filter */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Indexable:</span>
              <select
                value={indexabilityFilter !== null && indexabilityFilter !== undefined ? String(indexabilityFilter) : ""}
                onChange={(e) =>
                  onIndexabilityFilterChange(e.target.value === "" ? null : e.target.value === "true")
                }
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">All Pages</option>
                <option value="true">Indexable Only</option>
                <option value="false">Noindex Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-24">Status</th>
                <th className="py-3.5 px-4">Webpage URL & Title</th>
                <th className="py-3.5 px-4 w-20 text-center">Depth</th>
                <th className="py-3.5 px-4 w-24 text-right">Words</th>
                <th className="py-3.5 px-4 w-28 text-center">Indexable</th>
                <th className="py-3.5 px-4 w-20 text-center">Issues</th>
                <th className="py-3.5 px-4 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                    <p className="mt-2 text-xs">Loading crawled pages...</p>
                  </td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <p className="text-sm font-medium text-white">No pages found</p>
                    <p className="text-xs text-zinc-400 mt-0.5">No crawled pages matched your search or filters.</p>
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setInspectPageId(p.id)}
                    className="hover:bg-zinc-900/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(p.status_code)}`}>
                        {p.status_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-mono text-emerald-400/90 truncate">{p.url}</div>
                      <div className="text-[11px] text-zinc-300 font-medium truncate mt-0.5">
                        {p.title || <span className="italic text-zinc-400">(no title tag)</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-zinc-400">
                      {p.crawl_depth}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {p.word_count}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {p.is_indexable ? (
                        <span className="text-[11px] font-semibold text-emerald-400">Yes</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {p.issues_count > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {p.issues_count}
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-xs">✓ 0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectPageId(p.id);
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
            <span className="font-semibold text-white">{total}</span> page{total === 1 ? "" : "s"}
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

      {/* Page Audit Drawer */}
      <PageDetailDrawer
        scanId={scanId}
        pageId={inspectPageId}
        onClose={() => setInspectPageId(null)}
      />
    </>
  );
}
