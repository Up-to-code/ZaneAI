import type {
  AssistantDirection,
  AssistantSurfaceCopy,
  AssistantUiLocale,
  ThreadPresentation,
} from "./types";

export const CURATED_ASSISTANT_SURFACE_COPY: Record<AssistantUiLocale, AssistantSurfaceCopy> = {
  ar: {
    brandTagline: "البنية الذكية",
    greeting: "أهلًا، أقدر أساعدك في إيه النهارده؟",
    composerPlaceholder: "اكتب رسالتك هنا...",
    composerDisabledPlaceholder: "الخدمة الذكية غير متاحة الآن",
    upgradeAction: "ترقية",
    aiUnavailableTitle: "الذكاء غير متاح الآن",
    aiUnavailableBody: "الإعدادات أو الاتصال يحتاجان مراجعة قبل إكمال الرد.",
    runFailedTitle: "الرد لم يكتمل",
    runtimeChecking: "أراجع جاهزية النظام الآن. جرّب بعد لحظة.",
    runtimeWorkerOffline: "عامل الذكاء غير متصل الآن. شغّل الخدمة ثم جرّب مرة ثانية.",
    runtimeMissingLlm: "إعدادات الذكاء غير مكتملة الآن.",
    runtimeThreadSync: "أزامن المحادثة الآن. جرّب بعد لحظة.",
    runtimeRestoringGuest: "أستعيد جلسة الضيف الآن. جرّب بعد لحظة.",
    runtimeSignInRequired: "لازم تسجل دخولك قبل ما تبعت رسالة.",
    runtimeAssistantTimeout: "الرد أخذ وقت أطول من اللازم. جرّب مرة ثانية.",
    runtimeCompletedWithoutResponse: "المحادثة انتهت بدون رد واضح. جرّب مرة ثانية.",
    routeAdvisor: "استشارة",
    routeProperty: "بحث عقاري",
    routeFunding: "تمويل",
    routeLegal: "قانوني",
    routeMixed: "بحث وتمويل",
    stageClassifyStarted: "أفهم الطلب الآن.",
    stageClassifyDone: "حددت أفضل مسار للرد.",
    stageSpecialistStarted: "أشتغل على التفاصيل الآن.",
    stageSpecialistDone: "أنهيت الجزء الأساسي من التحليل.",
    stageSummaryStarted: "أجهز الرد النهائي الآن.",
    stageSummaryDone: "الرد جاهز تقريبًا.",
    stagePersistStarted: "أحفظ نتيجة المحادثة.",
    stagePersistDone: "تم حفظ الرد.",
    bestPropertyMatches: "أفضل العقارات المناسبة",
    propertiesThatFitBrief: "عقارات مناسبة لطلبك",
    noStrongPropertyMatchYet: "لسه مفيش تطابق قوي",
    needOneMoreSearchSignal: "محتاج إشارة إضافية واحدة عشان أضيّق النتائج.",
    whatSeparatesTopOptions: "الفرق بين أفضل الخيارات",
    whatStandsOut: "أهم الملاحظات",
    fundingAngle: "زاوية التمويل",
    liveMarketSources: "مصادر السوق المباشرة",
    nextUsefulStep: "الخطوة الأنسب الآن",
    actions: "إجراءات",
    previousSearchUnavailableAssistant: "لقيت الإشارة للبحث السابق، لكن النتائج دي مش ظاهرة الآن في الكتالوج الحالي.",
    previousSearchUnavailableHighlight: "تم تحميل النتائج السابقة، لكن ما وصلش تطابق نشط من الكتالوج الحالي.",
    previousSearchUnavailableFollowup: "تحب أعيد نفس البحث بأحدث النتائج؟",
    noStrongMatchAssistant: "لسه ما لقيتش تطابق قوي، لكن أقدر أضيق البحث لو ثبتنا المنطقة أو الميزانية أو عدد الغرف.",
    noStrongMatchHighlight: "الطلب الحالي لسه واسع زيادة أو خارج المعروض الظاهر الآن.",
    noStrongMatchFollowup: "تحب نثبت المنطقة ولا الميزانية أولًا؟",
    propertyReviewedFallback: "راجعت جانب العقارات في طلبك.",
    advisorFallbackBody: "قلّي عايز توصل لإيه وأنا أرتب معاك الخطوة الأنسب.",
    openProperty: "افتح العقار",
    saveTopMatch: "احفظ أفضل اختيار",
    compareTopPicks: "قارن أفضل الخيارات",
    refineThisSearch: "حسّن هذا البحث",
    openSearch: "افتح البحث",
    continueFundingPlanning: "كمّل تخطيط التمويل",
    fundingPlan: "خطة التمويل",
    fundingContinuePrompt: "ساعدني أكمل خطة التمويل الخاصة بالشراء ده.",
    continueLegalReview: "كمّل المراجعة القانونية",
    legalReview: "مراجعة قانونية",
    legalContinuePrompt: "راجع معايا المخاطر والبنود اللي محتاجة تدقيق قانوني هنا.",
    refineSearchPrompt: "حسّن البحث ده بمنطقة أو ميزانية أدق.",
  },
  en: {
    brandTagline: "INTELLIGENT INFRASTRUCTURE",
    greeting: "Hey, how can I help you find something today?",
    composerPlaceholder: "Type your follow-up here...",
    composerDisabledPlaceholder: "AI unavailable right now",
    upgradeAction: "Upgrade",
    aiUnavailableTitle: "AI unavailable",
    aiUnavailableBody: "The assistant needs runtime or model setup before it can respond.",
    runFailedTitle: "Run failed",
    runtimeChecking: "Checking the AI runtime. Try again in a moment.",
    runtimeWorkerOffline: "The AI worker is offline right now. Start the service and try again.",
    runtimeMissingLlm: "The AI model configuration is incomplete right now.",
    runtimeThreadSync: "Syncing your conversation. Try again in a moment.",
    runtimeRestoringGuest: "Restoring your guest session. Try again in a moment.",
    runtimeSignInRequired: "Sign in before sending a prompt.",
    runtimeAssistantTimeout: "The reply is taking too long. Try again.",
    runtimeCompletedWithoutResponse: "The run finished without a clear reply. Try again.",
    routeAdvisor: "Advisor",
    routeProperty: "Property",
    routeFunding: "Funding",
    routeLegal: "Legal",
    routeMixed: "Property + Funding",
    stageClassifyStarted: "Understanding the request.",
    stageClassifyDone: "Picked the best response path.",
    stageSpecialistStarted: "Working through the details.",
    stageSpecialistDone: "Finished the core analysis.",
    stageSummaryStarted: "Preparing the final reply.",
    stageSummaryDone: "Reply is almost ready.",
    stagePersistStarted: "Saving the result.",
    stagePersistDone: "Reply saved.",
    bestPropertyMatches: "Best property matches",
    propertiesThatFitBrief: "Properties that fit the brief",
    noStrongPropertyMatchYet: "No strong property match yet",
    needOneMoreSearchSignal: "I need one more search signal to tighten the shortlist.",
    whatSeparatesTopOptions: "What separates the top options",
    whatStandsOut: "What stands out",
    fundingAngle: "Funding angle",
    liveMarketSources: "Live market sources",
    nextUsefulStep: "Next useful step",
    actions: "Actions",
    previousSearchUnavailableAssistant: "I found the previous search reference, but those listings are not available in the current catalog view anymore.",
    previousSearchUnavailableHighlight: "The previous result set loaded, but no active listings came back from the current catalog.",
    previousSearchUnavailableFollowup: "Should I rerun the same search with current availability?",
    noStrongMatchAssistant: "I could not find a strong match yet, but I can refine the search with a tighter area, budget, or bedroom count.",
    noStrongMatchHighlight: "The current brief is still too broad or outside the visible catalog.",
    noStrongMatchFollowup: "Which area or budget should I lock first?",
    propertyReviewedFallback: "I reviewed the property side of your request.",
    advisorFallbackBody: "Tell me what you want to figure out and I will guide the next step.",
    openProperty: "Open property",
    saveTopMatch: "Save top match",
    compareTopPicks: "Compare top picks",
    refineThisSearch: "Refine this search",
    openSearch: "Open search",
    continueFundingPlanning: "Continue funding planning",
    fundingPlan: "Funding plan",
    fundingContinuePrompt: "Help me tighten the financing plan for this purchase.",
    continueLegalReview: "Continue legal review",
    legalReview: "Legal review",
    legalContinuePrompt: "Help me review the main legal risks and checks for this case.",
    refineSearchPrompt: "Refine this search using a tighter area or budget.",
  },
  fr: {
    brandTagline: "INFRASTRUCTURE INTELLIGENTE",
    greeting: "Bonjour, comment puis-je vous aider aujourd’hui ?",
    composerPlaceholder: "Écrivez votre message ici...",
    composerDisabledPlaceholder: "L’IA n’est pas disponible pour le moment",
    upgradeAction: "Mettre à niveau",
    aiUnavailableTitle: "IA indisponible",
    aiUnavailableBody: "L’assistant a besoin d’une configuration valide avant de répondre.",
    runFailedTitle: "Réponse interrompue",
    runtimeChecking: "Je vérifie la disponibilité du système. Réessayez dans un instant.",
    runtimeWorkerOffline: "Le service IA est hors ligne pour le moment. Relancez-le puis réessayez.",
    runtimeMissingLlm: "La configuration du modèle IA est incomplète pour le moment.",
    runtimeThreadSync: "Je synchronise la conversation. Réessayez dans un instant.",
    runtimeRestoringGuest: "Je restaure la session invité. Réessayez dans un instant.",
    runtimeSignInRequired: "Connectez-vous avant d’envoyer un message.",
    runtimeAssistantTimeout: "La réponse prend trop de temps. Réessayez.",
    runtimeCompletedWithoutResponse: "Le traitement s’est terminé sans réponse claire. Réessayez.",
    routeAdvisor: "Conseil",
    routeProperty: "Recherche immobilière",
    routeFunding: "Financement",
    routeLegal: "Juridique",
    routeMixed: "Recherche + financement",
    stageClassifyStarted: "Je comprends la demande.",
    stageClassifyDone: "J’ai choisi le meilleur parcours de réponse.",
    stageSpecialistStarted: "Je travaille les détails.",
    stageSpecialistDone: "L’analyse principale est terminée.",
    stageSummaryStarted: "Je prépare la réponse finale.",
    stageSummaryDone: "La réponse est presque prête.",
    stagePersistStarted: "J’enregistre le résultat.",
    stagePersistDone: "La réponse est enregistrée.",
    bestPropertyMatches: "Meilleures options immobilières",
    propertiesThatFitBrief: "Biens adaptés à votre demande",
    noStrongPropertyMatchYet: "Aucune correspondance forte pour le moment",
    needOneMoreSearchSignal: "Il me faut un signal de recherche supplémentaire pour affiner les résultats.",
    whatSeparatesTopOptions: "Ce qui différencie les meilleures options",
    whatStandsOut: "Ce qui ressort",
    fundingAngle: "Angle financement",
    liveMarketSources: "Sources marché en direct",
    nextUsefulStep: "Étape utile suivante",
    actions: "Actions",
    previousSearchUnavailableAssistant: "J’ai retrouvé la recherche précédente, mais ces annonces ne sont plus visibles dans le catalogue actuel.",
    previousSearchUnavailableHighlight: "Les résultats précédents ont été chargés, mais aucune annonce active n’est revenue du catalogue actuel.",
    previousSearchUnavailableFollowup: "Voulez-vous que je relance cette recherche avec les disponibilités actuelles ?",
    noStrongMatchAssistant: "Je n’ai pas encore trouvé de correspondance forte, mais je peux affiner la recherche avec une zone, un budget ou un nombre de chambres plus précis.",
    noStrongMatchHighlight: "La demande reste trop large ou hors du catalogue visible pour le moment.",
    noStrongMatchFollowup: "On verrouille d’abord la zone ou le budget ?",
    propertyReviewedFallback: "J’ai traité la partie immobilière de votre demande.",
    advisorFallbackBody: "Dites-moi ce que vous voulez clarifier et je vous guiderai vers la prochaine étape.",
    openProperty: "Ouvrir le bien",
    saveTopMatch: "Enregistrer le meilleur choix",
    compareTopPicks: "Comparer les meilleurs choix",
    refineThisSearch: "Affiner cette recherche",
    openSearch: "Ouvrir la recherche",
    continueFundingPlanning: "Continuer le plan de financement",
    fundingPlan: "Plan de financement",
    fundingContinuePrompt: "Aidez-moi à affiner le plan de financement pour cet achat.",
    continueLegalReview: "Continuer la revue juridique",
    legalReview: "Revue juridique",
    legalContinuePrompt: "Aidez-moi à revoir les principaux risques et contrôles juridiques de ce dossier.",
    refineSearchPrompt: "Affinez cette recherche avec une zone ou un budget plus précis.",
  },
};

export function isSupportedAssistantUiLocale(value: string | null | undefined): value is AssistantUiLocale {
  return value === "ar" || value === "en" || value === "fr";
}

export function getCuratedAssistantSurfaceCopy(locale: AssistantUiLocale) {
  return CURATED_ASSISTANT_SURFACE_COPY[locale];
}

export function resolveAssistantSurfaceCopy(presentation?: Partial<ThreadPresentation> | null): AssistantSurfaceCopy {
  if (presentation?.uiLocale && isSupportedAssistantUiLocale(presentation.uiLocale)) {
    return getCuratedAssistantSurfaceCopy(presentation.uiLocale);
  }

  if (presentation?.surfaceCopy) {
    return presentation.surfaceCopy;
  }

  return CURATED_ASSISTANT_SURFACE_COPY.en;
}

export function resolveDirectionFromLanguageTag(languageTag?: string | null): AssistantDirection {
  const normalized = (languageTag ?? "").trim().toLowerCase();
  if (/(^ar[-_](latn|latin)\b)|(^arz[-_](latn|latin)\b)/.test(normalized)) {
    return "ltr";
  }
  return /^(ar|fa|ur|he|ps|sd)\b/.test(normalized) ? "rtl" : "ltr";
}

export function resolveUiLocaleFromLanguageTag(languageTag?: string | null): AssistantUiLocale | null {
  const normalized = (languageTag ?? "").trim().toLowerCase();
  if (/(^ar[-_](latn|latin)\b)|(^arz[-_](latn|latin)\b)/.test(normalized)) return null;
  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("fr")) return "fr";
  return null;
}
