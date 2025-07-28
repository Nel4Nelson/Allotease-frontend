export interface ServiceItem {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  date: {
    day: string;
    time: string;
  };
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency?: string;
  };
  provider: {
    name: string;
    followersCount: string;
    verified?: boolean;
  };
  location: {
    city: string;
    address?: string;
  };
}

export interface ServiceCardProps {
  items: ServiceItem[];
  variant?: "grid" | "list";
  showPagination?: boolean;
}

export type ServiceType = "stays" | "events" | "car-parks";
