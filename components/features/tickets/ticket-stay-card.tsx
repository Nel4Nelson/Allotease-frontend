"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";

interface TicketStayCardProps {
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  frequency: string;
  statusText: string;
  onAccept?: () => void;
  onRefund?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TicketStayCard({
  title,
  location,
  imageUrl,
  price,
  frequency,
  statusText,
  onAccept,
  onRefund,
  disabled = false,
  className = "",
}: TicketStayCardProps) {
  const formatPrice = (price: number, frequency: string) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    return `${formatter.format(price)} / ${frequency}`;
  };

  return (
    <div
      className="hidden lg:flex items-stretch gap-3 rounded-3xl cursor-pointer"
      style={{ gap: "12px" }}
    >
      {/* Stay Image */}
      <div
        style={{
          display: 'flex',
          height: '176px',
          minWidth: '326px',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          borderRadius: '20px',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'lightgray'
        }}
      />

      {/* Content Section */}
      <div
        className="flex flex-col justify-between flex-1"
        style={{ height: "176px" }}
      >
        {/* Top Content */}
        {/* Stay Title */}
        <h3
          className="line-clamp-2"
          style={{
            color: "var(--Title, #1F2024)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%", // 25.2px
            letterSpacing: "-0.36px",
            margin: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </h3>

        {/* Location and Price */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <p
              style={{
                color: "var(--Body, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "142.745%", // 22.839px
                letterSpacing: "-0.32px",
                margin: 0,
              }}
            >
              {location}
            </p>
            {/* Price Badge */}
            <div
              className="flex px-2 py-0.5 justify-center items-center gap-2.5 rounded"
              style={{
                background: "rgba(138, 174, 164, 0.20)",
                width: 'fit-content',
              }}
            >
              <span
                className="font-source-sans text-sm font-semibold leading-[142.745%] tracking-[-0.28px]"
                style={{ color: "#1F3A3A" }}
              >
                {formatPrice(price, frequency)}
              </span>
            </div>
          </div>

          <Divider />

          {/* Status Badge */}
          <div
            style={{
              display: 'flex',
              padding: '6px 12px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              width: 'fit-content',
              borderRadius: '54px',
              border: '1px solid var(--Rustic, #B5651D)',
              background: '#FFF3E7',
            }}
          >
            <span
              style={{
                color: 'var(--Rustic, #B5651D)',
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '14px',
              }}
            >
              {statusText}
            </span>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-3">
          {/* Accept Button */}
          <button
            onClick={disabled ? undefined : onAccept}
            disabled={disabled}
            style={{
              display: 'flex',
              padding: '6px 12px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
              flex: '1 0 0',
              borderRadius: '51px',
              border: '1px solid var(--Uplift-400, #15BA6B)',
              background: 'rgba(21, 186, 107, 0.11)',
              backdropFilter: 'blur(21px)',
              color: '#15BA6B',
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            Accept
          </button>

          {/* Refund Button */}
          <button
            onClick={disabled ? undefined : onRefund}
            disabled={disabled}
            style={{
              display: 'flex',
              padding: '6px 12px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
              flex: '1 0 0',
              borderRadius: '51px',
              border: '1px solid #FF0004',
              backdropFilter: 'blur(21px)',
              background: 'transparent',
              color: '#FF0004',
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            Refund
          </button>
        </div>
      </div>
    </div>
  );
}