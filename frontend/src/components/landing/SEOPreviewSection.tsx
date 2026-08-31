"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScoreRing } from "@/components/ui/ScoreRing";

export const SEOPreviewSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Descriptive Text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              SEO Engine Preview
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              See your website through a smarter lens
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Understand how search crawlers interpret your architecture. Discover technical roadblocks before they hurt your organic impressions and search rankings.
            </p>

            <div className="space-y-3 text-xs text-slate-700 font-medium pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Deterministic scoring across 4 weighted technical pillars</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated XML sitemap & robots.txt parsing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Per-page audit drawer with title, meta, & heading inspections</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/seo/dashboard">
                <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Technical SEO →
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: SEO Product Dashboard Mockup */}
          <div className="lg:col-span-7">
            <Card className="p-6 border-slate-200 bg-white shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="font-mono text-xs font-bold text-slate-900">
                    https://example-enterprise.com
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Audit Completed (2.4s)
                </span>
              </div>

              {/* Mini Score Hero Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Technical (30%)</span>
                  <span className="text-base font-bold font-mono text-slate-900">88/100</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Indexability (25%)</span>
                  <span className="text-base font-bold font-mono text-slate-900">92/100</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Metadata (25%)</span>
                  <span className="text-base font-bold font-mono text-slate-900">84/100</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Links (20%)</span>
                  <span className="text-base font-bold font-mono text-slate-900">90/100</span>
                </div>
              </div>

              {/* Sample Detected Issue Rows */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded font-bold uppercase text-[9px] bg-rose-100 text-rose-800">
                      Critical
                    </span>
                    <span className="font-semibold text-slate-900">Missing Title Tag on 3 Landing Pages</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">/checkout, /pricing</span>
                </div>

                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded font-bold uppercase text-[9px] bg-amber-100 text-amber-800">
                      High
                    </span>
                    <span className="font-semibold text-slate-900">Multiple H1 Headings Detected</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">/blog/post-14</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
