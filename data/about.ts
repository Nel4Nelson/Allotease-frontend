import { AboutPageData } from "@/types/about";

export const aboutPageData: AboutPageData = {
  connectedEventsFeatures: [
    {
      content: [
        {
          title: "Discover Accommodation Nationwide",
          description:
            "Search hotels, apartments, and student lodges available across Nigeria, near campuses, city centres, and event venues.",
        },
        {
          title: "Hassle-Free Reservation",
          description:
            "Instantly book a space through our user-friendly platform with guaranteed confirmation.",
        },
      ],
      imageSrc: "/images/about/state-card.svg",
      imageAlt: "Nigeria accommodation map with state cards",
    },
    {
      content: [
        {
          title: "Personalized Recommendations",
          description:
            "Get recommendations based on your budget, preferences, and previous bookings.",
        },
        {
          title: "Local Payment Options",
          description:
            "Use your local bank card or mobile wallet like Opay or Moniepoint to secure your stay.",
        },
      ],
      imageSrc: "/images/about/booking-interface.svg",
      imageAlt: "Booking interface showing payment options",
    },
  ],

  organizeEventsFeatures: [
    {
      content: [
        {
          title: "Event Creation Made Easy",
          description:
            "Quickly set up events with essential details, ensuring a seamless planning experience.",
        },
        {
          title: "Centralized Management",
          description:
            "Oversee all aspects of your event in one place, from registration to ticketing.",
        },
      ],
      imageSrc: "/images/about/event-creation.svg",
      imageAlt: "Event creation interface dashboard",
    },
    {
      content: [
        {
          title: "Seamless Resource Allocation",
          description:
            "Easily manage and allocate spaces for attendees, parking, and other event needs.",
        },
        {
          title: "Flexible Payment Processing",
          description:
            "Accept payments with local payment methods like PayStack and Opay for maximum convenience.",
        },
      ],
      imageSrc: "/images/about/resource-allocation.svg",
      imageAlt: "Resource allocation visualization with floor plans",
    },
  ],

  testimonials: [
    {
      id: 1,
      name: "Ruby Rose",
      role: "Google Developer Lead",
      company: "Google",
      content:
        "Thanks to Allotease, managing ticket sales and seat reservations has never been easier. It's a game-changer for event organizers like me.",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
    {
      id: 2,
      name: "Esther O.",
      role: "Retreat Coordinator",
      content:
        "The platform's features for lodge management saved us so much time during our last retreat. It's so efficient and reliable.",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
    {
      id: 3,
      name: "Tolu A.",
      role: "Corporate Event Host",
      content:
        "I was blown away by how easy it was to allocate parking spots for my event guests. My attendees were impressed by the organization!",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
    {
      id: 4,
      name: "Segun F.",
      role: "Conference Host",
      content:
        "I appreciate how Allotease simplifies event hosting. From ticketing to parking, everything is handled in one place!",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
    {
      id: 5,
      name: "Amaka U.",
      role: "Wedding Planner",
      content:
        "Allotease takes the stress out of event management. My events are smoother, and my clients are happier.",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
    {
      id: 6,
      name: "Chinedu N.",
      role: "Music Concert Organizer",
      content:
        "From coordinating VIP seating to real-time updates, Allotease has been my secret weapon. It's seamless and powerful!",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
    {
      id: 7,
      name: "Laura K.",
      role: "Community Outreach Lead",
      content:
        "I love how intuitive the interface is. We used it for a charity event, and even our volunteers picked it up quickly.",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
    {
      id: 8,
      name: "James E.",
      role: "Tech Meetup Organizer",
      content:
        "Allotease handled our last three tech meetups like a charm. Registrations, seating, updates — it's all automated!",
      avatarSrc: "/images/about/testimonial/first-person.jpg",
    },
  ],

  pricingCards: [
    {
      role: "For Organizers",
      initialAmount: "$48/ Month",
      roleDetail: [
        "Event Creation",
        "Unlimited Registration",
        "Seat allocations",
        "Reservation tracking",
        "Event Branding",
        "Support Service",
      ],
      circleBg: "bg-[#16F476]",
      innerContainerBg: "bg-[#FFFFFF]",
      outerContainerBg: "bg-[#16F47680]",
    },
    {
      role: "For Attendees",
      initialAmount: "$8/ Month",
      roleDetail: [
        "Personalised events suggestions",
        "Unlimited ticketing",
        "Ticket tracking",
        "Customer Service",
      ],
      circleBg: "bg-[#FFFFFF]",
      innerContainerBg: "bg-[#81F9B5]",
      outerContainerBg: "bg-[#FFFFFF99]",
    },
  ],

  faqItems: [
    {
      title: "What is Allotease?",
      content:
        "Allotease is a platform designed to simplify event management by providing tools for managing event tickets, parking spaces, and more.",
    },
    {
      title: "Who can use Allotease?",
      content:
        "Allotease is designed for both event organizers and attendees. Organizers can create and manage events, while attendees can discover and book events that interest them.",
    },
    {
      title: "How do I create an event?",
      content:
        "Creating an event is simple! Sign up for an organizer account, click 'Create Event', fill in your event details, set up ticketing options, and publish your event for attendees to discover.",
    },
    {
      title: "How do I track ticket sales?",
      content:
        "Our dashboard provides real-time analytics on ticket sales, attendee registration, revenue tracking, and detailed reports to help you monitor your event's performance.",
    },
    {
      title: "How do I know if my ticket is confirmed?",
      content:
        "Once you complete your booking and payment, you'll receive an instant confirmation email with your ticket details. You can also check your ticket status in your account dashboard.",
    },
  ],
};
