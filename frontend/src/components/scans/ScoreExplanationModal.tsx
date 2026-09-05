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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>SEO Score Calculation Breakdown</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Deterministic Model
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent, weighted technical scoring based on real crawl findings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Overall Scoring Formula
            </div>
            <div className="font-mono text-sm text-emerald-700 bg-white px-3 py-2 rounded-lg border border-slate-200 font-semibold shadow-2xs">
              Overall Score = (0.30 × Technical) + (0.25 × Indexability) + (0.25 × Metadata) + (0.20 × Links)
            </div>
            <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
              <span>
                Calculation: ({0.3} × {technicalScore}) + ({0.25} × {indexabilityScore}) + ({0.25} × {metadataScore}) + ({0.2} × {linksScore})
              </span>
              <span className="font-bold text-slate-900">
                = {overallScore} / 100 ({scoreLabel})
              </span>
            </div>
          </div>

          {/* Category Deductions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Category Deductions & Impact
            </h4>

            {Object.entries(deductions).length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-sm font-bold text-emerald-700">Perfect Score! No penalties deducted.</div>
                <div className="text-xs text-slate-500 mt-1">All pages passed all technical SEO rules cleanly.</div>
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
                  <div key={catKey} className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{catName} SEO</span>
                        <span className="text-xs text-slate-500">
                          (Base 100 - {items.reduce((acc, i) => acc + i.penalty, 0).toFixed(1)} penalty)
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 font-mono">
                        {currentCatScore} / 100
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-slate-400 italic">No deductions in this category.</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-xs">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase border ${
                                  item.severity === "critical"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : item.severity === "high"
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : item.severity === "medium"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {item.severity}
                              </span>
                              <span className="text-slate-800 font-medium">{item.title}</span>
                              <span className="text-slate-500">({item.affected_pages} page{item.affected_pages > 1 ? "s" : ""})</span>
                            </div>
                            <span className="font-mono font-bold text-rose-600">
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
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
