import type { NextConfig } from "next";
import path from "node:path";

function normalizeUrl(value: string | undefined) {
  return value?.trim().replace(/\/+$/, "") ?? "";
}

function getConvexSiteUrlFromDeploymentUrl(value: string | undefined) {
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

const convexUrl = normalizeUrl(process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL);
const convexSiteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? process.env.CONVEX_SITE_URL,
);
const authUrl = normalizeUrl(process.env.NEXT_PUBLIC_AUTH_URL ?? process.env.AUTH_URL);
const resolvedAuthUrl =
  getConvexSiteUrlFromDeploymentUrl(authUrl) ||
  getConvexSiteUrlFromDeploymentUrl(convexSiteUrl) ||
  getConvexSiteUrlFromDeploymentUrl(convexUrl);

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: path.resolve(import.meta.dirname, "../../"),
  turbopack: {
    root: path.resolve(import.meta.dirname, "../.."),
  },
  env: {
    NEXT_PUBLIC_CONVEX_URL: convexUrl,
    NEXT_PUBLIC_AUTH_URL: resolvedAuthUrl,
    NEXT_PUBLIC_UPLOADTHING_ENABLED: process.env.UPLOADTHING_TOKEN?.trim() ? "true" : "false",
  },
};

export default nextConfig;
