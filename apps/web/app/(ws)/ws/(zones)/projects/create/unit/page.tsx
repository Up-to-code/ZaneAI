"use client";

import AgUnitCreateForm from "@/app/(ws)/ws/_components/AgUi/AgUnitCreateForm";
import { useMutation } from "convex/react";
import { api } from "@/lib/convexApi";

export default function CreateUnitPage() {
  const createProperty = useMutation(api.partnerProperties.createWorkspaceProperty);

  return (
    <AgUnitCreateForm
      title="إنشاء وحدة عقارية"
      description="أكمل بيانات الوحدة العقارية خطوة بخطوة لنشرها بأفضل شكل."
      submitLabel="حفظ الوحدة العقارية"
      cancelHref="/ws/projects"
      onCancel={() => {
        window.history.back();
      }}
      onSave={async (data) => {
        try {
          const result = await createProperty({
            name: data.name,
            location: data.location,
            description: data.description,
            shortDescription: data.description.slice(0, 150),
            price: data.price,
            rooms: data.rooms || "0",
            baths: data.baths || "0",
            area: data.area,
            status: "available",
            hasParking: Number(data.parking) > 0,
            parkingSpaces: data.parking || "0",
            amenitiesText: data.unitAmenities.join(", "),
            galleryDisplayMode: "cover",
            galleryAspectRatio: "landscape",
            privatePermitSummary: "",
            privatePermitFiles: [],
            clientVisibility: "public",
            images: [],
            // ── Egyptian Unit Fields ──
            unitType: data.unitType,
            listingType: data.listingType,
            finishingLevel: data.finishingLevel,
            floor: data.floor,
            payment: {
              method: data.paymentMethod,
              downPayment: data.downPayment || undefined,
              installmentYears: Number(data.installmentYears) || undefined,
              deliveryDate: data.deliveryDate || undefined,
            },
            nearbyPlaces: data.nearbyPlaces,
            adLicenseNumber: data.adLicenseNumber,
            registrationStatus: data.registrationStatus,
            rentalPeriod: data.rentalPeriod,
            // ── New Market Fields ──
            compoundName: data.compoundName || undefined,
            unitCode: data.unitCode || undefined,
            direction: data.direction || undefined,
            currency: data.currency || "EGP",
            maintenanceFees: data.maintenanceFees || undefined,
            monthlyInstallment: data.monthlyInstallment || undefined,
            reception: data.reception ? Number(data.reception) : undefined,
            negotiable: data.negotiable,
          });
          
          window.location.href = `/ws/projects/${result.propertyId}`;
          return { ok: true };
        } catch (error: any) {
          return { ok: false, feedback: { message: error.message || "حدث خطأ" } };
        }
      }}
    />
  );
}
