"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Project } from "@/lib/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";

export interface DeleteProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (projectId: string) => void;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!project) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteProject(project.id);
      success("Project Deleted", `Successfully removed ${project.name}`);
      onDeleted(project.id);
      onClose();
    } catch (err: any) {
      error("Delete Failed", err.message || "Could not delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Website Project"
      description="This action cannot be undone."
      maxWidth="sm"
    >
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-rose-950">
              Permanently delete {project.name}?
            </p>
            <p className="text-rose-700 text-[11.5px] leading-relaxed">
              All associated crawl data, page metadata, detected SEO issues, and optimization history for <span className="font-mono font-semibold text-rose-900">{project.domain}</span> will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-600 hover:text-slate-900"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
          >
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
};
