/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/icons";

export function AboutHeroContent() {
  return (
    <div className="relative z-10 flex-1 flex items-center justify-center py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 text-start">
        {/* Logo and Subtitle Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:h-6 mb-6 sm:mb-8 md:mb-10">
          <Image
            src="/images/brand-logo/about-header-subtle-logo.svg"
            alt="Allotease Logo"
            height={32}
            width={120}
            priority
            className="transition-transform hover:scale-105 h-6 sm:h-7 md:h-8 w-auto"
          />
          <div
            className="hidden sm:block h-full w-px bg-[var(--input-border)] mx-3 md:mx-4"
            aria-hidden="true"
          />
          <p className="text-base sm:text-lg md:text-xl xl:text-2xl font-source-sans-pro font-semibold text-[var(--hero-subtitle-color)] leading-tight">
            Nigerian's Favorite Booking solution
          </p>
        </div>

        {/* Main Hero Title */}
        <h1 className="text-shadow-hero font-space-grotesk text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[64px] font-bold leading-[110%] tracking-tight sm:tracking-[-0.02em] lg:tracking-[-1.28px] text-white mb-4 sm:mb-5 md:mb-6">
          <span className="hero-gradient-text">Simplify</span> Accommodation
          <br />
          Allocation Like Never Before
        </h1>

        {/* CTA Button */}
        <div className="mt-4 sm:mt-5 md:mt-6">
          <Link href="/signup">
            <Button
              variant="allotease-primary"
              size="allotease-lg"
              rightIcon={
                <ArrowUpRightIcon size={20} className="flex-shrink-0" />
              }
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-auto"
              aria-label="Sign up for a new account"
            >
              <span className="font-bold">Sign Up Today</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
