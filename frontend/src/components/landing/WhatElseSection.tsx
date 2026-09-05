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
      className="py-20 sm:py-24 bg-gradient-to-br from-[#060c22] via-[#0a1845] to-[#112d7a] text-white relative overflow-hidden"
    >
      {/* Ambient Blue Radial Flare (matching Image 2 top right) */}
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Top Split Header */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            What else does <br />
            the SEO Tool Scan do?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-3xl">
            Additionally, an SEO tool also facilitates an in-depth examination of backlinks, which are links from external websites to the target website. Backlinks are a significant ranking factor in search engine algorithms. The tool assesses the quality and quantity of backlinks, helping users identify potentially harmful or lowquality links that could hinder their SEO efforts.
          </p>

          <div>
            <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
              <button className="px-7 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition-all">
                All tools
              </button>
            </Link>
          </div>
        </div>

        {/* 3 Bottom Columns (matching Image 2 bottom row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/15">
          {/* Col 1: Title Tag */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Edit3 className="w-4 h-4 text-blue-300" />
              <Link href="/seo/content" className="hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>Title Tag</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Title Tag, what is the bold headline that your page shows a potential client see when they find your page in a search result.
            </p>
          </div>

          {/* Col 2: Meta Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <Link href="/seo/content" className="hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>Meta Description</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Meta Description, is the description of your page in search results strong enough for people to click on your page.
            </p>
          </div>

          {/* Col 3: Google Preview / AI Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Eye className="w-4 h-4 text-blue-300" />
              <Link href="/seo/pages" className="hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>Google Preview</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Google Preview, scans your page then shows how it would display in search results on Google. Would you click on that result if you saw it in search results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
