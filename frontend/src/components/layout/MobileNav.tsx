"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Globe,
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
  ListTodo,
  History,
  Users,
  FileCheck,
  Layers,
  Brain,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NAVIGATION_CONFIG, NavItem } from "@/lib/constants";
import { SeoSensingBrand } from "@/components/brand/SeoSensingLogo"; // ZobayRankBrand alias
import { cn } from "@/lib/utils";
import { getActiveGroupKey } from "./Sidebar";

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
  Users: <Users className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
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
};

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogoutModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenLogoutModal }) => {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  const activeGroupKey = getActiveGroupKey(pathname);
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => ({
    overview: true,
    seo: activeGroupKey === "seo" || !activeGroupKey,
    aeo: activeGroupKey === "aeo",
    geo: activeGroupKey === "geo",
    system: activeGroupKey === "system",
  }));

  React.useEffect(() => {
    if (activeGroupKey) {
      setOpenGroups({
        overview: true,
        seo: activeGroupKey === "seo",
        aeo: activeGroupKey === "aeo",
        geo: activeGroupKey === "geo",
        system: activeGroupKey === "system",
        [activeGroupKey]: true,
      });
    }
  }, [pathname, activeGroupKey]);

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  // Close the drawer only when actual route navigation occurs
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Prevent background body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLinkActive = (item: NavItem) => {
    if (item.href === "/overview" && (pathname === "/overview" || pathname === "/dashboard" || pathname === "/")) {
      return true;
    }
    if (pathname === item.href) {
      return true;
    }
    if (
      item.href !== "/overview" &&
      item.href !== "/seo" &&
      item.href !== "/aeo" &&
      item.href !== "/geo" &&
      pathname.startsWith(item.href + "/")
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
      />

      {/* Drawer */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white dark:bg-[#0c121e] border-r border-slate-200 dark:border-slate-800 h-full flex flex-col z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <SeoSensingBrand showTagline={false} showBadge={false} />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {NAVIGATION_CONFIG.map((group, gIdx) => {
            const isAeoGroup = group.groupKey === "aeo";
            const isGeoGroup = group.groupKey === "geo";
            const isSeoGroup = group.groupKey === "seo";
            const isGroupOpen = Boolean(openGroups[group.groupKey]);

            return (
              <div key={gIdx} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.groupKey)}
                  className="w-full px-2.5 py-1.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        isAeoGroup
                          ? "text-purple-700 dark:text-purple-400"
                          : isGeoGroup
                            ? "text-amber-700 dark:text-amber-400"
                            : isSeoGroup
                              ? "text-sky-700 dark:text-sky-400"
                              : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {group.groupName}
                    </h4>
                    {isAeoGroup && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                        AI
                      </span>
                    )}
                    {isGeoGroup && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                        GEO
                      </span>
                    )}
                    {isSeoGroup && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/90 dark:border-sky-800/60">
                        CORE
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                      !isGroupOpen && "-rotate-90"
                    )}
                  />
                </button>

                {isGroupOpen && (
                  <div className="space-y-0.5 animate-in fade-in duration-150">
                    {group.items.map((item, iIdx) => {
                      const active = isLinkActive(item);
                      const icon = ICON_MAP[item.icon] || <Globe className="w-4 h-4" />;

                      const activeStyles = isAeoGroup
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800/60"
                        : isGeoGroup
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800/60"
                          : isSeoGroup
                            ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/90 dark:border-sky-800/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-slate-700";

                      const hoverStyles = isAeoGroup
                        ? "text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/30"
                        : isGeoGroup
                          ? "text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
                          : isSeoGroup
                            ? "text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-sky-50/60 dark:hover:bg-sky-950/30"
                            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50";

                      return (
                        <Link
                          key={iIdx}
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                            active ? activeStyles : hoverStyles
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                active
                                  ? isAeoGroup
                                    ? "text-purple-600 dark:text-purple-400"
                                    : isGeoGroup
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-blue-600 dark:text-blue-400"
                                  : "text-slate-400 dark:text-slate-500"
                              )}
                            >
                              {icon}
                            </span>
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.2 rounded font-semibold border",
                                item.badgeVariant === "geo"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60"
                                  : item.badgeVariant === "aeo"
                                    ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                              )}
                            >
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

        {/* Mobile Logout Button */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e]">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenLogoutModal) {
                onOpenLogoutModal();
              }
            }}
            data-testid="mobile-logout-btn"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
