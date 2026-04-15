import { beforeEach, expect, it, vi } from "vitest";
import { DomainError } from "@/server/contracts/errors";

const {
  finalizeZaneAiProUploadedFiles,
  getZaneAiProVoiceUploadUrl,
  sendZaneAiProMessage,
  transcribeZaneAiProVoiceFromStorage,
} = vi.hoisted(() => ({
  finalizeZaneAiProUploadedFiles: vi.fn(),
  getZaneAiProVoiceUploadUrl: vi.fn(),
  sendZaneAiProMessage: vi.fn(),
  transcribeZaneAiProVoiceFromStorage: vi.fn(),
}));

vi.mock("@/server/domains/workspace/zaneAiPro/service", () => ({
  finalizeZaneAiProUploadedFiles,
  getZaneAiProVoiceUploadUrl,
  sendZaneAiProMessage,
  transcribeZaneAiProVoiceFromStorage,
}));

import {
  finalizeAssistantUploads,
  getAssistantUploadUrl,
  getVoiceUploadUrl,
  sendAssistantMessage,
  transcribeVoiceFromStorage,
} from "./actions";

beforeEach(() => {
  finalizeZaneAiProUploadedFiles.mockReset();
  getZaneAiProVoiceUploadUrl.mockReset();
  sendZaneAiProMessage.mockReset();
  transcribeZaneAiProVoiceFromStorage.mockReset();
});

it("validates send input and returns stable invalid argument errors", async () => {
  const result = await sendAssistantMessage({
    message: " ",
  });

  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.error.code).toBe("INVALID_ARGUMENT");
  expect(result.error.status).toBe(400);
});

it("sends a valid voice message", async () => {
  sendZaneAiProMessage.mockResolvedValue({
    id: "thread-2",
    title: "Voice",
    messages: [],
  });

  const result = await sendAssistantMessage({
    message: "صباح الخير",
    inputMode: "voice",
    threadId: "thread-2",
  });

  expect(sendZaneAiProMessage).toHaveBeenCalledWith({
    message: "صباح الخير",
    inputMode: "voice",
    threadId: "thread-2",
  });
  expect(result.ok).toBe(true);
});

it("sends attachment-aware assistant messages", async () => {
  sendZaneAiProMessage.mockResolvedValue({
    id: "thread-3",
    title: "Attachments",
    messages: [],
  });

  const result = await sendAssistantMessage({
    message: "",
    inputMode: "attachment",
    attachments: [
      {
        key: "storage-1",
        url: "https://example.com/image.jpg",
        name: "image.jpg",
        mime: "image/jpeg",
        size: 1024,
      },
    ],
  });

  expect(sendZaneAiProMessage).toHaveBeenCalledWith({
    message: "",
    inputMode: "attachment",
    attachments: [
      {
        key: "storage-1",
        url: "https://example.com/image.jpg",
        name: "image.jpg",
        mime: "image/jpeg",
        size: 1024,
      },
    ],
  });
  expect(result.ok).toBe(true);
});

it("returns normalized errors for upload url action", async () => {
  getZaneAiProVoiceUploadUrl.mockRejectedValue(
    new DomainError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      status: 401,
    }),
  );

  const result = await getVoiceUploadUrl();
  expect(result).toEqual({
    ok: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Authentication required",
      status: 401,
    },
  });
});

it("reuses the assistant upload url action for file attachments", async () => {
  getZaneAiProVoiceUploadUrl.mockResolvedValue("https://example.com/upload");
  const result = await getAssistantUploadUrl();
  expect(result).toEqual({
    ok: true,
    data: {
      uploadUrl: "https://example.com/upload",
    },
  });
});

it("validates voice transcription payload", async () => {
  const result = await transcribeVoiceFromStorage({ storageId: "" });
  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.error.code).toBe("INVALID_ARGUMENT");
});

it("finalizes uploaded files into shared attachment references", async () => {
  finalizeZaneAiProUploadedFiles.mockResolvedValue([
    {
      key: "storage_1",
      url: "https://example.com/uploaded.png",
      name: "uploaded.png",
      mime: "image/png",
      size: 2048,
    },
  ]);

  const result = await finalizeAssistantUploads({
    files: [
      {
        storageId: "storage_1",
        name: "uploaded.png",
        mime: "image/png",
        size: 2048,
      },
    ],
  });

  expect(finalizeZaneAiProUploadedFiles).toHaveBeenCalledWith({
    files: [
      {
        storageId: "storage_1",
        name: "uploaded.png",
        mime: "image/png",
        size: 2048,
      },
    ],
  });
  expect(result).toEqual({
    ok: true,
    data: [
      {
        key: "storage_1",
        url: "https://example.com/uploaded.png",
        name: "uploaded.png",
        mime: "image/png",
        size: 2048,
      },
    ],
  });
});
