"use client";

import React, { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleOpenMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const handleCloseMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const handleToggleCollapse = useCallback(() => setIsSidebarCollapsed((prev) => !prev), []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 w-full">
      {/* Desktop Sidebar */}
      <Sidebar
        className="hidden lg:block shrink-0"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={handleCloseMobileNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header onOpenMobileNav={handleOpenMobileNav} />
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 2xl:p-10 3xl:p-12 max-w-[1720px] 2xl:max-w-[1920px] 3xl:max-w-[2200px] 4k:max-w-[2480px] w-full mx-auto transition-all min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
