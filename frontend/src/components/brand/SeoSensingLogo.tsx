"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SeoSensingLogoProps {
  className?: string;
  size?: number;
  variant?: "gradient" | "monochrome" | "white";
  title?: string;
}

/**
 * Zobay Rank Official Brand Logo
 */
export const SeoSensingLogo: React.FC<SeoSensingLogoProps> = ({
  className,
  size = 36,
  title = "Zobay Rank",
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "relative shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200",
        className
      )}
      style={{ width: size, height: size }}
      title={title}
    >
      {!imgError ? (
        <img
          src="/logo.png"
          alt="Zobay Rank Logo"
          width={size}
          height={size}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain select-none pointer-events-none drop-shadow-sm"
        />
      ) : (
        <img
          src="/logo.svg"
          alt="Zobay Rank Logo"
          width={size}
          height={size}
          className="w-full h-full object-contain select-none pointer-events-none"
        />
      )}
    </div>
  );
};

export const ZobayRankLogo = SeoSensingLogo;

interface SeoSensingBrandProps {
  className?: string;
  isCollapsed?: boolean;
  theme?: "light" | "dark";
  showTagline?: boolean;
  showBadge?: boolean;
}

/**
 * Zobay Rank Brand Lockup (Freestanding Logo + Clean Styled Typography)
 * Matches the official Zobay Rank styling: crisp white/slate 'Zob' followed by 'ay Rank' in blue-to-purple gradient.
 */
export const SeoSensingBrand: React.FC<SeoSensingBrandProps> = ({
  className,
  isCollapsed = false,
  theme = "light",
}) => {
  const isDark = theme === "dark";

  return (
    <div
      suppressHydrationWarning
      className={cn("flex items-center gap-2.5 min-w-0 group select-none", className)}
    >
      <SeoSensingLogo size={36} />

      {!isCollapsed && (
        <span
          suppressHydrationWarning
          className={cn(
            "font-black text-lg tracking-tight leading-none whitespace-nowrap font-sans select-none text-slate-950 dark:text-white",
            isDark && "text-white"
          )}
        >
          Zob
          <span
            className={cn(
              "bg-gradient-to-r bg-clip-text text-transparent from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400",
              isDark && "from-blue-400 via-indigo-300 to-purple-400"
            )}
          >
            ay Rank
          </span>
        </span>
      )}
    </div>
  );
};

export const ZobayRankBrand = SeoSensingBrand;

export default SeoSensingLogo;
