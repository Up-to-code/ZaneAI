"use client";
import AgUnitCard from "@/app/(ws)/ws/_components/Visuals/AgUnitCard";
import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { Plus, Pencil, Trash2, Building2, X } from "lucide-react";
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
}: {
  projectId: string;
  initialUnits?: UnitReference[];
}) {
  const { dictionary } = useWebLocale();
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

  if (units === undefined) {
    return (
      <section className="rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-5 lg:p-6">
        <div className="text-right">
          <h2 className="text-lg font-black text-foreground">{dictionary.units.title}</h2>
        </div>
        <div className="mt-5 flex items-center justify-center py-8">
          <div className="text-[13px] font-semibold text-[var(--workspace-muted)]">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-5 lg:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-foreground">{dictionary.units.manageUnits}</h2>
        <motion.button
          type="button"
          onClick={openCreateForm}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[11px] font-black uppercase tracking-widest text-background transition-colors"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          {dictionary.units.addUnit}
        </motion.button>
      </div>

      {/* ── Unit Form ────────────────────────────────────── */}
      <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 overflow-hidden rounded-2xl border border-[color:var(--workspace-border)] bg-background p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-black text-foreground">
              {editingUnitId ? dictionary.units.edit : dictionary.units.create}
            </h3>
            <button type="button" onClick={closeForm} className="text-muted-foreground hover:text-foreground transition">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Label */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.label}</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
                placeholder="e.g. Unit A-101"
              />
            </div>

            {/* Unit Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.type}</label>
              <select
                value={form.unitType}
                onChange={(e) => setForm({ ...form, unitType: e.target.value as UnitType })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t} value={t}>{getUnitTypeLabel(t, dictionary)}</option>
                ))}
              </select>
            </div>

            {/* Floor */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.floor}</label>
              <input
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
                placeholder="e.g. 3rd Floor"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.status}</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as UnitStatus })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
              >
                {UNIT_STATUSES.map((s) => (
                  <option key={s} value={s}>{getUnitStatusLabel(s, dictionary)}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.bedrooms}</label>
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
                min={0}
              />
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.bathrooms}</label>
              <input
                type="number"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
                min={0}
              />
            </div>

            {/* Area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.area}</label>
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
                placeholder="e.g. 185 sqm"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.price}</label>
              <input
                value={form.priceLabel}
                onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition"
                placeholder="e.g. EGP 4,200,000"
              />
            </div>

            {/* Description (full width) */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{dictionary.units.description}</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-semibold text-foreground outline-none focus:border-foreground/30 transition resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-border bg-background px-4 py-2 text-[12px] font-bold text-foreground transition hover:bg-muted"
            >
              {dictionary.units.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.label.trim()}
              className="rounded-xl bg-[var(--zane-ai-deep)] px-5 py-2 text-[12px] font-bold text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {saving ? "..." : dictionary.units.saveUnit}
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      {/* ── Units List ────────────────────────────────────── */}
      <div className="mt-5">
        {units.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
            <Building2 className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-[13px] font-semibold text-muted-foreground">{dictionary.units.noUnits}</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {units.map((unit: DisplayUnit) => (
              <AgUnitCard
                key={unit._id}
                id={unit._id}
                label={unit.label}
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
                onEdit={() => openEditForm(unit)}
                onDelete={() => handleDelete(unit._id)}
                isDeleting={deletingId === unit._id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
