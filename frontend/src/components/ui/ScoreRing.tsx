"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
  label?: string;
  showRating?: boolean;
  className?: string;
}

export function ScoreRing({
  score,
  size = "md",
  label,
  showRating = true,
  className,
}: ScoreRingProps) {
  const numScore = score !== null && score !== undefined ? Math.max(0, Math.min(100, score)) : null;

  const getRating = (val: number | null) => {
    if (val === null) return { text: "No Score", color: "text-slate-400 border-slate-200 bg-slate-50", stroke: "#94a3b8" };
    if (val >= 90) return { text: "Excellent", color: "text-emerald-700 border-emerald-200 bg-emerald-50", stroke: "#10b981" };
    if (val >= 80) return { text: "Good", color: "text-blue-700 border-blue-200 bg-blue-50", stroke: "#3b82f6" };
    if (val >= 70) return { text: "Fair", color: "text-amber-700 border-amber-200 bg-amber-50", stroke: "#f59e0b" };
    if (val >= 50) return { text: "Needs Improvement", color: "text-orange-700 border-orange-200 bg-orange-50", stroke: "#f97316" };
    return { text: "Poor", color: "text-rose-700 border-rose-200 bg-rose-50", stroke: "#ef4444" };
  };

  const rating = getRating(numScore);

  const sizeMap = {
    sm: { dimension: 44, strokeWidth: 3.5, textSize: "text-xs", labelSize: "text-[9px]" },
    md: { dimension: 64, strokeWidth: 5, textSize: "text-base", labelSize: "text-[10px]" },
    lg: { dimension: 100, strokeWidth: 7, textSize: "text-2xl", labelSize: "text-xs" },
  };

  const { dimension, strokeWidth, textSize, labelSize } = sizeMap[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = numScore !== null ? circumference - (numScore / 100) * circumference : circumference;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        <svg className="transform -rotate-90" width={dimension} height={dimension}>
          {/* Background track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={rating.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={cn("absolute font-bold font-mono text-slate-800", textSize)}>
          {numScore !== null ? numScore : "—"}
        </span>
      </div>

      {(showRating || label) && (
        <div className="flex flex-col">
          {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
          {showRating && (
            <span className={cn("px-2 py-0.5 rounded text-[11px] font-semibold border inline-block mt-0.5", rating.color)}>
              {rating.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
