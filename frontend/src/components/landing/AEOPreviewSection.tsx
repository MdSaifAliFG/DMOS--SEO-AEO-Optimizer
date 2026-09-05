"use client";

import React from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Quote,
  Eye,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const AEOPreviewSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: AEO Product Dashboard Mockup */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Card className="p-6 border-purple-200/80 bg-gradient-to-b from-purple-50/30 to-white shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="font-mono text-xs font-bold text-slate-900">
                    AI Answer Engine Monitoring
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  5 Engines Tracked
                </span>
              </div>

              {/* Sample Engines Mini Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Perplexity AI</span>
                    <span className="text-purple-700">82% Vis</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">18 Citations extracted</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>ChatGPT Search</span>
                    <span className="text-blue-700">78% Vis</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">14 Citations extracted</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Google AI Overviews</span>
                    <span className="text-emerald-700">68% Vis</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">9 Citations extracted</span>
                </div>
              </div>

              {/* Sample Tracked Prompt */}
              <div className="p-3.5 rounded-xl bg-white border border-purple-100 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase text-purple-600">Sample Evaluated Prompt</span>
                <p className="font-semibold text-slate-900">
                  "What is the most reliable API for automated billing and recurring payments?"
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                  <span className="text-emerald-600 font-semibold">✓ Brand Mentioned</span>
                  <span>•</span>
                  <span>Position: #1 Recommendation</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Descriptive Text */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              AEO Engine Preview
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Be ready for the age of AI search
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              People increasingly discover solutions through conversational AI models. SeoSensing is built from the ground up to help you monitor, understand, and optimize your presence across generative answer engines.
            </p>

            <div className="space-y-3 text-xs text-slate-700 font-medium pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Track buyer query rankings across ChatGPT, Perplexity, & Gemini</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Identify top source URLs cited by generative models</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Optimize knowledge graph brand entities for LLM grounding</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/aeo/dashboard">
                <Button size="md" variant="aeo" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore AEO Intelligence →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
