import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Scale, Globe, Bot, TrendingUp } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Compare Zobay Rank | Search & AI Optimization Comparisons",
  description:
    "Objective, verifiable comparisons of Zobay Rank against traditional crawler-only SEO platforms and legacy search tools.",
  path: "/compare",
  keywords: [
    "Compare Zobay Rank",
    "Zobay Rank vs Traditional SEO Tools",
    "SEO vs AEO Platform Comparison",
    "Best AI Search Optimization Software",
  ],
});

export default function CompareDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Compare", url: "/compare" },
        ]}
      />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>Objective Platform Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Compare Zobay Rank
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Explore factual, verifiable comparisons between Zobay Rank's unified SEO+AEO+GEO architecture and legacy search tools.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            <Link
              href="/compare/zobay-rank-vs-traditional-seo-tools"
              className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Featured Comparison
                </span>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Zobay Rank vs. Traditional SEO Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Traditional SEO software focuses exclusively on Google SERP keyword tracking and desktop website crawling. Discover how Zobay Rank expands beyond legacy crawlers to include live AI answer prompt tracking, citation gap extraction, and 8-factor generative search optimization.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                  Technical Crawling
                </span>
                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                  ChatGPT &amp; Perplexity Citations
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                  Generative Discovery
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
