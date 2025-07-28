"use client";
import { AboutNavbar, HeroContent } from ".";
import { CloudEffect } from "@/components/ui/cloud-effect";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/about/hero-background.svg')" }}
        aria-hidden="true"
      />

      <div className="backdrop-blur-lg bg-white/18 min-h-screen flex flex-col">
        <AboutNavbar />
        <HeroContent />
        <CloudEffect />
      </div>
    </section>
  );
}
