"use client";

import { motion } from "framer-motion";
import { staggerItem, AUTH_TEXT_INPUT_CLASS_NAME, AUTH_PRIMARY_BUTTON_CLASS_NAME } from "../AuthConstants";

type SignInFormProps = {
  fields: { email: string; password: string };
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  authConfigured: boolean;
};

export function SignInForm({
  fields,
  onFieldChange,
  onSubmit,
  pending,
  authConfigured,
}: SignInFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-6">
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
            placeholder="Password"
          />
        </motion.div>
      </div>
      <motion.div variants={staggerItem} className="pt-6">
        <button
          type="submit"
          disabled={!authConfigured || pending}
          className={AUTH_PRIMARY_BUTTON_CLASS_NAME}
        >
          {pending ? "Authenticating..." : "Continue"}
        </button>
      </motion.div>
    </form>
  );
}
