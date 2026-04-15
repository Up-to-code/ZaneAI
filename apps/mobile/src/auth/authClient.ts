import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";

import { getAuthUrl, getConvexUrl } from "@/runtime/expoRuntime";

const COOKIE_KEY = "better-auth_cookie";
const SESSION_KEY = "better-auth_session_data";
export const FALLBACK_CONVEX_URL = "https://placeholder.convex.invalid";

type SyncStorage = {
  hydrate: () => Promise<void>;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

function createSyncStorage(): SyncStorage {
  let cache: Record<string, string> = {};

  return {
    hydrate: async () => {
      const entries = await AsyncStorage.multiGet([COOKIE_KEY, SESSION_KEY]);
      cache = Object.fromEntries(entries.filter((entry): entry is [string, string] => entry[1] !== null));
    },
    getItem: (key) => cache[key] ?? null,
    setItem: (key, value) => {
      cache[key] = value;
      void AsyncStorage.setItem(key, value);
    },
  };
}

export const betterAuthStorage = createSyncStorage();

export function getAuthBaseUrl() {
  return getAuthUrl() || FALLBACK_CONVEX_URL;
}

export function isAuthConfigured() {
  return Boolean(getConvexUrl() && getAuthBaseUrl());
}

export const authClient: any = createAuthClient({
  baseURL: getAuthBaseUrl(),
  plugins: [
    anonymousClient(),
    crossDomainClient({
      storage: betterAuthStorage,
    }),
    convexClient(),
  ],
} as any);

export async function signInAnonymously() {
  const result = await authClient.$fetch("/sign-in/anonymous", {
    method: "POST",
  });
  await authClient.getSession();
  return result;
}

export async function deleteAnonymousAccount() {
  const result = await authClient.$fetch("/delete-anonymous-user", {
    method: "POST",
  });
  await authClient.getSession();
  return result;
}
