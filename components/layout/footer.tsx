import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "@/components/icons";

interface FooterProps {
  logoSrc?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  whatsappUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logoSrc = "/icons/footer-logo.svg",
  instagramUrl = "https://instagram.com",
  twitterUrl = "https://twitter.com",
  whatsappUrl = "https://whatsapp.com",
}) => {
  return (
    <div className="p-3 md:p-5">
      <footer className="w-full rounded-[12px] md:rounded-[20px] bg-[#2F4F4F] flex flex-col px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[200px] py-6 md:py-8 lg:py-[48px] gap-6 md:gap-8 lg:gap-[32px]">
        {/* Mobile Layout: Logo and Social Icons in same row */}
        <div className="flex md:hidden justify-between items-center w-full">
          {/* Logo */}
          <Image
            src={logoSrc}
            alt="Allotease"
            width={100}
            height={33}
            className="object-contain w-[100px] h-[33px]"
          />

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <InstagramIcon />
            </Link>
            <Link
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <TwitterIcon />
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <WhatsAppIcon />
            </Link>
          </div>
        </div>

        {/* Desktop Layout: Original design */}
        {/* Logo */}
        <Image
          src={logoSrc}
          alt="Allotease"
          width={120}
          height={40}
          className="hidden md:block object-contain w-[120px] h-[40px]"
        />

        <div className="hidden md:flex md:flex-row md:justify-between w-full pt-4 md:pb-4 border-t border-solid border-[rgba(138,174,164,0.2)] gap-6 md:gap-0 items-center">
          {/* Host Event Text with Arrow - Desktop */}
          <Link
            href="/allocation-admin/create"
            className="flex items-center gap-2 md:gap-[8px] group transition-all duration-300 ease-in-out hover:scale-105"
          >
            <span className="font-source-sans-pro text-base sm:text-lg md:text-[20px] font-semibold leading-normal bg-gradient-to-r from-[rgba(213,255,235,0.5)] to-[rgba(109,255,109,0.5)] bg-clip-text text-transparent group-hover:from-[rgba(213,255,235,0.8)] group-hover:to-[rgba(109,255,109,0.8)] transition-all duration-300">
              Host your event with Allotease
            </span>

            {/* Arrow Icon */}
            <div className="transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0">
              <ArrowIcon />
            </div>
          </Link>
          {/* Social Icons */}
          <div className="flex items-center gap-3 md:gap-[16px]">
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <InstagramIcon />
            </Link>
            <Link
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <TwitterIcon />
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <WhatsAppIcon />
            </Link>
          </div>
        </div>

        {/* Host Event Text with Arrow - Mobile Only (Centered) */}
        <Link
          href="/allocation-admin/create"
          className="flex md:hidden justify-center items-center gap-2 group transition-all duration-300 ease-in-out hover:scale-105"
        >
          <span className="font-source-sans-pro text-base sm:text-lg font-semibold leading-normal bg-gradient-to-r from-[rgba(213,255,235,0.5)] to-[rgba(109,255,109,0.5)] bg-clip-text text-transparent group-hover:from-[rgba(213,255,235,0.8)] group-hover:to-[rgba(109,255,109,0.8)] transition-all duration-300 text-center">
            Host your event with Allotease
          </span>

          {/* Arrow Icon */}
          <div className="transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0">
            <ArrowIcon />
          </div>
        </Link>
      </footer>
    </div>
  );
};
