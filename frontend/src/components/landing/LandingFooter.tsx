"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { SeoSensingLogo } from "@/components/brand/SeoSensingLogo";

export const LandingFooter: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [quickScanUrl, setQuickScanUrl] = useState("");

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickScanUrl) {
      window.location.href = isAuthenticated
        ? `/seo/dashboard?scan=${encodeURIComponent(quickScanUrl)}`
        : `/login?url=${encodeURIComponent(quickScanUrl)}`;
    }
  };

  return (
    <footer className="bg-[#030712] border-t border-slate-800/80 text-slate-400 text-xs pt-16 pb-12 relative overflow-hidden">
      {/* Ambient Royal Blue Glow Backlight */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[250px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        {/* Top Section: Quick Website Scan Conversion Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/60 border border-blue-900/40 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Website Audit</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to optimize your website?
            </h3>
            <p className="text-xs text-slate-300">
              Run an automated deterministic SEO audit and inspect your AI answer engine visibility in seconds.
            </p>
          </div>

          <form
            onSubmit={handleQuickScan}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5 max-w-md"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                value={quickScanUrl}
                onChange={(e) => setQuickScanUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all shrink-0 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <span>Scan Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Middle Section: Footer Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          {/* Col 1: Brand Info (2 cols) */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <SeoSensingLogo size={36} />
              <span className="text-xl font-black tracking-tight text-white font-sans">
                SEO<span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Sensing</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              AI Search & SEO Sensing Operating System. Unified intelligence platform engineered for deterministic technical SEO crawling and AI Answer Engine Optimization (AEO).
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-400">All Systems Operational</span>
              <span className="text-slate-500">| v2.4 Enterprise</span>
            </div>
          </div>

          {/* Col 2: SEO Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">SEO Engine</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/seo/dashboard" className="hover:text-blue-400 transition-colors">
                  SEO Dashboard
                </Link>
              </li>
              <li>
                <Link href="/seo/projects" className="hover:text-blue-400 transition-colors">
                  Website Projects
                </Link>
              </li>
              <li>
                <Link href="/seo/technical" className="hover:text-blue-400 transition-colors">
                  Technical Audits
                </Link>
              </li>
              <li>
                <Link href="/seo/keywords" className="hover:text-blue-400 transition-colors">
                  Keyword Tracking
                </Link>
              </li>
              <li>
                <Link href="/seo/pages" className="hover:text-blue-400 transition-colors">
                  Crawled Webpages
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: AEO Intelligence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">AEO Intelligence</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/aeo/dashboard" className="hover:text-purple-300 transition-colors">
                  AEO Dashboard
                </Link>
              </li>
              <li>
                <Link href="/aeo/questions" className="hover:text-purple-300 transition-colors">
                  AI Question Tracking
                </Link>
              </li>
              <li>
                <Link href="/aeo/citations" className="hover:text-purple-300 transition-colors">
                  Citation Extraction
                </Link>
              </li>
              <li>
                <Link href="/aeo/answer-engine" className="hover:text-purple-300 transition-colors">
                  Answer Engine Monitor
                </Link>
              </li>
              <li>
                <Link href="/aeo/entities" className="hover:text-purple-300 transition-colors">
                  Knowledge Entities
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-blue-400 transition-colors">
                  About SeoSensing
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-400 transition-colors">
                  Features & Services
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-blue-400 transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition-colors">
                  Frequently Asked
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors font-semibold text-blue-400">
                  Sign In / Register →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Badges */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SeoSensing Platform. AI Search & SEO Sensing Operating System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SSRF Protected Crawler</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
