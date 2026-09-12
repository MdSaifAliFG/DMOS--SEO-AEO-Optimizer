"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Scale, Server } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <LandingNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Terms &amp; Conditions
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Effective Date: January 1, 2026 • Last Updated: September 12, 2026
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-10 space-y-10 text-sm text-slate-300 leading-relaxed backdrop-blur-md">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>
              Please read these Terms &amp; Conditions carefully before utilizing the SeoSensing platform. By creating an account or initiating an automated audit, you agree to comply with and be bound by these provisions.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              1. Platform License &amp; Service Scope
            </h2>
            <p>
              SeoSensing grants enterprise users a non-exclusive, non-transferable, revocable license to access and use our suite of technical SEO crawling, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) tools in accordance with your subscription tier.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              2. Acceptable Use Policy &amp; Crawling Directives
            </h2>
            <p>You agree to adhere strictly to ethical audit and scanning guidelines:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>You may only target domains and web assets for which you have explicit ownership, authorization, or lawful public audit rights.</li>
              <li>You must respect target server robots.txt directives and configured rate-limiting delays to prevent service degradation.</li>
              <li>You shall not attempt to bypass platform security safeguards, flood crawl queues, or reverse engineer proprietary ranking heuristics.</li>
              <li>You will not use automated scripts to abuse platform authentication endpoints or bypass session token expirations.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. Account Security &amp; Credential Protection
            </h2>
            <p>
              You are solely responsible for maintaining the confidentiality of your workspace login credentials, API secrets, and webhook tokens. Any activity occurring under your authenticated session will be attributed to your workspace account.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              4. Disclaimer of Search Engine &amp; AI Output Warranties
            </h2>
            <p>
              While SeoSensing utilizes deterministic crawler scoring and high-frequency AI model tracking (OpenAI ChatGPT, Google Gemini, Perplexity AI, Anthropic Claude), search engine algorithms and generative model outputs are subject to third-party changes outside our direct control. We do not guarantee specific organic ranking positions or permanent AI answer inclusion.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-400" />
              5. Limitation of Liability &amp; Governing Jurisdiction
            </h2>
            <p>
              To the maximum extent permitted by applicable law, SeoSensing shall not be liable for indirect, incidental, or consequential damages resulting from audit outages, target website downtime, or algorithmic volatility.
            </p>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10 text-xs space-y-1 text-slate-300">
              <p><strong>Inquiries &amp; Legal Notices:</strong> <a href="mailto:dm@fortunehestia.in" className="text-blue-400 hover:underline">dm@fortunehestia.in</a></p>
              <p><strong>Corporate Jurisdiction:</strong> Applicable state and national commercial arbitration guidelines.</p>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
