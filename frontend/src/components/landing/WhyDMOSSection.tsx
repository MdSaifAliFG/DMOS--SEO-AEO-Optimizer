"use client";

import React from "react";
import { Database, Sparkles, Lightbulb, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const WhyDMOSSection: React.FC = () => {
  const points = [
    {
      title: "Data Driven",
      description: "Analyze real website crawl telemetry and server responses instead of relying on assumptions.",
      icon: <Database className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50 border-blue-100",
    },
    {
      title: "SEO + AEO Unified",
      description: "A single operating system covering traditional search algorithms and generative AI answer engines.",
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-50 border-purple-100",
    },
    {
      title: "Actionable Insights",
      description: "Turn detected technical problems into prioritized developer recommendations with concrete code guidance.",
      icon: <Lightbulb className="w-5 h-5 text-amber-600" />,
      color: "bg-amber-50 border-amber-100",
    },
    {
      title: "Built for Growth",
      description: "Engineered with high concurrency BFS crawlers and structured exports for scaling teams and agencies.",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200/70 px-3 py-1 rounded-full">
            The DMOS Advantage
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why teams choose DMOS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Engineered from first principles to provide transparent, deterministic website diagnostics and AI visibility analysis.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((item, idx) => (
            <Card
              key={idx}
              className="p-6 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all space-y-3.5"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
