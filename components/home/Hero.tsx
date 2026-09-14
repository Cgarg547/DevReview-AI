import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs/server";

import { HeroAnimation } from "@/components/home/HeroAnimations";
import { Spinner } from "@/components/global/Spinner";

const Hero = async () => {
  const user = await auth();

  const isAuthenticated = user.isAuthenticated;

  return (
    <section className="relative min-h-screen overflow-hidden bg-grid-gray-800/[0.2] pt-28 pb-16 sm:pt-32 md:flex md:items-center md:py-20">
      <div className="hero-shadow" />

      <div className="container relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="text-center md:text-left">
            <h1 className="hero-h1 mx-auto max-w-3xl md:mx-0">
              Supercharge Your Code Reviews with AI.
            </h1>

            <p className="hero-p mx-auto mt-6 max-w-2xl md:mx-0">
              DevReview AI analyzes your GitHub repositories to find bugs,
              improve performance, and enforce best practices. Go from pull
              request to production with confidence.
            </p>

            <div className="mt-8 flex justify-center md:justify-start">
              <ClerkLoading>
                <Spinner />
              </ClerkLoading>

              <ClerkLoaded>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/sign-in"}
                  className="hero-link"
                >
                  {isAuthenticated
                    ? "Open Dashboard"
                    : "Get Started for Free"}
                </Link>
              </ClerkLoaded>
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl md:max-w-none">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
