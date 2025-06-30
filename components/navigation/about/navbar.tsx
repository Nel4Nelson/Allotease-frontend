"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MenuIcon, CloseIcon } from "@/components/icons";
import { AboutDesktopNav } from "./desktop-nav";
import { AboutMobileMenu } from "./mobile-menu";

export function AboutNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="relative z-50 w-full py-3 sm:py-4">
        {/* Main Navigation Container */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-10">
            {/* Logo */}
            <Link href="/" className="flex items-center group h-full">
              <Image
                src="/images/brand-logo/about-header-logo.svg"
                alt="Allotease Logo"
                height={32}
                width={120}
                priority
                className="transition-transform group-hover:scale-105 mt-1 h-8 sm:h-10 w-auto"
              />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center h-10 w-10 ml-auto focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-opacity-50 rounded-lg glass-effect transition-all duration-300 hover:bg-white/10"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <div className="transition-transform duration-300">
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex h-full items-center">
              <AboutDesktopNav />
            </div>
          </div>
        </div>

        {/* Header Bottom Line - Extended with proper spacing */}
        <div className="w-full px-4 sm:px-6 mt-3 sm:mt-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Mobile Menu */}
        <AboutMobileMenu isOpen={menuOpen} onClose={closeMenu} />
      </header>

      {/* Background Blur Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
