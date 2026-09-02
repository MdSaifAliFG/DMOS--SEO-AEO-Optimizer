"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Bot,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@dmos.internal");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "seo" | "aeo">("admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: "admin" | "seo" | "aeo") => {
    setSelectedRole(role);
    if (role === "admin") {
      setEmail("admin@dmos.internal");
    } else if (role === "seo") {
      setEmail("seo.lead@dmos.internal");
    } else {
      setEmail("aeo.strategist@dmos.internal");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const roleTitle =
      selectedRole === "admin"
        ? "Enterprise Admin"
        : selectedRole === "seo"
        ? "SEO Growth Lead"
        : "AEO Strategist";
    login(email, roleTitle);
    window.location.href = "/overview";
  };

  const handleDemoAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login("demo@dmos.internal", "Enterprise Demo User");
    window.location.href = "/overview";
  };

  return (
    <div className="h-screen max-h-screen w-full bg-[#030712] text-white flex flex-col justify-between items-center px-4 py-3 sm:py-5 relative overflow-hidden font-sans select-none">
      {/* Intense Ambient Glow Backlights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-[#1D63FF]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-6 right-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Background Floating Isometric Badges (Decorative Depth) */}
      <div className="hidden xl:block absolute top-20 left-16 w-48 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-2xl transform -rotate-12 opacity-60 pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <span>SEO Health Score</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-xl font-black text-white font-mono">98 / 100</span>
          <span className="text-[10px] font-bold text-emerald-400">+12% ^</span>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-16 right-16 w-48 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-2xl transform rotate-12 opacity-60 pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
          <Bot className="w-3.5 h-3.5" />
          <span>Answer Engine Radar</span>
        </div>
        <div className="mt-1.5 text-xs text-slate-300">
          <span className="text-white font-bold block text-[11px]">ChatGPT & Perplexity</span>
          <span className="text-[9px] text-emerald-400">100% Citations Active</span>
        </div>
      </div>

      {/* Top Brand Header Link */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between shrink-0">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex items-center tracking-tight">
            <span className="font-extrabold text-base text-white">DMOS</span>
            <span className="font-extrabold text-base text-blue-500">WEBSCAN</span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-[11px] text-slate-400 hover:text-white font-semibold transition-colors flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800"
        >
          <span>← Public Homepage</span>
        </Link>
      </div>

      {/* Main Login Card - Compact & Fits 100% On-Screen */}
      <div className="w-full max-w-[400px] relative z-10 my-auto">
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 space-y-4">
          
          {/* Header Title */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Enterprise Single Sign-On</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Sign in to DMOS
            </h1>
            <p className="text-[11px] text-slate-400">
              Deterministic SEO crawling & AI Answer Engine Optimization.
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-950/80 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedRole === "admin"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("seo")}
                className={`py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedRole === "seo"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                SEO Lead
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("aeo")}
                className={`py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedRole === "aeo"
                    ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                AEO Lead
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Password</label>
                <span className="text-[10px] text-blue-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-8 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/35 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 mt-1"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Platform"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider relative z-10">
              or explore demo
            </span>
          </div>

          {/* One-Click Instant Access */}
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 hover:border-purple-500/50 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Instant Demo Access (No Password)</span>
          </button>
        </div>
      </div>

      {/* Bottom Trust & Security Badges - Fixed to Front View */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-900 shrink-0">
        <p>© 2026 DMOS Platform. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>256-Bit SSL</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            <span>SSRF Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
