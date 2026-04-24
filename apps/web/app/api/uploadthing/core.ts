import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireSessionContext } from "@/server/auth/session";

const f = createUploadthing();

async function requireUploadAuth() {
  const session = await requireSessionContext();
  return {
    userId: session.context.userId,
    organizationId: session.context.organizationId ?? null,
  };
}

function buildUploader(config: Parameters<typeof f>[0]) {
  return f(config)
    .middleware(requireUploadAuth)
    .onUploadComplete(async ({ file, metadata }) => ({
      key: file.key,
      url: file.ufsUrl,
      name: file.name,
      size: file.size,
      mime: file.type || undefined,
      uploadedByUserId: metadata.userId,
      organizationId: metadata.organizationId,
    }));
}

export const uploadRouter = {
  crmDocuments: buildUploader({
    image: { maxFileSize: "8MB", maxFileCount: 8 },
    pdf: { maxFileSize: "16MB", maxFileCount: 8 },
    text: { maxFileSize: "4MB", maxFileCount: 8 },
  }),
  offerAttachments: buildUploader({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
    pdf: { maxFileSize: "16MB", maxFileCount: 10 },
  }),
  propertyMedia: buildUploader({
    image: { maxFileSize: "8MB", maxFileCount: 12 },
  }),
  verificationDocuments: buildUploader({
    image: { maxFileSize: "8MB", maxFileCount: 12 },
    pdf: { maxFileSize: "16MB", maxFileCount: 12 },
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
