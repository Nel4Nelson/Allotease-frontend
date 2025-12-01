import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  InstagramIcon,
  TwitterIcon,
} from "@/components/icons";

interface FooterProps {
  logoSrc?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  whatsappUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logoSrc = "/icons/footer-logo.svg",
  instagramUrl = "https://www.instagram.com/allot_ease?igsh=b2JrYTFoYXdhd3B6",
  twitterUrl = "https://x.com/AllotEase",
  linkedinUrl = "https://www.linkedin.com/in/allotease-979184382/",
  whatsappUrl = "https://whatsapp.com/channel/0029VbBdGEuKrWR3YbIfVU33",
}) => {
  return (
    <div className="p-3 md:p-5">
      <footer className="w-full rounded-[12px] md:rounded-[20px] bg-[#2F4F4F] flex flex-col px-4 sm:px-8 md:px-16 lg:px-24 py-6 md:py-8 lg:py-[48px] gap-6 md:gap-8 lg:gap-[48px]">
        <div className="max-w-[964px] mx-auto w-full flex flex-col gap-6 md:gap-8 lg:gap-[48px]">
          {/* Logo and Tagline */}
          <div className="flex flex-col gap-2">
            <Image
              src={logoSrc}
              alt="Allotease"
              width={120}
              height={40}
              className="object-contain w-[100px] md:w-[120px] h-[33px] md:h-[40px]"
            />
            <p className="font-source-sans-pro text-sm md:text-base text-[#E5F4EF] italic">
              Designed for ease. Built for more!
            </p>
          </div>

          {/* Three Column Layout with border top */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 pt-6 md:pt-8 border-t border-solid border-[rgba(138,174,164,0.2)]">
            {/* Column 1 - Explore */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="font-source-sans-pro text-base sm:text-lg font-semibold leading-normal bg-gradient-to-r from-[rgba(213,255,235,0.5)] to-[rgba(109,255,109,0.5)] bg-clip-text text-transparent">
                Explore
              </h3>
              <div className="flex flex-col gap-2 md:gap-3">
                <Link
                  href="/?type=stays"
                  className="font-source-sans-pro text-base md:text-lg text-[#E5F4EF] hover:text-white transition-colors duration-300"
                >
                  Spaces
                </Link>
                <Link
                  href="/?type=events"
                  className="font-source-sans-pro text-base md:text-lg text-[#E5F4EF] hover:text-white transition-colors duration-300"
                >
                  Events
                </Link>
                <Link
                  href="/about"
                  className="font-source-sans-pro text-base md:text-lg text-[#E5F4EF] hover:text-white transition-colors duration-300"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="font-source-sans-pro text-base md:text-lg text-[#E5F4EF] hover:text-white transition-colors duration-300"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Column 2 - Support */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="font-source-sans-pro text-base sm:text-lg font-semibold leading-normal bg-gradient-to-r from-[rgba(213,255,235,0.5)] to-[rgba(109,255,109,0.5)] bg-clip-text text-transparent">
                Support
              </h3>
              <div className="flex flex-col gap-2 md:gap-3">
                <Link
                  href="/help-center"
                  className="font-source-sans-pro text-base md:text-lg text-[#E5F4EF] hover:text-white transition-colors duration-300"
                >
                  Help Center
                </Link>
                <Link
                  href="/privacy-policy"
                  className="font-source-sans-pro text-base md:text-lg text-[#E5F4EF] hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="font-source-sans-pro text-base md:text-lg text-[#E5F4EF] hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Column 3 - Connect */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="font-source-sans-pro text-base sm:text-lg font-semibold leading-normal bg-gradient-to-r from-[rgba(213,255,235,0.5)] to-[rgba(109,255,109,0.5)] bg-clip-text text-transparent">
                Connect
              </h3>
              <div className="flex flex-col gap-4">
                {/* Social Icons */}
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Instagram */}
                  <Link
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity duration-300"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </Link>

                  {/* LinkedIn */}
                  <Link
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity duration-300"
                    aria-label="LinkedIn"
                  >
                    <Image
                      src="/icons/linkedin.png"
                      alt="LinkedIn"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>

                  {/* Twitter/X */}
                  <Link
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity duration-300"
                    aria-label="Twitter/X"
                  >
                    <TwitterIcon />
                  </Link>

                  {/* WhatsApp */}
                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity duration-300"
                    aria-label="WhatsApp"
                  >
                    <Image
                      src="/icons/whatsapp.png"
                      alt="WhatsApp"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>

                  {/* Facebook - COMMENTED OUT */}
                  {/* <Link
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity duration-300"
                    aria-label="Facebook"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#E5F4EF"/>
                    </svg>
                  </Link> */}
                </div>
                
                {/* Copyright */}
                <p className="font-source-sans-pro text-sm md:text-base text-[#E5F4EF]">
                  © 2025 Allotease. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};