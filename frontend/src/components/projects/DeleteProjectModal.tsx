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
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200 leading-relaxed">
            Are you sure you want to delete <strong>{project.name}</strong> (<code>{project.domain}</code>)? All scan history and lifecycle logs will be permanently deleted.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={handleDelete}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
