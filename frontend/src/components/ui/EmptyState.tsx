"use client";

import React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  actionIcon,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    if (typeof Icon === "function" || typeof Icon === "object") {
      const Component = Icon;
      return <Component className="w-6 h-6 text-slate-400" />;
    }
    return Icon;
  };

  return (
    <div
      className={cn(
        "p-12 text-center rounded-xl bg-white border border-dashed border-slate-300 shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto",
        className
      )}
    >
      <div className="p-3.5 bg-slate-50 text-slate-500 rounded-xl mb-3.5 border border-slate-200">
        {renderIcon()}
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {action ? (
        action
      ) : actionLabel && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction} leftIcon={actionIcon}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
