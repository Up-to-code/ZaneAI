import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, it, vi } from "vitest";

const { getAuthenticatedSession, sanitizeInternalReturnTo } = vi.hoisted(() => ({
  getAuthenticatedSession: vi.fn(),
  sanitizeInternalReturnTo: vi.fn((returnTo?: string | null, fallback = "/ws") => returnTo ?? fallback),
}));

vi.mock("@/lib/serverSession", () => ({
  getAuthenticatedSession,
  sanitizeInternalReturnTo,
}));

vi.mock("./_components/SigninPageView", () => ({
  default: ({
    redirectTo,
    initialMode,
    inviteToken,
    resetToken,
  }: {
    redirectTo: string;
    initialMode?: string;
    inviteToken?: string | null;
    resetToken?: string | null;
  }) => (
    <div>
      <div>SigninPageView</div>
      <div>redirect:{redirectTo}</div>
      <div>mode:{initialMode}</div>
      <div>invite:{inviteToken ?? "none"}</div>
      <div>reset:{resetToken ?? "none"}</div>
    </div>
  ),
}));

import SigninPage from "./page";

beforeEach(() => {
  getAuthenticatedSession.mockReset();
  sanitizeInternalReturnTo.mockClear();
});

it("renders the sign-in screen even when a cookie-backed session hint exists", async () => {
  getAuthenticatedSession.mockResolvedValue({
    token: "session-token",
    user: null,
    role: "broker",
  });

  const element = await SigninPage({
    searchParams: Promise.resolve({ returnTo: "/ws/settings" }),
  });
  const markup = renderToStaticMarkup(element);

  expect(markup).toContain("SigninPageView");
  expect(markup).toContain("redirect:/ws/settings");
  expect(markup).toContain("mode:signin");
  expect(sanitizeInternalReturnTo).toHaveBeenCalledWith("/ws/settings", "/ws");
});

it("renders the sign-in screen when no session exists", async () => {
  getAuthenticatedSession.mockResolvedValue({
    token: null,
    user: null,
    role: null,
  });

  const element = await SigninPage({
    searchParams: Promise.resolve({ returnTo: "/ws" }),
  });
  const markup = renderToStaticMarkup(element);

  expect(markup).toContain("SigninPageView");
  expect(markup).toContain("redirect:/ws");
  expect(markup).toContain("mode:signin");
});

it("renders the sign-in screen when session lookup fails with auth configuration mismatch", async () => {
  getAuthenticatedSession.mockRejectedValue({
    code: "AUTH_CONFIGURATION_ERROR",
    message: "issuer mismatch",
    status: 503,
  });

  const element = await SigninPage({
    searchParams: Promise.resolve({ returnTo: "/ws" }),
  });
  const markup = renderToStaticMarkup(element);

  expect(markup).toContain("SigninPageView");
  expect(markup).toContain("redirect:/ws");
  expect(markup).toContain("mode:signin");
});
