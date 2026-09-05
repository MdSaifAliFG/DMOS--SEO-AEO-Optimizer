"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Eye, CheckCircle2, Sparkles, Activity } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is SeoSensing?",
      answer:
        "SeoSensing is an all-in-one AI Search & SEO Sensing Operating System that brings automated technical SEO auditing, crawling, and AI-powered Answer Engine Optimization (AEO) into one unified workspace.",
    },
    {
      question: "What is SEO optimization?",
      answer:
        "SEO optimization helps improve how your website can be crawled, understood, indexed, and discovered through traditional search engines like Google and Bing.",
    },
    {
      question: "What is AEO (Answer Engine Optimization)?",
      answer:
        "AEO focuses on improving how your content can be understood, cited, and surfaced in generative AI-powered answer experiences like ChatGPT, Perplexity, Gemini, and Google AI Overviews.",
    },
    {
      question: "Can I audit my website?",
      answer:
        "Yes. SeoSensing provides automated BFS website crawling and deep technical SEO analysis through its SEO module, diagnosing indexability, status codes, HTML tags, and internal link structure.",
    },
    {
      question: "Does SeoSensing support AEO?",
      answer:
        "SeoSensing includes a dedicated AEO module designed for answer-engine visibility, knowledge graph entity tracking, buyer prompt analysis, and source citation extraction.",
    },
    {
      question: "Do I need technical SEO knowledge?",
      answer:
        "No. SeoSensing is designed to turn complex server responses and crawl data into understandable issues, clear severity categorizations, and concrete fix recommendations.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes, you can register and run website scans for free. We also offer affordable premium upgrades for unlimited crawls, competitor benchmarking, and scheduled audits.",
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 2xl:py-36 3xl:py-44 bg-white border-b border-slate-200">
      <div className="max-w-7xl 2xl:max-w-[1680px] 3xl:max-w-[1920px] 4k:max-w-[2240px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 2xl:gap-20 items-center">
          {/* Left Column: Woman Portrait with Floating Pills (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm 2xl:max-w-md 3xl:max-w-lg rounded-3xl 2xl:rounded-[36px] overflow-hidden shadow-2xl bg-slate-100 border border-slate-200">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/images/faq-support.jpg"
                  alt="Customer Support Lead"
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Floating Pill 1: Monitor SEO Progress (Upper Right) */}
              <div className="absolute top-1/2 right-4 2xl:right-6 -translate-y-12 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-4 2xl:px-5 py-2 2xl:py-2.5 shadow-xl flex items-center gap-2 2xl:gap-3 text-xs 2xl:text-sm font-bold text-slate-800 animate-bounce duration-1000">
                <span className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-3 h-3 2xl:w-4 2xl:h-4" />
                </span>
                <span>Monitor SEO Progress</span>
              </div>

              {/* Floating Pill 2: Improve User Experience (Bottom Left) */}
              <div className="absolute bottom-6 2xl:bottom-8 left-4 2xl:left-6 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-4 2xl:px-5 py-2 2xl:py-2.5 shadow-xl flex items-center gap-2 2xl:gap-3 text-xs 2xl:text-sm font-bold text-slate-800">
                <span className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 2xl:w-4 2xl:h-4" />
                </span>
                <span>Improve User Experience</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heading & FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-8 2xl:space-y-10">
            <div className="space-y-3 2xl:space-y-4">
              <h2 className="text-3xl sm:text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-slate-950 tracking-tight">
                Frequently asked <span className="text-[#1D63FF]">questions</span>
              </h2>
              <p className="text-xs sm:text-sm 2xl:text-base 3xl:text-lg text-slate-600 leading-relaxed max-w-xl 2xl:max-w-2xl">
                Our SEO tool empowers customers to boost their website's visibility and organic traffic by providing in-depth keyword research, on-page optimization guidance, and real-time performance tracking.
              </p>
            </div>

            {/* Accordion Items */}
            <div className="space-y-3 2xl:space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl 2xl:rounded-3xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 2xl:p-6 flex items-center justify-between text-left gap-4 hover:bg-slate-100/70 transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm 2xl:text-base 3xl:text-lg font-bold text-slate-900">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 2xl:w-5 2xl:h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "transform rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 2xl:px-6 2xl:pb-6 text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed border-t border-slate-200/70 pt-3 2xl:pt-4 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
