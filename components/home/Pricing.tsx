"use client";

import { useState } from "react";
import { StarIcon } from "@/icons/StarIcon";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import ClerkBillingButton from "@/components/global/ClerkBillingButton";
import EnterpriseContactModal from "@/components/home/EnterpriseContactModal";
import ManageSubscriptionButton from "@/components/global/ManageSubscriptionButton";
import SwitchToFreeButton from "@/components/global/SwitchToFreeButton";
export const Pricing = () => {
  const { has } = useAuth();
  const hasProPlan = has ? has({ plan: "pro_user" }) : false;

  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);

  return (
    <>
      <section id="pricing" className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Find the Right Plan
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-400">
            Start for free and scale up as your projects grow. No credit card
            required.
          </p>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Hobbyist */}
            <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800 p-8">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Hobbyist
              </h3>

              <p className="mb-6 text-gray-400">
                For personal projects and exploration.
              </p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-gray-400">/ month</span>
              </div>

              <ul className="mb-8 flex-grow space-y-4 text-gray-300">
                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  5 reviews / day
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  Public repositories only
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  Standard AI model
                </li>
              </ul>

              <Link
                href="/dashboard"
                className="mt-auto w-full rounded-lg bg-gray-700 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-gray-600"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-lg border-2 border-sky-500 bg-gray-800 p-8 shadow-2xl shadow-sky-500/10">
              <div className="absolute right-8 top-0 -translate-y-1/2 rounded-full bg-sky-500 px-3 py-1 text-xs font-bold uppercase text-white">
                Most Popular
              </div>

              <h3 className="mb-2 text-xl font-semibold text-sky-300">
                Pro
              </h3>

              <p className="mb-6 text-gray-400">
                For professional developers and teams.
              </p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$9.99</span>
                <span className="text-gray-400">/ month</span>
              </div>

              <ul className="mb-8 flex-grow space-y-4 text-gray-300">
                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  Unlimited reviews
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  Public & private repositories
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  Advanced AI model
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  Priority support
                </li>
              </ul>

<SignedIn>
  {hasProPlan ? (
    <div className="mt-auto space-y-3">
      <ManageSubscriptionButton />
      <SwitchToFreeButton />
    </div>
  ) : (
    <ClerkBillingButton />
  )}
</SignedIn>

              <SignedOut>
                <Link
                  href="/sign-in"
                  className="mt-auto w-full rounded-lg bg-sky-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-sky-500"
                >
                  Choose Pro
                </Link>
              </SignedOut>
            </div>

            {/* Enterprise */}
            <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800 p-8">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Enterprise
              </h3>

              <p className="mb-6 text-gray-400">
                For large organizations with custom needs.
              </p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">
                  Custom
                </span>
              </div>

              <ul className="mb-8 flex-grow space-y-4 text-gray-300">
                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  All Pro features
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  On-premise deployment
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  SSO & advanced security
                </li>

                <li className="flex items-center">
                  <StarIcon className="mr-3 size-5 shrink-0 text-sky-400" />
                  Dedicated support
                </li>
              </ul>

              <button
                type="button"
                onClick={() => setIsEnterpriseModalOpen(true)}
                className="mt-auto w-full rounded-lg bg-gray-700 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseContactModal
        open={isEnterpriseModalOpen}
        onClose={() => setIsEnterpriseModalOpen(false)}
      />
    </>
  );
};
