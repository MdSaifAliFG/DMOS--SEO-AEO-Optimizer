"use client";

import React, { useState, useEffect } from "react";
import { Zap, X, Shield, ArrowRight, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api-client";
import { openRazorpayModal } from "@/lib/razorpay";

interface CreditPack {
  credits: number;
  price: number;
  name: string;
  description: string;
  price_id?: string | null;
  popular?: boolean;
}

const DEFAULT_PACKS: CreditPack[] = [
  { credits: 250, price: 2.99, name: "250 Credits Pack", description: "Quick top-up for a small crawl or audit run" },
  { credits: 500, price: 4.49, name: "500 Credits Pack", description: "Ideal for deeper site crawl or prompt exploration" },
  { credits: 1000, price: 7.99, name: "1,000 Credits Pack", description: "Most popular top-up for multi-engine comparisons", popular: true },
  { credits: 2500, price: 17.99, name: "2,500 Credits Pack", description: "Best for high-volume audit sweeps and batch queries" },
  { credits: 5000, price: 29.99, name: "5,000 Credits Pack", description: "Maximum value pack for agency workloads" },
];

export const BuyCreditsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [packs, setPacks] = useState<CreditPack[]>(DEFAULT_PACKS);
  const [selectedPack, setSelectedPack] = useState<number>(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      api
        .getCreditPacks()
        .then((data) => {
          if (data && data.length > 0) {
            setPacks(
              data.map((p) => ({
                ...p,
                popular: p.credits === 1000,
              }))
            );
          }
        })
        .catch(() => {
          // Use default fallback
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const order = await api.createRazorpayOrder({
        pack_credits: selectedPack,
      });

      if (!order || !order.order_id) {
        throw new Error("Unable to create Razorpay order for this credit pack.");
      }

      await openRazorpayModal({
        order,
        onPaymentSuccess: async (payResponse) => {
          setIsLoading(true);
          try {
            const verification = await api.verifyRazorpayPayment(payResponse);
            if (verification.verified || verification.success) {
              setIsSuccess(true);
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("credits_updated"));
              }
              setTimeout(() => {
                onSuccess?.();
                onClose();
              }, 1200);
            } else {
              setErrorMsg(verification.message || "Payment verification failed.");
            }
          } catch (verErr: any) {
            setErrorMsg(verErr?.message || "Failed to verify Razorpay payment.");
          } finally {
            setIsLoading(false);
          }
        },
        onError: (err) => {
          setErrorMsg(err?.message || "Payment checkout cancelled or failed.");
          setIsLoading(false);
        },
        onDismiss: () => {
          setIsLoading(false);
        },
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to initialize Razorpay checkout. Please check Razorpay keys in .env.");
      setIsLoading(false);
    }
  };

  const packObj = packs.find((p) => p.credits === selectedPack) || packs[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Buy Credit Top-Up Pack</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">One-time purchase • Credits never expire</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Pack Selection Radio List */}
          <div className="space-y-2.5">
            {packs.map((p) => {
              const isSelected = selectedPack === p.credits;
              return (
                <div
                  key={p.credits}
                  onClick={() => setSelectedPack(p.credits)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                          {p.credits.toLocaleString()} Credits
                        </span>
                        {p.popular && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold uppercase">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      ${p.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ${(p.price / p.credits).toFixed(3)}/credit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>How top-up credits work</span>
            </div>
            <p>
              Top-up credits are added to your balance immediately and are consumed only after your monthly subscription and rollover balance are depleted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-[#1D63FF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Redirecting to Checkout...</span>
              </>
            ) : (
              <>
                <span>Checkout (${packObj.price.toFixed(2)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const InsufficientCreditsModal: React.FC<{
  isOpen: boolean;
  requiredCredits: number;
  availableCredits: number;
  onClose: () => void;
  onOpenTopUp: () => void;
}> = ({ isOpen, requiredCredits, availableCredits, onClose, onOpenTopUp }) => {
  if (!isOpen) return null;

  const deficit = Math.max(0, requiredCredits - availableCredits);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0c1424] border border-amber-300 dark:border-amber-900/80 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800">
          <Zap className="w-6 h-6 fill-amber-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Insufficient Credits
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This operation requires <strong className="text-slate-900 dark:text-white font-mono">{requiredCredits} credits</strong>, but your wallet currently has <strong className="text-slate-900 dark:text-white font-mono">{availableCredits} credits</strong>.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between font-mono">
          <span className="text-slate-500">Credits needed:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">+{deficit} credits</span>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTopUp();
            }}
            className="w-full py-2.5 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Top Up Credits Now</span>
          </button>
          <a
            href="/billing"
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            Upgrade Subscription Plan
          </a>
        </div>
      </div>
    </div>
  );
};
