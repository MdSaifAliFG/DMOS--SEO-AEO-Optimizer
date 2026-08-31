"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  Puzzle,
  Globe,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { HealthResponse } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

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
        <div className="flex flex-col justify-center min-w-0">
          <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight truncate">
            {headerInfo.title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block leading-tight truncate mt-0.5">
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

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            title="User Account Menu"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user ? user.name.slice(0, 2).toUpperCase() : "AU"}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || "Growth Lead"}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || "admin@dmos.internal"}</p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {user?.role || "Enterprise Admin"}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workspace Settings</span>
                </Link>
                <Link
                  href="/integrations"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Puzzle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Integrations Hub</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Log Out of DMOS</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
