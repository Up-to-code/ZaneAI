/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import type { AppLocale } from "@/lib/i18n";
import { getWebDictionary } from "@/lib/i18n";
import { isWebAuthConfigured } from "@/lib/auth/runtime";
import { authClient, useSession, signIn, signUp } from "@/lib/auth/webAuthClient";
import { motion, AnimatePresence } from "framer-motion";

// Modular Components
import { staggerContainer, staggerItem } from "./AuthConstants";
import { AuthPill } from "./AuthPill";
import { AuthBrandHeader } from "./AuthBrandHeader";
import { AuthStatusView } from "./AuthStatusView";
import { SignInForm } from "./forms/SignInForm";
import { SignUpForm } from "./forms/SignUpForm";
import { ForgotPasswordForm } from "./forms/ForgotPasswordForm";
import { ResetPasswordForm } from "./forms/ResetPasswordForm";

type SigninPageViewProps = {
  redirectTo: string;
  initialMode?: "signin" | "signup" | "forgot" | "reset";
  inviteToken?: string | null;
  resetToken?: string | null;
  locale?: AppLocale;
};

type AuthMode = "signin" | "signup" | "forgot" | "reset";

export default function SigninPageView({
  redirectTo,
  initialMode = "signin",
  inviteToken = null,
  resetToken = null,
  locale = "ar",
}: SigninPageViewProps) {
  const router = useRouter();
  const dictionary = getWebDictionary(locale);
  const invitePreview = useQuery(
    api.partnerWorkspace.getInvitePreview,
    inviteToken ? { token: inviteToken } : "skip"
  );
  const createOrganization = useMutation(api.partnerWorkspace.createOrganization);
  const acceptInvite = useMutation(api.partnerWorkspace.acceptInvite);
  const session = useSession();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    organizationType: "red" as "broker" | "red",
    forgotEmail: "",
    newPassword: "",
  });
  const authConfigured = isWebAuthConfigured();

  useEffect(() => {
    if (session.data?.session && !pending) {
      router.replace(redirectTo);
      router.refresh();
    }
  }, [session.data?.session, router, redirectTo, pending]);

  const handleFieldChange = (field: string, value: string) => {
    setFields((curr) => ({ ...curr, [field]: value }));
  };

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await signIn.email({
        email: fields.email.trim(),
        password: fields.password,
      });
      if (result?.error) throw new Error(result.error.message ?? "Unable to sign in.");

      if (inviteToken) {
        await acceptInvite({ token: inviteToken });
      }

      setPending(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
      setPending(false);
    }
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await signUp.email({
        name: fields.name.trim(),
        email: fields.email.trim(),
        password: fields.password,
      });
      if (result?.error) throw new Error(result.error.message ?? "Unable to create account.");
      setMessage(locale === "ar" ? "جارٍ تجهيز مساحة العمل الخاصة بك..." : "Preparing your workspace...");

      if (inviteToken) {
        await acceptInvite({ token: inviteToken });
      } else if (fields.organizationName.trim()) {
        await createOrganization({
          name: fields.organizationName.trim(),
          type: fields.organizationType,
        });
      }
      setPending(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to complete workspace setup.");
      setPending(false);
    }
  }

  async function handleForgotPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.requestPasswordReset({
        email: fields.forgotEmail.trim(),
        redirectTo: `${window.location.origin}/signin?mode=reset`,
      });
      setMessage(
        locale === "ar"
          ? "إذا كان البريد معروفاً فسيتم إرسال رابط إعادة التعيين."
          : "If the email exists, a reset link will be sent."
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to request password reset.");
    } finally {
      setPending(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.resetPassword({
        token: resetToken as string,
        newPassword: fields.newPassword,
      });
      setMessage(locale === "ar" ? "تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن." : "Password updated.");
      setMode("signin");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to reset password.");
    } finally {
      setPending(false);
    }
  }

  if (session.isPending || session.data?.session) {
    return <AuthStatusView isRedirecting={!!session.data?.session} />;
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--zane-ai-background)] px-6 py-12 dark:bg-black lg:flex-row lg:px-24">
      <AuthBrandHeader />

      {/* Auth Interaction Canvas */}
      <div className="flex w-full flex-col justify-center lg:w-1/2 lg:pl-20 border-l border-border/10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto w-full max-w-[440px] space-y-16"
        >
          {/* Top minimal toggle area */}
          <div className="flex items-center justify-center space-x-6">
            <AuthPill active={mode === "signin"} onClick={() => setMode("signin")}>
              Sign In
            </AuthPill>
            <AuthPill active={mode === "signup"} onClick={() => setMode("signup")}>
              Register
            </AuthPill>
            <AuthPill active={mode === "forgot"} onClick={() => setMode("forgot")}>
              Reset
            </AuthPill>
          </div>

          <motion.div layout className="min-h-[380px]">
            <AnimatePresence mode="wait">
              {invitePreview && (
                <motion.div
                  key="invite"
                  variants={staggerItem}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="mb-8 border-l-2 border-[var(--zane-ai-deep)] pl-5 dark:border-white"
                >
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                    Invite
                  </div>
                  <div className="text-xl font-black">{invitePreview.organizationName}</div>
                  <div className="mt-1 text-sm tracking-wide opacity-80">
                    Accept as <span className="font-bold">{invitePreview.role}</span>
                  </div>
                </motion.div>
              )}

              {!authConfigured && (
                <motion.div
                  key="no-auth"
                  variants={staggerItem}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="mb-8 text-center text-xs tracking-widest text-amber-600 dark:text-amber-400"
                >
                  Auth not configured
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  variants={staggerItem}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="mb-8 text-center text-xs tracking-widest text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div
                  key="msg"
                  variants={staggerItem}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="mb-8 text-center text-xs tracking-widest text-green-600 dark:text-green-400"
                >
                  {message}
                </motion.div>
              )}

              <motion.div
                key={mode}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {mode === "signin" && (
                  <SignInForm
                    fields={fields}
                    onFieldChange={handleFieldChange}
                    onSubmit={handleSignIn}
                    pending={pending}
                    authConfigured={authConfigured}
                  />
                )}

                {mode === "signup" && (
                  <SignUpForm
                    fields={fields}
                    onFieldChange={handleFieldChange}
                    onSubmit={handleSignUp}
                    pending={pending}
                    authConfigured={authConfigured}
                    inviteToken={inviteToken}
                  />
                )}

                {mode === "forgot" && (
                  <ForgotPasswordForm
                    fields={fields}
                    onFieldChange={handleFieldChange}
                    onSubmit={handleForgotPassword}
                    pending={pending}
                    authConfigured={authConfigured}
                  />
                )}

                {mode === "reset" && (
                  <ResetPasswordForm
                    fields={fields}
                    onFieldChange={handleFieldChange}
                    onSubmit={handleResetPassword}
                    pending={pending}
                    authConfigured={authConfigured}
                    resetToken={resetToken}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-center text-[10px] uppercase tracking-[0.2em] leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-[var(--zane-ai-text-secondary)] opacity-50"
          >
            {dictionary.signin.agreementPrefix}{" "}
            <Link
              href="/terms"
              className="font-bold underline-offset-8 hover:opacity-100 hover:underline"
            >
              {dictionary.signin.agreementTerms}
            </Link>{" "}
            {dictionary.signin.agreementAnd}{" "}
            <Link
              href="/policy"
              className="font-bold underline-offset-8 hover:opacity-100 hover:underline"
            >
              {dictionary.signin.agreementPrivacy}
            </Link>
            .
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
