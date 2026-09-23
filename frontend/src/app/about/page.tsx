import React from "react";
import Link from "next/link";
import { Building, ShieldCheck, ArrowRight, CheckCircle2, Globe, Sparkles } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "About Us | Zobay & Zobay Rank",
  description:
    "Learn about Zobay and our flagship search intelligence platform, Zobay Rank. Mission, technical principles, and contact information.",
  path: "/about",
  keywords: [
    "About Zobay",
    "Zobay Rank Company",
    "Zobay Search Intelligence",
    "Zobay Rank Mission",
  ],
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <OrganizationJsonLd />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              <span>Company &amp; Mission</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              About Zobay
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We build intelligent software tools that help businesses navigate, measure, and succeed in the evolving landscape of internet search.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              At <strong>Zobay</strong>, our goal is to eliminate the guesswork from digital discoverability. With the rapid rise of generative AI and conversational answer engines, legacy search tools that rely solely on keyword scraping no longer provide the full picture.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We created <strong>Zobay Rank</strong> to give engineers, founders, and marketers a unified, deterministic operating system that covers technical website health (SEO), conversational answer citations (AEO), and generative engine authority (GEO).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>Deterministic Diagnostics</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We believe in transparent, verifiable measurements. Our crawler tests real HTTP responses and DOM elements, delivering concrete code guidance rather than abstract scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <span>AI Search Readiness</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We actively monitor query syntheses across ChatGPT, Perplexity, and Gemini, helping businesses earn citation links and protect brand entity recognition.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 text-center">
            <h2 className="text-xl font-bold text-white">Get in Touch</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Have questions about our platform or need support? Reach out to our team at{" "}
              <a href="mailto:support@zobay.in" className="text-blue-400 underline">
                support@zobay.in
              </a>
              .
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/about-zobay-rank"
                className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Read Product Entity Overview →
              </Link>
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
