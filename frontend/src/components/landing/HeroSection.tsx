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
  Activity,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="hero"
      className="relative pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 bg-[#030712] text-white overflow-hidden min-h-[94vh] flex items-center"
    >
      {/* Intense Royal Blue Ambient Glow Spots (matching reference image) */}
      <div className="absolute -bottom-20 -left-20 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] bg-[#1D63FF]/35 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-blue-600/25 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Left Column: Heading, Subtext, CTAs, Highlights (6 cols) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
            {/* Main Bold Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-black tracking-tight leading-[1.08] text-white font-sans">
              Unleash the power <br />
              of our <span className="text-white">SEO Tool</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
              Stop all the guessing... Now you can scan your website and see what is holding it back from showing in top results on Google & Bing.
            </p>

            {/* Side-by-Side Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-1">
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-blue-600/40 hover:scale-[1.02] active:scale-95 transition-all">
                  Try free scan
                </button>
              </Link>

              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Scan your website
                </button>
              </Link>
            </div>

            {/* 2 Bottom Stat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-7 border-t border-white/15">
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-[26px] font-black text-white tracking-tight font-sans">
                  +1500 users
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[230px]">
                  Compare yourself to your competition. Who is getting the better SEO score?
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-[26px] font-black text-white tracking-tight font-sans">
                  Site vs Site
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[230px]">
                  Can you try to beat your competitors? Try our Site vs Site feature now!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Angled Isometric 3D Dashboard Cards Group (6 cols) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end overflow-visible">
            {/* Unified Rotated Container (Angle matched to reference image) */}
            <div className="relative w-full max-w-[500px] sm:max-w-[540px] h-[500px] sm:h-[560px] select-none scale-[0.85] sm:scale-95 lg:scale-100 origin-center sm:origin-top-right transform -rotate-[12deg] hover:-rotate-[8deg] transition-transform duration-500">
              
              {/* Card 1: Main Menu Card (White rounded card with Blue Pin) */}
              <div className="absolute top-0 left-4 sm:left-6 w-48 sm:w-52 bg-white rounded-3xl p-5 shadow-2xl shadow-black/80 text-slate-800 z-20 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Profile</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100/90 text-slate-950 font-bold shadow-xs">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reports</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <Bot className="w-3.5 h-3.5" />
                    <span>AEO Engines</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Pages</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Royal Blue Contacts / Tracked Badge (Top Right) */}
              <div className="absolute -top-2 right-2 sm:right-4 w-40 sm:w-44 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-4 sm:p-5 text-white shadow-2xl z-20 relative overflow-hidden">
                {/* Subtle Circular Pattern */}
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border border-white/20 pointer-events-none" />
                <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full border border-white/10 pointer-events-none" />
                
                <span className="text-xs text-blue-100 font-semibold block">Contacts</span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight mt-1 block font-sans">16.0k</span>
                <div className="mt-2.5 flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40" />
                  <div className="w-5 h-5 rounded-full bg-white/30 border border-white/40" />
                  <div className="w-5 h-5 rounded-full bg-white/40 border border-white/40" />
                </div>
              </div>

              {/* Card 3: Total Earning & Vertical Bar Chart Card (Middle Right) */}
              <div className="absolute top-28 right-0 sm:right-2 w-52 sm:w-60 bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/70 text-slate-900 z-30 space-y-2 border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total earning</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-950 font-mono">$13,690</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-500 flex items-center">
                      36% <TrendingUp className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>

                {/* Vertical Blue Bars */}
                <div className="h-14 flex items-end gap-1.5 pt-1">
                  {[35, 55, 75, 45, 90, 65, 80, 100, 70].map((h, i) => (
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

              {/* Card 4: Fingerprint / Scan Square Card (Middle Center) */}
              <div className="absolute top-44 left-14 sm:left-24 w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-3xl p-3 sm:p-4 shadow-2xl shadow-black/60 flex flex-col items-center justify-center z-25 space-y-1.5 border border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Fingerprint className="w-7 h-7" />
                </div>
                <span className="text-xs font-extrabold text-slate-800">Scan</span>
              </div>

              {/* Card 5: Invoice / Subscription Pill Card (Bottom Left) */}
              <div className="absolute bottom-8 left-0 sm:left-4 w-40 sm:w-44 bg-white rounded-3xl p-4 shadow-2xl shadow-black/70 z-20 space-y-2 border border-slate-100">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span className="text-slate-800 font-bold">May 2021</span>
                  <span>$2.99</span>
                </div>
                <div className="text-[9px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Bill</span>
                    <span>$2.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due</span>
                    <span>05.05.24</span>
                  </div>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-[#1D63FF] text-white text-[10px] font-bold shadow-md shadow-blue-600/30">
                  Start now
                </button>
              </div>

              {/* Card 6: User Pill Strip (Middle-Bottom Long Capsule) */}
              <div className="absolute bottom-20 right-8 sm:right-16 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-2xl shadow-black/60 flex items-center gap-2.5 z-30 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center">
                  BG
                </div>
                <div className="text-[9px] leading-tight">
                  <span className="font-bold text-slate-900 block">Brian Green</span>
                  <span className="text-slate-400 text-[8px]">green_006@gmail.com</span>
                </div>
              </div>

              {/* Card 7: Diana Smith Profile Card (Bottom Right) */}
              <div className="absolute bottom-2 right-0 sm:right-2 w-36 sm:w-40 bg-white rounded-3xl p-3.5 shadow-2xl shadow-black/70 z-30 text-center space-y-1.5 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-slate-200 mx-auto overflow-hidden border-2 border-emerald-400 relative">
                  <div className="w-full h-full bg-gradient-to-tr from-amber-200 to-rose-200 flex items-center justify-center text-xs font-bold text-slate-700">
                    DS
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Diana Smith</span>
                  <span className="text-[9px] text-slate-400 block font-medium">Designer</span>
                </div>
                <div className="flex justify-center gap-0.5 text-amber-400">
                  {[...Array(4)].map((_, idx) => (
                    <Star key={idx} className="w-2.5 h-2.5 fill-current" />
                  ))}
                </div>
                <button className="w-full py-1.5 rounded-xl bg-[#1D63FF] text-white text-[10px] font-bold">
                  Message
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
