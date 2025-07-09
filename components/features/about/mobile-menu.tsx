"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/icons";

interface AboutMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutMobileMenu({ isOpen, onClose }: AboutMobileMenuProps) {
  return (
    <div
      className={`md:hidden absolute top-full left-0 w-full glass-effect-strong transition-all duration-500 ease-in-out ${
        isOpen
          ? "opacity-100 max-h-[400px] py-6 px-4"
          : "opacity-0 max-h-0 overflow-hidden"
      }`}
    >
      <nav
        className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto"
        role="navigation"
      >
        {/* Explore Resources Link */}
        <Link href="/events" onClick={onClose} className="w-full">
          <div className="flex items-center justify-center gap-2 group relative font-source-sans-pro font-semibold text-lg text-white/80 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/5">
            <span className="relative">
              Explore Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300"></span>
            </span>
            <ArrowUpRightIcon
              size={18}
              className="text-white/60 group-hover:text-white transition-colors duration-300 flex-shrink-0"
            />
          </div>
        </Link>

        {/* Sign In Button */}
        <Link href="/signin" onClick={onClose} className="w-full max-w-[200px]">
          <Button
            variant="allotease-glass"
            size="allotease-md"
            className="w-full"
            aria-label="Sign in to your account"
          >
            Sign In
          </Button>
        </Link>
      </nav>
    </div>
  );
}
