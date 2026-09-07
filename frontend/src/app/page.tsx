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
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "SeoSensing — Unleash the Power of Smarter SEO, AEO & GEO",
  description:
    "Stop all the guessing... Scan your website and see what is holding it back from showing in top results on Google, Bing, AI answer engines, and generative search models.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SeoSensing — Unleash the Power of Smarter SEO, AEO & GEO",
    description:
      "Scan your website, evaluate technical SEO rules, monitor AI answer citations, and optimize generative discovery (GEO) in one unified platform.",
    url: "https://seosensing.internal",
    siteName: "SeoSensing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SeoSensing — SEO, AEO & GEO Platform",
    description:
      "Next-generation website crawler, AI Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SeoSensing",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description":
          "Unified SEO crawling, technical website auditing, AI Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
      },
      {
        "@type": "Organization",
        "name": "SeoSensing",
        "url": "https://seosensing.internal",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is SeoSensing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "SeoSensing is an all-in-one SEO, AEO & GEO Operating System that brings automated technical SEO auditing, crawling, AI answer citations, and generative search optimization into one unified workspace.",
            },
          },
          {
            "@type": "Question",
            "name": "What is GEO (Generative Engine Optimization)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "GEO focuses on optimizing brand visibility, recommendation rate, citation authority, and entity consistency across generative AI models like ChatGPT Search, Perplexity Sonar, Google Gemini, and Claude Search.",
            },
          },
          {
            "@type": "Question",
            "name": "What is SEO optimization?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "SEO optimization helps improve how your website can be crawled, understood, indexed, and discovered through traditional search engines.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

        {/* 7. Final High-Conversion Blue CTA Strip */}
        <FinalCTA />
      </main>

      {/* Global Comprehensive Landing Footer */}
      <LandingFooter />
    </div>
  );
}
