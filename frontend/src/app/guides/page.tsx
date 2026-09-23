import React from "react";
import Link from "next/link";
import { BookOpen, Globe, Bot, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO, AEO & GEO Optimization Guides | Zobay Rank",
  description:
    "Step-by-step technical guides for executing website audits, earning AI answer citations, and optimizing generative search visibility.",
  path: "/guides",
  keywords: [
    "SEO Guides",
    "AEO Optimization Guide",
    "GEO Implementation Guide",
    "Technical SEO Step-by-Step",
  ],
});

const GUIDES = [
  {
    title: "Complete Technical SEO Audit Blueprint",
    desc: "A step-by-step roadmap to crawl depth, canonical auditing, status code resolution, and XML sitemaps.",
    href: "/seo-optimization",
    category: "Technical SEO",
  },
  {
    title: "How to Earn Citations in ChatGPT & Perplexity",
    desc: "Editorial and schema formatting strategies to ensure your content is extracted and cited in conversational answers.",
    href: "/aeo-optimization",
    category: "AEO Optimization",
  },
  {
    title: "Implementing the 8-Factor GEO Framework",
    desc: "Actionable checklist to audit your brand's recommendation strength, entity understanding, and cross-engine parity.",
    href: "/geo-optimization",
    category: "GEO Optimization",
  },
  {
    title: "Bridging Legacy SERP Strategy to Generative Discovery",
    desc: "How to safeguard your traditional search traffic while expanding into AI answer engines and conversational recommendations.",
    href: "/ai-search-optimization",
    category: "AI Search",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Guides", url: "/guides" },
        ]}
      />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Step-by-Step Implementation Guides</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Optimization Guides &amp; Blueprints
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Tactical, actionable documentation to implement technical crawling best practices and generative search optimization.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GUIDES.map((guide, idx) => (
              <Link
                key={idx}
                href={guide.href}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3.5 group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {guide.category}
                  </span>
                  <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{guide.desc}</p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
