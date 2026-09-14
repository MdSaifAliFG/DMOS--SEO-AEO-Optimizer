"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";

interface FeatureGateProps {
  requiredPlan: "starter" | "growth" | "pro" | "business" | "agency";
  currentPlanTier?: string;
  featureName: string;
  description?: string;
  children: React.ReactNode;
}

const TIER_ORDER: Record<string, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  pro: 3,
  business: 4,
  agency: 5,
};

export const FeatureGate: React.FC<FeatureGateProps> = ({
  requiredPlan,
  currentPlanTier = "free",
  featureName,
  description,
  children,
}) => {
  const currentRank = TIER_ORDER[currentPlanTier.toLowerCase()] ?? 0;
  const requiredRank = TIER_ORDER[requiredPlan.toLowerCase()] ?? 1;

  const isUnlocked = currentRank >= requiredRank;

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-8 text-center backdrop-blur-xs">
      {/* Blurred background content */}
      <div className="filter blur-sm pointer-events-none opacity-40 select-none">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xs">
        <div className="max-w-md bg-white dark:bg-[#0c1424] border border-blue-200 dark:border-blue-900/80 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <Lock className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Available on {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Plan & above
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Unlock {featureName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {description ||
                `Upgrade to the ${requiredPlan} tier to unlock ${featureName}, elevated monthly credit allocations, and prioritized processing.`}
            </p>
          </div>

          <Link href="/billing" className="block">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
            >
              <span>Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
