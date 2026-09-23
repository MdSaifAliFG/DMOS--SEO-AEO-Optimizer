import React from "react";
import Link from "next/link";
import { HelpCircle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions (FAQ) | Zobay Rank",
  description:
    "Get clear, factual answers to the most common questions regarding Zobay Rank, SEO crawling, AEO prompt tracking, GEO optimization, and credit usage.",
  path: "/faq",
  keywords: [
    "Zobay Rank FAQ",
    "What is Zobay Rank",
    "What is SEO",
    "What is AEO",
    "What is GEO",
    "AI Citations Explained",
    "Zobay Rank Free Plan",
  ],
});

const ALL_FAQS = [
  {
    question: "What is Zobay Rank?",
    answer:
      "Zobay Rank is an AI-powered SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform developed by Zobay. It provides automated technical website crawling, live prompt tracking across leading AI models, citation extraction, and prioritized optimization recommendations.",
  },
  {
    question: "What is SEO?",
    answer:
      "SEO (Search Engine Optimization) is the process of improving website technical health, indexability, metadata, and link architecture so algorithmic search engines like Google and Bing can efficiently discover, crawl, and rank your pages.",
  },
  {
    question: "What is AEO?",
    answer:
      "AEO (Answer Engine Optimization) is the practice of optimizing content so artificial intelligence answer engines—including ChatGPT, Perplexity, and Gemini—cite your website as a factual source when generating direct answers to buyer queries.",
  },
  {
    question: "What is GEO?",
    answer:
      "GEO (Generative Engine Optimization) is the discipline of optimizing brand entity authority, content extractability, and recommendation readiness so generative search models actively recommend your business during commercial research.",
  },
  {
    question: "What is AI Search Optimization?",
    answer:
      "AI Search Optimization is a holistic search strategy combining technical crawling (SEO), conversational source citations (AEO), and generative model recommendations (GEO) to capture organic traffic across traditional search and AI assistants.",
  },
  {
    question: "How does Zobay Rank work?",
    answer:
      "You enter your website URL. Zobay Rank's high-concurrency BFS crawler audits your site's technical health. Simultaneously, our AEO and GEO engines query leading AI models with industry prompts to track brand citations, entity consistency, and competitor visibility.",
  },
  {
    question: "What does an SEO audit analyze?",
    answer:
      "A Zobay Rank SEO audit inspects HTTP status codes (200, 301, 404, 500), title tags, meta descriptions, H1–H6 heading hierarchies, canonical URLs, robots.txt directives, XML sitemaps, broken internal links, image alt attributes, and server response times.",
  },
  {
    question: "What does AEO measure?",
    answer:
      "AEO measures prompt visibility (how often your brand appears in AI answers), citation frequency (how often your domain is linked as a footnote source), answer sentiment, and competitor citation gaps.",
  },
  {
    question: "What does GEO measure?",
    answer:
      "GEO measures your 8-factor score: AI Visibility Score, Recommendation Strength, Citation Authority, Entity Understanding, Content Extractability, Technical AI Accessibility, Cross-Engine Parity, and Commercial Discovery.",
  },
  {
    question: "What are AI citations?",
    answer:
      "AI citations are explicit hyperlinked references or footnote attributions provided by an AI answer model acknowledging the original website used to verify its response.",
  },
  {
    question: "What are entities?",
    answer:
      "Entities are verified real-world concepts, organizations, products, and persons represented in search knowledge graphs. Clear entity optimization prevents AI models from confusing your brand with competitors or hallucinating inaccurate data.",
  },
  {
    question: "How does Zobay Rank track competitors?",
    answer:
      "Zobay Rank benchmarks your website side-by-side against competitor domains, identifying which queries competitors win in traditional search and which prompts cite competitor URLs in AI answer engines.",
  },
  {
    question: "Does Zobay Rank offer a free plan?",
    answer:
      "Yes. Zobay Rank offers a 100% Free plan providing 50 monthly credits to run initial website audits and test AI prompt tracking without requiring a credit card.",
  },
  {
    question: "How are Zobay Rank credits used?",
    answer:
      "Credits are consumed when running website crawls (proportional to pages crawled) or executing live AI answer engine prompt analyses. Monthly subscription credits replenish each billing cycle, and one-time top-up packs never expire.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "FAQ", url: "/faq" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={ALL_FAQS} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Public Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Find clear, factual answers about Zobay Rank, technical SEO crawling, AI answer engine citations, and generative optimization.
            </p>
          </div>
        </section>

        {/* FAQs List */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {ALL_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
            >
              <h2 className="text-base sm:text-lg font-bold text-white flex items-start gap-2.5">
                <span className="text-blue-400 font-mono shrink-0">Q{idx + 1}:</span>
                <span>{faq.question}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </section>

        {/* Still have questions */}
        <section className="py-16 bg-slate-900/40 border-t border-slate-800/80 text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Have a Specific Question?</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Our engineering and search team is here to assist. Email us directly at{" "}
              <a href="mailto:support@zobay.in" className="text-blue-400 underline">
                support@zobay.in
              </a>
              .
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-1.5"
              >
                <span>Try Free Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
