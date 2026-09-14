"use client";

import { SignedIn } from "@clerk/nextjs";
import React from "react";
import { toast } from "sonner";

const ClerkBillingButton = () => {
  const handleChoosePro = () => {
    toast.info("Pro billing is coming soon.");
  };

  return (
    <SignedIn>
      <button
        type="button"
        onClick={handleChoosePro}
        className="w-full mt-auto bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-500 transition-colors cursor-pointer"
      >
        Choose Pro
      </button>
    </SignedIn>
  );
};

export default ClerkBillingButton;