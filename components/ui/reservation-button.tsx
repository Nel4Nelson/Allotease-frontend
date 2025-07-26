import React from "react";
import { Button } from "@/components/ui/button";

interface ReservationButtonProps {
  onClick?: () => void;
  className?: string;
}

export function ReservationButton({ onClick, className = "" }: ReservationButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="allotease-blur"
      size="allotease-sm"
      className={`w-full ${className}`}
      style={{
        borderRadius: '51px',
        background: 'rgba(242, 244, 247, 0.60)',
        backdropFilter: 'blur(21px)',
        alignSelf: 'stretch'
      }}
    >
      Make a reservation
    </Button>
  );
}