import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import ZonePageIntro from "../../ZoneShell/ZonePageIntro";
import { AgPropertyFormHeaderActions } from "../AgPropertyFormHeaderActions";
import type { AgPropertyFormProps, ProjectFormData } from "./types";
import { TextInput, TextArea, FieldLabel } from "./controls";

function getAmenities(dictionary: any) {
  return [
    dictionary.projectForm.amenityClubhouse,
    dictionary.projectForm.amenityCommercial,
    dictionary.projectForm.amenitySecurity,
    dictionary.projectForm.amenitySchools,
    dictionary.projectForm.amenityMedical,
    dictionary.projectForm.amenityPools,
    dictionary.projectForm.amenityGym,
    dictionary.projectForm.amenityLandscape,
  ].filter(Boolean);
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
    filter: "blur(6px)",
  }),
};

const staggerContainer = {
  center: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const staggerItem = {
  enter: { opacity: 0, y: 20, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function AgPropertyForm({
  propertyId,
  initialData,
  title,
  description,
  submitLabel,
  onSave,
  onCancel,
  cancelHref,
  onDelete,
}: AgPropertyFormProps) {
  const { dictionary, locale } = useWebLocale();
  const isRtl = locale === "ar";
  const isEditMode = Boolean(propertyId);
  const [pending, startTransition] = useTransition();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name ?? "",
    location: initialData?.location ?? "",
    description: initialData?.description ?? "",
    developerName: initialData?.developerName ?? "",
    projectType: initialData?.projectType ?? "apartments",
    expectedUnits: initialData?.expectedUnits ?? "",
    startingPrice: initialData?.startingPrice ?? "",
    installmentYears: initialData?.installmentYears ?? "",
    compoundAmenities: initialData?.compoundAmenities ?? [],
    masterPlanImageKey: initialData?.masterPlanImageKey ?? "",
  });
  
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleNext = () => {
    if (activeStep === 1) {
      if (!formData.name.trim() || !formData.location.trim() || !formData.developerName?.trim()) {
        setFeedback(dictionary.projectForm.feedbackCompleteFields);
        return;
      }
    }
    setFeedback(null);
    setDirection(1);
    setActiveStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!onSave) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await onSave(formData);
      if (!result.ok) {
        setFeedback(result.feedback?.message ?? dictionary.projectForm.feedbackError);
      }
    });
  };

  const PROJ_TYPES = [
    { value: "villas", label: dictionary.projects.types.villas },
    { value: "apartments", label: dictionary.projects.types.apartments },
    { value: "land_plots", label: dictionary.projects.types.land_plots },
    { value: "mixed", label: dictionary.projects.types.mixed },
    { value: "custom", label: dictionary.projects.types.custom },
  ] as const;

  const AMENITIES = getAmenities(dictionary);

  const toggleAmenity = (amenity: string) => {
    const current = formData.compoundAmenities ?? [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, compoundAmenities: current.filter((a) => a !== amenity) });
    } else {
      setFormData({ ...formData, compoundAmenities: [...current, amenity] });
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col pb-12">
      <ZonePageIntro
        eyebrow={isEditMode ? dictionary.projectForm.editEyebrow : dictionary.projectForm.newEyebrow}
        title={title ?? (isEditMode ? dictionary.projectForm.editTitle : dictionary.projectForm.newTitle)}
        description={description ?? dictionary.projectForm.identityDesc}
        actions={isEditMode ? <AgPropertyFormHeaderActions onCancel={onCancel} cancelHref={cancelHref} onDelete={onDelete} /> : undefined}
      />

      {/* Progress Indicator */}
      <div className="mx-auto mt-6 flex w-full max-w-3xl items-center justify-center gap-2" dir={isRtl ? "rtl" : "ltr"}>
        {[1, 2, 3, 4].map((stepNumber) => (
          <motion.div
            key={stepNumber}
            layout
            className={`h-2 rounded-full ${
              activeStep === stepNumber
                ? "bg-[var(--workspace-highlight)]"
                : activeStep > stepNumber
                  ? "bg-foreground/40"
                  : "bg-[var(--workspace-border)]"
            }`}
            animate={{
              width: activeStep === stepNumber ? 48 : 32,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        ))}
      </div>

      <div className="mx-auto mt-8 w-full max-w-3xl pb-32 pt-4 overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        <AnimatePresence mode="wait" initial={false}>
          {feedback ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              className={`mb-8 rounded-[20px] bg-rose-500/10 px-6 py-4 ${isRtl ? "text-right" : "text-left"} text-[15px] font-bold text-rose-500`}
            >
              {feedback}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          {/* STEP 1: Identity */}
          {activeStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem} className={isRtl ? "text-right" : "text-left"}>
                  <FieldLabel>{dictionary.projects.continueFlow.replace("{step}", "1").replace("{total}", "4")}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{dictionary.projectForm.identityTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">
                    {dictionary.projectForm.identityDesc}
                  </p>
                </motion.div>

                <motion.div className="space-y-4" variants={staggerItem}>
                  <TextInput
                    placeholder={dictionary.projectForm.placeholderName}
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                    disabled={pending}
                  />
                  <TextInput
                    placeholder={dictionary.projectForm.placeholderDeveloper}
                    value={formData.developerName ?? ""}
                    onChange={(v) => setFormData({ ...formData, developerName: v })}
                    disabled={pending}
                  />
                  <TextInput
                    placeholder={dictionary.projectForm.placeholderLocation}
                    value={formData.location}
                    onChange={(v) => setFormData({ ...formData, location: v })}
                    disabled={pending}
                  />
                  <TextArea
                    placeholder={dictionary.projectForm.placeholderDescription}
                    value={formData.description}
                    onChange={(v) => setFormData({ ...formData, description: v })}
                    rows={4}
                    disabled={pending}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: Scale & Types */}
          {activeStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem} className={isRtl ? "text-right" : "text-left"}>
                  <FieldLabel>{dictionary.projects.continueFlow.replace("{step}", "2").replace("{total}", "4")}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{dictionary.projectForm.scaleTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">
                    {dictionary.projectForm.scaleDesc}
                  </p>
                </motion.div>

                <motion.div className="space-y-8" variants={staggerItem}>
                  <div className="flex flex-wrap gap-3">
                    {PROJ_TYPES.map((pt) => {
                      const active = formData.projectType === pt.value;
                      return (
                        <motion.button
                          key={pt.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: pt.value })}
                          disabled={pending}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.95 }}
                          animate={active ? { scale: 1 } : { scale: 1 }}
                          className={`rounded-full px-6 py-3 text-[15px] font-black tracking-tight transition-colors disabled:opacity-50 ${
                            active 
                              ? "bg-foreground text-background shadow-xl shadow-foreground/10" 
                              : "bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:bg-[color:color-mix(in_srgb,var(--workspace-border)_40%,var(--workspace-panel))] hover:text-foreground"
                          }`}
                          layout
                        >
                          {pt.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextInput
                      type="text"
                      placeholder={dictionary.projectForm.placeholderStartingPrice}
                      value={formData.startingPrice ?? ""}
                      onChange={(v) => setFormData({ ...formData, startingPrice: v })}
                      disabled={pending}
                    />
                    <TextInput
                      type="number"
                      placeholder={dictionary.projectForm.placeholderInstallmentYears}
                      value={formData.installmentYears ?? ""}
                      onChange={(v) => setFormData({ ...formData, installmentYears: v })}
                      disabled={pending}
                    />
                  </div>

                  <div className="max-w-xs">
                    <TextInput
                      type="number"
                      placeholder={dictionary.projectForm.placeholderExpectedUnits}
                      value={formData.expectedUnits ?? ""}
                      onChange={(v) => setFormData({ ...formData, expectedUnits: v })}
                      disabled={pending}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 3: Media */}
          {activeStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem} className={isRtl ? "text-right" : "text-left"}>
                  <FieldLabel>{dictionary.projects.continueFlow.replace("{step}", "3").replace("{total}", "4")}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{dictionary.projectForm.mediaTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">
                    {dictionary.projectForm.mediaDesc}
                  </p>
                </motion.div>
                
                <motion.div
                  variants={staggerItem}
                  className="flex h-48 w-full items-center justify-center rounded-[32px] border-2 border-dashed border-[color:var(--workspace-border)] bg-[var(--workspace-panel)]"
                  whileHover={{ borderColor: "var(--workspace-muted)", scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-semibold text-[var(--workspace-muted)]">
                    {dictionary.projectForm.masterPlanDeveloping}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 4: Amenities */}
          {activeStep === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <motion.div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} variants={staggerContainer} initial="enter" animate="center">
                <motion.div variants={staggerItem} className={isRtl ? "text-right" : "text-left"}>
                  <FieldLabel>{dictionary.projects.continueFlow.replace("{step}", "4").replace("{total}", "4")}</FieldLabel>
                  <h2 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">{dictionary.projectForm.amenitiesTitle}</h2>
                  <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--workspace-muted)]">
                    {dictionary.projectForm.amenitiesDesc}
                  </p>
                </motion.div>

                <motion.div className="flex flex-wrap gap-3" variants={staggerItem}>
                  {AMENITIES.map((amenity, idx) => {
                    const active = formData.compoundAmenities?.includes(amenity);
                    return (
                      <motion.button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        disabled={pending}
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                        className={`rounded-[24px] px-6 py-4 text-[14px] font-black tracking-tight transition-colors disabled:opacity-50 ${
                          active 
                            ? "bg-[color:color-mix(in_srgb,var(--workspace-highlight)_10%,transparent)] border-2 border-[var(--workspace-highlight)] text-foreground" 
                            : "border-2 border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-muted)] hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        {amenity}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating Dock ── */}
      <div className="sticky bottom-[100px] z-50 mx-auto w-full max-w-3xl px-4">
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}>
          <div className={`flex w-full items-center justify-between gap-4 rounded-full border border-[color:var(--workspace-border)] bg-[color:color-mix(in_srgb,var(--workspace-panel)_85%,transparent)] p-3 ${isRtl ? "pr-8" : "pl-8"} shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl`} dir={isRtl ? "rtl" : "ltr"}>
           <div className="hidden text-[15px] font-black text-[var(--workspace-muted)] sm:block">
             <AnimatePresence mode="wait">
               <motion.span
                 key={activeStep}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3 }}
               >
                 {activeStep === 4 ? dictionary.projectForm.lastStep : dictionary.unitCreate.stepXofY.replace("{step}", String(activeStep)).replace("{total}", "4")}
               </motion.span>
             </AnimatePresence>
           </div>
           <div className="flex w-full sm:w-auto items-center justify-end gap-3">
             <AnimatePresence>
               {activeStep > 1 && (
                 <motion.button
                   initial={{ opacity: 0, scale: 0.8, width: 0 }}
                   animate={{ opacity: 1, scale: 1, width: "auto" }}
                   exit={{ opacity: 0, scale: 0.8, width: 0 }}
                   transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                   type="button"
                   onClick={handlePrev}
                   disabled={pending}
                   className="flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--workspace-panel)] px-6 font-bold tracking-tight text-foreground transition-colors hover:bg-[color:color-mix(in_srgb,var(--workspace-border)_40%,var(--workspace-panel))] active:scale-95 disabled:pointer-events-none disabled:opacity-30"
                 >
                    {dictionary.common.back}
                  </motion.button>
               )}
             </AnimatePresence>
             
             {activeStep < 4 ? (
               <motion.button
                 type="button"
                 onClick={handleNext}
                 disabled={pending}
                 whileHover={{ scale: 1.03 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex h-12 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-10 font-black tracking-tight text-background disabled:pointer-events-none disabled:opacity-30"
               >
                  {dictionary.projects.continueFlow}
                </motion.button>
             ) : (
               <motion.button
                 type="button"
                 onClick={handleSubmit}
                 disabled={pending}
                 whileHover={{ scale: 1.03 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex h-12 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-10 font-black tracking-tight text-background disabled:pointer-events-none disabled:opacity-30"
               >
                  {pending ? dictionary.projectForm.saving : submitLabel ?? (isEditMode ? dictionary.projectForm.saveDraft : dictionary.projectForm.createProject)}
                </motion.button>
             )}
           </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
