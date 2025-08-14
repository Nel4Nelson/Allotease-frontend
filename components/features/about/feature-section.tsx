"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/icons";
import { FeatureCardProps, FeatureSectionProps } from "@/types/about";

function FeatureCard({
  content,
  imageSrc,
  imageAlt,
  className = "",
}: FeatureCardProps) {
  return (
    <article
      className={`
      bg-white 
      transition-all 
      duration-300 
      ease-out
      group
      ${className}
    `}
    >
      {/* Feature Image */}
      {imageSrc && (
        <div className="mb-6">
          <div className="relative w-full h-44 sm:h-48 lg:h-[176px] bg-[var(--card-background)] rounded-[20px] overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 ease-out">
            <Image
              src={imageSrc}
              alt={imageAlt || "Feature illustration"}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-6">
        {content.map((section, index) => (
          <section key={index} className="space-y-3">
            <h3 className="font-space-grotesk font-bold text-[var(--allotease-teal)] leading-[110%] text-lg sm:text-xl lg:text-[24px] tracking-[-0.24px] sm:tracking-[-0.32px] lg:tracking-[-0.48px]">
              {section.title}
            </h3>

            <p className="font-source-sans-pro text-[var(--body-text)] leading-[142.745%] text-sm sm:text-base lg:text-[16px] tracking-[-0.16px] sm:tracking-[-0.24px] lg:tracking-[-0.32px]">
              {section.description}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}

export function FeatureSection({
  headingPrimary,
  headingAccent,
  bannerSrc,
  bannerAlt,
  features,
  ctaText,
  ctaLink = "#",
  ctaBackgroundColor,
  ctaHoverColor,
  ctaTextColor = "white",
}: FeatureSectionProps) {
  return (
    <section className="container mx-auto py-12 sm:py-16 lg:py-20">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-0 mx-auto max-w-7xl">
        {/* Fully Responsive Heading */}
        <div className="text-center md:text-left">
          <h2 className="font-space-grotesk font-bold text-[var(--allotease-teal)] leading-[110%] text-2xl tracking-[-0.48px] sm:text-3xl sm:tracking-[-0.6px] md:text-4xl md:tracking-[-0.72px] lg:text-[42px] lg:tracking-[-0.84px] xl:text-[48px] xl:tracking-[-0.96px]">
            {headingPrimary}
            <br />
            {headingAccent && (
              <span className="text-[var(--feature-accent-orange)]">
                {headingAccent}
              </span>
            )}
          </h2>
        </div>

        {/* Responsive Banner */}
        {bannerSrc && (
          <div className="overflow-hidden mb-8 my-4 sm:my-10 bg-transparent">
            <Image
              src={bannerSrc}
              alt={bannerAlt || "Feature banner"}
              width={1024}
              height={300}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Responsive Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              content={feature.content}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
            />
          ))}
        </div>

        {/* Responsive Call to Action */}
        {ctaText && (
          <div className="text-center">
            <Link href={ctaLink}>
              <Button
                variant="allotease-primary"
                size="allotease-lg"
                rightIcon={
                  <ArrowUpRightIcon size={20} className="flex-shrink-0" />
                }
                className="hover:scale-105 active:scale-95 transform duration-200"
                style={{
                  backgroundColor: ctaBackgroundColor,
                  color: ctaTextColor,
                  ...(ctaHoverColor && {
                    "--hover-bg-color": ctaHoverColor,
                  }),
                }}
                onMouseEnter={(e) => {
                  if (ctaHoverColor) {
                    e.currentTarget.style.backgroundColor = ctaHoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (ctaBackgroundColor) {
                    e.currentTarget.style.backgroundColor = ctaBackgroundColor;
                  }
                }}
              >
                {ctaText}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}