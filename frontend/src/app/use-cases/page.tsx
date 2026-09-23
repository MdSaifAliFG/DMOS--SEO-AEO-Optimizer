import React from "react";
import Link from "next/link";
import {
  Building2,
  ShoppingBag,
  Briefcase,
  Rocket,
  Users,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Industry Use Cases | Zobay Rank",
  description:
    "Discover how SaaS companies, e-commerce stores, agencies, startups, marketing teams, and enterprises use Zobay Rank for SEO, AEO, and GEO optimization.",
  path: "/use-cases",
  keywords: [
    "Zobay Rank Use Cases",
    "SaaS SEO AEO",
    "E-commerce Search Optimization",
    "Agency SEO Platform",
    "Startup AI Search",
  ],
});

const USE_CASES_LIST = [
  {
    slug: "saas",
    title: "SaaS & Software",
    desc: "Win high-intent software recommendation prompts across ChatGPT, Perplexity, and Google.",
    icon: <Building2 className="w-6 h-6 text-blue-400" />,
  },
  {
    slug: "ecommerce",
    title: "E-Commerce & Retail",
    desc: "Eliminate faceted crawl waste and ensure AI shopping assistants cite your product catalog.",
    icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />,
  },
  {
    slug: "agencies",
    title: "Digital Agencies",
    desc: "Offer modern AI search audits, citation tracking, and white-label client reporting.",
    icon: <Briefcase className="w-6 h-6 text-purple-400" />,
  },
  {
    slug: "startups",
    title: "High-Growth Startups",
    desc: "Establish early entity authority and outsmart legacy incumbents in conversational search.",
    icon: <Rocket className="w-6 h-6 text-amber-400" />,
  },
  {
    slug: "marketing-teams",
    title: "Marketing Teams",
    desc: "Align your editorial calendar with real AI buyer prompts and bridge citation gaps.",
    icon: <Users className="w-6 h-6 text-pink-400" />,
  },
  {
    slug: "enterprise",
    title: "Enterprise Organizations",
    desc: "Large-scale crawl diagnostics, multi-domain entity governance, and cross-engine parity.",
    icon: <Building className="w-6 h-6 text-cyan-400" />,
  },
];

export default function UseCasesDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#1D63FF] selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Use Cases", url: "/use-cases" },
        ]}
      />

      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="relative py-16 sm:py-24 border-b border-slate-900 text-center space-y-6">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Tailored Solutions by Industry</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Search &amp; AI Intelligence Use Cases
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore how forward-thinking growth teams, agencies, and enterprises optimize technical health and capture organic traffic across search and AI.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES_LIST.map((item) => (
              <Link
                key={item.slug}
                href={`/use-cases/${item.slug}`}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore use case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
