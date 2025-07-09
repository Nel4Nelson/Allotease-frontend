import { cn } from "@/lib/utils";

type ReservationStatus = "Pending" | "Confirmed" | "Cancelled";

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  className?: string;
}

const statusConfig = {
  Pending: {
    bg: "bg-[#FEEDD6]",
    text: "text-[#F07C29]",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm0,184a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,208Zm8-80V88a8,8,0,0,0-16,0v48a8,8,0,0,0,3.6,6.7l32,20a8,8,0,1,0,8.8-13.4Z" />
      </svg>
    ),
  },
  Confirmed: {
    bg: "bg-[#ECFDF3]",
    text: "text-[#0A9355]",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
      </svg>
    ),
  },
  Cancelled: {
    bg: "bg-[#FFE2E7]",
    text: "text-[#EB4244]",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M96.26,37.05A8,8,0,0,1,102,27.29a104.11,104.11,0,0,1,52,0,8,8,0,0,1-2,15.75,8.15,8.15,0,0,1-2-.26,88.09,88.09,0,0,0-44,0A8,8,0,0,1,96.26,37.05ZM53.79,55.14a104.05,104.05,0,0,0-26,45,8,8,0,0,0,15.42,4.27,88,88,0,0,1,22-38.09A8,8,0,0,0,53.79,55.14Z" />
      </svg>
    ),
  },
};

export function ReservationStatusBadge({
  status,
  className,
}: ReservationStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      {config.icon}
      {status}
    </span>
  );
}
