"use client";

import { api } from "@/convex/_generated/api";
import { StarIcon } from "@/icons/StarIcon";
import ClerkBillingButton from "@/components/global/ClerkBillingButton";

import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Link from "next/link";

const Plan: React.FC<{ reviews: number | undefined }> = ({ reviews }) => {
  const { has } = useAuth();
  const hasProPlan = has ? has({ plan: "pro_user" }) : false;

if (hasProPlan) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full border border-yellow-700 bg-yellow-900/50 px-3 py-2 text-xs font-semibold text-yellow-300 sm:text-sm">
        <StarIcon className="h-4 w-4 shrink-0" />
        <span>Pro Plan</span>
      </div>
    </div>
  );
}

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-full bg-gray-700 px-3 py-2 text-xs sm:flex sm:text-sm">
        <span className="text-gray-400">Reviews Left:</span>
        <span className="font-semibold text-white">
          {reviews ?? 0}
        </span>
      </div>

      <div className="sm:hidden">
        <div className="rounded-full bg-gray-700 px-3 py-2 text-xs font-semibold text-gray-300">
          {reviews ?? 0} left
        </div>
      </div>

      <div className="hidden sm:block">
        <ClerkBillingButton />
      </div>
    </div>
  );
};

const Header = () => {
  const user = useQuery(api.users.current);

  return (
    <header className="sticky inset-x-0 top-0 z-50 h-[68px] w-full border-b border-gray-700 bg-gray-900/95 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80 sm:gap-3"
        >
          <img
            src="/devreview-logo.svg"
            alt="DevReview AI"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-lg object-contain"
          />

          <h1 className="truncate text-lg font-bold text-white sm:text-2xl">
            DevReview AI
          </h1>
        </Link>

        {/* Authenticated Actions */}
        <SignedIn>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Plan reviews={user?.reviewsRemaining} />

            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "2rem",
                    height: "2rem",
                  },
                },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;