import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  ShoppingBag,
  Briefcase,
  Rocket,
  Users,
  Building,
  Sparkles,
  Globe,
  Bot,
  TrendingUp,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, FAQPageJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";

interface UseCaseData {
  slug: string;
  badge: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  directAnswer: string;
  icon: React.ReactNode;
  challenges: { title: string; description: string }[];
  features: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  ctaText: string;
}

const USE_CASES: Record<string, UseCaseData> = {
  saas: {
    slug: "saas",
    badge: "SaaS & Software Companies",
    title: "SaaS",
    metaTitle: "SEO, AEO & GEO for SaaS Companies | Zobay Rank",
    metaDescription:
      "Capture high-intent software buyers asking ChatGPT, Perplexity, and Google for SaaS tool recommendations with Zobay Rank.",
    heroHeading: "AI Search & SEO Optimization for SaaS",
    heroSubheading:
      "Win the queries that matter most. When prospects ask conversational AI models for software recommendations, ensure your product is cited as the top solution.",
    directAnswer:
      "SaaS AI Search Optimization combines technical landing page crawlability with Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO). It ensures B2B software brands are directly cited, compared, and recommended when prospective buyers research software alternatives in ChatGPT, Perplexity, and Gemini.",
    icon: <Building2 className="w-6 h-6 text-blue-400" />,
    challenges: [
      {
        title: "Competitors Recommended by Default",
        description:
          "Conversational models often recommend incumbent software providers unless your entity authority and citations are actively optimized.",
      },
      {
        title: "Technical Feature Page Bloat",
        description:
          "Complex product documentation, pricing changelogs, and app subdomains often cause canonical loops and crawl budget waste.",
      },
      {
        title: "Un-Cited Documentation",
        description:
          "Valuable API and integration guides remain invisible to answer engines due to missing schema markup and unstructured formatting.",
      },
    ],
    features: [
      {
        title: "High-Intent Prompt Tracking",
        description:
          "Monitor conversational queries like 'Best [category] software for [industry]' across ChatGPT, Perplexity, and Gemini.",
      },
      {
        title: "Entity Authority Grounding",
        description:
          "Solidify your software brand entity, product capabilities, and pricing in structured data so LLMs accurately synthesize features.",
      },
      {
        title: "Citation Gap Remediation",
        description:
          "Discover which comparison articles and review hubs answer engines rely on, and execute prioritized steps to earn citations.",
      },
    ],
    faqs: [
      {
        question: "How does Zobay Rank help SaaS companies win in AI search?",
        answer:
          "We track high-intent buyer prompts across ChatGPT and Perplexity, reveal competitor citation gaps, and provide actionable schema and content templates to earn recommendations.",
      },
      {
        question: "Can Zobay Rank audit SaaS documentation portals and subdomains?",
        answer:
          "Yes. Our BFS crawler handles multiple subdomains, documentation pages, and complex SPA routing to verify indexability and clean canonical tags.",
      },
    ],
    ctaText: "Start SaaS AI Search Audit",
  },
  ecommerce: {
    slug: "ecommerce",
    badge: "E-Commerce & Retail",
    title: "E-Commerce",
    metaTitle: "AI Search & SEO for E-Commerce Brands | Zobay Rank",
    metaDescription:
      "Drive high-margin organic sales by ensuring AI answer models cite your product catalog, collections, and verified customer reviews.",
    heroHeading: "SEO, AEO & GEO for Modern E-Commerce",
    heroSubheading:
      "Empower your product catalog to be discovered by traditional shoppers on Google and recommended by conversational AI shopping assistants.",
    directAnswer:
      "E-Commerce AI Search Optimization resolves faceted navigation crawl waste while structuring product entities, pricing, and reviews so conversational shopping agents cite your store as the authoritative merchant.",
    icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />,
    challenges: [
      {
        title: "Faceted Navigation Crawl Bloat",
        description:
          "Dynamic filters (size, color, price) create millions of thin parameter URLs that dilute domain authority and waste crawler bandwidth.",
      },
      {
        title: "Omission in AI Shopping Assistants",
        description:
          "When consumers ask LLMs 'Where can I buy [product]?', models frequently cite marketplace aggregators rather than your direct brand store.",
      },
      {
        title: "Broken Product Links & 404s",
        description:
          "Out-of-stock and discontinued items frequently generate dead links that harm technical health scores and crawl efficiency.",
      },
    ],
    features: [
      {
        title: "Catalog-Scale Canonical Auditing",
        description:
          "Instantly detect parameter duplication, canonical inconsistencies, and redirect chains across product and collection pages.",
      },
      {
        title: "Product Entity Verification",
        description:
          "Validate structured Product, Offer, and MerchantReturnPolicy schemas to facilitate direct citation in Google AI Overviews and ChatGPT.",
      },
      {
        title: "Commercial Buying Query Tracking",
        description:
          "Monitor high-intent product comparison prompts across answer engines and optimize collection landing pages to earn citations.",
      },
    ],
    faqs: [
      {
        question: "How does Zobay Rank handle thousands of e-commerce URLs?",
        answer:
          "Our high-concurrency BFS crawler allows custom depth, path filtering, and concurrency tuning to audit large catalogs without overloading your origin server.",
      },
      {
        question: "Can Zobay Rank help my products get recommended in ChatGPT Search?",
        answer:
          "Yes. We track commercial recommendation prompts and guide your content team to structure product specifications so LLMs extract and recommend your items.",
      },
    ],
    ctaText: "Audit Your E-Commerce Store",
  },
  agencies: {
    slug: "agencies",
    badge: "Digital & SEO Agencies",
    title: "Agencies",
    metaTitle: "SEO, AEO & GEO Platform for Digital Agencies | Zobay Rank",
    metaDescription:
      "Deliver modern AI search audits, citation tracking, and white-label executive reports for your clients with Zobay Rank.",
    heroHeading: "Next-Gen Search Intelligence for Agencies",
    heroSubheading:
      "Differentiate your agency. Offer clients unified technical SEO audits combined with cutting-edge ChatGPT and Perplexity citation analysis.",
    directAnswer:
      "Agency Search Optimization equips service firms with high-velocity crawling telemetry, multi-client workspace management, and white-label AEO/GEO audits that demonstrate ROI in conversational AI search.",
    icon: <Briefcase className="w-6 h-6 text-purple-400" />,
    challenges: [
      {
        title: "Client Anxiety Over AI Search",
        description:
          "Clients are noticing traditional organic clicks shift to AI answer boxes and demand measurable strategy and telemetry.",
      },
      {
        title: "Fragmented Tool Subscriptions",
        description:
          "Paying separately for technical crawlers, SERP rank trackers, and manual AI testing wastes budget and scatters client data.",
      },
      {
        title: "Difficulty Proving AEO Impact",
        description:
          "Without structured prompt tracking and citation extraction, agencies struggle to quantify their optimization work to stakeholders.",
      },
    ],
    features: [
      {
        title: "Multi-Project Client Management",
        description:
          "Organize multiple client websites, set recurring crawl schedules, and maintain discrete audit histories in one unified platform.",
      },
      {
        title: "White-Label Executive Reports",
        description:
          "Generate deterministic health and GEO parity summaries formatted for C-suite presentation and client deliverables.",
      },
      {
        title: "Prioritized Developer Action Cards",
        description:
          "Hand off clear, code-ready recommendations to client engineering teams categorized by business severity.",
      },
    ],
    faqs: [
      {
        question: "Does Zobay Rank support agency team collaboration?",
        answer:
          "Yes. Our Agency tier provides multi-seat workspaces, project tagging, and credit allocations tailored for agency client rosters.",
      },
      {
        question: "Can we export white-label reports for client meetings?",
        answer:
          "Yes. All audit histories, crawler diagnostics, and AEO citation benchmarks can be exported to clean executive PDFs.",
      },
    ],
    ctaText: "Explore Agency Solutions",
  },
  startups: {
    slug: "startups",
    badge: "High-Growth Startups",
    title: "Startups",
    metaTitle: "AI Search Visibility for Startups | Zobay Rank",
    metaDescription:
      "Establish early entity authority and secure recommendations in ChatGPT, Perplexity, and Claude with Zobay Rank.",
    heroHeading: "Outsmart Incumbents in AI Search",
    heroSubheading:
      "Startups cannot outspend incumbents on legacy backlinks. Win by establishing early entity consistency and securing recommendations in conversational search.",
    directAnswer:
      "Startup Search Optimization enables agile companies to build technically flawless website architectures, secure knowledge graph recognition, and win high-margin recommendations across AI models from day one.",
    icon: <Rocket className="w-6 h-6 text-amber-400" />,
    challenges: [
      {
        title: "Massive Incumbent Backlink Gap",
        description:
          "Traditional SERP ranking requires years of link acquisition that agile startups cannot afford to wait for.",
      },
      {
        title: "Zero Brand Entity Recognition",
        description:
          "New startup names are frequently unrecognized by LLM training corpora, leading to hallucinations or complete omission.",
      },
      {
        title: "Rapid Deployment Regressions",
        description:
          "Frequent product feature launches and redesigns often introduce broken routes, missing meta tags, and indexing regressions.",
      },
    ],
    features: [
      {
        title: "Zero-Latency Technical Auditing",
        description:
          "Catch broken canonicals, 404 links, and missing metadata before they impact your organic launch traction.",
      },
      {
        title: "Entity Authority Acceleration",
        description:
          "Structure your brand with valid Organization and SoftwareApplication schemas so answer engines immediately recognize your product.",
      },
      {
        title: "Niche Buyer Prompt Tracking",
        description:
          "Target specific long-tail buyer queries where incumbent solutions fail to answer modern user needs.",
      },
    ],
    faqs: [
      {
        question: "Why is AEO/GEO crucial for early-stage startups?",
        answer:
          "Early adopters frequently use Perplexity and ChatGPT to find new software tools. Winning recommendations in conversational search gives startups a direct channel to buyers.",
      },
      {
        question: "Does Zobay Rank offer an affordable plan for pre-seed startups?",
        answer:
          "Yes. We offer a 100% Free plan with 50 monthly credits to audit your early site, with low-cost $29 Starter plans as you scale.",
      },
    ],
    ctaText: "Launch Startup Audit Free",
  },
  "marketing-teams": {
    slug: "marketing-teams",
    badge: "Growth Marketing Teams",
    title: "Marketing Teams",
    metaTitle: "AI Search Intelligence for Growth Marketing Teams | Zobay Rank",
    metaDescription:
      "Align content production with live AI prompt trends, citation gaps, and generative visibility metrics using Zobay Rank.",
    heroHeading: "Data-Driven Search Intelligence for Marketing",
    heroSubheading:
      "Stop producing content in the dark. Discover what questions buyers actually ask AI models, and optimize your publications for maximum citations.",
    directAnswer:
      "Marketing Search Intelligence links content strategy directly to AI answer engine telemetry, revealing exactly which authoritative sources LLMs cite and providing concrete templates to earn brand citations.",
    icon: <Users className="w-6 h-6 text-pink-400" />,
    challenges: [
      {
        title: "Declining SERP Click-Through Rates",
        description:
          "Zero-click search results and AI answer boxes are capturing clicks that used to go directly to marketing blogs.",
      },
      {
        title: "Un-Tracked Brand Mentions in LLMs",
        description:
          "Traditional web analytics cannot show what conversational models tell buyers about your brand when you are not in the room.",
      },
      {
        title: "Misaligned Content Calendars",
        description:
          "Writing articles based solely on keyword volume rather than the conversational questions real decision-makers ask AI.",
      },
    ],
    features: [
      {
        title: "Conversational Question Discovery",
        description:
          "Uncover high-intent prompts asked by prospective buyers and build content that directly answers key evaluation questions.",
      },
      {
        title: "Citation Gap Analysis",
        description:
          "See which competitor blogs and industry portals are cited by ChatGPT and Perplexity, and bridge the gap with authoritative content.",
      },
      {
        title: "Deterministic Brand Health Scoring",
        description:
          "Track your ongoing technical health score and 8-factor GEO index to prove organic marketing impact to executive leadership.",
      },
    ],
    faqs: [
      {
        question: "How does Zobay Rank guide our editorial team?",
        answer:
          "We provide clear question-answer formatting recommendations, entity attribute requirements, and citation gap reports that your writers can follow directly.",
      },
      {
        question: "Can we track prompt visibility for custom brand keywords?",
        answer:
          "Yes. Add any commercial or informational prompt to your tracking list to monitor how models respond over time.",
      },
    ],
    ctaText: "Empower Your Marketing Team",
  },
  enterprise: {
    slug: "enterprise",
    badge: "Enterprise Organizations",
    title: "Enterprise",
    metaTitle: "Enterprise SEO, AEO & GEO Governance | Zobay Rank",
    metaDescription:
      "Large-scale crawl diagnostics, multi-engine parity analysis, and brand entity protection across millions of URLs with Zobay Rank.",
    heroHeading: "Enterprise Search & AI Governance",
    heroSubheading:
      "Protect your global digital footprint. Ensure consistent brand entity recognition and technical compliance across multi-domain enterprise architectures.",
    directAnswer:
      "Enterprise Search Governance provides automated crawl diagnostics, multi-engine parity analysis, and structured entity management across global domains, preventing search traffic regressions and protecting brand reputation in AI models.",
    icon: <Building className="w-6 h-6 text-cyan-400" />,
    challenges: [
      {
        title: "Distributed Architecture Governance",
        description:
          "Multiple regional websites, legacy CMS platforms, and micro-frontends create massive crawl inefficiencies and canonical conflicts.",
      },
      {
        title: "Conflicting Entity Information in LLMs",
        description:
          "Mergers, acquisitions, and outdated press releases cause AI models to hallucinate deprecated pricing and product specifications.",
      },
      {
        title: "Cross-Engine Performance Disparities",
        description:
          "Performing well on Google while being completely misrepresented or omitted in Perplexity and ChatGPT.",
      },
    ],
    features: [
      {
        title: "High-Concurrency Enterprise Crawling",
        description:
          "Audit complex architectures with configurable concurrency, custom request headers, timeout guards, and robots testing.",
      },
      {
        title: "Global Entity Graph Governance",
        description:
          "Validate Organization, Brand, and Executive entities across corporate sites to ensure unified representation in AI search.",
      },
      {
        title: "Cross-Engine Parity Matrix",
        description:
          "Benchmark brand mention rates and sentiment consistency simultaneously across ChatGPT, Perplexity, Gemini, and Claude.",
      },
    ],
    faqs: [
      {
        question: "Does Zobay Rank offer custom crawl limits for enterprise sites?",
        answer:
          "Yes. Our Business and Agency plans offer high credit allocations and customizable crawl parameters to handle deep enterprise architectures.",
      },
      {
        question: "How does Zobay Rank secure sensitive enterprise data?",
        answer:
          "All audit telemetry is encrypted in transit and at rest. Authenticated dashboard areas are strictly excluded from search crawlers.",
      },
    ],
    ctaText: "Contact Enterprise Sales",
  },
};

export function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = USE_CASES[params.slug];
  if (!data) return {};

  return createPageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/use-cases/${data.slug}`,
    keywords: [
      data.title,
      `SEO for ${data.title}`,
      `AEO for ${data.title}`,
      `GEO for ${data.title}`,
      "Zobay Rank Use Cases",
    ],
  });
}

export default async function UseCasePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const data = USE_CASES[params.slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Use Cases", url: "/use-cases" },
          { name: data.title, url: `/use-cases/${data.slug}` },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={data.faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              {data.icon}
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {data.heroHeading}
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {data.heroSubheading}
            </p>

            {/* Direct Answer Block */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Executive Overview</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {data.directAnswer}
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>{data.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Common Search &amp; AI Challenges in {data.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Where traditional SEO falls short and how AI answer engines disrupt organic traffic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.challenges.map((c, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <h3 className="text-sm font-bold text-white">{c.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features / Solutions Section */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How Zobay Rank Solves This for {data.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Tailored capabilities to secure top positions in both SERPs and conversational answer models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.features.map((f, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-blue-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {data.title} Search Optimization FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {data.faqs.map((faq, idx) => (
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
              Ready to Accelerate Your {data.title} Visibility?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Get an instant technical audit and start tracking AI citations with Zobay Rank.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>{data.ctaText}</span>
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
