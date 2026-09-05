"use client";

import React, { useRef, useEffect } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { ScanLogEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface ScanLogsViewerProps {
  logs: ScanLogEntry[];
  isStreaming?: boolean;
}

export const ScanLogsViewer: React.FC<ScanLogsViewerProps> = ({
  logs,
  isStreaming = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.step}] ${l.message}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "SUCCESS":
        return "text-emerald-400 font-semibold";
      case "ERROR":
        return "text-rose-400 font-semibold";
      case "WARNING":
        return "text-amber-400 font-semibold";
      case "INFO":
      default:
        return "text-cyan-400";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs font-mono text-xs">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-xs font-sans text-slate-800">
            Execution Telemetry & Engine Logs
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-sans ml-2 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              LIVE
            </span>
          )}
        </div>

        <button
          onClick={handleCopyLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 font-sans shadow-2xs font-medium cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Logs</span>
            </>
          )}
        </button>
      </div>

      {/* Log Console Output */}
      <div className="p-4 max-h-96 min-h-48 overflow-y-auto space-y-2 select-text scroll-smooth bg-slate-950 text-slate-200">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-6 text-center">
            Waiting for orchestration pipeline logs...
          </div>
        ) : (
          logs.map((log, index) => {
            let timeStr = log.timestamp;
            try {
              const d = new Date(log.timestamp);
              timeStr = d.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
            } catch {
              // fallback
            }

            return (
              <div
                key={index}
                className="flex items-start gap-2.5 text-slate-300 leading-relaxed hover:bg-white/[0.02] p-1 rounded transition-colors"
              >
                <span className="text-slate-500 shrink-0 text-[11px] select-none">
                  [{timeStr}]
                </span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0",
                    getLevelColor(log.level),
                    "bg-surface-900 border border-slate-800"
                  )}
                >
                  {log.level}
                </span>
                <span className="text-primary-300 font-semibold shrink-0">
                  [{log.step}]
                </span>
                <span className="text-slate-200 break-words flex-1">
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
