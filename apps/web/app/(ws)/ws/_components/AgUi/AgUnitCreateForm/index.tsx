"use client";

import { useState, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, Home, Layers, Layout, Building2, Store, Palmtree, 
  Bed, Bath, Move, ChevronUp, Car, Sparkles, Receipt, Calendar, 
  CheckCircle2, MapPin, FileText, Camera, 
  Video, Paperclip, AlertCircle, Info, Trash2, Plus, 
  CreditCard, Wind, DoorClosed, 
  Utensils, Wifi, Mic2, ArrowUpDown, ShieldCheck, Sun, Image, 
  X, Maximize2
} from "lucide-react";
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
  unitType: "apartment" | "villa" | "duplex" | "studio" | "penthouse" | "townhouse" | "chalet" | "commercial";
  listingType: "sale" | "rent";
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
  /* Step 4: Amenities & Nearby */
  unitAmenities: string[];
  nearbyPlaces: { name: string; distance: string }[];
  /* Step 5: Media */
  images: { id: string; url: string; file?: File; isCover?: boolean }[];
  videoUrl: string;
  /* Step 6: Documents */
  documents: { id: string; name: string; type: string; fileKey?: string }[];
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

const UNIT_TYPES = [
  { value: "apartment", label: "شقة", icon: Building },
  { value: "villa", label: "فيلا", icon: Home },
  { value: "duplex", label: "دوبلكس", icon: Layers },
  { value: "studio", label: "ستوديو", icon: Layout },
  { value: "penthouse", label: "بنتهاوس", icon: Building2 },
  { value: "townhouse", label: "تاون هاوس", icon: Home },
  { value: "chalet", label: "شاليه", icon: Palmtree },
  { value: "commercial", label: "تجاري", icon: Store },
] as const;

const LISTING_TYPES = [
  { value: "sale", label: "للبيع" },
  { value: "rent", label: "للإيجار" },
] as const;

const FINISHING_LEVELS = [
  { value: "core_shell", label: "على الطوب الأحمر" },
  { value: "semi_finished", label: "نصف تشطيب" },
  { value: "fully_finished", label: "تشطيب كامل" },
  { value: "extra_super_lux", label: "سوبر لوكس" },
  { value: "furnished", label: "مفروشة" },
] as const;

const PAYMENT_METHODS = [
  { value: "cash", label: "كاش" },
  { value: "installments", label: "تقسيط" },
  { value: "cash_or_installments", label: "كاش أو تقسيط" },
] as const;

const REGISTRATION_OPTIONS = [
  { value: "registered", label: "مسجل (شهر عقاري)" },
  { value: "not_registered", label: "غير مسجل" },
  { value: "pending", label: "قيد التسجيل" },
] as const;

const DISTANCE_OPTIONS = [
  "أقل من 5 دقائق",
  "5 – 10 دقائق",
  "10 – 20 دقيقة",
  "أكثر من 20 دقيقة",
] as const;

const SHARED_AMENITIES = [
  { label: "تكييف مركزي", icon: Wind },
  { label: "بلكونة", icon: Layout },
  { label: "غرفة ملابس", icon: DoorClosed },
  { label: "مطبخ مجهز", icon: Utensils },
  { label: "سخان مركزي", icon: Sparkles },
  { label: "شبكة إنترنت", icon: Wifi },
  { label: "إنتركم", icon: Mic2 },
  { label: "أسانسير", icon: ArrowUpDown },
  { label: "كاميرات مراقبة", icon: Camera },
  { label: "باب مصفح", icon: ShieldCheck },
  { label: "طاقة شمسية", icon: Sun },
];

const VILLA_AMENITIES = [
  "حمام سباحة خاص", "حديقة خاصة", "بدروم", "روف",
  "غرفة سائق", "غرفة خدم", "مدخل خاص", "ملعب خاص",
];
const APARTMENT_AMENITIES = [
  "تراس", "غرفة غسيل", "حراسة خاصة", "جراج خاص", "دش مركزي",
];
const CHALET_AMENITIES = [
  "إطلالة على البحر", "شاطئ خاص", "حمام سباحة مشترك", "ملعب أطفال", "لاند سكيب",
];
const COMMERCIAL_AMENITIES = [
  "واجهة زجاج", "تهوية مركزية", "مدخل مستقل", "أرضيات بورسلين", "عداد تجاري",
];

const NEARBY_PLACE_NAMES = [
  "محطة مترو", "مركز تجاري / مول", "مدرسة دولية", "جامعة",
  "مستشفى", "صيدلية", "مسجد", "كنيسة", "سوبر ماركت",
  "نادي رياضي", "حديقة عامة", "محطة بنزين", "مطار",
  "طريق دائري", "أوتوستراد", "كورنيش", "بنك", "مطعم / كافيه",
];

const TOTAL_STEPS = 7;

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.96, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.96, filter: "blur(6px)" }),
};
const staggerContainer = { center: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const staggerItem = {
  enter: { opacity: 0, y: 20, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function AgUnitCreateForm({
  initialData,
  title,
  description,
  submitLabel,
  onSave,
  onCancel,
  cancelHref,
}: AgUnitFormProps) {
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
    rooms: initialData?.rooms ?? "",
    baths: initialData?.baths ?? "",
    area: initialData?.area ?? "",
    floor: initialData?.floor ?? "",
    parking: initialData?.parking ?? "",
    finishingLevel: initialData?.finishingLevel ?? "fully_finished",
    price: initialData?.price ?? "",
    paymentMethod: initialData?.paymentMethod ?? "cash",
    downPayment: initialData?.downPayment ?? "",
    installmentYears: initialData?.installmentYears ?? "",
    deliveryDate: initialData?.deliveryDate ?? "",
    unitAmenities: initialData?.unitAmenities ?? [],
    nearbyPlaces: initialData?.nearbyPlaces ?? [],
    images: initialData?.images ?? [],
    videoUrl: initialData?.videoUrl ?? "",
    documents: initialData?.documents ?? [],
    description: initialData?.description ?? "",
    adLicenseNumber: initialData?.adLicenseNumber ?? "",
    registrationStatus: initialData?.registrationStatus ?? "not_registered",
  });

  /* Dynamic amenities base */
  const availableAmenities = useMemo(() => {
    const base = SHARED_AMENITIES.map(a => a.label);
    switch (formData.unitType) {
      case "villa": case "townhouse": return [...base, ...VILLA_AMENITIES];
      case "apartment": case "duplex": case "penthouse": case "studio": return [...base, ...APARTMENT_AMENITIES];
      case "chalet": return [...base, ...CHALET_AMENITIES];
      case "commercial": return [...base, ...COMMERCIAL_AMENITIES];
      default: return base;
    }
  }, [formData.unitType]);

  const canPublish = Boolean(
    formData.name.trim() &&
    formData.location.trim() &&
    formData.price.trim() &&
    formData.area.trim() &&
    formData.adLicenseNumber.trim()
  );

  const handleNext = () => {
    if (activeStep === 1 && !formData.name.trim()) {
      setFeedback("يرجى إدخال عنوان الوحدة على الأقل."); return;
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
      if (!result.ok) setFeedback(result.feedback?.message ?? "حدث خطأ غير متوقع.");
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

  /* ═══════════════ RENDER ═══════════════ */

  return (
    <div className="relative flex min-h-full w-full flex-col pb-12">
      <ZonePageIntro
        eyebrow="إنشاء وحدة عقارية"
        title={title ?? "بيانات الوحدة العقارية"}
        description={description ?? "أكمل البيانات لنشر وحدتك العقارية بأفضل شكل ممكن."}
        actions={<AgPropertyFormHeaderActions onCancel={onCancel} cancelHref={cancelHref} />}
      />

      <div className="mx-auto mt-6 flex w-full max-w-3xl items-center justify-center gap-2" dir="rtl">
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

      <div className="mx-auto mt-8 w-full max-w-3xl pb-36 pt-4 overflow-hidden" dir="rtl">
        <AnimatePresence mode="wait" initial={false}>
          {feedback && (
            <motion.div key="fb" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-8 rounded-[24px] bg-rose-500/10 px-6 py-4 text-right text-[15px] font-bold text-rose-500 border border-rose-500/20">
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══ STEP 1: Identity ═══ */}
          {activeStep === 1 && (
            <motion.div key="s1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className="space-y-8 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>الخطوة ١ من ٧</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">تعريف الوحدة</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">العنوان والموقع ونوع الوحدة وهل هي للبيع أو للإيجار.</p>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <TextInput placeholder="عنوان الوحدة (مثال: شقة 185م² في الرحاب)" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} disabled={pending} />
                  <TextInput placeholder="الموقع بالتفصيل (مثال: التجمع الخامس، القاهرة الجديدة)" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} disabled={pending} />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>نوع الإعلان</FieldLabel>
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
                  <FieldLabel>نوع الوحدة</FieldLabel>
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
              <motion.div className="space-y-8 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>الخطوة ٢ من ٧</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">مواصفات الوحدة</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">الغرف، الحمامات، المساحة، الدور، الباركينج، ومستوى التشطيب.</p>
                </motion.div>

                <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3" variants={staggerItem}>
                  {formData.unitType !== "studio" && (
                    <div className="relative"><Bed className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="number" placeholder="عدد الغرف" value={formData.rooms} onChange={(v) => setFormData({ ...formData, rooms: v })} disabled={pending} className="pr-11" /></div>
                  )}
                  <div className="relative"><Bath className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="number" placeholder="عدد الحمامات" value={formData.baths} onChange={(v) => setFormData({ ...formData, baths: v })} disabled={pending} className="pr-11" /></div>
                  <div className="relative"><Move className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="text" placeholder="المساحة (م²)" value={formData.area} onChange={(v) => setFormData({ ...formData, area: v })} disabled={pending} className="pr-11" /></div>
                  {formData.unitType !== "villa" && formData.unitType !== "townhouse" && (
                    <div className="relative"><ChevronUp className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="text" placeholder="الدور (مثال: الخامس)" value={formData.floor} onChange={(v) => setFormData({ ...formData, floor: v })} disabled={pending} className="pr-11" /></div>
                  )}
                  <div className="relative"><Car className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="number" placeholder="أماكن الباركينج" value={formData.parking} onChange={(v) => setFormData({ ...formData, parking: v })} disabled={pending} className="pr-11" /></div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>مستوى التشطيب</FieldLabel>
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
              <motion.div className="space-y-8 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>الخطوة ٣ من ٧</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">السعر وطريقة الدفع</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">
                    {formData.listingType === "rent" ? "حدد الإيجار الشهري." : "حدد السعر ونظام الدفع."}
                  </p>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <div className="relative"><CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="text" placeholder={formData.listingType === "rent" ? "الإيجار الشهري (مثال: 15,000 ج.م)" : "السعر الإجمالي (مثال: 3,500,000 ج.م)"} value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} disabled={pending} className="pr-11 text-xl font-black" /></div>
                </motion.div>

                {formData.listingType === "sale" && (
                  <>
                    <motion.div variants={staggerItem}>
                      <FieldLabel>طريقة الدفع</FieldLabel>
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
                            <div className="relative"><Receipt className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="text" placeholder="المقدم (مثال: 500,000 ج.م)" value={formData.downPayment} onChange={(v) => setFormData({ ...formData, downPayment: v })} disabled={pending} className="pr-11" /></div>
                            <div className="relative"><Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="number" placeholder="سنوات التقسيط (مثال: 7)" value={formData.installmentYears} onChange={(v) => setFormData({ ...formData, installmentYears: v })} disabled={pending} className="pr-11" /></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                <motion.div variants={staggerItem}>
                  <div className="relative"><Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} /><TextInput type="text" placeholder="موعد التسليم أو الاستلام (مثال: يناير 2027)" value={formData.deliveryDate} onChange={(v) => setFormData({ ...formData, deliveryDate: v })} disabled={pending} className="pr-11" /></div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 4: Amenities & Nearby ═══ */}
          {activeStep === 4 && (
            <motion.div key="s4" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className="space-y-10 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>الخطوة ٤ من ٧</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">المميزات والأماكن القريبة</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">حدد مميزات الوحدة والأماكن القريبة مع المسافة المقدرة.</p>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>مميزات الوحدة ({formData.unitAmenities.length} مختار)</FieldLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {availableAmenities.map((amenityLabel, idx) => {
                      const active = formData.unitAmenities.includes(amenityLabel);
                      const amenDef = SHARED_AMENITIES.find(a => a.label === amenityLabel);
                      const Icon = amenDef?.icon || Sparkles;
                      
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
                  <FieldLabel>أماكن قريبة</FieldLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {NEARBY_PLACE_NAMES.map((place, idx) => {
                      const entry = formData.nearbyPlaces.find((p) => p.name === place);
                      const active = Boolean(entry);
                      return (
                        <motion.button key={place} type="button" onClick={() => toggleNearbyPlace(place)} disabled={pending}
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.02, duration: 0.35 }}
                          whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.92 }}
                          className={`rounded-[20px] px-5 py-3 text-[13px] font-black tracking-tight transition-all border-2 ${active ? "bg-[color:color-mix(in_srgb,var(--workspace-highlight)_12%,transparent)] border-[var(--workspace-highlight)] text-foreground" : "border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"}`}>
                          {active && <MapPin size={14} className="inline ml-2" />} {place}
                        </motion.button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {formData.nearbyPlaces.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="mt-8 space-y-3 overflow-hidden">
                        <FieldLabel>المسافة المقدّرة</FieldLabel>
                        {formData.nearbyPlaces.map((np) => (
                          <motion.div key={np.name} layout className="flex items-center gap-4 rounded-[24px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-4 pr-6">
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
              <motion.div className="space-y-10 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>الخطوة ٥ من ٧</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">معرض الصور والفيديو</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">أضف صوراً عالية الجودة للوحدة. الصور الأولى هي التي تظهر في نتائج البحث.</p>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-6">
                  <FieldLabel>صور الوحدة (بحد أدنى ٣ صور)</FieldLabel>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="group flex h-36 flex-col items-center justify-center gap-3 rounded-[32px] border-2 border-dashed border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-[var(--workspace-highlight)] hover:text-foreground transition-all"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm transition-transform group-hover:scale-110">
                        <Plus size={24} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest opacity-60">إضافة صور</span>
                    </motion.button>
                    
                    {formData.images.map((img) => (
                      <div key={img.id} className="group relative h-36 overflow-hidden rounded-[32px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] shadow-sm">
                        <img src={img.url} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Unit" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        
                        {img.isCover && (
                          <div className="absolute left-3 top-3 rounded-full bg-[var(--workspace-highlight)] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-lg">
                            صورة الغلاف
                          </div>
                        )}
                        
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                          <button 
                            type="button"
                            onClick={() => removeImage(img.id)} 
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 active:scale-90"
                            title="حذف الصورة"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          {!img.isCover && (
                            <button 
                              type="button"
                              onClick={() => setFormData({ ...formData, images: formData.images.map(i => ({ ...i, isCover: i.id === img.id })) })}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black shadow-lg hover:scale-110 active:scale-90 transition-transform"
                              title="جعل هذه الصورة هي الغلاف"
                            >
                              <Image size={14} />
                            </button>
                          )}

                          <button 
                            type="button"
                            onClick={() => setSelectedPreview(img.url)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white hover:text-black transition-all active:scale-90"
                            title="تكبير الصورة"
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
                      يفضل إضافة ٣ صور على الأقل لزيادة فرص التواصل.
                    </div>
                  )}
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-4">
                  <FieldLabel>فيديو الوحدة (اختياري)</FieldLabel>
                  <div className="relative">
                    <Video className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                    <TextInput placeholder="رابط فيديو اليوتيوب أو فيميو" value={formData.videoUrl} onChange={(v) => setFormData({ ...formData, videoUrl: v })} disabled={pending} className="pr-11" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 6: Documents ═══ */}
          {activeStep === 6 && (
            <motion.div key="s6" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className="space-y-10 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>الخطوة ٦ من ٧</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">المستندات القانونية</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">أرفق صوراً من عقد الملكية أو ترخيص البناء لتوثيق الوحدة (تظهر داخلياً فقط للمراجعة).</p>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-4">
                  <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex w-full items-center justify-center gap-4 rounded-[32px] border-2 border-dashed border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] p-12 text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground transition-all">
                    <Paperclip size={28} />
                    <span className="text-[15px] font-black tracking-tight">اضغط هنا لإرفاق الملفات (PDF, JPG, PNG)</span>
                  </motion.button>

                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-4 rounded-[24px] border border-[color:var(--workspace-border)] bg-background p-4 pr-6">
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
              <motion.div className="space-y-8 text-right" variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem}>
                  <FieldLabel>الخطوة الأخيرة</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">الوصف والمراجعة القانونية</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">بدون رقم ترخيص الإعلان سيبقى الإعلان في المسودة ولن يُنشر للعامة.</p>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <TextArea placeholder="اكتب وصفاً تفصيلياً: الموقع، المميزات، أسباب البيع، والخدمات المحيطة بالوحدة..." value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} rows={5} disabled={pending} />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FieldLabel>حالة التسجيل العقاري</FieldLabel>
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
                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                    <TextInput placeholder="رقم ترخيص الإعلان (مطلوب للنشر)" value={formData.adLicenseNumber} onChange={(v) => setFormData({ ...formData, adLicenseNumber: v })} disabled={pending} className="pr-11" error={!formData.adLicenseNumber.trim() ? "بدون رقم الترخيص سيبقى إعلانك كمسودة فقط" : undefined} />
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <AnimatePresence mode="wait">
                    {canPublish ? (
                      <motion.div key="ready" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 p-6 text-right font-black text-emerald-700 dark:text-emerald-400 flex items-start gap-4">
                        <CheckCircle2 size={24} className="shrink-0" />
                        <div><div className="text-lg mb-1">الإعلان جاهز للنشر القوي</div><p className="text-[13px] opacity-80 leading-relaxed">جميع البيانات الضرورية مكتملة، سيتم إدراج الوحدة في نتائج بحث المنصة فور الحفظ.</p></div>
                      </motion.div>
                    ) : (
                      <motion.div key="draft" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[28px] bg-amber-500/10 border border-amber-500/20 p-6 text-right font-black text-amber-700 dark:text-amber-400 flex items-start gap-4">
                        <Info size={24} className="shrink-0" />
                        <div><div className="text-lg mb-1">الحفظ كمسودة (بيانات ناقصة)</div><p className="text-[13px] opacity-80 leading-relaxed">أكمل (العنوان، الموقع، السعر، المساحة، ورقم ترخيص الإعلان) لتتمكن من تفعيل خيار النشر العام.</p></div>
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
      <div className="sticky bottom-8 z-50 mx-auto w-full max-w-3xl px-4">
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex w-full items-center justify-between gap-4 rounded-full border border-[color:var(--workspace-border)] bg-[color:color-mix(in_srgb,var(--workspace-panel)_85%,transparent)] p-3 pr-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl" dir="rtl">
            <div className="hidden text-[15px] font-black tracking-tight text-[var(--workspace-muted)] sm:block">
              <AnimatePresence mode="wait">
                <motion.span key={activeStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {activeStep === TOTAL_STEPS ? (canPublish ? "جاهز للنشر" : "سيحفظ مسودة") : `المرحلة ${activeStep} من ${TOTAL_STEPS}`}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex w-full sm:w-auto items-center justify-end gap-3">
              <AnimatePresence>
                {activeStep > 1 && (
                  <motion.button initial={{ opacity: 0, scale: 0.9, width: 0 }} animate={{ opacity: 1, scale: 1, width: "auto" }} exit={{ opacity: 0, scale: 0.9, width: 0 }}
                    type="button" onClick={handlePrev} disabled={pending}
                    className="flex h-13 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--workspace-panel)] px-8 font-black tracking-tight text-foreground transition-all hover:bg-[color:color-mix(in_srgb,var(--workspace-border)_40%,var(--workspace-panel))] active:scale-95 disabled:pointer-events-none disabled:opacity-30">
                    السابق
                  </motion.button>
                )}
              </AnimatePresence>

              {activeStep < TOTAL_STEPS ? (
                <motion.button type="button" onClick={handleNext} disabled={pending} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className="flex h-13 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-14 font-black tracking-tight text-background shadow-2xl shadow-foreground/10 disabled:pointer-events-none disabled:opacity-30">
                  التالي
                </motion.button>
              ) : (
                <motion.button type="button" onClick={handleSubmit} disabled={pending} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className={`flex h-13 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full px-14 font-black tracking-tight shadow-2xl disabled:pointer-events-none disabled:opacity-30 ${canPublish ? "bg-[var(--workspace-highlight)] text-white shadow-[var(--workspace-highlight)]/20" : "bg-foreground text-background"}`}>
                  {pending ? "جاري الحفظ..." : canPublish ? (submitLabel ?? "نشر الوحدة") : "حفظ كمسودة"}
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
