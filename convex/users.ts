import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { UserJSON } from "@clerk/backend";
import { ConvexError, v, Validator } from "convex/values";

export const current = query({
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    data: v.any() as Validator<UserJSON>,
  }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const today = new Date().toISOString().split("T")[0];
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      username: data.username || data.first_name || "User",
      email: data.email_addresses[0]?.email_address || "",
      imageUrl: data.image_url,
      clerkId: data.id,
      lastReviewDate: today,
    };

    const user = await userByExternalId(ctx, data.id);
    if (!user) {
      const details = {
        plan: "free" as "free" | "pro", // default to free
        reviewsRemaining: 5,
        ...userAttributes,
      };
      await ctx.db.insert("users", details);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  // console.log(identity);
  if (identity === null) {
    console.log("No identity in context");
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byclerkId", (q) => q.eq("clerkId", externalId))
    .unique();
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) {
    console.log("No identity in context");
    return null;
  }
  return userRecord;
}

export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("users")
      .withIndex("byclerkId", (q) => q.eq("clerkId", userId))
      .unique();
  },
});

export const updateReviewsRemaining = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, arg) => {
    const user = await userByExternalId(ctx, arg.clerkId);
    if (!user) {
      throw new ConvexError({
        message: "Unautheticated",
        code: "UNAUTHENTICATED",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];

      await ctx.db.patch(user._id, {
        reviewsRemaining: user.reviewsRemaining - 1,
        lastReviewDate: today,
      });
    }
  },
});

export const resetUserReview = mutation({
  args: { convexId: v.id("users") },
  handler: async (ctx, { convexId }) => {
    const today = new Date().toISOString().split("T")[0];
    await ctx.db.patch(convexId, {
      reviewsRemaining: 5,
      lastReviewDate: today,
    });
  },
});

export const updatePlan = mutation({
  args: {
    plan: v.union(v.literal("free"), v.literal("pro")),
  },
  handler: async (ctx, { plan }) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new ConvexError({
        message: "Unautheticated",
        code: "UNAUTHENTICATED",
      });
    } else {
      await ctx.db.patch(user._id, {
        plan: plan,
      });
    }
  },
});

export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "Unauthenticated",
        code: "UNAUTHENTICATED",
      });
    }

    const existingUser = await userByExternalId(ctx, identity.subject);

    if (existingUser) {
      return existingUser;
    }

    const today = new Date().toISOString().split("T")[0];

    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name ?? "User",
      username: identity.nickname ?? identity.name ?? "User",
      email: identity.email ?? "",
      imageUrl: identity.pictureUrl ?? "",
      plan: "free",
      reviewsRemaining: 5,
      lastReviewDate: today,
    });

    return await ctx.db.get(userId);
  },
});