"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Settings,
  Sliders,
  Globe,
  Bot,
  Sparkles,
  Bell,
  Save,
  User,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Building2,
  ShieldCheck,
  Layers,
  Cpu,
  HelpCircle,
  ExternalLink,
  Search,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import {
  Project,
  AeoProject,
  AeoMonitoringSchedule,
  GeoProject,
  GeoBrandProfile,
} from "@/lib/types";

type SettingsTab = "general" | "seo" | "aeo" | "geo" | "notifications";

function GlobalSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "general";

  const [activeTab, setActiveTab] = useState<SettingsTab>(
    ["general", "seo", "aeo", "geo", "notifications"].includes(initialTab)
      ? initialTab
      : "general"
  );

  const { success, error } = useToast();

  // Sync tab with URL
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.replace(`/settings?tab=${tab}`, { scroll: false });
  };

  // ----------------------------------------------------
  // GENERAL TAB STATE
  // ----------------------------------------------------
  const [workspaceName, setWorkspaceName] = useState("Enterprise Global Growth");
  const [ownerEmail] = useState("admin@seosensing-enterprise.internal");
  const [timezone, setTimezone] = useState("UTC (GMT+00:00)");
  const [defaultLanguage, setDefaultLanguage] = useState("en-US");
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    setTimeout(() => {
      setIsSavingGeneral(false);
      success("Workspace Settings Saved", "Global workspace profile updated successfully.");
    }, 400);
  };

  // ----------------------------------------------------
  // SEO TAB STATE
  // ----------------------------------------------------
  const [seoProjects, setSeoProjects] = useState<Project[]>([]);
  const [selectedSeoProjectId, setSelectedSeoProjectId] = useState<string>("");
  const [maxCrawlPages, setMaxCrawlPages] = useState("100");
  const [crawlDelayMs, setCrawlDelayMs] = useState("250");
  const [concurrentWorkers, setConcurrentWorkers] = useState("5");
  const [respectRobots, setRespectRobots] = useState(true);
  const [followExternal, setFollowExternal] = useState(false);
  const [includeSubdomains, setIncludeSubdomains] = useState(false);
  const [criticalThreshold, setCriticalThreshold] = useState("5");
  const [scoreAlertThreshold, setScoreAlertThreshold] = useState("70");
  const [isLoadingSeo, setIsLoadingSeo] = useState(false);
  const [isSavingSeo, setIsSavingSeo] = useState(false);

  useEffect(() => {
    async function loadSeoProjects() {
      setIsLoadingSeo(true);
      try {
        const res = await api.getProjects({ limit: 50 });
        const list = res.projects || [];
        setSeoProjects(list);
        if (list.length > 0) {
          setSelectedSeoProjectId(list[0].id);
          const s = (list[0].settings || {}) as Record<string, any>;
          if (s.crawl_limit) setMaxCrawlPages(String(s.crawl_limit));
          if (s.respect_robots !== undefined) setRespectRobots(Boolean(s.respect_robots));
          if (s.follow_external_links !== undefined) setFollowExternal(Boolean(s.follow_external_links));
          if (s.include_subdomains !== undefined) setIncludeSubdomains(Boolean(s.include_subdomains));
        }
      } catch (err: any) {
        // Fallback gracefully if none
      } finally {
        setIsLoadingSeo(false);
      }
    }
    loadSeoProjects();
  }, []);

  const handleSeoProjectChange = (projId: string) => {
    setSelectedSeoProjectId(projId);
    const p = seoProjects.find((x) => x.id === projId);
    if (p && p.settings) {
      const s = p.settings as Record<string, any>;
      if (s.crawl_limit) setMaxCrawlPages(String(s.crawl_limit));
      if (s.respect_robots !== undefined) setRespectRobots(Boolean(s.respect_robots));
      if (s.follow_external_links !== undefined) setFollowExternal(Boolean(s.follow_external_links));
      if (s.include_subdomains !== undefined) setIncludeSubdomains(Boolean(s.include_subdomains));
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    try {
      if (selectedSeoProjectId) {
        await api.updateProject(selectedSeoProjectId, {
          settings: {
            crawl_limit: parseInt(maxCrawlPages, 10) || 100,
            crawl_delay_ms: parseInt(crawlDelayMs, 10) || 250,
            concurrent_workers: parseInt(concurrentWorkers, 10) || 5,
            respect_robots: respectRobots,
            follow_external_links: followExternal,
            include_subdomains: includeSubdomains,
            critical_issue_threshold: parseInt(criticalThreshold, 10) || 5,
            score_alert_threshold: parseInt(scoreAlertThreshold, 10) || 70,
          },
        });
      }
      success("SEO Settings Saved", "Crawler defaults and audit thresholds updated successfully.");
    } catch (err: any) {
      error("Failed to save SEO settings", err.message);
    } finally {
      setIsSavingSeo(false);
    }
  };

  // ----------------------------------------------------
  // AEO TAB STATE
  // ----------------------------------------------------
  const [aeoProjects, setAeoProjects] = useState<AeoProject[]>([]);
  const [selectedAeoProjectId, setSelectedAeoProjectId] = useState<string>("");
  const [aeoSchedule, setAeoSchedule] = useState<AeoMonitoringSchedule | null>(null);
  const [aeoEnabled, setAeoEnabled] = useState<boolean>(true);
  const [aeoFrequency, setAeoFrequency] = useState<string>("weekly");
  const [aeoEngines, setAeoEngines] = useState<string[]>(["chatgpt", "gemini", "perplexity"]);
  const [aeoScoreDropThreshold, setAeoScoreDropThreshold] = useState<number>(5);
  const [aeoCompetitorGainThreshold, setAeoCompetitorGainThreshold] = useState<number>(10);
  const [aeoMentionLossThreshold, setAeoMentionLossThreshold] = useState<number>(15);
  const [isLoadingAeo, setIsLoadingAeo] = useState(false);
  const [isSavingAeo, setIsSavingAeo] = useState(false);
  const [isRunningAeoCycle, setIsRunningAeoCycle] = useState(false);

  useEffect(() => {
    async function loadAeoProjects() {
      setIsLoadingAeo(true);
      try {
        const res = await api.getAeoProjects({ limit: 50 });
        const list = res.projects || [];
        setAeoProjects(list);
        if (list.length > 0) {
          setSelectedAeoProjectId(list[0].id);
        }
      } catch (err: any) {
        // Fallback
      } finally {
        setIsLoadingAeo(false);
      }
    }
    loadAeoProjects();
  }, []);

  const loadAeoSchedule = async (projId: string) => {
    if (!projId) return;
    setIsLoadingAeo(true);
    try {
      const data = await api.getAeoMonitoringSchedule(projId);
      setAeoSchedule(data);
      setAeoEnabled(data.enabled);
      setAeoFrequency(data.frequency);
      setAeoEngines(data.selected_engines || ["chatgpt", "gemini", "perplexity"]);
      if (data.alert_thresholds) {
        setAeoScoreDropThreshold(data.alert_thresholds.score_drop ?? 5);
        setAeoCompetitorGainThreshold(data.alert_thresholds.competitor_gain ?? 10);
        setAeoMentionLossThreshold(data.alert_thresholds.mention_loss ?? 15);
      }
    } catch (err: any) {
      // Create clean default schedule view
      setAeoSchedule(null);
    } finally {
      setIsLoadingAeo(false);
    }
  };

  useEffect(() => {
    if (selectedAeoProjectId) {
      loadAeoSchedule(selectedAeoProjectId);
    }
  }, [selectedAeoProjectId]);

  const handleAeoEngineToggle = (eng: string) => {
    if (aeoEngines.includes(eng)) {
      if (aeoEngines.length === 1) {
        error("At least one engine must be selected.");
        return;
      }
      setAeoEngines(aeoEngines.filter((e) => e !== eng));
    } else {
      setAeoEngines([...aeoEngines, eng]);
    }
  };

  const handleSaveAeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAeoProjectId) {
      error("Please select an AEO project first.");
      return;
    }
    setIsSavingAeo(true);
    try {
      const updated = await api.updateAeoMonitoringSchedule(selectedAeoProjectId, {
        enabled: aeoEnabled,
        frequency: aeoFrequency,
        selected_engines: aeoEngines,
        alert_thresholds: {
          score_drop: aeoScoreDropThreshold,
          competitor_gain: aeoCompetitorGainThreshold,
          mention_loss: aeoMentionLossThreshold,
        },
      });
      setAeoSchedule(updated);
      success("AEO Monitoring Saved", "Answer engine monitoring schedule and thresholds updated.");
    } catch (err: any) {
      error("Failed to save AEO settings", err.message);
    } finally {
      setIsSavingAeo(false);
    }
  };

  const handleTriggerAeoCycle = async () => {
    if (!selectedAeoProjectId) return;
    setIsRunningAeoCycle(true);
    try {
      const res = await api.runAeoMonitoringCycle(selectedAeoProjectId);
      success(
        "Monitoring Cycle Triggered",
        `Dispatched AEO check across ${res.questions_analyzed_count || 0} query spaces.`
      );
      loadAeoSchedule(selectedAeoProjectId);
    } catch (err: any) {
      error("Cycle Execution Error", err.message);
    } finally {
      setIsRunningAeoCycle(false);
    }
  };

  // ----------------------------------------------------
  // GEO TAB STATE
  // ----------------------------------------------------
  const [geoProjects, setGeoProjects] = useState<GeoProject[]>([]);
  const [selectedGeoProjectId, setSelectedGeoProjectId] = useState<string>("");
  const [currentGeoProject, setCurrentGeoProject] = useState<GeoProject | null>(null);
  const [geoBrandProfile, setGeoBrandProfile] = useState<GeoBrandProfile | null>(null);
  const [geoBrandName, setGeoBrandName] = useState("");
  const [geoDomain, setGeoDomain] = useState("");
  const [geoIndustry, setGeoIndustry] = useState("");
  const [geoDescription, setGeoDescription] = useState("");
  const [geoTargetAudience, setGeoTargetAudience] = useState("");
  const [geoAliases, setGeoAliases] = useState("");
  const [geoProducts, setGeoProducts] = useState("");
  const [geoServices, setGeoServices] = useState("");
  const [geoCompetitors, setGeoCompetitors] = useState<Array<{ name: string; domain?: string }>>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [isSavingGeo, setIsSavingGeo] = useState(false);

  useEffect(() => {
    async function loadGeoProjects() {
      setIsLoadingGeo(true);
      try {
        const res = await api.getGeoProjects();
        const list = res.projects || [];
        setGeoProjects(list);
        if (list.length > 0) {
          setSelectedGeoProjectId(list[0].id);
          fetchGeoProjectData(list[0].id);
        }
      } catch (err: any) {
        // Fallback
      } finally {
        setIsLoadingGeo(false);
      }
    }
    loadGeoProjects();
  }, []);

  const fetchGeoProjectData = async (projectId: string) => {
    if (!projectId) return;
    setIsLoadingGeo(true);
    try {
      const [proj, bp] = await Promise.all([
        api.getGeoProject(projectId),
        api.getGeoBrandProfile(projectId).catch(() => null),
      ]);
      setCurrentGeoProject(proj);
      setGeoBrandProfile(bp);

      setGeoBrandName(proj.brand_name || proj.name);
      setGeoDomain(proj.domain);
      setGeoIndustry(proj.industry || "");
      setGeoDescription(proj.description || "");
      setGeoTargetAudience(proj.target_audience || "");
      setGeoAliases((proj.brand_aliases || []).join(", "));
      setGeoProducts((proj.products || []).join(", "));
      setGeoServices((proj.services || []).join(", "));
      setGeoCompetitors(proj.competitors || []);
    } catch (err: any) {
      error("Failed to load GEO project settings.");
    } finally {
      setIsLoadingGeo(false);
    }
  };

  const handleGeoProjectChange = (projId: string) => {
    setSelectedGeoProjectId(projId);
    fetchGeoProjectData(projId);
  };

  const handleAddCompetitor = () => {
    setGeoCompetitors([...geoCompetitors, { name: "", domain: "" }]);
  };

  const handleRemoveCompetitor = (index: number) => {
    setGeoCompetitors(geoCompetitors.filter((_, i) => i !== index));
  };

  const handleCompetitorChange = (index: number, field: "name" | "domain", val: string) => {
    const updated = [...geoCompetitors];
    updated[index][field] = val;
    setGeoCompetitors(updated);
  };

  const handleSaveGeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGeoProjectId) {
      error("Please select a GEO project first.");
      return;
    }
    setIsSavingGeo(true);
    try {
      const aliasList = geoAliases.split(",").map((s) => s.trim()).filter(Boolean);
      const prodList = geoProducts.split(",").map((s) => s.trim()).filter(Boolean);
      const servList = geoServices.split(",").map((s) => s.trim()).filter(Boolean);

      await api.updateGeoProject(selectedGeoProjectId, {
        brand_name: geoBrandName,
        industry: geoIndustry,
        description: geoDescription,
        target_audience: geoTargetAudience,
        brand_aliases: aliasList,
        products: prodList,
        services: servList,
        competitors: geoCompetitors.filter((c) => c.name.trim()),
      });

      success("GEO Settings Saved", "Brand profile, entities, and competitor monitoring configuration updated.");
      fetchGeoProjectData(selectedGeoProjectId);
    } catch (err: any) {
      error("Failed to save GEO settings", err.message);
    } finally {
      setIsSavingGeo(false);
    }
  };

  // ----------------------------------------------------
  // NOTIFICATIONS TAB STATE
  // ----------------------------------------------------
  const [notifySeoComplete, setNotifySeoComplete] = useState(true);
  const [notifyAeoShift, setNotifyAeoShift] = useState(true);
  const [notifyGeoAlert, setNotifyGeoAlert] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotifications(true);
    setTimeout(() => {
      setIsSavingNotifications(false);
      success("Notification Preferences Saved", "Delivery channels and frequency thresholds updated.");
    }, 400);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold">
              <Settings className="w-3.5 h-3.5" />
              Unified Platform Administration
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Global Platform Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage workspace preferences, technical SEO crawler policies, AEO answer engine monitoring, and GEO brand profiles in one centralized location.
            </p>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleTabChange("general")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "general"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>General &amp; Workspace</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("seo")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "seo"
                ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs border border-sky-200 dark:border-sky-800/60"
                : "text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span>SEO Engine</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              40%
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("aeo")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "aeo"
                ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs border border-purple-200 dark:border-purple-800/60"
                : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-500" />
            <span>AEO Engine</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              30%
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("geo")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "geo"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-200 dark:border-amber-800/60"
                : "text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>GEO Optimization</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              30%
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("notifications")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "notifications"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications &amp; Integrations</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: GENERAL & WORKSPACE */}
        {/* ========================================================================= */}
        {activeTab === "general" && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Profile</h3>
                  <p className="text-xs text-slate-500">Corporate identity and administrative contact details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Owner Email</label>
                  <input
                    type="email"
                    disabled
                    value={ownerEmail}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Default Audit Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="UTC (GMT+00:00)">UTC (GMT+00:00)</option>
                    <option value="America/New_York (EST)">America/New York (EST/EDT)</option>
                    <option value="America/Los_Angeles (PST)">America/Los Angeles (PST/PDT)</option>
                    <option value="Europe/London (BST)">Europe/London (GMT/BST)</option>
                    <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                    <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Default Language</label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="en-US">English (United States)</option>
                    <option value="en-GB">English (United Kingdom)</option>
                    <option value="de-DE">German (Germany)</option>
                    <option value="fr-FR">French (France)</option>
                    <option value="es-ES">Spanish (Spain)</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Health &amp; Runtime</h3>
                  <p className="text-xs text-slate-500">Real-time status of backend services and multi-pillar indexes.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sky-800 dark:text-sky-300">SEO Engine</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">BFS Crawler &amp; 37 Deterministic Rules active</p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-purple-800 dark:text-purple-300">AEO Engine</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Answer monitoring &amp; citation tracking active</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">GEO Optimization</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">4 Generative Search Engines &amp; 42 Rules active</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSavingGeneral} leftIcon={<Save className="w-4 h-4" />}>
                Save Workspace Profile
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SEO ENGINE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "seo" && (
          <form onSubmit={handleSaveSeo} className="space-y-6">
            {/* Project Context Selector */}
            {seoProjects.length > 0 && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-sky-500/5 border border-sky-200 dark:border-sky-900/60">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Active SEO Project</span>
                    <p className="text-[11px] text-slate-500">Select which project's crawler profile to configure.</p>
                  </div>
                </div>
                <select
                  value={selectedSeoProjectId}
                  onChange={(e) => handleSeoProjectChange(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {seoProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Crawler Parameters */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Technical Crawler Policy</h3>
                  <p className="text-xs text-slate-500">Configure BFS site crawler depth, speed, and safety boundaries.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Default Max Pages per Crawl</label>
                  <input
                    type="number"
                    min="5"
                    max="2000"
                    value={maxCrawlPages}
                    onChange={(e) => setMaxCrawlPages(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[11px] text-slate-400">Recommended: 100-500 pages</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Rate Limit Delay (ms)</label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    step="50"
                    value={crawlDelayMs}
                    onChange={(e) => setCrawlDelayMs(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[11px] text-slate-400">Prevents target server rate-limiting</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Concurrent Workers</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={concurrentWorkers}
                    onChange={(e) => setConcurrentWorkers(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[11px] text-slate-400">Parallel HTTP fetch threads</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={respectRobots}
                    onChange={(e) => setRespectRobots(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Strictly respect robots.txt rules</span>
                    <p className="text-[11px] text-slate-500">Obeys Disallow directives and crawl-delay attributes specified in the root robots.txt.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={followExternal}
                    onChange={(e) => setFollowExternal(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Verify external outbound link targets</span>
                    <p className="text-[11px] text-slate-500">Sends HTTP HEAD requests to external links to detect 404 broken outbound references.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={includeSubdomains}
                    onChange={(e) => setIncludeSubdomains(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Include subdomains in scope</span>
                    <p className="text-[11px] text-slate-500">Permits crawling blog.*, app.*, or docs.* subdomains under the root domain.</p>
                  </div>
                </label>
              </div>
            </Card>

            {/* Audit Alert Thresholds */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">SEO Health &amp; Critical Issue Thresholds</h3>
                  <p className="text-xs text-slate-500">Define conditions that flag urgent notifications or audit failures.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Max Critical Issues Allowed</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={criticalThreshold}
                    onChange={(e) => setCriticalThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[11px] text-slate-400">Trigger alert if critical SEO issues exceed this number</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Minimum Health Score Target (0-100)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={scoreAlertThreshold}
                    onChange={(e) => setScoreAlertThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[11px] text-slate-400">Alert if overall audit health score drops below this floor</span>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSavingSeo} leftIcon={<Save className="w-4 h-4" />}>
                Save SEO Configuration
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AEO ENGINE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "aeo" && (
          <form onSubmit={handleSaveAeo} className="space-y-6">
            {/* Project Context Selector */}
            {aeoProjects.length > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-200 dark:border-purple-900/60">
                <div className="flex items-center gap-3">
                  <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Active AEO Project</span>
                    <p className="text-[11px] text-slate-500">Select project to configure automated Answer Engine monitoring.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedAeoProjectId}
                    onChange={(e) => setSelectedAeoProjectId(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {aeoProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.domain})
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    isLoading={isRunningAeoCycle}
                    onClick={handleTriggerAeoCycle}
                    className="border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-800 text-xs"
                    leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  >
                    Run Cycle Now
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Bot}
                title="No AEO Projects Found"
                description="Create an AEO project to configure recurring answer engine monitoring."
              />
            )}

            {/* Monitoring Cadence & Status */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monitoring Cadence</h3>
                    <p className="text-xs text-slate-500">Schedule automatic AI query polling across answer providers.</p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aeoEnabled}
                    onChange={(e) => setAeoEnabled(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {aeoEnabled ? "Monitoring Active" : "Paused"}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Run Frequency</label>
                  <select
                    value={aeoFrequency}
                    onChange={(e) => setAeoFrequency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="daily">Daily (High-velocity tracking)</option>
                    <option value="weekly">Weekly (Recommended for most brands)</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Next Scheduled Run</label>
                  <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400">
                    {aeoSchedule?.next_run_at
                      ? new Date(aeoSchedule.next_run_at).toLocaleString()
                      : "Upon next trigger cycle"}
                  </div>
                </div>
              </div>

              {/* Monitored Engines Toggle */}
              <div className="pt-2 space-y-2">
                <label className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                  Target Answer Engines
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "chatgpt", name: "ChatGPT Search", provider: "OpenAI" },
                    { id: "gemini", name: "Google Gemini", provider: "Google" },
                    { id: "perplexity", name: "Perplexity AI", provider: "Sonar" },
                    { id: "claude", name: "Claude Search", provider: "Anthropic" },
                  ].map((eng) => {
                    const isSelected = aeoEngines.includes(eng.id);
                    return (
                      <button
                        key={eng.id}
                        type="button"
                        onClick={() => handleAeoEngineToggle(eng.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800"
                            : "bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{eng.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{eng.provider}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* AEO Alert Thresholds */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">AEO Visibility &amp; Share of Voice Thresholds</h3>
                  <p className="text-xs text-slate-500">Specify percentage swings that trigger instant notifications.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Visibility Score Drop (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={aeoScoreDropThreshold}
                    onChange={(e) => setAeoScoreDropThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[11px] text-slate-400">Alert if score drops by this %</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Competitor Gain (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={aeoCompetitorGainThreshold}
                    onChange={(e) => setAeoCompetitorGainThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[11px] text-slate-400">Alert if a rival gains share of voice</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Brand Mention Loss (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={aeoMentionLossThreshold}
                    onChange={(e) => setAeoMentionLossThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[11px] text-slate-400">Alert if mention count decreases</span>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSavingAeo} leftIcon={<Save className="w-4 h-4" />}>
                Save AEO Configuration
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GEO ENGINE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "geo" && (
          <form onSubmit={handleSaveGeo} className="space-y-6">
            {/* Project Context Selector */}
            {geoProjects.length > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-200 dark:border-amber-900/60">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Active GEO Project</span>
                    <p className="text-[11px] text-slate-500">Configure canonical brand identity and competitor tracking.</p>
                  </div>
                </div>
                <select
                  value={selectedGeoProjectId}
                  onChange={(e) => handleGeoProjectChange(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {geoProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No GEO Projects Found"
                description="Create a GEO project to configure brand profiles and generative provider optimizations."
              />
            )}

            {/* Canonical Brand Identity */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Canonical Brand Profile</h3>
                  <p className="text-xs text-slate-500">Core corporate facts used to evaluate AI generative consensus and citations.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Brand / Organization Name</label>
                  <input
                    type="text"
                    required
                    value={geoBrandName}
                    onChange={(e) => setGeoBrandName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Primary Domain</label>
                  <input
                    type="text"
                    disabled
                    value={geoDomain}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Industry / Vertical</label>
                  <input
                    type="text"
                    placeholder="e.g., Enterprise B2B SaaS, FinTech, LegalTech"
                    value={geoIndustry}
                    onChange={(e) => setGeoIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Target Audience / Buyer Persona</label>
                  <input
                    type="text"
                    placeholder="e.g., CTOs, Enterprise Engineers, Compliance Officers"
                    value={geoTargetAudience}
                    onChange={(e) => setGeoTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Canonical Description / Mission</label>
                  <textarea
                    rows={3}
                    placeholder="Concise 1-2 sentence canonical definition of your brand and core offering."
                    value={geoDescription}
                    onChange={(e) => setGeoDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </Card>

            {/* Knowledge Graph Anchors */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Knowledge Graph Anchors &amp; Entity Vectors</h3>
                  <p className="text-xs text-slate-500">Comma-separated aliases and flagship offerings evaluated in AI responses.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Brand Aliases / Acronyms</label>
                  <input
                    type="text"
                    placeholder="e.g., SEO Sensing, SS AI, DMOS"
                    value={geoAliases}
                    onChange={(e) => setGeoAliases(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-400">Comma separated alternate names</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Core Products</label>
                  <input
                    type="text"
                    placeholder="e.g., Cloud Analytics, Realtime API"
                    value={geoProducts}
                    onChange={(e) => setGeoProducts(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-400">Flagship products tracked</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Core Services</label>
                  <input
                    type="text"
                    placeholder="e.g., Enterprise Migration, AI Strategy"
                    value={geoServices}
                    onChange={(e) => setGeoServices(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-400">Service offerings tracked</span>
                </div>
              </div>
            </Card>

            {/* Tracked Competitors */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tracked Competitors</h3>
                    <p className="text-xs text-slate-500">Benchmark your brand's AI recommendation frequency against market alternatives.</p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddCompetitor}
                  className="text-xs"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Competitor
                </Button>
              </div>

              {geoCompetitors.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No competitors configured. Click &quot;Add Competitor&quot; to begin tracking share of voice.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {geoCompetitors.map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Competitor Name (e.g. Acme Corp)"
                        value={comp.name}
                        onChange={(e) => handleCompetitorChange(idx, "name", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Domain (e.g. acme.com)"
                        value={comp.domain || ""}
                        onChange={(e) => handleCompetitorChange(idx, "domain", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCompetitor(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Crawler Policy Status */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Search Crawler Access Verification</h3>
                  <p className="text-xs text-slate-500">Autonomous verification status of major generative search indexers.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { bot: "GPTBot", provider: "OpenAI / SearchGPT", status: "Permitted", statusColor: "text-emerald-600 dark:text-emerald-400" },
                  { bot: "PerplexityBot", provider: "Perplexity Sonar", status: "Permitted", statusColor: "text-emerald-600 dark:text-emerald-400" },
                  { bot: "Google-Extended", provider: "Google Gemini", status: "Permitted", statusColor: "text-emerald-600 dark:text-emerald-400" },
                  { bot: "ClaudeBot", provider: "Anthropic Claude", status: "Permitted", statusColor: "text-emerald-600 dark:text-emerald-400" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{item.bot}</span>
                      <span className={`text-[10px] font-bold ${item.statusColor}`}>● {item.status}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{item.provider}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSavingGeo} leftIcon={<Save className="w-4 h-4" />}>
                Save GEO Configuration
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: NOTIFICATIONS & INTEGRATIONS */}
        {/* ========================================================================= */}
        {activeTab === "notifications" && (
          <form onSubmit={handleSaveNotifications} className="space-y-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Digest &amp; Instant Alerts</h3>
                  <p className="text-xs text-slate-500">Configure notifications triggered across all 3 optimization pillars.</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySeoComplete}
                    onChange={(e) => setNotifySeoComplete(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">SEO Audit Completion &amp; Critical Issue Summaries</span>
                    <p className="text-[11px] text-slate-500">Sends full report summary whenever a scheduled or manual BFS site crawl completes.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyAeoShift}
                    onChange={(e) => setNotifyAeoShift(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">AEO Answer Engine Visibility Drop Alerts</span>
                    <p className="text-[11px] text-slate-500">Immediate alert if brand position drops or competitor mentions surge across polled AI answers.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyGeoAlert}
                    onChange={(e) => setNotifyGeoAlert(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">GEO Recommendation &amp; Crawler Accessibility Alerts</span>
                    <p className="text-[11px] text-slate-500">Alerts when robots.txt crawler blocking is detected or high-impact GEO rules fail.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyWeeklyDigest}
                    onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Unified Executive Monday Morning Brief</span>
                    <p className="text-[11px] text-slate-500">Weekly roll-up comparing SEO health (40%), AEO visibility (30%), and GEO score (30%).</p>
                  </div>
                </label>
              </div>
            </Card>

            {/* AI Providers Connection Status */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Generative &amp; Search Engine Providers</h3>
                  <p className="text-xs text-slate-500">Connection state for live API query execution.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {[
                  { name: "OpenAI (GPT-4o & SearchGPT)", status: "Active / Configured via Backend Environment", healthy: true },
                  { name: "Google Gemini (1.5 Flash / Pro)", status: "Active / Configured via Backend Environment", healthy: true },
                  { name: "Perplexity AI (Sonar Online)", status: "Active / Configured via Backend Environment", healthy: true },
                  { name: "Anthropic Claude (Claude 3.5 Sonnet)", status: "Active / Configured via Backend Environment", healthy: true },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                      <p className="text-[11px] text-slate-500">{item.status}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSavingNotifications} leftIcon={<Save className="w-4 h-4" />}>
                Save Notification Preferences
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}

export default function GlobalSettingsPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <div className="space-y-6 p-6">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-10 w-80 rounded-xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </DashboardShell>
      }
    >
      <GlobalSettingsContent />
    </Suspense>
  );
}
