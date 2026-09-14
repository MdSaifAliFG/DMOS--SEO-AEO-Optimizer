import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function BillingCancelledPage() {
  return (
    <DashboardShell>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Checkout Cancelled
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No payment was processed and no charges were made to your account. Your previous subscription and credit balances remain unchanged.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 text-left">
          <Shield className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Need help choosing the right plan? Contact support anytime.</span>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link href="/billing" className="block">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
            >
              <span>Return to Billing Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href="/overview" className="block">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Back to Overview
            </button>
          </Link>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}
