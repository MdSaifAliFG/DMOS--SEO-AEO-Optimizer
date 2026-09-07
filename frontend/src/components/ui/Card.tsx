import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "subtle" | "bordered" | "flat";
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  hoverable = false,
  ...props
}) => {
  const variantStyles = {
    default: "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs dark:shadow-none transition-colors duration-150",
    glass: "bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm",
    subtle: "bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs",
    bordered: "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5",
    flat: "bg-slate-50 dark:bg-slate-900/40 border border-transparent rounded-xl p-4",
  };

  return (
    <div
      className={cn(
        variantStyles[variant],
        hoverable &&
          "transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
