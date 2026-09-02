"use client";

import React, { useEffect, useState } from "react";
import {
  Boxes,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Tag,
  Eye,
  X,
  Bot,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Add Entity Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEntityName, setNewEntityName] = useState("");
  const [newEntityType, setNewEntityType] = useState("Brand");
  const [conceptsInput, setConceptsInput] = useState("");

  const { success, error } = useToast();

  const fetchEntities = async () => {
    setIsLoading(true);
    try {
      const [projData, entData] = await Promise.all([
        api.getAeoProjects({ limit: 50 }),
        api.getAeoEntities({
          project_id: selectedProjectId || undefined,
          entity_type: typeFilter !== "all" ? typeFilter : undefined,
          search: searchQuery || undefined,
        }),
      ]);
      const projList = projData.projects || [];
      setProjects(projList);
      if (!selectedProjectId && projList.length > 0) {
        setSelectedProjectId(projList[0].id);
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
  }, [selectedProjectId, typeFilter, searchQuery]);

  const handleAddEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim() || !selectedProjectId) return;

    const concepts = conceptsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await api.createAeoEntity({
        project_id: selectedProjectId,
        entity_name: newEntityName.trim(),
        entity_type: newEntityType,
        associated_concepts: concepts,
      });
      success("Entity Added", "New knowledge entity registered for tracking");
      setIsAddModalOpen(false);
      setNewEntityName("");
      setConceptsInput("");
      fetchEntities();
    } catch (err: any) {
      error("Failed to add entity", err.message);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Knowledge Graph & Entities ({total})</h2>
            </div>
            <p className="text-xs text-slate-500">
              Track brand, product, and topical entities recognized across AI knowledge bases and generative search responses.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {projects.length > 0 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            )}

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-8 shadow-xs"
            >
              Add Entity
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search entities or concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Entity Types</option>
              <option value="Brand">Brand</option>
              <option value="Product">Product</option>
              <option value="Topic">Topic / Category</option>
              <option value="Industry">Industry</option>
              <option value="Competitor">Competitor</option>
            </select>
          </div>
        </div>

        {/* Entities Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
            <p className="mt-3 text-xs">Loading knowledge graph entities...</p>
          </div>
        ) : entities.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-2 border-purple-200 bg-purple-50/20">
            <div className="max-w-md mx-auto space-y-3">
              <Boxes className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900">No Knowledge Entities Tracked</p>
              <p className="text-xs text-slate-500">
                Run an AEO analysis to auto-extract entities or register core brand products manually.
              </p>
              <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 text-white">
                Add Knowledge Entity
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {entities.map((entity) => (
              <Card
                key={entity.id}
                className="p-5 border-slate-200 hover:border-purple-300 bg-white space-y-3 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{entity.entity_name}</h3>
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 mt-1 inline-block">
                        {entity.entity_type}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">{entity.visibility_rate}%</span>
                      <span className="text-[10px] text-slate-400">Visibility</span>
                    </div>
                  </div>

                  {/* Associated Concepts */}
                  {entity.associated_concepts && entity.associated_concepts.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Associated Concepts:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {entity.associated_concepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Mentions: {entity.mentions_count}</span>
                  <span className="text-purple-600 font-medium">Knowledge Graph Node</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: Add Entity */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Add Knowledge Entity</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEntity} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Entity Name</label>
                  <input
                    type="text"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    placeholder="e.g. Acme Enterprise Search"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Entity Type</label>
                  <select
                    value={newEntityType}
                    onChange={(e) => setNewEntityType(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Brand">Brand</option>
                    <option value="Product">Product</option>
                    <option value="Topic">Topic</option>
                    <option value="Industry">Industry</option>
                    <option value="Competitor">Competitor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Associated Concepts (Comma-separated)</label>
                  <input
                    type="text"
                    value={conceptsInput}
                    onChange={(e) => setConceptsInput(e.target.value)}
                    placeholder="e.g. cloud search, ai indexer, llm connector"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary" className="bg-purple-600 text-white">
                    Save Entity
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
