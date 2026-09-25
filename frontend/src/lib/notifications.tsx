"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "./constants";

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
  isRefreshing: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
  addNotification: (
    item: Omit<NotificationItem, "id" | "timestamp" | "createdAt" | "read"> & {
      read?: boolean;
    }
  ) => void;
}

const READ_STORAGE_KEY = "zobayrank_read_notifications_v2";

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load read IDs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(READ_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReadIds(new Set(parsed));
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync read IDs to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(readIds)));
    } catch {
      // Ignore
    }
  }, [readIds, isLoaded]);

  // Fetch authentic real-time feed from backend
  const fetchLiveFeed = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`${API_BASE_URL}/notifications/feed`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications((prev) => {
            // Apply read status based on readIds
            return data.map((item: NotificationItem) => ({
              ...item,
              read: readIds.has(item.id) || item.read,
            }));
          });
        }
      }
    } catch {
      // Fail silently if network/backend is briefly busy
    } finally {
      setIsRefreshing(false);
    }
  }, [readIds]);

  // Initial fetch and periodic polling (every 30s)
  useEffect(() => {
    if (isLoaded) {
      fetchLiveFeed();
      const interval = setInterval(fetchLiveFeed, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoaded, fetchLiveFeed]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      setReadIds(new Set(updated.map((u) => u.id)));
      return updated;
    });
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

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isRefreshing,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        refreshNotifications: fetchLiveFeed,
        addNotification,
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
