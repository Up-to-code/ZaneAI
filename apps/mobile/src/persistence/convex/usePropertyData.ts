import { useMemo } from "react";
import { useQuery } from "convex/react";

import { api } from "@convex/_generated/api";
import { useAuthSession } from "@/auth/useAuthSession";
import { toPropertyCardVM } from "@/persistence/convex/propertyAdapter";
import { mockProperties } from "@/persistence/mocks/mock-data";
import { useAppStore } from "@/store";

export function useCandidateProperties() {
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const rows = useQuery(
    api.property.public.listCandidateProperties.listCandidateProperties,
    e2eQaMode ? "skip" : {},
  );

  return useMemo(() => {
    if (e2eQaMode) {
      return mockProperties;
    }

    return (rows ?? []).map(toPropertyCardVM);
  }, [e2eQaMode, rows]);
}

export function usePropertyById(propertyId: string | undefined) {
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const row = useQuery(
    api.property.public.getById.getById,
    e2eQaMode || !propertyId ? "skip" : { propertyExternalId: propertyId },
  );

  return useMemo(() => {
    if (e2eQaMode) {
      return mockProperties.find((property) => property.id === propertyId) ?? null;
    }

    return row ? toPropertyCardVM(row) : null;
  }, [e2eQaMode, propertyId, row]);
}

export function usePropertiesByIds(propertyIds: string[]) {
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const rows = useQuery(
    api.property.public.listByIds.listByIds,
    e2eQaMode || propertyIds.length === 0 ? "skip" : { propertyExternalIds: propertyIds },
  );

  return useMemo(() => {
    if (e2eQaMode) {
      return mockProperties.filter((property) => propertyIds.includes(property.id));
    }

    return (rows ?? []).map(toPropertyCardVM);
  }, [e2eQaMode, propertyIds, rows]);
}

export function useSavedProperties() {
  const { isAuthenticated } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eSavedPropertyIds = useAppStore((state) => state.e2eSavedPropertyIds);
  const rows = useQuery(
    api.property.public.listSavedProperties.listSavedProperties,
    isAuthenticated && !e2eQaMode ? {} : "skip",
  );

  return useMemo(
    () => {
      if (e2eQaMode) {
        return e2eSavedPropertyIds.map((propertyId) => ({
          propertyExternalId: propertyId,
          property: mockProperties.find((property) => property.id === propertyId) ?? null,
        }));
      }

      return (rows ?? []).map((row: any) => ({
        ...row,
        property: row.property ? toPropertyCardVM(row.property) : null,
      }));
    },
    [e2eQaMode, e2eSavedPropertyIds, rows],
  );
}
