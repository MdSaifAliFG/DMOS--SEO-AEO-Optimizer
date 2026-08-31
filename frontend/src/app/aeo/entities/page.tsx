"use client";

import React, { useEffect, useState } from "react";
import {
  Boxes,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { AeoEntity, AeoProject } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export default function AeoEntitiesPage() {
  const [entities, setEntities] = useState<AeoEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<AeoProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEntityName, setNewEntityName] = useState("");
  const [newEntityType, setNewEntityType] = useState("Brand");
  const [targetProjectId, setTargetProjectId] = useState("");

  const { success, error } = useToast();

  const fetchEntities = async () => {
    setIsLoading(true);
    try {
      const [projData, entData] = await Promise.all([
        api.getAeoProjects({ limit: 50 }),
        api.getAeoEntities({
          project_id: selectedProjectId || undefined,
          search: searchQuery || undefined,
        }),
      ]);
      setProjects(projData.projects || []);
      if (!targetProjectId && projData.projects?.length > 0) {
        setTargetProjectId(projData.projects[0].id);
      }
      setEntities(entData.entities || []);
      setTotal(entData.total || 0);
    } catch (err: any) {
      error("Failed to load entities", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [selectedProjectId, searchQuery]);

  const handleAddEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName || !targetProjectId) return;

    try {
      await api.createAeoEntity({
        project_id: targetProjectId,
        entity_name: newEntityName,
        entity_type: newEntityType,
      });
      success("Entity Added", "New knowledge entity registered");
      setIsAddModalOpen(false);
      setNewEntityName("");
      fetchEntities();
    } catch (err: any) {
      error("Failed to add entity", err.message);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Knowledge Graph Entities ({total})</h2>
            <p className="text-xs text-slate-500">
              Track brand, product, and topical entities indexed by LLM answer models.
            </p>
          </div>

          <Button
            size="sm"
            variant="aeo"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + Add Knowledge Entity
          </Button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search entity names..."
          onReset={() => setSearchQuery("")}
        />

        {/* Entities Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Entity Name</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4 text-center">AI Mentions</th>
                  <th className="py-3 px-4 text-right">Visibility Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                      <p className="mt-2 text-xs">Loading entities...</p>
                    </td>
                  </tr>
                ) : entities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <EmptyState
                        icon={<Boxes className="w-6 h-6 text-purple-500" />}
                        title="No Knowledge Entities Registered"
                        description="Add your brand and core product names to track their recognition in AI answer models."
                        actionLabel="+ Add Entity"
                        onAction={() => setIsAddModalOpen(true)}
                      />
                    </td>
                  </tr>
                ) : (
                  entities.map((ent) => (
                    <tr key={ent.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {ent.entity_name}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                          {ent.entity_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                        {ent.mentions_count}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-700">
                        {ent.visibility_rate}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-slate-900">Add Knowledge Entity</h3>
              <p className="text-xs text-slate-500">
                Register a brand entity to track recognition across AI answer engines.
              </p>

              <form onSubmit={handleAddEntity} className="space-y-4 pt-2">
                {projects.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Select Brand Project</label>
                    <select
                      value={targetProjectId}
                      onChange={(e) => setTargetProjectId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 font-medium"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.domain})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Entity Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe Payments, Stripe Connect"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Entity Type</label>
                  <select
                    value={newEntityType}
                    onChange={(e) => setNewEntityType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 font-medium"
                  >
                    <option value="Brand">Brand</option>
                    <option value="Product">Product</option>
                    <option value="Feature">Feature</option>
                    <option value="Topic">Topic</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="aeo" size="sm">
                    Add Entity
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
