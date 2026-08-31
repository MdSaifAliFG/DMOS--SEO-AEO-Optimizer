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
    default: "bg-white border border-slate-200 rounded-xl p-5 shadow-xs",
    glass: "bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm",
    subtle: "bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 shadow-xs",
    bordered: "bg-white border border-slate-200 rounded-xl p-5",
    flat: "bg-slate-50 border border-transparent rounded-xl p-4",
  };

  return (
    <div
      className={cn(
        variantStyles[variant],
        hoverable &&
          "transition-all duration-150 hover:border-slate-300 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
