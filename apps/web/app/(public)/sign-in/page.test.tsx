import { expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  }),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

import SignInAliasPage from "./page";

it("redirects `/sign-in` requests to `/signin` and preserves search params", async () => {
  await expect(
    SignInAliasPage({
      searchParams: Promise.resolve({
        returnTo: "/ws",
        mode: "signup",
        scope: ["profile", "email"],
      }),
    }),
  ).rejects.toThrow("NEXT_REDIRECT:/signin?returnTo=%2Fws&mode=signup&scope=profile&scope=email");
});
