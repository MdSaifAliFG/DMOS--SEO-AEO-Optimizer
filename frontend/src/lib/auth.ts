"use client";

import { useEffect, useState, useCallback } from "react";
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
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
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
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("dmos_auth_session");
  clearAuthCookie();
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state and verify session against backend
  const refreshUser = useCallback(async () => {
    const stored = getStoredUser();
    if (!stored) {
      setUser(null);
      clearAuthCookie();
      setIsLoading(false);
      return;
    }

    // Set stored user right away to avoid initial layout pop
    setUser(stored);
    const token = stored.token || stored.id;
    if (token) {
      setAuthCookie(token);
    }

    // Verify session integrity with the backend
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
      } else if (res.status === 401 || res.status === 403) {
        // Backend invalidated or rejected this session
        clearStoredUser();
        setUser(null);
      }
    } catch {
      // Offline fallback: keep locally stored session
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const loginWithCredentials = async (email: string, password: string): Promise<UserSession> => {
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
    return session;
  };

  const signUpWithCredentials = async (
    email: string,
    fullName: string,
    password: string
  ): Promise<UserSession> => {
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
    return session;
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: Boolean(user && user.email),
    isLoading,
    loginWithCredentials,
    signUpWithCredentials,
    logout,
    refreshUser,
  };
}
