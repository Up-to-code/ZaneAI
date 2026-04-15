import { redirect } from "next/navigation";
import { getAuthenticatedSession, sanitizeInternalReturnTo } from "@/lib/serverSession";

export type SigninSearchParams = {
  returnTo?: string;
  mode?: string;
  invite?: string;
  token?: string;
};

export type SigninPageState = {
  redirectTo: string;
  mode: "signin" | "signup" | "forgot" | "reset";
  inviteToken: string | null;
  resetToken: string | null;
};

export async function loadSigninPageState(searchParams: Promise<SigninSearchParams>): Promise<SigninPageState> {
  const session = await getAuthenticatedSession();
  const { returnTo, mode, invite, token } = await searchParams;

  const redirectTo = sanitizeInternalReturnTo(returnTo, "/ws");

  if (session.token && !token) {
    redirect(redirectTo);
  }
  const resolvedMode =
    mode === "signup" || mode === "forgot" || mode === "reset"
      ? mode
      : "signin";

  return {
    redirectTo: sanitizeInternalReturnTo(returnTo, "/ws"),
    mode: resolvedMode,
    inviteToken: typeof invite === "string" && invite.trim().length > 0 ? invite : null,
    resetToken: typeof token === "string" && token.trim().length > 0 ? token : null,
  };
}
