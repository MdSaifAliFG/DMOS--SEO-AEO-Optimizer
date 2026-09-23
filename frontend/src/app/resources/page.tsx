import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Globe,
  Bot,
  TrendingUp,
  Sparkles,
  FileCode,
  Quote,
  Target,
  ArrowRight,
  HelpCircle,
  FileText,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO, AEO & GEO Resources & Knowledge Hub | Zobay Rank",
  description:
    "Explore authoritative educational resources, technical guides, glossary definitions, and research reports across SEO, Answer Engine Optimization, and GEO.",
  path: "/resources",
  keywords: [
    "SEO Resources",
    "AEO Knowledge Hub",
    "GEO Guides",
    "AI Search Best Practices",
    "Technical SEO Tutorials",
  ],
});

const RESOURCE_HUBS = [
  {
    title: "SEO Optimization",
    desc: "Technical crawling, indexability guidelines, canonical redirects, and status code troubleshooting.",
    href: "/seo-optimization",
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    items: [
      { title: "Technical SEO Audit Fundamentals", href: "/seo-optimization" },
      { title: "Canonical URL Rules & Redirect Best Practices", href: "/glossary/technical-seo" },
      { title: "XML Sitemap & Robots.txt Verification", href: "/seo-optimization" },
    ],
  },
  {
    title: "Answer Engine Optimization (AEO)",
    desc: "Techniques to earn brand citations and source inclusion in ChatGPT, Perplexity, and Gemini answers.",
    href: "/aeo-optimization",
    icon: <Bot className="w-5 h-5 text-purple-400" />,
    items: [
      { title: "What is Answer Engine Optimization?", href: "/glossary/aeo" },
      { title: "Extracting Source Citations in AI Models", href: "/glossary/citation" },
      { title: "Bridging Content & Citation Gaps", href: "/aeo-optimization" },
    ],
  },
  {
    title: "Generative Engine Optimization (GEO)",
    desc: "Evaluating LLM recommendation strength, cross-engine parity, and commercial discovery readiness.",
    href: "/geo-optimization",
    icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
    items: [
      { title: "What is Generative Engine Optimization?", href: "/glossary/geo" },
      { title: "The 8-Factor GEO Scoring Framework", href: "/geo-optimization" },
      { title: "Entity Consistency Across Knowledge Bases", href: "/glossary/entity-seo" },
    ],
  },
  {
    title: "AI Search Optimization",
    desc: "Holistic strategies bridging traditional website crawling and generative AI discoverability.",
    href: "/ai-search-optimization",
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    items: [
      { title: "How SEO, AEO, and GEO Work Together", href: "/ai-search-optimization" },
      { title: "SEO vs AEO vs GEO Comparison Matrix", href: "/seo-vs-aeo-vs-geo" },
      { title: "Measuring Brand AI Visibility", href: "/glossary/ai-visibility" },
    ],
  },
  {
    title: "Search & AI Glossary",
    desc: "Definitive, bite-sized definitions of key search engine and AI model terms with technical examples.",
    href: "/glossary",
    icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
    items: [
      { title: "Technical SEO Glossary Definition", href: "/glossary/technical-seo" },
      { title: "AI Search Explained", href: "/glossary/ai-search" },
      { title: "All 8 Core Definitions", href: "/glossary" },
    ],
  },
  {
    title: "Frequently Asked Questions",
    desc: "Comprehensive answers to the 14 most critical questions regarding search and AI visibility.",
    href: "/faq",
    icon: <HelpCircle className="w-5 h-5 text-emerald-400" />,
    items: [
      { title: "What is Zobay Rank?", href: "/faq" },
      { title: "What does an SEO audit include?", href: "/faq" },
      { title: "Browse All FAQs", href: "/faq" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Resources", url: "/resources" },
        ]}
      />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Knowledge Hub &amp; Educational Library</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              SEO, AEO &amp; GEO Resources
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              In-depth research, architectural blueprints, and definitive reference guides engineered by the Zobay Rank team.
            </p>
          </div>
        </section>

        {/* Resources Category Grid */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCE_HUBS.map((hub, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {hub.icon}
                    </div>
                    <Link
                      href={hub.href}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <h2 className="text-lg font-bold text-white">{hub.title}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{hub.desc}</p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    {hub.items.map((item, iIdx) => (
                      <Link
                        key={iIdx}
                        href={item.href}
                        className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors block truncate"
                      >
                        <span className="text-slate-500">→</span>
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href={hub.href}
                    className="block w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    View Hub
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
