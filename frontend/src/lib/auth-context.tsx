"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}

export const AUTH_STORAGE_KEY = "zobayrank_auth_session";
export const AUTH_COOKIE_NAME = "zobayrank_auth_token";

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${AUTH_COOKIE_NAME})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") return;
  // 7 days cookie expiration, path=/ for full application scope
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `dmos_auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem("dmos_auth_session");
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.email || !session.id) return null;
    return session;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  const token = user.token || user.id;
  if (token) {
    setAuthCookie(token);
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    const user = getStoredUser();
    if (user?.id) {
      localStorage.removeItem(`zobayrank_read_notifications_v3_${user.id}`);
    }
  } catch {
    // Ignore
  }
  localStorage.removeItem("zobayrank_read_notifications_v2");
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("dmos_auth_session");
  try {
    sessionStorage.clear();
  } catch {
    // Ignore sessionStorage error
  }
  clearAuthCookie();
}

export interface AuthContextValue {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<UserSession>;
  signUpWithCredentials: (email: string, fullName: string, password: string) => Promise<UserSession>;
  logout: () => void;
  refreshUser: (force?: boolean) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cleanly to null so SSR and initial client hydration match 100%
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const lastVerifiedRef = useRef<number>(0);

  // Sync state and verify session against backend quietly in background
  const refreshUser = useCallback(async (force = false) => {
    const stored = getStoredUser();
    if (!stored) {
      setUser(null);
      clearAuthCookie();
      setIsLoading(false);
      return;
    }

    // Set user immediately from storage if not set yet
    setUser((prev) => prev || stored);

    const token = stored.token || stored.id;
    if (token) {
      setAuthCookie(token);
    }

    // Rate-limit backend verification: at most once every 5 minutes unless forced
    const now = Date.now();
    if (!force && now - lastVerifiedRef.current < 5 * 60 * 1000) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-Id": stored.id,
          "X-User-Email": stored.email,
        },
      });

      if (res.ok) {
        const remoteUser = await res.json();
        const verifiedSession: UserSession = {
          ...stored,
          id: remoteUser.id,
          email: remoteUser.email,
          name: remoteUser.name || stored.name,
          role: remoteUser.role || stored.role,
        };
        setStoredUser(verifiedSession);
        setUser(verifiedSession);
        lastVerifiedRef.current = Date.now();
      } else if (res.status === 401) {
        // Backend invalidated or rejected this session
        clearStoredUser();
        setUser(null);
      }
    } catch {
      // In case of network interruption, keep existing valid session
      setUser(stored);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hydrate once on initial application load
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setIsLoading(false);
      refreshUser(false);
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const loginWithCredentials = async (email: string, password: string): Promise<UserSession> => {
    clearStoredUser();

    const cleanEmail = email.trim().toLowerCase();
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.message || "Invalid email or password.");
    }

    const session: UserSession = {
      id: data.user?.id || `usr_${Date.now()}`,
      email: data.user?.email || cleanEmail,
      name: data.user?.name || cleanEmail.split("@")[0],
      role: data.user?.role || "member",
      token: data.token || data.user?.id,
    };

    setStoredUser(session);
    setUser(session);
    lastVerifiedRef.current = Date.now();
    return session;
  };

  const signUpWithCredentials = async (
    email: string,
    fullName: string,
    password: string
  ): Promise<UserSession> => {
    clearStoredUser();

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        full_name: cleanName || undefined,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.message || "Registration failed.");
    }

    const session: UserSession = {
      id: data.user?.id || `usr_${Date.now()}`,
      email: data.user?.email || cleanEmail,
      name: data.user?.name || cleanName || cleanEmail.split("@")[0],
      role: data.user?.role || "member",
      token: data.token || data.user?.id,
    };

    setStoredUser(session);
    setUser(session);
    lastVerifiedRef.current = Date.now();
    return session;
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user && user.email),
    isLoading,
    loginWithCredentials,
    signUpWithCredentials,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    const stored = getStoredUser();
    return {
      user: stored,
      isAuthenticated: Boolean(stored && stored.email),
      isLoading: false,
      loginWithCredentials: async () => {
        throw new Error("AuthProvider is missing from component tree.");
      },
      signUpWithCredentials: async () => {
        throw new Error("AuthProvider is missing from component tree.");
      },
      logout: () => clearStoredUser(),
      refreshUser: async () => {},
    };
  }
  return context;
}
