"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Bot,
  Sparkles,
  Eye,
  Code2,
  TrendingUp,
  Layers,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface ServiceItem {
  id: string;
  category: "seo" | "aeo" | "remediation";
  tag: string;
  tagColor: string;
  icon: React.ElementType;
  iconBg: string;
  cardBg: string;
  borderColor: string;
  title: string;
  subtitle: string;
  subtitleColor: string;
  description: string;
  features: string[];
  modulePath: string;
  buttonClass: string;
  actionLabel: string;
  actionHref: string;
}

export const WhatElseSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"all" | "seo" | "aeo" | "remediation">("all");

  const services: ServiceItem[] = [
    {
      id: "technical-crawler",
      category: "seo",
      tag: "TRADITIONAL SERP",
      tagColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Globe,
      iconBg: "bg-blue-600 shadow-blue-600/25",
      cardBg: "from-blue-50/60 to-white",
      borderColor: "border-blue-200/80 hover:border-blue-300",
      title: "Technical Website Auditing",
      subtitle: "Search Engine Discoverability & Health",
      subtitleColor: "text-blue-600",
      description:
        "Automated recursive crawler inspecting every URL for status codes, canonical loops, redirect chains, Core Web Vitals, and indexability issues.",
      features: [
        "100+ Diagnostic SEO Rules",
        "Deep Heading & Content Analysis",
        "Broken Link & Redirect Tracker",
        "Robots.txt & Sitemap Inspection",
      ],
      modulePath: "Module: /seo/dashboard",
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20",
      actionLabel: "Explore Crawler",
      actionHref: isAuthenticated ? "/seo/dashboard" : "/login",
    },
    {
      id: "aeo-intelligence",
      category: "aeo",
      tag: "AI ANSWER ENGINES",
      tagColor: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Bot,
      iconBg: "bg-purple-600 shadow-purple-600/25",
      cardBg: "from-purple-50/60 to-white",
      borderColor: "border-purple-200/80 hover:border-purple-300",
      title: "AI Citation & Answer Tracking",
      subtitle: "Answer Engine Visibility & Citations",
      subtitleColor: "text-purple-600",
      description:
        "Monitor brand visibility, citation frequency, and synthesized answers across ChatGPT Search, Perplexity AI, Google AI Overviews, Gemini, and Claude.",
      features: [
        "Multi-Model Citation Tracker",
        "Brand Share-of-Voice Scoring",
        "Buyer Persona Prompt Evaluation",
        "Model Drift & Ranking Alerts",
      ],
      modulePath: "Module: /aeo/dashboard",
      buttonClass: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20",
      actionLabel: "Explore AEO",
      actionHref: isAuthenticated ? "/aeo/dashboard" : "/login",
    },
    {
      id: "serp-simulator",
      category: "seo",
      tag: "LIVE SIMULATOR",
      tagColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: Eye,
      iconBg: "bg-cyan-600 shadow-cyan-600/25",
      cardBg: "from-cyan-50/60 to-white",
      borderColor: "border-cyan-200/80 hover:border-cyan-300",
      title: "SERP & AI Snippet Simulator",
      subtitle: "Pixel-Perfect Google & AI Previews",
      subtitleColor: "text-cyan-600",
      description:
        "Real-time Google search snippet simulator. Test Title Tag and Meta Description pixel cutoffs, desktop vs mobile previews, and simulated AI search cards.",
      features: [
        "Desktop & Mobile Google Previews",
        "Pixel & Character Width Validation",
        "OpenGraph & Twitter Card Preview",
        "Simulated AI Answer Snippets",
      ],
      modulePath: "Module: /seo/optimize/metadata",
      buttonClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20",
      actionLabel: "Test Simulator",
      actionHref: isAuthenticated ? "/seo/optimize/metadata" : "/login",
    },
    {
      id: "code-remediation",
      category: "remediation",
      tag: "ACTION CENTER",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: Code2,
      iconBg: "bg-emerald-600 shadow-emerald-600/25",
      cardBg: "from-emerald-50/60 to-white",
      borderColor: "border-emerald-200/80 hover:border-emerald-300",
      title: "1-Click Code Remediation",
      subtitle: "Autonomous Fixes & Code Generation",
      subtitleColor: "text-emerald-600",
      description:
        "Direct copy-paste HTML patches for missing metadata, canonical links, robots directives, and heading hierarchies generated automatically for every issue.",
      features: [
        "Prioritized Severity Ranking",
        "1-Click Copy Ready HTML Snippets",
        "Canonical & OpenGraph Patches",
        "Automated Status Verification",
      ],
      modulePath: "Module: /seo/actions",
      buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
      actionLabel: "View Fixes",
      actionHref: isAuthenticated ? "/seo/actions" : "/login",
    },
    {
      id: "schema-entity",
      category: "remediation",
      tag: "STRUCTURED DATA",
      tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: Layers,
      iconBg: "bg-indigo-600 shadow-indigo-600/25",
      cardBg: "from-indigo-50/60 to-white",
      borderColor: "border-indigo-200/80 hover:border-indigo-300",
      title: "Entity Graph & Schema.org",
      subtitle: "Structured Data & LLM Grounding",
      subtitleColor: "text-indigo-600",
      description:
        "Construct rich JSON-LD schema markup (Organization, FAQPage, Article, Product) that grounds search crawlers and AI models in your authoritative brand entity.",
      features: [
        "Valid JSON-LD Schema Generation",
        "Knowledge Graph Entity Alignment",
        "Google Rich Result Eligibility",
        "Concept Association Mapping",
      ],
      modulePath: "Module: /aeo/monitoring/entities",
      buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20",
      actionLabel: "Build Schema",
      actionHref: isAuthenticated ? "/aeo/monitoring/entities" : "/login",
    },
    {
      id: "competitor-benchmark",
      category: "aeo",
      tag: "COMPETITIVE RADAR",
      tagColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: TrendingUp,
      iconBg: "bg-amber-600 shadow-amber-600/25",
      cardBg: "from-amber-50/60 to-white",
      borderColor: "border-amber-200/80 hover:border-amber-300",
      title: "Competitor Benchmark & Gaps",
      subtitle: "Gap Analysis & Competitive Presence",
      subtitleColor: "text-amber-600",
      description:
        "Benchmark citation shares and ranking positions against your competitors. Discover high-converting buyer questions where competitors outrank you in AI answers.",
      features: [
        "Head-to-Head Citation Comparison",
        "High-Intent Question Gap Analyzer",
        "Model Consensus & Sentiment Insights",
        "AI-Guided Strategy to Win Citations",
      ],
      modulePath: "Module: /aeo/competitors",
      buttonClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
      actionLabel: "Compare Rivals",
      actionHref: isAuthenticated ? "/aeo/competitors" : "/login",
    },
  ];

  const filteredServices =
    activeFilter === "all"
      ? services
      : services.filter((s) => s.category === activeFilter);

  return (
    <section
      id="what-else"
      className="py-20 sm:py-24 bg-white border-b border-slate-200 relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem]"
    >
      {/* Anchor for nav `#services` */}
      <div id="services" className="absolute -top-20 left-0 w-0 h-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        {/* Section Header (matching SEOAEOSection style) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Platform Services & Capabilities
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What else does the SeoSensing Suite do?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Beyond basic website checks, SeoSensing delivers an enterprise-grade toolkit for deep technical audits, AI answer engine citations, real-time SERP simulations, and automated code fixes.
          </p>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
              }`}
            >
              All Services ({services.length})
            </button>
            <button
              onClick={() => setActiveFilter("seo")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "seo"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Technical SEO ({services.filter((s) => s.category === "seo").length})</span>
            </button>
            <button
              onClick={() => setActiveFilter("aeo")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "aeo"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AEO & AI Citations ({services.filter((s) => s.category === "aeo").length})</span>
            </button>
            <button
              onClick={() => setActiveFilter("remediation")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "remediation"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Fixes & Schemas ({services.filter((s) => s.category === "remediation").length})</span>
            </button>
          </div>
        </div>

        {/* 6-Card Services Grid (matching SEOAEOSection card aesthetic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`p-7 rounded-2xl bg-gradient-to-b ${service.cardBg} border ${service.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-7 group`}
              >
                <div className="space-y-5">
                  {/* Top Row: Icon + Title + Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${service.iconBg} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {service.title}
                        </h3>
                        <span className={`text-xs font-semibold ${service.subtitleColor} block`}>
                          {service.subtitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge pill */}
                  <div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${service.tagColor}`}
                    >
                      {service.tag}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Checklist Features */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${service.subtitleColor}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Monospace Module + Action Button */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-mono font-medium truncate">
                    {service.modulePath}
                  </span>

                  <Link href={service.actionHref}>
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${service.buttonClass}`}
                    >
                      <span>{service.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Conversion Banner (matching PathToSuccessSection & SEOAEOSection vibe) */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Ready for actionable insights?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Scan your website and unlock full SEO & AEO optimization
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join over 1,500 brands discovering technical search barriers and growing citations across ChatGPT, Perplexity, and Google.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href={isAuthenticated ? "/overview" : "/login"}
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs tracking-wide shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>Start Free Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link
              href={isAuthenticated ? "/seo/dashboard" : "/login"}
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span>All Platform Tools</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
