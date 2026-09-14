import { PricingTable } from "@clerk/nextjs";
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
          >
            ← Back to DevReview AI
          </Link>

          <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Upgrade to DevReview AI Pro
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Get unlimited AI-powered code reviews and analyze your code with
            confidence.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <PricingTable
            for="user"
            checkoutProps={{
              appearance: {
                variables: {
                  colorPrimary: "#0ea5e9",
                },
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
