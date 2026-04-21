"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import type { Id } from "@convex/dataModel";

import AgUnitCreateForm, { type UnitPropertyFormData } from "@/app/(ws)/ws/_components/AgUi/AgUnitCreateForm";

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function toUpdateUnitArgs(unitId: string, data: UnitPropertyFormData) {
  return {
    unitId: unitId as Id<"units">,
    data: {
      label: data.name,
      unitType: data.unitType,
      listingType: data.listingType,
      floor: data.floor || undefined,
      bedrooms: data.rooms ? Number(data.rooms) : undefined,
      bathrooms: data.baths ? Number(data.baths) : undefined,
      area: data.area || undefined,
      priceLabel: data.price ? `${data.currency} ${data.price}` : undefined,
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
    }
  };
}

export default function EditUnitPage({
  params,
}: {
  params: Promise<{ projectId: string; unitId: string }>;
}) {
  const { projectId, unitId } = use(params);
  const router = useRouter();
  
  const unit = useQuery(api.workspaceUnits.getUnit, { unitId: unitId as Id<"units"> });
  const updateUnit = useMutation(api.workspaceUnits.updateUnit);
  const upsertCompliance = useMutation(api.workspaceUnits.upsertListingCompliance);

  if (unit === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm font-semibold text-[var(--workspace-muted)]">
        Loading unit details...
      </div>
    );
  }

  if (unit === null) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-black text-foreground">Unit not found</h1>
        <p className="text-sm font-medium leading-6 text-[var(--workspace-muted)]">
          This unit may have been deleted or you don't have permission to view it.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/ws/projects/${projectId}`)}
          className="rounded-full bg-foreground px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-background"
        >
          Back to Project
        </button>
      </div>
    );
  }

  // Extract raw price value from priceLabel (e.g. "EGP 4,500,000" -> "4500000")
  const rawPrice = unit.priceLabel ? unit.priceLabel.replace(/[^\d.]/g, "") : "";

  const initialData: Partial<UnitPropertyFormData> = {
    name: unit.label,
    compoundName: (unit as any).compoundName || "",
    unitCode: (unit as any).unitCode || "",
    location: "", // Usually set at project level
    unitType: unit.unitType as any,
    listingType: (unit as any).listingType || "sale",
    direction: (unit as any).direction || "north",
    reception: (unit as any).reception?.toString() || "",
    rooms: unit.bedrooms?.toString() || "",
    baths: unit.bathrooms?.toString() || "",
    area: unit.area || "",
    floor: unit.floor || "",
    finishingLevel: (unit as any).finishingLevel || "fully_finished",
    currency: (unit as any).currency || "EGP",
    price: rawPrice,
    maintenanceFees: (unit as any).maintenanceFees || "",
    monthlyInstallment: (unit as any).monthlyInstallment || "",
    negotiable: (unit as any).negotiable || false,
    paymentMethod: (unit as any).paymentMethod || "cash",
    downPayment: (unit as any).downPayment || "",
    installmentYears: (unit as any).installmentYears?.toString() || "",
    deliveryDate: (unit as any).deliveryDate || "",
    rentalPeriod: (unit as any).rentalPeriod || "month",
    description: unit.description || "",
  };

  return (
    <div className="space-y-6">
      <AgUnitCreateForm
        initialData={initialData}
        title="تعديل الوحدة العقارية"
        description="قم بتحديث بيانات الوحدة العقارية ومراجعة التفاصيل قبل الحفظ."
        submitLabel="حفظ التعديلات"
        cancelHref={`/ws/projects/${projectId}`}
        onCancel={() => router.back()}
        onSave={async (data) => {
          try {
            await updateUnit(toUpdateUnitArgs(unitId, data));
            if (data.adLicenseNumber.trim()) {
              await upsertCompliance({
                unitId: unitId as Id<"units">,
                projectId: projectId as Id<"projects">,
                adLicenseNumber: data.adLicenseNumber,
                registrationStatus: data.registrationStatus as any,
                privateNotes: data.documents?.length ? `${data.documents.length} document(s) attached locally.` : undefined,
              });
            }
            router.push(`/ws/projects/${projectId}/units/${unitId}`);
            return { ok: true };
          } catch (error: unknown) {
            return {
              ok: false,
              feedback: { message: error instanceof Error ? error.message : "حدث خطأ أثناء التحديث" },
            };
          }
        }}
      />
    </div>
  );
}
