"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import AgUnitCreateForm, { type UnitPropertyFormData } from "@/app/(ws)/ws/_components/AgUi/AgUnitCreateForm";
import { api } from "@/lib/convexApi";
import type { Id } from "@convex/dataModel";

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function toCreateUnitArgs(projectId: string, data: UnitPropertyFormData) {
  return {
    projectId: projectId as Id<"projects">,
    label: data.name,
    unitType: data.unitType,
    listingType: data.listingType,
    floor: data.floor || undefined,
    bedrooms: data.rooms ? Number(data.rooms) : undefined,
    bathrooms: data.baths ? Number(data.baths) : undefined,
    area: data.area || undefined,
    priceLabel: data.price ? `${data.currency} ${data.price}` : undefined,
    status: "available" as const,
    description: data.description || undefined,
    finishingLevel: data.finishingLevel,
    paymentMethod: data.paymentMethod,
    downPayment: data.downPayment || undefined,
    installmentYears: data.installmentYears ? Number(data.installmentYears) : undefined,
    deliveryDate: data.deliveryDate || undefined,
    rentalPeriod: data.listingType === "rent" ? data.rentalPeriod : undefined,
    compoundName: data.compoundName || undefined,
    unitCode: data.unitCode || undefined,
    direction: data.direction || undefined,
    currency: data.currency === "USD" ? ("USD" as const) : ("EGP" as const),
    maintenanceFees: data.maintenanceFees || undefined,
    monthlyInstallment: data.monthlyInstallment || undefined,
    reception: data.reception ? Number(data.reception) : undefined,
    negotiable: data.negotiable,
    pricePerMeter: parseMoney(data.price),
  };
}

export default function CreateUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createUnit = useMutation(api.workspaceUnits.createUnit);
  const upsertCompliance = useMutation(api.workspaceUnits.upsertListingCompliance);
  const projects = useQuery(api.partnerProperties.listWorkspaceProperties, {});
  const projectOptions = useMemo(
    () => (Array.isArray(projects) ? projects : []),
    [projects],
  );

  if (projects === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm font-semibold text-[var(--workspace-muted)]">
        Loading workspace projects...
      </div>
    );
  }

  if (projectOptions.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-black text-foreground">Create a project first</h1>
        <p className="text-sm font-medium leading-6 text-[var(--workspace-muted)]">
          Units are published through a workspace project so buyers can verify location, developer, and compliance context.
        </p>
        <button
          type="button"
          onClick={() => router.push("/ws/projects/create/project")}
          className="rounded-full bg-foreground px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-background"
        >
          Create project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <AgUnitCreateForm
        title="إنشاء وحدة عقارية"
        description="أكمل بيانات الوحدة العقارية واربطها بمشروع موثق قبل النشر."
        submitLabel="حفظ الوحدة العقارية"
        cancelHref="/ws/projects"
        projectOptions={projectOptions}
        onCancel={() => router.back()}
        onSave={async (data) => {
          try {
            if (!data.projectId) throw new Error("يجب اختيار مشروع للوحدة");
            const result = await createUnit(toCreateUnitArgs(data.projectId, data));
            if (data.adLicenseNumber.trim()) {
              await upsertCompliance({
                unitId: result.unitId,
                projectId: data.projectId as Id<"projects">,
                adLicenseNumber: data.adLicenseNumber,
                registrationStatus: data.registrationStatus,
                privateNotes: data.documents.length ? `${data.documents.length} document(s) attached locally.` : undefined,
              });
            }
            router.push(`/ws/projects/${data.projectId}/units/${result.unitId}`);
            return { ok: true };
          } catch (error: unknown) {
            return {
              ok: false,
              feedback: { message: error instanceof Error ? error.message : "حدث خطأ" },
            };
          }
        }}
      />
    </div>
  );
}
