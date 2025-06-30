"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white cursor-pointer"
  >
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white cursor-pointer"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
  >
    <path d="M7 17l9.2-9.2M17 17V7H7" />
  </svg>
);

export function AboutNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header 
      className={`w-full py-4 fixed top-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'glass-effect-strong' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/brand-logo/about-header-logo.svg"
            alt="Allotease Logo"
            height={32}
            width={120}
            priority
            className="transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Hamburger / Close Icon (Mobile) */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-opacity-50 rounded-lg p-2 glass-effect transition-all duration-300"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/events"
            className="text-white/90 hover:text-white font-medium text-lg transition-all duration-300 flex items-center gap-1 group relative"
          >
            <span className="relative">
              Explore Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-300 group-hover:w-full transition-all duration-300"></span>
            </span>
            <ExternalLinkIcon />
          </Link>

          <Link href="/signin">
            <Button
              variant="outline"
              className="glass-effect border-white/20 text-white hover:bg-white/10 px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:border-white/40 hover:shadow-lg hover:shadow-white/10"
            >
              Sign In
            </Button>
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass-effect-strong transition-all duration-500 ease-in-out ${
          menuOpen
            ? "opacity-100 max-h-[300px] py-6"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col items-center gap-6" role="navigation">
          <Link
            href="/events"
            className="text-white font-medium text-lg hover:text-green-300 transition-all duration-300 flex items-center gap-1 group"
            onClick={closeMenu}
          >
            Explore Resources
            <ExternalLinkIcon />
          </Link>

          <Link href="/signin" onClick={closeMenu}>
            <Button
              variant="outline"
              className="glass-effect border-white/20 text-white hover:bg-white/10 px-6 py-2.5 rounded-full font-medium transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}