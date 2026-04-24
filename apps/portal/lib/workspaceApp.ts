function normalizeUrl(value: string | undefined) {
  return value?.trim().replace(/\/+$/, "") ?? "";
}

export function getWorkspaceAppOrigin() {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_WEB_URL) ||
    normalizeUrl(process.env.ZANEAI_WEB_URL) ||
    normalizeUrl(process.env.WEB_URL) ||
    normalizeUrl(process.env.SITE_URL)
  );
}

export function buildWorkspaceAppUrl(path = "/ws") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const origin = getWorkspaceAppOrigin();

  return origin ? `${origin}${normalizedPath}` : normalizedPath;
}
