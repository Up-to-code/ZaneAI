import Constants, { ExecutionEnvironment } from "expo-constants";

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type ExpoExtra = {
  convexUrl?: string;
  authUrl?: string;
};

function getExpoExtra() {
  return (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
}

export function getConvexUrl() {
  return process.env.EXPO_PUBLIC_CONVEX_URL ?? getExpoExtra().convexUrl ?? "";
}

export function getAuthUrl() {
  return process.env.EXPO_PUBLIC_AUTH_URL ?? getExpoExtra().authUrl ?? getConvexUrl();
}
