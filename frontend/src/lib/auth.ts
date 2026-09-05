"use client";

import { useEffect, useState } from "react";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
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

  const login = (email: string = "admin@seosensing.internal", name: string = "Enterprise Admin") => {
    const session: UserSession = {
      id: "usr_demo_123",
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
    logout,
  };
}
