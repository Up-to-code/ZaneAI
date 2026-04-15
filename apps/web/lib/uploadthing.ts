"use client";

import type { UploadedFileReference } from "@/server/contracts/files";

type DemoUploadEndpoint =
  | "crmDocuments"
  | "offerAttachments"
  | "propertyMedia"
  | "verificationDocuments";

const uploadthingDisabledMessage =
  "Uploads are not configured. Set UPLOADTHING_TOKEN in apps/web/.env.local and restart the web app.";
const uploadthingEnabled = process.env.NEXT_PUBLIC_UPLOADTHING_ENABLED === "true";

type DemoUploadedFile = {
  key: string;
  name: string;
  url: string;
  appUrl: string;
  size: number;
  type: string;
  serverData: UploadedFileReference;
};

function buildDemoUploadedFiles(files: File[]): DemoUploadedFile[] {
  return files.map((file, index) => {
    const key = `demo-upload-${Date.now()}-${index}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
    const url = URL.createObjectURL(file);

    return {
      key,
      name: file.name,
      url,
      appUrl: url,
      size: file.size,
      type: file.type,
      serverData: {
        key,
        name: file.name,
        url,
        size: file.size,
        mime: file.type || undefined,
      },
    };
  });
}

/**
 * WHY:   Client forms still need one upload hook interface in the static demo.
 * WHAT:  Exposes a demo-safe upload helper with the same surface as the old UploadThing hook.
 * HOW:   Rejects when uploads are disabled and otherwise returns local object URLs without any server route.
 */
export function useUploadThing(_endpoint: DemoUploadEndpoint) {
  if (!uploadthingEnabled) {
    return {
      startUpload: async (_files: File[]) => {
        throw new Error(uploadthingDisabledMessage);
      },
      isUploading: false,
      routeConfig: undefined,
      permittedFileInfo: undefined,
    };
  }

  return {
    startUpload: async (files: File[]) => buildDemoUploadedFiles(files),
    isUploading: false,
    routeConfig: undefined,
    permittedFileInfo: undefined,
  };
}

export { uploadthingEnabled, uploadthingDisabledMessage };
