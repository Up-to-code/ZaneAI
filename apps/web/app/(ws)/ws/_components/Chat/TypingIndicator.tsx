"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { AIMotionLogo, type AIMotionState } from "../AIMotion";
import { cn } from "@/lib/i18n";
import {
  WorkspaceAssistantBadgeRow,
  getWorkspaceAssistantBadges,
  resolveAssistantDirection,
} from "./WorkspaceAssistantBadges";

/**
 * WHY:   Assistant typing needs a branded presence instead of generic dots or placeholder icons.
 * WHAT:  Renders the Zane-ai AI motion avatar with animated typing dots and an optional stage label.
 * HOW:   Uses the compact logo variant, three bouncing dots, and a soft muted label below.
 */
const TypingIndicatorComponent = function TypingIndicator({
  state,
  text,
  activeTeamId,
  activeAgentName,
}: {
  state: AIMotionState;
  text: string;
  activeTeamId?: string | null;
  activeAgentName?: string | null;
}) {
  const direction = resolveAssistantDirection(text);
  const badges = getWorkspaceAssistantBadges({
    content: text,
    fallbackTeamId: activeTeamId,
    fallbackAgentName: activeAgentName,
  });

  return (
    <div
      className={cn("flex min-w-0 shrink-0 items-start gap-3 md:gap-4 bg-transparent px-0 py-2")}
      dir={direction}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        data-slot="ai-avatar"
        className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-[20px] md:rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <AIMotionLogo state={state} size="compact" />
      </div>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-2 pt-0.5", direction === "rtl" ? "items-end" : "items-start")}>
        <div className="flex flex-col gap-2">
          <WorkspaceAssistantBadgeRow badges={badges} dir={direction} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 pt-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-[var(--workspace-highlight)]"
                  animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </div>
        {text ? (
          <span className="text-[14px] font-medium leading-relaxed text-slate-800 dark:text-slate-100" style={{ unicodeBidi: "plaintext" }}>
            {text}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default memo(TypingIndicatorComponent);
