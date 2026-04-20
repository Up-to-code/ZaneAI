"use client";
import AgUnitCard from "@/app/(ws)/ws/_components/Visuals/AgUnitCard";
import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { Plus, Pencil, Trash2, Building2, X, Search } from "lucide-react";
import type { UnitReference, UnitType, UnitStatus } from "@/app/(ws)/ws/_lib/entities";
import type { Id } from "@convex/dataModel";

const UNIT_TYPES: UnitType[] = ["apartment", "villa", "duplex", "studio", "penthouse", "townhouse", "commercial"];
const UNIT_STATUSES: UnitStatus[] = ["available", "reserved", "sold"];

const STATUS_BADGE: Record<UnitStatus, string> = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  reserved: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  sold: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300",
};

type DisplayUnit = UnitReference & {
  _id: string;
  unitType: UnitType;
  status: UnitStatus;
};

type UnitDictionary = {
  units: Partial<Record<UnitType | UnitStatus, string>>;
};

type UnitFormData = {
  label: string;
  unitType: UnitType;
  floor: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  priceLabel: string;
  status: UnitStatus;
  description: string;
};

const emptyForm: UnitFormData = {
  label: "",
  unitType: "apartment",
  floor: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  priceLabel: "",
  status: "available",
  description: "",
};

function getUnitTypeLabel(type: UnitType, dictionary: UnitDictionary): string {
  return dictionary.units[type] ?? type;
}

function getUnitStatusLabel(status: UnitStatus, dictionary: UnitDictionary): string {
  return dictionary.units[status] ?? status;
}

function mapReferenceToDisplayUnit(unit: UnitReference): DisplayUnit {
  return {
    ...unit,
    _id: unit.id,
    unitType: unit.unitType ?? "apartment",
    status: unit.status ?? "available",
  };
}

export default function ProjectUnitsManager({
  projectId,
  initialUnits,
  projectImage,
  projectLocation,
}: {
  projectId: string;
  initialUnits?: UnitReference[];
  projectImage?: string;
  projectLocation?: string;
}) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const usesInitialUnits = initialUnits !== undefined && projectId.startsWith("property-");
  const liveUnits = useQuery(
    api.workspaceUnits.listProjectUnits,
    usesInitialUnits ? "skip" : { projectId: projectId as Id<"projects"> },
  );
  const units = usesInitialUnits ? initialUnits.map(mapReferenceToDisplayUnit) : liveUnits;
  const createUnit = useMutation(api.workspaceUnits.createUnit);
  const updateUnit = useMutation(api.workspaceUnits.updateUnit);
  const deleteUnit = useMutation(api.workspaceUnits.deleteUnit);

  const [showForm, setShowForm] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [form, setForm] = useState<UnitFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreateForm() {
    setEditingUnitId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(unit: DisplayUnit) {
    setEditingUnitId(unit._id);
    setForm({
      label: unit.label,
      unitType: unit.unitType,
      floor: unit.floor ?? "",
      bedrooms: unit.bedrooms?.toString() ?? "",
      bathrooms: unit.bathrooms?.toString() ?? "",
      area: unit.area ?? "",
      priceLabel: unit.priceLabel ?? "",
      status: unit.status,
      description: unit.description ?? "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingUnitId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        label: form.label.trim(),
        unitType: form.unitType,
        floor: form.floor.trim() || undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        area: form.area.trim() || undefined,
        priceLabel: form.priceLabel.trim() || undefined,
        status: form.status,
        description: form.description.trim() || undefined,
      };

      if (editingUnitId) {
        if (usesInitialUnits) {
          closeForm();
          return;
        }
        await updateUnit({ unitId: editingUnitId as Id<"units">, data: payload });
      } else {
        if (usesInitialUnits) {
          closeForm();
          return;
        }
        await createUnit({ projectId: projectId as Id<"projects">, ...payload });
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(unitId: string) {
    if (usesInitialUnits) {
      return;
    }
    setDeletingId(unitId);
    try {
      await deleteUnit({ unitId: unitId as Id<"units"> });
    } finally {
      setDeletingId(null);
    }
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<UnitType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UnitStatus | "all">("all");

  const filteredUnits = units?.filter((u: DisplayUnit) => {
    if (typeFilter !== "all" && u.unitType !== typeFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        u.label.toLowerCase().includes(query) ||
        (u.description && u.description.toLowerCase().includes(query))
      );
    }
    return true;
  });

  if (units === undefined) {
    return (
      <div className="w-full">
        <div className="mt-5 flex min-h-[40vh] items-center justify-center py-8">
          <div className="text-[13px] font-semibold text-[var(--workspace-muted)]">Loading units...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10">
      {/* ── Luxury Control Bar ── */}
      <div className="flex flex-col gap-6 px-1">
        <div className="flex flex-col flex-wrap gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-30" />
              <input
                type="text"
                placeholder={isRtl ? "البحث عن الوحدات..." : "SEARCH UNITS..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] py-4 pl-11 pr-6 text-[11px] font-black tracking-widest text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04] placeholder:text-muted-foreground/30"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 outline-none transition hover:border-foreground/10 focus:border-foreground/20 focus:text-foreground"
              >
                <option value="all">{isRtl ? "كل الأنواع" : "ALL TYPES"}</option>
                {UNIT_TYPES.map((t) => (
                  <option key={t} value={t}>{getUnitTypeLabel(t, dictionary)}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 outline-none transition hover:border-foreground/10 focus:border-foreground/20 focus:text-foreground"
              >
                <option value="all">{isRtl ? "كل الحالات" : "ALL STATUSES"}</option>
                {UNIT_STATUSES.map((s) => (
                  <option key={s} value={s}>{getUnitStatusLabel(s, dictionary)}</option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={openCreateForm}
            whileTap={{ scale: 0.95 }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-10 py-4.5 text-[10px] font-black uppercase tracking-[0.3em] text-background transition-all hover:bg-foreground/90 active:scale-95"
          >
            <Plus className="h-3 w-3" strokeWidth={5} />
            {isRtl ? "إضافة وحدة" : "ADD ASSET"}
          </motion.button>
        </div>
      </div>

      {/* ── Unit Form ────────────────────────────────────── */}
      <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 overflow-hidden rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-black tracking-tight text-foreground">
              {editingUnitId ? dictionary.units.edit : dictionary.units.create}
            </h3>
            <button type="button" onClick={closeForm} className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition hover:bg-muted text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Label */}
            <div className="flex flex-col gap-2 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.label}</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04] placeholder:text-muted-foreground/20"
                placeholder="e.g. Unit A-101"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.price}</label>
              <input
                value={form.priceLabel}
                onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04] placeholder:text-muted-foreground/20"
                placeholder="e.g. EGP 4,200,000"
              />
            </div>

            {/* Unit Type */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.type}</label>
              <select
                value={form.unitType}
                onChange={(e) => setForm({ ...form, unitType: e.target.value as UnitType })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04]"
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t} value={t}>{getUnitTypeLabel(t, dictionary)}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.status}</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as UnitStatus })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04]"
              >
                {UNIT_STATUSES.map((s) => (
                  <option key={s} value={s}>{getUnitStatusLabel(s, dictionary)}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.bedrooms}</label>
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04]"
                min={0}
              />
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.bathrooms}</label>
              <input
                type="number"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04]"
                min={0}
              />
            </div>
            
            {/* Floor */}
            <div className="flex flex-col gap-2 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.floor}</label>
              <input
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04]"
                placeholder="e.g. 3rd Floor"
              />
            </div>
            
            {/* Area */}
            <div className="flex flex-col gap-2 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.area}</label>
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04]"
                placeholder="e.g. 185 sqm"
              />
            </div>

            {/* Description (full width) */}
            <div className="flex flex-col gap-2 lg:col-span-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{dictionary.units.description}</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-5 py-4 text-[13px] font-bold text-foreground outline-none transition focus:border-foreground/10 focus:bg-foreground/[0.04] resize-none placeholder:text-muted-foreground/20"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-foreground/[0.06] bg-transparent px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 transition hover:bg-foreground/[0.02] hover:text-foreground"
            >
              {dictionary.units.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.label.trim()}
              className="rounded-full bg-foreground px-10 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
            >
              {saving ? "..." : dictionary.units.saveUnit}
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      
      {/* ── Units Grid ────────────────────────────────────── */}
      <div className="mt-2">
        {!filteredUnits || filteredUnits.length === 0 ? (
          <div className="flex min-h-[40vh] w-full flex-col items-center justify-center rounded-[32px] border border-dashed border-[var(--workspace-border)] bg-[var(--workspace-panel)] px-8 py-16 text-center">
            <Building2 className="mb-4 h-12 w-12 text-[var(--workspace-highlight)]/40" />
            <h3 className="text-xl font-black text-foreground">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all" 
                ? "No matching units found" 
                : dictionary.units.noUnits}
            </h3>
            <p className="mt-2 text-[14px] text-muted-foreground">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all" 
                ? "Adjust your filters or clear search to see results." 
                : "Get started by adding your first unit to this project."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit: DisplayUnit) => (
              <AgUnitCard
                key={unit._id}
                id={unit._id}
                label={unit.label}
                projectId={projectId}
                unitType={unit.unitType}
                typeLabel={getUnitTypeLabel(unit.unitType, dictionary)}
                floor={unit.floor}
                bedrooms={unit.bedrooms}
                bathrooms={unit.bathrooms}
                area={unit.area}
                priceLabel={unit.priceLabel}
                description={unit.description}
                status={unit.status}
                statusLabel={getUnitStatusLabel(unit.status, dictionary)}
                fallbackImage={projectImage}
                location={projectLocation}
                onEdit={() => openEditForm(unit)}
                onDelete={() => handleDelete(unit._id)}
                isDeleting={deletingId === unit._id}
                variant="vertical"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
