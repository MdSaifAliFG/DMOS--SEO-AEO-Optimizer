"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    try {
      if (onConfirm) {
        onConfirm();
      } else {
        logout();
        window.location.href = "/login";
      }
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoggingOut ? () => {} : onClose}
      title="Confirm Sign Out"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1" data-testid="logout-confirmation-modal">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400 shadow-xs">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Are you sure you want to log out?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You will be signed out of your active session. You will need to sign back in with your credentials to access your SEO, AEO, and GEO projects.
            </p>
          </div>
        </div>

        {user && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                {user.name ? user.name[0].toUpperCase() : <UserIcon className="w-3 h-3" />}
              </div>
              <div className="truncate">
                {user.name && (
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate leading-none mb-0.5">
                    {user.name}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
              Active
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoggingOut}
            data-testid="cancel-logout-btn"
          >
            Stay Signed In
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleConfirmLogout}
            isLoading={isLoggingOut}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            data-testid="confirm-logout-btn"
          >
            Log Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};
