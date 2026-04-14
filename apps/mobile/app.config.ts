import path from "path";
import type { ExpoConfig } from "expo/config";
import dotenv from "dotenv";

const workspaceRoot = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(workspaceRoot, ".env.local"), override: false });
dotenv.config({ path: path.join(workspaceRoot, ".env"), override: false });

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
