"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}

const AUTH_STORAGE_KEY = "seosensing_auth_session";

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem("dmos_auth_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("dmos_auth_session");
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const loginWithCredentials = async (email: string, password: string): Promise<UserSession> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.message || "Invalid email or password.");
    }

    const session: UserSession = {
      id: data.user?.id || `usr_${Date.now()}`,
      email: data.user?.email || email,
      name: data.user?.name || email.split("@")[0],
      role: data.user?.role || "member",
      token: data.token,
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
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        full_name: fullName.trim() || undefined,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.message || "Registration failed.");
    }

    const session: UserSession = {
      id: data.user?.id || `usr_${Date.now()}`,
      email: data.user?.email || email,
      name: data.user?.name || fullName || email.split("@")[0],
      role: data.user?.role || "member",
      token: data.token,
    };

    setStoredUser(session);
    setUser(session);
    return session;
  };

  const login = (email: string = "admin@seosensing.internal", name: string = "Enterprise Admin") => {
    const session: UserSession = {
      id: "usr_active_session",
      email,
      name,
      role: "admin",
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
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    loginWithCredentials,
    signUpWithCredentials,
    logout,
  };
}
