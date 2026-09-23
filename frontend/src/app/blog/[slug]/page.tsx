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
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
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

      <main className="flex-1 pt-20">
        {/* ========================================================
            SECTION 1: HERO (Dark #050B18)
        ======================================================== */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Articles</span>
            </Link>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {post.category}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 pt-2 border-y border-white/10 py-3">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-300 font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Direct Answer Summary Block */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>EXECUTIVE ANSWER / CORE TAKEAWAY</span>
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {post.directAnswer}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Article Body Content)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
            {post.sections.map((section, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-4"
              >
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (Actionable Takeaways)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Action Checklist
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Recommended Implementation Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-base font-bold text-white">Audit Current Citations</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Submit test prompt permutations to verify whether ChatGPT or Perplexity cite your domain.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-base font-bold text-white">Optimize Answer Blocks</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Provide direct, 40-word declarative answer paragraphs beneath semantic H2 headers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-base font-bold text-white">Verify Crawler Directives</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ensure `GPTBot` and `PerplexityBot` are unblocked in your robots.txt and verify TTFB &lt; 500ms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: DARK SECTION (FAQ)
        ======================================================== */}
        {post.faqs.length > 0 && (
          <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
              <div className="text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Article Questions
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {post.faqs.map((faq, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-blue-500/40 transition-colors">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                      <span className="text-blue-400 font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        Q{idx + 1}
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
                <Link href="/blog" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                  ← Back to All Articles
                </Link>
                <Link href="/resources" className="text-slate-400 hover:text-white transition-colors">
                  All Resources Hub →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            SECTION 5: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Audit Your Website with Zobay Rank
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Run technical crawler diagnostics and track conversational AI citations from one dashboard.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run Free Audit</span>
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
