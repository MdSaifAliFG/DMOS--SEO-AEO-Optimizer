"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  FileText,
  Package,
  Wallet,
  Settings,
  Fingerprint,
  TrendingUp,
  Star,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="hero"
      className="relative pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 bg-[#030712] text-white overflow-hidden"
    >
      {/* Intense Royal Blue Ambient Glow Spots (matching Image 1) */}
      <div className="absolute -bottom-24 -left-20 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-[#1D63FF]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Grid Dot Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs (6 cols) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            {/* Main Bold Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.1] text-white font-sans">
              Unleash the power <br className="hidden sm:inline" />
              of our <span className="text-white">SEO Tool</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
              Stop all the guessing... Now you can scan your website and see what is holding it back from showing in top results on Google & Bing.
            </p>

            {/* Side-by-Side Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-1">
              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-7 sm:px-8 py-3.5 rounded-full bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-blue-600/35 hover:scale-[1.02] active:scale-95 transition-all">
                  Try free scan
                </button>
              </Link>

              <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
                <button className="px-7 sm:px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Scan your website
                </button>
              </Link>
            </div>

            {/* 2 Bottom Stat / Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-white/10">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-white tracking-tight font-sans">+1500 users</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                  Compare yourself to your competition. Who is getting the better SEO score?
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-white tracking-tight font-sans">Site vs Site</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                  Can you try to beat your competitors? Try our Site vs Site feature now!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Isometric Floating SaaS Dashboard Cards (6 cols) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] sm:max-w-[540px] h-[480px] sm:h-[560px] lg:h-[580px] select-none scale-[0.82] sm:scale-95 lg:scale-100 origin-center sm:origin-top-right">
              {/* Card 1: Main Menu Card (White rounded card with Blue Pin) */}
              <div className="absolute top-2 left-0 sm:left-6 w-48 sm:w-52 bg-white rounded-3xl p-5 shadow-2xl shadow-black/70 text-slate-800 transform -rotate-[10deg] hover:rotate-0 transition-transform duration-300 z-20">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
                  <MapPin className="w-4 h-4 fill-blue-600 text-blue-600" />
                </div>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Profile</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100/90 text-slate-900 font-bold shadow-xs">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reports</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <Package className="w-3.5 h-3.5" />
                    <span>Products</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Wallet</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-slate-400">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Royal Blue Contacts Capsule (Top Right) */}
              <div className="absolute top-2 right-2 sm:right-4 w-40 sm:w-44 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-4 sm:p-5 text-white shadow-2xl transform rotate-[6deg] z-20">
                <span className="text-xs text-blue-100 font-semibold block">Contacts</span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight mt-1 block">16.0k</span>
                <div className="mt-2.5 flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40" />
                  <div className="w-5 h-5 rounded-full bg-white/30 border border-white/40" />
                  <div className="w-5 h-5 rounded-full bg-white/40 border border-white/40" />
                </div>
              </div>

              {/* Card 3: Total Earning & Vertical Bar Chart Card (Middle Right) */}
              <div className="absolute top-32 right-0 sm:right-2 w-52 sm:w-60 bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/60 text-slate-900 transform rotate-[8deg] z-30 space-y-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total earning</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg sm:text-2xl font-black text-slate-950 font-mono">$13,690</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-500 flex items-center">
                      36% <TrendingUp className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>

                {/* Vertical Blue Bars */}
                <div className="h-14 flex items-end gap-1.5 pt-1.5">
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

              {/* Card 4: Fingerprint / Scan Square Card */}
              <div className="absolute top-44 left-12 sm:left-24 w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col items-center justify-center transform -rotate-[6deg] z-20 space-y-1.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-slate-800">Scan</span>
              </div>

              {/* Card 5: Invoice / Subscription Pill Card (Bottom Left) */}
              <div className="absolute bottom-6 left-0 sm:left-4 w-40 sm:w-44 bg-white rounded-3xl p-3.5 shadow-2xl transform rotate-[4deg] z-20 space-y-2.5">
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

              {/* Card 6: User Pill Strip */}
              <div className="absolute bottom-16 right-10 sm:right-20 bg-white/95 backdrop-blur-md rounded-full px-3.5 py-1.5 shadow-2xl flex items-center gap-2.5 transform -rotate-[4deg] z-30 border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[8px] font-bold flex items-center justify-center">
                  BG
                </div>
                <div className="text-[9px] leading-tight">
                  <span className="font-bold text-slate-900 block">Brian Green</span>
                  <span className="text-slate-400 text-[8px]">green_006@gmail.com</span>
                </div>
              </div>

              {/* Card 7: Diana Smith Profile Card (Bottom Right) */}
              <div className="absolute bottom-0 right-0 sm:right-2 w-36 sm:w-40 bg-white rounded-3xl p-3.5 shadow-2xl transform rotate-[10deg] z-30 text-center space-y-1.5">
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
