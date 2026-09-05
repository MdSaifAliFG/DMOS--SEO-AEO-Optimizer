"use client";

import React from "react";
import Link from "next/link";
import { Edit3, Sparkles, Eye, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const WhatElseSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="what-else"
      className="py-20 sm:py-24 2xl:py-36 3xl:py-44 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#112d7a] text-white relative overflow-hidden"
    >
      {/* Ambient Blue Radial Flare Scaled for 4K */}
      <div className="absolute -top-20 -right-20 w-[600px] 2xl:w-[900px] 3xl:w-[1100px] h-[600px] 2xl:h-[900px] 3xl:h-[1100px] bg-blue-400/20 rounded-full blur-[140px] 2xl:blur-[220px] pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1680px] 3xl:max-w-[1920px] 4k:max-w-[2240px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 space-y-16 2xl:space-y-24">
        {/* Top Split Header */}
        <div className="space-y-6 2xl:space-y-8 max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl">
          <h2 className="text-3xl sm:text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-white tracking-tight leading-tight">
            What else does <br />
            the SEO Tool Scan do?
          </h2>

          <p className="text-xs sm:text-sm 2xl:text-base 3xl:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl 2xl:max-w-5xl">
            Additionally, an SEO tool also facilitates an in-depth examination of backlinks, which are links from external websites to the target website. Backlinks are a significant ranking factor in search engine algorithms. The tool assesses the quality and quantity of backlinks, helping users identify potentially harmful or lowquality links that could hinder their SEO efforts.
          </p>

          <div>
            <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
              <button className="px-7 2xl:px-9 py-3 2xl:py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs 2xl:text-sm shadow-lg transition-all cursor-pointer">
                All tools
              </button>
            </Link>
          </div>
        </div>

        {/* 3 Bottom Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-14 3xl:gap-18 pt-8 2xl:pt-12 border-t border-white/15">
          {/* Col 1: Title Tag */}
          <div className="space-y-3 2xl:space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm 2xl:text-lg">
              <Edit3 className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-300" />
              <Link href="/seo/content" className="hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>Title Tag</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-300 leading-relaxed">
              Title Tag, what is the bold headline that your page shows a potential client see when they find your page in a search result.
            </p>
          </div>

          {/* Col 2: Meta Description */}
          <div className="space-y-3 2xl:space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm 2xl:text-lg">
              <Sparkles className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-300" />
              <Link href="/seo/content" className="hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>Meta Description</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-300 leading-relaxed">
              Meta Description, is the description of your page in search results strong enough for people to click on your page.
            </p>
          </div>

          {/* Col 3: Google Preview / AI Preview */}
          <div className="space-y-3 2xl:space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm 2xl:text-lg">
              <Eye className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-300" />
              <Link href="/seo/pages" className="hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>Google Preview</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-300 leading-relaxed">
              Google Preview, scans your page then shows how it would display in search results on Google. Would you click on that result if you saw it in search results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
