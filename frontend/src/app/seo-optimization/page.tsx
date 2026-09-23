import React from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  FileCode,
  Layers,
  Sparkles,
  Link2,
  FileText,
  BarChart3,
  Server,
  Terminal,
  Zap,
  Code,
  ExternalLink,
  RefreshCw,
  Cpu,
  Check,
  Activity,
  ChevronRight,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, SoftwareApplicationJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "SEO Optimization Platform | Zobay Rank",
  description:
    "Audit and optimize technical SEO, indexability, metadata, links and website health with Zobay Rank.",
  path: "/seo-optimization",
  keywords: [
    "SEO Optimization Platform",
    "Technical SEO Audit",
    "Website Crawler",
    "Indexability Checker",
    "Canonical Audit",
    "Broken Link Checker",
    "SEO Recommendations",
  ],
});

const faqs = [
  {
    question: "What is the Zobay Rank SEO Optimization Platform?",
    answer:
      "Zobay Rank is a deterministic technical SEO auditing and crawling platform that analyzes website health across four core pillars: crawlability, metadata, content structure, and internal linking.",
  },
  {
    question: "What technical checks does the Zobay Rank crawler execute?",
    answer:
      "Our crawler evaluates HTTP status codes (200, 301, 404, 500), title and meta description tag length, heading hierarchies (H1–H6), canonical URLs, robots.txt rules, XML sitemap validation, broken links, and image alt text coverage.",
  },
  {
    question: "How does Zobay Rank prioritize detected SEO issues?",
    answer:
      "Issues are categorized by severity: Critical (broken indexability, missing titles, 5xx server errors), High (redirect loops, missing H1, broken internal links), Medium (sub-optimal tag lengths, thin content), and Low (missing alt tags, un-minified assets).",
  },
  {
    question: "Can I track historical progress of my technical SEO health?",
    answer:
      "Yes. Every audit is saved to your Optimization History, allowing you to benchmark score improvements over time, track resolved issues, and download executive PDF reports.",
  },
];

export default function SeoOptimizationPage() {
  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "SEO Optimization", url: "/seo-optimization" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-20">
        {/* ========================================================
            SECTION 1: HERO (Dark #050B18)
        ======================================================== */}
        <section className="relative py-16 sm:py-24 2xl:py-32 bg-[#050B18] border-b border-white/10 overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <Globe className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Core Technical Search Engine Optimization</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Technical SEO Auditing &amp; <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                High-Concurrency Crawling
              </span>
            </h1>

            <p className="text-sm sm:text-lg 2xl:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Audit and optimize technical SEO, indexability, metadata, links, and website health with Zobay Rank's deterministic website crawler and automated diagnostics.
            </p>

            {/* Direct Answer Box for LLM Extractability & Trust */}
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 text-left space-y-2 backdrop-blur-xl shadow-2xl relative group hover:border-blue-500/50 transition-all">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>DIRECT ANSWER: WHAT IS THE ZOBAY RANK SEO PLATFORM?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank SEO Platform</strong> is a deterministic technical auditing suite that crawls your entire website, evaluates indexability, validates metadata and structured headers, traces canonical redirects, detects broken links, and delivers developer-ready recommendations to maximize crawl efficiency and organic search rank.
              </p>
            </div>

            {/* Live Telemetry Metric Bar */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">150+</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Pages / Sec Crawl</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-cyan-400">30+</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Audit Checkpoints</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-blue-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Deterministic Data</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-xl sm:text-2xl font-black text-emerald-400">0–100</span>
                <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider">Health Scoring</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run an SEO Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors text-center"
              >
                View Plans &amp; Credits
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHITE / LIGHT SECTION (Core Technical Dimensions)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-white text-slate-900 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] border-b border-slate-200">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
                <Server className="w-4 h-4 text-blue-600" />
                <span>Deterministic Diagnostics</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Complete Technical SEO Auditing Architecture
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Inspect every layer of your website from raw server response headers to internal link graphs without black-box approximations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Crawling &amp; Indexability</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Automated Breadth-First-Search (BFS) crawler verifies HTTP status codes (200, 301, 404, 500), robots.txt exclusion rules, noindex directives, and server response times across all subpaths.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-blue-600 font-semibold">
                  <span>Fast Concurrency Engine</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Metadata &amp; Headings</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Ensures title tags and meta descriptions meet recommended pixel constraints, eliminates duplicates, and enforces semantic H1–H6 hierarchy required for rich search snippet eligibility.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Pixel Width Validation</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-cyan-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Canonical URLs &amp; Redirects</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Identifies self-referencing canonical discrepancies, circular redirect chains, non-canonical internal links, and trailing-slash fragmentation that dilute PageRank equity.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-cyan-600 font-semibold">
                  <span>Zero Equity Loss</span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-emerald-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Robots.txt &amp; XML Sitemaps</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Tests robots.txt syntax, validates user-agent access for search bots, compares sitemap-listed URLs against actual crawled URLs, and flags orphan pages missing from navigation.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-emerald-600 font-semibold">
                  <span>Full Coverage Sync</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* Card 5 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Prioritized SEO Issues</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Detects 404 dead ends, missing tags, slow TTFB, mixed HTTP content, and unoptimized images. Issues are ranked by business impact with actionable developer remediation guidance.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-amber-600 font-semibold">
                  <span>Impact-Ranked Queue</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              {/* Card 6 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-purple-400 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Historical Benchmarking</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Store immutable audit records, compare health scores across deployments, and generate white-label PDF executive summaries for stakeholders and client reports.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-purple-600 font-semibold">
                  <span>Trend Analytics</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: DARK NAVY SECTION (BFS Deep Crawler Architecture)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#0f172a] text-white border-b border-white/10 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Engine Telemetry</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                High-Concurrency BFS Crawler Engine
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Engineered with memory-bounded queueing and polite request intervals to simulate how Googlebot, Bingbot, and AI search crawlers traverse your web infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Simulated Crawler Terminal */}
              <div className="lg:col-span-7 bg-[#0b1329] border border-blue-500/30 rounded-3xl p-6 sm:p-8 font-mono text-xs sm:text-sm shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-slate-400 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 font-sans font-bold text-slate-300">zobay-crawler-v2.9.sh</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">STATUS: RUNNING</span>
                </div>

                <div className="pt-5 space-y-3 text-slate-300">
                  <p className="text-blue-400 font-semibold">$ zobay crawl https://example.com --depth=5 --concurrency=16</p>
                  <p className="text-slate-400">[00:00.012] Initializing DNS resolution &amp; SSL handshake... OK (22ms)</p>
                  <p className="text-slate-400">[00:00.045] Fetching /robots.txt: 4 user-agents parsed, sitemap located.</p>
                  <p className="text-emerald-400">[00:00.180] 200 OK / (Desktop &amp; Mobile DOM rendered, 47 internal links queued)</p>
                  <p className="text-slate-400">[00:00.320] Depth 1: Crawling 16 concurrent requests...</p>
                  <p className="text-emerald-400">[00:00.410] 200 OK /ai-search-optimization (Canonical verified, Title: 48px)</p>
                  <p className="text-emerald-400">[00:00.590] 200 OK /pricing (All structured schemas valid)</p>
                  <p className="text-amber-400">[00:00.820] 301 MOVED /blog -&gt; /resources (Redirect chain resolved: 1 hop)</p>
                  <p className="text-slate-400">[00:01.210] Traversed 248 URLs. Memory footprint: 42MB. 0 unhandled exceptions.</p>
                  <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/80 text-blue-200 mt-4 text-[11px] sm:text-xs">
                    ✓ Final Diagnostic Score: 96/100 | 0 Critical | 2 Warnings | 1 Info
                  </div>
                </div>
              </div>

              {/* Right Column: Engine Capabilities */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 hover:border-blue-400/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
                    <h4 className="text-base font-bold text-white">Full Domestic Link Extraction</h4>
                  </div>
                  <p className="text-xs text-slate-300 pl-11 leading-relaxed">
                    Parses both raw HTML `&lt;a href&gt;` links and dynamically injected client-side routes to uncover pages hidden from primitive crawlers.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 hover:border-cyan-400/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">2</div>
                    <h4 className="text-base font-bold text-white">Configurable User-Agent Profiles</h4>
                  </div>
                  <p className="text-xs text-slate-300 pl-11 leading-relaxed">
                    Toggle between standard Googlebot Desktop, Googlebot Smartphone, Bingbot, or custom AI scraper agents to verify parity.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 hover:border-indigo-400/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">3</div>
                    <h4 className="text-base font-bold text-white">Adaptive Politeness &amp; Rate Control</h4>
                  </div>
                  <p className="text-xs text-slate-300 pl-11 leading-relaxed">
                    Respects `crawl-delay` rules and modulates concurrent worker threads dynamically to ensure production servers never experience latency degradation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: LIGHT SLATE-50 SECTION (Prioritization & Workflow)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-slate-50 text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Impact-Driven Triage</span>
              </div>
              <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
                Deterministic Issue Prioritization
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Rather than flooding you with hundreds of equal-weight alerts, Zobay Rank stratifies findings by actual search visibility impact.
              </p>
            </div>

            {/* Severity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Critical */}
              <div className="p-6 rounded-2xl bg-white border-2 border-rose-200 shadow-lg shadow-rose-100/50 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 font-bold text-xs uppercase tracking-wider">Critical</span>
                  <span className="text-xs font-mono font-bold text-rose-600">-25 to -40 pts</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Broken Indexability</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  5xx server errors, noindex on canonical landing pages, broken robots.txt rules blocking crawlers, and missing title tags.
                </p>
              </div>

              {/* High */}
              <div className="p-6 rounded-2xl bg-white border-2 border-amber-200 shadow-lg shadow-amber-100/50 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider">High</span>
                  <span className="text-xs font-mono font-bold text-amber-600">-15 to -25 pts</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Architecture Defects</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Redirect loops (301 chains &gt; 2 hops), missing primary H1 tags, broken internal 404 links, and non-canonical URL fragmentation.
                </p>
              </div>

              {/* Medium */}
              <div className="p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg shadow-blue-100/50 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">Medium</span>
                  <span className="text-xs font-mono font-bold text-blue-600">-5 to -15 pts</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Content Sub-Optimization</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Title tags exceeding 600px pixel limits, duplicate meta descriptions across pages, thin word counts (&lt; 250 words), and slow TTFB.
                </p>
              </div>

              {/* Low */}
              <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-lg shadow-slate-100/50 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">Low / Info</span>
                  <span className="text-xs font-mono font-bold text-slate-500">-1 to -5 pts</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Hygiene &amp; Best Practices</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Missing image alt text on non-decorative graphics, uncompressed assets, minor open-graph tag omissions, and external links missing rel attributes.
                </p>
              </div>
            </div>

            {/* 3-Step Execution Timeline */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">How an SEO Audit Works in Zobay Rank</h3>
                <p className="text-xs sm:text-sm text-slate-500">From URL submission to developer-ready code fixes in 3 streamlined steps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                    01
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Input Target Domain</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Provide your target URL and configure maximum crawl depth, concurrency limit, and custom robots parameters.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                    02
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Deterministic Inspection</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    The Zobay Rank crawler traverses internal links, inspects DOM elements, checks response headers, and audits status codes.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
                    03
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Actionable Remediation</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Review the 0–100 health score, browse categorized issues, and export concrete developer steps to fix ranking bottlenecks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: DARK SECTION (Technical SEO FAQs)
        ======================================================== */}
        <section className="py-20 sm:py-24 2xl:py-32 bg-[#050B18] text-slate-100 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Technical SEO Audit Questions &amp; Answers
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Detailed insights into crawler mechanics, indexability diagnostics, and score benchmarking.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
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
        <section className="py-20 sm:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Start Your Free Technical SEO Audit Today
            </h2>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Get an instant baseline of your website's crawlability, metadata accuracy, and status code health in under 60 seconds.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm tracking-wide shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Run an SEO Audit</span>
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
