import { type ReactNode } from "react";

type GenerativeUIAdapterProps = {
  fallback?: ReactNode;
};

// Adapter seam for react-native-gen-ui.
// Disabled by default until runtime compatibility is confirmed against current Expo/RN versions.
export function GenerativeUIAdapter({ fallback = null }: GenerativeUIAdapterProps) {
  return fallback;
}

export const isGenerativeUIEnabled = false;
