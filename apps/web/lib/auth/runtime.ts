export const FALLBACK_CONVEX_URL = "https://placeholder.convex.invalid";

function normalizeUrl(value: string | undefined) {
  return value?.trim().replace(/\/+$/, "") ?? "";
}

export function getConvexSiteUrlFromDeploymentUrl(value: string | undefined) {
  const url = normalizeUrl(value);
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(".convex.cloud")) {
      return url;
    }

    parsed.hostname = parsed.hostname.replace(/\.convex\.cloud$/, ".convex.site");
    parsed.pathname = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return url.replace(/\.convex\.cloud\/?$/, ".convex.site");
  }
}

export function getWebConvexUrl() {
  return normalizeUrl(process.env.NEXT_PUBLIC_CONVEX_URL);
}

export function getWebAuthUrl() {
  const explicitAuthUrl = normalizeUrl(process.env.NEXT_PUBLIC_AUTH_URL);
  if (explicitAuthUrl) {
    return getConvexSiteUrlFromDeploymentUrl(explicitAuthUrl);
  }

  return (
    normalizeUrl(process.env.NEXT_PUBLIC_CONVEX_SITE_URL) ||
    getConvexSiteUrlFromDeploymentUrl(getWebConvexUrl())
  );
}

export function isWebAuthConfigured() {
  return Boolean(getWebConvexUrl() && getWebAuthUrl());
}
