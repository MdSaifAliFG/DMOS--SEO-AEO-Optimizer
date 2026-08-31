import React from "react";
import { STATUS_CONFIG } from "@/lib/constants";
import { ScanStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ScanStatusBadgeProps {
  status: ScanStatus | string;
  size?: "sm" | "md";
  className?: string;
}

export const ScanStatusBadge: React.FC<ScanStatusBadgeProps> = ({
  status,
  size = "sm",
  className,
}) => {
  const config =
    STATUS_CONFIG[status as ScanStatus] || STATUS_CONFIG.queued;

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide",
        sizeStyles[size],
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass)} />
      {config.label}
    </span>
  );
};
