import { NavigationTab } from "@/types/navigation";

export const serviceTabs: NavigationTab[] = [
  {
    id: "stays",
    name: "Stays",
    href: "/stays",
  },
  {
    id: "events",
    name: "Events",
    href: "/events",
  },
  {
    id: "car-parks",
    name: "Car Parks",
    href: "/car-parks",
  },
];

// Current location data
export const currentLocation = {
  city: "Awka",
  state: "Anambra",
  country: "Nigeria",
};
