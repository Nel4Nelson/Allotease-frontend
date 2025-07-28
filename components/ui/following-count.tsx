import React from "react";

interface FollowingCountProps {
  count: number;
  className?: string;
}

export function FollowingCount({ count, className = "" }: FollowingCountProps) {
  return (
    <p
      className={`font-source-sans-pro text-center ${className}`}
      style={{
        color: "#7A7A7A",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "14px",
        margin: 0,
      }}
    >
      Following {count}
    </p>
  );
}
