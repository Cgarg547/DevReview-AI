import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-sky-500">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-400">
          The page you're looking for doesn't exist.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-500"
        >
          Back to DevReview AI
        </Link>
      </div>
    </main>
  );
}