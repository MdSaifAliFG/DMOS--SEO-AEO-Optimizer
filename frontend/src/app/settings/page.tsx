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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">System & Workspace Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage platform defaults, BFS crawler limits, and notification thresholds.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Workspace Settings */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Owner Email</label>
                <input
                  type="email"
                  disabled
                  value="admin@seosensing-enterprise.internal"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>
          </Card>

          {/* Crawler Defaults */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Technical Crawler Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Default Max Pages per Crawl</label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={maxCrawlPages}
                  onChange={(e) => setMaxCrawlPages(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Request Rate Limit Delay (ms)</label>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={crawlDelayMs}
                  onChange={(e) => setCrawlDelayMs(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Robots.txt Policy</label>
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={respectRobots}
                      onChange={(e) => setRespectRobots(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Strictly respect robots.txt</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alerts & Thresholds</h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
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
