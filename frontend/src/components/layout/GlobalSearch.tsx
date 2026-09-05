"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Globe,
  Bot,
  AlertTriangle,
  KeyRound,
  FileText,
  Wrench,
  Settings,
  Puzzle,
  Bell,
  Layers,
  Target,
  Eye,
  Cpu,
  BookOpen,
  Link2,
  FileSpreadsheet,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "Actions" | "SEO" | "AEO" | "System";
  href: string;
  icon: React.ElementType;
  keywords: string[];
  badge?: string;
  badgeColor?: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  // Quick Actions
  {
    id: "action-new-audit",
    title: "Launch New SEO Audit",
    description: "Trigger a live crawl and technical health inspection",
    category: "Actions",
    href: "/seo/projects",
    icon: Globe,
    keywords: ["launch", "new", "crawl", "audit", "start", "run", "scan"],
    badge: "Action",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "action-eval-prompt",
    title: "Evaluate AI Prompt",
    description: "Test buyer query visibility across ChatGPT & Perplexity",
    category: "Actions",
    href: "/aeo/optimize/answer",
    icon: Sparkles,
    keywords: ["evaluate", "ai", "prompt", "test", "chatgpt", "perplexity", "score"],
    badge: "Action",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "action-meta-opt",
    title: "Optimize Metadata",
    description: "Inspect and optimize title tags and meta descriptions",
    category: "Actions",
    href: "/seo/optimize/metadata",
    icon: FileText,
    keywords: ["metadata", "title", "description", "tags", "opengraph", "social"],
    badge: "Action",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },

  // SEO Optimization
  {
    id: "seo-dashboard",
    title: "SEO Dashboard",
    description: "Overview of technical health score, crawl status, and audits",
    category: "SEO",
    href: "/seo/dashboard",
    icon: Globe,
    keywords: ["seo", "dashboard", "health", "score", "overview", "crawler", "audit"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-actions",
    title: "SEO Action Center",
    description: "Prioritized action items and high-impact SEO fixes",
    category: "SEO",
    href: "/seo/actions",
    icon: Target,
    keywords: ["actions", "fixes", "tasks", "priority", "recommendations"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-projects",
    title: "SEO Projects & Audits",
    description: "Manage domains, crawl depth, and scheduled audits",
    category: "SEO",
    href: "/seo/projects",
    icon: Globe,
    keywords: ["projects", "audits", "domains", "websites", "crawls", "schedule"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-keywords",
    title: "Target Keywords",
    description: "Keyword intent, search volume, rankings, and tracking",
    category: "SEO",
    href: "/seo/keywords",
    icon: KeyRound,
    keywords: ["keywords", "ranking", "search", "volume", "intent", "position"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-pages",
    title: "Crawled Pages",
    description: "Indexable URLs, status codes, canonicals, and response times",
    category: "SEO",
    href: "/seo/pages",
    icon: FileText,
    keywords: ["pages", "urls", "indexable", "canonical", "status", "http", "200", "404"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-issues",
    title: "Technical Issues",
    description: "Critical crawler errors, warnings, 404s, and redirect loops",
    category: "SEO",
    href: "/seo/issues",
    icon: AlertTriangle,
    keywords: ["issues", "errors", "warnings", "broken", "links", "redirects", "problems"],
    badge: "SEO",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "seo-metadata",
    title: "Metadata Optimizer",
    description: "AI title, meta description, and OpenGraph generators",
    category: "SEO",
    href: "/seo/optimize/metadata",
    icon: Sparkles,
    keywords: ["metadata", "title", "description", "og", "social", "snippets"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-technical",
    title: "Technical SEO Health",
    description: "Robots.txt, XML sitemap validation, and core web vitals",
    category: "SEO",
    href: "/seo/technical",
    icon: Wrench,
    keywords: ["technical", "robots", "sitemap", "xml", "vitals", "speed", "crawling"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-content",
    title: "Content Optimization",
    description: "On-page content audit, heading structure, and readability",
    category: "SEO",
    href: "/seo/content",
    icon: BookOpen,
    keywords: ["content", "h1", "headings", "readability", "copy", "text"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-links",
    title: "Internal & Backlinks",
    description: "Internal linking topology and broken link detection",
    category: "SEO",
    href: "/seo/links",
    icon: Link2,
    keywords: ["links", "backlinks", "internal", "anchors", "graph", "outbound"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "seo-reports",
    title: "SEO Performance Reports",
    description: "Exportable crawl summaries and audit health reports",
    category: "SEO",
    href: "/seo/reports",
    icon: FileSpreadsheet,
    keywords: ["reports", "export", "pdf", "csv", "summary", "analytics"],
    badge: "SEO",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },

  // AEO Optimization
  {
    id: "aeo-dashboard",
    title: "AEO Dashboard",
    description: "AI Search visibility rate, model benchmarks, and rankings",
    category: "AEO",
    href: "/aeo/dashboard",
    icon: Bot,
    keywords: ["aeo", "ai", "search", "answer", "engine", "chatgpt", "perplexity", "dashboard"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-actions",
    title: "AEO Action Center",
    description: "Tactical recommendations for generative search engines",
    category: "AEO",
    href: "/aeo/actions",
    icon: Target,
    keywords: ["aeo", "actions", "recommendations", "prompt", "optimization"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-questions",
    title: "Tracked Questions & Prompts",
    description: "Target buyer questions queried across AI engines",
    category: "AEO",
    href: "/aeo/questions",
    icon: Sparkles,
    keywords: ["questions", "prompts", "queries", "intent", "monitoring"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-answer-engine",
    title: "Answer Engines Status",
    description: "ChatGPT Search, Perplexity AI, Google AI, Gemini, Claude",
    category: "AEO",
    href: "/aeo/answer-engine",
    icon: Cpu,
    keywords: ["engines", "chatgpt", "perplexity", "google", "gemini", "claude", "models"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-citations",
    title: "Brand Citations & Sources",
    description: "Authoritative web citations and sources mentioned in AI answers",
    category: "AEO",
    href: "/aeo/citations",
    icon: Layers,
    keywords: ["citations", "sources", "mentions", "authority", "grounding", "references"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-visibility",
    title: "Model Visibility Share",
    description: "Share of voice and brand positioning in AI responses",
    category: "AEO",
    href: "/aeo/visibility",
    icon: Eye,
    keywords: ["visibility", "share", "voice", "presence", "rank", "percentage"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-content-gaps",
    title: "Content & Prompt Gaps",
    description: "Unanswered AI prompts and missing knowledge base topics",
    category: "AEO",
    href: "/aeo/optimization/content-gaps",
    icon: Layers,
    keywords: ["gaps", "missing", "topics", "opportunities", "competitors"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-content-studio",
    title: "AEO Content Studio",
    description: "Create and rephrase content grounded for AI citations",
    category: "AEO",
    href: "/aeo/optimize/content",
    icon: FileText,
    keywords: ["studio", "grounding", "editor", "generator", "llm", "writing"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-evaluator",
    title: "Answer Evaluator",
    description: "Real-time prompt scoring and AI answer testing",
    category: "AEO",
    href: "/aeo/optimize/answer",
    icon: Bot,
    keywords: ["evaluator", "benchmark", "simulate", "test", "scores"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "aeo-reports",
    title: "AEO Intelligence Reports",
    description: "Benchmarking and historical AI search visibility reports",
    category: "AEO",
    href: "/aeo/reports",
    icon: FileSpreadsheet,
    keywords: ["reports", "intelligence", "trends", "historical", "pdf"],
    badge: "AEO",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },

  // Platform & System
  {
    id: "sys-overview",
    title: "Platform Overview",
    description: "Central hub for SEO crawling and AEO intelligence",
    category: "System",
    href: "/overview",
    icon: Globe,
    keywords: ["overview", "hub", "home", "main", "start"],
    badge: "Hub",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "sys-notifications",
    title: "Notification Center",
    description: "System alerts, audit completions, and engine notices",
    category: "System",
    href: "/notifications",
    icon: Bell,
    keywords: ["notifications", "alerts", "updates", "messages", "warnings"],
    badge: "System",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "sys-integrations",
    title: "Platform Integrations",
    description: "Google Search Console, Analytics, and API providers",
    category: "System",
    href: "/integrations",
    icon: Puzzle,
    keywords: ["integrations", "google", "search", "console", "analytics", "api", "keys"],
    badge: "System",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "sys-settings",
    title: "System Settings",
    description: "Manage crawler limits, team members, and API keys",
    category: "System",
    href: "/settings",
    icon: Settings,
    keywords: ["settings", "config", "team", "limits", "crawler", "profile"],
    badge: "System",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
];

export const GlobalSearch: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Detect OS for shortcut hint (⌘K vs Ctrl K)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || ""));
    }
  }, []);

  // Global hotkey Ctrl+K / Cmd+K and '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input/textarea
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "/" && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Default initial suggestions: Quick actions and popular primary sections
      return SEARCH_DATABASE.filter(
        (item) =>
          item.category === "Actions" ||
          item.id === "seo-dashboard" ||
          item.id === "aeo-dashboard" ||
          item.id === "seo-issues" ||
          item.id === "sys-notifications"
      );
    }

    return SEARCH_DATABASE.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(trimmed);
      const descMatch = item.description.toLowerCase().includes(trimmed);
      const categoryMatch = item.category.toLowerCase().includes(trimmed);
      const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(trimmed));
      return titleMatch || descMatch || categoryMatch || keywordMatch;
    });
  }, [query]);

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Keyboard navigation within dropdown (Up, Down, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        handleSelectItem(selected);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(item.href);
  };

  // Keep active item in view while navigating with arrows
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      activeElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search Input Bar */}
      <div className="relative flex items-center group">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 absolute left-3 pointer-events-none transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search modules, audits, pages, prompts..."
          aria-label="Global platform search"
          className="w-full pl-9 pr-16 py-1.5 sm:py-2 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/15 shadow-2xs"
        />

        {/* Right side controls: Clear (X) or Shortcut badge */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search input"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs select-none pointer-events-none">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown Results Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
          {/* Header info */}
          <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">
              {query.trim() ? "Search Results" : "Quick Suggestions"}
            </span>
            <span className="text-[10px] text-slate-400">
              {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
            </span>
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-80 overflow-y-auto divide-y divide-slate-50 p-1"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const IconComponent = item.icon;

                // Category-based icon styling
                const iconBgClass =
                  item.category === "SEO"
                    ? "bg-blue-50 text-blue-600"
                    : item.category === "AEO"
                      ? "bg-purple-50 text-purple-600"
                      : item.category === "Actions"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-600";

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${isSelected
                      ? "bg-blue-50/70 text-slate-900 shadow-2xs"
                      : "hover:bg-slate-50 text-slate-700"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBgClass}`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs font-bold truncate ${isSelected ? "text-blue-700" : "text-slate-900"
                              }`}
                          >
                            {item.title}
                          </p>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${item.badgeColor || "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        {item.href}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${isSelected
                          ? "text-blue-600 translate-x-0.5"
                          : "text-slate-300 opacity-0 group-hover:opacity-100"
                          }`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 px-4 text-center">
                <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  No matching results found
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try searching for keywords, audits, prompts, or pages.
                </p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">
                  ↑↓
                </kbd>{" "}
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">
                  ↵
                </kbd>{" "}
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">
                  esc
                </kbd>{" "}
                close
              </span>
            </div>
            <span className="hidden sm:inline font-mono">SEOSensing v2.4</span>
          </div>
        </div>
      )}
    </div>
  );
};
