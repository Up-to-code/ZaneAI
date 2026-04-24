import { mutation } from "../../_generated/server";
import { ensureProfile, syncResolvedAuthUserProfile } from "../profile";
import { authComponent } from "../client";

export const initializeProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await syncResolvedAuthUserProfile(
      ctx,
      await authComponent.getAuthUser(ctx),
    );
    const profile = await ensureProfile(ctx, {
      _id: authUser._id,
      email: authUser.email ?? "",
      name: authUser.name ?? authUser.email ?? "Zane-ai user",
    });
    return { profileId: profile._id };
  },
});
