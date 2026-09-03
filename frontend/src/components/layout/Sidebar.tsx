"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  KeyRound,
  FileText,
  AlertTriangle,
  Wrench,
  BookOpen,
  Link2,
  FileSpreadsheet,
  Bot,
  Sparkles,
  HelpCircle,
  Boxes,
  Cpu,
  Quote,
  Eye,
  FileBarChart,
  Puzzle,
  Settings,
  Globe,
  ListTodo,
  History,
  Layers,
  Target,
  Share2,
  Network,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { NAVIGATION_CONFIG, NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  FolderKanban: <FolderKanban className="w-4 h-4" />,
  KeyRound: <KeyRound className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Link2: <Link2 className="w-4 h-4" />,
  FileSpreadsheet: <FileSpreadsheet className="w-4 h-4" />,
  ListTodo: <ListTodo className="w-4 h-4" />,
  History: <History className="w-4 h-4" />,
  Bot: <Bot className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Quote: <Quote className="w-4 h-4" />,
  Eye: <Eye className="w-4 h-4" />,
  FileBarChart: <FileBarChart className="w-4 h-4" />,
  Puzzle: <Puzzle className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
  Share2: <Share2 className="w-4 h-4" />,
  Network: <Network className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
};

export const Sidebar: React.FC<{
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}> = ({ className, isCollapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Accordion state for navigation groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const isLinkActive = (item: NavItem) => {
    if (item.href === "/overview" && (pathname === "/overview" || pathname === "/dashboard")) {
      return true;
    }
    if (item.href !== "/overview" && pathname === item.href) {
      return true;
    }
    if (item.href !== "/overview" && pathname.startsWith(item.href) && item.href !== "/seo" && item.href !== "/aeo") {
      return true;
    }
    return false;
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-30 transition-all duration-200 select-none",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white shrink-0">
        <Link href="/overview" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900">DMOS</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Enterprise
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                Digital Marketing OS
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden lg:block"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
        {NAVIGATION_CONFIG.map((group, gIdx) => {
          const isAeoGroup = group.groupKey === "aeo";
          const isSeoGroup = group.groupKey === "seo";
          const isGroupCollapsed = Boolean(collapsedGroups[group.groupKey]);

          return (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.groupKey)}
                  className="w-full px-2.5 py-1 flex items-center justify-between hover:bg-slate-50 rounded-md transition-colors text-left"
                >
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        isAeoGroup ? "text-purple-700" : isSeoGroup ? "text-sky-700" : "text-slate-500"
                      )}
                    >
                      {group.groupName}
                    </h4>
                    {isAeoGroup && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        AI
                      </span>
                    )}
                    {isSeoGroup && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        CORE
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 text-slate-400 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                </button>
              )}

              {!isGroupCollapsed && (
                <div className="space-y-0.5 animate-in fade-in duration-150">
                  {group.items.map((item, iIdx) => {
                    const active = isLinkActive(item);
                    const icon = ICON_MAP[item.icon] || <Globe className="w-4 h-4" />;

                    const activeStyles = isAeoGroup
                      ? "bg-purple-50 text-purple-700 font-semibold border border-purple-200 shadow-xs"
                      : isSeoGroup
                      ? "bg-sky-50 text-sky-700 font-semibold border border-sky-200/90 shadow-xs"
                      : "bg-slate-100 text-slate-900 font-semibold border border-slate-200 shadow-xs";

                    const hoverStyles = isAeoGroup
                      ? "text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"
                      : isSeoGroup
                      ? "text-slate-600 hover:text-sky-700 hover:bg-sky-50/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50";

                    return (
                      <Link
                        key={iIdx}
                        href={item.href}
                        title={isCollapsed ? item.title : undefined}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-100",
                          active ? activeStyles : hoverStyles,
                          isCollapsed && "justify-center px-0 py-2"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={cn(
                              "transition-colors",
                              active
                                ? isAeoGroup
                                  ? "text-purple-600"
                                  : "text-blue-600"
                                : "text-slate-400 group-hover:text-slate-600"
                            )}
                          >
                            {icon}
                          </span>
                          {!isCollapsed && <span className="truncate">{item.title}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Info & Logout Button */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user ? user.name.slice(0, 2).toUpperCase() : "AU"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || "Enterprise Admin"}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {user?.email || "admin@dmos.internal"}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              title="Log Out of DMOS"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            title="Log Out of DMOS"
            className="w-full flex justify-center py-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Footer System Status */}
      <div className="p-2.5 border-t border-slate-200 bg-slate-50/70 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-slate-800 truncate">
                  DMOS Engine
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Online & Healthy</span>
              </div>
            </div>
            <a
              href="http://localhost:8000/api/v1/docs"
              target="_blank"
              rel="noopener noreferrer"
              title="Open FastAPI Swagger API Docs"
              className="text-slate-400 hover:text-blue-600 transition-colors p-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
          </div>
        )}
      </div>
    </aside>
  );
};
