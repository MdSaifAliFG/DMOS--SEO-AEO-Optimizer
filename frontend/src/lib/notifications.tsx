"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "./constants";
import { getStoredUser, getAuthCookie } from "./auth";

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
  isLiveConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  addNotification: (
    item: Omit<NotificationItem, "id" | "timestamp" | "createdAt" | "read"> & {
      read?: boolean;
    }
  ) => void;
}

const READ_STORAGE_KEY_PREFIX = "zobayrank_read_notifications_v3";
const DISMISSED_STORAGE_KEY_PREFIX = "zobayrank_dismissed_notifications_v3";

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // References to keep event handlers and SSE up to date without re-triggering effects
  const dismissedIdsRef = useRef<Set<string>>(dismissedIds);
  dismissedIdsRef.current = dismissedIds;

  const readIdsRef = useRef<Set<string>>(readIds);
  readIdsRef.current = readIds;

  // Sync active user and load read + dismissed IDs from user-scoped localStorage
  useEffect(() => {
    const user = getStoredUser();
    const currentId = user?.id || null;
    setActiveUserId(currentId);

    if (!currentId) {
      setNotifications([]);
      setReadIds(new Set());
      setDismissedIds(new Set());
      setIsLoaded(true);
      return;
    }

    try {
      const readKey = `${READ_STORAGE_KEY_PREFIX}_${currentId}`;
      const storedRead = localStorage.getItem(readKey);
      if (storedRead) {
        const parsed = JSON.parse(storedRead);
        if (Array.isArray(parsed)) {
          setReadIds(new Set(parsed));
        }
      }

      const dismissedKey = `${DISMISSED_STORAGE_KEY_PREFIX}_${currentId}`;
      const storedDismissed = localStorage.getItem(dismissedKey);
      if (storedDismissed) {
        const parsedDismissed = JSON.parse(storedDismissed);
        if (Array.isArray(parsedDismissed)) {
          setDismissedIds(new Set(parsedDismissed));
        }
      }
    } catch {
      // Ignore localStorage parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync read IDs to user-scoped localStorage
  useEffect(() => {
    if (!isLoaded || !activeUserId) return;
    try {
      const storageKey = `${READ_STORAGE_KEY_PREFIX}_${activeUserId}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(readIds)));
    } catch {
      // Ignore
    }
  }, [readIds, isLoaded, activeUserId]);

  // Sync dismissed IDs to user-scoped localStorage
  useEffect(() => {
    if (!isLoaded || !activeUserId) return;
    try {
      const storageKey = `${DISMISSED_STORAGE_KEY_PREFIX}_${activeUserId}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(dismissedIds)));
    } catch {
      // Ignore
    }
  }, [dismissedIds, isLoaded, activeUserId]);

  // Fetch feed from backend with complete dismissed filtering
  const fetchLiveFeed = useCallback(async () => {
    try {
      const user = getStoredUser();
      const token = user?.token || user?.id || getAuthCookie();
      if (!token) {
        setNotifications([]);
        return;
      }

      setIsRefreshing(true);
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (user?.id) {
        headers["X-User-Id"] = user.id;
      }
      if (user?.email) {
        headers["X-User-Email"] = user.email;
      }

      const res = await fetch(`${API_BASE_URL}/notifications/feed`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const currentDismissed = dismissedIdsRef.current;
          const currentRead = readIdsRef.current;

          setNotifications(() => {
            const seen = new Set<string>();
            const deduped: NotificationItem[] = [];
            for (const item of data) {
              if (!item || !item.id || seen.has(item.id) || currentDismissed.has(item.id)) {
                continue;
              }
              seen.add(item.id);
              deduped.push({
                ...item,
                read: currentRead.has(item.id) || item.read,
              });
            }
            return deduped;
          });
        }
      } else if (res.status === 401 || res.status === 403) {
        setNotifications([]);
      }
    } catch {
      // Fail silently if network/backend is briefly busy
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Real-time Server-Sent Events (SSE) subscriber
  useEffect(() => {
    if (!isLoaded || !activeUserId) return;

    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const connectSSE = () => {
      if (isCancelled) return;
      const user = getStoredUser();
      const token = user?.token || user?.id || getAuthCookie();
      if (!token) return;

      try {
        const sseUrl = `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`;
        eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => {
          setIsLiveConnected(true);
        };

        eventSource.addEventListener("connected", () => {
          setIsLiveConnected(true);
        });

        // Incoming real-time notification
        eventSource.addEventListener("notification", (e: MessageEvent) => {
          try {
            const data: NotificationItem = JSON.parse(e.data);
            if (!data || !data.id) return;

            // Check if user already dismissed this notification
            if (dismissedIdsRef.current.has(data.id)) return;

            setNotifications((prev) => {
              // Deduplicate if already present
              const existingIdx = prev.findIndex((n) => n.id === data.id);
              const read = readIdsRef.current.has(data.id) || data.read;
              const formattedItem = { ...data, read };

              if (existingIdx >= 0) {
                const next = [...prev];
                next[existingIdx] = formattedItem;
                return next;
              }
              return [formattedItem, ...prev];
            });
          } catch {
            // Ignore parse errors
          }
        });

        // Notification marked read in another session / backend
        eventSource.addEventListener("notification_read", (e: MessageEvent) => {
          try {
            const { id } = JSON.parse(e.data);
            if (id) {
              setReadIds((prev) => new Set(prev).add(id));
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
              );
            }
          } catch {
            // Ignore
          }
        });

        eventSource.addEventListener("notification_read_all", () => {
          setNotifications((prev) => {
            const updated = prev.map((n) => ({ ...n, read: true }));
            setReadIds(new Set(updated.map((u) => u.id)));
            return updated;
          });
        });

        // Notification dismissed in another session / backend
        eventSource.addEventListener("notification_dismissed", (e: MessageEvent) => {
          try {
            const { id } = JSON.parse(e.data);
            if (id) {
              setDismissedIds((prev) => new Set(prev).add(id));
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            }
          } catch {
            // Ignore
          }
        });

        eventSource.addEventListener("notification_cleared", () => {
          setNotifications([]);
        });

        eventSource.onerror = () => {
          setIsLiveConnected(false);
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Attempt reconnect after 5 seconds
          if (!isCancelled) {
            reconnectTimer = setTimeout(connectSSE, 5000);
          }
        };
      } catch {
        setIsLiveConnected(false);
        if (!isCancelled) {
          reconnectTimer = setTimeout(connectSSE, 10000);
        }
      }
    };

    connectSSE();

    // Initial feed fetch and safety net polling (30s)
    fetchLiveFeed();
    const interval = setInterval(fetchLiveFeed, 30000);

    return () => {
      isCancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearInterval(interval);
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      setIsLiveConnected(false);
    };
  }, [isLoaded, activeUserId, fetchLiveFeed]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    // 1. Immediately update local state & storage
    setReadIds((prev) => new Set(prev).add(id));
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );

    // 2. Persist to backend
    try {
      const user = getStoredUser();
      const token = user?.token || user?.id || getAuthCookie();
      if (token) {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        if (user?.id) headers["X-User-Id"] = user.id;
        if (user?.email) headers["X-User-Email"] = user.email;

        await fetch(`${API_BASE_URL}/notifications/${encodeURIComponent(id)}/read`, {
          method: "POST",
          headers,
        });
      }
    } catch {
      // Retain optimistic update
    }
  };

  const markAllAsRead = async () => {
    // 1. Immediately update local state & storage
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      setReadIds(new Set(updated.map((u) => u.id)));
      return updated;
    });

    // 2. Persist to backend
    try {
      const user = getStoredUser();
      const token = user?.token || user?.id || getAuthCookie();
      if (token) {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        if (user?.id) headers["X-User-Id"] = user.id;
        if (user?.email) headers["X-User-Email"] = user.email;

        await fetch(`${API_BASE_URL}/notifications/read-all`, {
          method: "POST",
          headers,
        });
      }
    } catch {
      // Retain optimistic update
    }
  };

  const removeNotification = async (id: string) => {
    // 1. Immediately shield locally and filter from display
    setDismissedIds((prev) => new Set(prev).add(id));
    setNotifications((prev) => prev.filter((item) => item.id !== id));

    // 2. Persist permanent dismissal on backend
    try {
      const user = getStoredUser();
      const token = user?.token || user?.id || getAuthCookie();
      if (token) {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        if (user?.id) headers["X-User-Id"] = user.id;
        if (user?.email) headers["X-User-Email"] = user.email;

        await fetch(`${API_BASE_URL}/notifications/${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers,
        });
      }
    } catch {
      // Local dismissal shield remains in effect
    }
  };

  const clearAll = async () => {
    // 1. Immediately shield all current notifications locally
    const currentIds = notifications.map((n) => n.id);
    setDismissedIds((prev) => {
      const next = new Set(prev);
      currentIds.forEach((id) => next.add(id));
      return next;
    });
    setNotifications([]);

    // 2. Persist bulk dismissal on backend
    try {
      const user = getStoredUser();
      const token = user?.token || user?.id || getAuthCookie();
      if (token) {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        if (user?.id) headers["X-User-Id"] = user.id;
        if (user?.email) headers["X-User-Email"] = user.email;

        await fetch(`${API_BASE_URL}/notifications/clear-all`, {
          method: "DELETE",
          headers,
        });
      }
    } catch {
      // Local dismissal shield remains in effect
    }
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
        isLiveConnected,
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
