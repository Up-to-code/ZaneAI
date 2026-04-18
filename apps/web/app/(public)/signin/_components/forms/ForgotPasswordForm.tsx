"use client";

import { motion } from "framer-motion";
import { staggerItem, AUTH_TEXT_INPUT_CLASS_NAME, AUTH_PRIMARY_BUTTON_CLASS_NAME } from "../AuthConstants";

type ForgotPasswordFormProps = {
  fields: { forgotEmail: string };
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  authConfigured: boolean;
};

export function ForgotPasswordForm({
  fields,
  onFieldChange,
  onSubmit,
  pending,
  authConfigured,
}: ForgotPasswordFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-6">
        <motion.div variants={staggerItem}>
          <input
            type="email"
            required
            value={fields.forgotEmail}
            onChange={(e) => onFieldChange("forgotEmail", e.target.value)}
            className={AUTH_TEXT_INPUT_CLASS_NAME}
            placeholder="Account Email"
          />
        </motion.div>
      </div>
      <motion.div variants={staggerItem} className="pt-6">
        <button
          type="submit"
          disabled={!authConfigured || pending}
          className={AUTH_PRIMARY_BUTTON_CLASS_NAME}
        >
          {pending ? "Sending..." : "Request Reset"}
        </button>
      </motion.div>
    </form>
  );
}
