"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type NotificationType = "seo" | "aeo" | "system" | "security";
export type NotificationSeverity = "info" | "success" | "warning" | "error";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  createdAt: number;
  type: NotificationType;
  severity: NotificationSeverity;
  read: boolean;
  link?: string;
  linkText?: string;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (
    item: Omit<NotificationItem, "id" | "timestamp" | "createdAt" | "read"> & {
      read?: boolean;
    }
  ) => void;
  resetDefaultNotifications: () => void;
}

const STORAGE_KEY = "seosensing_global_notifications_v1";

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Full Website Crawl Completed",
    message: "48 pages audited on seosensing.internal. 12 on-page issues and 2 broken redirects discovered.",
    timestamp: "10m ago",
    createdAt: Date.now() - 1000 * 60 * 10,
    type: "seo",
    severity: "success",
    read: false,
    link: "/seo/issues",
    linkText: "Inspect Issues",
  },
  {
    id: "notif_2",
    title: "AEO Citation Spike (+14%)",
    message: "Perplexity AI & ChatGPT citations jumped +14% across top commercial query clusters.",
    timestamp: "35m ago",
    createdAt: Date.now() - 1000 * 60 * 35,
    type: "aeo",
    severity: "info",
    read: false,
    link: "/aeo/citations",
    linkText: "View Citations",
  },
  {
    id: "notif_3",
    title: "Missing Canonical Tags Flagged",
    message: "3 high-traffic URLs are missing canonical tags, risking duplicate indexing penalties.",
    timestamp: "2h ago",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    type: "seo",
    severity: "warning",
    read: false,
    link: "/seo/optimize/metadata",
    linkText: "Fix Metadata",
  },
  {
    id: "notif_4",
    title: "Competitor AI Answer Gap Detected",
    message: "A competitor gained 4 new answer snippets on target queries in AI Answer Engine radar.",
    timestamp: "4h ago",
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
    type: "aeo",
    severity: "warning",
    read: true,
    link: "/aeo/optimization/citations",
    linkText: "Analyze Gaps",
  },
  {
    id: "notif_5",
    title: "SeoSensing Engine Online",
    message: "Deterministic crawler daemon verified and healthy with sub-second response times.",
    timestamp: "6h ago",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    type: "system",
    severity: "success",
    read: true,
    link: "/overview",
    linkText: "System Hub",
  },
  {
    id: "notif_6",
    title: "SSRF Protection Check Passed",
    message: "All outbound website crawler requests verified against 256-bit SSL and SSRF egress firewall rules.",
    timestamp: "1d ago",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    type: "security",
    severity: "info",
    read: true,
  },
];

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      }
    } catch {
      // Ignore JSON error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Ignore storage error
    }
  }, [notifications, isLoaded]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (
    item: Omit<NotificationItem, "id" | "timestamp" | "createdAt" | "read"> & {
      read?: boolean;
    }
  ) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: "Just now",
      createdAt: Date.now(),
      read: item.read ?? false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const resetDefaultNotifications = () => {
    setNotifications(DEFAULT_NOTIFICATIONS);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        addNotification,
        resetDefaultNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
