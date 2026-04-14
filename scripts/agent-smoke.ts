import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { ConvexHttpClient } from "convex/browser";

import { api } from "../convex/_generated/api";

type EnvMap = Record<string, string>;

type SignInResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

type ConvexTokenResponse = {
  token: string;
};

type MessagePage = {
  page: Array<{
    _id: string;
    _creationTime: number;
    message: {
      role: "user" | "assistant" | string;
      content: unknown;
    };
  }>;
  continueCursor: string;
  isDone: boolean;
};

type RecommendationBatch = {
  runId: string;
  propertyIds: string[];
  rankingRationale: string;
  properties: Array<{ id?: string; externalId?: string }>;
};

const DEFAULT_PROMPT =
  "Compare the available Dubai Marina and Business Bay listings under AED 3.6M and explain the tradeoffs.";
const POLL_INTERVAL_MS = 2_500;
const TIMEOUT_MS = 90_000;

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) continue;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function loadLocalEnv() {
  loadEnvFile(path.resolve(".env.local"));
  loadEnvFile(path.resolve(".env"));
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  return `${localPart.slice(0, 3)}***@${domain}`;
}

function getMessageText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof (part as { text?: unknown }).text === "string") {
          return String((part as { text: string }).text);
        }
        return "";
      })
      .join("")
      .trim();
  }
  return "";
}

async function postJson<T>(url: string, body: Record<string, unknown>, origin: string): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload
      ? String((payload as { message?: unknown }).message)
      : `HTTP ${response.status}`;
    throw new Error(`${url} failed: ${message}`);
  }

  return payload as T;
}

async function getJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload
      ? String((payload as { message?: unknown }).message)
      : `HTTP ${response.status}`;
    throw new Error(`${url} failed: ${message}`);
  }

  return payload as T;
}

async function ensureSessionToken(siteUrl: string, email: string, password: string, name: string) {
  const signUpUrl = `${siteUrl}/api/auth/sign-up/email`;
  const signInUrl = `${siteUrl}/api/auth/sign-in/email`;

  try {
    const signedUp = await postJson<SignInResponse>(signUpUrl, {
      email,
      password,
      name,
    }, siteUrl);
    return signedUp.token;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("already") && !message.toLowerCase().includes("exists")) {
      console.log(`[auth] sign-up did not succeed, falling back to sign-in: ${message}`);
    }
  }

  const signedIn = await postJson<SignInResponse>(signInUrl, {
    email,
    password,
  }, siteUrl);
  return signedIn.token;
}

async function exchangeForConvexJwt(siteUrl: string, sessionToken: string) {
  const payload = await getJson<ConvexTokenResponse>(`${siteUrl}/api/auth/convex/token`, {
    authorization: `Bearer ${sessionToken}`,
    origin: siteUrl,
  });
  return payload.token;
}

async function waitForAssistantReply(client: ConvexHttpClient, threadId: string) {
  const deadline = Date.now() + TIMEOUT_MS;
  let lastAssistantText = "";

  while (Date.now() < deadline) {
    const messages = await client.query(api.agent.public.getThreadMessages.getThreadMessages, {
      threadId,
      paginationOpts: {
        numItems: 50,
        cursor: null,
      },
    }) as MessagePage;

    const ordered = [...messages.page].sort((left, right) => left._creationTime - right._creationTime);
    const assistantMessage = [...ordered].reverse().find((message) => message.message.role === "assistant");
    if (assistantMessage) {
      lastAssistantText = getMessageText(assistantMessage.message.content);
      if (lastAssistantText) {
        return { assistantText: lastAssistantText, messages: ordered };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(`Timed out waiting for assistant reply. Last assistant text: ${lastAssistantText || "none"}`);
}

async function main() {
  loadLocalEnv();

  const convexUrl = requireEnv("CONVEX_URL");
  const convexSiteUrl = requireEnv("CONVEX_SITE_URL");
  const prompt = process.env.AGENT_SMOKE_PROMPT ?? DEFAULT_PROMPT;
  const deploymentSlug = convexUrl.split("//")[1]?.split(".")[0] ?? "unknown";
  const email = process.env.AGENT_SMOKE_EMAIL ?? `agent-smoke+${deploymentSlug}@zayon.dev`;
  const password = process.env.AGENT_SMOKE_PASSWORD ?? `ZayonSmoke!${deploymentSlug}`;
  const name = process.env.AGENT_SMOKE_NAME ?? "Agent Smoke";

  console.log(`[setup] deployment=${deploymentSlug}`);
  console.log(`[setup] test-user=${maskEmail(email)}`);

  const sessionToken = await ensureSessionToken(convexSiteUrl, email, password, name);
  console.log("[auth] session token acquired");
  const convexJwt = await exchangeForConvexJwt(convexSiteUrl, sessionToken);
  console.log("[auth] convex jwt acquired");

  const client = new ConvexHttpClient(convexUrl);
  client.setAuth(convexJwt);

  const threadId = await client.mutation(api.agent.public.startThread.startThread, {});
  console.log(`[thread] started ${threadId}`);

  const sendResult = await client.mutation(api.agent.public.sendUserMessage.sendUserMessage, {
    threadId,
    prompt,
  });
  console.log(`[run] queued run ${String(sendResult.runId)}`);

  const { assistantText } = await waitForAssistantReply(client, threadId);
  console.log("[assistant] reply received");

  const recommendationBatches = await client.query(
    api.agent.public.listRecommendationsForThread.listRecommendationsForThread,
    { threadId },
  ) as RecommendationBatch[];

  if (recommendationBatches.length === 0) {
    throw new Error("Assistant replied but no recommendation batches were created.");
  }

  const latestBatch = recommendationBatches[recommendationBatches.length - 1];
  console.log("[result] smoke test passed");
  console.log(`[result] properties=${latestBatch.properties.length} propertyIds=${latestBatch.propertyIds.length}`);
  console.log(`[result] rankingRationale=${latestBatch.rankingRationale}`);
  console.log(`[result] assistant=${assistantText}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[smoke] failed: ${message}`);
  process.exitCode = 1;
});
