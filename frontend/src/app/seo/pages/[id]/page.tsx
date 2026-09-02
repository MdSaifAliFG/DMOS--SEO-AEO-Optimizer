"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Link2,
  ExternalLink,
  Clock,
  Shield,
  Tag,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SEOPageDetail } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function SeoPageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const pageId = resolvedParams.id;
  const [pageDetail, setPageDetail] = useState<SEOPageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        // Fetch projects to find the scan that contains this page
        const projData = await api.getProjects({ limit: 10 });
        let foundDetail: SEOPageDetail | null = null;

        for (const proj of projData.projects || []) {
          const scansData = await api.getProjectScans(proj.id, { limit: 5 });
          for (const scan of scansData.scans || []) {
            try {
              const detail = await api.getScanPageDetail(scan.id, pageId);
              if (detail && detail.id === pageId) {
                foundDetail = detail;
                break;
              }
            } catch (e) {
              // Ignore not found in this scan
            }
          }
          if (foundDetail) break;
        }

        setPageDetail(foundDetail);
      } catch (err: any) {
        error("Failed to load page detail", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="py-20 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          <p className="mt-3 text-xs">Loading page details...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!pageDetail) {
    return (
      <DashboardShell>
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not locate page audit record for ID: {pageId}
          </p>
          <Link href="/seo/pages">
            <Button size="sm" variant="primary">Back to Pages</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/seo/pages" className="text-slate-400 hover:text-slate-600">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h2 className="text-base font-bold text-slate-900 truncate max-w-xl">
                {pageDetail.title || pageDetail.url}
              </h2>
            </div>
            <a
              href={pageDetail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>{pageDetail.url}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                pageDetail.status_code === 200
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              HTTP {pageDetail.status_code}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                pageDetail.is_indexable
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {pageDetail.is_indexable ? "Indexable" : "Noindex"}
            </span>
          </div>
        </div>

        {/* Page Metadata Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200">
            <span className="text-[11px] text-slate-500 block">Crawl Depth</span>
            <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
              Level {pageDetail.crawl_depth}
            </span>
          </Card>

          <Card className="p-4 border-slate-200">
            <span className="text-[11px] text-slate-500 block">Response Time</span>
            <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
              {pageDetail.response_time ? `${(pageDetail.response_time * 1000).toFixed(0)} ms` : "—"}
            </span>
          </Card>

          <Card className="p-4 border-slate-200">
            <span className="text-[11px] text-slate-500 block">Word Count</span>
            <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
              {pageDetail.word_count || 0} words
            </span>
          </Card>

          <Card className="p-4 border-slate-200">
            <span className="text-[11px] text-slate-500 block">Issues Detected</span>
            <span className={`text-base font-bold font-mono mt-0.5 block ${
              (pageDetail.issues?.length || 0) > 0 ? "text-amber-600" : "text-emerald-600"
            }`}>
              {pageDetail.issues?.length || 0}
            </span>
          </Card>
        </div>

        {/* Meta & Tags Inspection */}
        <Card className="p-5 border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">HTML Tags & Directives</h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5 font-semibold">Title Tag</span>
              <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900">
                {pageDetail.title || <span className="italic text-slate-400">Missing Title Tag</span>}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5 font-semibold">Meta Description</span>
              <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900">
                {pageDetail.meta_description || <span className="italic text-slate-400">Missing Meta Description</span>}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5 font-semibold">Canonical URL</span>
              <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
                {pageDetail.canonical_url || <span className="italic text-slate-400">No Canonical Tag Specified</span>}
              </p>
            </div>
          </div>
        </Card>

        {/* Detected Issues on This Page */}
        {pageDetail.issues && pageDetail.issues.length > 0 && (
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Optimization Opportunities ({pageDetail.issues.length})</h3>
              <Link href="/seo/actions">
                <Button size="sm" variant="outline" className="text-xs">
                  View in Action Center →
                </Button>
              </Link>
            </div>
            <div className="space-y-2.5">
              {pageDetail.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{issue.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        issue.severity === "critical"
                          ? "bg-rose-100 text-rose-800"
                          : issue.severity === "high"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-slate-600">{issue.description}</p>
                  <div className="pt-1 text-[11px] text-blue-700 bg-blue-50/70 p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                    <span><strong>Recommendation:</strong> {issue.recommendation}</span>
                    {issue.category === "metadata" && (
                      <Link href="/seo/optimize/metadata" className="text-blue-600 hover:underline font-semibold ml-2 shrink-0">
                        Optimize Metadata →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
