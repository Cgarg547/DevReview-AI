import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro")),
    reviewsRemaining: v.number(),
    clerkId: v.string(),
    lastReviewDate: v.optional(v.string()),
  }).index("byclerkId", ["clerkId"]),

  reviews: defineTable({
    owner: v.string(),
    clerkId: v.string(),
    repoFullName: v.string(),
    filePath: v.string(),
    fileSha: v.string(),
    reviewContent: v.array(v.string()),
    status: v.union(
      v.literal("Reviewing your code..."),
      v.literal("Completed"),
      v.literal("failed")
    ),
  })
    .index("by_file_sha", ["repoFullName", "fileSha", "clerkId"])
    .index("by_repo", ["repoFullName", "clerkId"]),
});
