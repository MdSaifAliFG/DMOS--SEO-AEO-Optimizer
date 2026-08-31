"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Quote,
  Bot,
  Layers,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AeoDashboardSummary } from "@/lib/types";
import { api } from "@/lib/api-client";

export default function AeoVisibilityPage() {
  const [summary, setSummary] = useState<AeoDashboardSummary | null>(null);

  useEffect(() => {
    api.getAeoDashboard().then((data) => setSummary(data)).catch(() => {});
  }, []);

  const visibilityRate = summary?.answer_visibility_rate || 74;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">AI Visibility Analytics</h2>
            <p className="text-xs text-slate-500">
              Aggregated brand inclusion rates, prompt answer dominance, and LLM citation ratios.
            </p>
          </div>
        </div>

        {/* Visibility KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="AEO Visibility Score"
            value={`${visibilityRate}%`}
            subValue="Answer Inclusion"
            rightVisual={<ScoreRing score={visibilityRate} size="sm" showRating={false} />}
          />

          <MetricCard
            title="ChatGPT Mention Rate"
            value="78%"
            subValue="OpenAI Search Answers"
            icon={<Bot className="w-5 h-5 text-purple-600" />}
            variant="purple"
          />

          <MetricCard
            title="Perplexity Citation Rate"
            value="82%"
            subValue="Source link inclusion"
            icon={<Quote className="w-5 h-5 text-blue-600" />}
            variant="blue"
          />

          <MetricCard
            title="Google AI Overview Rate"
            value="68%"
            subValue="SERP Answer Boxes"
            icon={<Eye className="w-5 h-5 text-emerald-600" />}
            variant="emerald"
          />
        </div>

        {/* Engine Breakdown Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-5 border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Visibility Across AI Engines</h3>
            <p className="text-xs text-slate-500">Comparative brand inclusion across leading LLMs</p>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Perplexity AI</span>
                  <span>82%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: "82%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>ChatGPT Search (OpenAI)</span>
                  <span>78%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Google AI Overviews</span>
                  <span>68%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "68%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Google Gemini</span>
                  <span>71%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "71%" }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Prompt Intent Breakdown</h3>
            <p className="text-xs text-slate-500">Visibility by buyer query type</p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">Commercial Queries</span>
                <span className="font-bold font-mono text-purple-700">84% Vis</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">Informational Queries</span>
                <span className="font-bold font-mono text-blue-700">76% Vis</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">Transactional Queries</span>
                <span className="font-bold font-mono text-emerald-700">62% Vis</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
