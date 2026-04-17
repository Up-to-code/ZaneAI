import type { Doc, Id } from "../_generated/dataModel";
import { slugify } from "../core/lib";

export type WorkspaceAudience = "developer" | "broker";

export function getAudienceFromOrganizationType(type: Doc<"organizations">["type"]): WorkspaceAudience {
  return type === "developer" ? "developer" : "broker";
}

export function getVisibleZoneKeys() {
  return ["overview", "projects", "crm", "offers", "inbox", "settings"] as const;
}

export function slugifyOrganizationName(name: string) {
  return slugify(name, "workspace");
}

export function slugifyProjectTitle(title: string) {
  return slugify(title, "project");
}

export type UploadedFileReference = {
  key: string;
  url: string;
  name: string;
  size?: number;
  mime?: string;
};

export function toPriceLabel(rawPrice: string) {
  const parsed = Number(rawPrice.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return rawPrice.trim();
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(parsed);
}

export function parseOptionalNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function buildSearchText(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ").trim().toLowerCase();
}

export function mapProjectDocToWorkspaceProject(
  project: Doc<"projects">,
  assets: Doc<"realEstateAssets">[],
  unitSummaries: Array<{
    id: string;
    label: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: string;
    priceLabel?: string;
  }> = [],
) {
  const publicImages = assets.filter((asset) => asset.kind === "image" && asset.url);
  const privatePermitFiles = assets.filter((asset) => asset.kind === "permit" && asset.url);
  const cover = publicImages[0];
  const fallbackUrl = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80";
  const galleryImages = publicImages.map((asset) => ({
    key: asset.key ?? asset._id,
    url: asset.url ?? fallbackUrl,
    name: asset.name,
    size: asset.size,
    mime: asset.mime,
  }));

  return {
    id: project._id,
    title: project.title,
    location: project.location,
    priceLabel: project.priceLabel ?? project.startingPrice ?? "Price on request",
    summary: project.description,
    shortDescription: project.shortDescription ?? project.description,
    image: cover?.url ?? fallbackUrl,
    galleryImages: galleryImages.length
      ? galleryImages
      : [{ key: "project-fallback", url: fallbackUrl, name: "project-fallback.jpg" }],
    gallery: {
      coverImageKey: cover?.key ?? cover?._id ?? "project-fallback",
      displayMode: "cover" as const,
      aspectRatio: "landscape" as const,
    },
    amenities: [],
    parking: {
      hasParking: false,
      spaces: null,
      label: "Not specified",
    },
    permit: {
      statusLabel: project.publicationState === "published" ? "Published" : "Draft",
      privateSummary: null,
      privateFiles: privatePermitFiles.map((asset) => ({
        key: asset.key ?? asset._id,
        url: asset.url ?? "",
        name: asset.name,
        size: asset.size,
        mime: asset.mime,
      })),
      visibility: privatePermitFiles.length > 0 ? ("conversation_only" as const) : ("hidden" as const),
      canShowPrivatePanel: privatePermitFiles.length > 0,
    },
    specs: {
      rooms: project.expectedUnits ? `${project.expectedUnits} units` : "Project",
      baths: "Multiple",
      area: "By unit",
      status: project.status,
    },
    expectedUnits: project.expectedUnits,
    projectType: project.projectType,
    installmentYears: project.installmentYears,
    publicationState:
      project.publicationState === "published" || project.publicationState === "archived"
        ? project.publicationState
        : ("draft" as const),
    accessMode: "owner" as const,
    canEdit: true,
    visibility: {
      clientVisibility: project.publicationState === "published" ? ("public" as const) : ("private" as const),
      viewers: [],
    },
    assets: [],
    units: unitSummaries,
    brokers: [],
  };
}

export function starterProjectSeed(args: {
  organizationId: Id<"organizations">;
  createdByProfileId: Id<"profiles">;
  organizationType: Doc<"organizations">["type"];
  now: number;
}) {
  const title = args.organizationType === "developer" ? "Palm Horizon Residences" : "North Coast Beach House";
  return {
    organizationId: args.organizationId,
    createdByProfileId: args.createdByProfileId,
    title,
    slug: slugifyProjectTitle(title),
    projectType: args.organizationType === "developer" ? ("apartments" as const) : ("standalone" as const),
    location: args.organizationType === "developer" ? "New Cairo, Cairo" : "Ras El Hekma, North Coast",
    description:
      args.organizationType === "developer"
        ? "Launch-ready residential inventory prepared for Zane-ai buyer discovery and workspace coordination."
        : "Broker-ready coastal listing prepared for Zane-ai buyer discovery and handoff.",
    shortDescription: "Starter draft for your Zane-ai workspace.",
    priceLabel: args.organizationType === "developer" ? "EGP 12,400,000" : "EGP 9,850,000",
    status: "draft" as const,
    publicationState: "draft" as const,
    createdAt: args.now,
    updatedAt: args.now,
  };
}
