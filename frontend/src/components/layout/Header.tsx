"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Puzzle,
  Globe,
  ExternalLink,
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { HealthResponse } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/lib/notifications";
import { GlobalSearch } from "./GlobalSearch";

export interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationMenuOpen(false);
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
        subtitle: "",
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
    if (pathname === "/notifications") {
      return {
        title: "Notification Center",
        subtitle: "Global alerts, SEO audit changes, and AI answer engine notifications",
      };
    }

    return {
      title: "SeoSensing Platform",
      subtitle: "AI Search & SEO Optimization Operating System",
    };
  };

  const headerInfo = getPageHeaderInfo();

  return (
    <header className="h-16 2xl:h-20 px-3 sm:px-4 md:px-8 2xl:px-12 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between gap-2 sm:gap-6 2xl:gap-8 shadow-xs">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Page Title & Subtitle */}
        <div className="flex flex-col justify-center min-w-0 max-w-[110px] xs:max-w-[160px] sm:max-w-none">
          <h1 className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-slate-900 leading-tight truncate">
            {headerInfo.title}
          </h1>
          {headerInfo.subtitle ? (
            <p className="text-[11px] 2xl:text-xs text-slate-500 hidden md:block leading-tight truncate mt-0.5 max-w-sm lg:max-w-md 2xl:max-w-xl">
              {headerInfo.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* Center Global Search Bar */}
      <div className="flex-1 max-w-[160px] xs:max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl mx-1 sm:mx-4 min-w-0 flex justify-center">
        <GlobalSearch />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Workable Global Notification Bell */}
        <div className="relative" ref={notificationMenuRef}>
          <button
            onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
            title="Notifications"
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer focus:outline-none"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold absolute -top-0.5 -right-0.5 flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-96 sm:max-w-none bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-1 overflow-hidden">
              {/* Dropdown Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Items List (Latest 4) */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        if (notif.link) {
                          setIsNotificationMenuOpen(false);
                          window.location.href = notif.link;
                        }
                      }}
                      className={`p-3 transition-colors cursor-pointer flex items-start gap-2.5 ${
                        notif.read ? "hover:bg-slate-50 opacity-80" : "bg-blue-50/30 hover:bg-blue-50/60"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          notif.read ? "bg-slate-300" : "bg-blue-600"
                        }`}
                      />
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <Link
                href="/notifications"
                onClick={() => setIsNotificationMenuOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-bold text-blue-600 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 border-t border-slate-100 flex items-center justify-center gap-1.5 transition-colors group"
              >
                <span>View All Notifications ({notifications.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>

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
            <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 overflow-hidden">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || "Growth Lead"}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || "admin@seosensing.internal"}</p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {user?.role || "Enterprise Admin"}
                </span>
              </div>

              {/* SeoSensing Engine Status Inside User Dropdown */}
              <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                <a
                  href="http://localhost:8000/api/v1/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsUserMenuOpen(false)}
                  title="Open FastAPI Swagger API Docs (SeoSensing Engine)"
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs text-slate-700 transition-all group select-none"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          health?.status === "healthy" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          health?.status === "healthy" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                    </span>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        SeoSensing Engine
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-600 leading-tight">
                        {health?.status === "healthy" ? "Online & Healthy" : "Connecting..."}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-1" />
                </a>
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
                  <span>Log Out of SeoSensing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
