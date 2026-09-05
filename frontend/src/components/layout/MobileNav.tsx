"use client";

import React, { useEffect } from "react";
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
} from "lucide-react";
import { NAVIGATION_CONFIG, NavItem } from "@/lib/constants";
import { SeoSensingBrand } from "@/components/brand/SeoSensingLogo";
import { cn } from "@/lib/utils";

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
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  const isLinkActive = (item: NavItem) => {
    if (item.href === "/overview" && (pathname === "/overview" || pathname === "/dashboard")) {
      return true;
    }
    if (item.href !== "/overview" && pathname.startsWith(item.href)) {
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
      <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white border-r border-slate-200 h-full flex flex-col z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200">
          <SeoSensingBrand showTagline={false} showBadge={false} />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAVIGATION_CONFIG.map((group, gIdx) => {
            const isAeoGroup = group.groupKey === "aeo";

            return (
              <div key={gIdx} className="space-y-1">
                <div className="px-2.5 pb-1 flex items-center justify-between">
                  <h4
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isAeoGroup ? "text-purple-600" : "text-slate-400"
                    )}
                  >
                    {group.groupName}
                  </h4>
                </div>

                <div className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const active = isLinkActive(item);
                    const icon = ICON_MAP[item.icon] || <Globe className="w-4 h-4" />;

                    return (
                      <Link
                        key={iIdx}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          active
                            ? isAeoGroup
                              ? "bg-purple-50 text-purple-700 font-semibold border border-purple-200"
                              : "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                            : isAeoGroup
                            ? "text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"
                            : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/50"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              active
                                ? isAeoGroup
                                  ? "text-purple-600"
                                  : "text-blue-600"
                                : "text-slate-400"
                            )}
                          >
                            {icon}
                          </span>
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
