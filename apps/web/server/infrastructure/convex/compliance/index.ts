import { fetchQuery } from "convex/nextjs";
import { complianceApi } from "./api";
import type { ComplianceRepository } from "./types";
import { getDemoComplianceRuleset } from "@/app/(ws)/ws/_lib/demoData";

export type { ComplianceRepository } from "./types";

export const convexComplianceRepository: ComplianceRepository = {
  async getForCurrentOrg(token) {
    if (token === "demo-session-token") {
      return getDemoComplianceRuleset() as never;
    }

    return fetchQuery(
      complianceApi.getComplianceRulesetForCurrentOrg as never,
      {} as never,
      { token },
    ) as ReturnType<ComplianceRepository["getForCurrentOrg"]>;
  },
  async getByCountryOrgType(token, args) {
    if (token === "demo-session-token") {
      return getDemoComplianceRuleset() as never;
    }

    return fetchQuery(
      complianceApi.getComplianceRulesetByCountry as never,
      args as never,
      { token },
    ) as ReturnType<ComplianceRepository["getByCountryOrgType"]>;
  },
};
