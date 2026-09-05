"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

export const FinalCTA: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 2xl:py-32 3xl:py-40 bg-gradient-to-b from-slate-950 via-[#070e24] to-black text-white relative overflow-hidden">
      {/* Ambient Blue Glow Scaled for 4K */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] 2xl:w-[950px] h-[350px] 2xl:h-[550px] bg-blue-600/20 rounded-full blur-[120px] 2xl:blur-[200px] pointer-events-none" />

      <div className="max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 text-center relative z-10 space-y-6 2xl:space-y-8">
        <span className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3.5 2xl:px-4 py-1 2xl:py-1.5 rounded-full border border-blue-500/20">
          Get Started Today
        </span>

        <h2 className="text-3xl sm:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-white tracking-tight leading-tight">
          Your website deserves more than guesswork.
        </h2>

        <p className="text-sm sm:text-base 2xl:text-lg 3xl:text-xl text-slate-300 max-w-xl 2xl:max-w-3xl mx-auto leading-relaxed">
          Analyze. Understand. Optimize. Join marketing teams and growth leaders elevating their visibility across search and AI answer engines.
        </p>

        <div className="pt-3 2xl:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 2xl:gap-5">
          <Link href={isAuthenticated ? "/seo/dashboard" : "/login"} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto shadow-xl shadow-blue-600/30 text-sm 2xl:text-base font-semibold px-8 2xl:px-11 py-3.5 2xl:py-4.5 cursor-pointer"
              rightIcon={<ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" />}
            >
              Get Started for Free
            </Button>
          </Link>

          <Link href="/seo/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-slate-200 border-slate-700 hover:bg-white/5 hover:text-white px-6 2xl:px-9 py-3.5 2xl:py-4.5 text-sm 2xl:text-base cursor-pointer"
            >
              Explore SeoSensing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
