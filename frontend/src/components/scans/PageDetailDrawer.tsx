"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { SEOPageDetail } from "@/lib/types";

interface PageDetailDrawerProps {
  scanId: string;
  pageId: string | null;
  onClose: () => void;
}

export function PageDetailDrawer({
  scanId,
  pageId,
  onClose,
}: PageDetailDrawerProps) {
  const [page, setPage] = useState<SEOPageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "headings" | "images" | "links" | "issues">("overview");

  useEffect(() => {
    if (!pageId) {
      setPage(null);
      return;
    }

    let isMounted = true;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await api.getScanPageDetail(scanId, pageId);
        if (isMounted) setPage(data);
      } catch (err) {
        console.error("Failed to load page detail:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [scanId, pageId]);

  if (!pageId) return null;

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (code >= 300 && code < 400) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (code >= 400 && code < 500) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-3xl h-full flex flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/60 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {page && (
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${getStatusBadge(page.status_code)}`}>
                  HTTP {page.status_code}
                </span>
              )}
              {page?.is_indexable ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Indexable
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Noindex
                </span>
              )}
              <span className="text-xs text-zinc-400 font-mono">
                Depth: {page?.crawl_depth ?? 0}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white font-mono truncate select-all">
              {page?.url || "Loading page inspection..."}
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-zinc-800 bg-zinc-900/30 text-xs">
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
              className={`py-3 px-3.5 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-emerald-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading || !page ? (
            <div className="py-20 text-center text-zinc-400">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-emerald-500 border-t-transparent" />
              <p className="mt-3 text-xs">Fetching in-depth page audit...</p>
            </div>
          ) : activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Response Time</span>
                  <div className="text-base font-bold text-white font-mono mt-1">
                    {page.response_time}s
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Word Count</span>
                  <div className="text-base font-bold text-white font-mono mt-1">
                    {page.word_count} words
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Content Size</span>
                  <div className="text-base font-bold text-white font-mono mt-1">
                    {(page.content_length / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Language</span>
                  <div className="text-base font-bold text-white font-mono mt-1">
                    {page.language || "Not specified"}
                  </div>
                </div>
              </div>

              {/* SERP Snippet Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Search Engine Result Preview (SERP)
                </h4>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 font-sans">
                  <div className="text-xs text-zinc-400 font-mono truncate">{page.url}</div>
                  <div className="text-sm font-medium text-blue-400 hover:underline cursor-pointer">
                    {page.title || <span className="text-rose-400 italic">[Missing Title Tag]</span>}
                  </div>
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    {page.meta_description || <span className="text-amber-400 italic">[No Meta Description Provided]</span>}
                  </div>
                </div>
              </div>

              {/* Canonical & Directives */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Indexing Directives
                </h4>
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800 text-xs">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-zinc-400">Canonical Tag:</span>
                    <span className="font-mono text-zinc-200 truncate max-w-md">
                      {page.canonical_url || <span className="text-amber-400">None</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-zinc-400">Robots Meta Directive:</span>
                    <span className="font-mono text-zinc-200">
                      {page.robots_directive || "Default (index, follow)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-zinc-400">X-Robots-Tag Header:</span>
                    <span className="font-mono text-zinc-200">
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
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    H1 Headings ({page.headings?.h1?.length || 0})
                  </h4>
                  {page.h1_count !== 1 && (
                    <span className="text-[11px] text-amber-400 font-medium">
                      {page.h1_count === 0 ? "Missing H1" : "Multiple H1s"}
                    </span>
                  )}
                </div>
                {!page.headings?.h1 || page.headings.h1.length === 0 ? (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                    No &lt;h1&gt; tags found on this page.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {page.headings.h1.map((h, i) => (
                      <div key={i} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-semibold text-white">
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* H2 Headings */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  H2 Headings ({page.headings?.h2?.length || 0})
                </h4>
                {!page.headings?.h2 || page.headings.h2.length === 0 ? (
                  <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
                    No &lt;h2&gt; subheadings found.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {page.headings.h2.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200">
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "images" ? (
            <div className="space-y-3">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>All image assets detected on this webpage.</span>
                <span>Total: {page.images?.length || 0}</span>
              </div>

              {!page.images || page.images.length === 0 ? (
                <div className="p-6 rounded-xl bg-zinc-900 text-center text-xs text-zinc-400">
                  No images found on this page.
                </div>
              ) : (
                <div className="space-y-2">
                  {page.images.map((img, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="font-mono text-zinc-200 truncate">{img.src}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">ALT:</span>
                          {img.alt === null ? (
                            <span className="text-rose-400 font-semibold">[MISSING ALT ATTRIBUTE]</span>
                          ) : img.alt === "" ? (
                            <span className="text-zinc-400 italic">alt=&quot;&quot; (Decorative)</span>
                          ) : (
                            <span className="text-emerald-400">&quot;{img.alt}&quot;</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                        {img.width && img.height ? `${img.width}x${img.height}` : "Auto"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "links" ? (
            <div className="space-y-3">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Internal and external links discovered on this page.</span>
                <span>Total: {page.links?.length || 0}</span>
              </div>

              {!page.links || page.links.length === 0 ? (
                <div className="p-6 rounded-xl bg-zinc-900 text-center text-xs text-zinc-400">
                  No links found on this page.
                </div>
              ) : (
                <div className="space-y-2">
                  {page.links.map((link, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="font-mono text-zinc-200 truncate">{link.target_url}</div>
                        <div className="text-zinc-400 truncate">
                          Anchor: <span className="text-white">{link.anchor_text || <span className="italic text-zinc-400">(no anchor text)</span>}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                            link.is_internal
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {link.link_type}
                        </span>
                        {!link.is_follow && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 font-mono">
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
                <div className="p-8 rounded-xl bg-zinc-900 text-center text-xs text-emerald-400">
                  ✓ No technical SEO issues detected on this webpage.
                </div>
              ) : (
                page.issues.map((iss) => (
                  <div key={iss.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{iss.title}</span>
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-400">{iss.severity}</span>
                    </div>
                    <p className="text-xs text-zinc-300">{iss.description}</p>
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
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
