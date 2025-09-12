import { AboutPageData } from "@/types/about";

export const aboutPageData: AboutPageData = {
  connectedEventsFeatures: [
    {
      content: [
        {
          title: "Discover Spaces Nationwide",
          description:
            "Search hotels, appartments, and student lodges available across Nigeria, near campuses, city centres, and event venues.",
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
        "Allotease is a smart booking and allocation platform that makes it easy to reserve accommodations, discover events, and purchase tickets — all in one place. Built to grow beyond bookings, its backend engine is designed to automate space and resource allocation across sectors like education, events, logistics, and corporate operations. Whether integrated into existing systems or used on its own, Allotease powers fair, efficient, and scalable management — from event seating to future applications like hostel balloting and parking allocation.",
    },
    {
      title: "How do I make a booking?",
      content:
        "Search for the stay or event you want, select your dates or tickets, and confirm your booking with our secure payment system.",
    },
    {
      title: "Do I need an account to book?",
      content:
        "No, but creating an account helps us save your preferences, booking history, and receipts for easy access anytime.",
    },
    {
      title: "Can I cancel or change my booking?",
      content:
        "Yes, cancellation and change policies vary by host or organizer. Check the policy on the listing before booking.",
    },
    {
      title: "Is my payment secure?",
      content:
        "Absolutely — we use trusted, encrypted payment providers to protect your transactions.",
    },
    {
      title: "What if I have an issue with my booking?",
      content:
        "You can contact the host directly via your booking dashboard or reach our support team for assistance.",
    },
    {
      title: "How do I find events or spaces near me?",
      content:
        "Use our location filters to discover listings based on your city, neighborhood, or preferred venue.",
    },
  ],
};
