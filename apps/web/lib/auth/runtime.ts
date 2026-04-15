export const FALLBACK_CONVEX_URL = "https://placeholder.convex.invalid";

export function getWebConvexUrl() {
  return process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
}

export function getWebAuthUrl() {
  return process.env.NEXT_PUBLIC_AUTH_URL ?? getWebConvexUrl();
}

export function isWebAuthConfigured() {
  return Boolean(getWebConvexUrl() && getWebAuthUrl());
}
