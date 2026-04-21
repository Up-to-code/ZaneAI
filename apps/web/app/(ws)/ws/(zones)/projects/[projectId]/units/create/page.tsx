"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/lib/convexApi";
import type { Id } from "@convex/dataModel";

import AgUnitCreateForm, { type UnitPropertyFormData } from "@/app/(ws)/ws/_components/AgUi/AgUnitCreateForm";

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
    finishingLevel: data.finishingLevel as any,
    paymentMethod: data.paymentMethod as any,
    downPayment: data.downPayment || undefined,
    installmentYears: data.installmentYears ? Number(data.installmentYears) : undefined,
    deliveryDate: data.deliveryDate || undefined,
    rentalPeriod: data.listingType === "rent" ? (data.rentalPeriod as any) : undefined,
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

export default function ProjectUnitCreatePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();
  
  const createUnit = useMutation(api.workspaceUnits.createUnit);
  const upsertCompliance = useMutation(api.workspaceUnits.upsertListingCompliance);

  return (
    <div className="space-y-6">
      <AgUnitCreateForm
        title="إنشاء وحدة عقارية"
        description="أكمل بيانات الوحدة العقارية ليتم إضافتها مباشرة إلى هذا المشروع."
        submitLabel="حفظ الوحدة العقارية"
        cancelHref={`/ws/projects/${projectId}`}
        onCancel={() => router.back()}
        onSave={async (data) => {
          try {
            const result = await createUnit(toCreateUnitArgs(projectId, data));
            if (data.adLicenseNumber.trim()) {
              await upsertCompliance({
                unitId: result.unitId,
                projectId: projectId as Id<"projects">,
                adLicenseNumber: data.adLicenseNumber,
                registrationStatus: data.registrationStatus as any,
                privateNotes: data.documents?.length ? `${data.documents.length} document(s) attached locally.` : undefined,
              });
            }
            router.push(`/ws/projects/${projectId}/units/${result.unitId}`);
            return { ok: true };
          } catch (error: unknown) {
            return {
              ok: false,
              feedback: { message: error instanceof Error ? error.message : "حدث خطأ أثناء الإنشاء" },
            };
          }
        }}
      />
    </div>
  );
}
