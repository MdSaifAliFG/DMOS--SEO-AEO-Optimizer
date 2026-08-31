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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>SEO Score Calculation Breakdown</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Deterministic Model
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Transparent, weighted technical scoring based on real crawl findings.
            </p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Formula Banner */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Overall Scoring Formula
            </div>
            <div className="font-mono text-sm text-emerald-400 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
              Overall Score = (0.30 × Technical) + (0.25 × Indexability) + (0.25 × Metadata) + (0.20 × Links)
            </div>
            <div className="text-xs text-zinc-400 flex items-center justify-between pt-1">
              <span>
                Calculation: ({0.3} × {technicalScore}) + ({0.25} × {indexabilityScore}) + ({0.25} × {metadataScore}) + ({0.2} × {linksScore})
              </span>
              <span className="font-semibold text-white">
                = {overallScore} / 100 ({scoreLabel})
              </span>
            </div>
          </div>

          {/* Category Deductions */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Category Deductions & Impact
            </h4>

            {Object.entries(deductions).length === 0 ? (
              <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/50 text-center">
                <div className="text-sm font-medium text-emerald-400">Perfect Score! No penalties deducted.</div>
                <div className="text-xs text-zinc-400 mt-1">All pages passed all technical SEO rules cleanly.</div>
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
                  <div key={catKey} className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{catName} SEO</span>
                        <span className="text-xs text-zinc-400">
                          (Base 100 - {items.reduce((acc, i) => acc + i.penalty, 0).toFixed(1)} penalty)
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {currentCatScore} / 100
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-zinc-400 italic">No deductions in this category.</div>
                    ) : (
                      <div className="divide-y divide-zinc-800/50">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-xs">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-medium text-[10px] uppercase ${
                                  item.severity === "critical"
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                    : item.severity === "high"
                                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                    : item.severity === "medium"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}
                              >
                                {item.severity}
                              </span>
                              <span className="text-zinc-200">{item.title}</span>
                              <span className="text-zinc-400">({item.affected_pages} page{item.affected_pages > 1 ? "s" : ""})</span>
                            </div>
                            <span className="font-mono font-semibold text-rose-400">
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
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
