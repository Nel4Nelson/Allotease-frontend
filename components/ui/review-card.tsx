import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { RatingService, Review } from "@/services/rating-service";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

// Star Icon Component
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="14"
    viewBox="0 0 15 14"
    fill="none"
  >
    <path
      d="M8.07381 10.4284L10.8301 12.1784C11.1855 12.4026 11.623 12.0691 11.5191 11.6589L10.7207 8.51984C10.6991 8.43283 10.7025 8.34149 10.7306 8.25634C10.7586 8.1712 10.8102 8.09571 10.8793 8.03859L13.3512 5.97687C13.6738 5.7089 13.5098 5.16749 13.0887 5.14015L9.86209 4.93234C9.77406 4.92722 9.68942 4.89656 9.61852 4.84411C9.54762 4.79167 9.49354 4.71971 9.46288 4.63703L8.25975 1.60734C8.2279 1.51978 8.16989 1.44415 8.09357 1.39071C8.01726 1.33726 7.92635 1.30859 7.83319 1.30859C7.74002 1.30859 7.64911 1.33726 7.5728 1.39071C7.49649 1.44415 7.43847 1.51978 7.40663 1.60734L6.2035 4.63703C6.17284 4.71971 6.11875 4.79167 6.04786 4.84411C5.97696 4.89656 5.89232 4.92722 5.80428 4.93234L2.57772 5.14015C2.15663 5.16749 1.99256 5.7089 2.31522 5.97687L4.7871 8.03859C4.85618 8.09571 4.90773 8.1712 4.93579 8.25634C4.96385 8.34149 4.96728 8.43283 4.94569 8.51984L4.20741 11.4292C4.08163 11.9214 4.60663 12.3206 5.02772 12.0526L7.59256 10.4284C7.66449 10.3827 7.74796 10.3584 7.83319 10.3584C7.91842 10.3584 8.00189 10.3827 8.07381 10.4284Z"
      fill={filled ? "#15BA6B" : "#E5E7EB"}
    />
  </svg>
);

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} filled={true} />);
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative">
        <StarIcon filled={false} />
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: "50%" }}
        >
          <StarIcon filled={true} />
        </div>
      </div>
    );
  }

  // Add empty stars to make 5 total
  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<StarIcon key={`empty-${i}`} filled={false} />);
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export function ReviewCard({ review, className = "" }: ReviewCardProps) {
  const userName = RatingService.getUserDisplayName(review.userId);
  const reviewDate = RatingService.formatReviewDate(review.createdAt);

  return (
    <div
      className={`${className}`}
      style={{
        borderRadius: "12px",
        border: "1px solid rgba(138, 174, 164, 0.20)",
        display: "flex",
        padding: "16px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "8px",
        flex: "1 0 0",
      }}
    >
      {/* User Info Section */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <FallbackImage
            src={review.userId.avatar}
            fallbackSrc="/icons/encircle-star-orange-avatar.svg"
            alt={`${userName} avatar`}
            fallbackAlt={`${userName} default avatar`}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name and Date */}
        <div className="flex-1">
          <h4
            style={{
              color: "#1F2024",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            {userName}
          </h4>
          <p
            className="text-xs text-center text-gray-500 mt-1"
            style={{
              fontFamily: "var(--font-source-sans), sans-serif",
              margin: 0,
            }}
          >
            {reviewDate}
          </p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="w-full flex justify-center my-2">
        <StarRating rating={review.rating} />
      </div>

      {/* Review Comment */}
      <p
        style={{
          color: "#71727A",
          textAlign: "center",
          fontFamily: "var(--font-source-sans), sans-serif",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "142.745%",
          letterSpacing: "-0.32px",
          margin: 0,
          width: "100%",
        }}
      >
        {RatingService.truncateComment(review.comment, 120)}
      </p>
    </div>
  );
}
