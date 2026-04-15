import { describe, expect, it } from "vitest";
import {
  formatWorkspaceOrganizationName,
  getWorkspaceOrganizationDisplay,
} from "./organizationDisplay";

describe("organizationDisplay", () => {
  it("strips brand fragments and repeated separators from organization names", () => {
    expect(formatWorkspaceOrganizationName("  Zane-ai | Alpha --- Dev  ")).toBe("Alpha Dev");
  });

  it("falls back to a safe locale-aware label when the cleaned name is empty", () => {
    expect(formatWorkspaceOrganizationName("___ Zane-ai ___")).toBe("مساحة العمل");
    expect(formatWorkspaceOrganizationName("___ zane-ai ___", "fr")).toBe("Espace de travail");
  });

  it("builds locale-aware subtitles for sidebar and navbar chrome", () => {
    expect(
      getWorkspaceOrganizationDisplay({
        name: "Zane-ai | Alpha Dev",
        type: "red",
        status: "active",
        zoneLabel: "المشاريع",
      }),
    ).toEqual({
      name: "Alpha Dev",
      sidebarSubtitle: "المشاريع",
      navbarSubtitle: "مطور · نشط",
      logoUrl: null,
      isVerified: false,
      typeKey: "developer",
      typeLabel: "مطور",
    });

    expect(
      getWorkspaceOrganizationDisplay({
        name: "Zane-ai | Alpha Dev",
        type: "red",
        status: "active",
        logoUrl: "https://example.com/logo.png",
        isVerified: true,
        locale: "en",
      }),
    ).toEqual({
      name: "Alpha Dev",
      sidebarSubtitle: "Developer · Active",
      navbarSubtitle: "Developer · Active",
      logoUrl: "https://example.com/logo.png",
      isVerified: true,
      typeKey: "developer",
      typeLabel: "Developer",
    });
  });
});
