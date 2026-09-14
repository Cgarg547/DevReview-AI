"use client";

import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";

const ClerkBillingButton = () => {
  return (
    <SignedIn>
      <Link
        href="/pricing"
        className="block w-full rounded-lg bg-sky-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-sky-500"
      >
        Choose Pro
      </Link>
    </SignedIn>
  );
};

export default ClerkBillingButton;
