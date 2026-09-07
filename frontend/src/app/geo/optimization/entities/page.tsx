"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  FileText,
  Quote,
  Scale,
  DollarSign,
  Copy,
  CheckCircle2,
  Sparkles,
  Code2,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GeoProject, GeoOptimizeResult } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoEntityOptimizationPage() {
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [entityName, setEntityName] = useState("");
  const [entityType, setEntityType] = useState("Organization");
  const [result, setResult] = useState<GeoOptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.getGeoProjects();
        const projs = res.projects || [];
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0].id);
          setEntityName(projs[0].brand_name || projs[0].name);
        }
      } catch (err) {
        error("Failed to load projects.");
      }
    };
    loadProjects();
  }, []);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !entityName.trim()) {
      error("Entity name and project are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.optimizeGeoEntity({
        project_id: selectedProjectId,
        entity_name: entityName,
        entity_type: entityType,
      });
      setResult(res);
      success("Entity schema blueprint generated!");
    } catch (err) {
      error("Failed to optimize entity schema.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40 shadow-xs"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                <Boxes className="w-5 h-5 text-amber-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">GEO Entity & Schema Studio</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/20">
                Knowledge Graph Anchors
              </span>
            </div>
            <p className="text-xs text-amber-200/80 max-w-2xl">
              Construct authoritative JSON-LD schemas and unambiguous knowledge graph anchors to establish entity clarity across LLM training corpora and live search indexes.
            </p>
          </div>

          {projects.length > 0 && (
            <select
              aria-label="Select GEO Project"
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const p = projects.find((x) => x.id === e.target.value);
                if (p) setEntityName(p.brand_name || p.name);
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
                  Entity Name / Brand Term
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="e.g. Acme Corp, DMOS Platform"
                  required
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Schema Entity Type
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="Organization">Organization</option>
                  <option value="Product">Product</option>
                  <option value="SoftwareApplication">SoftwareApplication</option>
                  <option value="Service">Service</option>
                  <option value="Person">Person / Founder</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Generating Schema Blueprint...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Build Entity Schema
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Results Output */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <Code2 className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-1" />
                <p className="text-xs">
                  Enter an entity name and schema type to generate verified JSON-LD markup and sameAs authority recommendations.
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

                {result.schema_markup && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-amber-500" />
                        JSON-LD Schema Markup
                      </span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(result.schema_markup, null, 2))}
                        className="text-xs text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copied ? "Copied!" : "Copy JSON"}
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-56">
                      {JSON.stringify(result.schema_markup, null, 2)}
                    </pre>
                  </div>
                )}

                {result.missing_facts?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Recommended Properties to Populate
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {result.missing_facts.map((fact, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">•</span> {fact}
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
