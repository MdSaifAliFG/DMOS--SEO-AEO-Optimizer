import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Zobay Rank Blog | Search, AEO & GEO Research",
  description:
    "Authoritative research, guides, and engineering updates on SEO crawling, Answer Engine Optimization, and Generative Engine Optimization.",
  path: "/blog",
  keywords: [
    "Zobay Rank Blog",
    "AEO Research",
    "GEO Optimization Blog",
    "AI Search Articles",
    "Technical SEO Guides",
  ],
});

const ARTICLES = [
  {
    slug: "how-ai-answer-engines-choose-sources",
    title: "How AI Answer Engines Choose Which Websites to Cite as Sources",
    desc: "A technical investigation into RAG retrieval, citation scoring, and how ChatGPT and Perplexity select web sources to cite.",
    category: "AEO Intelligence",
    date: "Sep 15, 2026",
    readTime: "6 min read",
  },
  {
    slug: "technical-seo-checklist-for-ai-crawlers",
    title: "The Technical SEO Checklist for AI Crawlers and LLM Agents",
    desc: "Essential technical checklist to ensure your website is crawlable, fast, and indexable for both traditional bots and modern AI agents.",
    category: "Technical SEO",
    date: "Sep 10, 2026",
    readTime: "7 min read",
  },
  {
    slug: "understanding-8-factor-geo-score",
    title: "Understanding the 8-Factor GEO Score in Generative Search",
    desc: "A deep dive into Zobay Rank's proprietary 8-factor Generative Engine Optimization diagnostic framework.",
    category: "GEO Optimization",
    date: "Sep 05, 2026",
    readTime: "8 min read",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Research, Engineering &amp; Industry Insights</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Zobay Rank Blog
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              In-depth research on search algorithms, prompt tracking, AI citations, and generative visibility.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((art) => (
              <Link
                key={art.slug}
                href={`/blog/${art.slug}`}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {art.category}
                  </span>
                  <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {art.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{art.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{art.date}</span>
                  <span>{art.readTime}</span>
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
