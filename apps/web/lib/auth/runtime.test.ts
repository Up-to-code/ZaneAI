import { describe, expect, it } from "vitest";
import { getConvexSiteUrlFromDeploymentUrl } from "./runtime";

describe("web auth runtime", () => {
  it("derives Convex Better Auth site URLs from client deployment URLs", () => {
    expect(getConvexSiteUrlFromDeploymentUrl("https://happy-animal-123.convex.cloud")).toBe(
      "https://happy-animal-123.convex.site",
    );
    expect(getConvexSiteUrlFromDeploymentUrl("https://happy-animal-123.convex.cloud/")).toBe(
      "https://happy-animal-123.convex.site",
    );
  });

  it("preserves explicit custom auth origins", () => {
    expect(getConvexSiteUrlFromDeploymentUrl("https://auth.zane-ai.test")).toBe("https://auth.zane-ai.test");
  });
});
