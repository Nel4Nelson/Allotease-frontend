/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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

const ExternalLinkIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
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

const CloudEffect = ({ className = "" }) => (
  <div className={`absolute -bottom-[200px] left-0 w-full z-10 ${className}`}>
    <Image
      src="/images/about/cloud-effect.svg"
      alt="Cloud Effect"
      width={1920}
      height={200}
      className="w-full h-auto object-cover object-bottom"
      priority={false}
    />
  </div>
);

export function HeroWithNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/about/hero-background.svg')" }}
        aria-hidden="true"
      />

      <div className="backdrop-blur-lg bg-white/18 min-h-screen flex flex-col">
        {/* Glass Effect Navbar */}
        <header className="relative z-20 w-full py-4">
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

          {/* Header Bottom Line */}
          <div className="container mx-auto px-6 mt-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
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

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-8">
          <div className="container mx-auto px-4 text-start">
            <div className="flex items-center h-6 mb-8">
              <Image
                src="/images/about/logo.png"
                alt="Allotease Logo"
                height={32}
                width={108}
                priority
              />
              <div
                className="h-full w-px bg-[#8AAEA433] mx-4"
                aria-hidden="true"
              />
              <p className="text-sm md:text-base mb-1 text-foreground/80">
                Nigerian's Favorite Events Manager
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white">
              <span className="bg-gradient-to-r from-[#16F476] to-[#F0FF81] bg-clip-text text-transparent">
                Simplify
              </span>{" "}
              Event Management
              <br />
              Like Never Before
            </h1>

            <div className="mt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#13C962] hover:bg-[#0ea54b] font-bold text-lg text-white px-8 py-3 rounded-full transition-colors inline-flex items-center"
                >
                  Sign Up Today
                  <ExternalLinkIcon size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Cloud Effect Image */}
        <CloudEffect />
      </div>
    </section>
  );
}