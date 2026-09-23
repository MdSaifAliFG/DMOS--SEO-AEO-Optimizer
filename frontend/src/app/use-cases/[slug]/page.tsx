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
  AlertTriangle,
  Compass,
  Check,
  Target,
  BarChart3,
  Layers,
  Zap,
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
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
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
              <span className="w-4 h-4 flex items-center justify-center">{data.icon}</span>
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              {data.heroHeading}
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {data.heroSubheading}
            </p>

            {/* Direct Answer Box */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>EXECUTIVE STRATEGY OVERVIEW: {data.title.toUpperCase()}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {data.directAnswer}
              </p>
            </div>

            {/* Quick Industry Metrics */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">4 Engines</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">AI Search Coverage</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Verified Citations</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-indigo-400">Real-Time</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Prompt Monitoring</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">0–100</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">GEO Parity Index</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{data.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/use-cases"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors text-center"
              >
                Explore All Use Cases
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Industry Challenges)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Industry Search Bottlenecks</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Common Search &amp; AI Challenges in {data.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Where traditional SEO falls short and how conversational AI answer models disrupt organic traffic in your sector.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.challenges.map((c, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-rose-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                      0{i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-rose-600 font-semibold flex items-center justify-between">
                    <span>Critical Pain Point</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (How Zobay Rank Solves This)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Tailored Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                How Zobay Rank Solves This for {data.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Tailored capabilities to secure top positions in both traditional SERPs and conversational answer models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.features.map((f, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all flex flex-col justify-between group space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                      ✓
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-400 font-semibold">
                    <span>Verified Capability</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Strategy Playbook Roadmap)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Execution Blueprint</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                The 3-Stage Optimization Strategy for {data.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                A concrete sequence of optimizations to secure persistent citations, entity accuracy, and recurring organic search referrals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stage 1 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900">Technical Baseline &amp; Clean Routing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Run a deterministic BFS crawl to eliminate 404 errors, canonical loops, trailing slash discrepancies, and crawl budget leaks across critical landing pages.
                </p>
                <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-mono">
                  Focus: Crawlability &amp; Indexability
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900">Entity Disambiguation &amp; Schemas</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Structure your brand entity with machine-readable Organization, Product, and DefinedTerm schemas to cement your attributes into AI knowledge graphs.
                </p>
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-mono">
                  Focus: Knowledge Graph Grounding
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900">Prompt Tracking &amp; Citation Parity</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Submit real buyer prompt permutations across ChatGPT, Perplexity, Gemini, and Claude to bridge competitor citation gaps and verify recommendation strength.
                </p>
                <div className="p-3 rounded-xl bg-purple-50 text-purple-800 text-xs font-mono">
                  Focus: Answer Engine Parity
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK SECTION (FAQ)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {data.title} Search Optimization FAQ
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Specific technical and strategic questions on optimizing for search and AI in the {data.title} sector.
              </p>
            </div>

            <div className="space-y-4">
              {data.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-blue-500/40 transition-colors"
                >
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
          </div>
        </section>

        {/* ========================================================
            SECTION 6: VIBRANT GRADIENT HIGH-CONVERSION CTA
        ======================================================== */}
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Accelerate Your {data.title} Visibility?
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Get an instant technical audit and start tracking AI citations across conversational answer engines today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>{data.ctaText}</span>
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
