"use client";

import React from "react";
import Link from "next/link";
import { Globe, Search, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

export const HowItWorksSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const steps = [
    {
      number: "01",
      title: "Add Your Website",
      description:
        "Enter your domain URL to register a project. Configure rate limits and robots.txt parameters.",
      tag: "1-Click Setup",
      color: "bg-blue-600 text-white",
    },
    {
      number: "02",
      title: "Analyze & Crawl",
      description:
        "DMOS crawls internal pages via BFS, discovers sitemaps, inspects HTML tags, and tests AEO engine visibility.",
      tag: "Deterministic Rules",
      color: "bg-purple-600 text-white",
    },
    {
      number: "03",
      title: "Optimize & Dominant",
      description:
        "Review prioritized issues, resolve crawl bottlenecks, verify citations, and track SEO & AEO score improvements.",
      tag: "Actionable Fixes",
      color: "bg-emerald-600 text-white",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Step-by-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A simpler path to better visibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            From initial URL validation to deep technical diagnostics and AI citation tracking in 3 seamless steps.
          </p>
        </div>

        {/* 3-Step Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-6 relative hover:border-slate-300 hover:bg-white transition-all shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold font-mono text-sm shadow-sm ${step.color}`}>
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center text-[11px] text-slate-500 font-mono">
                <span>Phase {idx + 1} Pipeline</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Bottom CTA */}
        <div className="text-center pt-4">
          <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start for Free →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
