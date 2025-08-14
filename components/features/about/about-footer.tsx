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
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const navigationItems = [
    { name: "Discover", id: "discover" },
    { name: "Hosting", id: "hosting" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Pricing", id: "pricing" },
  ];

  return (
    <div className="p-3 md:p-5">
      <footer className="w-full rounded-[12px] md:rounded-[20px] bg-[#2F4F4F] flex flex-col px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[200px] py-6 md:py-8 lg:py-[48px] gap-6 md:gap-8 lg:gap-[32px]">
        {/* Logo */}
        <Image
          src={logoSrc}
          alt="Allotease"
          width={120}
          height={40}
          className="object-contain w-[100px] h-[33px] md:w-[120px] md:h-[40px]"
        />

        <div className="flex flex-col md:flex-row md:justify-between w-full pb-4 md:pb-4 border-b border-solid border-[rgba(138,174,164,0.2)] gap-6 md:gap-0">
          {/* Navigation Links */}
          <nav className="flex flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[40px]">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
                className="font-source-sans-pro text-base sm:text-lg md:text-[20px] font-semibold leading-normal text-[rgba(213,255,235,0.5)] hover:text-[rgba(213,255,235,0.8)] transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {item.name}
              </a>
            ))}
          </nav>

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

        {/* Host Event Text with Arrow */}
        <Link
          href="/allocation-admin/create"
          className="flex justify-center items-center gap-2 md:gap-[8px] group transition-all duration-300 ease-in-out hover:scale-105"
        >
          <span className="font-source-sans-pro text-base sm:text-lg md:text-[20px] font-semibold leading-normal bg-gradient-to-r from-[rgba(213,255,235,0.5)] to-[rgba(109,255,109,0.5)] bg-clip-text text-transparent group-hover:from-[rgba(213,255,235,0.8)] group-hover:to-[rgba(109,255,109,0.8)] transition-all duration-300 text-center">
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