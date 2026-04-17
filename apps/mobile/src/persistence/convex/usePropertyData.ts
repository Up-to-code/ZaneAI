import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { useAuthSession } from "@/auth/useAuthSession";
import { api } from "@/persistence/convex/api";
import { toPropertyCardVM } from "@/persistence/convex/propertyAdapter";
import { mockProperties } from "@/persistence/mocks/mock-data";
import { useAppStore } from "@/store";
import type { PropertyCardVM } from "@/types/domain";

function ensureArray<T>(value: unknown, label: string): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (__DEV__ && value !== undefined && value !== null) {
    console.warn(`[property] Expected array for ${label}`, value);
  }

  return [];
}

export function useCandidateProperties() {
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const rows = useQuery(
    api.listings.listCandidateListings,
    e2eQaMode ? "skip" : {},
  );

  return useMemo(() => {
    if (e2eQaMode) {
      return mockProperties;
    }

    return ensureArray<any>(rows, "listCandidateProperties").map(toPropertyCardVM);
  }, [e2eQaMode, rows]);
}

export function usePropertyById(propertyId: string | undefined) {
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const row = useQuery(
    api.listings.getListing,
    e2eQaMode || !propertyId ? "skip" : { listingId: propertyId },
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
    api.listings.listListingsByIds,
    e2eQaMode || propertyIds.length === 0 ? "skip" : { listingIds: propertyIds },
  );

  return useMemo(() => {
    if (e2eQaMode) {
      return mockProperties.filter((property) => propertyIds.includes(property.id));
    }

    return ensureArray<any>(rows, "listByIds").map(toPropertyCardVM);
  }, [e2eQaMode, propertyIds, rows]);
}

export function useSavedProperties() {
  const { isAuthenticated, isGuest } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eSavedPropertyIds = useAppStore((state) => state.e2eSavedPropertyIds);
  const guestMirrorSavedPropertyIds = useAppStore((state) => state.guestMirrorSavedPropertyIds);
  const setGuestMirrorSavedPropertyIds = useAppStore((state) => state.setGuestMirrorSavedPropertyIds);
  const syncSavedListing = useMutation(api.listings.toggleSavedListing);
  const [syncingGuestSaves, setSyncingGuestSaves] = useState(false);
  const rows = useQuery(
    api.listings.listSavedListings,
    isAuthenticated && !e2eQaMode ? {} : "skip",
  );
  const mirroredRows = useQuery(
    api.listings.listListingsByIds,
    !e2eQaMode && isGuest && guestMirrorSavedPropertyIds.length > 0
      ? { listingIds: guestMirrorSavedPropertyIds }
      : "skip",
  );

  useEffect(() => {
    if (e2eQaMode || !isGuest || rows === undefined) {
      return;
    }

    const savedRows = ensureArray<any>(rows, "listSavedProperties");

    if (savedRows.length === 0 && guestMirrorSavedPropertyIds.length > 0) {
      return;
    }

    setGuestMirrorSavedPropertyIds(savedRows.map((row: any) => row.listingId));
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

    const savedRows = ensureArray<any>(rows, "listSavedProperties");
    const existingIds = savedRows.map((row: any) => row.listingId);
    const missingIds = guestMirrorSavedPropertyIds.filter((propertyId) => !existingIds.includes(propertyId));

    if (missingIds.length === 0) {
      return;
    }

    let cancelled = false;
    setSyncingGuestSaves(true);

    void Promise.all(
      missingIds.map((listingId) => syncSavedListing({ listingId })),
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
    syncSavedListing,
    syncingGuestSaves,
  ]);

  return useMemo(
    () => {
      if (e2eQaMode) {
        return e2eSavedPropertyIds.map((propertyId) => ({
          listingId: propertyId,
          property: mockProperties.find((property) => property.id === propertyId) ?? null,
        }));
      }

      const savedRows = ensureArray<any>(rows, "listSavedProperties");

      if (rows !== undefined && !(savedRows.length === 0 && isGuest && guestMirrorSavedPropertyIds.length > 0)) {
        return savedRows.map((row: any) => ({
          ...row,
          listingId: row.listingId,
          property: row.property ? toPropertyCardVM(row.property) : null,
        }));
      }

      if (isGuest) {
        const mirroredProperties = ensureArray<any>(mirroredRows, "listByIds.mirrored").map(toPropertyCardVM);
        return guestMirrorSavedPropertyIds.map((listingId) => ({
          listingId,
          property: mirroredProperties.find((property: PropertyCardVM) => property.id === listingId) ?? null,
        }));
      }

      return [];
    },
    [e2eQaMode, e2eSavedPropertyIds, guestMirrorSavedPropertyIds, isGuest, mirroredRows, rows],
  );
}
