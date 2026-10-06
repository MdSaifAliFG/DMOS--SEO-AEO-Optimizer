"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Trash2, AlertTriangle, AlertCircle, Info } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  heading?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  itemDetails?: {
    title: string;
    subtitle?: string;
    badge?: string;
    icon?: React.ReactNode;
  };
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  heading,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  itemDetails,
}) => {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getIconWrapperStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-900/60";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-900/60";
      default:
        return "bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-900/60";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={title}
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        {/* Warning Banner & Explanation */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${getIconWrapperStyles()}`}
          >
            {getIcon()}
          </div>
          <div className="space-y-1 min-w-0">
            {heading && (
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {heading}
              </h4>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Item Details Card (if provided) */}
        {itemDetails && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {itemDetails.icon ? (
                <div className="shrink-0">{itemDetails.icon}</div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                  {itemDetails.title ? itemDetails.title[0] : "?"}
                </div>
              )}
              <div className="truncate">
                <p className="font-semibold text-slate-900 dark:text-white truncate leading-tight">
                  {itemDetails.title}
                </p>
                {itemDetails.subtitle && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                    {itemDetails.subtitle}
                  </p>
                )}
              </div>
            </div>

            {itemDetails.badge && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                {itemDetails.badge}
              </span>
            )}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "warning" ? "primary" : variant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={variant === "danger" ? <Trash2 className="w-3.5 h-3.5" /> : undefined}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
