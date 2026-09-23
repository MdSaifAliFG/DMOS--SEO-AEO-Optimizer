import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Globe,
  Bot,
  TrendingUp,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Zobay Rank vs. Traditional SEO Tools | Platform Comparison",
  description:
    "An objective comparison between Zobay Rank's unified SEO+AEO+GEO architecture and legacy keyword/crawler-only SEO tools.",
  path: "/compare/zobay-rank-vs-traditional-seo-tools",
  keywords: [
    "Zobay Rank vs Traditional SEO Tools",
    "AEO vs Traditional SEO Tools",
    "Generative Search Tool Comparison",
    "AI Answer Engine Crawler Comparison",
  ],
});

const faqs = [
  {
    question: "Why can't traditional SEO tools measure AI answer visibility?",
    answer:
      "Traditional SEO tools scrape Google and Bing search engine result pages (SERPs) to count blue link positions. They do not simulate conversational buyer prompts across LLMs like ChatGPT, Perplexity, or Gemini, nor do they extract conversational source citations.",
  },
  {
    question: "Does Zobay Rank replace the need for technical website crawling?",
    answer:
      "No. Technical website crawling remains a vital foundation of Zobay Rank. Our built-in crawler audits HTTP codes, title tags, meta descriptions, canonical URLs, and indexability rules alongside AI answer engine telemetry.",
  },
  {
    question: "What is the primary advantage of a unified SEO, AEO, and GEO platform?",
    answer:
      "A unified platform eliminates data silos. You can see how technical crawl issues directly impact whether AI search models can index, cite, and recommend your brand, all from one consolidated dashboard.",
  },
];

export default function ZobayRankVsTraditionalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Compare", url: "/compare" },
          {
            name: "Zobay Rank vs Traditional SEO Tools",
            url: "/compare/zobay-rank-vs-traditional-seo-tools",
          },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>Verifiable Architecture Comparison</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Zobay Rank vs. Traditional SEO Tools
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Evaluating the transition from legacy SERP keyword rank scrapers to modern AI Search &amp; Answer Engine Optimization.
            </p>

            {/* Direct Answer Summary Block */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Traditional SEO tools were engineered during the Google blue-link era to monitor keyword positions, backlinks, and desktop page speed. <strong>Zobay Rank</strong> retains full technical SEO crawling capabilities while expanding into <strong>AEO</strong> (live ChatGPT, Perplexity, and Gemini citation tracking) and <strong>GEO</strong> (8-factor generative search recommendation scoring), providing unified visibility across both legacy search and generative AI.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Capability Comparison Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Factual breakdown of supported features across legacy and modern search environments.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 w-1/2">Capability</th>
                  <th className="p-4 w-1/4 text-center">Traditional SEO Tools</th>
                  <th className="p-4 w-1/4 text-center text-blue-400">Zobay Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                <tr>
                  <td className="p-4 font-bold text-white">Technical Website Crawling</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported (Built-in BFS)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Status Code &amp; Canonical Audits</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Title &amp; Meta Description Validation</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Live AI Answer Engine Tracking (ChatGPT, Perplexity)</td>
                  <td className="p-4 text-center text-rose-400 font-bold">Not Available</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported (AEO Module)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">AI Source Citation Extraction &amp; Gap Analysis</td>
                  <td className="p-4 text-center text-rose-400 font-bold">Not Available</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">8-Factor GEO Recommendation Score</td>
                  <td className="p-4 text-center text-rose-400 font-bold">Not Available</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported (GEO Module)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Knowledge Graph Entity Consistency Validation</td>
                  <td className="p-4 text-center text-rose-400 font-bold">Rare / Limited</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Cross-Engine AI Parity Matrix</td>
                  <td className="p-4 text-center text-rose-400 font-bold">Not Available</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">Supported</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Comparison Questions Answered
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400 font-mono">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-b from-blue-950/20 to-slate-950 border-t border-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Upgrade Your Search Stack with Zobay Rank
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Combine technical crawling with live AI answer tracking and generative discovery.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Try Free Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
