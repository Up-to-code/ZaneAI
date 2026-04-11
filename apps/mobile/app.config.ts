import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Zayon",
  slug: "zayon-mobile",
  scheme: "zayon",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
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
        microphonePermission: "Allow Zayon to use the microphone for voice search and guided prompts.",
        speechRecognitionPermission: "Allow Zayon to transcribe your speech into real estate prompts.",
      },
    ],
  ],
  extra: {
    brand: {
      name: "Zayon",
      tagline: "The intelligent center of real estate.",
    },
  },
};

export default config;
