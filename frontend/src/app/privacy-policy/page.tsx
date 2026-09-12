"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ShieldCheck, Lock, ArrowLeft, FileText, Database, Eye, Bell, Globe } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Privacy Policy
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
            <Lock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Summary:</strong> SeoSensing is committed to protecting your privacy. We process customer data strictly to deliver enterprise SEO crawling, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) insights. We do not sell your personal data or crawl results to third parties.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              1. Information We Collect
            </h2>
            <p>
              When you use the SeoSensing platform, we collect information necessary to provide, optimize, and secure our multi-pillar services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                <strong className="text-slate-200">Account Credentials & Profile:</strong> Name, work email address, password hashes (argon2/bcrypt encrypted), company/workspace name, and locale preferences.
              </li>
              <li>
                <strong className="text-slate-200">Audit & Crawl Target Configurations:</strong> Domain URLs, crawl depth parameters, robots.txt directives, target search engines (ChatGPT, Gemini, Perplexity, Claude), and brand entity knowledge graphs.
              </li>
              <li>
                <strong className="text-slate-200">Third-Party Platform API Tokens:</strong> Encrypted API keys provided for Google Search Console, Brevo SMTP, Slack Webhooks, or Discord notification channels.
              </li>
              <li>
                <strong className="text-slate-200">Usage Telemetry:</strong> Log timestamps, IP addresses for security rate-limiting, browser agent metadata, and API query volumes.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              2. How We Use Your Information
            </h2>
            <p>We process collected data exclusively for the following authorized operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Executing asynchronous, SSRF-protected website crawls and deterministic SEO health audits.</li>
              <li>Simulating conversational queries on AI answer engines to track brand citations and visibility share.</li>
              <li>Generating real-time alerting digests for critical drops in technical health or generative engine parity.</li>
              <li>Enforcing security safeguards, brute-force throttling, and authentication session integrity.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              3. Data Security & Cryptographic Safeguards
            </h2>
            <p>
              We implement industry-leading technical and organizational security controls to protect your data against unauthorized access, loss, or alteration:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                <strong className="text-slate-200">Transport Security:</strong> All API traffic, websocket feeds, and web traffic are strictly enforced over TLS 1.3 encryption with 256-bit SSL certificates.
              </li>
              <li>
                <strong className="text-slate-200">SSRF Protection:</strong> Internal network ranges, loopbacks, and private RFC 1918 subnets are strictly blocked from our automated web crawlers.
              </li>
              <li>
                <strong className="text-slate-200">Database Encryption:</strong> Multi-tenant isolation in PostgreSQL with encrypted storage at rest.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              4. Data Retention & User Rights (GDPR / CCPA)
            </h2>
            <p>
              Under applicable international privacy regulations including the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Access and export your audit history, crawl reports, and project settings in structured JSON format.</li>
              <li>Request immediate correction or updating of your administrative workspace contact.</li>
              <li>Request permanent deletion of your account, API keys, and all historical audit telemetry.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              5. Contact & Privacy Inquiries
            </h2>
            <p>
              For privacy requests, data export, or questions concerning this policy, please reach out directly to our Data Protection Office:
            </p>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10 text-xs space-y-1 text-slate-300">
              <p><strong>Entity:</strong> SeoSensing Enterprise Intelligence</p>
              <p><strong>Email:</strong> <a href="mailto:dm@fortunehestia.in" className="text-blue-400 hover:underline">dm@fortunehestia.in</a></p>
              <p><strong>Response SLA:</strong> Within 48 business hours</p>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
