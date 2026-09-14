"use client";

import { SubscriptionDetailsButton } from "@clerk/nextjs/experimental";

const ManageSubscriptionButton = () => {
  return (
    <SubscriptionDetailsButton for="user">
      <button
        type="button"
        className="w-full rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-500"
      >
        Manage Subscription
      </button>
    </SubscriptionDetailsButton>
  );
};

export default ManageSubscriptionButton;