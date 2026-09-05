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
  Brain,
  Users,
  ArrowLeftRight,
  Bell,
  Sliders,
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
import { SeoSensingBrand, SeoSensingLogo } from "@/components/brand/SeoSensingLogo";

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
  Brain: <Brain className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  ArrowLeftRight: <ArrowLeftRight className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
  Sliders: <Sliders className="w-4 h-4" />,
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
      <div
        suppressHydrationWarning
        className={cn(
          "h-16 border-b border-slate-200 bg-white shrink-0 relative flex items-center transition-all",
          isCollapsed ? "justify-center px-2 group/header" : "justify-between px-4"
        )}
      >
        {isCollapsed ? (
          /* Collapsed State: Centered logo with hover-to-expand button */
          <div
            onClick={onToggleCollapse}
            title="Expand Sidebar"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer group/logo hover:bg-slate-50 transition-colors"
          >
            {/* Freestanding Logo */}
            <SeoSensingLogo size={36} className="transition-opacity duration-200 group-hover/header:opacity-30" />

            {/* Expand Chevron that pops up on hover */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollapse();
                }}
                title="Expand Sidebar"
                className="absolute inset-0 m-auto w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-all duration-200 shadow-md cursor-pointer hover:scale-105"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ) : (
          /* Expanded State: Logo + Wordmark on Left, Collapse button on Right */
          <>
            <Link href="/overview" className="flex items-center min-w-0">
              <SeoSensingBrand isCollapsed={false} showTagline={false} showBadge={false} />
            </Link>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Collapse Sidebar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden lg:flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </>
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

      {/* Compact Logout Button */}
      <div suppressHydrationWarning className="p-2 border-t border-slate-200 bg-white shrink-0">
        <button
          type="button"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          title="Log Out of SeoSensing"
          className={cn(
            "w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium cursor-pointer",
            isCollapsed ? "justify-center py-2 px-0" : "justify-start"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
