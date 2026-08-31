"use client";

import React from "react";
import {
  ShieldCheck,
  Bot,
  KeyRound,
  Users,
  FileBarChart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: "technical-seo",
      title: "Technical SEO Audit",
      description:
        "Crawl internal pages with deterministic rules. Detect broken links, missing meta tags, canonical loops, and indexability blockers.",
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      badge: "Core Engine",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "aeo-optimization",
      title: "AEO Optimization",
      description:
        "Prepare your brand for generative AI experiences. Track visibility, buyer prompt positioning, and source citations across LLMs.",
      icon: <Bot className="w-6 h-6 text-purple-600" />,
      badge: "AI Powered",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "keyword-intel",
      title: "Keyword Intelligence",
      description:
        "Understand search queries, intent classifications (commercial vs informational), and ranking trajectories across target landing pages.",
      icon: <KeyRound className="w-6 h-6 text-emerald-600" />,
      badge: "Active",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "competitor-analysis",
      title: "Competitor Analysis",
      description:
        "Benchmark domain authority, discover competitive backlink opportunities, and identify content gaps in your organic strategy.",
      icon: <Users className="w-6 h-6 text-amber-600" />,
      badge: "Coming Soon",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "reports-insights",
      title: "Reports & Insights",
      description:
        "Turn technical website crawl logs into clear, executive-ready performance summaries and prioritized developer action plans.",
      icon: <FileBarChart className="w-6 h-6 text-indigo-600" />,
      badge: "Exportable",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Comprehensive Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to improve search visibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Powerful tools to audit, analyze, and optimize your digital presence across traditional search engines and emerging AI answer engines.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <Card
              key={item.id}
              className="p-6 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    {item.icon}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                <span>Learn more →</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
