"use client";

import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

const uploadthingDisabledMessage =
  "Uploads are not configured. Set NEXT_PUBLIC_UPLOADTHING_ENABLED=true and UPLOADTHING_TOKEN, then restart the web app.";
const uploadthingEnabled = process.env.NEXT_PUBLIC_UPLOADTHING_ENABLED === "true";

const realHelpers = generateReactHelpers<UploadRouter>();

type UploadEndpoint = keyof UploadRouter;

export function useUploadThing(endpoint: UploadEndpoint) {
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

  return realHelpers.useUploadThing(endpoint);
}

export { uploadthingEnabled, uploadthingDisabledMessage };
