"use client";

import React from "react";
import { ScoreBreakdown } from "@/lib/types";

interface ScoreExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  overallScore: number;
  scoreLabel: string;
  scoreBreakdown?: ScoreBreakdown;
  technicalScore?: number | null;
  indexabilityScore?: number | null;
  metadataScore?: number | null;
  linksScore?: number | null;
}

export function ScoreExplanationModal({
  isOpen,
  onClose,
  overallScore,
  scoreLabel,
  scoreBreakdown,
  technicalScore = 100,
  indexabilityScore = 100,
  metadataScore = 100,
  linksScore = 100,
}: ScoreExplanationModalProps) {
  if (!isOpen) return null;

  const deductions = scoreBreakdown?.deductions_by_category || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>SEO Score Calculation Breakdown</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Deterministic Model
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Transparent, weighted technical scoring based on real crawl findings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Formula Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Overall Scoring Formula
            </div>
            <div className="font-mono text-sm text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold shadow-2xs">
              Overall Score = (0.30 × Technical) + (0.25 × Indexability) + (0.25 × Metadata) + (0.20 × Links)
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>
                Calculation: ({0.3} × {technicalScore}) + ({0.25} × {indexabilityScore}) + ({0.25} × {metadataScore}) + ({0.2} × {linksScore})
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                = {overallScore} / 100 ({scoreLabel})
              </span>
            </div>
          </div>

          {/* Category Deductions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Category Deductions & Impact
            </h4>

            {Object.entries(deductions).length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Perfect Score! No penalties deducted.</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">All pages passed all technical SEO rules cleanly.</div>
              </div>
            ) : (
              Object.entries(deductions).map(([catKey, items]) => {
                const catName = catKey.charAt(0).toUpperCase() + catKey.slice(1);
                const currentCatScore =
                  catKey === "technical"
                    ? technicalScore
                    : catKey === "indexability"
                    ? indexabilityScore
                    : catKey === "metadata"
                    ? metadataScore
                    : linksScore;

                return (
                  <div key={catKey} className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{catName} SEO</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          (Base 100 - {items.reduce((acc, i) => acc + i.penalty, 0).toFixed(1)} penalty)
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {currentCatScore} / 100
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 italic">No deductions in this category.</div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-xs">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase border ${
                                  item.severity === "critical"
                                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60"
                                    : item.severity === "high"
                                    ? "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/60"
                                    : item.severity === "medium"
                                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60"
                                    : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60"
                                }`}
                              >
                                {item.severity}
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 font-medium">{item.title}</span>
                              <span className="text-slate-500 dark:text-slate-400">({item.affected_pages} page{item.affected_pages > 1 ? "s" : ""})</span>
                            </div>
                            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                              -{item.penalty} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
