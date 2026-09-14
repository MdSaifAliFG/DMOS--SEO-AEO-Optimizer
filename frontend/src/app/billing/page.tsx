"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Zap,
  Sparkles,
  Check,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  Globe,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
  History,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import { Plan, Subscription, CreditWallet, BillingSummary, UsageSummary } from "@/lib/types";
import { BuyCreditsModal } from "@/components/billing/CreditModals";
import { openRazorpayModal } from "@/lib/razorpay";

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [wallet, setWallet] = useState<CreditWallet | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch critical primary plan and summary data first
      const [plansData, summaryData] = await Promise.all([
        api.getBillingPlans().catch(() => []),
        api.getBillingSummary().catch(() => null),
      ]);

      if (plansData && plansData.length > 0) {
        setPlans(plansData);
      }
      if (summaryData) {
        setSummary(summaryData);
        setWallet({
          available_credits: summaryData.available_credits,
          monthly_credits: summaryData.monthly_credits,
          rollover_credits: summaryData.rollover_credits,
          purchased_credits: summaryData.purchased_credits,
          used_credits: summaryData.used_credits,
          reserved_credits: 0,
          last_allocation_at: summaryData.current_period_start,
          next_allocation_at: summaryData.next_billing_date,
        });
      }
      setIsLoading(false);

      // 2. Fetch secondary usage analytics and sub in background
      Promise.all([
        api.getCreditWallet().catch(() => null),
        api.getCurrentSubscription().catch(() => null),
        api.getUsageSummary().catch(() => null),
      ]).then(([walletData, subData, usageData]) => {
        if (walletData) setWallet(walletData);
        if (subData) setSubscription(subData);
        if (usageData) setUsageSummary(usageData);
      });
    } catch (err) {
      console.error("Failed to load billing data:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubscribe = async (planTier: string) => {
    setIsActionLoading(planTier);
    setMessage(null);
    try {
      const order = await api.createRazorpayOrder({
        plan_code: planTier,
        billing_cycle: billingCycle,
      });

      if (order.is_free) {
        setMessage({
          type: "success",
          text: order.message || `Free ${planTier} plan activated.`,
        });
        await loadData();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("credits_updated"));
        }
        setIsActionLoading(null);
        return;
      }

      await openRazorpayModal({
        order,
        onPaymentSuccess: async (payResponse) => {
          setIsActionLoading(planTier);
          try {
            const verification = await api.verifyRazorpayPayment(payResponse);
            if (verification.verified || verification.success) {
              setMessage({
                type: "success",
                text: verification.message || `Successfully subscribed to ${planTier.toUpperCase()} plan!`,
              });
              await loadData();
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("credits_updated"));
              }
            } else {
              setMessage({
                type: "error",
                text: verification.message || "Razorpay signature verification failed.",
              });
            }
          } catch (verErr: any) {
            setMessage({
              type: "error",
              text: verErr?.message || "Failed to verify Razorpay payment.",
            });
          } finally {
            setIsActionLoading(null);
          }
        },
        onError: (err) => {
          setMessage({
            type: "error",
            text: err?.message || "Payment cancelled or checkout encountered an error.",
          });
          setIsActionLoading(null);
        },
        onDismiss: () => {
          setIsActionLoading(null);
        },
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to initiate Razorpay checkout. Please check Razorpay keys in .env.",
      });
      setIsActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel renewal at the end of the current billing cycle?")) {
      return;
    }
    setIsActionLoading("cancel");
    try {
      await api.cancelSubscription("User requested cancellation via billing hub");
      setMessage({ type: "success", text: "Subscription will cancel at end of billing cycle." });
      await loadData();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to cancel subscription." });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsActionLoading("reactivate");
    try {
      await api.reactivateSubscription();
      setMessage({ type: "success", text: "Subscription successfully reactivated." });
      await loadData();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to reactivate subscription." });
    } finally {
      setIsActionLoading(null);
    }
  };

  const currentPlanTier = summary?.current_plan?.code || "free";
  const currentPlanName = summary?.current_plan?.name || "Free";

  const totalCreditsAllocated = (wallet?.monthly_credits || 0) + (wallet?.rollover_credits || 0) + (wallet?.purchased_credits || 0);
  const usedCredits = wallet?.used_credits || 0;
  const availableCredits = wallet?.available_credits || 0;
  const creditUsagePercent = totalCreditsAllocated > 0 ? Math.min(100, Math.round((usedCredits / totalCreditsAllocated) * 100)) : 0;

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Link
            href="/billing"
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 shadow-2xs"
          >
            Overview & Plans
          </Link>
          <Link
            href="/billing/usage"
            className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
          >
            Usage Analytics
          </Link>
          <Link
            href="/billing/history"
            className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
          >
            Credit Ledger
          </Link>
          <Link
            href="/billing/invoices"
            className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
          >
            Invoices
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBuyCreditsOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Top Up Credits</span>
          </button>
          <Link
            href="/billing/invoices"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoices & Receipts</span>
          </Link>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          )}
          <span className="flex-1 font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            &times;
          </button>
        </div>
      )}

      {/* Top Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Current Plan & Subscription */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Subscription</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {summary?.subscription_status || "Active"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {currentPlanName} Plan
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {summary?.price && summary.price > 0
                ? `$${summary.price.toFixed(2)}/month`
                : "Free forever plan"}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Next Billing Date:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {summary?.next_billing_date
                ? new Date(summary.next_billing_date).toLocaleDateString()
                : "Monthly renewal"}
            </span>
          </div>

          {summary?.cancel_at_period_end ? (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
              <span>Cancels at period end</span>
              <button
                type="button"
                onClick={handleReactivateSubscription}
                className="font-bold underline hover:text-amber-900 cursor-pointer"
              >
                Reactivate
              </button>
            </div>
          ) : currentPlanTier !== "free" ? (
            <button
              type="button"
              onClick={handleCancelSubscription}
              className="text-[11px] text-slate-400 hover:text-rose-500 text-left transition-colors cursor-pointer"
            >
              Cancel renewal at period end
            </button>
          ) : null}
        </div>

        {/* Card 2: Real-time Credit Wallet Balance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Credit Wallet Balance</span>
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {availableCredits.toLocaleString()}
              </h2>
              <span className="text-xs font-semibold text-slate-400">available</span>
            </div>

            {/* Wallet Breakdown Pills */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block">Monthly</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {wallet?.monthly_credits || 0}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block">Rollover</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {wallet?.rollover_credits || 0}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block">Purchased</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {wallet?.purchased_credits || 0}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBuyCreditsOpen(true)}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Top Up Credits</span>
          </button>
        </div>

        {/* Card 3: Monthly Entitlements & Resource Quotas */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resource Limits</span>
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" /> Projects
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {summary?.projects_used || 0} / {summary?.projects_limit || 1}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        ((summary?.projects_used || 0) / (summary?.projects_limit || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" /> Tracked Websites
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {summary?.websites_used || 0} / {summary?.websites_limit || 1}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        ((summary?.websites_used || 0) / (summary?.websites_limit || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Upgrade your tier to expand website tracking and monthly credit limits.
          </div>
        </div>
      </div>

      {/* Credit Consumption by Engine Card */}
      {usageSummary && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                30-Day Engine Credit Consumption
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total credits spent across SEO crawling, AI Answer queries, and Generative optimizations
              </p>
            </div>
            <Link
              href="/billing/usage"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              View detailed log →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60">
              <span className="text-[10px] text-sky-700 dark:text-sky-300 font-bold block uppercase tracking-wider">
                SEO Engine
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {usageSummary.seo_credits.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">Crawls & audits</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60">
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold block uppercase tracking-wider">
                AEO Engine
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {usageSummary.aeo_credits.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">Answer queries & citations</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block uppercase tracking-wider">
                GEO Engine
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {usageSummary.geo_credits.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">Generative optimization</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                Total Used
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {usageSummary.total_credits_used.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">Past 30 days</span>
            </div>
          </div>
        </div>
      )}

      {/* Plan Selection Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Upgrade or Change Subscription Tier
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch plans anytime with prorated billing. All upgrades take effect immediately.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs self-start sm:self-auto">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-[#1D63FF] text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Annual</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* 6 Plans Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlanTier.toLowerCase() === p.code.toLowerCase();
            const price =
              billingCycle === "annual"
                ? p.price_monthly * 0.8
                : p.price_monthly;
            const isPopular = p.is_popular || p.code === "growth";

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all ${
                  isCurrent
                    ? "bg-blue-50/40 dark:bg-blue-950/20 border-2 border-blue-600 dark:border-blue-500 shadow-md"
                    : isPopular
                      ? "bg-white dark:bg-[#0c1424] border-2 border-blue-400 dark:border-blue-600 shadow-md"
                      : "bg-white dark:bg-[#0b101b] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                }`}
              >
                {isPopular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1D63FF] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                    ★ Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                    Current Plan
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                        ${price === 0 ? "0" : price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">Credits / mo</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {p.monthly_credits.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">Rollover limit</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {p.max_rollover_credits > 0 ? `${p.max_rollover_credits.toLocaleString()}` : "None"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">Projects</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {p.max_projects}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">Team seats</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {p.max_team_members}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs text-center cursor-not-allowed"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubscribe(p.code)}
                      disabled={isActionLoading === p.code}
                      className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isPopular
                          ? "bg-[#1D63FF] hover:bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : p.code === "free"
                            ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                            : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-2xs"
                      }`}
                    >
                      {isActionLoading === p.code ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <span>Select {p.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buy Credits Modal */}
      <BuyCreditsModal
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
        onSuccess={() => loadData()}
      />
      </div>
    </DashboardShell>
  );
}
