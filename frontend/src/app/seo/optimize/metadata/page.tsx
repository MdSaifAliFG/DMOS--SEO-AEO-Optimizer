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
  ArrowRight,
  ChevronRight,
  Sliders,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
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
        setProjects(res.projects);
        if (res.projects.length > 0) {
          setSelectedProjectId(res.projects[0].id);
          setBrandName(res.projects[0].name || "DMOS");
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
        const latestScan = scansRes.scans.find((s: any) => s.status === "completed") || scansRes.scans[0];
        if (latestScan) {
          const res = await api.getScanPages(latestScan.id, { page_size: 50 });
          setPages(res.pages);
          if (res.pages.length > 0) {
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

      setTitleSuggestions(titleRes.suggestions);
      setDescriptionSuggestions(descRes.suggestions);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI & Rule-Based Generator
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Metadata Optimizer
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Generate high-CTR title tags, compelling meta descriptions, and preview live Google SERP snippets.
          </p>
        </div>

        {/* Project Selector & Actions Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400 font-medium">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/seo/actions"
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            ← Back to Actions
          </Link>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs & Current Tags (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Page Selector & Context Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              1. Target Page & Strategy Context
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Select Crawled Page</label>
                <select
                  value={selectedPageId}
                  onChange={(e) => handlePageSelect(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900">
                      {p.url.replace(/^https?:\/\/[^/]+/, "") || "/"} ({p.title ? p.title.slice(0, 30) : "No Title"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Target Primary Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. SEO Optimization Platform"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. DMOS"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Target Page URL</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Generating AI & Smart Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate 3 Optimized Variations
                </>
              )}
            </button>
          </div>

          {/* Current / Editable Metadata Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              2. Title & Meta Description Editor
            </h3>

            {/* Title Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Page Title (<span className="text-slate-400 font-mono">&lt;title&gt;</span>)</label>
                <span
                  className={cn(
                    "text-xs font-mono font-bold px-2 py-0.5 rounded",
                    titleLen >= 50 && titleLen <= 60 && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                    titleLen < 50 && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                    titleLen > 60 && "bg-rose-500/15 text-rose-400 border border-rose-500/30"
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
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-3 text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Description Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Meta Description (<span className="text-slate-400 font-mono">&lt;meta name="description"&gt;</span>)
                </label>
                <span
                  className={cn(
                    "text-xs font-mono font-bold px-2 py-0.5 rounded",
                    descLen >= 120 && descLen <= 160 && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                    descLen < 120 && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                    descLen > 160 && "bg-rose-500/15 text-rose-400 border border-rose-500/30"
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
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-3 text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Generated Suggestions List */}
          {(titleSuggestions.length > 0 || descriptionSuggestions.length > 0) && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 animate-fadeIn">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                3. Generated Optimization Suggestions
              </h3>

              {/* Title Suggestions */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-300">Title Variations</div>
                <div className="space-y-2">
                  {titleSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-100">{s.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="font-mono text-emerald-400">{s.character_count} chars</span>
                          <span>•</span>
                          <span className="text-slate-500 capitalize">{s.length_status.replace("_", " ")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(s.title, `t-${idx}`)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                          title="Copy title"
                        >
                          {copiedField === `t-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => applyTitle(s.title)}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition"
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
                <div className="text-xs font-semibold text-slate-300">Meta Description Variations</div>
                <div className="space-y-2">
                  {descriptionSuggestions.map((d, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="flex-1">
                        <div className="text-xs text-slate-200 leading-relaxed">{d.description}</div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span className="font-mono text-emerald-400">{d.character_count} chars</span>
                          <span>•</span>
                          <span className="text-slate-500">CTA Included</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard(d.description, `d-${idx}`)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                          title="Copy description"
                        >
                          {copiedField === `d-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => applyDescription(d.description)}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition"
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                Google SERP Preview
              </h3>

              {/* Device Toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition flex items-center gap-1",
                    previewDevice === "desktop" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  <Monitor className="w-3 h-3" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition flex items-center gap-1",
                    previewDevice === "mobile" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  <Smartphone className="w-3 h-3" /> Mobile
                </button>
              </div>
            </div>

            {/* Google Search Result Card */}
            <div
              className={cn(
                "bg-[#202124] rounded-xl p-4 border border-slate-700 shadow-xl transition-all font-sans",
                previewDevice === "mobile" ? "max-w-[340px] mx-auto rounded-2xl" : "w-full"
              )}
            >
              {/* SERP URL / Favicon Row */}
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[12px] text-[#dadce0] font-medium leading-none truncate">
                    {brandName || "example.com"}
                  </div>
                  <div className="text-[11px] text-[#bdc1c6] font-mono leading-tight truncate">
                    {targetUrl || "https://example.com/page"}
                  </div>
                </div>
              </div>

              {/* SERP Headline */}
              <div className="text-[#8ab4f8] hover:underline text-[16px] leading-snug font-medium cursor-pointer break-words mb-1">
                {currentTitle || "Untitled Page — Add Title Tag in Editor"}
              </div>

              {/* SERP Snippet Text */}
              <div className="text-[#bdc1c6] text-[13px] leading-relaxed break-words line-clamp-3">
                {currentDescription ||
                  "No meta description provided. Search engines will pull arbitrary body text from the page which may reduce organic click-through rates."}
              </div>
            </div>

            {/* Optimization Status Warnings */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                {titleLen >= 50 && titleLen <= 60 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  Title Tag: {titleLen} chars (Recommended: 50–60)
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 font-medium">
                {descLen >= 120 && descLen <= 160 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  Meta Description: {descLen} chars (Recommended: 120–160)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
