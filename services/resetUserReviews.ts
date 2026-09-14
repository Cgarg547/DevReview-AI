"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export const resetUserReviews = async ({ userId }: { userId: string }) => {
  const user = await fetchQuery(api.users.getUser, { userId });
  if (user) {
    // Convert both to the same local date string (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];
    const lastReviewDate = user.lastReviewDate
      ? new Date(user.lastReviewDate).toISOString().split("T")[0]
      : null;

    if (lastReviewDate !== today) {
      await fetchMutation(api.users.resetUserReview, {
        convexId: user._id as Id<"users">,
      });
    }
  }
};
