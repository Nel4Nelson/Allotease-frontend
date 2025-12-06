"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface ActiveStayCardProps {
  title: string;
  location: string;
  imageUrl: string;
  images?: string[];
  price: number;
  frequency: string;
  status: "active" | "expired";
  checkInDate: string;
  checkOutDate: string;
  onReview?: () => void;
  className?: string;
}

export function ActiveStayCard({
  title,
  location,
  imageUrl,
  images = [],
  price,
  frequency,
  status,
  checkInDate,
  checkOutDate,
  onReview,
}: ActiveStayCardProps) {
  const [countdown, setCountdown] = useState("");

  // Use images array if available, otherwise fallback to single imageUrl
  const displayImages = images.length > 0 ? images : [imageUrl];

  // Setup Embla Carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Calculate and update countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const checkIn = new Date(checkInDate).getTime();
      const checkOut = new Date(checkOutDate).getTime();

      // If booking is expired
      if (status === "expired" || now > checkOut) {
        const diffTime = now - checkOut;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          setCountdown("Ended today");
        } else if (diffDays === 1) {
          setCountdown("Ended yesterday");
        } else {
          setCountdown(`Ended ${diffDays} days ago`);
        }
        return;
      }

      // Before check-in
      if (now < checkIn) {
        const diffTime = checkIn - now;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffMinutes = Math.floor(
          (diffTime % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (diffDays > 0) {
          setCountdown(
            `Check-in in ${diffDays} ${diffDays === 1 ? "day" : "days"} ${diffHours} ${diffHours === 1 ? "hour" : "hours"}`
          );
        } else if (diffHours > 0) {
          setCountdown(
            `Check-in in ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`
          );
        } else {
          setCountdown(
            `Check-in in ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`
          );
        }
        return;
      }

      // Between check-in and check-out (active stay)
      if (now >= checkIn && now <= checkOut) {
        const diffTime = checkOut - now;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffMinutes = Math.floor(
          (diffTime % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (diffDays > 0) {
          setCountdown(
            `${diffDays} ${diffDays === 1 ? "day" : "days"} ${diffHours} ${diffHours === 1 ? "hour" : "hours"} remaining`
          );
        } else if (diffHours > 0) {
          setCountdown(
            `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} remaining`
          );
        } else {
          setCountdown(
            `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} remaining`
          );
        }
      }
    };

    // Initial calculation
    calculateCountdown();

    // Determine update interval based on time remaining
    const now = new Date().getTime();
    const checkIn = new Date(checkInDate).getTime();
    const checkOut = new Date(checkOutDate).getTime();
    const relevantTime = now < checkIn ? checkIn : checkOut;
    const diffTime = Math.abs(relevantTime - now);

    // Update every second if less than 1 hour remaining, otherwise every minute
    const updateInterval = diffTime < 60 * 60 * 1000 ? 1000 : 60000;

    const interval = setInterval(calculateCountdown, updateInterval);

    return () => clearInterval(interval);
  }, [checkInDate, checkOutDate, status]);

  const formatPrice = (price: number, frequency: string) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(price)} / ${frequency}`;
  };

  // Badge styling based on status
  const getBadgeStyles = () => {
    if (status === "active") {
      return {
        border: "1px solid var(--Uplift-400, #15BA6B)",
        background: "rgba(21, 186, 107, 0.11)",
        color: "#15BA6B",
      };
    }
    // expired
    return {
      border: "1px solid var(--Body, #71727A)",
      background: "rgba(113, 114, 122, 0.11)",
      color: "#71727A",
    };
  };

  const badgeStyles = getBadgeStyles();
  const badgeText = status === "active" ? "Active" : "Expired";

  return (
    <div
      className="flex items-stretch gap-4 rounded-3xl w-full"
      style={{
        minHeight: "200px",
      }}
    >
      {/* Carousel Image Section */}
      <div
        className="hidden lg:block relative"
        style={{
          width: "280px",
          minWidth: "280px",
          height: "auto",
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "lightgray",
        }}
      >
        {/* Embla Carousel Container */}
        <div ref={emblaRef} style={{ overflow: "hidden", height: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            {displayImages.map((image, index) => (
              <div
                key={index}
                style={{
                  flex: "0 0 100%",
                  minWidth: 0,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        {displayImages.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "20px",
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  border: "none",
                  background:
                    selectedIndex === index
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.4)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              padding: "4px 10px",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              color: "#FFFFFF",
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-1 py-2 gap-3">
        {/* Top Section */}
        <div className="space-y-3">
          {/* Stay Title */}
          <h3
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            {title}
          </h3>

          {/* Location */}
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            {location}
          </p>

          {/* Price Badge */}
          <div
            style={{
              display: "inline-flex",
              padding: "4px 12px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
              background: "rgba(138, 174, 164, 0.20)",
              width: "fit-content",
            }}
          >
            <span
              style={{
                color: "#1F3A3A",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "142.745%",
                letterSpacing: "-0.28px",
              }}
            >
              {formatPrice(price, frequency)}
            </span>
          </div>

          {/* Status and Countdown Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Badge */}
            <div
              style={{
                display: "inline-flex",
                padding: "6px 12px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "54px",
                ...badgeStyles,
              }}
            >
              <span
                style={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: "13px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "14px",
                }}
              >
                {badgeText}
              </span>
            </div>

            {/* Countdown Text */}
            {countdown && (
              <span
                style={{
                  color: "var(--Body, #71727A)",
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: "13px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "14px",
                }}
              >
                {countdown}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Action Button */}
        <div>
          <button
            onClick={onReview}
            style={{
              display: "inline-flex",
              padding: "10px 24px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "51px",
              border: "1px solid var(--Uplift-400, #15BA6B)",
              background: "rgba(21, 186, 107, 0.11)",
              backdropFilter: "blur(21px)",
              color: "#15BA6B",
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(21, 186, 107, 0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(21, 186, 107, 0.11)";
            }}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}