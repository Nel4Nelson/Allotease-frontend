"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/icons";

export function AboutDesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {/* Explore Resources Button */}
      <Link href="/events">
        <span className="flex items-center gap-1 group relative font-source-sans-pro font-semibold text-base text-white/60 group-hover:text-white transition-all duration-300">
          <span className="relative">
            Explore Resources
            <span className="absolute -bottom-1 left-0 w-0 h-0.5  group-hover:w-full transition-all duration-300"></span>
          </span>
          <ArrowUpRightIcon
            size={16}
            className="text-white/60 group-hover:text-white transition-colors duration-300"
          />
        </span>
      </Link>

      {/* Sign In Button */}
      <Link href="/signin">
        <Button
          variant="allotease-glass"
          size="allotease-sm"
          aria-label="Sign in to your account"
        >
          Sign In
        </Button>
      </Link>
    </nav>
  );
}
