
export interface FeatureSectionProps {
  headingPrimary: string;
  headingAccent?: string;
  bannerSrc?: string;
  bannerAlt?: string;
  features: FeatureCardProps[];
  ctaText?: string;
  ctaLink?: string;
  ctaBackgroundColor?: string;
  ctaHoverColor?: string;
  ctaTextColor?: string;
}

export interface FeatureContent {
  title: string;
  description: string;
}

export interface FeatureCardProps {
  content: FeatureContent[];
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export interface PricingCard {
  role: string;
  initialAmount: string;
  roleDetail: string[];
  circleBg: string;
  innerContainerBg: string;
  outerContainerBg: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  location?: string;
  content: string;
  avatarSrc: string;
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface AboutPageData {
  connectedEventsFeatures: FeatureCardProps[];
  organizeEventsFeatures: FeatureCardProps[];
  testimonials: Testimonial[];
  pricingCards: PricingCard[];
  faqItems: AccordionItem[];
}
