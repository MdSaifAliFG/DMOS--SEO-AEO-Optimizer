"use client";

import React, { useState } from "react";
import { ScoreBreakdown } from "@/lib/types";
import { ScoreExplanationModal } from "./ScoreExplanationModal";

interface ScoreOverviewHeroProps {
  overallScore: number | null;
  scoreLabel: string | null;
  technicalScore?: number | null;
  indexabilityScore?: number | null;
  metadataScore?: number | null;
  linksScore?: number | null;
  scoreBreakdown?: ScoreBreakdown;
  pagesCrawled: number;
  issuesCount: number;
  crawlDuration?: number | null;
}

export function ScoreOverviewHero({
  overallScore,
  scoreLabel,
  technicalScore = 100,
  indexabilityScore = 100,
  metadataScore = 100,
  linksScore = 100,
  scoreBreakdown,
  pagesCrawled,
  issuesCount,
  crawlDuration,
}: ScoreOverviewHeroProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const score = overallScore !== null ? overallScore : 0;
  const label =
    scoreLabel ||
    (score >= 90
      ? "Excellent"
      : score >= 80
      ? "Good"
      : score >= 70
      ? "Fair"
      : score >= 50
      ? "Needs Improvement"
      : "Poor");

  const getScoreColor = (val: number) => {
    if (val >= 90) return "text-emerald-700 border-emerald-500 bg-emerald-50";
    if (val >= 80) return "text-blue-700 border-blue-500 bg-blue-50";
    if (val >= 70) return "text-amber-700 border-amber-500 bg-amber-50";
    if (val >= 50) return "text-orange-700 border-orange-500 bg-orange-50";
    return "text-rose-700 border-rose-500 bg-rose-50";
  };

  const getScoreTextColor = (val: number) => {
    if (val >= 90) return "text-emerald-600";
    if (val >= 80) return "text-blue-600";
    if (val >= 70) return "text-amber-600";
    if (val >= 50) return "text-orange-600";
    return "text-rose-600";
  };

  const getProgressColor = (val: number) => {
    if (val >= 90) return "bg-emerald-500";
    if (val >= 80) return "bg-blue-500";
    if (val >= 70) return "bg-amber-500";
    if (val >= 50) return "bg-orange-500";
    return "bg-rose-500";
  };

  const categories = [
    {
      title: "Technical SEO",
      weight: "30% Weight",
      score: technicalScore ?? 100,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      description: "HTTPS, Status codes, Server errors, Robots.txt, Mixed content",
    },
    {
      title: "Indexability",
      weight: "25% Weight",
      score: indexabilityScore ?? 100,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      description: "Canonical tags, Noindex tags, X-Robots, Sitemaps",
    },
    {
      title: "Metadata & Content",
      weight: "25% Weight",
      score: metadataScore ?? 100,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      description: "Page titles, Meta descriptions, H1 headings, Duplicates",
    },
    {
      title: "Link Structure",
      weight: "20% Weight",
      score: linksScore ?? 100,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      description: "Broken links (404/5xx), Redirects, Image ALT attributes",
    },
  ];

  return (
    <>
      <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 shadow-xs">
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Score Hero Badge */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="relative flex items-center justify-center shrink-0">
              {/* Circular Gauge Ring */}
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-md transition-all ${getScoreColor(
                  score
                )}`}
              >
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-900">
                  {score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getScoreColor(
                    score
                  )}`}
                >
                  {label}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Technical SEO Score
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Audited {pagesCrawled} internal pages with {issuesCount} detected issue
                {issuesCount === 1 ? "" : "s"}.
              </p>
              <button
                onClick={() => setShowExplanation(true)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4 flex items-center justify-center sm:justify-start gap-1.5 pt-1 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                How is this score calculated?
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-7 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Pages Crawled</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1.5 sm:mt-2">
                {pagesCrawled}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1">
                100% In-depth HTML audit
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Issues Detected</span>
              <span
                className={`text-xl sm:text-2xl font-bold font-mono mt-1.5 sm:mt-2 ${
                  issuesCount > 0 ? "text-amber-600" : "text-emerald-600"
                }`}
              >
                {issuesCount}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">Categorized by severity</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between xs:col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-slate-500">Crawl Duration</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1.5 sm:mt-2">
                {crawlDuration ? `${crawlDuration}s` : "< 1s"}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">High-speed async BFS</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audit Pillar Category Scores
            </h3>
            <span className="text-xs text-slate-400">
              Base 100 with proportional deduction scaling
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 hover:border-slate-300 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs text-slate-700">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500">
                    {cat.weight}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900">{cat.title}</span>
                    <span
                      className={`text-lg font-bold font-mono ${getScoreTextColor(cat.score)}`}
                    >
                      {cat.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                    {cat.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                      cat.score
                    )}`}
                    style={{ width: `${Math.max(5, cat.score)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation Modal */}
      <ScoreExplanationModal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        overallScore={score}
        scoreLabel={label}
        scoreBreakdown={scoreBreakdown}
        technicalScore={technicalScore}
        indexabilityScore={indexabilityScore}
        metadataScore={metadataScore}
        linksScore={linksScore}
      />
    </>
  );
}
