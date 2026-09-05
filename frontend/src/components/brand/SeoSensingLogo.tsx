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
 * SeoSensing Official Brand Logo
 * Features the signature 4-fold origami ribbon loop forming a central AI star.
 * Unites SEO electric blue with AEO radiant violet in a seamless, freestanding emblem.
 */
export const SeoSensingLogo: React.FC<SeoSensingLogoProps> = ({
  className,
  size = 36,
  title = "SeoSensing",
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
 * SeoSensing Brand Lockup (Freestanding Logo + Clean Styled Typography)
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
            "font-black text-lg tracking-tight leading-none whitespace-nowrap font-sans select-none",
            isDark ? "text-white" : "text-slate-950"
          )}
        >
          SEO
          <span
            className={cn(
              "bg-gradient-to-r bg-clip-text text-transparent",
              isDark
                ? "from-blue-400 via-indigo-300 to-purple-400"
                : "from-blue-600 via-indigo-600 to-purple-600"
            )}
          >
            Sensing
          </span>
        </span>
      )}
    </div>
  );
};

export default SeoSensingLogo;
