"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Bot,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Puzzle,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AeoEngineStatus } from "@/lib/types";
import { api } from "@/lib/api-client";

export default function AeoAnswerEnginePage() {
  const [engines, setEngines] = useState<AeoEngineStatus[]>([
    {
      engine_id: "chatgpt",
      name: "ChatGPT Search (OpenAI)",
      is_connected: false,
      tracked_questions: 28,
      visibility_rate: 75,
      citations_count: 14,
      status_label: "Integration Not Connected",
    },
    {
      engine_id: "perplexity",
      name: "Perplexity AI",
      is_connected: false,
      tracked_questions: 28,
      visibility_rate: 82,
      citations_count: 22,
      status_label: "Integration Not Connected",
    },
    {
      engine_id: "google_ai",
      name: "Google AI Overviews",
      is_connected: false,
      tracked_questions: 28,
      visibility_rate: 68,
      citations_count: 11,
      status_label: "Integration Not Connected",
    },
    {
      engine_id: "gemini",
      name: "Google Gemini",
      is_connected: false,
      tracked_questions: 28,
      visibility_rate: 71,
      citations_count: 9,
      status_label: "Integration Not Connected",
    },
    {
      engine_id: "copilot",
      name: "Microsoft Copilot",
      is_connected: false,
      tracked_questions: 28,
      visibility_rate: 64,
      citations_count: 8,
      status_label: "Integration Not Connected",
    },
  ]);

  useEffect(() => {
    api.getAeoDashboard().then((data) => {
      if (data.engines && data.engines.length > 0) {
        setEngines(data.engines);
      }
    }).catch(() => {});
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Answer Engine Monitoring ({engines.length})</h2>
            <p className="text-xs text-slate-500">
              Live connectivity status and answer synthesis performance across leading generative search models.
            </p>
          </div>

          <Link href="/integrations">
            <Button size="sm" variant="primary" leftIcon={<Puzzle className="w-3.5 h-3.5" />}>
              Manage Integrations
            </Button>
          </Link>
        </div>

        {/* Engine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engines.map((engine) => (
            <Card key={engine.engine_id} className="p-6 border-slate-200 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <h3 className="text-sm font-bold text-slate-900">{engine.name}</h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    ID: {engine.engine_id}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {engine.status_label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center font-mono">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Tracked</span>
                  <span className="text-sm font-bold text-slate-900">{engine.tracked_questions}</span>
                </div>
                <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-[10px] text-purple-700 block uppercase font-sans">Visibility</span>
                  <span className="text-sm font-bold text-purple-900">{engine.visibility_rate}%</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block uppercase font-sans">Citations</span>
                  <span className="text-sm font-bold text-emerald-900">{engine.citations_count}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <Link href="/integrations">
                  <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    Connect Provider API →
                  </span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
