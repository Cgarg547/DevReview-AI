"use client";

import { StarIcon } from "@/icons/StarIcon";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import ClerkBillingButton from "@/components/global/ClerkBillingButton";

export const Pricing = () => {
  const { has } = useAuth();
  const hasProPlan = has ? has({ plan: "pro_user" }) : false;

  return (
    <section id="pricing" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Find the Right Plan
        </h2>

        <p className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Start for free and scale up as your projects grow. No credit card
          required.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Hobbyist */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">
              Hobbyist
            </h3>

            <p className="text-gray-400 mb-6">
              For personal projects and exploration.
            </p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-gray-400">/ month</span>
            </div>

            <ul className="space-y-4 text-gray-300 mb-8 flex-grow">
              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                5 reviews / day
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                Public repositories only
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                Standard AI model
              </li>
            </ul>

            <Link
              href="/dashboard"
              className="w-full mt-auto text-center bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gray-800 p-8 rounded-lg border-2 border-sky-500 flex flex-col relative shadow-2xl shadow-sky-500/10">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Most Popular
            </div>

            <h3 className="text-xl font-semibold text-sky-300 mb-2">
              Pro
            </h3>

            <p className="text-gray-400 mb-6">
              For professional developers and teams.
            </p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">$29</span>
              <span className="text-gray-400">/ month</span>
            </div>

            <ul className="space-y-4 text-gray-300 mb-8 flex-grow">
              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                Unlimited reviews
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                Public & private repositories
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                Advanced AI model
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                Priority support
              </li>
            </ul>

            <SignedIn>
              {hasProPlan ? (
                <Link
                  href="/dashboard"
                  className="w-full mt-auto text-center bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-500 transition-colors"
                >
                  Current Plan
                </Link>
              ) : (
                <ClerkBillingButton />
              )}
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className="w-full mt-auto text-center bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-500 transition-colors"
              >
                Choose Pro
              </Link>
            </SignedOut>
          </div>

          {/* Enterprise */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">
              Enterprise
            </h3>

            <p className="text-gray-400 mb-6">
              For large organizations with custom needs.
            </p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">
                Custom
              </span>
            </div>

            <ul className="space-y-4 text-gray-300 mb-8 flex-grow">
              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                All Pro features
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                On-premise deployment
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                SSO & advanced security
              </li>

              <li className="flex items-center">
                <StarIcon className="size-5 text-sky-400 mr-3" />
                Dedicated support
              </li>
            </ul>

            <a
              href="mailto:support@codesight.ai?subject=CodeSight%20Enterprise%20Inquiry"
              className="w-full mt-auto text-center bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};