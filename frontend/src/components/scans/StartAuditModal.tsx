"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Sparkles, Shield, Zap, Globe, Info } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Project, ScanType } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export interface StartAuditModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onScanCreated?: (scanId: string) => void;
}

export const StartAuditModal: React.FC<StartAuditModalProps> = ({
  project,
  isOpen,
  onClose,
  onScanCreated,
}) => {
  const router = useRouter();
  const { success, error } = useToast();
  const [scanType, setScanType] = useState<ScanType>("full_audit");
  const [customUrl, setCustomUrl] = useState(`https://${project.domain}`);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const scan = await api.createScan(project.id, {
        scan_type: scanType,
        target_url: customUrl.trim() || undefined,
      });

      success("Audit Scan Dispatched", `Scan lifecycle started for ${project.domain}`);
      onClose();
      if (onScanCreated) {
        onScanCreated(scan.id);
      } else {
        router.push(`/seo/projects/${project.id}?scanId=${scan.id}`);
      }
    } catch (err: any) {
      error("Failed to start scan", err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Website Audit Scan"
      description={`Initialize scan lifecycle engine for ${project.domain}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Phase 3 info notice */}
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Phase 3 SEO Engine:</strong> Runs asynchronous BFS crawling, respects robots.txt/sitemaps, inspects on-page HTML tags, evaluates 20+ technical rules, and computes deterministic SEO health scores.
          </p>
        </div>

        {/* Scan Type Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Select Audit Profile
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => setScanType("full_audit")}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                scanType === "full_audit"
                  ? "bg-blue-50/80 border-blue-500 text-slate-900 shadow-xs ring-1 ring-blue-500"
                  : "bg-slate-50/50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Full Website Technical Audit
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Complete BFS crawl, robots.txt, XML sitemap verification, and metadata inspection.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScanType("technical_seo")}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                scanType === "technical_seo"
                  ? "bg-blue-50/80 border-blue-500 text-slate-900 shadow-xs ring-1 ring-blue-500"
                  : "bg-slate-50/50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Technical SEO & Indexability
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Focus on HTTP status codes, canonicals, robots meta tags, and security headers.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScanType("quick_scan")}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                scanType === "quick_scan"
                  ? "bg-blue-50/80 border-blue-500 text-slate-900 shadow-xs ring-1 ring-blue-500"
                  : "bg-slate-50/50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Zap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Homepage Quick Audit
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Single-page high-speed scan for immediate health diagnostics.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Target URL Override */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Target URL / Entrypoint
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Start Audit
          </Button>
        </div>
      </form>
    </Modal>
  );
};
