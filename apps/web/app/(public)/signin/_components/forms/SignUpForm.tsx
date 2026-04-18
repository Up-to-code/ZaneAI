"use client";

import { motion } from "framer-motion";
import { staggerItem, AUTH_TEXT_INPUT_CLASS_NAME, AUTH_PRIMARY_BUTTON_CLASS_NAME } from "../AuthConstants";

type SignUpFormProps = {
  fields: {
    name: string;
    email: string;
    password: string;
    organizationName: string;
    organizationType: "broker" | "red";
  };
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  authConfigured: boolean;
  inviteToken?: string | null;
};

export function SignUpForm({
  fields,
  onFieldChange,
  onSubmit,
  pending,
  authConfigured,
  inviteToken,
}: SignUpFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-6">
        <motion.div variants={staggerItem}>
          <input
            type="text"
            required
            value={fields.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className={AUTH_TEXT_INPUT_CLASS_NAME}
            placeholder="Full Name"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <input
            type="email"
            required
            value={fields.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            className={AUTH_TEXT_INPUT_CLASS_NAME}
            placeholder="Email Address"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <input
            type="password"
            required
            value={fields.password}
            onChange={(e) => onFieldChange("password", e.target.value)}
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
                onChange={(e) => onFieldChange("organizationName", e.target.value)}
                className={AUTH_TEXT_INPUT_CLASS_NAME}
                placeholder="Organization Name"
              />
            </motion.div>
            <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onFieldChange("organizationType", "red")}
                className={`relative overflow-hidden border-b-2 px-1 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                  fields.organizationType === "red"
                    ? "border-[var(--zane-ai-deep)] text-[var(--zane-ai-deep)] dark:border-white dark:text-white"
                    : "border-transparent text-opacity-40 hover:text-opacity-100 dark:border-white/10 dark:text-white"
                }`}
              >
                Developer
              </button>
              <button
                type="button"
                onClick={() => onFieldChange("organizationType", "broker")}
                className={`relative overflow-hidden border-b-2 px-1 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                  fields.organizationType === "broker"
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
        <button
          type="submit"
          disabled={!authConfigured || pending}
          className={AUTH_PRIMARY_BUTTON_CLASS_NAME}
        >
          {pending ? "Preparing..." : inviteToken ? "Accept & Join" : "Create Workspace"}
        </button>
      </motion.div>
    </form>
  );
}
