import React from "react";
import { aboutPageData } from "@/data/about";
import {
  FaqSection,
  FeatureSection,
  PricingSection,
  TestimonialSection,
} from ".";
import { HeroSection } from "@/components/hero/about/hero-section";
import { Footer } from "@/components/layout";

export function AboutPage() {
  const { connectedEventsFeatures, organizeEventsFeatures } = aboutPageData;

  return (
    <main className="relative">
      <HeroSection />

      <FeatureSection
        headingPrimary="Connected Rooms, Apartments & Lodges"
        headingAccent="Across Nigeria."
        bannerSrc="/images/about/nigeria-events-banner.svg"
        bannerAlt="Nigerian hands raised with flag and event elements"
        features={connectedEventsFeatures}
        ctaText="Explore Events around you"
        ctaLink="/events"
        ctaBackgroundColor="#FF5D04"
      />

      <FeatureSection
        headingPrimary="Organize, Allocate, and"
        headingAccent="Thrive with Ease."
        bannerSrc="/images/about/organize-banner.svg"
        bannerAlt="Event organizer with management interface"
        features={organizeEventsFeatures}
        ctaText="Create Your First Event"
        ctaLink="/events/create"
        ctaBackgroundColor="#F8AA00"
      />

      <TestimonialSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
