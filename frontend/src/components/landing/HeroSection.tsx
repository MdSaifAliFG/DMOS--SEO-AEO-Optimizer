"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  FileText,
  Bot,
  Layers,
  Settings,
  Fingerprint,
  TrendingUp,
  Star,
  Sparkles,
  CheckCircle2,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="hero"
      className="relative pt-24 pb-14 sm:pt-28 sm:pb-20 lg:py-24 bg-[#030712] text-white overflow-hidden flex items-center"
    >
      {/* Intense Royal Blue Ambient Glow Spots */}
      <div className="absolute -bottom-10 -left-10 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-[#1D63FF]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtext, CTAs, Highlights (6 cols) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Marketing Operating System</span>
            </div>

            {/* Main Bold Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] text-white font-sans">
              Unleash the power <br />
              of smarter <span className="text-white">SEO & AEO</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-normal">
              Stop guessing what is holding your website back. DMOS crawls, analyzes, and helps you optimize your website for traditional search engines and AI-powered answer engines.
            </p>

            {/* Side-by-Side Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-7 sm:px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-blue-600/40 hover:scale-[1.02] active:scale-95 transition-all">
                  Try free audit
                </button>
              </Link>

              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-7 sm:px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Scan your website
                </button>
              </Link>
            </div>

            {/* 2 Bottom Stat Highlights tailored to DMOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-5 border-t border-white/15">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                  Deterministic
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                  Real BFS website crawler, status code inspections, and 4-pillar technical SEO scoring.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                  SEO + AEO
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                  Track search crawl health alongside ChatGPT, Perplexity, and Gemini answer engine citations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 2-Column Angled Isometric Dashboard Collage (6 cols) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end overflow-visible">
            <div className="relative w-full max-w-[480px] sm:max-w-[520px] select-none scale-[0.84] sm:scale-95 lg:scale-100 origin-center sm:origin-top-right transform -rotate-[12deg] hover:-rotate-[8deg] transition-transform duration-500">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 items-start">
                
                {/* Column 1 (Left Tilted Column) */}
                <div className="space-y-4">
                  {/* Card 1A: SEO Audit Navigation Menu Card */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80 text-slate-900 border border-slate-100 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span>Overview</span>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold shadow-xs border border-blue-100">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>SEO Audit</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                        <Bot className="w-3.5 h-3.5 text-purple-600" />
                        <span>AEO Engines</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Pages</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Robots.txt</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 1B: BFS Live Crawl Square Card */}
                  <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-black/70 flex items-center gap-3.5 border border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">Live Crawl</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">BFS Engine Active</span>
                    </div>
                  </div>

                  {/* Card 1C: Technical Audit Status Card */}
                  <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-black/70 space-y-2 border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-800 font-bold">Audit Status</span>
                      <span className="text-emerald-600 font-bold font-mono">200 OK</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono space-y-1">
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span>2.4s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issues</span>
                        <span className="text-emerald-600 font-semibold">0 Critical</span>
                      </div>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-[#1D63FF] text-white text-[10px] font-bold shadow-md shadow-blue-600/30">
                      Run Audit
                    </button>
                  </div>
                </div>

                {/* Column 2 (Right Tilted Column - Offset slightly down) */}
                <div className="space-y-4 pt-6 sm:pt-8">
                  {/* Card 2A: Royal Blue Crawled Pages Capsule */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-4 sm:p-5 text-white shadow-2xl relative overflow-hidden space-y-1">
                    <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border border-white/20 pointer-events-none" />
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border border-white/10 pointer-events-none" />
                    
                    <span className="text-[11px] text-blue-100 font-semibold block">Crawled Pages</span>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight block font-mono">2,640</span>
                    <div className="pt-1 flex items-center gap-1 text-[10px] text-blue-100 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>100% Indexable</span>
                    </div>
                  </div>

                  {/* Card 2B: SEO Health Score & Category Breakdown */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/70 text-slate-900 space-y-2.5 border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">SEO Health Score</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xl sm:text-2xl font-black text-slate-950 font-mono">98 / 100</span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-500 flex items-center">
                          +12 <TrendingUp className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>

                    {/* Vertical Category Bars */}
                    <div className="h-12 flex items-end gap-1.5 pt-1">
                      {[88, 92, 98, 85, 96, 90, 100, 94].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full">
                          <div
                            className={`w-full rounded-full ${
                              i % 2 === 0 ? "bg-[#1D63FF]" : "bg-blue-300"
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2C: AI Citation Source Strip */}
                  <div className="bg-white rounded-full px-4 py-2 shadow-2xl shadow-black/60 flex items-center gap-2 border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="text-[9px] leading-tight truncate">
                      <span className="font-bold text-slate-900 block truncate">Perplexity AI Citation #1</span>
                      <span className="text-slate-400">perplexity.ai/search</span>
                    </div>
                  </div>

                  {/* Card 2D: ChatGPT Search Engine Badge */}
                  <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-black/70 text-center space-y-1.5 border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center border border-purple-200 shadow-xs">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">ChatGPT Search</span>
                      <span className="text-[10px] text-purple-600 block font-semibold">Answer Engine</span>
                    </div>
                    <div className="flex justify-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-2.5 h-2.5 fill-current" />
                      ))}
                    </div>
                    <button className="w-full py-1.5 rounded-xl bg-[#1D63FF] text-white text-[10px] font-bold">
                      View Citations
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
