import React from "react";
import { useRouter } from "next/navigation";
import { EventBadge } from "@/components/ui/event-badge";
import { Divider } from "@/components/ui/divider";
import { EventOrganizer } from "@/components/ui/event-organizer";


interface EventCardProps {
  id?: string;
  title: string;
  dateTime: string;
  imageUrl: string;
  badgeText: string;
  organizerName: string;
  followerCount: string;
  className?: string;
}

export function EventCard({
  id,
  title,
  dateTime,
  imageUrl,
  badgeText,
  organizerName,
  followerCount,
  className = "",
}: EventCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (id) {
      router.push(`/allocation-admin/dashboard/reservations/events/${id}`);
    }
  };

  return (
    <div
      className={`flex flex-col cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        flex: "1 0 0",
      }}
      onClick={handleCardClick}
    >
      {/* Banner Image */}
      <div
        style={{
          borderRadius: "24px",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
          backgroundColor: "lightgray",
          height: "176px",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      />

      <div>
        {/* Title */}
        <h3
          style={{
            color: "var(--Title, #1F2024)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
            letterSpacing: "-0.36px",
            alignSelf: "stretch",
            margin: 0,
          }}
        >
          {title}
        </h3>

        {/* Date and Time */}
        <p
          style={{
            color: "var(--Body, #71727A)",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "142.745%",
            letterSpacing: "-0.32px",
            alignSelf: "stretch",
            margin: 0,
          }}
        >
          {dateTime}
        </p>
      </div>

      {/* Badge */}
      <EventBadge>{badgeText}</EventBadge>

      <Divider />

      {/* Organizer Section */}
      <EventOrganizer
        organizerName={organizerName}
        followerCount={followerCount}
      />
    </div>
  );
}