"use client";

import { useState } from "react";

async function postInboxIntent<TResult>(body: Record<string, unknown>) {
  const conversationId =
    typeof body.conversationId === "string"
      ? body.conversationId
      : typeof body.offerId === "string"
        ? `demo-offer-${body.offerId}`
        : "demo-conversation";

  return {
    ok: true,
    conversationId,
  } as TResult;
}

export function useInboxBusinessActions() {
  const [businessActionError, setBusinessActionError] = useState<string | null>(null);
  const [isBusinessActionPending, setIsBusinessActionPending] = useState(false);

  const clearBusinessActionError = () => {
    setBusinessActionError(null);
  };

  const runBusinessAction = async <TResult>(action: () => Promise<TResult>) => {
    setBusinessActionError(null);
    setIsBusinessActionPending(true);

    try {
      return await action();
    } catch (error) {
      setBusinessActionError(error instanceof Error ? error.message : "تعذر تنفيذ هذا الإجراء الآن.");
      throw error;
    } finally {
      setIsBusinessActionPending(false);
    }
  };

  return {
    businessActionError,
    clearBusinessActionError,
    isBusinessActionPending,
    postInboxIntent,
    runBusinessAction,
  };
}
