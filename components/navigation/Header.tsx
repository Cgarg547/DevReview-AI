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
      <div className="flex items-center space-x-2 bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-700">
        <StarIcon className="w-4 h-4" />
        <span>Pro Plan</span>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      {!hasProPlan && <ClerkBillingButton />}
      <div className="flex items-center space-x-2 bg-gray-700 px-2 py-1 rounded-full text-sm w-56">
        <span className="text-gray-400">Reviews Left:</span>
        <span className="font-semibold text-white">{reviews}</span>
      </div>
    </div>
  );
};

const Header = () => {
  const user = useQuery(api.users.current);

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between shadow-lg sticky top-0">
      <Link
        href={"/"}
        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
      >
        <img src={"/favicon.ico"} className="size-10" />
        <h1 className="text-2xl font-bold text-white">CodeSight AI</h1>
      </Link>
      <SignedIn>
        <div className="flex gap-2 items-center">
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
    </header>
  );
};

export default Header;
