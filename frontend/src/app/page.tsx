import React from "react";
import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhatElseSection } from "@/components/landing/WhatElseSection";
import { PathToSuccessSection } from "@/components/landing/PathToSuccessSection";
import { SEOAEOSection } from "@/components/landing/SEOAEOSection";
import { QuickScanSection } from "@/components/landing/QuickScanSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

import { createPageMetadata } from "@/lib/seo-metadata";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  SoftwareApplicationJsonLd,
  FAQPageJsonLd,
} from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Zobay Rank — SEO, AEO & GEO Optimization Platform",
  description:
    "Zobay Rank helps businesses improve search visibility with SEO, Answer Engine Optimization and Generative Engine Optimization across traditional and AI-powered search.",
  path: "/",
  keywords: [
    "Zobay Rank",
    "SEO Optimization",
    "Answer Engine Optimization",
    "AEO",
    "Generative Engine Optimization",
    "GEO",
    "AI Search Visibility",
    "Technical SEO Platform",
  ],
});

const homeFaqs = [
  {
    question: "What is Zobay Rank?",
    answer:
      "Zobay Rank is an AI-powered SEO, AEO, and GEO optimization platform that helps businesses improve traditional search visibility, answer engine visibility, and generative AI search visibility.",
  },
  {
    question: "What is the difference between SEO, AEO, and GEO?",
    answer:
      "SEO optimizes websites for crawler indexing and SERP blue links; AEO structures content for source citation in conversational answers (ChatGPT, Perplexity); and GEO establishes entity authority and recommendation strength in generative search.",
  },
  {
    question: "How does Zobay Rank perform technical SEO audits?",
    answer:
      "Our high-concurrency BFS crawler audits status codes, title tags, meta descriptions, canonical URLs, robots.txt directives, XML sitemaps, and broken internal links to deliver a 0–100 health score.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      {/* Structured Data Schemas */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={homeFaqs} />

      {/* Sticky Top Navigation */}
      <LandingNavbar />

      {/* Main Marketing Flow */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero Section with Side-by-Side Angled Product Collage */}
        <HeroSection />

        {/* 2. Quick Scan Demo — Live Results Preview */}
        <QuickScanSection />

        {/* 3. Three Optimization Engines: SEO, AEO & GEO Master Grid */}
        <SEOAEOSection />

        {/* 4. The Path to Search Success: 4 Sequential Steps */}
        <PathToSuccessSection />

        {/* 4. What Else You Can Do: Secondary Feature Bento Grid */}
        <WhatElseSection />

        {/* 5. Transparent Self-Serve Pricing Tiers */}
        <PricingSection />

        {/* 6. Frequently Asked Questions with Visual Support Pill Collage */}
        <FAQSection />

        {/* 7. Direct Communication & Contact Form Section */}
        <ContactSection />

        {/* 8. Final High-Conversion Blue CTA Strip */}
        <FinalCTA />
      </main>

      {/* Global Comprehensive Landing Footer */}
      <LandingFooter />
    </div>
  );
}
