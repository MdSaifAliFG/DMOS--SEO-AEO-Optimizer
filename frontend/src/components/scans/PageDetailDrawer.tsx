"use client";

import React, { useState, useEffect } from "react";
import { SEOPage, SEOPageDetail } from "@/lib/types";
import { api } from "@/lib/api-client";

interface PageDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scanId: string;
  page?: SEOPage | SEOPageDetail | null;
  pageUrl?: string | null;
  pageId?: string | null;
}

export function PageDetailDrawer({
  isOpen,
  onClose,
  scanId,
  page: initialPage,
  pageUrl,
  pageId,
}: PageDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "headings" | "images" | "links" | "issues">("overview");
  const [pageDetail, setPageDetail] = useState<SEOPageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const targetIdentifier = initialPage?.id || pageId || initialPage?.url || pageUrl;

  useEffect(() => {
    if (isOpen && targetIdentifier) {
      setIsLoading(true);
      api
        .getPageDetails(scanId, targetIdentifier)
        .then((res) => {
          setPageDetail(res);
        })
        .catch((err) => {
          console.error("Failed to load page inspection details:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setPageDetail(null);
    }
  }, [isOpen, scanId, targetIdentifier]);

  if (!isOpen) return null;

  const page = pageDetail || (initialPage as unknown as SEOPageDetail) || null;

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60";
    if (code >= 300 && code < 400) return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60";
    if (code >= 400 && code < 500) return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-800/60";
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-full flex flex-col bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-start justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {page && (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${getStatusBadge(page.status_code)}`}>
                  HTTP {page.status_code}
                </span>
              )}
              {page?.is_indexable ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                  Indexable
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60">
                  Noindex
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Depth: {page?.crawl_depth ?? 0}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono truncate select-all">
              {page?.url || "Loading page inspection..."}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close drawer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-3 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs overflow-x-auto flex-nowrap">
          {[
            { key: "overview", label: "Overview & Meta" },
            { key: "headings", label: `Headings (${(page?.headings?.h1?.length || 0) + (page?.headings?.h2?.length || 0)})` },
            { key: "images", label: `Images (${page?.images?.length || 0})` },
            { key: "links", label: `Links (${page?.links?.length || 0})` },
            { key: "issues", label: `Issues (${page?.issues?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-3.5 font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.key
                  ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading || !page ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-blue-600 border-t-transparent" />
              <p className="mt-3 text-xs">Fetching in-depth page audit...</p>
            </div>
          ) : activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Response Time</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-1">
                    {page.response_time}s
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Word Count</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-1">
                    {page.word_count} words
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Content Size</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-1">
                    {(page.content_length / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Language</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-1">
                    {page.language || "Not specified"}
                  </div>
                </div>
              </div>

              {/* SERP Snippet Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Search Engine Result Preview (SERP)
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 font-sans">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{page.url}</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {page.title || <span className="text-rose-600 dark:text-rose-400 italic">[Missing Title Tag]</span>}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {page.meta_description || <span className="text-amber-600 dark:text-amber-400 italic">[No Meta Description Provided]</span>}
                  </div>
                </div>
              </div>

              {/* Canonical & Directives */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Indexing Directives
                </h4>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Canonical Tag:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-md">
                      {page.canonical_url || <span className="text-amber-600 dark:text-amber-400 font-sans">None</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Robots Meta Directive:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {page.robots_directive || "Default (index, follow)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">X-Robots-Tag Header:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {page.x_robots_tag || "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "headings" ? (
            <div className="space-y-6">
              {/* H1 Headings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    H1 Headings ({page.headings?.h1?.length || 0})
                  </h4>
                  {page.h1_count !== 1 && (
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                      {page.h1_count === 0 ? "Missing H1" : "Multiple H1s"}
                    </span>
                  )}
                </div>
                {!page.headings?.h1 || page.headings.h1.length === 0 ? (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 font-medium">
                    No &lt;h1&gt; tags found on this page.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {page.headings.h1.map((h, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* H2 Headings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  H2 Headings ({page.headings?.h2?.length || 0})
                </h4>
                {!page.headings?.h2 || page.headings.h2.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                    No &lt;h2&gt; subheadings found.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {page.headings.h2.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "images" ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>All image assets detected on this webpage.</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Total: {page.images?.length || 0}</span>
              </div>

              {!page.images || page.images.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                  No images found on this page.
                </div>
              ) : (
                <div className="space-y-2">
                  {page.images.map((img, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="font-mono text-slate-800 dark:text-slate-200 font-medium truncate">{img.src}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">ALT:</span>
                          {img.alt === null ? (
                            <span className="text-rose-700 dark:text-rose-400 font-bold">[MISSING ALT ATTRIBUTE]</span>
                          ) : img.alt === "" ? (
                            <span className="text-slate-400 italic">alt=&quot;&quot; (Decorative)</span>
                          ) : (
                            <span className="text-emerald-700 dark:text-emerald-300 font-medium">&quot;{img.alt}&quot;</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {img.width && img.height ? `${img.width}x${img.height}` : "Auto"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "links" ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Internal and external links discovered on this page.</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Total: {page.links?.length || 0}</span>
              </div>

              {!page.links || page.links.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                  No links found on this page.
                </div>
              ) : (
                <div className="space-y-2">
                  {page.links.map((link, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="font-mono text-slate-800 dark:text-slate-200 font-medium truncate">{link.target_url}</div>
                        <div className="text-slate-500 dark:text-slate-400 truncate">
                          Anchor: <span className="text-slate-800 dark:text-slate-200 font-medium">{link.anchor_text || <span className="italic text-slate-400">(no anchor text)</span>}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold border ${
                            link.is_internal
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60"
                          }`}
                        >
                          {link.link_type}
                        </span>
                        {!link.is_follow && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                            Nofollow
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {!page.issues || page.issues.length === 0 ? (
                <div className="p-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                  ✓ No technical SEO issues detected on this webpage.
                </div>
              ) : (
                page.issues.map((iss) => (
                  <div key={iss.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{iss.title}</span>
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                        {iss.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{iss.description}</p>
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      Fix: {iss.recommendation}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
