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
        router.push(`/projects/${project.id}/audit?scanId=${scan.id}`);
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
        {/* Phase 1 disclaimer notice */}
        <div className="p-3.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-xs text-primary-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Phase 1 Engine:</strong> Demonstrates the live scan orchestration lifecycle (queued → initializing → crawling → analyzing → completed) without generating mock SEO scores.
          </p>
        </div>

        {/* Scan Type Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Audit Profile
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => setScanType("full_audit")}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                scanType === "full_audit"
                  ? "bg-primary-600/15 border-primary-500 text-slate-100 shadow-md"
                  : "bg-surface-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-surface-900"
              }`}
            >
              <Sparkles className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Full Website Audit
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Complete crawl lifecycle, DNS verification, and DOM hierarchy inspection.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScanType("technical_seo")}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                scanType === "technical_seo"
                  ? "bg-primary-600/15 border-primary-500 text-slate-100 shadow-md"
                  : "bg-surface-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-surface-900"
              }`}
            >
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Technical Architecture Crawl
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Focus on HTTP status codes, robots directives, and canonical tags.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Target URL */}
        <Input
          label="Target Entry URL"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          leftIcon={<Globe className="w-4 h-4" />}
          helperText="Starting URL for the crawler orchestration pipeline"
          required
        />

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Launch Scan Lifecycle
          </Button>
        </div>
      </form>
    </Modal>
  );
};
