import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  Code,
  FileText,
  Lightbulb,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, DefinedTermJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

interface GlossaryItem {
  slug: string;
  term: string;
  metaTitle: string;
  metaDescription: string;
  definition: string;
  simpleExplanation: string;
  technicalExplanation: string;
  examples: string[];
  relatedConcepts: { term: string; href: string }[];
  faqs: { question: string; answer: string }[];
}

const GLOSSARY_TERMS: Record<string, GlossaryItem> = {
  seo: {
    slug: "seo",
    term: "SEO (Search Engine Optimization)",
    metaTitle: "What is SEO? Search Engine Optimization Defined | Zobay Rank",
    metaDescription:
      "A complete guide to Search Engine Optimization (SEO). Learn simple definitions, technical mechanics, crawlability rules, and best practices.",
    definition:
      "SEO (Search Engine Optimization) is the process of improving the technical quality, content relevance, and organic visibility of web pages within algorithmic search engines such as Google and Bing.",
    simpleExplanation:
      "SEO is like organizing and indexing a massive public library. You make your website easy for search engines to find, read, and recommend to people searching for answers.",
    technicalExplanation:
      "Technically, SEO requires optimizing HTML document structure, maintaining 200 HTTP status codes, eliminating redirect loops, configuring self-referencing canonical URLs, ensuring XML sitemaps match indexable pages, and optimizing Core Web Vitals (LCP, CLS, INP) for fast DOM rendering.",
    examples: [
      "Adding unique, descriptive title tags (< 60 chars) on every webpage.",
      "Fixing 404 broken links with appropriate 301 permanent redirects.",
      "Ensuring images include descriptive alt attributes for accessibility and image search.",
    ],
    relatedConcepts: [
      { term: "Technical SEO", href: "/glossary/technical-seo" },
      { term: "AEO (Answer Engine Optimization)", href: "/glossary/aeo" },
      { term: "GEO (Generative Engine Optimization)", href: "/glossary/geo" },
    ],
    faqs: [
      {
        question: "Why is technical SEO important?",
        answer:
          "If search engines cannot crawl or render your pages, even the highest-quality content will remain un-indexed and invisible to users.",
      },
      {
        question: "How does Zobay Rank assist with SEO?",
        answer:
          "Zobay Rank provides an automated BFS website crawler that audits status codes, meta tags, heading hierarchies, and crawl depth.",
      },
    ],
  },
  aeo: {
    slug: "aeo",
    term: "AEO (Answer Engine Optimization)",
    metaTitle: "What is AEO? Answer Engine Optimization Defined | Zobay Rank",
    metaDescription:
      "Comprehensive definition and technical guide to Answer Engine Optimization (AEO). Learn how AI answer engines cite and extract sources.",
    definition:
      "AEO (Answer Engine Optimization) is the strategic optimization of content to ensure artificial intelligence answer models (like ChatGPT, Perplexity, and Gemini) extract, cite, and present your brand in direct conversational answers.",
    simpleExplanation:
      "Instead of trying to get onto a page of 10 blue links, AEO focuses on being the exact source the AI quotes when someone asks a conversational question.",
    technicalExplanation:
      "AEO requires structuring content into bite-sized semantic answers, answering specific buyer questions within the first paragraph, marking up data with schema.org JSON-LD (FAQPage, DefinedTerm, Article), and ensuring public availability to AI crawler user-agents (`GPTBot`, `PerplexityBot`).",
    examples: [
      "Formatting product comparisons with clear Q&A headings.",
      "Providing concise 1-to-2 sentence direct definitions before deep explanations.",
      "Securing co-citations in authoritative industry publications that LLMs use during training and retrieval.",
    ],
    relatedConcepts: [
      { term: "AI Citations", href: "/glossary/citation" },
      { term: "AI Search", href: "/glossary/ai-search" },
      { term: "GEO", href: "/glossary/geo" },
    ],
    faqs: [
      {
        question: "How do answer engines select citations?",
        answer:
          "Models use retrieval-augmented generation (RAG) to fetch relevant web documents, evaluate domain authority, and extract concise factual sentences that directly answer the user prompt.",
      },
      {
        question: "How does Zobay Rank track AEO performance?",
        answer:
          "Zobay Rank submits target prompts to ChatGPT, Perplexity, and Gemini, extracts cited URLs, and alerts you to competitor citation gaps.",
      },
    ],
  },
  geo: {
    slug: "geo",
    term: "GEO (Generative Engine Optimization)",
    metaTitle: "What is GEO? Generative Engine Optimization Defined | Zobay Rank",
    metaDescription:
      "Authoritative guide to Generative Engine Optimization (GEO). Learn how LLMs form brand perceptions, recommendation strength, and parity.",
    definition:
      "GEO (Generative Engine Optimization) is the discipline of optimizing brand entities, citation authority, and commercial relevance so generative search models actively recommend your products during conversational research.",
    simpleExplanation:
      "When someone asks an AI 'What's the best software for my team?', GEO is what makes the AI recommend your brand instead of your competitor.",
    technicalExplanation:
      "GEO operates at the intersection of knowledge graphs, multi-turn LLM prompts, and training data synthesis. It is measured via 8 core factors: AI Visibility Score, Recommendation Strength, Citation Authority, Entity Understanding, Content Extractability, Technical AI Accessibility, Cross-Engine Parity, and Commercial Discovery.",
    examples: [
      "Maintaining authoritative, consistent brand entity descriptions across your website, Wikidata, and directories.",
      "Publishing factual comparison matrices comparing your product with industry alternatives.",
      "Providing an llms.txt file to accelerate machine-readable knowledge ingestion.",
    ],
    relatedConcepts: [
      { term: "Entity SEO", href: "/glossary/entity-seo" },
      { term: "AI Visibility", href: "/glossary/ai-visibility" },
      { term: "AEO", href: "/glossary/aeo" },
    ],
    faqs: [
      {
        question: "What is the difference between AEO and GEO?",
        answer:
          "AEO focuses on source citations and direct answer inclusion for specific questions, while GEO evaluates holistic brand perception, commercial recommendations, and multi-turn purchase influence.",
      },
      {
        question: "How does Zobay Rank calculate the GEO score?",
        answer:
          "Zobay Rank calculates an 8-factor score combining entity verification, citation authority, recommendation sentiment, and cross-engine parity.",
      },
    ],
  },
  "ai-search": {
    slug: "ai-search",
    term: "AI Search",
    metaTitle: "What is AI Search? AI-Powered Search Engines Defined | Zobay Rank",
    metaDescription:
      "Learn what AI search is, how generative answer engines work, and why modern search requires a unified SEO, AEO, and GEO strategy.",
    definition:
      "AI Search refers to modern search experiences powered by Large Language Models (LLMs) and conversational interfaces that synthesize answers, extract citations, and summarize web information in real time.",
    simpleExplanation:
      "AI Search replaces the need to click through multiple links by generating a synthesized, conversational answer with source citations.",
    technicalExplanation:
      "AI Search blends web index crawling with Retrieval-Augmented Generation (RAG). When a user prompts the engine, it performs web searches, retrieves authoritative snippets, passes them into an LLM context window, and synthesizes a direct answer with footnote references.",
    examples: [
      "Perplexity AI answering queries with linked web footnotes.",
      "Google AI Overviews summarizing search results at the top of the SERP.",
      "OpenAI ChatGPT Search synthesizing live web data.",
    ],
    relatedConcepts: [
      { term: "AEO", href: "/glossary/aeo" },
      { term: "GEO", href: "/glossary/geo" },
      { term: "Citations", href: "/glossary/citation" },
    ],
    faqs: [
      {
        question: "Will AI Search eliminate traditional websites?",
        answer:
          "No. AI models require authoritative websites to verify claims, cite sources, and update training weights with fresh data.",
      },
    ],
  },
  "technical-seo": {
    slug: "technical-seo",
    term: "Technical SEO",
    metaTitle: "What is Technical SEO? Technical Website Audits Defined | Zobay Rank",
    metaDescription:
      "Master Technical SEO fundamentals: server response codes, canonicalization, robots.txt, XML sitemaps, and crawl budgets.",
    definition:
      "Technical SEO refers to website and server optimizations that allow search engine spiders to crawl, render, interpret, and index website pages without friction.",
    simpleExplanation:
      "Technical SEO is the plumbing and foundation of your website. It ensures that search engine bots can open every door, read every page, and not get stuck.",
    technicalExplanation:
      "Technical SEO encompasses server-side rendering, HTTP response headers, crawl budget efficiency, canonical link elements (`rel='canonical'`), robots exclusion standards, DOM complexity, XML sitemap validation, and structured JSON-LD data.",
    examples: [
      "Resolving 301 redirect chains to preserve link equity and crawler speed.",
      "Using `rel='canonical'` to specify the master copy of duplicated query pages.",
      "Setting up gzip or brotli compression to speed up Time to First Byte (TTFB).",
    ],
    relatedConcepts: [
      { term: "SEO", href: "/glossary/seo" },
      { term: "Entity SEO", href: "/glossary/entity-seo" },
    ],
    faqs: [
      {
        question: "How often should I run a technical SEO audit?",
        answer:
          "Regular automated audits should be run after major code releases, redesigns, or at least monthly to catch indexing regressions.",
      },
    ],
  },
  "entity-seo": {
    slug: "entity-seo",
    term: "Entity SEO",
    metaTitle: "What is Entity SEO? Knowledge Graph Entities Defined | Zobay Rank",
    metaDescription:
      "Understand Entity SEO and Knowledge Graphs. Learn how AI models recognize brands, products, and people as distinct concepts.",
    definition:
      "Entity SEO is the practice of optimizing content around recognized concepts, organizations, products, and people (entities) rather than relying solely on string-based keyword matching.",
    simpleExplanation:
      "Keywords are just strings of letters. Entities are real-world things (like a company, person, or invention) with verified facts attached to them.",
    technicalExplanation:
      "Search engines and LLMs map entities into knowledge graphs with nodes (entities) and edges (relationships). Entity SEO utilizes Schema.org (Organization, Person, Product), Wikidata entries, and consistent topical co-occurrences to establish entity disambiguation.",
    examples: [
      "Defining your company with an Organization schema linking official domains and social profiles.",
      "Ensuring your product name is consistently associated with its specific software category.",
    ],
    relatedConcepts: [
      { term: "GEO", href: "/glossary/geo" },
      { term: "Technical SEO", href: "/glossary/technical-seo" },
    ],
    faqs: [
      {
        question: "How do entities impact AI recommendations?",
        answer:
          "LLMs recommend brands with clear, unambiguous entity attributes and high topical trust in their knowledge representations.",
      },
    ],
  },
  citation: {
    slug: "citation",
    term: "AI Citation",
    metaTitle: "What is an AI Citation? Source Attribution Defined | Zobay Rank",
    metaDescription:
      "Learn what AI citations are, how ChatGPT and Perplexity attribute sources, and how to optimize for citation inclusion.",
    definition:
      "An AI Citation is an explicit URL reference, source footnote, or hyperlinked attribution provided by an AI answer model acknowledging the original webpage used to generate an answer.",
    simpleExplanation:
      "An AI citation is like a bibliography entry in a research paper—the AI gives credit to your website as the factual source for its answer.",
    technicalExplanation:
      "During RAG extraction, answer engines segment retrieved web pages into text chunks, score their relevance against the user prompt, and append footnote links to the sentences synthesized from those chunks.",
    examples: [
      "A linked source pill at the top of a Perplexity answer.",
      "A bracketed footnote in ChatGPT Search pointing directly to your guide.",
    ],
    relatedConcepts: [
      { term: "AEO", href: "/glossary/aeo" },
      { term: "AI Visibility", href: "/glossary/ai-visibility" },
    ],
    faqs: [
      {
        question: "How can I get more AI citations for my website?",
        answer:
          "Publish original data, format answers clearly with headings, provide concise definitions, and permit AI search bots in robots.txt.",
      },
    ],
  },
  "ai-visibility": {
    slug: "ai-visibility",
    term: "AI Visibility",
    metaTitle: "What is AI Visibility? AI Search Metrics Defined | Zobay Rank",
    metaDescription:
      "Discover what AI visibility is and how to measure brand inclusion, citation rates, and prompt sentiment across leading AI models.",
    definition:
      "AI Visibility is the quantitative measure of how frequently, prominently, and positively a brand is mentioned, cited, or recommended across conversational AI models and answer engines.",
    simpleExplanation:
      "AI visibility tells you whether artificial intelligence answers know who you are and recommend you to people asking questions in your industry.",
    technicalExplanation:
      "Calculated as a composite metric incorporating prompt appearance rate (percentage of target prompts mentioning the brand), citation percentage (percentage of answers hyperlinking your domain), and recommendation rank (position in recommended lists).",
    examples: [
      "A 68% citation rate across 100 tracked commercial software queries.",
      "Being listed as the #1 recommended tool in 8 out of 10 Perplexity answers.",
    ],
    relatedConcepts: [
      { term: "AEO", href: "/glossary/aeo" },
      { term: "GEO", href: "/glossary/geo" },
      { term: "AI Search", href: "/glossary/ai-search" },
    ],
    faqs: [
      {
        question: "How does Zobay Rank measure AI visibility?",
        answer:
          "Zobay Rank continuously tests your tracked prompts across ChatGPT, Perplexity, Gemini, and Claude, compiling citation and recommendation scores into an executive dashboard.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(GLOSSARY_TERMS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = GLOSSARY_TERMS[params.slug];
  if (!item) return {};

  return createPageMetadata({
    title: item.metaTitle,
    description: item.metaDescription,
    path: `/glossary/${item.slug}`,
    keywords: [
      item.term,
      `What is ${item.term}`,
      `${item.term} definition`,
      "Search Glossary",
      "Zobay Rank Glossary",
    ],
  });
}

export default async function GlossarySlugPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = GLOSSARY_TERMS[params.slug];

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Glossary", url: "/glossary" },
          { name: item.term, url: `/glossary/${item.slug}` },
        ]}
      />
      <DefinedTermJsonLd
        term={item.term}
        description={item.definition}
        url={`/glossary/${item.slug}`}
      />
      <FAQPageJsonLd faqs={item.faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-20">
        {/* ========================================================
            SECTION 1: HERO (Dark #050B18)
        ======================================================== */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Search &amp; AI Intelligence Glossary</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {item.term}
            </h1>

            {/* Direct Definition Extractable Block */}
            <div className="max-w-3xl mx-auto p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>FORMAL DEFINITION</span>
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {item.definition}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Dual Explanations)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Conceptual &amp; Architectural Context
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Understanding {item.term}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Simple Explanation */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Simple Explanation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.simpleExplanation}
                </p>
              </div>

              {/* Technical Explanation */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Technical &amp; Architectural Context</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.technicalExplanation}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Practical Examples)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Actionable Implementation
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Real-World Examples
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {item.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    0{i + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {ex}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Related Concepts)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-3 py-1 rounded-full border border-slate-300">
                Knowledge Graph Connections
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Related Concepts in Zobay Rank
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {item.relatedConcepts.map((rc, i) => (
                <Link
                  key={i}
                  href={rc.href}
                  className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-blue-400 hover:shadow-lg text-sm font-bold text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <span>{rc.term}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK SECTION (FAQ)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Common Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {item.faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-blue-500/40 transition-colors">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      Q{i + 1}
                    </span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-8 flex justify-between items-center text-xs text-slate-400 border-t border-white/10">
              <Link href="/glossary" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                ← Back to Glossary Index
              </Link>
              <Link href="/resources" className="text-slate-400 hover:text-white transition-colors">
                All Resources Hub →
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 6: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Audit Your Digital Presence with Zobay Rank
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Verify your technical website health, schema markup, and AI answer citations today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run a Free Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-semibold text-sm transition-colors text-center"
              >
                View Plans &amp; Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
