"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const InstagramIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
    <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.81,50.72a8,8,0,0,0-13.58,2.43c-2.82,5.58-42.44,86.48,4.76,126.26A4.35,4.35,0,0,0,40,192H16a8,8,0,0,0,0,16H120a128,128,0,1,0,0-256c-7,0-14.14.09-21.26.26A8,8,0,0,0,96,24.53c.44,7.28.89,14.64,1.35,21.94a8,8,0,0,0,16-.94c-.46-7.3-.91-14.66-1.35-21.94C112.14,24.09,119.14,24,120,24A112,112,0,0,1,232,136c0,1.86,0,3.73-.09,5.59A8,8,0,0,0,239.55,150c.44-7.28.45-14.64,0-21.94A8,8,0,0,0,247.39,68.94Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
    <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" />
  </svg>
);

const ExternalLinkIcon = () => (
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
    className="text-[#6DFF6D]"
  >
    <path d="M7 17l9.2-9.2M17 17V7H7" />
  </svg>
);

const socialIcons = [
  {
    name: "Instagram",
    icon: <InstagramIcon />,
    link: "https://instagram.com/allotease",
  },
  {
    name: "Twitter",
    icon: <TwitterIcon />,
    link: "https://twitter.com/allotease",
  },
  {
    name: "WhatsApp",
    icon: <WhatsAppIcon />,
    link: "https://wa.me/2348000000000",
  },
];

const navigationLinks = ["Discover", "Hosting", "Testimonials", "Pricing"];

export function AboutFooter() {
  return (
    <footer className="p-6 md:p-8 bg-[#2F4F4F] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Logo Section */}
        <div className="mb-6 flex justify-center md:justify-start">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/about/logo.png"
              alt="Allotease Logo"
              height={32}
              width={108}
              className="brightness-0 invert"
            />
          </Link>
        </div>

        {/* Navigation + Social Icons Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0 text-[#D5FFEB80] mb-6">
          <nav>
            <ul className="flex flex-wrap justify-center md:justify-start gap-4 font-medium">
              {navigationLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={`#${link.toLowerCase()}`}
                    className="cursor-pointer hover:text-[#D5FFEB] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex justify-center md:justify-end space-x-4">
            {socialIcons.map((iconObj, index) => (
              <Link
                key={index}
                href={iconObj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#6DFF6D] transition-colors p-1"
                aria-label={`Follow us on ${iconObj.name}`}
              >
                {iconObj.icon}
              </Link>
            ))}
          </div>
        </div>

        <hr className="border-[#D5FFEB40] mb-4" />

        {/* Bottom Text with SVG */}
        <div className="text-center">
          <p className="text-[18px] md:text-[20px] font-semibold bg-gradient-to-r from-[#D5FFEB] to-[#6DFF6D] text-transparent bg-clip-text flex justify-center items-center gap-2">
            Host your event with Allotease
            <ExternalLinkIcon />
          </p>
        </div>
      </div>
    </footer>
  );
}
