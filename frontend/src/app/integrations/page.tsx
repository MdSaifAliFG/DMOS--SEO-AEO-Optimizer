"use client";

import React, { useState } from "react";
import {
  Puzzle,
  Globe,
  Bot,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  Lock,
  KeyRound,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

interface IntegrationItem {
  id: string;
  name: string;
  category: "SEO" | "AEO" | "Analytics";
  description: string;
  iconBg: string;
  isConnected: boolean;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: "gsc",
      name: "Google Search Console",
      category: "SEO",
      description: "Import verified search impressions, click-through rates, and indexed URL coverage.",
      iconBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
      isConnected: false,
    },
    {
      id: "ga4",
      name: "Google Analytics 4",
      category: "Analytics",
      description: "Sync organic landing page sessions, engagement rates, and conversion events.",
      iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
      isConnected: false,
    },
    {
      id: "ahrefs",
      name: "Ahrefs API",
      category: "SEO",
      description: "Pull domain rating (DR), backlink velocity, and organic keyword rankings.",
      iconBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
      isConnected: false,
    },
    {
      id: "semrush",
      name: "Semrush API",
      category: "SEO",
      description: "Enrich target keywords with monthly search volume, keyword difficulty, and SERP features.",
      iconBg: "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/60",
      isConnected: false,
    },
    {
      id: "openai",
      name: "OpenAI ChatGPT Search",
      category: "AEO",
      description: "Automate live evaluation of buyer prompts and citation frequency in ChatGPT Search.",
      iconBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
      isConnected: false,
    },
    {
      id: "perplexity",
      name: "Perplexity AI API",
      category: "AEO",
      description: "Extract citations, source links, and conversational answers from Sonar models.",
      iconBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
      isConnected: false,
    },
    {
      id: "gemini",
      name: "Google Gemini AI",
      category: "AEO",
      description: "Monitor grounding links and generative answers powered by Gemini 1.5 Pro.",
      iconBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
      isConnected: false,
    },
    {
      id: "copilot",
      name: "Microsoft Copilot",
      category: "AEO",
      description: "Track Bing AI summary citations and commercial query suggestions.",
      iconBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
      isConnected: false,
    },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const { success } = useToast();

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntegration) return;

    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === selectedIntegration.id ? { ...item, isConnected: true } : item
      )
    );
    success("Integration Connected", `${selectedIntegration.name} was successfully configured`);
    setSelectedIntegration(null);
    setApiKeyInput("");
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Platform Integrations</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connect external search analytics and AI engine API providers to unlock automated telemetry.
            </p>
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-lg border ${item.iconBg}`}>
                      {item.category === "AEO" ? (
                        <Bot className="w-5 h-5" />
                      ) : (
                        <Globe className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        {item.category} Module
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.isConnected
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {item.isConnected ? "Connected" : "Not Connected"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">REST API v1</span>
                {item.isConnected ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIntegrations((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, isConnected: false } : i))
                      );
                    }}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={item.category === "AEO" ? "aeo" : "primary"}
                    onClick={() => setSelectedIntegration(item)}
                  >
                    Connect API
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Connect Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg border ${selectedIntegration.iconBg}`}>
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Connect {selectedIntegration.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your API credentials or authorization token to activate live sync for {selectedIntegration.name}.
              </p>

              <form onSubmit={handleConnect} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">API Key / Token</label>
                  <input
                    type="password"
                    required
                    placeholder="e.g. sk-live-..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIntegration(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={selectedIntegration.category === "AEO" ? "aeo" : "primary"}
                    size="sm"
                  >
                    Save & Connect
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
