"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Play,
  Trash2,
  ExternalLink,
  ChevronRight,
  Clock,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScanStatusBadge } from "@/components/scans/ScanStatusBadge";
import { Project } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";
import { StartAuditModal } from "@/components/scans/StartAuditModal";

export interface ProjectCardProps {
  project: Project;
  onDeleteRequest: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDeleteRequest,
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <>
      <Card hoverable className="flex flex-col justify-between h-full p-5 group border-slate-800/80">
        <div>
          {/* Top header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-900 border border-slate-700/80 flex items-center justify-center text-primary-400 shrink-0 group-hover:border-primary-500/40 transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm font-bold text-slate-100 hover:text-primary-400 transition-colors truncate block"
                >
                  {project.name}
                </Link>
                <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
                  <span>{project.domain}</span>
                  <a
                    href={`https://${project.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-300 p-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeleteRequest(project)}
              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Latest Scan Status */}
          <div className="p-3 rounded-xl bg-surface-950/60 border border-slate-850 my-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Activity className="w-3 h-3 text-slate-500" /> Latest Scan:
              </span>
              {project.latest_scan ? (
                <ScanStatusBadge status={project.latest_scan.status} size="sm" />
              ) : (
                <span className="text-slate-500 italic">No scans yet</span>
              )}
            </div>

            {project.latest_scan && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="truncate max-w-[140px]">
                  {project.latest_scan.current_step}
                </span>
                <span className="shrink-0 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {formatTimeAgo(project.latest_scan.created_at)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAuditModalOpen(true)}
            leftIcon={<Play className="w-3 h-3 text-primary-400" />}
            className="text-xs py-1.5 px-3"
          >
            Start Audit
          </Button>

          <Link href={`/projects/${project.id}`}>
            <Button
              size="sm"
              variant="secondary"
              rightIcon={<ChevronRight className="w-3 h-3" />}
              className="text-xs py-1.5 px-3"
            >
              Overview
            </Button>
          </Link>
        </div>
      </Card>

      <StartAuditModal
        project={project}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </>
  );
};
