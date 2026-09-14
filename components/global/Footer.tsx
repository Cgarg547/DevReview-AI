"use client";

import { GitHubIcon } from "@/icons/GitHubIcon";
import EnterpriseContactModal from "@/components/home/EnterpriseContactModal";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-gray-700 bg-gray-950 text-gray-400">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-white transition-opacity hover:opacity-80"
              >
                <img
                  src="/devreview-logo.svg"
                  alt="DevReview AI"
                  width={42}
                  height={42}
                  className="h-10 w-10 rounded-lg"
                />

                <span className="text-xl font-bold">DevReview AI</span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
                AI-powered code reviews for better software. Find bugs, improve
                performance, and ship with confidence.
              </p>

              {/* Social Links */}
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="https://github.com/cgarg547"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800 transition-colors hover:border-sky-500 hover:bg-gray-700 hover:text-white"
                >
                  <GitHubIcon className="size-5" />
                </Link>

                <Link
                  href="https://www.linkedin.com/in/cgarg3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-sm font-bold transition-colors hover:border-sky-500 hover:bg-gray-700 hover:text-white"
                >
                  in
                </Link>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  aria-label="Contact me"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-sm transition-colors hover:border-sky-500 hover:bg-gray-700 hover:text-white"
                >
                  ✉
                </button>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Build better. Ship faster. 🚀
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Product
              </h3>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="transition-colors hover:text-sky-400"
                  >
                    Features
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#pricing"
                    className="transition-colors hover:text-sky-400"
                  >
                    Pricing
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-sky-400"
                  >
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    href="/review"
                    className="transition-colors hover:text-sky-400"
                  >
                    Code Review
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Resources
              </h3>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="https://github.com/cgarg547/DevReview-AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-sky-400"
                  >
                    GitHub Repository
                  </Link>
                </li>

                <li>
                  <Link
                    href="https://github.com/cgarg547/DevReview-AI/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-sky-400"
                  >
                    Report a Bug
                  </Link>
                </li>

                <li>
                  <Link
                    href="https://github.com/cgarg547/DevReview-AI/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-sky-400"
                  >
                    Request a Feature
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Connect
              </h3>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="https://www.linkedin.com/in/cgarg3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-sky-400"
                  >
                    LinkedIn
                  </Link>
                </li>

                <li>
                  <Link
                    href="https://github.com/cgarg547"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-sky-400"
                  >
                    GitHub
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="transition-colors hover:text-sky-400"
                  >
                    Email Me
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} DevReview AI. All rights reserved.</p>

            <p>
              Made with <span className="text-red-400">❤️</span> by{" "}
              <span className="font-semibold text-gray-300">Chirag Garg</span>
            </p>
          </div>
        </div>
      </footer>

      <EnterpriseContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
};

export default Footer;
