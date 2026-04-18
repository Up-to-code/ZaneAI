export type AppLocale = "ar" | "en" | "fr";

export const WEB_LOCALE_COOKIE = "zaneai_web_locale";
export const WORKSPACE_LOCALE_COOKIE = "zaneai_workspace_locale";
export const WEB_SUPPORTED_LOCALES = ["ar", "en", "fr"] as const satisfies readonly AppLocale[];

const localeLabelMap: Record<AppLocale, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
};

const localeNumberFormatMap: Record<AppLocale, string> = {
  ar: "ar-SA",
  en: "en-SA",
  fr: "fr-FR",
};

const localeDateFormatMap: Record<AppLocale, string> = {
  ar: "ar-SA",
  en: "en-US",
  fr: "fr-FR",
};

export function resolveLocale(input?: string | null): AppLocale {
  return input === "en" || input === "fr" ? input : "ar";
}

export function isRtlLocale(locale: AppLocale) {
  return locale === "ar";
}

export function getLocaleDirection(locale: AppLocale): "rtl" | "ltr" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}

export function getLocaleLabel(locale: AppLocale) {
  return localeLabelMap[locale];
}

export function getLocaleNumberFormat(locale: AppLocale) {
  return localeNumberFormatMap[locale];
}

export function getLocaleDateFormat(locale: AppLocale) {
  return localeDateFormatMap[locale];
}

export function getNextLocale(locale: AppLocale) {
  const currentIndex = WEB_SUPPORTED_LOCALES.indexOf(locale);
  return WEB_SUPPORTED_LOCALES[(currentIndex + 1) % WEB_SUPPORTED_LOCALES.length];
}

export function formatLocaleDateTime(locale: AppLocale, value: number | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(getLocaleDateFormat(locale), options).format(
    value instanceof Date ? value : new Date(value),
  );
}

export function formatLocaleNumber(locale: AppLocale, value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(getLocaleNumberFormat(locale), options).format(value);
}

export type WebDictionary = {
  landing: {
    heroBadge: string;
    heroTitle: string;
    heroDescription: string;
    heroTryFree: string;
    heroBookDemo: string;
    connectiveLayer: string;
    connectiveLayerSubtitle: string;
    pipelineTitle: string;
    pipelineDescription: string;
    truthTitle: string;
    truthDescription: string;
    reflowTitle: string;
    reflowDescription: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    metricsTitle: string;
    metricsAUMValue: string;
    metricsAUMText: string;
    metricsUsersValue: string;
    metricsUsersText: string;
    metricsCoverageValue: string;
    metricsCoverageText: string;
    pillarConnectTitle: string;
    pillarConnectDesc: string;
    pillarAutomateTitle: string;
    pillarAutomateDesc: string;
    pillarScaleTitle: string;
    pillarScaleDesc: string;
    archTitle: string;
    archSubtitle: string;
    archDescription: string;
  };
  nav: {
    home: string;
    developer: string;
    broker: string;
    about: string;
    contact: string;
    workspaceSignIn: string;
    getStarted: string;
    switchLanguage: string;
    activateLightMode: string;
    activateDarkMode: string;
    workspaceSettings: string;
    notifications: string;
    inbox: string;
    overviewTitle: string;
    assistantTitle: string;
    workspaceFallback: string;
    newChat: string;
    hideSidebar: string;
    showSidebar: string;
    allThreads: string;
    searchThreadsPlaceholder: string;
    noMatchingThreads: string;
    chooseConversation: string;
    close: string;
    newLabel: string;
    recentThreads: string;
    untitledConversation: string;
    pageLabel: string;
    ofLabel: string;
    previousPage: string;
    nextPage: string;
    allThreadsCount: string;
    openNavigation: string;
    workspaceNavigation: string;
    currentWorkspaceSection: string;
    normalMode: string;
    aiMode: string;
    soonBadge: string;
    operationsLabel: string;
    contextsAndThreads: string;
    assistantThreadFallback: string;
    workspaceLabel: string;
  };
  footer: {
    brandTitle: string;
    description: string;
    platform: string;
    community: string;
    legal: string;
    developers: string;
    brokers: string;
    pricing: string;
    partnerships: string;
    docs: string;
    team: string;
    careers: string;
    twitter: string;
    linkedin: string;
    privacy: string;
    terms: string;
    faq: string;
    blog: string;
    bottomTagline: string;
    copyright: string;
  };
  status: {
    developer: string;
    broker: string;
    active: string;
    pendingReview: string;
  };
  signin: {
    title: string;
    description: string;
    agreementPrefix: string;
    agreementTerms: string;
    agreementAnd: string;
    agreementPrivacy: string;
    agreementSuffix: string;
    encrypted: string;
    clearTerms: string;
  };
  errors: {
    notFoundTitle: string;
    notFoundDescription: string;
    backHome: string;
    contactSupport: string;
    workspaceErrorTitle: string;
    workspaceErrorDescription: string;
    retry: string;
    backToWorkspace: string;
    workspaceUnavailableTitle: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    create: string;
    all: string;
    linkedClient: string;
    idleBroker: string;
    noBrokers: string;
    rooms: string;
    baths: string;
    area: string;
    publish: string;
    openProject: string;
    deleteTitle: string;
    deleteDescription: string;
    deleteConfirm: string;
    actionFailed: string;
    createSelectionTitle: string;
    createSelectionSubtitle: string;
    createProjectType: string;
    createProjectHeadline: string;
    createProjectDesc: string;
    createUnitType: string;
    createUnitHeadline: string;
    createUnitDesc: string;
    continueFlow: string;
  };
  units: {
    title: string;
    create: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    deleteDescription: string;
    label: string;
    type: string;
    floor: string;
    status: string;
    price: string;
    description: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    available: string;
    reserved: string;
    sold: string;
    apartment: string;
    villa: string;
    duplex: string;
    studio: string;
    penthouse: string;
    townhouse: string;
    commercial: string;
    noUnits: string;
    unitCount: string;
    addUnit: string;
    manageUnits: string;
    unitDetails: string;
    saveUnit: string;
    cancel: string;
  };
  offers: {
    eyebrow: string;
    title: string;
    description: string;
    create: string;
    allQueues: string;
    queue: string;
    casesCount: string;
    value: string;
    asset: string;
    noClearAsset: string;
    unspecified: string;
    inventoryOwner: string;
    unknownOwner: string;
    noCommissionDetails: string;
    executionPartner: string;
    notAssignedYet: string;
    noPermitStatus: string;
    clientSummary: string;
    openToBrokersAndDevelopers: string;
    targetedToBrokers: string;
    targetedToDevelopers: string;
    openCase: string;
    emptyQueue: string;
  };
  crm: {
    eyebrow: string;
    title: string;
    createPlaceholder: string;
    create: string;
    clientsTitle: string;
    clientsDescription: string;
    addClient: string;
    resultsCount: string;
    noMatchingClients: string;
    firstPage: string;
    lastPageNow: string;
    nextPageAvailable: string;
    nextPage: string;
    open: string;
    withBroker: string;
    withoutBroker: string;
    budget: string;
    all: string;
    unlinked: string;
    projectOnly: string;
    fullyLinked: string;
  };
  notifications: {
    eyebrow: string;
    title: string;
    description: string;
    all: string;
    unread: string;
    unreadSummary: string;
    noPending: string;
    empty: string;
    read: string;
    new: string;
  };
  inbox: {
    brokerInvite: string;
    developerInvite: string;
    from: string;
    proposedRole: string;
    accept: string;
    message: string;
    cancel: string;
    incomingInvites: string;
    incomingInvitesDescription: string;
    member: string;
    pendingInvite: string;
    user: string;
    start: string;
    searching: string;
    noMatchingResults: string;
    startConversation: string;
    noConversations: string;
    noConversationsInSection: string;
    lastMessageFallback: string;
    emptyThreadTitle: string;
    emptyThreadDescription: string;
    loadingThread: string;
    composerPlaceholder: string;
    shareFile: string;
    shareProject: string;
    sharePrivateOffer: string;
    dropAttachment: string;
    sending: string;
    send: string;
    attachFile: string;
    closeSharePanel: string;
    noteLabel: string;
    fileNotePlaceholder: string;
    uploadFile: string;
    changeFile: string;
    uploadingFile: string;
    selectProject: string;
    projectOrProperty: string;
    chooseProject: string;
    openProjectGallery: string;
    choose: string;
    chooseProjectToShare: string;
    chooseProjectDescription: string;
    searchProjectHint: string;
    searchProjectPlaceholder: string;
    noExtraDescription: string;
    currentWorkspace: string;
    noPrice: string;
    noMatchingProjects: string;
    createOfferQuickly: string;
    toConversation: string;
    offerPrice: string;
    offerTitle: string;
    offerTitlePlaceholder: string;
    offerNotePlaceholder: string;
    offerAttachments: string;
    dragAttachments: string;
    uploadAttachments: string;
    uploadingAttachments: string;
    attachmentSendHint: string;
    offerSendHint: string;
    createAndSend: string;
    sendMessageFailed: string;
    fileUploadFailed: string;
    offerUploadFailed: string;
    chooseProjectAndPriceFirst: string;
    chooseFileFirst: string;
    chooseProjectFirst: string;
    attachTypeFile: string;
    attachTypeProject: string;
    attachTypeOffer: string;
    attachTypeFileDescription: string;
    attachTypeProjectDescription: string;
    attachTypeOfferDescription: string;
    threadActionOffer: string;
    threadActionProject: string;
    threadActionFile: string;
    threadActionOpen: string;
    threadActionUnavailable: string;
    threadMenuLabel: string;
    back: string;
    broker: string;
    developer: string;
    userLabel: string;
    fileShareLabel: string;
    projectShareLabel: string;
    dealShareLabel: string;
    inviteUpdateLabel: string;
    roleUpdateLabel: string;
    workspaceProject: string;
  };
  market: {
    title: string;
    description: string;
    analyzeMarket: string;
    scope: string;
    range: string;
    topKeyword: string;
    noClearSignal: string;
    mockDataBanner: string;
  };
  settings: {
    workspaceLabel: string;
    title: string;
    description: string;
    organization: string;
    verification: string;
    membersAndInvites: string;
    apps: string;
    apiKeys: string;
    manager: string;
    viewer: string;
    member: string;
    unavailable: string;
    membersSummary: string;
    apiKeysSummaryCreate: string;
    apiKeysSummaryRevoke: string;
    apiKeysSummaryNoAccess: string;
    connectedAppsSummaryManage: string;
    connectedAppsSummaryReadonly: string;
    connectedAppsPageTitle: string;
    connectedAppsPageDescription: string;
    connectedAppsLegacyNotice: string;
    connectedAppsReadonlyNotice: string;
    connectedAppsEmptyTitle: string;
    connectedAppsEmptyDescription: string;
    connectedAppsConnectedAt: string;
    connectedAppsLastUsed: string;
    connectedAppsNeverUsed: string;
    connectedAppsRevoke: string;
    connectedAppsRevoking: string;
    connectedAppsRevokeConfirm: string;
    apiKeysNoOrgTitle: string;
    apiKeysNoOrgDescription: string;
    apiKeysRestrictedTitle: string;
    apiKeysRestrictedDescription: string;
    apiKeysPageTitle: string;
    apiKeysPageDescription: string;
    apiKeysEmptyTitle: string;
    apiKeysEmptyDescription: string;
    apiKeysCreateFirst: string;
    apiKeysCreateOwnerOnly: string;
    apiKeysCreateButton: string;
    apiKeysCreatedTitle: string;
    apiKeysCreateDialogTitle: string;
    apiKeysClose: string;
    apiKeysSecretTitle: string;
    apiKeysSecretDescription: string;
    apiKeysCopy: string;
    apiKeysCopied: string;
    apiKeysCopiedConfirm: string;
    apiKeysNameLabel: string;
    apiKeysNamePlaceholder: string;
    apiKeysPermissionsLabel: string;
    apiKeysPermissionsHint: string;
    apiKeysReadOnly: string;
    apiKeysReadWrite: string;
    apiKeysFullAccess: string;
    apiKeysResourceColumn: string;
    apiKeysDetailsColumn: string;
    apiKeysLastUsedColumn: string;
    apiKeysActionColumn: string;
    apiKeysUnnamed: string;
    apiKeysActive: string;
    apiKeysRevoked: string;
    apiKeysCreatedAt: string;
    apiKeysNeverUsed: string;
    apiKeysRevoking: string;
    apiKeysRevoke: string;
    apiKeysRevokedState: string;
    apiKeysCreateOwnerStatus: string;
    apiKeysChoosePermissionStatus: string;
    apiKeysCreatingStatus: string;
    apiKeysCreateFailedStatus: string;
    apiKeysCreatedStatus: string;
    apiKeysRevokePermissionStatus: string;
    apiKeysRevokingStatus: string;
    apiKeysRevokeFailedStatus: string;
    apiKeysRevokedStatus: string;
    membersTitle: string;
    inviteMember: string;
    inviteMemberTitle: string;
    inviteMemberDescription: string;
    inviteSearchLabel: string;
    inviteSearchPlaceholder: string;
    inviteSearchHint: string;
    roleLabel: string;
    sendInvite: string;
    roleUpdateInProgress: string;
    roleUpdateFailed: string;
    roleUpdated: string;
    inviteCancelInProgress: string;
    inviteCancelFailed: string;
    inviteCanceled: string;
    pendingInvitesTitle: string;
    managerGuardrail: string;
    inviteExpires: string;
    currentMember: string;
    nonMember: string;
    managerPermissionRequired: string;
    inviteSending: string;
    inviteFailed: string;
    inviteSent: string;
    openConversationFailed: string;
    noOrganizationLinked: string;
    searchingDirectory: string;
    searchFailed: string;
    noMatchingDirectoryResult: string;
    cannotInviteWithoutOrganization: string;
    openConversation: string;
    verificationTitle: string;
    verificationEmptyOrganization: string;
    verificationCurrentStatus: string;
    publishingStatus: string;
    publishingBlocked: string;
    publishingAllowed: string;
    lastSubmission: string;
    filesCount: string;
    membersCountLabel: string;
    teamSummary: string;
    reviewNotes: string;
    verificationTimeline: string;
    verificationNoTimeline: string;
    latestDocuments: string;
    unknownDocumentType: string;
    verificationSubmitTitle: string;
    verificationSubmitDescription: string;
    requiredDocsTitle: string;
    requiredDocsSubtitle: string;
    proofDocsTitle: string;
    proofDocsSubtitle: string;
    uploadingFiles: string;
    uploadFilesIdle: string;
    uploadProofIdle: string;
    managerOnlySubmissionHint: string;
    viewerSubmissionHint: string;
    verificationRequiredDocsError: string;
    verificationSubmitting: string;
    verificationSubmitFailed: string;
    verificationSubmitted: string;
    verificationSubmit: string;
    verificationResubmit: string;
    accountSettingsTitle: string;
    accountSettingsDescription: string;
    logoutAction: string;
    loggingOut: string;
    organizationSettingsTitle: string;
    organizationSettingsDescription: string;
    organizationIdentityTitle: string;
    organizationIdentityDescription: string;
    organizationSlug: string;
    organizationStatus: string;
    organizationType: string;
    organizationVerified: string;
    organizationVerifiedYes: string;
    organizationVerifiedNo: string;
    organizationNameLabel: string;
    organizationDescriptionLabel: string;
    organizationDescriptionHint: string;
    organizationWebsiteLabel: string;
    organizationEmailLabel: string;
    organizationPhoneLabel: string;
    organizationNoOrganization: string;
    organizationManagerRequired: string;
    organizationSaving: string;
    organizationSaveFailed: string;
    organizationSaved: string;
    organizationSave: string;
    organizationTypeBroker: string;
    organizationTypeDeveloper: string;
  };
  assistant: {
    placeholderDeveloper: string;
    placeholderBroker: string;
    placeholderDefault: string;
    attach: string;
    search: string;
    deepSearch: string;
    stop: string;
    voiceTitle: string;
    closeVoicePanel: string;
    voiceCancel: string;
    requestPermissionAgain: string;
    stopRecording: string;
    liveInput: string;
    processing: string;
    ready: string;
    preparingMic: string;
    waitingForSpeech: string;
    silenceCountdown: string;
    uploadingRecording: string;
    analyzingRecording: string;
    sendingMessage: string;
    recordingError: string;
    recordingNow: string;
    preparingUpload: string;
    savingUploads: string;
    uploadFailed: string;
    sendFailed: string;
    statusUploading: string;
    statusUploadFailed: string;
    statusReady: string;
    removeAttachment: string;
    attachmentRetryHint: string;
  };
  about: {
    badge: string;
    title: string;
    titleAccent: string;
    description: string;
    contact: string;
    missionTitle: string;
    missionDescription: string;
    valuesTitle: string;
    valuesDescription: string;
    workStyleTitle: string;
    workStyleDescription: string;
    whyTitle: string;
    whyAccent: string;
    whyDescriptionPrimary: string;
    whyDescriptionSecondary: string;
    metricsUnified: string;
    metricsAudience: string;
    metricsAvailability: string;
    metricsClarity: string;
    identityTitle: string;
    identityAccent: string;
    identityDescriptionPrimary: string;
    identityDescriptionSecondary: string;
    talkToTeam: string;
    developerSpace: string;
  };
  homeSearch: {
    ready: string;
    projects: string;
    buy: string;
    rent: string;
    placeholder: string;
  };
  hero: {
    subtitle: string;
  };
  cta: {
    title: string;
    subtitle: string;
  };
};

const dictionaries: Record<AppLocale, WebDictionary> = {
  ar: {
    landing: {
      heroBadge: "نقود نموذجاً جديداً",
      heroTitle: "بنية تحتية تشغيلية مدعومة بالذكاء",
      heroDescription: "أول طبقة ربط عقارية تسحب البيانات الهيكلية مباشرة أثناء بحثك - لتمنحك بيانات دقيقة وموثوقة لتنفيذ سير عملك.",
      heroTryFree: "جرب التطبيق مجاناً",
      heroBookDemo: "احجز عرضاً",
      connectiveLayer: "طبقة الربط",
      connectiveLayerSubtitle: "مصممة لإزالة الاحتكاك بين نية العميل والتنفيذ. تعمل زين إيه آي محلياً لتزامن الطلب مباشرة.",
      pipelineTitle: "بيانات منظمة لخط سير العمل",
      pipelineDescription: "شاهد كيف تتطابق رغبة العميل مع المخزون المتاح، لتحوّل المحادثات إلى سجلات عملاء جاهزة للتنفيذ.",
      truthTitle: "حقيقة لا تتغير",
      truthDescription: "تعمل كل المقاييس كمرجع واحد حقيقي يشارك البيانات مع جميع القنوات والتقارير.",
      reflowTitle: "تحديث فوري",
      reflowDescription: "تنعكس أي تعديلات في التسعير أو الحالات أو المساحات فوراً على سير العمل دون تدخل بشري.",
      ctaTitle: "انتقل من اليدوي إلى التلقائي.",
      ctaDescription: "ابدأ في استخدام البنية التحتية خلف أقوى الشركات العقارية أداءً.",
      ctaButton: "انشر أعمالك اليوم",
      metricsTitle: "المقاييس المؤسسية",
      metricsAUMValue: "$1.4B+",
      metricsAUMText: "الأصول تحت الإدارة",
      metricsUsersValue: "50k+",
      metricsUsersText: "مستخدم نشط",
      metricsCoverageValue: "120+",
      metricsCoverageText: "منطقة تغطية",
      pillarConnectTitle: "ربط",
      pillarConnectDesc: "توحيد صوامع البيانات في بنية تحتية واحدة.",
      pillarAutomateTitle: "أتمتة",
      pillarAutomateDesc: "تحويل العمليات اليدوية إلى سير عمل ذكي.",
      pillarScaleTitle: "توسيع",
      pillarScaleDesc: "تمكين النمو المؤسسي من خلال الرؤى القائمة على الذكاء.",
      archTitle: "بنية الأنظمة",
      archSubtitle: "الطبقة الذكية",
      archDescription: "تعمل زين إيه آي كطبقة تشغيلية ذكية تربط بين نية العميل والبيانات الهيكلية، مما يوفر مرجعاً وحيداً للحقيقة لجميع العمليات العقارية."
    },
    nav: {
      home: "الرئيسية",
      developer: "مساحة المطورين",
      broker: "مساحة الوسطاء",
      about: "عن الشركة",
      contact: "تواصل",
      workspaceSignIn: "دخول المساحة",
      getStarted: "ابدأ من هنا",
      switchLanguage: "تغيير اللغة",
      activateLightMode: "تفعيل الوضع الفاتح",
      activateDarkMode: "تفعيل الوضع الداكن",
      workspaceSettings: "إعدادات المنظمة",
      notifications: "الإشعارات",
      inbox: "الرسائل",
      overviewTitle: "نظرة عامة",
      assistantTitle: "مساعد زين إيه آي",
      workspaceFallback: "مساحة العمل",
      newChat: "محادثة جديدة",
      hideSidebar: "إخفاء القائمة",
      showSidebar: "إظهار القائمة",
      allThreads: "كل المحادثات",
      searchThreadsPlaceholder: "ابحث بعنوان المحادثة",
      noMatchingThreads: "لا توجد محادثات بهذا العنوان",
      chooseConversation: "اختر محادثة للمتابعة أو ابحث بعنوانها",
      close: "إغلاق",
      newLabel: "جديد",
      recentThreads: "آخر 3 محادثات",
      untitledConversation: "محادثة بدون عنوان",
      pageLabel: "صفحة",
      ofLabel: "من",
      previousPage: "الصفحة السابقة",
      nextPage: "الصفحة التالية",
      allThreadsCount: "عرض كل المحادثات",
      openNavigation: "فتح التنقل",
      workspaceNavigation: "تنقل مساحة العمل",
      currentWorkspaceSection: "القائمة الرئيسية الخاصة بمنطقة العمل الحالية.",
      normalMode: "الوضع العادي",
      aiMode: "وضع الذكاء",
      soonBadge: "قريباً",
      operationsLabel: "العمليات",
      contextsAndThreads: "السياقات والمحادثات",
      assistantThreadFallback: "محادثة المساعد",
      workspaceLabel: "مساحة العمل",
    },
    footer: {
      brandTitle: "مساحة العمل للمطورين والوسطاء",
      description: "منصة عمل موحدة تساعد الفرق على التعاون، متابعة العمليات اليومية، وفهم المنتج من نقطة واحدة واضحة.",
      platform: "المنصة",
      community: "المجتمع",
      legal: "القانون",
      developers: "مساحة المطورين",
      brokers: "مساحة الوسطاء",
      pricing: "الباقات",
      partnerships: "التعاونات",
      docs: "التوثيق",
      team: "الفريق",
      careers: "التوظيف",
      twitter: "تويتر",
      linkedin: "لينكدإن",
      privacy: "الخصوصية",
      terms: "الشروط",
      faq: "الأسئلة الشائعة",
      blog: "المدونة",
      bottomTagline: "مساحة واحدة للعمل الواضح والتواصل المنظم.",
      copyright: "© ٢٠٢٥ شركة زين إيه آي للحلول الرقمية. جميع الحقوق محفوظة.",
    },
    status: {
      developer: "مطور",
      broker: "وسيط",
      active: "نشط",
      pendingReview: "قيد المراجعة",
    },
    signin: {
      title: "دخول مساحة العمل",
      description: "وصول آمن إلى مساحة زين إيه آي للمطورين والوسطاء.",
      agreementPrefix: "بالدخول للنظام، أنت توافق على",
      agreementTerms: "اتفاقية الاستخدام",
      agreementAnd: "و",
      agreementPrivacy: "سياسة الخصوصية",
      agreementSuffix: "الخاصة بالمنصة.",
      encrypted: "تشفير مؤسسي",
      clearTerms: "شروط واضحة",
    },
    errors: {
      notFoundTitle: "عذراً، الصفحة غير موجودة",
      notFoundDescription: "يبدو أنك حاولت الوصول إلى مسار غير معرّف في بنية زين إيه آي التحتية الرقمية.",
      backHome: "العودة للرئيسية",
      contactSupport: "تواصل مع الدعم",
      workspaceErrorTitle: "حدث خطأ أثناء تحميل مساحة العمل.",
      workspaceErrorDescription: "حاول إعادة المحاولة أو الرجوع إلى الصفحة الرئيسية لمساحة العمل.",
      retry: "إعادة المحاولة",
      backToWorkspace: "العودة إلى مساحة العمل",
      workspaceUnavailableTitle: "تعذر تحميل مساحة العمل الآن",
    },
    projects: {
      eyebrow: "المشاريع",
      title: "المشاريع",
      description: "إدارة محفظتك العقارية والمشاريع المسجلة.",
      create: "إنشاء مشروع جديد",
      all: "الكل",
      linkedClient: "مرتبط بعميل",
      idleBroker: "وسيط بدون عميل",
      noBrokers: "بدون وسطاء",
      rooms: "الغرف",
      baths: "الحمامات",
      area: "المساحة",
      publish: "نشر",
      openProject: "فتح المشروع",
      deleteTitle: "حذف مشروع",
      deleteDescription: "سيتم إزالة المشروع من المحفظة بشكل نهائي مع كافة البيانات المرتبطة به.",
      deleteConfirm: "حذف المشروع",
      actionFailed: "تعذر إكمال العملية. حاول مرة أخرى.",
      createSelectionTitle: "اختر نوع العقار",
      createSelectionSubtitle: "حدد الإطار الذي يناسب احتياجاتك التشغيلية الحالية.",
      createProjectType: "مشروع",
      createProjectHeadline: "إنشاء مشروع متعدد الوحدات",
      createProjectDesc: "مثالي للمجمعات السكنية والمخزون الكبير. يدعم وحدات وتصاريح متعددة بملف مرجعي واحد.",
      createUnitType: "وحدة مستقلة",
      createUnitHeadline: "إنشاء وحدة واحدة مستقلة",
      createUnitDesc: "مثالية للمبيعات الفردية والفيلات والشقق المستقلة. سريعة ومباشرة للنشر.",
      continueFlow: "متابعة",
    },
    units: {
      title: "الوحدات",
      create: "إنشاء وحدة",
      edit: "تعديل الوحدة",
      delete: "حذف الوحدة",
      deleteConfirm: "حذف الوحدة",
      deleteDescription: "سيتم حذف هذه الوحدة نهائياً من المشروع.",
      label: "اسم الوحدة",
      type: "نوع الوحدة",
      floor: "الطابق",
      status: "الحالة",
      price: "السعر",
      description: "الوصف",
      bedrooms: "غرف النوم",
      bathrooms: "الحمامات",
      area: "المساحة",
      available: "متاحة",
      reserved: "محجوزة",
      sold: "مباعة",
      apartment: "شقة",
      villa: "فيلا",
      duplex: "دوبلكس",
      studio: "ستوديو",
      penthouse: "بنتهاوس",
      townhouse: "تاون هاوس",
      commercial: "تجاري",
      noUnits: "لا توجد وحدات في هذا المشروع بعد.",
      unitCount: "وحدة",
      addUnit: "إضافة وحدة",
      manageUnits: "إدارة الوحدات",
      unitDetails: "تفاصيل الوحدة",
      saveUnit: "حفظ الوحدة",
      cancel: "إلغاء",
    },
    offers: {
      eyebrow: "العروض 2.0",
      title: "العروض كحالات تعاون",
      description: "تم تنظيم منطقة العروض الآن حول الحالات العملية بين صاحب المخزون، الوسيط صاحب العميل، والطرف التنفيذي.",
      create: "إنشاء حالة جديدة",
      allQueues: "كل الطوابير",
      queue: "الطابور",
      casesCount: "عدد الحالات",
      value: "القيمة",
      asset: "الأصل",
      noClearAsset: "بدون أصل واضح",
      unspecified: "غير محدد",
      inventoryOwner: "صاحب المخزون",
      unknownOwner: "غير معروف",
      noCommissionDetails: "بدون تفاصيل عمولة",
      executionPartner: "الطرف التنفيذي",
      notAssignedYet: "لم يتم التوجيه بعد",
      noPermitStatus: "بدون حالة تصريح",
      clientSummary: "ملخص العميل",
      openToBrokersAndDevelopers: "مفتوح للوسطاء والمطورين",
      targetedToBrokers: "موجه للوسطاء",
      targetedToDevelopers: "موجه للمطورين",
      openCase: "افتح الحالة",
      emptyQueue: "لا توجد حالات في هذا الطابور الآن.",
    },
    crm: {
      eyebrow: "إدارة الصفقات",
      title: "الصفقات",
      createPlaceholder: "اسم صفقة أو عميل جديد",
      create: "إضافة صفقة",
      clientsTitle: "العملاء",
      clientsDescription: "إدارة الصفقات والارتباطات",
      addClient: "إضافة صفقة",
      resultsCount: "{count} نتائج",
      noMatchingClients: "لا توجد صفقات مطابقة للتصفية الحالية.",
      firstPage: "الصفحة الأولى",
      lastPageNow: "آخر صفحة حالياً",
      nextPageAvailable: "يمكن تحميل صفحة تالية",
      nextPage: "الصفحة التالية",
      open: "فتح",
      withBroker: "مع {name}",
      withoutBroker: "بدون وسيط",
      budget: "الميزانية",
      all: "الكل",
      unlinked: "بدون روابط",
      projectOnly: "مشروع فقط",
      fullyLinked: "مشروع + وسيط",
    },
    notifications: {
      eyebrow: "الإشعارات",
      title: "مركز التنبيهات",
      description: "تنبيهات حقيقية مرتبطة بالمحادثات والعروض والدعوات داخل نفس مساحة العمل.",
      all: "الكل",
      unread: "غير المقروءة",
      unreadSummary: "لديك {count} إشعارات غير مقروءة",
      noPending: "لا توجد إشعارات معلقة",
      empty: "لا توجد إشعارات ضمن هذا الفلتر.",
      read: "تم الاطلاع",
      new: "جديد",
    },
    inbox: {
      brokerInvite: "دعوة وسيط",
      developerInvite: "دعوة مطور",
      from: "من",
      proposedRole: "الدور المقترح",
      accept: "قبول",
      message: "مراسلة",
      cancel: "إلغاء",
      incomingInvites: "الدعوات الواردة",
      incomingInvitesDescription: "تعامل مع دعوات الفريق بسرعة من نفس مساحة البريد الوارد.",
      member: "عضو",
      pendingInvite: "دعوة معلقة",
      user: "مستخدم",
      start: "بدء",
      searching: "جاري البحث...",
      noMatchingResults: "لا توجد نتائج مطابقة لبحثك.",
      startConversation: "ابدأ المحادثة",
      noConversations: "لا توجد محادثات في هذا القسم حاليًا.",
      noConversationsInSection: "لا توجد محادثات في هذا القسم حاليًا.",
      lastMessageFallback: "ابدأ المحادثة",
      emptyThreadTitle: "البريد الوارد",
      emptyThreadDescription: "اختر محادثة من القائمة الجانبية أو ابحث عن مستخدم جديد لبدء نقاش مباشر.",
      loadingThread: "جاري تحميل المحادثة...",
      composerPlaceholder: "اكتب رسالتك لوسيط العقارات...",
      shareFile: "مشاركة ملف",
      shareProject: "مشاركة مشروع",
      sharePrivateOffer: "إرسال عرض خاص",
      dropAttachment: "أفلت صورة أو PDF هنا لإرفاقه بسرعة",
      sending: "جاري الإرسال",
      send: "إرسال",
      attachFile: "إرفاق ملف",
      closeSharePanel: "إغلاق لوحة المشاركة",
      noteLabel: "ملاحظة",
      fileNotePlaceholder: "أضف وصفًا قصيرًا للملف",
      uploadFile: "اختيار ملف",
      changeFile: "تغيير الملف",
      uploadingFile: "جارٍ رفع الملف...",
      selectProject: "اختر مشروعًا",
      projectOrProperty: "العقار أو المشروع",
      chooseProject: "اختر مشروعًا للمشاركة",
      openProjectGallery: "افتح المعرض المرئي لاختيار المشروع.",
      choose: "اختيار",
      chooseProjectToShare: "اختر مشروعًا للمشاركة",
      chooseProjectDescription: "اختيار بصري أسرع من القائمة النصية.",
      searchProjectHint: "ابحث أو اعرض مشاريع أخرى إذا كان المطور يملك قائمة طويلة.",
      searchProjectPlaceholder: "ابحث بالاسم أو الموقع أو الجهة",
      noExtraDescription: "بدون وصف إضافي",
      currentWorkspace: "مساحة العمل الحالية",
      noPrice: "بدون سعر",
      noMatchingProjects: "لا توجد مشاريع مطابقة لهذا البحث.",
      createOfferQuickly: "إنشاء وإرسال عرض سريع",
      toConversation: "إلى {name}",
      offerPrice: "السعر",
      offerTitle: "عنوان العرض",
      offerTitlePlaceholder: "مثال: عرض خاص على وحدة جاهزة للتسليم",
      offerNotePlaceholder: "اكتب الرسالة المختصرة التي تصاحب العرض.",
      offerAttachments: "مرفقات العرض",
      dragAttachments: "اسحب الملفات هنا أو اخترها يدويًا.",
      uploadAttachments: "إضافة مرفقات",
      uploadingAttachments: "جارٍ رفع المرفقات...",
      attachmentSendHint: "لن يتم إرسال هذه المرفقات حتى تضغط زر إنشاء وإرسال.",
      offerSendHint: "سيتم إنشاء العرض ثم إرساله مباشرة داخل المحادثة.",
      createAndSend: "إنشاء وإرسال",
      sendMessageFailed: "تعذر إرسال الرسالة. يمكنك المحاولة مرة أخرى.",
      fileUploadFailed: "تعذر رفع الملف.",
      offerUploadFailed: "تعذر رفع مرفقات العرض.",
      chooseProjectAndPriceFirst: "اختر عقارًا وحدد السعر قبل إرسال العرض.",
      chooseFileFirst: "اختر ملفًا قبل الإرسال.",
      chooseProjectFirst: "اختر عقارًا أو مشروعًا للمشاركة.",
      attachTypeFile: "إرفاق ملف",
      attachTypeProject: "إرسال عقار أو شقة",
      attachTypeOffer: "إنشاء عرض خاص",
      attachTypeFileDescription: "أرسل ملفًا مع ملاحظة قصيرة.",
      attachTypeProjectDescription: "اختر أصلًا واحدًا مع تعليق موجز.",
      attachTypeOfferDescription: "أنشئ عرضًا سريعًا ثم أرسله مباشرة من المحادثة.",
      threadActionOffer: "إنشاء عرض خاص",
      threadActionProject: "إرسال مشروع",
      threadActionFile: "إرفاق ملف",
      threadActionOpen: "افتح هذا الإجراء من نفس الشاشة.",
      threadActionUnavailable: "غير متاح لهذه المحادثة حاليًا.",
      threadMenuLabel: "إجراءات",
      back: "العودة",
      broker: "وسيط",
      developer: "مطور",
      userLabel: "مستخدم",
      fileShareLabel: "مشاركة ملف",
      projectShareLabel: "مشاركة مشروع",
      dealShareLabel: "مشاركة صفقة",
      inviteUpdateLabel: "تحديث دعوة",
      roleUpdateLabel: "تحديث صلاحية",
      workspaceProject: "مشروع مرتبط بالمساحة",
    },
    market: {
      title: "تحليل السوق",
      description: "واجهة ذكاء السوق كاملة محفوظة في الخلفية، وتظهر الآن بطبقة مؤقتة حتى يحين موعد التطوير الكامل.",
      analyzeMarket: "تحليل السوق",
      scope: "النطاق",
      range: "الفترة",
      topKeyword: "الكلمة الأبرز",
      noClearSignal: "لا توجد إشارة واضحة",
      mockDataBanner: "هذه الصفحة تعرض حالياً بيانات تجريبية حتى تتوفر بيانات سوق حقيقية كافية لهذا النطاق.",
    },
    settings: {
      workspaceLabel: "إعدادات مساحة العمل",
      title: "إعدادات المنظمة",
      description: "إدارة بيانات المنظمة والفريق والتوثيق من مكان واحد.",
      organization: "المنظمة",
      verification: "التوثيق",
      membersAndInvites: "الأعضاء والدعوات",
      apps: "التطبيقات",
      apiKeys: "مفاتيح API",
      manager: "مدير",
      viewer: "مشاهد",
      member: "عضو",
      unavailable: "غير متوفر",
      membersSummary: "{members} أعضاء، {invites} دعوات، وصلاحيتك الحالية: {roleLabel}",
      apiKeysSummaryCreate: "يمكنك إنشاء وإلغاء المفاتيح من هنا.",
      apiKeysSummaryRevoke: "يمكنك مراجعة المفاتيح وإلغاؤها من هنا.",
      apiKeysSummaryNoAccess: "لا تملك صلاحية إدارة هذا القسم.",
      connectedAppsSummaryManage: "يمكنك مراجعة التطبيقات المرتبطة بالمنظمة وإلغاء أي ربط غير مطلوب.",
      connectedAppsSummaryReadonly: "يمكنك مراجعة التطبيقات المرتبطة بالمنظمة، بينما يظل الإلغاء متاحاً للمدير فقط.",
      connectedAppsPageTitle: "تطبيقات المنظمة",
      connectedAppsPageDescription: "راجع التطبيقات الخارجية المرتبطة بهذه المنظمة والصلاحيات المعتمدة لها.",
      connectedAppsLegacyNotice: "التطبيقات المرتبطة أصبحت تُدار على مستوى المنظمة. أي ربط قديم على مستوى الحساب الشخصي يحتاج إعادة ربط من جديد لهذه المنظمة.",
      connectedAppsReadonlyNotice: "يمكن للمدير فقط الموافقة على تطبيق جديد أو إلغاء الربط، لكن يمكنك مراجعة التطبيقات الحالية من هنا.",
      connectedAppsEmptyTitle: "لا توجد تطبيقات مرتبطة حالياً",
      connectedAppsEmptyDescription: "ابدأ الربط من شاشة OAuth /authorize الخاصة بالتطبيق الخارجي. ستظهر الموافقات هنا بعد اعتمادها للمنظمة.",
      connectedAppsConnectedAt: "تم الربط",
      connectedAppsLastUsed: "آخر استخدام",
      connectedAppsNeverUsed: "لم يُستخدم",
      connectedAppsRevoke: "إلغاء الربط",
      connectedAppsRevoking: "جاري الإلغاء...",
      connectedAppsRevokeConfirm: "سيتم إلغاء ربط التطبيق عن هذه المنظمة وقطع كل الجلسات الحالية. هل تريد المتابعة؟",
      apiKeysNoOrgTitle: "مفاتيح API",
      apiKeysNoOrgDescription: "أنشئ منظمة أولاً قبل إصدار أي مفاتيح تكامل. ستتمكن من تخصيص صلاحيات محددة لكل مفتاح لضمان أمان بياناتك.",
      apiKeysRestrictedTitle: "مفاتيح API",
      apiKeysRestrictedDescription: "عرض مفاتيح API وإدارتها متاح فقط لمالكي المنظمة والمديرين. إذا كنت بحاجة إلى وصول تكامل، اطلب الصلاحية من مالك المنظمة.",
      apiKeysPageTitle: "مفاتيح API",
      apiKeysPageDescription: "قم بإدارة مفاتيح تطبيقاتك الداخلية لربط بيانات العملاء والمشاريع والصفقات بأمان.",
      apiKeysEmptyTitle: "لا توجد مفاتيح API حتى الآن",
      apiKeysEmptyDescription: "ابدأ بإنشاء مفتاح للوصول إلى بيانات العملاء والمشاريع والصفقات من أنظمتك الداخلية مع أقل صلاحية ممكنة.",
      apiKeysCreateFirst: "+ إنشاء أول مفتاح لك",
      apiKeysCreateOwnerOnly: "إنشاء المفاتيح متاح لمالك المنظمة فقط. يمكنك من هنا مراجعة المفاتيح الحالية وإلغاؤها عند الحاجة.",
      apiKeysCreateButton: "إنشاء مفتاح جديد",
      apiKeysCreatedTitle: "تم إنشاء المفتاح بنجاح",
      apiKeysCreateDialogTitle: "إنشاء مفتاح API جديد",
      apiKeysClose: "إغلاق",
      apiKeysSecretTitle: "احتفظ بهذا المفتاح بسرية",
      apiKeysSecretDescription: "هذه هي المرة الوحيدة التي سنعرض فيها القيمة السرية الكاملة، يُرجى نسخها وحفظها في مكان آمن.",
      apiKeysCopy: "نسخ",
      apiKeysCopied: "تم النسخ",
      apiKeysCopiedConfirm: "تم، قمت بنسخ المفتاح",
      apiKeysNameLabel: "اسم المفتاح (اختياري)",
      apiKeysNamePlaceholder: "مثلاً: مزامنة الـ CRM الداخلي",
      apiKeysPermissionsLabel: "الصلاحيات",
      apiKeysPermissionsHint: "اختر الإجراءات المسموح بها، وبعض الموارد متاحة بقراءة فقط في هذا الإصدار.",
      apiKeysReadOnly: "قراءة فقط",
      apiKeysReadWrite: "قراءة وكتابة",
      apiKeysFullAccess: "شامل",
      apiKeysResourceColumn: "المورد",
      apiKeysDetailsColumn: "التفاصيل",
      apiKeysLastUsedColumn: "آخر استخدام",
      apiKeysActionColumn: "الإجراء",
      apiKeysUnnamed: "بدون اسم",
      apiKeysActive: "نشط",
      apiKeysRevoked: "ملغي",
      apiKeysCreatedAt: "في {date}",
      apiKeysNeverUsed: "لم يُستخدم",
      apiKeysRevoking: "إلغاء...",
      apiKeysRevoke: "إلغاء المفتاح",
      apiKeysRevokedState: "تم الإلغاء",
      apiKeysCreateOwnerStatus: "إنشاء مفاتيح API متاح لمالك المنظمة فقط.",
      apiKeysChoosePermissionStatus: "اختر صلاحية واحدة على الأقل قبل إنشاء المفتاح.",
      apiKeysCreatingStatus: "جارٍ إنشاء المفتاح...",
      apiKeysCreateFailedStatus: "تعذر إنشاء المفتاح.",
      apiKeysCreatedStatus: "تم إنشاء المفتاح. احفظ القيمة السرية الآن لأنها لن تظهر مرة أخرى.",
      apiKeysRevokePermissionStatus: "إلغاء مفاتيح API متاح فقط للمالك أو المدير.",
      apiKeysRevokingStatus: "جارٍ إلغاء المفتاح...",
      apiKeysRevokeFailedStatus: "تعذر إلغاء المفتاح.",
      apiKeysRevokedStatus: "تم إلغاء المفتاح ولن يعمل بعد الآن.",
      membersTitle: "أعضاء المنظمة ({count})",
      inviteMember: "دعوة عضو",
      inviteMemberTitle: "دعوة عضو جديد",
      inviteMemberDescription: "ابحث بالبريد أو اسم المستخدم ثم أرسل الدعوة أو افتح محادثة مباشرة.",
      inviteSearchLabel: "البحث بالبريد الكامل أو اسم المستخدم",
      inviteSearchPlaceholder: "name@company.com أو username",
      inviteSearchHint: "لن يظهر أي مستخدم إلا إذا كتبت بريده الكامل أو اسم المستخدم المطابق تماماً.",
      roleLabel: "الدور",
      sendInvite: "دعوة",
      roleUpdateInProgress: "جاري تحديث الدور...",
      roleUpdateFailed: "تعذر تحديث الدور.",
      roleUpdated: "تم تغيير دور {name} إلى {role}.",
      inviteCancelInProgress: "جاري إلغاء الدعوة...",
      inviteCancelFailed: "تعذر إلغاء الدعوة.",
      inviteCanceled: "تم إلغاء الدعوة.",
      pendingInvitesTitle: "الدعوات المعلقة ({count})",
      managerGuardrail: "لا يمكن خفض آخر مدير في المنظمة. احتفظ دائماً بمدير واحد على الأقل قبل تعديل الأدوار.",
      inviteExpires: "تنتهي {date}",
      currentMember: "عضو حالي",
      nonMember: "ليس عضواً",
      managerPermissionRequired: "صلاحية المدير مطلوبة لإرسال الدعوات.",
      inviteSending: "جاري إرسال الدعوة...",
      inviteFailed: "تعذر إرسال الدعوة.",
      inviteSent: "تم إرسال الدعوة بنجاح.",
      openConversationFailed: "تعذر فتح المحادثة.",
      noOrganizationLinked: "لا توجد منظمة مرتبطة بالحساب الحالي.",
      searchingDirectory: "جاري البحث...",
      searchFailed: "تعذر البحث.",
      noMatchingDirectoryResult: "لا توجد نتيجة مطابقة. يمكنك دعوة البريد الكامل مباشرة.",
      cannotInviteWithoutOrganization: "لا يمكنك إرسال دعوات قبل ربط الحساب بمنظمة.",
      openConversation: "رسالة",
      verificationTitle: "توثيق المنظمة",
      verificationEmptyOrganization: "لا توجد منظمة مرتبطة بالحساب الحالي.",
      verificationCurrentStatus: "حالة التوثيق الحالية",
      publishingStatus: "حالة النشر",
      publishingBlocked: "النشر متوقف حتى اعتماد التوثيق",
      publishingAllowed: "لا يوجد حظر نشر من توثيق المنظمة",
      lastSubmission: "آخر إرسال",
      filesCount: "عدد الملفات",
      membersCountLabel: "عدد الأعضاء",
      teamSummary: "{members} أعضاء، {invites} دعوات، وصلاحيتك الحالية: {roleLabel}",
      reviewNotes: "ملاحظات المراجعة",
      verificationTimeline: "الخط الزمني",
      verificationNoTimeline: "لا يوجد طلب توثيق مرسل حتى الآن.",
      latestDocuments: "المستندات المرفوعة في آخر طلب",
      unknownDocumentType: "مستند",
      verificationSubmitTitle: "إرسال أو إعادة إرسال مستندات التوثيق",
      verificationSubmitDescription: "نوع الجهة الحالي: {organizationType}. يمكن للمدير فقط استخدام هذا النموذج، بينما تظهر قرارات المراجعة من لوحة الأدمن.",
      requiredDocsTitle: "المستندات الأساسية",
      requiredDocsSubtitle: "ملفات الهوية والسجلات النظامية الأساسية.",
      proofDocsTitle: "إثبات العمل (اختياري)",
      proofDocsSubtitle: "نماذج أعمال أو مستندات داعمة لنشاط المنظمة.",
      uploadingFiles: "جارٍ رفع الملفات...",
      uploadFilesIdle: "رفع ملفات PDF أو صور",
      uploadProofIdle: "أضف مستندات داعمة",
      managerOnlySubmissionHint: "بعد الإرسال سيظهر الطلب في لوحة الأدمن للمراجعة. لا توجد أي أزرار اعتماد أو إغلاق هنا.",
      viewerSubmissionHint: "العرض هنا للمتابعة فقط. تحتاج صلاحية مدير لإرسال أو إعادة إرسال المستندات.",
      verificationRequiredDocsError: "الرجاء رفع مستند واحد على الأقل من المستندات الأساسية.",
      verificationSubmitting: "جاري إرسال طلب التوثيق...",
      verificationSubmitFailed: "تعذر إرسال طلب التوثيق.",
      verificationSubmitted: "تم إرسال طلب التوثيق بنجاح. سيتم مراجعته من لوحة الأدمن.",
      verificationSubmit: "إرسال الطلب",
      verificationResubmit: "إعادة إرسال المستندات",
      accountSettingsTitle: "الحساب والأمان",
      accountSettingsDescription: "إدارة بيانات حسابك، اسم المستخدم، والأمان.",
      logoutAction: "تسجيل الخروج",
      loggingOut: "جاري تسجيل الخروج...",
      organizationSettingsTitle: "إعدادات المنظمة",
      organizationSettingsDescription: "لوحة أبسط لتحديث هوية المنظمة وبيانات التواصل الأساسية.",
      organizationIdentityTitle: "هوية المنظمة",
      organizationIdentityDescription: "راجع بيانات المنظمة الحالية ثم حدّث الحقول التي تحتاجها فقط.",
      organizationSlug: "المعرف",
      organizationStatus: "الحالة",
      organizationType: "نوع الجهة",
      organizationVerified: "التوثيق",
      organizationVerifiedYes: "موثق",
      organizationVerifiedNo: "غير موثق",
      organizationNameLabel: "الاسم",
      organizationDescriptionLabel: "نبذة",
      organizationDescriptionHint: "اختياري، ويظهر كتعريف سريع داخل مساحة العمل.",
      organizationWebsiteLabel: "الموقع الإلكتروني",
      organizationEmailLabel: "بريد التواصل",
      organizationPhoneLabel: "رقم واتساب / الهاتف",
      organizationNoOrganization: "لا توجد منظمة مرتبطة بالحساب الحالي.",
      organizationManagerRequired: "صلاحية المدير مطلوبة لتعديل بيانات المنظمة.",
      organizationSaving: "جاري حفظ بيانات المنظمة...",
      organizationSaveFailed: "تعذر حفظ بيانات المنظمة.",
      organizationSaved: "تم تحديث بيانات المنظمة.",
      organizationSave: "حفظ التعديلات",
      organizationTypeBroker: "وسيط عقاري",
      organizationTypeDeveloper: "مطور عقاري",
    },
    assistant: {
      placeholderDeveloper: "حلل السوق، جهز عرض سعر، أو اطلب أفكاراً لمشروعك...",
      placeholderBroker: "اسأل عن تقييم عقار، فرص السوق، أو أداء فريقك...",
      placeholderDefault: "اسأل زين إيه آي عن عقار جديد، فرص السوق، أو اسحب صور الوحدة وملفات PDF هنا ليجهزها لك...",
      attach: "إرفاق",
      search: "بحث",
      deepSearch: "بحث عميق",
      stop: "إيقاف",
      voiceTitle: "التسجيل الصوتي",
      closeVoicePanel: "إغلاق لوحة التسجيل",
      voiceCancel: "إلغاء",
      requestPermissionAgain: "طلب الإذن مرة أخرى",
      stopRecording: "إيقاف",
      liveInput: "إدخال مباشر",
      processing: "جاري المعالجة",
      ready: "جاهز",
      preparingMic: "نجهز الميكروفون الآن",
      waitingForSpeech: "بانتظار بداية الحديث",
      silenceCountdown: "سيتم الإرسال بعد لحظة صمت",
      uploadingRecording: "نرفع التسجيل",
      analyzingRecording: "نحلل التسجيل",
      sendingMessage: "نرسل الرسالة",
      recordingError: "حدثت مشكلة في التسجيل",
      recordingNow: "جاري التسجيل",
      preparingUpload: "تعذر تجهيز رفع الملفات.",
      savingUploads: "تعذر حفظ الملفات المرفوعة.",
      uploadFailed: "تعذر رفع الملفات حالياً.",
      sendFailed: "تعذر إرسال الرسالة.",
      statusUploading: "جاري الرفع",
      statusUploadFailed: "تعذر الرفع",
      statusReady: "جاهز",
      removeAttachment: "إزالة {name}",
      attachmentRetryHint: "تعذر رفع الملف. حاول مرة أخرى.",
    },
    about: {
      badge: "من نحن",
      title: "عن زين إيه آي",
      titleAccent: "شركة تبني مساحة عمل أوضح",
      description: "زين إيه آي هي الصفحة العامة لمساحة عمل تجمع المطورين والوسطاء حول أدوات أوضح، متابعة أسهل، وتعريف مباشر بما تفعله الشركة ولماذا توجد.",
      contact: "تواصل معنا",
      missionTitle: "مهمتنا",
      missionDescription: "تبسيط العمل بين المطورين والوسطاء عبر مساحة واحدة تجعل التواصل والمعلومات والمهام أقرب وأسهل.",
      valuesTitle: "قيمنا",
      valuesDescription: "الوضوح، التنظيم، والموثوقية في كل جزء من الواجهة العامة ومساحة العمل الداخلية.",
      workStyleTitle: "أسلوب العمل",
      workStyleDescription: "نبني صفحات عامة تشرح المنتج، ومساحة داخلية تساعد الفرق على تنفيذ العمل اليومي من دون تشتيت.",
      whyTitle: "لماذا",
      whyAccent: "هذه المساحة",
      whyDescriptionPrimary: "بدأنا من ملاحظة بسيطة: الفرق تحتاج إلى مساحة عمل تتكلم بلغتها، وتعرض ما يهمها بوضوح، وتساعدها على التحرك من دون فوضى أو ازدواجية بين الأدوات.",
      whyDescriptionSecondary: "لذلك صممنا زين إيه آي لتكون واجهة عامة تعرف بالشركة، ثم مساحة عمل تساعد المطورين والوسطاء على متابعة ما يحدث فعلاً داخل المنتج.",
      metricsUnified: "مساحة موحدة",
      metricsAudience: "فئتان أساسيتان",
      metricsAvailability: "وصول مستمر",
      metricsClarity: "من أول زيارة",
      identityTitle: "كيف نعرّف",
      identityAccent: "أنفسنا اليوم",
      identityDescriptionPrimary: "زين إيه آي ليست مجرد صفحة هبوط، وليست مجرد أداة داخلية. هي نقطة بداية تشرح من نحن، ثم توجه المطورين والوسطاء إلى مساحة عمل تساعدهم على التنظيم والمتابعة والتعاون.",
      identityDescriptionSecondary: "هذا هو الأساس الذي نبني عليه: منتج واضح، رسالة واضحة، وتجربة عامة لا تبالغ في الوعود بل تشرح القيمة الحقيقية للمساحة التي نقدمها.",
      talkToTeam: "تحدث مع الفريق",
      developerSpace: "مساحة المطورين",
    },
    homeSearch: {
      ready: "عقارات",
      projects: "مشاريع جديدة",
      buy: "للبيع",
      rent: "للايجار",
      placeholder: "ابحث عن مكان، أو منطقة أو مدينة",
    },
    hero: {
      subtitle: "أول طبقة ربط عقارية تسحب البيانات الهيكلية مباشرة أثناء بحثك - لتمنحك بيانات دقيقة وموثوقة لتنفيذ سير عملك.",
    },
    cta: {
      title: "انتقل من اليدوي إلى التلقائي.",
      subtitle: "ابدأ في استخدام البنية التحتية خلف أقوى الشركات العقارية أداءً.",
    },
  },
  en: {
    landing: {
      heroBadge: "Leading the new paradigm",
      heroTitle: "Modular Workspace for Institutional Development",
      heroDescription: "The connective layer for real estate development. Orchestrate projects, manage structural metadata in real-time, and automate your entire development pipeline in one high-precision workspace.",
      heroTryFree: "Access Workspace Free",
      heroBookDemo: "Book Institutional Demo",
      connectiveLayer: "Connective Layer",
      connectiveLayerSubtitle: "Designed to eliminate friction between intent and execution. Zane-ai sits natively on top of Convex, synchronizing demand directly into internal operator workflows.",
      pipelineTitle: "Structured Pipeline Data",
      pipelineDescription: "Watch as user intent maps perfectly onto your available inventory, transforming conversations into actionable lead records inside the operator panel.",
      truthTitle: "Immutable Truth",
      truthDescription: "Every property metric acts as a single source of truth across all external channels and internal reports.",
      reflowTitle: "Instant Reflow",
      reflowDescription: "Changes to pricing, statuses, or geometry instantly reflow to team pipelines without manual re-entry.",
      ctaTitle: "From manual chaos to automated development.",
      ctaDescription: "Start utilizing the intelligent infrastructure behind top-performing institutional real estate development teams.",
      ctaButton: "Deploy Zane-ai Today",
      metricsTitle: "Institutional Performance",
      metricsAUMValue: "$1.4B+",
      metricsAUMText: "Assets Managed",
      metricsUsersValue: "50k+",
      metricsUsersText: "Active Users",
      metricsCoverageValue: "120+",
      metricsCoverageText: "Coverage Areas",
      pillarConnectTitle: "Connect",
      pillarConnectDesc: "Unify fragmented data silos into a single, high-fidelity infrastructure.",
      pillarAutomateTitle: "Automate",
      pillarAutomateDesc: "Transform manual workflows into intelligent, autonomous operations.",
      pillarScaleTitle: "Scale",
      pillarScaleDesc: "Enable institutional growth via intelligence-driven asset orchestration.",
      archTitle: "System Architecture",
      archSubtitle: "The Intelligent Layer",
      archDescription: "Zane AI serves as the definitive operating system bridging the gap between property intent, institutional assets, and intelligence mapping. It provides a single source of truth for complex real estate orchestration."
    },
    nav: {
      home: "Home",
      developer: "Developer Space",
      broker: "Broker Space",
      about: "About",
      contact: "Contact",
      workspaceSignIn: "Workspace Sign In",
      getStarted: "Get Started",
      switchLanguage: "Switch language",
      activateLightMode: "Activate light mode",
      activateDarkMode: "Activate dark mode",
      workspaceSettings: "Organization settings",
      notifications: "Notifications",
      inbox: "Inbox",
      overviewTitle: "Overview",
      assistantTitle: "Zane-ai Assistant",
      workspaceFallback: "Workspace",
      newChat: "New chat",
      hideSidebar: "Hide sidebar",
      showSidebar: "Show sidebar",
      allThreads: "All conversations",
      searchThreadsPlaceholder: "Search by conversation title",
      noMatchingThreads: "No conversations match this title",
      chooseConversation: "Choose a conversation to continue or search by title",
      close: "Close",
      newLabel: "New",
      recentThreads: "Latest 3 conversations",
      untitledConversation: "Untitled conversation",
      pageLabel: "Page",
      ofLabel: "of",
      previousPage: "Previous page",
      nextPage: "Next page",
      allThreadsCount: "View all conversations",
      openNavigation: "Open navigation",
      workspaceNavigation: "Workspace navigation",
      currentWorkspaceSection: "Main navigation for the current workspace area.",
      normalMode: "Normal",
      aiMode: "AI Mode",
      soonBadge: "Soon",
      operationsLabel: "Operations",
      contextsAndThreads: "Contexts & Threads",
      assistantThreadFallback: "Assistant Thread",
      workspaceLabel: "Workspace",
    },
    footer: {
      brandTitle: "Workspace for developers and brokers",
      description: "A unified workspace that helps teams collaborate, track daily operations, and understand the product from one clear place.",
      platform: "Platform",
      community: "Community",
      legal: "Legal",
      developers: "Developer space",
      brokers: "Broker space",
      pricing: "Pricing",
      partnerships: "Partnerships",
      docs: "Documentation",
      team: "Team",
      careers: "Careers",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      privacy: "Privacy",
      terms: "Terms",
      faq: "FAQ",
      blog: "Blog",
      bottomTagline: "One place for clear work and organized communication.",
      copyright: "© 2025 Zane-ai Digital Solutions. All rights reserved.",
    },
    status: {
      developer: "Developer",
      broker: "Broker",
      active: "Active",
      pendingReview: "Pending review",
    },
    signin: {
      title: "Workspace Sign In",
      description: "Secure access to the Zane-ai workspace for developers and brokers.",
      agreementPrefix: "By signing in, you agree to the platform",
      agreementTerms: "Terms of Use",
      agreementAnd: "and",
      agreementPrivacy: "Privacy Policy",
      agreementSuffix: ".",
      encrypted: "Enterprise encryption",
      clearTerms: "Clear terms",
    },
    errors: {
      notFoundTitle: "Sorry, this page does not exist",
      notFoundDescription: "It looks like you tried to access a route that is not defined in Zane-ai's digital infrastructure.",
      backHome: "Back to home",
      contactSupport: "Contact support",
      workspaceErrorTitle: "An error occurred while loading the workspace.",
      workspaceErrorDescription: "Try again or go back to the main workspace page.",
      retry: "Try again",
      backToWorkspace: "Back to workspace",
      workspaceUnavailableTitle: "The workspace could not be loaded right now",
    },
    projects: {
      eyebrow: "Projects",
      title: "Projects",
      description: "Manage your property portfolio and registered projects.",
      create: "Create new project",
      all: "All",
      linkedClient: "Linked to client",
      idleBroker: "Broker without client",
      noBrokers: "No brokers",
      rooms: "Rooms",
      baths: "Baths",
      area: "Area",
      publish: "Publish",
      openProject: "Open project",
      deleteTitle: "Delete project",
      deleteDescription: "This project will be permanently removed from the portfolio along with its related data.",
      deleteConfirm: "Delete project",
      actionFailed: "Could not complete the action. Please try again.",
      createSelectionTitle: "Choose your inventory type",
      createSelectionSubtitle: "Select the framework that fits your current operational needs.",
      createProjectType: "Project",
      createProjectHeadline: "Creating a multi-unit project",
      createProjectDesc: "Ideal for compounds, developments, and bulk inventory. Supports multiple units, permits, and shared galleries.",
      createUnitType: "Standalone Unit",
      createUnitHeadline: "Creating a single standalone unit",
      createUnitDesc: "Ideal for resales, single villas, or individual apartments. Direct and fast to publish.",
      continueFlow: "Continue",
    },
    units: {
      title: "Units",
      create: "Create unit",
      edit: "Edit unit",
      delete: "Delete unit",
      deleteConfirm: "Delete unit",
      deleteDescription: "This unit will be permanently removed from the project.",
      label: "Unit label",
      type: "Unit type",
      floor: "Floor",
      status: "Status",
      price: "Price",
      description: "Description",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      area: "Area",
      available: "Available",
      reserved: "Reserved",
      sold: "Sold",
      apartment: "Apartment",
      villa: "Villa",
      duplex: "Duplex",
      studio: "Studio",
      penthouse: "Penthouse",
      townhouse: "Townhouse",
      commercial: "Commercial",
      noUnits: "No units in this project yet.",
      unitCount: "units",
      addUnit: "Add unit",
      manageUnits: "Manage units",
      unitDetails: "Unit details",
      saveUnit: "Save unit",
      cancel: "Cancel",
    },
    offers: {
      eyebrow: "Offers 2.0",
      title: "Offers as collaboration cases",
      description: "The offers zone is now organized around practical cases between the inventory owner, the client-side broker, and the execution partner.",
      create: "Create new case",
      allQueues: "All queues",
      queue: "Queue",
      casesCount: "Cases count",
      value: "Value",
      asset: "Asset",
      noClearAsset: "No clear asset",
      unspecified: "Unspecified",
      inventoryOwner: "Inventory owner",
      unknownOwner: "Unknown",
      noCommissionDetails: "No commission details",
      executionPartner: "Execution partner",
      notAssignedYet: "Not assigned yet",
      noPermitStatus: "No permit status",
      clientSummary: "Client summary",
      openToBrokersAndDevelopers: "Open to brokers and developers",
      targetedToBrokers: "Targeted to brokers",
      targetedToDevelopers: "Targeted to developers",
      openCase: "Open case",
      emptyQueue: "There are no cases in this queue right now.",
    },
    crm: {
      eyebrow: "Deal management",
      title: "Deals",
      createPlaceholder: "New deal or client name",
      create: "Add deal",
      clientsTitle: "Clients",
      clientsDescription: "Manage deals and linked relationships",
      addClient: "Add deal",
      resultsCount: "{count} results",
      noMatchingClients: "No deals match the current filter.",
      firstPage: "First page",
      lastPageNow: "Last page for now",
      nextPageAvailable: "A next page can be loaded",
      nextPage: "Next page",
      open: "Open",
      withBroker: "With {name}",
      withoutBroker: "No broker",
      budget: "Budget",
      all: "All",
      unlinked: "Unlinked",
      projectOnly: "Project only",
      fullyLinked: "Project + broker",
    },
    notifications: {
      eyebrow: "Notifications",
      title: "Notifications center",
      description: "Real notifications tied to conversations, offers, and invites inside the same workspace.",
      all: "All",
      unread: "Unread",
      unreadSummary: "You have {count} unread notifications",
      noPending: "No pending notifications",
      empty: "There are no notifications in this filter.",
      read: "Read",
      new: "New",
    },
    inbox: {
      brokerInvite: "Broker invite",
      developerInvite: "Developer invite",
      from: "From",
      proposedRole: "Proposed role",
      accept: "Accept",
      message: "Message",
      cancel: "Cancel",
      incomingInvites: "Incoming invites",
      incomingInvitesDescription: "Handle team invites quickly from the same inbox workspace.",
      member: "Member",
      pendingInvite: "Pending invite",
      user: "User",
      start: "Start",
      searching: "Searching...",
      noMatchingResults: "No results match your search.",
      startConversation: "Start conversation",
      noConversations: "There are no conversations in this section right now.",
      noConversationsInSection: "There are no conversations in this section right now.",
      lastMessageFallback: "Start the conversation",
      emptyThreadTitle: "Inbox",
      emptyThreadDescription: "Choose a conversation from the sidebar or search for a new user to start a direct discussion.",
      loadingThread: "Loading conversation...",
      composerPlaceholder: "Write your message to the real estate broker...",
      shareFile: "Share file",
      shareProject: "Share project",
      sharePrivateOffer: "Send private offer",
      dropAttachment: "Drop an image or PDF here to attach it quickly",
      sending: "Sending",
      send: "Send",
      attachFile: "Attach file",
      closeSharePanel: "Close share panel",
      noteLabel: "Note",
      fileNotePlaceholder: "Add a short description for the file",
      uploadFile: "Choose file",
      changeFile: "Change file",
      uploadingFile: "Uploading file...",
      selectProject: "Choose a project",
      projectOrProperty: "Property or project",
      chooseProject: "Choose a project to share",
      openProjectGallery: "Open the visual gallery to choose the project.",
      choose: "Choose",
      chooseProjectToShare: "Choose a project to share",
      chooseProjectDescription: "A faster visual choice than the text list.",
      searchProjectHint: "Search or browse more projects if the developer owns a long list.",
      searchProjectPlaceholder: "Search by name, location, or organization",
      noExtraDescription: "No extra description",
      currentWorkspace: "Current workspace",
      noPrice: "No price",
      noMatchingProjects: "No projects match this search.",
      createOfferQuickly: "Create and send a quick offer",
      toConversation: "To {name}",
      offerPrice: "Price",
      offerTitle: "Offer title",
      offerTitlePlaceholder: "Example: Private offer for a ready-to-deliver unit",
      offerNotePlaceholder: "Write the short message that accompanies the offer.",
      offerAttachments: "Offer attachments",
      dragAttachments: "Drag files here or choose them manually.",
      uploadAttachments: "Add attachments",
      uploadingAttachments: "Uploading attachments...",
      attachmentSendHint: "These attachments will not be sent until you press create and send.",
      offerSendHint: "The offer will be created and then sent directly in the conversation.",
      createAndSend: "Create and send",
      sendMessageFailed: "Could not send the message. Please try again.",
      fileUploadFailed: "Could not upload the file.",
      offerUploadFailed: "Could not upload the offer attachments.",
      chooseProjectAndPriceFirst: "Choose a property and set the price before sending the offer.",
      chooseFileFirst: "Choose a file before sending.",
      chooseProjectFirst: "Choose a property or project to share.",
      attachTypeFile: "Attach file",
      attachTypeProject: "Send property or apartment",
      attachTypeOffer: "Create private offer",
      attachTypeFileDescription: "Send a file with a short note.",
      attachTypeProjectDescription: "Choose one asset with a brief comment.",
      attachTypeOfferDescription: "Create a quick offer and send it directly from the conversation.",
      threadActionOffer: "Create private offer",
      threadActionProject: "Send project",
      threadActionFile: "Attach file",
      threadActionOpen: "Open this action from the same screen.",
      threadActionUnavailable: "Unavailable for this conversation right now.",
      threadMenuLabel: "Actions",
      back: "Back",
      broker: "Broker",
      developer: "Developer",
      userLabel: "User",
      fileShareLabel: "File share",
      projectShareLabel: "Project share",
      dealShareLabel: "Deal share",
      inviteUpdateLabel: "Invite update",
      roleUpdateLabel: "Role update",
      workspaceProject: "Workspace-linked project",
    },
    market: {
      title: "Market analysis",
      description: "The full market intelligence interface is preserved behind the scenes and is currently shown with a temporary development overlay until the next build phase.",
      analyzeMarket: "Analyze market",
      scope: "Scope",
      range: "Range",
      topKeyword: "Top keyword",
      noClearSignal: "No clear signal",
      mockDataBanner: "This page is currently showing sample data until enough real market data is available for this scope.",
    },
    settings: {
      workspaceLabel: "Workspace settings",
      title: "Organization settings",
      description: "Manage organization details, team access, and verification in one place.",
      organization: "Organization",
      verification: "Verification",
      membersAndInvites: "Members and invites",
      apps: "Apps",
      apiKeys: "API keys",
      manager: "Manager",
      viewer: "Viewer",
      member: "Member",
      unavailable: "Unavailable",
      membersSummary: "{members} members, {invites} invites, and your current role is: {roleLabel}",
      apiKeysSummaryCreate: "You can create and revoke keys from here.",
      apiKeysSummaryRevoke: "You can review and revoke keys from here.",
      apiKeysSummaryNoAccess: "You do not have permission to manage this section.",
      connectedAppsSummaryManage: "Review organization app connections and revoke anything the team no longer needs.",
      connectedAppsSummaryReadonly: "Review organization app connections here. Only managers can approve new apps or revoke access.",
      connectedAppsPageTitle: "Organization apps",
      connectedAppsPageDescription: "Review external apps connected to this organization and the scopes they were approved for.",
      connectedAppsLegacyNotice: "Connected apps now belong to the organization. Any old personal app authorization must reconnect under the organization before it will appear here.",
      connectedAppsReadonlyNotice: "Only organization managers can approve a new app or revoke access, but everyone in the org can review the current connections.",
      connectedAppsEmptyTitle: "No connected apps yet",
      connectedAppsEmptyDescription: "Start the connection from the external app's OAuth authorize flow. Approved organization connections will appear here.",
      connectedAppsConnectedAt: "Connected",
      connectedAppsLastUsed: "Last used",
      connectedAppsNeverUsed: "Never used",
      connectedAppsRevoke: "Revoke",
      connectedAppsRevoking: "Revoking...",
      connectedAppsRevokeConfirm: "This will revoke the app for the organization and cut off all active sessions. Continue?",
      apiKeysNoOrgTitle: "API keys",
      apiKeysNoOrgDescription: "Create an organization first before issuing integration keys. You will be able to grant narrow permissions for each key to keep your data secure.",
      apiKeysRestrictedTitle: "API keys",
      apiKeysRestrictedDescription: "Viewing and managing API keys is only available to organization owners and managers. If you need integration access, ask the organization owner for permission.",
      apiKeysPageTitle: "API keys",
      apiKeysPageDescription: "Manage your internal application keys to connect clients, projects, and deals securely.",
      apiKeysEmptyTitle: "No API keys yet",
      apiKeysEmptyDescription: "Start by creating a key with the minimum permissions needed for your internal systems to access clients, projects, and deals.",
      apiKeysCreateFirst: "+ Create your first key",
      apiKeysCreateOwnerOnly: "Key creation is only available to the organization owner. You can still review existing keys and revoke them when needed.",
      apiKeysCreateButton: "Create new key",
      apiKeysCreatedTitle: "Key created successfully",
      apiKeysCreateDialogTitle: "Create a new API key",
      apiKeysClose: "Close",
      apiKeysSecretTitle: "Keep this key private",
      apiKeysSecretDescription: "This is the only time we will show the full secret value. Copy it and store it in a safe place.",
      apiKeysCopy: "Copy",
      apiKeysCopied: "Copied",
      apiKeysCopiedConfirm: "Done, I copied the key",
      apiKeysNameLabel: "Key name (optional)",
      apiKeysNamePlaceholder: "Example: Internal CRM sync",
      apiKeysPermissionsLabel: "Permissions",
      apiKeysPermissionsHint: "Choose the allowed actions. Some resources are read-only in this version.",
      apiKeysReadOnly: "Read only",
      apiKeysReadWrite: "Read and write",
      apiKeysFullAccess: "Full access",
      apiKeysResourceColumn: "Resource",
      apiKeysDetailsColumn: "Details",
      apiKeysLastUsedColumn: "Last used",
      apiKeysActionColumn: "Action",
      apiKeysUnnamed: "Unnamed",
      apiKeysActive: "Active",
      apiKeysRevoked: "Revoked",
      apiKeysCreatedAt: "On {date}",
      apiKeysNeverUsed: "Never used",
      apiKeysRevoking: "Revoking...",
      apiKeysRevoke: "Revoke key",
      apiKeysRevokedState: "Revoked",
      apiKeysCreateOwnerStatus: "API key creation is only available to the organization owner.",
      apiKeysChoosePermissionStatus: "Choose at least one permission before creating the key.",
      apiKeysCreatingStatus: "Creating key...",
      apiKeysCreateFailedStatus: "Could not create the key.",
      apiKeysCreatedStatus: "The key was created. Save the secret now because it will not be shown again.",
      apiKeysRevokePermissionStatus: "Revoking API keys is only available to the owner or manager.",
      apiKeysRevokingStatus: "Revoking key...",
      apiKeysRevokeFailedStatus: "Could not revoke the key.",
      apiKeysRevokedStatus: "The key has been revoked and no longer works.",
      membersTitle: "Organization members ({count})",
      inviteMember: "Invite member",
      inviteMemberTitle: "Invite a new member",
      inviteMemberDescription: "Search by email or username, then send an invite or open a direct conversation.",
      inviteSearchLabel: "Search by full email or username",
      inviteSearchPlaceholder: "name@company.com or username",
      inviteSearchHint: "A user only appears when the full email or exact username matches.",
      roleLabel: "Role",
      sendInvite: "Invite",
      roleUpdateInProgress: "Updating role...",
      roleUpdateFailed: "Could not update the role.",
      roleUpdated: "{name}'s role was changed to {role}.",
      inviteCancelInProgress: "Canceling invite...",
      inviteCancelFailed: "Could not cancel the invite.",
      inviteCanceled: "Invite canceled.",
      pendingInvitesTitle: "Pending invites ({count})",
      managerGuardrail: "You cannot demote the last manager in the organization. Keep at least one manager before changing roles.",
      inviteExpires: "Expires {date}",
      currentMember: "Current member",
      nonMember: "Not a member",
      managerPermissionRequired: "Manager permission is required to send invites.",
      inviteSending: "Sending invite...",
      inviteFailed: "Could not send the invite.",
      inviteSent: "Invite sent successfully.",
      openConversationFailed: "Could not open the conversation.",
      noOrganizationLinked: "There is no organization linked to the current account.",
      searchingDirectory: "Searching...",
      searchFailed: "Search failed.",
      noMatchingDirectoryResult: "No matching result was found. You can invite the full email directly.",
      cannotInviteWithoutOrganization: "You cannot send invites until the account is linked to an organization.",
      openConversation: "Message",
      verificationTitle: "Organization verification",
      verificationEmptyOrganization: "There is no organization linked to the current account.",
      verificationCurrentStatus: "Current verification status",
      publishingStatus: "Publishing status",
      publishingBlocked: "Publishing is blocked until verification is approved",
      publishingAllowed: "There is no publishing block from organization verification",
      lastSubmission: "Last submission",
      filesCount: "Files count",
      membersCountLabel: "Members count",
      teamSummary: "{members} members, {invites} invites, and your current role is: {roleLabel}",
      reviewNotes: "Review notes",
      verificationTimeline: "Timeline",
      verificationNoTimeline: "No verification request has been submitted yet.",
      latestDocuments: "Documents uploaded in the latest request",
      unknownDocumentType: "Document",
      verificationSubmitTitle: "Submit or resubmit verification documents",
      verificationSubmitDescription: "Current organization type: {organizationType}. Only managers can use this form, while review decisions appear in the admin panel.",
      requiredDocsTitle: "Required documents",
      requiredDocsSubtitle: "Core identity and registry files.",
      proofDocsTitle: "Proof of work (optional)",
      proofDocsSubtitle: "Work samples or supporting documents for the organization activity.",
      uploadingFiles: "Uploading files...",
      uploadFilesIdle: "Upload PDFs or images",
      uploadProofIdle: "Add supporting documents",
      managerOnlySubmissionHint: "After submission, the request will appear in the admin panel for review. There are no approve or close controls here.",
      viewerSubmissionHint: "This view is for follow-up only. You need manager permission to submit or resubmit documents.",
      verificationRequiredDocsError: "Please upload at least one required document.",
      verificationSubmitting: "Submitting verification request...",
      verificationSubmitFailed: "Could not submit the verification request.",
      verificationSubmitted: "Verification request submitted successfully. It will be reviewed from the admin panel.",
      verificationSubmit: "Submit request",
      verificationResubmit: "Resubmit documents",
      accountSettingsTitle: "Account & security",
      accountSettingsDescription: "Manage your profile, username, and account security.",
      logoutAction: "Log out",
      loggingOut: "Logging out...",
      organizationSettingsTitle: "Organization settings",
      organizationSettingsDescription: "A simpler panel for updating the organization identity and essential contact details.",
      organizationIdentityTitle: "Organization identity",
      organizationIdentityDescription: "Review the current organization details, then update only the fields you need.",
      organizationSlug: "Slug",
      organizationStatus: "Status",
      organizationType: "Organization type",
      organizationVerified: "Verification",
      organizationVerifiedYes: "Verified",
      organizationVerifiedNo: "Not verified",
      organizationNameLabel: "Name",
      organizationDescriptionLabel: "Description",
      organizationDescriptionHint: "Optional. Used as a short description inside the workspace.",
      organizationWebsiteLabel: "Website",
      organizationEmailLabel: "Contact email",
      organizationPhoneLabel: "WhatsApp / phone",
      organizationNoOrganization: "There is no organization linked to the current account.",
      organizationManagerRequired: "Manager permission is required to update organization details.",
      organizationSaving: "Saving organization details...",
      organizationSaveFailed: "Could not save organization details.",
      organizationSaved: "Organization details updated.",
      organizationSave: "Save changes",
      organizationTypeBroker: "Real estate broker",
      organizationTypeDeveloper: "Real estate developer",
    },
    assistant: {
      placeholderDeveloper: "Analyze the market, prepare an offer, or ask for ideas for your project...",
      placeholderBroker: "Ask about property valuation, market opportunities, or your team's performance...",
      placeholderDefault: "Ask Zane-ai about a new property, market opportunities, or drop unit images and PDFs here so it can prepare them for you...",
      attach: "Attach",
      search: "Search",
      deepSearch: "Deep search",
      stop: "Stop",
      voiceTitle: "Voice recording",
      closeVoicePanel: "Close voice panel",
      voiceCancel: "Cancel",
      requestPermissionAgain: "Request permission again",
      stopRecording: "Stop",
      liveInput: "Live input",
      processing: "Processing",
      ready: "Ready",
      preparingMic: "Preparing the microphone",
      waitingForSpeech: "Waiting for speech",
      silenceCountdown: "Will send after a brief silence",
      uploadingRecording: "Uploading recording",
      analyzingRecording: "Analyzing recording",
      sendingMessage: "Sending message",
      recordingError: "There was a recording problem",
      recordingNow: "Recording now",
      preparingUpload: "Could not prepare file upload.",
      savingUploads: "Could not save uploaded files.",
      uploadFailed: "Could not upload files right now.",
      sendFailed: "Could not send the message.",
      statusUploading: "Uploading",
      statusUploadFailed: "Upload failed",
      statusReady: "Ready",
      removeAttachment: "Remove {name}",
      attachmentRetryHint: "The file could not be uploaded. Try again.",
    },
    about: {
      badge: "Who we are",
      title: "About Zane-ai",
      titleAccent: "A company building a clearer workspace",
      description: "Zane-ai is the public face of a workspace that brings developers and brokers together around clearer tools, easier follow-through, and a direct explanation of what the company does and why it exists.",
      contact: "Contact us",
      missionTitle: "Our mission",
      missionDescription: "Simplify work between developers and brokers through one shared space that keeps communication, information, and tasks closer and clearer.",
      valuesTitle: "Our values",
      valuesDescription: "Clarity, structure, and reliability across both the public-facing experience and the internal workspace.",
      workStyleTitle: "How we work",
      workStyleDescription: "We build public pages that explain the product, and an internal workspace that helps teams execute daily work without distraction.",
      whyTitle: "Why",
      whyAccent: "this space",
      whyDescriptionPrimary: "We started with a simple observation: teams need a workspace that speaks their language, shows what matters clearly, and helps them move without chaos or duplicated tooling.",
      whyDescriptionSecondary: "That is why we designed Zane-ai to introduce the company publicly, then help developers and brokers track what is actually happening inside the product.",
      metricsUnified: "Unified space",
      metricsAudience: "Core audiences",
      metricsAvailability: "Always on",
      metricsClarity: "Clear from first visit",
      identityTitle: "How we define",
      identityAccent: "ourselves today",
      identityDescriptionPrimary: "Zane-ai is not just a landing page, and not just an internal tool. It is the starting point that explains who we are, then guides developers and brokers into a workspace that supports structure, follow-through, and collaboration.",
      identityDescriptionSecondary: "That is the foundation we build on: a clear product, a clear message, and a public experience that explains the real value of the space we provide.",
      talkToTeam: "Talk to the team",
      developerSpace: "Developer space",
    },
    homeSearch: {
      ready: "Properties",
      projects: "New Projects",
      buy: "For Sale",
      rent: "For Rent",
      placeholder: "Search for a place, area, or city",
    },
    hero: {
      subtitle: "The connective layer for real estate development. Orchestrate projects, manage structural metadata in real-time, and automate your entire development pipeline in one high-precision workspace.",
    },
    cta: {
      title: "From manual chaos to automated development.",
      subtitle: "Start utilizing the intelligent infrastructure behind top-performing institutional real estate development teams.",
    },
  },
  fr: {
    landing: {
      heroBadge: "À la pointe du nouveau modèle",
      heroTitle: "Infrastructure Opérationnelle Propulsée par l'IA",
      heroDescription: "La première couche conjonctive immobilière qui extrait les données structurelles en direct en temps réel à mesure que vous recherchez—vous offrant des métadonnées précises et fiables.",
      heroTryFree: "Essayez l'application",
      heroBookDemo: "Réserver une démo",
      connectiveLayer: "Couche Conjonctive",
      connectiveLayerSubtitle: "Conçu pour éliminer les frictions entre l'intention et l'exécution. Zane-ai se superpose nativement pour synchroniser la demande directement dans les flux de travail.",
      pipelineTitle: "Données de Pipeline Structurées",
      pipelineDescription: "Observez comment l'intention de l'utilisateur correspond parfaitement à votre inventaire disponible, transformant les conversations en enregistrements d'idées exploitables.",
      truthTitle: "Vérité Immuable",
      truthDescription: "Chaque métrique agit comme une seule source de vérité à travers tous les canaux externes et les rapports internes.",
      reflowTitle: "Reflux Instantané",
      reflowDescription: "Les modifications de prix, des statuts ou instantanément se répercutent sur les pipelines de l'équipe sans ré-entrée manuelle.",
      ctaTitle: "Passez de manuel à automatique.",
      ctaDescription: "Commencez à utiliser l'infrastructure derrière les déploiements de l'immobilier institutionnel les plus performants.",
      ctaButton: "Déployer Aujourd'hui",
      metricsTitle: "Performance Institutionnelle",
      metricsAUMValue: "1,4 Md$+",
      metricsAUMText: "Actifs gérés",
      metricsUsersValue: "50k+",
      metricsUsersText: "Utilisateurs actifs",
      metricsCoverageValue: "120+",
      metricsCoverageText: "Zones de couverture",
      pillarConnectTitle: "Connecter",
      pillarConnectDesc: "Unifier les silos de données fragmentés en une seule infrastructure haute fidélité.",
      pillarAutomateTitle: "Automatiser",
      pillarAutomateDesc: "Transformer les flux de travail manuels en opérations intelligentes et autonomes.",
      pillarScaleTitle: "Évoluer",
      pillarScaleDesc: "Permettre une croissance institutionnelle via une orchestration des actifs axée sur l'intelligence.",
      archTitle: "Architecture du Système",
      archSubtitle: "La Couche Intelligente",
      archDescription: "Zane AI sert de système d'exploitation définitif comblant le fossé entre l'intention immobilière, les actifs institutionnels et la cartographie de l'intelligence. Il fournit une source unique de vérité pour l'orchestration immobilière complexe."
    },
    nav: {
      home: "Accueil",
      developer: "Espace promoteurs",
      broker: "Espace courtiers",
      about: "À propos",
      contact: "Contact",
      workspaceSignIn: "Connexion à l'espace",
      getStarted: "Commencer ici",
      switchLanguage: "Changer de langue",
      activateLightMode: "Activer le mode clair",
      activateDarkMode: "Activer le mode sombre",
      workspaceSettings: "Paramètres de l'organisation",
      notifications: "Notifications",
      inbox: "Boîte de réception",
      overviewTitle: "Vue d'ensemble",
      assistantTitle: "Assistant Zane-ai",
      workspaceFallback: "Espace de travail",
      newChat: "Nouvelle conversation",
      hideSidebar: "Masquer la barre latérale",
      showSidebar: "Afficher la barre latérale",
      allThreads: "Toutes les conversations",
      searchThreadsPlaceholder: "Rechercher par titre",
      noMatchingThreads: "Aucune conversation ne correspond à ce titre",
      chooseConversation: "Choisissez une conversation à reprendre ou recherchez par titre",
      close: "Fermer",
      newLabel: "Nouveau",
      recentThreads: "3 conversations récentes",
      untitledConversation: "Conversation sans titre",
      pageLabel: "Page",
      ofLabel: "sur",
      previousPage: "Page précédente",
      nextPage: "Page suivante",
      allThreadsCount: "Voir toutes les conversations",
      openNavigation: "Ouvrir la navigation",
      workspaceNavigation: "Navigation de l'espace de travail",
      currentWorkspaceSection: "Navigation principale de la zone de travail actuelle.",
      normalMode: "Mode normal",
      aiMode: "Mode IA",
      soonBadge: "Bientôt",
      operationsLabel: "Opérations",
      contextsAndThreads: "Contextes et discussions",
      assistantThreadFallback: "Discussion Assistant",
      workspaceLabel: "Espace de travail",
    },
    footer: {
      brandTitle: "Espace de travail pour promoteurs et courtiers",
      description: "Une plateforme de travail unifiée qui aide les équipes à collaborer, suivre les opérations quotidiennes et comprendre le produit depuis un point clair.",
      platform: "Plateforme",
      community: "Communauté",
      legal: "Légal",
      developers: "Espace promoteurs",
      brokers: "Espace courtiers",
      pricing: "Tarifs",
      partnerships: "Partenariats",
      docs: "Documentation",
      team: "Équipe",
      careers: "Carrières",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      privacy: "Confidentialité",
      terms: "Conditions",
      faq: "FAQ",
      blog: "Blog",
      bottomTagline: "Un seul espace pour un travail clair et une communication organisée.",
      copyright: "© 2025 Zane-ai Digital Solutions. Tous droits réservés.",
    },
    status: {
      developer: "Promoteur",
      broker: "Courtier",
      active: "Actif",
      pendingReview: "En révision",
    },
    signin: {
      title: "Connexion à l'espace",
      description: "Accès sécurisé à l'espace Zane-ai pour les promoteurs et les courtiers.",
      agreementPrefix: "En vous connectant, vous acceptez les",
      agreementTerms: "conditions d'utilisation",
      agreementAnd: "et la",
      agreementPrivacy: "politique de confidentialité",
      agreementSuffix: "de la plateforme.",
      encrypted: "Chiffrement professionnel",
      clearTerms: "Conditions claires",
    },
    errors: {
      notFoundTitle: "Désolé, cette page n'existe pas",
      notFoundDescription: "Il semble que vous ayez tenté d'accéder à une route non définie dans l'infrastructure numérique d'Zane-ai.",
      backHome: "Retour à l'accueil",
      contactSupport: "Contacter le support",
      workspaceErrorTitle: "Une erreur est survenue lors du chargement de l'espace de travail.",
      workspaceErrorDescription: "Réessayez ou revenez à la page principale de l'espace de travail.",
      retry: "Réessayer",
      backToWorkspace: "Retour à l'espace",
      workspaceUnavailableTitle: "Impossible de charger l'espace de travail pour le moment",
    },
    projects: {
      eyebrow: "Projets",
      title: "Projets",
      description: "Gérez votre portefeuille immobilier et vos projets enregistrés.",
      create: "Créer un projet",
      all: "Tous",
      linkedClient: "Lié à un client",
      idleBroker: "Courtier sans client",
      noBrokers: "Sans courtiers",
      rooms: "Pièces",
      baths: "Salles de bain",
      area: "Surface",
      publish: "Publier",
      openProject: "Ouvrir le projet",
      deleteTitle: "Supprimer le projet",
      deleteDescription: "Ce projet sera supprimé définitivement du portefeuille avec toutes les données associées.",
      deleteConfirm: "Supprimer le projet",
      actionFailed: "Impossible d'effectuer l'action. Veuillez réessayer.",
      createSelectionTitle: "Choisissez votre type d'inventaire",
      createSelectionSubtitle: "Sélectionnez le cadre qui correspond à vos besoins opérationnels actuels.",
      createProjectType: "Projet",
      createProjectHeadline: "Création d'un projet multi-unités",
      createProjectDesc: "Idéal pour les complexes résidentiels et l'inventaire en vrac. Prend en charge plusieurs unités, permis et galeries partagées.",
      createUnitType: "Unité indépendante",
      createUnitHeadline: "Création d'une seule unité indépendante",
      createUnitDesc: "Idéale pour les reventes, les villas individuelles ou les appartements. Directe et rapide à publier.",
      continueFlow: "Continuer",
    },
    units: {
      title: "Unités",
      create: "Créer une unité",
      edit: "Modifier l'unité",
      delete: "Supprimer l'unité",
      deleteConfirm: "Supprimer l'unité",
      deleteDescription: "Cette unité sera définitivement supprimée du projet.",
      label: "Nom de l'unité",
      type: "Type d'unité",
      floor: "Étage",
      status: "Statut",
      price: "Prix",
      description: "Description",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      area: "Surface",
      available: "Disponible",
      reserved: "Réservé",
      sold: "Vendu",
      apartment: "Appartement",
      villa: "Villa",
      duplex: "Duplex",
      studio: "Studio",
      penthouse: "Penthouse",
      townhouse: "Maison de ville",
      commercial: "Commercial",
      noUnits: "Aucune unité dans ce projet pour le moment.",
      unitCount: "unités",
      addUnit: "Ajouter une unité",
      manageUnits: "Gérer les unités",
      unitDetails: "Détails de l'unité",
      saveUnit: "Enregistrer l'unité",
      cancel: "Annuler",
    },
    offers: {
      eyebrow: "Offres 2.0",
      title: "Les offres comme cas de collaboration",
      description: "La zone des offres est désormais organisée autour de cas pratiques entre le propriétaire du stock, le courtier côté client et le partenaire d'exécution.",
      create: "Créer un nouveau cas",
      allQueues: "Toutes les files",
      queue: "File",
      casesCount: "Nombre de cas",
      value: "Valeur",
      asset: "Actif",
      noClearAsset: "Aucun actif clair",
      unspecified: "Non précisé",
      inventoryOwner: "Propriétaire du stock",
      unknownOwner: "Inconnu",
      noCommissionDetails: "Aucun détail de commission",
      executionPartner: "Partenaire d'exécution",
      notAssignedYet: "Pas encore attribué",
      noPermitStatus: "Aucun statut d'autorisation",
      clientSummary: "Résumé client",
      openToBrokersAndDevelopers: "Ouvert aux courtiers et promoteurs",
      targetedToBrokers: "Destiné aux courtiers",
      targetedToDevelopers: "Destiné aux promoteurs",
      openCase: "Ouvrir le cas",
      emptyQueue: "Il n'y a aucun cas dans cette file pour le moment.",
    },
    crm: {
      eyebrow: "Gestion des opportunités",
      title: "Opportunités",
      createPlaceholder: "Nom d'une opportunité ou d'un client",
      create: "Ajouter une opportunité",
      clientsTitle: "Clients",
      clientsDescription: "Gérer les opportunités et les relations liées",
      addClient: "Ajouter une opportunité",
      resultsCount: "{count} résultats",
      noMatchingClients: "Aucune opportunité ne correspond au filtre actuel.",
      firstPage: "Première page",
      lastPageNow: "Dernière page pour le moment",
      nextPageAvailable: "Une page suivante peut être chargée",
      nextPage: "Page suivante",
      open: "Ouvrir",
      withBroker: "Avec {name}",
      withoutBroker: "Sans courtier",
      budget: "Budget",
      all: "Tous",
      unlinked: "Sans lien",
      projectOnly: "Projet seulement",
      fullyLinked: "Projet + courtier",
    },
    notifications: {
      eyebrow: "Notifications",
      title: "Centre de notifications",
      description: "De vraies notifications liées aux conversations, aux offres et aux invitations dans le même espace de travail.",
      all: "Toutes",
      unread: "Non lues",
      unreadSummary: "Vous avez {count} notifications non lues",
      noPending: "Aucune notification en attente",
      empty: "Aucune notification dans ce filtre.",
      read: "Lue",
      new: "Nouveau",
    },
    inbox: {
      brokerInvite: "Invitation courtier",
      developerInvite: "Invitation promoteur",
      from: "De",
      proposedRole: "Rôle proposé",
      accept: "Accepter",
      message: "Message",
      cancel: "Annuler",
      incomingInvites: "Invitations reçues",
      incomingInvitesDescription: "Gérez rapidement les invitations d'équipe depuis la même boîte de réception.",
      member: "Membre",
      pendingInvite: "Invitation en attente",
      user: "Utilisateur",
      start: "Démarrer",
      searching: "Recherche en cours...",
      noMatchingResults: "Aucun résultat ne correspond à votre recherche.",
      startConversation: "Démarrer la conversation",
      noConversations: "Aucune conversation dans cette section pour le moment.",
      noConversationsInSection: "Aucune conversation dans cette section pour le moment.",
      lastMessageFallback: "Commencer la conversation",
      emptyThreadTitle: "Boîte de réception",
      emptyThreadDescription: "Choisissez une conversation depuis la barre latérale ou recherchez un nouvel utilisateur pour démarrer un échange direct.",
      loadingThread: "Chargement de la conversation...",
      composerPlaceholder: "Écrivez votre message au courtier immobilier...",
      shareFile: "Partager un fichier",
      shareProject: "Partager un projet",
      sharePrivateOffer: "Envoyer une offre privée",
      dropAttachment: "Déposez une image ou un PDF ici pour l'ajouter rapidement",
      sending: "Envoi en cours",
      send: "Envoyer",
      attachFile: "Joindre un fichier",
      closeSharePanel: "Fermer le panneau de partage",
      noteLabel: "Note",
      fileNotePlaceholder: "Ajoutez une courte description du fichier",
      uploadFile: "Choisir un fichier",
      changeFile: "Changer le fichier",
      uploadingFile: "Téléversement du fichier...",
      selectProject: "Choisir un projet",
      projectOrProperty: "Bien ou projet",
      chooseProject: "Choisir un projet à partager",
      openProjectGallery: "Ouvrez la galerie visuelle pour choisir le projet.",
      choose: "Choisir",
      chooseProjectToShare: "Choisir un projet à partager",
      chooseProjectDescription: "Un choix visuel plus rapide que la liste textuelle.",
      searchProjectHint: "Recherchez ou affichez d'autres projets si le promoteur en possède beaucoup.",
      searchProjectPlaceholder: "Rechercher par nom, lieu ou organisation",
      noExtraDescription: "Aucune description supplémentaire",
      currentWorkspace: "Espace de travail actuel",
      noPrice: "Pas de prix",
      noMatchingProjects: "Aucun projet ne correspond à cette recherche.",
      createOfferQuickly: "Créer et envoyer une offre rapide",
      toConversation: "À {name}",
      offerPrice: "Prix",
      offerTitle: "Titre de l'offre",
      offerTitlePlaceholder: "Exemple : Offre privée pour une unité prête à livrer",
      offerNotePlaceholder: "Rédigez le court message qui accompagne l'offre.",
      offerAttachments: "Pièces jointes de l'offre",
      dragAttachments: "Glissez les fichiers ici ou choisissez-les manuellement.",
      uploadAttachments: "Ajouter des pièces jointes",
      uploadingAttachments: "Téléversement des pièces jointes...",
      attachmentSendHint: "Ces pièces jointes ne seront pas envoyées tant que vous n'aurez pas appuyé sur créer et envoyer.",
      offerSendHint: "L'offre sera créée puis envoyée directement dans la conversation.",
      createAndSend: "Créer et envoyer",
      sendMessageFailed: "Impossible d'envoyer le message. Veuillez réessayer.",
      fileUploadFailed: "Impossible de téléverser le fichier.",
      offerUploadFailed: "Impossible de téléverser les pièces jointes de l'offre.",
      chooseProjectAndPriceFirst: "Choisissez un bien et définissez le prix avant d'envoyer l'offre.",
      chooseFileFirst: "Choisissez un fichier avant l'envoi.",
      chooseProjectFirst: "Choisissez un bien ou un projet à partager.",
      attachTypeFile: "Joindre un fichier",
      attachTypeProject: "Envoyer un bien ou un appartement",
      attachTypeOffer: "Créer une offre privée",
      attachTypeFileDescription: "Envoyez un fichier avec une courte note.",
      attachTypeProjectDescription: "Choisissez un seul actif avec un bref commentaire.",
      attachTypeOfferDescription: "Créez une offre rapide et envoyez-la directement depuis la conversation.",
      threadActionOffer: "Créer une offre privée",
      threadActionProject: "Envoyer le projet",
      threadActionFile: "Joindre un fichier",
      threadActionOpen: "Ouvrez cette action depuis le même écran.",
      threadActionUnavailable: "Indisponible pour cette conversation pour le moment.",
      threadMenuLabel: "Actions",
      back: "Retour",
      broker: "Courtier",
      developer: "Promoteur",
      userLabel: "Utilisateur",
      fileShareLabel: "Partage de fichier",
      projectShareLabel: "Partage de projet",
      dealShareLabel: "Partage d'opportunité",
      inviteUpdateLabel: "Mise à jour d'invitation",
      roleUpdateLabel: "Mise à jour du rôle",
      workspaceProject: "Projet lié à l'espace",
    },
    market: {
      title: "Analyse du marché",
      description: "L'interface complète d'intelligence marché est conservée en arrière-plan et s'affiche actuellement avec une couche temporaire jusqu'à la prochaine phase de développement.",
      analyzeMarket: "Analyser le marché",
      scope: "Périmètre",
      range: "Période",
      topKeyword: "Mot-clé principal",
      noClearSignal: "Aucun signal clair",
      mockDataBanner: "Cette page affiche actuellement des données d'exemple jusqu'à ce que suffisamment de données réelles soient disponibles pour ce périmètre.",
    },
    settings: {
      workspaceLabel: "Paramètres de l'espace",
      title: "Paramètres de l'organisation",
      description: "Gérez l'organisation, l'équipe et la vérification depuis un seul espace.",
      organization: "Organisation",
      verification: "Vérification",
      membersAndInvites: "Membres et invitations",
      apps: "Applications",
      apiKeys: "Clés API",
      manager: "Gestionnaire",
      viewer: "Lecteur",
      member: "Membre",
      unavailable: "Indisponible",
      membersSummary: "{members} membres, {invites} invitations, et votre rôle actuel est : {roleLabel}",
      apiKeysSummaryCreate: "Vous pouvez créer et révoquer les clés ici.",
      apiKeysSummaryRevoke: "Vous pouvez consulter et révoquer les clés ici.",
      apiKeysSummaryNoAccess: "Vous n'avez pas l'autorisation de gérer cette section.",
      connectedAppsSummaryManage: "Consultez les applications connectées à l'organisation et révoquez celles qui ne sont plus nécessaires.",
      connectedAppsSummaryReadonly: "Consultez ici les applications connectées. Seuls les gestionnaires peuvent approuver une nouvelle application ou révoquer l'accès.",
      connectedAppsPageTitle: "Applications de l'organisation",
      connectedAppsPageDescription: "Consultez les applications externes connectées à cette organisation et les permissions qui leur ont été approuvées.",
      connectedAppsLegacyNotice: "Les applications connectées appartiennent désormais à l'organisation. Toute ancienne autorisation personnelle doit être reconnectée sous l'organisation avant d'apparaître ici.",
      connectedAppsReadonlyNotice: "Seuls les gestionnaires de l'organisation peuvent approuver une nouvelle application ou révoquer l'accès, mais tous les membres peuvent consulter les connexions en cours.",
      connectedAppsEmptyTitle: "Aucune application connectée pour le moment",
      connectedAppsEmptyDescription: "Démarrez la connexion depuis le flux OAuth /authorize de l'application externe. Les connexions approuvées pour l'organisation apparaîtront ici.",
      connectedAppsConnectedAt: "Connectée",
      connectedAppsLastUsed: "Dernière utilisation",
      connectedAppsNeverUsed: "Jamais utilisée",
      connectedAppsRevoke: "Révoquer",
      connectedAppsRevoking: "Révocation...",
      connectedAppsRevokeConfirm: "Cette action révoquera l'application pour l'organisation et coupera toutes les sessions actives. Continuer ?",
      apiKeysNoOrgTitle: "Clés API",
      apiKeysNoOrgDescription: "Créez d'abord une organisation avant d'émettre des clés d'intégration. Vous pourrez attribuer des permissions limitées à chaque clé pour sécuriser vos données.",
      apiKeysRestrictedTitle: "Clés API",
      apiKeysRestrictedDescription: "La consultation et la gestion des clés API sont réservées aux propriétaires et gestionnaires de l'organisation. Si vous avez besoin d'un accès d'intégration, demandez l'autorisation au propriétaire.",
      apiKeysPageTitle: "Clés API",
      apiKeysPageDescription: "Gérez les clés de vos applications internes pour connecter en toute sécurité les clients, projets et opportunités.",
      apiKeysEmptyTitle: "Aucune clé API pour le moment",
      apiKeysEmptyDescription: "Commencez par créer une clé avec le minimum de permissions nécessaires pour permettre à vos systèmes internes d'accéder aux clients, projets et opportunités.",
      apiKeysCreateFirst: "+ Créer votre première clé",
      apiKeysCreateOwnerOnly: "La création de clés n'est disponible que pour le propriétaire de l'organisation. Vous pouvez toujours consulter les clés existantes et les révoquer si nécessaire.",
      apiKeysCreateButton: "Créer une nouvelle clé",
      apiKeysCreatedTitle: "Clé créée avec succès",
      apiKeysCreateDialogTitle: "Créer une nouvelle clé API",
      apiKeysClose: "Fermer",
      apiKeysSecretTitle: "Gardez cette clé privée",
      apiKeysSecretDescription: "C'est la seule fois où nous afficherons la valeur secrète complète. Copiez-la et conservez-la dans un endroit sûr.",
      apiKeysCopy: "Copier",
      apiKeysCopied: "Copié",
      apiKeysCopiedConfirm: "C'est bon, j'ai copié la clé",
      apiKeysNameLabel: "Nom de la clé (optionnel)",
      apiKeysNamePlaceholder: "Exemple : Synchronisation CRM interne",
      apiKeysPermissionsLabel: "Permissions",
      apiKeysPermissionsHint: "Choisissez les actions autorisées. Certaines ressources sont en lecture seule dans cette version.",
      apiKeysReadOnly: "Lecture seule",
      apiKeysReadWrite: "Lecture et écriture",
      apiKeysFullAccess: "Accès complet",
      apiKeysResourceColumn: "Ressource",
      apiKeysDetailsColumn: "Détails",
      apiKeysLastUsedColumn: "Dernière utilisation",
      apiKeysActionColumn: "Action",
      apiKeysUnnamed: "Sans nom",
      apiKeysActive: "Active",
      apiKeysRevoked: "Révoquée",
      apiKeysCreatedAt: "Le {date}",
      apiKeysNeverUsed: "Jamais utilisée",
      apiKeysRevoking: "Révocation...",
      apiKeysRevoke: "Révoquer la clé",
      apiKeysRevokedState: "Révoquée",
      apiKeysCreateOwnerStatus: "La création de clés API n'est disponible que pour le propriétaire de l'organisation.",
      apiKeysChoosePermissionStatus: "Choisissez au moins une permission avant de créer la clé.",
      apiKeysCreatingStatus: "Création de la clé...",
      apiKeysCreateFailedStatus: "Impossible de créer la clé.",
      apiKeysCreatedStatus: "La clé a été créée. Enregistrez le secret maintenant car il ne sera plus affiché.",
      apiKeysRevokePermissionStatus: "La révocation des clés API n'est disponible que pour le propriétaire ou le gestionnaire.",
      apiKeysRevokingStatus: "Révocation de la clé...",
      apiKeysRevokeFailedStatus: "Impossible de révoquer la clé.",
      apiKeysRevokedStatus: "La clé a été révoquée et ne fonctionne plus.",
      membersTitle: "Membres de l'organisation ({count})",
      inviteMember: "Inviter un membre",
      inviteMemberTitle: "Inviter un nouveau membre",
      inviteMemberDescription: "Recherchez par e-mail ou nom d'utilisateur, puis envoyez une invitation ou ouvrez une conversation directe.",
      inviteSearchLabel: "Rechercher par e-mail complet ou nom d'utilisateur",
      inviteSearchPlaceholder: "name@company.com ou username",
      inviteSearchHint: "Un utilisateur n'apparaît que si l'e-mail complet ou le nom d'utilisateur exact correspond.",
      roleLabel: "Rôle",
      sendInvite: "Inviter",
      roleUpdateInProgress: "Mise à jour du rôle...",
      roleUpdateFailed: "Impossible de mettre à jour le rôle.",
      roleUpdated: "Le rôle de {name} a été changé en {role}.",
      inviteCancelInProgress: "Annulation de l'invitation...",
      inviteCancelFailed: "Impossible d'annuler l'invitation.",
      inviteCanceled: "Invitation annulée.",
      pendingInvitesTitle: "Invitations en attente ({count})",
      managerGuardrail: "Vous ne pouvez pas rétrograder le dernier gestionnaire de l'organisation. Gardez toujours au moins un gestionnaire avant de modifier les rôles.",
      inviteExpires: "Expire {date}",
      currentMember: "Membre actuel",
      nonMember: "Non membre",
      managerPermissionRequired: "Le rôle de gestionnaire est requis pour envoyer des invitations.",
      inviteSending: "Envoi de l'invitation...",
      inviteFailed: "Impossible d'envoyer l'invitation.",
      inviteSent: "Invitation envoyée avec succès.",
      openConversationFailed: "Impossible d'ouvrir la conversation.",
      noOrganizationLinked: "Aucune organisation n'est liée au compte actuel.",
      searchingDirectory: "Recherche en cours...",
      searchFailed: "La recherche a échoué.",
      noMatchingDirectoryResult: "Aucun résultat correspondant. Vous pouvez inviter directement l'e-mail complet.",
      cannotInviteWithoutOrganization: "Vous ne pouvez pas envoyer d'invitations tant que le compte n'est pas lié à une organisation.",
      openConversation: "Message",
      verificationTitle: "Vérification de l'organisation",
      verificationEmptyOrganization: "Aucune organisation n'est liée au compte actuel.",
      verificationCurrentStatus: "Statut actuel de vérification",
      publishingStatus: "Statut de publication",
      publishingBlocked: "La publication est bloquée jusqu'à l'approbation de la vérification",
      publishingAllowed: "Aucun blocage de publication lié à la vérification de l'organisation",
      lastSubmission: "Dernier envoi",
      filesCount: "Nombre de fichiers",
      membersCountLabel: "Nombre de membres",
      teamSummary: "{members} membres, {invites} invitations, et votre rôle actuel est : {roleLabel}",
      reviewNotes: "Notes de révision",
      verificationTimeline: "Chronologie",
      verificationNoTimeline: "Aucune demande de vérification n'a encore été envoyée.",
      latestDocuments: "Documents envoyés lors de la dernière demande",
      unknownDocumentType: "Document",
      verificationSubmitTitle: "Envoyer ou renvoyer les documents de vérification",
      verificationSubmitDescription: "Type d'organisation actuel : {organizationType}. Seuls les gestionnaires peuvent utiliser ce formulaire, tandis que les décisions de révision apparaissent dans le panneau d'administration.",
      requiredDocsTitle: "Documents requis",
      requiredDocsSubtitle: "Pièces d'identité et registres de base.",
      proofDocsTitle: "Preuves d'activité (optionnel)",
      proofDocsSubtitle: "Exemples de travaux ou documents de support pour l'activité de l'organisation.",
      uploadingFiles: "Téléversement des fichiers...",
      uploadFilesIdle: "Téléverser des PDF ou des images",
      uploadProofIdle: "Ajouter des documents de support",
      managerOnlySubmissionHint: "Après l'envoi, la demande apparaîtra dans le panneau d'administration pour révision. Il n'y a ici aucun bouton d'approbation ou de fermeture.",
      viewerSubmissionHint: "Cette vue sert uniquement au suivi. Vous avez besoin des droits de gestionnaire pour envoyer ou renvoyer des documents.",
      verificationRequiredDocsError: "Veuillez téléverser au moins un document requis.",
      verificationSubmitting: "Envoi de la demande de vérification...",
      verificationSubmitFailed: "Impossible d'envoyer la demande de vérification.",
      verificationSubmitted: "La demande de vérification a été envoyée avec succès. Elle sera examinée depuis le panneau d'administration.",
      verificationSubmit: "Envoyer la demande",
      verificationResubmit: "Renvoyer les documents",
      accountSettingsTitle: "Compte et sécurité",
      accountSettingsDescription: "Gérez votre profil, votre nom d'utilisateur et la sécurité du compte.",
      logoutAction: "Se déconnecter",
      loggingOut: "Déconnexion...",
      organizationSettingsTitle: "Paramètres de l'organisation",
      organizationSettingsDescription: "Un panneau plus simple pour mettre à jour l'identité de l'organisation et les coordonnées essentielles.",
      organizationIdentityTitle: "Identité de l'organisation",
      organizationIdentityDescription: "Consultez les informations actuelles de l'organisation puis modifiez uniquement les champs nécessaires.",
      organizationSlug: "Identifiant",
      organizationStatus: "Statut",
      organizationType: "Type d'organisation",
      organizationVerified: "Vérification",
      organizationVerifiedYes: "Vérifiée",
      organizationVerifiedNo: "Non vérifiée",
      organizationNameLabel: "Nom",
      organizationDescriptionLabel: "Description",
      organizationDescriptionHint: "Optionnel. Utilisé comme courte présentation dans l'espace de travail.",
      organizationWebsiteLabel: "Site web",
      organizationEmailLabel: "E-mail de contact",
      organizationPhoneLabel: "WhatsApp / téléphone",
      organizationNoOrganization: "Aucune organisation n'est liée au compte actuel.",
      organizationManagerRequired: "Le rôle de gestionnaire est requis pour modifier les informations de l'organisation.",
      organizationSaving: "Enregistrement des informations de l'organisation...",
      organizationSaveFailed: "Impossible d'enregistrer les informations de l'organisation.",
      organizationSaved: "Les informations de l'organisation ont été mises à jour.",
      organizationSave: "Enregistrer les modifications",
      organizationTypeBroker: "Courtier immobilier",
      organizationTypeDeveloper: "Promoteur immobilier",
    },
    assistant: {
      placeholderDeveloper: "Analysez le marché, préparez une offre ou demandez des idées pour votre projet...",
      placeholderBroker: "Demandez une estimation, des opportunités de marché ou les performances de votre équipe...",
      placeholderDefault: "Demandez à Zane-ai des informations sur un nouveau bien, les opportunités du marché, ou déposez ici des images d'unité et des PDF pour qu'il les prépare...",
      attach: "Joindre",
      search: "Recherche",
      deepSearch: "Recherche approfondie",
      stop: "Arrêter",
      voiceTitle: "Enregistrement vocal",
      closeVoicePanel: "Fermer le panneau vocal",
      voiceCancel: "Annuler",
      requestPermissionAgain: "Demander l'autorisation à nouveau",
      stopRecording: "Arrêter",
      liveInput: "Entrée en direct",
      processing: "Traitement",
      ready: "Prêt",
      preparingMic: "Préparation du micro",
      waitingForSpeech: "En attente de la voix",
      silenceCountdown: "Envoi après un bref silence",
      uploadingRecording: "Téléversement de l'enregistrement",
      analyzingRecording: "Analyse de l'enregistrement",
      sendingMessage: "Envoi du message",
      recordingError: "Un problème est survenu pendant l'enregistrement",
      recordingNow: "Enregistrement en cours",
      preparingUpload: "Impossible de préparer le téléversement du fichier.",
      savingUploads: "Impossible d'enregistrer les fichiers téléversés.",
      uploadFailed: "Impossible de téléverser les fichiers pour le moment.",
      sendFailed: "Impossible d'envoyer le message.",
      statusUploading: "Téléversement",
      statusUploadFailed: "Échec du téléversement",
      statusReady: "Prêt",
      removeAttachment: "Supprimer {name}",
      attachmentRetryHint: "Le fichier n'a pas pu être téléversé. Réessayez.",
    },
    about: {
      badge: "Qui nous sommes",
      title: "À propos d'Zane-ai",
      titleAccent: "Une entreprise qui construit un espace de travail plus clair",
      description: "Zane-ai est la vitrine publique d'un espace de travail qui réunit promoteurs et courtiers autour d'outils plus clairs, d'un suivi plus simple et d'une explication directe de ce que fait l'entreprise et pourquoi elle existe.",
      contact: "Nous contacter",
      missionTitle: "Notre mission",
      missionDescription: "Simplifier le travail entre promoteurs et courtiers grâce à un espace partagé qui rapproche et clarifie la communication, l'information et les tâches.",
      valuesTitle: "Nos valeurs",
      valuesDescription: "Clarté, structure et fiabilité dans chaque partie de l'expérience publique et de l'espace de travail interne.",
      workStyleTitle: "Notre manière de travailler",
      workStyleDescription: "Nous créons des pages publiques qui expliquent le produit, ainsi qu'un espace interne qui aide les équipes à exécuter le travail quotidien sans distraction.",
      whyTitle: "Pourquoi",
      whyAccent: "cet espace",
      whyDescriptionPrimary: "Nous sommes partis d'un constat simple : les équipes ont besoin d'un espace de travail qui parle leur langue, montre clairement ce qui compte et les aide à avancer sans chaos ni duplication d'outils.",
      whyDescriptionSecondary: "C'est pour cela que nous avons conçu Zane-ai pour présenter l'entreprise publiquement, puis aider les promoteurs et les courtiers à suivre ce qui se passe réellement dans le produit.",
      metricsUnified: "Espace unifié",
      metricsAudience: "Publics principaux",
      metricsAvailability: "Toujours accessible",
      metricsClarity: "Clair dès la première visite",
      identityTitle: "Comment nous",
      identityAccent: "nous définissons aujourd'hui",
      identityDescriptionPrimary: "Zane-ai n'est pas seulement une landing page, ni seulement un outil interne. C'est le point de départ qui explique qui nous sommes, puis guide promoteurs et courtiers vers un espace de travail qui favorise structure, suivi et collaboration.",
      identityDescriptionSecondary: "C'est sur cette base que nous construisons : un produit clair, un message clair et une expérience publique qui explique la vraie valeur de l'espace que nous proposons.",
      talkToTeam: "Parler à l'équipe",
      developerSpace: "Espace promoteurs",
    },
    homeSearch: {
      ready: "Immobilier",
      projects: "Nouveaux Projets",
      buy: "À Vendre",
      rent: "À Louer",
      placeholder: "Rechercher un lieu, une zone ou une ville",
    },
    hero: {
      subtitle: "La première couche conjonctive immobilière qui extrait les données structurelles en direct en temps réel à mesure que vous recherchez—vous offrant des métadonnées précises et fiables.",
    },
    cta: {
      title: "Passez de manuel à automatique.",
      subtitle: "Commencez à utiliser l'infrastructure derrière les déploiements de l'immobilier institutionnel les plus performants.",
    },
  },
};

export function getWebDictionary(locale: AppLocale): WebDictionary {
  return dictionaries[locale];
}

export function formatWebCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
type ClassValue = string | number | boolean | null | undefined | ClassValue[];

function flattenClasses(inputs: ClassValue[]): string[] {
  const result: string[] = [];
  for (const input of inputs) {
    if (!input) {
      continue;
    }
    if (Array.isArray(input)) {
      result.push(...flattenClasses(input));
      continue;
    }
    result.push(String(input));
  }
  return result;
}

export function cn(...inputs: ClassValue[]) {
  return flattenClasses(inputs).join(" ");
}
