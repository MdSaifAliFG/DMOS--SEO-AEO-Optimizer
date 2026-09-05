"use client";

import React, { useState } from "react";
import { PageDetailDrawer } from "./PageDetailDrawer";
import { SEOPage } from "@/lib/types";

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
  onIndexabilityFilterChange: (indexable: boolean | null) => void;
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
  isLoading = false,
}: PagesTableProps) {
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const getStatusCodeBadge = (code: number) => {
    if (code >= 200 && code < 300) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (code >= 300 && code < 400) return "bg-blue-50 text-blue-700 border-blue-200";
    if (code >= 400 && code < 500) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <>
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
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
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
            {/* Status Code Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium">Status:</span>
              <select
                value={statusCodeFilter !== null && statusCodeFilter !== undefined ? statusCodeFilter : ""}
                onChange={(e) => onStatusCodeFilterChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs cursor-pointer font-medium"
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
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium">Indexable:</span>
              <select
                value={indexabilityFilter !== null && indexabilityFilter !== undefined ? String(indexabilityFilter) : ""}
                onChange={(e) =>
                  onIndexabilityFilterChange(e.target.value === "" ? null : e.target.value === "true")
                }
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs cursor-pointer font-medium"
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
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
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
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                    <p className="mt-2 text-xs">Loading crawled pages...</p>
                  </td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-xs font-semibold text-slate-700">No crawled pages found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting search filters or check status filters.</p>
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr
                    key={page.id}
                    onClick={() => setSelectedPage(page)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${getStatusCodeBadge(
                          page.status_code
                        )}`}
                      >
                        {page.status_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-mono text-emerald-700 font-medium text-xs truncate">
                        {page.url}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate mt-0.5">
                        {page.title || <span className="italic text-slate-400">No title found</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {page.crawl_depth ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      {page.word_count?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          page.is_indexable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {page.is_indexable ? "Indexable" : "Noindex"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {(page.issues_count ?? 0) > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {page.issues_count}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPage(page);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors font-semibold text-[11px] shadow-2xs cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{Math.min(total, (currentPage - 1) * pageSize + 1)}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(total, currentPage * pageSize)}</span> of{" "}
            <span className="font-bold text-slate-900">{total}</span> page{total === 1 ? "" : "s"}
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

      {/* Drawer */}
      <PageDetailDrawer
        isOpen={Boolean(selectedPage)}
        onClose={() => setSelectedPage(null)}
        scanId={scanId}
        page={selectedPage}
        pageUrl={selectedPage?.url}
      />
    </>
  );
}
