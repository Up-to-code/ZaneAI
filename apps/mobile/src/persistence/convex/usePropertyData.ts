import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { useAuthSession } from "@/auth/useAuthSession";
import { api } from "@/persistence/convex/api";
import { toPropertyCardVM } from "@/persistence/convex/propertyAdapter";
import { mockProperties } from "@/persistence/mocks/mock-data";
import { useAppStore } from "@/store";
import type { PropertyCardVM } from "@/types/domain";

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
  const { isAuthenticated, isGuest } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eSavedPropertyIds = useAppStore((state) => state.e2eSavedPropertyIds);
  const guestMirrorSavedPropertyIds = useAppStore((state) => state.guestMirrorSavedPropertyIds);
  const setGuestMirrorSavedPropertyIds = useAppStore((state) => state.setGuestMirrorSavedPropertyIds);
  const syncSavedProperty = useMutation(api.property.public.toggleSavedProperty.toggleSavedProperty);
  const [syncingGuestSaves, setSyncingGuestSaves] = useState(false);
  const rows = useQuery(
    api.property.public.listSavedProperties.listSavedProperties,
    isAuthenticated && !e2eQaMode ? {} : "skip",
  );
  const mirroredRows = useQuery(
    api.property.public.listByIds.listByIds,
    !e2eQaMode && isGuest && guestMirrorSavedPropertyIds.length > 0
      ? { propertyExternalIds: guestMirrorSavedPropertyIds }
      : "skip",
  );

  useEffect(() => {
    if (e2eQaMode || !isGuest || rows === undefined) {
      return;
    }

    if (rows.length === 0 && guestMirrorSavedPropertyIds.length > 0) {
      return;
    }

    setGuestMirrorSavedPropertyIds(rows.map((row: any) => row.propertyExternalId));
  }, [e2eQaMode, guestMirrorSavedPropertyIds.length, isGuest, rows, setGuestMirrorSavedPropertyIds]);

  useEffect(() => {
    if (
      e2eQaMode
      || !isAuthenticated
      || !isGuest
      || rows === undefined
      || guestMirrorSavedPropertyIds.length === 0
      || syncingGuestSaves
    ) {
      return;
    }

    const existingIds = rows.map((row: any) => row.propertyExternalId);
    const missingIds = guestMirrorSavedPropertyIds.filter((propertyId) => !existingIds.includes(propertyId));

    if (missingIds.length === 0) {
      return;
    }

    let cancelled = false;
    setSyncingGuestSaves(true);

    void Promise.all(
      missingIds.map((propertyExternalId) => syncSavedProperty({ propertyExternalId })),
    ).finally(() => {
      if (!cancelled) {
        setSyncingGuestSaves(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    e2eQaMode,
    guestMirrorSavedPropertyIds,
    isAuthenticated,
    isGuest,
    rows,
    syncSavedProperty,
    syncingGuestSaves,
  ]);

  return useMemo(
    () => {
      if (e2eQaMode) {
        return e2eSavedPropertyIds.map((propertyId) => ({
          propertyExternalId: propertyId,
          property: mockProperties.find((property) => property.id === propertyId) ?? null,
        }));
      }

      if (rows !== undefined && !(rows.length === 0 && isGuest && guestMirrorSavedPropertyIds.length > 0)) {
        return rows.map((row: any) => ({
          ...row,
          property: row.property ? toPropertyCardVM(row.property) : null,
        }));
      }

      if (isGuest) {
        const mirroredProperties = (mirroredRows ?? []).map(toPropertyCardVM);
        return guestMirrorSavedPropertyIds.map((propertyExternalId) => ({
          propertyExternalId,
          property: mirroredProperties.find((property: PropertyCardVM) => property.id === propertyExternalId) ?? null,
        }));
      }

      return [];
    },
    [e2eQaMode, e2eSavedPropertyIds, guestMirrorSavedPropertyIds, isGuest, mirroredRows, rows],
  );
}
