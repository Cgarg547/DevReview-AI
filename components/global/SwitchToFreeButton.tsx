"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { cancelSubscriptionImmediately } from "@/services/cancelSubscription";

const SwitchToFreeButton = () => {
  const { user } = useUser();
  const router = useRouter();

  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSwitchToFree = async () => {
    try {
      setIsCancelling(true);

      await cancelSubscriptionImmediately();

      if (user) {
        await user.reload();
      }

      toast.success("Your Pro subscription has been ended.");

      setShowConfirmation(false);

      router.refresh();

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Failed to switch to Free:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to switch to the Free plan."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirmation(true)}
        disabled={isCancelling}
        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-6 py-3 font-semibold text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCancelling ? "Switching to Free..." : "Switch to Free"}
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">
              Switch to Free?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Your Pro subscription will end immediately. You will lose access
              to Pro features and return to the Free plan with 5 reviews per
              day.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={isCancelling}
                className="rounded-lg border border-gray-700 px-5 py-2.5 font-semibold text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-60"
              >
                Keep Pro
              </button>

              <button
                type="button"
                onClick={handleSwitchToFree}
                disabled={isCancelling}
                className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling ? "Switching..." : "Switch to Free"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SwitchToFreeButton;