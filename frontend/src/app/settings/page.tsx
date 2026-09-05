"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  User,
  Sliders,
  Bell,
  Save,
  Globe,
  Bot,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("Enterprise Global Growth");
  const [maxCrawlPages, setMaxCrawlPages] = useState("100");
  const [crawlDelayMs, setCrawlDelayMs] = useState("250");
  const [respectRobots, setRespectRobots] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalIssueThreshold, setCriticalIssueThreshold] = useState("5");

  const { success } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success("Settings Saved", "System configuration preferences updated successfully");
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">System & Workspace Settings</h2>
            <p className="text-xs text-slate-500">
              Manage platform defaults, BFS crawler limits, and notification thresholds.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Workspace Settings */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Workspace Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Owner Email</label>
                <input
                  type="email"
                  disabled
                  value="admin@seosensing-enterprise.internal"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>
          </Card>

          {/* Crawler Defaults */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Technical Crawler Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Default Max Pages per Crawl</label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={maxCrawlPages}
                  onChange={(e) => setMaxCrawlPages(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Request Rate Limit Delay (ms)</label>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={crawlDelayMs}
                  onChange={(e) => setCrawlDelayMs(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Robots.txt Policy</label>
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={respectRobots}
                      onChange={(e) => setRespectRobots(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-800 font-medium">Strictly respect robots.txt</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Bell className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Alerts & Thresholds</h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-800 font-medium">
                  Send email summary whenever an SEO audit or AEO visibility check completes
                </span>
              </label>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
