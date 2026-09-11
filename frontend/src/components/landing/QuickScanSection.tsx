"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Zap,
  Info,
  CheckCircle2,
  Globe,
  ArrowRight,
  TrendingUp,
  X,
  AlertCircle,
  Scan,
  Bot,
  Sparkles,
  Clock,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Layers,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

// Use relative URL so Next.js proxy handles routing to the backend
const API_BASE = "/api/v1";

// ─────────────────────────────────────────────
// TYPES (match backend QuickScanResponse)
// ─────────────────────────────────────────────
interface ScanIssue {
  severity: "critical" | "warning" | "info";
  pillar: "seo" | "aeo" | "geo";
  code: string;
  label: string;
  why?: string;
  how_to_fix?: string;
  business_impact?: string;
  badge: "Fix" | "Warning" | "Info";
}

interface QuickWin {
  severity: string;
  label: string;
  why: string;
  how_to_fix: string;
  business_impact: string;
}

interface PillarScore {
  score: number;
  label: string;
  checks: number;
  issues: number;
  na_count: number;
}

interface SiteCrawledPage {
  url: string;
  display_url: string;
  path: string;
  seo_score: number;
  aeo_score: number;
  geo_score: number;
  overall_score: number;
  issues_count: number;
  status_code: number;
}

interface CommonIssue {
  code: string;
  label: string;
  severity: string;
  pillar: string;
  affected_pages_count: number;
  total_pages_count: number;
  fraction: string;
  percentage: number;
  why?: string;
  how_to_fix?: string;
}

interface SiteReport {
  domain: string;
  total_pages: number;
  average_overall_score: number;
  average_seo_score: number;
  average_aeo_score: number;
  average_geo_score: number;
  grade: string;
  pages: SiteCrawledPage[];
  most_common_issues: CommonIssue[];
}

interface QuickScanResult {
  url: string;
  final_url: string;
  mode: string;
  overall_score: number;
  grade: string;
  seo: PillarScore;
  aeo: PillarScore;
  geo: PillarScore;
  quick_wins: QuickWin[];
  issues: ScanIssue[];
  site_report?: SiteReport | null;
  detected_tech?: string;
  detected_confidence: number;
  scan_duration_ms: number;
  checks_run: number;
  success: boolean;
}

type ScanState = "idle" | "scanning" | "done" | "error";
type TabType = "seo" | "aeo" | "geo";

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-rose-600";
};

// ─────────────────────────────────────────────
// SVG SCORE RING
// ─────────────────────────────────────────────
const ScoreRing: React.FC<{
  score: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor?: string;
  badgeColor?: string;
  badgeText?: string;
  animate?: boolean;
}> = ({
  score,
  size = 80,
  strokeWidth = 7,
  color,
  trackColor = "#f1f5f9",
  badgeColor,
  badgeText,
  animate = false,
}) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={animate ? offset : circ}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{score}</span>
        </div>
      </div>
      {badgeText && (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
          style={{ color: badgeColor, borderColor: badgeColor, backgroundColor: `${badgeColor}18` }}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// OVERALL SCORE RING (large)
// ─────────────────────────────────────────────
const OverallScoreRing: React.FC<{
  score: number;
  grade: string;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}> = ({ score, grade, size = 130, strokeWidth = 10, animate = false }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#a5b4fc"
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={animate ? offset : circ}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white font-mono">{score}</span>
          <span className="text-sm font-bold text-indigo-300">{grade}</span>
        </div>
      </div>
      <span className="text-xs text-indigo-200 font-semibold mt-1">Overall Score</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// ISSUE ROW
// ─────────────────────────────────────────────
const IssueRow: React.FC<{
  issue: ScanIssue;
  isFirst?: boolean;
  onExpand: (code: string) => void;
  expanded: boolean;
}> = ({ issue, isFirst, onExpand, expanded }) => {
  const badgeStyle = {
    Fix: "bg-rose-50 text-rose-700 border-rose-200",
    Warning: "bg-amber-50 text-amber-700 border-amber-200",
    Info: "bg-slate-100 text-slate-600 border-slate-200",
  }[issue.badge];

  const dotColor = {
    critical: "bg-rose-500",
    warning: "bg-amber-400",
    info: "bg-slate-400",
  }[issue.severity];

  return (
    <div className={`${!isFirst ? "border-t border-slate-100" : ""}`}>
      <button
        className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-50/60 px-2 -mx-2 rounded-lg transition-colors cursor-pointer"
        onClick={() => onExpand(issue.code)}
      >
        <span>
          {issue.severity === "critical" ? (
            <X className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
        </span>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
        <span className="flex-1 text-xs text-slate-700 font-medium">{issue.label}</span>
        <Info className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${badgeStyle}`}>
          {issue.badge}
        </span>
      </button>
      {expanded && (issue.why || issue.how_to_fix) && (
        <div className="ml-10 mb-2 bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100">
          {issue.business_impact && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5">
              <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Business Impact:
              </p>
              <p className="text-[11px] text-amber-700">{issue.business_impact}</p>
            </div>
          )}
          {issue.why && (
            <p className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Why: </span>{issue.why}
            </p>
          )}
          {issue.how_to_fix && (
            <p className="text-[11px] text-slate-600">
              <span className="text-emerald-600 font-bold">✓ How to Fix: </span>{issue.how_to_fix}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────
const SkeletonPulse: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

const ScanningOverlay: React.FC<{ url: string; mode: "page" | "site" }> = ({ url, mode }) => (
  <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden">
    {/* Detection bar skeleton */}
    <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">
          {mode === "site" ? (
            <>Crawling site &amp; linked pages on <span className="font-bold text-slate-700">{url}</span>…</>
          ) : (
            <>Analyzing page <span className="font-bold text-slate-700">{url}</span>…</>
          )}
        </span>
      </div>
    </div>

    {/* Score row skeleton */}
    <div className="px-6 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-4 gap-8 items-center border-b border-slate-100">
      <div className="flex justify-center">
        <div className="w-[140px] h-[170px] flex flex-col items-center gap-2">
          <div className="w-[140px] h-[140px] rounded-full animate-pulse bg-indigo-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
          <SkeletonPulse className="h-3 w-20" />
        </div>
      </div>
      <div className="sm:col-span-3 grid grid-cols-3 gap-6">
        {["SEO", "AEO", "GEO"].map((p) => (
          <div key={p} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center gap-3">
            <SkeletonPulse className="w-20 h-20 rounded-full" />
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-2 w-24" />
          </div>
        ))}
      </div>
    </div>

    {/* Steps */}
    <div className="px-6 sm:px-10 py-8 space-y-3">
      {[
        { icon: <Globe className="w-4 h-4 text-blue-500" />, label: mode === "site" ? "Discovering internal architecture & routes…" : "Fetching page content…" },
        { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: "Running 24 SEO technical checks…" },
        { icon: <Bot className="w-4 h-4 text-purple-500" />, label: "Running 7 AEO answer readiness checks…" },
        { icon: <Sparkles className="w-4 h-4 text-amber-500" />, label: "Running 10 GEO generative model checks…" },
      ].map(({ icon, label }, i) => (
        <div
          key={i}
          className="flex items-center gap-3 animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">{icon}</div>
          <div className="flex-1">
            <p className="text-xs text-slate-600 font-medium">{label}</p>
          </div>
          <Loader2 className="w-3.5 h-3.5 text-slate-300 animate-spin" />
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────
export const QuickScanSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [urlInput, setUrlInput] = useState("");
  const [scanMode, setScanMode] = useState<"page" | "site">("page");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [result, setResult] = useState<QuickScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("seo");
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [animateRings, setAnimateRings] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const tabIssues = result?.issues.filter((i) => i.pillar === activeTab) ?? [];

  const handleExpand = useCallback((code: string) => {
    setExpandedIssue((prev) => (prev === code ? null : code));
  }, []);

  const runScan = async () => {
    let url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;

    setScanState("scanning");
    setResult(null);
    setErrorMsg("");
    setAnimateRings(false);

    // Smooth scroll to results container
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const res = await fetch(`${API_BASE}/public/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode: scanMode }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data: QuickScanResult = await res.json();
      setResult(data);
      setScanState("done");
      setActiveTab("seo");
      setExpandedIssue(null);
      // Trigger ring animations after render
      setTimeout(() => setAnimateRings(true), 120);
    } catch (err: unknown) {
      setScanState("error");
      setErrorMsg(err instanceof Error ? err.message : "Scan failed. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") runScan();
  };

  const resetScan = () => {
    setScanState("idle");
    setResult(null);
    setErrorMsg("");
    setUrlInput("");
    setAnimateRings(false);
  };

  return (
    <section
      id="quick-scan"
      className="py-20 sm:py-28 bg-[#f8fafc] relative overflow-hidden scroll-mt-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[2px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      <div className="max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide">
            <Scan className="w-3.5 h-3.5" />
            <span>Instant Free Scan — No Signup Required</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
            See exactly what&apos;s holding{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              your site back
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
            Paste any URL below. In seconds, SeoSensing surfaces every critical SEO, AEO &amp; GEO issue — ranked by business impact.
          </p>
        </div>

        {/* ── Scan Input Card ── */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-slate-200 p-3">
            {/* Tabs */}
            <div className="flex gap-1.5 px-2 pt-1 mb-3">
              {(["page", "site"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setScanMode(mode);
                    if (scanState === "done") {
                      // If already ran, user can re-run
                    }
                  }}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    scanMode === mode
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {mode === "page" ? "Scan Page" : "Crawl Site"}
                  {mode === "site" && (
                    <span className="bg-amber-400 text-[8px] text-white font-black px-1.5 py-0.5 rounded-full">BETA</span>
                  )}
                </button>
              ))}
            </div>

            {/* URL Input */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mx-1 mb-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Globe className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                id="quick-scan-url"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={scanMode === "site" ? "https://yourwebsite.com" : "https://yourwebsite.com/page"}
                className="flex-1 bg-transparent text-base text-slate-800 placeholder:text-slate-400 outline-none font-medium"
                disabled={scanState === "scanning"}
              />
              <button
                onClick={runScan}
                disabled={scanState === "scanning" || !urlInput.trim()}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {scanState === "scanning" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {scanMode === "site" ? "Crawling Site…" : "Scanning…"}
                  </>
                ) : (
                  <>
                    {scanMode === "site" ? "Crawl Site" : "Scan Now"} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-400 font-medium pb-2">
              Press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono text-[10px]">Enter</kbd> to {scanMode === "site" ? "crawl site instantly" : "scan instantly"}
            </p>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] text-slate-400 font-medium">
            {["260+ Checks", "No Signup Required", "Free Forever", "Results in Seconds", "2,000+ Sites Analyzed"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Error State ── */}
        {scanState === "error" && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-800">Scan Failed</p>
                <p className="text-xs text-rose-600 mt-0.5">{errorMsg}</p>
              </div>
              <button
                onClick={resetScan}
                className="text-xs text-rose-600 font-bold hover:underline shrink-0 cursor-pointer"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ── Scanning Skeleton / Results ── */}
        <div ref={resultsRef}>
          {scanState === "scanning" && <ScanningOverlay url={urlInput} mode={scanMode} />}

          {/* ── Real Results ── */}
          {scanState === "done" && result && (
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden">

              {/* Detection bar */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {result.detected_tech
                    ? `Detected: ${result.detected_tech} — ${result.detected_confidence}% confidence`
                    : "Analysis complete"}
                </span>
                <span className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {(result.scan_duration_ms / 1000).toFixed(1)}s
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {result.site_report ? `${result.site_report.total_pages} pages crawled` : `${result.checks_run} checks run`}
                  </span>
                  <button
                    onClick={resetScan}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer ml-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    New Scan
                  </button>
                </span>
              </div>

              {/* ─────────────────────────────────────────────
                  MODE 1: SITE REPORT VIEW (Crawl Site Mode)
                  ───────────────────────────────────────────── */}
              {result.site_report ? (
                <div className="p-6 sm:p-10 space-y-10">
                  {/* Site Report Header */}
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      Site Report
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Average Scores across {result.site_report.total_pages} pages —{" "}
                      <span className="font-semibold text-slate-800">{result.site_report.domain}</span>
                    </p>
                  </div>

                  {/* 4 Top Cards (Matching Reference Layout) */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
                    {/* Overall Score Card (Purple) */}
                    <div className="bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#4338ca] text-white rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                      <span className="text-xs sm:text-sm font-semibold text-indigo-100 mb-3">Overall Score</span>
                      <div className="relative" style={{ width: 110, height: 110 }}>
                        <svg width={110} height={110} className="-rotate-90">
                          <circle cx={55} cy={55} r={44} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={9} />
                          <circle
                            cx={55}
                            cy={55}
                            r={44}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth={9}
                            strokeDasharray={2 * Math.PI * 44}
                            strokeDashoffset={animateRings ? (2 * Math.PI * 44) - (result.site_report.average_overall_score / 100) * (2 * Math.PI * 44) : (2 * Math.PI * 44)}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl sm:text-4xl font-black font-mono leading-none">
                            {result.site_report.average_overall_score}
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-black text-white mt-3 uppercase tracking-wider">
                        {result.site_report.grade}
                      </span>
                    </div>

                    {/* SEO Score Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col items-center justify-center shadow-xs">
                      <ScoreRing
                        score={result.site_report.average_seo_score}
                        size={100}
                        strokeWidth={8}
                        color="#10b981"
                        trackColor="#f1f5f9"
                        animate={animateRings}
                      />
                      <span className="mt-3 px-4 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        SEO
                      </span>
                    </div>

                    {/* AEO Score Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col items-center justify-center shadow-xs">
                      <ScoreRing
                        score={result.site_report.average_aeo_score}
                        size={100}
                        strokeWidth={8}
                        color="#8b5cf6"
                        trackColor="#f1f5f9"
                        animate={animateRings}
                      />
                      <span className="mt-3 px-4 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        AEO
                      </span>
                    </div>

                    {/* GEO Score Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col items-center justify-center shadow-xs">
                      <ScoreRing
                        score={result.site_report.average_geo_score}
                        size={100}
                        strokeWidth={8}
                        color="#f59e0b"
                        trackColor="#f1f5f9"
                        animate={animateRings}
                      />
                      <span className="mt-3 px-4 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        GEO
                      </span>
                    </div>
                  </div>

                  {/* Pages Breakdown Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/70">
                            <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">PAGE</th>
                            <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">SEO</th>
                            <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">AEO</th>
                            <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">GEO</th>
                            <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">ISSUES</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {result.site_report.pages.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3.5 px-6 font-medium text-slate-700">
                                <a
                                  href={p.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5"
                                >
                                  <span>{p.display_url}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                              </td>
                              <td className={`py-3.5 px-4 text-center font-bold font-mono ${getScoreColor(p.seo_score)}`}>
                                {p.seo_score}
                              </td>
                              <td className={`py-3.5 px-4 text-center font-bold font-mono ${getScoreColor(p.aeo_score)}`}>
                                {p.aeo_score}
                              </td>
                              <td className={`py-3.5 px-4 text-center font-bold font-mono ${getScoreColor(p.geo_score)}`}>
                                {p.geo_score}
                              </td>
                              <td className="py-3.5 px-6 text-right font-bold font-mono text-rose-600">
                                {p.issues_count}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Most Common Issues Section */}
                  <div className="space-y-4">
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Most Common Issues
                    </h4>
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
                      {result.site_report.most_common_issues.map((iss, i) => (
                        <div key={i} className="px-6 py-4 flex flex-col gap-2 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                              <span className="text-xs font-bold text-rose-600 font-mono shrink-0 w-8">
                                {iss.fraction}
                              </span>
                              <span className="text-xs sm:text-sm text-slate-700 font-medium truncate">
                                {iss.label}
                              </span>
                            </div>
                            <div className="w-20 sm:w-28 bg-rose-100 rounded-full h-1.5 overflow-hidden shrink-0">
                              <div
                                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${iss.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom CTA for Site Crawl */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Free public crawl completed for top {result.site_report.total_pages} pages.</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={resetScan}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Crawl another site
                      </button>

                      <Link href={isAuthenticated ? "/seo/projects" : "/signup"}>
                        <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer">
                          <span>Unlock 500+ Page Crawl</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* ─────────────────────────────────────────────
                    MODE 2: SINGLE PAGE REPORT VIEW
                    ───────────────────────────────────────────── */
                <>
                  {/* Score overview row */}
                  <div className="px-6 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-4 gap-8 items-center border-b border-slate-100">
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-4 shadow-inner text-center">
                        <OverallScoreRing
                          score={result.overall_score}
                          grade={result.grade}
                          size={120}
                          strokeWidth={9}
                          animate={animateRings}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 grid grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center">
                        <ScoreRing
                          score={result.seo.score}
                          size={76}
                          color="#10b981"
                          badgeColor="#10b981"
                          badgeText="SEO"
                          animate={animateRings}
                        />
                        <span className="text-[11px] text-slate-400 mt-2">{result.seo.issues} issues</span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center">
                        <ScoreRing
                          score={result.aeo.score}
                          size={76}
                          color="#8b5cf6"
                          badgeColor="#8b5cf6"
                          badgeText="AEO"
                          animate={animateRings}
                        />
                        <span className="text-[11px] text-slate-400 mt-2">{result.aeo.issues} issues</span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center">
                        <ScoreRing
                          score={result.geo.score}
                          size={76}
                          color="#f59e0b"
                          badgeColor="#f59e0b"
                          badgeText="GEO"
                          animate={animateRings}
                        />
                        <span className="text-[11px] text-slate-400 mt-2">{result.geo.issues} issues</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Wins strip */}
                  {result.quick_wins.length > 0 && (
                    <div className="bg-amber-50/50 border-b border-amber-100/80 px-6 sm:px-10 py-5">
                      <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-3">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        Top Quick Wins (Highest Impact Fixes)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {result.quick_wins.map((qw, i) => (
                          <div key={i} className="bg-white rounded-xl p-3.5 border border-amber-200/60 shadow-xs space-y-1">
                            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">#{i + 1} Fix</span>
                            <p className="text-xs font-bold text-slate-800 leading-snug">{qw.label}</p>
                            <p className="text-[11px] text-emerald-700 font-medium">✓ {qw.how_to_fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pillar tabs + Issue list */}
                  <div className="px-6 sm:px-10 py-6">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 pb-4 mb-4 gap-2">
                      {(["seo", "aeo", "geo"] as const).map((tab) => {
                        const count = result.issues.filter((i) => i.pillar === tab).length;
                        const score = result[tab].score;
                        return (
                          <button
                            key={tab}
                            onClick={() => {
                              setActiveTab(tab);
                              setExpandedIssue(null);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              activeTab === tab
                                ? "bg-slate-900 text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            }`}
                          >
                            <span className="uppercase">{tab}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              activeTab === tab ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                              {score}/100
                            </span>
                            {count > 0 && (
                              <span className="text-rose-500 font-bold text-[10px]">({count})</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Issue list */}
                    <div className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1">
                      {tabIssues.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                          <span>All {activeTab.toUpperCase()} checks passed! No issues detected.</span>
                        </div>
                      ) : (
                        tabIssues.map((issue, i) => (
                          <IssueRow
                            key={issue.code}
                            issue={issue}
                            isFirst={i === 0}
                            onExpand={handleExpand}
                            expanded={expandedIssue === issue.code}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Full audit CTA banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Want the full 500+ page crawl &amp; real-time AI citation tracker?
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Create a free account to track ChatGPT citations, Perplexity scores, and scheduled crawls.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={resetScan}
                        className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
                      >
                        Scan another →
                      </button>
                      <Link href={isAuthenticated ? "/seo/projects" : "/signup"}>
                        <button className="px-5 py-2.5 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer">
                          <span>Get Full Audit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Feature Cards Below ── */}
        {scanState === "idle" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
            {[
              {
                icon: <Zap className="w-5 h-5 text-amber-500" />,
                bg: "bg-amber-50 border-amber-100",
                title: "3-Pillar Diagnostics",
                desc: "SEO, AEO and GEO evaluated simultaneously.",
              },
              {
                icon: <Bot className="w-5 h-5 text-purple-600" />,
                bg: "bg-purple-50 border-purple-100",
                title: "Robots.txt Checked",
                desc: "Detects if AI bots like GPTBot are blocked.",
              },
              {
                icon: <Clock className="w-5 h-5 text-blue-600" />,
                bg: "bg-blue-50 border-blue-100",
                title: "Results in Seconds",
                desc: "Lightweight scan runs parallel, no wait.",
              },
            ].map(({ icon, bg, title, desc }) => (
              <div key={title} className={`rounded-2xl p-5 border ${bg} flex gap-3 items-start`}>
                <div className="shrink-0 mt-0.5">{icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default QuickScanSection;
