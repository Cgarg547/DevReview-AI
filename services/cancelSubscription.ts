"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const cancelSubscriptionImmediately = async () => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    throw new Error("You must be signed in.");
  }

  const client = await clerkClient();

  const subscription =
    await client.billing.getUserBillingSubscription(userId);

  const paidItem = subscription.subscriptionItems.find(
    (item) =>
      item.status === "active" &&
      item.plan?.slug === "pro_user"
  );

  if (!paidItem) {
    throw new Error("No active Pro subscription found.");
  }

  await client.billing.cancelSubscriptionItem(paidItem.id, {
    endNow: true,
  });

  return {
    success: true,
  };
};