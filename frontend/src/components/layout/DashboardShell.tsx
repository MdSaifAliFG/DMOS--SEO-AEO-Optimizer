"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { LogoutModal } from "./LogoutModal";
import { SeoSensingLogo } from "@/components/brand/SeoSensingLogo";
import { Loader2 } from "lucide-react";

export interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zobay_sidebar_collapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  const handleOpenMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const handleCloseMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const handleToggleCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("zobay_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);
  const handleOpenLogoutModal = useCallback(() => setIsLogoutModalOpen(true), []);
  const handleCloseLogoutModal = useCallback(() => setIsLogoutModalOpen(false), []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${returnUrl}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Loading state: only display loader on cold start if no user session is in memory yet
  if (isLoading && !user) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center text-white select-none">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="relative">
            <SeoSensingLogo size={48} className="animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span>Verifying session security...</span>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated or no valid user session, block rendering completely
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 w-full">
      {/* Desktop Sidebar */}
      <Sidebar
        className="hidden lg:block shrink-0"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        onOpenLogoutModal={handleOpenLogoutModal}
      />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={handleCloseMobileNav}
        onOpenLogoutModal={handleOpenLogoutModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header
          onOpenMobileNav={handleOpenMobileNav}
          onOpenLogoutModal={handleOpenLogoutModal}
        />
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 2xl:p-10 3xl:p-12 max-w-[1720px] 2xl:max-w-[1920px] 3xl:max-w-[2200px] 4k:max-w-[2480px] w-full mx-auto transition-all min-w-0">
          {children}
        </main>
      </div>

      {/* Branded Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
      />
    </div>
  );
};
