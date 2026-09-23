import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles, Search } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO, AEO & GEO Glossary | Zobay Rank",
  description:
    "Definitive glossary of search engine optimization, answer engine optimization, and generative engine optimization terms.",
  path: "/glossary",
  keywords: [
    "SEO Glossary",
    "AEO Terms",
    "GEO Dictionary",
    "AI Search Definitions",
    "Technical SEO Terms",
  ],
});

const GLOSSARY_INDEX = [
  {
    slug: "seo",
    term: "SEO (Search Engine Optimization)",
    desc: "Optimizing website crawlability, technical health, and content relevance for algorithmic search engines.",
    tag: "Core SEO",
  },
  {
    slug: "aeo",
    term: "AEO (Answer Engine Optimization)",
    desc: "Structuring content so AI models (ChatGPT, Perplexity) cite and extract your brand in conversational answers.",
    tag: "Answer Engines",
  },
  {
    slug: "geo",
    term: "GEO (Generative Engine Optimization)",
    desc: "Optimizing brand entity authority and multi-turn recommendation strength in generative search experiences.",
    tag: "Generative AI",
  },
  {
    slug: "ai-search",
    term: "AI Search",
    desc: "Modern search engines powered by LLMs and RAG that synthesize conversational answers in real time.",
    tag: "AI Search",
  },
  {
    slug: "technical-seo",
    term: "Technical SEO",
    desc: "Server, status code, canonical, and DOM optimizations that facilitate search engine spider traversal.",
    tag: "Technical",
  },
  {
    slug: "entity-seo",
    term: "Entity SEO",
    desc: "Optimizing content around verified real-world concepts, organizations, and products in knowledge graphs.",
    tag: "Knowledge Graphs",
  },
  {
    slug: "citation",
    term: "AI Citation",
    desc: "Direct URL and footnote attributions provided by AI models acknowledging original content sources.",
    tag: "Citations",
  },
  {
    slug: "ai-visibility",
    term: "AI Visibility",
    desc: "Quantitative score measuring brand inclusion frequency, sentiment, and recommendation position in AI models.",
    tag: "Analytics",
  },
];

export default function GlossaryIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Glossary", url: "/glossary" },
        ]}
      />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Search &amp; AI Intelligence Terms</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              SEO, AEO &amp; GEO Glossary
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore concise definitions, simple explanations, technical architecture, and real-world examples for modern search concepts.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GLOSSARY_INDEX.map((item) => (
              <Link
                key={item.slug}
                href={`/glossary/${item.slug}`}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.tag}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.term}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-xs font-semibold text-blue-400 pt-2 block">
                  Read full definition &amp; technical guide →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
