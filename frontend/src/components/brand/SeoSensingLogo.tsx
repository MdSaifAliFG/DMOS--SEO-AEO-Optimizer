"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SeoSensingLogoProps {
  className?: string;
  size?: number;
  variant?: "gradient" | "monochrome" | "white";
}

/**
 * SeoSensing Official Brand Logo
 * Features the signature 4-fold origami ribbon loop forming a central AI star.
 * Unites SEO electric blue with AEO radiant violet in a seamless, freestanding emblem.
 */
export const SeoSensingLogo: React.FC<SeoSensingLogoProps> = ({
  className,
  size = 36,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        "relative shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200",
        className
      )}
      style={{ width: size, height: size }}
      title="SeoSensing"
    >
      {!imgError ? (
        <img
          src="/logo.png"
          alt="SeoSensing Logo"
          width={size}
          height={size}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain select-none pointer-events-none drop-shadow-sm"
        />
      ) : (
        <img
          src="/logo.svg"
          alt="SeoSensing Logo"
          width={size}
          height={size}
          className="w-full h-full object-contain select-none pointer-events-none"
        />
      )}
    </div>
  );
};

interface SeoSensingBrandProps {
  className?: string;
  isCollapsed?: boolean;
  theme?: "light" | "dark";
  showTagline?: boolean;
  showBadge?: boolean;
}

/**
 * SeoSensing Brand Lockup (Freestanding Logo + Styled Typography + Enterprise Badge)
 */
export const SeoSensingBrand: React.FC<SeoSensingBrandProps> = ({
  className,
  isCollapsed = false,
  theme = "light",
  showTagline = true,
  showBadge = true,
}) => {
  const isDark = theme === "dark";

  return (
    <div className={cn("flex items-center gap-2.5 min-w-0 group select-none", className)}>
      <SeoSensingLogo size={36} />

      {!isCollapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-black text-base tracking-tight leading-none flex items-center",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              SEO
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent ml-0.5">
                Sensing
              </span>
            </span>
            {showBadge && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded font-bold border",
                  isDark
                    ? "bg-purple-900/60 text-purple-200 border-purple-700/50"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                )}
              >
                Enterprise
              </span>
            )}
          </div>
          {showTagline && (
            <span
              className={cn(
                "text-[10px] font-medium truncate mt-0.5",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              AI Search & Optimization OS
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SeoSensingLogo;
