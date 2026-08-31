"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Lock, Mail, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@dmos.internal");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login(email, "Growth Lead");
    window.location.href = "/seo/dashboard";
  };

  const handleDemoAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login("demo@dmos.internal", "Enterprise Demo User");
    window.location.href = "/seo/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">DMOS</span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Access your unified SEO technical audits and AEO answer engine visibility dashboards.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Signing In..." : "Sign In to Platform"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider relative z-10">
            or explore
          </span>
        </div>

        {/* Demo One-Click Access */}
        <button
          type="button"
          onClick={handleDemoAccess}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Instant Demo Access (No Password)</span>
        </button>

        <div className="pt-2 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 font-medium transition-colors">
            ← Back to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
