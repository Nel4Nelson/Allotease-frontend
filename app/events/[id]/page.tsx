"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  EventHeroImage,
  EventHeader,
  RegistrationCard,
  EventDateTime,
  EventLocation,
  EventSchedule,
  EventCategories,
  RelatedEvents,
} from "@/components/features/events";
import { useEventDetail } from "@/hooks/use-event-detail";
import { useEventRegistration } from "@/hooks/use-event-registration";
import { relatedEvents } from "@/data/sample-event-detail";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = (params.id as string) || "default";

  const { eventDetail, isLoading, error } = useEventDetail(eventId);
  const { isRegistering, registerForEvent } = useEventRegistration({
    eventId,
    registration: eventDetail?.registration || {
      isOpen: false,
      deadline: "",
      pricing: { type: "free" },
    },
  });

  const handleFollowToggle = (organizerId: string) => {
    console.log("Toggle follow for organizer:", organizerId);
    // Handle follow/unfollow logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#FF5B00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#71727A]">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !eventDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="#EF4444" viewBox="0 0 256 256">
                <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1F2024] mb-2">
              Event Not Found
            </h2>
            <p className="text-[#71727A] mb-4">
              {error || "The event you're looking for could not be found."}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-[#FF5B00] text-white rounded-lg hover:bg-[#E04E00] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="p-4 md:p-8">
          <EventHeroImage
            src={eventDetail.images.hero}
            alt={eventDetail.title}
            className="mb-8"
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Info */}
            <div className="lg:col-span-2 space-y-6">
              <EventHeader
                title={eventDetail.title}
                description={eventDetail.description}
                status={eventDetail.status}
                organizer={eventDetail.organizer}
              />
            </div>

            {/* Right Column - Registration Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <RegistrationCard
                  registration={eventDetail.registration}
                  onRegister={registerForEvent}
                  isLoading={isRegistering}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Event Details Sections */}
        <section className="px-4 md:px-8">
          <div className="max-w-4xl">
            <EventDateTime dates={eventDetail.dates} />
            <EventLocation location={eventDetail.location} />
            <EventSchedule
              schedule={eventDetail.schedule}
              title="Event Details"
            />
          </div>
        </section>

        {/* Categories and Organizer */}
        <section className="px-4 md:px-8">
          <EventCategories
            categories={eventDetail.categories}
            organizer={eventDetail.organizer}
            onFollowToggle={handleFollowToggle}
          />
        </section>

        {/* Related Events */}
        <section className="px-4 md:px-8">
          <RelatedEvents
            events={relatedEvents}
            title="Other events you may like"
            description="Get to know the peers in the room. An interactive activity to get conversations going before we head into lunch."
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
