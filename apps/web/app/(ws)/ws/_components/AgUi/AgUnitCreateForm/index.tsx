"use client";

import { useState, useTransition, useMemo, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { formatWebCopy } from "@/lib/i18n";
import { 
  Building, Home, Layers, Layout, Building2, Store, Palmtree, 
  Bed, Bath, Move, ChevronUp, Car, Sparkles, Receipt, Calendar, 
  CheckCircle2, MapPin, FileText, Camera, 
  Video, Paperclip, AlertCircle, Info, Trash2, Plus, 
  CreditCard, Wind, DoorClosed, 
  Utensils, Wifi, Mic2, ArrowUpDown, ShieldCheck, Sun, Image, 
  X, Maximize2, Dumbbell, type LucideIcon
} from "lucide-react";
import type { UnitType, ListingType } from "@/app/(ws)/ws/_lib/entities";
import ZonePageIntro from "../../ZoneShell/ZonePageIntro";
import { AgPropertyFormHeaderActions } from "../AgPropertyFormHeaderActions";
import { TextInput, TextArea, FieldLabel } from "../AgPropertyForm/controls";

/* ═══════════════════════════════════════════════════════════
   DATA MODEL
   ═══════════════════════════════════════════════════════════ */

export type UnitPropertyFormData = {
  /* Step 1: Identity */
  name: string;
  location: string;
  unitType: UnitType;
  listingType: ListingType;
  /* Step 2: Specs */
  rooms: string;
  baths: string;
  area: string;
  floor: string;
  parking: string;
  finishingLevel: "core_shell" | "semi_finished" | "fully_finished" | "extra_super_lux" | "furnished";
  /* Step 3: Pricing */
  price: string;
  paymentMethod: "cash" | "installments" | "cash_or_installments";
  downPayment: string;
  installmentYears: string;
  deliveryDate: string;
  rentalPeriod: "day" | "week" | "month" | "year";
  /* Step 4: Amenities & Nearby */
  unitAmenities: string[];
  nearbyPlaces: { name: string; distance: string }[];
  /* Step 5: Media */
  images: { id: string; url: string; file?: File; isCover?: boolean }[];
  videoUrl: string;
  /* Step 6: Documents */
  documents: { id: string; name: string; type: string; file?: File; fileKey?: string }[];
  /* Step 7: Legal & Review */
  description: string;
  adLicenseNumber: string;
  registrationStatus: "registered" | "not_registered" | "pending";
};

export type AgUnitFormProps = {
  initialData?: Partial<UnitPropertyFormData>;
  title?: string;
  description?: string;
  submitLabel?: string;
  onSave: (data: UnitPropertyFormData) => Promise<{ ok: boolean; feedback?: { message: string } }>;
  onCancel?: () => void;
  cancelHref: string;
};

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const TOTAL_STEPS = 7;

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.96, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.96, filter: "blur(6px)" }),
};
const staggerContainer: Variants = { center: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const staggerItem: Variants = {
  enter: { opacity: 0, y: 20, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

 export default function AgUnitCreateForm({
  initialData,
  title,
  description,
  submitLabel,
  onSave,
  onCancel,
  cancelHref,
}: AgUnitFormProps) {
  const { dictionary, isRtl } = useWebLocale();
  const uc = dictionary.unitCreate;

  /* ═══════════════════════════════════════════════════════════
     LOCALE-AWARE CONSTANTS
     ═══════════════════════════════════════════════════════════ */

  const UNIT_TYPES: { value: UnitType; label: string; icon: LucideIcon }[] = [
    { value: "apartment", label: dictionary.units.apartment, icon: Building },
    { value: "villa", label: dictionary.units.villa, icon: Home },
    { value: "duplex", label: dictionary.units.duplex, icon: Layers },
    { value: "studio", label: dictionary.units.studio, icon: Layout },
    { value: "penthouse", label: dictionary.units.penthouse, icon: Building2 },
    { value: "townhouse", label: dictionary.units.townhouse, icon: Home },
    { value: "chalet", label: dictionary.units.chalet, icon: Palmtree },
    { value: "commercial", label: dictionary.units.commercial, icon: Store },
  ];

  const LISTING_TYPES = [
    { value: "sale", label: dictionary.homeSearch.buy },
    { value: "rent", label: dictionary.homeSearch.rent },
  ] as const;

  const RENTAL_PERIODS = [
    { value: "day", label: uc.rentalPeriods.day },
    { value: "week", label: uc.rentalPeriods.week },
    { value: "month", label: uc.rentalPeriods.month },
    { value: "year", label: uc.rentalPeriods.year },
  ] as const;

  const FINISHING_LEVELS = [
    { value: "core_shell", label: uc.finishingLevels.core_shell },
    { value: "semi_finished", label: uc.finishingLevels.semi_finished },
    { value: "fully_finished", label: uc.finishingLevels.fully_finished },
    { value: "extra_super_lux", label: uc.finishingLevels.extra_super_lux },
    { value: "furnished", label: uc.finishingLevels.furnished },
  ] as const;

  const PAYMENT_METHODS = [
    { value: "cash", label: uc.paymentMethods.cash },
    { value: "installments", label: uc.paymentMethods.installments },
    { value: "cash_or_installments", label: uc.paymentMethods.cash_or_installments },
  ] as const;

  const REGISTRATION_OPTIONS = [
    { value: "registered", label: uc.registrationOptions.registered },
    { value: "not_registered", label: uc.registrationOptions.not_registered },
    { value: "pending", label: uc.registrationOptions.pending },
  ] as const;

  const DISTANCE_OPTIONS = [
    uc.distances.less_than_5,
    uc.distances.five_to_ten,
    uc.distances.ten_to_twenty,
    uc.distances.more_than_twenty,
  ] as const;

  const AMENITY_ICONS: Record<string, LucideIcon> = {
    [uc.amenities.ac]: Wind,
    [uc.amenities.balcony]: Layout,
    [uc.amenities.dressing]: DoorClosed,
    [uc.amenities.kitchen]: Utensils,
    [uc.amenities.heater]: Sparkles,
    [uc.amenities.internet]: Wifi,
    [uc.amenities.intercom]: Mic2,
    [uc.amenities.elevator]: ArrowUpDown,
    [uc.amenities.security_cameras]: Camera,
    [uc.amenities.armored_door]: ShieldCheck,
    [uc.amenities.solar_power]: Sun,
    [uc.amenities.gym]: Dumbbell,
  };

  const SHARED_AMENITY_LABELS = [
    uc.amenities.ac, uc.amenities.balcony, uc.amenities.dressing,
    uc.amenities.kitchen, uc.amenities.heater, uc.amenities.internet,
    uc.amenities.intercom, uc.amenities.elevator, uc.amenities.security_cameras,
    uc.amenities.armored_door, uc.amenities.solar_power, uc.amenities.gym
  ];

  const [pending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<UnitPropertyFormData>({
    name: initialData?.name ?? "",
    location: initialData?.location ?? "",
    unitType: initialData?.unitType ?? "apartment",
    listingType: initialData?.listingType ?? "sale",
    rooms: initialData?.rooms?.toString() ?? "",
    baths: initialData?.baths?.toString() ?? "",
    area: initialData?.area ?? "",
    floor: initialData?.floor ?? "",
    parking: initialData?.parking?.toString() ?? "",
    finishingLevel: initialData?.finishingLevel ?? "fully_finished",
    price: initialData?.price ?? "",
    paymentMethod: initialData?.paymentMethod ?? "cash",
    downPayment: initialData?.downPayment ?? "",
    installmentYears: initialData?.installmentYears?.toString() ?? "",
    deliveryDate: initialData?.deliveryDate ?? "",
    rentalPeriod: (initialData as any)?.rentalPeriod ?? "month",
    unitAmenities: initialData?.unitAmenities ?? [],
    nearbyPlaces: initialData?.nearbyPlaces ?? [],
    images: initialData?.images ?? [],
    videoUrl: initialData?.videoUrl ?? "",
    documents: initialData?.documents ?? [],
    description: initialData?.description ?? "",
    adLicenseNumber: initialData?.adLicenseNumber ?? "",
    registrationStatus: initialData?.registrationStatus ?? "not_registered",
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  /* Dynamic amenities base */
  const availableAmenities = useMemo(() => {
    const base = SHARED_AMENITY_LABELS;
    switch (formData.unitType) {
      case "villa": case "townhouse": return [...base, ...uc.amenities.villa];
      case "apartment": case "duplex": case "penthouse": case "studio": return [...base, ...uc.amenities.apartment];
      case "chalet": return [...base, ...uc.amenities.chalet];
      case "commercial": return [...base, ...uc.amenities.commercial];
      default: return base;
    }
  }, [formData.unitType, uc.amenities, SHARED_AMENITY_LABELS]);

  const canPublish = Boolean(
    formData.name.trim() &&
    formData.location.trim() &&
    formData.price.trim() &&
    formData.area.trim() &&
    formData.adLicenseNumber.trim()
  );

  const handleNext = () => {
    if (activeStep === 1 && !formData.name.trim()) {
      setFeedback(uc.feedbackEmptyName); return;
    }
    setFeedback(null);
    setDirection(1);
    setActiveStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const handlePrev = () => { setDirection(-1); setActiveStep((s) => Math.max(s - 1, 1)); };

  const handleSubmit = async () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await onSave(formData);
      if (!result.ok) setFeedback(result.feedback?.message ?? uc.feedbackUnexpectedError);
    });
  };

  const toggleAmenity = (item: string) => {
    const c = formData.unitAmenities;
    setFormData({ ...formData, unitAmenities: c.includes(item) ? c.filter((v) => v !== item) : [...c, item] });
  };

  const toggleNearbyPlace = (name: string) => {
    const existing = formData.nearbyPlaces.find((p) => p.name === name);
    if (existing) {
      setFormData({ ...formData, nearbyPlaces: formData.nearbyPlaces.filter((p) => p.name !== name) });
    } else {
      setFormData({ ...formData, nearbyPlaces: [...formData.nearbyPlaces, { name, distance: DISTANCE_OPTIONS[0] }] });
    }
  };

  const setNearbyDistance = (name: string, distance: string) => {
    setFormData({ ...formData, nearbyPlaces: formData.nearbyPlaces.map((p) => p.name === name ? { ...p, distance } : p) });
  };

  const removeImage = (id: string) => setFormData({ ...formData, images: formData.images.filter(img => img.id !== id) });
  const removeDoc = (id: string) => setFormData({ ...formData, documents: formData.documents.filter(doc => doc.id !== id) });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file,
      isCover: formData.images.length === 0
    }));
    
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newDocs = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type,
      file
    }));
    
    setFormData({ ...formData, documents: [...formData.documents, ...newDocs] });
  };

  /* ═══════════════ RENDER ═══════════════ */

  return (
    <div className="relative flex h-full w-full flex-col pb-12">
      <ZonePageIntro
        eyebrow={uc.eyebrow}
        title={title ?? uc.title}
        description={description ?? uc.description}
        actions={<AgPropertyFormHeaderActions onCancel={onCancel} cancelHref={cancelHref} />}
      />

      <div className={`mx-auto mt-6 flex w-full max-w-3xl items-center justify-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
          <motion.div
            key={n}
            layout
            className={`h-2 rounded-full ${activeStep === n ? "bg-[var(--workspace-highlight)]" : activeStep > n ? "bg-foreground/40" : "bg-[var(--workspace-border)]"}`}
            animate={{ width: activeStep === n ? 48 : 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        ))}
      </div>

      <div className="mx-auto mt-8 w-full max-w-3xl flex-1 pb-36 pt-4 overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        <AnimatePresence mode="wait" initial={false}>
          {feedback && (
            <motion.div key="fb" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mb-8 rounded-[24px] bg-rose-500/10 px-6 py-4 text-[15px] font-bold text-rose-500 border border-rose-500/20 ${isRtl ? "text-right" : "text-left"}`}>
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══ STEP 1: Identity ═══ */}
          {activeStep === 1 && (
            <motion.div key="s1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>{formatWebCopy(uc.stepXofY, { step: "1", total: "7" })}</FieldLabel>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-foreground lg:text-3xl">{uc.unitDefinition}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">{uc.unitDefinitionDesc}</p>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <TextInput placeholder={uc.unitTitlePlaceholder} value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} disabled={pending} />
                  <TextInput placeholder={uc.locationPlaceholder} value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} disabled={pending} />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>{uc.listingTypeLabel}</FieldLabel>
                  <div className="flex gap-3">
                    {LISTING_TYPES.map((lt) => {
                      const active = formData.listingType === lt.value;
                      return (
                        <motion.button key={lt.value} type="button" onClick={() => setFormData({ ...formData, listingType: lt.value })} disabled={pending} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }} layout
                          className={`flex-1 rounded-[24px] py-4 text-[15px] font-black tracking-tight transition-all border-2 ${active ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10" : "border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                          {lt.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>{uc.unitTypeLabel}</FieldLabel>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {UNIT_TYPES.map((ut, idx) => {
                      const active = formData.unitType === ut.value;
                      const Icon = ut.icon;
                      return (
                        <motion.button key={ut.value} type="button" onClick={() => setFormData({ ...formData, unitType: ut.value })} disabled={pending}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04, duration: 0.35 }}
                          whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.93 }}
                          className={`flex flex-col items-center gap-3 rounded-[28px] px-4 py-6 text-[13px] font-black tracking-tight transition-all border-2 ${active ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10" : "border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                          <Icon size={28} strokeWidth={active ? 2.5 : 1.5} className={active ? "text-background" : "text-[var(--workspace-highlight)]"} />
                          {ut.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 2: Specs ═══ */}
          {activeStep === 2 && (
            <motion.div key="s2" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>{formatWebCopy(uc.stepXofY, { step: "2", total: "7" })}</FieldLabel>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-foreground lg:text-3xl">{uc.unitSpecs}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">{uc.unitSpecsDesc}</p>
                </motion.div>

                <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3" variants={staggerItem}>
                  {formData.unitType !== "studio" && (
                    <div className="relative"><Bed className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="number" placeholder={uc.roomsPlaceholder} value={formData.rooms} onChange={(v) => setFormData({ ...formData, rooms: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                  )}
                  <div className="relative"><Bath className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="number" placeholder={uc.bathsPlaceholder} value={formData.baths} onChange={(v) => setFormData({ ...formData, baths: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                  <div className="relative"><Move className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="text" placeholder={uc.areaPlaceholder} value={formData.area} onChange={(v) => setFormData({ ...formData, area: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                  {formData.unitType !== "villa" && formData.unitType !== "townhouse" && (
                    <div className="relative"><ChevronUp className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="text" placeholder={uc.floorPlaceholder} value={formData.floor} onChange={(v) => setFormData({ ...formData, floor: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                  )}
                  <div className="relative"><Car className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="number" placeholder={uc.parkingPlaceholder} value={formData.parking} onChange={(v) => setFormData({ ...formData, parking: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>{uc.finishingLevelLabel}</FieldLabel>
                  <div className="flex flex-wrap gap-3">
                    {FINISHING_LEVELS.map((fl) => {
                      const active = formData.finishingLevel === fl.value;
                      return (
                        <motion.button key={fl.value} type="button" onClick={() => setFormData({ ...formData, finishingLevel: fl.value })} disabled={pending}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }} layout
                          className={`rounded-full px-6 py-3 text-[14px] font-black tracking-tight transition-all border ${active ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10" : "bg-[var(--workspace-panel)] border-[var(--workspace-border)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                          {fl.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 3: Pricing ═══ */}
          {activeStep === 3 && (
            <motion.div key="s3" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>{formatWebCopy(uc.stepXofY, { step: "3", total: "7" })}</FieldLabel>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-foreground lg:text-3xl">{uc.pricingTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">
                    {formData.listingType === "rent" ? uc.pricingDescRent : uc.pricingDescSale}
                  </p>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <div className="relative">
                    <CreditCard className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} />
                    <TextInput 
                      type="text" 
                      placeholder={
                        formData.listingType === "rent" 
                          ? formatWebCopy(uc.pricePlaceholderRent, { period: RENTAL_PERIODS.find(p => p.value === formData.rentalPeriod)?.label || "" })
                          : uc.pricePlaceholderSale
                      } 
                      value={formData.price} 
                      onChange={(v) => setFormData({ ...formData, price: v })} 
                      disabled={pending} 
                      className={`${isRtl ? "pr-11" : "pl-11"} text-xl font-black`} 
                    />
                  </div>
                </motion.div>

                {formData.listingType === "rent" && (
                  <motion.div variants={staggerItem}>
                    <FieldLabel>{uc.rentalPeriodLabel}</FieldLabel>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {RENTAL_PERIODS.map((rp, idx) => {
                        const active = formData.rentalPeriod === rp.value;
                        return (
                          <motion.button 
                            key={rp.value} 
                            type="button" 
                            onClick={() => setFormData({ ...formData, rentalPeriod: rp.value })} 
                            disabled={pending}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04, duration: 0.35 }}
                            whileHover={{ scale: 1.04, y: -2 }} 
                            whileTap={{ scale: 0.93 }} 
                            className={`flex flex-col items-center justify-center rounded-[24px] py-6 text-[14px] font-black tracking-tight transition-all border-2 ${active ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10" : "border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                            <Calendar size={20} className={`mb-2 ${active ? "text-background" : "text-[var(--workspace-highlight)]"}`} />
                            {rp.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {formData.listingType === "sale" && (
                  <>
                    <motion.div variants={staggerItem}>
                      <FieldLabel>{uc.paymentMethodLabel}</FieldLabel>
                      <div className="flex flex-wrap gap-3">
                        {PAYMENT_METHODS.map((pm) => {
                          const active = formData.paymentMethod === pm.value;
                          return (
                            <motion.button key={pm.value} type="button" onClick={() => setFormData({ ...formData, paymentMethod: pm.value })} disabled={pending}
                              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }} layout
                              className={`rounded-full px-7 py-3 text-[14px] font-black tracking-tight transition-all border ${active ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10" : "bg-[var(--workspace-panel)] border-[var(--workspace-border)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                              {pm.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {(formData.paymentMethod === "installments" || formData.paymentMethod === "cash_or_installments") && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                            <div className="relative"><Receipt className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="text" placeholder={uc.downPaymentPlaceholder} value={formData.downPayment} onChange={(v) => setFormData({ ...formData, downPayment: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                            <div className="relative"><Calendar className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="number" placeholder={uc.installmentYearsPlaceholder} value={formData.installmentYears} onChange={(v) => setFormData({ ...formData, installmentYears: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                <motion.div variants={staggerItem}>
                  <div className="relative"><Calendar className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} /><TextInput type="text" placeholder={uc.deliveryDatePlaceholder} value={formData.deliveryDate} onChange={(v) => setFormData({ ...formData, deliveryDate: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} /></div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 4: Amenities & Nearby ═══ */}
          {activeStep === 4 && (
            <motion.div key="s4" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className="space-y-10 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>{formatWebCopy(uc.stepXofY, { step: "4", total: "7" })}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{uc.amenitiesTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">{uc.amenitiesDesc}</p>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>{formatWebCopy(uc.selectedAmenitiesCount, { count: formData.unitAmenities.length.toString() })}</FieldLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {availableAmenities.map((amenityLabel, idx) => {
                      const active = formData.unitAmenities.includes(amenityLabel);
                      const Icon = AMENITY_ICONS[amenityLabel] || Sparkles;
                      
                      return (
                        <motion.button 
                          key={amenityLabel} 
                          type="button" 
                          onClick={() => toggleAmenity(amenityLabel)} 
                          disabled={pending}
                          initial={{ opacity: 0, scale: 0.9 }} 
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.02, duration: 0.3 }}
                          whileHover={{ scale: 1.06, y: -2 }} 
                          whileTap={{ scale: 0.92 }}
                          className={`flex items-center gap-3 rounded-[20px] px-5 py-3 text-[13px] font-black tracking-tight transition-all border-2 ${active ? "bg-[color:color-mix(in_srgb,var(--workspace-highlight)_12%,transparent)] border-[var(--workspace-highlight)] text-foreground" : "border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                          <Icon size={16} strokeWidth={active ? 2.5 : 1.5} className={active ? "text-[var(--workspace-highlight)]" : "opacity-40"} />
                          {amenityLabel}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>{uc.nearbyPlacesLabel}</FieldLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {uc.nearbyPlaceNames.map((place, idx) => {
                      const entry = formData.nearbyPlaces.find((p) => p.name === place);
                      const active = Boolean(entry);
                      return (
                        <motion.button key={place} type="button" onClick={() => toggleNearbyPlace(place)} disabled={pending}
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.02, duration: 0.35 }}
                          whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.92 }}
                          className={`rounded-[20px] px-5 py-3 text-[13px] font-black tracking-tight transition-all border-2 ${active ? "bg-[color:color-mix(in_srgb,var(--workspace-highlight)_12%,transparent)] border-[var(--workspace-highlight)] text-foreground" : "border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                          {active && <MapPin size={14} className={`inline ${isRtl ? "ml-2" : "mr-2"}`} />} {place}
                        </motion.button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {formData.nearbyPlaces.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="mt-8 space-y-3 overflow-hidden">
                        <FieldLabel>{uc.estimatedDistanceLabel}</FieldLabel>
                        {formData.nearbyPlaces.map((np) => (
                          <motion.div key={np.name} layout className={`flex items-center gap-4 rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-4 ${isRtl ? "pr-6" : "pl-6"}`}>
                            <div className="flex-1 text-[14px] font-black text-foreground flex items-center gap-3"><MapPin size={16} className="text-[var(--workspace-highlight)]" /> {np.name}</div>
                            <select value={np.distance} onChange={(e) => setNearbyDistance(np.name, e.target.value)} className="rounded-2xl border border-[color:var(--workspace-border)] bg-background px-4 py-2 text-[12px] font-black text-foreground outline-none focus:border-foreground/30 shadow-sm transition-all">
                              {DISTANCE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 5: Media Gallery ═══ */}
          {activeStep === 5 && (
            <motion.div key="s5" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className={`space-y-10 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>{formatWebCopy(uc.stepXofY, { step: "5", total: "7" })}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{uc.mediaTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">{uc.mediaDesc}</p>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-6">
                  <FieldLabel>{uc.unitImagesCountHint}</FieldLabel>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => imageInputRef.current?.click()}
                      className="group flex h-36 flex-col items-center justify-center gap-3 rounded-[32px] border-2 border-dashed border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-[var(--workspace-highlight)] hover:text-foreground transition-all"
                    >
                      <input 
                        type="file" 
                        ref={imageInputRef} 
                        onChange={handleImageUpload} 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm transition-transform group-hover:scale-110">
                        <Plus size={24} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest opacity-60">{uc.addImagesLabel}</span>
                    </motion.button>
                    
                    {formData.images.map((img) => (
                      <div key={img.id} className="group relative h-36 overflow-hidden rounded-[32px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] shadow-sm">
                        <img src={img.url} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Unit" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        
                        {img.isCover && (
                          <div className={`absolute ${isRtl ? "left-3" : "right-3"} top-3 rounded-full bg-[var(--workspace-highlight)] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-lg`}>
                            {uc.coverPhotoLabel}
                          </div>
                        )}
                        
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                          <button 
                            type="button"
                            onClick={() => removeImage(img.id)} 
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 active:scale-90"
                            title={uc.delete}
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          {!img.isCover && (
                            <button 
                              type="button"
                              onClick={() => setFormData({ ...formData, images: formData.images.map(i => ({ ...i, isCover: i.id === img.id })) })}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black shadow-lg hover:scale-110 active:scale-90 transition-transform"
                              title={uc.setAsCover}
                            >
                              <Image size={14} />
                            </button>
                          )}

                          <button 
                            type="button"
                            onClick={() => setSelectedPreview(img.url)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white hover:text-black transition-all active:scale-90"
                            title={uc.enlargeImage}
                          >
                            <Maximize2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {formData.images.length > 0 && formData.images.length < 3 && (
                    <div className="flex items-center gap-3 rounded-[20px] bg-amber-500/5 px-4 py-3 text-[12px] font-bold text-amber-600/80">
                      <AlertCircle size={16} />
                      {uc.minImagesWarning}
                    </div>
                  )}
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-4">
                  <FieldLabel>{uc.videoUrlPlaceholder.split("(")[0].trim() || "Video"}</FieldLabel>
                  <div className="relative">
                    <Video className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} />
                    <TextInput placeholder={uc.videoUrlPlaceholder} value={formData.videoUrl} onChange={(v) => setFormData({ ...formData, videoUrl: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 6: Documents ═══ */}
          {activeStep === 6 && (
            <motion.div key="s6" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className={`space-y-10 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>{formatWebCopy(uc.stepXofY, { step: "6", total: "7" })}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{uc.docsTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">{uc.docsDesc}</p>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-4">
                  <motion.button 
                    type="button" 
                    whileHover={{ scale: 1.01 }} 
                    whileTap={{ scale: 0.99 }} 
                    onClick={() => docInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-4 rounded-[32px] border-2 border-dashed border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-12 text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground transition-all"
                  >
                    <input 
                      type="file" 
                      ref={docInputRef} 
                      onChange={handleDocUpload} 
                      multiple 
                      className="hidden" 
                    />
                    <Paperclip size={28} />
                    <span className="text-[15px] font-black tracking-tight">{uc.uploadDocsHint}</span>
                  </motion.button>

                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className={`flex items-center gap-4 rounded-[24px] border border-[color:var(--workspace-border)] bg-background p-4 ${isRtl ? "pr-6" : "pl-6"}`}>
                        <FileText size={18} className="text-[var(--workspace-highlight)]" />
                        <span className="flex-1 text-[13px] font-black">{doc.name}</span>
                        <button type="button" onClick={() => removeDoc(doc.id)} className="text-rose-500 hover:opacity-70 transition-opacity"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 7: Legal & Review ═══ */}
          {activeStep === 7 && (
            <motion.div key="s7" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>{uc.legalTitle}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{uc.legalTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">{uc.legalDesc}</p>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <TextArea placeholder={uc.descriptionPlaceholder} value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} rows={5} disabled={pending} />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>{uc.registrationStatusLabel}</FieldLabel>
                  <div className="flex flex-wrap gap-3">
                    {REGISTRATION_OPTIONS.map((ro) => {
                      const active = formData.registrationStatus === ro.value;
                      return (
                        <motion.button key={ro.value} type="button" onClick={() => setFormData({ ...formData, registrationStatus: ro.value })} disabled={pending}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }} layout
                          className={`rounded-full px-6 py-3 text-[14px] font-black tracking-tight transition-all border ${active ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10" : "bg-[var(--workspace-panel)] border-[var(--workspace-border)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                          {ro.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <div className="relative">
                    <ShieldCheck className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground/40`} size={18} />
                    <TextInput placeholder={uc.adLicenseLabel} value={formData.adLicenseNumber} onChange={(v) => setFormData({ ...formData, adLicenseNumber: v })} disabled={pending} className={isRtl ? "pr-11" : "pl-11"} error={!formData.adLicenseNumber.trim() ? uc.adLicenseError : undefined} />
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <AnimatePresence mode="wait">
                    {canPublish ? (
                      <motion.div key="ready" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 p-6 ${isRtl ? "text-right" : "text-left"} font-black text-emerald-700 dark:text-emerald-400 flex items-start gap-4`}>
                        <CheckCircle2 size={24} className="shrink-0" />
                        <div><div className="text-lg mb-1">{uc.readyToPublishTitle}</div><p className="text-[13px] opacity-80 leading-relaxed">{uc.readyToPublishDesc}</p></div>
                      </motion.div>
                    ) : (
                      <motion.div key="draft" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-[28px] bg-amber-500/10 border border-amber-500/20 p-6 ${isRtl ? "text-right" : "text-left"} font-black text-amber-700 dark:text-amber-400 flex items-start gap-4`}>
                        <Info size={24} className="shrink-0" />
                        <div><div className="text-lg mb-1">{uc.draftStatusTitle}</div><p className="text-[13px] opacity-80 leading-relaxed">{uc.draftStatusDesc}</p></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating Dock ── */}
      <div className="sticky bottom-[100px] z-50 mx-auto w-full max-w-3xl px-4">
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className={`flex w-full items-center justify-between gap-4 rounded-full border border-[color:var(--workspace-border)] bg-[color:color-mix(in_srgb,var(--workspace-panel)_85%,transparent)] p-3 ${isRtl ? "pr-8" : "pl-8"} shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl`} dir={isRtl ? "rtl" : "ltr"}>
            <div className="hidden text-[15px] font-black tracking-tight text-[var(--workspace-muted)] sm:block">
              <AnimatePresence mode="wait">
                <motion.span key={activeStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {activeStep === TOTAL_STEPS ? (canPublish ? uc.submitReady : uc.submitDraft) : formatWebCopy(uc.stepXofY, { step: activeStep.toString(), total: TOTAL_STEPS.toString() })}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex w-full sm:w-auto items-center justify-end gap-3">
              <AnimatePresence>
                {activeStep > 1 && (
                  <motion.button initial={{ opacity: 0, scale: 0.9, width: 0 }} animate={{ opacity: 1, scale: 1, width: "auto" }} exit={{ opacity: 0, scale: 0.9, width: 0 }}
                    type="button" onClick={handlePrev} disabled={pending}
                    className="flex h-13 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--workspace-panel)] px-8 font-black tracking-tight text-foreground transition-all hover:bg-[color:color-mix(in_srgb,var(--workspace-border)_40%,var(--workspace-panel))] active:scale-95 disabled:pointer-events-none disabled:opacity-30">
                    {uc.prevButton}
                  </motion.button>
                )}
              </AnimatePresence>

              {activeStep < TOTAL_STEPS ? (
                <motion.button type="button" onClick={handleNext} disabled={pending} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className="flex h-13 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-14 font-black tracking-tight text-background shadow-2xl shadow-foreground/10 disabled:pointer-events-none disabled:opacity-30">
                  {uc.nextButton}
                </motion.button>
              ) : (
                <motion.button type="button" onClick={handleSubmit} disabled={pending} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className={`flex h-13 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full px-14 font-black tracking-tight shadow-2xl disabled:pointer-events-none disabled:opacity-30 ${canPublish ? "bg-[var(--workspace-highlight)] text-white shadow-[var(--workspace-highlight)]/20" : "bg-foreground text-background"}`}>
                  {pending ? "..." : canPublish ? (submitLabel ?? uc.submitReady) : uc.submitDraft}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPreview && (
          <ImageLightbox url={selectedPreview!} onClose={() => setSelectedPreview(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Image Preview Modal ── */
function ImageLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-10 backdrop-blur-xl cursor-zoom-out"
    >
      <motion.button 
        key="close-lightbox"
        type="button"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-10 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
        onClick={onClose}
      >
        <X size={28} />
      </motion.button>
      
      <motion.img 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        src={url} 
        className="max-h-full max-w-full rounded-[40px] shadow-2xl shadow-black/50 ring-1 ring-white/10"
        alt="Preview"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}
