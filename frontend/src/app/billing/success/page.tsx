"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Zap, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import { BillingSummary } from "@/lib/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const checkoutType = searchParams.get("type");
  const [summary, setSummary] = useState<BillingSummary | null>(null);

  useEffect(() => {
    // Refresh billing summary to capture newly allocated credits / upgraded plan
    api
      .getBillingSummary()
      .then((data) => setSummary(data))
      .catch(() => {});
  }, []);

  return (
    <DashboardShell>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-600/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Payment Confirmed!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {checkoutType === "credits"
              ? "Your credit top-up has been added to your wallet balance immediately."
              : "Your subscription plan is active. All quotas and entitlements are updated."}
          </p>
        </div>

        {summary && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Active Plan:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {summary.current_plan?.name || "Growth"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Available Credits:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
                {summary.available_credits.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          <Link href="/billing" className="block">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
            >
              <span>Go to Billing Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href="/overview" className="block">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Return to Platform Overview
            </button>
          </Link>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
