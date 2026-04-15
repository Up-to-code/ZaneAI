import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ExpoConfig } from "expo/config";

const workspaceRoot = path.resolve(__dirname, "../..");

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(workspaceRoot, ".env.local"));
loadEnvFile(path.join(workspaceRoot, ".env"));

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const authUrl = process.env.EXPO_PUBLIC_AUTH_URL ?? convexUrl;

const config: ExpoConfig = {
  name: "Zane-ai",
  slug: "zayon-mobile",
  scheme: "zayon",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  experiments: {
    typedRoutes: true,
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.zayon.mobile",
  },
  android: {
    package: "com.zayon.mobile",
  },
  plugins: [
    "expo-font",
    "expo-router",
    [
      "expo-speech-recognition",
      {
        microphonePermission: "Allow Zane-ai to use the microphone for voice search and guided prompts.",
        speechRecognitionPermission: "Allow Zane-ai to transcribe your speech into real estate prompts.",
      },
    ],
  ],
  extra: {
    convexUrl,
    authUrl,
    brand: {
      name: "Zane-ai",
      tagline: "The intelligent center of real estate.",
    },
  },
};

export default config;
