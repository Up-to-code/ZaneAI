import type { WorkspaceZoneKey } from "@/server/contracts/workspace";
import type { NotificationSummary } from "@/server/contracts/notifications";
import type { OrganizationApiKeySummary } from "@/server/contracts/organizationApiKeys";
import type { OAuthAuthorizedAppSummary } from "@/server/contracts/oauth";
import type { ProfileSummary } from "@/server/contracts/profiles";
import type { OrganizationPublicProfile } from "@/server/contracts/organizations";
import type { SessionUser } from "@/server/contracts/session";
import { getWorkspaceOrganizationDisplay } from "./organizationDisplay";
import type { WorkspaceProject } from "../(zones)/projects/types/projectTypes";
import type { WorkspaceOfferDetail, WorkspaceOfferSummary } from "../(zones)/offers/types/offerTypes";
import type { CrmClientRecord } from "../(zones)/crm/types/crmTypes";
import type { OrganizationInviteDisplay, OrganizationMemberDisplay, UnitReference } from "./entities";

const now = Date.now();

export const demoVisibleZoneKeys: WorkspaceZoneKey[] = [
  "overview",
  "inbox",
  "crm",
  "projects",
  "offers",
  "market",
  "settings",
];

export const demoSessionUser: SessionUser = {
  id: "user-demo",
  name: "Ahmed Mansour",
  email: "ahmed@zane-ai.sa",
  image: null,
  username: "ahmedmansour",
  organizationId: "org-demo",
  organizationSlug: "nawy-demo",
  organizationRole: "manager",
  organizationPermissions: ["projects:write", "offers:write", "members:write"],
  isActive: true,
};

export const demoPrimaryOrganization = {
  id: "org-demo",
  organizationId: "org-demo",
  type: "red" as const,
  name: "Nawy Demo Development",
  slug: "nawy-demo",
  status: "active" as const,
  isVerified: true,
  logoUrl: null,
  description: "A static workspace demo for project, offer, and CRM collaboration.",
  website: "https://demo.zane-ai.sa",
  contactEmail: "hello@zane-ai.sa",
  phone: "+966500000000",
  verificationSummary: {
    isVerified: true,
    currentRequestId: null,
    currentRequestStatus: "approved" as const,
    lastSubmittedAt: now - 1000 * 60 * 60 * 24 * 20,
    lastReviewedAt: now - 1000 * 60 * 60 * 24 * 18,
    reviewerNotes: "Demo organization approved for showcase mode.",
    documentsCount: 3,
    publishingBlocked: false,
    attachedDocuments: [],
    requirements: [],
    sourceUrls: [],
  },
};

export const demoOrganizationDisplay = getWorkspaceOrganizationDisplay({
  name: demoPrimaryOrganization.name,
  type: demoPrimaryOrganization.type,
  status: demoPrimaryOrganization.status,
  logoUrl: demoPrimaryOrganization.logoUrl,
  isVerified: demoPrimaryOrganization.isVerified,
  locale: "ar",
});

export const demoWorkspaceBehavior = {
  audience: "developer" as const,
  ownerContext: { ownerType: "developer" as const, ownerId: "org-demo" },
  visibleZoneKeys: demoVisibleZoneKeys,
  onboarding: {
    needsOrganization: false,
    suggestedOrganizationType: "red" as const,
  },
  session: {
    userId: demoSessionUser.id,
    role: "manager",
  },
  user: demoSessionUser,
  primaryOrganization: demoPrimaryOrganization,
};

export const demoAssistantThreads = [
  { id: "thread-1", title: "Downtown launch strategy", updatedAt: now - 1000 * 60 * 12 },
  { id: "thread-2", title: "Investor outreach recap", updatedAt: now - 1000 * 60 * 55 },
  { id: "thread-3", title: "Mall of Arabia pricing", updatedAt: now - 1000 * 60 * 90 },
];

export const demoSignalCounts = {
  notificationCount: 3,
  inboxCount: 5,
};

export function getDemoSidebarData() {
  return {
    user: demoSessionUser,
    organizations: [demoPrimaryOrganization],
    recentAssistantThreads: demoAssistantThreads.slice(0, 3),
    allAssistantThreads: demoAssistantThreads,
    signalCounts: demoSignalCounts,
  };
}

export const demoOrganizationMembers: OrganizationMemberDisplay[] = [
  {
    id: "member-1",
    authUserId: "user-demo",
    membershipId: "membership-1",
    name: "Ahmed Mansour",
    email: "ahmed@zane-ai.sa",
    username: "ahmedmansour",
    role: "manager",
    statusLabel: "نشط",
  },
  {
    id: "member-2",
    authUserId: "user-2",
    membershipId: "membership-2",
    name: "Sara Adel",
    email: "sara@zane-ai.sa",
    username: "saraadel",
    role: "member",
    statusLabel: "نشط",
  },
  {
    id: "member-3",
    authUserId: "user-3",
    membershipId: "membership-3",
    name: "Youssef Karim",
    email: "youssef@zane-ai.sa",
    username: "youssefk",
    role: "viewer",
    statusLabel: "مراجع",
  },
];

export const demoOrganizationInvites: OrganizationInviteDisplay[] = [
  {
    id: "invite-1",
    email: "partnerships@brokerhub.sa",
    role: "member",
    status: "pending",
    expiresLabel: "20/04/2026",
  },
];

export function getDemoOrganizationTeam() {
  return {
    organization: demoPrimaryOrganization,
    members: demoOrganizationMembers,
    invites: demoOrganizationInvites,
    authUserId: demoSessionUser.id,
    currentMembershipRole: "manager" as const,
    currentTenantRole: "owner",
  };
}

const demoUnits: UnitReference[] = [
  {
    id: "unit-a",
    label: "Type A",
    bedrooms: 3,
    bathrooms: 3,
    area: "190 م²",
    priceLabel: "2,500,000 ر.س",
  },
  {
    id: "unit-b",
    label: "Type B",
    bedrooms: 4,
    bathrooms: 4,
    area: "240 م²",
    priceLabel: "3,150,000 ر.س",
  },
];

export const demoProjects: WorkspaceProject[] = [
  {
    id: "property-1",
    title: "مالقا ريزيدنس",
    location: "الملقا، الرياض",
    priceLabel: "2,500,000 ر.س",
    summary: "مجمع سكني معاصر يركز على العائلات الباحثة عن قرب الخدمات والمرافق.",
    shortDescription: "واجهة سكنية هادئة مع نبذة قصيرة وواضحة.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      { key: "property-1-cover", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", name: "cover.jpg" },
      { key: "property-1-lobby", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", name: "lobby.jpg" },
    ],
    gallery: {
      coverImageKey: "property-1-cover",
      displayMode: "cover",
      aspectRatio: "landscape",
    },
    amenities: ["مواقف ضيوف", "نادي", "مساحات خضراء"],
    parking: {
      hasParking: true,
      spaces: 2,
      label: "موقفان خاصان",
    },
    permit: {
      statusLabel: "موثق",
      privateSummary: "التصريح الكامل متاح داخل نسخة العرض التنفيذية.",
      privateFiles: [
        { key: "permit-1", url: "https://example.com/permit.pdf", name: "permit.pdf" },
      ],
      visibility: "conversation_only",
      canShowPrivatePanel: true,
    },
    specs: {
      rooms: "4 غرف",
      baths: "4 حمامات",
      area: "380 م²",
      status: "جاهز للإطلاق",
    },
    publicationState: "published",
    accessMode: "owner",
    canEdit: true,
    visibility: {
      clientVisibility: "public",
      viewers: [],
    },
    assets: [],
    units: demoUnits,
    brokers: [],
  },
  {
    id: "property-2",
    title: "برج الأعمال",
    location: "العليا، الرياض",
    priceLabel: "1,800,000 ر.س",
    summary: "وحدات استثمارية ومكتبية مع باقات عرض جاهزة للسماسرة والشركاء.",
    shortDescription: "أقرب مشروع للإطلاق المؤسسي داخل المنطقة التجارية.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      { key: "property-2-cover", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", name: "tower.jpg" },
    ],
    gallery: {
      coverImageKey: "property-2-cover",
      displayMode: "cover",
      aspectRatio: "portrait",
    },
    amenities: ["ردهة استقبال", "مركز أعمال", "غرف اجتماعات"],
    parking: {
      hasParking: true,
      spaces: 1,
      label: "موقف واحد",
    },
    permit: {
      statusLabel: "قيد المراجعة",
      privateSummary: null,
      privateFiles: [],
      visibility: "hidden",
      canShowPrivatePanel: false,
    },
    specs: {
      rooms: "2 غرف",
      baths: "2 حمام",
      area: "120 م²",
      status: "مسودة",
    },
    publicationState: "draft",
    accessMode: "owner",
    canEdit: true,
    visibility: {
      clientVisibility: "private",
      viewers: [],
    },
    assets: [],
    units: [demoUnits[0]],
    brokers: [],
  },
];

export function getDemoProject(projectId: string) {
  return demoProjects.find((project) => project.id === projectId) ?? null;
}

export const demoOffers: WorkspaceOfferSummary[] = [
  {
    id: "offer-1",
    packageId: "package-1",
    type: "open_offer",
    stage: "open",
    status: "pending",
    publicationState: "published",
    visibility: "public",
    propertyId: "property-1",
    price: 2500000,
    message: "عرض مطور مفتوح",
    description: "عرض موجه لشبكة الوسطاء مع حزمة ملفات تعاقد جاهزة.",
    senderName: "Nawy Demo Development",
    recipientAuthUserId: null,
    sourceConversationId: null,
    property: {
      id: "property-1",
      title: "مالقا ريزيدنس",
      address: "الملقا، الرياض",
      price: 2500000,
      beds: 3,
      baths: 3,
      sqft: 190,
      location: "الرياض",
      area: "الملقا",
      imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    },
    propertyGallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    propertySummary: "واجهة سكنية هادئة مع نبذة قصيرة وواضحة.",
    commissionText: "2.5%",
    permitStatus: "جاهز",
    productStatus: "متاح",
    allowedAudience: "both",
    attachments: [],
    clientContext: null,
    primaryOrganization: {
      id: "org-demo",
      name: "Nawy Demo Development",
      type: "developer",
      logoUrl: null,
      website: "https://demo.zane-ai.sa",
      contactEmail: "hello@zane-ai.sa",
    },
    participants: [],
    href: "/ws/offers/offer-1",
    createdAt: now - 1000 * 60 * 60 * 16,
    updatedAt: now - 1000 * 60 * 60 * 2,
  },
  {
    id: "offer-2",
    packageId: "package-2",
    type: "private_offer",
    stage: "targeted",
    status: "pending",
    publicationState: "draft",
    visibility: "private",
    propertyId: "property-2",
    price: 1800000,
    message: "عرض وسيط خاص",
    description: "نسخة خاصة لمتطلبات عميل يبحث عن وحدة مكتبية صغيرة.",
    senderName: "Broker Hub Riyadh",
    recipientAuthUserId: null,
    sourceConversationId: "conversation-2",
    property: {
      id: "property-2",
      title: "برج الأعمال",
      address: "العليا، الرياض",
      price: 1800000,
      beds: 2,
      baths: 2,
      sqft: 120,
      location: "الرياض",
      area: "العليا",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    },
    propertyGallery: [],
    propertySummary: "وحدة مؤسسية داخل برج أعمال جاهز للتسليم.",
    commissionText: null,
    permitStatus: null,
    productStatus: null,
    allowedAudience: "brokers",
    attachments: [],
    clientContext: {
      clientName: "شركة المدار",
      clientPhone: "+966500000111",
      clientBudget: "1,900,000 ر.س",
      clientNeed: "مكتب جاهز مع وصول سريع للطريق الدائري.",
      budgetMin: 1500000,
      budgetMax: 1900000,
      location: "الرياض",
      area: "العليا",
      bedsMin: 2,
      bathsMin: 2,
      sqftMin: 110,
      sqftMax: 150,
    },
    primaryOrganization: {
      id: "broker-1",
      name: "Broker Hub Riyadh",
      type: "broker",
      logoUrl: null,
      website: null,
      contactEmail: "partners@brokerhub.sa",
    },
    participants: [],
    href: "/ws/offers/offer-2",
    createdAt: now - 1000 * 60 * 60 * 28,
    updatedAt: now - 1000 * 60 * 60 * 8,
  },
];

export function getDemoOffer(offerId: string): WorkspaceOfferDetail | null {
  const offer = demoOffers.find((item) => item.id === offerId);
  if (!offer) return null;

  return {
    ...offer,
    propertyTitle: offer.property?.title ?? offer.message,
    propertyAddress: offer.property?.address ?? offer.property?.location ?? "",
    isOwner: true,
    isRecipient: false,
    canEditDraft: offer.publicationState === "draft",
    canPublish: offer.publicationState === "draft",
    canArchive: true,
    canRespond: false,
    allowedActions: {
      isInventoryOwner: true,
      isClientOwner: false,
      isExecutionPartner: false,
      canEditDraft: offer.publicationState === "draft",
      canPublish: offer.publicationState === "draft",
      canArchive: true,
      canEngage: false,
      canRespond: false,
      canMarkAgreed: false,
      canCloseWon: false,
      canCloseLost: false,
    },
    activity: [],
  } as WorkspaceOfferDetail;
}

export const demoCrmClients: CrmClientRecord[] = [
  {
    id: "deal-1",
    personType: "client",
    relationType: "internal_client",
    avatarLabel: "م",
    name: "منى الغامدي",
    stage: "new",
    budgetLabel: "1,800,000 ر.س",
    preference: "شقة 3 غرف داخل الملقا مع قرب الخدمات.",
    nextFollowUpAt: now + 1000 * 60 * 60 * 24 * 3,
    project: {
      id: "property-1",
      title: "مالقا ريزيدنس",
      image: demoProjects[0].image,
      location: demoProjects[0].location,
      priceLabel: demoProjects[0].priceLabel,
      summary: demoProjects[0].summary,
    },
    linkedClient: null,
    unit: demoUnits[0],
    broker: null,
    relationLabel: "عميل مباشر",
    notes: "ينتظر مقارنة نهائية بين وحدتين.",
    badges: ["verified"],
  },
  {
    id: "deal-2",
    personType: "broker",
    relationType: "broker_managed",
    avatarLabel: "خ",
    name: "خالد فهد",
    stage: "proposal",
    budgetLabel: "3,100,000 ر.س",
    preference: "حزمة عرض للمستثمرين مع مواد تسويقية جاهزة.",
    nextFollowUpAt: now + 1000 * 60 * 60 * 24,
    project: {
      id: "property-2",
      title: "برج الأعمال",
      image: demoProjects[1].image,
      location: demoProjects[1].location,
      priceLabel: demoProjects[1].priceLabel,
      summary: demoProjects[1].summary,
    },
    linkedClient: null,
    unit: demoUnits[1],
    broker: null,
    relationLabel: "شريك وساطة",
    notes: "يريد نسخة خاصة قابلة للمشاركة عبر واتساب.",
    badges: ["vip"],
  },
];

export function getDemoCrmClient(clientId: string) {
  return demoCrmClients.find((client) => client.id === clientId) ?? null;
}

export const demoNotifications: NotificationSummary[] = [
  {
    id: "notification-1",
    type: "message",
    title: "رسالة جديدة من فريق العروض",
    summary: "تمت إضافة ملاحظات جديدة على عرض برج الأعمال.",
    href: "/ws/inbox?conversationId=conversation-2",
    source: "العروض",
    severity: "info",
    entityType: "conversation",
    entityId: "conversation-2",
    metadata: { conversationId: "conversation-2" },
    isRead: false,
    createdAt: now - 1000 * 60 * 30,
    pushedAt: null,
    pushStatus: "skipped",
  },
  {
    id: "notification-2",
    type: "offer_sent",
    title: "تم نشر عرض جديد",
    summary: "عرض مالقا ريزيدنس أصبح مرئياً لشبكة الوسطاء.",
    href: "/ws/offers/offer-1",
    source: "المشاريع",
    severity: "success",
    entityType: "offer",
    entityId: "offer-1",
    metadata: null,
    isRead: false,
    createdAt: now - 1000 * 60 * 90,
    pushedAt: null,
    pushStatus: "skipped",
  },
  {
    id: "notification-3",
    type: "invite_sent",
    title: "دعوة معلقة",
    summary: "ما زالت دعوة partnerships@brokerhub.sa بانتظار القبول.",
    href: "/ws/settings?tab=members",
    source: "الإعدادات",
    severity: "warning",
    entityType: "invite",
    entityId: "invite-1",
    metadata: null,
    isRead: true,
    createdAt: now - 1000 * 60 * 60 * 6,
    pushedAt: null,
    pushStatus: "skipped",
  },
];

export const demoProfile: ProfileSummary = {
  email: demoSessionUser.email ?? undefined,
  name: demoSessionUser.name ?? undefined,
  username: demoSessionUser.username ?? undefined,
  role: "developer",
  showInOffersDirectory: true,
  isActive: true,
  authProvider: {
    id: "google",
    passwordManaged: false,
  },
};

export const demoApiKeys: OrganizationApiKeySummary[] = [
  {
    id: "api-key-1",
    keyId: "key_anan_demo_01",
    prefix: "anan_demo",
    name: "Demo Workspace Key",
    permissions: [{ resource: "properties", action: "read" }],
    status: "active",
    createdBy: demoSessionUser.id,
    createdByName: demoSessionUser.name ?? "Demo Owner",
    createdAt: now - 1000 * 60 * 60 * 24 * 14,
    lastUsedAt: now - 1000 * 60 * 60 * 5,
  },
];

export const demoAuthorizedApps: OAuthAuthorizedAppSummary[] = [
  {
    authorizationId: "authz-1",
    clientId: "client-demo-1",
    tenantOrgId: "org-demo",
    appName: "Partner Portal",
    publisherName: "Demo Partner",
    grantedScopes: ["properties:read", "offers:read"],
    scopeDetails: [
      { id: "properties:read", label: "Read projects" },
      { id: "offers:read", label: "Read offers" },
    ],
    offlineAccess: false,
    createdAt: now - 1000 * 60 * 60 * 24 * 40,
    updatedAt: now - 1000 * 60 * 60 * 24 * 2,
    lastUsedAt: now - 1000 * 60 * 60 * 7,
  },
];

export function getDemoOrganizationProfile(type: "broker" | "developer", slug: string): OrganizationPublicProfile {
  return {
    id: `${type}-${slug}`,
    name: type === "broker" ? "Broker Hub Riyadh" : "Nawy Demo Development",
    slug,
    logo: null,
    description:
      type === "broker"
        ? "شبكة وساطة تركز على ربط المطورين بالعملاء المؤهلين داخل الرياض."
        : "جهة تطوير تعرض وحداتها وملفاتها البيعية بصيغة منظمة ومهيأة للمشاركة.",
    website: "https://demo.zane-ai.sa",
    contactEmail: type === "broker" ? "partners@brokerhub.sa" : "hello@zane-ai.sa",
    offers: demoOffers.map((offer) => ({
      id: offer.id,
      price: offer.price,
      status: offer.status,
      description: offer.description ?? undefined,
      property: offer.property
        ? {
            id: offer.property.id,
            title: offer.property.title,
            address: offer.property.address,
            location: offer.property.location,
          }
        : null,
    })),
  };
}
