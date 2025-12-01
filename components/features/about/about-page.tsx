"use client";
import React from "react";
import { aboutPageData } from "@/data/about";
import { FaqSection, FeatureSection, HeroSection, TestimonialSection } from ".";
import PricingSection from "./pricing-section";
import { Footer } from "./about-footer";

export function AboutPage() {
  const { connectedEventsFeatures, organizeEventsFeatures } = aboutPageData;

  return (
    <main className="relative scroll-smooth">
      <HeroSection />

      <section id="discover">
        <FeatureSection
          headingPrimary="Connected Rooms, Appartments & Lodges"
          headingAccent="Across Nigeria."
          bannerSrc="/images/about/nigeria-events-banner.svg"
          bannerAlt="Nigerian hands raised with flag and event elements"
          features={connectedEventsFeatures}
          ctaText="Explore Events around you"
          ctaLink="/?type=events"
          ctaBackgroundColor="#FF5D04"
        />
      </section>

      <section id="hosting">
        <FeatureSection
          headingPrimary="Organize, Allocate, and"
          headingAccent="Thrive with Ease."
          bannerSrc="/images/about/organize-banner.svg"
          bannerAlt="Event organizer with management interface"
          features={organizeEventsFeatures}
          ctaText="Create Your First Event"
          ctaLink="/allocation-admin/create"
          ctaBackgroundColor="#F8AA00"
        />
      </section>

      <section id="testimonials">
        <TestimonialSection />
      </section>

      <section id="pricing">
        <PricingSection />
      </section>

      <FaqSection />
      <Footer />
    </main>
  );
}
