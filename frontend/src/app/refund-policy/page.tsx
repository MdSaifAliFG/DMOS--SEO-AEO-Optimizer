"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { RefreshCw, ArrowLeft, CheckCircle2, Clock, DollarSign, HelpCircle, Mail, ShieldAlert } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <LandingNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Refund &amp; Cancellation Policy
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Effective Date: January 1, 2026 • Last Updated: September 12, 2026
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-10 space-y-10 text-sm text-slate-300 leading-relaxed backdrop-blur-md">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p>
              <strong>14-Day Satisfaction Guarantee:</strong> We stand by the precision of our deterministic SEO, AEO, and GEO intelligence suites. If you are not satisfied with our platform within your first 14 days of subscription, you are entitled to a full, hassle-free refund.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              1. 14-Day Money-Back Guarantee
            </h2>
            <p>
              For new subscribers enrolling in our Monthly or Annual SaaS plans (Starter, Professional, or Enterprise tiers), we offer a 14-calendar-day refund window commencing on the date of your initial transaction.
            </p>
            <p>
              If our platform fails to meet your technical requirements or crawler expectations, submit a request to our billing desk within this period for a 100% refund.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              2. Subscription Renewals &amp; Cancellation
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                <strong className="text-slate-200">Self-Serve Cancellation:</strong> You may cancel your subscription at any time directly through your Workspace Profile or by contacting support.
              </li>
              <li>
                <strong className="text-slate-200">Pre-Renewal Reminders:</strong> For annual enterprise plans, automated renewal notifications are dispatched 14 days prior to the billing date.
              </li>
              <li>
                <strong className="text-slate-200">Mid-Cycle Cancellation:</strong> When you cancel before your monthly billing cycle concludes, your account remains fully active until the end of the paid term, with no subsequent charges.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              3. Refund Eligibility &amp; Exceptions
            </h2>
            <p>Refunds are granted under standard operational criteria with the following fair-use limitations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Accounts found in violation of our Acceptable Use Policy (e.g., abusive scanning or unauthorized attacks) are ineligible for refunds.</li>
              <li>Custom enterprise infrastructure provisioning or dedicated high-frequency proxy pools that have been heavily consumed may be refunded pro-rata.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              4. How to Request a Refund
            </h2>
            <p>
              To initiate a refund or discuss your billing statement, please contact our billing team with your registered workspace email and invoice ID:
            </p>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10 text-xs space-y-1.5 text-slate-300">
              <p><strong>Billing Desk:</strong> <a href="mailto:dm@fortunehestia.in" className="text-blue-400 hover:underline">dm@fortunehestia.in</a></p>
              <p><strong>Processing Window:</strong> Approved refunds are credited back to your original payment method within <strong>5–7 business days</strong>.</p>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
