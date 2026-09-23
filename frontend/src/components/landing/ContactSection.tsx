"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  Building,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/api-client";

interface FormData {
  name: string;
  email: string;
  subject: string;
  company: string;
  phone: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  subject: "General Inquiry",
  company: "",
  phone: "",
  message: "",
};

const TOPICS = [
  "General Inquiry",
  "Enterprise AEO & GEO Demo",
  "Custom Crawler Architecture",
  "Pricing & Volume Upgrades",
  "Technical Support & Integrations",
  "Partnership & Affiliate",
];

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validation
    if (!form.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (form.message.trim().length < 10) {
      setErrorMsg("Please enter a message with at least 10 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
        company: form.company.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });

      setSuccessMsg(
        res.message ||
          "Thank you! Your message has been received. Our team will review your inquiry and follow up within 24 business hours."
      );
      setForm(INITIAL_FORM);
    } catch (err: any) {
      const detail =
        err?.message || "Failed to deliver message. Please check your network and try again.";
      setErrorMsg(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-14 sm:py-20 md:py-28 2xl:py-36 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-[#0b1220] dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 overflow-hidden w-full max-w-full"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 sm:left-1/4 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/2 sm:right-1/4 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 dark:bg-purple-600/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1680px] 3xl:max-w-[1920px] mx-auto px-3.5 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs 2xl:text-sm font-semibold tracking-wide uppercase">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Direct Communication</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight px-2">
            Have Questions? Let&apos;s Talk Search &amp; AI
          </h2>

          <p className="text-xs sm:text-sm md:text-base 2xl:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto px-2">
            Whether you need custom enterprise crawling, AI answer engine citation tracking, or
            want to explore how Zobay Rank powers organic growth, our specialists are ready.
          </p>
        </div>

        {/* Two-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 2xl:gap-12 items-stretch w-full">
          {/* Left Column: Context & Contact Information Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-6 w-full">
            <div className="space-y-3.5 sm:space-y-5">
              {/* Highlight Card 1 */}
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-all">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Guaranteed 24-Hour Response
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Every inquiry is dispatched directly to our core engineering and strategy
                      teams. No automated dead-ends.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight Card 2 */}
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 transition-all">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Custom Crawl &amp; GEO Architecture
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Manage large-scale multi-domain setups, custom user-agent rules, and
                      multi-engine AI tracking tailored to your vertical.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight Card 3 */}
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/40 transition-all">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Enterprise Privacy &amp; SLAs
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      SOC 2-ready hosting, dedicated Brevo transactional email conduits, and
                      strict tenant data segregation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Contact Details Pill */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 text-xs sm:text-sm space-y-2 w-full">
              <div className="flex items-center gap-2 sm:gap-2.5 text-slate-700 dark:text-slate-300 min-w-0">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">
                  Official Support:{" "}
                  <a
                    href="mailto:support@zobay.in"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-block"
                  >
                    support@zobay.in
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-slate-700 dark:text-slate-300 min-w-0">
                <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">Zobay Rank Global Intelligence Headquarters</span>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphic Interactive Form */}
          <div className="lg:col-span-7 w-full">
            <div className="p-4 sm:p-7 md:p-8 lg:p-9 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 relative w-full">
              {/* Success Message View */}
              {successMsg ? (
                <div className="py-8 sm:py-12 md:py-16 text-center space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-300 px-2 sm:px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 max-w-md mx-auto">
                    <h3 className="text-lg sm:text-2xl font-bold text-slate-950 dark:text-white">
                      Message Dispatched!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {successMsg}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccessMsg(null)}
                    className="w-full sm:w-auto mt-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-md cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Active Form View */
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 w-full">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Send Us an Inquiry
                    </h3>
                  </div>

                  {/* Error Notification Alert */}
                  {errorMsg && (
                    <div className="p-3 sm:p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name & Email Row (Stacks on mobile, 2 columns on tablet+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-3.5 py-2.5 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. jane@company.com"
                        className="w-full px-3.5 py-2.5 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Topic Dropdown & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Inquiry Topic
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer truncate"
                      >
                        {TOPICS.map((topic) => (
                          <option key={topic} value={topic} className="dark:bg-slate-900">
                            {topic}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="contact-company"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Company / Domain (Optional)
                      </label>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="e.g. company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements, existing site setup, or any questions..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[95px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[46px] flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    By submitting, you agree to our{" "}
                    <a href="/terms" className="text-blue-500 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy-policy" className="text-blue-500 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
