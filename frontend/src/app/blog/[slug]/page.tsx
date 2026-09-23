import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, ArticleJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  readTime: string;
  directAnswer: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

const BLOG_POSTS: Record<string, BlogPost> = {
  "how-ai-answer-engines-choose-sources": {
    slug: "how-ai-answer-engines-choose-sources",
    title: "How AI Answer Engines Choose Which Websites to Cite as Sources",
    metaTitle: "How AI Answer Engines Choose Sources to Cite | Zobay Rank",
    metaDescription:
      "A technical investigation into RAG retrieval, citation scoring, and how ChatGPT and Perplexity select web sources to cite.",
    author: "Zobay Rank Research Team",
    publishedAt: "2026-09-15T09:00:00Z",
    updatedAt: "2026-09-20T14:30:00Z",
    category: "AEO Intelligence",
    readTime: "6 min read",
    directAnswer:
      "AI answer engines select sources by retrieving web documents via search APIs, chunking the content into semantic vectors, calculating semantic similarity against the user prompt, evaluating domain trustworthiness, and appending footnote URLs to synthesized sentences.",
    sections: [
      {
        heading: "1. The Retrieval-Augmented Generation (RAG) Pipeline",
        paragraphs: [
          "When a user enters a prompt into an answer engine like Perplexity or ChatGPT Search, the model does not rely purely on static weights. It queries real-time search indices to retrieve the top 10 to 50 web documents matching the intent.",
          "These web pages are rapidly parsed, stripped of boilerplate navigation, and segmented into semantic paragraphs or text chunks for vector re-ranking.",
        ],
      },
      {
        heading: "2. The Importance of Chunk-Level Extractability",
        paragraphs: [
          "Unlike traditional search engines that rank entire web pages based on domain-wide backlink counts, answer engines score specific paragraphs on extractability.",
          "If a webpage buries a direct answer beneath introductory fluff, the retrieval model will often favor a competitor that provides a direct, concise definition within the first two sentences.",
        ],
      },
      {
        heading: "3. Schema Markup and Machine Readability",
        paragraphs: [
          "Structured JSON-LD data—such as DefinedTerm, FAQPage, and Organization—provides explicit entity tags that help LLMs verify facts without parsing ambiguity.",
          "Ensuring your robots.txt allows access to AI crawler user-agents (`GPTBot`, `PerplexityBot`) is mandatory for ongoing citation inclusion.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can paywalled content be cited by AI answer models?",
        answer:
          "Generally no. Unless the AI provider has explicit commercial licensing agreements with the publisher, crawler user-agents cannot bypass paywalls or authentication walls to extract citations.",
      },
      {
        question: "How does Zobay Rank detect citation gaps?",
        answer:
          "Zobay Rank submits your target buyer prompts to multiple LLMs, parses all citation footnotes, and flags instances where competitors are cited but your domain is omitted.",
      },
    ],
    relatedSlugs: ["technical-seo-checklist-for-ai-crawlers", "understanding-8-factor-geo-score"],
  },
  "technical-seo-checklist-for-ai-crawlers": {
    slug: "technical-seo-checklist-for-ai-crawlers",
    title: "The Technical SEO Checklist for AI Crawlers and LLM Agents",
    metaTitle: "Technical SEO Checklist for AI Crawlers | Zobay Rank",
    metaDescription:
      "Essential technical checklist to ensure your website is crawlable, fast, and indexable for both traditional bots and modern AI agents.",
    author: "Zobay Rank Research Team",
    publishedAt: "2026-09-10T11:00:00Z",
    updatedAt: "2026-09-18T16:00:00Z",
    category: "Technical SEO",
    readTime: "7 min read",
    directAnswer:
      "Optimizing for AI crawlers requires permitting AI user-agents in robots.txt, providing a clean llms.txt, maintaining 200 HTTP status codes, serving server-rendered HTML, and keeping Time to First Byte (TTFB) under 500ms.",
    sections: [
      {
        heading: "1. AI User-Agent Accessibility in Robots.txt",
        paragraphs: [
          "Many websites inadvertently block AI web crawlers by using aggressive disallow wildcards. Ensure user-agents such as `GPTBot`, `ClaudeBot`, and `PerplexityBot` are explicitly allowed on public content pages.",
          "Keep authenticated dashboard paths, user data, and APIs securely disallowed.",
        ],
      },
      {
        heading: "2. Server-Side Rendering (SSR) vs. Client-Only Hydration",
        paragraphs: [
          "While Googlebot has some JavaScript rendering capabilities, many real-time AI retrieval bots have strict timeout windows (1 to 3 seconds). If your primary text requires multiple client-side JavaScript roundtrips to render, AI bots will time out and treat the page as empty.",
          "Always ensure primary headings, article bodies, and FAQ content are rendered in the initial HTML payload.",
        ],
      },
      {
        heading: "3. Status Codes and Canonical Self-Referencing",
        paragraphs: [
          "Ensure every indexable page returns a 200 OK status code. Avoid circular redirects and multi-hop 301 chains that exhaust crawler budgets.",
          "Self-referencing canonicals prevent parameter fragmentation caused by tracking query strings.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is an llms.txt file?",
        answer:
          "An llms.txt file is a markdown file placed at your domain root that provides a concise, machine-readable summary of your product, capabilities, and key documentation for LLMs.",
      },
    ],
    relatedSlugs: ["how-ai-answer-engines-choose-sources", "understanding-8-factor-geo-score"],
  },
  "understanding-8-factor-geo-score": {
    slug: "understanding-8-factor-geo-score",
    title: "Understanding the 8-Factor GEO Score in Generative Search",
    metaTitle: "The 8-Factor GEO Score Explained | Zobay Rank",
    metaDescription:
      "A deep dive into Zobay Rank's proprietary 8-factor Generative Engine Optimization diagnostic framework.",
    author: "Zobay Rank Research Team",
    publishedAt: "2026-09-05T08:30:00Z",
    updatedAt: "2026-09-12T10:15:00Z",
    category: "GEO Optimization",
    readTime: "8 min read",
    directAnswer:
      "The 8-factor GEO score measures: AI Visibility, Recommendation Strength, Citation Authority, Entity Understanding, Content Extractability, Technical AI Accessibility, Cross-Engine Parity, and Commercial Discovery.",
    sections: [
      {
        heading: "1. Moving Beyond Blue Link Positions",
        paragraphs: [
          "Traditional SERP position is a 1-dimensional number (e.g., position #3). In generative search, an answer can mention your brand positively, recommend you as an alternative, quote your statistics, or completely omit you.",
          "The 8-Factor GEO score captures this multi-dimensional performance across all major generative engines.",
        ],
      },
      {
        heading: "2. Entity Understanding and Cross-Engine Parity",
        paragraphs: [
          "A brand might perform strongly on Perplexity while remaining unknown to Claude Search. Cross-engine parity measures whether knowledge graph entities are uniformly recognized across different model families.",
          "Consistent company descriptions, verified product categories, and schema markup solidify entity representation across models.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a good GEO score in Zobay Rank?",
        answer:
          "Scores above 80 indicate high recommendation strength and multi-engine parity. Scores between 50 and 79 represent moderate visibility with clear citation gaps to address.",
      },
    ],
    relatedSlugs: ["how-ai-answer-engines-choose-sources", "technical-seo-checklist-for-ai-crawlers"],
  },
};

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = BLOG_POSTS[params.slug];
  if (!post) return {};

  return createPageMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    keywords: [post.category, post.title, "Zobay Rank Blog", "AI Search Guide"],
  });
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = BLOG_POSTS[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.metaDescription}
        url={`/blog/${post.slug}`}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        authorName={post.author}
      />
      <FAQPageJsonLd faqs={post.faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Post Header */}
          <header className="space-y-6 pt-10 border-b border-slate-800 pb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Articles</span>
            </Link>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {post.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Direct Answer Summary Block */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Executive Answer</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {post.directAnswer}
              </p>
            </div>
          </header>

          {/* Article Body */}
          <div className="space-y-10 text-sm sm:text-base text-slate-300 leading-relaxed">
            {post.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Post FAQs */}
          {post.faqs.length > 0 && (
            <section className="pt-8 border-t border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {post.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
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
          )}

          {/* CTA Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Audit Your Website with Zobay Rank</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Run technical crawler diagnostics and track conversational AI citations from one dashboard.
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
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}
