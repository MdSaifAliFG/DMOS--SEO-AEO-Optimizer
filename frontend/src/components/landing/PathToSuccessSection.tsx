"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake, Smile, UserCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const PathToSuccessSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      id="path-to-success"
      className="py-20 sm:py-24 2xl:py-36 3xl:py-44 bg-white relative overflow-hidden bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] 2xl:bg-[size:6rem_6rem]"
    >
      <div className="max-w-7xl 2xl:max-w-[1680px] 3xl:max-w-[1920px] 4k:max-w-[2240px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 space-y-14 2xl:space-y-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto space-y-4 2xl:space-y-6">
          <div>
            <span className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-[#F97316] tracking-tight block">
              A Path to
            </span>
            <h2 className="text-3xl sm:text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-[#0F172A] tracking-tight">
              Online Success
            </h2>
          </div>

          <p className="text-xs sm:text-sm 2xl:text-base 3xl:text-lg text-slate-600 leading-relaxed max-w-2xl 2xl:max-w-3xl mx-auto">
            SEO Secrets Revealed in One Simple Click! Stop all the guessing... Now you can scan your website and see what is holding it back from showing in top results on Google & Bing.
          </p>

          {/* CTA & Social Proof Avatars Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 2xl:gap-6 pt-2">
            <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
              <button className="px-8 2xl:px-10 py-3.5 2xl:py-4.5 rounded-full bg-[#EA580C] hover:bg-orange-600 text-white font-bold text-sm 2xl:text-base tracking-wide shadow-xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                <span>Start for free</span>
                <span>→</span>
              </button>
            </Link>

            <div className="flex items-center gap-2.5 text-xs 2xl:text-sm text-slate-500 font-medium">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-white text-[10px] 2xl:text-xs font-bold">
                  JD
                </div>
                <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] 2xl:text-xs font-bold">
                  AL
                </div>
                <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white text-[10px] 2xl:text-xs font-bold">
                  SK
                </div>
              </div>
              <span className="font-semibold text-slate-700">
                <strong className="text-orange-600">+1500 users</strong> across USA choose SeoSensing
              </span>
            </div>
          </div>
        </div>

        {/* 3 Deep Navy Rounded Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10 3xl:gap-12">
          {/* Card 1: User Friendly */}
          <div className="p-8 2xl:p-12 3xl:p-14 rounded-3xl 2xl:rounded-[36px] bg-gradient-to-b from-[#0B1538] to-[#060D24] border border-blue-900/60 shadow-xl text-white flex flex-col justify-between space-y-6 2xl:space-y-8 relative overflow-hidden group hover:border-blue-700/80 transition-all">
            <div className="absolute top-3 right-3 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
              <Smile className="w-24 h-24 2xl:w-36 2xl:h-36 3xl:w-44 3xl:h-44" />
            </div>

            <div className="space-y-4 2xl:space-y-5 relative z-10">
              <h3 className="text-xl 2xl:text-2xl 3xl:text-3xl font-black tracking-tight text-white">User Friendly</h3>
              <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-300 leading-relaxed font-normal">
                In the realm of digital marketing, user-friendliness is paramount, and our SEO tool embodies this principle at its core. Our website is especially designed with simplicity and efficiency in mind. Our SEO scan also helps our users to harness search engine optimization effortlessly, giving them accurate website analysis.
              </p>
            </div>
          </div>

          {/* Card 2: Best Support */}
          <div className="p-8 2xl:p-12 3xl:p-14 rounded-3xl 2xl:rounded-[36px] bg-gradient-to-b from-[#0B1538] to-[#060D24] border border-blue-900/60 shadow-xl text-white flex flex-col justify-between space-y-6 2xl:space-y-8 relative overflow-hidden group hover:border-blue-700/80 transition-all">
            <div className="absolute top-3 right-3 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
              <HeartHandshake className="w-24 h-24 2xl:w-36 2xl:h-36 3xl:w-44 3xl:h-44" />
            </div>

            <div className="space-y-4 2xl:space-y-5 relative z-10">
              <h3 className="text-xl 2xl:text-2xl 3xl:text-3xl font-black tracking-tight text-white">Best Support</h3>
              <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-300 leading-relaxed font-normal">
                In our commitment to delivering excellence, our SEO tool doesn't just stop at providing cutting-edge features; it also comes with the assurance of the best support. We understand that navigating the ever-evolving world of search engine optimization can pose challenges. This is where our dedicated support team comes in.
              </p>
            </div>
          </div>

          {/* Card 3: Secure */}
          <div className="p-8 2xl:p-12 3xl:p-14 rounded-3xl 2xl:rounded-[36px] bg-gradient-to-b from-[#0B1538] to-[#060D24] border border-blue-900/60 shadow-xl text-white flex flex-col justify-between space-y-6 2xl:space-y-8 relative overflow-hidden group hover:border-blue-700/80 transition-all">
            <div className="absolute top-3 right-3 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
              <ShieldCheck className="w-24 h-24 2xl:w-36 2xl:h-36 3xl:w-44 3xl:h-44" />
            </div>

            <div className="space-y-4 2xl:space-y-5 relative z-10">
              <h3 className="text-xl 2xl:text-2xl 3xl:text-3xl font-black tracking-tight text-white">Secure</h3>
              <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-300 leading-relaxed font-normal">
                Security is paramount in the digital landscape, and our website scanner takes it seriously. We've implemented robust security measures to safeguard your valuable data and ensure your peace of mind. From advanced encryption protocols that protect your website scan and strategies to airtight access controls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
