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
      iconBg: "bg-blue-50 text-blue-600",
      isConnected: false,
    },
    {
      id: "ga4",
      name: "Google Analytics 4",
      category: "Analytics",
      description: "Sync organic landing page sessions, engagement rates, and conversion events.",
      iconBg: "bg-amber-50 text-amber-600",
      isConnected: false,
    },
    {
      id: "ahrefs",
      name: "Ahrefs API",
      category: "SEO",
      description: "Pull domain rating (DR), backlink velocity, and organic keyword rankings.",
      iconBg: "bg-blue-50 text-blue-600",
      isConnected: false,
    },
    {
      id: "semrush",
      name: "Semrush API",
      category: "SEO",
      description: "Enrich target keywords with monthly search volume, keyword difficulty, and SERP features.",
      iconBg: "bg-orange-50 text-orange-600",
      isConnected: false,
    },
    {
      id: "openai",
      name: "OpenAI ChatGPT Search",
      category: "AEO",
      description: "Automate live evaluation of buyer prompts and citation frequency in ChatGPT Search.",
      iconBg: "bg-purple-50 text-purple-600",
      isConnected: false,
    },
    {
      id: "perplexity",
      name: "Perplexity AI API",
      category: "AEO",
      description: "Extract citations, source links, and conversational answers from Sonar models.",
      iconBg: "bg-purple-50 text-purple-600",
      isConnected: false,
    },
    {
      id: "gemini",
      name: "Google Gemini AI",
      category: "AEO",
      description: "Monitor grounding links and generative answers powered by Gemini 1.5 Pro.",
      iconBg: "bg-purple-50 text-purple-600",
      isConnected: false,
    },
    {
      id: "copilot",
      name: "Microsoft Copilot",
      category: "AEO",
      description: "Track Bing AI summary citations and commercial query suggestions.",
      iconBg: "bg-purple-50 text-purple-600",
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Platform Integrations</h2>
            <p className="text-xs text-slate-500">
              Connect external search analytics and AI engine API providers to unlock automated telemetry.
            </p>
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <Card key={item.id} className="p-5 border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-lg border border-slate-200 ${item.iconBg}`}>
                      {item.category === "AEO" ? (
                        <Bot className="w-5 h-5" />
                      ) : (
                        <Globe className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {item.category} Module
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.isConnected
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {item.isConnected ? "Connected" : "Not Connected"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">REST API v1</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${selectedIntegration.iconBg}`}>
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Connect {selectedIntegration.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Enter your API credentials or authorization token to activate live sync for {selectedIntegration.name}.
              </p>

              <form onSubmit={handleConnect} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">API Key / Token</label>
                  <input
                    type="password"
                    required
                    placeholder="e.g. sk-live-..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
