"use client";
import React from "react";
import { StayDescription } from "@/components/ui/stays-card-description";
import { Button } from "@/components/ui/button";

interface AdminStayCardProps {
  title: string;
  dateTime: string;
  description: string;
  imageUrl?: string;
  className?: string;
}

export function AdminStayCard({
  title,
  dateTime,
  description,
  imageUrl = "/images/stay-banner.svg",
  className = "",
}: AdminStayCardProps) {
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
          alignSelf: "stretch",
        }}
      />

      <div>
        {/* Title */}
        <h3
          title={title}
          style={{
            color: "var(--Title, #1F2024)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
            letterSpacing: "-0.36px",
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
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

      {/* Description */}
      <div style={{ width: "100%", alignSelf: "stretch" }}>
        <StayDescription description={description} />
      </div>

      {/* Manage Button */}

      <Button
        //onClick={onClick}
        variant="allotease-blur"
        size="allotease-sm"
        className={`w-full ${className}`}
        style={{
          borderRadius: "51px",
          background: "rgba(242, 244, 247, 0.60)",
          backdropFilter: "blur(21px)",
          alignSelf: "stretch",
        }}
      >
        Manage
      </Button>
    </div>
  );
}
