import React from "react";
import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhatElseSection } from "@/components/landing/WhatElseSection";
import { PathToSuccessSection } from "@/components/landing/PathToSuccessSection";
import { SEOAEOSection } from "@/components/landing/SEOAEOSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "SeoSensing — Unleash the Power of Smarter SEO & AEO",
  description:
    "Stop all the guessing... Scan your website and see what is holding it back from showing in top results on Google, Bing, and AI answer engines.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SeoSensing — Unleash the Power of Smarter SEO & AEO",
    description:
      "Scan your website, evaluate technical SEO rules, and monitor AI answer engine citations in one unified platform.",
    url: "https://seosensing.internal",
    siteName: "SeoSensing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SeoSensing — SEO & AEO Platform",
    description:
      "Next-generation website crawler and AI Answer Engine Optimization platform.",
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
          "Unified SEO crawling, technical website auditing, and AEO Answer Engine Optimization platform.",
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
                "SeoSensing is an all-in-one AI Search & SEO Sensing Operating System that brings automated technical SEO auditing, crawling, and AI-powered Answer Engine Optimization (AEO) into one unified workspace.",
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
      <main className="flex-1">
        {/* Section 1: Hero Section (Image 1) */}
        <HeroSection />

        {/* Section 2: What Else Does SEO Tool Scan Do (Image 2) */}
        <WhatElseSection />

        {/* Section 3: A Path to Online Success (Image 3) */}
        <PathToSuccessSection />

        {/* Section 4: One Platform, Two Engines (SEO vs AEO) */}
        <SEOAEOSection />

        {/* Section 5: Choose a Perfect Plan (Image 4) */}
        <PricingSection />

        {/* Section 6: Frequently Asked Questions (Image 5) */}
        <FAQSection />

        {/* Section 7: Final Conversion CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
