"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Bot,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { SeoSensingLogo } from "@/components/brand/SeoSensingLogo";

export default function SignUpPage() {
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login(email || "alex@seosensing.internal", fullName || "Enterprise Member");
    window.location.href = "/overview";
  };

  const handleDemoAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login("demo@seosensing.internal", "Enterprise Demo User");
    window.location.href = "/overview";
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col justify-between items-center px-4 py-3 sm:py-5 relative overflow-x-hidden font-sans select-none">
      {/* Intense Ambient Glow Backlights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-[#1D63FF]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-6 right-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Background Floating Isometric Badges (White & Animated Floating) */}
      <div className="hidden xl:block absolute top-24 left-14 w-52 bg-white/95 backdrop-blur-xl border border-slate-100/90 rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.4)] shadow-blue-500/10 pointer-events-none animate-float-slow z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span>SEO Health Score</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2 pt-1 border-t border-slate-100">
          <span className="text-xl font-black text-slate-950 font-mono">
            98 <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </span>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
            +12% ↑
          </span>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-20 right-14 w-56 bg-white/95 backdrop-blur-xl border border-slate-100/90 rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.4)] shadow-purple-500/10 pointer-events-none animate-float-reverse z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span>Answer Engine Radar</span>
        </div>
        <div className="mt-2 pt-1 border-t border-slate-100 space-y-1">
          <span className="text-slate-900 font-bold block text-xs">ChatGPT & Perplexity</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
            ● 100% Citations Active
          </span>
        </div>
      </div>

      {/* Top Header: Back to home */}
      <div className="relative z-10 w-full flex items-center justify-start shrink-0 px-2 sm:px-4">
        <Link
          href="/"
          className="text-xs text-slate-300 hover:text-white font-semibold transition-all inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-sm group"
        >
          <span className="text-slate-400 group-hover:text-white transition-colors">←</span>
          <span>Back to home</span>
        </Link>
      </div>

      {/* Main Sign Up Card - Sleek White Card */}
      <div className="w-full max-w-[420px] relative z-10 my-4">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.55)] border border-slate-100 space-y-4 text-slate-900">
          
          {/* Header Title & Brand Emblem with Name */}
          <div className="text-center space-y-1.5 flex flex-col items-center">
            <div className="inline-flex items-center gap-2.5 mb-0.5">
              <SeoSensingLogo size={38} />
              <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
                SEO<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Sensing</span>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Deterministic SEO crawling & AI Answer Engine Optimization.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignUp} className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all shadow-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 flex items-center justify-center cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 cursor-pointer mt-1"
            >
              <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Reassurance text */}
          <p className="text-[10px] text-center text-slate-400 leading-relaxed">
            By signing up, you agree to our{" "}
            <a href="#" className="underline text-slate-500 hover:text-slate-700">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline text-slate-500 hover:text-slate-700">Privacy Policy</a>.
          </p>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
              or explore demo
            </span>
          </div>

          {/* One-Click Instant Access */}
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Instant Demo Access (No Password)</span>
          </button>

          {/* Link to Login */}
          <div className="pt-1 text-center">
            <p className="text-xs text-slate-600 font-normal">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors ml-0.5"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Trust & Security Badges */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-900 shrink-0">
        <p>© 2026 SeoSensing Platform. All rights reserved.</p>
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
