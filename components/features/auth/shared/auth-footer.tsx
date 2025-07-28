import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AuthFooterProps {
  children?: React.ReactNode;
  accountText?: string;
  linkText?: string;
  linkHref?: string;
  showAccountSection?: boolean;
}

export function AuthFooter({
  children,
  accountText = "Already have an account?",
  linkText = "Sign In",
  linkHref = "/signin",
  showAccountSection = true,
}: AuthFooterProps) {
  return (
    <div className="space-y-6">
      {/* Already have an account section */}
      {showAccountSection && (
        <div className="my-[14px] text-center px-4 sm:px-0">
          <span className="font-source-sans-pro text-[var(--body-text)] text-sm font-normal leading-[160%]">
            {accountText}{" "}
          </span>
          <Link
            href={linkHref}
            className="
              font-source-sans-pro 
              text-[var(--feature-accent-orange)] 
              text-sm 
              font-normal 
              leading-[160%]
              underline 
              decoration-solid 
              decoration-auto 
              underline-offset-auto
              hover:no-underline 
              transition-all 
              duration-200 
              focus:outline-none 
              focus:ring-2 
              focus:ring-[var(--feature-accent-orange)]/30 
              focus:ring-offset-1
            "
          >
            {linkText}
          </Link>
        </div>
      )}

      {/* Horizontal divider line */}
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="320"
          height="2"
          viewBox="0 0 320 2"
          fill="none"
          className="max-w-full"
        >
          <path
            d="M0 1H320"
            stroke="var(--auth-divider-stroke)"
            strokeOpacity="0.5"
          />
        </svg>
      </div>

      {/* Optional children slot (e.g., Google sign up button) */}
      {children && <div className="flex justify-center">{children}</div>}

      {/* Powered by Allotease section */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <p className="font-source-sans-pro text-[var(--auth-footer-text)] text-xs font-normal leading-[160%]">
          Powered by
        </p>
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/brand-logo/logo-black.svg"
            alt="Allotease Logo"
            height={32}
            width={50}
            priority
            className="transition-transform group-hover:scale-105 w-auto"
          />
        </Link>
      </div>
    </div>
  );
}
