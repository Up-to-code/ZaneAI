import assert from "node:assert/strict";
import test from "node:test";
import { buildWorkspaceDevSeedFixtures, DEV_SEED_IDENTIFIERS } from "./fixtures";
import { assertDevelopmentEnvironment, isDevelopmentEnvironment } from "./lib";

test("builds a deterministic realistic dataset", () => {
  const now = Date.UTC(2026, 3, 22, 12, 0, 0);
  const first = buildWorkspaceDevSeedFixtures(now);
  const second = buildWorkspaceDevSeedFixtures(now);

  assert.deepEqual(first, second);
  assert.deepEqual(first.organizations.map((org) => org.slug), [...DEV_SEED_IDENTIFIERS.organizationSlugs]);
  assert.equal(first.projects.some((project) => project.publicationState === "published"), true);
  assert.equal(first.projects.some((project) => project.publicationState === "draft"), true);
  assert.equal(first.assets.some((asset) => asset.visibility === "organization"), true);
  assert.equal(first.assets.some((asset) => asset.visibility === "conversation_only"), true);
  assert.equal(first.units.some((unit) => unit.publicationState === "published"), true);
  assert.equal(first.units.some((unit) => unit.availability === "reserved"), true);
  assert.equal(first.buyerIntents.length > 0, true);
  assert.equal(first.conversationHandoffs.length > 0, true);
});

test("keeps the development guard strict", () => {
  assert.equal(isDevelopmentEnvironment("development"), true);
  assert.equal(isDevelopmentEnvironment("production"), false);
  assert.equal(isDevelopmentEnvironment("production", "1"), true);
  assert.throws(() => assertDevelopmentEnvironment("production"), /development deployments/i);
});
