"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Project, ScanType } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { cleanDomain } from "@/lib/utils";

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
  const [customUrl, setCustomUrl] = useState(`https://${cleanDomain(project.domain)}`);
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

  const auditProfiles = [
    {
      id: "full_audit" as ScanType,
      title: "Full Website Audit",
      badge: "Recommended",
      badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Sparkles,
      iconBg: "bg-blue-600 text-white",
      description: "Complete BFS crawl, robots.txt, sitemaps, and full page metadata.",
      scope: "Up to 100 pages • Depth 5",
    },
    {
      id: "technical_seo" as ScanType,
      title: "Technical & Index",
      badge: "Deep Check",
      badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: ShieldCheck,
      iconBg: "bg-emerald-600 text-white",
      description: "HTTP status, canonicals, robots directives, headers, and schema.",
      scope: "Pillar diagnostics • Security",
    },
    {
      id: "quick_scan" as ScanType,
      title: "Homepage Quick",
      badge: "Fast (<3s)",
      badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
      icon: Zap,
      iconBg: "bg-purple-600 text-white",
      description: "Single-page high-speed scan for immediate health diagnostics.",
      scope: "Direct home analysis",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Website Audit Scan"
      description={`Initialize the deterministic crawl and SEO scoring engine for ${cleanDomain(project.domain)}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Compact Engine Status Banner */}
        <div className="px-3.5 py-2 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-900 text-[11.5px]">
              Autonomous SEO Engine:
            </span>
            <span className="text-slate-600 text-[11px] hidden sm:inline">
              BFS Crawl • 20+ Technical Rules • Deterministic Scoring
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-md shrink-0">
            Engine Ready
          </span>
        </div>

        {/* Audit Profile Selection (3-Column Grid) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Select Audit Profile
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Click to select profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {auditProfiles.map((profile) => {
              const isSelected = scanType === profile.id;
              const IconComp = profile.icon;

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setScanType(profile.id)}
                  className={`group relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-150 ${
                    isSelected
                      ? "bg-blue-50/80 border-blue-600 shadow-xs ring-2 ring-blue-600/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                          isSelected ? profile.iconBg : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md border ${profile.badgeClass}`}>
                        {profile.badge}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 tracking-tight">
                        {profile.title}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span className="truncate">{profile.scope}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300 bg-white group-hover:border-slate-400"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target URL Configuration */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Target Website URL / Entrypoint
            </label>
            <span className="text-[10px] text-slate-400">Root entrypoint for crawler</span>
          </div>
          <div className="relative rounded-xl shadow-2xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-3"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="px-5 shadow-xs text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Audit Scan
          </Button>
        </div>
      </form>
    </Modal>
  );
};
