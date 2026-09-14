import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs/server";

import { HeroAnimation } from "@/components/home/HeroAnimations";
import { Spinner } from "@/components/global/Spinner";

const Hero = async () => {
  const user = await auth();

  return (
    <section className="relative min-h-screen flex items-center bg-grid-gray-800/[0.2]">
      <div className="hero-shadow" />

      <div className="container mx-auto px-4 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="hero-h1">
              Supercharge Your Code Reviews with AI.
            </h1>

            <p className="hero-p">
              DevReview AI analyzes your GitHub repositories to find bugs,
              improve performance, and enforce best practices. Go from pull
              request to production with confidence.
            </p>

            <ClerkLoading>
              <Spinner />
            </ClerkLoading>

            <ClerkLoaded>
              <Link
                href={user.isAuthenticated ? "/dashboard" : "/sign-in"}
                className="hero-link"
              >
                Get Started for Free
              </Link>
            </ClerkLoaded>
          </div>

          <div>
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;