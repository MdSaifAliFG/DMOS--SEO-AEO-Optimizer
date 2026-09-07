"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  FileText,
  Boxes,
  Quote,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GeoProject, GeoOptimizeResult } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoCommercialOptimizationPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [pricingUrl, setPricingUrl] = useState("");
  const [productTier, setProductTier] = useState("Enterprise / Pro");
  const [result, setResult] = useState<GeoOptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.getGeoProjects();
        const projs = res.projects || [];
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0].id);
          setPricingUrl(`https://${projs[0].domain}/pricing`);
        }
      } catch (err) {
        error("Failed to load projects.");
      }
    };
    loadProjects();
  }, []);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      error("Please select a project.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.optimizeGeoCommercial({
        project_id: selectedProjectId,
        pricing_page_url: pricingUrl,
        product_tier: productTier,
      });
      setResult(res);
      success("Commercial readiness blueprint generated!");
    } catch (err) {
      error("Failed to evaluate commercial readiness.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Module Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Link
            href="/geo/optimization/content"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Content Extractability
          </Link>
          <Link
            href="/geo/optimization/entities"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Boxes className="w-3.5 h-3.5" />
            Entity Schema
          </Link>
          <Link
            href="/geo/optimization/citations"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
            Citation Sourcing
          </Link>
          <Link
            href="/geo/optimization/comparisons"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Scale className="w-3.5 h-3.5" />
            Comparison Matrices
          </Link>
          <Link
            href="/geo/optimization/commercial"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40 shadow-xs"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Commercial Intent
          </Link>
        </div>

        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 text-white shadow-md border border-amber-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30">
                <DollarSign className="w-5 h-5 text-amber-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">GEO Commercial Readiness Studio</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/20">
                Buyer Intent Optimization
              </span>
            </div>
            <p className="text-xs text-amber-200/80 max-w-2xl">
              Ensure generative models accurately answer pricing, tier differences, and free-trial queries without fabricating costs or misrepresenting features.
            </p>
          </div>

          {projects.length > 0 && (
            <select
              aria-label="Select GEO Project"
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const p = projects.find((x) => x.id === e.target.value);
                if (p) setPricingUrl(`https://${p.domain}/pricing`);
              }}
              className="text-xs rounded-lg border border-amber-700/60 bg-slate-900 text-slate-100 px-3 py-1.5 font-medium shadow-sm self-start sm:self-auto"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand_name || p.name} ({p.domain})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Form and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <form onSubmit={handleOptimize} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pricing Page URL
                </label>
                <input
                  type="url"
                  value={pricingUrl}
                  onChange={(e) => setPricingUrl(e.target.value)}
                  placeholder="https://example.com/pricing"
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Product Tier or Service
                </label>
                <input
                  type="text"
                  value={productTier}
                  onChange={(e) => setProductTier(e.target.value)}
                  placeholder="e.g. Starter, Professional, Enterprise"
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Analyzing Commercial Readiness...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Optimize Commercial Readiness
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-5 border-slate-200 dark:border-slate-800">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <Tag className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-1" />
                <p className="text-xs">
                  Analyze pricing disclosures, FAQ structure, and commercial buyer intent to ensure generative systems recommend your product during evaluation stages.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {result.title}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Impact: {result.expected_impact}
                  </span>
                </div>

                {result.commercial_readiness_score !== undefined && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Commercial Readiness Score
                    </span>
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {result.commercial_readiness_score}/100
                    </span>
                  </div>
                )}

                {result.missing_facts?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      Disclosed Information Gaps
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {result.missing_facts.map((fact, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommended_structure?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Recommended Pricing FAQ Additions
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {result.recommended_structure.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
