import type { Doc, Id } from "../_generated/dataModel";

export type WorkspaceAudience = "developer" | "broker";

export function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export function slugifyOrganizationName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "workspace";
}

export function getAudienceFromOrganizationType(type: "broker" | "red"): WorkspaceAudience {
  return type === "red" ? "developer" : "broker";
}

export function getVisibleZoneKeys() {
  return ["overview", "projects", "crm", "offers", "inbox", "settings"] as const;
}

export function buildStarterProperties(args: {
  organizationId: Id<"organizations">;
  createdByProfileId: Id<"profiles">;
  organizationName: string;
  organizationType: "broker" | "red";
  now: number;
}) {
  const common = {
    organizationId: args.organizationId,
    createdByProfileId: args.createdByProfileId,
    accessMode: "owner" as const,
    canEdit: true,
    assets: [],
    brokers: [],
    visibility: {
      clientVisibility: "private" as const,
      viewers: [],
    },
    createdAt: args.now,
    updatedAt: args.now,
  };

  if (args.organizationType === "red") {
    return [
      {
        ...common,
        title: "Palm Horizon Residences",
        location: "New Cairo, Cairo",
        priceLabel: "EGP 12,400,000",
        summary: "A calm family-first release with landscaped courts, club access, and flexible finishing packages prepared for partner distribution.",
        shortDescription: "Launch-ready family residential release in New Cairo.",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          {
            key: "starter-palm-cover",
            url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
            name: "palm-horizon-cover.jpg",
          },
        ],
        gallery: {
          coverImageKey: "starter-palm-cover",
          displayMode: "cover" as const,
          aspectRatio: "landscape" as const,
        },
        amenities: ["Clubhouse", "Kids park", "Fitness studio"],
        parking: {
          hasParking: true,
          spaces: 2,
          label: "2 covered spaces",
        },
        permit: {
          statusLabel: "Verified",
          privateSummary: "Internal launch dossier attached for partner conversations only.",
          privateFiles: [],
          visibility: "conversation_only" as const,
          canShowPrivatePanel: true,
        },
        specs: {
          rooms: "4 bedrooms",
          baths: "4 bathrooms",
          area: "285 sqm",
          status: "Launch ready",
        },
        publicationState: "draft" as const,
        units: [
          {
            id: "starter-palm-a1",
            label: "Type A1",
            bedrooms: 4,
            bathrooms: 4,
            area: "285 sqm",
            priceLabel: "EGP 12,400,000",
          },
        ],
      },
      {
        ...common,
        title: "Cove Executive Tower",
        location: "Sheikh Zayed, Giza",
        priceLabel: "EGP 18,900,000",
        summary: "Mixed-use executive inventory packaged for developer-broker coordination, with clear launch visibility and unit-level storytelling.",
        shortDescription: "Mixed-use executive inventory for launch distribution.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          {
            key: "starter-cove-cover",
            url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
            name: "cove-executive-cover.jpg",
          },
        ],
        gallery: {
          coverImageKey: "starter-cove-cover",
          displayMode: "cover" as const,
          aspectRatio: "portrait" as const,
        },
        amenities: ["Business lounge", "Sky terrace", "Valet"],
        parking: {
          hasParking: true,
          spaces: 3,
          label: "3 valet-supported spaces",
        },
        permit: {
          statusLabel: "Pending review",
          privateSummary: null,
          privateFiles: [],
          visibility: "hidden" as const,
          canShowPrivatePanel: false,
        },
        specs: {
          rooms: "Offices + serviced suites",
          baths: "Private cores",
          area: "410 sqm",
          status: "Reviewing publish pack",
        },
        publicationState: "published" as const,
        publishedAt: args.now,
        units: [],
      },
    ];
  }

  return [
    {
      ...common,
      title: "North Coast Beach House",
      location: "Ras El Hekma, North Coast",
      priceLabel: "EGP 9,850,000",
      summary: "A broker-curated coastal listing set prepared for partner sharing, shortlist curation, and offer follow-through.",
      shortDescription: "Broker-ready coastal listing set with partner sharing.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        {
          key: "starter-coast-cover",
          url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
          name: "north-coast-cover.jpg",
        },
      ],
      gallery: {
        coverImageKey: "starter-coast-cover",
        displayMode: "cover" as const,
        aspectRatio: "landscape" as const,
      },
      amenities: ["Sea view", "Private beach access", "Concierge"],
      parking: {
        hasParking: true,
        spaces: 1,
        label: "1 reserved space",
      },
      permit: {
        statusLabel: "Shared by owner",
        privateSummary: "Broker pack can be shared in direct conversations.",
        privateFiles: [],
        visibility: "conversation_only" as const,
        canShowPrivatePanel: true,
      },
      specs: {
        rooms: "3 bedrooms",
        baths: "3 bathrooms",
        area: "190 sqm",
        status: "Broker active",
      },
      publicationState: "published" as const,
      publishedAt: args.now,
      units: [],
    },
  ];
}

export function mapWorkspacePropertyDocToProject(doc: Doc<"workspaceProperties">) {
  return {
    id: doc._id,
    title: doc.title,
    location: doc.location,
    priceLabel: doc.priceLabel,
    summary: doc.summary,
    shortDescription: doc.shortDescription,
    image: doc.image,
    galleryImages: doc.galleryImages,
    gallery: {
      coverImageKey: doc.gallery.coverImageKey ?? null,
      displayMode: doc.gallery.displayMode,
      aspectRatio: doc.gallery.aspectRatio,
    },
    amenities: doc.amenities,
    parking: {
      hasParking: doc.parking.hasParking,
      spaces: doc.parking.spaces ?? null,
      label: doc.parking.label,
    },
    permit: {
      statusLabel: doc.permit.statusLabel,
      privateSummary: doc.permit.privateSummary ?? null,
      privateFiles: doc.permit.privateFiles,
      visibility: doc.permit.visibility,
      canShowPrivatePanel: doc.permit.canShowPrivatePanel,
    },
    specs: doc.specs,
    publicationState: doc.publicationState,
    accessMode: doc.accessMode,
    canEdit: doc.canEdit,
    visibility: doc.visibility,
    assets: doc.assets,
    units: doc.units,
    brokers: doc.brokers.map((broker) => ({
      id: broker.id,
      name: broker.name,
      avatarLabel: broker.name.slice(0, 2).toUpperCase(),
      avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      state: "idle" as const,
      title: broker.title,
      clientName: broker.clientName ?? null,
      summary: broker.summary,
    })),
  };
}
