import { v } from "convex/values";
import { query } from "../../_generated/server";

/**
 * WHY:   The workspace dashboard requires an organizational overview of project performance.
 * WHAT:  Aggregates analytics events (views, clicks, CTA actions) for all projects in an organization.
 * HOW:   Queries the analyticsEvents table filtered by organizationId and groups by day/type.
 */
export const getWorkspaceStats = query({
  args: {
    organizationId: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 7;
    const now = Date.now();
    const startTime = now - days * 24 * 60 * 60 * 1000;

    let events = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId))
      .filter((q) => q.gt(q.field("createdAt"), startTime))
      .collect();

    // Grouping logic
    const dailyStats: Record<string, { date: string; views: number; clicks: number }> = {};
    const ctaBreakdown = {
      whatsapp: 0,
      email: 0,
      other: 0,
    };

    // Initialize daily stats for the requested range to ensure no gaps
    for (let i = 0; i < days; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      dailyStats[dateStr] = { date: dateStr, views: 0, clicks: 0 };
    }

    events.forEach((event) => {
      const dateStr = new Date(event.createdAt).toISOString().split("T")[0];
      if (dailyStats[dateStr]) {
        if (event.eventName === "project_view") {
          dailyStats[dateStr].views++;
        } else if (event.eventName === "project_click") {
          dailyStats[dateStr].clicks++;
        }
      }

      if (event.eventName === "cta_whatsapp_click") {
        ctaBreakdown.whatsapp++;
      } else if (event.eventName === "cta_email_click") {
        ctaBreakdown.email++;
      } else if (event.eventName.startsWith("cta_") && event.eventName.endsWith("_click")) {
        ctaBreakdown.other++;
      }
    });

    const trend = Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));

    return {
      trend,
      ctaBreakdown: [
        { label: "WhatsApp", count: ctaBreakdown.whatsapp, color: "#25D366" },
        { label: "Email", count: ctaBreakdown.email, color: "#EA4335" },
        { label: "Other", count: ctaBreakdown.other, color: "#94a3b8" },
      ],
      totals: {
        views: events.filter(e => e.eventName === "project_view").length,
        clicks: events.filter(e => e.eventName === "project_click").length,
      }
    };
  },
});
