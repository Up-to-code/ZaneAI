/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import type { AppLocale } from "@/lib/locale";
import { getWebDictionary } from "@/lib/i18n";
import { authClient } from "@/lib/auth/webAuthClient";
import { isWebAuthConfigured } from "@/lib/auth/runtime";
import { TypewriterText } from "./TypewriterText";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

type SigninPageViewProps = {
  redirectTo: string;
  initialMode?: "signin" | "signup" | "forgot" | "reset";
  inviteToken?: string | null;
  resetToken?: string | null;
  locale?: AppLocale;
};

type AuthMode = "signin" | "signup" | "forgot" | "reset";

const AUTH_TEXT_INPUT_CLASS_NAME =
  "w-full border-b border-[var(--zane-ai-line)] bg-transparent px-2 py-4 text-lg tracking-wide text-[var(--zane-ai-deep)] outline-none transition-all placeholder:text-[var(--zane-ai-text-muted)] focus:border-[var(--zane-ai-deep)] dark:border-white/20 dark:text-white dark:focus:border-white opacity-80 focus:opacity-100";
const AUTH_PRIMARY_BUTTON_CLASS_NAME =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--zane-ai-deep)] px-5 py-4 mt-4 text-[13px] tracking-[0.2em] font-black text-white transition-all hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-white dark:text-black uppercase";

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-[var(--zane-ai-deep)] dark:hover:text-white ${active
          ? "text-[var(--zane-ai-deep)] dark:text-white"
          : "text-[var(--zane-ai-text-muted)] dark:text-white/40"
        }`}
    >
      {active && (
        <motion.div
          layoutId="pill-indicator"
          className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--zane-ai-deep)] dark:bg-white"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {children}
    </button>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const staggerItem: any = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -4, filter: "blur(2px)", transition: { duration: 0.3 } },
};

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
  const session = authClient.useSession();
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

  const [hasStartedInteracting, setHasStartedInteracting] = useState(false);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await (authClient as any).signIn.email({
        email: fields.email.trim(),
        password: fields.password,
      });
      if (result?.error) throw new Error(result.error.message ?? "Unable to sign in.");

      if (inviteToken) {
        await acceptInvite({ token: inviteToken });
      }

      setPending(false);
      // Let the useEffect handle the redirect safely once the session is fully hydrated
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
      const result = await (authClient as any).signUp.email({
        name: fields.name.trim(),
        email: fields.email.trim(),
        password: fields.password,
      });
      if (result?.error) throw new Error(result.error.message ?? "Unable to create account.");
      setMessage(locale === "ar" ? "جارٍ تجهيز مساحة العمل الخاصة بك..." : "Preparing your workspace...");

      // Wait 1 second to ensure cross-domain session reaches internal WebSocket before mutation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (inviteToken) {
        await acceptInvite({ token: inviteToken });
      } else if (fields.organizationName.trim()) {
        await createOrganization({
          name: fields.organizationName.trim(),
          type: fields.organizationType,
        });
      }

      setPending(false);
      // Let the useEffect handle the redirect safely once the session is fully hydrated
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
      await (authClient as any).requestPasswordReset({
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
      await (authClient as any).resetPassword({
        token: resetToken,
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
    const statusLabel = session.data?.session ? "Redirecting to workspace…" : "Verifying session…";
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--zane-ai-background)] px-6 py-12 dark:bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-10"
        >
          {/* Pulsing brand wordmark */}
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl font-black uppercase tracking-[0.28em] text-[var(--zane-ai-deep)] dark:text-white select-none"
          >
            Zane-ai
          </motion.span>

          {/* Shimmer bar */}
          <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[var(--zane-ai-deep)] dark:bg-white"
              animate={{ x: ["-100%", "288px"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Status label */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--zane-ai-text-muted)] dark:text-white/40"
          >
            {statusLabel}
          </motion.p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center bg-[var(--zane-ai-background)] px-6 py-12 dark:bg-black lg:flex-row lg:px-24">
      {/* Brand Identity / Typewriter Section */}
      <div className="flex w-full flex-col items-center justify-center pb-12 lg:w-1/2 lg:pb-0 lg:pr-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--zane-ai-deep)] dark:bg-white">
              <Eye className="h-10 w-10 text-white dark:text-black" />
            </div>
            <h1 className="mb-0 text-5xl font-black uppercase tracking-[0.24em] text-[var(--zane-ai-deep)] dark:text-white lg:text-7xl">
              Zane-ai
            </h1>
          </div>
          <TypewriterText
            phrases={[
              "The first unified real estate agent.",
              "Deep market analysis.",
              "Maximize profit and ROI.",
              "Smartest property insights."
            ]}
          />
        </motion.div>
      </div>

      {/* Auth Interaction Canvas */}
      <div className="flex w-full flex-col justify-center lg:w-1/2 lg:pl-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto w-full max-w-[400px] space-y-12"
        >
          {/* Top minimal toggle area */}
          <div className="flex items-center justify-center space-x-6">
            <Pill active={mode === "signin"} onClick={() => { setMode("signin"); setHasStartedInteracting(true); }}>Sign In</Pill>
            <Pill active={mode === "signup"} onClick={() => { setMode("signup"); setHasStartedInteracting(true); }}>Register</Pill>
            <Pill active={mode === "forgot"} onClick={() => { setMode("forgot"); setHasStartedInteracting(true); }}>Reset</Pill>
          </div>

          <motion.div
            layout
            className="min-h-[380px]"
            style={{ filter: !hasStartedInteracting ? "saturate(0.2) opacity(0.5)" : "none", transition: "filter 0.8s ease" }}
            onFocusCapture={() => setHasStartedInteracting(true)}
            onClickCapture={() => setHasStartedInteracting(true)}
          >
            <AnimatePresence mode="wait">
              {invitePreview && (
                <motion.div key="invite" variants={staggerItem} initial="hidden" animate="show" exit="exit" className="mb-8 border-l-2 border-[var(--zane-ai-deep)] pl-5 dark:border-white">
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Invite</div>
                  <div className="text-xl font-black">{invitePreview.organizationName}</div>
                  <div className="mt-1 text-sm tracking-wide opacity-80">
                    Accept as <span className="font-bold">{invitePreview.role}</span>
                  </div>
                </motion.div>
              )}

              {!authConfigured && (
                <motion.div key="no-auth" variants={staggerItem} initial="hidden" animate="show" exit="exit" className="mb-8 text-center text-xs tracking-widest text-amber-600 dark:text-amber-400">
                  Auth not configured
                </motion.div>
              )}

              {error && (
                <motion.div key="error" variants={staggerItem} initial="hidden" animate="show" exit="exit" className="mb-8 text-center text-xs tracking-widest text-red-600 dark:text-red-400">
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div key="msg" variants={staggerItem} initial="hidden" animate="show" exit="exit" className="mb-8 text-center text-xs tracking-widest text-green-600 dark:text-green-400">
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
                  <form className="space-y-6" onSubmit={(e) => void handleSignIn(e)}>
                    <div className="space-y-6">
                      <motion.div variants={staggerItem}>
                        <input
                          type="email"
                          required
                          value={fields.email}
                          onChange={(e) => setFields((curr) => ({ ...curr, email: e.target.value }))}
                          className={AUTH_TEXT_INPUT_CLASS_NAME}
                          placeholder="Email Address"
                        />
                      </motion.div>
                      <motion.div variants={staggerItem}>
                        <input
                          type="password"
                          required
                          value={fields.password}
                          onChange={(e) => setFields((curr) => ({ ...curr, password: e.target.value }))}
                          className={AUTH_TEXT_INPUT_CLASS_NAME}
                          placeholder="Password"
                        />
                      </motion.div>
                    </div>
                    <motion.div variants={staggerItem} className="pt-6">
                      <button type="submit" disabled={!authConfigured || pending} className={AUTH_PRIMARY_BUTTON_CLASS_NAME}>
                        {pending ? "Authenticating..." : "Continue"}
                      </button>
                    </motion.div>
                  </form>
                )}

                {mode === "signup" && (
                  <form className="space-y-6" onSubmit={(e) => void handleSignUp(e)}>
                    <div className="space-y-6">
                      <motion.div variants={staggerItem}>
                        <input
                          type="text"
                          required
                          value={fields.name}
                          onChange={(e) => setFields((curr) => ({ ...curr, name: e.target.value }))}
                          className={AUTH_TEXT_INPUT_CLASS_NAME}
                          placeholder="Full Name"
                        />
                      </motion.div>
                      <motion.div variants={staggerItem}>
                        <input
                          type="email"
                          required
                          value={fields.email}
                          onChange={(e) => setFields((curr) => ({ ...curr, email: e.target.value }))}
                          className={AUTH_TEXT_INPUT_CLASS_NAME}
                          placeholder="Email Address"
                        />
                      </motion.div>
                      <motion.div variants={staggerItem}>
                        <input
                          type="password"
                          required
                          value={fields.password}
                          onChange={(e) => setFields((curr) => ({ ...curr, password: e.target.value }))}
                          className={AUTH_TEXT_INPUT_CLASS_NAME}
                          placeholder="Strong Password"
                        />
                      </motion.div>

                      {!inviteToken && (
                        <div className="space-y-6 pt-2">
                          <motion.div variants={staggerItem}>
                            <input
                              type="text"
                              required
                              value={fields.organizationName}
                              onChange={(e) => setFields((curr) => ({ ...curr, organizationName: e.target.value }))}
                              className={AUTH_TEXT_INPUT_CLASS_NAME}
                              placeholder="Organization Name"
                            />
                          </motion.div>
                          <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => setFields((curr) => ({ ...curr, organizationType: "red" }))}
                              className={`relative overflow-hidden border-b-2 px-1 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all ${fields.organizationType === "red"
                                  ? "border-[var(--zane-ai-deep)] text-[var(--zane-ai-deep)] dark:border-white dark:text-white"
                                  : "border-transparent text-opacity-40 hover:text-opacity-100 dark:border-white/10 dark:text-white"
                                }`}
                            >
                              Developer
                            </button>
                            <button
                              type="button"
                              onClick={() => setFields((curr) => ({ ...curr, organizationType: "broker" }))}
                              className={`relative overflow-hidden border-b-2 px-1 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all ${fields.organizationType === "broker"
                                  ? "border-[var(--zane-ai-deep)] text-[var(--zane-ai-deep)] dark:border-white dark:text-white"
                                  : "border-transparent text-opacity-40 hover:text-opacity-100 dark:border-white/10 dark:text-white"
                                }`}
                            >
                              Broker
                            </button>
                          </motion.div>
                        </div>
                      )}
                    </div>
                    <motion.div variants={staggerItem} className="pt-6">
                      <button type="submit" disabled={!authConfigured || pending} className={AUTH_PRIMARY_BUTTON_CLASS_NAME}>
                        {pending ? "Preparing..." : inviteToken ? "Accept & Join" : "Create Workspace"}
                      </button>
                    </motion.div>
                  </form>
                )}

                {mode === "forgot" && (
                  <form className="space-y-6" onSubmit={(e) => void handleForgotPassword(e)}>
                    <div className="space-y-6">
                      <motion.div variants={staggerItem}>
                        <input
                          type="email"
                          required
                          value={fields.forgotEmail}
                          onChange={(e) => setFields((curr) => ({ ...curr, forgotEmail: e.target.value }))}
                          className={AUTH_TEXT_INPUT_CLASS_NAME}
                          placeholder="Account Email"
                        />
                      </motion.div>
                    </div>
                    <motion.div variants={staggerItem} className="pt-6">
                      <button type="submit" disabled={!authConfigured || pending} className={AUTH_PRIMARY_BUTTON_CLASS_NAME}>
                        {pending ? "Sending..." : "Request Reset"}
                      </button>
                    </motion.div>
                  </form>
                )}

                {mode === "reset" && (
                  <form className="space-y-6" onSubmit={(e) => void handleResetPassword(e)}>
                    <div className="space-y-6">
                      <motion.div variants={staggerItem}>
                        <input
                          type="password"
                          required
                          value={fields.newPassword}
                          onChange={(e) => setFields((curr) => ({ ...curr, newPassword: e.target.value }))}
                          className={AUTH_TEXT_INPUT_CLASS_NAME}
                          placeholder="New Password"
                        />
                      </motion.div>
                    </div>
                    <motion.div variants={staggerItem} className="pt-6">
                      <button type="submit" disabled={!authConfigured || pending || !resetToken} className={AUTH_PRIMARY_BUTTON_CLASS_NAME}>
                        {pending ? "Saving..." : "Update Password"}
                      </button>
                    </motion.div>
                  </form>
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
            <Link href="/terms" className="font-bold underline-offset-8 hover:opacity-100 hover:underline">{dictionary.signin.agreementTerms}</Link>{" "}
            {dictionary.signin.agreementAnd}{" "}
            <Link href="/policy" className="font-bold underline-offset-8 hover:opacity-100 hover:underline">{dictionary.signin.agreementPrivacy}</Link>.
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

