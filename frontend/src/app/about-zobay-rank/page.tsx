import React from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "About Zobay Rank | AI Search & SEO Platform Entity Overview",
  description:
    "Official product entity overview of Zobay Rank by Zobay. Discover our mission, architectural pillars, capabilities, and who we build for.",
  path: "/about-zobay-rank",
  keywords: [
    "About Zobay Rank",
    "Zobay Rank Overview",
    "Zobay Search Platform",
    "Zobay Company",
    "AI Search Platform Entity",
  ],
});

export default function AboutZobayRankPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About Zobay Rank", url: "/about-zobay-rank" },
        ]}
      />
      <OrganizationJsonLd />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Product Entity Overview</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              About Zobay Rank
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Zobay Rank is an AI-powered SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform developed by Zobay.
            </p>

            {/* Direct Answer Entity Definition Block */}
            <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-blue-950/30 border border-blue-900/60 text-left space-y-2 mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Entity Definition</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong>Zobay Rank</strong> is a web-based software platform engineered to help modern businesses maintain deterministic technical website health, monitor conversational brand citations in AI answer engines (ChatGPT, Perplexity, Gemini), and maximize commercial recommendations in generative search systems.
              </p>
            </div>
          </div>
        </section>

        {/* Narrative & Pillars */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What Zobay Rank Does</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              As digital discovery shifts from traditional keyword searches to conversational AI assistants, businesses face a dual challenge: maintaining organic traffic from algorithmic crawlers while ensuring AI models accurately represent and recommend their brand.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Zobay Rank bridges this gap by unifying website crawlability diagnostics with live AI prompt monitoring, citation gap analysis, and entity graph governance in one consolidated workspace.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Our Three Core Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">1. Technical SEO</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated BFS crawling to detect 404 errors, redirect loops, canonical anomalies, heading structure issues, and crawl budget waste.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">2. AEO Intelligence</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time prompt testing across ChatGPT, Perplexity, and Gemini to extract source URLs, measure citation frequency, and bridge content gaps.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">3. GEO Optimization</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  An 8-factor score analyzing brand recommendation strength, knowledge graph entity consistency, and cross-engine parity.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Who Zobay Rank Is Designed For</h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>SaaS Companies:</strong> Competing for commercial software recommendation queries in AI models.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Digital Agencies:</strong> Providing modern AI search audits, client reporting, and citation tracking.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>E-Commerce Brands:</strong> Ensuring catalog crawlability and direct citation in AI shopping assistants.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Growth &amp; Content Teams:</strong> Aligning editorial publications with verified buyer prompt trends.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-slate-900/40 border-t border-slate-800/80 text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Explore Zobay Rank Today</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Run your first website audit and verify your brand's AI search visibility in minutes.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all inline-flex items-center gap-2"
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
