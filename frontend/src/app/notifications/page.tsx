"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ExternalLink,
  Sparkles,
  Bot,
  Activity,
  ShieldCheck,
  ArrowRight,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useNotifications, NotificationType } from "@/lib/notifications";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    addNotification,
    resetDefaultNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "unread" | NotificationType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Tab filter
      if (activeTab === "unread" && notif.read) return false;
      if (activeTab !== "all" && activeTab !== "unread" && notif.type !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          notif.title.toLowerCase().includes(q) ||
          notif.message.toLowerCase().includes(q) ||
          notif.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: unreadCount,
      seo: notifications.filter((n) => n.type === "seo").length,
      aeo: notifications.filter((n) => n.type === "aeo").length,
      system: notifications.filter((n) => n.type === "system").length,
      security: notifications.filter((n) => n.type === "security").length,
    };
  }, [notifications, unreadCount]);

  const handleCreateTestAlert = () => {
    const types: NotificationType[] = ["seo", "aeo", "system", "security"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const samples = {
      seo: {
        title: "New SEO Issue Detected",
        message: "Robots.txt blocked 2 essential JavaScript asset URLs during deterministic website crawl.",
        severity: "warning" as const,
        link: "/seo/issues",
        linkText: "View Robots Report",
      },
      aeo: {
        title: "ChatGPT Mention Added",
        message: "Your brand was cited in 3 new high-intent answer prompts for 'top technical SEO crawlers'.",
        severity: "success" as const,
        link: "/aeo/citations",
        linkText: "View Citations",
      },
      system: {
        title: "Crawler Daemon Synchronized",
        message: "FastAPI crawler worker finished 124 asynchronous concurrent URL evaluations.",
        severity: "info" as const,
        link: "/overview",
        linkText: "Engine Status",
      },
      security: {
        title: "SSRF Firewall Verified",
        message: "Egress sandbox completed zero-trust network packet inspection with 0 anomalies.",
        severity: "success" as const,
      },
    };

    addNotification({
      type: randomType,
      ...samples[randomType],
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "seo":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Activity className="w-3 h-3" />
            SEO
          </span>
        );
      case "aeo":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Bot className="w-3 h-3" />
            AEO
          </span>
        );
      case "system":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3" />
            SYSTEM
          </span>
        );
      case "security":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3" />
            SECURITY
          </span>
        );
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Page Banner & Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Notification Center
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time events, SEO crawl audit flags, and AI answer engine alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCreateTestAlert}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Alert</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Mark all as read</span>
              </button>
            )}

            {notifications.length > 0 ? (
              <button
                onClick={clearAll}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            ) : (
              <button
                onClick={resetDefaultNotifications}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Restore Demo Alerts
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Alerts</span>
              <Bell className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{counts.all}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Unread</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-blue-600 mt-1">{counts.unread}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">SEO Alerts</span>
              <Activity className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{counts.seo}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">AEO Updates</span>
              <Bot className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{counts.aeo}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(
                [
                  { key: "all", label: "All", count: counts.all },
                  { key: "unread", label: "Unread", count: counts.unread },
                  { key: "seo", label: "SEO", count: counts.seo },
                  { key: "aeo", label: "AEO", count: counts.aeo },
                  { key: "system", label: "System", count: counts.system },
                  { key: "security", label: "Security", count: counts.security },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-2.5">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.read && markAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group cursor-pointer ${
                  notif.read
                    ? "bg-white border-slate-200 hover:border-slate-300"
                    : "bg-blue-50/40 border-blue-200/80 shadow-xs hover:border-blue-300 hover:bg-blue-50/70"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="pt-0.5">{getSeverityIcon(notif.severity)}</div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(notif.type)}
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {notif.title}
                      </h2>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 pt-0.5 text-[11px] text-slate-400">
                      <span>{notif.timestamp}</span>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          <span>{notif.linkText || "View Details"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                    }}
                    title={notif.read ? "Read" : "Mark as read"}
                    disabled={notif.read}
                    className={`p-1.5 rounded-lg transition-colors ${
                      notif.read
                        ? "text-slate-300 cursor-default"
                        : "text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                    }`}
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    title="Delete Notification"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">
                  No notifications match your filter
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No alert results found for "${searchQuery}". Try a different search term.`
                    : "You're all caught up! No active notifications in this category."}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setSearchQuery("");
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={handleCreateTestAlert}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  Generate Alert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
