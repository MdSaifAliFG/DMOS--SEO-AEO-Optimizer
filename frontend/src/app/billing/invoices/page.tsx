"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  ExternalLink,
  Download,
  Loader2,
  RefreshCw,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { api } from "@/lib/api-client";
import { Invoice } from "@/lib/types";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getInvoices(50);
      setInvoices(data);
    } catch {
      // Handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
              className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Credit Ledger
            </Link>
            <Link
              href="/billing/invoices"
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 shadow-2xs"
            >
              Invoices
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Refresh Invoices"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-xs overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Payment Records & Invoices
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Download PDF receipts and view Stripe hosted billing records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span>Loading invoice history...</span>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p>No invoices generated yet.</p>
                    <span className="text-[11px] text-slate-500">
                      Invoices will appear here automatically when monthly subscriptions renew or credit packs are purchased.
                    </span>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-bold font-mono text-slate-900 dark:text-white">
                      {inv.invoice_number || `INV-${inv.id.slice(0, 8)}`}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5 font-black text-slate-900 dark:text-white font-mono">
                      ${inv.amount.toFixed(2)} {inv.currency.toUpperCase()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-2">
                      {inv.invoice_url && (
                        <a
                          href={inv.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </a>
                      )}
                      {inv.pdf_url && (
                        <a
                          href={inv.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}
