"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Plus,
  Bell,
  Calendar,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { HealthResponse } from "@/lib/types";

export interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const pathname = usePathname();
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getHealth()
      .then((data) => {
        if (isMounted) setHealth(data);
      })
      .catch(() => {
        if (isMounted) setHealth(null);
      });
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const isAeoRoute = pathname.startsWith("/aeo");
  const isSeoRoute = pathname.startsWith("/seo") || pathname.startsWith("/projects");

  // Determine Page Title and Subtitle based on route
  const getPageHeaderInfo = () => {
    if (pathname === "/" || pathname === "/overview") {
      return {
        title: "Platform Overview",
        subtitle: "Digital Marketing Operating System & Intelligence Hub",
      };
    }
    if (pathname === "/seo/dashboard") {
      return {
        title: "SEO Dashboard",
        subtitle: "Overview of your website's SEO performance and technical health",
      };
    }
    if (pathname === "/seo/projects") {
      return {
        title: "SEO Projects",
        subtitle: "Manage and monitor your audited websites and crawl schedules",
      };
    }
    if (pathname === "/seo/keywords") {
      return {
        title: "SEO Keywords",
        subtitle: "Target search query tracking, intent, and ranking metrics",
      };
    }
    if (pathname === "/seo/pages") {
      return {
        title: "Crawled Webpages",
        subtitle: "Full index of discovered pages, status codes, and on-page technical audits",
      };
    }
    if (pathname === "/seo/issues") {
      return {
        title: "Technical SEO Issues",
        subtitle: "Prioritized issues, crawl errors, and actionable fix recommendations",
      };
    }
    if (pathname === "/seo/technical") {
      return {
        title: "Technical SEO Audit",
        subtitle: "Crawlability, indexability, HTTPS, robots.txt, sitemaps, and server status",
      };
    }
    if (pathname === "/seo/content") {
      return {
        title: "Content Optimization",
        subtitle: "Heading hierarchy, title/meta tag optimization, and duplicate content",
      };
    }
    if (pathname === "/seo/links") {
      return {
        title: "Link Structure & Health",
        subtitle: "Internal, external, broken, and redirecting hyperlink analysis",
      };
    }
    if (pathname === "/seo/reports") {
      return {
        title: "SEO Audit Reports",
        subtitle: "Historical audit logs, score trends, and downloadable performance reports",
      };
    }

    // AEO Routes
    if (pathname === "/aeo/dashboard") {
      return {
        title: "AEO Dashboard",
        subtitle: "Monitor brand visibility and citations across AI-powered answer engines",
      };
    }
    if (pathname === "/aeo/projects") {
      return {
        title: "AEO Projects",
        subtitle: "Manage AI search visibility projects and answer engine targets",
      };
    }
    if (pathname === "/aeo/questions") {
      return {
        title: "Tracked AI Prompts & Questions",
        subtitle: "Monitor key buyer queries across ChatGPT, Perplexity, Gemini, and Google AI",
      };
    }
    if (pathname === "/aeo/entities") {
      return {
        title: "Knowledge Graph Entities",
        subtitle: "Brand, product, and topical entities recognized by answer engines",
      };
    }
    if (pathname === "/aeo/answer-engine") {
      return {
        title: "Answer Engine Monitoring",
        subtitle: "Live connectivity and presence across ChatGPT, Perplexity, Gemini, and Copilot",
      };
    }
    if (pathname === "/aeo/citations") {
      return {
        title: "AI Citations & Sources",
        subtitle: "Web sources and authoritative URLs cited by AI answer models",
      };
    }
    if (pathname === "/aeo/visibility") {
      return {
        title: "AI Visibility Analytics",
        subtitle: "Comprehensive brand mention rates, citation rates, and engine coverage",
      };
    }
    if (pathname === "/aeo/reports") {
      return {
        title: "AEO Intelligence Reports",
        subtitle: "Historical AI search visibility benchmarks and citation trends",
      };
    }

    if (pathname === "/integrations") {
      return {
        title: "Platform Integrations",
        subtitle: "Connect Google Search Console, Analytics, and AI Provider APIs",
      };
    }
    if (pathname === "/settings") {
      return {
        title: "System Settings",
        subtitle: "Manage workspace defaults, crawler limits, and team permissions",
      };
    }

    return {
      title: "DMOS Platform",
      subtitle: "Digital Marketing Operating System",
    };
  };

  const headerInfo = getPageHeaderInfo();

  return (
    <header className="h-16 px-4 md:px-8 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Page Title & Subtitle */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-base md:text-lg font-bold text-slate-900 truncate">
            {headerInfo.title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate">
            {headerInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Date Range Selector */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Last 7 Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
        </div>

        {/* API Health Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              health?.status === "healthy" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
            }`}
          />
          <span className="hidden lg:inline">{health?.status === "healthy" ? "API Online" : "Connecting"}</span>
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute top-2 right-2" />
        </button>

        {/* Contextual CTA Button */}
        {isAeoRoute ? (
          <Link href="/aeo/projects">
            <Button
              size="sm"
              variant="aeo"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">+ Add AEO Project</span>
              <span className="sm:hidden">+ AEO</span>
            </Button>
          </Link>
        ) : (
          <Link href="/seo/projects">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">+ Add SEO Project</span>
              <span className="sm:hidden">+ SEO</span>
            </Button>
          </Link>
        )}

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs shadow-xs">
          AU
        </div>
      </div>
    </header>
  );
};
