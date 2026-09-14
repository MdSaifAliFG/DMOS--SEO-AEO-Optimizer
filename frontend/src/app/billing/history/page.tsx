"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  ArrowLeft,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Loader2,
  Filter,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import { CreditTransaction } from "@/lib/types";

export default function CreditHistoryPage() {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCreditTransactions({ category, limit: 100 });
      setTransactions(data);
    } catch {
      // Handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category]);

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Subnav Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/billing"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/billing"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
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
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 shadow-2xs"
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
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Refresh Ledger"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs self-start">
        {[
          { id: "all", label: "All Transactions" },
          { id: "allocation", label: "Allocations" },
          { id: "usage", label: "Deductions & Usage" },
          { id: "purchase", label: "Top-Up Purchases" },
          { id: "rollover", label: "Rollovers" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === tab.id
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Operation / Description</th>
                <th className="px-6 py-3.5 text-right">Change Amount</th>
                <th className="px-6 py-3.5 text-right">Balance Before</th>
                <th className="px-6 py-3.5 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span>Loading immutable credit transactions...</span>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No credit transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            isPositive
                              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3 text-slate-500" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tx.operation}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm">
                          {tx.description}
                        </div>
                      </td>
                      <td
                        className={`px-6 py-3.5 text-right font-black font-mono ${
                          isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {isPositive ? `+${tx.amount}` : tx.amount}
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-500 font-mono">
                        {tx.balance_before.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-slate-900 dark:text-white font-mono">
                        {tx.balance_after.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}
