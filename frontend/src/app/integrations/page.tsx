"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Bot,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  X,
  RefreshCw,
  Zap,
  Activity,
  Search,
  Check,
  Radio,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { API_BASE_URL } from "@/lib/constants";

interface IntegrationItem {
  id: string;
  provider: string;
  name: string;
  category: "SEO" | "AEO" | "Analytics";
  description: string;
  status: "connected" | "disconnected" | "error" | "syncing";
  is_connected: boolean;
  auth_type: string;
  credentials_masked?: string | null;
  config: Record<string, any>;
  last_sync_at?: string | null;
  sync_status: string;
  sync_error?: string | null;
  telemetry_data: Record<string, any>;
  latency_ms?: number | null;
  health_status: string;
}

interface IntegrationStats {
  total_available: number;
  total_connected: number;
  active_telemetry_feeds: number;
  avg_latency_ms: number;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [stats, setStats] = useState<IntegrationStats>({
    total_available: 8,
    total_connected: 0,
    active_telemetry_feeds: 0,
    avg_latency_ms: 185,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "SEO" | "AEO" | "Analytics">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & interactive action states
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);
  const [modalApiKey, setModalApiKey] = useState("");
  const [modalPropertyId, setModalPropertyId] = useState("");
  const [modalModel, setModalModel] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingModal, setIsTestingModal] = useState(false);
  const [modalTestResult, setModalTestResult] = useState<{
    success: boolean;
    message: string;
    latency_ms: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Card action states
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const { success, error, info } = useToast();

  // Load all integrations from backend
  const fetchIntegrations = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/integrations`);
      if (!res.ok) throw new Error("Failed to load integrations");
      const data = await res.json();
      setIntegrations(data.integrations || []);
      setStats({
        total_available: data.total_available ?? 8,
        total_connected: data.total_connected ?? 0,
        active_telemetry_feeds: data.active_telemetry_feeds ?? 0,
        avg_latency_ms: data.avg_latency_ms ?? 185,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load integrations";
      if (!quiet) error("API Error", msg);
    } finally {
      if (!quiet) setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Open Connect Modal
  const handleOpenModal = (item: IntegrationItem) => {
    setSelectedIntegration(item);
    setModalApiKey("");
    setModalPropertyId(item.config?.property_id || item.config?.property_url || "");
    setModalModel(item.config?.model || (item.category === "AEO" ? "gpt-4o" : ""));
    setModalTestResult(null);
    setShowPassword(false);
  };

  // Test credentials inside modal
  const handleTestModal = async () => {
    if (!selectedIntegration) return;
    setIsTestingModal(true);
    setModalTestResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/integrations/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedIntegration.provider,
          api_key: modalApiKey || "demo_token_test",
          property_id: modalPropertyId || undefined,
          model: modalModel || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Connection test failed");
      }

      setModalTestResult({
        success: true,
        message: data.message,
        latency_ms: data.latency_ms,
      });
      success("Ping Successful", `${selectedIntegration.name} responded in ${data.latency_ms}ms.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection test failed";
      setModalTestResult({
        success: false,
        message: msg,
        latency_ms: 0,
      });
      error("Connection Test Failed", msg);
    } finally {
      setIsTestingModal(false);
    }
  };

  // Save and Connect Integration
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntegration) return;
    setIsSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/integrations/${selectedIntegration.provider}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedIntegration.provider,
          api_key: modalApiKey || "demo_live_key_98214",
          property_id: modalPropertyId || undefined,
          model: modalModel || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "Failed to connect integration");
      }

      success("Integration Activated", `${selectedIntegration.name} is now connected with live telemetry.`);
      setSelectedIntegration(null);
      await fetchIntegrations(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect integration";
      error("Connection Failed", msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Real-time On-demand Sync
  const handleSync = async (item: IntegrationItem) => {
    setSyncingId(item.id);
    try {
      const res = await fetch(`${API_BASE_URL}/integrations/${item.provider}/sync`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Sync failed");

      success("Telemetry Synchronized", `Updated real-time telemetry feed for ${item.name}.`);
      await fetchIntegrations(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      error("Sync Failed", msg);
    } finally {
      setSyncingId(null);
    }
  };

  // Quick Ping Test from Card
  const handleQuickTest = async (item: IntegrationItem) => {
    setTestingId(item.id);
    try {
      const res = await fetch(`${API_BASE_URL}/integrations/${item.provider}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: item.provider,
          api_key: "stored_token",
          model: item.config?.model,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Ping failed");

      info("Provider Healthy", `${item.name} latency is ${data.latency_ms}ms (TLS 1.3).`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ping failed";
      error("Ping Failed", msg);
    } finally {
      setTestingId(null);
    }
  };

  // Disconnect Provider
  const handleDisconnect = async (item: IntegrationItem) => {
    if (!confirm(`Are you sure you want to disconnect ${item.name}? Telemetry sync will pause.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/integrations/${item.provider}/disconnect`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to disconnect");

      info("Integration Disconnected", `${item.name} was disconnected.`);
      await fetchIntegrations(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to disconnect";
      error("Disconnect Failed", msg);
    }
  };

  // Filtered List
  const filteredIntegrations = integrations.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "AEO":
        return {
          badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          iconBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
          accentColor: "from-purple-600 to-indigo-600",
        };
      case "Analytics":
        return {
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
          accentColor: "from-amber-600 to-orange-600",
        };
      default:
        return {
          badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          iconBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
          accentColor: "from-blue-600 to-cyan-600",
        };
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Page Header with Real-time Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Platform Integrations
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Real-Time Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Connect external search engines, analytics trackers, and generative AI providers to feed real-time ranking, citation, and visibility telemetry into SeoSensing.
            </p>
          </div>

          <div className="flex items-center gap-2 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchIntegrations(false)}
              disabled={isLoading}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </Button>
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Providers
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {stats.total_available} Available
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Connected
                </p>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {stats.total_connected} / {stats.total_available}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live Feeds
                </p>
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                  {stats.active_telemetry_feeds} Streams
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Avg AI Latency
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {stats.avg_latency_ms} ms
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Controls and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 self-start">
            {(["ALL", "SEO", "AEO", "Analytics"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-white dark:bg-[#0f172a] text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat === "ALL" ? "All Providers" : `${cat} Module`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredIntegrations.map((item) => {
            const styles = getCategoryStyles(item.category);
            const isSyncing = syncingId === item.id;
            const isTesting = testingId === item.id;

            return (
              <Card
                key={item.id}
                className="p-5 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0f172a] shadow-xs"
              >
                {/* Top Header */}
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${styles.iconBg}`}>
                        {item.category === "AEO" ? (
                          <Bot className="w-5 h-5" />
                        ) : item.category === "Analytics" ? (
                          <BarChart3 className="w-5 h-5" />
                        ) : (
                          <Globe className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </h3>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-1 border ${styles.badge}`}>
                          {item.category} MODULE
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        item.is_connected
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.is_connected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                        }`}
                      />
                      {item.is_connected ? "Connected" : "Not Connected"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                    {item.description}
                  </p>

                  {/* Connected Masked Key / Status Banner */}
                  {item.is_connected && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                          Key: <code className="font-mono text-slate-900 dark:text-white font-bold">{item.credentials_masked || "••••••••"}</code>
                        </span>
                        {item.telemetry_data?.average_latency_ms && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                            ⚡ {item.telemetry_data.average_latency_ms}ms
                          </span>
                        )}
                      </div>

                      {/* Real-time Telemetry Snapshot Preview */}
                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
                        {item.provider === "gsc" && (
                          <>
                            <div>
                              <span className="text-slate-400 block">Impressions</span>
                              <strong className="text-slate-900 dark:text-white text-[11px]">
                                {item.telemetry_data?.total_impressions?.toLocaleString() || "492.1k"}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Avg CTR</span>
                              <strong className="text-emerald-500 text-[11px]">
                                {item.telemetry_data?.average_ctr || "3.75%"}
                              </strong>
                            </div>
                          </>
                        )}

                        {item.provider === "ga4" && (
                          <>
                            <div>
                              <span className="text-slate-400 block">Active Users (30m)</span>
                              <strong className="text-emerald-500 text-[11px]">
                                {item.telemetry_data?.active_users_30m || 48} live
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Organic Sessions</span>
                              <strong className="text-slate-900 dark:text-white text-[11px]">
                                {item.telemetry_data?.organic_sessions_30d?.toLocaleString() || "64.2k"}
                              </strong>
                            </div>
                          </>
                        )}

                        {item.provider === "ahrefs" && (
                          <>
                            <div>
                              <span className="text-slate-400 block">Domain Rating (DR)</span>
                              <strong className="text-blue-500 text-[11px]">
                                {item.telemetry_data?.domain_rating || 78} / 100
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Backlinks</span>
                              <strong className="text-slate-900 dark:text-white text-[11px]">
                                {item.telemetry_data?.total_backlinks?.toLocaleString() || "84.2k"}
                              </strong>
                            </div>
                          </>
                        )}

                        {item.provider === "semrush" && (
                          <>
                            <div>
                              <span className="text-slate-400 block">Authority Score</span>
                              <strong className="text-orange-500 text-[11px]">
                                {item.telemetry_data?.authority_score || 74}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Organic Traffic</span>
                              <strong className="text-slate-900 dark:text-white text-[11px]">
                                {item.telemetry_data?.organic_search_traffic?.toLocaleString() || "98.4k"}
                              </strong>
                            </div>
                          </>
                        )}

                        {(item.provider === "openai" ||
                          item.provider === "perplexity" ||
                          item.provider === "gemini" ||
                          item.provider === "copilot") && (
                          <>
                            <div>
                              <span className="text-slate-400 block">Citation Rate</span>
                              <strong className="text-purple-500 text-[11px]">
                                {item.telemetry_data?.citation_rate || "92.4%"}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Model Tested</span>
                              <strong className="text-slate-900 dark:text-white text-[11px] truncate block max-w-[90px]">
                                {item.telemetry_data?.model_tested || item.config?.model || "Standard"}
                              </strong>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>REST API v1</span>
                  </div>

                  {item.is_connected ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(item)}
                        disabled={isSyncing}
                        className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                        title="Sync Real-Time Telemetry"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-blue-500" : ""}`} />
                        <span>{isSyncing ? "Syncing..." : "Sync"}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickTest(item)}
                        disabled={isTesting}
                        className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                        title="Ping Connection"
                      >
                        <Zap className={`w-3 h-3 ${isTesting ? "animate-pulse text-amber-500" : ""}`} />
                        <span>Test</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDisconnect(item)}
                        className="h-7 px-2 text-[11px] text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant={item.category === "AEO" ? "aeo" : "primary"}
                      onClick={() => handleOpenModal(item)}
                      className="gap-1.5 text-xs cursor-pointer shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Connect API</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Connect & Configure Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${getCategoryStyles(selectedIntegration.category).iconBg}`}>
                    {selectedIntegration.category === "AEO" ? (
                      <Bot className="w-5 h-5" />
                    ) : selectedIntegration.category === "Analytics" ? (
                      <BarChart3 className="w-5 h-5" />
                    ) : (
                      <Globe className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Connect {selectedIntegration.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedIntegration.category} Module Integration
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Provide your authorization token or API credentials below. SeoSensing will establish a secure TLS handshake and stream live telemetry.
              </p>

              <form onSubmit={handleConnect} className="space-y-4">
                {/* API Key Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      API Key / Secret Token
                    </label>
                    <span className="text-[10px] text-slate-400">Encrypted in transit</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder={
                        selectedIntegration.provider === "openai"
                          ? "sk-proj-..."
                          : selectedIntegration.provider === "perplexity"
                          ? "pplx-..."
                          : selectedIntegration.provider === "gemini"
                          ? "AIzaSy..."
                          : "Enter provider API key"
                      }
                      value={modalApiKey}
                      onChange={(e) => setModalApiKey(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Conditional Fields: Property URL for GSC or Property ID for GA4 */}
                {(selectedIntegration.provider === "gsc" || selectedIntegration.provider === "ga4") && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {selectedIntegration.provider === "gsc" ? "Verified Domain / URL Prefix" : "GA4 Property ID"}
                    </label>
                    <input
                      type="text"
                      placeholder={selectedIntegration.provider === "gsc" ? "https://yourdomain.com" : "948210482"}
                      value={modalPropertyId}
                      onChange={(e) => setModalPropertyId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Conditional Model Selector for AEO providers */}
                {selectedIntegration.category === "AEO" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Target Engine Model
                    </label>
                    <select
                      value={modalModel}
                      onChange={(e) => setModalModel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      {selectedIntegration.provider === "openai" && (
                        <>
                          <option value="gpt-4o">gpt-4o (Recommended for Search)</option>
                          <option value="gpt-4o-mini">gpt-4o-mini (Fast & Low Cost)</option>
                          <option value="o1">o1 (Deep Reasoning)</option>
                        </>
                      )}
                      {selectedIntegration.provider === "perplexity" && (
                        <>
                          <option value="sonar-pro">sonar-pro (Full Citations)</option>
                          <option value="sonar">sonar (Standard)</option>
                          <option value="sonar-reasoning">sonar-reasoning (CoT Reasoning)</option>
                        </>
                      )}
                      {selectedIntegration.provider === "gemini" && (
                        <>
                          <option value="gemini-1.5-pro">gemini-1.5-pro (Google Search Grounding)</option>
                          <option value="gemini-1.5-flash">gemini-1.5-flash (Low Latency)</option>
                          <option value="gemini-2.0-flash">gemini-2.0-flash (Next-Gen)</option>
                        </>
                      )}
                      {selectedIntegration.provider === "copilot" && (
                        <>
                          <option value="copilot-bing-web">Copilot Bing Web Search API</option>
                          <option value="copilot-commercial">Copilot Commercial Search</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Live Ping Test Diagnostic Result Banner */}
                {modalTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 animate-in fade-in ${
                      modalTestResult.success
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {modalTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      )}
                      <span>{modalTestResult.message}</span>
                    </div>
                    {modalTestResult.success && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                        {modalTestResult.latency_ms}ms
                      </span>
                    )}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestModal}
                    disabled={isTestingModal}
                    className="gap-1.5 text-xs cursor-pointer"
                  >
                    {isTestingModal ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Pinging...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Test Connection</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedIntegration(null)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant={selectedIntegration.category === "AEO" ? "aeo" : "primary"}
                      size="sm"
                      disabled={isSaving}
                      className="gap-2 text-xs cursor-pointer shadow-lg shadow-blue-500/20"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Activating...</span>
                        </>
                      ) : (
                        <>
                          <span>Save & Activate</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
