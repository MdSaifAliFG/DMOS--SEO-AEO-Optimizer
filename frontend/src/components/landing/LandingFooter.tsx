"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { SeoSensingLogo } from "@/components/brand/SeoSensingLogo";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 text-slate-400 text-xs 2xl:text-sm pt-16 pb-12 2xl:pt-24 2xl:pb-16 relative overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1680px] 3xl:max-w-[1920px] 4k:max-w-[2240px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 space-y-14 2xl:space-y-20">

        {/* Middle Section: Footer Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 2xl:gap-16">
          {/* Col 1: Brand Info (2 cols) */}
          <div className="space-y-4 2xl:space-y-6 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <SeoSensingLogo size={36} className="2xl:scale-110 3xl:scale-120" />
              <span className="text-xl 2xl:text-2xl 3xl:text-3xl font-black tracking-tight text-white font-sans">
                SEO<span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Sensing</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs 2xl:text-sm 3xl:text-base leading-relaxed max-w-sm 2xl:max-w-md">
              AI Search & SEO Sensing Operating System. Unified intelligence platform engineered for deterministic technical SEO crawling and AI Answer Engine Optimization (AEO).
            </p>

            {/* Social Media Links with Authentic Brand Colors */}
            <div className="flex items-center gap-2.5 2xl:gap-3.5 pt-1.5">
              {/* X (formerly Twitter) */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-xl bg-black/90 border border-white/20 hover:border-white/50 flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-black/50 group"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-[#161b22] border border-white/20 hover:border-white/50 hover:bg-[#21262d] flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-black/50 group"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-[#0A66C2]/15 border border-[#0A66C2]/35 hover:border-[#0A66C2] hover:bg-[#0A66C2]/25 flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-[#0A66C2]/20 group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="4" fill="#0A66C2" />
                  <path fill="#FFFFFF" d="M6.5 9h-3v10h3V9zm-1.5-4.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm13.5 14.5h-3v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-3V9h2.88v1.37h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.59z"/>
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-9 h-9 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/35 hover:border-[#5865F2] hover:bg-[#5865F2]/25 flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-[#5865F2]/20 group"
              >
                <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/35 hover:border-[#1877F2] hover:bg-[#1877F2]/25 flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-[#1877F2]/20 group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="4" fill="#1877F2" />
                  <path
                    fill="#FFFFFF"
                    d="M15.12 24v-9.3h3.12l.47-3.62h-3.59V8.77c0-1.05.29-1.76 1.8-1.76h1.92V3.77c-.33-.04-1.47-.14-2.8-.14-2.77 0-4.66 1.69-4.66 4.79v2.67H8.25v3.62h3.13V24h3.74z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: SEO Products */}
          <div className="space-y-3 2xl:space-y-4">
            <h4 className="text-xs 2xl:text-sm font-bold text-white uppercase tracking-wider">SEO Engine</h4>
            <ul className="space-y-2 2xl:space-y-3 text-xs 2xl:text-sm">
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
          <div className="space-y-3 2xl:space-y-4">
            <h4 className="text-xs 2xl:text-sm font-bold text-purple-400 uppercase tracking-wider">AEO Intelligence</h4>
            <ul className="space-y-2 2xl:space-y-3 text-xs 2xl:text-sm">
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
          <div className="space-y-3 2xl:space-y-4">
            <h4 className="text-xs 2xl:text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 2xl:space-y-3 text-xs 2xl:text-sm">
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
        <div className="pt-8 2xl:pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm text-slate-500">
          <p>© 2026 SeoSensing Platform. AI Search & SEO Sensing Operating System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 2xl:w-5 2xl:h-5 text-emerald-500" />
              <span>SSRF Protected Crawler</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-400" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
