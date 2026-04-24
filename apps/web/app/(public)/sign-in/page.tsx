import { redirect } from "next/navigation";

type SignInAliasPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function appendSearchParams(
  destination: string,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }
    }
  }

  const query = params.toString();
  return query ? `${destination}?${query}` : destination;
}

/**
 * WHY:   Older auth links and bookmarked URLs still target `/sign-in`.
 * WHAT:  Preserves that entrypoint while keeping `/signin` as the canonical page.
 * HOW:   Replays the incoming search params and redirects immediately.
 */
export default async function SignInAliasPage({ searchParams }: SignInAliasPageProps) {
  redirect(appendSearchParams("/signin", await searchParams));
}
