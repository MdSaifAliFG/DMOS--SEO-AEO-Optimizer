"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  Globe,
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Settings,
  Cpu,
  Layers,
  Award,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { GeoProject, GeoBrandProfile } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function GeoProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<GeoProject | null>(null);
  const [brandProfile, setBrandProfile] = useState<GeoBrandProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "brand" | "engines" | "settings">("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Editable brand profile form state
  const [brandName, setBrandName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [industry, setIndustry] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [productsStr, setProductsStr] = useState("");
  const [servicesStr, setServicesStr] = useState("");
  const [useCasesStr, setUseCasesStr] = useState("");
  const [competitorsStr, setCompetitorsStr] = useState("");

  const { success, error } = useToast();

  const loadProject = async () => {
    setIsLoading(true);
    try {
      const proj = await api.getGeoProject(projectId);
      setProject(proj);
      const bp = await api.getGeoBrandProfile(projectId);
      setBrandProfile(bp);

      if (bp) {
        setBrandName(bp.brand_name || "");
        setLegalName(bp.legal_name || "");
        setIndustry(bp.industry || "");
        setCategory(bp.category || "");
        setShortDescription(bp.short_description || "");
        setLongDescription(bp.long_description || "");
        setProductsStr((bp.products || []).join(", "));
        setServicesStr((bp.services || []).join(", "));
        setUseCasesStr((bp.use_cases || []).join(", "));
        setCompetitorsStr((bp.competitors || []).join(", "));
      }
    } catch (err) {
      error("Failed to load project details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  const handleSaveBrandProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateGeoBrandProfile(projectId, {
        brand_name: brandName,
        legal_name: legalName,
        industry,
        category,
        short_description: shortDescription,
        long_description: longDescription,
        products: productsStr.split(",").map((s) => s.trim()).filter(Boolean),
        services: servicesStr.split(",").map((s) => s.trim()).filter(Boolean),
        use_cases: useCasesStr.split(",").map((s) => s.trim()).filter(Boolean),
        competitors: competitorsStr.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setBrandProfile(updated);
      success("Brand Knowledge Profile updated successfully.");
    } catch (err) {
      error("Failed to update Brand Profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="p-8 text-center">
          <p className="text-sm text-slate-500">Project not found.</p>
          <Link href="/geo/projects" className="text-xs text-amber-600 underline mt-2 block">
            Return to Projects
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/geo/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>
          <Link href={`/geo/dashboard?project_id=${project.id}`}>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              Open Dashboard
            </Button>
          </Link>
        </div>

        {/* Project Header Banner */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60">
                {project.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              https://{project.domain}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">GEO Score</span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {project.geo_score !== null && project.geo_score !== undefined ? project.geo_score : "—"}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
          {[
            { key: "overview", label: "Overview", icon: Layers },
            { key: "brand", label: "Canonical Brand Profile", icon: Building2 },
            { key: "engines", label: "Engine Connections", icon: Cpu },
            { key: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  active
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Brand Identity</h3>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{project.brand_name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{project.description || "No description set."}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                Industry: <span className="text-slate-700 dark:text-slate-200 font-medium">{project.industry || "General"}</span>
              </div>
            </Card>

            <Card className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Products & Services</h3>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Products:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {project.products?.length > 0 ? project.products.join(", ") : "None specified"}
                </p>
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Services:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {project.services?.length > 0 ? project.services.join(", ") : "None specified"}
                </p>
              </div>
            </Card>

            <Card className="p-5 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tracked Competitors</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.competitors?.map((c, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {typeof c === "object" ? c.name : c}
                  </span>
                ))}
                {(!project.competitors || project.competitors.length === 0) && (
                  <p className="text-xs text-slate-400">No competitors configured.</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Canonical Brand Profile */}
        {activeTab === "brand" && (
          <Card className="p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Canonical GEO Brand Profile</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                This canonical profile anchors AI models to consistent facts about your products, pricing, and company.
              </p>
            </div>

            <form onSubmit={handleSaveBrandProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Legal Corporate Name</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g., Brand Inc."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Enterprise B2B SaaS"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Market Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Search Marketing Intelligence"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Short Description (40-60 words)</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Crisp one-paragraph summary of what the brand delivers..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Products (comma separated)</label>
                <input
                  type="text"
                  value={productsStr}
                  onChange={(e) => setProductsStr(e.target.value)}
                  placeholder="e.g., GEO Optimizer, SEO Sensing Studio, AEO Radar"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Services (comma separated)</label>
                <input
                  type="text"
                  value={servicesStr}
                  onChange={(e) => setServicesStr(e.target.value)}
                  placeholder="e.g., Enterprise Audits, Custom Knowledge Graphing"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Key Use Cases (comma separated)</label>
                <input
                  type="text"
                  value={useCasesStr}
                  onChange={(e) => setUseCasesStr(e.target.value)}
                  placeholder="e.g., AI citation tracking, competitor intelligence"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Save Brand Profile
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Tab 3: Engines */}
        {activeTab === "engines" && (
          <Card className="p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Generative Engine Provider Status</h3>
            <p className="text-xs text-slate-400">
              Providers configured via environment variables. When keys are missing, the engine displays &quot;Not Connected&quot; without returning fake data.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { name: "OpenAI Search & GPT-4o", env: "OPENAI_API_KEY", desc: "Used for ChatGPT Search and real-time retrieval." },
                { name: "Perplexity AI", env: "PERPLEXITY_API_KEY", desc: "Used for web-indexed sonar search citations." },
                { name: "Google Gemini", env: "GEMINI_API_KEY", desc: "Used for Gemini answer synthesis and citations." },
                { name: "Anthropic Claude", env: "ANTHROPIC_API_KEY", desc: "Used for Claude search reasoning evaluation." },
              ].map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
                    <span className="text-[10px] font-mono text-slate-400">Env: {p.env}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Live Status
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab 4: Settings */}
        {activeTab === "settings" && (
          <Card className="p-6 border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Settings</h3>
            <p className="text-xs text-slate-400">Configure project lifecycle and crawl frequency.</p>
            <div className="pt-2 flex items-center gap-3">
              <Button variant="secondary" size="sm">
                Pause Analysis Schedule
              </Button>
              <Button variant="danger" size="sm">
                Archive Project
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
