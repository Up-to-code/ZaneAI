"use client";

import { motion } from "framer-motion";
import { staggerItem, AUTH_TEXT_INPUT_CLASS_NAME, AUTH_PRIMARY_BUTTON_CLASS_NAME } from "../AuthConstants";

type ResetPasswordFormProps = {
  fields: { newPassword: string };
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  authConfigured: boolean;
  resetToken?: string | null;
};

export function ResetPasswordForm({
  fields,
  onFieldChange,
  onSubmit,
  pending,
  authConfigured,
  resetToken,
}: ResetPasswordFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-6">
        <motion.div variants={staggerItem}>
          <input
            type="password"
            required
            value={fields.newPassword}
            onChange={(e) => onFieldChange("newPassword", e.target.value)}
            className={AUTH_TEXT_INPUT_CLASS_NAME}
            placeholder="New Password"
          />
        </motion.div>
      </div>
      <motion.div variants={staggerItem} className="pt-6">
        <button
          type="submit"
          disabled={!authConfigured || pending || !resetToken}
          className={AUTH_PRIMARY_BUTTON_CLASS_NAME}
        >
          {pending ? "Saving..." : "Update Password"}
        </button>
      </motion.div>
    </form>
  );
}
