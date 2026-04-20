"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { AgDeleteConfirmModal, AgPropertyForm, type ProjectFormData } from "@/app/(ws)/ws/public";
import type { ProjectFormActionResult, ProjectFormSaveResult } from "./projectFormSubmission";

type ProjectFormScreenProps = {
  projectId?: string;
  initialData?: Partial<ProjectFormData>;
  title: string;
  description: string;
  submitLabel: string;
  onSave: (data: ProjectFormData) => Promise<ProjectFormActionResult>;
  onDelete?: () => Promise<{ redirectTo: string }>;
  onRevokeViewer?: (viewerAuthUserId: string) => Promise<void>;
};

function ProjectDeleteModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { dictionary } = useWebLocale();
  return (
    <AgDeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={dictionary.projects.deleteTitle}
      description={dictionary.projects.deleteDescription}
      confirmLabel={dictionary.projects.deleteConfirm}
    />
  );
}

function useProjectFormActions(args: {
  projectId?: string;
  onSave: (data: ProjectFormData) => Promise<ProjectFormActionResult>;
  onDelete?: () => Promise<{ redirectTo: string }>;
  onRevokeViewer?: (viewerAuthUserId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const cancelHref = args.projectId ? `/ws/projects/${args.projectId}` : "/ws/projects";
  const handleSave = async (data: ProjectFormData): Promise<ProjectFormSaveResult> => {
    const result = await args.onSave(data);
    if (!result.ok) {
      return result;
    }

    startTransition(() => router.push(result.redirectTo));
    return { ok: true };
  };
  const handleDeleteConfirm = () => {
    if (!args.onDelete) return;
    const onDelete = args.onDelete;
    startTransition(async () => router.push((await onDelete()).redirectTo));
  };
  const handleCancel = () => router.push(cancelHref);
  return {
    pending,
    showDeleteModal,
    handleSave,
    handleCancel,
    handleDeleteConfirm,
    openDeleteModal: () => setShowDeleteModal(true),
    closeDeleteModal: () => setShowDeleteModal(false),
  };
}

function ProjectFormLayout(args: {
  projectId?: string;
  initialData?: Partial<ProjectFormData>;
  title: string;
  description: string;
  submitLabel: string;
  cancelHref: string;
  pending: boolean;
  onSave: (data: ProjectFormData) => Promise<ProjectFormSaveResult>;
  onCancel: () => void;
  onDelete?: () => void;
  onRevokeViewer?: (viewerAuthUserId: string) => Promise<void>;
  showDeleteModal: boolean;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
}) {
  const { dictionary } = useWebLocale();

  return (
    <>
      <AgPropertyForm
        propertyId={args.projectId}
        initialData={args.initialData}
        title={args.title}
        description={args.description}
        submitLabel={args.pending ? dictionary.projectForm.saving : args.submitLabel}
        onSave={args.onSave}
        onCancel={args.onCancel}
        cancelHref={args.cancelHref}
        onDelete={args.onDelete}
        onRevokeViewer={args.onRevokeViewer}
      />
      {args.onDelete ? (
        <ProjectDeleteModal open={args.showDeleteModal} onClose={args.onDeleteClose} onConfirm={args.onDeleteConfirm} />
      ) : null}
    </>
  );
}

export default function ProjectFormScreen({
  projectId,
  initialData,
  title,
  description,
  submitLabel,
  onSave,
  onDelete,
  onRevokeViewer,
}: ProjectFormScreenProps) {
  const {
    pending,
    showDeleteModal,
    handleSave,
    handleCancel,
    handleDeleteConfirm,
    openDeleteModal,
    closeDeleteModal,
  } = useProjectFormActions({ projectId, onSave, onDelete, onRevokeViewer });

  return (
    <ProjectFormLayout
      projectId={projectId}
      initialData={initialData}
      title={title}
      description={description}
      submitLabel={submitLabel}
      cancelHref={projectId ? `/ws/projects/${projectId}` : "/ws/projects"}
      pending={pending}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={onDelete ? openDeleteModal : undefined}
      onRevokeViewer={onRevokeViewer}
      showDeleteModal={showDeleteModal}
      onDeleteClose={closeDeleteModal}
      onDeleteConfirm={handleDeleteConfirm}
    />
  );
}
