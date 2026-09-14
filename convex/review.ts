import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const saveReview = mutation({
  args: {
    repoFullName: v.string(),
    filePath: v.string(),
    fileSha: v.string(),
    reviewContent: v.optional(v.string()),
    clerkId: v.string(),
    owner: v.string(),
    status: v.union(
      v.literal("Reviewing your code..."),
      v.literal("Completed"),
      v.literal("failed")
    ),
    serviceKey: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    if (!args.repoFullName || !args.fileSha || !args.clerkId) {
      throw new ConvexError({
        message: "Repository, file SHA, and user are required",
        code: "INVALID_ARGUMENT",
      });
    }

    const configuredServiceKey = process.env.INNGEST_REVIEW_SECRET;

    const isServerReviewRequest =
      !!configuredServiceKey &&
      !!args.serviceKey &&
      args.serviceKey === configuredServiceKey;

    if (!isServerReviewRequest) {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity || identity.subject !== args.clerkId) {
        throw new ConvexError({
          message: "You are not authorized to modify this review",
          code: "UNAUTHENTICATED",
        });
      }
    }

    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_file_sha", (q) =>
        q
          .eq("repoFullName", args.repoFullName)
          .eq("fileSha", args.fileSha)
          .eq("clerkId", args.clerkId)
      )
      .first();

    if (existingReview) {
      if (args.status === "Completed" && args.reviewContent) {
        await ctx.db.patch(existingReview._id, {
          reviewContent: [
            args.reviewContent,
            ...existingReview.reviewContent,
          ],
          status: "Completed",
        });
      } else {
        await ctx.db.patch(existingReview._id, {
          status: args.status,
        });
      }

      return existingReview._id;
    }

    return await ctx.db.insert("reviews", {
      repoFullName: args.repoFullName,
      filePath: args.filePath,
      fileSha: args.fileSha,
      reviewContent: args.reviewContent
        ? [args.reviewContent]
        : [],
      clerkId: args.clerkId,
      status: args.status,
      owner: args.owner,
    });
  },
});

export const getReviewForFile = query({
  args: {
    repoFullName: v.string(),
    fileSha: v.string(),
  },

  handler: async (ctx, args) => {
    if (!args.repoFullName || !args.fileSha) {
      throw new ConvexError({
        message: "Repo full name and file SHA are required",
        code: "INVALID_ARGUMENT",
      });
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("reviews")
      .withIndex("by_file_sha", (q) =>
        q
          .eq("repoFullName", args.repoFullName)
          .eq("fileSha", args.fileSha)
          .eq("clerkId", identity.subject)
      )
      .first();
  },
});

export const getReviewHistory = query({
  args: {
    repoFullName: v.string(),
    clerkId: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || identity.subject !== args.clerkId) {
      throw new ConvexError({
        message: "You are not authorized to view this review history",
        code: "UNAUTHENTICATED",
      });
    }

    if (!args.repoFullName) {
      throw new ConvexError({
        message: "Repo full name is required",
        code: "INVALID_ARGUMENT",
      });
    }

    return await ctx.db
      .query("reviews")
      .withIndex("by_repo", (q) =>
        q
          .eq("repoFullName", args.repoFullName)
          .eq("clerkId", args.clerkId)
      )
      .collect();
  },
});
