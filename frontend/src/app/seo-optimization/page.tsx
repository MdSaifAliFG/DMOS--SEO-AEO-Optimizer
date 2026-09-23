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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "SEO Optimization", url: "/seo-optimization" },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-slate-900 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide">
              <Globe className="w-3.5 h-3.5" />
              <span>Core Technical Search Engine Optimization</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              SEO Optimization Platform
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Audit and optimize technical SEO, indexability, metadata, links and website health with Zobay Rank's high-concurrency website crawler.
            </p>

            {/* Direct Answer Block for AEO/GEO Extractability */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-blue-950/30 border border-blue-900/60 text-left space-y-2 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Direct Answer: What is the Zobay Rank SEO Platform?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Zobay Rank SEO Platform</strong> is a deterministic technical auditing suite that crawls your entire website, evaluates indexability, validates metadata and structured headers, traces canonical redirects, detects broken links, and delivers developer-ready recommendations to maximize crawl efficiency and organic search rank.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Run an SEO Audit</span>
                <ArrowRight className="w-4 h-4" />
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

        {/* Feature Pillar Grid */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Comprehensive Technical SEO Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built from first principles to provide transparent, deterministic website diagnostics without black-box assumptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Crawling &amp; Indexability</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated Breadth-First-Search (BFS) crawler verifies HTTP status codes, robots.txt exclusion rules, noindex directives, and server response times across all subpaths.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Metadata &amp; Headings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ensures title tags and meta descriptions meet recommended pixel constraints, eliminates duplicates, and enforces semantic H1–H6 hierarchy.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Canonical URLs &amp; Redirects</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies self-referencing canonical discrepancies, circular redirect chains, non-canonical internal links, and trailing-slash fragmentation.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Robots.txt &amp; XML Sitemaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tests robots.txt syntax, validates user-agent access, compares sitemap-listed URLs against actual crawled URLs, and flags orphan pages.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Prioritized SEO Issues</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detects 404 dead ends, missing tags, slow TTFB, mixed HTTP content, and unoptimized images. Issues are ranked by business impact with remediation guidance.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Historical Benchmarking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Store immutable audit records, compare health scores across deployments, and generate white-label PDF executive summaries for stakeholders.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                How an SEO Audit Works in Zobay Rank
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Run automated end-to-end technical diagnostics in three streamlined steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-blue-600/30">
                  1
                </div>
                <h3 className="text-base font-bold text-white">Input Target Domain</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provide your target URL and configure maximum crawl depth, concurrency limit, and custom robots parameters.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-blue-600/30">
                  2
                </div>
                <h3 className="text-base font-bold text-white">Deterministic Inspection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Zobay Rank crawler traverses internal links, inspects DOM elements, checks response headers, and audits status codes.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-blue-600/30">
                  3
                </div>
                <h3 className="text-base font-bold text-white">Actionable Remediation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review the 0–100 health score, browse categorized issues, and export concrete developer steps to fix ranking bottlenecks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions About Technical SEO
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear answers to the most common questions regarding website crawling and health scoring.
            </p>
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
              Start Your Free Technical SEO Audit Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Get an instant baseline of your website's crawlability, metadata accuracy, and status code health.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Run an SEO Audit</span>
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
