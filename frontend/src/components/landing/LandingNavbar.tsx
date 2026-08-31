"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const LandingNavbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About us", href: "#path-to-success" },
    { label: "Services", href: "#what-else" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ's", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans">
            DMOS<span className="text-blue-500">WEBSCAN</span>
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTAs (Exact match to reference style) */}
        <div className="hidden md:flex items-center gap-3">
          <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
            <button className="px-5 py-2 rounded-lg border border-white/80 text-white text-xs font-semibold hover:bg-white/10 transition-all duration-150">
              Scan your website
            </button>
          </Link>

          <Link href={isAuthenticated ? "/seo/dashboard" : "/login"}>
            <button className="px-5 py-2 rounded-lg bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition-all duration-150 shadow-md">
              Upgrade
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-slate-300 rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <Link
              href={isAuthenticated ? "/seo/dashboard" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <button className="w-full py-2.5 rounded-lg border border-white/80 text-white text-xs font-semibold">
                Scan your website
              </button>
            </Link>

            <Link
              href={isAuthenticated ? "/seo/dashboard" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <button className="w-full py-2.5 rounded-lg bg-white text-slate-950 text-xs font-bold">
                Upgrade
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
