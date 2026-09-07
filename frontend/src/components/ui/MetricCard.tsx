"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: React.ReactNode;
  rightVisual?: React.ReactNode;
  className?: string;
  variant?: "default" | "blue" | "emerald" | "purple" | "amber";
}

export function MetricCard({
  title,
  value,
  subValue,
  change,
  icon,
  rightVisual,
  className,
  variant = "default",
}: MetricCardProps) {
  const iconVariantStyles = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    blue: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/60",
    emerald: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60",
    purple: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/60",
    amber: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {value}
          </div>
        </div>

        {rightVisual ? (
          rightVisual
        ) : icon ? (
          <div className={cn("p-2.5 rounded-lg", iconVariantStyles[variant])}>
            {icon}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
        {change ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold",
                change.trend === "up"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                  : change.trend === "down"
                  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              )}
            >
              {change.trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : change.trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {change.value}
            </span>
            <span className="text-slate-500 text-[11px]">{change.label || "vs last scan"}</span>
          </div>
        ) : (
          <span className="text-slate-500 text-[11px]">Real-time audit metric</span>
        )}

        {subValue && (
          <span className="text-slate-600 font-medium text-[11px]">{subValue}</span>
        )}
      </div>
    </div>
  );
}
