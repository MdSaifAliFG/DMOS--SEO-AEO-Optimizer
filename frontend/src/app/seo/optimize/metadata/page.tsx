"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Globe,
  Copy,
  Check,
  Smartphone,
  Monitor,
  RefreshCw,
  Sliders,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import {
  Project,
  SEOPage,
  TitleSuggestion,
  DescriptionSuggestion,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MetadataOptimizerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  // Working inputs
  const [targetUrl, setTargetUrl] = useState<string>("https://example.com");
  const [targetKeyword, setTargetKeyword] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [contentSnippet, setContentSnippet] = useState<string>("");

  // Current values
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentDescription, setCurrentDescription] = useState<string>("");

  // Generated suggestions
  const [titleSuggestions, setTitleSuggestions] = useState<TitleSuggestion[]>([]);
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<DescriptionSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Preview Mode: desktop vs mobile
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Load Projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getProjects({ limit: 50 });
        setProjects(res.projects || []);
        if (res.projects?.length > 0) {
          setSelectedProjectId(res.projects[0].id);
          setBrandName(res.projects[0].name || "SeoSensing");
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProjects();
  }, []);

  // Load Pages when Project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadPages() {
      try {
        const scansRes = await api.getProjectScans(selectedProjectId, { limit: 5 });
        const latestScan = scansRes.scans?.find((s: any) => s.status === "completed") || scansRes.scans?.[0];
        if (latestScan) {
          const res = await api.getScanPages(latestScan.id, { page_size: 50 });
          setPages(res.pages || []);
          if (res.pages?.length > 0) {
            const firstPage = res.pages[0];
            setSelectedPageId(firstPage.id);
            setTargetUrl(firstPage.url);
            setCurrentTitle(firstPage.title || "");
            setCurrentDescription(firstPage.meta_description || "");
          }
        } else {
          setPages([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPages();
  }, [selectedProjectId]);

  // When selected page changes
  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    const p = pages.find((item) => item.id === pageId);
    if (p) {
      setTargetUrl(p.url);
      setCurrentTitle(p.title || "");
      setCurrentDescription(p.meta_description || "");
    }
  };

  // Generate Suggestions
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const [titleRes, descRes] = await Promise.all([
        api.optimizeTitle({
          current_title: currentTitle,
          target_url: targetUrl,
          target_keyword: targetKeyword,
          brand_name: brandName,
          page_content_snippet: contentSnippet,
        }),
        api.optimizeDescription({
          current_description: currentDescription,
          target_url: targetUrl,
          target_keyword: targetKeyword,
          brand_name: brandName,
          page_content_snippet: contentSnippet,
        }),
      ]);

      setTitleSuggestions(titleRes.suggestions || []);
      setDescriptionSuggestions(descRes.suggestions || []);
    } catch (err: any) {
      alert(`Generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const applyTitle = (title: string) => {
    setCurrentTitle(title);
  };

  const applyDescription = (desc: string) => {
    setCurrentDescription(desc);
  };

  // Character lengths
  const titleLen = currentTitle.length;
  const descLen = currentDescription.length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Banner / Header (Cohesive Sky Blue SEO Identity) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-cyan-900 to-slate-900 text-white shadow-md border border-sky-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
                <Sparkles className="w-5 h-5 text-sky-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Metadata Optimizer</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/20">
                AI & Rule-Based
              </span>
            </div>
            <p className="text-xs text-sky-200/80 max-w-2xl">
              Generate high-CTR title tags, compelling meta descriptions, and preview live Google SERP snippets.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <div className="flex items-center gap-2 bg-sky-950/80 border border-sky-700/60 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-sky-200">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              href="/seo/actions"
              className="px-3 py-1.5 text-xs font-medium bg-sky-900/60 hover:bg-sky-800/60 text-sky-100 rounded-xl border border-sky-700/60 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Actions
            </Link>
          </div>
        </div>

        {/* Main 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Inputs & Current Tags (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Target Page Selector & Context Input */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                1. Target Page & Strategy Context
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Select Crawled Page</label>
                  <select
                    value={selectedPageId}
                    onChange={(e) => handlePageSelect(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  >
                    {pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.url.replace(/^https?:\/\/[^/]+/, "") || "/"} ({p.title ? p.title.slice(0, 30) : "No Title"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Target Primary Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g. SEO Optimization Platform"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. SeoSensing"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Target Page URL</label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Generating AI & Rule-Based Suggestions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate 3 Optimized Variations
                  </>
                )}
              </button>
            </div>

            {/* Current / Editable Metadata Editor */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-600" />
                2. Title & Meta Description Editor
              </h3>

              {/* Title Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Page Title (<span className="text-slate-500 font-mono">&lt;title&gt;</span>)</label>
                  <span
                    className={cn(
                      "text-xs font-mono font-bold px-2 py-0.5 rounded-full border",
                      titleLen >= 50 && titleLen <= 60 && "bg-sky-50 text-sky-700 border-sky-200",
                      titleLen < 50 && "bg-amber-50 text-amber-700 border-amber-200",
                      titleLen > 60 && "bg-rose-50 text-rose-700 border-rose-200"
                    )}
                  >
                    {titleLen} / 60 chars {titleLen > 60 ? "(Truncated)" : titleLen < 50 ? "(Short)" : "(Optimal)"}
                  </span>
                </div>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="Enter page title tag..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              {/* Description Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Meta Description (<span className="text-slate-500 font-mono">&lt;meta name="description"&gt;</span>)
                  </label>
                  <span
                    className={cn(
                      "text-xs font-mono font-bold px-2 py-0.5 rounded-full border",
                      descLen >= 120 && descLen <= 160 && "bg-sky-50 text-sky-700 border-sky-200",
                      descLen < 120 && "bg-amber-50 text-amber-700 border-amber-200",
                      descLen > 160 && "bg-rose-50 text-rose-700 border-rose-200"
                    )}
                  >
                    {descLen} / 160 chars {descLen > 160 ? "(Truncated)" : descLen < 120 ? "(Short)" : "(Optimal)"}
                  </span>
                </div>
                <textarea
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  placeholder="Enter meta description tag..."
                  rows={3}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>
            </div>

            {/* Generated Suggestions List */}
            {(titleSuggestions.length > 0 || descriptionSuggestions.length > 0) && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  3. Generated Optimization Suggestions
                </h3>

                {/* Title Suggestions */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700">Title Variations</div>
                  <div className="space-y-2">
                    {titleSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 hover:border-sky-200 hover:bg-sky-50/30 transition"
                      >
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-slate-900">{s.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-sky-600 font-semibold">{s.character_count} chars</span>
                            <span>•</span>
                            <span className="text-slate-500 capitalize">{s.length_status.replace("_", " ")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(s.title, `t-${idx}`)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
                            title="Copy title"
                          >
                            {copiedField === `t-${idx}` ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => applyTitle(s.title)}
                            className="px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition shadow-xs cursor-pointer"
                          >
                            Use Title
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description Suggestions */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700">Meta Description Variations</div>
                  <div className="space-y-2">
                    {descriptionSuggestions.map((d, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 hover:border-sky-200 hover:bg-sky-50/30 transition"
                      >
                        <div className="flex-1">
                          <div className="text-xs text-slate-800 leading-relaxed">{d.description}</div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                            <span className="font-mono text-sky-600 font-semibold">{d.character_count} chars</span>
                            <span>•</span>
                            <span className="text-slate-500">CTA Included</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => copyToClipboard(d.description, `d-${idx}`)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
                            title="Copy description"
                          >
                            {copiedField === `d-${idx}` ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => applyDescription(d.description)}
                            className="px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition shadow-xs cursor-pointer"
                          >
                            Use Description
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Google SERP Snippet Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4 text-sky-600" />
                  Google SERP Preview
                </h3>

                {/* Device Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium",
                      previewDevice === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <Monitor className="w-3 h-3" /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium",
                      previewDevice === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <Smartphone className="w-3 h-3" /> Mobile
                  </button>
                </div>
              </div>

              {/* Google Search Result Card */}
              <div
                className={cn(
                  "bg-white rounded-xl p-4 border border-slate-200 shadow-xs transition-all font-sans",
                  previewDevice === "mobile" ? "max-w-[340px] mx-auto rounded-2xl border-slate-300" : "w-full"
                )}
              >
                {/* SERP URL / Favicon Row */}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sky-600 shrink-0 border border-slate-200">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[12px] text-[#202124] font-medium leading-none truncate">
                      {brandName || "example.com"}
                    </div>
                    <div className="text-[11px] text-[#4d5156] font-mono leading-tight truncate">
                      {targetUrl || "https://example.com/page"}
                    </div>
                  </div>
                </div>

                {/* SERP Headline */}
                <div className="text-[#1a0dab] hover:underline text-[17px] leading-snug font-medium cursor-pointer break-words mb-1">
                  {currentTitle || "Untitled Page — Add Title Tag in Editor"}
                </div>

                {/* SERP Snippet Text */}
                <div className="text-[#4d5156] text-[13px] leading-relaxed break-words line-clamp-3">
                  {currentDescription ||
                    "No meta description provided. Search engines will pull arbitrary body text from the page which may reduce organic click-through rates."}
                </div>
              </div>

              {/* Optimization Status Warnings */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  {titleLen >= 50 && titleLen <= 60 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    Title Tag: <strong className="text-slate-900">{titleLen} chars</strong> (Recommended: 50–60)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  {descLen >= 120 && descLen <= 160 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    Meta Description: <strong className="text-slate-900">{descLen} chars</strong> (Recommended: 120–160)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
