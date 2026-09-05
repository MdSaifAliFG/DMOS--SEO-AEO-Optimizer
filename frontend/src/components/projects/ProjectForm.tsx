"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Plus, Sparkles, Sliders, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { cleanDomain } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export const ProjectForm: React.FC = () => {
  const router = useRouter();
  const { success, error } = useToast();

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [crawlDepth, setCrawlDepth] = useState<number>(3);
  const [userAgent, setUserAgent] = useState("SeoSensing-Bot/1.0 (SEO Crawler Engine)");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDomain(raw);
    if (!name && raw.trim()) {
      // Auto-suggest project name based on domain
      const cleaned = cleanDomain(raw);
      const namePart = cleaned.split(".")[0];
      if (namePart) {
        setName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
      }
    }
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = "Project name is required";
    if (!domain.trim()) {
      errors.domain = "Website domain is required";
    } else {
      const cleaned = cleanDomain(domain);
      if (cleaned !== "localhost" && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleaned)) {
        errors.domain = "Please enter a valid domain (e.g. example.com or app.example.com)";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const cleanedDomain = cleanDomain(domain);
      const project = await api.createProject({
        name: name.trim(),
        domain: cleanedDomain,
        description: description.trim() || undefined,
        settings: {
          crawl_depth: crawlDepth,
          user_agent: userAgent,
        },
      });

      success("Project Created", `Added ${project.name} (${project.domain}) successfully`);
      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      error("Could Not Create Project", err.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/projects">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Add New Website</h1>
          <p className="text-xs text-slate-400">
            Register a web property for Phase 1 scan orchestration and lifecycle monitoring
          </p>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary-400" />
              Website Information
            </h3>

            <Input
              label="Website Domain"
              placeholder="e.g. stripe.com or app.datadoghq.com"
              value={domain}
              onChange={handleDomainChange}
              error={fieldErrors.domain}
              helperText={
                domain
                  ? `Clean domain: ${cleanDomain(domain)}`
                  : "Enter root domain or subdomain without http:// or trailing slashes"
              }
              required
            />

            <Input
              label="Project / Brand Name"
              placeholder="e.g. Stripe Tech Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief notes about this website or organization..."
                rows={3}
                className="w-full rounded-xl bg-surface-900/90 border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          {/* Crawler Configuration */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Scan Configuration (Phase 1 Ready)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Crawl Depth
                </label>
                <select
                  value={crawlDepth}
                  onChange={(e) => setCrawlDepth(Number(e.target.value))}
                  className="w-full rounded-xl bg-surface-900/90 border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 transition-all focus:outline-none focus:border-primary-500"
                >
                  <option value={1}>1 Level (Homepage Only)</option>
                  <option value={2}>2 Levels (Direct Links)</option>
                  <option value={3}>3 Levels (Standard Crawl)</option>
                  <option value={5}>5 Levels (Deep Crawl)</option>
                </select>
              </div>

              <Input
                label="Crawler User Agent"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                helperText="Custom identifier sent with HTTP headers"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link href="/projects">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
