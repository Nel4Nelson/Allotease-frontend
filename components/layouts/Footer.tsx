"use client";

import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { InstagramLogo, TwitterLogo, WhatsappLogo } from "phosphor-react";

interface SocialIcon {
  name: string;
  icon: ReactNode;
  link: string;
}

const icons: SocialIcon[] = [
  {
    name: "Instagram",
    icon: (
      <>
        {/* Small icon for mobile */}
        <InstagramLogo size={12} className="block md:hidden" />
        {/* Normal icon for md+ */}
        <InstagramLogo size={24} className="hidden md:block" />
      </>
    ),
    link: "https://instagram.com",
  },
  {
    name: "Twitter",
    icon: (
      <>
        <TwitterLogo size={12} className="block md:hidden" />
        <TwitterLogo size={24} className="hidden md:block" />
      </>
    ),
    link: "https://twitter.com",
  },
  {
    name: "WhatsApp",
    icon: (
      <>
        <WhatsappLogo size={12} className="block md:hidden" />
        <WhatsappLogo size={24} className="hidden md:block" />
      </>
    ),
    link: "https://whatsapp.com",
  },
];

const Footer = () => {
  return (
    <div className="mx-4 my-4 py-8 p-2 md:p-8 bg-[#2F4F4F] text-white rounded-2xl">
      {/* Logo Section */}
      <div className="mb-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo2.svg"
            alt="Allotease Logo"
            height={32}
            width={108}
          />
        </Link>
      </div>

      <hr className="border-[#D5FFEB40] mb-4" />

      <div className="flex items-center justify-between">
        {/* Bottom Text with SVG */}
        <div className="flex items-center gap-1">
          <p className="text-xs md:text-[20px] font-semibold bg-gradient-to-r from-[#D5FFEB] to-[#6DFF6D] text-transparent bg-clip-text">
            Host your event with Allotease
          </p>
          {/* Small for mobile */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#6DFF6D] block md:hidden"
          >
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
          {/* Large for md+ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#6DFF6D] hidden md:block"
          >
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        </div>

        {/* Nav + Social Icons Section */}
          <div className="flex space-x-1 md:space-x-4 h-full">
            {icons.map((iconObj, index) => (
              <Link
                key={index}
                href={iconObj.link}
                target="_blank"
                className="hover:text-[#6DFF6D] transition"
              >
                {iconObj.icon}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
