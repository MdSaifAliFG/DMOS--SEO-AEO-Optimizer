import React from "react";
import { CheckCircle2, Clock, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { ScanStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ScanProgressTrackerProps {
  status: ScanStatus;
  progress: number;
  currentStep: string;
}

const STAGES: { id: ScanStatus; label: string; description: string }[] = [
  { id: "queued", label: "Queued", description: "Job registered in orchestration pool" },
  { id: "initializing", label: "Initializing", description: "DNS reachability & robots.txt" },
  { id: "crawling", label: "Crawling", description: "Discovered links & HTML pages" },
  { id: "analyzing", label: "Analyzing", description: "Technical rules & duplicates" },
  { id: "scoring", label: "Scoring", description: "Deterministic weighted scores" },
  { id: "completed", label: "Completed", description: "Audit lifecycle finished" },
];

export const ScanProgressTracker: React.FC<ScanProgressTrackerProps> = ({
  status,
  progress,
  currentStep,
}) => {
  const getStageIndex = (s: ScanStatus) => {
    switch (s) {
      case "queued":
        return 0;
      case "initializing":
        return 1;
      case "crawling":
        return 2;
      case "analyzing":
        return 3;
      case "scoring":
        return 4;
      case "completed":
        return 5;
      case "failed":
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(status);

  return (
    <div className="space-y-6">
      {/* Progress Bar & Current Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Current Phase:</span>
            <span className="text-primary-400 font-medium">{currentStep}</span>
          </div>
          <span className="font-mono font-bold text-slate-300">{progress}%</span>
        </div>

        {/* Bar */}
        <div className="w-full h-2.5 bg-surface-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              status === "completed"
                ? "bg-gradient-to-r from-primary-500 to-emerald-500"
                : status === "failed"
                ? "bg-rose-500"
                : status === "cancelled"
                ? "bg-slate-600"
                : "bg-gradient-to-r from-primary-600 to-cyan-400"
            )}
            style={{ width: `${Math.max(progress, 3)}%` }}
          />
        </div>
      </div>

      {/* Visual Step Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {STAGES.map((stage, idx) => {
          let state: "upcoming" | "current" | "done" | "aborted" = "upcoming";

          if (status === "failed" || status === "cancelled") {
            state = idx <= Math.floor((progress / 100) * 5) ? "aborted" : "upcoming";
          } else if (idx < currentIndex) {
            state = "done";
          } else if (idx === currentIndex) {
            state = "current";
          }

          return (
            <div
              key={stage.id}
              className={cn(
                "p-3 rounded-xl border text-left transition-all duration-200",
                state === "current"
                  ? "bg-primary-500/10 border-primary-500/40 shadow-lg shadow-primary-950/20"
                  : state === "done"
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : state === "aborted"
                  ? "bg-rose-500/5 border-rose-500/20"
                  : "bg-surface-900/40 border-slate-800/60 opacity-60"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {state === "done" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : state === "current" ? (
                  <Loader2 className="w-4 h-4 text-primary-400 animate-spin shrink-0" />
                ) : state === "aborted" ? (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-xs font-bold truncate",
                    state === "current"
                      ? "text-primary-300"
                      : state === "done"
                      ? "text-emerald-300"
                      : "text-slate-300"
                  )}
                >
                  {stage.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {stage.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
